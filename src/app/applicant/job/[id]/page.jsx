"use client";

import React, { useEffect, useState } from "react";
import JobsCardDetails from "@/components/applicant/dashboard/JobsCardDetails";
import Container from "@/components/common/Container";
import { Box, Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";
import { GET_JOB_DETAIL, SAVE_JOB } from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { decode } from "@/helper/GeneralHelpers";
import { useDispatch } from "react-redux";
import { setAppliedData } from "@/redux/slices/applicantAppliedSpecificJob";
import { Toast } from "@/components/Toast/Toast";

const JobDetail = ({ params }) => {
  const [jobDetail, setJobDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const id = params.id;
  const router = useRouter();
  const dispatch = useDispatch();

  // Go back
  const handleBack = () => router.back();

  // Internal apply only
  const handleApplyNow = (data) => {
    dispatch(setAppliedData(data));
    router.push(`/applicant/career-areas/job-details/${id}/apply`);
  };

  // Save backend job only
  const handleJobSaved = async (jobId) => {
    if (!jobDetail) return;

    if (jobDetail.isRapid) return; // cannot save external jobs

    const newState = !jobDetail.is_saved;
    setJobDetail((prev) => ({ ...prev, is_saved: newState }));

    try {
      const response = await apiInstance.post(`${SAVE_JOB}/${jobId}`);

      if (response?.data?.status !== "success") {
        throw new Error(response?.data?.message || "Failed to save job");
      }

      Toast("success", response?.data?.message);
    } catch (error) {
      // revert state on failure
      setJobDetail((prev) => ({ ...prev, is_saved: !newState }));
      Toast("error", error.message || "Failed to save");
    }
  };

  /**
   * ============================================================
   * LOAD JOB DETAILS — UPDATED LOGIC
   * Detects RapidAPI JSON encoded job vs backend numeric ID
   * ============================================================
   */
const loadJobDetails = async () => {
  setLoading(true);

  try {
    // Detect if params.id is an object (RapidAPI) or string (backend)
    const maybeJob = typeof id === "object" ? id : decode(id);

    // If it's an object, treat as RapidAPI job
    if (maybeJob && maybeJob.job_title) {
      setJobDetail({
        ...maybeJob,
        is_saved: false, // default behavior for external jobs
        external_source: "rapidapi",
      });
      return;
    }

    // Otherwise, backend job path
    const response = await apiInstance.get(`${GET_JOB_DETAIL}/${maybeJob}`);
    if (response.status === 200 || response.status === 201) {
      setJobDetail(response.data.data.job);
    }
  } catch (error) {
    console.error("Error loading job details:", error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    loadJobDetails();
  }, [id]);

  return (
    <Container>
      {/* Back Button */}
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

      {/* LOADING STATE */}
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
        <JobsCardDetails
          data={jobDetail}
          ApplyNow={jobDetail?.isRapid ? null : handleApplyNow}
          OnSave={jobDetail?.isRapid ? null : handleJobSaved}
        />
      )}
    </Container>
  );
};

export default JobDetail;
