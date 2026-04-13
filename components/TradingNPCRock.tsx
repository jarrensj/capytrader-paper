"use client";

import { Html } from "@react-three/drei";

interface TradingNPCRockProps {
  position?: [number, number, number];
  isNearby?: boolean;
  isActivated?: boolean;
}

export default function TradingNPCRock({
  position = [0, 0, 0],
  isNearby = false,
  isActivated = false
}: TradingNPCRockProps) {
  return (
    <group position={position}>
      {/* Main baby blue rock body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[1.4, 1.0, 1.2]} />
        <meshStandardMaterial
          color="#89CFF0"
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>

      {/* Top lighter blue block */}
      <mesh position={[0.1, 1.3, 0.05]} castShadow rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.8, 0.5, 0.7]} />
        <meshStandardMaterial
          color="#A7D8F0"
          metalness={0.2}
          roughness={0.6}
        />
      </mesh>

      {/* Small blue accent */}
      <mesh position={[0.8, 0.3, 0.4]} castShadow rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial
          color="#89CFF0"
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>

      {/* Small lighter blue accent */}
      <mesh position={[-0.6, 0.4, 0.3]} castShadow rotation={[0, -0.3, 0]}>
        <boxGeometry args={[0.35, 0.35, 0.35]} />
        <meshStandardMaterial
          color="#A7D8F0"
          metalness={0.2}
          roughness={0.6}
        />
      </mesh>

      {/* Interaction prompt */}
      {isNearby && !isActivated && (
        <Html position={[0, 2.5, 0]} center>
          <div style={{
            background: "rgba(137, 207, 240, 0.95)",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontFamily: "var(--font-zen)",
            color: "#1a365d",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            border: "2px solid #5BA3C6",
          }}>
            Press <strong>F</strong> to check basketball
          </div>
        </Html>
      )}

      {/* Basketball emoji display */}
      {isActivated && (
        <Html position={[0, 2.5, 0]} center>
          <div style={{
            fontSize: "48px",
            animation: "bounce 0.5s ease-out",
          }}>
            🏀
          </div>
        </Html>
      )}
    </group>
  );
}
