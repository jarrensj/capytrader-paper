"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls, Html } from "@react-three/drei";
import Player from "./Player";
import Environment from "./Environment";
import Rain from "./Rain";
import EmoteButtons from "./EmoteButtons";
import MobileControls from "./MobileControls";
import OtherPlayers from "./OtherPlayers";
import { ChatBox } from "./ChatBox";
import Minimap from "./Minimap";
import GoldenRock from "./GoldenRock";
import PinkRock from "./PinkRock";
import TradingNPCRock from "./TradingNPCRock";
import PerpRock from "./PerpRock";
import PerpModal from "./PerpModal";
import GmRock from "./GmRock";
import GmModal from "./GmModal";
import GnRock from "./GnRock";
import GnModal from "./GnModal";
import { useEmotes, EmoteType } from "@/hooks/useEmotes";
import { useMultiplayer } from "@/hooks/useMultiplayer";

const GOLDEN_ROCK_POSITION: [number, number, number] = [12, 0, 5];
const PINK_ROCK_POSITION: [number, number, number] = [-15, 0, 10];
const POND_POSITION: [number, number, number] = [-8, 0, -5];
const TRADING_NPC_POSITION: [number, number, number] = [18, 0, -8];
const PERP_ROCK_POSITION: [number, number, number] = [-20, 0, -15];
const GM_ROCK_POSITION: [number, number, number] = [5, 0, -18];
const GN_ROCK_POSITION: [number, number, number] = [-5, 0, -18];

interface GameProps {
  username: string;
  onUsernameChange?: (name: string) => void;
}

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
];

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[2000, 2000]} />
      <meshStandardMaterial color="#90EE90" />
    </mesh>
  );
}

interface WaterProps {
  isNearby?: boolean;
  activatedState?: "fish" | "no-rod" | null;
}

