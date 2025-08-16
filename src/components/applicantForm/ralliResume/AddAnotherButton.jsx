import React from 'react'
import { Box, Button } from '@mui/material'

const AddAnotherButton = ({ onClick, label }) => {
    return (
        <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: "20px" }}
        >
            <Button
                variant="outlined"
                onClick={onClick}
                sx={{
                    textTransform: "none",
                    borderColor: "#00305B",
                    color: "#00305B",
                    borderRadius: "10px",
                }}
            >
                Add Another {label}
            </Button>
        </Box>
    )
}

export default AddAnotherButton