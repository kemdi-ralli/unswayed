import React from "react";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const TalentNetworkTitleSearchable = ({
  label,
  onSearch = () => {},
  value = "",
  setValue = () => {},
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        justifyContent: { lg: "space-between" },
        alignItems: "center",
      }}
    >
      {label && (
        <Box
          sx={{
            width: "auto",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "22px", md: "26px", lg: "30px" },
              lineHeight: "18px",
              fontWeight: 600,
              color: "#00305B",
            }}
          >
            {label}
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          width: { xs: "100%", lg: label ? "515.55px" : "100%" },
          display: "flex",
          alignItems: "center",
          gap: 0,
          padding: 0,
          borderRadius: "10px",
          backgroundColor: "#fff",
          boxShadow: "0px 1px 5px #00000040",
          height: { xs: "45px", sm: "53px", md: '60.58px' },
          border: "none",
          outline: "none",
          my: 2,
        }}
      >
        <TextField
          variant="standard"
          fullWidth
          placeholder="Type A Name"
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#757575" }} />
              </InputAdornment>
            ),
            sx: {
              color: "#222222",
              fontSize: "16px",
              lineHeight: "18px",
              fontWeight: 250,
              "&::placeholder": {
                  color: "#757575",
                  fontSize: "14px",
                  opacity: 1,
              },
          },
          }}
          inputProps={{
            sx: {
                "&::placeholder": {
                    color: "#757575",
                    fontSize: { xs: "12px", md: "14px" },
                    opacity: 1,
                },
            },
        }}
        sx={{
            flex: 1,
            padding: "10px 15px",
            border: "none",
            outline: "none",
        }}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <Box
          sx={{
            width: "1px",
            height: "30px",
            backgroundColor: "#ccc",
          }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{
            padding: "0px 25px",
            borderRadius: "0px 10px 10px 0px",
            height: "100%",
            fontSize: { xs: "8.1px", sm: "11px", md: "16px" },
            lineHeight: { xs: "10px", sm: "14px", md: '18px' },
            fontWeight: 700,
          }}
          onClick={onSearch}
        >
          Search
        </Button>
      </Box>
    </Box>
  );
};

export default TalentNetworkTitleSearchable;
