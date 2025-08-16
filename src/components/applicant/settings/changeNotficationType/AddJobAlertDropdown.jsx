import React from "react";
import { Box, Typography } from "@mui/material";
import RalliDropdown from "../../applied/RalliDropdown";
import RalliButton from "@/components/button/RalliButton";

const AddJobAlertDropdown = ({
  countries,
  states,
  cities,
  jobCategories,
  jobLocations,
  jobShifts,
  jobTypes,
  dropdownStates,
  handleDropdownChange,
  formikErrors,
  onClick = () => { },
}) => {
  return (
    <Box>
      {/* Country and State */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 0, sm: 2 },
          mb: { xs: 0, sm: 2 },
        }}
      >
        <RalliDropdown
          names={countries}
          label="Country"
          selectedValue={dropdownStates.selectedCountry}
          onChange={(value) => handleDropdownChange("selectedCountry", value)}
        />
        <RalliDropdown
          names={states}
          label="State"
          multiple={true}
          selectedValue={dropdownStates.selectedState}
          onChange={(value) => handleDropdownChange("selectedState", value)}
        />
      </Box>
      {formikErrors && (
        <Typography color="error" sx={{ fontSize: "12px", mt: "-5px" }}>
          {formikErrors?.selectedCountry}
        </Typography>
      )}

      {/* City and Job Category */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 2,
        }}
      >
        <RalliDropdown
          names={cities}
          label="City"
          multiple={true}
          selectedValue={dropdownStates.selectedCity}
          onChange={(value) => handleDropdownChange("selectedCity", value)}
        />
        <RalliDropdown
          names={jobCategories}
          label="Job Category"
          multiple={true}
          selectedValue={dropdownStates.selectedJobCategory}
          onChange={(value) =>
            handleDropdownChange("selectedJobCategory", value)
          }
        />
      </Box>

      {/* Job Location and Job Type */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 2,
        }}
      >
        <RalliDropdown
          names={jobLocations}
          label="Job Location"
          multiple={true}
          selectedValue={dropdownStates.selectedJobLocation}
          onChange={(value) =>
            handleDropdownChange("selectedJobLocation", value)
          }
        />
        <RalliDropdown
          names={jobTypes}
          label="Job Type"
          multiple={true}
          selectedValue={dropdownStates.selectedJobType}
          onChange={(value) => handleDropdownChange("selectedJobType", value)}
        />
      </Box>

      {/* Job Shift */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 2,
        }}
      >
        <RalliDropdown
          names={jobShifts}
          label="Job Shift"
          multiple={true}
          selectedValue={dropdownStates.selectedJobShift}
          onChange={(value) => handleDropdownChange("selectedJobShift", value)}
        />
      </Box>

      {/* Submit Button */}
      <Box sx={{ my: 2, display: "flex", gap: 2 }}>
        <RalliButton label="Set Alert" onClick={onClick} />
      </Box>
    </Box>
  );
};

export default AddJobAlertDropdown;
