"use client";
import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDispatch } from "react-redux";
import { affindaGenerateResume } from "@/redux/slices/getResumesSlice";
import { Toast } from "@/components/Toast/Toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_EXTENSIONS = [".pdf", ".docx"];

const AffindaGenerateModal = ({ open, onClose }) => {
  const [file, setFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  // ── File validation ──────────────────────────────────────────────────────────
  const validateFile = (f) => {
    const ext = "." + f.name.split(".").pop().toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      return "Only PDF and DOCX files are accepted.";
    }
    if (f.size > MAX_FILE_SIZE) {
      return "File size must not exceed 5 MB.";
    }
    return null;
  };

  const applyFile = (f) => {
    if (!f) return;
    const validationError = validateFile(f);
    if (validationError) {
      setError(validationError);
      setFile(null);
      return;
    }
    setError(null);
    setFile(f);
  };

  // ── Input / drag handlers ────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    applyFile(e.target.files[0]);
    e.target.value = ""; // reset so same file can be re-selected
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    applyFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  // ── Generate ─────────────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!file || isGenerating) return;
    setIsGenerating(true);
    setError(null);

    try {
      await dispatch(affindaGenerateResume(file)).unwrap();
      Toast("success", "Resume generated successfully.");
      handleClose();
    } catch (err) {
      // err is the rejectWithValue payload: { status, message }
      const status = err?.status;
      if (status === 422) {
        // Show the API's message verbatim inside the modal
        setError(err?.message || "Failed to extract resume data.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Close / reset ────────────────────────────────────────────────────────────
  const handleClose = () => {
    if (isGenerating) return; // block dismissal while in-flight
    setFile(null);
    setError(null);
    setIsDragging(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "16px", padding: "8px" } }}
    >
      {/* ── Title ── */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "20px",
          fontWeight: 700,
          color: "#00305B",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CloudUploadIcon sx={{ fontSize: "26px" }} />
          Upload &amp; Auto-Generate Resume
        </Box>
        <IconButton onClick={handleClose} disabled={isGenerating} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* ── Content ── */}
      <DialogContent>
        {isGenerating ? (
          /* Full in-dialog loading overlay — no toast spinner; this takes 15–60 s */
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 7,
            }}
          >
            <CircularProgress size={64} sx={{ color: "#00305B" }} />
            <Typography
              sx={{
                mt: 3,
                color: "#00305B",
                fontWeight: 700,
                fontSize: "18px",
                textAlign: "center",
              }}
            >
              Analysing your resume…
            </Typography>
            <Typography
              sx={{ mt: 1, color: "#666", fontSize: "13px", textAlign: "center" }}
            >
              This may take up to 60 seconds. Please wait.
            </Typography>
          </Box>
        ) : (
          <>
            {/* ── Drop zone ── */}
            <Box
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current.click()}
              sx={{
                border: `2px dashed ${isDragging ? "#00305B" : "#ccc"}`,
                borderRadius: "12px",
                p: 4,
                cursor: "pointer",
                textAlign: "center",
                backgroundColor: isDragging ? "#eef3f8" : "#fafafa",
                transition: "border-color 0.2s, background-color 0.2s",
                my: 2,
                "&:hover": {
                  borderColor: "#00305B",
                  backgroundColor: "#eef3f8",
                },
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 48, color: "#00305B", mb: 1 }} />
              {file ? (
                <>
                  <Typography sx={{ fontWeight: 700, color: "#111", mb: 0.5 }}>
                    {file.name}
                  </Typography>
                  <Typography sx={{ color: "#888", fontSize: "13px" }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB — click to change
                  </Typography>
                </>
              ) : (
                <>
                  <Typography sx={{ fontWeight: 600, color: "#111", mb: 0.5 }}>
                    Drag &amp; drop your resume here
                  </Typography>
                  <Typography sx={{ color: "#888", fontSize: "13px", mb: 2 }}>
                    PDF or DOCX only · max 5 MB
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      textTransform: "none",
                      borderColor: "#00305B",
                      color: "#00305B",
                      borderRadius: "8px",
                      fontWeight: 600,
                      "&:hover": { borderColor: "#001f3d", backgroundColor: "#eef3f8" },
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // avoid double-triggering the Box click
                      fileInputRef.current.click();
                    }}
                  >
                    Browse Files
                  </Button>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                style={{ display: "none" }}
                onChange={handleInputChange}
              />
            </Box>

            {/* ── Inline error (422: verbatim API message; else: generic) ── */}
            {error && (
              <Box
                sx={{
                  backgroundColor: "#fff3f3",
                  border: "1px solid #f44336",
                  borderRadius: "8px",
                  p: "12px 16px",
                  mt: 1,
                }}
              >
                <Typography sx={{ color: "#d32f2f", fontSize: "14px" }}>
                  {error}
                </Typography>
              </Box>
            )}

            <Typography sx={{ color: "#999", fontSize: "12px", mt: 2 }}>
              ℹ️ Processing typically takes 15–60 seconds. Do not close this dialog
              until generation is complete.
            </Typography>
          </>
        )}
      </DialogContent>

      {/* ── Actions (hidden during generation) ── */}
      {!isGenerating && (
        <DialogActions sx={{ padding: "12px 24px 16px", gap: 1 }}>
          <Button
            onClick={handleClose}
            sx={{
              color: "#666",
              textTransform: "none",
              fontSize: "15px",
              fontWeight: 600,
              px: 3,
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!file}
            variant="contained"
            sx={{
              backgroundColor: "#00305B",
              color: "#FFF",
              textTransform: "none",
              fontSize: "15px",
              fontWeight: 600,
              px: 3,
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#001f3d" },
              "&.Mui-disabled": { backgroundColor: "#c5cdd6", color: "#fff" },
            }}
          >
            Generate Resume
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default AffindaGenerateModal;
