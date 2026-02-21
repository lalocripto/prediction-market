"use client";

import { SoccerEvent, Market } from "@/types/market";
import MarketCard from "./MarketCard";
import { BarChart3, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface EventGroupProps {
  event: SoccerEvent;
  onTrade: (market: Market) => void;
  defaultExpanded?: boolean;
}

export default function EventGroup({
  event,
  onTrade,
  defaultExpanded = true,
}: EventGroupProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  // If the event has only 1 market, just show the card directly
  if (event.markets.length === 1) {
    return (
      <MarketCard market={event.markets[0]} onTrade={onTrade} />
    );
  }

  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 p-4 hover:bg-white/[0.03] transition-colors"
      >
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="w-10 h-10 rounded-lg object-cover shrink-0"
          />
        )}
        <div className="flex-1 text-left">
          <h3 className="text-white font-semibold text-sm">{event.title}</h3>
          <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-1">
            {event.series && (
              <span className="text-emerald-400/70 font-medium">
                {event.series}
              </span>
            )}
            <span className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              ${event.volume >= 1_000_000
                ? `${(event.volume / 1_000_000).toFixed(1)}M`
                : event.volume >= 1_000
                ? `${(event.volume / 1_000).toFixed(1)}K`
                : event.volume.toFixed(0)}{" "}
              Vol.
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {event.endDate}
            </span>
            <span className="text-gray-600">
              {event.markets.length} markets
            </span>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-3 pt-0">
          {event.markets.map((market) => (
            <MarketCard key={market.id} market={market} onTrade={onTrade} />
          ))}
        </div>
      )}
    </div>
  );
}
