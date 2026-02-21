"use client";

import { useState } from "react";
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

export default function Home() {
  const [activeGroup, setActiveGroup] = useState("A");

  return (
    <div className="min-h-screen bg-[#31A159]">
      <Header />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <LiveMatches />
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="space-y-6">
                <GroupsTabs 
                  activeGroup={activeGroup}
                  onGroupChange={setActiveGroup}
                />
                <TeamsGrid />
              </div>
              
              <HotMarkets />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MyStats />
              <Leaderboard />
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            <VideoPlayer />
            <Community />
            <News />
          </div>
        </div>
      </main>
    </div>
  );
}
