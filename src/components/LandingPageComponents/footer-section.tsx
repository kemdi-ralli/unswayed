"use client";

import { Box, Typography, Link as MuiLink, Grid, IconButton } from "@mui/material";
import { Twitter, Github, Linkedin, Instagram } from "lucide-react";
import NextLink from "next/link";

export function FooterSection() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        py: { xs: 10, md: 14 },
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Box
        sx={{
          maxWidth: "1320px",
          mx: "auto",
          px: { xs: 3, md: 5 },
        }}
      >
        <Grid
          container
          spacing={6}
          justifyContent="space-between"
          alignItems="flex-start"
        >
          {/* BRAND */}
          <Grid item xs={12} md={4}>
            <Typography
              sx={{
                fontSize: "1.7rem",
                fontWeight: 700,
                mb: 1,
                color: "hsl(var(--foreground))",
                letterSpacing: "-0.5px",
              }}
            >
              RALLi Technologies
            </Typography>

            <Typography
              sx={{
                fontSize: "1rem",
                opacity: 0.8,
                maxWidth: "280px",
                lineHeight: 1.6,
              }}
            >
              A Different Kind of Disruptive.
            </Typography>

            <Box sx={{ display: "flex", gap: 1.5, mt: 3 }}>
              {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                <IconButton
                  key={i}
                  sx={{
                    p: 1,
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "12px",
                    transition: "0.25s",
                    "&:hover": {
                      background: "rgba(255,255,255,0.08)",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <Icon size={20} />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* PRODUCTS */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              sx={{
                fontSize: "1.05rem",
                fontWeight: 600,
                mb: 2,
                letterSpacing: "-0.3px",
              }}
            >
              Products
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[
                { label: "Unswayed", href: "https://unswayed.com" },
                { label: "DOT", href: "https://unswayed.com" },
              ].map((item) => (
                <MuiLink
                  key={item.label}
                  component={NextLink}
                  href={item.href}
                  underline="none"
                  sx={{
                    color: "hsl(var(--foreground))",
                    opacity: 0.7,
                    fontSize: "0.6rem",
                    transition: "0.25s",
                    "&:hover": { opacity: 1, pl: 0.5 },
                  }}
                >

                  <Typography sx={{ opacity: 0.8, fontSize: "16px" }}>{item.label}</Typography>
                </MuiLink>
              ))}
            </Box>
          </Grid>

          {/* COMPANY */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              sx={{
                fontSize: "1.05rem",
                fontWeight: 600,
                mb: 2,
              }}
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
                    color: "hsl(var(--foreground))",
                    opacity: 0.7,
                    fontSize: "0.95rem",
                    transition: "0.25s",
                    "&:hover": { opacity: 1, pl: 0.5 },
                  }}
                >
                  <Typography sx={{ opacity: 0.8, fontSize: "16px" }}>{link.label}</Typography>

                </MuiLink>
              ))}
            </Box>
          </Grid>

          {/* CONNECT */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              sx={{
                fontSize: "1.05rem",
                fontWeight: 600,
                mb: 2,
              }}
            >
              Connect
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography sx={{ opacity: 0.8, fontSize: "16px" }}>contact@rallitechnologies.online</Typography>
              <Typography sx={{ opacity: 0.8, fontSize: "16px" }}>+1-888-832-7448</Typography>
              <Typography sx={{ opacity: 0.8, fontSize: "16px" }}>Mon–Fri, 9AM–6PM EST</Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Divider */}
        <Box
          sx={{
            mt: 10,
            pt: 3,
            borderTop: "1px solid rgba(255,255,255,0.1)",
            textAlign: "center",
            opacity: 0.7,
            fontSize: "0.85rem",
          }}
        >
          © {new Date().getFullYear()} RALLi Technologies. All rights reserved.
        </Box>
      </Box>
    </Box>
  );
}
