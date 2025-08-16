"use client";
import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import BackButtonWithTitle from "../../dashboard/BackButtonWithTitle";
import { useWizard } from "react-use-wizard";
import TextInput from "@/components/input/TextInput";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { VERIFICATION_SETTING_OTP } from "@/services/apiService/apiEndPoints";
import { Toast } from "@/components/Toast/Toast";
import { useRouter } from "next/navigation";
import { otpSchema } from "@/schemas/changePhoneSchema";

const VerifyNumber = ({ type }) => {
  const { previousStep } = useWizard();
  const [loading, setLoading] = useState(false);
  const [OTP, setOTP] = useState("");
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleSubmit = async () => {
    const values = { otp: OTP };

    try {
      await otpSchema.validate(values, { abortEarly: false });
      setErrors({});
      setLoading(true);

      const formData = new FormData();
      formData.append("type", type);
      formData.append("otp", OTP);

      const response = await apiInstance.post(
        VERIFICATION_SETTING_OTP,
        formData
      );

      if (response.status === 201 || response.status === 200) {
        router.push("/applicant/settings");
      }
    } catch (err) {
      if (err.name === "ValidationError") {
        const formErrors = {};
        err.inner.forEach((e) => {
          formErrors[e.path] = e.message;
        });
        setErrors(formErrors);
      } else {
        const message = err.response?.data?.message || "Something went wrong";
        Toast("error", message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <BackButtonWithTitle label="verify your phone number" />

      <Typography
        sx={{
          fontSize: "16px",
          lineHeight: "18px",
          color: "#00305B",
          textTransform: "capitalize",
          textAlign: "center",
          py: 2,
        }}
      >
        verification code sent: enter the code you received below
      </Typography>

      <TextInput
        Label="Enter Verification OTP"
        value={OTP}
        setValue={setOTP}
        placeholder="Enter Verification OTP"
        error={errors.otp}
      />
      {errors.otp && (
        <Typography color="error" fontSize="0.9rem" mt={1}>
          {errors.otp}
        </Typography>
      )}

      <Button
        type="submit"
        sx={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#FE4D82",
          color: "#FFFFFF",
          fontSize: "16px",
          fontWeight: 600,
          textTransform: "none",
          borderRadius: "10px",
          mt: 3,
          ":hover": {
            backgroundColor: "#FE4D90",
          },
        }}
        disabled={loading}
        onClick={handleSubmit}
      >
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </Box>
  );
};

export default VerifyNumber;
