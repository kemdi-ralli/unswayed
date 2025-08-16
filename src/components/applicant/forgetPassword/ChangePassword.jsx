"use client";
import React, { useState } from "react";
import { Box, Typography, } from "@mui/material";
import RalliButton from "@/components/button/RalliButton";
import TextInput from "@/components/input/TextInput";
import { RESET_PASSWORD } from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { Toast } from "@/components/Toast/Toast";
import { passwordSchema } from "@/schemas/passwordSchema";

const ChangePassword = ({ Email, token, handleClose }) => {
  const [NewPassword, setNewPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    password: "",
    password_confirmation: "",
  });


  const handleNext = async () => {
    setErrors({ password: "", password_confirmation: "" });

    try {
      await passwordSchema.validate(
        {
          password: NewPassword,
          password_confirmation: ConfirmPassword,
        },
        { abortEarly: false }
      );
      const formData = new FormData();
      formData.append("email", Email);
      formData.append("token", token);
      formData.append("password", NewPassword);
      formData.append("password_confirmation", ConfirmPassword);

      const response = await apiInstance.post(RESET_PASSWORD, formData);
      if (response.status === 200 || response.status === 201) {
        Toast("success", response.data.message);
        handleClose()
      }
    } catch (err) {
      if (err?.inner) {
        const newErrors = { password: "", password_confirmation: "" };
        err.inner.forEach((e) => {
          newErrors[e.path] = e.message;
        });
        setErrors(newErrors);
        Toast("error", "Please fix the errors and try again.");
      } else {
        Toast("error", err?.response?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <Box
      sx={{
        px: { md: "80px" },
        py: { md: 4 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Password Recovery
        </Typography>
        <Typography color="textSecondary" mb={3}>
          Set New Password
        </Typography>
      </Box>
      <TextInput
        placeholder="New Password"
        Label="New Password"
        value={NewPassword}
        setValue={setNewPassword}
      />
      {errors.password && (
        <Typography color="error" fontSize="0.9rem" mt={1}>
          {errors.password}
        </Typography>
      )}

      <TextInput
        placeholder="Confirm Password"
        Label="Confirm Password"
        value={ConfirmPassword}
        setValue={setConfirmPassword}
      />
      {errors.password_confirmation && (
        <Typography color="error" fontSize="0.9rem" mt={1}>
          {errors.password_confirmation}
        </Typography>
      )}
      <Box sx={{py:2}}>
        <RalliButton label="Update" onClick={handleNext} />
      </Box>
    </Box>
  );
};

export default ChangePassword;
