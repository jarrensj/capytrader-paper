"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Vector3 } from "three";
import { Html } from "@react-three/drei";
import { PlayerState, ChatMessage } from "@/hooks/useMultiplayer";

const LERP_FACTOR = 0.15;

interface OtherPlayerProps {
  player: PlayerState;
  chatMessage?: string;
}

function OtherPlayer({ player, chatMessage }: OtherPlayerProps) {
  const groupRef = useRef<Group>(null);
  const targetPosition = useRef(new Vector3(...player.position));

  // Update target when player data changes
  targetPosition.current.set(...player.position);

  // Smooth interpolation
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.lerp(targetPosition.current, LERP_FACTOR);
  });

  return (
    <group ref={groupRef} position={player.position}>
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
        capy
      </Html>
      {chatMessage && (
        <Html
          position={[0, 2.3, 0]}
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
      <Html
        position={[0, 1.5, 0]}
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
