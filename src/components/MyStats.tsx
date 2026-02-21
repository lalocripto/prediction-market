"use client";

export default function MyStats() {
  return (
    <div className="bg-white rounded-[8px] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[2rem] font-bold text-[#111111]">My Stats &gt;</h2>
      </div>

      <div className="flex items-start gap-6">
        {/* Avatar & Rank */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-2 border-[#B1B1B1] bg-[#E6E6E6] flex items-center justify-center mb-2">
            <span className="text-2xl">👤</span>
          </div>
          <div className="flex items-center gap-1 mb-1">
            <span className="text-sm font-medium text-[#111111]">Bure</span>
            <div className="w-3 h-3 rounded-full bg-[#31A159]" />
            <span className="text-xs text-gray-600 font-light">México</span>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#111111]">#118</div>
            <div className="text-xs text-gray-600 font-light">Rank</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex-1 grid grid-cols-2 gap-6">
          <div>
            <div className="text-2xl font-bold text-[#111111]">1,973<span className="text-sm text-gray-600 font-light">USD</span></div>
            <div className="text-xs text-gray-600 font-light">Total volumen trade</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-[#111111]">102</div>
            <div className="text-xs text-gray-600 font-light">Trade win</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-[#111111]">23</div>
            <div className="text-xs text-gray-600 font-light">Trade lost</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-[#111111]">145</div>
            <div className="text-xs text-gray-600 font-light">Friends</div>
          </div>
        </div>
      </div>
    </div>
  );
}
