import React, { useState } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useWizard } from "react-use-wizard";
import Image from "next/image";
import RalliButton from "../button/RalliButton";
import FormTitle from "../applicant/dashboard/FormTitle";
import Container from "../common/Container";
import { usePathname, useRouter } from "next/navigation";
import { ApplicantSignUpSchema } from "@/schemas/applicantRegistrationSchema";
import TremsOfUse from "../common/tremsAndConditionModal/TremsOfUse";

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
    confirmPassword: false,
  });

  const [validationErrors, setValidationErrors] = useState({});
  const mergedErrors = { ...validationErrors, ...errors };

  const handleChange = (name, value) => {
    onFieldChange(name, value);
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
        throw new Error("You must agree to the terms of use.");
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
          <Image src={data?.logo} width={70} height={70} alt="logo" style={{
            border: "1px solid #fff", 
            borderRadius: 40
          }} />
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
                  !showPassword[item.name.toLowerCase()]
                    ? "password"
                    : "text"
                }
                name={item.name}
                value={formData[item.name] || ""}
                onChange={(e) => handleChange(item.name, e.target.value)}
                sx={{
                  px: "18px",
                  py: "22px",
                  borderRadius: "10px",
                  boxShadow: "0px 0px 3px #00000040",
                  width: "100%",
                  border: "none",
                  borderColor: errors[item.name] ? "red" : "transparent",
                  "&::placeholder": { transform: "translateY(2px)" },
                }}
                placeholder={item?.placeHolder}
              />

              {item.name.toLowerCase().includes("password") && (
                <IconButton
                  onClick={() => handleTogglePassword(item.name.toLowerCase())}
                  sx={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#222222",
                  }}
                >
                  {showPassword[item.name.toLowerCase()] ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              )}
            </Box>

            {mergedErrors[item.name] && (
              <Typography sx={{ color: "red", fontSize: "12px", mt: "5px" }}>
                {mergedErrors[item.name]}
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
    </Container>
  );
};

export default RegistrationInfo;
