"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import LiveMatches from "@/components/LiveMatches";
import HotMarkets from "@/components/HotMarkets";
import TeamsGrid from "@/components/TeamsGrid";
import Positions from "@/components/Positions";
import Leaderboard from "@/components/Leaderboard";
import News from "@/components/News";
import VideoPlayer from "@/components/VideoPlayer";
import TradeModal from "@/components/TradeModal";
import { useWalletContext } from "@/lib/WalletContext";
import { SoccerEvent, Market, Bet } from "@/types/market";
import { Loader2 } from "lucide-react";

const BETS_STORAGE_KEY = "prediction-market-bets";

function loadBetsFromStorage(): Bet[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(BETS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Bet[];
    }
  } catch {
    // ignore parse errors
  }
  return [];
}

function saveBetsToStorage(bets: Bet[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BETS_STORAGE_KEY, JSON.stringify(bets));
  } catch {
    // ignore storage errors
  }
}

export default function Home() {
  const [events, setEvents] = useState<SoccerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [tradeMarket, setTradeMarket] = useState<Market | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const wallet = useWalletContext();

  // Load bets from localStorage on mount
  useEffect(() => {
    const stored = loadBetsFromStorage();
    if (stored.length > 0) {
      setBets(stored);
    }
  }, []);

  // Save bets to localStorage whenever they change
  const updateBets = useCallback((updater: Bet[] | ((prev: Bet[]) => Bet[])) => {
    setBets((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveBetsToStorage(next);
      return next;
    });
  }, []);

  const handleTrade = async (market: Market) => {
    if (!wallet.isConnected) {
      await wallet.connect();
    }
    setTradeMarket(market);
  };

  const handlePlaceBet = (bet: Bet) => {
    updateBets((prev) => [...prev, bet]);
  };

  const handleSellComplete = (betIndex: number, sellSignature: string, sellTxHash: string) => {
    updateBets((prev) =>
      prev.map((bet, i) =>
        i === betIndex
          ? { ...bet, sellSignature, sellTxHash, soldAt: Date.now() }
          : bet
      )
    );
  };

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("/api/markets");
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  // Extract live matches
  const liveMatches = events.filter(e => e.live).slice(0, 2);

  // Sort events by volume first
  const sortedEvents = [...events].sort((a, b) => b.volume24hr - a.volume24hr);

  // Extract all markets sorted by volume
  const allMarkets = sortedEvents.flatMap(e => e.markets).slice(0, 30);

  // Hot markets (top volume)
  const hotMarkets = allMarkets.slice(0, 15);

  return (
    <div className="h-screen bg-[#F0EDFF] flex overflow-hidden">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 px-3 py-2 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-[#836EF9] animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 h-full">
            {/* Left Column — Top Markets + Teams */}
            <div className="lg:col-span-1 flex flex-col gap-3 overflow-hidden">
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                <div className="space-y-3">
                  <LiveMatches matches={liveMatches} allEvents={events} onTrade={handleTrade} />
                  <TeamsGrid events={events} onTrade={handleTrade} />
                </div>
              </div>
            </div>

            {/* Center Column — Hot + Positions + Leaderboard */}
            <div className="lg:col-span-1 flex flex-col gap-3 overflow-hidden">
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                <div className="space-y-3">
                  <HotMarkets markets={hotMarkets} onTrade={handleTrade} />
                  <Positions bets={bets} onSellComplete={handleSellComplete} />
                  <Leaderboard />
                </div>
              </div>
            </div>

            {/* Right Column — Video + News */}
            <div className="lg:col-span-2 flex flex-col gap-3 overflow-hidden">
              <VideoPlayer liveMatch={liveMatches[0]} />
              <News />
            </div>
          </div>
        )}
      </main>

      {tradeMarket && (
        <TradeModal
          market={tradeMarket}
          onClose={() => setTradeMarket(null)}
          onPlaceBet={handlePlaceBet}
        />
      )}
    </div>
  );
}
