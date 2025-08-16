import React from "react";
import { Box, Typography } from "@mui/material";

const OverallRating = ({ selectedRating, onSelect }) => {
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
        please rate your overall feedback experience at your company
        <span style={{ color: "red" }}>*</span>
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pt: 2,
          flexWrap: { xs: "wrap", md: "nowrap" },
          justifyContent: { xs: "flex-start", sm: "space-between" },
        }}
      >
        {[1, 2, 3, 4, 5]?.map((item, index) => (
          <Box
            key={index}
            onClick={() => onSelect(item)}
            sx={{
              width: "60px",
              height: "60px",
              borderRadius: "10px",
              boxShadow: "0px 0px 3px #00000040",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              my: { xs: 1, md: 0 },
              mx: 1,
              cursor: "pointer",
              backgroundColor:
                selectedRating === item ? "#d1e4f7" : "transparent",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "20px", sm: "22px", md: "26px", lg: "30px" },
                lineHeight: { xs: "22px", md: "18px" },
                fontWeight: 700,
                color: selectedRating === item ? "#00305B" : "#222222",
              }}
            >
              {item}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default OverallRating;
