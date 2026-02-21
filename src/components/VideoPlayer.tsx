"use client";

import { SoccerEvent } from "@/types/market";

interface VideoPlayerProps {
  liveMatch?: SoccerEvent;
}

export default function VideoPlayer({ liveMatch }: VideoPlayerProps) {
  return (
    <div className="bg-[#111111] rounded-[8px] overflow-hidden shadow-lg aspect-video relative">
      {/* Video placeholder - would be actual video player */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-3 mx-auto">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <p className="text-white/60 text-sm font-light">
            {liveMatch ? 'Live Match Stream' : 'No live match'}
          </p>
        </div>
      </div>

      {/* Overlay info */}
      {liveMatch && (
        <>
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
            <div className="bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-[8px]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FFC4D0] animate-pulse" />
                <span className="text-white text-xs font-medium">{liveMatch.endDate}</span>
              </div>
            </div>
            <div className="bg-[#31A159] px-3 py-1.5 rounded-[8px] text-white text-xs font-medium">
              LIVE
            </div>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="text-white">
              <h3 className="font-semibold text-sm mb-1">{liveMatch.title}</h3>
              {liveMatch.score && (
                <div className="text-2xl font-bold">{liveMatch.score}</div>
              )}
              <p className="text-xs text-white/60 mt-1">{liveMatch.series || 'World Cup'}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
