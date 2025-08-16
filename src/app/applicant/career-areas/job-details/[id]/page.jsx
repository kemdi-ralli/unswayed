"use client";
import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";
import ApplyNowCard from "@/components/applicant/dashboard/ApplyNowCard";
import JobsCardDetails from "@/components/applicant/dashboard/JobsCardDetails";
import Container from "@/components/common/Container";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAppliedData } from "@/redux/slices/applicantAppliedSpecificJob";
import { CAREER_JOBS_DETAILS } from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";

const JobsDetails = ({ params }) => {
  const [jobsDetails, setJobsDetails] = useState([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  const id = params.id;
  const router = useRouter();
  const dispatch = useDispatch();
  const handleBack = () => {
    router.back();
  };

  const handleApplyNow = (data) => {
    dispatch(setAppliedData(data));
    router.push(`/applicant/career-areas/job-details/${id}/apply`);
  };
  const getJobsDetails = async () => {
    setIsLoadingDetails(true);
    try {
      const response = await apiInstance.get(`${CAREER_JOBS_DETAILS}/${id}`);
      setJobsDetails(response?.data?.data?.job);
    } catch (error) {
      console.error("API Error:", error.response || error.message);
      // setErrors({
      //   message: error?.response?.data?.message || "Failed to load job details",
      // });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  useEffect(() => {
    getJobsDetails();
  }, []);
  return (
      <Container>
        <Box sx={styles.content}>
          <Button onClick={handleBack} sx={{ minWidth: 0, p: 0 }}>
            <ArrowCircleLeftRoundedIcon
              sx={{ color: "#00305B", fontSize: 32 }}
            />
          </Button>
        </Box>
        <JobsCardDetails data={jobsDetails} ApplyNow={handleApplyNow} />
      </Container>
  );
};

const styles = {
  content: {
    width: { xs: "100%", sm: "100%" },
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    py: "15px",
    mb: "20px",
  },
};

export default JobsDetails;
