"use client";

import { SoccerEvent, Market } from "@/types/market";

interface TeamsGridProps {
  events: SoccerEvent[];
  onTrade: (market: Market) => void;
}

// ISO 3166-1 alpha-2 country codes for flagcdn.com
const countryCodeMap: Record<string, string> = {
  'argentina': 'ar', 'brazil': 'br', 'france': 'fr', 'germany': 'de',
  'spain': 'es', 'portugal': 'pt', 'england': 'gb-eng', 'netherlands': 'nl',
  'italy': 'it', 'belgium': 'be', 'croatia': 'hr', 'uruguay': 'uy',
  'colombia': 'co', 'mexico': 'mx', 'usa': 'us', 'canada': 'ca',
  'chile': 'cl', 'ecuador': 'ec', 'peru': 'pe', 'japan': 'jp',
  'south korea': 'kr', 'australia': 'au', 'morocco': 'ma', 'senegal': 'sn',
  'ghana': 'gh', 'nigeria': 'ng', 'cameroon': 'cm', 'tunisia': 'tn',
  'algeria': 'dz', 'saudi arabia': 'sa', 'iran': 'ir', 'qatar': 'qa',
  'costa rica': 'cr', 'honduras': 'hn', 'panama': 'pa', 'paraguay': 'py',
  'bolivia': 'bo', 'venezuela': 've', 'poland': 'pl', 'denmark': 'dk',
  'sweden': 'se', 'norway': 'no', 'switzerland': 'ch', 'austria': 'at',
  'wales': 'gb-wls', 'scotland': 'gb-sct', 'serbia': 'rs', 'turkey': 'tr',
};

function getDisplayName(country: string): string {
  const spanishNames: Record<string, string> = {
    'usa': 'EE.UU.', 'south korea': 'Corea', 'saudi arabia': 'Arabia',
    'costa rica': 'Costa Rica', 'brazil': 'Brasil', 'france': 'Francia',
    'germany': 'Alemania', 'spain': 'España', 'england': 'Inglaterra',
    'netherlands': 'P. Bajos', 'italy': 'Italia', 'belgium': 'Bélgica',
    'croatia': 'Croacia', 'mexico': 'México', 'canada': 'Canadá',
    'peru': 'Perú', 'japan': 'Japón', 'morocco': 'Marruecos',
    'cameroon': 'Camerún', 'tunisia': 'Túnez', 'algeria': 'Argelia',
    'iran': 'Irán', 'qatar': 'Catar', 'panama': 'Panamá',
    'poland': 'Polonia', 'denmark': 'Dinamarca', 'sweden': 'Suecia',
    'norway': 'Noruega', 'switzerland': 'Suiza', 'wales': 'Gales',
    'scotland': 'Escocia', 'turkey': 'Turquía', 'serbia': 'Serbia',
    'australia': 'Australia',
  };
  return spanishNames[country] || country.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getFlagUrl(country: string): string | null {
  const code = countryCodeMap[country];
  if (!code) return null;
  return `https://flagcdn.com/w80/${code}.png`;
}

interface TeamMarket {
  country: string;
  market: Market;
  price: number; // "Yes" price = probability of winning
}

export default function TeamsGrid({ events, onTrade }: TeamsGridProps) {
  // Find World Cup Winner event(s) — markets like "Will X win the 2026 FIFA World Cup?"
  const winnerMarkets: TeamMarket[] = [];

  events.forEach(event => {
    const titleLower = event.title.toLowerCase();
    const isWinnerEvent =
      titleLower.includes('winner') || titleLower.includes('ganador') ||
      titleLower.includes('world cup') || titleLower.includes('copa del mundo');

    event.markets.forEach(market => {
      const q = market.question.toLowerCase();
      const isWinnerMarket =
        (q.includes('win') || q.includes('ganará')) &&
        (q.includes('world cup') || q.includes('copa del mundo') || q.includes('fifa'));

      if (isWinnerEvent || isWinnerMarket) {
        // Try to extract the country name from the question
        const countryNames = Object.keys(countryCodeMap);
        for (const country of countryNames) {
          if (q.includes(country)) {
            const yesOutcome = market.outcomes.find(o =>
              o.label.toLowerCase() === 'yes' || o.label.toLowerCase() === 'sí'
            );
            const price = yesOutcome ? yesOutcome.price : market.outcomes[0]?.price || 0;
            // Avoid duplicates
            if (!winnerMarkets.find(wm => wm.country === country)) {
              winnerMarkets.push({ country, market, price });
            }
            break;
          }
        }
      }
    });
  });

  // Sort by price (highest probability first)
  winnerMarkets.sort((a, b) => b.price - a.price);

  // Take top 16
  const displayTeams = winnerMarkets.slice(0, 16);

  if (displayTeams.length === 0) {
    // Fallback: extract countries from all events without market data
    const countries = new Set<string>();
    const countryNames = Object.keys(countryCodeMap);
    events.forEach(event => {
      const text = `${event.title} ${event.markets.map(m => m.question).join(' ')}`.toLowerCase();
      for (const c of countryNames) {
        if (text.includes(c)) countries.add(c);
      }
    });

    const fallbackTeams = Array.from(countries).slice(0, 16);

    if (fallbackTeams.length === 0) {
      return (
        <div className="bg-white rounded-[8px] p-4">
          <h2 className="text-lg font-bold text-[#111111] mb-2">Equipos &gt;</h2>
          <p className="text-gray-600 font-light text-xs">Cargando equipos...</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-[8px] p-4">
        <h2 className="text-lg font-bold text-[#111111] mb-2">Equipos &gt;</h2>
        <div className="grid grid-cols-4 gap-2">
          {fallbackTeams.map((team, idx) => {
            const flagUrl = getFlagUrl(team);
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-2 rounded-[8px] border border-[#DCDCDC]"
              >
                <div className="w-8 h-8 rounded-full border border-[#DAD3FF] bg-[#DAD3FF]/30 overflow-hidden flex items-center justify-center mb-1">
                  {flagUrl ? (
                    <img src={flagUrl} alt={getDisplayName(team)} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <span className="text-xs text-gray-400">?</span>
                  )}
                </div>
                <span className="text-[10px] font-medium text-[#111111]">{getDisplayName(team)}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[8px] p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-[#111111]">Equipos &gt;</h2>
        <span className="text-[10px] text-gray-500 font-light">Ganador Copa del Mundo</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {displayTeams.map((tm, idx) => {
          const flagUrl = getFlagUrl(tm.country);
          const priceCents = Math.round(tm.price * 100);
          return (
            <button
              key={idx}
              onClick={() => onTrade(tm.market)}
              className="flex flex-col items-center justify-center p-2 rounded-[8px] border border-[#DAD3FF] hover:border-[#836EF9] hover:bg-[#836EF9]/5 transition-all group"
            >
              <div className="w-8 h-8 rounded-full border border-[#DAD3FF] bg-[#DAD3FF]/30 overflow-hidden flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                {flagUrl ? (
                  <img src={flagUrl} alt={getDisplayName(tm.country)} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <span className="text-xs text-gray-400">?</span>
                )}
              </div>
              <span className="text-[10px] font-semibold text-[#111111] leading-tight">
                {getDisplayName(tm.country)}
              </span>
              <span className={`text-[10px] font-bold mt-0.5 ${
                priceCents >= 10 ? 'text-[#836EF9]' : 'text-gray-500'
              }`}>
                {priceCents}¢
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
