import { NextResponse } from "next/server";

const KALSHI_API_BASE = "https://api.elections.kalshi.com/trade-api/v2";

interface KalshiMarket {
  ticker: string;
  title: string;
  yes_bid_dollars?: string;
  yes_ask_dollars?: string;
  no_bid_dollars?: string;
  no_ask_dollars?: string;
  last_price_dollars?: string;
  volume_fp?: string;
  close_time?: string;
  status?: string;
}

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

export async function GET() {
  try {
    // Fetch Lakers series market directly
    const lakersMarketRes = await fetch(
      `${KALSHI_API_BASE}/markets/KXNBASERIES-26HOULALR1-LAL`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 30 },
      }
    );

    // Fetch Rockets series market
    const rocketsMarketRes = await fetch(
      `${KALSHI_API_BASE}/markets/KXNBASERIES-26HOULALR1-HOU`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 30 },
      }
    );

    // Also fetch NBA championship market for Lakers
    const champRes = await fetch(
      `${KALSHI_API_BASE}/markets?series_ticker=KXNBA&status=open&limit=50`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 60 },
      }
    );

    const markets: LakersMarket[] = [];

    // Process Lakers series market
    if (lakersMarketRes.ok) {
      const data = await lakersMarketRes.json();
      const m = data.market;
      if (m) {
        markets.push({
          ticker: m.ticker,
          title: "Lakers win series vs Rockets",
          yesBid: parseFloat(m.yes_bid_dollars || "0") * 100,
          yesAsk: parseFloat(m.yes_ask_dollars || "0") * 100,
          noBid: parseFloat(m.no_bid_dollars || "0") * 100,
          noAsk: parseFloat(m.no_ask_dollars || "0") * 100,
          lastPrice: parseFloat(m.last_price_dollars || "0") * 100,
          volume: parseFloat(m.volume_fp || "0"),
        });
      }
    }

    // Process Rockets series market
    if (rocketsMarketRes.ok) {
      const data = await rocketsMarketRes.json();
      const m = data.market;
      if (m) {
        markets.push({
          ticker: m.ticker,
          title: "Rockets win series vs Lakers",
          yesBid: parseFloat(m.yes_bid_dollars || "0") * 100,
          yesAsk: parseFloat(m.yes_ask_dollars || "0") * 100,
          noBid: parseFloat(m.no_bid_dollars || "0") * 100,
          noAsk: parseFloat(m.no_ask_dollars || "0") * 100,
          lastPrice: parseFloat(m.last_price_dollars || "0") * 100,
          volume: parseFloat(m.volume_fp || "0"),
        });
      }
    }

    // Process championship markets - look for Lakers
    if (champRes.ok) {
      const champData = await champRes.json();
      const lakersChamp = (champData.markets || []).find(
        (m: { ticker: string; title: string }) =>
          m.ticker.includes("LAL") || m.title.toLowerCase().includes("lakers")
      );
      if (lakersChamp) {
        markets.push({
          ticker: lakersChamp.ticker,
          title: "Lakers win NBA Championship",
          yesBid: parseFloat(lakersChamp.yes_bid_dollars || "0") * 100,
          yesAsk: parseFloat(lakersChamp.yes_ask_dollars || "0") * 100,
          noBid: parseFloat(lakersChamp.no_bid_dollars || "0") * 100,
          noAsk: parseFloat(lakersChamp.no_ask_dollars || "0") * 100,
          lastPrice: parseFloat(lakersChamp.last_price_dollars || "0") * 100,
          volume: parseFloat(lakersChamp.volume_fp || "0"),
        });
      }
    }

    // Next game info
    const nextGame = {
      homeTeam: "Los Angeles Lakers",
      awayTeam: "Houston Rockets",
      series: "Western Conference First Round",
      gameNumber: 1,
      gameTime: "2026-04-13T20:30:00Z",
    };

    return NextResponse.json({
      markets,
      nextGame,
    });
  } catch (error) {
    console.error("Kalshi API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch markets",
        markets: [],
        nextGame: {
          homeTeam: "Los Angeles Lakers",
          awayTeam: "Houston Rockets",
          series: "Western Conference First Round",
          gameNumber: 1,
          gameTime: "2026-04-13T20:30:00Z",
        },
      },
      { status: 200 }
    );
  }
}
