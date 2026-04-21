"use client";

import { useEffect, useState } from "react";
import BaseModal from "./BaseModal";

interface BasketballModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PolymarketMarket {
  id: string;
  question: string;
  outcomes: string | string[];
  outcomePrices: string | string[];
  slug?: string;
  endDate?: string;
}

interface PolymarketEvent {
  id: string;
  title: string;
  slug: string;
  startDate?: string;
  endDate?: string;
  markets: PolymarketMarket[];
}

function parseArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function isToday(iso?: string): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function formatTipoff(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function BasketballModal({ isOpen, onClose }: BasketballModalProps) {
  const [events, setEvents] = useState<PolymarketEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const url = new URL("https://gamma-api.polymarket.com/events");
        url.searchParams.set("tag_slug", "nba");
        url.searchParams.set("closed", "false");
        url.searchParams.set("active", "true");
        url.searchParams.set("order", "endDate");
        url.searchParams.set("ascending", "true");
        url.searchParams.set("limit", "60");

        const res = await fetch(url.toString(), { signal: controller.signal });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data = (await res.json()) as PolymarketEvent[];
        setEvents(Array.isArray(data) ? data : []);
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setError("Couldn't load Polymarket odds. Try again later.");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [isOpen]);

  const todaysGames = events.filter(
    (e) => isToday(e.endDate) || isToday(e.startDate)
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="NBA Games Today"
      badge={{
        text: "Polymarket",
        backgroundColor: "#89CFF0",
        textColor: "#1a365d",
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
          Odds from Polymarket · Not investment advice
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
        Live implied odds
      </div>

      {loading && (
        <div
          style={{
            padding: 24,
            textAlign: "center",
            color: "var(--charcoal-500)",
            fontFamily: "var(--font-zen)",
            fontSize: 13,
          }}
        >
          Loading odds…
        </div>
      )}

      {error && !loading && (
        <div
          style={{
            padding: 16,
            background: "var(--matcha-100)",
            borderRadius: "0.75rem",
            border: "1px solid var(--charcoal-200)",
            color: "#b91c1c",
            fontFamily: "var(--font-zen)",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && todaysGames.length === 0 && (
        <div
          style={{
            padding: 16,
            background: "var(--matcha-100)",
            borderRadius: "0.75rem",
            border: "1px solid var(--charcoal-200)",
            color: "var(--charcoal-600)",
            fontFamily: "var(--font-zen)",
            fontSize: 13,
            textAlign: "center",
          }}
        >
          No NBA games on Polymarket today.
        </div>
      )}

      {!loading && !error && todaysGames.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
          {todaysGames.map((event) => {
            const market = event.markets?.[0];
            const outcomes = parseArray(market?.outcomes);
            const prices = parseArray(market?.outcomePrices).map((p) => Number(p));
            const tipoff = formatTipoff(event.startDate);

            return (
              <div
                key={event.id}
                style={{
                  background: "var(--matcha-100)",
                  borderRadius: "0.75rem",
                  padding: 14,
                  border: "1px solid var(--charcoal-200)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--charcoal-700)",
                      fontFamily: "var(--font-zen)",
                    }}
                  >
                    {event.title}
                  </div>
                  {tipoff && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--charcoal-500)",
                        fontFamily: "var(--font-zen)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tipoff}
                    </div>
                  )}
                </div>

                {outcomes.length > 0 && prices.length === outcomes.length ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      marginTop: 10,
                    }}
                  >
                    {outcomes.map((outcome, i) => {
                      const pct = Math.round(prices[i] * 100);
                      return (
                        <div
                          key={outcome + i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              flex: 1,
                              fontSize: 13,
                              color: "var(--charcoal-700)",
                              fontFamily: "var(--font-zen)",
                            }}
                          >
                            {outcome}
                          </div>
                          <div
                            style={{
                              position: "relative",
                              flex: 2,
                              height: 8,
                              background: "var(--charcoal-200)",
                              borderRadius: 4,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                inset: 0,
                                width: `${pct}%`,
                                background: "#89CFF0",
                              }}
                            />
                          </div>
                          <div
                            style={{
                              width: 40,
                              textAlign: "right",
                              fontSize: 13,
                              fontWeight: 600,
                              color: "var(--charcoal-700)",
                              fontFamily: "var(--font-noto)",
                            }}
                          >
                            {pct}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 12,
                      color: "var(--charcoal-500)",
                      fontFamily: "var(--font-zen)",
                    }}
                  >
                    Odds unavailable
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </BaseModal>
  );
}
