"use client";

import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import Container from "@/components/common/Container";
import BlogCard from "@/components/blog/BlogCard";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { BLOGS } from "@/services/apiService/apiEndPoints";
import { Toast } from "@/components/Toast/Toast";
import { useSelector } from "react-redux";
import Cookie from "js-cookie";

const Page = () => {
  const router = useRouter();
  const { userData } = useSelector((state) => state?.auth);
  const token = Cookie.get("token");
  const isAuthenticated = !!token && !!userData?.user;

  const [blogs, setBlogs] = useState([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const fetchBlogs = async (page = 1, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await apiInstance.get(BLOGS, {
        params: { page, limit: 10 },
      });
      const data = res?.data?.data;
      const status = res?.data?.status;
      if (status === "error") {
        setError(res?.data?.message || "Failed to load blogs.");
        if (!append) setBlogs([]);
        return;
      }
      const list = data?.blogs ?? [];
      const metaData = data?.meta ?? {};
      if (append) {
        setBlogs((prev) => [...prev, ...list]);
      } else {
        setBlogs(list);
      }
      setMeta({
        current_page: metaData.current_page ?? page,
        last_page: metaData.last_page ?? 1,
        per_page: metaData.per_page ?? 10,
        total: metaData.total ?? 0,
      });
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to load blogs.";
      setError(msg);
      Toast("error", msg);
      if (!append) setBlogs([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchBlogs(1);
  }, []);

  const handleLoadMore = () => {
    if (meta.current_page < meta.last_page && !loadingMore) {
      fetchBlogs(meta.current_page + 1, true);
    }
  };

  const handleCardClick = (id) => {
    router.push(`/blogs/${id}`);
  };

  const hasMore = meta.current_page < meta.last_page;

  return (
    <Container>
      <Box
        sx={{
          background: "linear-gradient(135deg, #001C63 0%, #001a50 50%, #001C63 100%)",
          borderRadius: "12px",
          px: 3,
          py: 3.5,
          mb: 4,
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography
              sx={{
                fontSize: { xs: "22px", md: "28px" },
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.02em",
              }}
            >
              Blog
            </Typography>
            <Typography sx={{ fontSize: "14px", color: "rgba(255,255,255,0.85)", mt: 0.5 }}>
              Articles, updates &amp; insights
            </Typography>
          </Box>
          {isAuthenticated && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => router.push("/blogs/create")}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "8px",
                px: 2.5,
                boxShadow: "0 1px 3px rgba(24, 158, 51, 0.3)",
              }}
            >
              Create blog
            </Button>
          )}
        </Box>
      </Box>
      {loading ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 10, gap: 2 }}>
          <CircularProgress color="primary" size={40} />
          <Typography sx={{ color: "text.secondary", fontSize: "14px" }}>Loading posts…</Typography>
        </Box>
      ) : error ? (
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
          <Typography sx={{ color: "#b91c1c", mb: 2, fontWeight: 500 }}>{error}</Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => fetchBlogs(1)}
            sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
          >
            Retry
          </Button>
        </Box>
      ) : !blogs.length ? (
        <Box
          sx={{
            textAlign: "center",
            py: 10,
            px: 2,
            borderRadius: "12px",
            border: "1px dashed #cbd5e1",
            bgcolor: "#f8fafc",
          }}
        >
          <Typography sx={{ color: "text.primary", fontSize: "16px", mb: 2, fontWeight: 500 }}>
            No posts yet.
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "14px", mb: 3 }}>
            Be the first to share an article.
          </Typography>
          {isAuthenticated && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push("/blogs/create")}
              sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
            >
              Create your first blog
            </Button>
          )}
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {blogs.map((blog) => (
              <Grid item xs={12} sm={6} md={4} key={blog?.id}>
                <BlogCard blog={blog} onClick={handleCardClick} />
              </Grid>
            ))}
          </Grid>
          {hasMore && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <Button
                variant="outlined"
                color="secondary"
                disabled={loadingMore}
                onClick={handleLoadMore}
                sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
              >
                {loadingMore ? (
                  <CircularProgress size={24} color="secondary" />
                ) : (
                  "Load more"
                )}
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Page;
