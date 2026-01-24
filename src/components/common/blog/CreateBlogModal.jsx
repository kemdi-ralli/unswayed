"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Modal,
  IconButton,
  CircularProgress,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { createBlog } from "@/helper/blogGetApiHelper";
import { Toast } from "@/components/Toast/Toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", md: "700px" },
  maxHeight: "90vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "16px",
  overflowY: "auto",
};

const CreateBlogModal = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    category: "",
    description: "",
    thumbnail: null,
  });
  const [preview, setThumbnailPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, thumbnail: file }));
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.thumbnail || !formData.short_description) {
      Toast("error", "Please fill in all required fields and upload a thumbnail.");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("short_description", formData.short_description);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("thumbnail", formData.thumbnail);

      await createBlog(data);
      Toast("success", "Blog post created successfully!");
      setFormData({
        title: "",
        short_description: "",
        category: "",
        description: "",
        thumbnail: null,
      });
      setThumbnailPreview(null);
      onSuccess();
      onClose();
    } catch (error) {
      Toast("error", error?.response?.data?.message || "Failed to create blog post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#00305B" }}>
            Create New Article
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Article Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Career Advice, Industry News"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                component="label"
                variant="outlined"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{
                  height: "56px",
                  borderColor: "rgba(0, 0, 0, 0.23)",
                  color: "text.secondary",
                  textTransform: "none",
                  justifyContent: "flex-start",
                  px: 2,
                  "&:hover": {
                    borderColor: "#00305B",
                  },
                }}
              >
                {formData.thumbnail ? formData.thumbnail.name : "Upload Thumbnail *"}
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </Button>
            </Grid>

            {preview && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    width: "100%",
                    height: "200px",
                    position: "relative",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid #eee",
                  }}
                >
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Short Description"
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                multiline
                rows={2}
                variant="outlined"
                placeholder="A brief summary of your article..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Content (HTML supported)"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={8}
                required
                variant="outlined"
                placeholder="Write your article content here..."
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  backgroundColor: "#00305B",
                  borderRadius: "8px",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "#002040",
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Publish Article"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateBlogModal;
