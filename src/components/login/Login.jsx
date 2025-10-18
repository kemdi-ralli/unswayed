import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import Image from "next/image";

import ModalRalli from "../applicant/dashboardProfile/ModalRalli";
import Link from "next/link";
import SocialLogin from "../socialLogin/SocialLogin";

const Login = ({ data, formik, handleGoogleLogin, handleAppleLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isForgetPasswordModalOpen, setIsForgetPasswordModalOpen] =
    useState(false);
  const handleCloseModal = () => {
    setIsForgetPasswordModalOpen(false);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleForgetPassword = () => {
    setIsForgetPasswordModalOpen(true);
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: { xs: "auto", sm: "auto", lg: "1050px" },
        height: { xs: "auto", sm: "auto", lg: "662.17px" },
      }}
    >
      <Box
        sx={{
          width: { xs: "auto", lg: "1050px" },
          height: { xs: "auto", lg: "662.17px" },
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          padding: { xs: "50px 30px", md: "40px 30px", lg: "20px 30px" },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", py: "20px" }}>
          <Image src={data?.logo} width={100} height={100} alt="logo" sx={{ objectFit: "contain" }} />
        </Box>
        <Grid container spacing={6} sx={{ mt: "0px" }}>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              order: { xs: 2, md: 1 },
            }}
          >
            <Box
              sx={{
                fontSize: { xs: "14px", md: "16px" },
                lineHeight: { xs: "26px", md: "22px" },
                fontWeight: 400,
                color: "#222222B2",
                pr: { md: "60px" },
                pb: { md: "15px" },
              }}
              dangerouslySetInnerHTML={{ __html: data?.paragraph }}
            />

            <SocialLogin
              handleGoogleLogin={handleGoogleLogin}
              img={"/assets/images/google.png"}
              title={"Continue With Google"}
            />
            {/* <SocialLogin
              handleGoogleLogin={handleAppleLogin}
              img={"/assets/images/apple.png"}
              title={"Continue With Apple"}
            /> */}
            {/* <SocialLogin
              // handleGoogleLogin={handleAppleLogin}
              img={"/assets/images/facebook.png"}
              title={"Continue With Facebook"}
            /> */}
            {data?.loginWidth?.map((item) => (
              <Link href={item?.path} key={item.label}>
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
                >
                  <Image src={item.img} width={30} height={30} alt="logo" />
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
                    {item.label}
                  </Typography>
                </Box>
              </Link>
            ))}
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{
              order: { xs: 1, md: 2 },
            }}
          >
            <Typography
              sx={{
                fontSize: "16px",
                lineHeight: "18px",
                fontWeight: 700,
                pb: { xs: "10px", md: "15px" },
              }}
            >
              {data?.loginType}
            </Typography>
            <hr />
            <form onSubmit={formik.handleSubmit}>
              {data?.inputType?.map((item) => (
                <Box key={item?.label} sx={{ mb: 1 }}>
                  <Typography
                    sx={{
                      fontSize: { xs: "14px", md: "16px" },
                      lineHeight: { xs: "22px", md: "18px" },
                      fontWeight: 500,
                      py: 1,
                      pt: { md: "18px" },
                      pb: { md: "10px" },
                    }}
                  >
                    {item?.label}
                  </Typography>
                  <Box sx={{ position: "relative", width: "100%" }}>
                    <Box
                      component="input"
                      type={
                        item.label === "Password" && !showPassword
                          ? "password"
                          : "text"
                      }
                      name={item.label.toLowerCase()}
                      value={formik.values[item.label.toLowerCase()] || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      sx={{
                        px: "18px",
                        py: "22px",
                        borderRadius: "10px",
                        boxShadow: "0px 0px 3px #00000040",
                        width: "100%",
                        border: "none",
                      }}
                      placeholder={item?.placeholder}
                    />
                    {item.label === "Password" && (
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        sx={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#222222",
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    )}
                  </Box>
                  {formik.touched[item.label.toLowerCase()] &&
                    formik.errors[item.label.toLowerCase()] && (
                      <Typography
                        sx={{
                          fontSize: { xs: "14px", md: "16px" },
                          lineHeight: { xs: "22px", md: "18px" },
                          pt: 1,
                          fontWeight: 300,
                          color: "red",
                        }}
                      >
                        {formik.errors[item.label.toLowerCase()]}
                      </Typography>
                    )}
                </Box>
              ))}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  pt: "10px",
                  mb: { xs: "20px", sm: "20px", md: "30px" },
                }}
              >
                <Typography
                  onClick={handleForgetPassword}
                  sx={{
                    fontSize: { xs: "14px", md: "16px" },
                    lineHeight: { xs: "22px", md: "18px" },
                    fontWeight: 500,
                    color: "#222222",
                    cursor: "pointer",
                  }}
                >
                  {data?.forgetPasswordLable}
                </Typography>
                <Button
                  type="submit"
                  disabled={formik.isSubmitting}
                  sx={{
                    width: { sm: "140.7px" },
                    height: "43px",
                    backgroundColor: "#189e33ff",
                    color: "#fff",
                    fontSize: "16px",
                    lineHeight: "20px",
                    fontWeight: 700,
                    letterSpacing: "3%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  {formik.isSubmitting ? (
                    <CircularProgress size={20} color="#fff" />
                  ) : (
                    data.buttonLable
                  )}
                </Button>
              </Box>
              <Typography
                component={Link}
                href={data?.continueWith?.link}
                sx={{
                  fontSize: { xs: "14px", md: "16px" },
                  lineHeight: { xs: "22px", md: "18px" },
                  fontWeight: 500,
                  color: "#222222",
                  cursor: "pointer",
                  textDecoration: "none",
                  display: "inline-block",
                  mt: 2,
                }}
              >
                {data?.continueWith?.label}
              </Typography>
            </form>
          </Grid>
        </Grid>
      </Box>
      <ModalRalli
        open={isForgetPasswordModalOpen}
        onClose={handleCloseModal}
        isForgetPasswordModalOpen={isForgetPasswordModalOpen}
      />
    </Box>
  );
};

export default Login;
