"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Vector3 } from "three";
import { Html } from "@react-three/drei";
import { PlayerState, ChatMessage } from "@/hooks/useMultiplayer";

const LERP_FACTOR = 0.15;

// Earthy rock colors for player character
const ROCK_COLORS = {
  primary: "#8B7355",
  secondary: "#A08060",
  accent: "#6B5344",
};

interface OtherPlayerProps {
  player: PlayerState;
  chatMessage?: string;
}

function OtherPlayer({ player, chatMessage }: OtherPlayerProps) {
  const groupRef = useRef<Group>(null);
  const targetPosition = useRef(new Vector3(...player.position));
  const targetRotation = useRef(player.rotation);

  // Update target when player data changes
  targetPosition.current.set(...player.position);
  targetRotation.current = player.rotation;

  // Smooth interpolation
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.lerp(targetPosition.current, LERP_FACTOR);
    // Smoothly interpolate rotation
    const currentY = groupRef.current.rotation.y;
    const targetY = targetRotation.current;
    groupRef.current.rotation.y = currentY + (targetY - currentY) * LERP_FACTOR;
  });

  return (
    <group ref={groupRef} position={player.position} rotation={[0, player.rotation, 0]}>
      {/* Main rock body */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.5, 0.4, 0.45]} />
        <meshStandardMaterial
          color={ROCK_COLORS.primary}
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>

      {/* Top block */}
      <mesh position={[0, 0.55, 0.02]} castShadow rotation={[0, 0.15, 0]}>
        <boxGeometry args={[0.35, 0.22, 0.3]} />
        <meshStandardMaterial
          color={ROCK_COLORS.secondary}
          metalness={0.1}
          roughness={0.65}
        />
      </mesh>

      {/* Small accent */}
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

      {/* Chat message bubble */}
      {chatMessage && (
        <Html
          position={[0, 1.3, 0]}
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
          }}
        >
          {chatMessage}
        </Html>
      )}

      {/* Name tag */}
      <Html
        position={[0, 0.95, 0]}
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
        {player.name}
      </Html>
    </group>
  );
}

interface OtherPlayersProps {
  players: PlayerState[];
  recentMessages: Map<string, string>;
}

export default function OtherPlayers({ players, recentMessages }: OtherPlayersProps) {
  return (
    <>
      {players.map((player) => (
        <OtherPlayer
          key={player.id}
          player={player}
          chatMessage={recentMessages.get(player.name)}
        />
      ))}
    </>
  );
}
