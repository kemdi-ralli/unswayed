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
import { CAREER_JOBS, EXTERNAL_JOBS, SAVE_JOB } from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { encode } from "@/helper/GeneralHelpers";
import FormTitle from "@/components/applicant/dashboard/FormTitle";
import { setAppliedData } from "@/redux/slices/applicantAppliedSpecificJob";
import { useDispatch } from "react-redux";
import { setFilters, resetFilters } from "@/redux/slices/filterPreferencesSlice";
import { getFilterPreferences, saveFilterPreferences, clearFilterPreferences } from "@/services/filterPreferencesApi";
import { countryToCurrency } from "@/constant/applicant/countryCurrency/countryCurrency";

// Map local dropdownStates keys → server filter_data keys
const toServerFilterData = (local) => {
  const d = {};
  if (local.country) d.country = local.country;
  if (Array.isArray(local.state) && local.state.length > 0) d.state = local.state;
  if (local.city) d.city = Array.isArray(local.city) ? local.city : [local.city];
  if (Array.isArray(local.job_category) && local.job_category.length > 0) d.jobCategory = local.job_category;
  if (local.job_location) d.jobLocation = local.job_location;
  if (local.job_type) d.jobType = local.job_type;
  if (local.job_shift) d.jobShift = local.job_shift;
  if (local.salary) d.minimumSalary = String(local.salary);
  if (local.salary_max) d.maximumSalary = String(local.salary_max);
  if (local.experience_level) d.experienceLevel = local.experience_level;
  if (Array.isArray(local.skills) && local.skills.length > 0) d.skills = local.skills;
  if (local.job_kind && local.job_kind !== "all") d.isRalli = local.job_kind;
  if (local.currencyLabel) d.currencyLabel = local.currencyLabel;
  return d;
};

// Map server filter_data keys → local dropdownStates keys
const fromServerFilterData = (server) => ({
  country: server.country || "",
  state: server.state || [],
  city: Array.isArray(server.city) ? (server.city[0] || "") : (server.city || ""),
  job_category: server.jobCategory || [],
  job_location: server.jobLocation || "",
  job_type: server.jobType || "",
  job_shift: server.jobShift || "",
  experience_level: server.experienceLevel || "",
  skills: server.skills || [],
  salary: server.minimumSalary || "",
  salary_max: server.maximumSalary || "",
  job_kind: server.isRalli || "all",
  currencyLabel: server.currencyLabel || "",
});

const SearchBar = lazy(() => import("@/components/applicant/dashboard/SearchBar"));
const Container = lazy(() => import("@/components/common/Container"));
const ApplicantJobDetails = lazy(() => import("@/components/applicant/dashboard/ApplicantJobDetails"));
const RalliModal = lazy(() => import("@/components/Modal/RalliModal"));

