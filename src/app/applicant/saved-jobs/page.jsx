"use client";
import React, { useEffect, useState } from "react";
import Container from "@/components/common/Container";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { GET_SAVE_JOB, SAVE_JOB } from "@/services/apiService/apiEndPoints";
import { Toast } from "@/components/Toast/Toast";
import { useRouter } from "next/navigation";
import { encode } from "@/helper/GeneralHelpers";
import { Box, Grid, Typography } from "@mui/material";
import JobsCard from "@/components/applicant/dashboard/JobsCard";
import FormTitle from "@/components/applicant/dashboard/FormTitle";

const Page = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const router = useRouter();

  const getSavedJobs = async () => {
    const response = await apiInstance.get(`${GET_SAVE_JOB}?limit=100&page=1`);
    if (response.status === 200 || 201) {
      setSavedJobs(response.data.data.saved_jobs);
    }
  };
  const onUnsave = async (id) => {
    try {
      const response = await apiInstance.post(`${SAVE_JOB}/${id}`);
      if (response.status === 200 || 201) {
        setSavedJobs((prevJob) => prevJob.filter((el) => el.id !== id));
        Toast("success", response?.data?.message);
      }
    } catch (err) {
      Toast("error", err.message || "Failed to save");
    }
  };

  const onCardPress = (id) => {
    var encodeId = encode(id);
    router.push(`/applicant/job/${encodeId}`);
  };

  const handleEasyApply = (id) => {
    router.push(`/applicant/career-areas/easy-apply/${id}`);
  };

  useEffect(() => {
    getSavedJobs();
  }, []);

  return (
      <Container>
        <FormTitle label='Saved Jobs' />
        <Box sx={{ flexGrow: 1 }}>
          {savedJobs?.length > 0 ? (
            <Grid container spacing={2}>
              {savedJobs?.map((job, index) => (
                <Grid key={index} item xs={12} md={6}>
                  <JobsCard
                    item={job}
                    handleCard={() => onCardPress(job?.id)}
                    handleEasyApply={handleEasyApply}
                    handleJobSaved={onUnsave}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "90vh",
                width: "100%",
                flexDirection: "column",
              }}
            >
              <Typography
                sx={{ color: "#666", fontSize: "20px", fontWeight: "bold" }}
              >
               {"You Haven't Saved Any Jobs"}
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
  );
};

export default Page;
