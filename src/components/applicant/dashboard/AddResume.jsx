"use client";
import React, { useRef } from "react";
import { Box, Button, Divider, Typography } from "@mui/material";
import Image from "next/image";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";
import RalliButton from "@/components/button/RalliButton";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import ResumeTab from "../ResumeTab/ResumeTab";
import ResumeInput from "@/components/applicant/ResumeTab/ResumeInput"
import {
  attachResume,
} from "@/redux/slices/getResumesSlice";

const AddResume = ({ nextStep, onNext, resumes, selectedResume, resumeId, id }) => {

  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const router = useRouter();

   const handleFileChange = async (event) => {
     const file = event.target.files[0];
     if (!file) return;
 
     try {
       await dispatch(attachResume(file));
       console.log("Resume uploaded successfully!");
     } catch (err) {
       console.error("Failed to upload resume:", err);
     } finally {
       event.target.value = "";
     }
   };
   const handleFileUploadClick = () => {
     fileInputRef.current.click();
   };


  const handleContinue = () => {
    onNext();
  };
  const handleBack = () => {
    router.back();
  };
  const handleBuildRalliResume = () => {
    router.push(`/applicant/career-areas/job-details/${id}/apply/ralli-resume`);
  };

  return (
    <Box
      sx={{
        my: "60px",
      }}
    >
      <Box sx={{ maxWidth: "100%" }}>
        <Button onClick={handleBack} sx={{ minWidth: 0, p: 0 }}>
          <ArrowCircleLeftRoundedIcon sx={{ color: "#00305B", fontSize: 32 }} />
        </Button>
        <Typography
          sx={{
            fontSize: { xs: "18px", sm: "21px", md: "26px" },
            fontWeight: 600,
            lineHeight: { xs: "20px", sm: "30px", md: "25px", lg: "20px" },
            color: "#111111",
            pt: 3,
          }}
        >
          Add Resume For The Employer
        </Typography>

        <ResumeTab
          data={resumes}
          selectedResume={selectedResume}
          resumeId={resumeId}
          appliedJobId={id}
        />
        <ResumeInput
          handleFileUploadClick={handleFileUploadClick}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            my: 3,
            maxWidth: "570px",
            py: 2,
          }}
        >
          <Divider sx={{ flexGrow: 1 }} />
          <Typography
            sx={{
              px: 2,
              fontSize: "16px",
              color: "#333333",
              fontWeight: 400,
            }}
          >
            or
          </Typography>
          <Divider sx={{ flexGrow: 1 }} />
        </Box>

        <Box
          sx={{
            maxWidth: "570px",
            boxShadow: "0px 1px 5px #00000040",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            my: 1,
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={handleBuildRalliResume}
          >
            <Image
              src="/assets/images/pdf.png"
              width={53.09}
              height={65.23}
              alt="img"
            />
            <Box sx={{ px: 2, pt: "10px" }}>
              <Box sx={{
                background: "#bbb1b1f7",
                padding: .7,
                width: "fit-content",
                borderRadius: "12px"
              }}>
                <Typography
                  sx={{
                    fontSize: { xs: "10px", sm: "15px", md: "18px" },
                    fontWeight: 400,
                    lineHeight: {
                      xs: "12px",
                      sm: "30px",
                      md: "25px",
                      lg: "20px",
                    },
                    color: "#111111",
                    width: '100%'

                  }}
                >
                  Recommended
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: { xs: "10px", sm: "15px", md: "18px" },
                  fontWeight: 700,
                  lineHeight: {
                    xs: "12px",
                    sm: "30px",
                    md: "25px",
                    lg: "20px",
                  },
                  color: "#111111",
                }}
              >
                Build A Unswayed Resume
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "10px", sm: "15px", md: "16px" },
                  fontWeight: 300,
                  lineHeight: {
                    xs: "12px",
                    sm: "20px",
                    md: "25px",
                    lg: "33px",
                  },
                  color: "#111111",
                  py: 0,
                }}
              >
                We Will Guide You Through It, There Are Only A Few Steps
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            px: "5px",
            py: 3,
          }}
        >
          <RalliButton label="Continue" onClick={handleContinue} />
        </Box>
      </Box>
    </Box>
  );
};

export default AddResume;
