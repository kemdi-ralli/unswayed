"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import AssistantIcon from "@mui/icons-material/Assistant";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress, Modal, IconButton } from "@mui/material";

import RalliDropdown from "@/components/applicant/applied/RalliDropdown";
import RalliButton from "@/components/button/RalliButton";
import RalliModal from "@/components/Modal/RalliModal";
import { useRouter } from "next/navigation";
import TagInput from "@/components/input/TagInput";
import DatePickerInput from "@/components/input/DatePickerInput";
import {
  CITIES,
  CITIES_STATES_NAME,
  COUNTRIES,
  EMPLOYER_CRUD_JOBS,
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
import { useSelector } from "react-redux";
import { countryToCurrency } from "@/constant/applicant/countryCurrency/countryCurrency";
import { useExternalLink } from "@/hooks/useExternalLink";

// Constants for "Other" option
const OTHER_CATEGORY_ID = "other_category";
const OTHER_BENEFIT_ID = "other_benefit";

const PayTransparencyModal = ({ open, onClose }) => (
  <Modal open={open} onClose={onClose}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: "90%", sm: "600px" },
        maxHeight: "80vh",
        overflow: "auto",
        bgcolor: "background.paper",
        boxShadow: 24,
        borderRadius: "12px",
        p: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#001C63" }}>
          Pay Transparency Terms
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Typography
        variant="body1"
        sx={{ mb: 2, lineHeight: 1.8, color: "#333" }}
      >
        By posting a job opportunity on UNSWAYED, you agree to the following
        requirements:
      </Typography>

      <Box component="ul" sx={{ pl: 2, mb: 2 }}>
        <Box component="li" sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
            <strong>Salary Disclosure</strong> – Employers are required to
            provide a salary range or compensation details AND BENEFITS for all
            job postings on UNSWAYED.
          </Typography>
        </Box>

        <Box component="li" sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
            <strong>Compliance Alignment</strong> – EMPLOYERS ARE ALSO REQUIRED
            TO COMPLY WITH ALL STATE LAWS IN WHICH THEY DO BUSINESS. This
            requirement ensures adherence to applicable pay transparency laws
            where disclosure is mandated.
          </Typography>
        </Box>

        <Box component="li" sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
            <strong>Right to Decline Use</strong> – EMPLOYERS UNDERSTAND THE
            UNSWAYED PLATFORM OPERATES AS AN INDEPENDENT CONTRACTOR AND MAY
            REFUSE SERVICE. Employers who do not wish to disclose compensation
            ARE NOT AUTHORIZED TO use the UNSWAYED platform.
          </Typography>
        </Box>

        <Box component="li" sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
            <strong>Commitment to Fairness</strong> – UNSWAYED is committed to
            building trust and transparency between employers and job seekers.
            Requiring compensation information demonstrates fairness, supports
            equity, and enables informed decision-making for all parties.
          </Typography>
        </Box>
      </Box>

      <Button
        fullWidth
        variant="contained"
        onClick={onClose}
        sx={{
          mt: 2,
          backgroundColor: "#001C63",
          "&:hover": { backgroundColor: "#1565c0" },
        }}
      >
        I Understand
      </Button>
    </Box>
  </Modal>
);

