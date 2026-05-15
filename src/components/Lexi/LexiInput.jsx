"use client";
import React, { useState, useRef, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const MAX_CHARS = 1000;
const CHAR_WARN_THRESHOLD = 800;

const LexiInput = ({ onSend, isTyping, isRateLimited, inputRef: externalRef }) => {
  const [value, setValue] = useState("");
  const internalRef = useRef(null);
  const ref = externalRef || internalRef;

  const canSend = value.trim().length > 0 && !isTyping && !isRateLimited;

  const handleSend = () => {
    if (!canSend) return;
    onSend(value.trim());
    setValue("");
    ref.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-grow textarea (capped at ~5 lines)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [value, ref]);

  const charCount = value.length;
  const showCounter = charCount > CHAR_WARN_THRESHOLD;

  return (
    <Box
      sx={{
        borderTop: "1px solid #e0e0e0",
        px: 1.5,
        py: 1.25,
        display: "flex",
        alignItems: "flex-end",
        gap: 1,
        backgroundColor: "#fff",
        flexShrink: 0,
      }}
    >
      <Box sx={{ flexGrow: 1, position: "relative" }}>
        <Box
          component="textarea"
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, MAX_CHARS))}
          onKeyDown={handleKeyDown}
          placeholder={
            isRateLimited
              ? "Please wait a moment…"
              : "Ask Lexi anything… (Shift+Enter for new line)"
          }
          disabled={isRateLimited}
          rows={1}
          aria-label="Type your message"
          aria-multiline="true"
          sx={{
            width: "100%",
            resize: "none",
            border: "1px solid #d0d0d0",
            borderRadius: "12px",
            p: "9px 14px",
            fontSize: "14px",
            fontFamily: "inherit",
            lineHeight: 1.5,
            outline: "none",
            backgroundColor: isRateLimited ? "#f5f5f5" : "#fff",
            color: "#111",
            overflowY: "hidden",
            maxHeight: "120px",
            boxSizing: "border-box",
            display: "block",
            transition: "border-color 0.2s",
            "&:focus": { borderColor: "#00305B" },
            "&::placeholder": { color: "#aaa", fontSize: "13px" },
          }}
        />
        {showCounter && (
          <Typography
            sx={{
              position: "absolute",
              bottom: 5,
              right: 10,
              fontSize: "11px",
              color: charCount >= MAX_CHARS ? "#e53935" : "#999",
              pointerEvents: "none",
              lineHeight: 1,
            }}
          >
            {charCount}/{MAX_CHARS}
          </Typography>
        )}
      </Box>

      <IconButton
        onClick={handleSend}
        disabled={!canSend}
        aria-label="Send message"
        sx={{
          width: 40,
          height: 40,
          mb: "2px",
          flexShrink: 0,
          backgroundColor: canSend ? "#00305B" : "#e0e0e0",
          color: canSend ? "#fff" : "#aaa",
          transition: "background-color 0.2s",
          "&:hover": {
            backgroundColor: canSend ? "#004a8f" : "#e0e0e0",
          },
          "&.Mui-disabled": {
            backgroundColor: "#e0e0e0",
            color: "#aaa",
          },
        }}
      >
        <SendIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
};

export default LexiInput;
