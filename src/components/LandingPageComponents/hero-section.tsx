"use client"

import React from "react"
import Link from "next/link"
import { Box, Button, Typography } from "@mui/material"
import { Header } from "./header"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const router = useRouter();
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        mx: "auto",
        borderRadius: 2,
        overflow: "hidden",
        my: 3,
        px: { xs: 2, md: 0 },
        py: 0,
        width: "100%",
        height: { xs: 400, md: 600, lg: 810 },
      }}
    >
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
      }}
    >
      <svg
        width="100%"
        height="1200"
        viewBox="0 0 1220 710"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <g clipPath="url(#clip0_186_1134)">
          <mask
            id="mask0_186_1134"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="10"
            y="-1"
            width="1200"
            height="1200"
          >
            <rect
              x="10"
              y="-0.84668"
              width="1200"
              height="811.693"
              fill="url(#paint0_linear_186_1134)"
            />
          </mask>
          <g mask="url(#mask0_186_1134)">
            {/* Grid Rectangles */}
            {[...Array(35)].map((_, i) => (
              <React.Fragment key={`row1-${i}`}>
                {[
                  9.2, 45.2, 81.2, 117.2, 153.2, 189.2,
                  225.2, 261.2, 297.2, 333.2, 369.2,
                  405.2, 441.2, 477.2, 513.2, 549.2,
                  585.2, 621.2, 657.2, 693.2, 729.2, 765.2,
                ].map((y, idx) => (
                  <rect
                    key={`cell-${i}-${idx}`}
                    x={-20.0891 + i * 36}
                    y={y}
                    width="35.6"
                    height="35.6"
                    stroke="#000000"
                    strokeOpacity="0.11"
                    strokeWidth="0.4"
                    strokeDasharray="2 2"
                  />
                ))}
              </React.Fragment>
            ))}

            {/* Highlighted Rectangles */}
            <rect x="699.711" y="81" width="36" height="36" fill="#000000" fillOpacity="0.08" />
            <rect x="195.711" y="153" width="36" height="36" fill="#000000" fillOpacity="0.09" />
            <rect x="1023.71" y="153" width="36" height="36" fill="#000000" fillOpacity="0.09" />
            <rect x="123.711" y="225" width="36" height="36" fill="#000000" fillOpacity="0.09" />
            <rect x="1095.71" y="225" width="36" height="36" fill="#000000" fillOpacity="0.09" />
            <rect x="951.711" y="297" width="36" height="36" fill="#000000" fillOpacity="0.09" />
            <rect x="231.711" y="333" width="36" height="36" fill="#000000" fillOpacity="0.07" />
            <rect x="303.711" y="405" width="36" height="36" fill="#000000" fillOpacity="0.07" />
            <rect x="87.7109" y="405" width="36" height="36" fill="#000000" fillOpacity="0.09" />
            <rect x="519.711" y="405" width="36" height="36" fill="#000000" fillOpacity="0.08" />
            <rect x="771.711" y="405" width="36" height="36" fill="#000000" fillOpacity="0.09" />
            <rect x="591.711" y="477" width="36" height="36" fill="#000000" fillOpacity="0.07" />
          </g>

          {/* Gradients + Filters */}
          <g filter="url(#filter0_f_186_1134)">
            <path
              d="M1447.45 -87.0203V-149.03H1770V1248.85H466.158V894.269C1008.11 894.269 1447.45 454.931 1447.45 -87.0203Z"
              fill="url(#paint1_linear_186_1134)"
            />
          </g>
          <g filter="url(#filter1_f_186_1134)">
            <path
              d="M1383.45 -151.02V-213.03H1706V1184.85H402.158V830.269C944.109 830.269 1383.45 390.931 1383.45 -151.02Z"
              fill="url(#paint2_linear_186_1134)"
              fillOpacity="0.69"
            />
          </g>
          <g style={{ mixBlendMode: "lighten" }} filter="url(#filter2_f_186_1134)">
            <path
              d="M1567.45 -231.02V-293.03H1890V1104.85H586.158V750.269C1128.11 750.269 1567.45 310.931 1567.45 -231.02Z"
              fill="url(#paint3_linear_186_1134)"
            />
          </g>
          <g style={{ mixBlendMode: "overlay" }} filter="url(#filter3_f_186_1134)">
            <path
              d="M65.625 750.269H284.007C860.205 750.269 1327.31 283.168 1327.31 -293.03H1650V1104.85H65.625V750.269Z"
              fill="url(#paint4_radial_186_1134)"
              fillOpacity="0.64"
            />
          </g>
        </g>

        <rect
          x="0.5"
          y="0.5"
          width="1219"
          height="809"
          rx="15.5"
          stroke="hsl(var(--foreground))"
          strokeOpacity="0.06"
        />

        {/* SVG Definitions (filters, gradients, clip paths) */}
        <defs>
            <filter
              id="filter0_f_186_1134"
              x="147.369"
              y="-467.818"
              width="1941.42"
              height="2035.46"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="159.394" result="effect1_foregroundBlur_186_1134" />
            </filter>
            <filter
              id="filter1_f_186_1134"
              x="-554.207"
              y="-1169.39"
              width="3216.57"
              height="3310.61"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="478.182" result="effect1_foregroundBlur_186_1134" />
            </filter>
            <filter
              id="filter2_f_186_1134"
              x="426.762"
              y="-452.424"
              width="1622.63"
              height="1716.67"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="79.6969" result="effect1_foregroundBlur_186_1134" />
            </filter>
            <filter
              id="filter3_f_186_1134"
              x="-253.163"
              y="-611.818"
              width="2221.95"
              height="2035.46"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="159.394" result="effect1_foregroundBlur_186_1134" />
            </filter>
            <linearGradient
              id="paint0_linear_186_1134"
              x1="35.0676"
              y1="23.6807"
              x2="903.8"
              y2="632.086"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#ffffff" stopOpacity="0" />
              <stop offset="1" stopColor="#000000" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_186_1134"
              x1="1118.08"
              y1="-149.03"
              x2="1118.08"
              y2="1248.85"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#ffffff" />
              <stop offset="0.578125" stopColor="#b2b2b2" />
              <stop offset="1" stopColor="#189e33ff" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_186_1134"
              x1="1054.08"
              y1="-213.03"
              x2="1054.08"
              y2="1184.85"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#ffffff" />
              <stop offset="0.578125" stopColor="#b2b2b2" />
              <stop offset="1" stopColor="#189e33ff" />
            </linearGradient>
            <linearGradient
              id="paint3_linear_186_1134"
              x1="1238.08"
              y1="-293.03"
              x2="1238.08"
              y2="1104.85"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#ffffff" />
              <stop offset="0.578125" stopColor="#b2b2b2" />
              <stop offset="1" stopColor="#189e33ff" />
            </linearGradient>
            <radialGradient
              id="paint4_radial_186_1134"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(989.13 557.24) rotate(47.9516) scale(466.313 471.424)"
            >
              <stop stopColor="#ffffff" />
              <stop offset="0.157789" stopColor="#b2b2b2" />
              <stop offset="1" stopColor="#189e33ff" />
            </radialGradient>
            <clipPath id="clip0_186_1134">
              <rect width="1220" height="810" rx="16" fill="#ffffff" />
            </clipPath>
          </defs>
      </svg>
    </Box>

      {/* Header positioned at top */}
      <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20 }}>
        <Header />
      </Box>

      {/* Hero text */}
      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          maxWidth: { xs: 360, md: 500, lg: 588 },
          mt: { xs: 16, md: 15, lg: 20 },
          mx: "auto",
          textAlign: "center",
          mb: { xs: 6, md: 7, lg: 9 },
          px: 2,
        }}
      >
        <Typography
          component="h1"
          sx={{
            color: "#00305B",
            fontWeight: 600,
            fontSize: { xs: "2rem", md: "2.5rem", lg: "3.75rem" },
            lineHeight: 1.2,

          }}
        >
          Merit-Based Hiring Made Simple
        </Typography>

        <Typography
          sx={{
            color: "hsl(var(--muted-foreground))",
            fontWeight: 500,
            fontSize: { xs: "1rem", md: "1rem", lg: "1.125rem" },
            lineHeight: 1.6,
            mt: 2,
            maxWidth: { xs: 360, md: 500, lg: 600 },
            mx: "auto",
          }}
        >
          Unswayed uses AI-powered talent matching to connect qualified candidates with employers through fair and inclusive,
          credential-focused recruitment.
        </Typography>

        
      </Box>

      {/* Call-to-action Button */}
      <Box sx={{ textAlign: "center", my: 4, position: "relative", zIndex: 10, }}>
        <Button
            variant="contained"
            sx={{
              backgroundColor: "hsl(var(--secondary))",
              color: "hsl(var(--secondary-foreground))",
              px: 5,
              py: 1.5,
              fontWeight: 500,
              fontSize: "1rem",
              borderRadius: "999px",
              boxShadow: 3,
              my:4,
              "&:hover": { backgroundColor: "hsl(var(--secondary)/0.9)" },
            }}
            onClick={() => router.push('/applicant/login') }
          >
            Start Your Free Trial
          </Button>
      </Box>
    </Box>
  )
}
