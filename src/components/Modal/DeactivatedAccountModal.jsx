"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import { AlertCircle, CheckCircle2, Mail, RefreshCw } from "lucide-react";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import { useDispatch } from "react-redux";
import { clearUserDataLogout } from "@/redux/slices/authSlice";
import { Toast } from "@/components/Toast/Toast";

const PRELOADER_DELAY_MS = 300;

const DeactivatedAccountModal = ({ open, userType = "applicant", deactivatedAt }) => {
  const [loading, setLoading] = useState(false);
  const [reactivationRequested, setReactivationRequested] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!open) {
      setContentReady(false);
      return;
    }
    const t = setTimeout(() => setContentReady(true), PRELOADER_DELAY_MS);
    return () => clearTimeout(t);
  }, [open]);

  // Format deactivation date
  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Unknown date";
    }
  };

  // Handle account reactivation request
  const handleReactivateAccount = async () => {
    setLoading(true);
    try {
      const response = await apiInstance.post("/settings/reactivate-account");

      if (response?.data?.status === "success") {
        setReactivationRequested(true);
        Toast("success", response?.data?.message || "Reactivation request submitted successfully!");
        
        // Optionally auto-logout after a delay
        setTimeout(() => {
          handleLogout();
        }, 3000);
      } else {
        Toast("error", response?.data?.message || "Failed to request reactivation.");
      }
    } catch (error) {
      console.error("Reactivation error:", error);
      Toast("error", error?.response?.data?.message || "Failed to reactivate account. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    try {
      Cookie.remove("token");
      Cookie.remove("isVerified");
      Cookie.remove("userType");
      Cookie.remove("is_completed");
      dispatch(clearUserDataLogout());
      
      const loginPath = userType === "employer" ? "/employer/login" : "/applicant/login";
      router.push(loginPath);
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/";
    }
  };

  // Handle contact support
  const handleContactSupport = () => {
    window.location.href = "mailto:support@unswayed.com?subject=Account Reactivation Request";
  };

  return (
    <Modal
      open={open}
      aria-labelledby="deactivated-account-modal"
      aria-describedby="account-deactivated-message"
      disableEscapeKeyDown
      sx={{
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(0, 0, 0, 0.85)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "500px", md: "600px" },
          maxHeight: "90vh",
          bgcolor: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          p: { xs: 3, sm: 4, md: 5 },
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#00305B",
            borderRadius: "10px",
          },
        }}
      >
        {!contentReady ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 280 }}>
            <CircularProgress size={48} sx={{ color: "#00305B" }} />
          </Box>
        ) : !reactivationRequested ? (
          <>
            {/* Header Section */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Box
                sx={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  bgcolor: "#fee2e2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <AlertCircle size={48} color="#dc2626" strokeWidth={2} />
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#00305B",
                  mb: 2,
                  fontSize: { xs: "24px", sm: "28px", md: "32px" },
                }}
              >
                Account Deactivated
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: "14px", sm: "16px" },
                  color: "#6b7280",
                  lineHeight: 1.6,
                }}
              >
                Your account was deactivated on{" "}
                <strong>{formatDate(deactivatedAt)}</strong>
              </Typography>
            </Box>

            {/* Information Section */}
            <Box
              sx={{
                bgcolor: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                p: 3,
                mb: 4,
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#374151",
                  mb: 2,
                  fontWeight: 600,
                }}
              >
                What does this mean?
              </Typography>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#6b7280",
                  lineHeight: 1.6,
                  mb: 2,
                }}
              >
                Your account has been temporarily deactivated. While deactivated:
              </Typography>
              <Box component="ul" sx={{ pl: 3, m: 0, color: "#6b7280" }}>
                <li style={{ fontSize: "13px", marginBottom: "8px" }}>
                  You cannot access your account
                </li>
                <li style={{ fontSize: "13px", marginBottom: "8px" }}>
                  Your profile is hidden from other users
                </li>
                <li style={{ fontSize: "13px", marginBottom: "8px" }}>
                  {userType === "employer" 
                    ? "Your job postings are not visible"
                    : "Your applications remain submitted but inactive"}
                </li>
                <li style={{ fontSize: "13px", marginBottom: "8px" }}>
                  Your data is preserved and can be restored
                </li>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Reactivation Section */}
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#00305B",
                  mb: 2,
                }}
              >
                Want to reactivate your account?
              </Typography>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#6b7280",
                  lineHeight: 1.6,
                  mb: 3,
                }}
              >
                You can request to reactivate your account at any time. Click the
                button below to submit a reactivation request. Our team will review
                and reactivate your account within 24-48 hours.
              </Typography>

              <Button
                variant="contained"
                fullWidth
                disabled={loading}
                onClick={handleReactivateAccount}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <RefreshCw size={20} />}
                sx={{
                  py: 1.5,
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "16px",
                  textTransform: "none",
                  bgcolor: "#189e33ff",
                  color: "#ffffff",
                  mb: 2,
                  "&:hover": {
                    bgcolor: "#147c2cff",
                  },
                  "&:disabled": {
                    bgcolor: "#9ca3af",
                    color: "#ffffff",
                  },
                }}
              >
                {loading ? "Processing..." : "Request Account Reactivation"}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={handleContactSupport}
                startIcon={<Mail size={20} />}
                sx={{
                  py: 1.5,
                  borderRadius: "12px",
                  fontWeight: 600,
                  fontSize: "14px",
                  textTransform: "none",
                  borderColor: "#00305B",
                  color: "#00305B",
                  "&:hover": {
                    borderColor: "#00203d",
                    bgcolor: "rgba(0, 48, 91, 0.04)",
                  },
                }}
              >
                Contact Support
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Logout Button */}
            <Button
              variant="text"
              fullWidth
              onClick={handleLogout}
              sx={{
                py: 1,
                borderRadius: "8px",
                fontWeight: 500,
                fontSize: "14px",
                textTransform: "none",
                color: "#6b7280",
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            {/* Success State - Reactivation Requested */}
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Box
                sx={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  bgcolor: "#dcfce7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <CheckCircle2 size={48} color="#16a34a" strokeWidth={2} />
              </Box>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#00305B",
                  mb: 2,
                  fontSize: { xs: "20px", sm: "24px" },
                }}
              >
                Reactivation Request Submitted!
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: "14px", sm: "15px" },
                  color: "#6b7280",
                  lineHeight: 1.6,
                  mb: 4,
                }}
              >
                Thank you! Your account reactivation request has been successfully
                submitted. Our team will review your request and reactivate your
                account within 24-48 hours.
              </Typography>

              <Box
                sx={{
                  bgcolor: "#f0f9ff",
                  border: "1px solid #bae6fd",
                  borderRadius: "12px",
                  p: 3,
                  mb: 4,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: "#0c4a6e",
                    lineHeight: 1.6,
                  }}
                >
                  <strong>What happens next?</strong>
                  <br />
                  • You will receive a confirmation email shortly
                  <br />
                  • Our team will review your request
                  <br />
                  • You'll be notified once your account is reactivated
                  <br />• You can then log in and access all features
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "16px",
                  textTransform: "none",
                  bgcolor: "#00305B",
                  color: "#ffffff",
                  "&:hover": {
                    bgcolor: "#00203d",
                  },
                }}
              >
                Return to Login
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default DeactivatedAccountModal;
