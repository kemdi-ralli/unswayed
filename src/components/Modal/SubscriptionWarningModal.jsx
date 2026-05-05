"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";

/**
 * SubscriptionWarningModal
 *
 * Shown when an employer's free trial has ≤ 3 days remaining but has NOT
 * expired yet. It is dismissible — the employer can close it and continue
 * using the platform. Closing does NOT suppress the blocker modal if the
 * trial later expires (the blocker is evaluated independently on mount).
 */
const SubscriptionWarningModal = ({ open, daysRemaining, onClose }) => {
  const router = useRouter();

  const dayLabel =
    daysRemaining === 1 ? "1 day" : `${daysRemaining} days`;

  const handleUpgrade = () => {
    onClose();
    router.push("/billing");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          overflow: "visible",
          p: 1,
        },
      }}
    >
      {/* Dismiss button */}
      <IconButton
        onClick={onClose}
        size="small"
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          color: "#9ca3af",
          "&:hover": { color: "#374151" },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <DialogTitle sx={{ pb: 0, pt: 3, textAlign: "center" }}>
        {/* Warning icon */}
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            bgcolor: "#fef3c7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <WarningAmberRoundedIcon sx={{ fontSize: 40, color: "#f59e0b" }} />
        </Box>

        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "22px",
            color: "#00305B",
            lineHeight: 1.3,
          }}
        >
          Your Trial Ends in {dayLabel}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", pt: 2 }}>
        <Typography
          sx={{
            fontSize: "15px",
            color: "#4b5563",
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          Your free 30-day trial is almost over. After it expires you will lose
          access to your account until a subscription is active. Upgrade now to
          keep everything running without interruption.
        </Typography>

        {/* Countdown pill */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: "999px",
            px: 3,
            py: 0.75,
          }}
        >
          <WarningAmberRoundedIcon sx={{ fontSize: 16, color: "#f97316" }} />
          <Typography
            sx={{ fontSize: "13px", fontWeight: 700, color: "#c2410c" }}
          >
            {dayLabel} left in your trial
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 1,
          gap: 1.5,
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "center",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "14px",
            px: 4,
            py: 1.2,
            borderRadius: "10px",
            borderColor: "#d1d5db",
            color: "#6b7280",
            "&:hover": { borderColor: "#9ca3af", bgcolor: "#f9fafb" },
            minWidth: 140,
          }}
        >
          Remind Me Later
        </Button>

        <Button
          onClick={handleUpgrade}
          variant="contained"
          sx={{
            textTransform: "none",
            fontWeight: 700,
            fontSize: "14px",
            px: 4,
            py: 1.2,
            borderRadius: "10px",
            bgcolor: "#00305B",
            color: "#fff",
            "&:hover": { bgcolor: "#001f3d" },
            minWidth: 140,
          }}
        >
          Upgrade Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubscriptionWarningModal;
