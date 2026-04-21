"use client";

import BaseRock from "./BaseRock";

interface IpoRockProps {
  position?: [number, number, number];
  isNearby?: boolean;
  isActivated?: boolean;
}

export default function IpoRock({
  position = [0, 0, 0],
  isNearby = false,
  isActivated = false,
}: IpoRockProps) {
  return (
    <BaseRock
      position={position}
      isNearby={isNearby}
      isActivated={isActivated}
      colors={{
        primary: "#9B7EDE",
        secondary: "#C4B1EC",
      }}
      tooltipText="to check upcoming IPOs"
      tooltipStyle={{
        background: "rgba(155, 126, 222, 0.95)",
        textColor: "#2d1b5e",
        border: "2px solid #7A5DC7",
      }}
      activatedEmoji="🚀"
    />
  );
}
