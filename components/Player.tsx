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
  onPositionUpdate?: (position: [number, number, number], rotation: number) => void;
}

export default function Player({ username, emote, onClearEmote, mobileInput = { x: 0, z: 0 }, onPositionUpdate }: PlayerProps) {
  const groupRef = useRef<Group>(null);
  const [, getKeys] = useKeyboardControls();
  const velocity = useRef(new Vector3());
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const { forward, backward, left, right } = getKeys();

    // Calculate movement direction from keyboard
    let dirX = 0;
    let dirZ = 0;
    if (forward) dirZ -= 1;
    if (backward) dirZ += 1;
    if (left) dirX -= 1;
    if (right) dirX += 1;

    // Add mobile joystick input
    dirX += mobileInput.x;
    dirZ += mobileInput.z;

    // Normalize
    const length = Math.sqrt(dirX * dirX + dirZ * dirZ);
    const isMoving = length > 0.1;

    if (isMoving) {
      dirX /= length;
      dirZ /= length;

      // Rotate capybara to face movement direction
      const angle = Math.atan2(dirX, dirZ);
      groupRef.current.rotation.y = angle;

      // Set velocity directly
      velocity.current.x = dirX * MOVE_SPEED;
      velocity.current.z = dirZ * MOVE_SPEED;

      // Clear emote when moving
      if (emote !== "none") {
        onClearEmote();
      }
    } else {
      // Stop immediately when no input
      velocity.current.x = 0;
      velocity.current.z = 0;
    }

    // Apply movement
    groupRef.current.position.x += velocity.current.x * delta;
    groupRef.current.position.z += velocity.current.z * delta;

    // Boundary limits - clamp position
    const pos = groupRef.current.position;
    pos.x = Math.max(-BOUNDARY_LIMIT, Math.min(BOUNDARY_LIMIT, pos.x));
    pos.z = Math.max(-BOUNDARY_LIMIT, Math.min(BOUNDARY_LIMIT, pos.z));

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

    // Report position for multiplayer
    if (onPositionUpdate) {
      onPositionUpdate(
        [groupRef.current.position.x, groupRef.current.position.y, groupRef.current.position.z],
        groupRef.current.rotation.y
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Capybara emote={emote} />
      <NameTag name={username} />
    </group>
  );
}
