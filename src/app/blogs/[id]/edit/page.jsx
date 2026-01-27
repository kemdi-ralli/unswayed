"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import Cookie from "js-cookie";
import { useSelector } from "react-redux";
import Container from "@/components/common/Container";
import BlogForm from "@/components/blog/BlogForm";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { blogDetail } from "@/services/apiService/apiEndPoints";
import { Toast } from "@/components/Toast/Toast";

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const token = Cookie.get("token");
  const { userData } = useSelector((state) => state?.auth);
  const currentUserId = userData?.user?.id ?? null;
  const isAuthenticated = !!token && !!userData?.user;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !token) {
      router.replace(`/applicant/login?redirect=${encodeURIComponent(`/blogs/${id}/edit`)}`);
      return;
    }
  }, [token, id, router]);

  useEffect(() => {
    if (!id || !token) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setUnauthorized(false);
    apiInstance
      .get(blogDetail(id))
      .then((res) => {
        if (cancelled) return;
        const data = res?.data?.data;
        const b = data?.blog ?? data;
        if (!b) {
          setError("Blog not found.");
          setBlog(null);
          return;
        }
        const ownerId = b.user_id ?? b.user?.id;
        const isOwner =
          currentUserId != null && String(ownerId) === String(currentUserId);
        if (!isOwner) {
          setUnauthorized(true);
          setBlog(null);
          return;
        }
        setBlog(b);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err?.response?.status === 404) {
          setError("Blog not found.");
        } else if (err?.response?.status === 403) {
          setUnauthorized(true);
        } else {
          setError(
            err?.response?.data?.message || err?.message || "Failed to load blog."
          );
        }
        setBlog(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id, token, currentUserId]);

  const handleSuccess = () => {
    router.push(`/blogs/${id}`);
  };

  const handleCancel = () => {
    router.push(`/blogs/${id}`);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 12, gap: 2 }}>
          <CircularProgress color="primary" size={44} />
          <Typography sx={{ color: "text.secondary", fontSize: "14px", fontWeight: 500 }}>Loading…</Typography>
        </Box>
      </Container>
    );
  }

  if (unauthorized) {
    return (
      <Container>
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 2,
            borderRadius: "12px",
            border: "1px solid #fecaca",
            bgcolor: "#fef2f2",
          }}
        >
          <Typography sx={{ color: "#b91c1c", mb: 2, fontWeight: 600 }}>
            You can only edit your own blog.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => router.push(`/blogs/${id}`)}
            sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
          >
            Back to blog
          </Button>
        </Box>
      </Container>
    );
  }

  if (error && !blog) {
    return (
      <Container>
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 2,
            borderRadius: "12px",
            border: "1px solid #fecaca",
            bgcolor: "#fef2f2",
          }}
        >
          <Typography sx={{ color: "#b91c1c", mb: 2, fontWeight: 600 }}>{error}</Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => router.push("/blogs")}
            sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
          >
            Back to blogs
          </Button>
        </Box>
      </Container>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <BlogForm
      initialData={blog}
      blogId={id}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
};

export default Page;
