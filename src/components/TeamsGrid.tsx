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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Equipos &gt;</h2>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {teams.map((team, idx) => (
          <button
            key={idx}
            className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-gray-200 hover:border-amber-500 hover:bg-amber-50 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform">
              {team.flag}
            </div>
            <span className="text-xs font-medium text-gray-600 group-hover:text-amber-700">
              {team.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
