"use client";

import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import dayjs from "dayjs";

const BlogCard = ({ blog, onClick }) => {
  const title = blog?.title || "Untitled";
  const shortDesc =
    blog?.short_description ||
    blog?.description ||
    blog?.full_article ||
    "";
  const thumbnail = blog?.thumbnail || null;
  const category = blog?.category || null;
  const views = blog?.views ?? 0;
  const createdAt = blog?.created_at
    ? dayjs(blog.created_at).format("MMM D, YYYY")
    : "";

  return (
    <Card
      onClick={() => onClick?.(blog?.id)}
      elevation={0}
      sx={{
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        bgcolor: "#fff",
        transition: "box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
        "&:hover": {
          boxShadow: "0 10px 40px -12px rgba(24, 158, 51, 0.2), 0 0 0 1px rgba(24, 158, 51, 0.2)",
          borderColor: "primary.main",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          pt: "52%",
          bgcolor: "#f1f5f9",
          overflow: "hidden",
        }}
      >
        {thumbnail ? (
          <Box
            component="img"
            src={thumbnail}
            alt={title}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease",
              "&:hover": { transform: "scale(1.03)" },
            }}
          />
        ) : (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#e2e8f0",
            }}
          >
            <Typography sx={{ color: "#94a3b8", fontSize: "13px", fontWeight: 500 }}>
              No image
            </Typography>
          </Box>
        )}
        {category && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              px: 1.5,
              py: 0.5,
              borderRadius: "6px",
              bgcolor: "rgba(15, 23, 42, 0.85)",
              backdropFilter: "blur(6px)",
            }}
          >
            <Typography sx={{ fontSize: "11px", color: "#f8fafc", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {category}
            </Typography>
          </Box>
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1, py: 2.5, px: 2.5 }}>
        <Typography
          component="h3"
          sx={{
            fontSize: { xs: "16px", md: "17px" },
            fontWeight: 700,
            color: "text.primary",
            lineHeight: 1.35,
            mb: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </Typography>
        {shortDesc && (
          <Typography
            sx={{
              fontSize: "14px",
              color: "#475569",
              lineHeight: 1.55,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {shortDesc.replace(/<[^>]*>/g, "").slice(0, 120)}
            {(shortDesc.replace(/<[^>]*>/g, "").length > 120) ? "…" : ""}
          </Typography>
        )}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mt: 1.5,
            flexWrap: "wrap",
            pt: 1,
            borderTop: "1px solid #f1f5f9",
          }}
        >
          {createdAt && (
            <Typography sx={{ fontSize: "12px", color: "text.secondary", fontWeight: 500 }}>
              {createdAt}
            </Typography>
          )}
          {views > 0 && (
            <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
              {views} view{views !== 1 ? "s" : ""}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
