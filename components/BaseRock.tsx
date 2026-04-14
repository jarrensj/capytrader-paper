"use client";

import { Html } from "@react-three/drei";

interface RockColors {
  primary: string;
  secondary: string;
}

interface TooltipStyle {
  background: string;
  textColor: string;
  border?: string;
}

interface BaseRockProps {
  position?: [number, number, number];
  isNearby?: boolean;
  isActivated?: boolean;
  colors: RockColors;
  tooltipText: string;
  tooltipStyle: TooltipStyle;
  activatedEmoji: string;
  metalness?: { primary: number; secondary: number };
  roughness?: { primary: number; secondary: number };
}

export default function BaseRock({
  position = [0, 0, 0],
  isNearby = false,
  isActivated = false,
  colors,
  tooltipText,
  tooltipStyle,
  activatedEmoji,
  metalness = { primary: 0.3, secondary: 0.2 },
  roughness = { primary: 0.5, secondary: 0.6 },
}: BaseRockProps) {
  return (
    <group position={position}>
      {/* Main rock body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[1.4, 1.0, 1.2]} />
        <meshStandardMaterial
          color={colors.primary}
          metalness={metalness.primary}
          roughness={roughness.primary}
        />
      </mesh>

      {/* Top block */}
      <mesh position={[0.1, 1.3, 0.05]} castShadow rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.8, 0.5, 0.7]} />
        <meshStandardMaterial
          color={colors.secondary}
          metalness={metalness.secondary}
          roughness={roughness.secondary}
        />
      </mesh>

      {/* Small accent */}
      <mesh position={[0.8, 0.3, 0.4]} castShadow rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial
          color={colors.primary}
          metalness={metalness.primary}
          roughness={roughness.primary}
        />
      </mesh>

      {/* Small secondary accent */}
      <mesh position={[-0.6, 0.4, 0.3]} castShadow rotation={[0, -0.3, 0]}>
        <boxGeometry args={[0.35, 0.35, 0.35]} />
        <meshStandardMaterial
          color={colors.secondary}
          metalness={metalness.secondary}
          roughness={roughness.secondary}
        />
      </mesh>

      {/* Interaction prompt */}
      {isNearby && !isActivated && (
        <Html position={[0, 2.5, 0]} center>
          <div style={{
            background: tooltipStyle.background,
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontFamily: "var(--font-zen)",
            color: tooltipStyle.textColor,
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            border: tooltipStyle.border || "none",
          }}>
            Press <strong>F</strong> {tooltipText}
          </div>
        </Html>
      )}

      {/* Activated emoji display */}
      {isActivated && (
        <Html position={[0, 2.5, 0]} center>
          <div style={{
            fontSize: "48px",
            animation: "bounce 0.5s ease-out",
          }}>
            {activatedEmoji}
          </div>
        </Html>
      )}
    </group>
  );
}
