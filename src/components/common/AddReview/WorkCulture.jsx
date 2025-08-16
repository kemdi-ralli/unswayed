// WorkCulture.js

import React from "react";
import { Box, Typography } from "@mui/material";

const WorkCulture = ({ data, selected, onSelect }) => {
  return (
    <Box
      sx={{
        width: "100%",
        boxShadow: "0px 0px 3px #00000040",
        border: "none",
        outline: "none",
        padding: "18px 20px",
        borderRadius: "10px",
        fontSize: "16px",
        fontWeight: 300,
        lineHeight: "18px",
        color: "#222222",
        my: 2,
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "14px", sm: "16px", md: "19px", lg: "22px" },
          lineHeight: { xs: "22px", md: "18px" },
          fontWeight: 500,
          color: "#00305B",
          textTransform: "capitalize",
        }}
      >
        how would you describe the work culture at company name?
      </Typography>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexWrap: { xs: "wrap", md: "nowrap" },
          alignItems: "center",
          justifyContent: { xs: "flex-start", md: "space-between" },
          gap: 2,
          padding: 2,
          borderRadius: "10px",
          backgroundColor: "#fff",
          boxShadow: "0px 1px 5px #00000040",
          height: "auto",
          border: "none",
          outline: "none",
          my: 2,
        }}
      >
        {data?.workCulture?.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexBasis: { xs: "100%", sm: "30%", md: "auto" },
              cursor: "pointer",
              padding: "8px",
              borderRadius: "5px",
            //   backgroundColor: selected === item.name ? "#d1e4f7" : "transparent",
            }}
            onClick={() => onSelect(item.name)}
          >
            <Box
              sx={{
                width: "12.5px",
                height: "12.5px",
                backgroundColor: selected === item.name ? "#00305B" : "transparent",
                border: "2px solid #00305B",
              }}
            ></Box>
            <Typography
              sx={{
                fontSize: { xs: "12px", sm: "13px", md: "16px" },
                lineHeight: { xs: "20px", sm: "19px", md: "18px" },
                fontWeight: 300,
              }}
            >
              {item?.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default WorkCulture;
