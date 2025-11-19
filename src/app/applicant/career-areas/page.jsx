"use client";
import React, { useEffect, useState, lazy, Suspense } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import {
  getJobCategories,
  getJobLocations,
  getJobShifts,
  getJobTypes,
  getCountries,
  getStates,
  getCities,
} from "@/helper/MasterGetApiHelper";
import { useRouter } from "next/navigation";
import { Toast } from "@/components/Toast/Toast";
import { CAREER_JOBS, SAVE_JOB } from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { encode } from "@/helper/GeneralHelpers";
import FormTitle from "@/components/applicant/dashboard/FormTitle";
import { setAppliedData } from "@/redux/slices/applicantAppliedSpecificJob";
import { useDispatch } from "react-redux";

const SearchBar = lazy(() => import("@/components/applicant/dashboard/SearchBar"));
const Container = lazy(() => import("@/components/common/Container"));
const ApplicantJobDetails = lazy(() => import("@/components/applicant/dashboard/ApplicantJobDetails"));
const RalliModal = lazy(() => import("@/components/Modal/RalliModal"));

/**
 * fetchJSearchJobs
 * - Uses NEXT_PUBLIC_RAPIDAPI_KEY from env
 * - Builds a query from search + filters
 * - Maps to the UI shape used by ApplicantJobDetails
 * {name, salary, workhour, description}
 * Emeka Limited is requesting for a frontend job. He needs 3 years of experience. Requirements inclunde.
 */
const fetchJSearchJobs = async (search = "", filters = {}) => {
  const RAPID_API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
  if (!RAPID_API_KEY) {
    throw new Error(
      "Missing RapidAPI key. Set NEXT_PUBLIC_RAPIDAPI_KEY in your environment."
    );
  }

  const parts = [];
  if (search && search.trim()) parts.push(search.trim());

  if (filters.city) parts.push(filters.city);
  else if (Array.isArray(filters.state) && filters.state.length > 0) {
    // if state is an array of objects, try to use .name or .id
    const s = filters.state[0];
    if (typeof s === "object") parts.push(s.name || s.id || "");
    else parts.push(s);
  } else if (filters.country) {
    // country might be id or name — try string
    parts.push(typeof filters.country === "string" ? filters.country : "");
  }

  if (filters.job_category && filters.job_category.length > 0) {
    if (Array.isArray(filters.job_category)) parts.push(filters.job_category.join(" "));
    else parts.push(String(filters.job_category));
  }

  if (filters.skills && filters.skills.length > 0) {
    if (Array.isArray(filters.skills)) parts.push(filters.skills.join(" "));
    else parts.push(String(filters.skills));
  }

  const query = parts.filter(Boolean).join(" ").trim() || "Software Engineer";

  const url = new URL("https://jsearch.p.rapidapi.com/search");
  url.searchParams.append("query", query);
  url.searchParams.append("page", "1");
  url.searchParams.append("num_pages", "1");

  const headers = {
    "x-rapidapi-key": RAPID_API_KEY,
    "x-rapidapi-host": "jsearch.p.rapidapi.com",
  };

  const res = await fetch(url.toString(), { headers });

  if (!res.ok) {
    const text = await res.text().catch(() => null);
    throw new Error(`JSearch fetch failed (${res.status}): ${text || res.statusText}`);
  }

  const body = await res.json();

  const mapped = (body?.data || []).map((job) => ({
    id: job?.job_id || `${job?.job_title}_${Math.random().toString(36).slice(2, 9)}`,
    title: job?.job_title || "Untitled",
    country: job?.job_country || "N/A",
    // UI expects states: [{ name: ... }]
    states: job?.job_city ? [{ name: job.job_city }] : [],
    description: job?.job_description || job?.job_highlights || "",
    created_at: job?.job_posted_at_datetime_utc || new Date().toISOString(),
    // fallback 7 days ahead for deadline
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    is_applied: false,
    is_saved: false,
    // preserve raw response so we can use apply links, etc.
    _raw: job,
    // indicate external origin
    _source: "jsearch",
  }));

  return mapped;
};

