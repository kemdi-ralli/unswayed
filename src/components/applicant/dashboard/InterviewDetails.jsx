"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import RalliButton from "@/components/button/RalliButton";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { Toast } from "@/components/Toast/Toast";
import { applicantInterviewResponse } from "@/helper/ApplicationActionHelper";

const PRELOADER_DELAY_MS = 300;
const MIN_DECLINE_LEN = 10;
const MAX_DECLINE_LEN = 1000;

const InterviewDetails = ({ requisitionNumber = "", userType = "", historyData = {} }) => {
  const [item, setItem] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);

  const [openDeclinePopup, setOpenDeclinePopup] = useState(false);
  const [declineReasonText, setDeclineReasonText] = useState("");
  const [declineDialogContentReady, setDeclineDialogContentReady] = useState(false);

  const onDecline = async () => {
    const trimmed = declineReasonText.trim();
    if (trimmed.length < MIN_DECLINE_LEN || trimmed.length > MAX_DECLINE_LEN) {
      Toast("error", `Reason must be between ${MIN_DECLINE_LEN} and ${MAX_DECLINE_LEN} characters.`);
      return;
    }

    if (userType !== "employer" && historyData?.type === "interview_invite" && item?.status === "pending") {
      setDeclineLoading(true);
      try {
        const response = await applicantInterviewResponse(item?.id, {
          type: "decline",
          reason: trimmed,
        });
        if (response?.data?.status === "success") {
          window.location.href = window.location.href;
        }
      } catch (error) {
        Toast("error", error?.response?.data?.message ?? "Something went wrong while declining.");
      } finally {
        setDeclineLoading(false);
        setOpenDeclinePopup(false);
      }
    }
  };

  useEffect(() => {
    if (!openDeclinePopup) {
      setDeclineDialogContentReady(false);
      return;
    }
    const t = setTimeout(() => setDeclineDialogContentReady(true), PRELOADER_DELAY_MS);
    return () => clearTimeout(t);
  }, [openDeclinePopup]);

  const handleSelect = (date) => {
    if (userType !== "employer" && item?.status === "pending") {
      setSelectedDate(date);
    }
  };

  const onAccept = async () => {
    if (userType !== "employer" && historyData?.type === "interview_invite" && item?.status === "pending") {
      if (!selectedDate) {
        Toast("error", "Please select a date for the interview.");
        return;
      }
      setAcceptLoading(true);
      try {
        const response = await applicantInterviewResponse(item?.id, {
          type: "accept",
          selected_date: selectedDate,
        });
        if (response?.data?.status === "success") {
          window.location.href = window.location.href;
        }
      } catch (error) {
        Toast("error", error?.response?.data?.message ?? "Something went wrong while accepting.");
      } finally {
        setAcceptLoading(false);
      }
    }
  };

  const getInterviewDetails = async () => {
    try {
      const response = await apiInstance.get(`application/${historyData?.history_data?.interview_id}/interview-detail`);
      const interview = response?.data?.data?.interview;
      if (interview) {
        setItem(interview);
      }
    } catch (error) {
      Toast("error", error?.response?.data?.message);
      return error?.response;
    }
  };

  useEffect(() => {
    getInterviewDetails();
    if (historyData?.history_data?.selected_date) {
      setSelectedDate(historyData?.history_data?.selected_date);
    }
  }, [historyData?.history_data?.interview_id]);

  const meetingLink = item?.meeting_link && String(item.meeting_link).trim() !== "" ? item.meeting_link.trim() : null;

  const copyMeeting = async () => {
    if (!meetingLink) return;
    try {
      await navigator.clipboard.writeText(meetingLink);
      Toast("success", "Link copied");
    } catch {
      Toast("error", "Could not copy link");
    }
  };

  const showDeclineReason =
    item?.status === "decline" && item?.reason && String(item.reason).trim() !== "";

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ fontWeight: 600, fontSize: "30px", color: "#00305B" }}>Interview</Typography>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "20px",
            color: "#000000",
            textDecoration: "underline",
          }}
        >
          {userType === "employer" ? `UCN : ${item?.ucn}` : `REQ : ${requisitionNumber}`}
        </Typography>
      </Box>

      <Typography sx={{ fontWeight: 400, fontSize: "20px", color: "#111111", py: 2 }}>{item?.description ?? ""}</Typography>

      {(historyData?.type === "interview_invite" || historyData?.type === "interview_accept") &&
        item?.dates?.map((date, index) => (
          <Box
            key={index}
            onClick={() => handleSelect(date)}
            sx={{
              maxWidth: "40%",
              boxShadow: "0px 0px 3px #00000040",
              border: "none",
              outline: "none",
              padding: "18px 20px",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: 300,
              lineHeight: "18px",
              color: selectedDate === date ? "#FFFFFF" : "#222222",
              backgroundColor: selectedDate === date ? "#00305B" : "#FFFFFF",
              textAlign: "center",
              mx: "auto",
              mb: 2,
              cursor: "pointer",
              transition: "background-color 0.3s, color 0.3s",
            }}
          >
            {date}
          </Box>
        ))}

      {meetingLink && userType !== "employer" && (
        <Box sx={{ py: 2 }}>
          <Button
            variant="contained"
            size="large"
            href={meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              backgroundColor: "#189e33",
              fontWeight: 700,
              px: 4,
              py: 1.5,
              "&:hover": { backgroundColor: "#147a28" },
            }}
          >
            Join Meeting
          </Button>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1, flexWrap: "wrap" }}>
            <Typography sx={{ fontSize: "14px", color: "#333", wordBreak: "break-all" }}>{meetingLink}</Typography>
            <IconButton size="small" aria-label="Copy meeting link" onClick={copyMeeting}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      )}

      {meetingLink && userType === "employer" && (
        <Box sx={{ py: 2 }}>
          <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Meeting link</Typography>
          <Typography sx={{ fontSize: "14px", color: "#333", wordBreak: "break-all" }}>{meetingLink}</Typography>
        </Box>
      )}

      <Box sx={{ py: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
        <Typography sx={{ fontWeight: 400, fontSize: "16px", color: "#111111", py: 2 }}>
          Date: {new Date(item?.created_at)?.toDateString() + " " ?? ""}
          {new Date(item?.created_at)?.toLocaleTimeString() ?? ""}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
          <Button
            sx={{
              border: "1px solid #ffff",
              fontSize: "14px",
              color: "#ffff",
              backgroundColor: item?.status === "accept" ? "green" : "red",
            }}
          >
            STATUS: {item?.status?.toUpperCase() || ""}
          </Button>
          {showDeclineReason && (
            <Box
              sx={{
                maxWidth: 420,
                p: 1.5,
                borderRadius: "8px",
                backgroundColor: "#fff3e0",
                border: "1px solid #ffb74d",
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: "13px", color: "#e65100" }}>Decline Reason:</Typography>
              <Typography sx={{ fontSize: "14px", color: "#333", mt: 0.5 }}>{item.reason}</Typography>
            </Box>
          )}
        </Box>
      </Box>

      {userType !== "employer" && item?.status === "pending" && (
        <>
          <Box sx={{ py: 2 }}>
            <RalliButton label="Accept" bg="#00305B" onClick={onAccept} loading={acceptLoading} />
          </Box>
          <RalliButton label="Decline" onClick={() => setOpenDeclinePopup(true)} loading={declineLoading} />
        </>
      )}

      <Dialog open={openDeclinePopup} onClose={() => setOpenDeclinePopup(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: "#00305B" }}>Decline Interview</DialogTitle>
        <DialogContent>
          {!declineDialogContentReady ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200, py: 3 }}>
              <CircularProgress size={40} sx={{ color: "#00305B" }} />
            </Box>
          ) : (
            <TextField
              fullWidth
              required
              multiline
              minRows={4}
              label="Reason for Declining"
              placeholder="Please provide a reason for declining this interview invite..."
              value={declineReasonText}
              onChange={(e) => setDeclineReasonText(e.target.value.slice(0, MAX_DECLINE_LEN))}
              error={declineReasonText.trim().length > 0 && declineReasonText.trim().length < MIN_DECLINE_LEN}
              helperText={`${declineReasonText.trim().length} / ${MAX_DECLINE_LEN} (min ${MIN_DECLINE_LEN})`}
              sx={{ mt: 1 }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDeclinePopup(false)}>Cancel</Button>
          <Button
            onClick={onDecline}
            variant="contained"
            color="error"
            disabled={
              declineLoading ||
              declineReasonText.trim().length < MIN_DECLINE_LEN ||
              declineReasonText.trim().length > MAX_DECLINE_LEN
            }
          >
            {declineLoading ? "Declining..." : "Confirm Decline"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InterviewDetails;
