"use client";

export default function VideoPlayer() {
  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg aspect-video relative">
      {/* Video placeholder - would be actual video player */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-3 mx-auto">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <p className="text-white/60 text-sm">Live Match Stream</p>
        </div>
      </div>

      {/* Overlay info */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
        <div className="bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white text-xs font-medium">0:00</span>
          </div>
        </div>
        <div className="bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white text-xs font-medium">
          LIVE
        </div>
      </div>

      {/* Bottom scoreboard */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇲🇽</span>
            <span className="font-semibold">MEX</span>
          </div>
          <div className="text-2xl font-bold">0 - 0</div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">ZAF</span>
            <span className="text-2xl">🇿🇦</span>
          </div>
        </div>
      </div>
    </div>
  );
}
