"use client";
import React, { useEffect, useState } from "react";
import { Box, Grid, Grid2, Typography } from "@mui/material";
import {
  COUNTRIES,
  STATES,
  CITIES,
  JOB_CATEGORIES,
  JOB_LOCATIONS,
  JOB_SHIFTS,
  GET_JOB_ALERT,
  JOB_TYPES,
  SET_JOB_ALERT,
  DELETE_JOB_ALERT,
} from "@/services/apiService/apiEndPoints";
import * as yup from "yup";
import BackButtonWithTitle from "@/components/applicant/dashboard/BackButtonWithTitle";
import Container from "@/components/common/Container";
import AllowJobSearchNotificationSwitch from "@/components/applicant/settings/changeNotficationType/AllowJobSearchNotificationSwitch";
import AddJobAlertDropdown from "@/components/applicant/settings/changeNotficationType/AddJobAlertDropdown";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { Toast } from "@/components/Toast/Toast";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const Page = () => {
  const [JobAlert, setJobAlert] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [jobLocations, setJobLocations] = useState([]);
  const [jobShifts, setJobShifts] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [formikErrors, setFormikErrors] = useState({});
  console.log(formikErrors, 'fomk erro');

  const [errors, setErrors] = useState("");

  const [dropdownStates, setDropdownStates] = useState({
    selectedCountry: "",
    selectedState: [],
    selectedCity: [],
    selectedJobCategory: [],
    selectedJobLocation: [],
    selectedJobType: [],
    selectedJobShift: [],
  });

  const handleDropdownChange = (key, value) => {
    setDropdownStates((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  const validationSchema = yup.object().shape({
    selectedCountry: yup.string().required("Country is required"),
  });

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const response = await apiInstance.get(COUNTRIES);
        setCountries(response?.data?.data?.countries || []);
      } catch (error) {
        setErrors(error?.response?.data?.message || "Failed to load countries");
      }

      try {
        const response = await apiInstance.get(JOB_CATEGORIES);
        setJobCategories(response?.data?.data?.job_categories || []);
      } catch (error) {
        setErrors(
          error?.response?.data?.message || "Failed to load job categories"
        );
      }

      try {
        const response = await apiInstance.get(JOB_LOCATIONS);
        setJobLocations(response?.data?.data?.job_locations || []);
      } catch (error) {
        setErrors(
          error?.response?.data?.message || "Failed to load job locations"
        );
      }

      try {
        const response = await apiInstance.get(JOB_SHIFTS);
        setJobShifts(response?.data?.data?.job_shifts || []);
      } catch (error) {
        setErrors(
          error?.response?.data?.message || "Failed to load job shifts"
        );
      }
      try {
        const response = await apiInstance.get(JOB_TYPES);
        setJobTypes(response?.data?.data?.job_types || []);
      } catch (error) {
        setErrors(error?.response?.data?.message || "Failed to load job types");
      }
    };

    fetchMasterData();
  }, []);

  useEffect(() => {
    if (dropdownStates.selectedCountry) {
      const getStates = async () => {
        try {
          const response = await apiInstance.get(`${STATES}/${dropdownStates.selectedCountry}`);
          const _states = response?.data?.data?.states || [];
          const exist = dropdownStates.selectedState.filter((stateId) =>
            _states.some((_state) => _state.id === stateId)
          );
          if (exist?.length > 0) {
            handleDropdownChange("selectedState", exist);
          } else {
            handleDropdownChange("selectedState", []);
          }
          setStates(_states);
        } catch (error) {
          setErrors(error?.response?.data?.message || "Failed to load states");
        }
      };
      getStates();
    } else {
      handleDropdownChange("selectedState", []);
      setStates([]);
    }
  }, [dropdownStates.selectedCountry]);

  useEffect(() => {
    if (dropdownStates?.selectedState?.length > 0) {
      const getCities = async () => {
        try {
          const response = await apiInstance.get(`${CITIES}/[${dropdownStates?.selectedState}]`);
          const _cities = response?.data?.data?.cities || [];
          const exist = dropdownStates.selectedCity.filter((cityId) =>
            _cities.some((_city) => _city.id === cityId)
          );
          if (exist?.length > 0) {
            handleDropdownChange("selectedCity", exist);
          } else {
            handleDropdownChange("selectedCity", []);
          }
          setCities(_cities);
        } catch (error) {
          setErrors(error?.response?.data?.message || "Failed to load cities");
        }
      };
      getCities();
    } else {
      handleDropdownChange("selectedCity", []);
      setCities([]);
    }
  }, [dropdownStates?.selectedState]);


  const getJobAlerts = async () => {
    try {
      const response = await apiInstance.get(
        `${GET_JOB_ALERT}?limit=100&page=1`
      );
      if (response.status == 200 || response.status === 201) {
        setJobAlert(response.data.data.alerts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getJobAlerts();
  }, []);

  const createJobValidationSchema = yup.object().shape({
    selectedCountry: yup
      .string()
      .required("Country is required"),
  });
  
  const validateForm = async () => {
    try {
      await createJobValidationSchema.validate(dropdownStates, { abortEarly: false });
      setFormikErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = {};
  
      validationErrors.inner?.forEach((error) => {
        newErrors[error.path] = error.message;
      });
  
      setFormikErrors(newErrors);
      return false;
    }
  };
  
  const onJobAlert = async () => {
    if (!(await validateForm())) {
      Toast("error", "Please fix the validation errors before submitting.");
      return;
    }
  
    const payload = {
      job_categories: dropdownStates.selectedJobCategory,
      job_locations: dropdownStates.selectedJobLocation,
      job_types: dropdownStates.selectedJobType,
      job_shifts: dropdownStates.selectedJobShift,
      country: dropdownStates.selectedCountry ? Number(dropdownStates.selectedCountry) : null,
      states: dropdownStates.selectedState,
      cities: dropdownStates.selectedCity,
    };
  
    console.log(payload, "final payload");
  
    try {
      const response = await apiInstance.post(SET_JOB_ALERT, payload);
      if ([200, 201].includes(response.status)) {
        setJobAlert((prevJob) => [response.data.data.alert, ...prevJob]);
        setDropdownStates({
          selectedCountry: "",
          selectedState: [],
          selectedCity: [],
          selectedJobCategory: [],
          selectedJobLocation: [],
          selectedJobType: [],
          selectedJobShift: [],
        });
  
        Toast("success", response.data.message);
      }
    } catch (error) {
      console.error("Job Alert API Error:", error);
      Toast("error", "Something went wrong! Please try again.");
    }
  };
  



  const onDelete = async (id) => {
    try {
      const response = await apiInstance.delete(`${DELETE_JOB_ALERT}/${id}`);
      if (response.status == 200 || response.status === 201) {
        setJobAlert((prevJob) =>
          prevJob.filter((el) => el.id !== response?.data?.data?.alert?.id)
        );
        Toast("success", response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(JobAlert);

  return (
    <Container>
      <BackButtonWithTitle label="Notification" />
      <AllowJobSearchNotificationSwitch />
      <AddJobAlertDropdown
        countries={countries}
        states={states}
        cities={cities}
        jobCategories={jobCategories}
        jobLocations={jobLocations}
        jobShifts={jobShifts}
        jobTypes={jobTypes}
        dropdownStates={dropdownStates}
        handleDropdownChange={handleDropdownChange}
        onClick={onJobAlert}
        formikErrors={formikErrors}
      />
      {JobAlert?.map((el, index) => (
        <Box
          key={el.id || index}
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            boxShadow: "0px 0px 3px #00000040",
            border: "none",
            outline: "none",
            padding: "18px 20px",
            borderRadius: "10px",
            mb: 2,
            color: "#222222",
          }}
        >
          <Box>
            {el?.job_categories?.length > 0 && (
              <>
                <Typography
                  sx={{
                    color: "#00305B",
                    fontWeight: 600,
                    mb: 0.5,
                  }}
                >
                  Categories
                </Typography>
                {el.job_categories.map((item, idx) => (
                  <Typography
                    key={idx}
                    sx={{
                      color: "#222",
                      fontSize: "16px",
                      fontWeight: 300,
                      lineHeight: "18px",
                      mb: 0.5,
                    }}
                  >
                    {item?.name}
                  </Typography>
                ))}
              </>
            )}

            {el?.job_shifts?.length > 0 && (
              <>
                <Typography
                  sx={{
                    color: "#00305B",
                    fontWeight: 600,
                    mb: 0.5,
                  }}
                >
                  Shifts
                </Typography>
                <Typography
                  sx={{
                    color: "#222",
                    fontSize: "16px",
                    fontWeight: 300,
                    lineHeight: "18px",
                    mb: 0.5,
                  }}
                >
                  {el?.job_shifts.map((item) => item?.name).join(", ")}
                </Typography>
              </>
            )}
            {el?.job_types?.length > 0 && (
              <>
                <Typography
                  sx={{
                    color: "#00305B",
                    fontWeight: 600,
                    mb: 0.5,
                  }}
                >
                  Job Types
                </Typography>
                <Typography
                  sx={{
                    color: "#222",
                    fontSize: "16px",
                    fontWeight: 300,
                    lineHeight: "18px",
                    mb: 0.5,
                  }}
                >
                  {el?.job_types.map((item) => item?.name).join(", ")}
                </Typography>
              </>
            )}
            {el?.job_locations?.length > 0 && (
              <>
                <Typography
                  sx={{
                    color: "#00305B",
                    fontWeight: 600,
                    mb: 0.5,
                  }}
                >
                  Job Location
                </Typography>
                <Typography
                  sx={{
                    color: "#222",
                    fontSize: "16px",
                    fontWeight: 300,
                    lineHeight: "18px",
                    mb: 0.5,
                  }}
                >
                  {el?.job_locations.map((item) => item?.name).join(", ")}
                </Typography>
              </>
            )}

            {(el?.country || el?.states?.length > 0 || el?.cities?.length > 0) && (
              <>
                <Typography
                  sx={{
                    color: "#00305B",
                    fontWeight: 600,
                    mb: 0.5,
                  }}
                >
                  Locations
                </Typography>


                {el?.country && (
                  <Typography
                    sx={{
                      color: "#222",
                      fontSize: "16px",
                      fontWeight: 300,
                      lineHeight: "18px",
                      mb: 0.5,
                    }}
                  >
                    <strong
                      style={{
                        color: "#00305B",
                        fontWeight: 600,
                        marginBottom: "0.5rem",
                      }}
                    >
                      Country:
                    </strong>{" "}
                    {el?.country}
                  </Typography>
                )}

                {el?.states?.length > 0 && (
                  <Typography
                    sx={{
                      color: "#222",
                      fontSize: "16px",
                      fontWeight: 300,
                      lineHeight: "18px",
                      mb: 0.5,
                    }}
                  >
                    <strong
                      style={{
                        color: "#00305B",
                        fontWeight: 600,
                        marginBottom: "0.5rem",
                      }}
                    >
                      States:
                    </strong>{" "}
                    {el?.states.map((item) => item?.name).join(", ")}
                  </Typography>
                )}

                {el?.cities?.length > 0 && (
                  <Typography
                    sx={{
                      color: "#222",
                      fontSize: "16px",
                      fontWeight: 300,
                      lineHeight: "18px",
                      mb: 0.5,
                    }}
                  >
                    <strong
                      style={{
                        color: "#00305B",
                        fontWeight: 600,
                        marginBottom: "0.5rem",
                      }}
                    >
                      Cities:
                    </strong>{" "}
                    {el?.cities.map((item) => item?.name).join(", ")}
                  </Typography>
                )}
              </>
            )}


          </Box>

          <DeleteForeverIcon
            sx={{
              color: "red",
              cursor: "pointer",
            }}
            onClick={() => onDelete(el?.id)}
          />
        </Box>
      )
      )}

    </Container>
  );
};

export default Page;
