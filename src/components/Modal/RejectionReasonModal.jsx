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

const RejectionReasonModal = ({ open, onClose, onReasonSelect }) => {
  const [reason, setReason] = useState("");
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    if (!open) {
      setContentReady(false);
      setReason("");
      return;
    }
    const t = setTimeout(() => setContentReady(true), PRELOADER_DELAY_MS);
    return () => clearTimeout(t);
  }, [open]);

  const handleConfirm = () => {
    const trimmed = reason.trim();
    if (trimmed.length < MIN_LEN || trimmed.length > MAX_LEN) {
      return;
    }
    onReasonSelect(trimmed);
    setReason("");
  };

  const handleClose = () => {
    setReason("");
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
        sx: {
          borderRadius: "12px",
        },
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
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200, py: 4 }}>
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
              Please provide a reason for rejecting this application. This will be shared with the candidate.
            </Typography>
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
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
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
            "&:hover": {
              backgroundColor: "#147a28",
            },
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
