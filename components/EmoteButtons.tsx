"use client";

import { useState } from "react";

interface EmoteButtonsProps {
  onEmote: (emote: "wave" | "dance" | "sit") => void;
}

export default function EmoteButtons({ onEmote }: EmoteButtonsProps) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const getButtonStyle = (id: string): React.CSSProperties => ({
    width: "64px",
    height: "64px",
    borderRadius: "1rem",
    border: "1px solid var(--charcoal-300)",
    backgroundColor: hoveredButton === id ? "var(--sage-100)" : "rgba(250, 248, 240, 0.9)",
    color: "var(--charcoal-700)",
    fontSize: "0.75rem",
    fontWeight: 500,
    fontFamily: "var(--font-zen)",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "2px",
    backdropFilter: "blur(8px)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    transition: "background-color 0.2s ease-out, transform 0.15s ease-out",
    transform: hoveredButton === id ? "translateY(-2px)" : "translateY(0)",
  });

  const keyStyle: React.CSSProperties = {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "var(--charcoal-600)",
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "12px",
        zIndex: 100,
      }}
    >
      <button
        style={getButtonStyle("wave")}
        onClick={() => onEmote("wave")}
        onMouseEnter={() => setHoveredButton("wave")}
        onMouseLeave={() => setHoveredButton(null)}
      >
        <span style={keyStyle}>1</span>
        <span>Wave</span>
      </button>
      <button
        style={getButtonStyle("dance")}
        onClick={() => onEmote("dance")}
        onMouseEnter={() => setHoveredButton("dance")}
        onMouseLeave={() => setHoveredButton(null)}
      >
        <span style={keyStyle}>2</span>
        <span>Dance</span>
      </button>
      <button
        style={getButtonStyle("sit")}
        onClick={() => onEmote("sit")}
        onMouseEnter={() => setHoveredButton("sit")}
        onMouseLeave={() => setHoveredButton(null)}
      >
        <span style={keyStyle}>3</span>
        <span>Sit</span>
      </button>
    </div>
  );
}
