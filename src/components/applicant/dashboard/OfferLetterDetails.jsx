import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  CircularProgress,
} from "@mui/material";
import RalliButton from "@/components/button/RalliButton";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { Toast } from "@/components/Toast/Toast";
import { applicantOfferResponse } from "@/helper/ApplicationActionHelper";

const OfferLetterDetails = ({ requisitionNumber = '', userType = '', historyData = {} }) => {
  const [item, setItem] = useState({});
  const [loading, setLoading] = useState(true);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);

  // NEW STATES
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const onResponse = async (type = '', reason = '') => {
    if (
      userType !== 'employer' &&
      (historyData?.type === 'offer_letter_sent' || historyData?.type === 'counter_offer_letter_sent') &&
      item?.status === 'pending'
    ) {
      type === 'accept' ? setAcceptLoading(true) : setDeclineLoading(true);
      try {
        const payload = { type };
        if (type === 'decline') {
          payload.reason = reason;
        }
        const response = await applicantOfferResponse(item?.id, payload);
        if (response?.data?.status === 'success') {
          window.location.href = window.location.href;
        }
      } catch (error) {
        Toast("error", "Something went wrong.");
      } finally {
        type === 'accept' ? setAcceptLoading(false) : setDeclineLoading(false);
      }
    }
  };

  const getOfferDetails = async () => {
    if (!historyData?.history_data?.offer_id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await apiInstance.get(
        `application/${historyData?.history_data?.offer_id}/offer-detail`
      );
      const offer = response?.data?.data?.interview;
      if (offer) {
        setItem(offer);
      }
    } catch (error) {
      Toast("error", error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOfferDetails();
  }, [historyData?.history_data?.offer_id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200,
          gap: 2,
        }}
      >
        <CircularProgress size={48} sx={{ color: "#00305B" }} />
        <Typography sx={{ fontSize: "16px", color: "#00305B", fontWeight: 500 }}>
          Loading offer details...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "30px",
            lineHeight: "18px",
            color: "#00305B",
          }}
        >
          {item?.title ?? "Offer later"}
        </Typography>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "20px",
            lineHeight: "30px",
            color: "#000000",
            textDecoration: "underline",
          }}
        >
          {userType === "employer"
            ? `UCN : ${item?.ucn}`
            : `REQ : ${requisitionNumber}`}
        </Typography>
      </Box>
      <Typography
        sx={{
          fontWeight: 400,
          fontSize: "20px",
          lineHeight: "30px",
          color: "#111111",
          py: 2,
        }}
      >
        {item?.description ?? ""}
      </Typography>
      <Typography
        sx={{
          fontWeight: "bold",
          fontSize: "20px",
          color: "#00305B",
        }}
      >
        Salary: {item?.salary ?? ""}
      </Typography>
      <Box sx={{ py: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography
          sx={{ fontWeight: 400, fontSize: "16px", color: "#111111", py: 2 }}
        >
          Date: {new Date(item?.created_at)?.toDateString() + " " ?? ""}
          {new Date(item?.created_at)?.toLocaleTimeString() ?? ""}
        </Typography>
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
      </Box>

      {(userType !== "employer" && item?.status === "pending") && (
        <>
          <Box sx={{ py: 2 }}>
            <RalliButton
              label="Accept"
              bg="#00305B"
              onClick={() => onResponse("accept")}
              loading={acceptLoading}
            />
          </Box>

          {/* Decline triggers modal instead of action */}
          <RalliButton
            label="Decline"
            onClick={() => setDeclineModalOpen(true)}
            loading={declineLoading}
          />
        </>
      )}

      {/* Decline Reason Modal */}
      <Modal open={declineModalOpen} onClose={() => setDeclineModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            width: 400,
          }}
        >
          <Typography sx={{ fontSize: "18px", fontWeight: 600, mb: 2 }}>
            Reason for Decline
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="Type your reason..."
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}>
            <Button onClick={() => setDeclineModalOpen(false)}>Cancel</Button>
            <RalliButton
              label="Continue"
              loading={declineLoading}
              onClick={() => {
                setDeclineModalOpen(false);
                onResponse("decline", declineReason);
              }}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default OfferLetterDetails;
