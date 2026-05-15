"use client";
import React, { useRef } from "react";
import { Box, Typography, Avatar, IconButton, Tooltip } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CloseIcon from "@mui/icons-material/Close";
import LexiMessages from "./LexiMessages";
import LexiInput from "./LexiInput";
import { useLexi } from "./LexiContext";

const LexiPanel = ({ onClose, inputRef: externalInputRef, isWidget = false }) => {
  const { messages, isTyping, isRateLimited, sendMessage, resetSession } =
    useLexi();
  const internalInputRef = useRef(null);
  const inputRef = externalInputRef || internalInputRef;

  const handleReset = async () => {
    if (window.confirm("Clear this conversation and start fresh with Lexi?")) {
      await resetSession();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#fff",
        borderRadius: isWidget ? "16px" : 0,
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2,
          py: 1.25,
          backgroundColor: "#00305B",
          flexShrink: 0,
        }}
      >
        <Avatar
          src="/assets/images/supportAI.png"
          alt="Lexi"
          sx={{ width: 36, height: 36, bgcolor: "rgba(255,255,255,0.15)" }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "15px",
              color: "#fff",
              lineHeight: 1.2,
            }}
          >
            Lexi
          </Typography>
          <Typography
            sx={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.2,
            }}
          >
            AI Assistant · Ralli
          </Typography>
        </Box>

        <Tooltip title="Clear conversation">
          <IconButton
            size="small"
            onClick={handleReset}
            aria-label="Clear Lexi conversation"
            sx={{
              color: "rgba(255,255,255,0.75)",
              "&:hover": {
                color: "#fff",
                backgroundColor: "rgba(255,255,255,0.15)",
              },
            }}
          >
            <RestartAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {onClose && (
          <Tooltip title="Close">
            <IconButton
              size="small"
              onClick={onClose}
              aria-label="Close Lexi"
              sx={{
                color: "rgba(255,255,255,0.75)",
                "&:hover": {
                  color: "#fff",
                  backgroundColor: "rgba(255,255,255,0.15)",
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* ── Messages ── */}
      <LexiMessages messages={messages} isTyping={isTyping} />

      {/* ── Input ── */}
      <LexiInput
        onSend={sendMessage}
        isTyping={isTyping}
        isRateLimited={isRateLimited}
        inputRef={inputRef}
      />
    </Box>
  );
};

export default LexiPanel;
