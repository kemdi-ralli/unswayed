import React from "react";
import { Box, Switch, Typography } from "@mui/material";

const PreferencesItem = ({ label, checked, onToggle }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "14px", sm: "17px", md: "20px" },
          fontWeight: 600,
          lineHeight: "18px",
          color: "#00305B",
          textTransform: "capitalize",
        }}
      >
        {label}
      </Typography>

      <Switch checked={checked} onChange={(e) => onToggle(e.target.checked)} />
    </Box>
  );
};

export default PreferencesItem;
