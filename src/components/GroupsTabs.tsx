"use client";

import { SoccerEvent, Market } from "@/types/market";

interface GroupsTabsProps {
  activeGroup: string;
  onGroupChange: (group: string) => void;
  events: SoccerEvent[];
  onTrade: (market: Market) => void;
}

export default function GroupsTabs({ activeGroup, onGroupChange, events, onTrade }: GroupsTabsProps) {
  const groups = ["A", "B", "C", "D", "E", "F", "G", "H"];

  const groupEvents = events.filter(e =>
    e.title.toLowerCase().includes(`group ${activeGroup.toLowerCase()}`)
  ).slice(0, 3);

  const displayEvents = groupEvents.length > 0 ? groupEvents : events.slice(0, 3);

  return (
    <div className="bg-white rounded-[8px] p-4">
      <h2 className="text-lg font-bold text-[#111111] mb-2">Grupos &gt;</h2>

      <div className="flex items-center gap-1 mb-3">
        {groups.map((group) => (
          <button
            key={group}
            onClick={() => onGroupChange(group)}
            className={`w-7 h-7 rounded-[8px] font-bold text-[10px] transition-all ${
              activeGroup === group
                ? "bg-[#111111] text-white"
                : "bg-[#E6E6E6] text-[#111111] hover:opacity-80"
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {displayEvents.length === 0 ? (
          <p className="text-gray-600 font-light text-xs">No markets for Group {activeGroup}</p>
        ) : (
          displayEvents.map((event) => {
            const market = event.markets[0];
            if (!market) return null;

            return (
              <div key={event.id} className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-gray-600 font-light">
                  <span>{event.volume24hr ? `$${(event.volume24hr / 1000000).toFixed(1)}M` : ''}</span>
                  <span>{event.series || 'World Cup'}</span>
                </div>
                <p className="font-semibold text-[#111111] text-xs leading-tight">{event.title}</p>
                <p className="text-[10px] text-gray-600 font-light truncate">{market.question}</p>
                <div className="flex items-center gap-1">
                  {market.outcomes.slice(0, 3).map((outcome, i) => {
                    const colors = ['bg-[#B0CDFF]', 'bg-[#E6E6E6]', 'bg-[#FFD2A0]'];
                    return (
                      <button
                        key={i}
                        onClick={() => onTrade(market)}
                        className={`px-2 py-1 rounded-[8px] text-[10px] font-medium ${colors[i] || 'bg-gray-200'} text-[#111111] hover:opacity-80 transition-opacity`}
                      >
                        {outcome.label} {Math.round(outcome.price * 100)}¢
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
