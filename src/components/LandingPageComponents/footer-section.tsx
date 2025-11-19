"use client"

import { Box, Typography, Link as MuiLink, Grid } from "@mui/material"
import { Twitter, Github, Linkedin } from "lucide-react"
import NextLink from "next/link";

export function FooterSection() {
  return (
    <Box
      component="footer"
      sx={{
        
        maxWidth: "1320px",
        mx: "auto",
        px: { xs: 2, md: 5 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "start", md: "flex-start" },
        gap: { xs: 2, md: 0 },
        py: { xs: 10, md: "70px" },
      }}
    >
      {/* Left Section */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: { xs: 1, md: 2 } }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "stretch", justifyContent: "center" }}>
          <Typography
            sx={{ textAlign: "center", color: "hsl(var(--foreground))", fontSize: "1.25rem", fontWeight: 600, lineHeight: 1 }}
          >
            Ralli Technoloigies
          </Typography>
        </Box>
        <Typography sx={{ color: "hsl(var(--foreground)/0.9)", fontSize: "0.875rem", fontWeight: 500, lineHeight: "18px", textAlign: "left" }}>
          A Different Kind of Disruptive
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
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
        </Box>
      </Box>

      {/* Right Section */}
      {/* <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(3, auto)" },
          gap: { xs: 2, md: 3 },
          p: { xs: 1, md: 2 },
          width: { xs: "100%", md: "auto" },
        }}
      >
        {[
          {
            title: "Product",
            links: ["Features", "Pricing", "Integrations", "Real-time Previews", "Multi-Agent Coding"],
          },
          {
            title: "Company",
            links: ["About us", "Our team", "Careers", "Brand", "Contact"],
          },
          {
            title: "Resources",
            links: ["Terms of use", "API Reference", "Documentation", "Community", "Support"],
          },
        ].map((section) => (
          <Box key={section.title} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography sx={{ color: "hsl(var(--muted-foreground))", fontSize: "0.875rem", fontWeight: 500, lineHeight: "20px" }}>
              {section.title}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {section.links.map((link) => (
                <MuiLink
                  key={link}
                  href="/chatbot"
                  sx={{
                    color: "hsl(var(--foreground))",
                    fontSize: "0.2rem",
                    fontWeight: 400,
                    lineHeight: "20px",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  <Typography sx={{ color: "hsl(var(--foreground)/0.7)", fontSize: "0.725rem" }}>{link}</Typography>
                  
                </MuiLink>
              ))}
            </Box>
          </Box>
        ))}
      </Box> */}
    </Box>
  )
}
