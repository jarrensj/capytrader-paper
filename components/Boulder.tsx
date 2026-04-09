"use client";

interface BoulderProps {
  position?: [number, number, number];
  scale?: number;
  variant?: number;
}

export default function Boulder({ position = [0, 0, 0], scale = 1, variant = 0 }: BoulderProps) {
  // Different gray tones for variety
  const colors = ["#8B8682", "#9A9590", "#7D7873", "#A39E99"];
  const mainColor = colors[variant % colors.length];
  const darkColor = colors[(variant + 2) % colors.length];

  return (
    <group position={position} scale={scale}>
      {/* Main boulder body - stretched sphere */}
      <mesh position={[0, 0.4, 0]} castShadow rotation={[0, variant * 0.8, 0]}>
        <sphereGeometry args={[0.8, 8, 6]} />
        <meshStandardMaterial color={mainColor} flatShading />
      </mesh>

      {/* Secondary smaller rock */}
      <mesh position={[0.5, 0.25, 0.3]} castShadow rotation={[0.2, variant * 0.5, 0.1]}>
        <sphereGeometry args={[0.4, 6, 5]} />
        <meshStandardMaterial color={darkColor} flatShading />
      </mesh>

      {/* Small accent rock */}
      <mesh position={[-0.4, 0.2, -0.2]} castShadow rotation={[0.1, -variant * 0.3, 0.2]}>
        <sphereGeometry args={[0.3, 6, 5]} />
        <meshStandardMaterial color={mainColor} flatShading />
      </mesh>
    </group>
  );
}
