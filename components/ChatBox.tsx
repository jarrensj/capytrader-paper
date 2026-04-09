"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/hooks/useMultiplayer";

type ChatBoxProps = {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
};

export function ChatBox({ messages, onSendMessage }: ChatBoxProps) {
  const [input, setInput] = useState("");
  const [hasAcceptedTOS, setHasAcceptedTOS] = useState(false);
  const [showTOS, setShowTOS] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const accepted = localStorage.getItem("chat-tos-accepted") === "true";
    setHasAcceptedTOS(accepted);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const handleAcceptTOS = () => {
    localStorage.setItem("chat-tos-accepted", "true");
    setHasAcceptedTOS(true);
    setShowTOS(false);
  };

  const handleInputClick = () => {
    if (!hasAcceptedTOS) {
      setShowTOS(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasAcceptedTOS && input.trim()) {
      onSendMessage(input);
      setInput("");
      inputRef.current?.blur();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent movement keys from being captured while typing
    const movementKeys = ["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    if (movementKeys.includes(e.code)) {
      e.stopPropagation();
    }
    // Escape to blur input and return to game
    if (e.key === "Escape") {
      e.preventDefault();
      inputRef.current?.blur();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "16px",
        width: "320px",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "rgba(250, 248, 240, 0.95)",
          backdropFilter: "blur(8px)",
          borderRadius: "1rem",
          overflow: "hidden",
          border: "1px solid var(--charcoal-200)",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div
          style={{
            height: "120px",
            overflowY: "auto",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            fontFamily: "var(--font-zen)",
          }}
        >
          {messages.length === 0 ? (
            <div style={{ color: "var(--charcoal-400)", fontSize: "13px" }}>
              No messages yet...
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} style={{ fontSize: "13px", lineHeight: 1.4 }}>
                <span style={{ color: "var(--sage-500)", fontWeight: 600 }}>
                  {msg.name}:
                </span>{" "}
                <span style={{ color: "var(--charcoal-700)" }}>{msg.text}</span>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} style={{ padding: "8px 12px 12px" }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => hasAcceptedTOS && setInput(e.target.value)}
            onClick={handleInputClick}
            onKeyDown={handleKeyDown}
            placeholder={hasAcceptedTOS ? "Type a message..." : "Accept terms to chat..."}
            maxLength={200}
            readOnly={!hasAcceptedTOS}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "0.75rem",
              border: "1px solid var(--charcoal-200)",
              background: hasAcceptedTOS ? "var(--matcha-100)" : "var(--matcha-200)",
              color: hasAcceptedTOS ? "var(--charcoal-700)" : "var(--charcoal-400)",
              fontSize: "13px",
              fontFamily: "var(--font-zen)",
              outline: "none",
              cursor: hasAcceptedTOS ? "text" : "pointer",
              transition: "border-color 0.2s ease-out, background-color 0.2s ease-out",
            }}
            onFocus={(e) => {
              if (hasAcceptedTOS) {
                e.currentTarget.style.borderColor = "var(--charcoal-400)";
              }
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--charcoal-200)";
            }}
          />
        </form>
      </div>

      {showTOS && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={() => setShowTOS(false)}
        >
          <div
            className="sketch-border animate-fade-in"
            style={{
              backgroundColor: "var(--matcha-cream)",
              padding: "28px",
              borderRadius: "1.5rem",
              maxWidth: "400px",
              margin: "16px",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{
              margin: "0 0 20px",
              color: "var(--charcoal-800)",
              fontSize: "20px",
              fontFamily: "var(--font-noto)",
              fontWeight: 500,
            }}>
              Chat Terms of Service
            </h3>
            <div style={{
              color: "var(--charcoal-600)",
              fontSize: "14px",
              lineHeight: "1.6",
              marginBottom: "24px",
              fontFamily: "var(--font-zen)",
            }}>
              <p style={{ margin: "0 0 12px" }}>By using the chat, you agree to:</p>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "var(--charcoal-500)" }}>
                <li style={{ marginBottom: "4px" }}>Be respectful to other players</li>
                <li style={{ marginBottom: "4px" }}>No harassment, hate speech, or bullying</li>
                <li style={{ marginBottom: "4px" }}>No spam or inappropriate content</li>
                <li>No sharing of personal information</li>
              </ul>
              <p style={{ margin: "16px 0 0", fontSize: "12px", color: "var(--charcoal-400)" }}>
                Violation may result in being banned from chat.
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowTOS(false)}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: "0.75rem",
                  border: "1px solid var(--charcoal-300)",
                  background: "transparent",
                  color: "var(--charcoal-600)",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontFamily: "var(--font-zen)",
                  fontWeight: 500,
                  transition: "background-color 0.2s ease-out",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--sage-50)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                Cancel
              </button>
              <button
                onClick={handleAcceptTOS}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: "0.75rem",
                  border: "none",
                  background: "var(--charcoal-700)",
                  color: "var(--matcha-cream)",
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: "14px",
                  fontFamily: "var(--font-zen)",
                  transition: "background-color 0.2s ease-out",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--charcoal-800)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--charcoal-700)"}
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
