"use client";

interface EmoteButtonsProps {
  onEmote: (emote: "wave" | "dance" | "sit") => void;
}

export default function EmoteButtons({ onEmote }: EmoteButtonsProps) {
  const buttonStyle: React.CSSProperties = {
    width: "60px",
    height: "60px",
    borderRadius: "12px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    color: "#fff",
    fontSize: "0.75rem",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "2px",
    backdropFilter: "blur(4px)",
  };

  const keyStyle: React.CSSProperties = {
    fontSize: "1.2rem",
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
      <button style={buttonStyle} onClick={() => onEmote("wave")}>
        <span style={keyStyle}>1</span>
        <span>Wave</span>
      </button>
      <button style={buttonStyle} onClick={() => onEmote("dance")}>
        <span style={keyStyle}>2</span>
        <span>Dance</span>
      </button>
      <button style={buttonStyle} onClick={() => onEmote("sit")}>
        <span style={keyStyle}>3</span>
        <span>Sit</span>
      </button>
    </div>
  );
}
