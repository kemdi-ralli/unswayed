"use client"

import React from "react"
import { Box, Typography, Card, Button } from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

const ResumeAssistant: React.FC = () => {
  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        maxWidth: 420,
        textAlign: "center",
        mx: "auto",
      }}
    >
      {/* Success header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 28, mr: 1 }} />
        <Typography variant="subtitle1" fontWeight={600}>
          Resume Generated Successfully
        </Typography>
      </Box>

      {/* Prop resume snippet */}
      <Box
        sx={{
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 1,
          p: 1.5,
          textAlign: "left",
          bgcolor: "background.default",
          mb: 2,
        }}
      >
        <Typography variant="body2" fontWeight={600}>
          UCN 10050
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Product Manager | 5+ years experience
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          • Led cross-functional teams to launch 3 SaaS products.<br />
          • Increased user retention by 27% through data-driven UX improvements.<br />
          • Skilled in Agile, SQL, and stakeholder management.
        </Typography>
      </Box>

      {/* Actions */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
        <Button variant="contained" size="small" sx={{ textTransform: "none" }}>
          Download PDF
        </Button>
        <Button variant="outlined" size="small" sx={{ textTransform: "none" }}>
          Optimize for ATS
        </Button>
      </Box>
    </Card>
  )
}

export default ResumeAssistant
