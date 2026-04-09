"use client";

interface TreeProps {
  position?: [number, number, number];
  scale?: number;
}

export default function Tree({ position = [0, 0, 0], scale = 1 }: TreeProps) {
  const trunkColor = "#6B4423";
  const leavesLight = "#8FBC8F";
  const leavesMid = "#5DB075";
  const leavesDark = "#3A9D5C";

  return (
    <group position={position} scale={scale}>
      {/* Trunk - simple cylinder */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 1.2, 12]} />
        <meshStandardMaterial color={trunkColor} />
      </mesh>

      {/* Foliage - soft rounded blobs */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.9, 16, 12]} />
        <meshStandardMaterial color={leavesMid} />
      </mesh>

      <mesh position={[0.4, 1.9, 0.3]} castShadow>
        <sphereGeometry args={[0.55, 16, 12]} />
        <meshStandardMaterial color={leavesLight} />
      </mesh>

      <mesh position={[-0.35, 2.0, -0.2]} castShadow>
        <sphereGeometry args={[0.5, 16, 12]} />
        <meshStandardMaterial color={leavesDark} />
      </mesh>

      <mesh position={[0.1, 2.3, 0]} castShadow>
        <sphereGeometry args={[0.45, 16, 12]} />
        <meshStandardMaterial color={leavesLight} />
      </mesh>
    </group>
  );
}
