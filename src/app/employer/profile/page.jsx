"use client";
import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

import Container from "@/components/common/Container";
import BackButtonWithTitle from "@/components/applicant/dashboard/BackButtonWithTitle";
import EmployerProfile from "@/components/employer/profile/EmployerProfile";
import { fetchProfile } from "@/services/apiService/profileService"; // <-- imported

const Page = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      const data = await fetchProfile();
      if (!mounted) return;
      setProfile(data);
      setLoading(false);
    };
    loadProfile();
    return () => { mounted = false; };
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