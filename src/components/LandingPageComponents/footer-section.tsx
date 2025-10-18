"use client"

import { Box, Typography, Link as MuiLink } from "@mui/material"
import { Twitter, Github, Linkedin } from "lucide-react"

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
          <MuiLink href="#" aria-label="Twitter" sx={{ width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Twitter style={{ width: "100%", height: "100%", color: "hsl(var(--muted-foreground))" }} />
          </MuiLink>
          <MuiLink href="#" aria-label="GitHub" sx={{ width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Github style={{ width: "100%", height: "100%", color: "hsl(var(--muted-foreground))" }} />
          </MuiLink>
          <MuiLink href="#" aria-label="LinkedIn" sx={{ width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Linkedin style={{ width: "100%", height: "100%", color: "hsl(var(--muted-foreground))" }} />
          </MuiLink>
        </Box>
      </Box>

      {/* Right Section */}
      <Box
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
      </Box>
    </Box>
  )
}
