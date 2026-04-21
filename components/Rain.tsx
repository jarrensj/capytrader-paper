"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RainProps {
  count?: number;
  area?: number;
  height?: number;
  speed?: number;
  dropLength?: number;
}

export default function Rain({
  count = 1500,
  area = 80,
  height = 30,
  speed = 25,
  dropLength = 0.6,
}: RainProps) {
  const linesRef = useRef<THREE.LineSegments>(null);

  const { geometry, velocities } = useMemo(() => {
    // Seeded PRNG so initial layout is deterministic (React purity rule).
    let seed = 1337;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 0xffffffff;
    };

    const positions = new Float32Array(count * 2 * 3);
    const vels = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = (rand() - 0.5) * area;
      const y = rand() * height;
      const z = (rand() - 0.5) * area;

      positions[i * 6 + 0] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = z;

      positions[i * 6 + 3] = x;
      positions[i * 6 + 4] = y - dropLength;
      positions[i * 6 + 5] = z;

      vels[i] = speed * (0.85 + rand() * 0.3);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geometry: geo, velocities: vels };
  }, [count, area, height, speed, dropLength]);

  useFrame((_, delta) => {
    const lines = linesRef.current;
    if (!lines) return;

    const positionAttr = lines.geometry.getAttribute("position") as THREE.BufferAttribute;
    const positions = positionAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const fall = velocities[i] * delta;
      positions[i * 6 + 1] -= fall;
      positions[i * 6 + 4] -= fall;

      if (positions[i * 6 + 4] < 0) {
        const x = (Math.random() - 0.5) * area;
        const z = (Math.random() - 0.5) * area;
        positions[i * 6 + 0] = x;
        positions[i * 6 + 1] = height;
        positions[i * 6 + 2] = z;
        positions[i * 6 + 3] = x;
        positions[i * 6 + 4] = height - dropLength;
        positions[i * 6 + 5] = z;
      }
    }

    positionAttr.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry} frustumCulled={false}>
      <lineBasicMaterial color="#9ec7e8" transparent opacity={0.55} />
    </lineSegments>
  );
}
