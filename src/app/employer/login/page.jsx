"use client";
import React, { useState } from "react";
import { Box } from "@mui/material";
import { EMPLOYER_LOGIN_DATA } from "@/constant/login";

import { useFormik } from "formik";
import { AuthSchema } from "@/schemas/loginSchema";

import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/authSlice";

import Cookie from "js-cookie";
import { useRouter } from "next/navigation";

import apiInstance from "@/services/apiService/apiServiceInstance";
import { EMPLOYER_LOGIN } from "@/services/apiService/apiEndPoints";

import Login from "@/components/login/Login";
import { Toast } from "@/components/Toast/Toast";
import { employerSocialLogedIn } from "@/helper/socialLoginHelper";

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: AuthSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setLoading(true);
      try {
        // Use Next.js API proxy to avoid CORS issues
        const response = await fetch("/api/employer/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
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
          router.push("/employer/home");
        } else {
          router.push("/employer/form/emailVerification");
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
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { auth } = await import("@/lib/firebase");
      const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);

      if (!credential) {
        throw new Error("No credential found");
      }

      // Validate email domain
      const email = result?.user?.email?.toLowerCase().trim();
      
      if (!email) {
        throw new Error("Email is required.");
      }

      // Restricted personal domains
      const restrictedDomains = [
        "@gmail.com",
        "@yahoo.com",
        "@aol.com",
        "@comcast.net",
        "@onmicrosoft.com",
        "@outlook.com",
        "@hotmail.com",
        "@live.com",
        "@protonmail.com",
        "@mail.com",
        "@zoho.com",
        "@icloud.com",
      ];

      // Whitelisted domains (allowed even if not company-standard)
      const whitelistDomains = [
        "@partner.org",
        "@affiliate.net",
      ];

      const isWhitelisted = whitelistDomains.some((domain) =>
        email.endsWith(domain)
      );

      const isRestricted = restrictedDomains.some((domain) =>
        email.endsWith(domain)
      );

      if (!isWhitelisted && isRestricted) {
        Toast("error", "Please use your company email (e.g., @yourcompany.com) to sign in.");
        return;
      }

      const accessToken = result?._tokenResponse?.oauthIdToken;
      await employerSocialLogedIn(router, dispatch, "google", accessToken);
    } catch (error) {
      console.error("Login failed:", error);
      console.error("Error Code:", error.code);
      console.error("Error Message:", error.message);
      Toast("error", error.message || "Login failed");
    } finally {
      setLoading(false);
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
      <Login data={EMPLOYER_LOGIN_DATA} formik={formik} handleGoogleLogin={handleGoogleLogin} loading={loading} />
    </Box>
  );
};

export default Page;