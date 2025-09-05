import { Box, Typography, Button } from "@mui/material"
import Link from "next/link"

export function CTASection() {
  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        pt: { xs: "5rem", md: "15rem" },
        pb: { xs: "2.5rem", md: "5rem" },
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "visible",
      }}
    >
      {/* Background SVG */}
      <Box sx={{ position: "absolute", inset: 0, top: "-90px" }}>
        <svg
          className="w-full h-full"
          viewBox="0 0 1388 825"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <mask
            id="mask0_182_1049"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="269"
            y="27"
            width="850"
            height="493"
          >
            <rect x="269.215" y="27.4062" width="849.57" height="492.311" fill="url(#paint0_linear_182_1049)" />
          </mask>
          <g mask="url(#mask0_182_1049)">
            <g filter="url(#filter0_f_182_1049)">
              <ellipse
                cx="694"
                cy="-93.0414"
                rx="670.109"
                ry="354.908"
                fill="url(#paint1_radial_182_1049)"
                fillOpacity="0.8"
              />
            </g>
            <ellipse cx="694" cy="-91.5385" rx="670.109" ry="354.908" fill="url(#paint2_linear_182_1049)" />
            <ellipse cx="694" cy="-93.0414" rx="670.109" ry="354.908" fill="url(#paint3_linear_182_1049)" />
          </g>
          <defs>
            <filter
              id="filter0_f_182_1049"
              x="-234.109"
              y="-705.949"
              width="1856.22"
              height="1225.82"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="129" result="effect1_foregroundBlur_182_1049" />
            </filter>
            <linearGradient
              id="paint0_linear_182_1049"
              x1="1118.79"
              y1="273.562"
              x2="269.215"
              y2="273.562"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="hsl(var(--background))" stopOpacity="0" />
              <stop offset="0.2" stopColor="hsl(var(--background))" stopOpacity="0.8" />
              <stop offset="0.8" stopColor="hsl(var(--background))" stopOpacity="0.8" />
              <stop offset="1" stopColor="hsl(var(--background))" stopOpacity="0" />
            </linearGradient>
            <radialGradient
              id="paint1_radial_182_1049"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(683.482 245.884) rotate(-3.78676) scale(469.009 248.4)"
            >
              <stop offset="0.1294" stopColor="hsl(var(--primary-dark))" />
              <stop offset="0.2347" stopColor="hsl(var(--primary))" />
              <stop offset="0.3" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </radialGradient>
            <linearGradient
              id="paint2_linear_182_1049"
              x1="694"
              y1="-446.446"
              x2="694"
              y2="263.369"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="1" stopColor="white" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient
              id="paint3_linear_182_1049"
              x1="694"
              y1="-447.949"
              x2="694"
              y2="261.866"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#ffffff" />
              <stop offset="1" stopColor="#ffffff" />
            </linearGradient>
          </defs>
        </svg>
      </Box>

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2.25rem",
          maxWidth: "64rem",
          mx: "auto",
        }}
      >
        <Box sx={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Typography
            component="h2"
            sx={{
              color: "hsl(var(--foreground))",
              fontSize: { xs: "2.25rem", md: "3rem", lg: "4.25rem" },
              fontWeight: 600,
              lineHeight: { xs: 1.2, lg: "76px" },
              maxWidth: "435px",
              mx: "auto",
            }}
          >
            Secure that dream job today!
          </Typography>
          <Typography
            sx={{
              color: "hsl(var(--muted-foreground))",
              fontSize: { xs: "0.875rem", md: "1rem" },
              fontWeight: 500,
              lineHeight: 1.6,
              maxWidth: "42rem",
              mx: "auto",
            }}
          >
            Hear how candidates find the right opportunities, hiring teams match talent precisely, and organizations build merit-based workforces using Unswayed's AI-driven platform
          </Typography>
        </Box>

        <Link href="https://vercel.com/home" target="_blank" rel="noopener noreferrer">
          <Button
            variant="contained"
            sx={{
              px: "30px",
              py: "8px",
              borderRadius: "99px",
              backgroundColor: "#189e33ff",
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: 500,
              lineHeight: "1.5rem",
              boxShadow: "0px 0px 0px 4px rgba(255,255,255,0.13)",
              "&:hover": {
                backgroundColor: "hsla(#189e33ff, 0.9)",
              },
              transition: "all 0.2s ease-in-out",
              textTransform: "none",
            }}
          >
            Signup for free
          </Button>
        </Link>
      </Box>
    </Box>
  )
}
