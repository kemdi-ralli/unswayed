"use client";
import React, { useRef } from "react";
import { Box, Button, Divider, Typography, CircularProgress, Backdrop } from "@mui/material";
import Image from "next/image";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";
import RalliButton from "@/components/button/RalliButton";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import ResumeTab from "../ResumeTab/ResumeTab";
import ResumeInput from "@/components/applicant/ResumeTab/ResumeInput"
import {
  attachResume,
  affindaUploadResume,
} from "@/redux/slices/getResumesSlice";

const AddResume = ({ nextStep, onNext, resumes, selectedResume, resumeId, id }) => {

  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const affindaFileInputRef = useRef(null);
  const router = useRouter();
  const { loading: resumesLoading } = useSelector((state) => state.getResume || {});

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

   const handleAffindaFileUploadClick = () => {
     affindaFileInputRef.current.click();
   };

   const handleAffindaFileChange = async (event) => {
     const file = event.target.files[0];
     if (!file) return;

     try {
       await dispatch(affindaUploadResume(file));
       console.log("Resume uploaded and generated successfully!");
     } catch (err) {
       console.error("Failed to upload and generate resume:", err);
     } finally {
       event.target.value = "";
     }
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
        position: "relative",
      }}
    >
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
        }}
        open={resumesLoading}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CircularProgress size={60} sx={{ color: "#00305B" }} />
          <Typography sx={{ mt: 2, color: "#00305B", fontWeight: 600 }}>
            Processing Resume...
          </Typography>
        </Box>
      </Backdrop>

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
              src="/assets/images/document.png"
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
                We Will Guide You Through It. There Are Only A Few Steps.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Upload & Generate Option */}
        <Box
          sx={{
            maxWidth: "570px",
            boxShadow: "0px 1px 5px #00000040",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            my: 2,
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={handleAffindaFileUploadClick}
          >
            <Image
              src="/assets/images/document.png"
              width={53.09}
              height={65.23}
              alt="img"
            />
            <Box sx={{ px: 2, pt: "10px" }}>
              <Box sx={{
                background: "#d1e7dd",
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
                    color: "#0f5132",
                    width: '100%'
                  }}
                >
                  AI Powered
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
                Upload & Generate Unswayed Resume
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
                Upload your existing resume and we will auto-format it.
              </Typography>
            </Box>
          </Box>
        </Box>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          style={{ display: "none" }}
          ref={affindaFileInputRef}
          onChange={handleAffindaFileChange}
        />
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
