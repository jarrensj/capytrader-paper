"use client";

import { ReactNode, useEffect } from "react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  badge?: {
    text: string;
    backgroundColor: string;
    textColor: string;
  };
  children: ReactNode;
  footer?: ReactNode;
}

export default function BaseModal({
  isOpen,
  onClose,
  title,
  badge,
  children,
  footer,
}: BaseModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        isolation: "isolate",
      }}
      onClick={onClose}
    >
      <div
        className="animate-fade-in"
        style={{
          backgroundColor: "var(--matcha-cream)",
          padding: 24,
          borderRadius: "1.5rem",
          maxWidth: 440,
          width: "90%",
          maxHeight: "85vh",
          overflow: "auto",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.15)",
          position: "relative",
          zIndex: 10000,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h2 style={{
              margin: 0,
              color: "var(--charcoal-800)",
              fontFamily: "var(--font-noto)",
              fontSize: 18,
              fontWeight: 500,
            }}>
              {title}
            </h2>
            {badge && (
              <span style={{
                backgroundColor: badge.backgroundColor,
                color: badge.textColor,
                fontSize: 9,
                fontWeight: 600,
                padding: "2px 6px",
                borderRadius: 4,
                fontFamily: "var(--font-zen)",
                textTransform: "uppercase",
              }}>
                {badge.text}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              color: "var(--charcoal-500)",
              padding: 4,
            }}
          >
            ×
          </button>
        </div>

        {children}

        {footer && (
          <div style={{ marginTop: 12 }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
