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
    <div className="bg-white rounded-[8px] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[2rem] font-bold text-[#111111]">Leader board &gt;</h2>
        <span className="text-xs text-gray-600 font-light">Total volumen trade</span>
      </div>

      <div className="space-y-3">
        {leaders.map((leader) => (
          <div 
            key={leader.rank}
            className="flex items-center justify-between p-3 rounded-[8px] hover:bg-[#E6E6E6] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold ${
                leader.rank === 1 ? 'text-[#31A159]' :
                leader.rank === 2 ? 'text-gray-400' :
                leader.rank === 3 ? 'text-[#FFC4D0]' :
                'text-gray-600'
              }`}>
                #{leader.rank}
              </span>
              <div className="w-8 h-8 rounded-full border-2 border-[#B1B1B1] bg-[#E6E6E6] flex items-center justify-center">
                <span className="text-sm">👤</span>
              </div>
              <span className="font-medium text-[#111111]">{leader.name}</span>
            </div>
            <span className="font-bold text-[#111111]">{leader.points}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
