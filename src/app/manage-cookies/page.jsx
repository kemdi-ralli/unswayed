"use client"
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Switch,
  Button,
  Divider,
} from '@mui/material';
import { useRouter } from 'next/navigation'; // ✅ Import router

export default function CookieConfigurationsPage() {
  const router = useRouter(); // ✅ Initialize router

  const [functional, setFunctional] = useState(false);
  const [performance, setPerformance] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const preferences = { functional, performance, marketing };
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="background.default"
      p={2}
    >
      {/* ✅ Back Button */}
      <Button
        variant="text"
        onClick={() => router.back()}
        sx={{ alignSelf: 'flex-start', mb: 2 }}
      >
        ← Back
      </Button>

      <Card sx={{ width: '100%', maxWidth: 500 }}>
        <CardHeader
          title="Cookie Settings"
          subheader="Manage your cookie preferences for this website."
        />
        <Divider />
        <CardContent>
          <Box display="flex" flexDirection="column" gap={3}>
            {/* Strictly Necessary */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="subtitle1">Strictly Necessary Cookies</Typography>
                <Typography variant="body2" color="text.secondary">
                  These cookies are essential for the website to function and cannot be switched off.
                </Typography>
              </Box>
              <Switch checked disabled inputProps={{ 'aria-label': 'Strictly Necessary Cookies' }} />
            </Box>

            {/* Functional */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="subtitle1">Functional Cookies</Typography>
                <Typography variant="body2" color="text.secondary">
                  These cookies allow the website to remember choices you make and provide enhanced, more personal features.
                </Typography>
              </Box>
              <Switch
                checked={functional}
                onChange={(e) => setFunctional(e.target.checked)}
                inputProps={{ 'aria-label': 'Functional Cookies' }}
              />
            </Box>

            {/* Performance */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="subtitle1">Performance Cookies</Typography>
                <Typography variant="body2" color="text.secondary">
                  These cookies collect information about how you use a website, like which pages you visited and which links you clicked on.
                </Typography>
              </Box>
              <Switch
                checked={performance}
                onChange={(e) => setPerformance(e.target.checked)}
                inputProps={{ 'aria-label': 'Performance Cookies' }}
              />
            </Box>

            {/* Marketing */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="subtitle1">Marketing Cookies</Typography>
                <Typography variant="body2" color="text.secondary">
                  These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.
                </Typography>
              </Box>
              <Switch
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                inputProps={{ 'aria-label': 'Marketing Cookies' }}
              />
            </Box>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ p: 2 }}>
          <Button fullWidth variant="outlined" onClick={handleSave}>
            Save preferences
          </Button>
        </CardActions>
        {saved && (
          <Typography variant="body2" color="success.main" align="center" sx={{ pb: 2 }}>
            Preferences saved!
          </Typography>
        )}
      </Card>
    </Box>
  );
}
