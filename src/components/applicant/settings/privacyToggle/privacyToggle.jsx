"use client"
import { useState, useEffect } from 'react';
import { Box, Switch, Typography } from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';

export default function PrivacyToggle() {
  const [privacyOn, setPrivacyOn] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('privacyOn');
    if (stored !== null) {
      setPrivacyOn(stored === 'true');
    }
  }, []);

  const handleToggle = () => {
    const newValue = !privacyOn;
    setPrivacyOn(newValue);
    localStorage.setItem('privacyOn', newValue.toString());
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
      {privacyOn ? <Lock /> : <LockOpen />}
      <Switch
        checked={privacyOn}
        onChange={handleToggle}
        color="primary"
        sx={{ ml: 1 }}
      />
      <Typography sx={{ ml: 1 }}>
        {privacyOn ? 'Privacy Enabled' : 'Privacy Disabled'}
      </Typography>
    </Box>
  );
}
