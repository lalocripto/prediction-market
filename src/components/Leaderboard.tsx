"use client";

export default function Leaderboard() {
  const leaders = [
    { rank: 1, name: "User name", points: "24,987" },
    { rank: 2, name: "User name", points: "22,567" },
    { rank: 3, name: "User name", points: "20,632" },
    { rank: 4, name: "User name", points: "17,009" },
    { rank: 5, name: "User name", points: "13,532" }
  ];

  return (
    <div className="bg-white rounded-[8px] p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-[#111111]">Tabla de líderes &gt;</h2>
        <span className="text-[10px] text-gray-600 font-light">Vol. total trade</span>
      </div>

      <div className="space-y-1">
        {leaders.map((leader) => (
          <div
            key={leader.rank}
            className="flex items-center justify-between p-2 rounded-[8px] hover:bg-[#E6E6E6] transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${
                leader.rank === 1 ? 'text-[#B0CDFF]' :
                leader.rank === 2 ? 'text-gray-400' :
                leader.rank === 3 ? 'text-[#FFD2A0]' :
                'text-gray-600'
              }`}>
                #{leader.rank}
              </span>
              <div className="w-6 h-6 rounded-full border border-[#B1B1B1] bg-[#E6E6E6] flex items-center justify-center">
                <span className="text-[10px]">👤</span>
              </div>
              <span className="font-medium text-xs text-[#111111]">{leader.name}</span>
            </div>
            <span className="font-bold text-xs text-[#111111]">{leader.points}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
