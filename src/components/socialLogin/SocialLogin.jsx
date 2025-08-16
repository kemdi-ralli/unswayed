import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

const SocialLogin = ({handleGoogleLogin, img, title}) => {
  return (
    <Box
      sx={{
        width: "100%",
        padding: "12px 20px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        my: "15px",
        mb: "20px",
        boxShadow: "0px 0px 3px #00000040",
        cursor: "pointer",
      }}
      onClick={handleGoogleLogin}
    >
      <Image
        src={img}
        width={30}
        height={30}
        alt="logo"
      />
      <Typography
        sx={{
          fontSize: { xs: "14px", md: "16px" },
          lineHeight: { xs: "19px", md: "18px" },
          fontWeight: 500,
          color: "#222222",
          py: "10px",
          px: "13px",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default SocialLogin;
