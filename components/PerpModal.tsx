"use client";

interface PerpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PerpModal({ isOpen, onClose }: PerpModalProps) {
  if (!isOpen) return null;

  const placeholderPerps = [
    { symbol: "BTC-PERP", price: 67432.50, change: 2.34 },
    { symbol: "ETH-PERP", price: 3521.80, change: -1.12 },
    { symbol: "SOL-PERP", price: 142.65, change: 5.67 },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        isolation: "isolate",
      }}
      onClick={onClose}
    >
      <div
        className="animate-fade-in"
        style={{
          backgroundColor: "var(--matcha-cream)",
          padding: 24,
          borderRadius: "1.5rem",
          maxWidth: 440,
          width: "90%",
          maxHeight: "85vh",
          overflow: "auto",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.15)",
          position: "relative",
          zIndex: 10000,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h2 style={{
              margin: 0,
              color: "var(--charcoal-800)",
              fontFamily: "var(--font-noto)",
              fontSize: 18,
              fontWeight: 500,
            }}>
              Perpetual Futures
            </h2>
            <span style={{
              backgroundColor: "#FFD700",
              color: "#5c4800",
              fontSize: 9,
              fontWeight: 600,
              padding: "2px 6px",
              borderRadius: 4,
              fontFamily: "var(--font-zen)",
              textTransform: "uppercase",
            }}>
              Placeholder
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              color: "var(--charcoal-500)",
              padding: 4,
            }}
          >
            ×
          </button>
        </div>

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

        <div style={{
          marginTop: 12,
          fontSize: 10,
          color: "var(--charcoal-400)",
          fontFamily: "var(--font-zen)",
          textAlign: "center",
        }}>
          Placeholder data - Coming soon
        </div>
      </div>
    </div>
  );
}
