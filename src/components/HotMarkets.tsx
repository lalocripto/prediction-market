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
    <div className="bg-white rounded-[8px] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[2rem] font-bold text-[#111111]">Hot &gt;</h2>
      </div>

      <div className="space-y-6">
        {/* Champion market */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[#111111]">Campeón World Cup</h3>
            <span className="text-sm text-gray-600 font-light">Total vol: $1M</span>
          </div>

          <div className="space-y-2">
            {markets.map((market) => (
              <button
                key={market.id}
                className="w-full flex items-center justify-between p-3 rounded-[8px] bg-[#E6E6E6] hover:opacity-80 transition-opacity group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">#{market.id}</span>
                  <span className="text-2xl border-2 border-[#B1B1B1] rounded-full w-8 h-8 flex items-center justify-center overflow-hidden">{market.flag}</span>
                  <span className="font-medium text-[#111111]">{market.team}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#111111] font-light">Total vol: {market.total}</span>
                  <span className="text-sm font-medium text-[#31A159]">
                    {market.odds}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <button className="mt-3 text-sm text-gray-600 hover:text-[#111111] flex items-center gap-1 font-light">
            Selecciona otro país
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Upcoming matches */}
        <div className="space-y-3">
          {upcomingMatches.map((match, idx) => (
            <div key={idx} className="pb-3 border-b border-[#DCDCDC] last:border-0">
              <div className="flex items-center justify-between text-xs text-gray-600 font-light mb-2">
                <div>
                  <div>{match.date}</div>
                  <div className="font-normal">{match.time}</div>
                </div>
                <div className="font-normal">{match.worldCup}</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl border-2 border-[#B1B1B1] rounded-full w-8 h-8 flex items-center justify-center overflow-hidden">🇲🇽</span>
                  <span className="font-medium text-[#111111]">{match.teams[0]}</span>
                </div>
                <button className="px-4 py-1.5 rounded-[8px] bg-[#31A159] text-[#111111] text-xs font-medium hover:opacity-80 transition-opacity border-[0.5rem] border-transparent">
                  MEX 10$
                </button>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl border-2 border-[#B1B1B1] rounded-full w-8 h-8 flex items-center justify-center overflow-hidden">🇿🇦</span>
                  <span className="font-medium text-[#111111]">{match.teams[1]}</span>
                </div>
                <button className="px-4 py-1.5 rounded-[8px] bg-[#FFC4D0] text-[#111111] text-xs font-medium hover:opacity-80 transition-opacity border-[0.5rem] border-transparent">
                  SUD 10$
                </button>
              </div>

              <button className="mt-2 text-xs text-[#31A159] hover:opacity-80 font-medium underline">
                {match.link} ›
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
