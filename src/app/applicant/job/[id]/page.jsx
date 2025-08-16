"use client";

import React, { useEffect, useState } from "react";
import JobsCardDetails from "@/components/applicant/dashboard/JobsCardDetails";
import Container from "@/components/common/Container";
import { Box, Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";
import { GET_JOB_DETAIL } from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { decode } from "@/helper/GeneralHelpers";
import { useDispatch } from "react-redux";
import { setAppliedData } from "@/redux/slices/applicantAppliedSpecificJob";

const JobDetail = ({ params }) => {
  const [jobDetail, setJobDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const id = params.id;
  const decodeId = decode(id);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleBack = () => {
    router.back();
  };

  const handleApplyNow = (data) => {
    dispatch(setAppliedData(data));
    router.push(`/applicant/career-areas/job-details/${decodeId}/apply`);
  };

  const fetchJobDetail = async () => {
    setLoading(true);
    try {
      const response = await apiInstance.get(`${GET_JOB_DETAIL}/${decodeId}`);
      if (response.status === 200 || 201) {
        setJobDetail(response.data.data.job);
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

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
          <ArrowCircleLeftRoundedIcon sx={{ color: "#00305B", fontSize: 32 }} />
        </Button>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <JobsCardDetails data={jobDetail} ApplyNow={handleApplyNow} />
      )}

    </Container>
  );
};

export default JobDetail;
