"use client";
import React from "react";
import { Box } from "@mui/material";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import DashboardAtivities from "./DashboardAtivities";
import DashboardAppliedJobs from "./DashboardAppliedJobs";
import DashboardTracking from "./DashboardTracking";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const DashboardTabs = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabStyles = {
    maxWidth: { xs: "33%", sm: "33%" },
    width: "100%",
    fontSize: { xs: "9px", sm: "14px", md: "16px", lg: "26px" },
    lineHeight: {xs:"10px",sm:"15px",md:"18px"},
    fontWeight: 600,
    color: "#222222",
    "@media (max-width: 340px)": {
      minWidth: "77.5px",
    },
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="Applicant Dashboard Tabs">
          <Tab label="Jobs Applied For" {...a11yProps(0)} sx={tabStyles} />
          <Tab label="Tracking" {...a11yProps(1)} sx={tabStyles} />
          <Tab label="Activities" {...a11yProps(2)} sx={tabStyles} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <DashboardAppliedJobs />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <DashboardTracking />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <DashboardAtivities />
      </CustomTabPanel>
    </Box>
  );
};

export default DashboardTabs;
