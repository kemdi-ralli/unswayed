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

const ChangeEmail = () => {
  const { nextStep } = useWizard();
  const [Email, setEmail] = useState("");
  const [CurrentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onNext = async () => {
    let isValid = true;

    if (!validateEmail(Email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!CurrentPassword) {
      setPasswordError("Current password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isValid) return;

    const formData = new FormData();
    formData.append("email", Email);
    formData.append("password", CurrentPassword);
    setLoading(true);
    try {
      const response = await apiInstance.post(CHANGE_EMAIL, formData);
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
          placeholder="Enter Email"
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
