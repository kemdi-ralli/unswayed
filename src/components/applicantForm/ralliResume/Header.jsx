import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";
import FormTitle from '@/components/applicant/dashboard/FormTitle'

const Header = ({ handleBack, pages, title, paragraph }) => {
    return (
        <>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: "15px",
                    mb: "10px",
                }}
            >
                <Button onClick={handleBack} sx={{ minWidth: 0, p: 0 }}>
                    <ArrowCircleLeftRoundedIcon sx={{ color: "#00305B", fontSize: 32 }} />
                </Button>
            </Box>
            <Box>
                <Typography
                    sx={{
                        fontSize: { xs: "10px", sm: "15px", md: "16px" },
                        fontWeight: 300,
                        lineHeight: { xs: "12px", sm: "20px", md: "25px", lg: "33px" },
                        color: "#111111",
                        pb: 2,
                    }}
                >
                    {pages}
                </Typography>
                <FormTitle label={title} />
                {paragraph && (
                    <Typography
                        sx={{
                            fontSize: { xs: "10px", sm: "15px", md: "24px" },
                            fontWeight: 400,
                            lineHeight: { xs: "12px", sm: "20px", md: "25px", lg: "18px" },
                            color: "#111111",
                            pb: 6,
                        }}
                    >
                        {paragraph}
                    </Typography>
                )}
            </Box>
        </>
    )
}

export default Header