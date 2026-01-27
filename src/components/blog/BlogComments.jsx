"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SendIcon from "@mui/icons-material/Send";
import dayjs from "dayjs";
import apiInstance from "@/services/apiService/apiServiceInstance";
import {
  blogComments as blogCommentsUrl,
  blogCommentUpdate,
  blogCommentDelete,
} from "@/services/apiService/apiEndPoints";
import { Toast } from "@/components/Toast/Toast";

const PER_PAGE = 10;

const BlogComments = ({
  blogId,
  isAuthenticated,
  currentUserId,
  onCommentCountChange,
}) => {
  const [comments, setComments] = useState([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: PER_PAGE,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replyBody, setReplyBody] = useState("");
  const [editId, setEditId] = useState(null);
  const [editBody, setEditBody] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuCommentId, setMenuCommentId] = useState(null);

  const fetchComments = async (page = 1, append = false) => {
    if (!blogId) return;
    if (append) setLoadingMore(true);
    else setLoading(true);
    try {
      const res = await apiInstance.get(blogCommentsUrl(blogId), {
        params: { page, limit: PER_PAGE },
      });
      const data = res?.data?.data;
      const list = data?.comments ?? [];
      const metaData = data?.meta ?? {};
      if (append) {
        setComments((prev) => [...prev, ...list]);
      } else {
        setComments(list);
      }
      setMeta({
        current_page: metaData.current_page ?? page,
        last_page: metaData.last_page ?? 1,
        per_page: metaData.per_page ?? PER_PAGE,
        total: metaData.total ?? 0,
      });
    } catch (err) {
      Toast(
        "error",
        err?.response?.data?.message || err?.message || "Failed to load comments."
      );
      if (!append) setComments([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchComments(1);
  }, [blogId]);

  const handleSubmit = async () => {
    if (!isAuthenticated || !body?.trim()) return;
    setSubmitting(true);
    try {
      const res = await apiInstance.post(blogCommentsUrl(blogId), {
        body: body.trim(),
        parent_id: null,
      });
      if (res?.data?.status === "success" && res?.data?.data?.comment) {
        setComments((prev) => [res.data.data.comment, ...prev]);
        setBody("");
        onCommentCountChange?.((c) => (c ?? 0) + 1);
        Toast("success", res?.data?.message || "Comment added.");
      }
    } catch (err) {
      Toast(
        "error",
        err?.response?.data?.message || err?.message || "Failed to add comment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!isAuthenticated || !replyTo || !replyBody?.trim()) return;
    setSubmitting(true);
    try {
      const res = await apiInstance.post(blogCommentsUrl(blogId), {
        body: replyBody.trim(),
        parent_id: replyTo.id,
      });
      if (res?.data?.status === "success") {
        setComments((prev) =>
          prev.map((c) =>
            c.id === replyTo.id
              ? { ...c, replies_count: (c.replies_count ?? 0) + 1 }
              : c
          )
        );
        setReplyTo(null);
        setReplyBody("");
        onCommentCountChange?.((c) => (c ?? 0) + 1);
        Toast("success", res?.data?.message || "Reply added.");
      }
    } catch (err) {
      Toast(
        "error",
        err?.response?.data?.message || err?.message || "Failed to add reply."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (comment) => {
    setEditId(comment.id);
    setEditBody(comment.body);
    setAnchorEl(null);
    setMenuCommentId(null);
  };

  const handleEditSave = async () => {
    if (editId == null || !editBody?.trim()) return;
    setSubmitting(true);
    try {
      const res = await apiInstance.patch(blogCommentUpdate(editId), {
        body: editBody.trim(),
      });
      if (res?.data?.status === "success" && res?.data?.data?.comment) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === editId ? res.data.data.comment : c
          )
        );
        setEditId(null);
        setEditBody("");
        Toast("success", res?.data?.message || "Comment updated.");
      }
    } catch (err) {
      Toast(
        "error",
        err?.response?.data?.message || err?.message || "Failed to update comment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    setAnchorEl(null);
    setMenuCommentId(null);
    if (!commentId) return;
    setSubmitting(true);
    try {
      const res = await apiInstance.delete(blogCommentDelete(commentId));
      if (res?.data?.status === "success") {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        onCommentCountChange?.((c) => Math.max(0, (c ?? 0) - 1));
        Toast("success", res?.data?.message || "Comment deleted.");
      }
    } catch (err) {
      Toast(
        "error",
        err?.response?.data?.message || err?.message || "Failed to delete comment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openMenu = (e, commentId) => {
    setAnchorEl(e.currentTarget);
    setMenuCommentId(commentId);
  };

  const closeMenu = () => {
    setAnchorEl(null);
    setMenuCommentId(null);
  };

  const displayName = (user) => {
    if (!user) return "Unknown";
    const parts = [user.first_name, user.middle_name, user.last_name].filter(
      Boolean
    );
    return parts.length ? parts.join(" ") : user.username || "Unknown";
  };

  const isOwnComment = (comment) =>
    currentUserId && comment?.user?.id === currentUserId;

  return (
    <Box sx={{ mt: 5 }}>
      <Box
        sx={{
          borderBottom: "2px solid",
          borderColor: "secondary.main",
          pb: 1,
          mb: 3,
          display: "inline-block",
        }}
      >
        <Typography sx={{ fontSize: "18px", fontWeight: 700, color: "text.primary", letterSpacing: "-0.01em" }}>
          Comments {meta.total > 0 ? ` · ${meta.total}` : ""}
        </Typography>
      </Box>

      {isAuthenticated && (
        <Box
          sx={{
            mb: 4,
            p: 2,
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            bgcolor: "#f8fafc",
          }}
        >
          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder="Add a comment..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={submitting}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                bgcolor: "#fff",
                "& fieldset": { borderColor: "#e2e8f0" },
                "&:hover fieldset": { borderColor: "#94a3b8" },
                "&.Mui-focused fieldset": { borderColor: "#06b6d4", borderWidth: "1px" },
              },
            }}
          />
          <Button
            variant="contained"
            disabled={submitting || !body?.trim()}
            onClick={handleSubmit}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
            sx={{
              mt: 1.5,
              backgroundColor: "#06b6d4",
              color: "#fff",
              "&:hover": { backgroundColor: "#0891b2" },
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
            }}
          >
            Post
          </Button>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 5, gap: 1 }}>
          <CircularProgress color="primary" size={32} />
          <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>Loading comments…</Typography>
        </Box>
      ) : comments.length === 0 ? (
        <Typography sx={{ color: "text.secondary", py: 3, fontSize: "14px", fontWeight: 500 }}>
          No comments yet.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {comments.map((comment) => (
            <Box
              key={comment.id}
              sx={{
                p: 2,
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                bgcolor: "#fff",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 700, color: "#0f172a", fontSize: "14px" }}>
                    {displayName(comment.user)}
                  </Typography>
                  <Typography sx={{ fontSize: "12px", color: "#64748b", fontFamily: "ui-monospace, monospace", mt: 0.25 }}>
                    {comment.created_at
                      ? dayjs(comment.created_at).format("MMM D, YYYY · HH:mm")
                      : ""}
                  </Typography>
                </Box>
                {isAuthenticated && isOwnComment(comment) && (
                  <IconButton
                    size="small"
                    onClick={(e) => openMenu(e, comment.id)}
                    sx={{ mt: -0.5, color: "text.secondary" }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              {editId === comment.id ? (
                <Box sx={{ mt: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    disabled={submitting}
                    size="small"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", bgcolor: "#f8fafc" } }}
                  />
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      disabled={submitting || !editBody?.trim()}
                      onClick={handleEditSave}
                      sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
                    >
                      Save
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setEditId(null);
                        setEditBody("");
                      }}
                      sx={{ textTransform: "none", borderRadius: "8px", borderColor: "#e2e8f0", color: "#64748b" }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Typography sx={{ mt: 0.5, fontSize: "14px", color: "text.primary", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {comment.body}
                </Typography>
              )}
              {comment.replies_count > 0 && (
                <Typography sx={{ fontSize: "12px", color: "primary.main", mt: 0.5, fontWeight: 600 }}>
                  {comment.replies_count} repl{comment.replies_count === 1 ? "y" : "ies"}
                </Typography>
              )}
              {isAuthenticated && editId !== comment.id && (
                <Button
                  size="small"
                  sx={{
                    mt: 1,
                    color: "primary.main",
                    textTransform: "none",
                    p: 0,
                    minWidth: 0,
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                  onClick={() => {
                    setReplyTo(comment);
                    setReplyBody("");
                  }}
                >
                  Reply
                </Button>
              )}
              {replyTo?.id === comment.id && (
                <Box sx={{ mt: 2, pl: 2, borderLeft: "3px solid", borderColor: "primary.main" }}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    placeholder="Write a reply..."
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    disabled={submitting}
                    size="small"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", bgcolor: "#f8fafc" } }}
                  />
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      disabled={submitting || !replyBody?.trim()}
                      onClick={handleReplySubmit}
                      sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
                    >
                      Reply
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        setReplyTo(null);
                        setReplyBody("");
                      }}
                      sx={{ textTransform: "none", borderRadius: "8px" }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          ))}
          {meta.current_page < meta.last_page && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                variant="outlined"
                color="secondary"
                disabled={loadingMore}
                onClick={() => fetchComments(meta.current_page + 1, true)}
                sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
              >
                {loadingMore ? (
                  <CircularProgress size={20} color="secondary" />
                ) : (
                  "Load more comments"
                )}
              </Button>
            </Box>
          )}
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            const c = comments.find((x) => x.id === menuCommentId);
            if (c) handleEdit(c);
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => handleDelete(menuCommentId)}
          sx={{ color: "#d32f2f" }}
        >
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default BlogComments;
