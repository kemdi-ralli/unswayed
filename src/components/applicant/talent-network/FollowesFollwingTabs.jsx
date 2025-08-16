"use client";
import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import Following from "./Following";

const CustomTabPanel = ({ children, value, index }) => {
  return (
    value === index && (
      <Box role="tabpanel" py={3}>
        {children}
      </Box>
    )
  );
};

const FollowersTabs = ({ following = [], followers = [] }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => setValue(newValue);

  const tabs = [
    { label: "Following", content: <Following data={following} /> },
    { label: "Followers", content: <Following data={followers} /> },
  ];

  const tabStyles = {
    maxWidth: { xs: "50%", sm: "50%" },
    width: "100%",
    fontSize: { xs: "9px", sm: "14px", md: "16px", lg: "26px" },
    lineHeight: "18px",
    fontWeight: 600,
    color: "#222222",
    "@media (max-width: 340px)": { minWidth: "77.5px" },
  };

  return (
    <Box sx={{ maxWidth: "1260px", margin: "25px auto" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs">
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} sx={tabStyles} />
          ))}
        </Tabs>
      </Box>
      {tabs.map((tab, index) => (
        <CustomTabPanel key={index} value={value} index={index}>
          {tab.content}
        </CustomTabPanel>
      ))}
    </Box>
  );
};

export default FollowersTabs;
