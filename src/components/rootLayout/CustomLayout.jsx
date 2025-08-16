"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Cookie from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { CircularProgress, Box, Button, Typography } from "@mui/material";
import dynamic from "next/dynamic";

import EmployerNavbar from "../employer/employerNavbar/EmployerNavbar";
import Navbar from "../applicant/dashboard/Navbar";
import { EMPLOYER_NAVBAR_DATA } from "@/constant/employer/navbar";
import { NAVBAR_DATA } from "@/constant/applicant/navbar";
import Footer from "../applicant/dashboard/Footer";
import { FOOTER_DATA } from "@/constant/applicant/footer";

const CookieConsent = dynamic(() => import("react-cookie-consent"), {
  ssr: false,
});

export default function CustomLayout({ children }) {
  const pathname = usePathname();
  const { userData } = useSelector((state) => state?.auth);
  const userType = userData?.user?.type;
  const token = Cookie.get("token");
  const isVerified = Cookie.get("isVerified") === "true";

  const [hasAcceptedCookies, setHasAcceptedCookies] = useState(
    !!Cookie.get("ralliCookieConsent")
  );

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
      setTimeout(() => setIsLoading(false), 3000);
    }
  }, [isAuthenticated]);

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {!hiddenNavbarRoutes.includes(pathname) &&
        isAuthenticated &&
        (userType === "employer" ? (
          <EmployerNavbar data={EMPLOYER_NAVBAR_DATA} />
        ) : (
          <Navbar data={NAVBAR_DATA} />
        ))}

      <Box sx={{ flex: 1 }}>{children}</Box>

      {!hiddenNavbarRoutes.includes(pathname) && isAuthenticated && (
        <Footer data={FOOTER_DATA} />
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
            style={{ background: "#2B373B", color: "#ffffff" }}
            buttonStyle={{
              color: "#000",
              background: "#ffcc00",
              fontSize: "14px",
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
              <Button
                onClick={() => router.push("/manage-cookies")}
                sx={{
                  color: "#000",
                  background: "#b2b2b2",
                  fontSize: "10px",
                }}
              >
                Manage Preferences
              </Button>
            </Box>
          </CookieConsent>
        </Box>
      )}
    </Box>
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
