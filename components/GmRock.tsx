"use client";

import BaseRock from "./BaseRock";

interface GmRockProps {
  position?: [number, number, number];
  isNearby?: boolean;
  isActivated?: boolean;
}

export default function GmRock({
  position = [0, 0, 0],
  isNearby = false,
  isActivated = false,
}: GmRockProps) {
  return (
    <BaseRock
      position={position}
      isNearby={isNearby}
      isActivated={isActivated}
      colors={{
        primary: "#F4A460",
        secondary: "#FFD39B",
      }}
      tooltipText="to say gm"
      tooltipStyle={{
        background: "rgba(255, 239, 213, 0.95)",
        textColor: "#7a4b17",
        border: "2px solid #D2A16B",
      }}
      activatedEmoji="☀️"
    />
  );
}