const CreateJobsForm = ({
  data,
  jobDetail = null,
  jobEditDetail,
  isEdit = false,
}) => {
  // --- form default: job_apply_link default to https:// ---
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
    salary_max: "",
    salary_period: "Per Month", // default
    requirements: "",
    salary_currency: "",
    company_about: "",
    company_benefits: "", // string
    description: "",
    type: "internal",
    job_apply_link: "",
  });

  const { externalLink, setExternalLink } = useExternalLink();

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
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [showPayTransparencyModal, setShowPayTransparencyModal] =
    useState(false);

  // --- "Other" option state ---
  const [otherCategoryText, setOtherCategoryText] = useState("");
  const [otherBenefitText, setOtherBenefitText] = useState("");
  const [showOtherCategoryInput, setShowOtherCategoryInput] = useState(false);
  const [showOtherBenefitInput, setShowOtherBenefitInput] = useState(false);

  const { userData } = useSelector((state) => state.auth);
  const [userCountry, setUserCountry] = useState("");

  const [experienceLevel] = useState([
    { name: "Entry", id: "entry" },
    { name: "Intermediate", id: "intermediate" },
    { name: "Experienced", id: "experienced" },
    { name: "Advanced", id: "advanced" },
  ]);

  const [disabled, setdisabled] = useState("");

  // Salary period options
  const salaryPeriods = [
    { id: "Per Hour", name: "Per Hour" },
    { id: "Per Day", name: "Per Day" },
    { id: "Per Week", name: "Per Week" },
    { id: "Per Bi-Weekly", name: "Per Bi-Weekly" },
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

  const normalize = (s) => String(s).replace(/\s+/g, " ").trim().toLowerCase();

  const parseBenefitsStringToIds = (str, benefitsList) => {
    if (!str || typeof str !== "string" || !benefitsList?.length) return [];
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skills]);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const getJobCategories = async () => {
    try {
      const response = await apiInstance.get(JOB_CATEGORIES);
      const categories = response?.data?.data?.job_categories || [];
      // Add "Other" option at the end
      const categoriesWithOther = [
        ...categories,
        { id: OTHER_CATEGORY_ID, name: "Other" },
      ];
      setJobCategories(categoriesWithOther);
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
      // Handle multiple possible response structures
      const countries = response?.data?.data?.countries || 
                       response?.data?.countries || 
                       response?.data || 
                       [];
      setCountries(Array.isArray(countries) ? countries : []);
    } catch (error) {
      console.error("Error fetching countries:", error?.response?.data || error);
      setErrors(error?.response?.data?.message || "Failed to load countries");
      Toast("error", error?.response?.data?.message || "Failed to load countries");
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
    "Per Diem",
  ].map((benefit, index) => ({
    id: index + 1,
    name: benefit,
  }));

  // Add "Other" option to benefits list
  const benefitListWithOther = [
    ...benefitList,
    { id: OTHER_BENEFIT_ID, name: "Other" },
  ];

  useEffect(() => {
    getJobCategories();
    getJobTypes();
    getJobLocations();
    getJobShifts();
    getJobShiftTimming();
    getCountries();
    setJobBenefits(benefitListWithOther || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // --- Handle job_categories change with "Other" detection ---
  const handleJobCategoriesChange = (value) => {
    const selectedIds = Array.isArray(value) ? value : [];
    handleChange("job_categories", selectedIds);

    // Check if "Other" is selected
    const hasOther = selectedIds.includes(OTHER_CATEGORY_ID);
    setShowOtherCategoryInput(hasOther);

    // If "Other" is deselected, clear the custom text
    if (!hasOther) {
      setOtherCategoryText("");
    }
  };

  // --- Handle benefits change with "Other" detection ---
  const handleBenefitsChange = (ids) => {
    const safeIds = Array.isArray(ids) ? ids : [];
    setSelectedBenefits(safeIds);

    // Check if "Other" is selected
    const hasOther = safeIds.includes(OTHER_BENEFIT_ID);
    setShowOtherBenefitInput(hasOther);

    // If "Other" is deselected, clear the custom text
    if (!hasOther) {
      setOtherBenefitText("");
    }

    // Build benefits string (excluding "Other" placeholder)
    const selectedNames = jobBenefits
      .filter((b) => safeIds.includes(b.id) && b.id !== OTHER_BENEFIT_ID)
      .map((b) => b.name);

    // Add custom "Other" text if provided
    if (hasOther && otherBenefitText.trim()) {
      selectedNames.push(otherBenefitText.trim());
    }

    const formatted = formatBenefitsString(selectedNames);
    handleChange("company_benefits", formatted);
  };

  // --- Update benefits string when "Other" text changes ---
  useEffect(() => {
    if (showOtherBenefitInput) {
      const selectedNames = jobBenefits
        .filter(
          (b) => selectedBenefits.includes(b.id) && b.id !== OTHER_BENEFIT_ID
        )
        .map((b) => b.name);

      if (otherBenefitText.trim()) {
        selectedNames.push(otherBenefitText.trim());
      }

      const formatted = formatBenefitsString(selectedNames);
      handleChange("company_benefits", formatted);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherBenefitText]);

  // --- Dependent dropdowns: states by country ---
  useEffect(() => {
    const US_INHABITED_TERRITORIES = [
      "American Samoa",
      "Guam",
      "Northern Mariana Islands",
      "Puerto Rico",
      "U.S. Virgin Islands",
    ];

    const US_UNINHABITED_TERRITORIES = [
      "Baker Island",
      "Howland Island",
      "Jarvis Island",
      "Johnston Atoll",
      "Kingman Reef",
      "Midway Atoll",
      "Navassa Island",
      "Palmyra Atoll",
      "Wake Island",
    ];

    if (form?.country) {
      const getStates = async () => {
        setLoadingStates(true);
        try {
          const response = await apiInstance.get(`${STATES}/${form?.country}`);
          // Handle multiple possible response structures
          let _states = response?.data?.data?.states || 
                       response?.data?.states || 
                       response?.data || 
                       [];
          _states = Array.isArray(_states) ? _states : [];

          // Handle US territories for country 233
          if (form?.country === 233) {
            const territoryNames = [
              ...US_INHABITED_TERRITORIES,
              ...US_UNINHABITED_TERRITORIES,
            ];
            const mainStates = _states.filter(
              (state) => !territoryNames.includes(state.name)
            );

            const territories = [
              ...US_INHABITED_TERRITORIES,
              ...US_UNINHABITED_TERRITORIES,
            ].map((name) => ({ id: name, name }));

            _states = [...mainStates, ...territories];
          }

          setStates(_states);

          // Check if existing selected states are still valid
          const exist = form.states.filter((stateId) =>
            _states.some((_state) => _state.id === stateId)
          );

          if (exist?.length > 0) {
            handleChange("states", exist);
          } else {
            handleChange("states", []);
          }
        } catch (error) {
          setErrors(error?.response?.data?.message || "Failed to load states");
          setStates([]);
          handleChange("states", []);
        } finally {
          setLoadingStates(false);
        }
      };

      getStates();
    } else {
      handleChange("states", []);
      setStates([]);
      setLoadingStates(false);
    }
  }, [form?.country]);

  // --- Build CURRENCIES list from countryToCurrency once (unique) ---
  useEffect(() => {
    const uniqueCodes = Array.from(
      new Set(Object.values(countryToCurrency).filter(Boolean))
    ).sort();
    setCurrencies(uniqueCodes.map((code) => ({ id: code, name: code })));
  }, []);

  // ---- Helper: try many ways to resolve currency from whatever `country` value you receive ----
  const resolveCurrencyFromCountry = (countryValue) => {
    if (!countryValue) return null;

    const tryKey = (k) => {
      if (k == null) return null;
      const ks = String(k);
      if (countryToCurrency[ks]) return countryToCurrency[ks];
      if (countryToCurrency[ks.toUpperCase()])
        return countryToCurrency[ks.toUpperCase()];
      if (countryToCurrency[ks.toLowerCase()])
        return countryToCurrency[ks.toLowerCase()];
      return null;
    };

    // 1. Try using the raw value
    let found = tryKey(countryValue);
    if (found) return found;

    // 2. Maybe it's an ID; look up the name in countries[]
    const matched = countries.find(
      (c) => c.id === countryValue || String(c.id) === String(countryValue)
    );
    if (matched) {
      found = tryKey(matched.name);
      if (found) return found;
      found = tryKey(matched.iso2);
      if (found) return found;
    }

    return null;
  };

  // --- When country changes, auto-set salary_currency ---
  useEffect(() => {
    if (form.country) {
      const currency = resolveCurrencyFromCountry(form.country);
      if (currency) {
        handleChange("salary_currency", currency);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.country, countries]);

  // --- Dependent dropdowns: cities by states ---
  useEffect(() => {
    if (form?.states?.length > 0) {
      const getCities = async () => {
        setLoadingCities(true);
        try {
          const US_INHABITED_TERRITORIES = [
            "American Samoa",
            "Guam",
            "Northern Mariana Islands",
            "Puerto Rico",
            "U.S. Virgin Islands",
          ];
          
          const allCities = [];
          for (const stateId of form.states) {
            // Check if this is a US inhabited territory (string name)
            const isTerritory = typeof stateId === 'string' && US_INHABITED_TERRITORIES.includes(stateId);
            
            const response = isTerritory
              ? await apiInstance.get(`${CITIES_STATES_NAME}/${stateId}`)
              : await apiInstance.get(`${CITIES}/${stateId}`);
              
            const _cities = response?.data?.data?.cities || [];
            allCities.push(..._cities);
          }
          setCities(allCities);
          const exist = form.cities.filter((cityId) =>
            allCities.some((c) => c.id === cityId)
          );
          if (exist?.length > 0) {
            handleChange("cities", exist);
          } else {
            handleChange("cities", []);
          }
        } catch (error) {
          setErrors(error?.response?.data?.message || "Failed to load cities");
          setCities([]);
          handleChange("cities", []);
        } finally {
          setLoadingCities(false);
        }
      };
      getCities();
    } else {
      handleChange("cities", []);
      setCities([]);
      setLoadingCities(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.states]);

  // Auto-prefill if user profile has a country
  useEffect(() => {
    const profileCountry = userData?.user?.employer?.country;
    if (profileCountry) {
      setUserCountry(profileCountry);
    }
  }, [userData]);

  const handleCountryChange = (value) => {
    handleChange("country", value);
  };

  const router = useRouter();

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleModal = () => {
    setModalOpen(false);
    router.push(`/employer/my-posts`);
  };

  // --- Validation / Submit: filter out "Other" placeholder IDs before sending to backend ---
  const prepareFormDataForSubmit = () => {
    const formData = { ...form };

    // Filter out "Other" placeholder from job_categories, add custom text if exists
    let finalCategories = formData.job_categories.filter(
      (id) => id !== OTHER_CATEGORY_ID
    );
    // Note: If you want to send the custom category text to backend,
    // you'd need a separate field or handle it differently on backend

    formData.job_categories = finalCategories;

    // Benefits string already contains the custom "Other" text (handled in handleBenefitsChange)
    // Just ensure we don't have issues

    return formData;
  };

  // Create job
  const createJob = async () => {
    try {
      await createJobValidationSchema.validate(form, { abortEarly: false });
      setFormikErrors({});
    } catch (validationError) {
      const errors = {};
      validationError.inner?.forEach((error) => {
        errors[error.path] = error.message;
      });
      setFormikErrors(errors);
      Toast("error", "Please fix the errors in the form");
      return;
    }

    if (!agreeTerms) {
      setFormikErrors((prev) => ({
        ...prev,
        terms: "You must agree to the terms and conditions",
      }));
      Toast("error", "Please agree to the terms and conditions");
      return;
    }

    setLoading(true);
    try {
      const preparedForm = prepareFormDataForSubmit();

      // Add custom category text to description or a separate field if needed
      let finalDescription = preparedForm.description;
      if (otherCategoryText.trim()) {
        finalDescription += `\n\nAdditional Category: ${otherCategoryText.trim()}`;
      }

      const response = await apiInstance.post(EMPLOYER_CRUD_JOBS, {
        ...preparedForm,
        description: finalDescription,
        deadline: preparedForm.deadline
          ? dayjs(preparedForm.deadline).format("YYYY-MM-DD")
          : null,
      });

      if (response?.data?.status === "success") {
        setModalOpen(true);
        Toast("success", response?.data?.message || "Job created successfully");
      } else {
        Toast("error", response?.data?.message || "Failed to create job");
      }
    } catch (error) {
      console.error("Create job error:", error);
      Toast(
        "error",
        error?.response?.data?.message || "An error occurred while creating job"
      );
    } finally {
      setLoading(false);
    }
  };

  // Edit job
  const handleEditJob = async (id) => {
    try {
      await createJobValidationSchema.validate(form, { abortEarly: false });
      setFormikErrors({});
    } catch (validationError) {
      const errors = {};
      validationError.inner?.forEach((error) => {
        errors[error.path] = error.message;
      });
      setFormikErrors(errors);
      Toast("error", "Please fix the errors in the form");
      return;
    }

    if (!agreeTerms) {
      setFormikErrors((prev) => ({
        ...prev,
        terms: "You must agree to the terms and conditions",
      }));
      Toast("error", "Please agree to the terms and conditions");
      return;
    }

    setLoading(true);
    try {
      const preparedForm = prepareFormDataForSubmit();

      let finalDescription = preparedForm.description;
      if (otherCategoryText.trim()) {
        finalDescription += `\n\nAdditional Category: ${otherCategoryText.trim()}`;
      }

      const response = await apiInstance.put(`${EMPLOYER_CRUD_JOBS}/${id}`, {
        ...preparedForm,
        description: finalDescription,
        deadline: preparedForm.deadline
          ? dayjs(preparedForm.deadline).format("YYYY-MM-DD")
          : null,
      });

      if (response?.data?.status === "success") {
        setModalOpen(true);
        Toast("success", response?.data?.message || "Job updated successfully");
      } else {
        Toast("error", response?.data?.message || "Failed to update job");
      }
    } catch (error) {
      console.error("Edit job error:", error);
      Toast(
        "error",
        error?.response?.data?.message || "An error occurred while updating job"
      );
    } finally {
      setLoading(false);
    }
  };

  // Populate form when editing
  useEffect(() => {
    if (jobEditDetail) {
      setForm({
        title: jobEditDetail?.title || "",
        no_of_positions: jobEditDetail?.no_of_positions || "",
        deadline: jobEditDetail?.deadline
          ? dayjs(jobEditDetail.deadline)
          : null,
        job_categories: jobEditDetail?.job_categories?.map((c) => c.id) || [],
        job_types: jobEditDetail?.job_types?.map((t) => t.id) || [],
        job_locations: jobEditDetail?.job_locations?.map((l) => l.id) || [],
        job_shifts: jobEditDetail?.job_shifts?.map((s) => s.id) || [],
        job_shift_timing: jobEditDetail?.job_shift_timing?.id || "",
        country: jobEditDetail?.country?.id || null,
        states: jobEditDetail?.states?.map((s) => s.id) || [],
        cities: jobEditDetail?.cities?.map((c) => c.id) || [],
        skills: jobEditDetail?.skills || [],
        experience_level: jobEditDetail?.experience_level || "",
        salary: jobEditDetail?.salary || "",
        salary_max: jobEditDetail?.salary_max || "",
        salary_period: jobEditDetail?.salary_period || "Per Month",
        salary_currency: jobEditDetail?.salary_currency || "",
        requirements: jobEditDetail?.requirements || "",
        company_about: jobEditDetail?.company_about || "",
        company_benefits: jobEditDetail?.company_benefits || "",
        description: jobEditDetail?.description || "",
        type: jobEditDetail?.type || "internal",
        job_apply_link: jobEditDetail?.job_apply_link || "",
      });
      setSkills(jobEditDetail?.skills || []);
      if (jobEditDetail?.type === "external") {
        setExternalLink(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobEditDetail]);

  // AI Enhancement
  const [enhancingFields, setEnhancingFields] = useState({});

  const handleEnhance = async (fieldName) => {
    const currentValue = form[fieldName];
    if (!currentValue || currentValue.trim() === "") {
      Toast("warning", "Please enter some text to enhance");
      return;
    }

    setEnhancingFields((prev) => ({ ...prev, [fieldName]: true }));

    try {
      const enhanced = await enhanceText(currentValue, fieldName);
      if (enhanced) {
        handleChange(fieldName, enhanced);
        Toast("success", "Text enhanced successfully!");
      }
    } catch (error) {
      console.error("Enhancement error:", error);
      Toast("error", "Failed to enhance text. Please try again.");
    } finally {
      setEnhancingFields((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  return (
    <Box>
      {Array.isArray(data) && data.map((item, index) => (
        <React.Fragment key={index}>
          {/* Text inputs */}
          {(item.type === "text" || item.type === "url") && item.name === "title" && (
            <Box sx={{ py: 1 }}>
              <TextField
                label={item.title}
                required={item.required}
                variant="outlined"
                fullWidth
                value={form.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                error={!!formikErrors[item.name]}
                helperText={formikErrors[item.name]}
              />
            </Box>
          )}

          {(item.type === "text" || item.type === "number") && item.name === "no_of_positions" && (
            <Box sx={{ py: 1 }}>
              <TextField
                label={item.title}
                required={item.required}
                variant="outlined"
                fullWidth
                type="number"
                value={form.no_of_positions || ""}
                onChange={(e) => handleChange("no_of_positions", e.target.value)}
                error={!!formikErrors[item.name]}
                helperText={formikErrors[item.name]}
              />
            </Box>
          )}

          {(item.type === "text" || item.type === "number") && item.name === "salary" && (
            <Box sx={{ py: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1,
                }}
              >
                <Typography variant="body2" sx={{ color: "#666" }}>
                  UNSWAYED requires all employers to provide salary and benefits
                  information for job listings as part of our commitment to pay
                  transparency.
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setShowPayTransparencyModal(true)}
                  sx={{ color: "#001C63" }}
                >
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Box>
              <TextField
                label={item.title}
                required={item.required}
                variant="outlined"
                fullWidth
                type="number"
                value={form.salary || ""}
                onChange={(e) => handleChange("salary", e.target.value)}
                error={!!formikErrors[item.name]}
                helperText={formikErrors[item.name]}
                InputProps={{
                  startAdornment: form.salary_currency ? (
                    <InputAdornment position="start">
                      {form.salary_currency}
                    </InputAdornment>
                  ) : null,
                }}
              />
            </Box>
          )}

          {(item.type === "text" || item.type === "number") && item.name === "salary_max" && (
            <Box sx={{ py: 1 }}>
              <TextField
                label={item.title}
                required={item.required}
                variant="outlined"
                fullWidth
                type="number"
                value={form.salary_max || ""}
                onChange={(e) => handleChange("salary_max", e.target.value)}
                error={!!formikErrors[item.name]}
                helperText={formikErrors[item.name]}
                InputProps={{
                  startAdornment: form.salary_currency ? (
                    <InputAdornment position="start">
                      {form.salary_currency}
                    </InputAdornment>
                  ) : null,
                }}
              />
            </Box>
          )}

          {(item.type === "text" || item.type === "url") && item.name === "job_apply_link" && (
            <Box sx={{ py: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 1,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  External Application Link
                </Typography>
                <Button
                  size="small"
                  variant={externalLink ? "contained" : "outlined"}
                  onClick={() => setExternalLink(!externalLink)}
                  sx={{
                    textTransform: "none",
                    backgroundColor: externalLink ? "#001C63" : "transparent",
                    color: externalLink ? "#fff" : "#001C63",
                    borderColor: "#001C63",
                  }}
                >
                  {externalLink ? "Enabled" : "Enable External Link"}
                </Button>
              </Box>
              {externalLink && (
                <TextField
                  label={item.title}
                  required={item.required}
                  variant="outlined"
                  fullWidth
                  value={form.job_apply_link || ""}
                  onChange={(e) => {
                    handleChange("job_apply_link", e.target.value);
                    handleChange("type", "external");
                  }}
                  placeholder="https://example.com/apply"
                  error={!!formikErrors[item.name]}
                  helperText={formikErrors[item.name]}
                />
              )}
            </Box>
          )}

          {(item.type === "text" || item.type === "number") && item.name === "interview_rounds" && (
            <Box sx={{ py: 1 }}>
              <TextField
                label={item.title}
                required={item.required}
                variant="outlined"
                fullWidth
                type="number"
                value={form.interview_rounds || ""}
                onChange={(e) => handleChange("interview_rounds", e.target.value)}
                error={!!formikErrors[item.name]}
                helperText={formikErrors[item.name]}
              />
            </Box>
          )}

          {/* Date picker */}
          {item.type === "date" && item.name === "deadline" && (
            <Box sx={{ py: 1 }}>
              <DatePickerInput
                label={item.title}
                required={item.required}
                value={form.deadline}
                onChange={(value) => handleChange("deadline", value)}
                minDate={dayjs()}
                error={!!formikErrors[item.name]}
                helperText={formikErrors[item.name]}
              />
            </Box>
          )}

          {/* Tag input for skills */}
          {(item.type === "tag" || item.type === "taginput") && item.name === "skills" && (
            <Box sx={{ py: 1 }}>
              <TagInput
                label={item.title}
                required={item.required}
                tags={skills}
                setTags={setSkills}
                error={!!formikErrors[item.name]}
                helperText={formikErrors[item.name]}
              />
            </Box>
          )}

          {/* Text areas with AI enhancement */}
          {item.type === "textarea" && item.name === "requirements" && (
            <Box sx={{ py: 1 }}>
              <TextField
                label={item.title}
                required={item.required}
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={form.requirements || ""}
                onChange={(e) => handleChange("requirements", e.target.value)}
                error={!!formikErrors[item.name]}
                helperText={formikErrors[item.name]}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleEnhance("requirements")}
                        disabled={enhancingFields.requirements}
                        sx={{ color: "#001C63" }}
                      >
                        {enhancingFields.requirements ? (
                          <CircularProgress size={20} />
                        ) : (
                          <AssistantIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}

          {item.type === "textarea" && item.name === "company_about" && (
            <Box sx={{ py: 1 }}>
              <TextField
                label={item.title}
                required={item.required}
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={form.company_about || ""}
                onChange={(e) => handleChange("company_about", e.target.value)}
                error={!!formikErrors[item.name]}
                helperText={formikErrors[item.name]}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleEnhance("company_about")}
                        disabled={enhancingFields.company_about}
                        sx={{ color: "#001C63" }}
                      >
                        {enhancingFields.company_about ? (
                          <CircularProgress size={20} />
                        ) : (
                          <AssistantIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}

          {item.type === "textarea" && item.name === "description" && (
            <Box sx={{ py: 1 }}>
              <TextField
                label={item.title}
                required={item.required}
                variant="outlined"
                fullWidth
                multiline
                rows={6}
                value={form.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                error={!!formikErrors[item.name]}
                helperText={formikErrors[item.name]}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleEnhance("description")}
                        disabled={enhancingFields.description}
                        sx={{ color: "#001C63" }}
                      >
                        {enhancingFields.description ? (
                          <CircularProgress size={20} />
                        ) : (
                          <AssistantIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}

          {/* Pay transparency notice */}
          {item.type === "notice" && item.name === "pay_transparency_notice" && (
            <Box
              sx={{
                py: 2,
                px: 2,
                my: 2,
                backgroundColor: "#f0f7ff",
                borderRadius: "8px",
                borderLeft: "4px solid #001C63",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <InfoIcon sx={{ color: "#001C63" }} />
                <Typography variant="body2" sx={{ color: "#333" }}>
                  UNSWAYED requires all employers to provide salary and
                  benefits. Click the info icon to view full terms.
                </Typography>
              </Box>
            </Box>
          )}

          {/* Dropdowns */}
          {item.type === "dropdown" && item.name === "job_categories" && (
            <Box>
              <RalliDropdown
                names={jobCategories}
                label={item.title}
                required={item.required}
                multiple={true}
                selectedValue={form.job_categories || []}
                onChange={handleJobCategoriesChange}
              />
              {formikErrors[item.name] && (
                <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
                  {formikErrors[item.name]}
                </Typography>
              )}
              {/* "Other" category input field */}
              {showOtherCategoryInput && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="Specify Other Category"
                    variant="outlined"
                    fullWidth
                    value={otherCategoryText}
                    onChange={(e) => setOtherCategoryText(e.target.value)}
                    placeholder="Enter your custom job category"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#001C63",
                        },
                      },
                    }}
                  />
                </Box>
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
                onChange={(value) => handleCountryChange(value)}
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
                loading={loadingStates}
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
                loading={loadingCities}
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
                selectedValue={selectedBenefits}
                onChange={handleBenefitsChange}
              />
              {formikErrors[item.name] && (
                <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
                  {formikErrors[item.name]}
                </Typography>
              )}
              {/* "Other" benefit input field */}
              {showOtherBenefitInput && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="Specify Other Benefit"
                    variant="outlined"
                    fullWidth
                    value={otherBenefitText}
                    onChange={(e) => setOtherBenefitText(e.target.value)}
                    placeholder="Enter your custom benefit"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#001C63",
                        },
                      },
                    }}
                  />
                </Box>
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

      <PayTransparencyModal
        open={showPayTransparencyModal}
        onClose={() => setShowPayTransparencyModal(false)}
      />
    </Box>
  );
};

export default CreateJobsForm;