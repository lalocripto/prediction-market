"use client";

import { Market } from "@/types/market";

interface HotMarketsProps {
  markets: Market[];
  onTrade: (market: Market) => void;
}

export default function HotMarkets({ markets, onTrade }: HotMarketsProps) {
  const sortedMarkets = [...markets].sort((a, b) => {
    const volA = parseFloat(a.volume.replace(/[$MK]/g, '')) * (a.volume.includes('M') ? 1000000 : a.volume.includes('K') ? 1000 : 1);
    const volB = parseFloat(b.volume.replace(/[$MK]/g, '')) * (b.volume.includes('M') ? 1000000 : b.volume.includes('K') ? 1000 : 1);
    return volB - volA;
  });

  const championMarkets = sortedMarkets.filter(m =>
    m.question.toLowerCase().includes('win') ||
    m.question.toLowerCase().includes('champion') ||
    m.question.toLowerCase().includes('winner')
  ).slice(0, 3);

  const otherMarkets = sortedMarkets.filter(m =>
    !championMarkets.includes(m)
  ).slice(0, 4);

  if (markets.length === 0) {
    return (
      <div className="bg-white rounded-[8px] p-4">
        <h2 className="text-lg font-bold text-[#111111]">Hot &gt;</h2>
        <p className="text-gray-600 font-light mt-2 text-xs">No hay mercados disponibles</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[8px] p-4">
      <h2 className="text-lg font-bold text-[#111111] mb-2">Hot &gt;</h2>

      <div className="space-y-3">
        {championMarkets.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-[#111111] text-xs">Ganador del Torneo</h3>
              <span className="text-[10px] text-gray-600 font-light">
                {championMarkets.reduce((sum, m) => {
                  const vol = parseFloat(m.volume.replace(/[$MK]/g, '')) || 0;
                  return sum + vol;
                }, 0).toFixed(1)}M total
              </span>
            </div>

            <div className="space-y-1.5">
              {championMarkets.map((market, idx) => (
                <button
                  key={market.id}
                  onClick={() => onTrade(market)}
                  className="w-full flex items-center justify-between p-2 rounded-[8px] bg-[#E6E6E6] hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-[10px] text-gray-600">#{idx + 1}</span>
                    <span className="text-xs font-medium text-[#111111] truncate">{market.question}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-[#111111] font-light">{market.volume}</span>
                    {market.outcomes[0] && (
                      <span className="text-xs font-medium text-[#31A159]">
                        {Math.round(market.outcomes[0].price * 100)}¢
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {otherMarkets.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-[#111111] text-xs">Mercados en Tendencia</h3>
            {otherMarkets.map((market) => (
              <div key={market.id} className="pb-2 border-b border-[#DCDCDC] last:border-0">
                <div className="flex items-center justify-between text-[10px] text-gray-600 font-light mb-1">
                  <span>{market.eventTitle}</span>
                  <span>{market.volume}</span>
                </div>
                <p className="text-xs font-medium text-[#111111] mb-1 leading-tight">{market.question}</p>
                <div className="flex items-center gap-1">
                  {market.outcomes.slice(0, 2).map((outcome, i) => (
                    <button
                      key={i}
                      onClick={() => onTrade(market)}
                      className={`px-2 py-1 rounded-[8px] text-[10px] font-medium ${i === 0 ? 'bg-[#B0CDFF]' : 'bg-[#FFD2A0]'} text-[#111111] hover:opacity-80 transition-opacity`}
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
