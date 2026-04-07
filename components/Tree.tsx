"use client";

interface TreeProps {
  position?: [number, number, number];
  scale?: number;
}

export default function Tree({ position = [0, 0, 0], scale = 1 }: TreeProps) {
  const trunkColor = "#8B4513";
  const leavesColor = "#228B22";

  return (
    <group position={position} scale={scale}>
      {/* Trunk - cylinder */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 1, 8]} />
        <meshStandardMaterial color={trunkColor} />
      </mesh>

      {/* Leaves - stacked cones for low-poly look */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <coneGeometry args={[0.8, 1.2, 8]} />
        <meshStandardMaterial color={leavesColor} />
      </mesh>

      <mesh position={[0, 2.0, 0]} castShadow>
        <coneGeometry args={[0.6, 1.0, 8]} />
        <meshStandardMaterial color={leavesColor} />
      </mesh>

      <mesh position={[0, 2.6, 0]} castShadow>
        <coneGeometry args={[0.4, 0.8, 8]} />
        <meshStandardMaterial color={leavesColor} />
      </mesh>
    </group>
  );
}
