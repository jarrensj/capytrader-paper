"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface MobileControlsProps {
  onMove: (direction: { x: number; z: number }) => void;
}

export default function MobileControls({ onMove }: MobileControlsProps) {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const centerRef = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (!joystickRef.current) return;
    const rect = joystickRef.current.getBoundingClientRect();
    centerRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    setActive(true);
    handleMove(clientX, clientY);
  }, []);

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!active && !centerRef.current.x) return;

      const deltaX = clientX - centerRef.current.x;
      const deltaY = clientY - centerRef.current.y;
      const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), 40);
      const angle = Math.atan2(deltaY, deltaX);

      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      setPosition({ x, y });

      // Normalize and send direction
      const normalizedX = x / 40;
      const normalizedZ = y / 40;
      onMove({ x: normalizedX, z: normalizedZ });
    },
    [active, onMove]
  );

  const handleEnd = useCallback(() => {
    setActive(false);
    setPosition({ x: 0, y: 0 });
    onMove({ x: 0, z: 0 });
  }, [onMove]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    },
    [handleStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    },
    [handleMove]
  );

  if (!isMobile) return null;

  return (
    <div
      ref={joystickRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
      style={{
        position: "fixed",
        bottom: "100px",
        right: "40px",
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        backgroundColor: "rgba(250, 248, 240, 0.8)",
        border: "2px solid var(--charcoal-300)",
        touchAction: "none",
        zIndex: 100,
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          backgroundColor: "var(--sage-200)",
          border: "1px solid var(--sage-300)",
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
          transition: active ? "none" : "transform 0.1s ease-out",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        }}
      />
    </div>
  );
}
