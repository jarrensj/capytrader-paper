"use client";

import { Html } from "@react-three/drei";
import { EmoteType } from "@/hooks/useEmotes";

interface CapybaraProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  emote?: EmoteType;
}

export default function Capybara({ emote = "none" }: CapybaraProps) {
  return (
    <Html
      center
      style={{
        fontSize: "32px",
        fontWeight: "bold",
        color: "#8B7355",
        textShadow: "2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff",
        userSelect: "none",
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      {emote === "wave" ? "capy 👋" : emote === "dance" ? "capy 💃" : emote === "sit" ? "capy 🪑" : "capy"}
    </Html>
  );
}
