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
        const formData = new FormData();
        formData.append("email", values.email);
        formData.append("password", values.password);

        const response = await apiInstance?.post(APPLICANT_LOGIN, formData);
        const loginData = response?.data?.data;

        if (loginData?.is_verified) {
          router.push("/applicant/career-areas");
        } else {
          router.push("/applicant/form/emailVerification");
        }
        dispatch(login(loginData));
        Cookie.set("token", loginData?.token);
        Cookie.set("isVerified", loginData?.is_verified);
        Cookie.set("userType", loginData?.user?.type);
        Toast("success", response?.data?.message);
      } catch (error) {
        setErrors({ email: error?.response?.data?.message || "Login failed" });
        Toast("error", error?.response?.data?.message || "Failed to login");
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

      const accessToken = result?._tokenResponse?.oauthIdToken;
      await socialLogedIn(router, dispatch, "google", accessToken);
    } catch (error) {
      console.error("Login failed:", error);
      console.error("Error Code:", error.code);
      console.error("Error Message:", error.message);
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
