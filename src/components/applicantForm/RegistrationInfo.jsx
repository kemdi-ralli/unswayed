import React, { useState, useEffect } from "react";
import { Box, Button, Typography, IconButton, Modal } from "@mui/material";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import { useWizard } from "react-use-wizard";
import Image from "next/image";
import RalliButton from "../button/RalliButton";
import FormTitle from "../applicant/dashboard/FormTitle";
import Container from "../common/Container";
import { usePathname, useRouter } from "next/navigation";
import { ApplicantSignUpSchema } from "@/schemas/applicantRegistrationSchema";
import TremsOfUse from "../common/tremsAndConditionModal/TremsOfUse";
import * as Yup from "yup";

// UCN Disclaimer Modal Component
const UCNDisclaimerModal = ({ open, onClose }) => (
  <Modal open={open} onClose={onClose}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: "90%", sm: "500px" },
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
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#00305B" }}>
          Unique Candidate Number (UCN)
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Typography
        variant="body1"
        sx={{ mb: 2, lineHeight: 1.8, color: "#333" }}
      >
        <strong>Note:</strong> A Unique Candidate Number (UCN) is automatically assigned when an applicant submits their application through StepIn Now. For these applications, employers may not collect, request, or use any information that could introduce bias into the hiring process. UNSWAYED is committed to merit-based hiring, and all hiring decisions under this process must be based solely on an applicant's skills, qualifications, and job-related experience.
      </Typography>

      <Button
        fullWidth
        variant="contained"
        onClick={onClose}
        sx={{
          mt: 2,
          backgroundColor: "#00305B",
          "&:hover": { backgroundColor: "#002347" },
        }}
      >
        I Understand
      </Button>
    </Box>
  </Modal>
);

