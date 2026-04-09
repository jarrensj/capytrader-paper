"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/hooks/useMultiplayer";

type ChatBoxProps = {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
};

export function ChatBox({ messages, onSendMessage }: ChatBoxProps) {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
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

  useEffect(() => {
    if (isOpen && hasAcceptedTOS) {
      inputRef.current?.focus();
    }
  }, [isOpen, hasAcceptedTOS]);

  const handleAcceptTOS = () => {
    localStorage.setItem("chat-tos-accepted", "true");
    setHasAcceptedTOS(true);
    setShowTOS(false);
  };

  const handleOpenChat = () => {
    if (hasAcceptedTOS) {
      setIsOpen(true);
    } else {
      setShowTOS(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "100px",
        left: "16px",
        width: "300px",
        zIndex: 1000,
      }}
    >
      {isOpen ? (
        <div
          style={{
            background: "rgba(0, 0, 0, 0.7)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "150px",
              overflowY: "auto",
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            {messages.length === 0 ? (
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>
                No messages yet...
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} style={{ fontSize: "13px" }}>
                  <span style={{ color: "#7dd3fc", fontWeight: "bold" }}>
                    {msg.name}:
                  </span>{" "}
                  <span style={{ color: "white" }}>{msg.text}</span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} style={{ padding: "8px" }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              maxLength={200}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "none",
                background: "rgba(255, 255, 255, 0.1)",
                color: "white",
                fontSize: "13px",
                outline: "none",
              }}
            />
          </form>
        </div>
      ) : (
        <button
          onClick={handleOpenChat}
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          Chat {messages.length > 0 && `(${messages.length})`}
        </button>
      )}

      {showTOS && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={() => setShowTOS(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "12px",
              maxWidth: "400px",
              margin: "16px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 16px", color: "#333", fontSize: "18px" }}>
              Chat Terms of Service
            </h3>
            <div style={{ color: "#555", fontSize: "14px", lineHeight: "1.5", marginBottom: "20px" }}>
              <p style={{ margin: "0 0 12px" }}>By using the chat, you agree to:</p>
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                <li>Be respectful to other players</li>
                <li>No harassment, hate speech, or bullying</li>
                <li>No spam or inappropriate content</li>
                <li>No sharing of personal information</li>
              </ul>
              <p style={{ margin: "12px 0 0", fontSize: "12px", color: "#888" }}>
                Violation may result in being banned from chat.
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowTOS(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  background: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAcceptTOS}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#4CAF50",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
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
