"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Cookie from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { CircularProgress, Box, Button, Typography } from "@mui/material";
import dynamic from "next/dynamic";

import { EMPLOYER_NAVBAR_DATA } from "@/constant/employer/navbar";
import { NAVBAR_DATA } from "@/constant/applicant/navbar";
import { FOOTER_DATA } from "@/constant/applicant/footer";

const EmployerNavbar = dynamic(() => import("../employer/employerNavbar/EmployerNavbar"), { ssr: true });
const Navbar = dynamic(() => import("../applicant/dashboard/Navbar"), { ssr: true });
const Footer = dynamic(() => import("../applicant/dashboard/Footer"), { ssr: true });
import Link from "next/link";
import SubscriptionBlockerModal from "../Modal/SubscriptionBlockerModal";
import SubscriptionWarningModal from "../Modal/SubscriptionWarningModal";
import DeactivatedAccountModal from "../Modal/DeactivatedAccountModal";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { LexiProvider, useLexi } from "@/components/Lexi/LexiContext";
import LexiWidget from "@/components/Lexi/LexiWidget";

const CookieConsent = dynamic(() => import("react-cookie-consent"), {
  ssr: false,
});

// Inner helper: clears Lexi session whenever auth token disappears (logout)
function LexiLogoutEffect({ token }) {
  const { clearSessionOnLogout } = useLexi();
  const prevTokenRef = useRef(token);

  useEffect(() => {
    if (prevTokenRef.current && !token) {
      clearSessionOnLogout();
    }
    prevTokenRef.current = token;
  }, [token, clearSessionOnLogout]);

  return null;
}

