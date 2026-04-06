"use client";

import { Canvas } from "@react-three/fiber";

export default function Game() {
  return (
    <Canvas
      style={{ width: "100vw", height: "100vh" }}
      camera={{ position: [0, 5, 10], fov: 50 }}
    >
      <color attach="background" args={["#87CEEB"]} />
    </Canvas>
  );
}
