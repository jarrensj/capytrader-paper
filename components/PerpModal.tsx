"use client";

import BaseModal from "./BaseModal";

interface PerpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PerpModal({ isOpen, onClose }: PerpModalProps) {
  const placeholderPerps = [
    { symbol: "BTC-PERP", price: 67432.50, change: 2.34 },
    { symbol: "ETH-PERP", price: 3521.80, change: -1.12 },
    { symbol: "SOL-PERP", price: 142.65, change: 5.67 },
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Perpetual Futures"
      badge={{
        text: "Placeholder",
        backgroundColor: "#FFD700",
        textColor: "#5c4800",
      }}
      footer={
        <div style={{
          fontSize: 10,
          color: "var(--charcoal-400)",
          fontFamily: "var(--font-zen)",
          textAlign: "center",
        }}>
          Placeholder data - Coming soon
        </div>
      }
    >
      <div style={{
        fontSize: 13,
        fontWeight: 500,
        color: "var(--charcoal-600)",
        fontFamily: "var(--font-zen)",
        marginBottom: 10,
      }}>
        Live Perp Prices
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
        {placeholderPerps.map((perp) => (
          <div
            key={perp.symbol}
            style={{
              background: "var(--matcha-100)",
              borderRadius: "0.75rem",
              padding: 14,
              border: "1px solid var(--charcoal-200)",
            }}
          >
            <div style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--charcoal-700)",
              fontFamily: "var(--font-zen)",
            }}>
              {perp.symbol}
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginTop: 8,
            }}>
              <div style={{
                fontSize: 24,
                fontWeight: 700,
                color: "var(--charcoal-700)",
                fontFamily: "var(--font-noto)",
              }}>
                ${perp.price.toLocaleString()}
              </div>
              <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: perp.change >= 0 ? "#22c55e" : "#ef4444",
                fontFamily: "var(--font-zen)",
              }}>
                {perp.change >= 0 ? "+" : ""}{perp.change}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </BaseModal>
  );
}
