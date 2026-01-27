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
import { useRouter } from "next/navigation";

const JobsCard = ({ item, handleEasyApply, handleCard, handleJobSaved }) => {
  dayjs.extend(relativeTime);
  const maxLength = 220;
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  /****************************************************************************************
   * IDENTIFY EXTERNAL JOBS
   * --------------------------------------------------------------------------------------
   *    - isExternal applies to jobs from backend with type="external" or job_kind="external"
   *    - These jobs have job_apply_link for external application
   *****************************************************************************************/

  const isExternal = item?.type === "external" || item?.job_kind === "external" || item?._source === "external";

  /****************************************************************************************
   * EXTRACT EXTERNAL APPLY LINK
   *****************************************************************************************/
  const getExternalLink = () => {
    return item?.job_apply_link || null;
  };

  /****************************************************************************************
   * StepOut / StepIn BUTTON LOGIC
   *****************************************************************************************/
  const handleButtonClick = (e) => {
    e.stopPropagation();

    if (isExternal) {
      const url = getExternalLink();
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        console.error("No external link available");
      }
      return;
    }

    handleEasyApply(item);
  };

  /****************************************************************************************
   * DISABLE RULES FOR INTERNAL JOBS ONLY
   *****************************************************************************************/
  const internalDisabled =
    item?.is_applied ||
    item?.is_Closed ||
    (item?.deadline ? new Date(item.deadline) < new Date(today) : false);

  /****************************************************************************************
   * CLICK ON CARD → OPEN DETAILS PAGE OR EXTERNAL LINK
   *****************************************************************************************/
  const handleCardClick = () => {
    if (isExternal) {
      const url = getExternalLink();
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
      return;
    }
    
    // Internal job - view details page
    handleCard(item?.id);
  };

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
        onClick={handleCardClick}
      >
        {/* TITLE + SAVE ICON */}
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

          {!isExternal && (
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

        {/* LOCATION */}
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
            {item?.country?.name || item?.country || item?.job_country || "—"},
          </Typography>

          {Array.isArray(item?.states) &&
            item?.states.map((stateObj, idx) => (
              <Typography
                key={idx}
                sx={{
                  fontSize: { md: "16px", sm: "14px", xs: "11px" },
                  fontWeight: 500,
                  color: "#00305B",
                  pr: "3px",
                }}
              >
                {stateObj?.name}
                {idx < item.states.length - 1 ? "," : ""}
              </Typography>
            ))}

          {/* External jobs might have city info */}
          {isExternal && item?.job_city && (
            <Typography
              sx={{
                fontSize: { md: "16px", sm: "14px", xs: "11px" },
                fontWeight: 500,
                color: "#00305B",
                pl: "3px",
              }}
            >
              {item?.job_city}
            </Typography>
          )}
        </Box>

        {/* BUTTONS + DEADLINE */}
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
              pl: "2px",
              textTransform: "none",
            }}
            onClick={handleButtonClick}
            disabled={isExternal ? false : internalDisabled}
          >
            <SendRoundedIcon sx={{ width: "18px", mr: 1 }} />
            {isExternal ? "StepOut Now (External Job)" : "StepIn Now"}
          </Button>

          {!isExternal && item?.deadline && new Date(item.deadline) < new Date(today) && (
            <Typography
              sx={{
                color: "red",
                fontSize: { md: "16px", sm: "14px", xs: "11px" },
                fontWeight: 500,
              }}
            >
              No more applications accepted
            </Typography>
          )}
        </Box>

        {/* DESCRIPTION */}
        {item?.description && (
          <Box
            sx={{
              maxHeight: "130px",
              overflowY: "scroll",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <Typography
              sx={{
                color: "#111111",
                fontSize: { md: "16px", sm: "14px", xs: "11px" },
                fontWeight: 400,
                lineHeight: "18px",
                height: "80px",
              }}
            >
              {item?.description.substring(0, maxLength)}...
            </Typography>
          </Box>
        )}

        {/* POSTED DATE */}
        <Typography
          sx={{
            color: "#189e33ff",
            fontSize: { md: "16px", sm: "14px", xs: "11px" },
            fontWeight: 400,
            pb: 1,
          }}
        >
          Posted:{" "}
          {item?.created_at 
            ? dayjs(item?.created_at).format("MM-DD-YYYY")
            : "N/A"}
        </Typography>

        {/* DEADLINE FOR INTERNAL JOBS ONLY */}
        {!isExternal && (
          <Typography
            sx={{
              color: "#189e33ff",
              fontSize: { md: "16px", sm: "14px", xs: "11px" },
              fontWeight: 400,
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
