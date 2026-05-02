"use client";
import React, { useState } from "react";
import {
  EMAIL_CORRECTION,
  EMAIL_VERIFICATIONS,
} from "@/constant/applicantForm/formData";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import {
  ANOTHER_EMAIL,
  RESEND,
  VERIFY,
} from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";
import EmailVerification from "@/components/applicantForm/EmailVerification";
import Container from "@/components/common/Container";
import CorrectEmail from "@/components/applicantForm/CorrectEmail";
import { Toast } from "@/components/Toast/Toast";
import { login } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";

const Page = () => {
  const [form, setForm] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAnotherEmail, setIsAnotherEmail] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (isAnotherEmail) {
      if (!form.email) {
        setError("Email is required.");
        setLoading(false);
        return;
      }
    }
    if (!isAnotherEmail) {
      if (!form.verification) {
        setError("OTP is required.");
        setLoading(false);
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append("email", form.email);
      formData.append("otp", Number(form.verification));

      let response;
      if (isAnotherEmail) {
        response = await apiInstance.post(ANOTHER_EMAIL, formData);
        setIsAnotherEmail(false);
      } else {
        response = await apiInstance.post(VERIFY, formData);
        const isVerified = response?.data?.data?.is_verified;
        const finalData = response?.data?.data
        dispatch(login(finalData));
        Cookie.set("isVerified", isVerified);

        if (isVerified) {
          const userType = response?.data?.user?.type;
          router.push(
            userType === "applicant"
              ? "/applicant/career-areas"
              : "/employer/my-posts"
          );
        }
      }

      Toast("success", response?.data?.message);
    } catch (error) {
      const apiErrorMessage =
        error?.response?.data?.errors?.email ||
        error?.response?.data?.message ||
        "Something went wrong";

      setError(apiErrorMessage);
      Toast("error", apiErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await apiInstance.post(RESEND);
      Toast("success", response?.data?.message);
    } catch (error) {
      setError(error?.response?.data?.message || "Something went wrong");
      Toast("error", error?.response?.data?.message);
    }
  };

  const handleBack = () => {
    router.back();
  };
  const handleAnotherEmail = () => {
    setError();
    setIsAnotherEmail(true);
  };
  return (
    <>
      <Container>
        {isAnotherEmail ? (
          <CorrectEmail
            data={EMAIL_CORRECTION}
            form={form}
            handleChange={handleChange}
            error={error}
            loading={loading}
            handleBack={handleBack}
            onSubmit={handleSubmit}
          />
        ) : (
          <EmailVerification
            data={EMAIL_VERIFICATIONS}
            handleAnotherEmail={handleAnotherEmail}
            handleResendCode={handleResendCode}
            form={form}
            handleChange={handleChange}
            error={error}
            loading={loading}
            handleBack={handleBack}
            onSubmit={handleSubmit}
            required={true}
          />
        )}
      </Container>
    </>
  );
};

export default Page;
