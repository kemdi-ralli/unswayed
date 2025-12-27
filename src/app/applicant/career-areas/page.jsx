// /mnt/data/page.jsx
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
 * - now accepts a `page` param (1-indexed) and `pageSize` (num results per page)
 * - returns one page worth of mapped jobs (empty array if none)
 */


const fetchJSearchJobs = async (search = "", filters = {}, page = 1, pageSize = 10) => {
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
    const s = filters.state[0];
    if (typeof s === "object") parts.push(s.name || s.id || "");
    else parts.push(s);
  } else if (filters.country) {
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
  url.searchParams.append("page", String(page));
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
  const items = body?.data || [];

  const mapped = items.map((job) => ({
    id: job?.job_id ? `rapid-${job.job_id}` : `rapid-${Math.random().toString(36).slice(2, 9)}`,
    title: job?.job_title || "Untitled",
    country: job?.job_country || "N/A",
    states: job?.job_city ? [{ name: job.job_city }] : [],
    description: job?.job_description || job?.job_highlights || "",
    created_at: job?.job_posted_at_datetime_utc || new Date().toISOString(),
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    is_applied: false,
    is_saved: false,
    _raw: job,
    _source: "rapid",
    job_apply_link: job?.job_apply_link || job?.job_link || job?.url || "",
  }));

  return mapped;
};

/**
 * mergeAndDedupeJobs
 * - Combine backend (careerJobs) and external (rapidJobs)
 * - Deduplicate by title|country|city (conservative)
 * - Prefer backend job object when duplicate found
 */
const mergeAndDedupeJobs = (existingJobs = [], backendJobs = [], rapidJobs = []) => {
  const map = new Map();

  const keyFor = (j) => {
    const title = (j.title || "").toString().trim().toLowerCase();
    const country = (j.country || "").toString().trim().toLowerCase();
    const city = (Array.isArray(j.states) && j.states[0]?.name) ? j.states[0].name.toString().trim().toLowerCase() : "";
    return `${title}|${country}|${city}`;
  };

  existingJobs.forEach((j) => {
    map.set(keyFor(j), j);
  });

  backendJobs.forEach((j) => {
    map.set(keyFor(j), { ...j, _source: j._source || "backend" });
  });

  rapidJobs.forEach((j) => {
    const k = keyFor(j);
    if (!map.has(k)) {
      map.set(k, j);
    }
  });

  return Array.from(map.values());
};

