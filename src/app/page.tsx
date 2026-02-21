"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import EventGroup from "@/components/EventGroup";
import TradeModal from "@/components/TradeModal";
import { useWalletContext } from "@/lib/WalletContext";
import { Market, Tab, Bet, SoccerEvent } from "@/types/market";
import {
  Search,
  Trophy,
  Bookmark,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [tradeMarket, setTradeMarket] = useState<Market | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState<SoccerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const wallet = useWalletContext();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/markets");
      if (!res.ok) throw new Error("Failed to fetch markets");
      const data: SoccerEvent[] = await res.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 60_000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  const handleTrade = async (market: Market) => {
    if (!wallet.isConnected) {
      await wallet.connect();
    }
    setTradeMarket(market);
  };

  const handlePlaceBet = (bet: Bet) => {
    setBets((prev) => [...prev, bet]);
  };

  const getFilteredEvents = (): SoccerEvent[] => {
    let filtered: SoccerEvent[] = [];

    switch (activeTab) {
      case "all":
        filtered = events;
        break;
      case "winner":
        filtered = events.filter((e) =>
          e.title.toLowerCase().includes("winner")
        );
        break;
      case "qualifiers":
        filtered = events.filter(
          (e) =>
            e.title.toLowerCase().includes("qualif") ||
            e.title.toLowerCase().includes("which countries")
        );
        break;
      case "my-bets": {
        const betMarketIds = new Set(bets.map((b) => b.marketId));
        filtered = events
          .map((e) => ({
            ...e,
            markets: e.markets.filter((m) => betMarketIds.has(m.id)),
          }))
          .filter((e) => e.markets.length > 0);
        break;
      }
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered
        .map((e) => ({
          ...e,
          markets: e.markets.filter(
            (m) =>
              m.question.toLowerCase().includes(q) ||
              m.eventTitle.toLowerCase().includes(q)
          ),
        }))
        .filter((e) => e.markets.length > 0);
    }

    return filtered;
  };

  const filteredEvents = getFilteredEvents();
  const allMarkets = events.flatMap((e) => e.markets);
  const totalVolume = events.reduce((acc, e) => acc + e.volume, 0);

  return (
    <div className="min-h-screen">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search & Refresh */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search countries, markets..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 transition-all"
            />
          </div>
          <button
            onClick={fetchEvents}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        {/* Stats */}
        {!loading && !error && (
          <div className="flex items-center gap-6 mb-6 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                <strong className="text-white">{allMarkets.length}</strong>{" "}
                markets across{" "}
                <strong className="text-white">{events.length}</strong> events
              </span>
            </div>
            <div className="text-gray-400">
              <strong className="text-white">
                $
                {totalVolume >= 1_000_000
                  ? `${(totalVolume / 1_000_000).toFixed(1)}M`
                  : `${(totalVolume / 1_000).toFixed(1)}K`}
              </strong>{" "}
              total volume
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
            <p className="text-gray-400 text-sm">
              Loading World Cup markets from Polymarket...
            </p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <AlertCircle className="w-8 h-8 text-red-400 mb-4" />
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <button
              onClick={fetchEvents}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {filteredEvents.length > 0 ? (
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <EventGroup
                    key={event.id}
                    event={event}
                    onTrade={handleTrade}
                    defaultExpanded={event.markets.length <= 6}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                {activeTab === "my-bets" ? (
                  <>
                    <Bookmark className="w-12 h-12 mb-4 text-gray-700" />
                    <p className="text-lg font-medium text-gray-400">
                      You haven&apos;t placed any bets yet
                    </p>
                    {!wallet.isConnected && (
                      <p className="text-sm mt-2">
                        Connect your wallet and start trading
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <Trophy className="w-12 h-12 mb-4 text-gray-700" />
                    <p className="text-lg font-medium text-gray-400">
                      No markets found
                    </p>
                    {search && (
                      <p className="text-sm mt-2">Try adjusting your search</p>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Trade Modal */}
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
