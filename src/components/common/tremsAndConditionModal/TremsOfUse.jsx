"use client";
import React, { useState } from "react";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import TermsOfUseModal from "./TremsOfUseModal";
import Cookie from "js-cookie";

const TremsOfUse = ({
  agreeTerms,
  setAgreeTerms,
  error,
  variant,
}) => {
  const [openTermsModal, setOpenTermsModal] = useState(false);

  const handleCloseTermsModal = () => {
    setOpenTermsModal(false);
  };

  const handleAgree = () => {
    setAgreeTerms(true);
    handleCloseTermsModal();
  };

  const handleOpenTermsModal = (e) => {
    e.stopPropagation();
    setOpenTermsModal(true);
  };

  let tokenCookie = Cookie.get("token");

  return (
    <>
      <Box sx={{ mb: "20px", display: "flex", alignItems: "center" }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              sx={{
                color: "#00305B",
                "&.Mui-checked": {
                  color: "#00305B",
                },
              }}
            />
          }
          label={
            tokenCookie && (
              <Typography sx={{ fontSize: "14px" }}>
                Do you agree with{" "}
              </Typography>)
          }
        />
        {!tokenCookie ? (
          <Typography sx={{
            fontSize: { xs: "11px", sm: "12px", md: "14px" },
            fontWeight: 300,
          }}>
            By providing your phone number, you consent to receive SMS text messages from{" "}
            <b>RALLi Technologies</b> for the purpose of account verification, including sending
            verification codes when needed. Do you agree with{" "}
            <Typography
              component="span"
              sx={{
                fontSize: { xs: "11px", sm: "14px", md: "16px" },
                lineHeight: { xs: "14px", sm: "18px", md: "20px" },

                fontWeight: "bold",
                color: "#189e33ff",
                cursor: "pointer",
              }}
              onClick={handleOpenTermsModal}
            >
              Ralli Terms and Condition
            </Typography>
          </Typography>
        ) : (
          <>
            <Typography
              component="span"
              sx={{
                fontSize: { xs: "11px", sm: "14px", md: "16px" },
                lineHeight: { xs: "14px", sm: "18px", md: "20px" },

                fontWeight: "bold",
                color: "#189e33ff",
                cursor: "pointer",
              }}
              onClick={handleOpenTermsModal}
            >
              User Agreement & Consent Form
            </Typography>
          </>
        )}

      </Box>
      {error && (
        <Typography sx={{ color: "red", fontSize: "12px", mb: "10px" }}>
          {error}
        </Typography>
      )}

      <TermsOfUseModal
        handleAgree={handleAgree}
        open={openTermsModal}
        onClose={handleCloseTermsModal}
        variant={variant}
      />
    </>
  );
};

export default TremsOfUse;
