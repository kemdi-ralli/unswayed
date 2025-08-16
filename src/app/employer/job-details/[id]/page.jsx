"use client";
import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";
import ApplyNowCard from "@/components/applicant/dashboard/ApplyNowCard";
import JobsCardDetails from "@/components/applicant/dashboard/JobsCardDetails";
import { JOBS_FOR_YOU_CAREER_AREA_PAGE } from "@/constant/applicant/jobstab";
import Container from "@/components/common/Container";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { GET_JOB_DETAIL } from "@/services/apiService/apiEndPoints";

const JobsDetails = ({ params }) => {
  const [jobDetail, setJobDetail] = useState(null);
  const id = params.id;
  const router = useRouter();
  const dispatch = useDispatch();
  const handleBack = () => {
    router.back();
  };

  const fetchJobDetail = async () => {
    const response = await apiInstance.get(`${GET_JOB_DETAIL}/${id}`);
    if (response.status === 200 || 201) {
      setJobDetail(response.data.data.job);
    }
  };

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  console.log(jobDetail);
  return (
      <Container>
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
            <ArrowCircleLeftRoundedIcon
              sx={{ color: "#00305B", fontSize: 32 }}
            />
          </Button>
        </Box>
        <JobsCardDetails data={jobDetail} />
      </Container>
  );
};

export default JobsDetails;
