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

const OFFER_DECLINE_REASONS = [
  "Salary offered is below expectations",
  "Benefits package is not competitive",
  "Accepted another job offer",
  "Lack of career growth opportunities",
  "Concerns about company culture",
  "Poor work-life balance expectations",
  "Job role does not match expectations",
  "Negative interview experience",
  "Long commute or unfavorable location",
  "Remote work not available or flexible enough",
  "Concerns about company stability or reputation",
  "Relocation requirements are not feasible",
  "Other",
];

const OfferLetterDetails = ({ requisitionNumber = "", userType = "", historyData = {} }) => {
  const [item, setItem] = useState({});
  const [loading, setLoading] = useState(true);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);

  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [selectedDeclinePreset, setSelectedDeclinePreset] = useState(null);

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

  const handleDeclinePresetSelect = (preset) => {
    setSelectedDeclinePreset(preset);
    if (preset !== "Other") {
      setDeclineReason(preset);
    } else {
      setDeclineReason("");
    }
  };

  const handleDeclineModalClose = () => {
    setDeclineModalOpen(false);
    setDeclineReason("");
    setSelectedDeclinePreset(null);
  };

  const submitDecline = () => {
    const trimmed = declineReason.trim();
    if (trimmed.length < MIN_DECLINE_LEN || trimmed.length > MAX_DECLINE_LEN) {
      Toast("error", `Reason must be between ${MIN_DECLINE_LEN} and ${MAX_DECLINE_LEN} characters.`);
      return;
    }
    setDeclineModalOpen(false);
    setDeclineReason("");
    setSelectedDeclinePreset(null);
    onResponse("decline", trimmed);
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

      <Modal open={declineModalOpen} onClose={handleDeclineModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "12px",
            p: 4,
            width: { xs: "90%", sm: 520 },
            maxWidth: 560,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography
            sx={{ fontSize: "20px", fontWeight: 700, mb: 1, color: "#00305B" }}
          >
            Decline Offer
          </Typography>
          <Typography sx={{ fontSize: "14px", color: "#555555", mb: 2 }}>
            Please select a reason for declining this offer.
          </Typography>

          {/* ── Preset reason chips ── */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {OFFER_DECLINE_REASONS.map((preset) => {
              const isSelected = selectedDeclinePreset === preset;
              const isOther = preset === "Other";
              return (
                <Box
                  key={preset}
                  onClick={() => handleDeclinePresetSelect(preset)}
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    borderRadius: "20px",
                    border: `1.5px solid ${
                      isSelected
                        ? isOther
                          ? "#e65100"
                          : "#00305B"
                        : "#d0d0d0"
                    }`,
                    backgroundColor: isSelected
                      ? isOther
                        ? "#fff3e0"
                        : "#00305B"
                      : "#f5f5f5",
                    color: isSelected
                      ? isOther
                        ? "#e65100"
                        : "#ffffff"
                      : "#555555",
                    fontSize: "13px",
                    fontWeight: isSelected ? 600 : 400,
                    cursor: "pointer",
                    userSelect: "none",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      borderColor: isOther ? "#e65100" : "#00305B",
                      backgroundColor: isSelected ? undefined : "#eef3f8",
                      color: isSelected ? undefined : "#00305B",
                    },
                  }}
                >
                  {preset}
                </Box>
              );
            })}
          </Box>

          {/* ── Free-text field — only when "Other" is selected ── */}
          {selectedDeclinePreset === "Other" && (
            <TextField
              multiline
              minRows={4}
              fullWidth
              required
              label="Reason for Declining"
              placeholder="Please provide a reason for declining this offer..."
              value={declineReason}
              onChange={(e) =>
                setDeclineReason(e.target.value.slice(0, MAX_DECLINE_LEN))
              }
              error={
                declineReason.trim().length > 0 &&
                declineReason.trim().length < MIN_DECLINE_LEN
              }
              helperText={`${declineReason.trim().length} / ${MAX_DECLINE_LEN} (min ${MIN_DECLINE_LEN})`}
              sx={{ mb: 2 }}
            />
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}>
            <Button
              onClick={handleDeclineModalClose}
              sx={{
                color: "#00305B",
                fontWeight: 600,
                fontSize: "14px",
                textTransform: "none",
                border: "1px solid #00305B",
                borderRadius: "6px",
                px: 3,
                "&:hover": { backgroundColor: "#f0f0f0" },
              }}
            >
              Cancel
            </Button>
            <RalliButton
              label="Confirm Decline"
              loading={declineLoading}
              disableValue={
                declineReason.trim().length < MIN_DECLINE_LEN ||
                declineReason.trim().length > MAX_DECLINE_LEN
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
