"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

export type PlayerState = {
  id: string;
  name: string;
  position: [number, number, number];
  rotation: number;
};

export function useMultiplayer(username: string) {
  const [otherPlayers, setOtherPlayers] = useState<Map<string, PlayerState>>(new Map());
  const [connected, setConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [playerId] = useState(() => crypto.randomUUID());
  const lastUpdateRef = useRef<number>(0);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!username || !playerId) return;

    const channel = supabase.channel("capyworld-room");

    channel
      .on("broadcast", { event: "player-update" }, ({ payload }) => {
        if (payload.id !== playerId) {
          setOtherPlayers((prev) => {
            const next = new Map(prev);
            next.set(payload.id, payload as PlayerState);
            return next;
          });
        }
      })
      .on("broadcast", { event: "player-leave" }, ({ payload }) => {
        setOtherPlayers((prev) => {
          const next = new Map(prev);
          next.delete(payload.id);
          return next;
        });
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setConnected(true);
          // Announce ourselves
          channel.send({
            type: "broadcast",
            event: "player-update",
            payload: {
              id: playerId,
              name: username,
              position: [0, 0, 0],
              rotation: 0,
            },
          });
        }
      });

    channelRef.current = channel;

    // Heartbeat to keep connection alive and announce presence
    heartbeatRef.current = setInterval(() => {
      if (channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "player-update",
          payload: {
            id: playerId,
            name: username,
            position: [0, 0, 0],
            rotation: 0,
          },
        });
      }
    }, 2000);

    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
      if (channel) {
        channel.send({
          type: "broadcast",
          event: "player-leave",
          payload: { id: playerId },
        });
        channel.unsubscribe();
      }
    };
  }, [username, playerId]);

  const updatePosition = useCallback(
    (position: [number, number, number], rotation: number) => {
      const now = Date.now();
      if (now - lastUpdateRef.current < 50) return;
      lastUpdateRef.current = now;

      if (channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "player-update",
          payload: {
            id: playerId,
            name: username,
            position,
            rotation,
          },
        });
      }
    },
    [username, playerId]
  );

  return {
    otherPlayers: Array.from(otherPlayers.values()),
    connected,
    updatePosition,
    playerId,
  };
}
