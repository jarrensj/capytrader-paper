"use client";

import { useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import Player from "./Player";
import Environment from "./Environment";
import EmoteButtons from "./EmoteButtons";
import MobileControls from "./MobileControls";
import OtherPlayers from "./OtherPlayers";
import { useEmotes, EmoteType } from "@/hooks/useEmotes";
import { useMultiplayer } from "@/hooks/useMultiplayer";

interface GameProps {
  username: string;
  onUsernameChange?: (name: string) => void;
}

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
];

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#90EE90" />
    </mesh>
  );
}

function Water() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8, 0.01, -5]}>
      <circleGeometry args={[6, 32]} />
      <meshStandardMaterial
        color="#4FA4DE"
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
      />
    </>
  );
}

export default function Game({ username, onUsernameChange }: GameProps) {
  const { currentEmote, triggerEmote, clearEmote } = useEmotes();
  const [mobileInput, setMobileInput] = useState({ x: 0, z: 0 });
  const [showSettings, setShowSettings] = useState(false);
  const [nameInput, setNameInput] = useState(username);
  const { otherPlayers, connected, updatePosition } = useMultiplayer(username);

  const handleMobileMove = useCallback((direction: { x: number; z: number }) => {
    setMobileInput(direction);
  }, []);

  const handleSaveName = () => {
    if (nameInput.trim() && onUsernameChange) {
      onUsernameChange(nameInput.trim());
    }
    setShowSettings(false);
  };

  return (
    <KeyboardControls map={keyboardMap}>
      <Canvas
        style={{ width: "100vw", height: "100vh" }}
        camera={{ position: [0, 5, 10], fov: 50 }}
        shadows
      >
        <color attach="background" args={["#87CEEB"]} />
        <Lights />
        <Ground />
        <Water />
        <Environment />
        <Player
          username={username}
          emote={currentEmote}
          onClearEmote={clearEmote}
          mobileInput={mobileInput}
          onPositionUpdate={updatePosition}
        />
        <OtherPlayers players={otherPlayers} />
      </Canvas>
      <EmoteButtons onEmote={(emote) => triggerEmote(emote as EmoteType)} />
      <MobileControls onMove={handleMobileMove} />
      <div
        style={{
          position: "fixed",
          top: 10,
          left: 10,
          padding: "4px 8px",
          borderRadius: 4,
          backgroundColor: connected ? "rgba(34, 197, 94, 0.8)" : "rgba(239, 68, 68, 0.8)",
          color: "white",
          fontSize: 12,
          fontWeight: "bold",
        }}
      >
        {connected ? `Online (${otherPlayers.length + 1})` : "Connecting..."}
      </div>
      <button
        onClick={() => setShowSettings(true)}
        style={{
          position: "fixed",
          top: 10,
          right: 10,
          padding: "8px 12px",
          borderRadius: 4,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {username} <span style={{ opacity: 0.7 }}>edit</span>
      </button>
      {showSettings && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
          onClick={() => setShowSettings(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: 24,
              borderRadius: 8,
              minWidth: 300,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 16px", color: "#333" }}>Settings</h3>
            <label style={{ display: "block", marginBottom: 8, color: "#666" }}>
              Name
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
                marginBottom: 16,
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={handleSaveName}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 4,
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </KeyboardControls>
  );
}