export default function CustomLayout({ children }) {
  const pathname = usePathname();
  const { userData } = useSelector((state) => state?.auth);
  const token = Cookie.get("token");
  const userTypeFromCookie = Cookie.get("userType");
  const userType = userData?.user?.type ?? userTypeFromCookie;
  const isVerified = Cookie.get("isVerified") === "true";

  const [hasAcceptedCookies, setHasAcceptedCookies] = useState(
    !!Cookie.get("ralliCookieConsent")
  );

  const [showSubscriptionBlocker, setShowSubscriptionBlocker] = useState(false);
  const [showSubscriptionWarning, setShowSubscriptionWarning] = useState(false);
  const [subscriptionDaysRemaining, setSubscriptionDaysRemaining] = useState(null);
  const [subscriptionChecked, setSubscriptionChecked] = useState(false);
  const [showDeactivatedModal, setShowDeactivatedModal] = useState(false);
  const [deactivatedAt, setDeactivatedAt] = useState(null);
  const [accountChecked, setAccountChecked] = useState(false);

  const router = useRouter();

  const isAuthenticated = token && isVerified && userType;

  const hiddenNavbarRoutes = [
    "/",
    "/applicant/login",
    "/applicant/form",
    "/applicant/form/emailVerification",
    "/employer/login",
    "/employer/form",
    "/employer/form/emailVerification",
  ];

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [isAuthenticated]);

  // Check for deactivated account (applies to all user types)
  useEffect(() => {
    const checkAccountDeactivation = () => {
      // Only check for authenticated users
      if (!isAuthenticated || accountChecked) {
        return;
      }

      // Don't block on login/registration pages
      const allowedPaths = [
        "/applicant/login",
        "/applicant/form",
        "/applicant/form/emailVerification",
        "/employer/login",
        "/employer/form",
        "/employer/form/emailVerification",
      ];

      if (allowedPaths.some((path) => pathname.startsWith(path))) {
        return;
      }

      // Check if user has deactivated_at timestamp
      const userDeactivatedAt = userData?.user?.deactivated_at;

      if (userDeactivatedAt) {
        // Account is deactivated
        setDeactivatedAt(userDeactivatedAt);
        setShowDeactivatedModal(true);
      }

      setAccountChecked(true);
    };

    checkAccountDeactivation();
  }, [isAuthenticated, userData, pathname, accountChecked]);

  // Check employer subscription status (only if account is NOT deactivated)
  useEffect(() => {
    const checkEmployerSubscription = async () => {
      // Only check for authenticated employers who are NOT deactivated
      if (!isAuthenticated || userType !== "employer" || subscriptionChecked || showDeactivatedModal) {
        return;
      }

      // Don't block on billing pages or login/registration pages
      const allowedPaths = [
        "/billing",
        "/billing/success",
        "/employer/login",
        "/employer/form",
        "/employer/form/emailVerification",
      ];

      if (allowedPaths.some((path) => pathname.startsWith(path))) {
        return;
      }

      try {
        // Fetch subscription info
        const response = await apiInstance.get("/subscriptions/current");
        
        if (response?.data?.status === "success") {
          const subscriptionInfo = response.data.data;
          
          const daysRemaining = subscriptionInfo?.days_remaining ?? null;

          // Trial expired: explicitly on trial AND days exhausted
          const trialExpired =
            subscriptionInfo?.is_on_trial === true &&
            typeof daysRemaining === "number" &&
            daysRemaining <= 0;

          // Subscription expired: NOT on an active sub AND NOT on trial
          // Use strict === false to avoid false-positive when API returns null
          const subscriptionExpired =
            subscriptionInfo?.has_active_subscription === false &&
            subscriptionInfo?.is_on_trial === false;

          // 3-day warning: trial still active but expiring soon
          const trialExpiringSoon =
            subscriptionInfo?.is_on_trial === true &&
            typeof daysRemaining === "number" &&
            daysRemaining > 0 &&
            daysRemaining <= 3;

          if (trialExpired || subscriptionExpired) {
            setShowSubscriptionBlocker(true);
          } else if (trialExpiringSoon) {
            setSubscriptionDaysRemaining(daysRemaining);
            setShowSubscriptionWarning(true);
          }
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
        
        // Fallback: Check from userData if available
        const userSubscription = userData?.user?.subscription;
        const userPlan = userData?.user?.subscription_plan;
        
        if (userSubscription || userPlan) {
          const trialExpired =
            userSubscription?.is_on_trial &&
            userSubscription?.days_remaining <= 0;

          const subscriptionExpired =
            userSubscription?.has_active_subscription === false &&
            userSubscription?.is_on_trial === false;

          if (trialExpired || subscriptionExpired) {
            setShowSubscriptionBlocker(true);
          }
        }
      } finally {
        setSubscriptionChecked(true);
      }
    };

    checkEmployerSubscription();
  }, [isAuthenticated, userType, pathname, subscriptionChecked, userData, showDeactivatedModal]);

  const handleAcceptCookies = () => {
    Cookie.set("ralliCookieConsent", "true", { expires: 365 });
    setHasAcceptedCookies(true);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <LexiProvider>
      <LexiLogoutEffect token={token} />
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Deactivated Account Modal (Priority - Shows for ALL user types) */}
      {showDeactivatedModal && (
        <DeactivatedAccountModal 
          open={showDeactivatedModal} 
          userType={userType}
          deactivatedAt={deactivatedAt}
        />
      )}

      {/* Subscription Blocker Modal for Employers (Only if NOT deactivated) */}
      {!showDeactivatedModal && showSubscriptionBlocker && userType === "employer" && (
        <SubscriptionBlockerModal open={showSubscriptionBlocker} userType={userType} />
      )}

      {/* Subscription Warning Modal — trial expiring within 3 days (dismissible) */}
      {!showDeactivatedModal && !showSubscriptionBlocker && showSubscriptionWarning && userType === "employer" && (
        <SubscriptionWarningModal
          open={showSubscriptionWarning}
          daysRemaining={subscriptionDaysRemaining}
          onClose={() => setShowSubscriptionWarning(false)}
        />
      )}

      {!hiddenNavbarRoutes.includes(pathname) &&
        (userType === "employer" ? (
          <EmployerNavbar data={EMPLOYER_NAVBAR_DATA} />
        ) : (
          <Navbar data={NAVBAR_DATA} />
        ))}

      <Box sx={{ flex: 1 }}>{children}</Box>

      {!hiddenNavbarRoutes.includes(pathname) && (
        <Footer data={FOOTER_DATA} />
      )}

      {/* Lexi AI widget — visible on all authenticated pages */}
      {isAuthenticated && !hiddenNavbarRoutes.includes(pathname) && (
        <LexiWidget />
      )}

      {!hasAcceptedCookies && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
            display: "flex",
            justifyContent: "between",
          }}
        >
          <CookieConsent
            location="bottom"
            buttonText="Accept"
            cookieName="ralliCookieConsent"
            style={{
              background: "#0f172a",
              color: "#ffffff",
              borderTopRightRadius: 8,
              borderTopLeftRadius: 8,
              padding: "20px 20px",
            }}
            buttonStyle={{
              color: "#ffffff",
              background: "#189e33ff",
              fontSize: "14px",
              borderRadius: 8,
              padding: "10px 20px",
            }}
            declineButtonStyle={{
              color: "#ffffff",
              background: "none",
              fontSize: "14px",
              borderRadius: 8,
              padding: "10px 20px",
              border: "1px solid #ffffff",
            }}
            expires={365}
            onAccept={handleAcceptCookies}
            enableDeclineButton
            flipButtons
            extraCookieOptions={{ domain: window.location.hostname }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <Typography sx={{ fontSize: "12px" }}>
                We use cookies to enhance your experience, analyze site traffic,
                personalize content. You can manage your preferences anytime.
              </Typography>
              <Link
                href="/manage-cookies"
                sx={{
                  color: "#ffffff",
                  fontSize: "10px",
                }}
              >
                Manage Preferences
              </Link>
            </Box>
          </CookieConsent>
        </Box>
      )}
    </Box>
    </LexiProvider>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import Cookie from "js-cookie";
