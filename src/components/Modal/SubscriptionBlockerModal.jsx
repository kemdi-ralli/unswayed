"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Check, X } from "lucide-react";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { useRouter } from "next/navigation";

const SubscriptionBlockerModal = ({ open, userType = "employer" }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const router = useRouter();

  // Static employer plans as fallback
  const staticEmployerPlans = [
    {
      id: 0,
      name: "Tier 1",
      slug: "employer-tier-1",
      price: "99.99",
      billing_period: "monthly",
      description: "Ideal for small teams and occasional hiring needs.",
      features: [
        "Job Postings: 50 active job postings at a time",
        "Candidate Access: Basic access to candidate profiles (limited search filters)",
        "Application Management: Standard application tracking system (ATS)",
        "Company Profile: Basic company profile with logo and brief description",
        "Customer Support: Email Support",
      ],
      user_type: "employer",
      is_active: true,
      sort_order: 1,
    },
    {
      id: 0,
      name: "Tier 2",
      slug: "employer-tier-2",
      price: "150.00",
      billing_period: "monthly",
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
      user_type: "employer",
      is_active: true,
      sort_order: 2,
    },
    {
      id: 0,
      name: "Tier 3",
      slug: "employer-tier-3",
      price: "175.00",
      billing_period: "monthly",
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
      user_type: "employer",
      is_active: true,
      sort_order: 3,
    },
  ];

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await apiInstance.get("/subscriptions/plans");
        if (response.data?.status === "success") {
          const fetchedPlans = response.data.data.plans || [];
          const employerPlans = fetchedPlans.filter(
            (p) => p.user_type === "employer"
          );
          setPlans(employerPlans.length > 0 ? employerPlans : staticEmployerPlans);
        } else {
          setPlans(staticEmployerPlans);
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
        setPlans(staticEmployerPlans);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchPlans();
    }
  }, [open]);

  const parseFeatures = (features) => {
    if (!features) return [];
    if (Array.isArray(features)) return features;
    if (typeof features === "string") {
      try {
        const parsed = JSON.parse(features);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const handleCheckout = async (plan) => {
    if (!plan.id || plan.id === 0) {
      alert("Unable to load plan details. Please refresh the page and try again.");
      return;
    }

    try {
      setLoadingPlan(plan.slug);

      const response = await apiInstance.post("/subscriptions/checkout", {
        plan_id: plan.id,
        success_url: `${window.location.origin}/billing/success`,
        cancel_url: `${window.location.origin}/billing`,
      });

      if (
        response.data?.status === "success" &&
        response.data?.data?.checkout_url
      ) {
        window.location.href = response.data.data.checkout_url;
      } else {
        alert(
          response.data?.message || "Unable to initiate checkout. Please try again."
        );
      }
    } catch (err) {
      console.error("Checkout error:", err);

      if (err.response?.status === 302 || err.response?.status === 301) {
        const redirectUrl = err.response?.headers?.location;
        if (redirectUrl) {
          window.location.href = redirectUrl;
          return;
        }
      }

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors ||
        "Something went wrong while starting checkout.";

      alert(typeof errorMessage === "object" ? JSON.stringify(errorMessage) : errorMessage);
    } finally {
      setLoadingPlan(null);
    }
  };

  const isPlanPopular = (plan) => plan.name === "Tier 2";

  return (
    <Modal
      open={open}
      aria-labelledby="subscription-blocker-modal"
      aria-describedby="subscription-expired-choose-plan"
      disableEscapeKeyDown
      sx={{
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", sm: "90%", md: "85%", lg: "1200px" },
          maxHeight: "90vh",
          bgcolor: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          p: { xs: 3, sm: 4, md: 5 },
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#00305B",
            borderRadius: "10px",
          },
        }}
      >
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              bgcolor: "#fee2e2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
            }}
          >
            <Typography sx={{ fontSize: "48px" }}>⏰</Typography>
          </Box>
          
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#00305B",
              mb: 2,
              fontSize: { xs: "24px", sm: "28px", md: "32px" },
            }}
          >
            Your 30-Day Trial Has Ended
          </Typography>
          
          <Typography
            sx={{
              fontSize: { xs: "14px", sm: "16px" },
              color: "#6b7280",
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Thank you for trying Unswayed! To continue accessing your account and
            all the powerful hiring tools, please select a subscription plan below.
          </Typography>
        </Box>

        {/* Trial Benefits Reminder */}
        <Box
          sx={{
            bgcolor: "#fef3c7",
            border: "1px solid #f59e0b",
            borderRadius: "12px",
            p: 3,
            mb: 4,
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              color: "#92400e",
              fontWeight: 600,
              mb: 1,
            }}
          >
            What you experienced during your trial:
          </Typography>
          <Typography sx={{ fontSize: "13px", color: "#78350f" }}>
            Full access to Tier 1 features including 50 active job postings, basic
            candidate profiles, standard ATS, and email support.
          </Typography>
        </Box>

        {/* Plans Section */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress size={50} />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              mb: 3,
            }}
          >
            {plans.map((plan) => {
              const popular = isPlanPopular(plan);
              const features = parseFeatures(plan.features);

              return (
                <Card
                  key={plan.slug}
                  sx={{
                    flex: 1,
                    borderRadius: "16px",
                    border: popular ? "3px solid #00305B" : "2px solid #e5e7eb",
                    backgroundColor: popular ? "#00305B" : "#ffffff",
                    color: popular ? "#ffffff" : "#111827",
                    boxShadow: popular
                      ? "0 20px 25px -5px rgba(0, 48, 91, 0.3)"
                      : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    position: "relative",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: popular
                        ? "0 25px 30px -5px rgba(0, 48, 91, 0.4)"
                        : "0 10px 15px -3px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  {popular && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: -12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        bgcolor: "#189e33ff",
                        color: "#fff",
                        px: 3,
                        py: 0.5,
                        borderRadius: "999px",
                        fontSize: "13px",
                        fontWeight: 700,
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      MOST POPULAR
                    </Box>
                  )}

                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        color: popular ? "#ffffff" : "#00305B",
                      }}
                    >
                      {plan.name}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "baseline", mb: 2 }}>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          color: popular ? "#ffffff" : "#00305B",
                        }}
                      >
                        ${parseFloat(plan.price).toFixed(2)}
                      </Typography>
                      <Typography
                        sx={{
                          ml: 1,
                          fontSize: "16px",
                          color: popular ? "rgba(255,255,255,0.8)" : "#6b7280",
                        }}
                      >
                        /month
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "14px",
                        mb: 3,
                        minHeight: "40px",
                        color: popular ? "rgba(255,255,255,0.9)" : "#6b7280",
                      }}
                    >
                      {plan.description}
                    </Typography>

                    <Button
                      variant="contained"
                      fullWidth
                      disabled={loadingPlan === plan.slug}
                      onClick={() => handleCheckout(plan)}
                      sx={{
                        py: 1.5,
                        mb: 3,
                        borderRadius: "12px",
                        fontWeight: 700,
                        fontSize: "16px",
                        textTransform: "none",
                        bgcolor: popular ? "#189e33ff" : "#00305B",
                        color: "#ffffff",
                        "&:hover": {
                          bgcolor: popular ? "#147c2cff" : "#00203d",
                        },
                        "&:disabled": {
                          bgcolor: "#9ca3af",
                          color: "#ffffff",
                        },
                      }}
                    >
                      {loadingPlan === plan.slug ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        `Subscribe to ${plan.name}`
                      )}
                    </Button>

                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 600,
                        mb: 2,
                        color: popular ? "#ffffff" : "#00305B",
                      }}
                    >
                      What's Included:
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                      {features.map((feature, index) => (
                        <Box
                          key={index}
                          sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                        >
                          <Check
                            size={18}
                            strokeWidth={3}
                            color={popular ? "#ffffff" : "#189e33ff"}
                            style={{ flexShrink: 0, marginTop: "2px" }}
                          />
                          <Typography
                            sx={{
                              fontSize: "13px",
                              lineHeight: 1.5,
                              color: popular ? "rgba(255,255,255,0.95)" : "#374151",
                            }}
                          >
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}

        {/* Footer Info */}
        <Box
          sx={{
            mt: 4,
            p: 3,
            bgcolor: "#f9fafb",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "13px",
              color: "#4b5563",
              mb: 1,
            }}
          >
            <strong>Billing:</strong> Monthly billing. Cancel anytime before the next
            billing cycle.
          </Typography>
          <Typography
            sx={{
              fontSize: "13px",
              color: "#4b5563",
            }}
          >
            <strong>Need Help?</strong> Contact our sales team for custom enterprise
            solutions or questions about your subscription.
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default SubscriptionBlockerModal;
