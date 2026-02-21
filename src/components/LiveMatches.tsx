"use client";

import { SoccerEvent, Market } from "@/types/market";

interface LiveMatchesProps {
  matches: SoccerEvent[];
  allEvents: SoccerEvent[];
  onTrade: (market: Market) => void;
}

export default function LiveMatches({ matches, allEvents, onTrade }: LiveMatchesProps) {
  const sortedByVolume = [...allEvents].sort((a, b) => b.volume24hr - a.volume24hr);
  const displayMatches = matches.length > 0 ? matches : sortedByVolume.slice(0, 2);
  const significantMatches = displayMatches.filter(e => e.volume24hr > 100000);

  if (significantMatches.length === 0) {
    return (
      <div className="bg-white rounded-[8px] p-4">
        <h2 className="text-lg font-bold text-[#111111] mb-2">Top Markets</h2>
        <p className="text-gray-600 font-light text-xs">No high-volume markets at the moment</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[8px] p-4">
      <h2 className="text-lg font-bold text-[#111111] mb-2">
        {matches.length > 0 ? 'Live' : 'Top Markets'}
      </h2>

      <div className="space-y-3">
        {significantMatches.map((event, idx) => {
          const mainMarket = event.markets[0];
          if (!mainMarket) return null;

          return (
            <div key={event.id} className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="text-[10px] text-gray-600 font-light shrink-0">
                    <div>{event.endDate}</div>
                    <div className="font-normal">{event.volume24hr ? `$${(event.volume24hr / 1000000).toFixed(1)}M` : ''}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#111111] text-xs leading-tight truncate">{event.title}</h3>
                    {event.score && (
                      <div className="text-lg font-bold text-[#111111]">{event.score}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {mainMarket.outcomes.slice(0, 3).map((outcome, i) => {
                    const colors = ['bg-[#B0CDFF]', 'bg-[#E6E6E6]', 'bg-[#FFD2A0]'];
                    return (
                      <button
                        key={i}
                        onClick={() => onTrade(mainMarket)}
                        className={`px-2 py-1 rounded-[8px] text-[10px] font-medium ${colors[i] || 'bg-gray-200'} text-[#111111] hover:opacity-80 transition-opacity`}
                      >
                        {outcome.label} {Math.round(outcome.price * 100)}¢
                      </button>
                    );
                  })}
                </div>
              </div>

              {event.markets.slice(1, 2).map((market) => (
                <div key={market.id} className="pl-12">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-[#111111] font-light">{market.question}</span>
                    <div className="flex items-center gap-1">
                      {market.outcomes.slice(0, 2).map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => onTrade(market)}
                          className={`px-2 py-0.5 rounded-[8px] text-[10px] font-medium ${i === 0 ? 'bg-[#B0CDFF]' : 'bg-[#FFD2A0]'} text-[#111111] hover:opacity-80 transition-opacity`}
                        >
                          {opt.label} {Math.round(opt.price * 100)}¢
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {idx < significantMatches.length - 1 && (
                <div className="border-b border-[#DCDCDC]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
