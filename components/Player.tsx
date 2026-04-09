"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { Group, Vector3 } from "three";
import Capybara from "./Capybara";
import NameTag from "./NameTag";
import { EmoteType } from "@/hooks/useEmotes";

const MOVE_SPEED = 5;
const CAMERA_DISTANCE = 10;
const CAMERA_HEIGHT = 5;
const CAMERA_LERP_FACTOR = 0.05;
const MOUSE_SENSITIVITY = 0.003;

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
  const { camera, gl } = useThree();

  // Camera orbit angles
  const cameraAngle = useRef(0); // horizontal rotation
  const cameraPitch = useRef(0.3); // vertical angle (radians)
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = gl.domElement;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const deltaX = e.clientX - lastMouse.current.x;
      const deltaY = e.clientY - lastMouse.current.y;

      cameraAngle.current -= deltaX * MOUSE_SENSITIVITY;
      cameraPitch.current = Math.max(0.1, Math.min(1.2, cameraPitch.current + deltaY * MOUSE_SENSITIVITY));

      lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        // Only start camera drag if touch is in the right half of screen
        if (touch.clientX > window.innerWidth / 2) {
          isDragging.current = true;
          lastMouse.current = { x: touch.clientX, y: touch.clientY };
        }
      }
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || e.touches.length !== 1) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - lastMouse.current.x;
      const deltaY = touch.clientY - lastMouse.current.y;

      cameraAngle.current -= deltaX * MOUSE_SENSITIVITY;
      cameraPitch.current = Math.max(0.1, Math.min(1.2, cameraPitch.current + deltaY * MOUSE_SENSITIVITY));

      lastMouse.current = { x: touch.clientX, y: touch.clientY };
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [gl]);

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

    // Third-person camera follow with orbit
    const playerPosition = groupRef.current.position;

    // Calculate camera position based on orbit angles
    const horizontalDist = CAMERA_DISTANCE * Math.cos(cameraPitch.current);
    const verticalDist = CAMERA_DISTANCE * Math.sin(cameraPitch.current) + CAMERA_HEIGHT;

    const targetCameraPosition = new Vector3(
      playerPosition.x + Math.sin(cameraAngle.current) * horizontalDist,
      playerPosition.y + verticalDist,
      playerPosition.z + Math.cos(cameraAngle.current) * horizontalDist
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
