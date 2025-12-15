"use client";
import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";

import { useWizard } from "react-use-wizard";

import Image from "next/image";
import RalliButton from "../button/RalliButton";
import FormTitle from "../applicant/dashboard/FormTitle";
import Container from "../common/Container";
import { CompanyRegistrationSchema } from "@/schemas/employerCompanyRegistrationSchema";
import { useRouter } from "next/navigation";

const EducationInfo = ({ data, formData, onFieldChange, onSubmit }) => {
  const [errors, setErrors] = useState({});

  const { nextStep, previousStep } = useWizard();

  const handleChange = (name, value) => {
    onFieldChange(name, value);
  };
  const router = useRouter();

  const handleBack = () => {
    previousStep();
  };
  const validateForm = async () => {
    try {
      await CompanyRegistrationSchema.validate(formData, { abortEarly: false });

      setErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = {};

      if (validationErrors.inner) {
        validationErrors.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
      }
      setErrors(newErrors);
      return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateForm();
    if (isValid) {
      onSubmit(formData);
    }
  };
  return (
    <Container>
      <Box
        sx={{
          height: "100vh",
          backgroundColor: "#FFFFFF",
        }}
      >
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
          <Button
            onClick={() => router.push("/employer/login")}
            sx={{ minWidth: 0, p: 0 }}
          >
            <ArrowCircleLeftRoundedIcon
              sx={{ color: "#00305B", fontSize: 32 }}
            />
          </Button>
          <Image src={data?.logo} width={70} height={70} alt="logo" />
        </Box>
        <FormTitle label={data?.title} />
        {data.form.map((item) => (
          <Box key={item.name} sx={{ mb: "20px" }}>
            <Typography sx={{ fontWeight: 600, mb: "10px" }}>
              {item.label}
              {item.required && (
                <Typography component="span" sx={{ color: "red" }}>
                  *
                </Typography>
              )}
            </Typography>
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
              }}
              placeholder={item.placeHolder}
              value={formData[item.name] || ""}
              onChange={(e) => handleChange(item.name, e.target.value)}
              type={item?.type}
            />
            {errors[item.name] && (
              <Typography sx={{ color: "red", fontSize: "12px", mt: "5px" }}>
                {errors[item.name]}
              </Typography>
            )}
          </Box>
        ))}
        <Box sx={{ display: "flex", justifyContent: "space-between", py: 2 }}>
          <RalliButton label="Done" onClick={handleNext} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="text"
            onClick={handleBack}
            sx={{
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              "&:hover": {
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              },
            }}
          >
            Previous
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EducationInfo;
