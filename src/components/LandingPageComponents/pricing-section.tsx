"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export function PricingSection() {
  const [isApplicant, setIsApplicant] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  // ✅ Updated Checkout Handler (no deprecated redirectToCheckout)
  // inside PricingSection component
  const handleCheckout = async (
    planName: string,
    stripePriceId?: string | null
  ) => {
    if (!stripePriceId) {
      alert("This plan is free or not configured for Stripe.");
      return;
    }

    try {
      setLoadingPlan(planName);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: stripePriceId }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        console.error("Non-JSON response:", text);
        alert("Server returned unexpected response. Check console.");
        return;
      }

      if (!res.ok) {
        console.error("Checkout failed (status " + res.status + "):", data);
        alert(`Checkout failed: ${data.error || "server error"}`);
        return;
      }

      if (!data.url) {
        console.error("No checkout URL returned from backend:", data);
        alert("Unable to initiate checkout — no URL returned.");
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong while starting checkout. Check console.");
    } finally {
      setLoadingPlan(null);
    }
  };

  // ✅ Applicant Plans
  const applicantPlans = [
    {
      name: "Free Basic Plan",
      price: "$0",
      description:
        "Always Free - No cost, No time limit. Unlimited Access for Job Seekers.",
      features: [
        "Full access to all job listings",
        "Advanced job search filters with unlimited usage",
        "Unlimited job applications",
        "Resume creation and uploads",
        "Job alerts (customizable: daily or weekly)",
        "Career resource library (articles, tips, and guidance)",
      ],
      audience:
        "Job seekers of all levels of experience, who want to actively apply to jobs.",
      buttonText: "Get Started Free",
      popular: false,
      stripePriceId: null,
      annual: null,
    },
    // {
    //   name: "Pro Plan",
    //   price: "$49.99/Month",
    //   description: "Unlimited Access for Job Seekers with hands-on career support.",
    //   features: [
    //     "Full access to all job listings",
    //     "Advanced job search filters with unlimited usage",
    //     "Unlimited job applications",
    //     "Resume creation and uploads",
    //     "Job alerts (customizable: daily or weekly)",
    //     "Career resource library (articles, tips, and guidance)",
    //     "Resume-building toolkits",
    //     "Career coaching sessions (Coming Soon)",
    //     "Professional resume review and optimization (Coming Soon)",
    //     "Priority customer support (Coming Soon)",
    //   ],
    //   audience:
    //     "Job seekers of all levels of experience, who want to actively apply to jobs and receive hands-on support to boost their career success.",
    //   buttonText: "Upgrade to Pro",
    //   popular: true,
    //   stripePriceId: process.env.NEXT_PUBLIC_STRIPE_APPLICANT_PRO_PRICE_ID,
    // },
    {
      name: "Pro Plan",
      price: "$49.99/Month",
      description:
        "Unlimited Access for Job Seekers with hands-on career support.",
      features: [
        "Full access to all job listings",
        "Advanced job search filters with unlimited usage",
        "Unlimited job applications",
        "Resume creation and uploads",
        "Job alerts (customizable: daily or weekly)",
        "Career resource library (articles, tips, and guidance)",
        "Resume-building toolkits",
        "Career coaching sessions (Coming Soon)",
        "Professional resume review and optimization (Coming Soon)",
        "Priority customer support (Coming Soon)",
      ],
      audience:
        "Job seekers of all levels of experience, who want to actively apply to jobs and receive hands-on support to boost their career success.",
      buttonText: "Upgrade to Pro",
      popular: true,
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_APPLICANT_PRO_PRICE_ID,
      annual: {
        price: "$599.99 / Year",
        label: "Go Pro — Annual",
        highlight: "Best Value · Save more with annual billing",
        stripePriceId:
          process.env.NEXT_PUBLIC_STRIPE_APPLICANT_PRO_ANNUAL_PRICE_ID,
      },
    },
  ];

  // ✅ Employer Plans
  const employerPlans = [
    {
      name: "Tier 1",
      price: "$99.99/Month",
      description: "Ideal for small teams and occasional hiring needs.",
      features: [
        "Job Postings: 50 active job postings at a time",
        "Candidate Access: Basic access to candidate profiles (limited search filters)",
        "Application Management: Standard application tracking system (ATS)",
        "Company Profile: Basic company profile with logo and brief description",
        "Customer Support: Email Support",
      ],
      buttonText: "Start with Standard",
      audience: "Small businesses and startups with occasional hiring needs.",
      popular: false,
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_EMPLOYER_TIER1_PRICE_ID,
      annual: null,
    },
    {
      name: "Tier 2",
      price: "$150.00/Month",
      description:
        "For growing companies needing more candidate filtering and visibility.",
      features: [
        "Job Postings: 75 active job postings at a time",
        "Candidate Access: Advanced candidate search filters (skills, experience, location)",
        "Application Management: Enhanced ATS with customizable workflows and team collaboration features",
        "Company Profile: Enhanced company profile with photos/videos and detailed information",
        "Candidate Communication: In-platform messaging with candidates",
        "Featured Job Slots: 30 featured job slots per month for increased visibility",
        "Customer Support: Priority email and chat support",
      ],
      buttonText: "Upgrade to Professional",
      audience:
        "Growing businesses with regular hiring needs and a focus on candidate quality.",
      popular: true,
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_EMPLOYER_TIER2_PRICE_ID,
      annual: null,
    },
    {
      name: "Tier 3",
      price: "$175.00/Month",
      description:
        "Tailored for large organizations and high-volume hiring requirements.",
      features: [
        "Job Postings: Unlimited active job postings",
        "Candidate Access: Full access to all candidate data, including resume database download",
        "Application Management: Enterprise-grade ATS with API integration, custom reporting, and advanced analytics",
        "Company Profile: Premium company profile with dedicated account manager for branding support",
        "Candidate Communication: Bulk messaging, automated email campaigns, and SMS notifications",
        "Featured Job Slots: 50 featured job slots per month",
        "Dedicated Account Manager: Personalized onboarding and ongoing support",
        "ATS Integrations: API access to integrate existing HR systems",
      ],
      buttonText: "Contact Enterprise Sales",
      audience:
        "Large enterprises and organizations with high-volume hiring needs.",
      popular: false,
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_EMPLOYER_TIER3_PRICE_ID,
      annual: null,
    },
  ];

  const plans = isApplicant ? applicantPlans : employerPlans;

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
      <Box textAlign="center" mb={5} maxWidth="700px">
        <Typography variant="h4" fontWeight={700}>
          Flexible Plans for Every Need
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "rgba(60,60,60,0.7)", mt: 1.5 }}
        >
          Whether you’re a job seeker or an employer, Unswayed offers
          transparent, powerful plans to help you find the right match.
        </Typography>
      </Box>

      {/* Plan Toggle */}
      <Box
        display="flex"
        gap={1}
        bgcolor="#f1f5f9"
        p={0.5}
        borderRadius="10px"
        mb={6}
      >
        <Button
          onClick={() => setIsApplicant(true)}
          variant={isApplicant ? "contained" : "text"}
          sx={{
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "14px",
            px: 3,
            backgroundColor: isApplicant ? "#00305B" : "transparent",
            color: isApplicant ? "#fff" : "#475569",
          }}
        >
          Applicant Plans
        </Button>
        <Button
          onClick={() => setIsApplicant(false)}
          variant={!isApplicant ? "contained" : "text"}
          sx={{
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "14px",
            px: 3,
            backgroundColor: !isApplicant ? "#00305B" : "transparent",
            color: !isApplicant ? "#fff" : "#475569",
          }}
        >
          Employer Plans
        </Button>
      </Box>

      {/* Pricing Cards */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={3}
        maxWidth="1100px"
        justifyContent="center"
        width="100%"
      >
        {plans.map((plan) => (
          <Box
            key={plan.name}
            sx={{
              flex: "1 1 300px",
              p: 4,
              borderRadius: "16px",
              backgroundColor: plan.popular ? "#00305B" : "#ffffff",
              border: "2px solid #00305B",
              color: plan.popular ? "#fff" : "#111827",
              boxShadow: plan.popular
                ? "0 12px 24px rgba(3,105,161,0.25)"
                : "0 4px 12px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 2.5,
              position: "relative",
            }}
          >
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
            <Typography variant="h4" fontWeight={700} lineHeight={1}>
              {plan.price}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: plan.popular ? "rgba(255,255,255,0.85)" : "#6b7280",
              }}
            >
              {plan.description}
            </Typography>

            {/* ✅ Checkout Button */}
            <Button
              variant={plan.popular ? "contained" : "outlined"}
              fullWidth
              disabled={loadingPlan === plan.name}
              onClick={() =>
                handleCheckout(plan.name, plan.stripePriceId || "")
              }
              sx={{
                borderRadius: "40px",
                fontWeight: 600,
                textTransform: "none",
                py: 1.2,
                fontSize: "15px",
                borderColor: plan.popular ? "transparent" : "#189e33ff",
                backgroundColor: plan.popular ? "#189e33ff" : "transparent",
                color: plan.popular ? "#fff" : "#189e33ff",
                "&:hover": {
                  backgroundColor: plan.popular ? "#147c2cff" : "#189e33ff",
                  color: "#fff",
                },
              }}
            >
              {loadingPlan === plan.name ? "Processing..." : plan.buttonText}
            </Button>

            {/* ✅ Annual Pro — rendered ONLY when defined */}
            {isApplicant && plan.name === "Pro Plan" && plan.annual && (
              <Box
                mt={2}
                width="100%"
                p={2}
                border="1px dashed #189e33ff"
                borderRadius="12px"
                textAlign="center"
              >
                <Typography fontWeight={700} fontSize="18px">
                  {plan.annual.price}
                </Typography>

                <Typography variant="body2" sx={{ opacity: 0.85, mb: 1 }}>
                  {plan.annual.highlight}
                </Typography>

                <Button
                  fullWidth
                  disabled={loadingPlan === "Pro Plan Annual"}
                  onClick={() =>
                    handleCheckout("Pro Plan Annual", plan.annual.stripePriceId)
                  }
                  sx={{
                    borderRadius: "40px",
                    fontWeight: 600,
                    textTransform: "none",
                    py: 1.2,
                    backgroundColor: "#189e33ff",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#147c2cff" },
                  }}
                >
                  Go Pro — Annual
                </Button>
              </Box>
            )}

            <Typography variant="body2" fontWeight={600} mt={2}>
              What’s Included:
            </Typography>
            <Box
              component="ul"
              sx={{
                listStyle: "none",
                p: 0,
                m: 0,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
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

            {isApplicant && plan?.audience && (
              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  fontStyle: "italic",
                  color: plan.popular ? "rgba(255,255,255,0.85)" : "#555",
                }}
              >
                Who This Is For: {plan?.audience}
              </Typography>
            )}
          </Box>
        ))}
      </Box>

      {!isApplicant && (
        <Box mt={6} maxWidth="800px" textAlign="center">
          <Typography variant="body2" sx={{ color: "#4b5563", mb: 1 }}>
            <strong>Free Trial:</strong> Employers who sign up for the Free
            Trial Plan get full access to the Standard Plan features for 30
            days. No credit card is required to begin the trial. After 30 days,
            Employers must upgrade to a paid plan to continue using the
            platform.
          </Typography>
          <Typography variant="body2" sx={{ color: "#4b5563", mb: 1 }}>
            <strong>Billing:</strong> Monthly or annual billing options
            available. Annual subscribers receive a 10% discount.
          </Typography>
          <Typography variant="body2" sx={{ color: "#4b5563" }}>
            <strong>Cancellation:</strong> Users can cancel any time before the
            next billing cycle to avoid charges.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
