import React from 'react';
import Link from 'next/link';
import { Box, Grid, Typography } from '@mui/material';

const Footer = ({ data }) => {
    return (
        <Box
            sx={{
                width: '100vw',
                height: 'auto',
                backgroundColor: '#00305B',
                py: '30px'
            }}>
            <Box sx={{
                maxWidth: '1289.48px',
                margin: '0px auto',
                textAlign: 'center',
                alignItems: 'center'
            }}>
                <Grid container spacing={0}>
                    {
                        data?.map((item, index) => {
                            const isExternal = item.link.startsWith("http");
                            return (
                                <Grid item key={index} xs={12} sm={6} md={3} lg={1.6}
                                    sx={{ py: { xs: '10px', lg: '0px' } }}
                                >
                                    {isExternal ? (
                                        <Typography
                                            component="a"
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                fontSize: '14px !important',
                                                lineHeight: '18px',
                                                fontWeight: 400,
                                                color: '#fff',
                                                cursor: "pointer",
                                                textDecoration: "none",
                                                "&:hover": { textDecoration: "underline" }
                                            }}
                                        >
                                            {item.title}
                                        </Typography>
                                    ) : (
                                        <Link href={item.link} passHref legacyBehavior>
                                            <Typography
                                                component="a"
                                                sx={{
                                                    fontSize: '14px !important',
                                                    lineHeight: '18px',
                                                    fontWeight: 400,
                                                    color: '#fff',
                                                    cursor: "pointer",
                                                    textDecoration: "none",
                                                    "&:hover": { textDecoration: "underline" }
                                                }}
                                            >
                                                {item.title}
                                            </Typography>
                                        </Link>
                                    )}
                                </Grid>
                            );
                        })
                    }
                </Grid>
            </Box>
        </Box>
    );
};

export default Footer;
