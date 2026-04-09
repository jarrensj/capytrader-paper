"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { Group, Vector3 } from "three";
import Capybara from "./Capybara";
import NameTag from "./NameTag";
import { EmoteType } from "@/hooks/useEmotes";

const MOVE_SPEED = 5;
const MIN_CAMERA_DISTANCE = 5;
const MAX_CAMERA_DISTANCE = 25;
const DEFAULT_CAMERA_DISTANCE = 12;
const CAMERA_HEIGHT_OFFSET = 2;
const CAMERA_LERP_FACTOR = 0.08;
const MOUSE_SENSITIVITY = 0.005;
const TOUCH_SENSITIVITY = 0.008;

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

  // Camera orbit state
  const cameraAngle = useRef(0); // horizontal rotation (radians)
  const cameraPitch = useRef(0.4); // vertical angle (radians, 0 = horizontal, higher = looking down)
  const cameraDistance = useRef(DEFAULT_CAMERA_DISTANCE);
  const targetAngle = useRef(0);
  const targetPitch = useRef(0.4);
  const targetDistance = useRef(DEFAULT_CAMERA_DISTANCE);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = gl.domElement;

    const handleMouseDown = (e: MouseEvent) => {
      // Left click or right click to rotate camera
      if (e.button === 0 || e.button === 2) {
        isDragging.current = true;
        lastMouse.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const deltaX = e.clientX - lastMouse.current.x;
      const deltaY = e.clientY - lastMouse.current.y;

      targetAngle.current -= deltaX * MOUSE_SENSITIVITY;
      targetPitch.current = Math.max(0.05, Math.min(1.4, targetPitch.current + deltaY * MOUSE_SENSITIVITY));

      lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSpeed = 0.002;
      targetDistance.current = Math.max(
        MIN_CAMERA_DISTANCE,
        Math.min(MAX_CAMERA_DISTANCE, targetDistance.current + e.deltaY * zoomSpeed * targetDistance.current)
      );
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault(); // Prevent right-click menu
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        // Only start camera drag if touch is in the right half of screen
        if (touch.clientX > window.innerWidth * 0.4) {
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

      targetAngle.current -= deltaX * TOUCH_SENSITIVITY;
      targetPitch.current = Math.max(0.05, Math.min(1.4, targetPitch.current + deltaY * TOUCH_SENSITIVITY));

      lastMouse.current = { x: touch.clientX, y: touch.clientY };
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("contextmenu", handleContextMenu);
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("contextmenu", handleContextMenu);
      canvas.removeEventListener("wheel", handleWheel);
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

    // Calculate movement direction from keyboard (in local/input space)
    let inputX = 0;
    let inputZ = 0;
    if (forward) inputZ -= 1;
    if (backward) inputZ += 1;
    if (left) inputX -= 1;
    if (right) inputX += 1;

    // Add mobile joystick input (with dead zone)
    const mobileX = Math.abs(mobileInput.x) > 0.15 ? mobileInput.x : 0;
    const mobileZ = Math.abs(mobileInput.z) > 0.15 ? mobileInput.z : 0;
    inputX += mobileX;
    inputZ += mobileZ;

    // Normalize input
    const length = Math.sqrt(inputX * inputX + inputZ * inputZ);
    const isMoving = length > 0.15;

    if (isMoving) {
      inputX /= length;
      inputZ /= length;

      // Transform movement direction based on camera angle
      const cos = Math.cos(cameraAngle.current);
      const sin = Math.sin(cameraAngle.current);
      const dirX = inputX * cos - inputZ * sin;
      const dirZ = inputX * sin + inputZ * cos;

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
      velocity.current.set(0, 0, 0);
    }

    // Apply movement only if velocity is significant
    if (Math.abs(velocity.current.x) > 0.01 || Math.abs(velocity.current.z) > 0.01) {
      groupRef.current.position.x += velocity.current.x * delta;
      groupRef.current.position.z += velocity.current.z * delta;
    }

    // Smooth camera orbit interpolation
    cameraAngle.current += (targetAngle.current - cameraAngle.current) * 0.15;
    cameraPitch.current += (targetPitch.current - cameraPitch.current) * 0.15;
    cameraDistance.current += (targetDistance.current - cameraDistance.current) * 0.1;

    // Third-person camera follow with orbit
    const playerPosition = groupRef.current.position;

    // Calculate camera position based on orbit angles
    const horizontalDist = cameraDistance.current * Math.cos(cameraPitch.current);
    const verticalDist = cameraDistance.current * Math.sin(cameraPitch.current) + CAMERA_HEIGHT_OFFSET;

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
