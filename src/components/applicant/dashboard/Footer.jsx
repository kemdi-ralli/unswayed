"use client";
import { Box, Container, Grid, Typography, Link as MuiLink, Divider } from "@mui/material";
import NextLink from "next/link";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.main",
        color: "primary.contrastText",
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={8} mb={6}>
          {/* Company Overview */}
          <Grid item xs={12} md={3}>
            <Typography
              variant="h5"
              fontWeight="bold"
            >
              RALLi Technologies
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                opacity: 0.8,
                textWrap: "pretty",
              }}
            >
              Empowering tomorrow's innovations through advanced AI and
              transformative technology solutions.
            </Typography>
          </Grid>

          {/* Products */}
          <Grid item xs={12} md={3}>
            <Typography
              variant="h6"
              fontWeight="600"
              
            >
              Products
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <MuiLink
                component={NextLink}
                href="https://unswayed.com"
                underline="none"
                sx={{
                  color: "primary.contrastText",
                  opacity: 0.8,
                  transition: "color 0.2s",
                  "&:hover": { opacity: 1 },
                  ontFamily: "var(--font-heading)",
                }}
              >
                Unswayed
              </MuiLink>

              <MuiLink
                component={NextLink}
                href="https://unswayed.com"
                underline="none"
                sx={{
                  color: "primary.contrastText",
                  opacity: 0.8,
                  transition: "color 0.2s",
                  "&:hover": { opacity: 1 },
                  ontFamily: "var(--font-heading)",
                }}
              >
                DOT
              </MuiLink>
            </Box>
          </Grid>

          {/* Company */}
          <Grid item xs={12} md={3}>
            <Typography
              variant="h6"
              fontWeight="600"
              
            >
              Company
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[
                { label: "About Us", href: "https://rallitechnologies.com/about" },
                { label: "Team", href: "https://rallitechnologies.com/team" },
                { label: "Contact", href: "https://rallitechnologies.com/contact" },
                { label: "Privacy Policy", href: "https://www.unswayed.com/privacy-policy" },
                { label: "Terms of Service", href: "https://www.unswayed.com/terms-of-use" },
              ].map((link) => (
                <MuiLink
                  key={link.label}
                  component={NextLink}
                  href={link.href}
                  underline="none"
                  sx={{
                    color: "primary.contrastText",
                    opacity: 0.8,
                    transition: "color 0.2s",
                    "&:hover": { opacity: 1 },
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography
              variant="h6"
              fontWeight="600"
              
            >
              Connect
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography sx={{ opacity: 0.8 }} variant="body2">
                contact@rallitechnologies.online
              </Typography>
              <Typography sx={{ opacity: 0.8 }} variant="body2">+1-888-832-7448</Typography>
              <Typography sx={{ opacity: 0.8 }} variant="body2">Mon–Fri, 9AM–6PM EST</Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider
          sx={{
            borderColor: "rgba(255,255,255,0.2)",
            mb: 3,
          }}
        />

        <Typography
          variant="body2"
          align="center"
          sx={{
            opacity: 0.8,
          }}
        >
          © 2025 RALLi Technologies. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
