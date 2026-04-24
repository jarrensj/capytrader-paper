"use client";

import BaseModal from "./BaseModal";
import { GreetingLog } from "@/hooks/useMultiplayer";

interface GreetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: GreetingLog[];
  greeting: "gm" | "gn";
  emoji: string;
  badgeBackgroundColor: string;
  badgeTextColor: string;
}

function isSameDay(a: number, b: number) {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function GreetingModal({
  isOpen,
  onClose,
  logs,
  greeting,
  emoji,
  badgeBackgroundColor,
  badgeTextColor,
}: GreetingModalProps) {
  const now = Date.now();
  const todays = logs
    .filter((log) => isSameDay(log.timestamp, now))
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${greeting} Rock ${emoji}`}
      badge={{
        text: `${todays.length} today`,
        backgroundColor: badgeBackgroundColor,
        textColor: badgeTextColor,
      }}
      footer={
        <div
          style={{
            fontSize: 10,
            color: "var(--charcoal-400)",
            fontFamily: "var(--font-zen)",
            textAlign: "center",
          }}
        >
          Resets at midnight · only {greeting}s from players online are shown
        </div>
      }
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "var(--charcoal-600)",
          fontFamily: "var(--font-zen)",
          marginBottom: 10,
        }}
      >
        Today&apos;s {greeting}s
      </div>

      {todays.length === 0 ? (
        <div
          style={{
            background: "var(--matcha-100)",
            borderRadius: "0.75rem",
            padding: 24,
            border: "1px solid var(--charcoal-200)",
            textAlign: "center",
            color: "var(--charcoal-500)",
            fontFamily: "var(--font-zen)",
            fontSize: 13,
          }}
        >
          No {greeting}s yet today. Be the first to say {greeting}!
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            maxHeight: 340,
            overflowY: "auto",
            paddingRight: 4,
          }}
        >
          {todays.map((log) => (
            <div
              key={log.id}
              style={{
                background: "var(--matcha-100)",
                borderRadius: "0.75rem",
                padding: "10px 14px",
                border: "1px solid var(--charcoal-200)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  minWidth: 0,
                }}
              >
                <span style={{ fontSize: 18 }}>{emoji}</span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--charcoal-700)",
                    fontFamily: "var(--font-zen)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {log.name}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--charcoal-500)",
                    fontFamily: "var(--font-zen)",
                  }}
                >
                  said {greeting}
                </span>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--charcoal-500)",
                  fontFamily: "var(--font-zen)",
                  fontVariantNumeric: "tabular-nums",
                  flexShrink: 0,
                }}
              >
                {formatTime(log.timestamp)}
              </div>
            </div>
          ))}
        </div>
      )}
    </BaseModal>
  );
}
