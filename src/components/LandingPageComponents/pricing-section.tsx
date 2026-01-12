"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import apiInstance from "@/services/apiService/apiServiceInstance";

// Types matching Laravel backend
interface SubscriptionPlan {
  id: number;
  name: string;
  slug: string;
  stripe_price_id: string | null;
  price: string;
  billing_period: "monthly" | "yearly";
  description: string | null;
  features: string[] | string | null; // Can be array or JSON string
  user_type: "applicant" | "employer";
  is_active: boolean;
  sort_order: number;
}

interface SubscriptionInfo {
  plan: string;
  is_subscribed: boolean;
  is_on_trial: boolean;
  trial_ends_at: string | null;
  subscription_ends_at: string | null;
  days_remaining: number;
  has_active_subscription: boolean;
}

interface AuthState {
  auth: {
    userData: {
      token?: string;
      user?: {
        id: number;
        type: "applicant" | "employer";
        [key: string]: any;
      };
    } | null;
  };
}

// Helper function to safely parse features (handles JSON string or array)
const parseFeatures = (features: string[] | string | null): string[] => {
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

export function PricingSection() {
  const [isApplicant, setIsApplicant] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<SubscriptionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Get auth state from Redux
  const { userData } = useSelector((state: AuthState) => state.auth);
  const user = userData?.user;
  const isAuthenticated = !!user;

  // Set initial tab based on user type
  useEffect(() => {
    if (user?.type) {
      setIsApplicant(user.type === "applicant");
    }
  }, [user?.type]);

  // Fetch plans from Laravel backend
  useEffect(() => {
    const fetchPlans = async () => {
      // Only fetch if authenticated - otherwise use static plans
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiInstance.get("/subscriptions/plans");

        if (response.data?.status === "success") {
          const fetchedPlans = response.data.data.plans || [];
          console.log("Fetched plans:", fetchedPlans); // Debug log
          setPlans(fetchedPlans);
          setCurrentSubscription(response.data.data.current_subscription || null);
        }
      } catch (err: any) {
        console.error("Error fetching plans:", err);
        // Don't set error - just use static plans
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [isAuthenticated]);

  // Handle checkout via Laravel backend
  const handleCheckout = async (plan: SubscriptionPlan) => {
    console.log("handleCheckout called with plan:", plan); // Debug log

    // If free plan, no checkout needed
    if (!plan.stripe_price_id || parseFloat(plan.price) === 0) {
      alert("This is a free plan. You already have access!");
      return;
    }

    // If not authenticated, redirect to appropriate login
    if (!isAuthenticated) {
      const loginPath =
        plan.user_type === "employer" ? "/employer/login" : "/applicant/login";
      router.push(`${loginPath}?redirect=/billing&plan=${plan.slug}`);
      return;
    }

    // IMPORTANT: Validate plan has a real database ID
    if (!plan.id || plan.id === 0) {
      console.error("Plan has no valid ID:", plan);
      alert("Unable to process this plan. Please refresh the page and try again.");
      return;
    }

    try {
      setLoadingPlan(plan.slug);

      console.log("Sending checkout request with plan_id:", plan.id); // Debug log

      const response = await apiInstance.post("/subscriptions/checkout", {
        plan_id: plan.id,
        success_url: `${window.location.origin}/billing/success`,
        cancel_url: `${window.location.origin}/billing`,
      });

      console.log("Checkout response:", response.data); // Debug log

      if (
        response.data?.status === "success" &&
        response.data?.data?.checkout_url
      ) {
        // Use window.location.href for external redirect to Stripe
        console.log("Redirecting to:", response.data.data.checkout_url);
        window.location.href = response.data.data.checkout_url;
      } else {
        console.error("Unexpected checkout response:", response.data);
        alert(
          response.data?.message || "Unable to initiate checkout. Please try again."
        );
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      console.error("Error response:", err.response?.data);

      // Check if it's a redirect happening (axios might throw on redirect)
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

      if (typeof errorMessage === "object") {
        alert(`Error: ${JSON.stringify(errorMessage)}`);
      } else {
        alert(errorMessage);
      }
    } finally {
      setLoadingPlan(null);
    }
  };

  // Check if user is on this plan
  const isCurrentPlan = (planName: string): boolean => {
    if (!currentSubscription) return false;
    return currentSubscription.plan.toLowerCase() === planName.toLowerCase();
  };

  // Static plans for display only (when not authenticated or API fails)
  const staticApplicantPlans: SubscriptionPlan[] = [
    {
      id: 0,
      name: "Freemium",
      slug: "applicant-freemium",
      stripe_price_id: null,
      price: "0.00",
      billing_period: "monthly",
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
      user_type: "applicant",
      is_active: true,
      sort_order: 1,
    },
    {
      id: 0,
      name: "Pro Plan",
      slug: "applicant-pro-monthly",
      stripe_price_id: "price_placeholder",
      price: "49.99",
      billing_period: "monthly",
      description: "Unlimited Access for Job Seekers with hands-on career support.",
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
      user_type: "applicant",
      is_active: true,
      sort_order: 2,
    },
    {
      id: 0,
      name: "Pro Plan (Yearly)",
      slug: "applicant-pro-yearly",
      stripe_price_id: "price_placeholder",
      price: "599.99",
      billing_period: "yearly",
      description: "Unlock premium features - Save with annual billing",
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
      user_type: "applicant",
      is_active: true,
      sort_order: 3,
    },
  ];

  const staticEmployerPlans: SubscriptionPlan[] = [
    {
      id: 0,
      name: "Tier 1",
      slug: "employer-tier-1",
      stripe_price_id: "price_placeholder",
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
      stripe_price_id: "price_placeholder",
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
      stripe_price_id: "price_placeholder",
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

  // Use fetched plans if available, otherwise use static plans for display
  const getDisplayPlans = (): SubscriptionPlan[] => {
    const fetchedPlans = plans.filter((p) =>
      isApplicant ? p.user_type === "applicant" : p.user_type === "employer"
    );

    if (fetchedPlans.length > 0) {
      return fetchedPlans;
    }

    // Fallback to static plans for display only
    return isApplicant ? staticApplicantPlans : staticEmployerPlans;
  };

  const displayPlans = getDisplayPlans();

  // Determine if plan is "popular" (middle tier or Pro)
  const isPlanPopular = (plan: SubscriptionPlan): boolean => {
    if (isApplicant) {
      return plan.name === "Pro Plan" && plan.billing_period === "monthly";
    }
    return plan.name === "Tier 2";
  };

  // Get button text based on plan state
  const getButtonText = (plan: SubscriptionPlan): string => {
    if (isCurrentPlan(plan.name)) return "Current Plan";
    if (parseFloat(plan.price) === 0) return "Get Started Free";
    if (!isAuthenticated) return "Sign Up to Subscribe";
    if (currentSubscription?.is_on_trial) return "Upgrade Now";
    return plan.name.includes("Tier 3") ? "Contact Enterprise Sales" : "Subscribe";
  };

  // Format price display
  const formatPrice = (plan: SubscriptionPlan): string => {
    const price = parseFloat(plan.price);
    if (price === 0) return "$0";
    return `$${price.toFixed(2)}/${plan.billing_period === "yearly" ? "Year" : "Month"}`;
  };

  // Handle button click
  const handleButtonClick = async (plan: SubscriptionPlan) => {
    console.log("Button clicked for plan:", plan.name, "ID:", plan.id, "Authenticated:", isAuthenticated);

    // Free plan - no action needed
    if (parseFloat(plan.price) === 0) {
      alert("This is a free plan. You already have access!");
      return;
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      const loginPath =
        plan.user_type === "employer" ? "/employer/login" : "/applicant/login";
      router.push(`${loginPath}?redirect=/billing&plan=${plan.slug}`);
      return;
    }

    // Using static plans (ID is 0) but authenticated - this shouldn't happen
    // It means the API call failed. Try to refetch or show error.
    if (plan.id === 0) {
      alert("Unable to load plan details. Please refresh the page and try again.");
      return;
    }

    // Proceed to checkout
    await handleCheckout(plan);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

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
          Whether you're a job seeker or an employer, Unswayed offers
          transparent, powerful plans to help you find the right match.
        </Typography>
      </Box>

      {/* Current Subscription Status */}
      {currentSubscription && isAuthenticated && (
        <Box
          mb={4}
          p={2}
          borderRadius="12px"
          bgcolor={currentSubscription.is_on_trial ? "#fef3c7" : "#dcfce7"}
          border={`1px solid ${currentSubscription.is_on_trial ? "#f59e0b" : "#22c55e"}`}
        >
          <Typography variant="body2" fontWeight={600}>
            {currentSubscription.is_on_trial
              ? `🕐 Trial: ${currentSubscription.days_remaining} days remaining`
              : `✓ Current Plan: ${currentSubscription.plan}`}
          </Typography>
        </Box>
      )}

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

      {/* Error State */}
      {error && (
        <Box
          mb={4}
          p={2}
          borderRadius="8px"
          bgcolor="#fee2e2"
          border="1px solid #ef4444"
        >
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        </Box>
      )}

      {/* Pricing Cards */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={3}
        maxWidth="1100px"
        justifyContent="center"
        width="100%"
      >
        {displayPlans.map((plan) => {
          const popular = isPlanPopular(plan);
          const isCurrent = isCurrentPlan(plan.name);
          // Parse features safely - handles both array and JSON string
          const features = parseFeatures(plan.features);

          return (
            <Box
              key={plan.slug}
              sx={{
                flex: "1 1 300px",
                p: 4,
                borderRadius: "16px",
                backgroundColor: popular ? "#00305B" : "#ffffff",
                border: isCurrent ? "3px solid #22c55e" : "2px solid #00305B",
                color: popular ? "#fff" : "#111827",
                boxShadow: popular
                  ? "0 12px 24px rgba(3,105,161,0.25)"
                  : "0 4px 12px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 2.5,
                position: "relative",
                opacity: isCurrent ? 0.9 : 1,
              }}
            >
              {/* Popular Badge */}
              {popular && (
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

              {/* Current Plan Badge */}
              {isCurrent && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    background: "#22c55e",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 600,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "999px",
                  }}
                >
                  Current
                </Box>
              )}

              <Typography variant="h6" fontWeight={700}>
                {plan.name}
              </Typography>
              <Typography variant="h4" fontWeight={700} lineHeight={1}>
                {formatPrice(plan)}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: popular ? "rgba(255,255,255,0.85)" : "#6b7280" }}
              >
                {plan.description}
              </Typography>

              {/* Checkout Button */}
              <Button
                variant={popular ? "contained" : "outlined"}
                fullWidth
                disabled={loadingPlan === plan.slug || isCurrent}
                onClick={() => handleButtonClick(plan)}
                sx={{
                  borderRadius: "40px",
                  fontWeight: 600,
                  textTransform: "none",
                  py: 1.2,
                  fontSize: "15px",
                  borderColor: popular ? "transparent" : "#189e33ff",
                  backgroundColor: isCurrent
                    ? "#9ca3af"
                    : popular
                    ? "#189e33ff"
                    : "transparent",
                  color: popular || isCurrent ? "#fff" : "#189e33ff",
                  "&:hover": {
                    backgroundColor: isCurrent
                      ? "#9ca3af"
                      : popular
                      ? "#147c2cff"
                      : "#189e33ff",
                    color: "#fff",
                  },
                  "&:disabled": {
                    backgroundColor: isCurrent ? "#9ca3af" : undefined,
                    color: isCurrent ? "#fff" : undefined,
                  },
                }}
              >
                {loadingPlan === plan.slug ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  getButtonText(plan)
                )}
              </Button>

              {/* Features List */}
              <Typography variant="body2" fontWeight={600} mt={2}>
                What's Included:
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
                {features.map((feature, index) => (
                  <Box
                    key={`${plan.slug}-feature-${index}`}
                    component="li"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Check
                      strokeWidth={2}
                      color={popular ? "#fff" : "#189e33ff"}
                      size={18}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: popular ? "rgba(255,255,255,0.9)" : "#374151",
                      }}
                    >
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Employer Footer Info */}
      {!isApplicant && (
        <Box mt={6} maxWidth="800px" textAlign="center">
          <Typography variant="body2" sx={{ color: "#4b5563", mb: 1 }}>
            <strong>Free Trial:</strong> Employers who sign up get full access
            to Tier 1 features for 30 days. No credit card required. After 30
            days, upgrade to continue.
          </Typography>
          <Typography variant="body2" sx={{ color: "#4b5563", mb: 1 }}>
            <strong>Billing:</strong> Monthly billing. Cancel anytime before the
            next billing cycle.
          </Typography>
          <Typography variant="body2" sx={{ color: "#4b5563" }}>
            <strong>Need Help?</strong> Contact our sales team for custom
            enterprise solutions.
          </Typography>
        </Box>
      )}
    </Box>
  );
}