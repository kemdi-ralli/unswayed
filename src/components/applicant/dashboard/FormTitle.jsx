import React from "react";
import { Box, Typography } from "@mui/material";

const FormTitle = ({label}) => {
  return (
    <Box sx={{ pb:4}}>
      <Typography
        sx={{
          fontSize: { xs: "20px", sm: "26px", md: "30px" },
          lineHeight: { xs: "23px", md: "18px" },
          fontWeight: 600,
          color: "#222222",
          textTransform: "capitalize",
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          width: "60px",
          height: "2px",
          backgroundColor: "#00305B",
          marginTop: "10px",
        }}
      />
    </Box>
  );
};

export default FormTitle;
