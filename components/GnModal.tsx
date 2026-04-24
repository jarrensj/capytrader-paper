"use client";

import BaseModal from "./BaseModal";
import { GnLog } from "@/hooks/useMultiplayer";

interface GnModalProps {
  isOpen: boolean;
  onClose: () => void;
  gnLogs: GnLog[];
  hasSaidGnToday: boolean;
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

export default function GnModal({ isOpen, onClose, gnLogs, hasSaidGnToday }: GnModalProps) {
  const now = Date.now();
  const todaysGns = gnLogs
    .filter((gn) => isSameDay(gn.timestamp, now))
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="gn Rock 🌙"
      badge={{
        text: `${todaysGns.length} today`,
        backgroundColor: "#3B3B6D",
        textColor: "#E6E6FA",
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
          One gn per player per day · resets at midnight UTC
        </div>
      }
    >
      {hasSaidGnToday && (
        <div
          style={{
            background: "#E6E6FA",
            border: "1px solid #6C6CB0",
            borderRadius: "0.75rem",
            padding: "10px 14px",
            marginBottom: 12,
            fontFamily: "var(--font-zen)",
            fontSize: 13,
            color: "#3B3B6D",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16 }}>🌙</span>
          You already said gn today — sweet dreams!
        </div>
      )}

      <div
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "var(--charcoal-600)",
          fontFamily: "var(--font-zen)",
          marginBottom: 10,
        }}
      >
        Today&apos;s gns
      </div>

      {todaysGns.length === 0 ? (
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
          No gns yet today. Be the first to say gn!
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
          {todaysGns.map((gn) => (
            <div
              key={gn.id}
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
                <span style={{ fontSize: 18 }}>🌙</span>
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
                  {gn.name}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--charcoal-500)",
                    fontFamily: "var(--font-zen)",
                  }}
                >
                  said gn
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
                {formatTime(gn.timestamp)}
              </div>
            </div>
          ))}
        </div>
      )}
    </BaseModal>
  );
}
