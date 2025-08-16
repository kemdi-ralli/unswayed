"use client";
import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import FollowersTabs from "./FollowesFollwingTabs";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { GET_NETWORK } from "@/services/apiService/apiEndPoints";

const MyConnections = () => {
  const [Followers, setFollowers] = useState([]);
  const [Followings, setFollowings] = useState([]);

  const fetchNetwork = async (search = "", limit = 10, page = 1) => {
    const response = await apiInstance.get(
      `${GET_NETWORK}?search=${search}&limit=${limit}&page=${page}`
    );
    console.log(response);
    if (response.status === 200 || 201) {
      setFollowers(response.data.data.followers);
      setFollowings(response.data.data.followings);
    }
  };

  useEffect(() => {
    fetchNetwork();
  }, []);
  return (
    <Box sx={{ px: "25px", maxWidth: "1260px", margin: "25px auto" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <FollowersTabs followers={Followers} following={Followings} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MyConnections;
