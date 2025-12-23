"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  FormControl,
  CircularProgress,
  TextField,
  Autocomplete,
} from "@mui/material";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";
import { useWizard } from "react-use-wizard";
import Image from "next/image";
import RalliButton from "../button/RalliButton";
import FormTitle from "../applicant/dashboard/FormTitle";
import Container from "../common/Container";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import TagInput from "../input/TagInput";
import { CancelOutlined } from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import { educationValidationSchema } from "@/schemas/basicInfo";

const DEBOUNCE_MS = 300;

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
  const router = useRouter();
  const pathName = usePathname();

  const [educationEntries, setEducationEntries] = useState(
    formData?.educations?.length
      ? formData.educations
      : [
          {
            id: Date.now(),
            degree: "",
            field_of_study: "",
            institution_name: "",
            grade: "",
            start_date: "",
            end_date: "",
            media: "",
          },
        ]
  );

  const [skills, setSkills] = useState(Array.isArray(formData?.skills) ? formData.skills : []);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [mergedErrors] = useState({}); // kept for consistency later
  const [univOptions, setUnivOptions] = useState([]);
  const [uLoading, setULoading] = useState(false);
  const [uError, setUError] = useState(null);
  const fetchAbortRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (formData?.educations?.length) setEducationEntries(formData.educations);
    if (formData?.skills?.length) setSkills(formData.skills);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.educations, formData?.skills]);

  const handleChange = (index, name, value) => {
    const updatedEntries = [...educationEntries];
    updatedEntries[index] = { ...updatedEntries[index], [name]: value };
    setEducationEntries(updatedEntries);
    onFieldChange("educations", updatedEntries);
  };

  const handleSkillsChange = (value) => {
    setSkills(value);
    onFieldChange("skills", value);
  };

  const addEducationEntry = () => {
    const newEducation = {
      id: Date.now(),
      degree: "",
      field_of_study: "",
      institution_name: "",
      grade: "",
      start_date: "",
      end_date: "",
      media: "",
    };
    const updated = [...educationEntries, newEducation];
    setEducationEntries(updated);
    onFieldChange("educations", updated);
  };

  const onDeleteEducation = (ind) => {
    const updated = educationEntries.filter((_, i) => i !== ind);
    setEducationEntries(updated);
    onFieldChange("educations", updated);
  };

  const handleBack = () => previousStep();

  const validateForm = async () => {
    try {
      await educationValidationSchema.validate(
        {
          educations: educationEntries,
          skills,
          experience_level: formData?.experience_level,
        },
        { abortEarly: false }
      );
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
    if (isValid && pathName.includes("applicant")) {
      await onSubmit({
        educations: educationEntries,
        skills,
        experience_level: formData?.experience_level,
      });
    }
    setLoading(false);
  };

  // --- University search (typeahead) ---
  const fetchUniversities = async (q) => {
    try {
      if (fetchAbortRef.current) {
        fetchAbortRef.current.abort();
      }
      fetchAbortRef.current = new AbortController();
      setULoading(true);
      setUError(null);

      // Query our server-side proxy
      const url = `/api/universities?q=${encodeURIComponent(q)}`;
      const res = await fetch(url, { signal: fetchAbortRef.current.signal });
      if (!res.ok) throw new Error("Failed to fetch universities");
      const resp = await res.json();
      // Map to strings for Autocomplete option list; keep country for display if needed
      setUnivOptions(resp.map((u) => ({ label: u.name, country: u.country || "" })));
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("fetchUniversities error", err);
        setUError("Unable to load schools");
        setUnivOptions([]);
      }
    } finally {
      setULoading(false);
    }
  };

  const onUnivInputChange = (value) => {
    // debounce
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!value || value.length < 2) {
        // too short - clear or fetch minimal
        setUnivOptions([]);
        return;
      }
      fetchUniversities(value);
    }, DEBOUNCE_MS);
  };

  return (
    <Container>
      <Box sx={{ height: "100%", backgroundColor: "#FFFFFF" }}>
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
          <Button onClick={() => router.push("/applicant/login")} sx={{ minWidth: 0, p: 0 }}>
            <ArrowCircleLeftRoundedIcon sx={{ color: "#00305B", fontSize: 32 }} />
          </Button>
          <Image src={data?.logo} width={70} height={70} alt="logo" />
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
                  <Button onClick={() => onDeleteEducation(index)} sx={{ minWidth: 0, p: 0 }}>
                    <CancelOutlined sx={{ color: "white", fontSize: 32 }} />
                  </Button>
                </Box>
              </>
            )}

            {data.form
              .filter((item) => item.name !== "skills" && item.name !== "experience_level")
              .map((item) => {
                // institution_name -> render Autocomplete with freeSolo
                if (item.name === "institution_name") {
                  return (
                    <Box key={item.name} sx={{ mb: "20px" }}>
                      <Typography sx={{ fontWeight: 600, fontSize: "16px", mb: "3px" }}>
                        {item.label}
                      </Typography>

                      {/* If options failing, show text field fallback */}
                      {uError ? (
                        <TextField
                          placeholder={item.placeHolder || "Enter school name"}
                          fullWidth
                          required={false}
                          value={entry.institution_name || ""}
                          onChange={(e) =>
                            handleChange(index, "institution_name", e.target.value)
                          }
                        />
                      ) : (
                        <Autocomplete
                          freeSolo
                          options={univOptions}
                          getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                          filterOptions={(x) => x} // server-side filtering
                          inputValue={entry.institution_name || ""}
                          onInputChange={(e, newValue, reason) => {
                            // update local value for controlled behavior
                            handleChange(index, "institution_name", newValue);
                            if (reason === "input") onUnivInputChange(newValue);
                          }}
                          onChange={(e, value) => {
                            // value can be string or object{label}
                            const val = typeof value === "string" ? value : value?.label || "";
                            handleChange(index, "institution_name", val);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={item.placeHolder || "Start typing your school..."}
                              required={false}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {uLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                          renderOption={(props, option) => (
                            <li {...props} key={option.label}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                <span>{option.label}</span>
                                <small style={{ opacity: 0.6 }}>{option.country}</small>
                              </Box>
                            </li>
                          )}
                        />
                      )}

                      {validationErrors?.[`educations[${index}].institution_name`] && (
                        <Typography sx={{ color: "red", fontSize: "12px", mt: "5px" }}>
                          {validationErrors[`educations[${index}].institution_name`]}
                        </Typography>
                      )}
                    </Box>
                  );
                }

                // date fields
                if (item.name === "start_date" || item.name === "end_date") {
                  return (
                    <Box key={item.name} sx={{ mb: "20px" }}>
                      <Typography sx={{ fontWeight: 600, fontSize: "16px", mb: "3px" }}>
                        {item.label}
                      </Typography>
                      <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DatePicker
                          views={["year", "month"]}
                          value={entry[item.name] ? dayjs(entry[item.name], "YYYY-MM") : null}
                        
                          onChange={(newValue) =>
                            handleChange(
                              index,
                              item.name,
                              newValue ? dayjs(newValue).format("YYYY-MM") : ""
                            )
                          }
                          slotProps={{
                            textField: { placeholder: item.placeHolder },
                          }}
                        />
                      </LocalizationProvider>
                      {validationErrors[item.name] && (
                        <Typography sx={{ color: "red", fontSize: "12px", mt: "5px" }}>
                          {validationErrors[item.name]}
                        </Typography>
                      )}
                    </Box>
                  );
                }

                // default input
                return (
                  <Box key={item.name} sx={{ mb: "20px" }}>
                    <Typography sx={{ fontWeight: 600, fontSize: "16px", mb: "3px" }}>
                      {item.label}
                    </Typography>
                    <Box
                      component="input"
                      placeholder={item.placeHolder}
                      value={entry[item.name] || ""}
                      onChange={(e) => handleChange(index, item.name, e.target.value)}
                      sx={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        boxShadow: "0px 0px 3px #00000040",
                        border: "none",
                      }}
                    />
                    {validationErrors[item.name] && (
                      <Typography sx={{ color: "red", fontSize: "12px", mt: "5px" }}>
                        {validationErrors[item.name]}
                      </Typography>
                    )}
                  </Box>
                );
              })}
          </Box>
        ))}

        {/* Skills Section */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontWeight: 600, fontSize: "16px", mb: "8px" }}>Skills</Typography>
          <TagInput tags={skills} setTags={handleSkillsChange} placeholder={"Press Enter To Add Skills"} />
        </Box>

        {/* Experience Level */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontWeight: 600, fontSize: "16px", mb: "8px" }}>Experience</Typography>
          <FormControl fullWidth>
            <select
              value={formData?.experience_level || ""}
              onChange={(e) => handleChangeExperience("experience_level", e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: 10 }}
            >
              <option value="">Select Experience</option>
              {experienceLevel.map((el) => (
                <option key={el.id} value={el.id}>
                  {el.name}
                </option>
              ))}
            </select>
          </FormControl>
          {errors.experience_level && <Typography sx={{ color: "red", fontSize: "12px", mt: "5px" }}>{errors.experience_level}</Typography>}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4 }}>
          <RalliButton label="Done" onClick={handleSubmit} loading={loading} />
          <Button variant="outlined" onClick={addEducationEntry} sx={{ textTransform: "none", borderRadius: "10px" }}>
            Add Another School
          </Button>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button variant="text" onClick={handleBack}>
            Previous
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ApplicantEducationInfo;
