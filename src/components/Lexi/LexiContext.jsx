"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import apiInstance from "@/services/apiService/apiServiceInstance";

const STORAGE_KEY_SESSION = "lexi_session_id";
const STORAGE_KEY_MESSAGES = "lexi_messages";
const STORAGE_KEY_OPEN = "lexi_open";
const RATE_LIMIT_DURATION_MS = 5000;

// ── Session ID helpers ────────────────────────────────────────────────────────

function generateSessionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function getOrCreateSessionId() {
  try {
    let id = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!id) {
      id = generateSessionId();
      localStorage.setItem(STORAGE_KEY_SESSION, id);
    }
    return id;
  } catch {
    return generateSessionId();
  }
}

// ── Message persistence helpers ───────────────────────────────────────────────

function loadMessages() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_MESSAGES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMessages(msgs) {
  try {
    sessionStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(msgs));
  } catch {
    // quota exceeded or private mode — silently ignore
  }
}

function loadOpenState() {
  try {
    return localStorage.getItem(STORAGE_KEY_OPEN) === "true";
  } catch {
    return false;
  }
}

// ── Context definition ────────────────────────────────────────────────────────

const LexiContext = createContext(null);

export function LexiProvider({ children }) {
  const [messages, setMessages] = useState(() => loadMessages());
  const [isOpen, setIsOpen] = useState(() => loadOpenState());
  const [isTyping, setIsTyping] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const rateLimitTimerRef = useRef(null);

  const addMessage = useCallback((msg) => {
    setMessages((prev) => {
      const next = [...prev, msg];
      saveMessages(next);
      return next;
    });
  }, []);

  const setOpen = useCallback((val) => {
    setIsOpen(val);
    try {
      localStorage.setItem(STORAGE_KEY_OPEN, String(val));
    } catch {}
  }, []);

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || isTyping || isRateLimited) return;

      addMessage({ role: "user", content: text });

      const sessionId = getOrCreateSessionId();
      setIsTyping(true);

      try {
        const response = await apiInstance.post("/ai/assistant", {
          question: text,
          session_id: sessionId,
        });

        const answer =
          response?.data?.data?.answer ?? "Sorry, I didn't get a response.";

        // If the backend echoes back / updates the session_id, persist it
        const returnedSessionId = response?.data?.data?.session_id;
        if (returnedSessionId) {
          try {
            localStorage.setItem(STORAGE_KEY_SESSION, returnedSessionId);
          } catch {}
        }

        addMessage({ role: "lexi", content: answer });
      } catch (error) {
        const status = error?.response?.status;

        if (status === 429) {
          addMessage({
            role: "system",
            content:
              "You're sending messages too quickly. Please wait a moment before trying again.",
          });
          setIsRateLimited(true);
          if (rateLimitTimerRef.current) clearTimeout(rateLimitTimerRef.current);
          rateLimitTimerRef.current = setTimeout(
            () => setIsRateLimited(false),
            RATE_LIMIT_DURATION_MS
          );
        } else if (typeof window !== "undefined" && !window.navigator.onLine) {
          addMessage({
            role: "system",
            content:
              "You appear to be offline. Please check your connection and try again.",
          });
        } else if (status === 500 || status === 503) {
          addMessage({
            role: "system",
            content:
              "Lexi is temporarily unavailable. Please try again in a moment.",
          });
        } else {
          addMessage({
            role: "system",
            content: "Something went wrong. Please try again.",
          });
        }
      } finally {
        setIsTyping(false);
      }
    },
    [isTyping, isRateLimited, addMessage]
  );

  const resetSession = useCallback(async () => {
    try {
      const sessionId =
        typeof localStorage !== "undefined"
          ? localStorage.getItem(STORAGE_KEY_SESSION)
          : null;
      if (sessionId) {
        await apiInstance.post("/ai/assistant/reset", {
          session_id: sessionId,
        });
      }
    } catch {
      // Swallow — UI has already cleared local state
    }
    try {
      localStorage.removeItem(STORAGE_KEY_SESSION);
      sessionStorage.removeItem(STORAGE_KEY_MESSAGES);
    } catch {}
    setMessages([]);
  }, []);

  // Called from CustomLayout on logout
  const clearSessionOnLogout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY_SESSION);
      sessionStorage.removeItem(STORAGE_KEY_MESSAGES);
      localStorage.removeItem(STORAGE_KEY_OPEN);
    } catch {}
    setMessages([]);
    setIsOpen(false);
  }, []);

  return (
    <LexiContext.Provider
      value={{
        messages,
        isOpen,
        setOpen,
        isTyping,
        isRateLimited,
        sendMessage,
        resetSession,
        clearSessionOnLogout,
      }}
    >
      {children}
    </LexiContext.Provider>
  );
}

export function useLexi() {
  const ctx = useContext(LexiContext);
  if (!ctx) throw new Error("useLexi must be used within LexiProvider");
  return ctx;
}
