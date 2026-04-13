"use client";

import { useState, useEffect } from "react";

interface LakersMarket {
  ticker: string;
  title: string;
  yesBid: number;
  yesAsk: number;
  noBid: number;
  noAsk: number;
  lastPrice: number;
  volume: number;
}

interface NextGame {
  homeTeam: string;
  awayTeam: string;
  series: string;
  gameNumber: number;
  gameTime: string;
}

interface TradingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatGameTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function TradingModal({ isOpen, onClose }: TradingModalProps) {
  const [markets, setMarkets] = useState<LakersMarket[]>([]);
  const [nextGame, setNextGame] = useState<NextGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/kalshi/lakers");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setMarkets(data.markets || []);
        setNextGame(data.nextGame || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen]);

  if (!isOpen) return null;

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
        zIndex: 2000,
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
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{
            margin: 0,
            color: "var(--charcoal-800)",
            fontFamily: "var(--font-noto)",
            fontSize: 18,
            fontWeight: 500,
          }}>
            Lakers Predictions
          </h2>
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
            x
          </button>
        </div>

        {loading ? (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 40,
          }}>
            <div
              style={{
                width: 32,
                height: 32,
                border: "3px solid var(--charcoal-200)",
                borderTopColor: "var(--sage-500)",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
          </div>
        ) : error ? (
          <div style={{
            padding: 20,
            textAlign: "center",
            color: "var(--charcoal-500)",
            fontFamily: "var(--font-zen)",
            fontSize: 14,
          }}>
            {error}
          </div>
        ) : (
          <>
            {/* Next Game Card */}
            {nextGame && (
              <div style={{
                background: "linear-gradient(135deg, #552583 0%, #FDB927 100%)",
                borderRadius: "1rem",
                padding: 16,
                marginBottom: 16,
                color: "white",
              }}>
                <div style={{
                  fontSize: 11,
                  opacity: 0.9,
                  marginBottom: 4,
                  fontFamily: "var(--font-zen)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}>
                  {nextGame.series} - Game {nextGame.gameNumber}
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}>
                  <div style={{ fontFamily: "var(--font-noto)" }}>
                    <div style={{ fontSize: 18, fontWeight: 600 }}>
                      {nextGame.awayTeam.split(" ").pop()} @ {nextGame.homeTeam.split(" ").pop()}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 12, opacity: 0.9, fontFamily: "var(--font-zen)" }}>
                  {formatGameTime(nextGame.gameTime)}
                </div>
              </div>
            )}

            {/* Kalshi Markets */}
            <div style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--charcoal-600)",
              fontFamily: "var(--font-zen)",
              marginBottom: 10,
            }}>
              Kalshi Prediction Markets
            </div>

            {markets.length === 0 ? (
              <div style={{
                padding: 16,
                textAlign: "center",
                color: "var(--charcoal-500)",
                fontFamily: "var(--font-zen)",
                fontSize: 13,
                background: "var(--matcha-100)",
                borderRadius: "0.75rem",
                marginBottom: 12,
              }}>
                No Lakers markets available right now
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
                {markets.map((market) => (
                  <div
                    key={market.ticker}
                    style={{
                      background: "var(--matcha-100)",
                      borderRadius: "0.75rem",
                      padding: 14,
                      border: "1px solid var(--charcoal-200)",
                    }}
                  >
                    <div style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--charcoal-700)",
                      fontFamily: "var(--font-zen)",
                      marginBottom: 10,
                    }}>
                      {market.title}
                    </div>

                    {/* Price display */}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                    }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 10, color: "var(--charcoal-500)", marginBottom: 2 }}>YES</div>
                        <div style={{
                          fontSize: 24,
                          fontWeight: 700,
                          color: "#552583",
                          fontFamily: "var(--font-noto)",
                        }}>
                          {market.lastPrice.toFixed(0)}¢
                        </div>
                        <div style={{ fontSize: 10, color: "var(--charcoal-400)" }}>
                          {market.yesBid.toFixed(0)}¢ / {market.yesAsk.toFixed(0)}¢
                        </div>
                      </div>

                      <div style={{
                        width: 1,
                        height: 40,
                        background: "var(--charcoal-200)",
                      }} />

                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 10, color: "var(--charcoal-500)", marginBottom: 2 }}>NO</div>
                        <div style={{
                          fontSize: 24,
                          fontWeight: 700,
                          color: "var(--charcoal-600)",
                          fontFamily: "var(--font-noto)",
                        }}>
                          {(100 - market.lastPrice).toFixed(0)}¢
                        </div>
                        <div style={{ fontSize: 10, color: "var(--charcoal-400)" }}>
                          {market.noBid.toFixed(0)}¢ / {market.noAsk.toFixed(0)}¢
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Browse all button */}
            <button
              onClick={() => window.open("https://kalshi.com/markets?search=nba", "_blank")}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "0.75rem",
                background: "var(--charcoal-700)",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "var(--font-zen)",
              }}
            >
              Browse All NBA Markets
            </button>

            <div style={{
              marginTop: 12,
              fontSize: 10,
              color: "var(--charcoal-400)",
              fontFamily: "var(--font-zen)",
              textAlign: "center",
            }}>
              Powered by Kalshi
            </div>
          </>
        )}
      </div>
    </div>
  );
}
