"use client"

import { useState } from "react"
import Link from "next/link"
import { Box, Button, Typography } from "@mui/material"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet" // keep your Sheet UI as-is
import { useRouter } from "next/navigation"

export function Header() {
  const navItems = [
    { name: "Features", href: "#features-section" },
    { name: "Pricing", href: "#pricing-section" },
    { name: "Testimonials", href: "#testimonials-section" },
  ]

  const router = useRouter();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.substring(1)
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <Box component="header" sx={{ py: 2, px: 3 }}>
      <Box
        sx={{
          maxWidth: "1280px",
          mx: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left: Logo + Nav */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Typography sx={{ fontSize: "1.25rem", fontWeight: 600, color: "#189e33ff" }}>
            Unswayed
          </Typography>

          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} onClick={(e) => handleScroll(e, item.href)}>
                <Typography
                  component="span"
                  sx={{
                    color: "#012e11ff",
                    px: 2,
                    py: 1,
                    borderRadius: "999px",
                    fontWeight: 400,
                    fontSize: "1rem",
                    transition: "color 0.2s",
                    textDecoration: "none",
                    "&:hover": { color: "hsl(var(--foreground))" },
                    cursor: "pointer",
                  }}
                >
                  {item.name}
                </Typography>
              </Link>
            ))}
          </Box>
        </Box>

        {/* Right: CTA + Mobile Menu */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Desktop CTA */}
          
            <Button
              variant="contained"
              sx={{
                display: { xs: "none", md: "inline-flex" },
                backgroundColor: "hsl(var(--secondary))",
                color: "hsl(var(--secondary-foreground))",
                px: 3,
                py: 1,
                borderRadius: "999px",
                fontWeight: 500,
                boxShadow: 1,
                "&:hover": {
                  backgroundColor: "hsl(var(--secondary) / 0.9)",
                },
              }}
              onClick={() => router.push('/applicant/login') }
            >
              Try for Free
            </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                sx={{
                  display: { xs: "inline-flex", md: "none" },
                  minWidth: "auto",
                  p: 1,
                  color: "hsl(var(--foreground))",
                }}
              >
                <Menu size={28} />
              </Button>
            </SheetTrigger>

            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  <Typography sx={{ fontSize: "1.25rem", fontWeight: 600, color: "#189e33ff" }}>
                    Unswayed
                  </Typography>
                </SheetTitle>
              </SheetHeader>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
                {navItems.map((item) => (
                  <Link key={item.name} href={item.href} onClick={(e) => handleScroll(e, item.href)}>
                    <Typography
                      component="span"
                      sx={{
                        color: "#888888",
                        fontSize: "1.125rem",
                        py: 1,
                        "&:hover": { color: "hsl(var(--foreground))" },
                        cursor: "pointer",
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Link>
                ))}


                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      backgroundColor: "hsl(var(--secondary))",
                      color: "hsl(var(--secondary-foreground))",
                      px: 3,
                      py: 1,
                      borderRadius: "999px",
                      fontWeight: 500,
                      "&:hover": {
                        backgroundColor: "hsl(var(--secondary) / 0.9)",
                      },
                    }}
                    onClick={() => router.push('/applicant/login') }
                  >
                    Try for Free
                  </Button>
          
              </Box>
            </SheetContent>
          </Sheet>
        </Box>
      </Box>
    </Box>
  )
}
