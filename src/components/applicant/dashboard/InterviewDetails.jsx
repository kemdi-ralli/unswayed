"use client";
import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";
import RalliButton from "@/components/button/RalliButton";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { Toast } from "@/components/Toast/Toast";
import { applicantInterviewResponse } from "@/helper/ApplicationActionHelper";

const InterviewDetails = ({ requisitionNumber = '', userType = '', historyData = {} }) => {
  const [item, setItem] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);

  // decline popup state
  const [openDeclinePopup, setOpenDeclinePopup] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const handleSelect = (date) => {
    if (userType !== 'employer' && item?.status === 'pending') {
      setSelectedDate(date);
    }
  };

  const onAccept = async () => {
    if (userType !== 'employer' && historyData?.type === 'interview_invite' && item?.status === 'pending') {
      if (!selectedDate) {
        alert("Please Select Any Date for Interview");
        return;
      }
      setAcceptLoading(true);
      try {
        const formData = new FormData();
        formData.append("type", 'accept');
        formData.append("selected_date", selectedDate);
        const response = await applicantInterviewResponse(item?.id, formData);
        if (response?.data?.status === 'success') {
          window.location.href = window.location.href;
        }
      } catch (error) {
        Toast("error", "Something went wrong while accepting.");
      } finally {
        setAcceptLoading(false);
      }
    }
  };

  const onDecline = async () => {
    if (userType !== 'employer' && historyData?.type === 'interview_invite' && item?.status === 'pending') {
      if (!declineReason.trim()) {
        Toast("error", "Please provide a reason before declining.");
        return;
      }
      setDeclineLoading(true);
      try {
        const formData = new FormData();
        formData.append("type", 'decline');
        formData.append("reason", declineReason); // attach reason
        const response = await applicantInterviewResponse(item?.id, formData);
        if (response?.data?.status === 'success') {
          window.location.href = window.location.href;
        }
      } catch (error) {
        Toast("error", "Something went wrong while declining.");
      } finally {
        setDeclineLoading(false);
        setOpenDeclinePopup(false);
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

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ fontWeight: 600, fontSize: "30px", color: "#00305B" }}>
          Interview
        </Typography>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "20px",
            color: "#000000",
            textDecoration: "underline",
          }}
        >
          {userType === 'employer' ? `UCN : ${item?.ucn}` : `REQ : ${requisitionNumber}`}
        </Typography>
      </Box>

      <Typography sx={{ fontWeight: 400, fontSize: "20px", color: "#111111", py: 2 }}>
        {item?.description ?? ""}
      </Typography>

      {(historyData?.type === 'interview_invite' || historyData?.type === 'interview_accept') && (
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
              color: (selectedDate === date) ? "#FFFFFF" : "#222222",
              backgroundColor: (selectedDate === date) ? "#00305B" : "#FFFFFF",
              textAlign: "center",
              mx: "auto",
              mb: 2,
              cursor: "pointer",
              transition: "background-color 0.3s, color 0.3s",
            }}
          >
            {date}
          </Box>
        ))
      )}

      <Box sx={{ py: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ fontWeight: 400, fontSize: "16px", color: "#111111", py: 2 }}>
          Date: {new Date(item?.created_at)?.toDateString() + " " ?? ""}{new Date(item?.created_at)?.toLocaleTimeString() ?? ""}
        </Typography>
        <Button
          sx={{
            border: "1px solid #ffff",
            fontSize: "14px",
            color: "#ffff",
            backgroundColor: item?.status === 'accept' ? 'green' : 'red',
          }}
        >
          STATUS: {item?.status?.toUpperCase() || ""}
        </Button>
      </Box>

      {(userType !== 'employer' && item?.status === 'pending') && (
        <>
          <Box sx={{ py: 2 }}>
            <RalliButton
              label="Accept"
              bg="#00305B"
              onClick={onAccept}
              loading={acceptLoading}
            />
          </Box>
          <RalliButton
            label="Decline"
            onClick={() => setOpenDeclinePopup(true)} // open popup
            loading={declineLoading}
          />
        </>
      )}

      {/* Decline Reason Popup */}
      <Dialog open={openDeclinePopup} onClose={() => setOpenDeclinePopup(false)}>
        <DialogTitle>Decline Interview</DialogTitle>
        <DialogContent>
          <TextField
            label="Reason for Decline"
            multiline
            rows={4}
            fullWidth
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeclinePopup(false)}>Cancel</Button>
          <Button
            onClick={onDecline}
            variant="contained"
            color="error"
            disabled={declineLoading}
          >
            {declineLoading ? "Declining..." : "Decline"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InterviewDetails;
