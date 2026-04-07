"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { Group, Vector3 } from "three";
import Capybara from "./Capybara";
import NameTag from "./NameTag";
import { EmoteType } from "@/hooks/useEmotes";

const MOVE_SPEED = 5;
const CAMERA_OFFSET = new Vector3(0, 5, 10);
const CAMERA_LERP_FACTOR = 0.05;
const BOUNDARY_LIMIT = 40;

interface PlayerProps {
  username: string;
  emote: EmoteType;
  onClearEmote: () => void;
  mobileInput?: { x: number; z: number };
}

export default function Player({ username, emote, onClearEmote, mobileInput = { x: 0, z: 0 } }: PlayerProps) {
  const groupRef = useRef<Group>(null);
  const [, getKeys] = useKeyboardControls();
  const velocity = useRef(new Vector3());
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const { forward, backward, left, right } = getKeys();

    // Calculate movement direction from keyboard
    const direction = new Vector3();
    if (forward) direction.z -= 1;
    if (backward) direction.z += 1;
    if (left) direction.x -= 1;
    if (right) direction.x += 1;

    // Add mobile joystick input
    direction.x += mobileInput.x;
    direction.z += mobileInput.z;

    // Normalize and apply speed
    if (direction.length() > 0.1) {
      direction.normalize();

      // Rotate capybara to face movement direction
      const angle = Math.atan2(direction.x, direction.z);
      groupRef.current.rotation.y = angle;

      velocity.current.lerp(direction.multiplyScalar(MOVE_SPEED), 0.2);

      // Clear emote when moving
      if (emote !== "none") {
        onClearEmote();
      }
    } else {
      // Slow down when no input
      velocity.current.lerp(new Vector3(0, 0, 0), 0.1);
    }

    // Apply movement
    groupRef.current.position.x += velocity.current.x * delta;
    groupRef.current.position.z += velocity.current.z * delta;

    // Boundary limits - soft push back
    const pos = groupRef.current.position;
    if (Math.abs(pos.x) > BOUNDARY_LIMIT) {
      pos.x = Math.sign(pos.x) * BOUNDARY_LIMIT;
      velocity.current.x *= -0.5;
    }
    if (Math.abs(pos.z) > BOUNDARY_LIMIT) {
      pos.z = Math.sign(pos.z) * BOUNDARY_LIMIT;
      velocity.current.z *= -0.5;
    }

    // Third-person camera follow
    const playerPosition = groupRef.current.position;
    const targetCameraPosition = new Vector3(
      playerPosition.x + CAMERA_OFFSET.x,
      playerPosition.y + CAMERA_OFFSET.y,
      playerPosition.z + CAMERA_OFFSET.z
    );

    // Smooth camera follow using lerp
    camera.position.lerp(targetCameraPosition, CAMERA_LERP_FACTOR);
    camera.lookAt(playerPosition.x, playerPosition.y + 1, playerPosition.z);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Capybara emote={emote} />
      <NameTag name={username} />
    </group>
  );
}
