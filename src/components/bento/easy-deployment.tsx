"use client"

import React from "react"
import { Box, Card, CardContent, Typography, Button, LinearProgress } from "@mui/material"

// Donut chart for match %
const DonutChart: React.FC<{ value: number; size?: number; stroke?: number }> = ({
  value,
  size = 120,
  stroke = 12,
}) => {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const normalized = Math.max(0, Math.min(100, value)) / 100
  const dashOffset = circumference * (1 - normalized)

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="evalGrad" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#4caf50" />
          <stop offset="100%" stopColor="#0ea5b7" />
        </linearGradient>
      </defs>

      {/* Background */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke="rgba(0,0,0,0.1)"
        strokeWidth={stroke}
      />

      {/* Progress */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke="url(#evalGrad)"
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />

      {/* Text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.22}
        fontWeight={700}
        style={{ fill: "#111827" }}
      >
        {Math.round(value)}%
      </text>
      <text
        x="50%"
        y={(size / 2) + (size * 0.18)}
        textAnchor="middle"
        fontSize={10}
        fill="#6b7280"
      >
        Match
      </text>
    </svg>
  )
}

interface EvaluationProps {
  width?: number | string
  height?: number | string
  className?: string
}

const CandidateEvaluation: React.FC<EvaluationProps> = ({
  width = "100%",
  height = "100%",
  className = "",
}) => {
  const metrics = {
    matchPercent: 82,
    shortlisted: 45,
    pendingReview: 28,
    interviews: 12,
  }

  return (
    <Box
      sx={{
        width,
        height,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background: "transparent",
      }}
      className={className}
      role="img"
      aria-label="Candidate evaluation analytics with insights"
    >
      {/* Main analytics panel */}
      <Card
        sx={{
          width: 360,
          height: 280,
          bgcolor: "background.default",
          borderRadius: 2,
          overflow: "hidden",
          backdropFilter: "blur(8px)",
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          gap: 2,
          textAlign: "center",
        }}
        elevation={0}
      >

        {/* Donut Chart */}
        <DonutChart value={metrics.matchPercent} />

        {/* Stats */}
        <Box sx={{ display: "flex", justifyContent: "space-between", width: "80%" }}>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {metrics.shortlisted}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Shortlisted
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {metrics.pendingReview}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Pending
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {metrics.interviews}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Interviews
            </Typography>
          </Box>
        </Box>

        {/* Progress bar (pipeline health) */}
        <Box sx={{ width: "80%", mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Pipeline Progress
          </Typography>
          <LinearProgress
            variant="determinate"
            value={metrics.matchPercent}
            sx={{ borderRadius: 1, height: 6, mt: 0.5 }}
          />
        </Box>

        {/* Action button */}
        <Button
          variant="contained"
          sx={{
            mt: 2,
            bgcolor: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            py: 1,
            fontWeight: 500,
            fontSize: 14,
            "&:hover": {
              bgcolor: "hsl(var(--primary) / 0.9)",
            },
          }}
        >
          Start Evaluation
        </Button>
      </Card>
    </Box>
  )
}

export default CandidateEvaluation
