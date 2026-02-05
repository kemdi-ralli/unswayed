"use client";

import { Box, CircularProgress } from "@mui/material";

export default function ApplicantLoading() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
      }}
    >
      <CircularProgress size={40} />
    </Box>
  );
}
