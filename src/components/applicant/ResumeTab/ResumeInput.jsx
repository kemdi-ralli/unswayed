import React from 'react'
import { Box, Button, IconButton, Typography } from "@mui/material";
import Image from "next/image";

const ResumeInput = ({
    handleFileUploadClick,
    fileInputRef,
    handleFileChange
}) => {
    return (
        <Box
            onClick={handleFileUploadClick}
            sx={{
                maxWidth: "570px",
                boxShadow: "0px 1px 5px #00000040",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                cursor: "pointer",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Image
                    src="/assets/images/document.png"
                    width={53.09}
                    height={65.23}
                    alt="pdf"
                />
                <Box sx={{ px: 2, pt: "10px" }}>
                    <Typography
                        sx={{
                            fontSize: { xs: "10px", sm: "15px", md: "18px" },
                            fontWeight: 700,
                            color: "#111111",
                        }}
                    >
                        Select File
                    </Typography>
                </Box>
            </Box>
            <Button
                variant="text"
                sx={{
                    color: "#00305B",
                    fontSize: { xs: "9px", sm: "14", lg: "16px" },
                    lineHeight: "25px",
                    textDecoration: "underline",
                    fontWeight: 400,
                }}
            >
                Cv Option
            </Button>
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
        </Box>
    )
}

export default ResumeInput