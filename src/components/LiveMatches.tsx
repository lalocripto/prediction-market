"use client";

import { SoccerEvent, Market } from "@/types/market";

interface LiveMatchesProps {
  matches: SoccerEvent[];
  allEvents: SoccerEvent[];
  onTrade: (market: Market) => void;
}

// Country code map for flags
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

function extractTeams(title: string): { team1: string; team2: string } | null {
  // Try patterns like "X vs Y", "X v Y", "X - Y"
  const vsMatch = title.match(/(.+?)\s+(?:vs\.?|v\.?|–|-)\s+(.+)/i);
  if (vsMatch) {
    return { team1: vsMatch[1].trim(), team2: vsMatch[2].trim() };
  }
  // Try to find two country names in the title
  const countries = Object.keys(countryCodeMap);
  const found: string[] = [];
  const lower = title.toLowerCase();
  for (const c of countries) {
    if (lower.includes(c)) {
      found.push(c);
    }
  }
  if (found.length >= 2) {
    return { team1: found[0], team2: found[1] };
  }
  return null;
}

function getFlagUrl(name: string): string | null {
  const lower = name.toLowerCase().trim();
  const code = countryCodeMap[lower];
  if (!code) return null;
  return `https://flagcdn.com/w80/${code}.png`;
}

function capitalize(s: string): string {
  if (s.toLowerCase() === 'usa') return 'USA';
  return s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

export default function LiveMatches({ matches, allEvents, onTrade }: LiveMatchesProps) {
  const sortedByVolume = [...allEvents].sort((a, b) => b.volume24hr - a.volume24hr);
  const displayMatches = matches.length > 0 ? matches : sortedByVolume.slice(0, 2);
  const significantMatches = displayMatches.filter(e => e.volume24hr > 100000);

  if (significantMatches.length === 0) {
    return (
      <div className="bg-white rounded-[8px] p-4">
        <h2 className="text-lg font-bold text-[#111111] mb-2">Mercados Top</h2>
        <p className="text-gray-600 font-light text-xs">No hay mercados de alto volumen por el momento</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[8px] p-4">
      <h2 className="text-lg font-bold text-[#111111] mb-3">
        {matches.length > 0 ? 'En Vivo' : 'Mercados Top'}
      </h2>

      <div className="space-y-4">
        {significantMatches.map((event, idx) => {
          const mainMarket = event.markets[0];
          if (!mainMarket) return null;

          const teams = extractTeams(event.title);
          const score = event.score || "0 vs 0";

          return (
            <div key={event.id} className="space-y-3">
              {/* Top info row */}
              <div className="flex items-center justify-between text-[10px] text-gray-500 font-light">
                <div className="flex items-center gap-2">
                  <span>{event.endDate}</span>
                  <span className="font-normal">{event.volume24hr ? `$${(event.volume24hr / 1000000).toFixed(1)}M Vol.` : ''}</span>
                </div>
                <span>{event.series || 'Copa del Mundo'}</span>
              </div>

              {/* Match card: flags + score */}
              {teams ? (
                <div className="flex items-center justify-center gap-6">
                  {/* Team 1 */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-full border-2 border-[#DAD3FF] bg-[#DAD3FF]/30 overflow-hidden flex items-center justify-center">
                      {getFlagUrl(teams.team1) ? (
                        <img src={getFlagUrl(teams.team1)!} alt={teams.team1} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg">⚽</span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-[#111111]">{capitalize(teams.team1)}</span>
                  </div>

                  {/* Score */}
                  <div className="text-2xl font-bold text-[#111111] tracking-wider">
                    {score.includes('vs') ? score : `${score.split('-').join(' - ')}`}
                  </div>

                  {/* Team 2 */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-full border-2 border-[#DAD3FF] bg-[#DAD3FF]/30 overflow-hidden flex items-center justify-center">
                      {getFlagUrl(teams.team2) ? (
                        <img src={getFlagUrl(teams.team2)!} alt={teams.team2} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg">⚽</span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-[#111111]">{capitalize(teams.team2)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="font-semibold text-[#111111] text-sm">{event.title}</h3>
                </div>
              )}

              {/* Betting buttons */}
              <div className="grid grid-cols-3 gap-2">
                {mainMarket.outcomes.slice(0, 3).map((outcome, i) => {
                  const colors = ['bg-[#836EF9] text-white', 'bg-[#DAD3FF] text-[#111111]', 'bg-[#F1FBB9] text-[#111111]'];
                  return (
                    <button
                      key={i}
                      onClick={() => onTrade(mainMarket)}
                      className={`flex flex-col items-center py-2.5 rounded-[8px] ${colors[i] || 'bg-gray-200'} hover:opacity-80 transition-opacity`}
                    >
                      <span className="text-xs font-semibold">{outcome.label}</span>
                      <span className="text-[10px] font-light">{Math.round(outcome.price * 100)}¢</span>
                    </button>
                  );
                })}
              </div>

              {/* Sub-market */}
              {event.markets.slice(1, 2).map((market) => (
                <div key={market.id} className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-[#111111] font-light flex-1 min-w-0 truncate">{market.question}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    {market.outcomes.slice(0, 2).map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => onTrade(market)}
                        className={`px-3 py-1 rounded-[8px] text-[10px] font-medium ${i === 0 ? 'bg-[#836EF9] text-white' : 'bg-[#F1FBB9] text-[#111111]'} hover:opacity-80 transition-opacity`}
                      >
                        {opt.label} {Math.round(opt.price * 100)}¢
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Divider dots */}
              {idx < significantMatches.length - 1 && (
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-[#111111]' : 'bg-gray-300'}`} />
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
