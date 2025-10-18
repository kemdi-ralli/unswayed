"use client";
import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";
import { useWizard } from "react-use-wizard";
import Image from "next/image";
import RalliButton from "../button/RalliButton";
import FormTitle from "../applicant/dashboard/FormTitle";
import Container from "../common/Container";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import RalliDropdown from "../applicant/applied/RalliDropdown";
import { usePathname, useRouter } from "next/navigation";
import { educationValidationSchema } from "@/schemas/basicInfo";
import TagInput from "../input/TagInput";
import { CancelOutlined } from "@mui/icons-material";

const ApplicantEducationInfo = ({
  data,
  formData,
  experienceLevel,
  onFieldChange,
  onSubmit,
  handleChangeExperience,
  errors = {},
}) => {
  const { nextStep, previousStep } = useWizard();
  const [educationEntries, setEducationEntries] = useState(
    formData.educations || [{ id: 1, ...formData }]
  );
  const [skills, setSkills] = useState(formData?.educationInfo?.skills || []);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const mergedErrors = { ...validationErrors, ...errors };
  const pathName = usePathname();
  const router = useRouter();

  // ---------- CV Upload + Autofill ----------
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const res = await fetch("https://api.affinda.com/v3/resumes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AFFINDA_API_KEY}`,
        },
        body: formDataUpload,
      });

      const result = await res.json();
      const parsed = result.data;

      // Map: Affinda → Your form fields
      if (parsed?.name?.first) {
        onFieldChange("first_name", parsed.name.first);
      }
      if (parsed?.name?.last) {
        onFieldChange("last_name", parsed.name.last);
      }
      if (parsed?.skills?.length) {
        const skillNames = parsed.skills.map((s) => s.name);
        onFieldChange("skills", skillNames);
        setSkills(skillNames);
      }
      if (parsed?.education?.length) {
        const mappedEdu = parsed.education.map((edu, idx) => ({
          id: idx + 1,
          degree: edu.accreditation?.education || "",
          field_of_study: edu.accreditation?.inputStr || "",
          institution_name: edu.organization || "",
          grade: edu.grade || "",
          start_date: edu.dates?.startDate || "",
          end_date: edu.dates?.completionDate || "",
          media: "",
        }));
        setEducationEntries(mappedEdu);
        onFieldChange("educations", mappedEdu);
      }
    } catch (err) {
      console.error("Affinda parsing failed:", err);
    } finally {
      setLoading(false);
    }
  };
  // ------------------------------------------

  const handleChange = (index, name, value) => {
    const updatedEntries = [...educationEntries];
    updatedEntries[index][name] = value;
    setEducationEntries(updatedEntries);
    onFieldChange("educations", updatedEntries);
  };

  const handleSkillsChange = (value) => {
    setSkills(value);
    onFieldChange("skills", value);
  };

  const addEducationEntry = () => {
    const newEducation = {
      degree: "",
      field_of_study: "",
      institution_name: "",
      grade: "",
      start_date: "",
      end_date: "",
      media: "",
    };
    setEducationEntries([...educationEntries, newEducation]);
    onFieldChange("educations", [...educationEntries, newEducation]);
  };

  const handleBack = () => previousStep();

  const validateForm = async () => {
    try {
      await educationValidationSchema.validate(formData, { abortEarly: false });
      setValidationErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = {};
      if (validationErrors.inner) {
        validationErrors.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
      }
      setValidationErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const isValid = await validateForm();
    if (pathName.includes("applicant") && isValid) {
      await onSubmit(formData);
    }
    setLoading(false);
  };

  const onDeleteEducation = (ind) => {
    const updatedEducationEntries = educationEntries.filter(
      (_, index) => index !== ind
    );
    setEducationEntries(updatedEducationEntries);
    onFieldChange("educations", updatedEducationEntries);
  };

  return (
    <Container>
      <Box sx={{ height: "100vh", backgroundColor: "#FFFFFF" }}>
        {/* Top bar */}
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
          <Button
            onClick={() => router.push("/applicant/login")}
            sx={{ minWidth: 0, p: 0 }}
          >
            <ArrowCircleLeftRoundedIcon
              sx={{ color: "#00305B", fontSize: 32 }}
            />
          </Button>
          <Image src={data?.logo} width={70} height={140} alt="logo" />
        </Box>

        <FormTitle label={data?.title} />

        {/* Resume Upload Layer */}
        <Box sx={{ mb: "30px" }}>
          <Typography sx={{ fontWeight: 600, fontSize: "16px", mb: "8px" }}>
            Upload Resume (CV)
          </Typography>
          <Box
            component="input"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            sx={{
              width: "100%",
              boxShadow: "0px 0px 3px 1px #00000040",
              border: "none",
              padding: "18px 20px",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: 300,
              color: "#222222",
            }}
          />
        </Box>

        {/* Existing Education Form Fields */}
        {educationEntries.map((entry, index) => (
          <Box key={entry.id || index} sx={{ mb: "30px" }}>
            {/* Existing form code unchanged */}
          </Box>
        ))}

        {/* Submit + Nav */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <RalliButton label="Done" onClick={handleSubmit} loading={loading} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button variant="text" onClick={handleBack}>Previous</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ApplicantEducationInfo;
