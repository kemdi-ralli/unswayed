import React from "react";
import { Box } from "@mui/material";
import RalliDropdown from "../applicant/applied/RalliDropdown";
import { usePathname } from "next/navigation";

const SelectDropdown = ({
  countries,
  states,
  cities,
  genders,
  disability,
  dropdownStates,
  handleDropdownChange,
}) => {
  const pathName = usePathname();
  return (
    <Box>
      {(pathName.includes("/employer/form") ||
        pathName.includes("/applicant/form")) && (
        <>
          <RalliDropdown
            names={countries}
            label="Country"
            selectedValue={dropdownStates?.country}
            onChange={(value) => handleDropdownChange("country", value)}
          />
          <RalliDropdown
            names={states}
            label="State"
            selectedValue={dropdownStates?.state}
            onChange={(value) => handleDropdownChange("state", value)}
          />
          <RalliDropdown
            names={cities}
            label="City"
            selectedValue={dropdownStates?.city}
            onChange={(value) => handleDropdownChange("city", value)}
          />
        </>
      )}
      {pathName.includes("profile/edit-profile") && (
        <RalliDropdown
        names={countries}
        label="Country"
        selectedValue={dropdownStates?.country}
        onChange={(value) => handleDropdownChange("country", value)}
      />
      )
      }
      {pathName.includes("/applicant/form") && (
        <RalliDropdown
          names={genders}
          label="Select gender"
          selectedValue={dropdownStates?.gender}
          onChange={(value) => handleDropdownChange("gender", value)}
        />
      )}
      {pathName.includes("/career-areas") && (
        <RalliDropdown
          names={disability}
          label="disability"
          selectedValue={dropdownStates?.disability}
          onChange={(value) => handleDropdownChange("disability", value)}
        />
      )}
    </Box>
  );
};

export default SelectDropdown;
