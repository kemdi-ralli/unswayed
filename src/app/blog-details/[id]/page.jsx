"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Container from "@/components/common/Container";
import BackButtonWithTitle from "@/components/applicant/dashboard/BackButtonWithTitle";
import { fetchBlogDetails, likeBlog, commentBlog, shareBlog } from "@/helper/blogGetApiHelper";
import dayjs from "dayjs";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import { Toast } from "@/components/Toast/Toast";
import {
  Avatar,
  Divider,
  TextField,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";

const sanitizeHTML = (html) => {
  if (!html) return "";
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  tempDiv.querySelectorAll("input").forEach((el) => el.remove());
  tempDiv.querySelectorAll(".ql-tooltip").forEach((el) => el.remove());
  return tempDiv.innerHTML;
};

const BlogDetails = ({ params }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState({});
  const [openReplyId, setOpenReplyId] = useState(null);
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const { userData } = useSelector((state) => state.auth);
  const isLoggedIn = Object.keys(userData || {}).length > 0;

  const getBlogData = async () => {
    try {
      if (params?.id) {
        const data = await fetchBlogDetails(params.id);
        setBlog(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlogData();
  }, [params?.id]);

  const handleLike = async () => {
    if (!isLoggedIn) {
      Toast("error", "Please login to like this article.");
      return;
    }
    setIsLiking(true);
    try {
      await likeBlog(blog.id);
      getBlogData();
    } catch (error) {
      Toast("error", "Failed to update like status.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async (parentId = null) => {
    if (!isLoggedIn) {
      Toast("error", "Please login to comment.");
      return;
    }
    const text = parentId ? replyText[parentId] : commentText;
    if (!text?.trim()) return;

    setIsCommenting(true);
    try {
      await commentBlog(blog.id, text, parentId);
      if (parentId) {
        setReplyText({ ...replyText, [parentId]: "" });
        setOpenReplyId(null);
      } else {
        setCommentText("");
      }
      getBlogData();
      Toast("success", "Comment added successfully!");
    } catch (error) {
      Toast("error", "Failed to add comment.");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.short_description,
          url: url,
        });
        await shareBlog(blog.id);
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(url);
      Toast("success", "Link copied to clipboard!");
      await shareBlog(blog.id);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress sx={{ color: "#00305B" }} />
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography>Blog not found.</Typography>
      </Box>
    );
  }
  const cleanedDescription = sanitizeHTML(blog?.description);

  return (
    <Container>
      <BackButtonWithTitle label="Blogs" />

      <Box
        sx={{
          width: "100%",
          height: { xs: "200px", sm: "350px", md: "500px" },
          backgroundImage: `url(${blog?.thumbnail})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: "16px",
          boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
        }}
      />

      <Typography
        sx={{
          fontSize: { xs: "28px", sm: "36px", md: "48px" },
          lineHeight: 1.1,
          fontWeight: 800,
          color: "#00305B",
          pt: 5,
          pb: 2,
          letterSpacing: "-1px",
        }}
      >
        {blog?.title}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4, flexWrap: "wrap" }}>
        {blog?.author && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar src={blog.author.photo} sx={{ width: 40, height: 40 }} />
            <Box>
              <Typography sx={{ fontWeight: 700, color: "#111", fontSize: "15px" }}>
                {blog.author.name || "User"}
              </Typography>
              <Typography sx={{ color: "#666", fontSize: "12px" }}>Author</Typography>
            </Box>
          </Box>
        )}
        <Divider orientation="vertical" flexItem sx={{ mx: 1, display: { xs: "none", sm: "block" } }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CalendarTodayIcon sx={{ color: "#189e33ff", fontSize: "18px" }} />
          <Typography sx={{ color: "#666", fontWeight: 500, fontSize: "14px" }}>
            {dayjs(blog?.created_at).format("MMMM D, YYYY")}
          </Typography>
        </Box>
        {blog?.category && (
          <Box
            sx={{
              backgroundColor: "#e8faf0ff",
              color: "#189e33ff",
              px: 2,
              py: 0.5,
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {blog.category}
          </Box>
        )}
      </Box>

      {/* Social Actions */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          py: 2,
          mb: 4,
          borderTop: "1px solid #eee",
          borderBottom: "1px solid #eee",
        }}
      >
        <Button
          onClick={handleLike}
          disabled={isLiking}
          startIcon={blog?.is_liked ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
          sx={{
            color: blog?.is_liked ? "#189e33ff" : "#666",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "30px",
            px: 3,
            "&:hover": { backgroundColor: "rgba(24, 158, 51, 0.08)" },
          }}
        >
          Like ({blog?.likes_count || 0})
        </Button>
        <Button
          startIcon={<ChatBubbleOutlineIcon />}
          sx={{
            color: "#666",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "30px",
            px: 3,
          }}
          onClick={() => document.getElementById("comment-section").scrollIntoView({ behavior: "smooth" })}
        >
          Comment ({blog?.comments_count || 0})
        </Button>
        <Button
          onClick={handleShare}
          startIcon={<ShareIcon />}
          sx={{
            color: "#666",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "30px",
            px: 3,
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          Share ({blog?.shares_count || 0})
        </Button>
      </Box>

      <Box
        sx={{
          fontSize: { xs: "17px", md: "20px" },
          lineHeight: 1.8,
          color: "#2c3e50",
          py: 2,
          maxWidth: "850px",
          mx: "auto",
          "& p": { mb: 3 },
          "& h1, & h2, & h3": { color: "#00305B", mb: 2, mt: 4 },
          "& img": { maxWidth: "100%", height: "auto", borderRadius: "12px", my: 4, boxShadow: "0px 10px 30px rgba(0,0,0,0.1)" },
          "& blockquote": { borderLeft: "4px solid #189e33ff", pl: 3, py: 1, my: 4, fontStyle: "italic", fontSize: "1.1em", color: "#555" },
        }}
        dangerouslySetInnerHTML={{ __html: cleanedDescription }}
      />

      {/* Comment Section */}
      <Box id="comment-section" sx={{ mt: 8, mb: 10, maxWidth: "850px", mx: "auto" }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#00305B", mb: 4 }}>
          Discussion ({blog?.comments_count || 0})
        </Typography>

        {isLoggedIn ? (
          <Box sx={{ display: "flex", gap: 2, mb: 6 }}>
            <Avatar src={userData?.photo} />
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Share your thoughts..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#f9f9f9",
                  },
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  disabled={!commentText.trim() || isCommenting}
                  onClick={handleCommentSubmit}
                  sx={{
                    backgroundColor: "#00305B",
                    borderRadius: "8px",
                    px: 4,
                    py: 1,
                    textTransform: "none",
                    fontWeight: 700,
                    "&:hover": { backgroundColor: "#002040" },
                  }}
                >
                  Post Comment
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              backgroundColor: "#f5f5f5",
              borderRadius: "16px",
              mb: 6,
            }}
          >
            <Typography sx={{ color: "#666", mb: 2, fontWeight: 500 }}>
              Join the conversation
            </Typography>
            <Button
              variant="outlined"
              sx={{ color: "#00305B", borderColor: "#00305B", fontWeight: 700, textTransform: "none" }}
            >
              Sign in to Comment
            </Button>
          </Box>
        )}

        <Divider sx={{ mb: 4 }} />

        {/* Comment List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {blog?.comments?.length > 0 ? (
            blog.comments.map((comment) => (
              <Box key={comment.id} sx={{ display: "flex", gap: 2 }}>
                <Avatar src={comment.user?.photo} />
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "15px", color: "#111" }}>
                      {comment.user?.name}
                    </Typography>
                    <Typography sx={{ fontSize: "12px", color: "#999", fontWeight: 500 }}>
                      {dayjs(comment.created_at).fromNow()}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: "#444", lineHeight: 1.5, fontSize: "15px" }}>
                    {comment.comment}
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => setOpenReplyId(openReplyId === comment.id ? null : comment.id)}
                    sx={{ color: "#00305B", fontWeight: 600, textTransform: "none", mt: 0.5, p: 0 }}
                  >
                    Reply
                  </Button>

                  {openReplyId === comment.id && (
                    <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Write a reply..."
                        value={replyText[comment.id] || ""}
                        onChange={(e) => setReplyText({ ...replyText, [comment.id]: e.target.value })}
                      />
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleCommentSubmit(comment.id)}
                        disabled={!replyText[comment.id]?.trim() || isCommenting}
                        sx={{ backgroundColor: "#00305B" }}
                      >
                        Reply
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            ))
          ) : (
            <Typography sx={{ textAlign: "center", color: "#999", py: 4 }}>
              No comments yet. Be the first to share your thoughts!
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default BlogDetails;
