"use client";
import React, { useEffect, useState, useRef } from "react";
import { Box, Backdrop, Button, CircularProgress, Typography } from "@mui/material";
import {
  ADD_A_CERTIFICATIONS,
  ADD_A_RECENT,
  ADD_SKILLS,
  EDU_INFO_BY_RALLI,
  PROJECT_WORKED,
} from "@/constant/ralliResume";
import { Wizard } from "react-use-wizard";
import EducationRalliInfo from "./EducationRalliInfo";
import AddRecentJobs from "./AddRecentJobs";
import AddSkills from "./AddSkills";
import ProjectWorked from "./ProjectWorked";
import Certifications from "./Certifications";

import apiInstance from "@/services/apiService/apiServiceInstance";
import {
  APPLICANT_BUILD_RESUME,
  APPLICANT_REBUILD_RESUME,
  APPLICANT_EXTRACT_AUTO_COMPLETE,
} from "@/services/apiService/apiEndPoints";
import { Toast } from "@/components/Toast/Toast";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setEditMode } from "@/redux/slices/editSlice";
import { fetchProfile } from "@/helper/profileApiHelper";

const RalliResumeContainer = ({ id }) => {
  const [profile, setProfile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wizardData, setWizardData] = useState({
    educationDetails: [{}],
    recentJobs: [{}],
    certifications: [{}],
    projects: [{}],
    skills: [],
  });
  const [isExtracting, setIsExtracting] = useState(false);
  const extractFileInputRef = useRef(null);

  const [totalExperience] = useState([
    { id: 1, name: "1 year" },
    { id: 2, name: "2 years" },
    { id: 3, name: "3 years" },
    { id: 4, name: "4 years" },
    { id: 5, name: "5 years" },
    { id: 6, name: "6 years" },
    { id: 7, name: "7 years" },
    { id: 8, name: "8 years" },
    { id: 9, name: "9 years" },
    { id: 10, name: "10+ years" },
  ]);

  const getEditResumes = useSelector(
    (state) => state?.applicantAttachedCv?.attachedCvs
  );
  const isEditing = useSelector((state) => state?.getEdit?.isEditing);

  const handleDataUpdate = (key, newData) => {
    setWizardData((prev) => ({ ...prev, [key]: newData }));
  };

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const loadProfile = async () => {
      const userProfile = await fetchProfile();
      setProfile(userProfile);
      if (!getEditResumes) {
        setWizardData((prev) => ({
          ...prev,
          educationDetails:
            userProfile?.educations?.map((edu) => ({
              grade: edu.grade,
              degree: edu.degree,
              end_date: edu.end_date,
              start_date: edu.start_date,
              field_of_study: edu.field_of_study,
              institution_name: edu.institution_name,
              is_continue: edu.is_continue ?? null,
            })) || [{}],
        }));
      }
    };

    loadProfile();
  }, []);

  const isEmptyObject = (obj) => {
    return (
      typeof obj === "object" &&
      obj !== null &&
      Object.values(obj).every(
        (val) =>
          val === "" ||
          val === null ||
          val === undefined ||
          (typeof val === "object" && Object.keys(val).length === 0)
      )
    );
  };

  const ConvertArray = (data) => {
    const cleanedData = {};
    let allFieldsEmpty = true;

    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        const filteredArray = value
          .map((item) => {
            if (typeof item === "object" && item !== null) {
              const newItem = { ...item };

              const isValidDate = (date) =>
                typeof date === "string" && /^\d{2}\/\d{4}$/.test(date);

              if (!isValidDate(newItem.start_date)) newItem.start_date = "";
              if (!isValidDate(newItem.end_date)) newItem.end_date = "";

              newItem.state = newItem.state || "";
              newItem.city = newItem.city || "";

              return newItem;
            }
            return item;
          })
          .filter((item) => !isEmptyObject(item));

        cleanedData[key] = filteredArray;

        if (filteredArray.length > 0) {
          allFieldsEmpty = false;
        }
      } else {
        cleanedData[key] = value;
      }
    }

    return { cleanedData, allFieldsEmpty };
  };

  const handleSubmit = async (finalData) => {
    const { cleanedData, allFieldsEmpty } = ConvertArray(finalData);

    if (allFieldsEmpty) {
      Toast("error", "Please add some details to build your Ralli resume.");
      return;
    }

    setIsSubmitting(true);

    try {
      let response;

      if (isEditing) {
        response = await apiInstance.post(
          `${APPLICANT_REBUILD_RESUME}/${getEditResumes?.id}`,
          cleanedData
        );
      } else {
        response = await apiInstance.post(APPLICANT_BUILD_RESUME, cleanedData);
      }

      if (response?.data?.status === "success") {
        Toast("success", response?.data?.message);
        dispatch(setEditMode(false));
        router.push(`/applicant/career-areas/job-details/${id}/apply`);
      }

      console.log("Resume successfully built:", response.data);
    } catch (error) {
      console.error("Error building resume:", error);
      Toast("error", error?.response?.data?.message || "Failed to apply");
      dispatch(setEditMode(false));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoFillClick = () => {
    extractFileInputRef.current.click();
  };

  const handleAutoFillFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsExtracting(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await apiInstance.post(APPLICANT_EXTRACT_AUTO_COMPLETE, formData);
      if (response?.data?.status === "success") {
        const extractedData = response.data.data.resume_data;
        
        setWizardData((prev) => ({
          ...prev,
          educationDetails: extractedData.education?.length ? extractedData.education : prev.educationDetails,
          recentJobs: extractedData.experiences?.length ? extractedData.experiences : prev.recentJobs,
          certifications: extractedData.certifications?.length ? extractedData.certifications : prev.certifications,
          projects: extractedData.projects?.length ? extractedData.projects : prev.projects,
          skills: extractedData.skills?.length ? extractedData.skills : prev.skills,
        }));
        
        Toast("success", "Resume data extracted successfully! Please review the fields.");
      }
    } catch (error) {
      console.error("Error extracting resume data:", error);
      Toast("error", error?.response?.data?.message || "Failed to extract resume data");
    } finally {
      setIsExtracting(false);
      event.target.value = "";
    }
  };

  useEffect(() => {
    if (getEditResumes?.meta_data) {
      setWizardData({
        educationDetails:
          getEditResumes?.meta_data?.education?.map((edu) => ({
            grade: edu.grade,
            degree: edu.degree,
            end_date: edu.end_date,
            start_date: edu.start_date,
            field_of_study: edu.field_of_study,
            institution_name: edu.institution_name,
            is_continue: edu.is_continue ?? null,
          })) || [{}],

        recentJobs:
          getEditResumes?.meta_data?.experiences?.map((exp) => ({
            city: exp.city,
            type: exp.type,
            state: exp.state,
            country: exp.country,
            title: exp.title,
            company: exp.company,
            end_date: exp.end_date,
            years_of_experience: exp.years_of_experience,
            location: exp.location,
            start_date: exp.start_date,
            description: exp.description,
          })) || [{}],

        certifications:
          getEditResumes?.meta_data?.certifications?.map((cert) => ({
            city: cert.city,
            state: cert.state,
            country: cert.country,
            title: cert.title,
            end_date: cert.end_date,
            location: cert.location,
            start_date: cert.start_date,
            description: cert.description,
            institution_name: cert.institution_name,
          })) || [{}],

        projects:
          getEditResumes?.meta_data?.projects?.map((proj) => ({
            name: proj.name,
            description: proj.description,
          })) || [{}],

        skills: getEditResumes?.meta_data?.skills || [],
      });
    }
  }, [getEditResumes]);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, px: 2 }}>
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          }}
          open={isExtracting}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <CircularProgress size={60} sx={{ color: "#00305B" }} />
            <Typography sx={{ mt: 2, color: "#00305B", fontWeight: 600, fontSize: "18px" }}>
              Extracting Resume Data...
            </Typography>
          </Box>
        </Backdrop>

        <Button
          variant="outlined"
          onClick={handleAutoFillClick}
          disabled={isExtracting}
          sx={{
            borderColor: "#00305B",
            color: "#00305B",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#f5f5f5",
              borderColor: "#00305B",
            },
          }}
        >
          {isExtracting ? "Extracting Data..." : "✨ Auto-fill from Resume"}
        </Button>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          style={{ display: "none" }}
          ref={extractFileInputRef}
          onChange={handleAutoFillFileChange}
        />
      </Box>
      <Wizard>
      <EducationRalliInfo
        data={EDU_INFO_BY_RALLI}
        onNext={(data) => handleDataUpdate("educationDetails", data)}
        educationDetails={wizardData.educationDetails}
      />
      <AddRecentJobs
        data={ADD_A_RECENT}
        onNext={(data) => handleDataUpdate("recentJobs", data)}
        recentJobs={wizardData.recentJobs}
        totalExperience={totalExperience}
      />
      <Certifications
        data={ADD_A_CERTIFICATIONS}
        onNext={(data) => handleDataUpdate("certifications", data)}
        certifications={wizardData.certifications}
      />
      <ProjectWorked
        data={PROJECT_WORKED}
        onNext={(data) => handleDataUpdate("projects", data)}
        projects={wizardData.projects}
      />
      <AddSkills
        data={ADD_SKILLS}
        onNext={(data) => handleDataUpdate("skills", data)}
        skill={wizardData.skills}
        handleSubmit={handleSubmit}
        wizardData={wizardData}
        isEditing={isEditing}
        loading={isSubmitting}
      />

    </Wizard>
    </Box>
  );
};

export default RalliResumeContainer;