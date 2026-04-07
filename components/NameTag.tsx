"use client";

import { Html } from "@react-three/drei";

interface NameTagProps {
  name: string;
}

export default function NameTag({ name }: NameTagProps) {
  return (
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
  );
}
