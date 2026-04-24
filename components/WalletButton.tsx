"use client";

import { ConnectKitButton } from "connectkit";

export default function WalletButton() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, truncatedAddress, ensName }) => {
        const label = isConnected
          ? (ensName ?? truncatedAddress ?? "Connected")
          : isConnecting
            ? "Connecting..."
            : "Connect Wallet";

        return (
          <button
            onClick={show}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "0.75rem",
              backgroundColor: isConnected
                ? "var(--matcha-100)"
                : "var(--charcoal-700)",
              color: isConnected
                ? "var(--charcoal-700)"
                : "var(--matcha-cream)",
              border: isConnected
                ? "1px solid var(--charcoal-200)"
                : "none",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: 14,
              fontFamily: "var(--font-zen)",
              transition: "background-color 0.2s ease-out",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isConnected
                ? "var(--matcha-200)"
                : "var(--charcoal-800)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isConnected
                ? "var(--matcha-100)"
                : "var(--charcoal-700)";
            }}
          >
            {isConnected && (
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "var(--sage-500)",
                }}
              />
            )}
            {label}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}
