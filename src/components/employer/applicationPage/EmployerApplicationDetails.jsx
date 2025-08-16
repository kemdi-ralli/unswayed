'use client'
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import { EMPLOYER_APPLICATION_DETAILS } from '@/constant/employer/applicationpage';

const formatApplicationDetails = (data) => {
  if (!data) return {};

  return {
    ...data,
    job: {
      ...data.job,
      job_type: data.job?.job_types?.map(type => type.name).join(", ") || "",
      job_location: data.job?.job_locations?.map(location => location.name).join(", ") || "",
      job_category: data.job?.job_categories?.map(category => category.name).join(", ") || "",
      job_shift: data.job?.job_shifts?.map(shift => shift.name).join(", ") || "",
    }
  };
};

const EmployerApplicationDetails = ({ data }) => {
  const formattedData = formatApplicationDetails(data);
  return (
    <Box>
      {EMPLOYER_APPLICATION_DETAILS?.map((item) => (
        <Box key={item.name} sx={{ mb: "20px" }}>
          <Typography
            sx={{
              fontSize: { xs: "12px", sm: "14px", md: "16px" },
              fontWeight: 500,
              lineHeight: { xs: "25px", sm: "30px", md: "24px", lg: "18px" },
              color: "#222222",
              mb: "5px",
            }}
          >
            {item?.title}
          </Typography>
          <Typography
            sx={{
              width: "100%",
              display: "block",
              padding: "18px 20px",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: 300,
              lineHeight: "18px",
              color: "#222222",
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 1px 5px #00000040",
            }}
          >
            {item?.type === 'application'
              ? formattedData?.[item.name]
              : formattedData?.job?.[item.name]}
          </Typography>
        </Box>
      ))}
      <Typography sx={{ fontSize: { xs: "10px", sm: "15px", md: "18px" }, fontWeight: 700, color: "#111111" }}>
        Resume
      </Typography>
      {formattedData?.resume && (
        <Box sx={{ px: "3px", mb: "40px" }}>
          <Box
            sx={{
              maxWidth: "570px",
              boxShadow: "0px 1px 5px #00000040",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              my: 1,
              border: "1px solid #ddd",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Image
                src="/assets/images/pdf.png"
                width={53.09}
                height={65.23}
                alt="Resume"
              />
              <Box sx={{ px: 2, pt: "10px" }}>
                <Typography sx={{ fontSize: { xs: "10px", sm: "15px", md: "18px" }, fontWeight: 700, color: "#111111" }}>
                  Resume
                </Typography>
                <Typography sx={{ fontSize: { xs: "10px", sm: "15px", md: "16px" }, fontWeight: 300, color: "#111111" }}>
                  {formattedData?.created_at}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="text"
              sx={{
                backgroundColor: "#00305B",
                color: '#FFF',
                fontSize: { xs: "9px", sm: "14px", lg: "16px" },
                lineHeight: "25px",
                fontWeight: 400,
              }}
              onClick={() => {
                const fileUrl = formattedData?.resume;
                if (fileUrl) {
                  const link = document.createElement("a");
                  link.href = fileUrl;
                  link.target = '_blank';
                  link.download = "resume.pdf";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } else {
                  console.error("Resume URL not available.");
                }
              }}
            >
              View
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default EmployerApplicationDetails;
