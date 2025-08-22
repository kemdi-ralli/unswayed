import { Box, Card, CardContent, Typography } from "@mui/material";
import PrivacyToggle from "../../../../components/applicant/settings/privacyToggle/privacyToggle";
import FollowingListToggle from "@/components/applicant/settings/followingListPrivacy/followingListPrivacy";

export default function EmployerPrivacySettingsPage() {
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
          mb: 4,
        }}
      >
        Privacy Settings
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Box sx={{ mb: 2 }}>
            <Typography component="span" sx={{ fontWeight: 600 }}>
              Control who can view your contact details
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{ maxWidth: "600px", mb: 2, color: "text.secondary" }}
          >
            Control who can view your contact details (email and phone number)
            on your public profile. Toggle the switch below to show or hide your
            information.
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <PrivacyToggle />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 4,
        }}
      >
        <Box>
          <Box sx={{ mb: 2 }}>
            <Typography component="span" sx={{ fontWeight: 600 }}>
              Manage Following List
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{ maxWidth: "600px", mb: 2, color: "text.secondary" }}
          >
            Control whether your following list is public or private. Toggle the switch to manage who can see the network you follow.
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <FollowingListToggle/>
        </Box>
      </Box>
    </Box>
  );
}
