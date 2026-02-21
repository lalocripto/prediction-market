"use client";

import { SoccerEvent } from "@/types/market";

interface LiveMatchesProps {
  matches: SoccerEvent[];
  allEvents: SoccerEvent[];
}

export default function LiveMatches({ matches, allEvents }: LiveMatchesProps) {
  // Sort by volume24hr and take top events
  const sortedByVolume = [...allEvents].sort((a, b) => b.volume24hr - a.volume24hr);
  
  // If no live matches, show top high-volume events
  const displayMatches = matches.length > 0 
    ? matches 
    : sortedByVolume.slice(0, 2);

  // Filter only events with significant volume (>$100K)
  const significantMatches = displayMatches.filter(e => e.volume24hr > 100000);

  if (significantMatches.length === 0) {
    return (
      <div className="bg-white rounded-[8px] p-6">
        <h2 className="text-[2rem] font-bold text-[#111111] mb-4">Top Markets</h2>
        <p className="text-gray-600 font-light">No high-volume markets at the moment</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[8px] p-6">
      <h2 className="text-[2rem] font-bold text-[#111111] mb-4">
        {matches.length > 0 ? 'Live' : 'Top Markets'}
      </h2>
      
      <div className="space-y-4">
        {significantMatches.map((event, idx) => {
          const mainMarket = event.markets[0];
          if (!mainMarket) return null;

          return (
            <div key={event.id} className="space-y-3">
              <div className="flex items-center justify-between">
                {/* Match info */}
                <div className="flex items-center gap-8">
                  <div className="text-xs text-gray-600 font-light">
                    <div>{event.endDate}</div>
                    <div className="font-normal">{event.volume24hr ? `$${(event.volume24hr / 1000000).toFixed(1)}M Vol.` : 'N/A'}</div>
                    <div>{event.series || 'World Cup'}</div>
                  </div>

                  {/* Title */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#111111] text-sm">{event.title}</h3>
                    {event.score && (
                      <div className="text-2xl font-bold text-[#111111] mt-1">{event.score}</div>
                    )}
                  </div>
                </div>

                {/* Odds - first 3 outcomes */}
                <div className="flex items-center gap-2">
                  {mainMarket.outcomes.slice(0, 3).map((outcome, i) => {
                    const colors = ['bg-[#31A159]', 'bg-[#E6E6E6]', 'bg-[#FFC4D0]'];
                    return (
                      <button
                        key={i}
                        className={`px-4 py-2 rounded-[8px] text-xs font-medium ${colors[i] || 'bg-gray-200'} text-[#111111] hover:opacity-80 transition-opacity border-[0.5rem] border-transparent`}
                      >
                        {outcome.label} {Math.round(outcome.price * 100)}¢
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Additional markets */}
              {event.markets.slice(1, 2).map((market) => (
                <div key={market.id} className="pl-24">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#111111] font-light">{market.question}</span>
                    <div className="flex items-center gap-2">
                      {market.outcomes.slice(0, 2).map((opt, i) => (
                        <button
                          key={i}
                          className={`px-4 py-1.5 rounded-[8px] text-xs font-medium ${i === 0 ? 'bg-[#31A159]' : 'bg-[#FFC4D0]'} text-[#111111] hover:opacity-80 transition-opacity border-[0.5rem] border-transparent`}
                        >
                          {opt.label} {Math.round(opt.price * 100)}¢
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Divider */}
              {idx < significantMatches.length - 1 && (
                <div className="flex items-center gap-2 pt-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-[#111111]' : 'bg-gray-300'}`} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
