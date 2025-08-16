import { Box, Card, CardContent, Typography } from '@mui/material';
import PrivacyToggle from '../../../../components/applicant/settings/privacyToggle/privacyToggle';

export default function PrivacySettingsPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: "100vh",
        px: { xs: 2, sm: 4, md: 8 },
        py: { xs: 4, sm: 6 },
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          color: "#00305B",
          mb: 2,
        }}
      >
        Privacy Settings
      </Typography>

      <Typography
        variant="body1"
        sx={{ maxWidth: "600px", mb: 2, color: "text.secondary" }}
      >
        Control who can view your contact details (email and phone number) on your public profile. Toggle the switch below to show or hide your information.
      </Typography>

      <Box sx={{ mt: 2 }}>
        <PrivacyToggle />
      </Box>
    </Box>
  );
}
