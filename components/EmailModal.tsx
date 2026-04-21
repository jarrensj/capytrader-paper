"use client";

import { useState } from "react";
import BaseModal from "./BaseModal";

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SendState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "sent" }
  | { status: "error"; message: string };

export default function EmailModal({ isOpen, onClose }: EmailModalProps) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sendState, setSendState] = useState<SendState>({ status: "idle" });

  const resetForm = () => {
    setTo("");
    setSubject("");
    setMessage("");
    setSendState({ status: "idle" });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sendState.status === "sending") return;

    setSendState({ status: "sending" });
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      setSendState({ status: "sent" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setSendState({ status: "error", message });
    }
  };

  const disabled = sendState.status === "sending";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Send an Email"
      badge={{
        text: "Resend",
        backgroundColor: "#B19CD9",
        textColor: "#2d1f5c",
      }}
      footer={
        <div style={{
          fontSize: 10,
          color: "var(--charcoal-400)",
          fontFamily: "var(--font-zen)",
          textAlign: "center",
        }}>
          Powered by Resend
        </div>
      }
    >
      {sendState.status === "sent" ? (
        <div style={{
          padding: 20,
          textAlign: "center",
          fontFamily: "var(--font-zen)",
          color: "var(--charcoal-700)",
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📬</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
            Email sent!
          </div>
          <div style={{ fontSize: 12, color: "var(--charcoal-500)", marginBottom: 16 }}>
            Your message is on its way.
          </div>
          <button
            type="button"
            onClick={resetForm}
            style={{
              padding: "10px 16px",
              borderRadius: "0.75rem",
              backgroundColor: "var(--charcoal-700)",
              color: "var(--matcha-cream)",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: 13,
              fontFamily: "var(--font-zen)",
            }}
          >
            Send another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ fontSize: 12, color: "var(--charcoal-500)", fontFamily: "var(--font-zen)" }}>
            To
            <input
              type="email"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="friend@example.com"
              disabled={disabled}
              style={{
                marginTop: 4,
                width: "100%",
                padding: "10px 12px",
                borderRadius: "0.75rem",
                border: "1px solid var(--charcoal-200)",
                backgroundColor: "var(--matcha-100)",
                boxSizing: "border-box",
                fontSize: 14,
                fontFamily: "var(--font-zen)",
                color: "var(--charcoal-700)",
                outline: "none",
              }}
            />
          </label>

          <label style={{ fontSize: 12, color: "var(--charcoal-500)", fontFamily: "var(--font-zen)" }}>
            Subject
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Hello from Capytrader"
              disabled={disabled}
              maxLength={200}
              style={{
                marginTop: 4,
                width: "100%",
                padding: "10px 12px",
                borderRadius: "0.75rem",
                border: "1px solid var(--charcoal-200)",
                backgroundColor: "var(--matcha-100)",
                boxSizing: "border-box",
                fontSize: 14,
                fontFamily: "var(--font-zen)",
                color: "var(--charcoal-700)",
                outline: "none",
              }}
            />
          </label>

          <label style={{ fontSize: 12, color: "var(--charcoal-500)", fontFamily: "var(--font-zen)" }}>
            Message
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write something nice..."
              disabled={disabled}
              rows={5}
              maxLength={5000}
              style={{
                marginTop: 4,
                width: "100%",
                padding: "10px 12px",
                borderRadius: "0.75rem",
                border: "1px solid var(--charcoal-200)",
                backgroundColor: "var(--matcha-100)",
                boxSizing: "border-box",
                fontSize: 14,
                fontFamily: "var(--font-zen)",
                color: "var(--charcoal-700)",
                outline: "none",
                resize: "vertical",
              }}
            />
          </label>

          {sendState.status === "error" && (
            <div style={{
              padding: "8px 12px",
              borderRadius: "0.5rem",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              color: "#b91c1c",
              fontSize: 12,
              fontFamily: "var(--font-zen)",
            }}>
              {sendState.message}
            </div>
          )}

          <button
            type="submit"
            disabled={disabled}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "0.75rem",
              backgroundColor: disabled ? "var(--charcoal-400)" : "var(--charcoal-700)",
              color: "var(--matcha-cream)",
              border: "none",
              cursor: disabled ? "wait" : "pointer",
              fontWeight: 500,
              fontSize: 14,
              fontFamily: "var(--font-zen)",
            }}
          >
            {disabled ? "Sending..." : "Send Email"}
          </button>
        </form>
      )}
    </BaseModal>
  );
}
