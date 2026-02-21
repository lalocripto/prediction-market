"use client";

export default function MyStats() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">My Stats &gt;</h2>
      </div>

      <div className="flex items-start gap-6">
        {/* Avatar & Rank */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
            <span className="text-2xl">👤</span>
          </div>
          <div className="flex items-center gap-1 mb-1">
            <span className="text-sm font-medium text-gray-900">Bure</span>
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-gray-500">México</span>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">#118</div>
            <div className="text-xs text-gray-500">Rank</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex-1 grid grid-cols-2 gap-6">
          <div>
            <div className="text-2xl font-bold text-gray-900">1,973<span className="text-sm text-gray-500">USD</span></div>
            <div className="text-xs text-gray-500">Total volumen trade</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-gray-900">102</div>
            <div className="text-xs text-gray-500">Trade win</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-gray-900">23</div>
            <div className="text-xs text-gray-500">Trade lost</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-gray-900">145</div>
            <div className="text-xs text-gray-500">Friends</div>
          </div>
        </div>
      </div>
    </div>
  );
}
