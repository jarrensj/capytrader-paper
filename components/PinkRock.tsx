"use client";

import { Html } from "@react-three/drei";

interface PinkRockProps {
  position?: [number, number, number];
  isNearby?: boolean;
  isActivated?: boolean;
}

export default function PinkRock({
  position = [0, 0, 0],
  isNearby = false,
  isActivated = false
}: PinkRockProps) {
  return (
    <group position={position}>
      {/* Main pink rock body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[1.4, 1.0, 1.2]} />
        <meshStandardMaterial
          color="#FF69B4"
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>

      {/* Top block */}
      <mesh position={[0.1, 1.3, 0.05]} castShadow rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.8, 0.5, 0.7]} />
        <meshStandardMaterial
          color="#FF85C1"
          metalness={0.2}
          roughness={0.6}
        />
      </mesh>

      {/* Small accent */}
      <mesh position={[0.8, 0.3, 0.4]} castShadow rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial
          color="#FF69B4"
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>

      {/* Interaction prompt */}
      {isNearby && !isActivated && (
        <Html position={[0, 2.5, 0]} center>
          <div style={{
            background: "rgba(250, 248, 240, 0.95)",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontFamily: "var(--font-zen)",
            color: "var(--charcoal-700)",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}>
            Press <strong>F</strong> to interact
          </div>
        </Html>
      )}

      {/* Fishing rod emoji display */}
      {isActivated && (
        <Html position={[0, 2.5, 0]} center>
          <div style={{
            fontSize: "48px",
            animation: "bounce 0.5s ease-out",
          }}>
            🎣
          </div>
        </Html>
      )}
    </group>
  );
}