const Page = () => {
  const [jobs, setJobs] = useState([]);
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
  const [isLoadingStates, setIsLoadingStates] = useState(false);
const [isLoadingCities, setIsLoadingCities] = useState(false);

  
  // Updated dropdownStates with salary fields
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
    salary: "",
    salary_max: "",
  });

  // Pagination state:
  const [backendPage, setBackendPage] = useState(1);
  const [rapidPage, setRapidPage] = useState(1);
  const pageSize = 10;
  const [hasMore, setHasMore] = useState(true);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  // ---------- fetch one "page" from both sources and append ----------
  const fetchAndAppendJobs = async ({ reset = false, searchQuery = null } = {}) => {
    const query = searchQuery !== null ? searchQuery : search;
    let targetBackendPage = backendPage;
    let targetRapidPage = rapidPage;

    if (reset) {
      targetBackendPage = 1;
      targetRapidPage = 1;
      setBackendPage(1);
      setRapidPage(1);
      setHasMore(true);
    }

    setIsLoadingJobs(true);
    try {
      // 1) backend page - build query params with filters including salary
      const params = new URLSearchParams({
        limit: pageSize.toString(),
        page: targetBackendPage.toString(),
        search: encodeURIComponent(query),
      });

      // Add salary filters if present
      if (dropdownStates.salary) {
        params.append("salary", dropdownStates.salary);
      }
      if (dropdownStates.salary_max) {
        params.append("salary_max", dropdownStates.salary_max);
      }

      // Add other filters as needed
      if (dropdownStates.country) {
        params.append("country", dropdownStates.country);
      }
      if (Array.isArray(dropdownStates.state) && dropdownStates.state.length > 0) {
        params.append("state", dropdownStates.state.join(","));
      }
      if (dropdownStates.city) {
        params.append("city", dropdownStates.city);
      }
      if (Array.isArray(dropdownStates.job_category) && dropdownStates.job_category.length > 0) {
        params.append("job_category", dropdownStates.job_category.join(","));
      }
      if (dropdownStates.job_location) {
        params.append("job_location", dropdownStates.job_location);
      }
      if (dropdownStates.job_type) {
        params.append("job_type", dropdownStates.job_type);
      }
      if (dropdownStates.job_shift) {
        params.append("job_shift", dropdownStates.job_shift);
      }
      if (dropdownStates.experience_level) {
        params.append("experience_level", dropdownStates.experience_level);
      }
      if (Array.isArray(dropdownStates.skills) && dropdownStates.skills.length > 0) {
        params.append("skills", dropdownStates.skills.join(","));
      }

      let backendJobs = [];
      try {
        const resp = await apiInstance.get(`${CAREER_JOBS}?${params.toString()}`);
        backendJobs = resp?.data?.data?.jobs || [];
      } catch (err) {
        console.error("Backend CAREER_JOBS fetch failed:", err);
        setErrors(err?.response?.data?.message || err?.message || err);
      }

      // 2) rapidapi page
      let rapidJobs = [];
      try {
        rapidJobs = await fetchJSearchJobs(query, dropdownStates, targetRapidPage, pageSize);
      } catch (err) {
        console.error("RapidAPI fetch failed:", err);
        setErrors((prev) => prev || (err?.message || err));
        Toast("info", "RapidAPI fetch failed – showing backend jobs only");
      }

      // 3) merge with existing jobs, dedupe
      const newCombined = mergeAndDedupeJobs(reset ? [] : jobs, backendJobs, rapidJobs);
      setJobs(newCombined);

      // 4) compute hasMore:
      const backendHasMore = backendJobs.length === pageSize;
      const rapidHasMore = rapidJobs.length === pageSize;
      setHasMore(backendHasMore || rapidHasMore);

      if (!reset) {
        if (backendHasMore) setBackendPage((p) => p + 1);
        if (rapidHasMore) setRapidPage((p) => p + 1);
      } else {
        if (backendHasMore) setBackendPage(2);
        if (rapidHasMore) setRapidPage(2);
      }

      if (reset) Toast("success", "Filters applied");
    } catch (err) {
      console.error("Error fetching/merging jobs:", err);
      setErrors(err?.message || err);
      Toast("error", "Failed to load jobs");
    } finally {
      setIsLoadingJobs(false);
      if (reset) handleCloseModal();
    }
  };

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

  // ---------- STATES (US + NON-US) ----------
useEffect(() => {
  const US_STATES = [
    "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
    "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
    "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
    "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada",
    "New Hampshire","New Jersey","New Mexico","New York","North Carolina",
    "North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island",
    "South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
    "Virginia","Washington","West Virginia","Wisconsin","Wyoming",
  ];

  const US_INHABITED_TERRITORIES = [
    "American Samoa",
    "Guam",
    "Northern Mariana Islands",
    "Puerto Rico",
    "U.S. Virgin Islands",
  ];

  const US_UNINHABITED_TERRITORIES = [
    "Baker Island","Howland Island","Jarvis Island","Johnston Atoll",
    "Kingman Reef","Midway Atoll","Navassa Island","Palmyra Atoll","Wake Island",
  ];

  

  const fetchStates = async () => {
    setIsLoadingStates(true);
    try {
      // 🇺🇸 UNITED STATES (country id = 233)
      if (dropdownStates?.country === 233) {
        const allStates = [
          ...US_STATES,
          ...US_INHABITED_TERRITORIES,
          ...US_UNINHABITED_TERRITORIES,
        ].map((name) => ({ id: name, name }));
        setStates(allStates);
        setIsLoadingStates(false);
        return;
      }

      
      if (dropdownStates?.country) {
        const countryStates = await getStates(dropdownStates.country);
        setStates(countryStates || []);
        setIsLoadingStates(false);
        return;
      }

      
      setStates([]);
    } catch (error) {
      console.error("Error fetching states:", error);
      setErrors(error);
      setStates([]);
    } finally {
      // Always reset dependent fields
      handleDropdownChange("state", []);
      handleDropdownChange("city", "");
      setCities([]);
      setIsLoadingStates(false);
setIsLoadingCities(false);

    }
  };

  fetchStates();
}, [dropdownStates?.country]);

