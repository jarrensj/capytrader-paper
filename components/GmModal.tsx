"use client";

import BaseModal from "./BaseModal";
import { GmLog } from "@/hooks/useMultiplayer";

interface GmModalProps {
  isOpen: boolean;
  onClose: () => void;
  gmLogs: GmLog[];
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

export default function GmModal({ isOpen, onClose, gmLogs }: GmModalProps) {
  const now = Date.now();
  const todaysGms = gmLogs
    .filter((gm) => isSameDay(gm.timestamp, now))
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="gm Rock ☀️"
      badge={{
        text: `${todaysGms.length} today`,
        backgroundColor: "#F4A460",
        textColor: "#7a4b17",
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
          Resets at midnight · only gms from players online are shown
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
        Today&apos;s gms
      </div>

      {todaysGms.length === 0 ? (
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
          No gms yet today. Be the first to say gm!
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
          {todaysGms.map((gm) => (
            <div
              key={gm.id}
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
                <span style={{ fontSize: 18 }}>☀️</span>
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
                  {gm.name}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--charcoal-500)",
                    fontFamily: "var(--font-zen)",
                  }}
                >
                  said gm
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
                {formatTime(gm.timestamp)}
              </div>
            </div>
          ))}
        </div>
      )}
    </BaseModal>
  );
}
