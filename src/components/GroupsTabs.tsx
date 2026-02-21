"use client";

import { SoccerEvent } from "@/types/market";

interface GroupsTabsProps {
  activeGroup: string;
  onGroupChange: (group: string) => void;
  events: SoccerEvent[];
}

export default function GroupsTabs({ activeGroup, onGroupChange, events }: GroupsTabsProps) {
  const groups = ["A", "B", "C", "D", "E", "F", "G", "H"];
  
  // Filter events that mention the active group
  const groupEvents = events.filter(e => 
    e.title.toLowerCase().includes(`group ${activeGroup.toLowerCase()}`)
  ).slice(0, 3);

  // If no group-specific events, show general World Cup events
  const displayEvents = groupEvents.length > 0 ? groupEvents : events.slice(0, 3);

  return (
    <div className="bg-white rounded-[8px] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[2rem] font-bold text-[#111111]">Grupos &gt;</h2>
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

      {/* Events */}
      <div className="space-y-4">
        {displayEvents.length === 0 ? (
          <p className="text-gray-600 font-light">No markets for Group {activeGroup}</p>
        ) : (
          displayEvents.map((event) => {
            const market = event.markets[0];
            if (!market) return null;

            return (
              <div key={event.id} className="space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-600 font-light">
                  <div>
                    <div>{event.endDate}</div>
                    <div className="font-normal">{event.volume24hr ? `$${(event.volume24hr / 1000000).toFixed(1)}M Vol.` : 'N/A'}</div>
                  </div>
                  <div className="font-normal">{event.series || 'World Cup'}</div>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-[#111111] text-sm">{event.title}</p>
                  <p className="text-sm text-gray-600 font-light">{market.question}</p>
                  
                  <div className="flex items-center gap-2">
                    {market.outcomes.slice(0, 3).map((outcome, i) => {
                      const colors = ['bg-[#31A159]', 'bg-[#E6E6E6]', 'bg-[#FFC4D0]'];
                      return (
                        <button
                          key={i}
                          className={`px-3 py-1.5 rounded-[8px] text-xs font-medium ${colors[i] || 'bg-gray-200'} text-[#111111] hover:opacity-80 transition-opacity border-[0.5rem] border-transparent`}
                        >
                          {outcome.label} {Math.round(outcome.price * 100)}¢
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
