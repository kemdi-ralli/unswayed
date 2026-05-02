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

const MIN_DECLINE_LEN = 10;
const MAX_DECLINE_LEN = 1000;

const OfferLetterDetails = ({ requisitionNumber = "", userType = "", historyData = {} }) => {
  const [item, setItem] = useState({});
  const [loading, setLoading] = useState(true);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);

  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const onResponse = async (type = "", reason = "") => {
    if (
      userType !== "employer" &&
      (historyData?.type === "offer_letter_sent" || historyData?.type === "counter_offer_letter_sent") &&
      item?.status === "pending"
    ) {
      type === "accept" ? setAcceptLoading(true) : setDeclineLoading(true);
      try {
        const payload = { type };
        if (type === "decline") {
          payload.reason = reason;
        }
        const response = await applicantOfferResponse(item?.id, payload);
        if (response?.data?.status === "success") {
          window.location.href = window.location.href;
        }
      } catch (error) {
        Toast("error", error?.response?.data?.message ?? "Something went wrong.");
      } finally {
        type === "accept" ? setAcceptLoading(false) : setDeclineLoading(false);
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
      const response = await apiInstance.get(`application/${historyData?.history_data?.offer_id}/offer-detail`);
      const offer = response?.data?.data?.offer ?? response?.data?.data?.interview;
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
        <Typography sx={{ fontSize: "16px", color: "#00305B", fontWeight: 500 }}>Loading offer details...</Typography>
      </Box>
    );
  }

  const showDeclineReason =
    item?.status === "decline" && item?.reason && String(item.reason).trim() !== "";

  const submitDecline = () => {
    const trimmed = declineReason.trim();
    if (trimmed.length < MIN_DECLINE_LEN || trimmed.length > MAX_DECLINE_LEN) {
      Toast("error", `Reason must be between ${MIN_DECLINE_LEN} and ${MAX_DECLINE_LEN} characters.`);
      return;
    }
    setDeclineModalOpen(false);
    onResponse("decline", trimmed);
    setDeclineReason("");
  };

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
          {userType === "employer" ? `UCN : ${item?.ucn}` : `REQ : ${requisitionNumber}`}
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
            <RalliButton label="Accept" bg="#00305B" onClick={() => onResponse("accept")} loading={acceptLoading} />
          </Box>

          <RalliButton label="Decline" onClick={() => setDeclineModalOpen(true)} loading={declineLoading} />
        </>
      )}

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
            width: { xs: "90%", sm: 480 },
            maxWidth: 520,
          }}
        >
          <Typography sx={{ fontSize: "18px", fontWeight: 600, mb: 2, color: "#00305B" }}>
            Decline Offer
          </Typography>
          <TextField
            multiline
            minRows={4}
            fullWidth
            required
            label="Reason for Declining"
            placeholder="Please provide a reason for declining this offer..."
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value.slice(0, MAX_DECLINE_LEN))}
            error={declineReason.trim().length > 0 && declineReason.trim().length < MIN_DECLINE_LEN}
            helperText={`${declineReason.trim().length} / ${MAX_DECLINE_LEN} (min ${MIN_DECLINE_LEN})`}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}>
            <Button onClick={() => setDeclineModalOpen(false)}>Cancel</Button>
            <RalliButton
              label="Confirm Decline"
              loading={declineLoading}
              disableValue={
                declineReason.trim().length < MIN_DECLINE_LEN || declineReason.trim().length > MAX_DECLINE_LEN
              }
              onClick={submitDecline}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default OfferLetterDetails;
