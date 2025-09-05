"use client"

import Image from "next/image"
import { Box, Typography, Grid, Card, CardContent, Avatar } from "@mui/material"

const testimonials = [
  {
    quote:
      "Unswayed streamlined our hiring pipeline. Instead of spending weeks screening applicants manually, the AI filtering ensured that only candidates with the right professional fit moved forward.",
    name: "Annette Black",
    company: "Sony",
    avatar: "/images/avatars/annette-black.png",
    type: "large-teal",
  },
  {
    quote:
      "We’ve seen a huge improvement in fairness during recruitment. Unswayed makes it impossible for unconscious bias to interfere — only merit and credentials matter.",
    name: "Dianne Russell",
    company: "McDonald's",
    avatar: "/images/avatars/dianne-russell.png",
    type: "small-dark",
  },
  {
    quote:
      "The platform’s business intelligence insights helped us identify gaps in our workforce and make smarter hiring decisions. It’s more than a recruitment tool — it’s strategy.",
    name: "Cameron Williamson",
    company: "IBM",
    avatar: "/images/avatars/cameron-williamson.png",
    type: "small-dark",
  },
  {
    quote:
      "With Unswayed, candidates receive the same opportunity to showcase their skills. This levels the playing field in ways we’ve never experienced with traditional systems.",
    name: "Robert Fox",
    company: "MasterCard",
    avatar: "/images/avatars/robert-fox.png",
    type: "small-dark",
  },
  {
    quote:
      "The transition was seamless. Within days, our HR team was working with precise talent matches and our time-to-hire dropped by over 40%.",
    name: "Darlene Robertson",
    company: "Ferrari",
    avatar: "/images/avatars/darlene-robertson.png",
    type: "small-dark",
  },
  {
    quote:
      "By focusing on merit-based criteria, Unswayed gave us access to diverse talent we might have otherwise overlooked. It’s changed how we think about recruitment.",
    name: "Cody Fisher",
    company: "Apple",
    avatar: "/images/avatars/cody-fisher.png",
    type: "small-dark",
  },
  {
    quote:
      "The AI-driven candidate matching has saved us countless hours. We now spend less time screening and more time engaging with the best talent for the role.",
    name: "Albert Flores",
    company: "Louis Vuitton",
    avatar: "/images/avatars/albert-flores.png",
    type: "large-light",
  },
]

type TestimonialCardProps = {
  quote: string
  name: string
  company: string
  avatar: string
  type: string
}

const TestimonialCard = ({ quote, name, company, avatar, type }: TestimonialCardProps) => {
  const isLargeCard = type.startsWith("large")
  const cardBgColor =
    type === "large-teal"
      ? "#0d9488"
      : type === "large-light"
      ? "rgba(231,236,235,0.12)"
      : "#fff"
  const quoteColor = type === "large-teal" ? "#fff" : "#000"
  const companyColor = type === "large-teal" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)"

  return (
    <Card
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: isLargeCard ? 3 : 2.5,
        height: isLargeCard ? 502 : 244,
        maxWidth: 384,
        backgroundColor: cardBgColor,
        overflow: "hidden",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.08)",
      }}
    >
      {isLargeCard && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/images/large-card-background.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: type === "large-light" ? 0.2 : 1,
            zIndex: 0,
          }}
        />
      )}

      <CardContent sx={{ position: "relative", zIndex: 10, padding: 0 }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            fontSize: isLargeCard ? 20 : 17,
            lineHeight: isLargeCard ? "32px" : "24px",
            color: quoteColor,
            mb: 2,
          }}
        >
          {quote}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            src={avatar}
            alt={`${name} avatar`}
            sx={{
              width: isLargeCard ? 48 : 36,
              height: isLargeCard ? 48 : 36,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{ fontSize: isLargeCard ? 16 : 14, color: quoteColor }}
            >
              {name}
            </Typography>
            <Typography
              sx={{ fontSize: isLargeCard ? 16 : 14, color: companyColor }}
            >
              {company}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export function TestimonialGridSection() {
  return (
    <Box sx={{ px: 3, py: 6 }}>
      {/* Section header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          pb: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 600, textAlign: "center", lineHeight: 1.25 }}
        >
          Employment. Reimagined.
        </Typography>
        <Typography
          variant="body2"
          sx={{ textAlign: "center", maxWidth: 800 }}
        >
          Unswayed is RALLi Technologies’ employment platform that combines
          best-in-class features to ensure precise talent matching. We deliver
          business intelligence and AI-driven filtering systems to guarantee
          candidates are evaluated solely on their credentials and fit —
          creating a fair, merit-based hiring process.
        </Typography>
      </Box>

      {/* Testimonials Grid */}
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={4} container direction="column" spacing={3}>
          <Grid item>
            <TestimonialCard {...testimonials[0]} />
          </Grid>
          <Grid item>
            <TestimonialCard {...testimonials[1]} />
          </Grid>
        </Grid>

        <Grid item xs={12} md={4} container direction="column" spacing={3}>
          <Grid item>
            <TestimonialCard {...testimonials[2]} />
          </Grid>
          <Grid item>
            <TestimonialCard {...testimonials[3]} />
          </Grid>
          <Grid item>
            <TestimonialCard {...testimonials[4]} />
          </Grid>
        </Grid>

        <Grid item xs={12} md={4} container direction="column" spacing={3}>
          <Grid item>
            <TestimonialCard {...testimonials[5]} />
          </Grid>
          <Grid item>
            <TestimonialCard {...testimonials[6]} />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}
