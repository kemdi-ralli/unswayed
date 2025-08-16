"use client";
import React, { useEffect, useState, lazy, Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import { EMPLOYER_PROFILE_SETTINGS } from "@/constant/employer/profile";
import Container from "@/components/common/Container";
import BackButtonWithTitle from "@/components/applicant/dashboard/BackButtonWithTitle";
import { EMPLOYER_GET_PROFILE } from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";

const ProfileSettings = lazy(() => import("@/components/applicant/settings/ProfileSettings"));

const Page = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await apiInstance.get(EMPLOYER_GET_PROFILE);
      if (response.status === 200 || response.status === 201) {
        setProfile(response.data.data.user);
      } else {
        console.error("Failed to Get Your Profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
      <Container>
        <BackButtonWithTitle label="Settings"/>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Suspense
            fallback={
              <Box display="flex" justifyContent="center" mt={3}>
                <CircularProgress />
              </Box>
            }
          >
            <ProfileSettings data={EMPLOYER_PROFILE_SETTINGS} profile={profile} />
          </Suspense>
        )}
      </Container>
  );
};

export default Page;
