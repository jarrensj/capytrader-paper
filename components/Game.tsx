"use client";

import { useState, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import Player from "./Player";
import Environment from "./Environment";
import EmoteButtons from "./EmoteButtons";
import MobileControls from "./MobileControls";
import OtherPlayers from "./OtherPlayers";
import { ChatBox } from "./ChatBox";
import Minimap from "./Minimap";
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
      <planeGeometry args={[2000, 2000]} />
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
  const [localPosition, setLocalPosition] = useState<[number, number, number]>([0, 0, 0]);
  const { otherPlayers, connected, updatePosition, messages, sendMessage } = useMultiplayer(username);

  const handleMobileMove = useCallback((direction: { x: number; z: number }) => {
    setMobileInput(direction);
  }, []);

  const handlePositionUpdate = useCallback((position: [number, number, number], rotation: number) => {
    setLocalPosition(position);
    updatePosition(position, rotation);
  }, [updatePosition]);

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
          onPositionUpdate={handlePositionUpdate}
        />
        <OtherPlayers players={otherPlayers} />
      </Canvas>
      <EmoteButtons onEmote={(emote) => triggerEmote(emote as EmoteType)} />
      <MobileControls onMove={handleMobileMove} />
      <ChatBox messages={messages} onSendMessage={sendMessage} />
      <Minimap
        localPlayer={{ name: username, position: localPosition }}
        otherPlayers={otherPlayers}
      />
      <div
        style={{
          position: "fixed",
          top: 164,
          left: 16,
          padding: "6px 12px",
          borderRadius: "0.75rem",
          backgroundColor: "rgba(250, 248, 240, 0.95)",
          backdropFilter: "blur(8px)",
          color: "var(--charcoal-700)",
          fontSize: 11,
          fontWeight: 500,
          fontFamily: "var(--font-zen)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: connected ? "var(--sage-500)" : "var(--charcoal-400)",
          }}
        />
        {connected ? `${otherPlayers.length + 1} online` : "Connecting..."}
      </div>
      <button
        onClick={() => setShowSettings(true)}
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          padding: "8px 16px",
          borderRadius: "1rem",
          backgroundColor: "var(--charcoal-700)",
          color: "var(--matcha-cream)",
          border: "none",
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 500,
          fontFamily: "var(--font-zen)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          transition: "background-color 0.2s ease-out",
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--charcoal-800)"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--charcoal-700)"}
      >
        {username} <span style={{ opacity: 0.6, fontWeight: 400 }}>edit</span>
      </button>
      {showSettings && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
          onClick={() => setShowSettings(false)}
        >
          <div
            className="sketch-border animate-fade-in"
            style={{
              backgroundColor: "var(--matcha-cream)",
              padding: 28,
              borderRadius: "1.5rem",
              minWidth: 320,
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{
              margin: "0 0 20px",
              color: "var(--charcoal-800)",
              fontFamily: "var(--font-noto)",
              fontSize: 20,
              fontWeight: 500,
            }}>
              Settings
            </h3>
            <label style={{
              display: "block",
              marginBottom: 8,
              color: "var(--charcoal-500)",
              fontFamily: "var(--font-zen)",
              fontSize: 13,
            }}>
              Name
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "0.75rem",
                border: "1px solid var(--charcoal-200)",
                backgroundColor: "var(--matcha-100)",
                marginBottom: 20,
                boxSizing: "border-box",
                fontSize: 14,
                fontFamily: "var(--font-zen)",
                color: "var(--charcoal-700)",
                outline: "none",
                transition: "border-color 0.2s ease-out",
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "var(--charcoal-400)"}
              onBlur={(e) => e.currentTarget.style.borderColor = "var(--charcoal-200)"}
            />
            <button
              onClick={handleSaveName}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "0.75rem",
                backgroundColor: "var(--charcoal-700)",
                color: "var(--matcha-cream)",
                border: "none",
                cursor: "pointer",
                fontWeight: 500,
                fontSize: 14,
                fontFamily: "var(--font-zen)",
                transition: "background-color 0.2s ease-out",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--charcoal-800)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--charcoal-700)"}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </KeyboardControls>
  );
}
