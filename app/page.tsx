"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const Game = dynamic(() => import("@/components/Game"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "#87CEEB" }} />
  ),
});

// Generate a random capy name
const generateCapyName = () => {
  const adjectives = ["Happy", "Sleepy", "Chill", "Cozy", "Fluffy", "Lazy", "Zen", "Mellow"];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const num = Math.floor(Math.random() * 100);
  return `${adj}Capy${num}`;
};

export default function Home() {
  const [username, setUsername] = useState(() => generateCapyName());

  return <Game username={username} onUsernameChange={setUsername} />;
}