// ---------- CITIES ----------
useEffect(() => {
  const fetchCities = async () => {
    try {
      if (
        Array.isArray(dropdownStates?.state) &&
        dropdownStates.state.length > 0
      ) {
        setIsLoadingCities(true);
        const stateNames = dropdownStates.state.map((s) =>
          typeof s === "object" ? s.name : s
        );

        const cityData = await getCities(stateNames);
        setCities(cityData || []);
        setIsLoadingCities(false);
        return;
      }

      setCities([]);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setErrors(error);
      setCities([]);
    } finally {
      handleDropdownChange("city", "");
      setIsLoadingStates(false);
setIsLoadingCities(false);

    }
  };

  fetchCities();
}, [dropdownStates?.state]);


  // ---------- initial load ----------
  useEffect(() => {
    fetchAndAppendJobs({ reset: true, searchQuery: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Apply filters (reset listing) ----------
  const applyFilters = async (e, q = null) => {
    setSearch(q === null ? search : q);
    setBackendPage(1);
    setRapidPage(1);
    await fetchAndAppendJobs({ reset: true, searchQuery: q === null ? search : q });
  };

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
      salary: "",
      salary_max: "",
    });
    setSearch("");
    setBackendPage(1);
    setRapidPage(1);
    await fetchAndAppendJobs({ reset: true, searchQuery: "" });
    Toast("info", "Filters cleared");
  };

  // ---------- Save / Apply / Card handlers ----------
  const handleJobSaved = async (id) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) {
      Toast("error", "Job not found");
      return;
    }
    if (!job._source || job._source === "backend") {
      setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, is_saved: !j.is_saved } : j)));
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
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, is_saved: !j.is_saved } : j)));
    Toast("success", "Saved locally (external job)");
  };

  const handleEasyApply = (item) => {
    dispatch(setAppliedData(item));
    if (!item._source || item._source === "backend") {
      router.push(`/applicant/career-areas/easy-apply/${item?.id}`);
      return;
    }
    const raw = item._raw || {};
    const possibleLinks = [
      raw.job_apply_link,
      raw.job_apply_url,
      raw.job_link,
      raw.apply_link,
      raw.url,
    ].filter(Boolean);
    if (possibleLinks.length > 0) {
      window.open(possibleLinks[0], "_blank");
      return;
    }
    Toast("info", "Opening external job (no direct apply link found)");
    if (raw?.job_id) {
      Toast("info", "No direct external apply link available for this job.");
    }
  };

  const handleCard = (id) => {
    if (typeof id === "string" && id.startsWith("rapid-")) {
      router.push(`/applicant/job/${id}`);
    } else {
      const encodeId = encode(id);
      router.push(`/applicant/job/${encodeId}`);
    }
  };

  // ---------- Load more (called by child) ----------
  const loadMore = async () => {
    await fetchAndAppendJobs({ reset: false, searchQuery: search });
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
              isLoadingStates={isLoadingStates}
  isLoadingCities={isLoadingCities}
            />

            <ApplicantJobDetails
              data={jobs}
              isLoading={isLoadingJobs}
              OnSave={handleJobSaved}
              onPressCard={handleCard}
              OnApply={handleEasyApply}
              onLoadMore={loadMore}
              hasMore={hasMore}
            />
          </Container>
        </Suspense>
      </Box>
    </Box>
  );
};

export default Page;