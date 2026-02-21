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
        { label: "MEX 10$", value: 10, color: "bg-green-400" },
        { label: "DRAW 10%", value: 10, color: "bg-white" },
        { label: "SUD 10$", value: 10, color: "bg-red-300" }
      ],
      firstGoal: [
        { label: "Sí 10$", value: 10, color: "bg-green-400" },
        { label: "No 10$", value: 10, color: "bg-red-300" }
      ]
    },
    {
      id: 2,
      time: "11 junio 13:00",
      teams: ["Corea del Sur", "Sudáfrica"],
      scores: [1, 0],
      group: "Group B",
      odds: [
        { label: "MEX 10$", value: 10, color: "bg-green-400" },
        { label: "DRAW 10%", value: 10, color: "bg-white" },
        { label: "SUD 10$", value: 10, color: "bg-red-300" }
      ],
      firstGoal: [
        { label: "Sí 10$", value: 10, color: "bg-green-400" },
        { label: "No 10$", value: 10, color: "bg-red-300" }
      ]
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Live</h2>
      
      <div className="space-y-4">
        {matches.map((match, idx) => (
          <div key={match.id} className="space-y-3">
            <div className="flex items-center justify-between">
              {/* Match info */}
              <div className="flex items-center gap-8">
                <div className="text-xs text-gray-500">
                  <div>{match.time}</div>
                  <div className="font-medium">${(Math.random() * 10).toFixed(1)}M Vol.</div>
                  <div>{match.group}</div>
                </div>

                {/* Teams & Score */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                      🇲🇽
                    </div>
                    <span className="font-semibold text-gray-900">{match.teams[0]}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 px-4">
                    <span className="text-2xl font-bold text-gray-900">{match.scores[0]}</span>
                    <span className="text-gray-400">vs</span>
                    <span className="text-2xl font-bold text-gray-900">{match.scores[1]}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white text-sm font-bold">
                      🇿🇦
                    </div>
                    <span className="font-semibold text-gray-900">{match.teams[1]}</span>
                  </div>
                </div>
              </div>

              {/* Odds */}
              <div className="flex items-center gap-2">
                {match.odds.map((odd, i) => (
                  <button
                    key={i}
                    className={`px-4 py-2 rounded-lg text-xs font-medium ${odd.color} ${
                      odd.color.includes('green') ? 'text-white' : 
                      odd.color.includes('red') ? 'text-white' : 'text-gray-700 border border-gray-300'
                    } hover:opacity-80 transition-opacity`}
                  >
                    {odd.label}
                  </button>
                ))}
              </div>
            </div>

            {/* First goal */}
            <div className="pl-24">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Gol en el primer tiempo</span>
                <div className="flex items-center gap-2">
                  {match.firstGoal.map((opt, i) => (
                    <button
                      key={i}
                      className={`px-4 py-1.5 rounded-lg text-xs font-medium ${opt.color} text-white hover:opacity-80 transition-opacity`}
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
                  <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-gray-900' : 'bg-gray-300'}`} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
