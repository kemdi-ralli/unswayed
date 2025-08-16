import React from "react";
import { Box, TextField, Button, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ value = null, onChange = () => { }, onClick = () => { } }) => {
    return (
        <Box sx={{
            maxWidth: '1260px',
            margin: '25px auto'
        }}>
            <Box
                sx={{
                    width: '100%',
                    display: "flex",
                    alignItems: "center",
                    gap: 0,
                    padding: 0,
                    borderRadius: '10px',
                    backgroundColor: "#fff",
                    margin: "auto",
                    boxShadow: "0px 1px 5px #00000040",
                    height: { xs: "45px", sm: "53px", md: '60.58px' },
                    border: 'none',
                    outline: 'none',

                }}
            >
                <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Job Title, Keywords, or Company"
                    value={value}
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

                {/* <Box
                    sx={{
                        width: '1px',
                        height: '30px',
                        backgroundColor: "#ccc",
                    }}
                /> */}
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        padding: "0px 25px",
                        borderRadius: '0px 10px 10px 0px',
                        width: { xs: '85px', sm: "100px", md: '130px' },
                        height: '100%',
                        fontSize: { xs: "8.1px", sm: "11px", md: "16px" },
                        lineHeight: { xs: "10px", sm: "14px", md: '18px' },
                        fontWeight: 700,

                    }}
                    onClick={onClick}
                >
                    Find Job
                </Button>
            </Box>
        </Box>
    );
};

export default SearchBar;
