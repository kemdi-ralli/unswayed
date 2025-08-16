"use client";
import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, FormControlLabel, Checkbox } from "@mui/material";
import { useWizard } from "react-use-wizard";
import RalliButton from "@/components/button/RalliButton";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCvs } from "@/redux/slices/applicantCv";
import { setEditMode } from "@/redux/slices/editSlice";
import AddAnotherButton from "./AddAnotherButton";
import Header from "./Header";
import ButtonIndex from "./ButtonIndex";
import FormField from "./FormField";

const EducationRalliInfo = ({ data, onNext, educationDetails }) => {
  const { nextStep } = useWizard();
  const router = useRouter();
  const dispatch = useDispatch();

  const [educationFields, setEducationFields] = useState(educationDetails || []);
  const sectionRefs = useRef([]);

  useEffect(() => {
    if (educationDetails) {
      setEducationFields(educationDetails);
    }
  }, [educationDetails]);

  const handleChange = (index, name, value) => {
    setEducationFields((prev) =>
      prev.map((form, i) => (i === index ? { ...form, [name]: value } : form))
    );
  };

  const handleAddEducation = () => {
    setEducationFields((prev) => [...prev, {}]);

    setTimeout(() => {
      const lastIndex = educationFields.length;
      const lastRef = sectionRefs.current[lastIndex];
      if (lastRef) {
        lastRef.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleNext = () => {
    onNext(educationFields);
    nextStep();
  };

  const handleClose = (index) => {
    setEducationFields((prev) => prev.filter((_, i) => i !== index));
    sectionRefs.current.splice(index, 1);
  };

  const handleBack = () => {
    router.back();
    dispatch(setCvs());
    dispatch(setEditMode(false));
  };

  return (
    <Box sx={{ width: "auto", minHeight: "100vh" }}>
      <Header handleBack={handleBack} pages={data?.pages} title={data?.title} />

      {educationFields.map((form, index) => (
        <Box
          key={index}
          ref={(el) => (sectionRefs.current[index] = el)}
          sx={{ mb: "20px" }}
        >
          <ButtonIndex label="Education" index={index} handleClose={handleClose} />
          {(data?.form || [])
            .filter(item => index === 0 || item.name !== "is_continue")
            .map((item) => {
              if (item.name === "is_continue") {
                return (
                  <Box key={item.name} sx={{ mb: "20px" }}>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: 600,
                        lineHeight: "18px",
                        color: "#222222",
                        mb: "10px",
                        mt: "14px",
                        textTransform: "capitalize",
                      }}
                    >
                      Did You Graduate
                      {item.required && (
                        <Typography component="span" sx={{ color: "red" }}>
                          *
                        </Typography>
                      )}
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        borderRadius: "10px",
                        boxShadow: "0px 0px 3px #00000040",
                        border: "none",
                        mb: "20px",
                        padding: "8px 20px",
                        display: "flex",
                        gap: 3,
                        alignItems: "center",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={form.is_continue === true}
                            onChange={() => handleChange(index, "is_continue", true)}
                            color="primary"
                          />
                        }
                        label="Yes"
                        sx={{
                          "& .MuiTypography-root": {
                            fontSize: "16px",
                            fontWeight: 300,
                            lineHeight: "18px",
                            color: "#222222",
                          },
                        }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={form.is_continue === false}
                            onChange={() => handleChange(index, "is_continue", false)}
                            color="primary"
                          />
                        }
                        label="No"
                        sx={{
                          "& .MuiTypography-root": {
                            fontSize: "16px",
                            fontWeight: 300,
                            lineHeight: "18px",
                            color: "#222222",
                          },
                        }}
                      />
                    </Box>
                  </Box>
                );
              }
              // Render other fields using FormField
              return (
                <FormField
                  key={item.name}
                  item={item}
                  form={form}
                  index={index}
                  handleChange={handleChange}
                />
              );
            })}
        </Box>
      ))}

      <AddAnotherButton onClick={handleAddEducation} label="School" />

      <Box sx={{ pt: 2 }}>
        <RalliButton label="Save & Continue" onClick={handleNext} />
      </Box>
    </Box>
  );
};

export default EducationRalliInfo;