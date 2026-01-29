"use client";
import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Divider,
  Modal,
  Typography,
  IconButton,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
} from "@mui/material";

const PRELOADER_DELAY_MS = 300;
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";
import RalliButton from "@/components/button/RalliButton";
import SelectPostType from "./SelectPostType";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "790px",
  width: { xs: "90%" },
  height: "auto",
  maxHeight: "90vh",
  overflow: "auto",
  bgcolor: "#FFFFFF",
  boxShadow: "0px 1px 5px #00000040",
  p: 4,
  borderRadius: "15px",
};

// File size limits in bytes
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

const CreatePostModal = ({
  open,
  onClose,
  user,
  isPostType,
  dropdownStates,
  setDropdownStates,
  inputValue,
  setInputValue,
  mediaPreview,
  mediaType,
  handleMediaChange,
  handlePost,
  media,
  setMedia,
  fileInputRef,
  setMediaPreview,
  isReportModal,
  setDescription,
  description,
  setSelectedOption,
  selectedOption,
  handeSubmitReport,
  reportError,
  isDelete,
  isEdit,
  isCreatePost,
  loading,
}) => {
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    if (!open) {
      setContentReady(false);
      return;
    }
    const t = setTimeout(() => setContentReady(true), PRELOADER_DELAY_MS);
    return () => clearTimeout(t);
  }, [open]);

  const handleClose = () => onClose();

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const getAcceptType = () => {
    const type = dropdownStates?.postType;
    if (type === "post") return "image/*";
    if (type === "reel") return "video/*";
    return "image/*,video/*";
  };

  // Enhanced media change handler with file size validation
  const handleMediaChangeWithValidation = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video");
    const isImage = file.type.startsWith("image");
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    const maxSizeLabel = isVideo ? "100MB" : "10MB";

    // Validate file size
    if (file.size > maxSize) {
      alert(`File too large. Maximum size for ${isVideo ? "videos" : "images"} is ${maxSizeLabel}.`);
      e.target.value = null;
      return;
    }

    // Validate file type matches post type
    const postType = dropdownStates?.postType;
    if (postType === "reel" && !isVideo) {
      alert("Reels must be video content. Please select a video file.");
      e.target.value = null;
      return;
    }

    if (postType === "post" && isVideo) {
      // Allow videos in regular posts, but warn about size
      console.log("Video selected for regular post");
    }

    // Call the original handler
    handleMediaChange(e);
  };

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {!contentReady ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 280 }}>
            <CircularProgress size={48} sx={{ color: "#00305B" }} />
          </Box>
        ) : isReportModal ? (
          <Box
            sx={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              p: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                cursor: "pointer",
              }}
              onClick={handleClose}
            >
              <CloseIcon color="primary" />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                mt: 4,
                p: 3,
              }}
            >
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
                Select Type To Report
              </FormLabel>
              <FormControl component="fieldset">
                <RadioGroup
                  name="report-reason"
                  value={selectedOption}
                  onChange={handleOptionChange}
                >
                  <FormControlLabel
                    value="spam"
                    control={<Radio />}
                    label="Spam"
                  />
                  <FormControlLabel
                    value="abusive"
                    control={<Radio />}
                    label="Abusive"
                  />
                  <FormControlLabel
                    value="irrelevant"
                    control={<Radio />}
                    label="Irrelevant"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="Others"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
            <Box sx={{ mb: "20px" }}>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 500,
                  lineHeight: "18px",
                  color: "#222222",
                  mb: "10px",
                }}
              >
                Description
              </Typography>
              <Box
                component="textarea"
                rows={5}
                sx={{
                  width: "100%",
                  boxShadow: "0px 0px 3px #00000040",
                  border: "none",
                  outline: "none",
                  padding: "18px 20px",
                  borderRadius: "10px",
                  fontSize: "16px",
                  fontWeight: 300,
                  lineHeight: "24px",
                  color: "#222222",
                  resize: "vertical",
                }}
                placeholder="Describe Why You Want To Report"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Box>
            {reportError && (
              <Typography sx={{ color: "red", fontSize: 13, mt: 1 }}>
                {reportError}
              </Typography>
            )}
            <RalliButton label="Submit" onClick={handeSubmitReport} />
          </Box>
        ) : isDelete ? (
          <Box sx={{ textAlign: "center", p: 3 }}>
            <Typography sx={{ mb: 2 }}>
              Are you sure you want to delete?
            </Typography>
            <Button variant="contained" color="error" onClick={handlePost}>
              Yes, Delete
            </Button>
          </Box>
        ) : (isEdit || isCreatePost) ? (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <Avatar
                    src={user?.photo}
                    alt="user"
                    sx={{
                      width: { xs: 50, sm: 60, md: 95 },
                      height: { xs: 50, sm: 60, md: 95 },
                    }}
                  />
                  <Box>
                    <Typography
                      sx={{
                        fontSize: { xs: "12px", sm: "15px", md: "16px" },
                        lineHeight: { xs: "12px", sm: "20px" },
                        fontWeight: 500,
                        color: "#00305B",
                      }}
                    >
                      {user?.username}
                    </Typography>
                    <SelectPostType
                      names={isPostType}
                      isEdit={isEdit}
                      selectedValue={dropdownStates?.postType}
                      onChange={(value) =>
                        setDropdownStates((prevState) => ({
                          ...prevState,
                          postType: value,
                        }))
                      }
                    />
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  width: { xs: "40px", sm: "45px", md: "59px" },
                  height: { xs: "40px", sm: "45px", md: "59px" },
                  borderRadius: "50%",
                  boxShadow: "0px 1px 5px #00000040",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={handleClose}
              >
                <CloseIcon />
              </Box>
            </Box>
            <Divider sx={{ pt: 2 }} />

            {/* File size info */}
            <Box sx={{ mt: 1, mb: 1 }}>
              <Typography
                variant="caption"
                sx={{ color: "#666", fontSize: "12px" }}
              >
                {dropdownStates?.postType === "reel"
                  ? "📹 Reels: Video required (max 100MB)"
                  : "📷 Posts: Images up to 10MB, Videos up to 100MB"}
              </Typography>
            </Box>

            <Box
              sx={{
                mt: 1,
                mb: mediaPreview ? 2 : 0,
                width: "100%",
                boxShadow: "0px 0px 3px #00000040",
                border: "none",
                outline: "none",
                padding: "18px 20px",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: 300,
                lineHeight: "24px",
                color: "#222222",
              }}
            >
              <Box
                component={!mediaPreview ? "textarea" : "input"}
                rows={12}
                sx={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  resize: "vertical",
                }}
                fullWidth
                placeholder="Write something..."
                multiline
                minRows={media ? 3 : 12}
                maxRows={12}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              {mediaPreview && (
                <Box sx={{ mt: 2, position: "relative" }}>
                  <IconButton
                    onClick={() => {
                      setMedia(null);
                      setMediaPreview(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = null;
                      }
                    }}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(0,0,0,0.6)",
                      color: "white",
                      zIndex: 1,
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.8)",
                      },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>

                  {mediaType?.startsWith("image") ? (
                    <Box
                      component="img"
                      src={mediaPreview}
                      alt="media preview"
                      sx={{
                        width: "100%",
                        borderRadius: "8px",
                        objectFit: "contain",
                        maxHeight: "400px",
                      }}
                    />
                  ) : mediaType?.startsWith("video") ? (
                    <video
                      src={mediaPreview}
                      controls
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        maxHeight: "400px",
                      }}
                    />
                  ) : null}

                  {/* Show file size */}
                  {media && (
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mt: 1,
                        color: "#666",
                        textAlign: "right",
                      }}
                    >
                      File size: {formatFileSize(media?.size)}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box
                  sx={{
                    width: { xs: "40px", sm: "45px", md: "59px" },
                    height: { xs: "40px", sm: "45px", md: "59px" },
                    borderRadius: "50%",
                    boxShadow: "0px 1px 5px #00000040",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: dropdownStates?.postType ? "pointer" : "not-allowed",
                    opacity: dropdownStates?.postType ? 1 : 0.5,
                  }}
                >
                  <IconButton
                    component="label"
                    aria-label="Add Media"
                    sx={{ width: "100%", height: "100%" }}
                    disabled={!dropdownStates?.postType}
                  >
                    {dropdownStates?.postType === "reel" ? (
                      <VideocamIcon />
                    ) : (
                      <ImageIcon />
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={getAcceptType()}
                      hidden
                      onChange={handleMediaChangeWithValidation}
                      disabled={!dropdownStates?.postType}
                    />
                  </IconButton>
                </Box>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePost}
                  disabled={
                    loading ||
                    (!inputValue && !media) ||
                    (dropdownStates?.postType === "reel" && !media)
                  }
                  startIcon={
                    loading ? <CircularProgress size={16} color="inherit" /> : null
                  }
                >
                  {loading
                    ? "Uploading..."
                    : isEdit
                    ? "Update"
                    : "Post"}
                </Button>
              </Box>
            </Box>

            {/* Reel warning if no video */}
            {dropdownStates?.postType === "reel" && !media && (
              <Typography
                sx={{
                  color: "#d32f2f",
                  fontSize: "12px",
                  mt: 1,
                  textAlign: "right",
                }}
              >
                * Reels require a video
              </Typography>
            )}
          </>
        ) : null}
      </Box>
    </Modal>
  );
};

export default CreatePostModal;