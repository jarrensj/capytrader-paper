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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

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
          onClick={() => setIsOpen(true)}
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
    </div>
  );
}
