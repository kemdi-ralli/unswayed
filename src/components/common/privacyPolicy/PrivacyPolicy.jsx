import { Box, Typography, Container } from "@mui/material";
import { privacyPolicyContent } from "@/constant/common/privacyPolicy";
import BackButton from "../BackButton/BackButton";

const PrivacyPolicy = () => {
  return (
    <>
      <BackButton />
      <Container>
        <Box sx={{ my: 2, maxWidth: 800 }}>
          <Typography  sx={{ mt: 2, fontSize: { xs: "20px", md: "25px", md: "30px" }, fontWeight: 700 }}>
            {privacyPolicyContent.heading}
          </Typography>
          <Typography sx={{ color: "#00305B", textDecoration: "underline",  fontSize: { xs: "12px", md: "14px", md: "16px" }, }}>
            {privacyPolicyContent.lastUpdated}
          </Typography>

          {privacyPolicyContent.sections.map((section, index) => (
            <Box key={index} sx={{ mt: 2 }}>
              {section.title && (
                <Typography
                  variant={section.variant || "h6"}
                  sx={{ color: section.color }}
                >
                  {section.title}
                </Typography>
              )}
              {section.description && <Typography sx={{ mt: 1, fontSize: { xs: "12px", md: "14px", md: "16px" } }}>{section.description}</Typography>}
            </Box>
          ))}
        </Box>
      </Container>
    </>
  );
};

export default PrivacyPolicy;
