"use client";

import { Market } from "@/types/market";

interface HotMarketsProps {
  markets: Market[];
}

export default function HotMarkets({ markets }: HotMarketsProps) {
  // Sort markets by volume
  const sortedMarkets = [...markets].sort((a, b) => {
    const volA = parseFloat(a.volume.replace(/[$MK]/g, '')) * (a.volume.includes('M') ? 1000000 : a.volume.includes('K') ? 1000 : 1);
    const volB = parseFloat(b.volume.replace(/[$MK]/g, '')) * (b.volume.includes('M') ? 1000000 : b.volume.includes('K') ? 1000 : 1);
    return volB - volA;
  });

  // Group by category - champion/winner markets first
  const championMarkets = sortedMarkets.filter(m => 
    m.question.toLowerCase().includes('win') || 
    m.question.toLowerCase().includes('champion') ||
    m.question.toLowerCase().includes('winner')
  ).slice(0, 3);

  const otherMarkets = sortedMarkets.filter(m => 
    !championMarkets.includes(m)
  ).slice(0, 5);

  if (markets.length === 0) {
    return (
      <div className="bg-white rounded-[8px] p-6">
        <h2 className="text-[2rem] font-bold text-[#111111]">Hot &gt;</h2>
        <p className="text-gray-600 font-light mt-4">No markets available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[8px] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[2rem] font-bold text-[#111111]">Hot &gt;</h2>
      </div>

      <div className="space-y-6">
        {/* Champion markets */}
        {championMarkets.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[#111111]">Tournament Winner</h3>
              <span className="text-sm text-gray-600 font-light">
                {championMarkets.reduce((sum, m) => {
                  const vol = parseFloat(m.volume.replace(/[$MK]/g, '')) || 0;
                  return sum + vol;
                }, 0).toFixed(1)}M total
              </span>
            </div>

            <div className="space-y-2">
              {championMarkets.map((market, idx) => (
                <button
                  key={market.id}
                  className="w-full flex items-center justify-between p-3 rounded-[8px] bg-[#E6E6E6] hover:opacity-80 transition-opacity group"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm text-gray-600">#{idx + 1}</span>
                    <span className="font-medium text-[#111111] truncate">{market.question}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm text-[#111111] font-light">{market.volume}</span>
                    {market.outcomes[0] && (
                      <span className="text-sm font-medium text-[#31A159]">
                        {Math.round(market.outcomes[0].price * 100)}¢
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Other hot markets */}
        {otherMarkets.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-[#111111]">Trending Markets</h3>
            {otherMarkets.map((market) => (
              <div key={market.id} className="pb-3 border-b border-[#DCDCDC] last:border-0">
                <div className="flex items-center justify-between text-xs text-gray-600 font-light mb-2">
                  <div>
                    <div>{market.eventTitle}</div>
                    <div className="font-normal">{market.volume} Vol.</div>
                  </div>
                  <div className="font-normal">{market.category}</div>
                </div>

                <p className="text-sm font-medium text-[#111111] mb-2">{market.question}</p>

                <div className="flex items-center gap-2">
                  {market.outcomes.slice(0, 2).map((outcome, i) => (
                    <button
                      key={i}
                      className={`px-4 py-1.5 rounded-[8px] text-xs font-medium ${i === 0 ? 'bg-[#31A159]' : 'bg-[#FFC4D0]'} text-[#111111] hover:opacity-80 transition-opacity border-[0.5rem] border-transparent`}
                    >
                      {outcome.label} {Math.round(outcome.price * 100)}¢
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
