import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, InputAdornment, TextField } from "@mui/material";

const Search = ({ btnTitle = 'Search', placeholder = 'Type A Name', onChange = () => { }, onClick = () => { } }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 0,
        padding: 0,
        borderRadius: "10px",
        backgroundColor: "#fff",
        margin: "auto",
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
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
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
      />
      <Button
        variant="contained"
        color="primary"
        sx={{
          padding: "0px 25px",
          borderRadius: "0px 10px 10px 0px",
          width: { xs: '85px', sm: "100px", md: '130px' },
          height: '100%',
          fontSize: { xs: "8.1px", sm: "11px", md: "16px" },
          lineHeight: { xs: "10px", sm: "14px", md: '18px' },
          fontWeight: 700,
        }}
        onClick={onClick}
      >
        {btnTitle}
      </Button>
    </Box>
  );
};

export default Search;
