"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Box, CircularProgress, Typography } from "@mui/material";
import Cookie from "js-cookie";
import { login } from "@/redux/slices/authSlice";
import { Toast } from "@/components/Toast/Toast";

const BACKEND_URL = "https://unswayed.onrender.com";
const REDIRECT_URI = process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI;

export default function LinkedInCallback() {
  const router = useRouter();
  const dispatch = useDispatch();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const returnedState = params.get("state");
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (error) {
      sessionStorage.removeItem("linkedin_oauth_state");
      router.replace(`/applicant/login?error=${encodeURIComponent(errorDescription || error)}`);
      return;
    }

    const savedState = sessionStorage.getItem("linkedin_oauth_state");

    if (
      !returnedState ||
      !savedState ||
      returnedState.split(":")[0] !== savedState.split(":")[0]
    ) {
      sessionStorage.removeItem("linkedin_oauth_state");
      router.replace("/applicant/login?error=oauth_state_mismatch");
      return;
    }

    sessionStorage.removeItem("linkedin_oauth_state");

    const userType = returnedState.includes(":employer") ? "employer" : "applicant";
    const endpoint = userType === "employer"
      ? "/api/employer/social-login"
      : "/api/applicant/social-login";

    (async () => {
      try {
        const response = await fetch(`${BACKEND_URL}${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            provider: "linkedin",
            code,
            redirect_uri: REDIRECT_URI,
          }),
        });

        const json = await response.json();

        if (!response.ok) {
          const msg = json?.message || "LinkedIn sign-in failed";
          router.replace(`/${userType}/login?error=${encodeURIComponent(msg)}`);
          return;
        }

        const data = json?.data;

        dispatch(login(data));
        Cookie.set("token", data?.token);
        Cookie.set("is_completed", data?.is_completed);
        Cookie.set("isVerified", data?.is_verified);
        Cookie.set("userType", data?.user?.type);

        Toast("success", json?.message);

        if (!data?.is_completed) {
          router.replace(`/${userType}/profile/edit-profile`);
        } else if (userType === "employer") {
          router.replace("/employer/home");
        } else {
          router.replace("/applicant/career-areas");
        }
      } catch (err) {
        console.error("LinkedIn callback error:", err);
        router.replace(`/${userType}/login?error=${encodeURIComponent("LinkedIn sign-in failed. Please try again.")}`);
      }
    })();
  }, [router, dispatch]);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}
    >
      <CircularProgress size={48} sx={{ color: "#0A66C2" }} />
      <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "#222222" }}>
        Signing in with LinkedIn...
      </Typography>
    </Box>
  );
}
