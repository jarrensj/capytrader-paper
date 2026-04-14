"use client";

import BaseRock from "./BaseRock";

interface TradingNPCRockProps {
  position?: [number, number, number];
  isNearby?: boolean;
  isActivated?: boolean;
}

export default function TradingNPCRock({
  position = [0, 0, 0],
  isNearby = false,
  isActivated = false,
}: TradingNPCRockProps) {
  return (
    <BaseRock
      position={position}
      isNearby={isNearby}
      isActivated={isActivated}
      colors={{
        primary: "#89CFF0",
        secondary: "#A7D8F0",
      }}
      tooltipText="to check basketball"
      tooltipStyle={{
        background: "rgba(137, 207, 240, 0.95)",
        textColor: "#1a365d",
        border: "2px solid #5BA3C6",
      }}
      activatedEmoji="🏀"
    />
  );
}
