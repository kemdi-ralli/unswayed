import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import RalliButton from "../button/RalliButton";
import FilterCareerJobs from "../applicant/dashboard/FilterCareerJobs";
import { usePathname } from "next/navigation";
import AddEducation from "../applicant/profile/AddEducation";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "790px",
  width: { xs: "90%" },
  bgcolor: "#FFFFFF",
  boxShadow: "0px 1px 5px #00000040",
  boxShadow: 24,
  p: 4,
  borderRadius: "15px",
  maxHeight: "650px",
  overflowY: "scroll",
  '&::-webkit-scrollbar-track': {
    background: "#f1f1f1",
    borderRadius: "0px 15px 15px 0px",
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#00305B',
    borderRadius: "0px 15px 15px 0px",
  },
  "&::-webkit-scrollbar": {
    backgroundColor: '#00305B',
    borderRadius: "0px 15px 15px 0px",
  },

};

const RalliModal = ({
  open,
  onClose,
  onClick,
  title,
  para,
  buttonLabel,
  countries,
  states,
  cities,
  jobCategories,
  jobLocations,
  jobShifts,
  jobTypes,
  dropdownStates,
  handleDropdownChange,
  educationFields,
  setEducationFields,
  data,
  handleBack,
  educationErrors,
  setEducationErrors

}) => {
  const pathName = usePathname();
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            py: !pathName === "/applicant/career-areas" ? 4.5 : 0,
          }}
        >
          {title && (
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "12px", sm: "16px", md: "20px", lg: "26px" },
                lineHeight: { xs: "12px", sm: "16px", md: "20px", lg: "18px" },
                color: "#222222",
                py: 2,
              }}
            >
              {title}
            </Typography>
          )}
          {para && (
            <Typography
              id="modal-modal-description"
              sx={{
                fontSize: { xs: "12px", sm: "14px", md: "16px" },
                fontWeight: 400,
                lineHeight: { lg: "26px" },
                color: "#111111",
                textAlign: "center",
                px: { md: "30px" },
                maxWidth: { md: "600px" },
                py: 2,
              }}
            >
              {para}
            </Typography>
          )}
        </Box>
        {pathName === "/applicant/career-areas" && (
          <FilterCareerJobs
            countries={countries}
            states={states}
            cities={cities}
            dropdownStates={dropdownStates}
            handleDropdownChange={handleDropdownChange}
            jobCategories={jobCategories}
            jobLocations={jobLocations}
            jobShifts={jobShifts}
            jobTypes={jobTypes}
          />
        )}
        {pathName === "/applicant/profile" && (
          <Box sx={{ py: 1 }}>
            <AddEducation
              data={data}
              educationFields={educationFields}
              setEducationFields={setEducationFields}
              handleBack={handleBack}
              educationErrors={educationErrors}
              setEducationErrors={setEducationErrors}
            />
          </Box>
        )}
        <Box sx={{pt:1.5}}>
          <RalliButton label={buttonLabel} onClick={onClick} />
        </Box>
      </Box>
    </Modal>
  );
};

export default RalliModal;
