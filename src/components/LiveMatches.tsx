"use client";

export default function LiveMatches() {
  const matches = [
    {
      id: 1,
      time: "11 junio 13:00",
      teams: ["México", "Sudáfrica"],
      scores: [1, 0],
      group: "Group A",
      odds: [
        { label: "MEX 10$", value: 10, color: "bg-[#31A159]" },
        { label: "DRAW 10%", value: 10, color: "bg-[#E6E6E6]" },
        { label: "SUD 10$", value: 10, color: "bg-[#FFC4D0]" }
      ],
      firstGoal: [
        { label: "Sí 10$", value: 10, color: "bg-[#31A159]" },
        { label: "No 10$", value: 10, color: "bg-[#FFC4D0]" }
      ]
    },
    {
      id: 2,
      time: "11 junio 13:00",
      teams: ["Corea del Sur", "Sudáfrica"],
      scores: [1, 0],
      group: "Group B",
      odds: [
        { label: "MEX 10$", value: 10, color: "bg-[#31A159]" },
        { label: "DRAW 10%", value: 10, color: "bg-[#E6E6E6]" },
        { label: "SUD 10$", value: 10, color: "bg-[#FFC4D0]" }
      ],
      firstGoal: [
        { label: "Sí 10$", value: 10, color: "bg-[#31A159]" },
        { label: "No 10$", value: 10, color: "bg-[#FFC4D0]" }
      ]
    }
  ];

  return (
    <div className="bg-white rounded-[8px] p-6">
      <h2 className="text-[2rem] font-bold text-[#111111] mb-4">Live</h2>
      
      <div className="space-y-4">
        {matches.map((match, idx) => (
          <div key={match.id} className="space-y-3">
            <div className="flex items-center justify-between">
              {/* Match info */}
              <div className="flex items-center gap-8">
                <div className="text-xs text-gray-600 font-light">
                  <div>{match.time}</div>
                  <div className="font-normal">${(Math.random() * 10).toFixed(1)}M Vol.</div>
                  <div>{match.group}</div>
                </div>

                {/* Teams & Score */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border-[0.5rem] border-[#B1B1B1] bg-green-500 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                      🇲🇽
                    </div>
                    <span className="font-semibold text-[#111111]">{match.teams[0]}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 px-4">
                    <span className="text-2xl font-bold text-[#111111]">{match.scores[0]}</span>
                    <span className="text-gray-400">vs</span>
                    <span className="text-2xl font-bold text-[#111111]">{match.scores[1]}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border-[0.5rem] border-[#B1B1B1] bg-yellow-500 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                      🇿🇦
                    </div>
                    <span className="font-semibold text-[#111111]">{match.teams[1]}</span>
                  </div>
                </div>
              </div>

              {/* Odds */}
              <div className="flex items-center gap-2">
                {match.odds.map((odd, i) => (
                  <button
                    key={i}
                    className={`px-4 py-2 rounded-[8px] text-xs font-medium ${odd.color} text-[#111111] hover:opacity-80 transition-opacity border-[0.5rem] border-transparent`}
                  >
                    {odd.label}
                  </button>
                ))}
              </div>
            </div>

            {/* First goal */}
            <div className="pl-24">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#111111] font-light">Gol en el primer tiempo</span>
                <div className="flex items-center gap-2">
                  {match.firstGoal.map((opt, i) => (
                    <button
                      key={i}
                      className={`px-4 py-1.5 rounded-[8px] text-xs font-medium ${opt.color} text-[#111111] hover:opacity-80 transition-opacity border-[0.5rem] border-transparent`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            {idx < matches.length - 1 && (
              <div className="flex items-center gap-2 pt-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-[#111111]' : 'bg-gray-300'}`} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
