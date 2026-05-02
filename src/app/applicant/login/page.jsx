"use client";
import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { APPLICANT_LOGIN_DATA } from "@/constant/login";

import { useFormik } from "formik";
import { AuthSchema } from "@/schemas/loginSchema";

import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/authSlice";

import Cookie from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";

import apiInstance from "@/services/apiService/apiServiceInstance";
import { APPLICANT_LOGIN } from "@/services/apiService/apiEndPoints";

import Login from "@/components/login/Login";
import { Toast } from "@/components/Toast/Toast";
import { socialLogedIn } from "@/helper/socialLoginHelper";
import { initiateLinkedInLogin } from "@/helper/linkedinLogin";

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) Toast("error", decodeURIComponent(error));
  }, [searchParams]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: AuthSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        // Use Next.js API proxy to avoid CORS issues
        const response = await fetch("/api/applicant/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email.toLowerCase().trim(),
            password: values.password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            message: "Login failed"
          }));
          throw new Error(errorData?.message || "Login failed");
        }

        const responseData = await response.json();
        const loginData = responseData?.data;

        if (loginData?.is_verified) {
          router.push("/applicant/career-areas");
        } else {
          router.push("/applicant/form/emailVerification");
        }
        dispatch(login(loginData));
        Cookie.set("token", loginData?.token);
        Cookie.set("isVerified", loginData?.is_verified);
        Cookie.set("userType", loginData?.user?.type);
        Toast("success", responseData?.message);
      } catch (error) {
        const errorMessage = error?.message || "Login failed";
        setErrors({ email: errorMessage });
        Toast("error", errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });
  const handleGoogleLogin = async () => {
    try {
      const { auth } = await import("@/lib/firebase");
      const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);

      if (!credential) {
        Toast("error", "No credential found");
        return;
      }

      const idToken = credential.idToken ?? result?._tokenResponse?.oauthIdToken;
      if (!idToken) {
        Toast("error", "Could not get Google sign-in token");
        return;
      }
      await socialLogedIn(router, dispatch, "google", idToken);
    } catch (error) {
      console.error("Login failed:", error);
      if (error?.response) {
        return;
      }
      Toast("error", error?.message || "Google sign-in failed");
    }
  };
  const handleLinkedInLogin = () => {
    initiateLinkedInLogin("applicant");
  };

  const handleAppleLogin = async () => {
    try {
      const { auth } = await import("@/lib/firebase");
      const { OAuthProvider, signInWithPopup } = await import("firebase/auth");
      const provider = new OAuthProvider("apple.com");
      const result = await signInWithPopup(auth, provider);
      const credential = OAuthProvider.credentialFromResult(result);
      console.log(result, 'result')
      console.log(credential, 'credential')

      if (!credential) {
        throw new Error("No credential found");
      }

      const accessToken = result?._tokenResponse?.oauthIdToken;
      await socialLogedIn(router, dispatch, "apple", accessToken);
    } catch (error) {
      console.error("Apple Login failed:", error);
      console.error("Error Code:", error.code);
      console.error("Error Message:", error.message);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('/assets/images/login_background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Login
        data={APPLICANT_LOGIN_DATA}
        formik={formik}
        handleGoogleLogin={handleGoogleLogin}
        handleAppleLogin={handleAppleLogin}
        handleLinkedInLogin={handleLinkedInLogin}
      />
    </Box>
  );
};

export default Page;
