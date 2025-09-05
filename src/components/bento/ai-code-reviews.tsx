"use client"

import React from "react"
import { Box, Card, CardContent, Typography, Button } from "@mui/material"
import Image from "next/image"

const AiCodeReviews: React.FC = () => {
  const themeVars = {
    "--ai-primary-color": "hsl(var(--primary))",
    "--ai-background-color": "hsl(var(--background))",
    "--ai-text-color": "hsl(var(--foreground))",
    "--ai-text-dark": "hsl(var(--primary-foreground))",
    "--ai-border-color": "hsl(var(--border))",
    "--ai-border-main": "hsl(var(--foreground) / 0.1)",
    "--ai-highlight-primary": "hsl(var(--primary) / 0.12)",
  } as React.CSSProperties

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "transparent",
        ...themeVars,
      }}
      role="img"
      aria-label="AI Code Reviews interface showing code suggestions with apply buttons"
    >
      {/* Background Message Box (Blurred) */}
      <Card
        sx={{
          position: "absolute",
          top: 30,
          left: "50%",
          transform: "translateX(-50%) scale(0.9)",
          width: 340,
          height: 206,
          bgcolor: "background.paper",
          opacity: 0.6,
          borderRadius: 1,
          border: "1px solid rgba(32, 190, 87, 0.2)",
          overflow: "hidden",
          backdropFilter: "blur(16px)",
        }}
        elevation={0}
      >
        <CardContent
          sx={{
            p: "8px",
            fontFamily: "'SF Mono', Monaco, Consolas, monospace",
            fontSize: 9.5,
            lineHeight: "14.7px",
            color: "text.secondary",
          }}
        >
          <Typography component="p" sx={{ m: 0, whiteSpace: "pre-wrap" }}>
            switch (type) {"{"}
          </Typography>
          <Typography component="p" sx={{ m: 0, whiteSpace: "pre-wrap" }}>
            case 'success':
          </Typography>
          <Typography component="p" sx={{ m: 0, whiteSpace: "pre-wrap" }}>
            return {"{"}
          </Typography>
          <Typography component="p" sx={{ m: 0, whiteSpace: "pre-wrap" }}>
            {"          border: theme === 'dark' ? 'border-[rgba(34,197,94,0.4)]' : 'border-green-200',"}
          </Typography>
          <Typography component="p" sx={{ m: 0, whiteSpace: "pre-wrap" }}>
            icon: 
          </Typography>
          <Typography component="p" sx={{ m: 0, whiteSpace: "pre-wrap" }}>
            {"<svg className='baseIconClasses' fill='none' viewBox='0 0 14 14'>"}
          </Typography>
          <Typography component="p" sx={{ m: 0, whiteSpace: "pre-wrap" }}>
            &lt;path d="M3.85156 7.875L6.47656 10.5L10.8516 3.5" stroke="var(--ai-primary-color)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /&gt;
          </Typography>
          <Typography component="p" sx={{ m: 0, whiteSpace: "pre-wrap" }}>
            &lt;/svg&gt;
          </Typography>
        </CardContent>
      </Card>

      {/* Foreground Message Box */}
      <Card
  sx={{
    position: "absolute",
    top: 51,
    left: "50%",
    transform: "translateX(-50%)",
    width: 340,
    bgcolor: "background.paper",
    borderRadius: 2,
    border: "1px solid var(--ai-border-main)",
    overflow: "hidden",
    backdropFilter: "blur(16px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  }}
  elevation={0}
>
  <CardContent
    sx={{
      p: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      fontFamily: "Inter, sans-serif",
      color: "text.primary",
    }}
  >
    {/* Profile Image */}
    <Box
      sx={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        overflow: "hidden",
        border: "2px solid var(--ai-primary-color)",
        mb: 1.5,
      }}
    >
      <Image
        src="/images/avatars/albert-flores.png"
        alt="User profile"
        width={40}
        height={40}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </Box>

    {/* Name & Role */}
    <Typography variant="h6" sx={{ fontWeight: 600 }}>
      Jane Doe
    </Typography>
    <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
      Frontend Developer
    </Typography>

    {/* Location & Contact */}
    <Typography variant="body2" sx={{ fontSize: 13, color: "text.secondary" }}>
      📍 San Francisco, USA
    </Typography>
    <Typography variant="body2" sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>
      ✉️ jane.doe@email.com
    </Typography>

    {/* Skills */}
    <Box
      sx={{
        display: "flex",
        gap: 1,
        flexWrap: "wrap",
        justifyContent: "center",
        mb: 2,
      }}
    >
      {["React", "Next.js", "TypeScript", "Tailwind"].map((skill) => (
        <Box
          key={skill}
          sx={{
            fontSize: 12,
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            bgcolor: "var(--ai-highlight-primary)",
            color: "var(--ai-text-dark)",
            fontWeight: 500,
          }}
        >
          {skill}
        </Box>
      ))}
    </Box>

    {/* CTA Button */}
    <Button
      variant="contained"
      sx={{
        bgcolor: "var(--ai-primary-color)",
        color: "var(--ai-text-dark)",
        fontWeight: 600,
        textTransform: "none",
        px: 3,
        py: 1,
        borderRadius: 2,
        fontSize: 14,
        "&:hover": { bgcolor: "hsl(var(--primary) / 0.9)" },
      }}
    >
      View Resume
    </Button>
  </CardContent>
</Card>

    </Box>
  )
}

export default AiCodeReviews
