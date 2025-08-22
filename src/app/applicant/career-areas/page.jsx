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
import { usePathname, useRouter } from "next/navigation";
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
    skills: []
  });

  const pathName = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const applyFilters = async (e, q = null) => {
    const queryParams = new URLSearchParams();

    queryParams.append("limit", 1000);
    queryParams.append("page", 1);
    queryParams.append("search", q === null ? search : q);

    Object.entries(dropdownStates).forEach(([key, value]) => {
      if (key === "job_category" && value) {
        if (Array.isArray(value)) {
          value.forEach((val) => queryParams.append("job_category[]", val));
        } else {
          queryParams.append("job_category[]", value);
        }
      } else if (key === "state" && value) {
        if (Array.isArray(value)) {
          value.forEach((val) => queryParams.append("state[]", val));
        } else {
          queryParams.append("state[]", value);
        }
      } else if (key === "skills" && value) {
        if (Array.isArray(value)) {
          value.forEach((val) => queryParams.append("skills[]", val));
        } else {
          queryParams.append("skills[]", value);
        }
      } else if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value);
      }
    });

    try {
      const response = await apiInstance.get(
        `/applicant/career-jobs?${queryParams.toString()}`
      );
      const filteredJobs = response?.data?.data?.jobs || [];
      setJobs(filteredJobs);
      setFilteredJobs(filteredJobs);
      Toast("success", "Filters applied successfully!");
    } catch (error) {
      console.error("Error Applying Filters:", error?.response || error);
      setErrors(error?.response?.data?.message || "Failed to apply filters");
      Toast("error", "Failed to apply filters");
    } finally {
      handleCloseModal();
    }
  };

  const handleDropdownChange = (key, value) => {
    setDropdownStates((prevState) => ({
      ...prevState,
      [key]: value,
    }));
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
      skills: []
    });
    setSearch("");
    const response = await apiInstance.get(
      `/applicant/career-jobs?limit=1000&page=1`
    );
    const filteredJobs = response?.data?.data?.jobs || [];
    setJobs(filteredJobs);
    setFilteredJobs(filteredJobs);
    Toast("info", "Filters cleared");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setJobCategories(await getJobCategories());
        setJobLocations(await getJobLocations());
        setJobShifts(await getJobShifts());
        setJobTypes(await getJobTypes());
        setCountries(await getCountries());
      } catch (error) {
        setErrors(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (dropdownStates?.country) {
      const fetchStates = async () => {
        try {
          setStates(await getStates(dropdownStates?.country));
        } catch (error) {
          setErrors(error);
        }
      };
      fetchStates();
    } else {
      setStates([]);
    }
    handleDropdownChange('state', []);
  }, [dropdownStates?.country]);

  useEffect(() => {
    if (dropdownStates?.state.length > 0) {
      const fetchCities = async () => {
        try {
          setCities(await getCities(`[${dropdownStates?.state}]`));
        } catch (error) {
          setErrors(error);
        }
      };
      fetchCities();
    } else {
      setCities([]);
    }
    handleDropdownChange('city', "");
  }, [dropdownStates?.state]);

  const getJobs = async () => {
    setIsLoadingJobs(true);
    try {
      const response = await apiInstance?.get(CAREER_JOBS);
      const jobs = response?.data?.data?.jobs || [];
      setJobs(jobs);
      setFilteredJobs(jobs);
    } catch (error) {
      setErrors(error?.response?.data?.message || "Failed to load jobs");
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const handleJobSaved = async (id) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === id ? { ...job, is_saved: !job.is_saved } : job
      )
    );

    setFilteredJobs((prevFiltered) =>
      prevFiltered.map((job) =>
        job.id === id ? { ...job, is_saved: !job.is_saved } : job
      )
    );

    try {
      const response = await apiInstance.post(`${SAVE_JOB}/${id}`);

      if (response?.data?.status !== "success") {
        throw new Error(response?.data?.message || "Failed to save job");
      }

      Toast("success", response?.data?.message);
    } catch (error) {
      setErrors(error?.response?.data?.message || "Failed to save job");
      Toast("error", error.message || "Failed to save");
    }
  };

  const handleEasyApply = (item) => {
    dispatch(setAppliedData(item));
    router.push(`/applicant/career-areas/easy-apply/${item?.id}`);
  };

  const handleCard = (id) => {
    var encodeId = encode(id);
    router.push(`/applicant/job/${encodeId}`);
  };

  const handleApplyFilters = () => {
    applyFilters();
  };

  const handleSearchChange = (q) => {
    setSearch(q);
    if (q.length === 0) {
      applyFilters(null, '');
    }
  };

  useEffect(() => {
    if (
      !dropdownStates.country &&
      !dropdownStates.state &&
      !dropdownStates.city
    ) {
      getJobs();
    }
  }, [dropdownStates]);

  useEffect(() => {
    getJobs();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ flex: 1 }}>
        <Suspense fallback={<Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
          }}
        >
          <CircularProgress />
        </Box>}>
          <Container>
            <SearchBar
              onChange={handleSearchChange}
              value={search}
              onClick={applyFilters}
            />
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
              onClick={handleApplyFilters}
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
