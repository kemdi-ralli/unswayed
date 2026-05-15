"use client";
import React, { useRef, useEffect, useCallback } from "react";
import { Box, Avatar, IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLexi } from "./LexiContext";
import LexiPanel from "./LexiPanel";

const LexiWidget = () => {
  const { isOpen, setOpen } = useLexi();
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const inputRef = useRef(null);

  const open = useCallback(() => setOpen(true), [setOpen]);

  const close = useCallback(() => {
    setOpen(false);
    // Return focus to trigger button
    setTimeout(() => triggerRef.current?.focus(), 50);
  }, [setOpen]);

  // Auto-focus the message input when the panel opens
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Focus trap + Escape key handler
  const handlePanelKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
        return;
      }

      if (e.key === "Tab" && panelRef.current) {
        const focusable = Array.from(
          panelRef.current.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null);

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [close]
  );

  return (
    <>
      {/* ── Expanded chat panel ── */}
      {isOpen && (
        <Box
          ref={panelRef}
          role="dialog"
          aria-label="Lexi AI assistant"
          aria-modal="true"
          onKeyDown={handlePanelKeyDown}
          sx={{
            position: "fixed",
            bottom: { xs: 80, sm: 88 },
            right: { xs: 12, sm: 24 },
            width: { xs: "calc(100vw - 24px)", sm: 380 },
            height: { xs: "calc(100vh - 104px)", sm: 560 },
            maxHeight: "calc(100vh - 104px)",
            borderRadius: "16px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
            zIndex: 1300,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <LexiPanel onClose={close} inputRef={inputRef} isWidget />
        </Box>
      )}

      {/* ── Toggle button ── */}
      <Box
        sx={{
          position: "fixed",
          bottom: { xs: 16, sm: 24 },
          right: { xs: 12, sm: 24 },
          zIndex: 1301,
        }}
      >
        {isOpen ? (
          <Tooltip title="Close Lexi" placement="left">
            <IconButton
              ref={triggerRef}
              onClick={close}
              aria-label="Close Lexi AI assistant"
              aria-expanded="true"
              aria-haspopup="dialog"
              sx={{
                width: 56,
                height: 56,
                backgroundColor: "#00305B",
                color: "#fff",
                boxShadow: "0 4px 16px rgba(0,48,91,0.45)",
                "&:hover": { backgroundColor: "#004a8f" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Chat with Lexi" placement="left">
            <IconButton
              ref={triggerRef}
              onClick={open}
              aria-label="Open Lexi AI assistant"
              aria-expanded="false"
              aria-haspopup="dialog"
              sx={{
                width: 56,
                height: 56,
                p: 0,
                overflow: "hidden",
                backgroundColor: "#00305B",
                boxShadow: "0 4px 16px rgba(0,48,91,0.45)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                "&:hover": {
                  backgroundColor: "#004a8f",
                  transform: "scale(1.05)",
                  boxShadow: "0 6px 20px rgba(0,48,91,0.55)",
                },
              }}
            >
              <Avatar
                src="/assets/images/AIChat.png"
                alt="Lexi"
                sx={{ width: 56, height: 56, bgcolor: "#00305B" }}
              />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </>
  );
};

export default LexiWidget;
