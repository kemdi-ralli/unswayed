import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";

const PRELOADER_DELAY_MS = 300;
const MIN_LEN = 10;
const MAX_LEN = 1000;

const EMPLOYER_REJECTION_REASONS = [
  "Lack of required education or certifications",
  "Insufficient relevant work experience",
  "Skills do not match job requirements",
  "Overqualified for the role",
  "Underqualified for the role",
  "Inaccurate or misleading information",
  "Poor communication skills",
  "Lack of preparation or knowledge about the company",
  "Inability to clearly explain experience or achievements",
  "Negative attitude or lack of enthusiasm",
  "Inappropriate behavior or comments",
  "Poor teamwork or collaboration skills",
  "Lack of adaptability",
  "Unprofessional demeanor",
  "Negative references from previous employers",
  "Failed background check",
  "Unverifiable employment history",
  "Salary expectations too high",
  "Other",
];

const RejectionReasonModal = ({ open, onClose, onReasonSelect }) => {
  const [reason, setReason] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    if (!open) {
      setContentReady(false);
      setReason("");
      setSelectedPreset(null);
      return;
    }
    const t = setTimeout(() => setContentReady(true), PRELOADER_DELAY_MS);
    return () => clearTimeout(t);
  }, [open]);

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset);
    if (preset !== "Other") {
      setReason(preset);
    } else {
      setReason("");
    }
  };

  const handleConfirm = () => {
    const trimmed = reason.trim();
    if (trimmed.length < MIN_LEN || trimmed.length > MAX_LEN) return;
    onReasonSelect(trimmed);
    setReason("");
    setSelectedPreset(null);
  };

  const handleClose = () => {
    setReason("");
    setSelectedPreset(null);
    onClose();
  };

  const len = reason.trim().length;
  const confirmDisabled = len < MIN_LEN || len > MAX_LEN;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "12px" },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "20px",
          fontWeight: 700,
          color: "#00305B",
          py: 3,
        }}
      >
        Reject Candidate
      </DialogTitle>

      <DialogContent>
        {!contentReady ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
              py: 4,
            }}
          >
            <CircularProgress size={40} sx={{ color: "#00305B" }} />
          </Box>
        ) : (
          <Box sx={{ pt: 1 }}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                color: "#555555",
                mb: 2,
              }}
            >
              Please provide a reason for rejecting this application. This will
              be shared with the candidate.
            </Typography>

            {/* ── Preset reason chips ── */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {EMPLOYER_REJECTION_REASONS.map((preset) => {
                const isSelected = selectedPreset === preset;
                const isOther = preset === "Other";
                return (
                  <Box
                    key={preset}
                    onClick={() => handlePresetSelect(preset)}
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
                        backgroundColor: isSelected
                          ? undefined
                          : "#eef3f8",
                        color: isSelected ? undefined : "#00305B",
                      },
                    }}
                  >
                    {preset}
                  </Box>
                );
              })}
            </Box>

            {/* ── Free-text field — only shown when "Other" is selected ── */}
            {selectedPreset === "Other" && (
              <TextField
                fullWidth
                required
                multiline
                minRows={4}
                label="Reason for Rejection"
                placeholder="Please provide a brief reason for rejecting this application..."
                value={reason}
                onChange={(e) => setReason(e.target.value.slice(0, MAX_LEN))}
                error={len > 0 && len < MIN_LEN}
                helperText={`${len} / ${MAX_LEN} characters (minimum ${MIN_LEN})`}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    fontSize: "14px",
                    backgroundColor: "#f5f5f5",
                  },
                }}
              />
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          gap: 1,
        }}
      >
        <Button
          onClick={handleClose}
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
        <Button
          onClick={handleConfirm}
          disabled={confirmDisabled}
          sx={{
            backgroundColor: "#189e33ff",
            color: "white",
            fontWeight: 600,
            fontSize: "14px",
            textTransform: "none",
            borderRadius: "6px",
            px: 3,
            "&:hover": { backgroundColor: "#147a28" },
            "&:disabled": {
              backgroundColor: "#cccccc",
              color: "#666666",
            },
          }}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectionReasonModal;
