"use client";

import Tree from "./Tree";

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

export default function Environment() {
  return (
    <group>
      {trees.map((tree, index) => (
        <Tree key={index} position={tree.position} scale={tree.scale} />
      ))}
    </group>
  );
}
