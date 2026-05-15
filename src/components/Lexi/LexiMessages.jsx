"use client";
import React, { useRef, useEffect } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { keyframes } from "@mui/system";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ── Typing indicator animation ────────────────────────────────────────────────

const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); opacity: 0.6; }
  40%            { transform: translateY(-6px); opacity: 1; }
`;

const TypingIndicator = () => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 1.5, py: 1 }}>
    {[0, 1, 2].map((i) => (
      <Box
        key={i}
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "#00305B",
          animation: `${bounce} 1.2s ease-in-out ${i * 0.2}s infinite`,
        }}
      />
    ))}
  </Box>
);

// ── Markdown component overrides ──────────────────────────────────────────────

const md = {
  p: ({ children }) => (
    <Typography
      component="p"
      sx={{
        m: 0,
        mb: 0.75,
        fontSize: "14px",
        lineHeight: 1.65,
        "&:last-child": { mb: 0 },
      }}
    >
      {children}
    </Typography>
  ),
  ul: ({ children }) => (
    <Box component="ul" sx={{ pl: 2.5, m: 0, mb: 0.75 }}>
      {children}
    </Box>
  ),
  ol: ({ children }) => (
    <Box component="ol" sx={{ pl: 2.5, m: 0, mb: 0.75 }}>
      {children}
    </Box>
  ),
  li: ({ children }) => (
    <Box component="li" sx={{ fontSize: "14px", lineHeight: 1.65, mb: 0.25 }}>
      {children}
    </Box>
  ),
  strong: ({ children }) => (
    <Box component="strong" sx={{ fontWeight: 700 }}>
      {children}
    </Box>
  ),
  em: ({ children }) => (
    <Box component="em" sx={{ fontStyle: "italic" }}>
      {children}
    </Box>
  ),
  code: ({ inline, children }) =>
    inline ? (
      <Box
        component="code"
        sx={{
          backgroundColor: "rgba(0,0,0,0.1)",
          borderRadius: "4px",
          px: 0.6,
          py: 0.1,
          fontFamily: "monospace",
          fontSize: "13px",
        }}
      >
        {children}
      </Box>
    ) : (
      <Box
        component="pre"
        sx={{
          backgroundColor: "#1e1e1e",
          color: "#d4d4d4",
          borderRadius: "8px",
          p: 1.5,
          overflowX: "auto",
          fontSize: "13px",
          fontFamily: "monospace",
          m: 0,
          mt: 0.5,
          mb: 0.75,
        }}
      >
        <code>{children}</code>
      </Box>
    ),
  blockquote: ({ children }) => (
    <Box
      component="blockquote"
      sx={{
        borderLeft: "3px solid #00305B",
        pl: 1.5,
        ml: 0,
        my: 0.75,
        color: "#555",
        fontStyle: "italic",
      }}
    >
      {children}
    </Box>
  ),
  table: ({ children }) => (
    <Box sx={{ overflowX: "auto", my: 0.75 }}>
      <Box
        component="table"
        sx={{ borderCollapse: "collapse", width: "100%", fontSize: "13px" }}
      >
        {children}
      </Box>
    </Box>
  ),
  th: ({ children }) => (
    <Box
      component="th"
      sx={{
        border: "1px solid #ccc",
        px: 1,
        py: 0.5,
        backgroundColor: "#f0f4f8",
        fontWeight: 700,
        textAlign: "left",
        fontSize: "13px",
      }}
    >
      {children}
    </Box>
  ),
  td: ({ children }) => (
    <Box
      component="td"
      sx={{
        border: "1px solid #ccc",
        px: 1,
        py: 0.5,
        textAlign: "left",
        fontSize: "13px",
      }}
    >
      {children}
    </Box>
  ),
};

// ── Main component ────────────────────────────────────────────────────────────

const LexiMessages = ({ messages, isTyping }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        px: 2,
        py: 1.5,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        scrollbarWidth: "thin",
        scrollbarColor: "#d0d0d0 transparent",
        "&::-webkit-scrollbar": { width: "4px" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#d0d0d0",
          borderRadius: "4px",
        },
      }}
      aria-live="polite"
      aria-atomic="false"
      aria-label="Lexi conversation"
    >
      {/* Empty state */}
      {messages.length === 0 && !isTyping && (
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            py: 4,
            opacity: 0.75,
          }}
        >
          <Avatar
            src="/assets/images/AIChat.png"
            alt="Lexi"
            sx={{ width: 64, height: 64, bgcolor: "#f0f4f8" }}
          />
          <Typography
            sx={{
              fontSize: "14px",
              color: "#555",
              textAlign: "center",
              maxWidth: 260,
              lineHeight: 1.6,
            }}
          >
            Hi! I&apos;m <strong>Lexi</strong>, your AI assistant. Ask me
            anything about Ralli or your job search!
          </Typography>
        </Box>
      )}

      {/* Messages */}
      {messages.map((msg, idx) => {
        const isUser = msg.role === "user";
        const isSystem = msg.role === "system";

        if (isSystem) {
          return (
            <Box
              key={idx}
              sx={{
                alignSelf: "center",
                backgroundColor: "#fff3e0",
                border: "1px solid #ffb74d",
                borderRadius: "8px",
                px: 2,
                py: 1,
                maxWidth: "90%",
              }}
            >
              <Typography
                sx={{ fontSize: "13px", color: "#e65100", textAlign: "center" }}
              >
                {msg.content}
              </Typography>
            </Box>
          );
        }

        return (
          <Box
            key={idx}
            sx={{
              display: "flex",
              justifyContent: isUser ? "flex-end" : "flex-start",
              alignItems: "flex-end",
              gap: 1,
            }}
          >
            {!isUser && (
              <Avatar
                src="/assets/images/supportAI.png"
                alt="Lexi"
                sx={{ width: 28, height: 28, flexShrink: 0 }}
              />
            )}
            <Box
              sx={{
                maxWidth: "75%",
                p: 1.5,
                borderRadius: isUser
                  ? "16px 16px 4px 16px"
                  : "16px 16px 16px 4px",
                backgroundColor: isUser ? "#00305B" : "#F1F0F0",
                color: isUser ? "#fff" : "#111",
              }}
            >
              {isUser ? (
                <Typography
                  sx={{
                    fontSize: "14px",
                    lineHeight: 1.65,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.content}
                </Typography>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={md}
                >
                  {msg.content}
                </ReactMarkdown>
              )}
            </Box>
          </Box>
        );
      })}

      {/* Typing indicator */}
      {isTyping && (
        <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
          <Avatar
            src="/assets/images/supportAI.png"
            alt="Lexi is typing"
            sx={{ width: 28, height: 28, flexShrink: 0 }}
          />
          <Box
            sx={{
              backgroundColor: "#F1F0F0",
              borderRadius: "16px 16px 16px 4px",
            }}
          >
            <TypingIndicator />
          </Box>
        </Box>
      )}

      <div ref={bottomRef} />
    </Box>
  );
};

export default LexiMessages;
