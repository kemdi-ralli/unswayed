"use client";
import React from "react";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import { VisibilityOff } from "@mui/icons-material";

import { useWizard } from "react-use-wizard";
import RalliButton from "@/components/button/RalliButton";
import { useRouter } from "next/navigation";
import FormTitle from "@/components/applicant/dashboard/FormTitle";

const SearchAbleOnRalli = ({ data }) => {
  const { previousStep } = useWizard();

  const router = useRouter();
  const handleNext = () => {
    router.push("/applicant/career-areas/uploadResume");
  };
  const handleBack = () => {
    previousStep();
  };
  return (
    <Box>
      <Box
        sx={{
          width: { xs: "100%", sm: "100%" },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: "15px",
          mb: "10px",
        }}
      >
        <Button onClick={handleBack} sx={{ minWidth: 0, p: 0 }}>
          <ArrowCircleLeftRoundedIcon sx={{ color: "#00305B", fontSize: 32 }} />
        </Button>
      </Box>
      <Box>
        <Typography
          sx={{
            fontSize: { xs: "10px", sm: "15px", md: "16px" },
            fontWeight: 300,
            lineHeight: { xs: "12px", sm: "20px", md: "25px", lg: "33px" },
            color: "#111111",
            pb: 2,
          }}
        >
          {data.pages}
        </Typography>
        <FormTitle label={data?.title} />
      </Box>
      {data?.boxData?.map((item) => (
        <>
          <Box
            sx={{
              border: "0.6px solid #0000004D",
              borderRadius: "10px",
              p: 2,
              my: 2,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box
                sx={{
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <VisibilityOff />
                <Typography sx={{ px: 3 }}>{item?.title}</Typography>
              </Box>
              <PanoramaFishEyeIcon />
            </Box>
            <Box>
              <Typography>{item?.para}</Typography>
            </Box>
          </Box>
        </>
      ))}
      <Box
        sx={{
          pb: 3,
        }}
      >
        <RalliButton label="Save and Continue" onClick={handleNext} />
      </Box>
    </Box>
  );
};

export default SearchAbleOnRalli;
