"use client";

interface BoulderProps {
  position?: [number, number, number];
  scale?: number;
  variant?: number;
}

export default function Boulder({ position = [0, 0, 0], scale = 1, variant = 0 }: BoulderProps) {
  // Soft, warm gray tones for a cuter look
  const colors = ["#B8B4AF", "#C4C0BB", "#A8A4A0", "#D0CCC7"];
  const mainColor = colors[variant % colors.length];
  const lightColor = colors[(variant + 1) % colors.length];

  return (
    <group position={position} scale={scale}>
      {/* Main boulder body - smooth and round */}
      <mesh position={[0, 0.5, 0]} castShadow rotation={[0, variant * 0.8, 0]}>
        <sphereGeometry args={[0.7, 16, 12]} />
        <meshStandardMaterial color={mainColor} />
      </mesh>

      {/* Cute bump on top */}
      <mesh position={[0.15, 0.9, 0.1]} castShadow>
        <sphereGeometry args={[0.35, 12, 10]} />
        <meshStandardMaterial color={lightColor} />
      </mesh>

      {/* Small friend rock */}
      <mesh position={[0.6, 0.25, 0.2]} castShadow rotation={[0.1, variant * 0.3, 0]}>
        <sphereGeometry args={[0.28, 12, 10]} />
        <meshStandardMaterial color={mainColor} />
      </mesh>
    </group>
  );
}
