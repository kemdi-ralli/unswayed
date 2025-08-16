import React from "react";
import { Box, Rating, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const categories = [
  { label: "Job/Work/Life Balance", id: "work_life_balance" },
  { label: "Compensation/Benefits", id: "benefits" },
  { label: "Job Security/Advancement", id: "stability" },
];

const RateCompany = ({ ratings, onRatingChange }) => {
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
          mb: 2,
        }}
      >
        Rate This Company
      </Typography>

      {categories.map((category) => (
        <Box
          key={category.id}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            mb: 2,
            padding: "12px 16px",
            borderRadius: "10px",
            boxShadow: "0px 1px 5px #00000040",
            backgroundColor: "#fff",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "12px", sm: "13px", md: "16px" },
              lineHeight: { xs: "20px", sm: "19px", md: "18px" },
              fontWeight: 500,
              color: "#222222",
              mb: { xs: 1, sm: 0 },
            }}
          >
            {category.label}
          </Typography>

          <Rating
            name={category.id}
            value={ratings[category.id]}
            precision={1}
            onChange={(event, newValue) =>
              onRatingChange(category.id, newValue)
            }
            emptyIcon={<StarIcon sx={{ opacity: 0.55 }} />}
          />
        </Box>
      ))}
    </Box>
  );
};

export default RateCompany;
