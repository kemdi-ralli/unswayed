import React, { useState, useEffect } from "react";
import { Box, FormControl, Typography } from "@mui/material";
import RalliDropdown from "../applied/RalliDropdown";
import TagInput from "@/components/input/TagInput";
import { countryToCurrency } from "@/constant/applicant/countryCurrency/countryCurrency";

const FilterCareerJobs = ({
  countries,
  states,
  cities,
  dropdownStates,
  handleDropdownChange,
  jobCategories,
  jobLocations,
  jobShifts,
  jobTypes,
  isLoadingCities,
  isLoadingStates
}) => {
  const [experienceLevel, setExperienceLevel] = useState([
    { name: "Entry", id: "entry" },
    { name: "Intermediate", id: "intermediate" },
    { name: "Experienced", id: "experienced" },
    { name: "Advanced", id: "advanced" },
  ]);

  const jobSourceOptions = [
    { name: "All", id: "all" },
    { name: "Internal (Unswayed)", id: "internal" },
    { name: "External", id: "external" },
  ];

  const setSkills = (_skills) => {
    handleDropdownChange("skills", _skills);
  };

  // Get currency based on selected country
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    if (dropdownStates?.country && countries.length > 0) {
      const selectedCountry = countries.find(c => c.id === dropdownStates.country);
      if (selectedCountry) {
        const countryName = selectedCountry.name;
        const currencyCode = countryToCurrency[countryName] || "USD";
        setCurrency(currencyCode);
      }
    } else {
      setCurrency("USD");
    }
  }, [dropdownStates?.country, countries]);

  return (
    <Box>
      <RalliDropdown
        names={jobSourceOptions}
        label="Job Source"
        selectedValue={dropdownStates?.job_kind || "all"}
        onChange={(value) => handleDropdownChange("job_kind", value)}
      />
      <RalliDropdown
        names={countries}
        label="Country"
        selectedValue={dropdownStates?.country}
        onChange={(value) => handleDropdownChange("country", value)}
      />
      <RalliDropdown
        names={states}
        label="State"
        multiple={true}
        selectedValue={dropdownStates?.state}
        onChange={(value) => handleDropdownChange("state", value)}
        isLoadingStates={isLoadingStates}
      />
      <RalliDropdown
        names={cities}
        label="City"
        selectedValue={dropdownStates?.city}
        onChange={(value) => handleDropdownChange("city", value)}
        isLoadingCities={isLoadingCities}
      />
      <RalliDropdown
        names={jobCategories}
        label="Job Category"
        multiple={true}
        selectedValue={dropdownStates.job_category}
        onChange={(value) => handleDropdownChange("job_category", value)}
      />

      <RalliDropdown
        names={jobLocations}
        label="Job Location"
        selectedValue={dropdownStates.job_location}
        onChange={(value) => handleDropdownChange("job_location", value)}
      />
      <RalliDropdown
        names={jobTypes}
        label="Job Type"
        selectedValue={dropdownStates.job_type}
        onChange={(value) => handleDropdownChange("job_type", value)}
      />

      <RalliDropdown
        names={jobShifts}
        label="Job Shift"
        selectedValue={dropdownStates.job_shift}
        onChange={(value) => handleDropdownChange("job_shift", value)}
      />

      <RalliDropdown
        names={experienceLevel}
        label="Experience"
        selectedValue={dropdownStates.experience_level}
        onChange={(value) => handleDropdownChange("experience_level", value)}
      />

      {/* Salary Range Fields */}
      <FormControl
        sx={{
          width: "100%",
          mb: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: "16px", mb: 1 }}>
          Salary Range ({currency})
        </Typography>
        <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: "14px", mb: 0.5, color: "#666" }}>
              Minimum Salary ({currency})
            </Typography>
            <Box
              component="input"
              type="number"
              min={0}
              placeholder={`Min Salary (${currency})`}
              value={dropdownStates.salary || ""}
              onChange={(e) => handleDropdownChange("salary", e.target.value)}
              sx={{
                width: "100%",
                boxShadow: "0px 0px 3px 1px #00000040",
                border: "none",
                padding: "14px 16px",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: 300,
                lineHeight: "18px",
                color: "#222222",
                "&::placeholder": {
                  color: "rgba(0, 0, 0, 0.5)",
                  fontSize: "14px",
                  fontWeight: 400,
                },
                "&:focus": {
                  outline: "2px solid #00305B",
                  outlineOffset: "1px",
                },
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: "14px", mb: 0.5, color: "#666" }}>
              Maximum Salary ({currency})
            </Typography>
            <Box
              component="input"
              type="number"
              min={0}
              placeholder={`Max Salary (${currency})`}
              value={dropdownStates.salary_max || ""}
              onChange={(e) => handleDropdownChange("salary_max", e.target.value)}
              sx={{
                width: "100%",
                boxShadow: "0px 0px 3px 1px #00000040",
                border: "none",
                padding: "14px 16px",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: 300,
                lineHeight: "18px",
                color: "#222222",
                "&::placeholder": {
                  color: "rgba(0, 0, 0, 0.5)",
                  fontSize: "14px",
                  fontWeight: 400,
                },
                "&:focus": {
                  outline: "2px solid #00305B",
                  outlineOffset: "1px",
                },
              }}
            />
          </Box>
        </Box>
      </FormControl>

      <FormControl
        sx={{
          width: "100%",
          mb: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: "16px", mb: 1 }}>
          Skills
        </Typography>
        <TagInput
          tags={dropdownStates.skills}
          placeholder="Press Enter To Add Skills"
          setTags={setSkills}
        />
      </FormControl>
    </Box>
  );
};

export default FilterCareerJobs;