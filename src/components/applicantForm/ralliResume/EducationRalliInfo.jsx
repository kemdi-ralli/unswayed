"use client";
import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, FormControlLabel, Checkbox } from "@mui/material";
import { useWizard } from "react-use-wizard";
import RalliButton from "@/components/button/RalliButton";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCvs } from "@/redux/slices/applicantCv";
import { setEditMode } from "@/redux/slices/editSlice";
import AddAnotherButton from "./AddAnotherButton";
import Header from "./Header";
import ButtonIndex from "./ButtonIndex";
import FormField from "./FormField";

const EMPTY_EDUCATION = {
  institution_name: "",
  degree: "",
  field_of_study: "",
  start_date: "",
  end_date: "",
  grade: "",
  is_continue: null,
};

// Validation rules for education fields
const EDUCATION_VALIDATION = {
  institution_name: {
    required: true,
    minLength: 2,
    message: "Institution name is required (min 2 characters)",
  },
  degree: {
    required: true,
    message: "Degree is required",
  },
  field_of_study: {
    required: true,
    message: "Field of study is required",
  },
  start_date: {
    required: true,
    message: "Start date is required",
  },
  end_date: {
    required: false, // Optional if still continuing
    message: "End date is required",
  },
  is_continue: {
    required: true,
    message: "Please indicate if you graduated",
  },
};

