// JobsCard.jsx
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

  const isRapid = Boolean(item?.isRapid || item?._source === "jsearch" || item?._source === "rapid");

  const getExternalLink = () => {
    // prefer explicit external_url
    if (item?.external_url) return item.external_url;
    const raw = item?._raw || {};
    return (
      raw.job_apply_link ||
      raw.job_apply_url ||
      raw.job_link ||
      raw.apply_link ||
      raw.url ||
      raw.link ||
      raw.applyUrl ||
      null
    );
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();

    // RAPID API — STEP OUT: open external link in new tab
    if (isRapid) {
      const url = getExternalLink();
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        // fallback: just notify user if no external link
        // you can replace this with a toast or navigation to a details page
        window.open("", "_blank");
      }
      return;
    }

    // INTERNAL JOB — STEP IN
    handleEasyApply(item);
  };

  // Disable only for internal jobs based on existing flags
  const internalDisabled =
    item?.is_applied || item?.is_Closed || (item?.deadline ? new Date(item.deadline) < new Date(today) : false);

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
        <Box sx={{ display: "flex", justifyContent: "space-between", py: "10px" }}>
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

          {/* show bookmark only for internal/backend jobs */}
          {!isRapid && (
            <Box
              onClick={(e) => {
                e.stopPropagation();
                handleJobSaved(item?.id);
              }}
            >
              {item?.is_saved ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
            </Box>
          )}
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
              pr: "5px",
            }}
          >
            {item?.country},
          </Typography>

          {item?.states?.map((stateObj, idx) => (
            <Typography
              key={idx}
              sx={{
                fontSize: { md: "16px", sm: "14px", xs: "11px" },
                fontWeight: 500,
                lineHeight: { md: "20px", sm: "14px", xs: "12px" },
                color: "#00305B",
                pr: "3px",
              }}
            >
              {stateObj?.name}
              {idx < item.states.length - 1 ? "," : ""}
            </Typography>
          ))}
        </Box>

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
            onClick={handleButtonClick}
            disabled={isRapid ? false : internalDisabled}
          >
            <SendRoundedIcon sx={{ width: "18px" }} />
            {" "}
            {isRapid ? "Step Out Now (external job link)" : "Step In Now"}
          </Button>

          {!isRapid && item?.deadline && new Date(item.deadline) < new Date(today) && (
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

        {item?.description && (
          <Box
            sx={{
              maxHeight: "130px",
              overflowY: "scroll",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
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
              Posted: {!isRapid ? (dayjs(item?.created_at).format("MM-DD-YYYY")) : (dayjs(item?.job_posted_at_datetime_utc).format("MM-DD-YYYY"))}
            </Typography>

            {!isRapid && (
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
              {item?.deadline && new Date(item.deadline) < new Date(today)
                ? "Job Closed"
                : item?.deadline
                ? dayjs(item?.deadline).format("MM-DD-YYYY")
                : "—"}
            </Typography>
            )}

            
          
      
      </Box>
    </Box>
  );
};

export default JobsCard;
