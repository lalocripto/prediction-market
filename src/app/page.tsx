"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import LiveMatches from "@/components/LiveMatches";
import GroupsTabs from "@/components/GroupsTabs";
import HotMarkets from "@/components/HotMarkets";
import TeamsGrid from "@/components/TeamsGrid";
import MyStats from "@/components/MyStats";
import Leaderboard from "@/components/Leaderboard";
import Community from "@/components/Community";
import News from "@/components/News";
import VideoPlayer from "@/components/VideoPlayer";
import TradeModal from "@/components/TradeModal";
import { useWalletContext } from "@/lib/WalletContext";
import { SoccerEvent, Market, Bet } from "@/types/market";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [activeGroup, setActiveGroup] = useState("A");
  const [events, setEvents] = useState<SoccerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [tradeMarket, setTradeMarket] = useState<Market | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const wallet = useWalletContext();

  const handleTrade = async (market: Market) => {
    if (!wallet.isConnected) {
      await wallet.connect();
    }
    setTradeMarket(market);
  };

  const handlePlaceBet = (bet: Bet) => {
    setBets((prev) => [...prev, bet]);
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
  const allMarkets = sortedEvents.flatMap(e => e.markets).slice(0, 20);

  // Hot markets (top volume)
  const hotMarkets = allMarkets.slice(0, 10);

  return (
    <div className="h-screen bg-[#31A159] flex flex-col overflow-hidden">
      <Header />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-3 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 h-full">
            {/* Left Column — Live + Groups + Teams */}
            <div className="lg:col-span-1 flex flex-col gap-3 overflow-hidden">
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                <div className="space-y-3">
                  <LiveMatches matches={liveMatches} allEvents={events} onTrade={handleTrade} />
                  <GroupsTabs
                    activeGroup={activeGroup}
                    onGroupChange={setActiveGroup}
                    events={events}
                    onTrade={handleTrade}
                  />
                  <TeamsGrid events={events} />
                </div>
              </div>
            </div>

            {/* Center Column — Hot + Stats + Leaderboard */}
            <div className="lg:col-span-1 flex flex-col gap-3 overflow-hidden">
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                <div className="space-y-3">
                  <HotMarkets markets={hotMarkets} onTrade={handleTrade} />
                  <div className="grid grid-cols-1 gap-3">
                    <MyStats />
                    <Leaderboard />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column — Video + Community + News */}
            <div className="lg:col-span-2 flex flex-col gap-3 overflow-hidden">
              <VideoPlayer liveMatch={liveMatches[0]} />
              <div className="flex-1 grid grid-cols-2 gap-3 overflow-hidden">
                <div className="overflow-y-auto scrollbar-thin">
                  <Community />
                </div>
                <div className="overflow-y-auto scrollbar-thin">
                  <News />
                </div>
              </div>
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
