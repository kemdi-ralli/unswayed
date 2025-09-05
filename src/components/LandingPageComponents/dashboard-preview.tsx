import { Box } from "@mui/material"
import Image from "next/image"

export function DashboardPreview() {
  return (
    <Box
      sx={{
        width: { xs: "calc(100vw - 32px)", md: "1160px", lg: "360px" },
      }}
    >
      <Box
        sx={{
          backgroundColor: "hsla(var(--primary-light), 0.5)",
          borderRadius: "16px",
          p: "8px",
          boxShadow: 24, // maps to a strong shadow in MUI
        }}
      >
        <Image
          src="/assets/images/unswayed-dashboard.png"
          alt="Dashboard preview"
          width={1160}
          height={700}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)", // custom shadow close to Tailwind's shadow-lg
          }}
        />
      </Box>
    </Box>
  )
}
