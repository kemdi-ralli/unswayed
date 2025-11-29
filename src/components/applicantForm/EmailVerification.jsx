"use client";
import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";
import Image from "next/image";
import FormTitle from "../applicant/dashboard/FormTitle";

const EmailVerification = ({
  data,
  onSubmit,
  handleAnotherEmail,
  handleResendCode,
  form,
  handleChange,
  handleBack,
  error,
  loading,
  required,
}) => {
  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "50%" },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: "15px",
          mb: "20px",
        }}
      >
        <Button onClick={handleBack} sx={{ minWidth: 0, p: 0 }}>
          <ArrowCircleLeftRoundedIcon sx={{ color: "#00305B", fontSize: 32 }} />
        </Button>
        <Image src={data?.logo} width={70} height={70} alt="logo" />
      </Box>
      <FormTitle label={data?.title} />
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: 600,
          lineHeight: "18px",
          color: "#00305B",
          mb: "20px",
          textTransform: "capitalize",
        }}
      >
        {data?.description}
      </Typography>

      <form onSubmit={onSubmit}>
        {data?.form?.map((item) => (
          <Box key={item.name} sx={{ mb: "20px" }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "18px",
                color: "#222222",
                mb: "10px",
                textTransform: "capitalize",
              }}
            >
              {item?.names}
              {required && <span style={{ color: "red" }}>*</span>}
            </Typography>
            <Box
              component="input"
              sx={{
                width: "100%",
                borderRadius: "10px",
                boxShadow: "0px 0px 3px #00000040",
                border: "none",
                padding: "18px 20px",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: 300,
                lineHeight: "18px",
                color: "#222222",
              }}
              placeholder={item?.placeHolder}
              onChange={(e) => handleChange(item.name, e.target.value)}
              type="number"
              typeof="number"
            />
          </Box>
        ))}

        {error && (
          <Typography sx={{ color: "red", fontSize: "14px", mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            pb: 4,
          }}
        >
          <Button
            type="button"
            sx={{
              fontSize: "16px",
              lineHeight: "18px",
              textDecoration: "underline",
              color: "#00305B",
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            onClick={handleResendCode}
          >
            Resend Verification Code
          </Button>
          <Button
            type="button"
            sx={{
              fontSize: "16px",
              lineHeight: "18px",
              textDecoration: "underline",
              color: "#00305B",
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            onClick={handleAnotherEmail}
          >
            Send Code To Another Email
          </Button>
        </Box>

        <Button
          type="submit"
          sx={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#189e33ff",
            color: "#FFFFFF",
            fontSize: "16px",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "10px",
            ":hover": {
              backgroundColor: "#116923ff",
            },
          }}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Box>
  );
};

export default EmailVerification;
