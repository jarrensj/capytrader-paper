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
  { position: [4, 0, 3], scale: 1.2, variant: 0 },
  { position: [-6, 0, -3], scale: 1.5, variant: 1 },
  { position: [9, 0, -10], scale: 1.0, variant: 2 },
  { position: [-12, 0, 7], scale: 1.3, variant: 3 },
  { position: [14, 0, 8], scale: 0.9, variant: 0 },
  { position: [-4, 0, -12], scale: 1.4, variant: 1 },
  { position: [2, 0, 10], scale: 1.1, variant: 2 },
  { position: [-14, 0, -8], scale: 1.6, variant: 3 },
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
