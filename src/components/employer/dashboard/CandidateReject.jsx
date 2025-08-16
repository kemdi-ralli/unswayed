"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import RalliButton from "@/components/button/RalliButton";

const CandidateReject = ({ onAction = () => {}, onClose = () => {} }) => {

  const handleYes = () => {
    onAction({
      'type' : 'reject'
    });
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography
          sx={{ fontWeight: 600, fontSize: "30px", color: "#00305B", padding: '10px' }}
        >
          Are You Sure ?
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <RalliButton label="Yes" onClick={handleYes} />
        <RalliButton label="No" bg="#00305B" onClick={onClose} />
      </Box>
    </Box>
  );
};

export default CandidateReject;
