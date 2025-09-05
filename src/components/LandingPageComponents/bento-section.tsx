import AiCodeReviews from "../bento/ai-code-reviews"
import RealtimeCodingPreviews from "../bento/real-time-previews"
import OneClickIntegrationsIllustration from "../bento/one-click-integrations-illustration"
import MCPConnectivityIllustration from "../bento/mcp-connectivity-illustration"
import EasyDeployment from "../bento/easy-deployment"
import ParallelCodingAgents from "../bento/parallel-agents"
import { Box, Typography } from "@mui/material"
import AnalyticsIntegration from "../bento/mcp-connectivity-illustration"
import CandidateEvaluation from "../bento/easy-deployment"
import ResumeAssistant from "../bento/parallel-agents"

type BentoCardProps = {
  title: string
  description: string
  Component: React.ComponentType
}

const BentoCard = ({ title, description, Component }: BentoCardProps) => (
  <Box
    sx={{
      overflow: "hidden",
      borderRadius: "16px", // rounded-2xl
      border: "1px solid rgba(58, 237, 148, 0.2)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      position: "relative",
    }}
  >
    {/* Background with blur */}
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        borderRadius: "16px",
        background: "rgba(63, 203, 131, 0.08)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    />
    {/* Subtle gradient overlay */}
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        borderRadius: "16px",
        background: "linear-gradient(to bottom right, rgba(255,255,255,0.05), transparent)",
      }}
    />

    <Box
      sx={{
        width: "100%",
        p: 3, // p-6
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 2,
        position: "relative",
        zIndex: 10,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
        <Typography
          sx={{
            width: "100%",
            color: "text.primary",
            fontSize: "1.125rem", // text-lg
            fontWeight: 400,
            lineHeight: "1.75rem", // leading-7
          }}
        >
          {title}
          <br />
          <Typography component="span" sx={{ color: "text.secondary" }}>
            {description}
          </Typography>
        </Typography>
      </Box>
    </Box>

    <Box
      sx={{
        width: "100%",
        height: "18rem", // h-72
        position: "relative",
        mt: "-2px", // -mt-0.5
        zIndex: 10,
      }}
    >
      <Component />
    </Box>
  </Box>
)

export function BentoSection() {
  const cards = [
    {
      title: "AI-Driven Talent Matching",
      description: "Advanced algorithms evaluate and align candidates with job requirements for precise matching.",
      Component: AiCodeReviews,
    },
    {
      title: "Bias-Free Recruitment",
      description: "Anonymized candidate information focuses solely on credentials for fair hiring practices.",
      Component: RealtimeCodingPreviews,
    },
    {
      title: "Global Talent Network",
      description: "Connect with qualified candidates worldwide and expand your talent pool.",
      Component: OneClickIntegrationsIllustration,
    },
    {
      title: "Data Analytics Integration",
      description: "Track qualifications and application progress with robust analytics insights.",
      Component: AnalyticsIntegration,
    },
    {
      title: "Free Resume Assistance",
      description: "AI-powered resume writing tools and success toolkits for job seekers.",
      Component: ResumeAssistant,
    },
    {
      title: "Efficient Candidate Evaluation",
      description: "Quickly assess experience against job requirements and streamline selection.",
      Component: CandidateEvaluation,
    },
  ]

  return (
    <Box
      component="section"
      sx={{
        px: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "visible",
        bgcolor: "transparent",
        marginTop:40,
      }}
    >
      <Box
        sx={{
          width: "100%",
          py: { xs: 8, md: 16 },
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          gap: 6,
        }}
      >
        {/* Background glow */}
        <Box
          sx={{
            width: "547px",
            height: "938px",
            position: "absolute",
            top: "614px",
            left: "80px",
            transformOrigin: "top left",
            transform: "rotate(-33.39deg)",
            backgroundColor: "rgba(0, 122, 255, 0.1)", // bg-primary/10
            filter: "blur(130px)",
            zIndex: 0,
          }}
        />

        {/* Heading + description */}
        <Box
          sx={{
            width: "100%",
            py: { xs: 8, md: 14 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            zIndex: 10,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <Typography
              component="h2"
              sx={{
                width: "100%",
                maxWidth: "655px",
                textAlign: "center",
                color: "text.primary",
                fontSize: { xs: "2.25rem", md: "3.75rem" }, // text-4xl md:text-6xl
                fontWeight: 600,
                lineHeight: { xs: "1.2", md: "66px" },
                textWrap: "balance",
              }}
            >
              Revolutionize Your Hiring Process
            </Typography>
            <Typography
              sx={{
                width: "100%",
                maxWidth: "600px",
                textAlign: "center",
                color: "text.secondary",
                fontSize: { xs: "1.125rem", md: "1.25rem" }, // text-lg md:text-xl
                fontWeight: 500,
                lineHeight: 1.75,
                textWrap: "pretty",
              }}
            >
              Experience the power of AI-driven recruitment that ensures fair, efficient, and precise talent matching for
              both employers and job seekers.
            </Typography>
          </Box>
        </Box>

        {/* Grid of cards */}
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" },
            gap: 6,
            zIndex: 10,
          }}
        >
          {cards.map((card) => (
            <BentoCard key={card.title} {...card} />
          ))}
        </Box>
      </Box>
    </Box>
  )
}
