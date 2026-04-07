"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Vector3 } from "three";
import { Html } from "@react-three/drei";
import { PlayerState } from "@/hooks/useMultiplayer";

const LERP_FACTOR = 0.15;

interface OtherPlayerProps {
  player: PlayerState;
}

function OtherPlayer({ player }: OtherPlayerProps) {
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
}

export default function OtherPlayers({ players }: OtherPlayersProps) {
  return (
    <>
      {players.map((player) => (
        <OtherPlayer key={player.id} player={player} />
      ))}
    </>
  );
}
