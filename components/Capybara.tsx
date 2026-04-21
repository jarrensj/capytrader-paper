"use client";

import { Html } from "@react-three/drei";
import { EmoteType } from "@/hooks/useEmotes";

interface CapybaraProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  emote?: EmoteType;
}

// Earthy rock colors for player character
const ROCK_COLORS = {
  primary: "#8B7355",    // Warm brown
  secondary: "#A08060",  // Lighter brown
  accent: "#6B5344",     // Darker brown
};

export default function Capybara({ emote = "none" }: CapybaraProps) {
  const emoteEmoji = emote === "wave" ? "👋" : emote === "dance" ? "💃" : emote === "sit" ? "🪑" : null;

  return (
    <group>
      {/* Main rock body - scaled down version of BaseRock style */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.5, 0.4, 0.45]} />
        <meshStandardMaterial
          color={ROCK_COLORS.primary}
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>

      {/* Top block - gives it a head-like appearance */}
      <mesh position={[0, 0.55, 0.02]} castShadow rotation={[0, 0.15, 0]}>
        <boxGeometry args={[0.35, 0.22, 0.3]} />
        <meshStandardMaterial
          color={ROCK_COLORS.secondary}
          metalness={0.1}
          roughness={0.65}
        />
      </mesh>

      {/* Small accent - like a little arm/bump */}
      <mesh position={[0.28, 0.18, 0.12]} castShadow rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.15, 0.15, 0.15]} />
        <meshStandardMaterial
          color={ROCK_COLORS.accent}
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>

      {/* Other side accent */}
      <mesh position={[-0.25, 0.2, 0.08]} castShadow rotation={[0, -0.2, 0]}>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshStandardMaterial
          color={ROCK_COLORS.secondary}
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>

      {/* Emote display above the rock */}
      {emoteEmoji && (
        <Html position={[0, 1, 0]} center>
          <div style={{
            fontSize: "24px",
            animation: "bounce 0.5s ease-out",
            userSelect: "none",
            pointerEvents: "none",
          }}>
            {emoteEmoji}
          </div>
        </Html>
      )}
    </group>
  );
}
