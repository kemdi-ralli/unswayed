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

  const handleBack = () => {
    previousStep();
  };
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
  const router = useRouter();
  return (
    <Container>
      <Box sx={{ height: "100vh", backgroundColor: "#FFFFFF" }}>
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

        {educationEntries.map((entry, index) => (
          <Box key={entry.id} sx={{ mb: "30px" }}>
            {index > 0 && (
              <>
                <hr style={{ marginBottom: "20px" }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#189e33ff",
                    color: "white",
                    padding: "10px",
                    marginBottom: "10px",
                    borderRadius: "5px",
                  }}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: "16px" }}>
                    Education {index + 1}
                  </Typography>
                  <Button
                    onClick={() => onDeleteEducation(index)}
                    sx={{ minWidth: 0, p: 0 }}
                  >
                    <CancelOutlined sx={{ color: "white", fontSize: 32 }} />
                  </Button>
                </Box>
              </>
            )}
            {data.form
              .filter(
                (item) =>
                  item.name !== "skills" && item.name !== "experience_level"
              )
              .map((item) => (
                <Box key={item.name} sx={{ mb: "20px" }}>
                  <Typography
                    sx={{ fontWeight: 600, fontSize: "16px", mb: "3px" }}
                  >
                    {item.label}
                  </Typography>

                  {item.name === "start_date" || item.name === "end_date" ? (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        views={["year", "month"]}
                        value={
                          entry[item.name]
                            ? dayjs(entry[item.name], "YYYY-MM")
                            : null
                        }
                        onChange={(newValue) =>
                          handleChange(
                            index,
                            item.name,
                            newValue ? dayjs(newValue).format("YYYY-MM") : null
                          )
                        }
                        slotProps={{
                          textField: {
                            placeholder: item.placeHolder,
                            sx: {
                              width: "100%",
                              borderRadius: "10px",
                              boxShadow: "0px 0px 3px 1px #00000040",
                              border: "none",
                              "& input": {
                                color: "#000",
                                padding: "13px 10px",
                                width: "100%",
                                border: "none",
                                outline: "none",
                              },
                              "& input::placeholder": {
                                color: "#00000040",
                                fontSize: "16px",
                                opacity: 1,
                              },
                              "& fieldset": {
                                border: "none !important",
                              },
                              "&:hover": {
                                outline: "none",
                                border: "none",
                              },
                            },
                          },
                        }}
                        sx={{
                          width: "100%",
                          height: "40px",
                          boxShadow: "0px 0px 3px 1px #00000040",
                          "& .MuiOutlinedInput-root": {
                            border: "none !important",
                            outline: "none !important",
                          },
                          "&:hover": {
                            outline: "none",
                            border: "none",
                          },
                        }}
                      />
                    </LocalizationProvider>
                  ) : item.name === "media" ? (
                    <Box>
                      <Box
                        component="input"
                        type="file"
                        accept="image/*"
                        sx={{
                          width: "100%",
                          boxShadow: "0px 0px 3px 1px #00000040",
                          border: "none",
                          padding: "18px 20px",
                          borderRadius: "10px",
                          fontSize: "16px",
                          fontWeight: 300,
                          lineHeight: "18px",
                          color: "#222222",
                          "&::placeholder": {
                            color: "#00000040",
                            fontSize: "16px",
                            fontWeight: 400,
                          },
                        }}
                        onChange={(e) =>
                          handleChange(index, item.name, e.target.files[0])
                        }
                      />
                      {entry[item.name] && (
                        <Typography
                          sx={{
                            mt: "10px",
                            fontStyle: "italic",
                            color: "#555",
                          }}
                        >
                          Selected File: {entry[item.name].name}
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Box
                      component="input"
                      sx={{
                        width: "100%",
                        boxShadow: "0px 0px 3px 1px #00000040",
                        border: "none",
                        padding: "18px 20px",
                        borderRadius: "10px",
                        fontSize: "16px",
                        fontWeight: 300,
                        lineHeight: "18px",
                        color: "#222222",
                        "&::placeholder": {
                          color: "#00000040",
                          fontSize: "16px",
                          fontWeight: 400,
                        },
                      }}
                      placeholder={item.placeHolder}
                      value={entry[item.name] || ""}
                      onChange={(e) =>
                        handleChange(index, item.name, e.target.value)
                      }
                    />
                  )}
                </Box>
              ))}
          </Box>
        ))}
        {pathName.includes("applicant") && (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: "20px",
              }}
            >
              <Button
                variant="outlined"
                onClick={addEducationEntry}
                sx={{
                  textTransform: "none",
                  borderColor: "#00305B",
                  color: "#00305B",
                  borderRadius: "10px",
                }}
              >
                Add Another School
              </Button>
            </Box>

            <Box sx={{ mb: "20px" }}>
              <Typography sx={{ fontWeight: 600, fontSize: "16px", mb: "3px" }}>
                Skills
              </Typography>
              <TagInput
                tags={formData.skills}
                setTags={(value) => onFieldChange("skills", value)}
                placeholder={"Press Enter To Add Skills"}
              />
            </Box>
            <Box sx={{ mb: "20px" }}>
              <RalliDropdown
                names={experienceLevel}
                label="Experience"
                required={true}
                placeHolder={"Experience"}
                selectedValue={formData?.experience_level || ""}
                onChange={(value) =>
                  handleChangeExperience("experience_level", value)
                }
              />
              {mergedErrors.experience_level && (
                <Typography sx={{ color: "red", fontSize: "12px", mt: "5px" }}>
                  {mergedErrors.experience_level}
                </Typography>
              )}
            </Box>
          </Box>
        )}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <RalliButton label="Done" onClick={handleSubmit} loading={loading} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="text"
            onClick={handleBack}
            sx={{
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              "&:hover": {
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              },
            }}
          >
            Previous
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ApplicantEducationInfo;
