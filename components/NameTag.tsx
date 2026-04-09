"use client";

import { Html } from "@react-three/drei";

interface NameTagProps {
  name: string;
  chatMessage?: string;
}

export default function NameTag({ name, chatMessage }: NameTagProps) {
  return (
    <>
      {chatMessage && (
        <Html
          position={[0, 2.8, 0]}
          center
          style={{
            color: "var(--charcoal-700)",
            backgroundColor: "rgba(250, 248, 240, 0.95)",
            padding: "8px 12px",
            borderRadius: "12px",
            fontSize: "13px",
            fontFamily: "var(--font-zen)",
            whiteSpace: "nowrap",
            maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            userSelect: "none",
            pointerEvents: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            animation: "fade-in 0.3s ease-out",
          }}
        >
          {chatMessage}
        </Html>
      )}
      <Html
        position={[0, 2, 0]}
        center
        style={{
          color: "#333",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "14px",
          fontWeight: "bold",
          whiteSpace: "nowrap",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {name}
      </Html>
    </>
  );
}
