import React from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const FormCheckbox = ({
  handleCheckboxChange,
  selectedOption,
  label,
  NoAnswer,
  tooltip = null,
  required = false, 
}) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          pt: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "12px", sm: "14px", md: "16px" },
            fontWeight: 500,
            lineHeight: { xs: "25px", sm: "30px", md: "24px", lg: "18px" },
            color: "#222222",
          }}
        >
          {label}
          {required && (
            <Typography
              component="span"
              sx={{
                color: "red",
                fontSize: "16px",
                fontWeight: 600,
                ml: "3px",
              }}
            >
              *
            </Typography>
          )}
          {tooltip && (
            <Tooltip title={
              <React.Fragment>
                {tooltip}
              </React.Fragment>
            } style={{
              paddingTop: 5
            }}
              placement="top"
            >
              <InfoIcon sx={{ color: "#00305B" }} />
            </Tooltip>
          )}
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
          boxShadow: "0px 1px 5px #00000040",
          padding: "5px 0px",
          borderRadius: "10px",
          fontSize: "16px",
          fontWeight: 300,
          lineHeight: "18px",
          color: "#222222",
          my: 1,
        //   background:'red',
          py:2
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            px: 2,

          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedOption === "yes"}
                onChange={() => handleCheckboxChange("yes")}
                sx={{ color: "#FE4D82" }}
              />
            }
            label="Yes"
            sx={{
                fontWeight: 700,
                color: "#111111",
                "& .MuiTypography-root": {
                  fontSize: { xs: "11px", sm: "13px", md: "16px", lg: "19px" },
                  lineHeight: {
                    xs: "10px",
                    sm: "10px",
                    md: "20px",
                    lg: "28px",
                  },
                },
                "& .MuiCheckbox-root": {
                  fontSize: { xs: "8px", sm: "12px", lg: "19px" },
                  padding: { xs: "0px", md: "10px" },
                },
              }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedOption === "no"}
                onChange={() => handleCheckboxChange("no")}
                sx={{ color: "#FE4D82" }}
              />
            }
            label="No"
            sx={{
                fontWeight: 700,
                color: "#111111",
                "& .MuiTypography-root": {
                  fontSize: { xs: "11px", sm: "13px", md: "16px", lg: "19px" },
                  lineHeight: {
                    xs: "10px",
                    sm: "10px",
                    md: "20px",
                    lg: "28px",
                  },
                },
                "& .MuiCheckbox-root": {
                  fontSize: { xs: "8px", sm: "12px", lg: "19px" },
                  padding: { xs: "0px", md: "10px" },
                },
              }}
          />
          {NoAnswer && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedOption === "no_answer"}
                  onChange={() => handleCheckboxChange("no_answer")}
                  sx={{ color: "#FE4D82" }}
                />
              }
              label="Do Not Wish To Answer"
              sx={{
                fontWeight: 700,
                color: "#111111",
                "& .MuiTypography-root": {
                  fontSize: { xs: "11px", sm: "13px", md: "16px", lg: "19px" },
                  lineHeight: {
                    xs: "10px",
                    sm: "10px",
                    md: "20px",
                    lg: "28px",
                  },
                },
                "& .MuiCheckbox-root": {
                  fontSize: { xs: "8px", sm: "12px", lg: "19px" },
                  padding: { xs: "0px", md: "10px" },
                },
              }}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

export default FormCheckbox;
