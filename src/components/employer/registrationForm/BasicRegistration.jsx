'use client';
import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';

import { useWizard } from 'react-use-wizard';

import Image from 'next/image';
import RalliButton from '../button/RalliButton';
import FormTitle from '../applicant/dashboard/FormTitle';

const BasicRegistration = ({ data, onNext }) => {
  const { nextStep } = useWizard();
  const [form, setForm] = useState({});

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    onNext(form); 
    nextStep();
  };

  return (
    <Box sx={{ width: '100vw', height: '100vh', backgroundColor: '#FFFFFF', padding: { xs: '30px 30px', sm: '30px 70px', md: '30px 120px' } }}>
      <Box sx={{ width: { xs: '100%', sm: '50%' }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: '15px', mb: '20px' }}>
        <Button onClick={() => console.log('Back')} sx={{ minWidth: 0, p: 0 }}>
          <ArrowCircleLeftRoundedIcon sx={{ color: '#00305B', fontSize: 32 }} />
        </Button>
        <Image src={data?.logo} width={70} height={40} alt="logo" />
      </Box>
      <FormTitle label={data?.title}/>

      {data?.form?.map((item) => (
        <Box key={item.name} sx={{ mb: '20px' }}>
          <Typography sx={{ fontSize: {xs:'12px', md:'14px', lg:'16px'}, fontWeight: 600, lineHeight: '18px', color: '#222222', mb: '10px' }}>
            {item?.name}
          </Typography>
          <Box
            component="input"
            sx={{
              width: '100%',
              boxShadow: '0px 0px 3px 1px #00000040',
              border:'none',
              padding: '18px 20px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 300,
              lineHeight: '18px',
              color: '#222222'
            }}
            placeholder={item?.placeHolder}
            onChange={(e) => handleChange(item.name, e.target.value)}
          />
        </Box>
      ))}
      <RalliButton label="Next" onClick={handleNext} />
    </Box>
  );
};

export default BasicRegistration;
