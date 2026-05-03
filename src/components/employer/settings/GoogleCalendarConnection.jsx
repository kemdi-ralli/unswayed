"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import apiInstance from "@/services/apiService/apiServiceInstance";
import {
  EMPLOYER_GOOGLE_AUTH_URL,
  EMPLOYER_GOOGLE_DISCONNECT,
  EMPLOYER_GOOGLE_STATUS,
} from "@/services/apiService/apiEndPoints";
import { Toast } from "@/components/Toast/Toast";

const GoogleCalendarConnection = () => {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [expiresAt, setExpiresAt] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiInstance.get(EMPLOYER_GOOGLE_STATUS);
      const data = res?.data?.data;
      if (data) {
        setIsConnected(!!data.is_connected);
        setExpiresAt(data.expires_at ?? null);
      }
    } catch (e) {
      Toast("error", e?.response?.data?.message ?? "Could not load Google Calendar status.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    const connected = searchParams.get("google_connected");
    const error = searchParams.get("google_error");
    if (connected === "true") {
      Toast("success", "Google Calendar connected successfully!");
      fetchStatus();
      router.replace("/employer/settings");
    } else if (error === "true") {
      Toast("error", "Failed to connect Google Calendar. Please try again.");
      router.replace("/employer/settings");
    }
  }, [searchParams, fetchStatus, router]);

  const connect = async () => {
    setActionLoading(true);
    try {
      const redirectUri = `${window.location.origin}/employer/settings/google-callback`;
      const res = await apiInstance.get(EMPLOYER_GOOGLE_AUTH_URL, {
        params: { redirect_uri: redirectUri },
      });
      const url = res?.data?.data?.auth_url;
      if (url) {
        sessionStorage.setItem("google_oauth_redirect_uri", redirectUri);
        window.location.href = url;
        return;
      }
      Toast("error", "Could not start Google connection.");
    } catch (e) {
      Toast("error", e?.response?.data?.message ?? "Could not start Google connection.");
    } finally {
      setActionLoading(false);
    }
  };

  const disconnect = async () => {
    setActionLoading(true);
    try {
      const res = await apiInstance.post(EMPLOYER_GOOGLE_DISCONNECT);
      if (res?.data?.status === "success") {
        Toast("success", "Google account disconnected");
        await fetchStatus();
      }
    } catch (e) {
      Toast("error", e?.response?.data?.message ?? "Disconnect failed.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box
      sx={{
        mb: 3,
        p: 3,
        borderRadius: "12px",
        boxShadow: "0px 0px 3px 1px #00000026",
        backgroundColor: "#fff",
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: "18px", color: "#00305B", mb: 1 }}>
        Google Calendar
      </Typography>
      <Typography sx={{ fontSize: "14px", color: "#555", mb: 2 }}>
        Connect your Google account to generate Google Meet links when scheduling interviews.
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" py={2}>
          <CircularProgress size={32} sx={{ color: "#189e33" }} />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2 }}>
          {isConnected ? (
            <>
              <Chip
                label="Google Calendar Connected"
                sx={{
                  backgroundColor: "#e8f5e9",
                  color: "#2e7d32",
                  fontWeight: 600,
                }}
              />
              {expiresAt && (
                <Typography variant="caption" color="text.secondary">
                  Connection refreshes before {new Date(expiresAt).toLocaleString()}
                </Typography>
              )}
              <Button
                variant="outlined"
                color="error"
                disabled={actionLoading}
                onClick={disconnect}
              >
                Disconnect
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              disabled={actionLoading}
              onClick={connect}
              sx={{ backgroundColor: "#00305B", "&:hover": { backgroundColor: "#002244" } }}
            >
              {actionLoading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Connect Google Account"}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default GoogleCalendarConnection;
