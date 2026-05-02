"use client";

import React, { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/components/common/Container";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { EMPLOYER_GOOGLE_CALLBACK } from "@/services/apiService/apiEndPoints";
import { Toast } from "@/components/Toast/Toast";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const oauthError = searchParams.get("error");

    if (oauthError) {
      Toast("error", "Google authorization was cancelled or failed.");
      router.replace("/employer/settings");
      return;
    }

    if (!code) {
      Toast("error", "Missing authorization code.");
      router.replace("/employer/settings");
      return;
    }

    const dedupeKey = `employer_google_oauth_${code}`;
    if (typeof window !== "undefined" && sessionStorage.getItem(dedupeKey)) {
      router.replace("/employer/settings");
      return;
    }
    sessionStorage.setItem(dedupeKey, "1");

    (async () => {
      try {
        const res = await apiInstance.post(EMPLOYER_GOOGLE_CALLBACK, { code });
        if (res?.data?.status === "success") {
          Toast("success", "Google account connected");
        } else {
          sessionStorage.removeItem(dedupeKey);
          Toast("error", res?.data?.message ?? "Could not complete Google connection.");
        }
      } catch (e) {
        sessionStorage.removeItem(dedupeKey);
        Toast("error", e?.response?.data?.message ?? "Could not complete Google connection.");
      } finally {
        router.replace("/employer/settings");
      }
    })();
  }, [searchParams, router]);

  return (
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="40vh"
        gap={2}
      >
        <CircularProgress sx={{ color: "#189e33" }} />
        <Typography color="text.secondary">Completing Google Calendar connection…</Typography>
      </Box>
    </Container>
  );
};

export default Page;
