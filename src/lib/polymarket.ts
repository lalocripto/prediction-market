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
  if (!dateStr) return "Por definir";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Por definir";
  return date.toLocaleDateString("es-MX", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Translate outcome labels from English to Spanish
function translateOutcomeLabel(label: string): string {
  const translations: Record<string, string> = {
    "Yes": "Sí",
    "No": "No",
    "Draw": "Empate",
    "Over": "Más",
    "Under": "Menos",
  };
  return translations[label] || label;
}

// Translate common English patterns in market questions to Spanish
function translateQuestion(question: string): string {
  let q = question;

  // Country name translations
  const countryTranslations: Record<string, string> = {
    "Argentina": "Argentina", "Brazil": "Brasil", "France": "Francia",
    "Germany": "Alemania", "Spain": "España", "Portugal": "Portugal",
    "England": "Inglaterra", "Netherlands": "Países Bajos", "Italy": "Italia",
    "Belgium": "Bélgica", "Croatia": "Croacia", "Uruguay": "Uruguay",
    "Colombia": "Colombia", "Mexico": "México", "United States": "Estados Unidos",
    "Canada": "Canadá", "Chile": "Chile", "Ecuador": "Ecuador",
    "Peru": "Perú", "Japan": "Japón", "South Korea": "Corea del Sur",
    "Australia": "Australia", "Morocco": "Marruecos", "Senegal": "Senegal",
    "Ghana": "Ghana", "Nigeria": "Nigeria", "Cameroon": "Camerún",
    "Tunisia": "Túnez", "Algeria": "Argelia", "Saudi Arabia": "Arabia Saudita",
    "Iran": "Irán", "Qatar": "Catar", "Costa Rica": "Costa Rica",
    "Honduras": "Honduras", "Panama": "Panamá", "Paraguay": "Paraguay",
    "Bolivia": "Bolivia", "Venezuela": "Venezuela", "Poland": "Polonia",
    "Denmark": "Dinamarca", "Sweden": "Suecia", "Norway": "Noruega",
    "Switzerland": "Suiza", "Austria": "Austria", "Wales": "Gales",
    "Scotland": "Escocia", "Serbia": "Serbia", "Turkey": "Turquía",
    "USA": "EE.UU.",
  };

  // Replace country names
  for (const [en, es] of Object.entries(countryTranslations)) {
    if (en !== es) {
      q = q.replace(new RegExp(`\\b${en}\\b`, "g"), es);
    }
  }

  // Common question patterns
  q = q.replace(/Will (.+?) win the 2026 FIFA World Cup\?/i, "¿$1 ganará la Copa del Mundo FIFA 2026?");
  q = q.replace(/Will (.+?) win the FIFA World Cup 2026\?/i, "¿$1 ganará la Copa del Mundo FIFA 2026?");
  q = q.replace(/Will (.+?) win the World Cup\?/i, "¿$1 ganará la Copa del Mundo?");
  q = q.replace(/Will (.+?) win (.+?)\?/i, "¿$1 ganará $2?");
  q = q.replace(/Will (.+?) qualify for/i, "¿$1 se clasificará para");
  q = q.replace(/Will (.+?) advance to/i, "¿$1 avanzará a");
  q = q.replace(/Will (.+?) beat (.+?)\?/i, "¿$1 vencerá a $2?");
  q = q.replace(/Who will win (.+?)\?/i, "¿Quién ganará $1?");
  q = q.replace(/the 2026 FIFA World Cup/gi, "la Copa del Mundo FIFA 2026");
  q = q.replace(/the FIFA World Cup/gi, "la Copa del Mundo FIFA");
  q = q.replace(/World Cup 2026/gi, "Copa del Mundo 2026");
  q = q.replace(/World Cup/gi, "Copa del Mundo");
  q = q.replace(/the group stage/gi, "la fase de grupos");
  q = q.replace(/the semifinals/gi, "las semifinales");
  q = q.replace(/the quarterfinals/gi, "los cuartos de final");
  q = q.replace(/the final/gi, "la final");
  q = q.replace(/the round of 16/gi, "los octavos de final");
  q = q.replace(/Group ([A-Z])/g, "Grupo $1");
  q = q.replace(/Top scorer/gi, "Máximo goleador");
  q = q.replace(/Golden Boot/gi, "Bota de Oro");
  q = q.replace(/Golden Ball/gi, "Balón de Oro");

  return q;
}

// Translate event titles to Spanish
function translateEventTitle(title: string): string {
  let t = title;
  t = t.replace(/2026 FIFA World Cup Winner/gi, "Ganador Copa del Mundo FIFA 2026");
  t = t.replace(/FIFA World Cup 2026/gi, "Copa del Mundo FIFA 2026");
  t = t.replace(/2026 FIFA World Cup/gi, "Copa del Mundo FIFA 2026");
  t = t.replace(/World Cup 2026/gi, "Copa del Mundo 2026");
  t = t.replace(/World Cup/gi, "Copa del Mundo");
  t = t.replace(/Winner/gi, "Ganador");
  t = t.replace(/WCQ/gi, "Eliminatorias");
  t = t.replace(/Qualifiers/gi, "Eliminatorias");
  t = t.replace(/ vs\.? /gi, " vs ");
  return t;
}

function parseOutcomes(market: {
  outcomes: string;
  outcomePrices: string;
}): Outcome[] {
  try {
    const labels: string[] = JSON.parse(market.outcomes);
    const prices: string[] = JSON.parse(market.outcomePrices);
    return labels.map((label, i) => ({
      label: translateOutcomeLabel(label),
      price: parseFloat(prices[i]) || 0,
    }));
  } catch {
    return [
      { label: "Sí", price: 0.5 },
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
    question: translateQuestion(market.question),
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
    eventTitle: translateEventTitle(event.title),
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
    title: translateEventTitle(event.title),
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
