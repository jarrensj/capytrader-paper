"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
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

export type GreetResult =
  | { ok: true }
  | { ok: false; reason: "already-said-today" | "error" };

function isSameLocalDay(a: number, b: number) {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

export function useMultiplayer(username: string) {
  const [otherPlayers, setOtherPlayers] = useState<Map<string, PlayerState>>(new Map());
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [gmLogs, setGmLogs] = useState<GmLog[]>([]);
  const [gnLogs, setGnLogs] = useState<GnLog[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [playerId] = useState(() => crypto.randomUUID());
  // Snapshot of "today" at session start. Used to determine if a log counts as today.
  // Midnight rollover during a long session is handled by the server's unique-per-day constraint.
  const [todayAnchor] = useState(() => Date.now());
  const lastUpdateRef = useRef<number>(0);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

  // Load today's persisted gm/gn logs from Supabase on mount.
  useEffect(() => {
    const since = new Date();
    since.setUTCHours(0, 0, 0, 0);
    // Fetch a bit earlier than UTC midnight so clients in earlier timezones still see their "today".
    since.setUTCDate(since.getUTCDate() - 1);
    const sinceIso = since.toISOString();

    let cancelled = false;

    supabase
      .from("gm_logs")
      .select("id, name, created_at")
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (cancelled || !data) return;
        setGmLogs((prev) => {
          const seen = new Set(prev.map((g) => g.id));
          const next = [...prev];
          for (const row of data) {
            if (seen.has(row.id)) continue;
            next.push({
              id: row.id,
              name: row.name,
              timestamp: new Date(row.created_at).getTime(),
            });
          }
          return next;
        });
      });

    supabase
      .from("gn_logs")
      .select("id, name, created_at")
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (cancelled || !data) return;
        setGnLogs((prev) => {
          const seen = new Set(prev.map((g) => g.id));
          const next = [...prev];
          for (const row of data) {
            if (seen.has(row.id)) continue;
            next.push({
              id: row.id,
              name: row.name,
              timestamp: new Date(row.created_at).getTime(),
            });
          }
          return next;
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
        const gm = payload as GmLog;
        setGmLogs((prev) => (prev.some((g) => g.id === gm.id) ? prev : [...prev, gm]));
      })
      .on("broadcast", { event: "gn" }, ({ payload }) => {
        const gn = payload as GnLog;
        setGnLogs((prev) => (prev.some((g) => g.id === gn.id) ? prev : [...prev, gn]));
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

  const hasSaidGmToday = useMemo(() => {
    const lower = username.toLowerCase();
    return gmLogs.some(
      (g) => g.name.toLowerCase() === lower && isSameLocalDay(g.timestamp, todayAnchor)
    );
  }, [gmLogs, username, todayAnchor]);

  const hasSaidGnToday = useMemo(() => {
    const lower = username.toLowerCase();
    return gnLogs.some(
      (g) => g.name.toLowerCase() === lower && isSameLocalDay(g.timestamp, todayAnchor)
    );
  }, [gnLogs, username, todayAnchor]);

  const sendGm = useCallback(async (): Promise<GreetResult> => {
    if (!username) return { ok: false, reason: "error" };
    if (hasSaidGmToday) return { ok: false, reason: "already-said-today" };

    const { data, error } = await supabase
      .from("gm_logs")
      .insert({ name: username })
      .select("id, name, created_at")
      .single();

    if (error || !data) {
      // 23505 = unique_violation => already said today (e.g. from another tab)
      const reason = error?.code === "23505" ? "already-said-today" : "error";
      return { ok: false, reason };
    }

    const gm: GmLog = {
      id: data.id,
      name: data.name,
      timestamp: new Date(data.created_at).getTime(),
    };

    channelRef.current?.send({
      type: "broadcast",
      event: "gm",
      payload: gm,
    });

    setGmLogs((prev) => (prev.some((g) => g.id === gm.id) ? prev : [...prev, gm]));
    return { ok: true };
  }, [username, hasSaidGmToday]);

  const sendGn = useCallback(async (): Promise<GreetResult> => {
    if (!username) return { ok: false, reason: "error" };
    if (hasSaidGnToday) return { ok: false, reason: "already-said-today" };

    const { data, error } = await supabase
      .from("gn_logs")
      .insert({ name: username })
      .select("id, name, created_at")
      .single();

    if (error || !data) {
      const reason = error?.code === "23505" ? "already-said-today" : "error";
      return { ok: false, reason };
    }

    const gn: GnLog = {
      id: data.id,
      name: data.name,
      timestamp: new Date(data.created_at).getTime(),
    };

    channelRef.current?.send({
      type: "broadcast",
      event: "gn",
      payload: gn,
    });

    setGnLogs((prev) => (prev.some((g) => g.id === gn.id) ? prev : [...prev, gn]));
    return { ok: true };
  }, [username, hasSaidGnToday]);

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
    hasSaidGmToday,
    gnLogs,
    sendGn,
    hasSaidGnToday,
  };
}
