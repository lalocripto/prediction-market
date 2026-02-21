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
          { label: "MEX 10$", color: "bg-[#31A159]" },
          { label: "DRAW 10%", color: "bg-[#E6E6E6]" },
          { label: "SUD 10$", color: "bg-[#FFC4D0]" }
        ]},
        { name: "Sudáfrica", flag: "🇿🇦", odds: [
          { label: "MEX 10$", color: "bg-[#31A159]" },
          { label: "DRAW 10%", color: "bg-[#E6E6E6]" },
          { label: "SUD 10$", color: "bg-[#FFC4D0]" }
        ]}
      ]
    }
  ];

  return (
    <div className="bg-white rounded-[8px] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[2rem] font-bold text-[#111111]">Grupos &gt;</h2>
        <button className="text-sm text-[#31A159] hover:opacity-80 font-medium underline">
          Ver todo ›
        </button>
      </div>

      {/* Group tabs */}
      <div className="flex items-center gap-2 mb-6">
        {groups.map((group) => (
          <button
            key={group}
            onClick={() => onGroupChange(group)}
            className={`w-10 h-10 rounded-[8px] font-bold text-sm transition-all ${
              activeGroup === group
                ? "bg-[#111111] text-white"
                : "bg-[#E6E6E6] text-[#111111] hover:opacity-80"
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
            <div className="flex items-center justify-between text-xs text-gray-600 font-light">
              <div>
                <div>{match.date}</div>
                <div className="font-normal">{match.time}</div>
              </div>
              <div className="font-normal">{match.worldCup}</div>
              <button className="text-[#31A159] hover:opacity-80 underline">
                Vista del juego ›
              </button>
            </div>

            {match.teams.map((team, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl border-2 border-[#B1B1B1] rounded-full w-8 h-8 flex items-center justify-center overflow-hidden">{team.flag}</span>
                  <span className="font-semibold text-[#111111]">{team.name}</span>
                  <span className="text-sm text-gray-600 font-light">vs</span>
                </div>
                <div className="flex items-center gap-2">
                  {team.odds.map((odd, j) => (
                    <button
                      key={j}
                      className={`px-3 py-1.5 rounded-[8px] text-xs font-medium ${odd.color} text-[#111111] hover:opacity-80 transition-opacity border-[0.5rem] border-transparent`}
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