// import { usePathname } from "next/navigation";
// import { CircularProgress, Box, Typography, Button } from "@mui/material";
// import dynamic from "next/dynamic";

// import EmployerNavbar from "../employer/employerNavbar/EmployerNavbar";
// import Navbar from "../applicant/dashboard/Navbar";
// import { EMPLOYER_NAVBAR_DATA } from "@/constant/employer/navbar";
// import { NAVBAR_DATA } from "@/constant/applicant/navbar";
// import TermsOfUseModal from "../common/tremsAndConditionModal/TremsOfUseModal";

// const CookieConsent = dynamic(() => import("react-cookie-consent"), { ssr: false });
// export default function CustomLayout({ children }) {
//   const pathname = usePathname();
//   const { userData } = useSelector((state) => state?.auth);
//   const userType = userData?.user?.type;
//   const token = Cookie.get("token");
//   const isVerified = Cookie.get("isVerified") === "true";

//   const isAuthenticated = token && isVerified && userType;
//   const hiddenNavbarRoutes = [
//     "/",
//     "/applicant/login",
//     "/applicant/form",
//     "/applicant/form/emailVerification",
//     "/employer/login",
//     "/employer/form",
//     "/employer/form/emailVerification"
//   ];
//   const [openTermsModal, setOpenTermsModal] = useState(true);

//   const [agreeTerms, setAgreeTerms] = useState(false);
//   const handleCloseTermsModal = () => {
//     setOpenTermsModal(false);
//   };
//   const handleAgree = () => {
//     setAgreeTerms(false);
//     handleCloseTermsModal();
//     Cookie.set("ralliCookieConsent", "true", { expires: 150 });
//     setCookiesAccepted("true");
//   };

//   const [cookiesAccepted, setCookiesAccepted] = useState(
//     Cookie.get("ralliCookieConsent") || null
//   );
//   if (cookiesAccepted === null) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           width: "100vw",
//           textAlign: "center",
//           backgroundColor: "#2B373B",
//           color: "#ffffff"
//         }}
//       >
//         <Typography variant="h6" sx={{ mb: 2 }}>
//           This website uses cookies to improve your experience.
//         </Typography>
//         {/* <TermsOfUseModal
//           open={openTermsModal}
//           handleAgree={handleAgree} /> */}
//         <Button
//           variant="contained"
//           color="warning"
//           onClick={() => {
//             Cookie.set("ralliCookieConsent", "true", { expires: 150 });
//             setCookiesAccepted("true");
//           }}
//         >
//           Accept Cookies
//         </Button>
//         <Button
//           variant="contained"
//           color="error"
//           sx={{ mt: 2 }}
//           onClick={() => {
//             Cookie.set("ralliCookieConsent", "false", { expires: 150 });
//             setCookiesAccepted("false");
//           }}
//         >
//           Decline
//         </Button>
//       </Box>
//     );
//   }

//   // 🚨 Block access if cookies are declined
//   if (cookiesAccepted === "false") {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           width: "100vw",
//           textAlign: "center",
//           backgroundColor: "#2B373B",
//           color: "#ffffff"
//         }}
//       >
//         <Typography variant="h5" sx={{ mb: 2 }}>
//           You must accept cookies to use this website.
//         </Typography>
//         <Button
//           variant="contained"
//           color="warning"
//           onClick={() => {
//             Cookie.set("ralliCookieConsent", "true", { expires: 150 });
//             setCookiesAccepted("true");
//           }}
//         >
//           Accept Cookies & Continue
//         </Button>
//       </Box>
//     );
//   }

//   return (
//     <>
//       {!hiddenNavbarRoutes.includes(pathname) && isAuthenticated && (
//         userType === "employer" ? (
//           <EmployerNavbar data={EMPLOYER_NAVBAR_DATA} />
//         ) : (
//           <Navbar data={NAVBAR_DATA} />
//         )
//       )}

//       {children}
//       <CookieConsent
//         location="bottom"
//         buttonText="Accept"
//         declineButtonText="Decline"
//         enableDeclineButton
//         cookieName="ralliCookieConsent"
//         style={{ background: "#2B373B", color: "#ffffff" }}
//         buttonStyle={{ color: "#000", background: "#ffcc00", fontSize: "14px" }}
//         declineButtonStyle={{ color: "#ffffff", background: "#ff0000", fontSize: "14px" }}
//         expires={150}
//         onAccept={() => {
//           Cookie.set("ralliCookieConsent", "true", { expires: 150 });
//           setCookiesAccepted("true");
//         }}
//         onDecline={() => {
//           Cookie.set("ralliCookieConsent", "false", { expires: 150 });
//           setCookiesAccepted("false");
//         }}
//       >
//         We use cookies to enhance your experience.{" "}
//         <a href="/cookie-policy" style={{ color: "#ffcc00", textDecoration: "underline" }}>
//           Learn more
//         </a>
//       </CookieConsent>
//     </>
//   );
// }
