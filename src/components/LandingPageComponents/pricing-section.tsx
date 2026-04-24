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
import { keyframes } from "@mui/system";

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

// --- Animations ---
const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 8px rgba(255, 107, 53, 0.4); }
  50% { box-shadow: 0 0 20px rgba(255, 107, 53, 0.8); }
`;

const badgeSlideIn = keyframes`
  from { opacity: 0; transform: translateY(-8px) scale(0.85); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

export function PricingSection() {
  const [isApplicant, setIsApplicant] = useState(true);
  const [promoEnabled, setPromoEnabled] = useState(true);
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
    // --- Annual Employer Plans ---
    {
      id: 0,
      name: "Tier 1 (Yearly)",
      slug: "employer-tier-1-yearly",
      stripe_price_id: "annual_employer_tier1",
      price: "1079.88",
      billing_period: "yearly",
      description: "Ideal for small teams — save with annual billing.",
      features: [
        "Job Postings: 50 active job postings at a time",
        "Candidate Access: Basic access to candidate profiles (limited search filters)",
        "Application Management: Standard application tracking system (ATS)",
        "Company Profile: Basic company profile with logo and brief description",
        "Customer Support: Email Support",
      ],
      user_type: "employer",
      is_active: true,
      sort_order: 4,
    },
    {
      id: 0,
      name: "Tier 2 (Yearly)",
      slug: "employer-tier-2-yearly",
      stripe_price_id: "annual_employer_tier2",
      price: "1620.00",
      billing_period: "yearly",
      description:
        "For growing companies — save with annual billing.",
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
      sort_order: 5,
    },
    {
      id: 0,
      name: "Tier 3 (Yearly)",
      slug: "employer-tier-3-yearly",
      stripe_price_id: "annual_employer_tier3",
      price: "1890.00",
      billing_period: "yearly",
      description:
        "Enterprise-grade — save with annual billing.",
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
      sort_order: 6,
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
    if (parseFloat(plan.price) === 0) return "Get Started for Free";
    if (!isAuthenticated) return "Sign Up to Subscribe";
    if (currentSubscription?.is_on_trial) return "Upgrade Now";
    return plan.name.includes("Tier 3") ? "Contact Enterprise Sales" : "Subscribe";
  };

  // --- Promo discount logic ---
  const getDiscountPercent = (plan: SubscriptionPlan): number | null => {
    if (!promoEnabled) return null;
    // 1-Year plan (applicant yearly): 20% OFF
    if (plan.billing_period === "yearly" || plan.slug?.includes("yearly")) return 20;
    // All other paid plans: 15% OFF (Multi-Year / monthly — shown as badge only for employers)
    if (parseFloat(plan.price) > 0) return 15;
    return null;
  };

  const getDiscountedPrice = (plan: SubscriptionPlan): number | null => {
    const pct = getDiscountPercent(plan);
    if (!pct) return null;
    const orig = parseFloat(plan.price);
    if (orig === 0) return null;
    // Applicant yearly (3rd card): user specified new price $479.99
    if (plan.slug === "applicant-pro-yearly" && pct === 20) return 479.99;
    return parseFloat((orig * (1 - pct / 100)).toFixed(2));
  };

  // Format price display
  const formatPrice = (plan: SubscriptionPlan): string => {
    const price = parseFloat(plan.price);
    if (price === 0) return "$0";
    return `$${price.toFixed(2)}/${plan.billing_period === "yearly" ? "Year" : "Month"}`;
  };

  const formatDiscountedPrice = (plan: SubscriptionPlan): string | null => {
    const dp = getDiscountedPrice(plan);
    if (dp === null) return null;
    return `$${dp.toFixed(2)}/${plan.billing_period === "yearly" ? "Year" : "Month"}`;
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
          Whether you&apos;re a job seeker or an employer, Unswayed offers
          transparent, powerful plans to help you find the right match.
        </Typography>
      </Box>

      {/* ===== PROMO BANNER ===== */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "860px",
          mb: 5,
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: "20px",
          background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFB347 100%)",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(255, 107, 53, 0.35)",
          animation: `${pulseGlow} 3s ease-in-out infinite`,
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -20,
            left: -20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            pointerEvents: "none",
          }}
        />

        {/* Banner Header */}
        <Box display="flex" alignItems="center" gap={1} mb={1.5}>
          {/* Pulsing LIVE dot */}
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: "#fff",
              animation: `${pulseGlow} 1.5s ease-in-out infinite`,
            }}
          />
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{
              fontSize: { xs: "1.15rem", sm: "1.5rem" },
              background: "linear-gradient(90deg, #fff 0%, #FFE0B2 50%, #fff 100%)",
              backgroundSize: "200% auto",
              animation: `${shimmer} 3s linear infinite`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            🔥 Unlock Our Best Launch Pricing!
          </Typography>
        </Box>

        <Typography
          variant="body1"
          sx={{ mb: 1.5, opacity: 0.95, fontSize: { xs: "0.9rem", sm: "1rem" } }}
        >
          Join us this May and choose the plan that suits you best:
        </Typography>

        {/* Promo Details */}
        <Box display="flex" flexDirection="column" gap={0.8} mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                bgcolor: "rgba(255,255,255,0.25)",
                borderRadius: "8px",
                px: 1.2,
                py: 0.3,
                fontWeight: 800,
                fontSize: "13px",
                letterSpacing: 0.5,
              }}
            >
              1-YEAR
            </Box>
            <Typography variant="body2" fontWeight={600}>
              20% OFF! &nbsp;Valid only May 1, 2026 – May 30, 2026.
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                bgcolor: "rgba(255,255,255,0.25)",
                borderRadius: "8px",
                px: 1.2,
                py: 0.3,
                fontWeight: 800,
                fontSize: "13px",
                letterSpacing: 0.5,
              }}
            >
              MULTI-YEAR
            </Box>
            <Typography variant="body2" fontWeight={600}>
              15% OFF, For Life.
            </Typography>
          </Box>
        </Box>

        {/* Toggle + CTA Row */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
        >
          <Typography
            variant="body2"
            sx={{ fontStyle: "italic", opacity: 0.9 }}
          >
            Secure your exclusive discount before the month ends.
          </Typography>

          {/* Promo Toggle Switch */}
          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
            sx={{
              bgcolor: "rgba(255,255,255,0.18)",
              borderRadius: "999px",
              px: 2,
              py: 0.8,
              backdropFilter: "blur(6px)",
              cursor: "pointer",
              userSelect: "none",
              transition: "background 0.2s",
              "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
            }}
            onClick={() => setPromoEnabled((p) => !p)}
          >
            <Typography variant="body2" fontWeight={700} fontSize="13px">
              Apply Launch Discount
            </Typography>
            {/* Custom toggle track */}
            <Box
              sx={{
                width: 44,
                height: 24,
                borderRadius: "999px",
                bgcolor: promoEnabled
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(255,255,255,0.3)",
                position: "relative",
                transition: "background 0.3s",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 3,
                  left: promoEnabled ? 23 : 3,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  bgcolor: promoEnabled ? "#FF6B35" : "#fff",
                  transition: "left 0.3s, background 0.3s",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                }}
              />
            </Box>
          </Box>
        </Box>
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
          const discountPct = getDiscountPercent(plan);
          const discountedPriceStr = formatDiscountedPrice(plan);
          const hasDiscount = discountPct !== null && discountedPriceStr !== null;

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
                transition: "box-shadow 0.3s, transform 0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: popular
                    ? "0 16px 36px rgba(3,105,161,0.35)"
                    : "0 8px 24px rgba(0,0,0,0.1)",
                },
              }}
            >
              {/* Discount Ribbon */}
              {hasDiscount && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 20,
                    background: "linear-gradient(135deg, #FF6B35, #F7931E)",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: 800,
                    px: 1.5,
                    py: 0.7,
                    borderRadius: "0 0 10px 10px",
                    boxShadow: "0 3px 10px rgba(255,107,53,0.4)",
                    animation: `${badgeSlideIn} 0.4s ease-out`,
                    letterSpacing: 0.5,
                    zIndex: 2,
                  }}
                >
                  🔥 {discountPct}% OFF
                </Box>
              )}

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

              <Typography variant="h6" fontWeight={700} sx={{ mt: hasDiscount ? 1.5 : 0 }}>
                {plan.name}
              </Typography>

              {/* Price with discount display */}
              <Box>
                {hasDiscount ? (
                  <>
                    <Typography
                      variant="body1"
                      sx={{
                        textDecoration: "line-through",
                        color: popular ? "rgba(255,255,255,0.5)" : "#9ca3af",
                        fontWeight: 500,
                        fontSize: "15px",
                        lineHeight: 1.2,
                      }}
                    >
                      {formatPrice(plan)}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h4" fontWeight={700} lineHeight={1}>
                        {discountedPriceStr}
                      </Typography>
                      <Box
                        sx={{
                          bgcolor: popular ? "rgba(255,255,255,0.2)" : "#FFF3E0",
                          color: popular ? "#FFB347" : "#E65100",
                          fontSize: "11px",
                          fontWeight: 700,
                          px: 1,
                          py: 0.3,
                          borderRadius: "6px",
                          animation: `${badgeSlideIn} 0.5s ease-out`,
                        }}
                      >
                        SAVE {discountPct}%
                      </Box>
                    </Box>
                  </>
                ) : (
                  <Typography variant="h4" fontWeight={700} lineHeight={1}>
                    {formatPrice(plan)}
                  </Typography>
                )}
              </Box>

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