// No more RAPID API - external jobs now come from backend

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

  
  // Updated dropdownStates with salary fields and job_kind filter
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
    job_kind: "all",
    currencyLabel: "",
  });


  // Pagination state:
  const [backendPage, setBackendPage] = useState(1);
  const pageSize = 20;
  const [hasMore, setHasMore] = useState(true);

  const router = useRouter();
  const dispatch = useDispatch();
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  // ---------- fetch jobs from backend only ----------
  const fetchAndAppendJobs = async ({ reset = false, searchQuery = null } = {}) => {
    const query = searchQuery !== null ? searchQuery : search;
    let targetBackendPage = backendPage;

    if (reset) {
      targetBackendPage = 1;
      setBackendPage(1);
      setHasMore(true);
    }

    setIsLoadingJobs(true);
    setErrors(null);
    try {
      // Build params object for axios (serialized correctly by axios)
      const params = {
        limit: pageSize,
        page: targetBackendPage,
      };
      if (query != null && String(query).trim() !== "") {
        params.search = String(query).trim();
      }
      if (dropdownStates.job_kind && dropdownStates.job_kind !== "all") {
        params.job_kind = dropdownStates.job_kind;
      }
      if (dropdownStates.salary) {
        params.salary_min = dropdownStates.salary;
      }
      if (dropdownStates.salary_max) {
        params.salary_max = dropdownStates.salary_max;
      }
      if (dropdownStates.country && countries.length > 0) {
        const selectedCountry = countries.find((c) => c.id === dropdownStates.country);
        if (selectedCountry) {
          params.salary_currency = countryToCurrency[selectedCountry.name] || "USD";
        }
      }
      if (dropdownStates.country) {
        params.country = dropdownStates.country;
      }
      if (Array.isArray(dropdownStates.state) && dropdownStates.state.length > 0) {
        params.state = dropdownStates.state;
      }
      if (dropdownStates.city) {
        params.city = Array.isArray(dropdownStates.city) ? dropdownStates.city : [dropdownStates.city];
      }
      if (Array.isArray(dropdownStates.job_category) && dropdownStates.job_category.length > 0) {
        params.job_category = dropdownStates.job_category.join(",");
      }
      if (dropdownStates.job_location) {
        params.job_location = dropdownStates.job_location;
      }
      if (dropdownStates.job_type) {
        params.job_type = dropdownStates.job_type;
      }
      if (dropdownStates.job_shift) {
        params.job_shift = dropdownStates.job_shift;
      }
      if (dropdownStates.experience_level) {
        params.experience_level = dropdownStates.experience_level;
      }
      if (Array.isArray(dropdownStates.skills) && dropdownStates.skills.length > 0) {
        params.skills = dropdownStates.skills.join(",");
      }

      let backendJobs = [];
      let pagination = null;
      const includeExternal =
        !dropdownStates.job_kind || dropdownStates.job_kind === "all" || dropdownStates.job_kind === "external";

      try {
        const resp = await apiInstance.get(CAREER_JOBS, { params });
        const d = resp?.data?.data;
        backendJobs =
          (Array.isArray(d?.jobs) && d.jobs) ||
          (Array.isArray(resp?.data?.jobs) && resp.data.jobs) ||
          (Array.isArray(d) && d) ||
          [];
        pagination = d?.pagination || resp?.data?.pagination || null;
      } catch (err) {
        console.error("Backend CAREER_JOBS fetch failed:", err);
        setErrors(err?.response?.data?.message || err?.message || err);
        Toast("error", "Failed to load jobs");
      }

      if (includeExternal) {
        try {
          const extParams = { limit: pageSize, page: targetBackendPage };
          if (query != null && String(query).trim() !== "") extParams.search = String(query).trim();
          // external-jobs has optional auth; call without token so unauthenticated/expired users still see jobs
          const extResp = await apiInstance.get(EXTERNAL_JOBS, {
            params: extParams,
            skipAuth: true,
          });
          const raw = extResp?.data;
          const extList =
            (Array.isArray(raw?.data?.jobs) && raw.data.jobs) ||
            (Array.isArray(raw?.jobs) && raw.jobs) ||
            (Array.isArray(raw?.data) && raw.data) ||
            (Array.isArray(raw) && raw) ||
            [];
          const normalized = extList.map((j) => ({
            ...j,
            id: j.id ?? j.job_id,
            title: j.title ?? j.job_title,
            job_apply_link: j.apply_link ?? j.job_apply_link ?? j.job_link ?? j.application_url,
            type: "external",
            _source: "external",
            job_kind: "external",
            country: j.country ?? (typeof j.country === "string" ? j.country : null),
            job_city: j.city ?? j.job_city ?? j.location,
            is_saved: !!j.is_saved,
            is_applied: !!j.is_applied,
          }));
          const seen = new Set((backendJobs || []).map((x) => x?.id));
          for (const n of normalized) {
            const id = n?.id ?? n?.title;
            if (id && !seen.has(id)) {
              backendJobs = backendJobs || [];
              backendJobs.push(n);
              seen.add(id);
            }
          }
        } catch (err) {
          console.error("Backend EXTERNAL_JOBS fetch failed:", err);
        }
      }

      // Set jobs (reset or append)
      if (reset) {
        setJobs(backendJobs);
      } else {
        setJobs((prev) => [...prev, ...backendJobs]);
      }

      // Compute hasMore: use data.pagination when present (per spec), else fallback
      const backendHasMore = pagination != null
        ? (pagination.current_page ?? targetBackendPage) < (pagination.last_page ?? 1)
        : backendJobs.length === pageSize;
      setHasMore(backendHasMore);

      if (!reset && backendHasMore) {
        setBackendPage((p) => p + 1);
      } else if (reset && backendHasMore) {
        setBackendPage(2);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setErrors(err?.message || err);
      Toast("error", "Failed to load jobs");
    } finally {
      setIsLoadingJobs(false);
      if (reset) handleCloseModal();
    }
  };

  // ---------- initial master data + saved filter preferences ----------
  useEffect(() => {
    const init = async () => {
      // Load master data and saved preferences in parallel
      const [savedPrefs] = await Promise.allSettled([
        getFilterPreferences(),
        (async () => {
          try {
            setJobCategories(await getJobCategories());
            setJobLocations(await getJobLocations());
            setJobShifts(await getJobShifts());
            setJobTypes(await getJobTypes());
            setCountries(await getCountries());
          } catch (error) {
            console.error("Error fetching master data:", error?.response?.data || error);
            setErrors(error?.response?.data?.message || error?.message || "Failed to load data");
            Toast("error", error?.response?.data?.message || "Failed to load master data");
          }
        })(),
      ]);

      // Hydrate filters if preferences were saved
      if (savedPrefs.status === "fulfilled" && savedPrefs.value) {
        const hydrated = fromServerFilterData(savedPrefs.value);
        setDropdownStates((prev) => ({ ...prev, ...hydrated }));
        dispatch(setFilters(hydrated));
      }

    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- STATES (US + NON-US) ----------
useEffect(() => {
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
        const countryStates = await getStates(233);
        
        // Filter out territories from the main states list
        const territoryNames = [...US_INHABITED_TERRITORIES, ...US_UNINHABITED_TERRITORIES];
        const mainStates = (countryStates || []).filter(
          state => !territoryNames.includes(state.name)
        );
        
        // Add territories at the end
        const territories = [
          ...US_INHABITED_TERRITORIES,
          ...US_UNINHABITED_TERRITORIES,
        ].map((name) => ({ id: name, name }));
        
        const allStates = [...mainStates, ...territories];
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
      console.error("Error fetching states:", error?.response?.data || error);
      setErrors(error?.response?.data?.message || "Failed to load states");
      Toast("error", error?.response?.data?.message || "Failed to load states");
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


  // ---------- initial load — fire immediately on mount ----------
  useEffect(() => {
    fetchAndAppendJobs({ reset: true, searchQuery: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Apply filters (reset listing) ----------
  const applyFilters = async (e, q = null) => {
    setSearch(q === null ? search : q);
    setBackendPage(1);
    await fetchAndAppendJobs({ reset: true, searchQuery: q === null ? search : q });
    Toast("success", "Filters applied");
    // Fire-and-forget: persist to server for cross-device sync
    saveFilterPreferences(toServerFilterData(dropdownStates)).catch(() => {});
    dispatch(setFilters(dropdownStates));
  };

  const handleClearFilters = async () => {
    const cleared = {
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
      job_kind: "all",
      currencyLabel: "",
    };
    setDropdownStates(cleared);
    dispatch(resetFilters());
    setSearch("");
    setBackendPage(1);
    await fetchAndAppendJobs({ reset: true, searchQuery: "" });
    Toast("info", "Filters cleared");
    // Fire-and-forget: clear from server
    clearFilterPreferences().catch(() => {});
  };

  // ---------- Save / Apply / Card handlers ----------
  const handleJobSaved = async (id) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) {
      Toast("error", "Job not found");
      return;
    }
    
    // Check if this is an external job
    const isExternal = job?.type === "external" || job?.job_kind === "external";
    
    if (isExternal) {
      Toast("info", "Cannot save external jobs");
      return;
    }
    
    // Internal job - save normally
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
  };

  const handleEasyApply = (item) => {
    dispatch(setAppliedData(item));
    
    // Check if this is an external job
    const isExternal = item?.type === "external" || item?.job_kind === "external";
    
    if (isExternal && item?.job_apply_link) {
      // Open external job application link
      window.open(item.job_apply_link, "_blank", "noopener,noreferrer");
      return;
    }
    
    if (isExternal) {
      Toast("info", "No application link available for this external job");
      return;
    }
    
    // Internal job - use internal apply flow
    router.push(`/applicant/career-areas/easy-apply/${item?.id}`);
  };

  const handleCard = (id) => {
    const encodeId = encode(id);
    router.push(`/applicant/job/${encodeId}`);
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
            />
          </Container>
        </Suspense>
      </Box>
    </Box>
  );
};

export default Page;