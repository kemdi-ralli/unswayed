import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import RalliButton from "@/components/button/RalliButton";
import { useWizard } from "react-use-wizard";
import TextInput from "@/components/input/TextInput";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { SEND_RESET_OTP } from "@/services/apiService/apiEndPoints";
import { Toast } from "@/components/Toast/Toast";
import { emailValidation } from "@/schemas/validations";

const PasswordRecovery = ({ setUserEmail = () => { } }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { nextStep } = useWizard();

  const handleNext = async () => {
    setError("");
    try {
      await emailValidation.validate(email);
      setLoading(true);
  
      const response = await apiInstance.post(SEND_RESET_OTP, { email });
      if (response.status === 200 || response.status === 201) {
        setUserEmail(email);
        Toast("success", response?.data?.message);
        nextStep();
      }
    } catch (err) {
      // Handle validation errors and API errors
      if (err?.response?.data?.errors?.email) {
        const errorMessage = err.response.data.errors.email[0] || "This email address is not registered";
        setError(errorMessage);
        Toast("error", errorMessage);
      } else if (err?.response?.data?.message) {
        const errorMessage = err.response.data.message;
        setError(errorMessage);
        Toast("error", errorMessage);
      } else if (err?.message) {
        // Yup validation error
        setError(err.message);
        Toast("error", err.message);
      } else {
        const errorMessage = "This email address is not registered in our system";
        setError(errorMessage);
        Toast("error", errorMessage);
      }
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
          Please enter your email to reset your password.
        </Typography>
      </Box>
      <Box>
        <TextInput
          placeholder="Enter Email"
          value={email}
          setValue={setEmail}
          Label={"Enter Email"}
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

export default PasswordRecovery;
