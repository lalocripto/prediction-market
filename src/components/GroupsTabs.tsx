"use client";

interface GroupsTabsProps {
  activeGroup: string;
  onGroupChange: (group: string) => void;
}

export default function GroupsTabs({ activeGroup, onGroupChange }: GroupsTabsProps) {
  const groups = ["A", "B", "C", "D", "E", "F", "G", "H"];
  
  const matches = [
    {
      date: "11 junio 13:00",
      time: "$2.82M Vol.",
      worldCup: "World cup",
      teams: [
        { name: "Mexico", flag: "🇲🇽", odds: [
          { label: "MEX 10$", color: "bg-green-400" },
          { label: "DRAW 10%", color: "bg-white border border-gray-300" },
          { label: "SUD 10$", color: "bg-red-300" }
        ]},
        { name: "Sudáfrica", flag: "🇿🇦", odds: [
          { label: "MEX 10$", color: "bg-green-400" },
          { label: "DRAW 10%", color: "bg-white border border-gray-300" },
          { label: "SUD 10$", color: "bg-red-300" }
        ]}
      ]
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Grupos &gt;</h2>
        <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
          Ver todo ›
        </button>
      </div>

      {/* Group tabs */}
      <div className="flex items-center gap-2 mb-6">
        {groups.map((group) => (
          <button
            key={group}
            onClick={() => onGroupChange(group)}
            className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
              activeGroup === group
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      {/* Matches */}
      <div className="space-y-4">
        {matches.map((match, idx) => (
          <div key={idx} className="space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div>
                <div>{match.date}</div>
                <div className="font-medium">{match.time}</div>
              </div>
              <div className="font-medium">{match.worldCup}</div>
              <button className="text-amber-600 hover:text-amber-700">
                Vista del juego ›
              </button>
            </div>

            {match.teams.map((team, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{team.flag}</span>
                  <span className="font-semibold text-gray-900">{team.name}</span>
                  <span className="text-sm text-gray-500">vs</span>
                </div>
                <div className="flex items-center gap-2">
                  {team.odds.map((odd, j) => (
                    <button
                      key={j}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${odd.color} ${
                        odd.color.includes('green') || odd.color.includes('red') 
                          ? 'text-white' 
                          : 'text-gray-700'
                      } hover:opacity-80 transition-opacity`}
                    >
                      {odd.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
