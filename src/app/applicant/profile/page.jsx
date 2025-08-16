"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import ProfileView from "@/components/applicant/profile/ProfileView";
import { useDispatch } from "react-redux";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { GET_PROFILE } from "@/services/apiService/apiEndPoints";
import { getResumes } from "@/redux/slices/getResumesSlice";
import BackButton from "@/components/common/BackButton/BackButton";
import { fetchProfile } from "@/helper/profileApiHelper";

const Page = () => {
  const [Profile, setProfile] = useState(null);
  const [isFetch, setIsFetch] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const loadProfile = async () => {
    setLoading(true);
    const userProfile = await fetchProfile();
    setProfile(userProfile);
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
    dispatch(getResumes());

    return () => {
      setProfile(null);
    };
  }, []);

  useEffect(() => {
    if (isFetch) {
      loadProfile().then(() => setIsFetch(false));
    }
  }, [isFetch]);

  return (
    <Box sx={{
      minHeight:'100vh'
    }}>
      <BackButton />
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <CircularProgress />
          <Typography ml={2}>Loading Profile...</Typography>
        </Box>
      ) : (
        <ProfileView
          Profile={Profile}
          setProfile={setProfile}
          setIsFetch={setIsFetch}
        />
      )}
    </Box>
  );
};

export default Page;
