"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import Container from "@/components/common/Container";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { BLOGS, blogDetail } from "@/services/apiService/apiEndPoints";
import { Toast } from "@/components/Toast/Toast";

const MAX_TITLE = 500;
const MAX_SHORT_DESC = 2000;
const MAX_DESCRIPTION = 100000;
const MAX_CATEGORY = 255;
const MAX_THUMB_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const BlogForm = ({ initialData = null, blogId = null, onSuccess, onCancel }) => {
  const isEdit = !!blogId;
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [shortDescription, setShortDescription] = useState(
    initialData?.short_description ?? ""
  );
  const [description, setDescription] = useState(
    initialData?.description ?? initialData?.full_article ?? ""
  );
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(
    initialData?.thumbnail ?? null
  );
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title ?? "");
      setShortDescription(initialData.short_description ?? "");
      setDescription(
        initialData.description ?? initialData.full_article ?? ""
      );
      setCategory(initialData.category ?? "");
      setThumbnailPreview(initialData.thumbnail ?? null);
    }
  }, [initialData]);

  const validate = () => {
    const next = {};
    if (!title?.trim()) next.title = "Title is required.";
    if (title?.length > MAX_TITLE) next.title = `Title must be at most ${MAX_TITLE} characters.`;
    if (!description?.trim()) next.description = "Full article is required.";
    if (description?.length > MAX_DESCRIPTION)
      next.description = `Article must be at most ${MAX_DESCRIPTION} characters.`;
    if (shortDescription?.length > MAX_SHORT_DESC)
      next.short_description = `Short description must be at most ${MAX_SHORT_DESC} characters.`;
    if (category?.length > MAX_CATEGORY)
      next.category = `Category must be at most ${MAX_CATEGORY} characters.`;
    if (thumbnailFile) {
      if (!ALLOWED_IMAGE_TYPES.includes(thumbnailFile.type))
        next.thumbnail = "Thumbnail must be jpg, jpeg, png, or webp.";
      if (thumbnailFile.size > MAX_THUMB_SIZE)
        next.thumbnail = "Thumbnail must be at most 10 MB.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setThumbnailFile(null);
      setThumbnailPreview(initialData?.thumbnail ?? null);
      return;
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      Toast("error", "Thumbnail must be jpg, jpeg, png, or webp.");
      return;
    }
    if (file.size > MAX_THUMB_SIZE) {
      Toast("error", "Thumbnail must be at most 10 MB.");
      return;
    }
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || submitting) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("short_description", shortDescription.trim());
      formData.append("description", description.trim());
      formData.append("category", category.trim());
      if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

      const url = isEdit ? blogDetail(blogId) : BLOGS;
      const method = isEdit ? "patch" : "post";
      const res = await apiInstance[method](url, formData);
      const status = res?.data?.status;
      const data = res?.data?.data;

      if (status === "success") {
        Toast("success", res?.data?.message || (isEdit ? "Blog updated." : "Blog created."));
        const blog = data?.blog ?? data;
        if (typeof onSuccess === "function") {
          onSuccess(blog);
        }
      } else {
        Toast("error", res?.data?.message || "Request failed.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        (err?.response?.status === 422 && err?.response?.data?.message) ||
        "Failed to save blog.";
      Toast("error", msg);
      if (err?.response?.status === 403) {
        Toast("error", "You can only update/delete your own blog.");
      }
      if (err?.response?.status === 404) {
        Toast("error", "Blog not found.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 720,
          mx: "auto",
          "& .MuiTextField-root": { mb: 2.5 },
        }}
      >
        <Box sx={{ mb: 3, borderBottom: "2px solid", borderColor: "secondary.main", pb: 1.5, display: "inline-block" }}>
          <Typography sx={{ fontSize: "22px", fontWeight: 700, color: "text.primary", letterSpacing: "-0.02em" }}>
            {isEdit ? "Edit blog" : "Create blog"}
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!errors.title}
          helperText={errors.title}
          inputProps={{ maxLength: MAX_TITLE }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="caption" sx={{ fontFamily: "ui-monospace, monospace", color: "text.secondary", fontSize: "12px" }}>
                  {title.length}/{MAX_TITLE}
                </Typography>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "&.Mui-focused fieldset": { borderColor: "primary.main", borderWidth: "1px" },
            },
          }}
        />

        <TextField
          fullWidth
          label="Short description (optional)"
          multiline
          rows={2}
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          error={!!errors.short_description}
          helperText={errors.short_description}
          inputProps={{ maxLength: MAX_SHORT_DESC }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "&.Mui-focused fieldset": { borderColor: "primary.main", borderWidth: "1px" },
            },
          }}
        />

        <TextField
          fullWidth
          label="Full article"
          required
          multiline
          rows={12}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={!!errors.description}
          helperText={errors.description}
          inputProps={{ maxLength: MAX_DESCRIPTION }}
          placeholder="Write your full article here. HTML is allowed."
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "&.Mui-focused fieldset": { borderColor: "primary.main", borderWidth: "1px" },
            },
          }}
        />

        <TextField
          fullWidth
          label="Category (optional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          error={!!errors.category}
          helperText={errors.category}
          inputProps={{ maxLength: MAX_CATEGORY }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "&.Mui-focused fieldset": { borderColor: "primary.main", borderWidth: "1px" },
            },
          }}
        />

        <Box
          sx={{
            mb: 2.5,
            p: 2,
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            bgcolor: "#f8fafc",
          }}
        >
          <Typography sx={{ fontSize: "13px", color: "text.secondary", fontWeight: 500, mb: 1.5 }}>
            Thumbnail (optional) – jpg, jpeg, png, webp, max 10 MB
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            component="label"
            sx={{ mr: 2, textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
          >
            Choose file
            <input
              type="file"
              hidden
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleThumbnailChange}
            />
          </Button>
          {thumbnailPreview && (
            <Box
              component="img"
              src={thumbnailPreview}
              alt="Thumbnail preview"
              sx={{
                maxWidth: 200,
                maxHeight: 120,
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            />
          )}
          {errors.thumbnail && (
            <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5, fontWeight: 500 }}>
              {errors.thumbnail}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 2.5,
              boxShadow: "0 1px 3px rgba(24, 158, 51, 0.3)",
            }}
          >
            {submitting ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : isEdit ? (
              "Save changes"
            ) : (
              "Create blog"
            )}
          </Button>
          {typeof onCancel === "function" && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={onCancel}
              disabled={submitting}
              sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default BlogForm;
