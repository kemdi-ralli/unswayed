import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import RalliButton from "@/components/button/RalliButton";
import { useWizard } from "react-use-wizard";
import TextInput from "@/components/input/TextInput";
import { Toast } from "@/components/Toast/Toast";
import { VERIFY_RESET_OTP } from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { otpValidation } from "@/schemas/passwordSchema";

const VerficationCode = ({ Email, setToken = () => { } }) => {
  const { nextStep } = useWizard();
  const [OTP, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNext = async () => {
    setError("");
    try {
      await otpValidation.validate(OTP);

      setLoading(true);
      const formData = new FormData();
      formData.append("email", Email);
      formData.append("otp", OTP);
      const response = await apiInstance.post(VERIFY_RESET_OTP, formData);
      if (response.status === 200 || response.status === 201) {
        setToken(response?.data?.data?.token);
        Toast("success", response?.data?.message);
        nextStep();
      }
    } catch (err) {
      const backendError = err?.response?.data?.message;
      const frontendError = err?.message;

      setError(backendError || frontendError || "Something went wrong");
      Toast("error", backendError || frontendError);
    } finally {
      setLoading(false);
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
          Enter verification code
        </Typography>
      </Box>
      <Box>
        <TextInput
          placeholder="Verification Code "
          value={OTP}
          setValue={(val) => setOTP(val.replace(/\D/g, ""))}
          Label={"Enter OTP"}
        />
        {error && (
          <Typography color="error" fontSize="0.9rem" mt={1}>
            {error}
          </Typography>
        )}
        <Box sx={{ py: 2 }}>
          <RalliButton label="Continue" onClick={handleNext} loading={loading} />
        </Box>
      </Box>
    </Box>
  );
};

export default VerficationCode;
