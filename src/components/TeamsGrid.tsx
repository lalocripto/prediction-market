"use client";

import { SoccerEvent } from "@/types/market";

interface TeamsGridProps {
  events: SoccerEvent[];
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

export default function TeamsGrid({ events }: TeamsGridProps) {
  // Extract unique countries from event titles and market questions
  const extractCountries = () => {
    const countries = new Set<string>();
    const countryNames = Object.keys(countryCodeMap);
    const countryPatterns = new RegExp(`\\b(${countryNames.join('|')})\\b`, 'gi');

    events.forEach(event => {
      const text = `${event.title} ${event.markets.map(m => m.question).join(' ')}`.toLowerCase();
      const matches = text.match(countryPatterns);
      if (matches) {
        matches.forEach(country => {
          countries.add(country.toLowerCase());
        });
      }
    });

    return Array.from(countries).slice(0, 16);
  };

  const teams = extractCountries();

  const getDisplayName = (country: string) => {
    if (country === 'usa') return 'USA';
    if (country === 'south korea') return 'South Korea';
    if (country === 'saudi arabia') return 'Saudi Arabia';
    if (country === 'costa rica') return 'Costa Rica';
    return country.charAt(0).toUpperCase() + country.slice(1);
  };

  const getFlagUrl = (country: string) => {
    const code = countryCodeMap[country];
    if (!code) return null;
    return `https://flagcdn.com/w80/${code}.png`;
  };

  if (teams.length === 0) {
    return (
      <div className="bg-white rounded-[8px] p-4">
        <h2 className="text-lg font-bold text-[#111111] mb-3">Equipos &gt;</h2>
        <p className="text-gray-600 font-light text-xs">Loading teams...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[8px] p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-[#111111]">Equipos &gt;</h2>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {teams.map((team, idx) => {
          const flagUrl = getFlagUrl(team);
          return (
            <button
              key={idx}
              className="flex flex-col items-center justify-center p-2 rounded-[8px] border border-[#DCDCDC] hover:border-[#31A159] hover:bg-[#31A159]/10 transition-all group"
            >
              <div className="w-8 h-8 rounded-full border border-[#B1B1B1] bg-[#E6E6E6] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform overflow-hidden">
                {flagUrl ? (
                  <img
                    src={flagUrl}
                    alt={getDisplayName(team)}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-xs text-gray-400">?</span>
                )}
              </div>
              <span className="text-[10px] font-medium text-[#111111] text-center leading-tight">
                {getDisplayName(team)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
