"use client";

interface BoulderProps {
  position?: [number, number, number];
  scale?: number;
  variant?: number;
}

export default function Boulder({ position = [0, 0, 0], scale = 1, variant = 0 }: BoulderProps) {
  // Soft, warm gray tones
  const colors = ["#B8B4AF", "#C4C0BB", "#A8A4A0", "#D0CCC7"];
  const mainColor = colors[variant % colors.length];
  const lightColor = colors[(variant + 1) % colors.length];

  // Different rectangular proportions based on variant
  const shapes: [number, number, number][] = [
    [1.2, 0.8, 1.0],   // wide and flat
    [0.8, 1.2, 0.9],   // tall
    [1.0, 0.7, 1.3],   // deep
    [1.1, 1.0, 0.8],   // cube-ish
  ];
  const shape = shapes[variant % shapes.length];

  return (
    <group position={position} scale={scale} rotation={[0, variant * 0.7, 0]}>
      {/* Main boulder - rounded box */}
      <mesh position={[0, shape[1] * 0.5, 0]} castShadow>
        <boxGeometry args={shape} />
        <meshStandardMaterial color={mainColor} />
      </mesh>

      {/* Small block on top */}
      <mesh position={[0.1, shape[1] + 0.25, 0.05]} castShadow rotation={[0, 0.3, 0]}>
        <boxGeometry args={[shape[0] * 0.5, 0.4, shape[2] * 0.5]} />
        <meshStandardMaterial color={lightColor} />
      </mesh>

      {/* Small friend block */}
      <mesh position={[shape[0] * 0.6, 0.2, shape[2] * 0.3]} castShadow rotation={[0, 0.5, 0]}>
        <boxGeometry args={[0.4, 0.35, 0.35]} />
        <meshStandardMaterial color={mainColor} />
      </mesh>
    </group>
  );
}
