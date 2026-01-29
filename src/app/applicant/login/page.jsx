"use client";
import React from "react";
import { Box } from "@mui/material";
import { APPLICANT_LOGIN_DATA } from "@/constant/login";

import { useFormik } from "formik";
import { AuthSchema } from "@/schemas/loginSchema";

import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/authSlice";

import Cookie from "js-cookie";
import { useRouter } from "next/navigation";

import apiInstance from "@/services/apiService/apiServiceInstance";
import { APPLICANT_LOGIN } from "@/services/apiService/apiEndPoints";

import Login from "@/components/login/Login";
import { Toast } from "@/components/Toast/Toast";
import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { socialLogedIn } from "@/helper/socialLoginHelper";

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();

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
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);

      if (!credential) {
        throw new Error("No credential found");
      }

      const accessToken = result?.user?.accessToken ?? result?._tokenResponse?.oauthIdToken ?? credential?.accessToken ?? credential?.idToken;
      if (!accessToken) {
        Toast("error", "Could not get Google sign-in token");
        return;
      }
      await socialLogedIn(router, dispatch, "google", accessToken);
    } catch (error) {
      console.error("Login failed:", error);
      const status = error?.response?.status;
      const msg = error?.response?.data?.message ?? error?.message;
      if (status === 422) {
        Toast("error", msg ?? "Google sign-in was rejected. Please try again or use email.");
      } else if (status === 500) {
        Toast("error", msg ?? "Server error during sign-in. Please try again later or use email.");
      } else {
        Toast("error", msg ?? "Google sign-in failed");
      }
    }
  };
  const handleAppleLogin = async () => {
    try {
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
      />
    </Box>
  );
};

export default Page;
