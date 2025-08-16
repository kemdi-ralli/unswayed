"use client";

import React from "react";
import { Box, Grid } from "@mui/material";
import UserCard from "@/components/applicant/talent-network/UserCard";

const page = () => {
  return (
      <Box sx={{ px: "25px", maxWidth: "1260px", margin: "25px auto" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <UserCard />
          </Grid>
        </Grid>
      </Box>
  );
};

export default page;
