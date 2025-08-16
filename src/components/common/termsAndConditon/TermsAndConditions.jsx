'use client';
import { Box, Typography, Container } from "@mui/material";
import BackButton from "../BackButton/BackButton";
import { termsAndConditionsContent } from "@/constant/common/termsAndConditions";

const TermsAndConditions = () => {
  return (
    <>
      <BackButton />
      <Container>
        <Box sx={{ my: 2, maxWidth: 800 }}>
          <Typography sx={{ mt: 2, fontSize: { xs: "20px", md: "25px", md: "30px" }, fontWeight: 700 }}>
            {termsAndConditionsContent.heading}
          </Typography>
          <Typography sx={{ color: "#00305B", textDecoration: "underline",fontSize: { xs: "12px", md: "14px", md: "16px" } }}>
            {termsAndConditionsContent.lastUpdated}
          </Typography>

          {termsAndConditionsContent.sections.map((section, index) => (
            <Box key={index} sx={{ mt: 2 }}>
              {section.title && (
                <Typography
                  variant={section.variant || "h6"}
                  sx={{ color: section.color || "inherit" }}
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

export default TermsAndConditions;
