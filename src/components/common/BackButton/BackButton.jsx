"use client";
import React from "react";
import { Box, Button } from "@mui/material";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";

import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <Box
      sx={{
        px: "25px",
        maxWidth: "1260px",
        margin: "25px auto",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "100%" },
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          py: "15px",
          mb: "20px",
        }}
      >
        <Button onClick={handleBack} sx={{ minWidth: 0, p: 0 }}>
          <ArrowCircleLeftRoundedIcon sx={{ color: "#00305B", fontSize: 32 }} />
        </Button>
      </Box>
    </Box>
  );
};

export default BackButton;
