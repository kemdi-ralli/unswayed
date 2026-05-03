"use client";

import React, { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/components/common/Container";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { EMPLOYER_GOOGLE_CALLBACK } from "@/services/apiService/apiEndPoints";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const oauthError = searchParams.get("error");

    if (oauthError) {
      router.replace("/employer/settings?google_error=true");
      return;
    }

    if (!code) {
      router.replace("/employer/settings?google_error=true");
      return;
    }

    const dedupeKey = `employer_google_oauth_${code}`;
    if (typeof window !== "undefined" && sessionStorage.getItem(dedupeKey)) {
      router.replace("/employer/settings");
      return;
    }
    sessionStorage.setItem(dedupeKey, "1");

    (async () => {
      const redirectUri = sessionStorage.getItem("google_oauth_redirect_uri");
      sessionStorage.removeItem("google_oauth_redirect_uri");
      try {
        const res = await apiInstance.post(EMPLOYER_GOOGLE_CALLBACK, {
          code,
          redirect_uri: redirectUri,
        });
        if (res?.data?.status === "success") {
          router.replace("/employer/settings?google_connected=true");
        } else {
          sessionStorage.removeItem(dedupeKey);
          router.replace("/employer/settings?google_error=true");
        }
      } catch (e) {
        sessionStorage.removeItem(dedupeKey);
        router.replace("/employer/settings?google_error=true");
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
