"use client";
import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

import Container from "@/components/common/Container";
import BackButtonWithTitle from "@/components/applicant/dashboard/BackButtonWithTitle";
import EmployerProfile from "@/components/employer/profile/EmployerProfile";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { EMPLOYER_GET_PROFILE } from "@/services/apiService/apiEndPoints";

async function fetchProfile() {
  try {
    const response = await apiInstance.get(EMPLOYER_GET_PROFILE);
    return response?.data?.data?.user || {};
  } catch (err) {
    console.error("Error fetching profile:", err);
    return {};
  }
}

const Page = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await fetchProfile();
      setProfile(data);
      setLoading(false);
    };
    loadProfile();
  }, []);

  return (
    <Container>
      <BackButtonWithTitle label="Employer Profile" />
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
          <Typography ml={2}>Loading Profile...</Typography>
        </Box>
      ) : (
        <EmployerProfile data={profile} />
      )}
    </Container>
  );
};

export default Page;
