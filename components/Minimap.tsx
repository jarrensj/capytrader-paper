"use client";

import { PlayerState } from "@/hooks/useMultiplayer";

interface MinimapProps {
  localPlayer: {
    name: string;
    position: [number, number, number];
  };
  otherPlayers: PlayerState[];
  mapSize?: number;
  worldSize?: number;
}

export default function Minimap({
  localPlayer,
  otherPlayers,
  mapSize = 140,
  worldSize = 100,
}: MinimapProps) {
  const scale = mapSize / worldSize;

  const worldToMap = (x: number, z: number) => {
    const mapX = (x * scale) + mapSize / 2;
    const mapY = (z * scale) + mapSize / 2;
    return {
      x: Math.max(4, Math.min(mapSize - 4, mapX)),
      y: Math.max(4, Math.min(mapSize - 4, mapY)),
    };
  };

  const localPos = worldToMap(localPlayer.position[0], localPlayer.position[2]);

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        left: 16,
        width: mapSize,
        height: mapSize,
        borderRadius: "1rem",
        backgroundColor: "rgba(250, 248, 240, 0.95)",
        backdropFilter: "blur(8px)",
        border: "1px solid var(--charcoal-200)",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        zIndex: 1000,
      }}
    >
      {/* Map background - grass */}
      <div
        style={{
          position: "absolute",
          inset: 8,
          borderRadius: "0.5rem",
          backgroundColor: "#c8e6c0",
          overflow: "hidden",
        }}
      >
        {/* Water pond */}
        <div
          style={{
            position: "absolute",
            left: worldToMap(-8, -5).x - 8,
            top: worldToMap(-8, -5).y - 8,
            width: 16,
            height: 16,
            borderRadius: "50%",
            backgroundColor: "#89c4e8",
            opacity: 0.8,
          }}
        />

        {/* Golden rock */}
        <div
          style={{
            position: "absolute",
            left: worldToMap(12, 5).x - 5,
            top: worldToMap(12, 5).y - 5,
            width: 10,
            height: 10,
            borderRadius: "2px",
            backgroundColor: "#FFD700",
            border: "1.5px solid #CC9900",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
          title="Golden Rock"
        />

        {/* Pink rock */}
        <div
          style={{
            position: "absolute",
            left: worldToMap(-15, 10).x - 5,
            top: worldToMap(-15, 10).y - 5,
            width: 10,
            height: 10,
            borderRadius: "2px",
            backgroundColor: "#FF69B4",
            border: "1.5px solid #CC5490",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
          title="Pink Rock"
        />

        {/* Other players */}
        {otherPlayers.map((player) => {
          const pos = worldToMap(player.position[0], player.position[2]);
          return (
            <div
              key={player.id}
              style={{
                position: "absolute",
                left: pos.x - 4,
                top: pos.y - 4,
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "var(--sage-400)",
                border: "1.5px solid white",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }}
              title={player.name}
            />
          );
        })}

        {/* Local player - always on top */}
        <div
          style={{
            position: "absolute",
            left: localPos.x - 5,
            top: localPos.y - 5,
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: "var(--charcoal-700)",
            border: "2px solid white",
            boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
            zIndex: 10,
          }}
          title={localPlayer.name}
        />
      </div>

      {/* Label */}
      <div
        style={{
          position: "absolute",
          bottom: 4,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 9,
          fontFamily: "var(--font-zen)",
          color: "var(--charcoal-400)",
          fontWeight: 500,
        }}
      >
        MAP
      </div>
    </div>
  );
}
