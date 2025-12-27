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

  useEffect(() => {
    getJobCategories();
    getJobTypes();
    getJobLocations();
    getJobShifts();
    getJobShiftTimming();
    getCountries();
    setJobBenefits(benefitList || []);
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

  // --- Dependent dropdowns: states by country ---
  useEffect(() => {
    const US_STATES = [
      "Alabama",
      "Alaska",
      "Arizona",
      "Arkansas",
      "California",
      "Colorado",
      "Connecticut",
      "Delaware",
      "Florida",
      "Georgia",
      "Hawaii",
      "Idaho",
      "Illinois",
      "Indiana",
      "Iowa",
      "Kansas",
      "Kentucky",
      "Louisiana",
      "Maine",
      "Maryland",
      "Massachusetts",
      "Michigan",
      "Minnesota",
      "Mississippi",
      "Missouri",
      "Montana",
      "Nebraska",
      "Nevada",
      "New Hampshire",
      "New Jersey",
      "New Mexico",
      "New York",
      "North Carolina",
      "North Dakota",
      "Ohio",
      "Oklahoma",
      "Oregon",
      "Pennsylvania",
      "Rhode Island",
      "South Carolina",
      "South Dakota",
      "Tennessee",
      "Texas",
      "Utah",
      "Vermont",
      "Virginia",
      "Washington",
      "West Virginia",
      "Wisconsin",
      "Wyoming",
    ];

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
        setLoadingStates(true); // Add this
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
          if (countryId === 233) {
            const allStates = [
              ...US_STATES,
              ...US_INHABITED_TERRITORIES,
              ...US_UNINHABITED_TERRITORIES,
            ].map((name) => ({ id: name, name }));
            setStates(allStates);
            return;
          }
          setStates(_states);
        } catch (error) {
          setErrors(error?.response?.data?.message || "Failed to load states");
        } finally {
          setLoadingStates(false); // Add this
        }
      };

      getStates();
    } else {
      handleChange("states", []);
      setStates([]);
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

    // If primitive (string/number), try direct lookup or search countries list for a matching item
    if (typeof countryValue === "string" || typeof countryValue === "number") {
      const direct = tryKey(countryValue);
      if (direct) return direct;

      // check in loaded countries array: match common keys
      const found = countries.find(
        (c) =>
          c?.id === countryValue ||
          String(c?.id) === String(countryValue) ||
          c?.iso2 === countryValue ||
          c?.code === countryValue ||
          c?.cca2 === countryValue ||
          c?.country_code === countryValue ||
          (c?.name &&
            (c.name.common === countryValue || c.name === countryValue))
      );
      if (found) {
        return (
          tryKey(found.id) ||
          tryKey(found.iso2) ||
          tryKey(found.code) ||
          tryKey(found.cca2) ||
          tryKey(found.country_code) ||
          tryKey(found.name?.common) ||
          tryKey(found.name)
        );
      }
      return null;
    }

    // If object, probe known properties
    if (typeof countryValue === "object") {
      const keysToProbe = [
        "id",
        "iso2",
        "cca2",
        "alpha2",
        "code",
        "country_code",
        "countryCode",
        "name",
        "label",
      ];
      for (const k of keysToProbe) {
        if (countryValue[k]) {
          const res = tryKey(countryValue[k]);
          if (res) return res;
        }
      }
      // last-ditch: if object has 'name', try to find that name inside countries list
      if (countryValue.name) {
        const foundByName = countries.find(
          (c) =>
            (c?.name &&
              (c.name.common === countryValue.name ||
                c.name === countryValue.name)) ||
            c?.label === countryValue.name ||
            c?.displayName === countryValue.name
        );
        if (foundByName) {
          return (
            tryKey(foundByName.id) ||
            tryKey(foundByName.iso2) ||
            tryKey(foundByName.code) ||
            tryKey(foundByName.cca2) ||
            tryKey(foundByName.country_code)
          );
        }
      }
    }
    return null;
  };

  // ---- previousCountryRef to avoid overriding prefilled values on initial load ----
  const previousCountryRef = useRef(form.country);

  // ---- Fallback effect: if country changed programmatically, ensure currency is updated (but avoid overriding initial prefill) ----
  useEffect(() => {
    const prev = previousCountryRef.current;
    const curr = form.country;
    if (prev === curr) {
      // keep ref in sync but do not force a change
      previousCountryRef.current = curr;
      return;
    }

    // country actually changed -> resolve currency
    const code = resolveCurrencyFromCountry(curr);
    if (code && form.salary_currency !== code) {
      setForm((prev) => ({ ...prev, salary_currency: code }));
    }

    previousCountryRef.current = curr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.country, countries]);

  // ---- Primary decisive handler: called when user selects a country in the dropdown ----
  const handleCountryChange = (value) => {
    // resolve currency synchronously and set both in a single setState -> immediate UI feedback
    const code = resolveCurrencyFromCountry(value) || "";
    setForm((prev) => ({
      ...prev,
      country: value,
      salary_currency: code,
      // optionally clear dependent selections if needed
      states: [],
      cities: [],
    }));
    // update previousCountryRef for the fallback effect
    previousCountryRef.current = value;
  };

  // --- Dependent dropdowns: cities by states ---
  useEffect(() => {
    if (form?.states?.length > 0) {
      const getCities = async () => {
        setLoadingCities(true); // Add this
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
        } finally {
          setLoadingCities(false); // Add this
        }
      };
      getCities();
    } else {
      handleChange("cities", []);
      setCities([]);
    }
  }, [form?.states]);

  // --- Pre-fill when viewing a single job (detail) ---
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
        company_benefits: jobDetail?.company_benefits || "",
        salary: jobDetail?.salary,
        salary_max: jobDetail?.salary_max,
        salary_period: jobDetail?.salary_period || "Per Month",
        salary_currency: jobDetail?.salary_currency || "",
        company_about: jobDetail?.company_about || "",
        job_apply_link: jobDetail?.job_apply_link || "",
      });
      setSkills(jobDetail?.skills ?? []);
      previousCountryRef.current =
        jobDetail?.country?.id || jobDetail?.country || null;
    }
  }, [jobDetail]);

  // --- Pre-fill when editing (edit detail) ---
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
        salary_max: jobEditDetail?.salary_max || "",
        salary_period: jobEditDetail?.salary_period || "Per Month",
        requirements: jobEditDetail?.requirements || "",
        salary_currency: jobEditDetail?.salary_currency || "",
        company_about: jobEditDetail?.company_about || "",
        company_benefits: jobEditDetail?.company_benefits || "",
        description: jobEditDetail?.description || "",
        type: jobEditDetail?.type || "internal",
        job_apply_link: jobEditDetail?.job_apply_link || "",
      });
      setSkills(jobEditDetail?.skills ?? []);
      previousCountryRef.current =
        jobEditDetail?.country?.id || jobEditDetail?.country || null;
    }
  }, [jobEditDetail]);

  const router = useRouter();

  // --- URL helpers for job_apply_link field ---
  const ensureProtocolPrefix = (val) => {
    if (!val || val.trim() === "") return "https://";
    // if already has a scheme like http:// or https:// return as-is
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(val)) return val;
    // otherwise prefix with https:// but avoid double slashes
    return "https://" + val.replace(/^\/+/, "");
  };

  /**
   * Validates that a provided URL has a domain suffix (like .com/.org/.io/.co.uk)
   * Returns empty string when valid or when empty (we don't force required here).
   * Returns an error message when invalid.
   */
  const validateExternalLink = (val) => {
    if (!val || String(val).trim() === "") return ""; // no value -> no error here (schema may enforce required)
    try {
      // Ensure URL constructor can parse (prefix with https if missing)
      const toParse = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(val)
        ? val
        : "https://" + val;
      const parsed = new URL(toParse);
      const host = parsed.hostname; // e.g. example.com or sub.example.co.uk
      // Host must contain at least one dot and a valid TLD segment of >=2 letters.
      const parts = host.split(".");
      if (parts.length < 2) {
        return "URL must contain a domain suffix (e.g. .com, .org).";
      }
      const tld = parts[parts.length - 1];
      if (!/^[a-zA-Z]{2,}$/.test(tld)) {
        return "URL must have a valid alphabetic suffix (e.g. .com, .org).";
      }
      return "";
    } catch (e) {
      return "Enter a valid URL.";
    }
  };

  const validateForm = async () => {
    // Validate job_apply_link early (so user sees that suffix error below the field)
    const extErr = validateExternalLink(externalLink);
    if (extErr) {
      setFormikErrors((prev) => ({ ...prev, job_apply_link: extErr }));
      return false;
    }

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
    setExternalLink(ensureProtocolPrefix(externalLink));
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

  // Per-field AI enhance loader
  const [loadingField, setLoadingField] = useState(null);
  const handleEnhanceAi = async (fieldName, text) => {
    try {
      setLoadingField(fieldName);
      const enhancedText = await enhanceText(text);
      setForm((prev) => ({
        ...prev,
        [fieldName]: enhancedText,
      }));
    } catch (error) {
      console.error(`Error enhancing ${fieldName}:`, error);
    } finally {
      setLoadingField(null);
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

              {/* ---------------------------
                  EXTERNAL LINK (SEPARATE)
                  --------------------------- */}
              {item.type === "text" && item.name === "job_apply_link" && (
                <Box>
                  <Box
                    component="input"
                    type="text"
                    placeholder={item?.placeHolder || "https://example.com"}
                    value={externalLink ?? ""}
                    required={item.required}
                    onChange={(e) => {
                      const v = e.target.value;
                      // update value but don't validate aggressively while typing
                      handleChange("job_apply_link", v);
                      setFormikErrors((prev) => ({
                        ...prev,
                        job_apply_link: "",
                      }));
                    }}
                    onBlur={(e) => {
                      // Ensure protocol present (so URL parsing works reliably)
                      let v = e.target.value ?? "";
                      if (v.trim() === "") {
                        v = "https://";
                      } else {
                        v = ensureProtocolPrefix(v);
                      }
                      handleChange("job_apply_link", v);
                      const err = validateExternalLink(v);
                      setFormikErrors((prev) => ({
                        ...prev,
                        job_apply_link: err,
                      }));
                    }}
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
                  />
                  {formikErrors.job_apply_link && (
                    <Typography
                      color="error"
                      sx={{ fontSize: "12px", mt: "5px" }}
                    >
                      {formikErrors.job_apply_link}
                    </Typography>
                  )}
                </Box>
              )}
              {(item.type === "text" && item.name !== "job_apply_link") ||
              (item.type === "number" && item.name !== "salary") ||
              (item.type === "number" && item.name !== "salary_max") ||
              item.type === "url" ? (
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
                  value={form?.[item.name] ?? ""}
                  onChange={(e) => handleChange(item.name, e.target.value)}
                />
              ) : null}

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
                  value={form?.[item.name] ?? ""}
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
                          startIcon={
                            loadingField === item.name ? (
                              <CircularProgress
                                size={20}
                                sx={{ color: "#189e33ff" }}
                              />
                            ) : (
                              <AssistantIcon />
                            )
                          }
                          disabled={loadingField === item.name}
                        >
                          {loadingField === item.name
                            ? "Enhancing..."
                            : "Enhance With AI"}
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
                    marginTop: "10px",
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

          {/* Salary range (two inputs, stored as "min - max") */}
          {/* {item.type === "number" && item.name === "salary" && (
            <>
              <Box sx={{ display: "flex", gap: 2, mb: "20px" }}>
                <Box
                  component="input"
                  type="number"
                  min={0}
                  placeholder="Minimum Salary"
                  value={form.salary || ""}
                  onChange={(e) => {
                    const max = form.salary || "";
                    handleChange("salary", e.target.value);
                  }}
                  sx={{
                    flex: 1,
                    boxShadow: "0px 0px 3px 1px #00000040",
                    border: "none",
                    padding: "18px 20px",
                    borderRadius: "10px",
                    fontSize: "16px",
                    fontWeight: 300,
                    lineHeight: "18px",
                    color: "#222222",
                    "&::placeholder": {
                      color: "rgba(0,0,0,0.5)",
                      fontSize: "16px",
                      fontWeight: 400,
                    },
                  }}
                />
              </Box>
              
            </>
          )} */}

          {item.type === "number" && item.name === "salary_max" && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: "#e3f2fd",
                borderLeft: "4px solid #001C63",
                borderRadius: "8px",
                boxShadow: "0px 0px 4px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              <IconButton
                onClick={() => setShowPayTransparencyModal(true)}
                sx={{
                  color: "#001C63",
                  p: 0.5,
                  "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.08)" },
                }}
              >
                <InfoIcon />
              </IconButton>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    mb: 0.5,
                    color: "#001C63",
                    fontSize: "14px",
                  }}
                >
                  Pay Transparency Reminder
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#555", fontSize: "13px", lineHeight: 1.5 }}
                >
                  By posting on UNSWAYED, you agree to provide salary ranges and
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
                loading={loadingStates} // Add this prop
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
                loading={loadingCities} // Add this prop
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

      <PayTransparencyModal
        open={showPayTransparencyModal}
        onClose={() => setShowPayTransparencyModal(false)}
      />
    </Box>
  );
};

export default CreateJobsForm;
