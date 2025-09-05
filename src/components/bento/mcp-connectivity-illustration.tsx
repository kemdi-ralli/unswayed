"use client"

import React from "react"
import { Box, Card, Typography } from "@mui/material"

// Donut chart
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
        <linearGradient id="donutGrad" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#4caf50" />
          <stop offset="100%" stopColor="#0ea5b7" />
        </linearGradient>
      </defs>

      {/* Background ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth={stroke}
      />

      {/* Foreground ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke="url(#donutGrad)"
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
        style={{ fill: "var(--mui-palette-text-primary, #111827)" }}
      >
        {Math.round(value)}%
      </text>
      <text
        x="50%"
        y={(size / 2) + (size * 0.18)}
        textAnchor="middle"
        fontSize={10}
        fill="var(--mui-palette-text-secondary, #6b7280)" 
      >
        Qualified
      </text>
    </svg>
  )
}

// Sparkline
const Sparkline: React.FC<{ points: number[]; width?: number; height?: number }> = ({
  points,
  width = 180,
  height = 40,
}) => {
  if (!points.length) return null
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max === min ? 1 : max - min
  const stepX = width / (points.length - 1)

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        points={points
          .map((p, i) => {
            const x = i * stepX
            const y = height - ((p - min) / range) * height
            return `${x},${y}`
          })
          .join(" ")}
        fill="none"
        stroke="rgba(59,130,246,0.95)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const AnalyticsOverview: React.FC = () => {
  const metrics = {
    totalApplicants: 250,
    qualifiedPercent: 72,
    qualifiedCount: 180,
    interviewsScheduled: 18,
    pipelinePending: 60,
    recentTrend: [45, 50, 52, 60, 68, 72, 75],
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        marginTop: 5,
      }}
    >
      <Card
        sx={{
          width: 420,
          height: 340,
          bgcolor: "background.default",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          backdropFilter: "blur(12px)",
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          textAlign: "center",
        }}
        elevation={0}
      >

        <DonutChart value={metrics.qualifiedPercent} />

        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {metrics.qualifiedCount} / {metrics.totalApplicants} Qualified
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Interviews: {metrics.interviewsScheduled} • Pipeline: {metrics.pipelinePending}
        </Typography>

        <Sparkline points={metrics.recentTrend} />

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, maxWidth: 280 }}
        >
          Snapshot: Qualified rate is stable — refine screening filters to
          convert pending pipeline.
        </Typography>
      </Card>
    </Box>
  )
}

export default AnalyticsOverview
