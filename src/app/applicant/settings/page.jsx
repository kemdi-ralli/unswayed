"use client";
import React, { useEffect, useState, Suspense, lazy } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { PROFILE_SETTINGS } from "@/constant/applicant/profile";
import Container from "@/components/common/Container";
import BackButtonWithTitle from "@/components/applicant/dashboard/BackButtonWithTitle";
import { GET_PROFILE } from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";

const ProfileSettings = lazy(() =>
  import("@/components/applicant/settings/ProfileSettings")
);

const Page = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await apiInstance.get(GET_PROFILE);
      if (response.status === 200 || response.status === 201) {
        setProfile(response.data.data.user);
      } else {
        console.log("Failed to Get Your Profile");
      }
    } catch (error) {
      console.log("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);


  return (
      <Container>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress />
            <Typography ml={2}>Loading Profile Settings...</Typography>
          </Box>
        ) : (
          <>
            <BackButtonWithTitle label="Settings"/>
            <Suspense
              fallback={
                <Box display="flex" justifyContent="center" alignItems="center" height="30vh">
                  <CircularProgress />
                  <Typography ml={2}>Loading Settings...</Typography>
                </Box>
              }
            >
              <ProfileSettings data={PROFILE_SETTINGS} profile={profile} />
            </Suspense>
          </>
        )}
      </Container>
  );
};

export default Page;
