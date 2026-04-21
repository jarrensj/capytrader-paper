"use client";

import BaseRock from "./BaseRock";

interface EmailRockProps {
  position?: [number, number, number];
  isNearby?: boolean;
  isActivated?: boolean;
}

export default function EmailRock({
  position = [0, 0, 0],
  isNearby = false,
  isActivated = false,
}: EmailRockProps) {
  return (
    <BaseRock
      position={position}
      isNearby={isNearby}
      isActivated={isActivated}
      colors={{
        primary: "#B19CD9",
        secondary: "#CDBCEB",
      }}
      tooltipText="to send an email"
      tooltipStyle={{
        background: "rgba(177, 156, 217, 0.95)",
        textColor: "#2d1f5c",
        border: "2px solid #8A72C2",
      }}
      activatedEmoji="📧"
    />
  );
}
