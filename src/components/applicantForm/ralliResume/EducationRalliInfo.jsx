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

const EMPTY_EDUCATION = {
  institution_name: "",
  degree: "",
  field_of_study: "",
  start_date: "",
  end_date: "",
  grade: "",
  is_continue: null,
};

const EducationRalliInfo = ({ data, onNext, educationDetails }) => {
  const { nextStep } = useWizard();
  const router = useRouter();
  const dispatch = useDispatch();

  const [educationFields, setEducationFields] = useState([]);
  const sectionRefs = useRef([]);

  useEffect(() => {
    if (educationDetails?.length) {
      setEducationFields(
        educationDetails.map((edu) => ({
          ...EMPTY_EDUCATION,
          ...edu,
        }))
      );
    } else {
      setEducationFields([{ ...EMPTY_EDUCATION }]);
    }
  }, [educationDetails]);

  const handleChange = (index, name, value) => {
    setEducationFields((prev) =>
      prev.map((form, i) => (i === index ? { ...form, [name]: value } : form))
    );
  };

  const handleAddEducation = () => {
    setEducationFields((prev) => [...prev, { ...EMPTY_EDUCATION }]);

    setTimeout(() => {
      const lastIndex = educationFields.length;
      sectionRefs.current[lastIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleClose = (index) => {
    setEducationFields((prev) => prev.filter((_, i) => i !== index));
    sectionRefs.current.splice(index, 1);
  };

  const handleNext = () => {
    onNext(educationFields);
    nextStep();
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
          sx={{ mb: "24px" }}
        >
          <ButtonIndex
            label="Education"
            index={index}
            handleClose={handleClose}
          />

          {(data?.form || [])
            .filter((item) => item.name !== "is_continue")
            .map((item) => (
              <FormField
                key={`${item.name}-${index}`}
                item={item}
                form={form}
                index={index}
                handleChange={handleChange}
              />
            ))}

          {/* ✅ DID YOU GRADUATE — PER EDUCATION ENTRY */}
          <Box sx={{ mb: "24px" }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                mb: "10px",
              }}
            >
              Did You Graduate?
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 3,
                padding: "8px 20px",
                borderRadius: "10px",
                boxShadow: "0px 0px 3px #00000040",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.is_continue === true}
                    onChange={() => handleChange(index, "is_continue", true)}
                  />
                }
                label="Yes"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.is_continue === false}
                    onChange={() => handleChange(index, "is_continue", false)}
                  />
                }
                label="No"
              />
            </Box>
          </Box>
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
