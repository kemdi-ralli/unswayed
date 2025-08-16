'use client'
import React, { useState } from 'react'
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'
import { BorderLinearProgress } from '@/helper/progressbar';
import { useWizard } from 'react-use-wizard';
import { useRouter, usePathname } from "next/navigation";
import { CircularProgress } from '@mui/material';
import BackButton from '@/components/common/BackButton/BackButton';

const StartApplication = ({ data, getAppliedData, isLoadingDetails }) => {
    const [selectedOption, setSelectedOption] = useState('');
    const { nextStep, previousStep } = useWizard();
    const router = useRouter();
    const pathName = usePathname();
    const handleYesCheckboxChange = (option) => {
        nextStep()
        setSelectedOption(option);
    };
    const handleNoCheckboxChange = (option) => {
        if (pathName.includes("/career-areas/job-details")) {
            previousStep()
        } else {
            router.back()
        }
        setSelectedOption(option);
    };
    return (
        <Box sx={{ minHeight: '100vh' }}>
            {isLoadingDetails ? (
                <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ width: '100%' }}>
                    <BackButton />
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Typography sx={{
                            fontSize: { xs: '18px', sm: '21px', md: '36px' },
                            fontWeight: 500,
                            lineHeight: { xs: '25px', sm: '30px', md: '25px', lg: '20px' },
                            color: "#111111",
                            pb: '25px',
                            textAlign: 'center'
                        }}>
                            {getAppliedData?.title}
                        </Typography>
                        <Typography sx={{
                            fontSize: { xs: '18px', sm: '21px', md: '30px' },
                            fontWeight: 700,
                            lineHeight: { xs: '25px', sm: '30px', md: '25px', lg: '20px' },
                            color: "#00305B",
                            my: 2
                        }}>
                            Location
                        </Typography>
                        <Typography sx={{
                            fontSize: { xs: '18px', sm: '21px', md: '26px' },
                            fontWeight: 300,
                            lineHeight: { xs: '25px', sm: '30px', md: '25px', lg: '34px' },
                            color: "#111111",
                            textAlign: 'center',
                            pb: 3,
                        }}>
                            {`${getAppliedData?.country?.name || ''}${getAppliedData?.states?.length ? ', ' + getAppliedData.states.map(state => state.name).join(', ') : ''}${getAppliedData?.cities?.length ? ', ' + getAppliedData.cities.map(city => city.name).join(', ') : ''}`}
                        </Typography>
                    </Box>

                    <Box sx={{
                        margin: '20px auto',
                        borderRadius: '10px',
                        px: '15px',
                        py: 1.5,
                        boxShadow: "0px 1px 5px #00000040",
                        maxWidth: '798px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Box sx={{ py: 1 }}>
                            <Typography sx={{
                                fontSize: { xs: '14px', sm: '20px', md: '30px' },
                                fontWeight: 700,
                                lineHeight: '20px',
                                color: "#FE4D82",
                                pl: '5px',
                                pr: '12px',
                                textAlign: 'center',
                                py: 2
                            }}>
                                Start Application
                            </Typography>
                            <Box sx={{ my: 2 }}>
                                <BorderLinearProgress variant="determinate" value={54} />
                            </Box>
                            <Typography sx={{
                                fontSize: { xs: '18px', sm: '21px', md: '26px' },
                                fontWeight: 300,
                                lineHeight: { xs: '25px', sm: '30px', md: '25px', lg: '34px' },
                                color: "#111111",
                                textAlign: 'center',
                                py: 2
                            }}>
                                {data?.location || 'Do You Wish to Start The Application?'}
                            </Typography>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                pb: 2
                            }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedOption === 'Yes'}
                                            onChange={() => handleYesCheckboxChange('Yes')}
                                        />
                                    }
                                    label="Yes"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedOption === 'No'}
                                            onChange={() => handleNoCheckboxChange('No')}
                                        />
                                    }
                                    label="No"
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );

}

export default StartApplication
