"use client";

import BaseModal from "./BaseModal";

interface IpoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IpoModal({ isOpen, onClose }: IpoModalProps) {
  const upcomingIpos = [
    { symbol: "ACME", company: "Acme Robotics", date: "May 2, 2026", priceRange: "$18 - $22", shares: "12.5M" },
    { symbol: "NOVA", company: "Nova Biosciences", date: "May 8, 2026", priceRange: "$24 - $28", shares: "8.0M" },
    { symbol: "LUNA", company: "Luna Energy", date: "May 15, 2026", priceRange: "$32 - $38", shares: "15.2M" },
    { symbol: "ORCA", company: "Orca Analytics", date: "May 22, 2026", priceRange: "$14 - $17", shares: "6.8M" },
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Upcoming IPOs"
      badge={{
        text: "Placeholder",
        backgroundColor: "#9B7EDE",
        textColor: "#2d1b5e",
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
        Scheduled This Month
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
        {upcomingIpos.map((ipo) => (
          <div
            key={ipo.symbol}
            style={{
              background: "var(--matcha-100)",
              borderRadius: "0.75rem",
              padding: 14,
              border: "1px solid var(--charcoal-200)",
            }}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}>
              <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--charcoal-700)",
                fontFamily: "var(--font-zen)",
              }}>
                {ipo.symbol}
              </div>
              <div style={{
                fontSize: 12,
                fontWeight: 500,
                color: "#7A5DC7",
                fontFamily: "var(--font-zen)",
              }}>
                {ipo.date}
              </div>
            </div>

            <div style={{
              fontSize: 12,
              color: "var(--charcoal-500)",
              fontFamily: "var(--font-zen)",
              marginTop: 4,
            }}>
              {ipo.company}
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginTop: 10,
            }}>
              <div style={{
                fontSize: 16,
                fontWeight: 700,
                color: "var(--charcoal-700)",
                fontFamily: "var(--font-noto)",
              }}>
                {ipo.priceRange}
              </div>
              <div style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--charcoal-500)",
                fontFamily: "var(--font-zen)",
              }}>
                {ipo.shares} shares
              </div>
            </div>
          </div>
        ))}
      </div>
    </BaseModal>
  );
}
