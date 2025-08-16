"use client";
import React, { useEffect, useState, lazy, Suspense } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";
import { GET_JOB_DETAIL } from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { decode } from "@/helper/GeneralHelpers";
import Container from "@/components/common/Container";

const JobsCardDetails = lazy(() => import("@/components/applicant/dashboard/JobsCardDetails"));

const JobDetail = ({ params }) => {
  const [jobDetail, setJobDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const id = params.id;
  const decodeId = decode(id);
  const router = useRouter();

  const fetchJobDetail = async () => {
    try {
      setLoading(true);
      const response = await apiInstance.get(`${GET_JOB_DETAIL}/${decodeId}`);
      if (response.status === 200 || response.status === 201) {
        setJobDetail(response.data.data.job);
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  return (
      <Container>
        <Box
          sx={{
            width: "100%",
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
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Suspense fallback={<Box sx={{ display: "flex", justifyContent: "center", py: 5 }}><CircularProgress /></Box>}>
            <JobsCardDetails data={jobDetail} />
          </Suspense>
        )}
      </Container>
  );
};

export default JobDetail;
