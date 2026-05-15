"use client";
import React from "react";
import { Box } from "@mui/material";
import LexiPanel from "@/components/Lexi/LexiPanel";
import BackButtonWithTitle from "@/components/applicant/dashboard/BackButtonWithTitle";

/**
 * /assistant — full-page Lexi AI chat route.
 * Shares the same LexiContext (and therefore session + messages) provided
 * by CustomLayout, so the widget and this page are always in sync.
 */
const AssistantPage = () => {
  return (
    <Box
      sx={{
        px: { xs: "16px", sm: "25px" },
        maxWidth: "900px",
        margin: "25px auto",
      }}
    >
      <BackButtonWithTitle label="Lexi AI" />

      <Box
        sx={{
          height: { xs: "calc(100vh - 180px)", md: "calc(100vh - 160px)" },
          minHeight: 500,
          maxHeight: 820,
          borderRadius: "16px",
          boxShadow: "0px 4px 24px rgba(0,0,0,0.09)",
          overflow: "hidden",
          mt: 2,
        }}
      >
        <LexiPanel isWidget={false} />
      </Box>
    </Box>
  );
};

export default AssistantPage;
