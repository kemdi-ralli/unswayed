import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import RalliButton from "@/components/button/RalliButton";
import TextInput from "@/components/input/TextInput";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { CHANGE_PASSWORD } from "@/services/apiService/apiEndPoints";
import { Toast } from "@/components/Toast/Toast";
import { currentPasswordSchema } from "@/schemas/passwordSchema";

const ChangePassword = ({ handleClose }) => {
  const [CurrentPassword, setCurrentPassword] = useState("");
  const [NewPassword, setNewPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onUpdate = async () => {
    const values = {
      current_password: CurrentPassword,
      password: NewPassword,
      password_confirmation: ConfirmPassword,
    };

    try {
      await currentPasswordSchema.validate(values, { abortEarly: false });
      setErrors({});

      const formData = new FormData();
      formData.append("current_password", CurrentPassword);
      formData.append("password", NewPassword);
      formData.append("password_confirmation", ConfirmPassword);

      setLoading(true);
      const response = await apiInstance.post(CHANGE_PASSWORD, formData);

      if (response.status === 200 || response.status === 201) {
        Toast("success", response.data.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
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

        if (apiErrors.current_password) {
          formErrors.current_password = apiErrors.current_password;
        }
        if (apiErrors.password) {
          formErrors.password = apiErrors.password;
        }
        if (apiErrors.password_confirmation) {
          formErrors.password_confirmation = apiErrors.password_confirmation;
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

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: { xs: "20px", sm: "22px", md: "30px" },
            lineHeight: "18px",
            color: "#00305B",
            py: 2,
            pb: 3,
          }}
        >
          Change Password
        </Typography>
      </Box>
      <Box>
        <TextInput
          type="password"
          Label="Current Password"
          placeholder="Current Password"
          required={true}
          value={CurrentPassword}
          setValue={setCurrentPassword}
          error={errors.current_password}
        />
        {errors.current_password && (
          <Typography color="error" fontSize="0.9rem" mt={1}>
            {errors.current_password}
          </Typography>
        )}
        <TextInput
          type="password"
          Label="New Password"
          required={true}
          placeholder="New Password"
          value={NewPassword}
          setValue={setNewPassword}
          error={errors.password}
        />
        {errors.password && (
          <Typography color="error" fontSize="0.9rem" mt={1}>
            {errors.password}
          </Typography>
        )}
        <TextInput
          type="password"
          Label="Confirm Password"
          placeholder="Confirm Password"
          required={true}
          value={ConfirmPassword}
          setValue={setConfirmPassword}
          error={errors.password_confirmation}
        />
        {errors.password_confirmation && (
          <Typography color="error" fontSize="0.9rem" mt={1}>
            {errors.password_confirmation}
          </Typography>
        )}
      </Box>
      <Box sx={{ mt: 8 }}>
        <RalliButton label="Update" onClick={onUpdate} loading={loading} />
      </Box>
    </Box>
  );
};

export default ChangePassword;
