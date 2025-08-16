"use client";

import React, { useEffect, useState } from "react";
import { Box, Grid, Skeleton, Typography } from "@mui/material";
import Container from "@/components/common/Container";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { GET_NETWORKS_JOBS } from "@/services/apiService/apiEndPoints";
import { useRouter } from "next/navigation";
import { encode } from "@/helper/GeneralHelpers";
import EmployerJobCard from "@/components/employer/homePage/EmployerJobCard";

const Page = () => {
  const [networkJobs, setNetworkJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchNetworkJobs = async (limit = 100, page = 1) => {
    try {
      const response = await apiInstance.get(
        `${GET_NETWORKS_JOBS}?limit=${limit}&page=${page}`
      );
      if (response.status === 200 || response.status === 201) {
        setNetworkJobs(response.data.data.jobs);
      }
    } catch (error) {
      console.error("Error fetching network jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkJobs();
  }, []);

  const onViewDetail = (id) => {
    const encodeId = encode(id);
    router.push(`/employer/job/${encodeId}`);
  };

  const onEmployerClick = (id) => {
    const encodedId = encode(id);
    router.push(`/profile/${encodedId}`);
  };

  return (
    <Container>
      <Box sx={{ flexGrow: 1, minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {loading ? (
          <Grid container spacing={2}>
            {Array.from(new Array(6)).map((_, index) => (
              <Grid key={index} item xs={12} md={6}>
                <Skeleton variant="rectangular" height={230} sx={{ borderRadius: "10px" }} />
              </Grid>
            ))}
          </Grid>
        ) : networkJobs.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              height: "100%",
              width: "100%",
            }}
          >
              <Typography variant="h4" color="#666">
                No data found
              </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {networkJobs.map((job, index) => (
              <Grid key={index} item xs={12} md={6}>
                <EmployerJobCard data={job} onView={onViewDetail} onEmployerClick={onEmployerClick} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );  
};

export default Page;
