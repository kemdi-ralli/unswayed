"use client";
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

const JobsCard = ({ item, handleEasyApply, handleCard, handleJobSaved }) => {
  dayjs.extend(relativeTime);
  const maxLength = 220;
  const today = new Date().toISOString().split("T")[0]; 

  return (
    <Box>
      <Box
        sx={{
          borderRadius: "10px",
          width: "100%",
          height: item?.description ? "330px" : "250px",
          px: "20px",
          py: 2,
          boxShadow: "0px 1px 5px #00000040",
          cursor: "pointer",
          "&:hover": {
            border: "2px solid #189e33ff",
          },
        }}
        onClick={() => handleCard(item?.id)}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            py: "10px",
          }}
        >
          <Typography
            sx={{
              fontSize: { lg: "24px", md: "21px", sm: "17px", xs: "15px" },
              fontWeight: 500,
              lineHeight: "20px",
              color: "#111111",
            }}
          >
            {item?.title}
          </Typography>
          <Box
            onClick={(e) => {
              e.stopPropagation();
              handleJobSaved(item?.id);
            }}
          >
            {item?.is_saved ? (
              <BookmarkIcon color="primary" />
            ) : (
              <BookmarkBorderIcon />
            )}
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
          <LocationOnRoundedIcon sx={{ width: "18px" }} />
          <Typography
            sx={{
              fontSize: { md: "16px", sm: "14px", xs: "11px" },
              fontWeight: 500,
              lineHeight: { md: "20px", sm: "14px", xs: "12px" },
              color: "#00305B",
              pl: "5px",
              pr: "12px",
            }}
          >
            {item?.country},
          </Typography>
          {item?.states?.map((item, index) => (
            <Typography
              key={index}
              sx={{
                fontSize: { md: "16px", sm: "14px", xs: "11px" },
                fontWeight: 500,
                lineHeight: { md: "20px", sm: "14px", xs: "12px" },
                color: "#00305B",
                pr: "3px",
              }}
            >
              {item?.name},
            </Typography>
          ))}
        </Box>

        {/* <Box sx={{ py: "10px" }}>
          <Button
            sx={{
              backgroundColor: "#FDF7F7",
              border: "0.4px solid #0000004D",
              borderRadius: "6px",
              color: "#222222",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "18px",
              textAlign: "center",
              p: "7px",
            }}
          >
            {item?.job_type}
          </Button>
        </Box> */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            pb: "15px",
            pt: "2px",
          }}
        >
          <Button
            variant="link"
            sx={{
              color: "#00305B",
              fontSize: { md: "16px", sm: "14px", xs: "11px" },
              fontWeight: 600,
              lineHeight: { md: "20px", sm: "14px", xs: "12px" },
              textAlign: "center",
              pl: "2px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleEasyApply(item);
            }}
            disabled={
              item?.is_applied ||
              item?.is_Closed ||
              item?.deadline < today
            }
          >
            <SendRoundedIcon sx={{ width: "18px" }} />
           { item?.title == "Data Scientist" ? "StepOut Now (External Job Link)" : "StepIn Now" }
          </Button>
          {item?.deadline < today && (
            <Typography
              sx={{
                color: "red",
                fontSize: { md: "16px", sm: "14px", xs: "11px" },
                fontWeight: 500,
                lineHeight: { md: "20px", sm: "14px", xs: "12px" },
              }}
            >
              No more applications accepted
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {item?.is_applied && (
            <Typography
              sx={{
                fontSize: { md: "16px", sm: "14px", xs: "11px" },
                fontWeight: 500,
                lineHeight: { md: "20px", sm: "14px", xs: "12px" },
                color: "red",
              }}
            >
              You Applied On This Job
            </Typography>
          )}
          {item?.is_closed && (
            <Typography
              sx={{
                fontSize: { md: "16px", sm: "14px", xs: "11px" },
                fontWeight: 500,
                lineHeight: { md: "20px", sm: "14px", xs: "12px" },
                color: "red",
              }}
            >
              Job Fulfilled
            </Typography>
          )}
        </Box>
        {item?.description && (
          <Box
            sx={{
              maxHeight: "130px",
              overflowY: "scroll",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{
                  color: "#111111",
                  fontSize: { md: "16px", sm: "14px", xs: "11px" },
                  fontWeight: 400,
                  lineHeight: { md: "20px", sm: "14px", xs: "12px" },
                  py: "3px",
                  pl: "2px",
                  height: "80px",
                }}
              >
                {item?.description?.substring(0, maxLength)}...
              </Typography>
            </Box>
          </Box>
        )}
        <Typography
          sx={{
            color: "#189e33ff",
            fontSize: { md: "16px", sm: "14px", xs: "11px" },
            fontWeight: 400,
            lineHeight: { md: "20px", sm: "14px", xs: "12px" },
            pb: 1,
            pt: 0.8,
          }}
        >
          Posted: {dayjs(item?.created_at).format("MM-DD-YYYY")}
        </Typography>
        <Typography
          sx={{
            color: "#189e33ff",
            fontSize: { md: "16px", sm: "14px", xs: "11px" },
            fontWeight: 400,
            lineHeight: { md: "20px", sm: "14px", xs: "12px" },
            pb: 1,
          }}
        >
          Deadline:{" "}
          {item?.deadline < today
            ? "Job Closed"
            : dayjs(item?.deadline).format("MM-DD-YYYY")}
        </Typography>
      </Box>
    </Box>
  );
};

export default JobsCard;
