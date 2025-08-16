'use client'
import React from "react";
import { Box } from "@mui/material";

import Upcomming from "@/components/upcoming/Upcomming";

const Page = () => {
  return (
    <Box sx={{
      minHeight: "100vh"
    }}>
      <Upcomming />
    </Box>
  );
};

export default Page;
