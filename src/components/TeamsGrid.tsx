"use client";

export default function TeamsGrid() {
  const teams = [
    { name: "País", flag: "🏳️" },
    { name: "País", flag: "🏳️" },
    { name: "País", flag: "🏳️" },
    { name: "País", flag: "🏳️" },
    { name: "País", flag: "🏳️" },
    { name: "País", flag: "🏳️" },
    { name: "País", flag: "🏳️" },
    { name: "País", flag: "🏳️" },
    { name: "País", flag: "🏳️" },
    { name: "País", flag: "🏳️" },
    { name: "País", flag: "🏳️" },
    { name: "País", flag: "🏳️" }
  ];

  return (
    <div className="bg-white rounded-[8px] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[2rem] font-bold text-[#111111]">Equipos &gt;</h2>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {teams.map((team, idx) => (
          <button
            key={idx}
            className="flex flex-col items-center justify-center p-4 rounded-[8px] border-2 border-[#DCDCDC] hover:border-[#31A159] hover:bg-[#31A159]/10 transition-all group"
          >
            <div className="w-10 h-10 rounded-full border-2 border-[#B1B1B1] bg-[#E6E6E6] flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform overflow-hidden">
              {team.flag}
            </div>
            <span className="text-xs font-medium text-[#111111]">
              {team.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
