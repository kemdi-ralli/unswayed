"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
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
  USER_PROFILE,
} from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";
import dayjs from "dayjs";
import { encode } from "@/helper/GeneralHelpers";
import { Toast } from "@/components/Toast/Toast";
import { createJobValidationSchema } from "@/schemas/createJobSchema";
import { enhanceText } from "@/helper/aiEnhanceHelper";
import TremsOfUse from "@/components/common/tremsAndConditionModal/TremsOfUse";
import { getCountries as getCountriesHelper } from "@/helper/MasterGetApiHelper";
import { useSelector } from "react-redux";

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
      salary_period: "Per Month", // default
      requirements: "",
      salary_currency: "",
      company_about: "",
      company_benefits: "", // string
      description: "",
      type: "internal",
    });

  const [currencies, setCurrencies] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [jobLocations, setJobLocations] = useState([]);
  const [jobShifts, setJobShifts] = useState([]);
  const [jobShiftsTimming, setJobShiftsTimming] = useState([]);
  const [jobBenefits, setJobBenefits] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [skills, setSkills] = useState([]);
  const [errors, setErrors] = useState([]);
  const [formikErrors, setFormikErrors] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBenefits, setSelectedBenefits] = useState([]);
  const [countryCurrencyMap, setCountryCurrencyMap] = useState({});


  const [experienceLevel, setExperienceLevel] = useState([
    { name: "Entry", id: "entry" },
    { name: "Intermediate", id: "intermediate" },
    { name: "Experienced", id: "experienced" },
    { name: "Advanced", id: "advanced" },
  ]);

    // NEW: Salary period options
  const salaryPeriods = [
    { id: "Per Hour", name: "Per Hour" },
    { id: "Per Day", name: "Per Day" },
    { id: "Per Week", name: "Per Week" },
    { id: "Per Month", name: "Per Month" },
    { id: "Per Annum", name: "Per Annum" },
  ];

  // --- Helpers (benefits) ---
  const formatBenefitsString = (names = []) => {
    if (!names || names.length === 0) return "";
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} and ${names[1]}`;
    return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  };

  const normalize = (s) =>
    String(s).replace(/\s+/g, " ").trim().toLowerCase();

  const parseBenefitsStringToIds = (str, benefitsList) => {
    if (!str || typeof str !== "string" || !benefitsList?.length) return [];
    // split on commas or ' and ' (case insensitive), then trim
    const parts = str
      .split(/,| and /i)
      .map((t) => t.trim())
      .filter(Boolean);

    const mapByName = new Map(
      benefitsList.map((b) => [normalize(b.name), b.id])
    );
    const ids = [];
    parts.forEach((p) => {
      const id = mapByName.get(normalize(p));
      if (id) ids.push(id);
    });
    return ids;
  };
  // --- end helpers ---

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

  const { userData } = useSelector((state) => state.auth);
  const [userCountry, setUserCountry] = useState("");
  useEffect(() => {
    const defaultUserId = userData?.user?.id;
    const getCountry = async (id) => {
      const response = await apiInstance.get(`${COUNTRIES}/${id}`);
      return response?.data?.data?.name || null;
    };

    const getUserCountry = async (id) => {
      try {
        const response = await apiInstance.get(`${USER_PROFILE}/${id}`);
        const targetCountry = response?.data?.data?.country_id || null;

        const country = await getCountry(targetCountry);
        setUserCountry(country);
      } catch (error) {
        console.error("Error fetching country:", error);
        return null;
      }
    };
    if (defaultUserId) getUserCountry(defaultUserId);
  }, [userData]);

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

  const benefitList = [
    "Competitive salary and benefits package",
    "Flexible work arrangements",
    "Opportunities for professional growth and continuous learning",
    "A collaborative, innovative, and supportive work environment",
    "Health Insurance (Medical, Dental, Vision)",
    "Retirement Plans (401k, Pension, Employer Match)",
    "Remote Work / Hybrid Options",
    "Professional Development & Training",
    "Performance Bonuses / Profit Sharing",
    "Employee Wellness Programs (Gym, Therapy, Yoga, etc.)",
    "Free Food and Coffee at Cafeteria",
    "Parental Leave (Maternity, Paternity, Adoption)",
    "Life & Disability Insurance",
    "Commuter Benefits / Transportation Allowance",
    "Stock Options / Equity",
  ].map((benefit, index) => ({
    id: index + 1,
    name: benefit,
  }));

  useEffect(() => {
    getJobCategories();
    getJobTypes();
    getJobLocations();
    getJobShifts();
    getJobShiftTimming();
    getCountries();
    setJobBenefits(benefitList || []);
  }, []);

  // When benefits master list loads (and when editing), attempt to pre-select based on any existing string
  useEffect(() => {
    if (jobBenefits.length) {
      const existingStr =
        jobEditDetail?.company_benefits ||
        jobDetail?.company_benefits ||
        form.company_benefits;
      const ids = parseBenefitsStringToIds(existingStr, jobBenefits);
      if (ids.length) setSelectedBenefits(ids);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobBenefits]);

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
        // keep existing string if provided
        company_benefits: jobDetail?.company_benefits || "",
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
        company_benefits: jobEditDetail?.company_benefits || "", // string
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

  // 🔹 Fetch currencies from RestCountries
    // 🔹 Fetch currencies from RestCountries
useEffect(() => {
  const fetchCurrencies = async () => {
    try {
      const res = await fetch(
        "https://restcountries.com/v3.1/all?fields=currencies,name,cca2"
      );
      const data = await res.json();

      const currencyList = [];
      data.forEach((country) => {
        if (country.currencies) {
          Object.keys(country.currencies).forEach((code) => {
            if (!currencyList.find((c) => c.id === code)) {
              currencyList.push({ id: code, name: code });
            }
          });
        }
      });

      setCurrencies(currencyList);

      // 🔹 Save country → currency mapping for quick lookup
      const map = {};
      data.forEach((country) => {
        if (country.currencies) {
          const defaultCurrency = Object.keys(country.currencies)[0];
          if (defaultCurrency) {
            map[country.cca2] = defaultCurrency; // Example: US → USD
          }
        }
      });
      setCountryCurrencyMap(map);
    } catch (err) {
      console.error("Failed to fetch currencies", err);
    }
  };
  fetchCurrencies();
}, []);

// 🔹 Auto-update salary_currency when country changes
useEffect(() => {
  if (form.country && countryCurrencyMap[form.country]) {
    // Set default currency only if salary_currency is empty or just switched country
    setForm((prev) => ({
      ...prev,
      salary_currency: countryCurrencyMap[form.country],
    }));
  }
}, [form.country, countryCurrencyMap]);

    // 🔹 Set default currency when country changes
    // useEffect(() => {
    //   const setCurrencyFromCountry = async () => {
    //     if (!form.country) return;
    //     try {
    //       const res = await fetch(
    //         `https://restcountries.com/v3.1/alpha/${form.country}?fields=currencies`
    //       );
    //       const data = await res.json();
    //       if (data?.currencies) {
    //         const defaultCurrency = Object.keys(data.currencies)[0];
    //         handleChange("salary_currency", defaultCurrency);
    //       }
    //     } catch (err) {
    //       console.error("Error fetching currency by country", err);
    //     }
    //   };
    //   setCurrencyFromCountry();
    // }, [form.country]);

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
      {data?.form?.map((item) => (
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
          {item.type === "dropdown" && item.name === "salary_period" && (
                      <Box>
                        <RalliDropdown
                          names={salaryPeriods}
                          label={item.title}
                          required={item.required}
                          selectedValue={form.salary_period || "Per Month"}
                          onChange={(value) => handleChange("salary_period", value)}
                        />
                      </Box>
                    )}

          {item.type === "dropdown" && item.name === "salary_currency" && (
                      <Box>
                        <RalliDropdown
                          names={currencies}
                          label={item.title}
                          required={item.required}
                          selectedValue={form.salary_currency || ""}
                          onChange={(value) => handleChange("salary_currency", value)}
                        />
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

          {item.type === "dropdown" && item.name === "company_benefits" && (
            <Box>
              <RalliDropdown
                names={jobBenefits}
                multiple={true}
                label={item.title}
                required={item.required}
                // Use the dedicated state for the dropdown (array of IDs)
                selectedValue={selectedBenefits}
                onChange={(ids) => {
                  const safeIds = Array.isArray(ids) ? ids : [];
                  setSelectedBenefits(safeIds);
                  const selectedNames = jobBenefits
                    .filter((b) => safeIds.includes(b.id))
                    .map((b) => b.name);
                  const formatted = formatBenefitsString(selectedNames);
                  handleChange("company_benefits", formatted);
                }}
              />
              {formikErrors[item.name] && (
                <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
                  {formikErrors[item.name]}
                </Typography>
              )}
              {/* Optional: show the final string to the user */}
              {/* <Typography sx={{ mt: 1, fontSize: 12, color: "#666" }}>
                Will submit as: {form.company_benefits || "(none)"}
              </Typography> */}
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
