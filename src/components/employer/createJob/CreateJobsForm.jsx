"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Button,
} from "@mui/material";
import AssistantIcon from "@mui/icons-material/Assistant";

import RalliDropdown from "@/components/applicant/applied/RalliDropdown";
import RalliButton from "@/components/button/RalliButton";
import RalliModal from "@/components/Modal/RalliModal";
import { useRouter } from "next/navigation";
import TagInput from "@/components/input/TagInput";
import DatePickerInput from "@/components/input/DatePickerInput";
import {
  CITIES,
  COUNTRIES,
  EMPLOYER_CRUD_JOBS,
  GET_JOB_DETAIL,
  JOB_CATEGORIES,
  JOB_LOCATIONS,
  JOB_SHIFTS,
  JOB_SHIFTS_TIMMING,
  JOB_TYPES,
  STATES,
} from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";
import dayjs from "dayjs";
import { encode } from "@/helper/GeneralHelpers";
import { Toast } from "@/components/Toast/Toast";
import { createJobValidationSchema } from "@/schemas/createJobSchema";
import { enhanceText } from "@/helper/aiEnhanceHelper";
import TremsOfUse from "@/components/common/tremsAndConditionModal/TremsOfUse";

const CreateJobsForm = ({
  data,
  jobDetail = null,
  jobEditDetail,
  isEdit = false,
}) => {
  const [form, setForm] = useState({
    title: "",
    no_of_positions: "",
    deadline: null,
    job_categories: [],
    job_types: [],
    job_locations: [],
    job_shifts: [],
    job_shift_timing: "",
    country: null,
    states: [],
    cities: [],
    skills: [],
    experience_level: "",
    salary: "",
    salary_period: "",
    requirements: "",
    salary_currency: "",
    company_about: "",
    company_benefits: "",
    description: "",
    type: "internal",
  });

  const [jobCategories, setJobCategories] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [jobLocations, setJobLocations] = useState([]);
  const [jobShifts, setJobShifts] = useState([]);
  const [jobShiftsTimming, setJobShiftsTimming] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [skills, setSkills] = useState([]);
  const [errors, setErrors] = useState([]);
  const [formikErrors, setFormikErrors] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState([
    { name: "Entry", id: "entry" },
    { name: "Intermediate", id: "intermediate" },
    { name: "Experienced", id: "experienced" },
    { name: "Advanced", id: "advanced" },
  ]);

  useEffect(() => {
    handleChange("skills", skills);
  }, [skills]);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const getJobCategories = async () => {
    try {
      const response = await apiInstance.get(JOB_CATEGORIES);
      setJobCategories(response?.data?.data?.job_categories || []);
    } catch (error) {
      setErrors(
        error?.response?.data?.message || "Failed to load job categories"
      );
    }
  };

  const getJobTypes = async () => {
    try {
      const response = await apiInstance.get(JOB_TYPES);
      setJobTypes(response?.data?.data?.job_types || []);
    } catch (error) {
      setErrors(error?.response?.data?.message || "Failed to load job types");
    }
  };

  const getJobLocations = async () => {
    try {
      const response = await apiInstance.get(JOB_LOCATIONS);
      setJobLocations(response?.data?.data?.job_locations || []);
    } catch (error) {
      setErrors(
        error?.response?.data?.message || "Failed to load job locations"
      );
    }
  };

  const getJobShifts = async () => {
    try {
      const response = await apiInstance.get(JOB_SHIFTS);
      setJobShifts(response?.data?.data?.job_shifts || []);
    } catch (error) {
      setErrors(error?.response?.data?.message || "Failed to load job shifts");
    }
  };
  const getJobShiftTimming = async () => {
    try {
      const response = await apiInstance.get(JOB_SHIFTS_TIMMING);
      setJobShiftsTimming(response?.data?.data?.job_shift_timings || []);
    } catch (error) {
      setErrors(error?.response?.data?.message || "Failed to load job shifts");
    }
  };

  const getCountries = async () => {
    try {
      const response = await apiInstance.get(COUNTRIES);
      setCountries(response?.data?.data?.countries || []);
    } catch (error) {
      setErrors(error?.response?.data?.message || "Failed to load countries");
    }
  };

  useEffect(() => {
    getJobCategories();
    getJobTypes();
    getJobLocations();
    getJobShifts();
    getJobShiftTimming();
    getCountries();
  }, []);

  useEffect(() => {
    if (form?.country) {
      const getStates = async () => {
        try {
          const response = await apiInstance.get(`${STATES}/${form?.country}`);
          const _states = response?.data?.data?.states || [];
          const exist = form.states.filter((stateId) =>
            _states.some((_state) => _state.id === stateId)
          );
          if (exist?.length > 0) {
            handleChange("states", exist);
          } else {
            handleChange("states", []);
          }
          setStates(_states);
        } catch (error) {
          setErrors(error?.response?.data?.message || "Failed to load states");
        }
      };
      getStates();
    } else {
      handleChange("states", []);
      setStates([]);
    }
  }, [form?.country]);

  useEffect(() => {
    if (form?.states.length > 0) {
      const getCities = async () => {
        try {
          const response = await apiInstance.get(`${CITIES}/[${form?.states}]`);
          const _cities = response?.data?.data?.cities || [];
          const exist = form.cities.filter((cityId) =>
            _cities.some((_city) => _city.id === cityId)
          );
          if (exist?.length > 0) {
            handleChange("cities", exist);
          } else {
            handleChange("cities", []);
          }
          setCities(_cities);
        } catch (error) {
          setErrors(error?.response?.data?.message || "Failed to load cities");
        }
      };
      getCities();
    } else {
      handleChange("cities", []);
      setCities([]);
    }
  }, [form?.states]);

  useEffect(() => {
    if (jobDetail) {
      const formattedDate = dayjs(jobDetail?.deadline).format("YYYY-MM-DD");
      setForm({
        title: jobDetail?.title,
        no_of_positions: jobDetail?.no_of_positions,
        deadline: formattedDate,
        job_categories: jobDetail?.job_categories?.id,
        job_types: jobDetail?.job_types?.id,
        job_locations: jobDetail?.job_locations?.id,
        job_shifts: jobDetail?.job_shifts?.id,
        job_shift_timing: jobDetail?.job_shift_timing,
        country: jobDetail?.country?.id,
        state: jobDetail?.state?.id,
        cities: jobDetail?.cities?.id,
        experience_level: jobDetail?.experience_level,
        requirements: jobDetail?.requirements,
        description: jobDetail?.description,
        type: jobDetail?.type,
      });
      setSkills(jobDetail?.skills ?? []);
    }
  }, [jobDetail]);

  useEffect(() => {
    if (jobEditDetail) {
      const formattedDate = dayjs(jobEditDetail?.deadline).format("YYYY-MM-DD");
      setForm({
        title: jobEditDetail?.title || "",
        no_of_positions: jobEditDetail?.no_of_positions || "",
        deadline: formattedDate || null,
        job_categories:
          jobEditDetail?.job_categories?.map((item) => item?.id) || [],
        job_types: jobEditDetail?.job_types?.map((item) => item?.id) || [],
        job_locations:
          jobEditDetail?.job_locations?.map((item) => item?.id) || [],
        job_shifts: jobEditDetail?.job_shifts?.map((item) => item?.id) || [],
        job_shift_timing: jobEditDetail?.job_shift_timing?.id || "",
        country: jobEditDetail?.country?.id || null,
        states: jobEditDetail?.states?.map((item) => item?.id) || [],
        cities: jobEditDetail?.cities?.map((item) => item?.id) || [],
        experience_level: jobEditDetail?.experience_level || "",
        skills: jobEditDetail?.skills || [],
        salary: jobEditDetail?.salary || "",
        salary_period: jobEditDetail?.salary_period || "",
        requirements: jobEditDetail?.requirements || "",
        salary_currency: jobEditDetail?.salary_currency || "",
        company_about: jobEditDetail?.company_about || "",
        company_benefits: jobEditDetail?.company_benefits || "",
        description: jobEditDetail?.description || "",
        type: jobEditDetail?.type || "internal",
      });
      setSkills(jobEditDetail?.skills ?? []);
    }
  }, [jobEditDetail]);

  const router = useRouter();

  const validateForm = async () => {
    try {
      await createJobValidationSchema.validate(form, { abortEarly: false });
      if (!agreeTerms) {
        throw new Error("You must agree to the terms of use.");
      }
      setFormikErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = {};
      if (validationErrors.inner) {
        validationErrors.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
      } else {
        newErrors.terms = validationErrors.message;
      }

      setFormikErrors(newErrors);
      return false;
    }
  };
  const createJob = async () => {
    const isValid = await validateForm();
    if (!isValid) return;
    setLoading(true);
    try {
      if (jobDetail?.id) {
        const response = await apiInstance.patch(
          `${EMPLOYER_CRUD_JOBS}/${jobDetail?.id}`,
          form,
          { headers: { "Content-Type": "application/json" } }
        );
        if (response?.data?.status === "success") {
          setModalOpen(true);
          setTimeout(() => {
            var encodeId = encode(jobDetail?.id);
            router.push(`/employer/job/${encodeId}`);
          }, 2000);
        }
      } else {
        const response = await apiInstance.post(EMPLOYER_CRUD_JOBS, form, {
          headers: { "Content-Type": "application/json" },
        });
        if (response?.data?.status === "success") {
          setModalOpen(true);
          setTimeout(() => {
            router.push("/employer/my-posts");
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Error during API call:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };
  const handleEditJob = async (id) => {
    const isValid = await validateForm();
    if (!isValid) return;
    setLoading(true);
    try {
      if (jobEditDetail) {
        const response = await apiInstance.patch(
          `${EMPLOYER_CRUD_JOBS}/${id}`,
          form,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response?.data?.status === "success") {
          Toast("success", response?.data?.message);
          setTimeout(() => {
            router.push("/employer/my-posts");
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Error during API call:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    router.push("/employer/my-posts");
  };
  const handleModal = () => {
    handleCloseModal();
  };

  const handleDateChange = (newDate) => {
    if (newDate && newDate.isValid()) {
      const formattedDate = dayjs(newDate).format("YYYY-MM-DD");
      handleChange("deadline", formattedDate);
    }
  };

  const handleEnhanceAi = async (fieldName, text) => {
    try {
      const enhancedText = await enhanceText(text);
      setForm((prev) => ({
        ...prev,
        [fieldName]: enhancedText,
      }));
    } catch (error) {
      console.error(`Error enhancing ${fieldName}:`, error);
    }
  };
  return (
    <Box>
      {data?.form?.map((item, index) => (
        <React.Fragment key={item.name}>
          {item.type !== "dropdown" && (
            <Box sx={{ mb: "20px" }}>
              <Typography
                sx={{
                  fontSize: { xs: "12px", md: "14px", lg: "16px" },
                  fontWeight: 600,
                  lineHeight: "18px",
                  color: "#222222",
                  mb: "10px",
                }}
              >
                {item?.title}
                {item?.required && (
                  <span style={{ color: "red", marginLeft: 4 }}>*</span>
                )}
              </Typography>

              {(item.type === "text" || item.type === "number") && (
                <Box
                  component="input"
                  sx={{
                    width: "100%",
                    boxShadow: "0px 0px 3px 1px #00000040",
                    border: "none",
                    padding: "18px 20px",
                    borderRadius: "10px",
                    fontSize: "16px",
                    fontWeight: 300,
                    lineHeight: "18px",
                    color: "#222222",
                    "&::placeholder": {
                      color: "rgba(0, 0, 0, 0.5)",
                      fontSize: "16px",
                      fontWeight: 400,
                    },
                  }}
                  type={item.type}
                  min={1}
                  placeholder={item?.placeHolder}
                  value={form?.[item.name]}
                  onChange={(e) => handleChange(item.name, e.target.value)}
                />
              )}

              {item.type === "date" && (
                <DatePickerInput
                  label={item.placeHolder}
                  value={dayjs(form?.[item.name])}
                  onChange={handleDateChange}
                />
              )}

              {item.type === "textarea" && (
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  placeholder={item?.placeHolder}
                  value={form?.[item.name]}
                  onChange={(e) => handleChange(item.name, e.target.value)}
                  InputProps={{
                    endAdornment: item?.ai && (
                      <InputAdornment position="end">
                        <Button
                          onClick={() =>
                            handleEnhanceAi(item.name, form[item.name])
                          }
                          sx={{
                            position: "absolute",
                            bottom: 4,
                            right: 0,
                          }}
                          startIcon={<AssistantIcon />}
                        >
                          Enhance With AI
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    style: {
                      color: "#222222",
                      fontSize: "16px",
                      fontWeight: "400",
                    },
                  }}
                  sx={{
                    width: "100%",
                    borderRadius: "10px",
                    boxShadow: "0px 0px 3px 1px #00000040",
                    color: "#222222",
                    outline: "none",
                    border: "none",
                    "& .css-w4nesw-MuiInputBase-input-MuiOutlinedInput-input": {
                      border: "none !important",
                      outline: "none",
                      color: "#222222",
                    },
                    "&:hover": {
                      outline: "none",
                      border: "none",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "rgba(0, 0, 0, 0.3)",
                      opacity: 1,
                      fontSize: "14px",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        border: "none",
                      },
                    },
                  }}
                />
              )}
              {item.type === "taginput" && (
                <TagInput
                  tags={skills}
                  setTags={setSkills}
                  placeholder={item.placeHolder}
                />
              )}
              {formikErrors[item.name] && (
                <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
                  {formikErrors[item.name]}
                </Typography>
              )}
            </Box>
          )}
          {item.type === "dropdown" && item.name === "job_categories" && (
            <Box>
              <RalliDropdown
                names={jobCategories}
                label={item.title}
                required={item.required}
                multiple={true}
                selectedValue={form.job_categories || ""}
                onChange={(value) => handleChange("job_categories", value)}
              />
              {formikErrors[item.name] && (
                <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
                  {formikErrors[item.name]}
                </Typography>
              )}
            </Box>
          )}
          {item.type === "dropdown" && item.name === "job_types" && (
            <Box>
              <RalliDropdown
                names={jobTypes}
                multiple={true}
                label={item.title}
                required={item.required}
                selectedValue={form.job_types || ""}
                onChange={(value) => handleChange("job_types", value)}
              />
              {formikErrors[item.name] && (
                <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
                  {formikErrors[item.name]}
                </Typography>
              )}
            </Box>
          )}
          {item.type === "dropdown" && item.name === "job_locations" && (
            <Box>
              <RalliDropdown
                names={jobLocations}
                multiple={true}
                label={item.title}
                required={item.required}
                selectedValue={form.job_locations || ""}
                onChange={(value) => handleChange("job_locations", value)}
              />
              {formikErrors[item.name] && (
                <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
                  {formikErrors[item.name]}
                </Typography>
              )}
            </Box>
          )}
          {item.type === "dropdown" && item.name === "job_shifts" && (
            <Box>
              <RalliDropdown
                names={jobShifts}
                multiple={true}
                label={item.title}
                required={item.required}
                selectedValue={form.job_shifts || ""}
                onChange={(value) => handleChange("job_shifts", value)}
              />
              {formikErrors[item.name] && (
                <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
                  {formikErrors[item.name]}
                </Typography>
              )}
            </Box>
          )}
          {item.type === "dropdown" && item.name === "job_shift_timing" && (
            <Box>
              <RalliDropdown
                names={jobShiftsTimming}
                // multiple={true}
                label={item.title}
                required={item.required}
                selectedValue={form.job_shift_timing || ""}
                onChange={(value) => handleChange("job_shift_timing", value)}
              />
              {formikErrors[item.name] && (
                <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
                  {formikErrors[item.name]}
                </Typography>
              )}
            </Box>
          )}
          {item.type === "dropdown" && item.name === "experience_level" && (
            <Box>
              <RalliDropdown
                names={experienceLevel}
                // multiple={true}
                label={item.title}
                required={item.required}
                selectedValue={form.experience_level || ""}
                onChange={(value) => handleChange("experience_level", value)}
              />
              {formikErrors[item.name] && (
                <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
                  {formikErrors[item.name]}
                </Typography>
              )}
            </Box>
          )}
          {item.type === "dropdown" && item.name === "country" && (
            <Box>
              <RalliDropdown
                names={countries}
                label={item.title}
                required={item.required}
                selectedValue={form.country || ""}
                onChange={(value) => handleChange("country", value)}
              />
              {formikErrors[item.name] && (
                <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
                  {formikErrors[item.name]}
                </Typography>
              )}
            </Box>
          )}
          {item.type === "dropdown" && item.name === "states" && (
            <Box>
              <RalliDropdown
                names={states}
                multiple={true}
                label={item.title}
                required={item.required}
                selectedValue={form.states || ""}
                onChange={(value) => handleChange("states", value)}
              />
              {formikErrors[item.name] && (
                <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
                  {formikErrors[item.name]}
                </Typography>
              )}
            </Box>
          )}
          {item.type === "dropdown" && item.name === "cities" && (
            <Box>
              <RalliDropdown
                names={cities}
                multiple={true}
                label={item?.title}
                required={item.required}
                selectedValue={form?.cities || ""}
                onChange={(value) => handleChange("cities", value)}
              />
              {formikErrors[item.name] && (
                <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
                  {formikErrors[item.name]}
                </Typography>
              )}
            </Box>
          )}
        </React.Fragment>
      ))}
      <TremsOfUse
        error={formikErrors.terms}
        agreeTerms={agreeTerms}
        setAgreeTerms={setAgreeTerms}
      />
      <RalliModal
        onClick={handleModal}
        open={isModalOpen}
        onClose={handleCloseModal}
        para={`Thank you! Your Job has been ${
          jobDetail?.id ? "updated" : "created"
        } successfully.`}
        imageSrc={"/assets/images/confirmation.png"}
        buttonLabel="Done"
      />
      {isEdit ? (
        <Box sx={{ py: 2 }}>
          <RalliButton
            label="Update"
            onClick={() => handleEditJob(jobEditDetail?.id)}
            loading={loading}
          />
        </Box>
      ) : (
        <Box sx={{ py: 2 }}>
          <RalliButton label="Submit" onClick={createJob} loading={loading} />
        </Box>
      )}
    </Box>
  );
};

export default CreateJobsForm;
