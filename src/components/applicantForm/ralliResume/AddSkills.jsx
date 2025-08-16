"use client";
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useWizard } from "react-use-wizard";

import RalliButton from "@/components/button/RalliButton";
import Header from "./Header";

const AddSkills = ({ data, onNext, skill, handleSubmit, wizardData, isEditing, loading }) => {
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState(skill);
  const { nextStep, previousStep } = useWizard();

  const handleNext = () => {
    onNext(skills);
    handleSubmit({
      education: wizardData.educationDetails,
      experiences: wizardData.recentJobs,
      certifications: wizardData.certifications,
      projects: wizardData.projects,
      skills,
    });
    nextStep();
  };


  const handleBack = () => {
    previousStep();
  };
  const handleAddSkill = (skill) => {
    if (
      typeof skill === "string" &&
      skill.trim() &&
      Array.isArray(skills) &&
      !skills.includes(skill.trim())
    ) {
      setSkills((prev) => {
        console.log("Updated skills:", [...prev, skill.trim()]);
        return [...prev, skill.trim()];
      });
      setSkillInput("");
    }
  };

  const handleClossItem = (skillToRemove) => {
    setSkills((prevSkills) =>
      prevSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header
        handleBack={handleBack}
        pages={data?.pages}
        title={data?.title}
        paragraph={data?.para}
      />

      <Box>
        <Typography
          sx={{
            fontSize: { xs: "10px", sm: "15px", md: "24px" },
            fontWeight: 500,
            lineHeight: { xs: "12px", sm: "20px", md: "25px", lg: "18px" },
            color: "#222222",
            pb: 2,
          }}
        >
          Add A Skills
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Box
          component="input"
          sx={{
            boxShadow: "0px 0px 3px #00000040",
            width: "100%",
            border: "none",
            padding: "16px 20px",
            borderRadius: "10px",
            fontSize: { xs: "12px", sm: "15px", md: "16px" },
            fontWeight: 300,
            lineHeight: { xs: "12px", sm: "20px" },
            color: "#222222",
            mb: 2,
            mr: 2,
          }}
          placeholder="Start Typing To Search"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
        />
        <Box
          sx={{
            boxShadow: "0px 0px 3px #00000040",
            border: "none",
            padding: "12px 20px",
            borderRadius: "6px",
            fontSize: { xs: "12px", sm: "15px", md: "16px" },
            fontWeight: 300,
            lineHeight: { xs: "12px", sm: "20px" },
            color: "#222222",
            mb: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => {
            handleAddSkill(skillInput);
          }}
        >
          <AddIcon
            sx={{
              color: "#00305B",
              cursor: "pointer",
              fontSize: { xs: 20, md: 30 },
              stroke: "#00305B",
              strokeWidth: 1.5,
            }}
          />
        </Box>
      </Box>
      {skills?.length > 0 && (
        <Box
          sx={{
            backgroundColor: "#EEF2FE",
            borderRadius: "10px",
            p: 5,
            mb: 6,
          }}
        >
          {skills.map((skill, index) => (
            <Box
              key={index}
              sx={{
                width: "auto",
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 1px 5px #00000040",
                borderRadius: "6px",
                px: 2,
                mb: "15px",
                mx: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "12px", sm: "15px", md: "16px" },
                  fontWeight: 300,
                  lineHeight: { xs: "12px", sm: "20px" },
                  color: "#222222",
                  padding: "18px 10px",
                }}
              >
                {skill}
              </Typography>
              <CloseIcon
                onClick={() => handleClossItem(skill)}
                sx={{ cursor: "pointer" }}
              />
            </Box>
          ))}
        </Box>
      )}

      <Box
        sx={{
          backgroundColor: "#EEF2FE",
          borderRadius: "10px",
          p: 5,
          mb: 6,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "12px", sm: "14px", md: "30px" },
            fontWeight: 700,
            lineHeight: { xs: "20px", md: "24px", lg: "18px" },
            color: "#222222",
            py: 2,
            pb: 4,
            textTransform: "capitalize",
          }}
        >
          {data?.title}
        </Typography>

        {data?.skillsBox?.items?.map((item) => (
          <Box key={item.name} sx={{ mb: "15px" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 1px 5px #00000040",
                borderRadius: "6px",
                border: "0.8px solid #999999",
                px: 2,
              }}
              onClick={() => handleAddSkill(item.placeHolder)}
            >
              <AddIcon
                sx={{
                  color: "#00305B",
                  cursor: "pointer",
                  fontSize: { xs: 20, md: 30 },
                  stroke: "#00305B",
                  strokeWidth: 1.5,
                }}
              />

              <Typography
                sx={{
                  width: "100%",
                  display: "block",
                  padding: "18px 10px",

                  fontSize: { xs: "12px", sm: "15px", md: "16px" },
                  fontWeight: 300,
                  lineHeight: { xs: "12px", sm: "20px" },
                  color: "#00305B",
                }}
              >
                {item?.placeHolder}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          pb: 3,
        }}
      >
        <RalliButton label={isEditing ? 'Update & Submit' : "Save & Continue"} onClick={handleNext}  loading={loading}/>
      </Box>
    </Box>
  );
};

export default AddSkills;
