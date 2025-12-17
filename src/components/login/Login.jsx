import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  IconButton,
  CircularProgress,
  Modal,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";

import ModalRalli from "../applicant/dashboardProfile/ModalRalli";
import SocialLogin from "../socialLogin/SocialLogin";

const Login = ({ data, formik, handleGoogleLogin, handleAppleLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isForgetPasswordModalOpen, setIsForgetPasswordModalOpen] =
    useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgetPassword = () => {
    setIsForgetPasswordModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsForgetPasswordModalOpen(false);
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: { xs: "auto", lg: "1050px" },
        height: { xs: "auto", lg: "662.17px" },
      }}
    >
      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          padding: { xs: "50px 30px", md: "40px 30px", lg: "20px 30px" },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", py: "20px" }}>
          <Image
            src={data?.logo}
            width={100}
            height={100}
            alt="logo"
            style={{ objectFit: "contain" }}
          />
        </Box>

        <Grid container spacing={6}>
          {/* LEFT SIDE */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                fontSize: { xs: "14px", md: "16px" },
                lineHeight: "22px",
                color: "#222222B2",
                pr: { md: "60px" },
              }}
              dangerouslySetInnerHTML={{ __html: data?.paragraph }}
            />

            <SocialLogin
              handleGoogleLogin={handleGoogleLogin}
              img={"/assets/images/google.png"}
              title={"Continue With Google"}
            />

            {/* DISCLAIMER TRIGGER */}
            <Box
              sx={{
                mt: 2,
                mb: 3,
                p: 2,
                borderRadius: "10px",
                boxShadow: "0px 0px 3px #00000040",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#222222",
                }}
              >
                UNSWAYED Employer Verification Requirement
              </Typography>
              <Button
                size="small"
                onClick={() => setIsDisclaimerOpen(true)}
                sx={{
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                View
              </Button>
            </Box>

            {data?.loginWidth?.map((item) => (
              <Link href={item?.path} key={item.label}>
                <Box
                  sx={{
                    width: "100%",
                    padding: "12px 20px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    mb: "20px",
                    boxShadow: "0px 0px 3px #00000040",
                    cursor: "pointer",
                  }}
                >
                  <Image src={item.img} width={30} height={30} alt="logo" />
                  <Typography sx={{ px: 2, fontWeight: 500 }}>
                    {item.label}
                  </Typography>
                </Box>
              </Link>
            ))}
          </Grid>

          {/* RIGHT SIDE */}
          <Grid item xs={12} md={6}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>
              {data?.loginType}
            </Typography>
            <hr />

            <form onSubmit={formik.handleSubmit}>
              {data?.inputType?.map((item) => (
                <Box key={item.label} sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: 500, mb: 1 }}>
                    {item.label}
                  </Typography>

                  <Box sx={{ position: "relative" }}>
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
                      placeholder={item.placeholder}
                      sx={{
                        width: "100%",
                        px: 2,
                        py: 2,
                        borderRadius: "10px",
                        border: "none",
                        boxShadow: "0px 0px 3px #00000040",
                      }}
                    />

                    {item.label === "Password" && (
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        sx={{
                          position: "absolute",
                          right: 10,
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    )}
                  </Box>
                </Box>
              ))}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Typography
                  onClick={handleForgetPassword}
                  sx={{ cursor: "pointer", fontWeight: 500 }}
                >
                  {data?.forgetPasswordLable}
                </Typography>

                <Button
                  type="submit"
                  disabled={formik.isSubmitting}
                  sx={{
                    backgroundColor: "#189e33ff",
                    color: "#fff",
                    fontWeight: 700,
                    px: 4,
                  }}
                >
                  {formik.isSubmitting ? (
                    <CircularProgress size={20} />
                  ) : (
                    data.buttonLable
                  )}
                </Button>
              </Box>
            </form>
          </Grid>
        </Grid>
      </Box>

      {/* DISCLAIMER MODAL */}
      <Modal open={isDisclaimerOpen} onClose={() => setIsDisclaimerOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", md: 600 },
            maxHeight: "80vh",
            backgroundColor: "#fff",
            borderRadius: "16px",
            p: 3,
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" fontWeight={700} mb={2}>
            UNSWAYED Employer Verification Requirement
          </Typography>

          <Typography mb={2}>
            To protect our community from fake job postings, fraud, and security
            risks, employers registering with a non-business email address
            (including Gmail, Yahoo, Outlook, Hotmail, and similar public domains)
            are required to complete additional business verification before
            accessing employer features on the UNSWAYED platform.
          </Typography>

          <Typography mb={2}>
            To complete verification, employers must submit at least one of the
            acceptable documents listed below or contact our verification team
            at:
          </Typography>

          <Typography fontWeight={700} mb={2}>
            contact@rallitechnologies.online
          </Typography>

          <Typography mb={2}>
            Access to job posting, applicant messaging, and hiring tools will
            remain restricted until verification is approved.
          </Typography>

          <Typography fontWeight={700} mt={2}>
            ✔ Acceptable Documentation
          </Typography>

          <Typography fontWeight={600} mt={1}>
            Primary Business Verification
          </Typography>
          <Typography>• Official Business Website</Typography>
          <Typography>• LLC Certificate / State Business Registration</Typography>
          <Typography>
            • Articles of Incorporation or Organization
          </Typography>
          <Typography>• IRS EIN Confirmation Letter (CP 575)</Typography>

          <Typography fontWeight={600} mt={2}>
            Secondary (Small Businesses & Startups)
          </Typography>
          <Typography>• Business License</Typography>
          <Typography>• DBA Certificate</Typography>
          <Typography>• Sales Tax Permit / Reseller Permit</Typography>
          <Typography>• Utility Bill in Business Name</Typography>
          <Typography>• Business Bank Letter (Name Only)</Typography>

          <Typography fontWeight={600} mt={2}>
            Enterprise / Corporate
          </Typography>
          <Typography>• Dun & Bradstreet (D-U-N-S) Number</Typography>
          <Typography>• SEC Registration</Typography>
          <Typography>• Official Corporate Registry Listing</Typography>

          <Typography fontWeight={700} mt={3}>
            ❌ Non-Acceptable Documentation
          </Typography>
          <Typography>• Personal identification only</Typography>
          <Typography>• Social Security Number</Typography>
          <Typography>• Personal bank statements</Typography>
          <Typography>• Screenshots without verification</Typography>
          <Typography>• Social media pages only</Typography>
          <Typography>• Personal utility bills</Typography>

          <Button
            fullWidth
            sx={{ mt: 3 }}
            onClick={() => setIsDisclaimerOpen(false)}
          >
            Close
          </Button>
        </Box>
      </Modal>

      <ModalRalli
        open={isForgetPasswordModalOpen}
        onClose={handleCloseModal}
        isForgetPasswordModalOpen={isForgetPasswordModalOpen}
      />
    </Box>
  );
};

export default Login;