/**
 * mergeAndDedupeJobs
 * - Combine backend (careerJobs) and external (rapidJobs)
 * - Deduplicate by title|country|city (conservative)
 * - Prefer backend job object when duplicate found
 */
const mergeAndDedupeJobs = (backendJobs = [], rapidJobs = []) => {
  const map = new Map();

  const keyFor = (j) => {
    const title = (j.title || "").toString().trim().toLowerCase();
    const country = (j.country || "").toString().trim().toLowerCase();
    const city = (Array.isArray(j.states) && j.states[0]?.name) ? j.states[0].name.toString().trim().toLowerCase() : "";
    return `${title}|${country}|${city}`;
  };

  // put backend jobs first so they win on dupes
  backendJobs.forEach((j) => {
    map.set(keyFor(j), { ...j, _source: "backend" });
  });

  rapidJobs.forEach((j) => {
    const k = keyFor(j);
    if (!map.has(k)) {
      map.set(k, j);
    }
    // if map already has backend job, keep backend version
  });

  return Array.from(map.values());
};

const Page = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [errors, setErrors] = useState(null);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [jobLocations, setJobLocations] = useState([]);
  const [jobShifts, setJobShifts] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [dropdownStates, setDropdownStates] = useState({
    country: "",
    state: [],
    city: "",
    job_category: [],
    job_location: "",
    job_type: "",
    job_shift: "",
    experience_level: "",
    skills: [],
  });

  const router = useRouter();
  const dispatch = useDispatch();

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  // ---------- Filters -> both sources ----------
  const applyFilters = async (e, q = null) => {
    setIsLoadingJobs(true);
    try {
      const query = q === null ? search : q;

      // 1) fetch backend jobs (CAREER_JOBS)
      let backendJobs = [];
      try {
        const resp = await apiInstance.get(`${CAREER_JOBS}?limit=1000&page=1&search=${encodeURIComponent(query)}`);
        backendJobs = resp?.data?.data?.jobs || [];
      } catch (err) {
        // non-fatal — continue to fetch RapidAPI results
        console.error("Backend CAREER_JOBS fetch failed:", err);
        // Store error but continue
        setErrors(err?.response?.data?.message || err?.message || err);
      }

      // 2) fetch RapidAPI jobs
      let rapidJobs = [];
      try {
        rapidJobs = await fetchJSearchJobs(query, dropdownStates);
      } catch (err) {
        console.error("RapidAPI fetch failed:", err);
        // keep errors but continue with backend results
        setErrors((prev) => prev || (err?.message || err));
        Toast("info", "RapidAPI fetch failed — showing backend jobs only");
      }

      // 3) merge & dedupe
      const combined = mergeAndDedupeJobs(backendJobs, rapidJobs);

      setJobs(combined);
      setFilteredJobs(combined);
      Toast("success", "Filters applied");
    } catch (err) {
      console.error("Error applying filters (combined):", err);
      setErrors(err?.message || err);
      Toast("error", "Failed to apply filters");
    } finally {
      setIsLoadingJobs(false);
      handleCloseModal();
    }
  };

  // ---------- Clear filters ----------
  const handleClearFilters = async () => {
    setDropdownStates({
      country: "",
      state: [],
      city: "",
      job_category: [],
      job_location: "",
      job_type: "",
      job_shift: "",
      experience_level: "",
      skills: [],
    });
    setSearch("");
    await getJobs();
    Toast("info", "Filters cleared");
  };

  // ---------- States / cities logic (preserve US special-case) ----------
  useEffect(() => {
    const US_STATES = [
      "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
      "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
      "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
      "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
      "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
      "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
      "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
      "Wisconsin", "Wyoming"
    ];

    const US_INHABITED_TERRITORIES = [
      "American Samoa", "Guam", "Northern Mariana Islands", "Puerto Rico", "U.S. Virgin Islands"
    ];

    const US_UNINHABITED_TERRITORIES = [
      "Baker Island", "Howland Island", "Jarvis Island", "Johnston Atoll",
      "Kingman Reef", "Midway Atoll", "Navassa Island", "Palmyra Atoll", "Wake Island"
    ];

    const fetchStates = async () => {
      try {
        if (dropdownStates?.country === 233) {
          const allStrings = [
            ...US_STATES.sort(),
            ...US_INHABITED_TERRITORIES.sort(),
            ...US_UNINHABITED_TERRITORIES.sort(),
          ];
          const allStatesObjects = allStrings.map((s) => ({ id: s, name: s }));
          setStates(allStatesObjects);
        } else if (dropdownStates?.country && dropdownStates?.country !== 233) {
          const countryStates = await getStates(dropdownStates.country);
          setStates(countryStates || []);
        } else {
          setStates([]);
        }
      } catch (error) {
        console.error("Error fetching states:", error);
        setErrors(error);
      } finally {
        handleDropdownChange("state", []);
      }
    };

    fetchStates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownStates?.country]);


  useEffect(() => {
    if (dropdownStates?.state && dropdownStates?.state.length > 0) {
      const fetchCities = async () => {
        try {
          const payload = Array.isArray(dropdownStates.state)
            ? `[${dropdownStates.state.map(s => typeof s === "object" ? s.id || s.name : s).join(",")}]`
            : `[${dropdownStates.state}]`;
          const fetchedCities = await getCities(payload);
          setCities(fetchedCities || []);
        } catch (err) {
          console.error("Error fetching cities:", err);
          setErrors(err);
        }
      };

      fetchCities();
    } else {
      setCities([]);
    }

    handleDropdownChange("city", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownStates?.state]);

  // ---------- initial master data ----------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setJobCategories(await getJobCategories());
        setJobLocations(await getJobLocations());
        setJobShifts(await getJobShifts());
        setJobTypes(await getJobTypes());
        setCountries(await getCountries());
      } catch (error) {
        console.error("Error fetching master data:", error);
        setErrors(error);
      }
    };
    fetchData();
  }, []);

  // ---------- fetch both sources on initial load ----------
  const getJobs = async () => {
    setIsLoadingJobs(true);
    try {
      // backend
      let backendJobs = [];
      try {
        const resp = await apiInstance.get(CAREER_JOBS);
        backendJobs = resp?.data?.data?.jobs || [];
      } catch (err) {
        console.error("Error fetching CAREER_JOBS:", err);
        setErrors(err?.response?.data?.message || err?.message || err);
      }

      // RapidAPI
      let rapidJobs = [];
      try {
        rapidJobs = await fetchJSearchJobs(search, dropdownStates);
      } catch (err) {
        console.error("JSearch fetch failed:", err);
        // don't block UI; use backend results if available
        setErrors((prev) => prev || (err?.message || err));
      }

      const combined = mergeAndDedupeJobs(backendJobs, rapidJobs);
      setJobs(combined);
      setFilteredJobs(combined);
    } catch (err) {
      console.error("Failed to load jobs (combined):", err);
      setErrors(err?.message || err);
      Toast("error", "Failed to load jobs");
    } finally {
      setIsLoadingJobs(false);
    }
  };

  useEffect(() => {
    getJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Save handler: backend vs external ----------
  const handleJobSaved = async (id) => {
    // Find job by id
    const job = jobs.find((j) => j.id === id);
    if (!job) {
      Toast("error", "Job not found");
      return;
    }

    // If backend-sourced, call SAVE_JOB endpoint (existing behavior)
    if (!job._source || job._source === "backend") {
      // optimistic toggle
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, is_saved: !j.is_saved } : j))
      );
      setFilteredJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, is_saved: !j.is_saved } : j))
      );

      try {
        const response = await apiInstance.post(`${SAVE_JOB}/${id}`);
        if (response?.data?.status !== "success") {
          throw new Error(response?.data?.message || "Failed to save job");
        }
        Toast("success", response?.data?.message || "Saved");
      } catch (error) {
        console.error("Save job error:", error);
        setErrors(error?.response?.data?.message || error?.message || "Failed to save job");
        Toast("error", error?.message || "Failed to save");
      }
      return;
    }

    // External (RapidAPI) jobs: toggle locally only and notify user
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, is_saved: !j.is_saved } : j))
    );
    setFilteredJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, is_saved: !j.is_saved } : j))
    );
    Toast("success", "Saved locally (external job)");
  };

  // ---------- Apply handler: backend vs external ----------
  const handleEasyApply = (item) => {
    dispatch(setAppliedData(item));

    // Data Scientist special-case preserved
    if (item?.title === "Data Scientist") {
      window.open("https://www.apple.com/careers/us/", "_blank");
      return;
    }

    // If backend-sourced, use internal easy-apply route
    if (!item._source || item._source === "backend") {
      router.push(`/applicant/career-areas/easy-apply/${item?.id}`);
      return;
    }

    // External job: try to open an apply link from RapidAPI raw payload
    const raw = item._raw || {};
    const possibleLinks = [
      raw.job_apply_link,
      raw.job_apply_url,
      raw.job_link,
      raw.apply_link,
      raw.url,
    ].filter(Boolean);

    if (possibleLinks.length > 0) {
      // open first valid link in a new tab
      window.open(possibleLinks[0], "_blank");
      return;
    }

    // fallback: still open a new tab to the job detail page if available
    Toast("info", "Opening external job (no direct apply link found)");
    // if job has a raw JSON page or link attempt to open one
    if (raw?.job_id) {
      // no standard external link available; show notification
      Toast("info", "No direct external apply link available for this job.");
    }
  };

  const handleCard = (id) => {
    const encodeId = encode(id);
    router.push(`/applicant/job/${encodeId}`);
  };

  const handleSearchChange = (q) => {
    setSearch(q);
    if (q.length === 0) {
      applyFilters(null, "");
    }
  };

  const handleDropdownChange = (key, value) => {
    setDropdownStates((prevState) => ({ ...prevState, [key]: value }));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ flex: 1 }}>
        <Suspense
          fallback={
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100vw",
              }}
            >
              <CircularProgress />
            </Box>
          }
        >
          <Container>
            <SearchBar onChange={handleSearchChange} value={search} onClick={applyFilters} />
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              <FormTitle label="Featured Jobs" />
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  sx={{
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    background: "#00305B",
                    color: "#FFF",
                  }}
                  onClick={handleOpenModal}
                >
                  <FilterListIcon sx={{ mr: 1 }} /> Filter
                </Button>
                <Button
                  sx={{
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#189e33ff",
                    color: "#FFF",
                  }}
                  onClick={handleClearFilters}
                >
                  <ClearIcon sx={{ mr: 1 }} /> Clear
                </Button>
              </Box>
            </Box>

            <RalliModal
              open={isModalOpen}
              onClose={handleCloseModal}
              buttonLabel="Apply Filters"
              countries={countries}
              states={states}
              cities={cities}
              dropdownStates={dropdownStates}
              handleDropdownChange={handleDropdownChange}
              jobCategories={jobCategories}
              jobLocations={jobLocations}
              jobShifts={jobShifts}
              jobTypes={jobTypes}
              onClick={applyFilters}
            />

            <ApplicantJobDetails
              data={filteredJobs}
              isLoading={isLoadingJobs}
              OnSave={handleJobSaved}
              onPressCard={handleCard}
              OnApply={handleEasyApply}
            />
          </Container>
        </Suspense>
      </Box>
    </Box>
  );
};

export default Page;
