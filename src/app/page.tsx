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
import { SoccerEvent } from "@/types/market";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [activeGroup, setActiveGroup] = useState("A");
  const [events, setEvents] = useState<SoccerEvent[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-[#31A159]">
      <Header />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              <LiveMatches matches={liveMatches} allEvents={events} />
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <GroupsTabs 
                    activeGroup={activeGroup}
                    onGroupChange={setActiveGroup}
                    events={events}
                  />
                  <TeamsGrid events={events} />
                </div>
                
                <HotMarkets markets={hotMarkets} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MyStats />
                <Leaderboard />
              </div>
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              <VideoPlayer liveMatch={liveMatches[0]} />
              <Community />
              <News />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
