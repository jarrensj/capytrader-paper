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

export type ChatMessage = {
  id: string;
  name: string;
  text: string;
  timestamp: number;
};

export type GmLog = {
  id: string;
  name: string;
  timestamp: number;
};

export type GnLog = {
  id: string;
  name: string;
  timestamp: number;
};

export function useMultiplayer(username: string) {
  const [otherPlayers, setOtherPlayers] = useState<Map<string, PlayerState>>(new Map());
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [gmLogs, setGmLogs] = useState<GmLog[]>([]);
  const [gnLogs, setGnLogs] = useState<GnLog[]>([]);
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
      .on("broadcast", { event: "chat-message" }, ({ payload }) => {
        setMessages((prev) => [...prev.slice(-49), payload as ChatMessage]);
      })
      .on("broadcast", { event: "gm" }, ({ payload }) => {
        setGmLogs((prev) => [...prev, payload as GmLog]);
      })
      .on("broadcast", { event: "gn" }, ({ payload }) => {
        setGnLogs((prev) => [...prev, payload as GnLog]);
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

  const sendGm = useCallback(() => {
    if (!channelRef.current) return;

    const gm: GmLog = {
      id: crypto.randomUUID(),
      name: username,
      timestamp: Date.now(),
    };

    channelRef.current.send({
      type: "broadcast",
      event: "gm",
      payload: gm,
    });

    setGmLogs((prev) => [...prev, gm]);
  }, [username]);

  const sendGn = useCallback(() => {
    if (!channelRef.current) return;

    const gn: GnLog = {
      id: crypto.randomUUID(),
      name: username,
      timestamp: Date.now(),
    };

    channelRef.current.send({
      type: "broadcast",
      event: "gn",
      payload: gn,
    });

    setGnLogs((prev) => [...prev, gn]);
  }, [username]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !channelRef.current) return;

      const message: ChatMessage = {
        id: crypto.randomUUID(),
        name: username,
        text: text.trim(),
        timestamp: Date.now(),
      };

      channelRef.current.send({
        type: "broadcast",
        event: "chat-message",
        payload: message,
      });

      setMessages((prev) => [...prev.slice(-49), message]);

      supabase
        .from("messages")
        .insert({
          client_id: message.id,
          name: message.name,
          text: message.text,
        })
        .then(({ error }) => {
          if (error) console.error("Failed to log chat message", error);
        });
    },
    [username]
  );

  return {
    otherPlayers: Array.from(otherPlayers.values()),
    connected,
    updatePosition,
    playerId,
    messages,
    sendMessage,
    gmLogs,
    sendGm,
    gnLogs,
    sendGn,
  };
}
