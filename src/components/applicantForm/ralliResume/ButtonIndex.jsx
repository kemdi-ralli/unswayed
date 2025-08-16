import React from 'react'
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Typography } from '@mui/material'

const ButtonIndex = ({ label, index, handleClose }) => {
    if (index === 0) return null;
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: "20px",
            }}
        >
            <Button variant="contained">
                <Typography
                    sx={{
                        fontSize: { xs: "12px", sm: "15px", md: "16px" },
                        fontWeight: 600,
                        lineHeight: { xs: "12px", sm: "20px" },
                        color: "#FFF",
                        padding: "10px 10px",
                    }}
                >
                    {`${label} ${index + 1}`}
                </Typography>
                <CloseIcon
                    onClick={() => handleClose(index)}
                    sx={{ cursor: "pointer" }}
                />
            </Button>
        </Box>
    );
}

export default ButtonIndex