"use client";

export default function HotMarkets() {
  const markets = [
    { id: 1, team: "Francia", flag: "🇫🇷", odds: "$1M", total: "$1M" },
    { id: 2, team: "España", flag: "🇪🇸", odds: "$1M", total: "$1M" },
    { id: 3, team: "Alemania", flag: "🇩🇪", odds: "$1M", total: "$1M" }
  ];

  const upcomingMatches = [
    {
      date: "11 junio 13:00",
      time: "$2.82M Vol.",
      worldCup: "World cup",
      teams: ["Mexico", "Sudáfrica"],
      link: "Vista del juego"
    },
    {
      date: "11 junio 13:00",
      time: "$2.82M Vol.",
      worldCup: "World cup",
      teams: ["Mexico", "Sudáfrica"],
      link: "Vista del juego"
    },
    {
      date: "11 junio 13:00",
      time: "$2.82M Vol.",
      worldCup: "World cup",
      teams: ["Mexico", "Sudáfrica"],
      link: "Vista del juego"
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Hot &gt;</h2>
      </div>

      <div className="space-y-6">
        {/* Champion market */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Campeón World Cup</h3>
            <span className="text-sm text-gray-500">Total vol: $1M</span>
          </div>

          <div className="space-y-2">
            {markets.map((market) => (
              <button
                key={market.id}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">#{market.id}</span>
                  <span className="text-2xl">{market.flag}</span>
                  <span className="font-medium text-gray-900">{market.team}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Total vol: {market.total}</span>
                  <span className="text-sm font-medium text-amber-600 group-hover:text-amber-700">
                    {market.odds}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <button className="mt-3 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            Selecciona otro país
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Upcoming matches */}
        <div className="space-y-3">
          {upcomingMatches.map((match, idx) => (
            <div key={idx} className="pb-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <div>
                  <div>{match.date}</div>
                  <div className="font-medium">{match.time}</div>
                </div>
                <div className="font-medium">{match.worldCup}</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🇲🇽</span>
                  <span className="font-medium text-gray-900">{match.teams[0]}</span>
                </div>
                <button className="px-4 py-1.5 rounded-lg bg-green-400 text-white text-xs font-medium hover:bg-green-500 transition-colors">
                  MEX 10$
                </button>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🇿🇦</span>
                  <span className="font-medium text-gray-900">{match.teams[1]}</span>
                </div>
                <button className="px-4 py-1.5 rounded-lg bg-red-300 text-white text-xs font-medium hover:bg-red-400 transition-colors">
                  SUD 10$
                </button>
              </div>

              <button className="mt-2 text-xs text-amber-600 hover:text-amber-700 font-medium">
                {match.link} ›
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
