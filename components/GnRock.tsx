"use client";

import BaseRock from "./BaseRock";

interface GnRockProps {
  position?: [number, number, number];
  isNearby?: boolean;
  isActivated?: boolean;
}

export default function GnRock({
  position = [0, 0, 0],
  isNearby = false,
  isActivated = false,
}: GnRockProps) {
  return (
    <BaseRock
      position={position}
      isNearby={isNearby}
      isActivated={isActivated}
      colors={{
        primary: "#3B3B6D",
        secondary: "#6C6CB0",
      }}
      tooltipText="to say gn"
      tooltipStyle={{
        background: "rgba(30, 30, 60, 0.95)",
        textColor: "#E6E6FA",
        border: "2px solid #6C6CB0",
      }}
      activatedEmoji="🌙"
    />
  );
}
