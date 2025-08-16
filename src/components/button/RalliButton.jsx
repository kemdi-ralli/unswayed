"use client";
import React from "react";
import { Box, Button as MuiButton, CircularProgress } from "@mui/material";

const RalliButton = ({
  label,
  onClick,
  bg,
  size = "medium",
  disableValue = false,
  loading = false,
}) => {
  const sizeStyles = {
    small: {
      padding: "6px 16px",
      fontSize: { xs: "11px", sm: "14px", md: "16px" },
      lineHeight: { xs: "12px", sm: "22px", md: "22px" },
      width: "40%",
    },
    medium: {
      padding: "10px 18px",
      fontSize: { xs: "11px", sm: "14px", md: "16px" },
      lineHeight: { xs: "12px", sm: "22px", md: "22px" },
      width: "70%",
    },
    large: {
      padding: "6px 16px",
      fontSize: { xs: "11px", sm: "14px", md: "16px" },
      lineHeight: { xs: "12px", sm: "22px", md: "22px" },
      width: "100%",
    },
  };

  return (
    <Box width="100%" display="flex" justifyContent="center">
      <MuiButton
        variant="contained"
        onClick={() => {
          if (!loading && onClick) onClick();
        }}
        sx={{
          backgroundColor: bg || "#FE4D82",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: bg || "#FE4D89",
          },
          borderRadius: "8px",
          textTransform: "none",
          ...sizeStyles[size],
        }}
        disabled={disableValue || loading}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: "#fff" }} />
        ) : (
          label
        )}
      </MuiButton>
    </Box>
  );
};

export default RalliButton;
