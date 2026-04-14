"use client";

import BaseRock from "./BaseRock";

interface PerpRockProps {
  position?: [number, number, number];
  isNearby?: boolean;
  isActivated?: boolean;
}

export default function PerpRock({
  position = [0, 0, 0],
  isNearby = false,
  isActivated = false,
}: PerpRockProps) {
  return (
    <BaseRock
      position={position}
      isNearby={isNearby}
      isActivated={isActivated}
      colors={{
        primary: "#FFD700",
        secondary: "#FFEC8B",
      }}
      tooltipText="to check perps"
      tooltipStyle={{
        background: "rgba(255, 215, 0, 0.95)",
        textColor: "#5c4800",
        border: "2px solid #CCA700",
      }}
      activatedEmoji="📈"
    />
  );
}
