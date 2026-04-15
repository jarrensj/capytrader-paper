"use client";

import BaseRock from "./BaseRock";

interface PinkRockProps {
  position?: [number, number, number];
  isNearby?: boolean;
  isActivated?: boolean;
}

export default function PinkRock({
  position = [0, 0, 0],
  isNearby = false,
  isActivated = false,
}: PinkRockProps) {
  return (
    <BaseRock
      position={position}
      isNearby={isNearby}
      isActivated={isActivated}
      colors={{
        primary: "#FF69B4",
        secondary: "#FF85C1",
      }}
      tooltipText="to interact"
      tooltipStyle={{
        background: "rgba(250, 248, 240, 0.95)",
        textColor: "var(--charcoal-700)",
      }}
      activatedEmoji="🎣"
    />
  );
}