const RegistrationInfo = ({
  data,
  formData,
  onFieldChange,
  onSubmit,
  errors = {},
  agreeTerms,
  setAgreeTerms,
}) => {
  const { nextStep, previousStep } = useWizard();
  const router = useRouter();
  const pathName = usePathname();

  const [showPassword, setShowPassword] = useState({
    password: false,
    password_confirmation: false,
  });
  const passwordFieldKey = (name) =>
    name === "password_confirmation" ? "password_confirmation" : "password";

  const [validationErrors, setValidationErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [showUCNModal, setShowUCNModal] = useState(false);
  
  const mergedErrors = { ...validationErrors, ...errors };

  // Automatically show UCN modal when component mounts
  useEffect(() => {
    setShowUCNModal(true);
  }, []);

  // Validate a single field
  const validateField = async (fieldName, value) => {
    try {
      // Create a partial schema for single field validation
      const fieldSchema = Yup.reach(ApplicantSignUpSchema, fieldName);
      await fieldSchema.validate(value);
      
      // Clear error for this field if valid
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      return true;
    } catch (error) {
      setValidationErrors((prev) => ({
        ...prev,
        [fieldName]: error.message,
      }));
      return false;
    }
  };

  // Validate password match (use password_confirmation to match form field name)
  const validatePasswordMatch = (password, confirmValue) => {
    if (confirmValue && password !== confirmValue) {
      setValidationErrors((prev) => ({
        ...prev,
        password_confirmation: "Passwords must match",
      }));
      return false;
    }
    if (confirmValue && password === confirmValue) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next.password_confirmation;
        return next;
      });
      return true;
    }
    return true;
  };

  const handleChange = (name, value) => {
    onFieldChange(name, value);
    setTouchedFields((prev) => ({ ...prev, [name]: true }));

    // When confirm matches, clear error immediately and skip schema validation for this field
    if (name === "password_confirmation") {
      if (value && formData.password === value) {
        setValidationErrors((prev) => {
          const next = { ...prev };
          delete next.password_confirmation;
          return next;
        });
      } else {
        validatePasswordMatch(formData.password, value);
      }
      return;
    }
    if (name === "password") {
      validateField(name, value);
      validatePasswordMatch(value, formData.password_confirmation);
      return;
    }

    validateField(name, value);
  };

  // Validate on blur
  const handleBlur = (name, value) => {
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    if (name === "password_confirmation") {
      validatePasswordMatch(formData.password, value);
      return;
    }
    if (name === "password") {
      validateField(name, value);
      validatePasswordMatch(value, formData.password_confirmation);
      return;
    }
    validateField(name, value);
  };

  const handleBack = () => {
    if (pathName.includes("applicant")) {
      router.push("/applicant/login");
    } else {
      router.push("/employer/login");
    }
  };

  const handleTogglePassword = (fieldName) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  };

  const validateForm = async () => {
    try {
      await ApplicantSignUpSchema.validate(formData, { abortEarly: false });

      if (!agreeTerms) {
        setValidationErrors((prev) => ({
          ...prev,
          terms: "You must agree to the terms of use.",
        }));
        return false;
      }

      setValidationErrors({});
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

      // Mark all fields as touched to show errors
      const allTouched = {};
      data?.form?.forEach((item) => {
        allTouched[item.name] = true;
      });
      setTouchedFields(allTouched);
      
      setValidationErrors(newErrors);
      return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateForm();
    if (isValid) {
      nextStep(formData);
    }
  };

  // Check if field should show error (only if touched)
  const shouldShowError = (fieldName) => {
    return touchedFields[fieldName] && mergedErrors[fieldName];
  };

  return (
    <Container>
      <Box sx={{ height: "100vh", backgroundColor: "#FFFFFF" }}>
        <Box
          sx={{
            width: { xs: "100%", sm: "50%" },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: "15px",
            mb: "20px",
          }}
        >
          <Button onClick={handleBack} sx={{ minWidth: 0, p: 0 }}>
            <ArrowCircleLeftRoundedIcon sx={{ color: "#00305B", fontSize: 32 }} />
          </Button>
          <Image 
            src={data?.logo} 
            width={70} 
            height={70} 
            alt="logo" 
            style={{
              border: "1px solid #fff", 
              borderRadius: 40
            }} 
          />
        </Box>

        <FormTitle label={data?.title} />

        {data?.form?.map((item) => (
          <Box key={item.name} sx={{ mb: "20px" }}>
            <Typography
              sx={{
                fontSize: { xs: "12px", md: "14px", lg: "16px" },
                fontWeight: 600,
                lineHeight: "18px",
                color: "#222222",
                mb: "10px",
              }}
            >
              {item.label}
              {item.required && (
                <Typography component="span" sx={{ color: "red" }}>
                  *
                </Typography>
              )}
            </Typography>

            <Box sx={{ position: "relative", width: "100%" }}>
              <Box
                component="input"
                type={
                  item.name.toLowerCase().includes("password") &&
                  !showPassword[passwordFieldKey(item.name)]
                    ? "password"
                    : "text"
                }
                name={item.name}
                value={formData[item.name] || ""}
                onChange={(e) => handleChange(item.name, e.target.value)}
                onBlur={(e) => handleBlur(item.name, e.target.value)}
                sx={{
                  px: "18px",
                  py: "22px",
                  borderRadius: "10px",
                  boxShadow: shouldShowError(item.name) 
                    ? "0px 0px 3px 2px #ff000040" 
                    : "0px 0px 3px #00000040",
                  width: "100%",
                  border: shouldShowError(item.name) ? "1px solid #ff0000" : "none",
                  "&::placeholder": { transform: "translateY(2px)" },
                  "&:focus": {
                    outline: "none",
                    boxShadow: shouldShowError(item.name)
                      ? "0px 0px 3px 2px #ff000060"
                      : "0px 0px 5px #00305B80",
                  },
                }}
                placeholder={item?.placeHolder}
              />

              {item.name.toLowerCase().includes("password") && (
                <IconButton
                  onClick={() => handleTogglePassword(passwordFieldKey(item.name))}
                  sx={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#222222",
                  }}
                >
                  {showPassword[passwordFieldKey(item.name)] ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              )}
            </Box>

            {/* Error message directly below the field */}
            {shouldShowError(item.name) && (
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
                ⚠ {mergedErrors[item.name]}
              </Typography>
            )}
          </Box>
        ))}

        <TremsOfUse
          error={validationErrors.terms}
          agreeTerms={agreeTerms}
          setAgreeTerms={setAgreeTerms}
        />

        <RalliButton label="Next" onClick={handleNext} disabled={!agreeTerms} />
      </Box>

      {/* UCN Disclaimer Modal - Auto-opens on mount */}
      <UCNDisclaimerModal
        open={showUCNModal}
        onClose={() => setShowUCNModal(false)}
      />
    </Container>
  );
};

export default RegistrationInfo;