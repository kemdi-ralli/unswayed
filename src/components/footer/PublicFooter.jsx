import React from 'react'
import { Box, Grid, Typography } from '@mui/material'

const PublicFooter = ({ data }) => {
    return (
        <Box
            sx={{
                width: '100%',
                height: 'auto',
                backgroundColor: '#F1F2F2',
                py: '7px',

            }}>
            <Box sx={{
                // maxWidth: {xs:'100%',md:'1289.48px'},
                margin: '0px auto',
                textAlign: 'center',
                alignItems: 'center'
            }}>
                <Grid container spacing={0}>
                    {
                        data?.map((item, index) => (
                            <Grid item key={index} xs={12} sm={6} md={3} lg={1.6}
                                sx={{ py: { xs: '10px', lg: '0px' } }}
                            >
                                <Typography sx={{
                                    fontSize: '10px',
                                    lineHeight: '18px',
                                    fontWeight: 300,
                                    color: '#222222',
                                    cursor: 'pointer'
                                }}>
                                    {item?.title}
                                </Typography>
                            </Grid>
                        ))
                    }
                </Grid>
            </Box>
        </Box>
    )
}

export default PublicFooter
