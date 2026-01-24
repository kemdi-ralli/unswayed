"use client";
import React, { useState } from "react";
import { Modal, Box, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

/**
 * ZoomableSlideshow - Clinical implementation of zoomable slideshow component
 * Features:
 * - Zoom in/out controls
 * - Reset zoom
 * - Pan when zoomed
 * - Keyboard navigation (Arrow keys, +/-, 0)
 * - Touch gestures support
 */
const ZoomableSlideshow = ({
  open,
  onClose,
  slides = [],
  currentSlide,
  onNext,
  onPrev,
  title = "Slideshow",
}) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 3;
  const ZOOM_STEP = 0.25;

  // Reset zoom and position when slide changes
  React.useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [currentSlide]);

  // Zoom controls
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - ZOOM_STEP, MIN_ZOOM);
    setZoom(newZoom);
    if (newZoom === MIN_ZOOM) {
      setPosition({ x: 0, y: 0 }); // Reset position when fully zoomed out
    }
  };

  const handleResetZoom = () => {
    setZoom(MIN_ZOOM);
    setPosition({ x: 0, y: 0 });
  };

  // Pan controls (mouse)
  const handleMouseDown = (e) => {
    if (zoom > MIN_ZOOM) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > MIN_ZOOM) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Pan controls (touch)
  const handleTouchStart = (e) => {
    if (zoom > MIN_ZOOM && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && zoom > MIN_ZOOM && e.touches.length === 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Keyboard navigation
  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowLeft":
          onPrev();
          break;
        case "ArrowRight":
          onNext();
          break;
        case "+":
        case "=":
          handleZoomIn();
          break;
        case "-":
        case "_":
          handleZoomOut();
          break;
        case "0":
          handleResetZoom();
          break;
        case "Escape":
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onNext, onPrev, zoom]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.95)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Header Controls */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 40px",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 10,
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontSize: { xs: "16px", md: "20px" },
              fontWeight: 600,
            }}
          >
            {title} ({currentSlide + 1} / {slides.length})
          </Typography>

          {/* Zoom Controls */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <IconButton
              onClick={handleZoomOut}
              disabled={zoom <= MIN_ZOOM}
              sx={{
                color: "white",
                "&:disabled": { color: "gray" },
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
              title="Zoom Out (-)"
            >
              <ZoomOutIcon />
            </IconButton>

            <Typography
              sx={{
                color: "white",
                fontSize: "14px",
                minWidth: "50px",
                textAlign: "center",
              }}
            >
              {Math.round(zoom * 100)}%
            </Typography>

            <IconButton
              onClick={handleZoomIn}
              disabled={zoom >= MAX_ZOOM}
              sx={{
                color: "white",
                "&:disabled": { color: "gray" },
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
              title="Zoom In (+)"
            >
              <ZoomInIcon />
            </IconButton>

            <IconButton
              onClick={handleResetZoom}
              disabled={zoom === MIN_ZOOM}
              sx={{
                color: "white",
                "&:disabled": { color: "gray" },
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
              title="Reset Zoom (0)"
            >
              <RestartAltIcon />
            </IconButton>

            <Box sx={{ width: "1px", height: "24px", backgroundColor: "rgba(255,255,255,0.3)", mx: 1 }} />

            <IconButton
              onClick={onClose}
              sx={{
                color: "white",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
              title="Close (Esc)"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Slide Navigation Buttons */}
        <IconButton
          onClick={onPrev}
          sx={{
            position: "absolute",
            left: { xs: "10px", md: "40px" },
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            zIndex: 10,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.9)",
            },
            width: { xs: "40px", md: "56px" },
            height: { xs: "40px", md: "56px" },
          }}
          title="Previous (←)"
        >
          <ChevronLeftIcon sx={{ fontSize: { xs: "30px", md: "40px" } }} />
        </IconButton>

        <IconButton
          onClick={onNext}
          sx={{
            position: "absolute",
            right: { xs: "10px", md: "40px" },
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            zIndex: 10,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.9)",
            },
            width: { xs: "40px", md: "56px" },
            height: { xs: "40px", md: "56px" },
          }}
          title="Next (→)"
        >
          <ChevronRightIcon sx={{ fontSize: { xs: "30px", md: "40px" } }} />
        </IconButton>

        {/* Slide Container with Zoom and Pan */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            cursor: zoom > MIN_ZOOM ? (isDragging ? "grabbing" : "grab") : "default",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Box
            sx={{
              position: "relative",
              width: "90%",
              height: "90%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              transition: isDragging ? "none" : "transform 0.2s ease-out",
            }}
          >
            <Image
              src={slides[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
              fill
              style={{
                objectFit: "contain",
                userSelect: "none",
                pointerEvents: "none",
              }}
              priority
            />
          </Box>
        </Box>

        {/* Help Text */}
        {zoom === MIN_ZOOM && (
          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              padding: "10px 20px",
              borderRadius: "20px",
              zIndex: 10,
            }}
          >
            <Typography
              sx={{
                color: "white",
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              Use + / - to zoom • Arrow keys to navigate • Click and drag when zoomed
            </Typography>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default ZoomableSlideshow;
