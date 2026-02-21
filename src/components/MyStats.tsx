"use client";

export default function MyStats() {
  return (
    <div className="bg-white rounded-[8px] p-4">
      <h2 className="text-lg font-bold text-[#111111] mb-2">My Stats &gt;</h2>

      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full border-2 border-[#B1B1B1] bg-[#E6E6E6] flex items-center justify-center mb-1">
            <span className="text-lg">👤</span>
          </div>
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-xs font-medium text-[#111111]">Bure</span>
            <div className="w-2 h-2 rounded-full bg-[#31A159]" />
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#111111]">#118</div>
            <div className="text-[10px] text-gray-600 font-light">Rank</div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-3">
          <div>
            <div className="text-lg font-bold text-[#111111]">1,973<span className="text-[10px] text-gray-600 font-light ml-0.5">USD</span></div>
            <div className="text-[10px] text-gray-600 font-light">Total vol. trade</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[#111111]">102</div>
            <div className="text-[10px] text-gray-600 font-light">Trade win</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[#111111]">23</div>
            <div className="text-[10px] text-gray-600 font-light">Trade lost</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[#111111]">145</div>
            <div className="text-[10px] text-gray-600 font-light">Friends</div>
          </div>
        </div>
      </div>
    </div>
  );
}
