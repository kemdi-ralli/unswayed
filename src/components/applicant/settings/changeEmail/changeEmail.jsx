"use client";
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import RalliButton from "@/components/button/RalliButton";
import TextInput from "@/components/input/TextInput";
import { useWizard } from "react-use-wizard";
import BackButtonWithTitle from "../../dashboard/BackButtonWithTitle";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { Toast } from "@/components/Toast/Toast";
import { CHANGE_EMAIL } from "@/services/apiService/apiEndPoints";
import { useRouter } from "next/navigation";

const ChangeEmail = ({ type }) => {
  const { nextStep } = useWizard();
  const [Email, setEmail] = useState("");
  const [CurrentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Restricted domains for employers (personal email providers)
  const restrictedDomains = [
    "@gmail.com",
    "@yahoo.com",
    "@aol.com",
    "@comcast.net",
    "@onmicrosoft.com",
    "@outlook.com",
    "@hotmail.com",
    "@live.com",
    "@protonmail.com",
    "@mail.com",
    "@zoho.com",
    "@icloud.com",
  ];

  // Whitelisted domains (allowed even for employers)
  const whitelistDomains = [
    "@partner.org",
    "@affiliate.net",
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: "Please enter a valid email address." };
    }

    // Additional validation for employers
    if (type === "employer") {
      const emailLower = email.toLowerCase();
      
      // Check if email is in whitelist
      const isWhitelisted = whitelistDomains.some(domain => 
        emailLower.endsWith(domain)
      );
      
      if (isWhitelisted) {
        return { valid: true, message: "" };
      }
      
      // Check if email uses restricted domain
      const isRestricted = restrictedDomains.some(domain => 
        emailLower.endsWith(domain)
      );
      
      if (isRestricted) {
        return { 
          valid: false, 
          message: "Personal email addresses are not allowed. Please use your company email address." 
        };
      }
    }

    return { valid: true, message: "" };
  };

  const onNext = async () => {
    let isValid = true;

    // Validate email
    const emailValidation = validateEmail(Email);
    if (!emailValidation.valid) {
      setEmailError(emailValidation.message);
      isValid = false;
    } else {
      setEmailError("");
    }

    // Validate password
    if (!CurrentPassword) {
      setPasswordError("Current password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isValid) return;

    setLoading(true);
    try {
      const response = await apiInstance.post(CHANGE_EMAIL, {
        email: Email,
        password: CurrentPassword,
      });
      if (response.status === 200 || response.status === 201) {
        Toast("success", response.data.message);
        nextStep();
      }
    } catch (error) {
      Toast(
        "error",
        error.response?.data?.errors?.email ||
        error.response?.data?.errors?.password ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <Box>
      <BackButtonWithTitle label="changing email address" />
      <Box sx={{ position: "relative", p: 1.5 }}>
        <TextInput
          Label="New Email Address"
          required={true}
          placeholder={type === "employer" ? "Enter Company Email" : "Enter Email"}
          value={Email}
          setValue={setEmail}
          error={!!emailError}
          helperText={emailError}
        />
        {emailError && (
          <Typography color="error" fontSize="0.9rem" mt={1}>
            {emailError}
          </Typography>
        )}
        {type === "employer" && !emailError && (
          <Typography color="text.secondary" fontSize="0.85rem" mt={1}>
            Company email addresses only. Personal email providers (Gmail, Yahoo, etc.) are not allowed.
          </Typography>
        )}
        <TextInput
          Label="Current Password"
          placeholder="Enter Current Password"
          type="password"
          required={true}
          value={CurrentPassword}
          setValue={setCurrentPassword}
          error={!!passwordError}
          helperText={passwordError}
        />
        {passwordError && (
          <Typography color="error" fontSize="0.9rem" mt={1}>
            {passwordError}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, p: 1.5 }}>
        <RalliButton
          label="Next"
          bg="#00305B"
          size="large"
          onClick={onNext}
          loading={loading}
        />
        <RalliButton label="Cancel" color="" size="large" onClick={handleBack}/>
      </Box>
    </Box>
  );
};

export default ChangeEmail;