const EducationRalliInfo = ({ data, onNext, educationDetails }) => {
  const { nextStep } = useWizard();
  const router = useRouter();
  const dispatch = useDispatch();

  const [educationFields, setEducationFields] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const sectionRefs = useRef([]);

  useEffect(() => {
    if (educationDetails?.length) {
      setEducationFields(
        educationDetails.map((edu) => ({
          ...EMPTY_EDUCATION,
          ...edu,
        }))
      );
      
      // Initialize touched and errors state for each entry
      const initialTouched = {};
      const initialErrors = {};
      educationDetails.forEach((_, index) => {
        initialTouched[index] = {};
        initialErrors[index] = {};
      });
      setTouchedFields(initialTouched);
      setValidationErrors(initialErrors);
    } else {
      setEducationFields([{ ...EMPTY_EDUCATION }]);
      setTouchedFields({ 0: {} });
      setValidationErrors({ 0: {} });
    }
  }, [educationDetails]);

  // Validate a single field
  const validateField = (index, name, value) => {
    const rule = EDUCATION_VALIDATION[name];
    if (!rule) return true;

    let isValid = true;
    let errorMessage = "";

    // is_continue: "No" (false) is valid — no error when user did not graduate
    if (name === "is_continue" && (value === true || value === false)) {
      isValid = true;
      errorMessage = "";
    } else if (rule.required && (value === null || value === undefined || (typeof value === "string" && !value.trim()))) {
      isValid = false;
      errorMessage = rule.message;
    } else if (rule.minLength && value && value.length < rule.minLength) {
      isValid = false;
      errorMessage = rule.message;
    }

    // Special case: end_date required only if is_continue is true (graduated)
    if (name === "end_date") {
      const form = educationFields[index];
      if (form?.is_continue === true && !value) {
        isValid = false;
        errorMessage = "End date is required if you graduated";
      }
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

  // Handle field change with validation
  const handleChange = (index, name, value) => {
    setEducationFields((prev) =>
      prev.map((form, i) => (i === index ? { ...form, [name]: value } : form))
    );

    // Mark field as touched
    setTouchedFields((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [name]: true,
      },
    }));

    // Validate immediately
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

  const handleAddEducation = () => {
    const newIndex = educationFields.length;
    setEducationFields((prev) => [...prev, { ...EMPTY_EDUCATION }]);
    
    // Initialize touched and errors for new entry
    setTouchedFields((prev) => ({ ...prev, [newIndex]: {} }));
    setValidationErrors((prev) => ({ ...prev, [newIndex]: {} }));

    setTimeout(() => {
      sectionRefs.current[newIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleClose = (index) => {
    setEducationFields((prev) => prev.filter((_, i) => i !== index));
    sectionRefs.current.splice(index, 1);

    // Rebuild touched and errors state
    setTouchedFields((prev) => {
      const newTouched = {};
      Object.keys(prev).forEach((key) => {
        const keyNum = parseInt(key);
        if (keyNum < index) {
          newTouched[keyNum] = prev[keyNum];
        } else if (keyNum > index) {
          newTouched[keyNum - 1] = prev[keyNum];
        }
      });
      return newTouched;
    });
    
    setValidationErrors((prev) => {
      const newErrors = {};
      Object.keys(prev).forEach((key) => {
        const keyNum = parseInt(key);
        if (keyNum < index) {
          newErrors[keyNum] = prev[keyNum];
        } else if (keyNum > index) {
          newErrors[keyNum - 1] = prev[keyNum];
        }
      });
      return newErrors;
    });
  };

  // Validate all fields before proceeding
  const validateAll = () => {
    let isValid = true;
    const newTouched = {};
    const newErrors = {};

    educationFields.forEach((form, index) => {
      newTouched[index] = {};
      newErrors[index] = {};

      // Validate each required field
      Object.keys(EDUCATION_VALIDATION).forEach((fieldName) => {
        newTouched[index][fieldName] = true;
        
        const rule = EDUCATION_VALIDATION[fieldName];
        const value = form[fieldName];
        
        let fieldValid = true;
        let errorMessage = "";

        // is_continue: "No" (false) is valid — no error when user did not graduate
        if (fieldName === "is_continue" && (value === true || value === false)) {
          fieldValid = true;
          errorMessage = "";
        } else if (rule.required && (value === null || value === undefined || value === "")) {
          fieldValid = false;
          errorMessage = rule.message;
        } else if (rule.minLength && value && value.length < rule.minLength) {
          fieldValid = false;
          errorMessage = rule.message;
        }

        // Special case: end_date required only if graduated
        if (fieldName === "end_date" && form.is_continue === true && !value) {
          fieldValid = false;
          errorMessage = "End date is required if you graduated";
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
      for (let i = 0; i < educationFields.length; i++) {
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
    
    onNext(educationFields);
    nextStep();
  };

  const handleBack = () => {
    router.back();
    dispatch(setCvs());
    dispatch(setEditMode(false));
  };

  // Check if error should be shown for a specific field
  const shouldShowError = (index, fieldName) => {
    return touchedFields[index]?.[fieldName] && validationErrors[index]?.[fieldName];
  };

  const getFieldError = (index, fieldName) => {
    return validationErrors[index]?.[fieldName] || "";
  };

  return (
    <Box sx={{ width: "auto", minHeight: "100vh" }}>
      <Header handleBack={handleBack} pages={data?.pages} title={data?.title} />

      {educationFields.map((form, index) => (
        <Box
          key={index}
          ref={(el) => (sectionRefs.current[index] = el)}
          sx={{ mb: "24px" }}
        >
          <ButtonIndex
            label="Education"
            index={index}
            handleClose={handleClose}
          />

          {(data?.form || [])
            .filter((item) => item.name !== "is_continue")
            .map((item) => (
              <Box key={`${item.name}-${index}`}>
                <FormField
                  item={item}
                  form={form}
                  index={index}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  error={shouldShowError(index, item.name)}
                  errorMessage={getFieldError(index, item.name)}
                />
              </Box>
            ))}

          {/* DID YOU GRADUATE — PER EDUCATION ENTRY */}
          <Box sx={{ mb: "24px" }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                mb: "10px",
              }}
            >
              Did You Graduate?
              <Typography component="span" sx={{ color: "red" }}>
                *
              </Typography>
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 3,
                padding: "8px 20px",
                borderRadius: "10px",
                boxShadow: shouldShowError(index, "is_continue")
                  ? "0px 0px 3px 2px #ff000040"
                  : "0px 0px 3px #00000040",
                border: shouldShowError(index, "is_continue")
                  ? "1px solid #ff0000"
                  : "none",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.is_continue === true}
                    onChange={() => {
                      handleChange(index, "is_continue", true);
                    }}
                  />
                }
                label="Yes"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.is_continue === false}
                    onChange={() => {
                      handleChange(index, "is_continue", false);
                    }}
                  />
                }
                label="No"
              />
            </Box>
            
            {shouldShowError(index, "is_continue") && (
              <Typography 
                sx={{ 
                  color: "red", 
                  fontSize: "12px", 
                  mt: "5px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                ⚠ {getFieldError(index, "is_continue")}
              </Typography>
            )}
          </Box>
        </Box>
      ))}

      <AddAnotherButton onClick={handleAddEducation} label="School" />

      <Box sx={{ pt: 2 }}>
        <RalliButton label="Save & Continue" onClick={handleNext} />
      </Box>
    </Box>
  );
};

export default EducationRalliInfo;