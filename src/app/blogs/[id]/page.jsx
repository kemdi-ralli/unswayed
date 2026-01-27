"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import dayjs from "dayjs";
import Container from "@/components/common/Container";
import BlogComments from "@/components/blog/BlogComments";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import apiInstance from "@/services/apiService/apiServiceInstance";
import {
  blogDetail,
  BLOG_LIKE,
} from "@/services/apiService/apiEndPoints";
import { Toast } from "@/components/Toast/Toast";
import { useSelector } from "react-redux";
import Cookie from "js-cookie";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const { userData } = useSelector((state) => state?.auth);
  const token = Cookie.get("token");
  const isAuthenticated = !!token && !!userData?.user;
  const currentUserId = userData?.user?.id ?? null;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeLoading, setLikeLoading] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchBlog = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiInstance.get(blogDetail(id));
      const data = res?.data?.data;
      const status = res?.data?.status;
      if (status === "error") {
        setError(res?.data?.message || "Failed to load blog.");
        setBlog(null);
        return;
      }
      const b = data?.blog ?? null;
      setBlog(b);
      if (b) {
        setLikesCount(b.likes_count ?? 0);
        setIsLiked(!!b.is_liked);
        setCommentsCount(b.comments_count ?? 0);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        (err?.response?.status === 404 ? "Blog not found." : "Failed to load blog.");
      setError(msg);
      setBlog(null);
      if (err?.response?.status === 404) {
        Toast("error", "Blog not found.");
      } else {
        Toast("error", msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      Toast("info", "Log in to like this blog.");
      return;
    }
    if (!id || likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await apiInstance.post(BLOG_LIKE, { blog_id: Number(id) });
      if (res?.data?.status === "success" && res?.data?.data) {
        setIsLiked(res.data.data.is_liked ?? false);
        setLikesCount(res.data.data.likes_count ?? 0);
        Toast("success", res?.data?.message || "Like updated.");
      }
    } catch (err) {
      Toast(
        "error",
        err?.response?.data?.message || err?.message || "Failed to update like."
      );
    } finally {
      setLikeLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleCommentCountChange = (updater) => {
    setCommentsCount((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      return Math.max(0, next ?? 0);
    });
  };

  const ownerId = blog?.user_id ?? blog?.user?.id;
  const isOwner =
    isAuthenticated &&
    currentUserId != null &&
    String(ownerId) === String(currentUserId);

  const handleDeleteClick = () => setDeleteModalOpen(true);
  const handleDeleteConfirm = async () => {
    if (!id || deleteLoading) return;
    setDeleteLoading(true);
    try {
      const res = await apiInstance.delete(blogDetail(id));
      if (res?.data?.status === "success") {
        Toast("success", res?.data?.message || "Blog deleted successfully.");
        setDeleteModalOpen(false);
        router.push("/blogs");
      } else {
        Toast("error", res?.data?.message || "Failed to delete blog.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete blog.";
      Toast("error", msg);
      if (err?.response?.status === 403) {
        Toast("error", "You can only delete your own blog.");
      }
      setDeleteModalOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };
  const handleDeleteCancel = () => setDeleteModalOpen(false);

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 12, gap: 2 }}>
          <CircularProgress color="primary" size={44} />
          <Typography sx={{ color: "text.secondary", fontSize: "14px", fontWeight: 500 }}>Loading post…</Typography>
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
            onClick={handleBack}
            sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
          >
            Go back
          </Button>
        </Box>
      </Container>
    );
  }

  if (!blog) {
    return null;
  }

  const title = blog.title || "Untitled";
  const fullArticle = blog.full_article || blog.description || "";
  const thumbnail = blog.thumbnail || null;
  const category = blog.category || null;
  const views = blog.views ?? 0;
  const createdAt = blog.created_at
    ? dayjs(blog.created_at).format("MMM D, YYYY")
    : "";

  return (
    <Container>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1, mb: 3 }}>
        <Button
          startIcon={<ArrowBackIosNewIcon />}
          onClick={handleBack}
          sx={{
            color: "secondary.main",
            textTransform: "none",
            p: 0,
            minWidth: 0,
            fontWeight: 600,
            fontSize: "14px",
            "&:hover": { bgcolor: "rgba(0, 28, 99, 0.06)" },
            borderRadius: "8px",
          }}
        >
          Back
        </Button>
        {isOwner && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => router.push(`/blogs/${id}/edit`)}
              sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<DeleteOutlineIcon />}
              onClick={handleDeleteClick}
              sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
            >
              Delete
            </Button>
          </Box>
        )}
      </Box>

      <Box
        component="article"
        sx={{
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          bgcolor: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pt: 4, pb: 2 }}>
          {category && (
            <Box
              sx={{
                display: "inline-block",
                px: 1.5,
                py: 0.5,
                borderRadius: "6px",
                bgcolor: "secondary.main",
                mb: 1.5,
              }}
            >
              <Typography sx={{ fontSize: "11px", color: "#fff", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {category}
              </Typography>
            </Box>
          )}
          <Typography
            component="h1"
            sx={{
              fontWeight: 800,
              color: "text.primary",
              fontSize: { xs: "24px", sm: "28px", md: "32px" },
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
              mb: 2,
            }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
              color: "#64748b",
              fontSize: "14px",
              py: 1,
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            {createdAt && (
              <Typography component="span" sx={{ fontSize: "14px", color: "text.secondary", fontWeight: 500 }}>
                {createdAt}
              </Typography>
            )}
            {views > 0 && (
              <Typography component="span" sx={{ fontSize: "14px", color: "text.secondary", display: "flex", alignItems: "center", gap: 0.5 }}>
                <VisibilityIcon sx={{ fontSize: "18px" }} /> {views} view{views !== 1 ? "s" : ""}
              </Typography>
            )}
            <Typography component="span" sx={{ fontSize: "14px", color: "text.secondary", display: "flex", alignItems: "center", gap: 0.5 }}>
              <ChatBubbleOutlineIcon sx={{ fontSize: "18px" }} /> {commentsCount} comment{commentsCount !== 1 ? "s" : ""}
            </Typography>
            <Typography component="span" sx={{ fontSize: "14px", color: "text.secondary", display: "flex", alignItems: "center", gap: 0.5 }}>
              {likesCount} like{likesCount !== 1 ? "s" : ""}
            </Typography>
            {isAuthenticated ? (
              <IconButton
                onClick={handleLike}
                disabled={likeLoading}
                size="small"
                color={isLiked ? "error" : "primary"}
                aria-label={isLiked ? "Unlike" : "Like"}
              >
                {likeLoading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : isLiked ? (
                  <FavoriteIcon fontSize="small" />
                ) : (
                  <FavoriteBorderIcon fontSize="small" />
                )}
              </IconButton>
            ) : (
              <Typography sx={{ fontSize: "14px", color: "primary.main", fontWeight: 500 }}>
                Log in to like
              </Typography>
            )}
          </Box>
        </Box>

        {thumbnail && (
          <Box
            sx={{
              width: "100%",
              maxHeight: 420,
              overflow: "hidden",
              bgcolor: "#f1f5f9",
            }}
          >
            <Box
              component="img"
              src={thumbnail}
              alt={title}
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: 420,
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>
        )}

        <Box
          sx={{
            px: { xs: 2, sm: 3, md: 4 },
            py: 4,
            "& p": { mb: 2, lineHeight: 1.75, color: "#334155", fontSize: "16px" },
            "& h2": { mt: 3.5, mb: 1.5, fontSize: "22px", fontWeight: 700, color: "#0f172a" },
            "& h3": { mt: 2.5, mb: 1, fontSize: "18px", fontWeight: 600, color: "#0f172a" },
            "& ul, & ol": { pl: 3, mb: 2, color: "#334155" },
            "& img": { maxWidth: "100%", height: "auto", borderRadius: "8px" },
            "& pre, & code": { fontFamily: "ui-monospace, monospace", fontSize: "14px", bgcolor: "#f1f5f9", px: 1, py: 0.5, borderRadius: "4px" },
            "& pre": { p: 2, overflow: "auto", border: "1px solid #e2e8f0" },
          }}
        >
          {fullArticle ? (
            <Box
              component="div"
              dangerouslySetInnerHTML={{ __html: fullArticle }}
            />
          ) : (
            <Typography sx={{ color: "text.secondary", fontSize: "16px" }}>No content.</Typography>
          )}
        </Box>
      </Box>

      <BlogComments
        blogId={id}
        isAuthenticated={isAuthenticated}
        currentUserId={currentUserId}
        onCommentCountChange={handleCommentCountChange}
      />

      <ConfirmModal
        open={deleteModalOpen}
        title="Delete this blog?"
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        onCancle={handleDeleteCancel}
      />
    </Container>
  );
};

export default Page;
