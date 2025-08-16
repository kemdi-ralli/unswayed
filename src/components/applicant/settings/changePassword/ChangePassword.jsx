"use client";
import React, { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import RalliButton from "@/components/button/RalliButton";

const ChangePassword = ({ data }) => {
  const [formValues, setFormValues] = useState({
    newEmail: "",
    currentPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formValues);
  };

  return (
    <Box>
      {data?.map((item) => (
        <Box key={item.name} sx={{ position: "relative", mb: 2 }}>
          <Typography
            sx={{
              fontSize: "16px",
              lineHeight: "18px",
              fontWeight: 500,
              pb: { xs: "10px", md: "15px" },
              textTransform: "capitalize",
            }}
          >
            {item?.label}
          </Typography>
          <Box
            component="input"
            type={
              item.name === "currentPassword" && !showPassword
                ? "password"
                : "text"
            }
            name={item.name}
            value={formValues[item.name]}
            onChange={handleChange}
            placeholder={item.placeholder}
            sx={{
              px: "18px",
              py: "22px",
              borderRadius: "10px",
              boxShadow: "0px 0px 3px #00000040",
              width: "100%",
              border: "none",
            }}
          />
          {item.name === "currentPassword" && (
            <IconButton
              onClick={handleTogglePasswordVisibility}
              sx={{
                position: "absolute",
                right: "10px",
                top: "67%",
                transform: "translateY(-50%)",
                color: "#222222",
              }}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          )}
        </Box>
      ))}
      <Box sx={{py:2}}>
        <RalliButton label="Save" bg="#00305B" />
      </Box>
        <RalliButton label="Cancel" color="" />
    </Box>
  );
};

export default ChangePassword;
