"use client"

import { useState } from "react"
import { Box, Typography } from "@mui/material"
import { ChevronDown } from "lucide-react"

const faqData = [
  {
    question: "What is Unswayed and who is it for?",
    answer:
      "Unswayed is RALLi Technologies' AI-driven employment platform designed for candidates, recruiters, and organizations seeking precise talent matching. It ensures equal interview and hiring opportunities based on skills, qualifications, and profession fit.",
  },
  {
    question: "How does Unswayed ensure fair candidate evaluation?",
    answer:
      "Our platform uses advanced AI software and a filtering system that assesses credentials objectively, removing biases and prioritizing merit. This guarantees that all candidates are evaluated solely on their skills and professional fit.",
  },
  {
    question: "Can Unswayed integrate with my HR or recruitment tools?",
    answer:
      "Yes! Unswayed offers seamless integrations with popular HR and recruitment systems, allowing teams to manage applications, interviews, and analytics efficiently without disrupting existing workflows.",
  },
  {
    question: "What features are included in the Free plan?",
    answer:
      "The Free plan provides access to basic candidate profiles, job matching opportunities, credential analysis, and notifications for interviews. It's ideal for individuals just starting to explore career opportunities with Unswayed.",
  },
  {
    question: "How does the AI-driven matching system work?",
    answer:
      "Our AI analyzes candidate profiles and job requirements, matching them based on qualifications, profession fit, and merit. This ensures that the most suitable candidates are highlighted for each opportunity, optimizing hiring efficiency.",
  },
  {
    question: "Is candidate data secure on Unswayed?",
    answer:
      "Absolutely. Unswayed implements enterprise-grade security measures including encryption, secure data handling, and compliance with industry standards. Candidate data is protected at every stage, ensuring privacy and confidentiality.",
  },
]

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

const FAQItem = ({ question, answer, isOpen, onToggle }: FAQItemProps) => (
  <Box
    onClick={onToggle}
    sx={{
      width: "100%",
      backgroundColor: "rgba(231,236,235,0.08)",
      boxShadow: "0px 2px 4px rgba(0,0,0,0.16)",
      borderRadius: "10px",
      outline: "1px solid hsl(var(--border))",
      outlineOffset: "-1px",
      cursor: "pointer",
      transition: "all 0.5s ease-out",
      overflow: "hidden",
    }}
  >
    {/* Header */}
    <Box
      sx={{
        px: "20px",
        py: "18px",
        pr: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        transition: "all 0.3s ease-out",
      }}
    >
      <Typography
        sx={{
          flex: 1,
          color: "hsl(var(--foreground))",
          fontSize: "1rem",
          fontWeight: 500,
          lineHeight: "24px",
          wordBreak: "break-word",
        }}
      >
        {question}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ChevronDown
          style={{
            width: "24px",
            height: "24px",
            color: "hsl(var(--muted-foreground-dark))",
            transition: "all 0.5s ease-out",
            transform: isOpen ? "rotate(180deg) scale(1.1)" : "rotate(0deg) scale(1)",
          }}
        />
      </Box>
    </Box>

    {/* Collapsible Answer */}
    <Box
      sx={{
        overflow: "hidden",
        maxHeight: isOpen ? "500px" : 0,
        opacity: isOpen ? 1 : 0,
        transition:
          "max-height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s cubic-bezier(0.4,0,0.2,1), padding 0.5s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <Box
        sx={{
          px: "20px",
          pb: isOpen ? "18px" : 0,
          pt: isOpen ? "8px" : 0,
          transform: isOpen ? "translateY(0)" : "translateY(-8px)",
          transition: "all 0.5s ease-out",
        }}
      >
        <Typography
          sx={{
            color: "hsl(var(--foreground) / 0.8)",
            fontSize: "0.875rem",
            fontWeight: 400,
            lineHeight: "24px",
            wordBreak: "break-word",
          }}
        >
          {answer}
        </Typography>
      </Box>
    </Box>
  </Box>
)

export function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) newOpenItems.delete(index)
    else newOpenItems.add(index)
    setOpenItems(newOpenItems)
  }

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        pt: "66px",
        pb: { xs: "80px", md: "160px" },
        px: "20px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Background glow */}
      <Box
        sx={{
          width: "300px",
          height: "500px",
          position: "absolute",
          top: "150px",
          left: "50%",
          transform: "translateX(-50%) rotate(-33.39deg)",
          backgroundColor: "hsl(var(--primary) / 0.1)",
          filter: "blur(100px)",
          zIndex: 0,
        }}
      />

      {/* Heading */}
      <Box
        sx={{
          py: { xs: "32px", md: "56px" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          position: "relative",
          zIndex: 10,
          textAlign: "center",
        }}
      >
        <Typography
          component="h2"
          sx={{
            maxWidth: "435px",
            fontSize: "2.25rem",
            fontWeight: 600,
            lineHeight: "40px",
            color: "hsl(var(--foreground))",
          }}
        >
          Frequently Asked Questions
        </Typography>
        <Typography
          sx={{
            maxWidth: "600px",
            fontSize: "0.875rem",
            fontWeight: 500,
            lineHeight: "18.2px",
            color: "hsl(var(--muted-foreground))",
          }}
        >
          Learn how Unswayed ensures fair, merit-based talent matching and empowers both candidates and hiring teams.
        </Typography>
      </Box>

      {/* FAQ Items */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "600px",
          pb: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          position: "relative",
          zIndex: 10,
        }}
      >
        {faqData.map((faq, index) => (
          <FAQItem key={index} {...faq} isOpen={openItems.has(index)} onToggle={() => toggleItem(index)} />
        ))}
      </Box>
    </Box>
  )
}
