"use client";

import BaseRock from "./BaseRock";

interface GoldenRockProps {
  position?: [number, number, number];
  isNearby?: boolean;
  isActivated?: boolean;
}

export default function GoldenRock({
  position = [0, 0, 0],
  isNearby = false,
  isActivated = false,
}: GoldenRockProps) {
  return (
    <BaseRock
      position={position}
      isNearby={isNearby}
      isActivated={isActivated}
      colors={{
        primary: "#FFD700",
        secondary: "#FFC125",
      }}
      tooltipText="to interact"
      tooltipStyle={{
        background: "rgba(250, 248, 240, 0.95)",
        textColor: "var(--charcoal-700)",
      }}
      activatedEmoji="🍣"
      metalness={{ primary: 0.6, secondary: 0.5 }}
      roughness={{ primary: 0.3, secondary: 0.4 }}
    />
  );
}
