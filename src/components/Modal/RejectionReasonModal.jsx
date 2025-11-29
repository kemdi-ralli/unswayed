import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography,
  TextField,
} from "@mui/material";

const RejectionReasonModal = ({
  open,
  onClose,
  reasons,
  onReasonSelect,
}) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const handleReasonChange = (event) => {
    setSelectedReason(event.target.value);
    setOtherReason("");
  };

  const handleOtherReasonChange = (event) => {
    setOtherReason(event.target.value);
  };

  const handleConfirm = () => {
    if (!selectedReason) {
      return;
    }

    const finalReason =
      selectedReason === "Other" ? otherReason : selectedReason;

    onReasonSelect(finalReason);
    setSelectedReason("");
    setOtherReason("");
  };

  const handleClose = () => {
    setSelectedReason("");
    setOtherReason("");
    onClose();
  };

  const isOtherSelected = selectedReason === "Other";
  const isConfirmDisabled =
    !selectedReason || (isOtherSelected && !otherReason.trim());

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
        Reason for Rejection
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              color: "#555555",
              mb: 2,
            }}
          >
            Please select the reason for rejecting this candidate:
          </Typography>

          <RadioGroup
            value={selectedReason}
            onChange={handleReasonChange}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            {reasons.map((reason, index) => (
              <Box key={index}>
                <FormControlLabel
                  value={reason}
                  control={
                    <Radio
                      sx={{
                        color: "#00305B",
                        "&.Mui-checked": {
                          color: "#189e33ff",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#222222",
                      }}
                    >
                      {reason}
                    </Typography>
                  }
                />
              </Box>
            ))}
          </RadioGroup>

          {isOtherSelected && (
            <Box sx={{ mt: 2, ml: 4 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Please specify the reason..."
                value={otherReason}
                onChange={handleOtherReasonChange}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    fontSize: "14px",
                    backgroundColor: "#f5f5f5",
                    "&:hover fieldset": {
                      borderColor: "#00305B",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#189e33ff",
                    },
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e0e0e0",
                  },
                }}
              />
            </Box>
          )}
        </Box>
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
          disabled={isConfirmDisabled}
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
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectionReasonModal;