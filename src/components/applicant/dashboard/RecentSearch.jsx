import React from 'react'
import { Box, Typography } from '@mui/material'

const RecentSearch = ({ data }) => {
    return (
        <Box>
            {
                data ? data?.map((item, index) => (
                    <Box key={index}>

                    </Box>
                )) : (
                    <Box sx={{ height: { xs: '340px', md: '400px' }, mt: { xs: '10px', sm: '20px', md: '30px', lg: '50px' } }}>
                        <Typography sx={{
                            fontWeight: 500,
                            fontSize: { xs: '14px', sm: '20px', md: '30px', lg: '36px' },
                            lineHeight: { xs: '14px', sm: '20px', md: '20px' },
                            textAlign: 'center',
                            pt: 3,
                            pb: 2
                        }}>
                            No recent searches yet
                        </Typography>
                        <Typography sx={{
                            fontWeight: 300,
                            fontSize: { xs: '14px', sm: '18px', md: '20px', lg: '26px' },
                            lineHeight: { xs: '20px', sm: '20px', md: '34px' },
                            textAlign: 'center',
                            py: 3,
                            maxWidth: { md: '460px' },
                            mx: 'auto'
                        }}>
                            After you run a search, your recent
                            searches will live here.
                        </Typography>
                    </Box>
                )
            }
        </Box>
    )
}

export default RecentSearch
