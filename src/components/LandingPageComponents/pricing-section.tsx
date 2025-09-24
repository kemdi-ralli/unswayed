"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true)

  const pricingPlans = [
    {
      name: "Free",
      monthlyPrice: "$0",
      annualPrice: "$0",
      description: "Perfect for candidates just getting started on Unswayed.",
      features: [
        "Create and manage your professional profile",
        "Access basic job matching opportunities",
        "Receive interview notifications",
        "Basic AI-driven credential analysis",
        "Standard reporting and insights",
      ],
      buttonText: "Sign Up Free",
      popular: false,
    },
    {
      name: "Pro",
      monthlyPrice: "$25",
      annualPrice: "$20",
      description: "Ideal for professionals looking to maximize talent matching.",
      features: [
        "Advanced AI-driven candidate matching",
        "Priority interview scheduling",
        "Business intelligence insights",
        "Custom filtering for skill and profession fit",
        "Enhanced reporting dashboards",
        "Collaborative team hiring tools",
      ],
      buttonText: "Upgrade to Pro",
      popular: true,
    },
    {
      name: "Enterprise",
      monthlyPrice: "$250",
      annualPrice: "$200",
      description: "Tailored solutions for large-scale hiring and recruitment teams.",
      features: [
        "Dedicated account and support manager",
        "Enterprise-grade AI hiring software",
        "Unlimited candidate analytics",
        "Customizable merit-based filtering",
        "Priority deployment and SLA",
      ],
      buttonText: "Contact Sales",
      popular: false,
    },
  ]

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        py: 8,
        px: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "linear-gradient(to bottom, #f9fafb, #ffffff)",
      }}
    >
      {/* Header */}
      <Box textAlign="center" mb={5} maxWidth="600px">
        <Typography variant="h4" fontWeight={700}>
          Flexible Plans for Every Hiring Need
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "rgba(60,60,60,0.7)", mt: 1.5 }}
        >
          Unswayed offers transparent pricing for individuals, professionals, and enterprise teams,
          ensuring precise talent matching and a merit-based hiring system.
        </Typography>
      </Box>

      {/* Billing Toggle */}
      <Box
        display="flex"
        gap={1}
        bgcolor="#f1f5f9"
        p={0.5}
        borderRadius="10px"
        mb={6}
      >
        <Button
          onClick={() => setIsAnnual(true)}
          variant={isAnnual ? "contained" : "text"}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "14px",
            px: 2,
            backgroundColor: isAnnual ? "#00305B" : "transparent",
            color: isAnnual ? "#fff" : "#475569",
            "&:hover": { backgroundColor: isAnnual ? "#02202eff" : "transparent" },
          }}
        >
          Annual <Typography component="span" fontWeight={400} ml={0.5}>(Save 20%)</Typography>
        </Button>
        <Button
          onClick={() => setIsAnnual(false)}
          variant={!isAnnual ? "contained" : "text"}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "14px",
            px: 2,
            backgroundColor: !isAnnual ? "#00305B" : "transparent",
            color: !isAnnual ? "#fff" : "#475569",
            "&:hover": { backgroundColor: !isAnnual ? "#02202eff" : "transparent" },
          }}
        >
          Monthly
        </Button>
      </Box>

      {/* Cards */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={3}
        maxWidth="1100px"
        justifyContent="center"
        width="100%"
      >
        {pricingPlans.map((plan) => (
          <Box
            key={plan.name}
            sx={{
              flex: "1 1 300px",
              p: 4,
              borderRadius: "16px",
              backgroundColor: plan.popular ? "#00305B" : "#ffffff",
              color: plan.popular ? "#fff" : "#111827",
              boxShadow: plan.popular
                ? "0 12px 24px rgba(3,105,161,0.25)"
                : "0 4px 12px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 2.5,
              position: "relative",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
            }}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: "#fff",
                  color: "#00305B",
                  fontSize: "12px",
                  fontWeight: 600,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "999px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                Most Popular
              </Box>
            )}

            <Typography variant="h6" fontWeight={700}>
              {plan.name}
            </Typography>

            {/* Price */}
            <Typography variant="h4" fontWeight={700} lineHeight={1}>
              {isAnnual ? plan.annualPrice : plan.monthlyPrice}
              <Typography component="span" fontSize="14px" fontWeight={400} ml={0.5}>
                /month
              </Typography>
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: plan.popular ? "rgba(255,255,255,0.85)" : "#6b7280",
              }}
            >
              {plan.description}
            </Typography>

            {/* Button */}
            <Button
              variant={plan.popular ? "contained" : "outlined"}
              fullWidth
              sx={{
                borderRadius: "40px",
                fontWeight: 600,
                textTransform: "none",
                py: 1.2,
                fontSize: "15px",
                borderColor: plan.popular ? "transparent" : "#189e33ff",
                backgroundColor: plan.popular ? "#189e33ff" : "transparent",
                color: plan.popular ? "#fff" : "#189e33ff",
                "&:hover": { backgroundColor: plan.popular ? "#147c2cff" : "#189e33ff"}
              }}
            >
              {plan.buttonText}
            </Button>

            <Typography variant="body2" fontWeight={600}>
              {plan.name === "Free" ? "Includes:" : "Everything in Free +"}
            </Typography>

            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, display: "flex", flexDirection: "column", gap: 1.5 }}>
              {plan.features.map((feature) => (
                <Box
                  key={feature}
                  component="li"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Check
                    strokeWidth={2}
                    color={plan.popular ? "#fff" : "#189e33ff"}
                    size={18}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: plan.popular ? "rgba(255,255,255,0.9)" : "#374151",
                    }}
                  >
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
