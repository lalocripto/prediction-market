import {
  PolymarketEvent,
  SoccerEvent,
  Market,
  Outcome,
} from "@/types/market";

const GAMMA_API = "https://gamma-api.polymarket.com";

// Only fetch World Cup related events
const SOCCER_TAG_SLUGS = ["soccer"];

function formatVolume(volume: number | string | undefined | null): string {
  if (volume == null) return "$0";
  const num = typeof volume === "string" ? parseFloat(volume) : volume;
  if (isNaN(num)) return "$0";
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
  return `$${num.toFixed(0)}`;
}

function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return "TBD";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "TBD";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function parseOutcomes(market: {
  outcomes: string;
  outcomePrices: string;
}): Outcome[] {
  try {
    const labels: string[] = JSON.parse(market.outcomes);
    const prices: string[] = JSON.parse(market.outcomePrices);
    return labels.map((label, i) => ({
      label,
      price: parseFloat(prices[i]) || 0,
    }));
  } catch {
    return [
      { label: "Yes", price: 0.5 },
      { label: "No", price: 0.5 },
    ];
  }
}

function getCategoryFromTags(
  tags: { label: string; slug: string }[]
): { label: string; slug: string } {
  const priority = [
    "FIFA",
    "World Cup",
    "CONMEBOL",
    "UEFA",
    "Soccer",
    "Sports",
  ];
  for (const p of priority) {
    const found = tags.find(
      (t) => t.label.toLowerCase() === p.toLowerCase()
    );
    if (found) return { label: found.label, slug: found.slug };
  }
  return { label: "Soccer", slug: "soccer" };
}

function transformMarket(
  market: PolymarketEvent["markets"][0],
  event: PolymarketEvent
): Market {
  const category = getCategoryFromTags(event.tags);
  return {
    id: market.id,
    question: market.question,
    category: category.label,
    categorySlug: category.slug,
    volume: formatVolume(market.volume),
    volume24h: formatVolume(market.volume24hr),
    endDate: formatDate(market.endDate),
    outcomes: parseOutcomes(market),
    image: event.image,
    icon: event.icon,
    resolved: market.closed && !market.active,
    slug: market.slug,
    liquidity: formatVolume(market.liquidity),
    eventId: event.id,
    eventTitle: event.title,
    live: event.live,
    score: event.score,
  };
}

function transformEvent(event: PolymarketEvent): SoccerEvent {
  const activeMarkets = event.markets.filter(
    (m) => m.active && m.acceptingOrders
  );

  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    image: event.image,
    icon: event.icon,
    endDate: formatDate(event.endDate),
    volume: event.volume || 0,
    volume24hr: event.volume24hr || 0,
    liquidity: event.liquidity || 0,
    markets: activeMarkets.map((m) => transformMarket(m, event)),
    tags: event.tags.map((t) => t.label),
    series: event.series?.[0]?.label,
    live: event.live,
    score: event.score,
  };
}

export async function fetchSoccerEvents(): Promise<SoccerEvent[]> {
  const allEvents: PolymarketEvent[] = [];
  const seenIds = new Set<string>();

  // Fetch from multiple soccer-related tags in parallel
  const fetches = SOCCER_TAG_SLUGS.map(async (tagSlug) => {
    try {
      const res = await fetch(
        `${GAMMA_API}/events?closed=false&tag_slug=${tagSlug}&limit=100`,
        { next: { revalidate: 60 } }
      );
      if (!res.ok) return [];
      const data: PolymarketEvent[] = await res.json();
      return data;
    } catch {
      return [];
    }
  });

  const results = await Promise.all(fetches);
  for (const events of results) {
    for (const event of events) {
      if (!seenIds.has(event.id)) {
        seenIds.add(event.id);
        allEvents.push(event);
      }
    }
  }

  // Filter only World Cup events, then transform
  const worldCupKeywords = ["world cup", "fifa", "wcq"];
  const worldCupEvents = allEvents.filter((e) => {
    const title = e.title.toLowerCase();
    return worldCupKeywords.some((kw) => title.includes(kw));
  });

  const soccerEvents = worldCupEvents
    .map(transformEvent)
    .filter((e) => e.markets.length > 0)
    .sort((a, b) => b.volume24hr - a.volume24hr);

  return soccerEvents;
}
