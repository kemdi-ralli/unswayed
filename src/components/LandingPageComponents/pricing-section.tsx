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

// ─── Types ────────────────────────────────────────────────────────────────────
interface SubscriptionPlan {
  id: number;
  name: string;
  slug: string;
  stripe_price_id: string | null;
  price: string;
  billing_period: "monthly" | "yearly";
  description: string | null;
  features: string[] | string | null;
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

// ─── Discount constants ───────────────────────────────────────────────────────
// Standard discount for annual billing (always)
const YEARLY_DISCOUNT_PCT = 15;
// June wildcard: 20% off any paid plan, June 1–30 only
const JUNE_PROMO_PCT = 20;
// Evaluated once at module load (client-side only — safe in Next.js "use client")
const IS_JUNE_PROMO_ACTIVE = (() => {
  if (typeof window === "undefined") return false;
  return new Date().getMonth() === 5; // Month is 0-indexed; 5 = June
})();

// ─── Animations ───────────────────────────────────────────────────────────────
const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 8px rgba(255, 107, 53, 0.4); }
  50%       { box-shadow: 0 0 20px rgba(255, 107, 53, 0.8); }
`;

const badgeSlideIn = keyframes`
  from { opacity: 0; transform: translateY(-8px) scale(0.85); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// ─── Static fallback plans ────────────────────────────────────────────────────
// Yearly prices are undiscounted annual totals (monthly × 12).
// All discounts are applied exclusively in the UI layer.
const STATIC_APPLICANT_PLANS: SubscriptionPlan[] = [
  {
    id: 0,
    name: "Freemium",
    slug: "applicant-freemium",
    stripe_price_id: null,
    price: "0.00",
    billing_period: "monthly",
    description: "Always Free — no cost, no time limit. Full access for job seekers.",
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
    stripe_price_id: "price_1SOckYEWILSBYYC8Rpzc4Cgg",
    price: "49.99",
    billing_period: "monthly",
    description: "Unlimited access for job seekers with hands-on career support.",
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
    name: "Pro Plan",
    slug: "applicant-pro-yearly",
    stripe_price_id: "price_1TWkRcEWILSBYYC82A8pKW2H",
    // $49.99 × 12 = $599.88 — undiscounted annual base
    price: "599.88",
    billing_period: "yearly",
    description: "Unlimited access for job seekers — save with annual billing.",
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

const STATIC_EMPLOYER_PLANS: SubscriptionPlan[] = [
  // ── Monthly ──
  {
    id: 0,
    name: "Tier 1",
    slug: "employer-tier-1",
    stripe_price_id: "price_1SOckYEWILSBYYC8c3GeP7ez",
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
    stripe_price_id: "price_1SOckYEWILSBYYC82cPtMenr",
    price: "150.00",
    billing_period: "monthly",
    description: "For growing companies needing more candidate filtering and visibility.",
    features: [
      "Job Postings: 75 active job postings at a time",
      "Candidate Access: Advanced candidate search filters (skills, experience, location)",
      "Application Management: Enhanced ATS with customizable workflows and team collaboration",
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
    stripe_price_id: "price_1SOckYEWILSBYYC8N8GbflcY",
    price: "175.00",
    billing_period: "monthly",
    description: "Tailored for large organizations and high-volume hiring requirements.",
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
  // ── Yearly (price = monthly × 12, undiscounted) ──
  {
    id: 0,
    name: "Tier 1",
    slug: "employer-tier-1-yearly",
    stripe_price_id: "price_1TPr35EWILSBYYC8lPQAIjda",
    // $99.99 × 12 = $1,199.88
    price: "1199.88",
    billing_period: "yearly",
    description: "Ideal for small teams — save more with annual billing.",
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
    name: "Tier 2",
    slug: "employer-tier-2-yearly",
    stripe_price_id: "price_1TPr8HEWILSBYYC8XHa42W6d",
    // $150.00 × 12 = $1,800.00
    price: "1800.00",
    billing_period: "yearly",
    description: "For growing companies — save more with annual billing.",
    features: [
      "Job Postings: 75 active job postings at a time",
      "Candidate Access: Advanced candidate search filters (skills, experience, location)",
      "Application Management: Enhanced ATS with customizable workflows and team collaboration",
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
    name: "Tier 3",
    slug: "employer-tier-3-yearly",
    stripe_price_id: "price_1TPrA9EWILSBYYC8JZ3SSJYb",
    // $175.00 × 12 = $2,100.00
    price: "2100.00",
    billing_period: "yearly",
    description: "Enterprise-grade — save more with annual billing.",
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

// ─── Component ────────────────────────────────────────────────────────────────
export function PricingSection() {
  const [isApplicant, setIsApplicant] = useState(true);
  // Monthly / Yearly billing toggle — replaces the old promoEnabled toggle
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<SubscriptionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { userData } = useSelector((state: AuthState) => state.auth);
  const user = userData?.user;
  const isAuthenticated = !!user;

  // Lock the tab to the user's own type when authenticated
  useEffect(() => {
    if (user?.type) setIsApplicant(user.type === "applicant");
  }, [user?.type]);

  // Fetch live plans from backend
  useEffect(() => {
    const fetchPlans = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await apiInstance.get("/subscriptions/plans");
        if (response.data?.status === "success") {
          setPlans(response.data.data.plans || []);
          setCurrentSubscription(response.data.data.current_subscription || null);
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, [isAuthenticated]);

  // ── Discount logic ───────────────────────────────────────────────────────────
  // Rule matrix:
  //   Free plan            → always null (no discount)
  //   June (any period)    → 20%  (wildcard overrides everything)
  //   Yearly + not June    → 15%
  //   Monthly + not June   → null (no discount)
  const getDiscountPercent = (plan: SubscriptionPlan): number | null => {
    if (parseFloat(plan.price) === 0) return null;
    if (IS_JUNE_PROMO_ACTIVE) return JUNE_PROMO_PCT;
    if (plan.billing_period === "yearly") return YEARLY_DISCOUNT_PCT;
    return null;
  };

  const getDiscountedPrice = (plan: SubscriptionPlan): number | null => {
    const pct = getDiscountPercent(plan);
    if (pct === null) return null;
    return parseFloat((parseFloat(plan.price) * (1 - pct / 100)).toFixed(2));
  };

  // For yearly cards: show the per-month equivalent so users can compare easily
  const getMonthlyEquivalent = (plan: SubscriptionPlan): string | null => {
    if (plan.billing_period !== "yearly") return null;
    const dp = getDiscountedPrice(plan);
    const annual = dp !== null ? dp : parseFloat(plan.price);
    return `$${(annual / 12).toFixed(2)}/mo`;
  };

  const formatBasePrice = (plan: SubscriptionPlan): string => {
    const price = parseFloat(plan.price);
    if (price === 0) return "$0";
    return `$${price.toFixed(2)}${plan.billing_period === "yearly" ? "/yr" : "/mo"}`;
  };

  const formatDiscountedPrice = (plan: SubscriptionPlan): string | null => {
    const dp = getDiscountedPrice(plan);
    if (dp === null) return null;
    return `$${dp.toFixed(2)}${plan.billing_period === "yearly" ? "/yr" : "/mo"}`;
  };

  // ── Plan filtering ────────────────────────────────────────────────────────────
  // Always show free-tier plans; paid plans are filtered by the billing toggle
  const getDisplayPlans = (): SubscriptionPlan[] => {
    const userTypePlans = plans.filter(
      (p) => p.user_type === (isApplicant ? "applicant" : "employer")
    );
    const source =
      userTypePlans.length > 0
        ? userTypePlans
        : isApplicant
          ? STATIC_APPLICANT_PLANS
          : STATIC_EMPLOYER_PLANS;

    return source.filter(
      (p) => parseFloat(p.price) === 0 || p.billing_period === billingPeriod
    );
  };

  const displayPlans = getDisplayPlans();

  // Popular = Pro Plan (applicants) or Tier 2 (employers) — monthly or yearly
  const isPlanPopular = (plan: SubscriptionPlan): boolean =>
    isApplicant
      ? plan.name === "Pro Plan"
      : plan.name === "Tier 2";

  const isCurrentPlan = (planName: string): boolean =>
    !!currentSubscription &&
    currentSubscription.plan.toLowerCase() === planName.toLowerCase();

  const getButtonText = (plan: SubscriptionPlan): string => {
    if (isCurrentPlan(plan.name)) return "Current Plan";
    if (parseFloat(plan.price) === 0) return "Get Started for Free";
    if (!isAuthenticated) return "Sign Up to Subscribe";
    if (currentSubscription?.is_on_trial) return "Upgrade Now";
    return plan.name === "Tier 3" ? "Contact Enterprise Sales" : "Subscribe";
  };

  // ── Checkout ─────────────────────────────────────────────────────────────────
  const handleCheckout = async (plan: SubscriptionPlan) => {
    if (!plan.stripe_price_id || parseFloat(plan.price) === 0) {
      alert("This is a free plan. You already have access!");
      return;
    }
    if (!isAuthenticated) {
      const loginPath =
        plan.user_type === "employer" ? "/employer/login" : "/applicant/login";
      router.push(`${loginPath}?redirect=/billing&plan=${plan.slug}`);
      return;
    }
    if (!plan.id || plan.id === 0) {
      alert("Unable to process this plan. Please refresh the page and try again.");
      return;
    }

    try {
      setLoadingPlan(plan.slug);
      const response = await apiInstance.post("/subscriptions/checkout", {
        plan_id: plan.id,
        success_url: `${window.location.origin}/billing/success`,
        cancel_url: `${window.location.origin}/billing`,
      });

      if (response.data?.status === "success" && response.data?.data?.checkout_url) {
        window.location.href = response.data.data.checkout_url;
      } else {
        alert(response.data?.message || "Unable to initiate checkout. Please try again.");
      }
    } catch (err: any) {
      if (err.response?.status === 302 || err.response?.status === 301) {
        const redirectUrl = err.response?.headers?.location;
        if (redirectUrl) { window.location.href = redirectUrl; return; }
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

  const handleButtonClick = async (plan: SubscriptionPlan) => {
    if (parseFloat(plan.price) === 0) {
      alert("This is a free plan. You already have access!");
      return;
    }
    if (!isAuthenticated) {
      const loginPath =
        plan.user_type === "employer" ? "/employer/login" : "/applicant/login";
      router.push(`${loginPath}?redirect=/billing&plan=${plan.slug}`);
      return;
    }
    if (plan.id === 0) {
      alert("Unable to load plan details. Please refresh the page and try again.");
      return;
    }
    await handleCheckout(plan);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────────
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
      {/* ── Header ── */}
      <Box textAlign="center" mb={5} maxWidth="700px">
        <Typography variant="h4" fontWeight={700}>
          Flexible Plans for Every Need
        </Typography>
        <Typography variant="body1" sx={{ color: "rgba(60,60,60,0.7)", mt: 1.5 }}>
          Whether you&apos;re a job seeker or an employer, Unswayed offers
          transparent, powerful plans to help you find the right match.
        </Typography>
      </Box>

      {/* ── Promo Banner ── */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "860px",
          mb: 5,
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: "20px",
          background: IS_JUNE_PROMO_ACTIVE
            ? "linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFB347 100%)"
            : "linear-gradient(135deg, #00305B 0%, #005099 60%, #0077cc 100%)",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          boxShadow: IS_JUNE_PROMO_ACTIVE
            ? "0 8px 32px rgba(255, 107, 53, 0.35)"
            : "0 8px 32px rgba(0, 48, 91, 0.3)",
          animation: IS_JUNE_PROMO_ACTIVE
            ? `${pulseGlow} 3s ease-in-out infinite`
            : "none",
        }}
      >
        {/* Decorative circles */}
        <Box sx={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />

        {IS_JUNE_PROMO_ACTIVE ? (
          /* ── JUNE ACTIVE banner ── */
          <>
            <Box display="flex" alignItems="center" gap={1} mb={1.5}>
              <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#fff", animation: `${pulseGlow} 1.5s ease-in-out infinite` }} />
              <Typography
                variant="h5"
                fontWeight={800}
                sx={{
                  fontSize: { xs: "1.1rem", sm: "1.45rem" },
                  background: "linear-gradient(90deg, #fff 0%, #FFE0B2 50%, #fff 100%)",
                  backgroundSize: "200% auto",
                  animation: `${shimmer} 3s linear infinite`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                🔥 June Special — 20% Off Everything!
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 1.5, opacity: 0.95, fontSize: { xs: "0.9rem", sm: "1rem" } }}>
              This month only: every paid plan is <strong>20% off</strong> — monthly or yearly.
              Prices are already reflected below.
            </Typography>

            <Box display="flex" flexDirection="column" gap={0.8} mb={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ bgcolor: "rgba(255,255,255,0.25)", borderRadius: "8px", px: 1.2, py: 0.3, fontWeight: 800, fontSize: "13px", letterSpacing: 0.5 }}>
                  ANY PLAN
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  20% OFF — valid June 1–30, 2026 only.
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ bgcolor: "rgba(255,255,255,0.25)", borderRadius: "8px", px: 1.2, py: 0.3, fontWeight: 800, fontSize: "13px", letterSpacing: 0.5 }}>
                  YEARLY
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  Lock in 20% off for the whole year — best value of 2026.
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" sx={{ fontStyle: "italic", opacity: 0.9, mt: 1 }}>
              ⏰ Offer ends June 30. Subscribe before midnight to secure your discount.
            </Typography>
          </>
        ) : (
          /* ── STANDARD (non-June) banner ── */
          <>
            <Box display="flex" alignItems="center" gap={1} mb={1.5}>
              <Typography
                variant="h5"
                fontWeight={800}
                sx={{ fontSize: { xs: "1.1rem", sm: "1.45rem" } }}
              >
                💡 Save 15% with Yearly Billing
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 2, opacity: 0.95, fontSize: { xs: "0.9rem", sm: "1rem" } }}>
              Switch to annual billing and save <strong>15%</strong> on any paid plan —
              billed once per year, cancel before renewal.
            </Typography>

            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.5,
                bgcolor: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "12px",
                px: 2.5,
                py: 1.5,
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={800} fontSize="13px" sx={{ opacity: 0.7, textTransform: "uppercase", letterSpacing: 1 }}>
                  Coming June 1
                </Typography>
                <Typography variant="body1" fontWeight={700}>
                  🔥 20% off ALL plans for the entire month of June
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.3 }}>
                  Any billing period. Mark your calendar — June 1–30, 2026.
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Box>

      {/* ── Current Subscription Status ── */}
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

      {/* ── Applicant / Employer toggle ── */}
      <Box display="flex" gap={1} bgcolor="#f1f5f9" p={0.5} borderRadius="10px" mb={2}>
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
            textTransform: "none",
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
            textTransform: "none",
          }}
        >
          Employer Plans
        </Button>
      </Box>

      {/* ── Monthly / Yearly billing toggle ── */}
      <Box
        display="flex"
        alignItems="center"
        gap={0}
        bgcolor="#f1f5f9"
        p={0.5}
        borderRadius="10px"
        mb={6}
        position="relative"
      >
        <Button
          onClick={() => setBillingPeriod("monthly")}
          variant={billingPeriod === "monthly" ? "contained" : "text"}
          sx={{
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "14px",
            px: 3,
            py: 1,
            backgroundColor: billingPeriod === "monthly" ? "#fff" : "transparent",
            color: billingPeriod === "monthly" ? "#00305B" : "#475569",
            boxShadow: billingPeriod === "monthly" ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
            textTransform: "none",
          }}
        >
          Monthly
        </Button>
        <Button
          onClick={() => setBillingPeriod("yearly")}
          variant={billingPeriod === "yearly" ? "contained" : "text"}
          sx={{
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "14px",
            px: 3,
            py: 1,
            backgroundColor: billingPeriod === "yearly" ? "#fff" : "transparent",
            color: billingPeriod === "yearly" ? "#00305B" : "#475569",
            boxShadow: billingPeriod === "yearly" ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
            textTransform: "none",
          }}
        >
          Yearly
          {/* Savings badge on the Yearly button */}
          <Box
            component="span"
            sx={{
              ml: 1,
              px: 1,
              py: 0.2,
              bgcolor: IS_JUNE_PROMO_ACTIVE ? "#FF6B35" : "#189e33ff",
              color: "#fff",
              borderRadius: "6px",
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: 0.3,
              lineHeight: 1.6,
            }}
          >
            {IS_JUNE_PROMO_ACTIVE ? "20% OFF" : "SAVE 15%"}
          </Box>
        </Button>
      </Box>

      {/* ── Error State ── */}
      {error && (
        <Box mb={4} p={2} borderRadius="8px" bgcolor="#fee2e2" border="1px solid #ef4444">
          <Typography color="error" variant="body2">{error}</Typography>
        </Box>
      )}

      {/* ── Pricing Cards ── */}
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
          const features = parseFeatures(plan.features);
          const discountPct = getDiscountPercent(plan);
          const discountedPriceStr = formatDiscountedPrice(plan);
          const hasDiscount = discountPct !== null && discountedPriceStr !== null;
          const monthlyEquiv = getMonthlyEquivalent(plan);
          const isFree = parseFloat(plan.price) === 0;

          return (
            <Box
              key={plan.slug}
              sx={{
                flex: "1 1 300px",
                p: 4,
                borderRadius: "16px",
                backgroundColor: popular ? "#00305B" : "#ffffff",
                border: isCurrent
                  ? "3px solid #22c55e"
                  : popular
                    ? "2px solid #00305B"
                    : "2px solid #e5e7eb",
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
              {popular && !isCurrent && (
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
                    right: 16,
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

              {/* Plan name */}
              <Typography variant="h6" fontWeight={700} sx={{ mt: hasDiscount ? 1.5 : 0 }}>
                {plan.name}
                {/* Billing period label (only on paid plans) */}
                {!isFree && (
                  <Box
                    component="span"
                    sx={{
                      ml: 1,
                      fontSize: "11px",
                      fontWeight: 600,
                      px: 1,
                      py: 0.3,
                      bgcolor: popular ? "rgba(255,255,255,0.15)" : "#f0f4ff",
                      color: popular ? "rgba(255,255,255,0.8)" : "#4b6bfb",
                      borderRadius: "6px",
                      verticalAlign: "middle",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {plan.billing_period === "yearly" ? "Annual" : "Monthly"}
                  </Box>
                )}
              </Typography>

              {/* Price block */}
              <Box>
                {isFree ? (
                  /* Free plan — no strikethrough, no badge */
                  <Box>
                    <Typography variant="h4" fontWeight={700} lineHeight={1}>$0</Typography>
                    <Typography variant="body2" sx={{ color: popular ? "rgba(255,255,255,0.7)" : "#6b7280", mt: 0.5 }}>
                      Always Free
                    </Typography>
                  </Box>
                ) : hasDiscount ? (
                  /* Discounted paid plan */
                  <>
                    <Typography
                      variant="body1"
                      sx={{
                        textDecoration: "line-through",
                        color: popular ? "rgba(255,255,255,0.45)" : "#9ca3af",
                        fontWeight: 500,
                        fontSize: "15px",
                        lineHeight: 1.2,
                      }}
                    >
                      {formatBasePrice(plan)}
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
                    {/* Monthly equivalent for yearly plans */}
                    {monthlyEquiv && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: popular ? "rgba(255,255,255,0.65)" : "#6b7280",
                          mt: 0.5,
                          fontSize: "12px",
                        }}
                      >
                        {monthlyEquiv} · billed annually
                      </Typography>
                    )}
                  </>
                ) : (
                  /* Full-price paid plan (monthly, not June) */
                  <Box>
                    <Typography variant="h4" fontWeight={700} lineHeight={1}>
                      {formatBasePrice(plan)}
                    </Typography>
                    {/* Tease the yearly saving when on monthly view and it's not June */}
                    {!IS_JUNE_PROMO_ACTIVE && billingPeriod === "monthly" && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: popular ? "rgba(255,255,255,0.65)" : "#6b7280",
                          mt: 0.5,
                          fontSize: "12px",
                        }}
                      >
                        Switch to yearly and save 15%
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>

              {/* Description */}
              <Typography
                variant="body2"
                sx={{ color: popular ? "rgba(255,255,255,0.85)" : "#6b7280" }}
              >
                {plan.description}
              </Typography>

              {/* CTA Button */}
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

              {/* Features list */}
              <Typography variant="body2" fontWeight={600} mt={2}>
                What&apos;s Included:
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
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <Check
                      strokeWidth={2}
                      color={popular ? "#fff" : "#189e33ff"}
                      size={18}
                      style={{ flexShrink: 0, marginTop: 2 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: popular ? "rgba(255,255,255,0.9)" : "#374151" }}
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

      {/* ── Employer footer info ── */}
      {!isApplicant && (
        <Box mt={6} maxWidth="800px" textAlign="center">
          <Typography variant="body2" sx={{ color: "#4b5563", mb: 1 }}>
            <strong>Free Trial:</strong> Employers who sign up get full access to Tier 1
            features for 30 days. No credit card required. After 30 days, upgrade to continue.
          </Typography>
          <Typography variant="body2" sx={{ color: "#4b5563", mb: 1 }}>
            <strong>Billing:</strong> Monthly or annual billing. Cancel before the next
            billing cycle to avoid charges.
          </Typography>
          <Typography variant="body2" sx={{ color: "#4b5563", mb: 1 }}>
            <strong>Annual Savings:</strong> Save 15% when you choose yearly billing.
            {IS_JUNE_PROMO_ACTIVE && " This June, save 20% on any plan."}
          </Typography>
          <Typography variant="body2" sx={{ color: "#4b5563" }}>
            <strong>Need Help?</strong> Contact our sales team for custom enterprise solutions.
          </Typography>
        </Box>
      )}

      {/* ── Applicant footer info ── */}
      {isApplicant && (
        <Box mt={6} maxWidth="800px" textAlign="center">
          <Typography variant="body2" sx={{ color: "#4b5563", mb: 1 }}>
            <strong>Freemium is truly free</strong> — no credit card, no expiry. Upgrade
            to Pro for career tools and priority support.
          </Typography>
          <Typography variant="body2" sx={{ color: "#4b5563" }}>
            <strong>Annual Savings:</strong> Save 15% when you choose yearly billing.
            {IS_JUNE_PROMO_ACTIVE && " This June, save 20% on any paid plan."}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
