"use client";
/**
 * Chatboot.jsx — Legacy stub. Replaced by the Lexi AI assistant.
 *
 * This component now simply redirects to /assistant so that any existing
 * route or deep-link that pointed here continues to work.
 */
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";

const Chatboot = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/assistant");
  }, [router]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
      }}
    >
      <CircularProgress size={48} sx={{ color: "#00305B" }} />
    </Box>
  );
};

export default Chatboot;
