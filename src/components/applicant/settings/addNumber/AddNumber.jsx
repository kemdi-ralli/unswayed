"use client";
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import RalliButton from "@/components/button/RalliButton";
import BackButtonWithTitle from "../../dashboard/BackButtonWithTitle";
import { useWizard } from "react-use-wizard";

import TextInput from "@/components/input/TextInput";
import PhoneInput from "@/components/input/PhoneInput";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { CHANGE_PHONE_NUMBER } from "@/services/apiService/apiEndPoints";
import { Toast } from "@/components/Toast/Toast";
import { changePhoneSchema } from "@/schemas/changePhoneSchema"; 
import { useRouter } from "next/navigation";

const AddNumber = ({ profile }) => {
  const { nextStep, previousStep } = useWizard();
  const [Phone, setPhone] = useState("");
  const [Password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    const values = { phone: Phone, password: Password };

    try {
      await changePhoneSchema.validate(values, { abortEarly: false });
      setErrors({});

      const formData = new FormData();
      formData.append("phone", Phone);
      formData.append("password", Password);

      setLoading(true);
      const response = await apiInstance.post(CHANGE_PHONE_NUMBER, formData);

      if (response.status === 200 || response.status === 201) {
        Toast("success", response?.data?.message);
        nextStep();
      }
    } catch (err) {
      if (err.name === "ValidationError") {
        const formErrors = {};
        err.inner.forEach((e) => {
          formErrors[e.path] = e.message;
        });
        setErrors(formErrors);
      } else if (err.response?.data?.errors) {
        const apiErrors = err.response.data.errors;
        const formErrors = {};
        if (apiErrors.phone) {
          formErrors.phone = apiErrors.phone;
        }
        if (apiErrors.password) {
          formErrors.password = apiErrors.password;
        }
        setErrors(formErrors);
        Toast("error", "Please fix the highlighted errors.");
      } else {
        Toast("error", "Something went wrong");
      }
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
      <BackButtonWithTitle label="add and verify your phone number" />

      <Box sx={{ marginTop: "65px", marginBottom: "35px" }}>
        <PhoneInput
          Label="Enter Phone Number"
          required={true}
          value={Phone}
          setValue={setPhone}
          error={errors.phone}
        />
        {errors.phone && (
          <Typography color="error" fontSize="0.9rem" mt={1}>
            {errors.phone}
          </Typography>
        )}

        {profile?.provider === "manual" && (
          <>
            <TextInput
              Label="Current Password"
                required={true}
              placeholder="Enter Current Password"
              value={Password}
              setValue={setPassword}
              type="password"
              error={errors.password}
            />
            {errors.password && (
              <Typography color="error" fontSize="0.9rem" mt={1}>
                {errors.password}
              </Typography>
            )}
          </>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: "15px" }}>
        <RalliButton
          label="Next"
          bg="#00305B"
          onClick={handleNext}
          loading={loading}
        />
        <RalliButton label="Cancel" color="" onClick={handleBack} />
      </Box>
    </Box>
  );
};

export default AddNumber;
