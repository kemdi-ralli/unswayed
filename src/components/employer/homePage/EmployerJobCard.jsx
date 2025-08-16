"use client";
import React from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

const EmployerJobCard = ({
  data,
  onView = () => { },
  onEmployerClick = () => { },
}) => {
  dayjs.extend(relativeTime);

  return (
    <Box
      sx={{
        borderRadius: "10px",
        width: "100%",
        px: "15px",
        py: 2,
        boxShadow: "0px 1px 5px #00000040",
        cursor: "pointer",
        height: { xs: "220px", md: "230px", lg: "230px" },
        "&:hover": {
          border: "2px solid #FE4D82",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        onClick={() => onEmployerClick(data?.employer?.id)}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Avatar
            alt="Profile Picture"
            src={data?.employer?.photo}
            sx={{
              width: { xs: 50, lg: 60 },
              height: { xs: 50, lg: 60 },
              border: "2px solid #99999999",
              "& img": {
                objectFit: "contain",
              },
            }}
          />
          <Box sx={{ px: { xs: 1, lg: 1.5 } }}>
            <Typography
              sx={{
                fontSize: { xs: "12px", md: "14px", lg: "16px" },
                lineHeight: "18px",
                fontWeight: 700,
                color: "#000000",
              }}
            >
              {data?.employer?.first_name +
                " " +
                data?.employer?.middle_name +
                " " +
                data?.employer?.last_name}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "8px", md: "10px", lg: "12px" },
                lineHeight: "20px",
                fontWeight: 700,
                color: "#5e5e5e",
              }}
            >
              {data?.employer?.username}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: "10px",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "16px", md: "18px", lg: "20px" },
            fontWeight: 500,
            lineHeight: { xs: "18px", md: "20px", lg: "22px" },
            color: "#111111",
          }}
        >
          {data?.title}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <LocationOnRoundedIcon sx={{ width: "18px" }} />
        <Typography
          sx={{
            fontSize: { xs: "10px", md: "12px", lg: "14px" },
            fontWeight: 500,
            lineHeight: "20px",
            color: "#00305B",
            pl: "5px",
            pr: "12px",
          }}
        >
          {data?.country +
            ", " +
            (data?.states?.map((item) => item?.name).join(", ") || "")}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          py: "5px",
        }}
      >
        <Button
          variant="link"
          sx={{
            color: "#00305B",
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: "20px",
            textAlign: "center",
            pl: "2px",
          }}
          onClick={() => onView(data.id)}
        >
          <SendRoundedIcon sx={{ width: "18px" }} />
          View Details
        </Button>
      </Box>

      <Typography
        sx={{
          color: "#FE4D82",
          fontSize: "14px",
          fontWeight: 400,
          lineHeight: "20px",
          pb: 1,
          pt: 1,
        }}
      >
        Posted: {dayjs(data?.created_at).fromNow()}
      </Typography>
    </Box>
  );
};

export default EmployerJobCard;