function Water({ isNearby = false, activatedState = null }: WaterProps) {
  return (
    <group position={[-8, 0, -5]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[6, 32]} />
        <meshStandardMaterial
          color="#4FA4DE"
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Interaction prompt */}
      {isNearby && !activatedState && (
        <Html position={[0, 1.5, 0]} center>
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
            Press <strong>F</strong> to fish
          </div>
        </Html>
      )}

      {/* Result display */}
      {activatedState && (
        <Html position={[0, 1.5, 0]} center>
          <div style={{
            fontSize: "48px",
            animation: "bounce 0.5s ease-out",
          }}>
            {activatedState === "fish" ? "🐟" : "❌"}
          </div>
        </Html>
      )}
    </group>
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
  const [showTOS, setShowTOS] = useState(false);
  const [nameInput, setNameInput] = useState(username);
  const [localPosition, setLocalPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [goldenRockActivated, setGoldenRockActivated] = useState(false);
  const [pinkRockActivated, setPinkRockActivated] = useState(false);
  const [hasFishingRod, setHasFishingRod] = useState(false);
  const [pondActivated, setPondActivated] = useState<"fish" | "no-rod" | null>(null);
  const [tradingNPCActivated, setTradingNPCActivated] = useState(false);
  const [perpRockActivated, setPerpRockActivated] = useState(false);
  const [showPerpModal, setShowPerpModal] = useState(false);
  const [gmRockActivated, setGmRockActivated] = useState(false);
  const [showGmModal, setShowGmModal] = useState(false);
  const [gnRockActivated, setGnRockActivated] = useState(false);
  const [showGnModal, setShowGnModal] = useState(false);
  const [recentMessages, setRecentMessages] = useState<Map<string, string>>(new Map());
  const [isMobile, setIsMobile] = useState(false);
  const { otherPlayers, connected, updatePosition, messages, sendMessage, gmLogs, sendGm, gnLogs, sendGn } = useMultiplayer(username);

  useEffect(() => {
    setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // Track recent messages for chat bubbles (show for 4 seconds)
  useEffect(() => {
    if (messages.length === 0) return;
    const latestMessage = messages[messages.length - 1];

    setRecentMessages(prev => {
      const next = new Map(prev);
      next.set(latestMessage.name, latestMessage.text);
      return next;
    });

    // Clear message after 4 seconds
    const timeout = setTimeout(() => {
      setRecentMessages(prev => {
        const next = new Map(prev);
        next.delete(latestMessage.name);
        return next;
      });
    }, 4000);

    return () => clearTimeout(timeout);
  }, [messages]);

  // Check if player is near the golden rock
  const distanceToGoldenRock = Math.sqrt(
    Math.pow(localPosition[0] - GOLDEN_ROCK_POSITION[0], 2) +
    Math.pow(localPosition[2] - GOLDEN_ROCK_POSITION[2], 2)
  );
  const isNearGoldenRock = distanceToGoldenRock < 4;

  // Check if player is near the pink rock
  const distanceToPinkRock = Math.sqrt(
    Math.pow(localPosition[0] - PINK_ROCK_POSITION[0], 2) +
    Math.pow(localPosition[2] - PINK_ROCK_POSITION[2], 2)
  );
  const isNearPinkRock = distanceToPinkRock < 4;

  // Check if player is near the pond
  const distanceToPond = Math.sqrt(
    Math.pow(localPosition[0] - POND_POSITION[0], 2) +
    Math.pow(localPosition[2] - POND_POSITION[2], 2)
  );
  const isNearPond = distanceToPond < 5;

  // Check if player is near the trading NPC rock
  const distanceToTradingNPC = Math.sqrt(
    Math.pow(localPosition[0] - TRADING_NPC_POSITION[0], 2) +
    Math.pow(localPosition[2] - TRADING_NPC_POSITION[2], 2)
  );
  const isNearTradingNPC = distanceToTradingNPC < 4;

  // Check if player is near the perp rock
  const distanceToPerpRock = Math.sqrt(
    Math.pow(localPosition[0] - PERP_ROCK_POSITION[0], 2) +
    Math.pow(localPosition[2] - PERP_ROCK_POSITION[2], 2)
  );
  const isNearPerpRock = distanceToPerpRock < 4;

  // Check if player is near the gm rock
  const distanceToGmRock = Math.sqrt(
    Math.pow(localPosition[0] - GM_ROCK_POSITION[0], 2) +
    Math.pow(localPosition[2] - GM_ROCK_POSITION[2], 2)
  );
  const isNearGmRock = distanceToGmRock < 4;

  // Check if player is near the gn rock
  const distanceToGnRock = Math.sqrt(
    Math.pow(localPosition[0] - GN_ROCK_POSITION[0], 2) +
    Math.pow(localPosition[2] - GN_ROCK_POSITION[2], 2)
  );
  const isNearGnRock = distanceToGnRock < 4;

  // Handle F key press for interactions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyF") {
        // Don't trigger if typing in an input
        if (document.activeElement instanceof HTMLInputElement) return;

        if (isNearGoldenRock && !goldenRockActivated) {
          setGoldenRockActivated(true);
          setTimeout(() => setGoldenRockActivated(false), 2000);
        }

        if (isNearPinkRock && !pinkRockActivated) {
          setPinkRockActivated(true);
          setHasFishingRod(true);
          setTimeout(() => setPinkRockActivated(false), 2000);
        }

        if (isNearPond && !pondActivated) {
          setPondActivated(hasFishingRod ? "fish" : "no-rod");
          setTimeout(() => setPondActivated(null), 2000);
        }

        if (isNearTradingNPC && !tradingNPCActivated) {
          setTradingNPCActivated(true);
          setTimeout(() => setTradingNPCActivated(false), 2000);
        }

        if (isNearPerpRock && !perpRockActivated) {
          setPerpRockActivated(true);
          setShowPerpModal(true);
          setTimeout(() => setPerpRockActivated(false), 500);
        }

        if (isNearGmRock && !gmRockActivated) {
          setGmRockActivated(true);
          sendGm();
          setShowGmModal(true);
          setTimeout(() => setGmRockActivated(false), 1500);
        }

        if (isNearGnRock && !gnRockActivated) {
          setGnRockActivated(true);
          sendGn();
          setShowGnModal(true);
          setTimeout(() => setGnRockActivated(false), 1500);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isNearGoldenRock, goldenRockActivated, isNearPinkRock, pinkRockActivated, isNearPond, pondActivated, hasFishingRod, isNearTradingNPC, tradingNPCActivated, isNearPerpRock, perpRockActivated, isNearGmRock, gmRockActivated, sendGm, isNearGnRock, gnRockActivated, sendGn]);

  const handleMobileMove = useCallback((direction: { x: number; z: number }) => {
    setMobileInput(direction);
  }, []);

  const handlePositionUpdate = useCallback((position: [number, number, number], rotation: number) => {
    setLocalPosition(position);
    updatePosition(position, rotation);
  }, [updatePosition]);

  const handleSaveName = () => {
    if (!nameInput.trim()) return;

    // Check if TOS accepted
    const hasAcceptedTOS = localStorage.getItem("chat-tos-accepted") === "true";
    if (!hasAcceptedTOS) {
      setShowTOS(true);
      return;
    }

    if (onUsernameChange) {
      onUsernameChange(nameInput.trim());
    }
    setShowSettings(false);
  };

  const handleAcceptTOS = () => {
    localStorage.setItem("chat-tos-accepted", "true");
    setShowTOS(false);
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
        onPointerDown={() => {
          // Blur any focused input when clicking on canvas
          if (document.activeElement instanceof HTMLInputElement) {
            document.activeElement.blur();
          }
        }}
      >
        <color attach="background" args={["#87CEEB"]} />
        <Lights />
        <Ground />
        <Water isNearby={isNearPond} activatedState={pondActivated} />
        <Environment />
        <Rain />
        <GoldenRock
          position={GOLDEN_ROCK_POSITION}
          isNearby={isNearGoldenRock}
          isActivated={goldenRockActivated}
        />
        <PinkRock
          position={PINK_ROCK_POSITION}
          isNearby={isNearPinkRock}
          isActivated={pinkRockActivated}
        />
        <TradingNPCRock
          position={TRADING_NPC_POSITION}
          isNearby={isNearTradingNPC}
          isActivated={tradingNPCActivated}
        />
        <PerpRock
          position={PERP_ROCK_POSITION}
          isNearby={isNearPerpRock && !showPerpModal}
          isActivated={perpRockActivated}
        />
        <GmRock
          position={GM_ROCK_POSITION}
          isNearby={isNearGmRock && !showGmModal}
          isActivated={gmRockActivated}
        />
        <GnRock
          position={GN_ROCK_POSITION}
          isNearby={isNearGnRock && !showGnModal}
          isActivated={gnRockActivated}
        />
        <Player
          username={username}
          emote={currentEmote}
          onClearEmote={clearEmote}
          mobileInput={mobileInput}
          onPositionUpdate={handlePositionUpdate}
          chatMessage={recentMessages.get(username)}
        />
        <OtherPlayers players={otherPlayers} recentMessages={recentMessages} />
      </Canvas>

      {/* Loading overlay while connecting */}
      {!connected && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(250, 248, 240, 0.9)",
            backdropFilter: "blur(8px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            gap: 16,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid var(--charcoal-200)",
              borderTopColor: "var(--sage-500)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <div
            style={{
              fontFamily: "var(--font-zen)",
              fontSize: 16,
              color: "var(--charcoal-600)",
            }}
          >
            Connecting...
          </div>
        </div>
      )}

      {/* Mobile interact button for golden rock */}
      {isMobile && isNearGoldenRock && !goldenRockActivated && (
        <button
          onClick={() => {
            setGoldenRockActivated(true);
            setTimeout(() => setGoldenRockActivated(false), 2000);
          }}
          style={{
            position: "fixed",
            bottom: 240,
            right: 50,
            width: 70,
            height: 70,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 215, 0, 0.9)",
            border: "3px solid #FFC125",
            color: "var(--charcoal-700)",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "var(--font-zen)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            zIndex: 100,
          }}
        >
          Interact
        </button>
      )}

      {/* Mobile interact button for pink rock */}
      {isMobile && isNearPinkRock && !pinkRockActivated && (
        <button
          onClick={() => {
            setPinkRockActivated(true);
            setHasFishingRod(true);
            setTimeout(() => setPinkRockActivated(false), 2000);
          }}
          style={{
            position: "fixed",
            bottom: 240,
            right: 50,
            width: 70,
            height: 70,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 105, 180, 0.9)",
            border: "3px solid #FF85C1",
            color: "var(--charcoal-700)",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "var(--font-zen)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            zIndex: 100,
          }}
        >
          Interact
        </button>
      )}

      {/* Mobile interact button for pond */}
      {isMobile && isNearPond && !pondActivated && (
        <button
          onClick={() => {
            setPondActivated(hasFishingRod ? "fish" : "no-rod");
            setTimeout(() => setPondActivated(null), 2000);
          }}
          style={{
            position: "fixed",
            bottom: 240,
            right: 50,
            width: 70,
            height: 70,
            borderRadius: "50%",
            backgroundColor: "rgba(79, 164, 222, 0.9)",
            border: "3px solid #6BB8E8",
            color: "white",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "var(--font-zen)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            zIndex: 100,
          }}
        >
          Fish
        </button>
      )}

      {/* Mobile interact button for trading NPC rock */}
      {isMobile && isNearTradingNPC && !tradingNPCActivated && (
        <button
          onClick={() => {
            setTradingNPCActivated(true);
            setTimeout(() => setTradingNPCActivated(false), 2000);
          }}
          style={{
            position: "fixed",
            bottom: 240,
            right: 50,
            width: 70,
            height: 70,
            borderRadius: "50%",
            backgroundColor: "rgba(137, 207, 240, 0.9)",
            border: "3px solid #5BA3C6",
            color: "#1a365d",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "var(--font-zen)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            zIndex: 100,
          }}
        >
          Interact
        </button>
      )}

      {/* Mobile interact button for perp rock */}
      {isMobile && isNearPerpRock && !perpRockActivated && (
        <button
          onClick={() => {
            setPerpRockActivated(true);
            setShowPerpModal(true);
            setTimeout(() => setPerpRockActivated(false), 500);
          }}
          style={{
            position: "fixed",
            bottom: 240,
            right: 50,
            width: 70,
            height: 70,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 215, 0, 0.9)",
            border: "3px solid #CCA700",
            color: "#5c4800",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "var(--font-zen)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            zIndex: 100,
          }}
        >
          Interact
        </button>
      )}

      {/* Mobile interact button for gm rock */}
      {isMobile && isNearGmRock && !gmRockActivated && (
        <button
          onClick={() => {
            setGmRockActivated(true);
            sendGm();
            setShowGmModal(true);
            setTimeout(() => setGmRockActivated(false), 1500);
          }}
          style={{
            position: "fixed",
            bottom: 240,
            right: 50,
            width: 70,
            height: 70,
            borderRadius: "50%",
            backgroundColor: "rgba(244, 164, 96, 0.9)",
            border: "3px solid #D2A16B",
            color: "#7a4b17",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "var(--font-zen)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            zIndex: 100,
          }}
        >
          gm
        </button>
      )}

      {/* Mobile interact button for gn rock */}
      {isMobile && isNearGnRock && !gnRockActivated && (
        <button
          onClick={() => {
            setGnRockActivated(true);
            sendGn();
            setShowGnModal(true);
            setTimeout(() => setGnRockActivated(false), 1500);
          }}
          style={{
            position: "fixed",
            bottom: 240,
            right: 50,
            width: 70,
            height: 70,
            borderRadius: "50%",
            backgroundColor: "rgba(59, 59, 109, 0.9)",
            border: "3px solid #6C6CB0",
            color: "#E6E6FA",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "var(--font-zen)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            zIndex: 100,
          }}
        >
          gn
        </button>
      )}

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
      <div
        style={{
          position: "fixed",
          top: 200,
          left: 16,
          padding: "4px 10px",
          borderRadius: "0.5rem",
          backgroundColor: "var(--sage-500)",
          color: "var(--matcha-cream)",
          fontSize: 10,
          fontWeight: 600,
          fontFamily: "var(--font-zen)",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        Beta
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

      {/* TOS Modal for name change */}
      {showTOS && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
          }}
          onClick={() => setShowTOS(false)}
        >
          <div
            className="sketch-border animate-fade-in"
            style={{
              backgroundColor: "var(--matcha-cream)",
              padding: "28px",
              borderRadius: "1.5rem",
              maxWidth: "400px",
              margin: "16px",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{
              margin: "0 0 20px",
              color: "var(--charcoal-800)",
              fontSize: "20px",
              fontFamily: "var(--font-noto)",
              fontWeight: 500,
            }}>
              Terms of Service
            </h3>
            <div style={{
              color: "var(--charcoal-600)",
              fontSize: "14px",
              lineHeight: "1.6",
              marginBottom: "24px",
              fontFamily: "var(--font-zen)",
            }}>
              <p style={{ margin: "0 0 12px" }}>By continuing, you agree to:</p>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "var(--charcoal-500)" }}>
                <li style={{ marginBottom: "4px" }}>Be respectful to other players</li>
                <li style={{ marginBottom: "4px" }}>No harassment, hate speech, or bullying</li>
                <li style={{ marginBottom: "4px" }}>No inappropriate names or content</li>
                <li>No sharing of personal information</li>
              </ul>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowTOS(false)}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: "0.75rem",
                  border: "1px solid var(--charcoal-300)",
                  background: "transparent",
                  color: "var(--charcoal-600)",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontFamily: "var(--font-zen)",
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAcceptTOS}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: "0.75rem",
                  border: "none",
                  background: "var(--charcoal-700)",
                  color: "var(--matcha-cream)",
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: "14px",
                  fontFamily: "var(--font-zen)",
                }}
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}

      <PerpModal isOpen={showPerpModal} onClose={() => setShowPerpModal(false)} />
      <GmModal isOpen={showGmModal} onClose={() => setShowGmModal(false)} gmLogs={gmLogs} />
      <GnModal isOpen={showGnModal} onClose={() => setShowGnModal(false)} gnLogs={gnLogs} />
    </KeyboardControls>
  );
}
