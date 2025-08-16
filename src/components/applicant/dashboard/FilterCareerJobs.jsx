import React, { useState } from "react";
import { Box, FormControl, Typography } from "@mui/material";
import RalliDropdown from "../applied/RalliDropdown";
import TagInput from "@/components/input/TagInput";

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
}) => {
  const [experienceLevel, setExperienceLevel] = useState([
    { name: "Entry", id: "entry" },
    { name: "Intermediate", id: "intermediate" },
    { name: "Experienced", id: "experienced" },
    { name: "Advanced", id: "advanced" },
  ]);

  const setSkills = (_skills) => {
    handleDropdownChange("skills", _skills)
  }

  return (
    <Box>
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
      />
      <RalliDropdown
        names={cities}
        label="City"
        selectedValue={dropdownStates?.city}
        onChange={(value) => handleDropdownChange("city", value)}
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

      <FormControl
        sx={{
          width: "100%",
          mb: 2,
          mt: 2,
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
