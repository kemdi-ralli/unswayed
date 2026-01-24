"use client";
import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { useWizard } from "react-use-wizard";
import RalliButton from "@/components/button/RalliButton";
import { enhanceText } from "@/helper/aiEnhanceHelper";
import AddAnotherButton from "./AddAnotherButton";
import Header from "./Header";
import ButtonIndex from "./ButtonIndex";
import FormField from "./FormField";
import apiInstance from "@/services/apiService/apiServiceInstance";
import {
  COUNTRIES,
  COUNTRY_STATES_NAME,
  CITIES_STATES_NAME,
} from "@/services/apiService/apiEndPoints";

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

// Validation rules for experience fields
const EXPERIENCE_VALIDATION = {
  title: {
    required: true,
    minLength: 2,
    message: "Job title is required (min 2 characters)",
  },
  company: {
    required: true,
    minLength: 2,
    message: "Company name is required (min 2 characters)",
  },
  start_date: {
    required: true,
    message: "Start date is required",
  },
  description: {
    required: false,
    message: "Description is optional",
  },
};

const AddRecentJobs = ({
  data,
  onNext,
  recentJobs,
  totalExperience,
}) => {
  const { nextStep, previousStep } = useWizard();
  const [recentJob, setRecentJob] = useState(recentJobs || [{}]);
  const [enhanceAi, setEnhanceAi] = useState("");

  // Validation state
  const [validationErrors, setValidationErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // Master countries list (fetched once)
  const [countries, setCountries] = useState([]);

  // Per-entry states and cities storage
  const [locationData, setLocationData] = useState({});

  // Loading states per entry
  const [loadingStates, setLoadingStates] = useState({});
  const [loadingCities, setLoadingCities] = useState({});

  const sectionRefs = useRef([]);
  const formTopRef = useRef(null);

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await apiInstance.get(COUNTRIES);
        setCountries(response?.data?.data?.countries || []);
      } catch (error) {
        console.error("Failed to load countries:", error);
      }
    };
    fetchCountries();
  }, []);

  // Initialize location data and validation state for existing entries
  useEffect(() => {
    if (recentJobs?.length > 0) {
      setEnhanceAi(recentJobs[0]?.description || "");

      // Initialize location data for each entry
      const initialLocationData = {};
      const initialTouched = {};
      const initialErrors = {};
      
      recentJobs.forEach((job, index) => {
        initialLocationData[index] = { states: [], cities: [] };
        initialTouched[index] = {};
        initialErrors[index] = {};
      });
      
      setLocationData(initialLocationData);
      setTouchedFields(initialTouched);
      setValidationErrors(initialErrors);

      // Fetch states/cities for entries that have country/state selected
      recentJobs.forEach((job, index) => {
        if (job.country) {
          fetchStatesForEntry(index, job.country);
        }
        if (job.state) {
          fetchCitiesForEntry(index, job.state);
        }
      });

      setTimeout(() => {
        if (formTopRef.current) {
          const offset = 100;
          const top =
            formTopRef.current.getBoundingClientRect().top +
            window.pageYOffset -
            offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 100);
    } else {
      // Initialize for single empty entry
      setTouchedFields({ 0: {} });
      setValidationErrors({ 0: {} });
    }
  }, [recentJobs]);

  // Fetch states for a specific entry
  const fetchStatesForEntry = async (index, countryValue) => {
    if (!countryValue) {
      setLocationData((prev) => ({
        ...prev,
        [index]: { ...prev[index], states: [], cities: [] },
      }));
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [index]: true }));

    try {
      const response = await apiInstance.get(
        `${COUNTRY_STATES_NAME}/${countryValue}`
      );
      let fetchedStates = response?.data?.data?.states || [];

      // Handle US territories
      if (countryValue === 233 || countryValue === "233") {
        const territoryNames = [
          ...US_INHABITED_TERRITORIES,
          ...US_UNINHABITED_TERRITORIES,
        ];
        const mainStates = fetchedStates.filter(
          (state) => !territoryNames.includes(state.name)
        );
        const territories = territoryNames.map((name) => ({ id: name, name }));
        fetchedStates = [...mainStates, ...territories];
      }

      setLocationData((prev) => ({
        ...prev,
        [index]: { ...prev[index], states: fetchedStates, cities: [] },
      }));
    } catch (error) {
      console.error("Failed to load states:", error);
      setLocationData((prev) => ({
        ...prev,
        [index]: { ...prev[index], states: [], cities: [] },
      }));
    } finally {
      setLoadingStates((prev) => ({ ...prev, [index]: false }));
    }
  };

  // Fetch cities for a specific entry
  const fetchCitiesForEntry = async (index, stateValue) => {
    if (!stateValue) {
      setLocationData((prev) => ({
        ...prev,
        [index]: { ...prev[index], cities: [] },
      }));
      return;
    }

    setLoadingCities((prev) => ({ ...prev, [index]: true }));

    try {
      const response = await apiInstance.get(
        `${CITIES_STATES_NAME}/${stateValue}`
      );
      const fetchedCities = response?.data?.data?.cities || [];

      setLocationData((prev) => ({
        ...prev,
        [index]: { ...prev[index], cities: fetchedCities },
      }));
    } catch (error) {
      console.error("Failed to load cities:", error);
      setLocationData((prev) => ({
        ...prev,
        [index]: { ...prev[index], cities: [] },
      }));
    } finally {
      setLoadingCities((prev) => ({ ...prev, [index]: false }));
    }
  };

  // Validate a single field
  const validateField = (index, name, value) => {
    const rule = EXPERIENCE_VALIDATION[name];
    if (!rule) return true;

    let isValid = true;
    let errorMessage = "";

    if (rule.required && (!value || (typeof value === "string" && !value.trim()))) {
      isValid = false;
      errorMessage = rule.message;
    } else if (rule.minLength && value && value.length < rule.minLength) {
      isValid = false;
      errorMessage = rule.message;
    }

    setValidationErrors((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [name]: isValid ? "" : errorMessage,
      },
    }));

    return isValid;
  };

  const handleEnhanceAi = async (index, description) => {
    try {
      const enhancedText = await enhanceText(description);
      setRecentJob((prev) =>
        prev.map((job, i) =>
          i === index ? { ...job, description: enhancedText } : job
        )
      );
    } catch (error) {
      console.error("Error enhancing description:", error);
    }
  };

  const handleChange = (index, name, value) => {
    setRecentJob((prev) =>
      prev.map((form, i) => {
        if (i === index) {
          const updatedForm = { ...form, [name]: value };

          if (name === "country") {
            updatedForm.state = "";
            updatedForm.city = "";
            fetchStatesForEntry(index, value);
          }

          if (name === "state") {
            updatedForm.city = "";
            fetchCitiesForEntry(index, value);
          }

          return updatedForm;
        }
        return form;
      })
    );

    // Mark field as touched and validate
    setTouchedFields((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [name]: true,
      },
    }));

    validateField(index, name, value);
  };

  // Handle blur for validation
  const handleBlur = (index, name, value) => {
    setTouchedFields((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [name]: true,
      },
    }));
    validateField(index, name, value);
  };

  const handleAddJob = () => {
    const newIndex = recentJob.length;

    // Initialize location data for new entry
    setLocationData((prev) => ({
      ...prev,
      [newIndex]: { states: [], cities: [] },
    }));

    // Initialize validation state
    setTouchedFields((prev) => ({ ...prev, [newIndex]: {} }));
    setValidationErrors((prev) => ({ ...prev, [newIndex]: {} }));

    setRecentJob((prev) => [...prev, {}]);

    setTimeout(() => {
      const lastRef = sectionRefs.current[newIndex];
      if (lastRef) {
        lastRef.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Validate all fields before proceeding
  const validateAll = () => {
    let isValid = true;
    const newTouched = {};
    const newErrors = {};

    recentJob.forEach((form, index) => {
      newTouched[index] = {};
      newErrors[index] = {};

      Object.keys(EXPERIENCE_VALIDATION).forEach((fieldName) => {
        newTouched[index][fieldName] = true;
        
        const rule = EXPERIENCE_VALIDATION[fieldName];
        const value = form[fieldName];
        
        let fieldValid = true;
        let errorMessage = "";

        if (rule.required && (!value || (typeof value === "string" && !value.trim()))) {
          fieldValid = false;
          errorMessage = rule.message;
        } else if (rule.minLength && value && value.length < rule.minLength) {
          fieldValid = false;
          errorMessage = rule.message;
        }

        if (!fieldValid) {
          isValid = false;
          newErrors[index][fieldName] = errorMessage;
        }
      });
    });

    setTouchedFields(newTouched);
    setValidationErrors(newErrors);

    return isValid;
  };

  const handleNext = () => {
    const isValid = validateAll();
    
    if (!isValid) {
      // Scroll to first error
      for (let i = 0; i < recentJob.length; i++) {
        if (validationErrors[i] && Object.values(validationErrors[i]).some(e => e)) {
          sectionRefs.current[i]?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          break;
        }
      }
      return;
    }
    
    onNext(recentJob);
    nextStep();
  };

  const handleBack = () => {
    previousStep();
  };

  const handleClose = (index) => {
    setRecentJob((prev) => prev.filter((_, i) => i !== index));
    sectionRefs.current.splice(index, 1);

    // Rebuild all index-based state
    setLocationData((prev) => {
      const newData = {};
      Object.keys(prev).forEach((key) => {
        const keyNum = parseInt(key);
        if (keyNum < index) {
          newData[keyNum] = prev[keyNum];
        } else if (keyNum > index) {
          newData[keyNum - 1] = prev[keyNum];
        }
      });
      return newData;
    });

    setTouchedFields((prev) => {
      const newData = {};
      Object.keys(prev).forEach((key) => {
        const keyNum = parseInt(key);
        if (keyNum < index) {
          newData[keyNum] = prev[keyNum];
        } else if (keyNum > index) {
          newData[keyNum - 1] = prev[keyNum];
        }
      });
      return newData;
    });

    setValidationErrors((prev) => {
      const newData = {};
      Object.keys(prev).forEach((key) => {
        const keyNum = parseInt(key);
        if (keyNum < index) {
          newData[keyNum] = prev[keyNum];
        } else if (keyNum > index) {
          newData[keyNum - 1] = prev[keyNum];
        }
      });
      return newData;
    });
  };

  // Check if error should be shown
  const shouldShowError = (index, fieldName) => {
    return touchedFields[index]?.[fieldName] && validationErrors[index]?.[fieldName];
  };

  const getFieldError = (index, fieldName) => {
    return validationErrors[index]?.[fieldName] || "";
  };

  return (
    <Box sx={{ minHeight: "100vh" }} ref={formTopRef}>
      <Header handleBack={handleBack} pages={data?.pages} title={data?.title} />

      {recentJob?.map((form, index) => (
        <Box
          key={index}
          ref={(el) => (sectionRefs.current[index] = el)}
          sx={{ mb: "20px" }}
        >
          <ButtonIndex
            label="Experience"
            index={index}
            handleClose={handleClose}
          />
          {data?.form?.map((item) => (
            <FormField
              key={item.name}
              item={item}
              form={form}
              index={index}
              handleChange={handleChange}
              handleBlur={handleBlur}
              handleEnhanceAi={handleEnhanceAi}
              countries={countries}
              states={locationData[index]?.states || []}
              cities={locationData[index]?.cities || []}
              checkedLabel="Currently Employed"
              totalExperience={totalExperience}
              loadingStates={loadingStates[index]}
              loadingCities={loadingCities[index]}
              error={shouldShowError(index, item.name)}
              errorMessage={getFieldError(index, item.name)}
            />
          ))}
        </Box>
      ))}

      <AddAnotherButton onClick={handleAddJob} label={"Experience"} />
      <RalliButton label="Save & Continue" onClick={handleNext} />
    </Box>
  );
};

export default AddRecentJobs;