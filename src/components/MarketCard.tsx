"use client";

import { Market } from "@/types/market";
import { Clock, BarChart3, Zap, DollarSign } from "lucide-react";

interface MarketCardProps {
  market: Market;
  onTrade: (market: Market) => void;
}

const categoryColors: Record<string, string> = {
  FIFA: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "World Cup": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  CONMEBOL: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  UEFA: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Soccer: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Sports: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

const outcomeColors = [
  { bar: "from-emerald-500 to-emerald-400", text: "text-emerald-400" },
  { bar: "from-red-500 to-red-400", text: "text-red-400" },
  { bar: "from-blue-500 to-blue-400", text: "text-blue-400" },
  { bar: "from-amber-500 to-amber-400", text: "text-amber-400" },
];

export default function MarketCard({ market, onTrade }: MarketCardProps) {
  return (
    <div className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.06] hover:border-amber-500/30 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${
            categoryColors[market.category] ||
            "bg-gray-500/15 text-gray-400 border-gray-500/30"
          }`}
        >
          {market.category}
        </span>
        <div className="flex items-center gap-2">
          {market.live && (
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
              <Zap className="w-3 h-3" />
              LIVE
            </span>
          )}
        </div>
      </div>

      {market.image && (
        <div className="w-full h-32 rounded-xl overflow-hidden mb-3 bg-white/5">
          <img
            src={market.image}
            alt={market.question}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <h3 className="text-white font-semibold text-sm leading-snug mb-3 min-h-[40px]">
        {market.question}
      </h3>

      {market.score && (
        <div className="text-center text-lg font-bold text-white bg-white/5 rounded-lg py-1.5 mb-3">
          {market.score}
        </div>
      )}

      <div className="flex items-center gap-4 text-[11px] text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <BarChart3 className="w-3 h-3" />
          {market.volume} Vol.
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="w-3 h-3" />
          {market.liquidity} Liq.
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {market.endDate}
        </span>
      </div>

      <div className="space-y-1.5 mb-4">
        {market.outcomes.map((outcome, idx) => {
          const color = outcomeColors[idx % outcomeColors.length];
          const percent = Math.round(outcome.price * 100);
          return (
            <div key={outcome.label} className="flex items-center gap-2">
              <span
                className={`text-[11px] font-medium ${color.text} w-20 truncate`}
              >
                {outcome.label}
              </span>
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${color.bar} rounded-full transition-all duration-500`}
                  style={{ width: `${Math.max(percent, 2)}%` }}
                />
              </div>
              <span
                className={`text-[11px] font-bold ${color.text} w-9 text-right`}
              >
                {percent}¢
              </span>
            </div>
          );
        })}
      </div>

      {!market.resolved && (
        <button
          onClick={() => onTrade(market)}
          className="w-full py-2.5 rounded-xl text-sm font-semibold bg-amber-600/20 text-amber-400 border border-amber-500/30 hover:bg-amber-600 hover:text-white transition-all duration-200"
        >
          Trade
        </button>
      )}
    </div>
  );
}
