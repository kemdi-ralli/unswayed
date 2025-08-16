"use client";
import React from "react";
import { Box } from "@mui/material";
import BackButtonWithTitle from "@/components/applicant/dashboard/BackButtonWithTitle";
import Container from "@/components/common/Container";
import ChangePassword from "@/components/applicant/profile/ChangePassword";

const Page = () => {
  return (
      <Container>
        <Box sx={{ pt: 3 }}>
          <BackButtonWithTitle
            label="Change Password"
          />
        </Box>
        <ChangePassword />
      </Container>
  );
};

export default Page;
