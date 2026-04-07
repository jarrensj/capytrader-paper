"use client";

import { useState, useEffect, useCallback } from "react";

export type EmoteType = "none" | "wave" | "dance" | "sit";

export function useEmotes() {
  const [currentEmote, setCurrentEmote] = useState<EmoteType>("none");

  const triggerEmote = useCallback((emote: EmoteType) => {
    setCurrentEmote(emote);
  }, []);

  const clearEmote = useCallback(() => {
    setCurrentEmote("none");
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "1":
          setCurrentEmote("wave");
          break;
        case "2":
          setCurrentEmote("dance");
          break;
        case "3":
          setCurrentEmote("sit");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { currentEmote, triggerEmote, clearEmote };
}
