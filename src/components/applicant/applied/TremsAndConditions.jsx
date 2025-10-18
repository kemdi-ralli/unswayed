"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import RalliButton from "@/components/button/RalliButton";
import { useWizard } from "react-use-wizard";
import BackbuttonWithTitle from "./BackbuttonWithTitle";
import { usePathname } from "next/navigation";

const TremsAndConditions = ({ data }) => {
  const pathname = usePathname();
  const { nextStep } = useWizard();

  const shouldShowButton = pathname.includes("/career-areas");

  const handleAccept = () => {
    if (shouldShowButton) {
      nextStep();
    }
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <BackbuttonWithTitle title={data?.mainTitle} />
      <Box sx={{ maxHeight: "600px", overflowY: "scroll", py: 2 }}>
        <Typography
          sx={{
            fontSize: { xs: "12px", sm: "16px", md: "16px" },
            fontWeight: 500,
            lineHeight: { xs: "25px", sm: "30px", md: "24px", lg: "34px" },
            color: "#0c8229ff",
          }}
        >
          Last updated: {data?.time}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "12px", sm: "14px", md: "16px" },
            fontWeight: 300,
            lineHeight: { xs: "25px", sm: "30px", md: "24px", lg: "34px" },
            color: "#111111",
            pb: 3,
          }}
        >
          {data?.para}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "18px", sm: "21px", md: "22px" },
            fontWeight: 800,
            lineHeight: { xs: "25px", sm: "30px", md: "25px", lg: "18px" },
            color: "#0c8229ff",
          }}
        >
          {data?.title}
        </Typography>

        {data?.items?.map((item, index) => (
          <Box key={index}>
            <Typography
              sx={{
                fontSize: { xs: "18px", sm: "21px", md: "19px" },
                fontWeight: 800,
                lineHeight: { xs: "25px", sm: "30px", md: "25px", lg: "28.5px" },
                color: "#0c8229ff",
                pb: 1,
              }}
            >
              {item?.mainTitle}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "18px", sm: "21px", md: "19px" },
                fontWeight: 600,
                lineHeight: { xs: "25px", sm: "30px", md: "25px", lg: "28.5px" },
                color: "#0c8229ff",
              }}
            >
              {item?.title}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "12px", sm: "14px", md: "16px" },
                fontWeight: 300,
                lineHeight: { xs: "25px", sm: "30px", md: "25px", lg: "34px" },
                color: "#111111",
                pb: 2,
              }}
            >
              {item?.description}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "18px", sm: "21px", md: "19px" },
                fontWeight: 600,
                lineHeight: { xs: "25px", sm: "30px", md: "25px", lg: "28.5px" },
                color: "#000",
                pl: 3
              }}
            >
              {item?.subTitle}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "12px", sm: "14px", md: "16px" },
                fontWeight: 300,
                lineHeight: { xs: "25px", sm: "30px", md: "25px", lg: "34px" },
                color: "#111111",
                pl: 3
              }}
            >
              {item?.subDescription}
            </Typography>
          </Box>
        ))}

        <Typography
          sx={{
            fontSize: { xs: "12px", sm: "14px", md: "16px" },
            fontWeight: 300,
            lineHeight: { xs: "25px", sm: "30px", md: "25px", lg: "34px" },
            color: "#111111",
            pl: { md: 3 },
          }}
        >
          By email: contact@rallitechnologies.onmicrosoft.com
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "12px", sm: "14px", md: "16px" },
            fontWeight: 300,
            lineHeight: { xs: "25px", sm: "30px", md: "25px", lg: "34px" },
            color: "#111111",
            pl: { md: 3 },
          }}
        >
          By visiting this page on our website: https://www.rallitechnologies.com/contact-6
        </Typography>
      </Box>

      {shouldShowButton && (
        <Box sx={{ pt: 2 }}>
          <RalliButton label={"Accept"} onClick={handleAccept} />
        </Box>
      )}
    </Box>
  );
};

export default TremsAndConditions;
