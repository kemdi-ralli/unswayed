"use client";
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import FiberManualRecordOutlinedIcon from "@mui/icons-material/FiberManualRecordOutlined";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

const MyJobCard = ({
  item,
  onApplicationClick = () => {},
  onViewDetail = () => {},
}) => {
  dayjs.extend(relativeTime);

  return (
    <Box
      key={item?.id}
      sx={{
        my: 2,
        borderRadius: "10px",
        px: "15px",
        py: 1.5,
        boxShadow: "0px 1px 5px #00000040",
        // cursor: "pointer",
        "&:hover": {
          border: "2px solid #189e33ff",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", sm: "space-between" },
          alignItems: { sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          py: "10px",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "16px", sm: "20px", md: "24px" },
            fontWeight: 500,
            lineHeight: { xs: "28px", md: "26px", lg: "20px" },
            color: "#111111",
            maxWidth: "60%",
          }}
        >
          {item?.title}
        </Typography>
        <Typography
          sx={{
            borderRadius: "44px",
            backgroundColor: "#E3F6E6",
            fontSize: { xs: "13px", sm: "14px", md: "16px" },
            lineHeight: "18px",
            padding: "9px",
            color: "#111111",
            cursor: "pointer",
            maxWidth: "150px",
            textAlign: "center",
          }}
          onClick={() => onApplicationClick(item?.id)}
        >
          {item?.applications_count === 1
            ? `${item.applications_count} Application`
            : `${item.applications_count} Applications`}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: { sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        
          <LocationOnRoundedIcon sx={{ width: "18px" }} />
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "20px",
              color: "#00305B",
              pl: "5px",
              pr: "12px",
            }}
          >
            Location
          </Typography>
        
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: 500,
            lineHeight: "16px",
            color: "#00305B"
          }}
        >
          {item?.country}
          {item?.states?.length
            ? `, ${item.states.map((state) => state?.name).join(", ")}`
            : ""}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          pb: "15px",
          pt: "2px",
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
          onClick={() => onViewDetail(item?.id)}
        >
          <SendRoundedIcon sx={{ width: "18px" }} />
          View Details
        </Button>
      </Box>
      <Box
        key={item?.id}
        sx={{
          maxHeight: "80px",
          minHeight: "80px",
          overflowY: "scroll",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Box sx={{ display: "flex" }}>
          <FiberManualRecordOutlinedIcon
            sx={{
              width: "18px",
              color: "#189e33ff",
              pt: "8px",
            }}
          />
          <Typography
            sx={{
              color: "#111111",
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "24px",
              py: "3px",
              pl: "2px",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              WebkitLineClamp: 3,
            }}
          >
            {item?.description}
          </Typography>
        </Box>
      </Box>
      <Typography
        sx={{
          color: "#189e33ff",
          fontSize: "14px",
          fontWeight: 400,
          lineHeight: "20px",
          pb: 1,
          pt: 1.8,
        }}
      >
        Posted {dayjs(item?.created_at).fromNow()}
      </Typography>
    </Box>
  );
};

export default MyJobCard;
