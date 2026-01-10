"use client";
import React, { useRef, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { BorderLinearProgress } from "@/helper/progressbar";
import Image from "next/image";
import CircleIcon from "@mui/icons-material/Circle";
import RalliButton from "@/components/button/RalliButton";
import AppliedJobs from "../dashboard/AppliedJobs";
import { useWizard } from "react-use-wizard";
import CloseIcon from '@mui/icons-material/Close';
import {
  attachResume,
} from "@/redux/slices/getResumesSlice";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import ResumeTab from "../ResumeTab/ResumeTab";
import BackbuttonWithTitle from "./BackbuttonWithTitle";

const AddAdditionalDoc = ({
  data,
  getAppliedData,
  resumes,
  selectedResume,
  resumeId,
  additionalFiles,
  setAdditionalFiles
}) => {
  const { nextStep } = useWizard();
  const [formikErrors, setFormikErrors] = useState({});
  const [nextLoading, setNextLoading] = useState(false);
  const fileInputRef = useRef(null);
  const additionalInputRef = useRef(null);
  const dispatch = useDispatch();

  const getFileIcon = (file) => {
    const fileName = file?.name?.toLowerCase() || "";
    const fileType = file?.type?.toLowerCase() || "";
    
    // PDF files
    if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      return "/assets/images/document.png";
    }
    
    // Word document types (doc, docx, docm, dotx, dotm)
    const wordMimeTypes = [
      "application/msword",                                                          // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",     // .docx
      "application/vnd.ms-word.document.macroenabled.12",                            // .docm
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template",     // .dotx
      "application/vnd.ms-word.template.macroenabled.12"                             // .dotm
    ];
    const wordExtensions = [".doc", ".docx", ".docm", ".dotx", ".dotm"];
    
    if (
      wordMimeTypes.includes(fileType) ||
      wordExtensions.some((ext) => fileName.endsWith(ext))
    ) {
      return "/assets/images/word.png";
    }
    
    return "/assets/images/txt.png";
  };

  const createJobValidationSchema = yup.object().shape({
    resumeId: yup
      .string()
      .required(
        "Please select a resume first, or upload one before proceeding."
      ),
  });

  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const validateForm = async () => {
    try {
      await createJobValidationSchema.validate(
        { resumeId },
        { abortEarly: false }
      );
      setFormikErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = {};
      if (validationErrors.inner) {
        validationErrors.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
      }
      setFormikErrors(newErrors);
      return false;
    }
  };
  const handleNext = async () => {
    setNextLoading(true);
    if (!resumes || resumes.length === 0) {
      setFormikErrors({
        resumeId: "Please upload a resume before proceeding.",
      });
      setNextLoading(false);
      return;
    }

    const isValid = await validateForm();
    if (!isValid){
      setNextLoading(false);
      return;
    }

    nextStep();
    setNextLoading(false); 
  };

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
  const handleAdditionalDocClick = () => {
    additionalInputRef.current.click();
  };

  const handleAdditionalDocChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    setAdditionalFiles((prevFiles) => [...prevFiles, ...files]);
    event.target.value = "";
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundColor: "#FFFFFF",
            pr: "25px",
          }}
        >
          <BackbuttonWithTitle title={data?.title} />
          <Box sx={{ py: 1 }}>
            <BorderLinearProgress variant="determinate" value={70} />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              pt: 2,
            }}
          >
            <Image
              src={"/assets/images/addAdditionalfile/resume.png"}
              width={40}
              height={40}
              alt="resume"
            />
            <Typography
              sx={{
                fontSize: { xs: "12px", sm: "14px", md: "16px" },
                fontWeight: 400,
                lineHeight: { xs: "25px", sm: "30px", md: "24px", lg: "16px" },
                color: "#111111",
                pl: 3,
              }}
            >
              {data?.uploadNewResume}
            </Typography>
          </Box>
          <Button
            sx={{
              width: "200.29px",
              height: { xs: "40px", sm: "50px", md: "60.93px" },
              backgroundColor: "#189e33ff",
              boxShadow: "0px 1px 5px #00000040",
              borderRadius: "6px",
              color: "#FFFFFF",
              fontSize: { xs: "10px", sm: "14px", md: "16px" },
              fontWeight: 700,
              lineHeight: "18px",
              textAlign: "center",
              p: "7px",
              my: 3,
            }}
            onClick={handleBoxClick}
          >
            {data?.buttonLabel}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {formikErrors.resumeId && (
            <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
              {formikErrors.resumeId}
            </Typography>
          )}
          <ResumeTab
            data={resumes}
            selectedResume={selectedResume}
            resumeId={resumeId}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              pb: 1,
              pt: 3,
              cursor: "pointer",
            }}
            onClick={handleAdditionalDocClick}
          >
            <Image src={"/assets/images/addAdditionalfile/attachfile.png"} width={40} height={40} alt="resume" />
            <Typography sx={{ fontSize: { xs: "12px", sm: "14px", md: "16px" }, fontWeight: 400, color: "#111111", pl: 3 }}>
              {data?.attachAdditionalDoc}
            </Typography>
            <input ref={additionalInputRef} type="file" style={{ display: "none" }} accept=".pdf,.doc,.docx,.docm,.dotx,.dotm,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-word.document.macroEnabled.12,application/vnd.openxmlformats-officedocument.wordprocessingml.template,application/vnd.ms-word.template.macroEnabled.12" multiple onChange={handleAdditionalDocChange} />
          </Box>

          {additionalFiles.length > 0 && (
            <Box>
              <Typography sx={{ fontWeight: 700 }}>Uploaded Documents:</Typography>
              {additionalFiles?.map((file, index) => (
                <Box
                  key={index}
                  sx={{
                    maxWidth: "570px",
                    backgroundColor: "#fff",
                    boxShadow: "0px 1px 5px #00000040",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    my: 1,
                    p: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      src={getFileIcon(file)}
                      width={53.09}
                      height={65.23}
                      alt="document"
                    />
                    
                    <Box sx={{ px: 2, pt: "10px" }}>
                      <Typography
                        sx={{
                          fontSize: { xs: "10px", sm: "15px", md: "18px" },
                          fontWeight: 700,
                          color: "#000",
                        }}
                      >
                        {file?.name}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <CloseIcon sx={{color:"#000"}}
                     onClick={() => {
                      setAdditionalFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
                    }}/>
                  </Box>

                </Box>
              ))}
            </Box>
          )}
          {data?.items?.map((item, index) => (
            <Box key={index} sx={{ pb: 1, pt: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <CircleIcon sx={{ color: "#189e33ff" }} />
                <Typography
                  sx={{
                    fontSize: {
                      xs: "15px",
                      sm: "21px",
                      md: "19px",
                    },
                    fontWeight: 700,
                    lineHeight: {
                      xs: "20px",
                      sm: "30px",
                      md: "25px",
                      lg: "28.5px",
                    },
                    color: "#00305B",
                    px: 2,
                  }}
                >
                  {item?.title}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: {
                    xs: "12px",
                    sm: "14px",
                    md: "16px",
                  },
                  fontWeight: 400,
                  lineHeight: {
                    xs: "20px",
                    sm: "30px",
                    md: "25px",
                    lg: "16px",
                  },
                  color: "#111111",
                  pb: 2,
                  pl: 5,
                }}
              >
                {item?.para}
              </Typography>
            </Box>
          ))}

          <RalliButton label="Next" onClick={handleNext} loading={nextLoading}/>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundColor: "#FAF9F8",
          }}
        >
          <AppliedJobs data={getAppliedData} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddAdditionalDoc;