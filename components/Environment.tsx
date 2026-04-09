"use client";

import Tree from "./Tree";
import Boulder from "./Boulder";

const trees: { position: [number, number, number]; scale: number }[] = [
  { position: [5, 0, -8], scale: 1.0 },
  { position: [8, 0, -3], scale: 0.9 },
  { position: [10, 0, 2], scale: 1.1 },
  { position: [7, 0, 7], scale: 0.85 },
  { position: [-5, 0, 8], scale: 1.05 },
  { position: [-10, 0, 3], scale: 0.95 },
  { position: [-12, 0, -2], scale: 1.15 },
  { position: [12, 0, -6], scale: 0.9 },
  { position: [-8, 0, -10], scale: 1.0 },
  { position: [3, 0, -12], scale: 0.88 },
  { position: [-3, 0, 12], scale: 1.08 },
  { position: [15, 0, 0], scale: 0.92 },
  { position: [-15, 0, -5], scale: 1.12 },
];

const boulders: { position: [number, number, number]; scale: number; variant: number }[] = [
  // Tiny rocks
  { position: [3, 0, 2], scale: 0.4, variant: 0 },
  { position: [-2, 0, 5], scale: 0.3, variant: 1 },
  { position: [6, 0, -4], scale: 0.5, variant: 2 },
  // Small rocks
  { position: [4, 0, 8], scale: 0.8, variant: 3 },
  { position: [-7, 0, -2], scale: 0.7, variant: 0 },
  { position: [11, 0, 3], scale: 0.9, variant: 1 },
  // Medium rocks
  { position: [-10, 0, 6], scale: 1.3, variant: 2 },
  { position: [8, 0, -9], scale: 1.5, variant: 3 },
  { position: [-5, 0, -11], scale: 1.2, variant: 0 },
  // Large rocks
  { position: [15, 0, -4], scale: 2.2, variant: 1 },
  { position: [-14, 0, 10], scale: 2.5, variant: 2 },
  // HUGE rocks
  { position: [20, 0, 12], scale: 4.0, variant: 3 },
  { position: [-18, 0, -14], scale: 3.5, variant: 0 },
  { position: [-25, 0, 5], scale: 5.0, variant: 1 },
];

export default function Environment() {
  return (
    <group>
      {trees.map((tree, index) => (
        <Tree key={`tree-${index}`} position={tree.position} scale={tree.scale} />
      ))}
      {boulders.map((boulder, index) => (
        <Boulder
          key={`boulder-${index}`}
          position={boulder.position}
          scale={boulder.scale}
          variant={boulder.variant}
        />
      ))}
    </group>
  );
}
