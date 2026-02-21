"use client";

import { SoccerEvent } from "@/types/market";

interface VideoPlayerProps {
  liveMatch?: SoccerEvent;
}

export default function VideoPlayer({ liveMatch }: VideoPlayerProps) {
  return (
    <div className="bg-[#111111] rounded-[8px] overflow-hidden shadow-lg aspect-video relative">
      <iframe
        src="https://www.youtube.com/embed/LIsS05bRvD8?autoplay=1&mute=1&rel=0"
        title="Copa del Mundo 2026"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />

      {/* Live overlay */}
      {liveMatch && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-[#31A159] px-3 py-1.5 rounded-[8px] text-white text-xs font-medium shadow-lg">
            EN VIVO
          </div>
        </div>
      )}
    </div>
  );
}
