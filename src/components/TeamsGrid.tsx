"use client";

import { SoccerEvent } from "@/types/market";

interface TeamsGridProps {
  events: SoccerEvent[];
}

export default function TeamsGrid({ events }: TeamsGridProps) {
  // Extract unique countries from event titles and market questions
  const extractCountries = () => {
    const countries = new Set<string>();
    const countryPatterns = /\b(argentina|brazil|france|germany|spain|portugal|england|netherlands|italy|belgium|croatia|uruguay|colombia|mexico|usa|canada|chile|ecuador|peru|japan|south korea|australia|morocco|senegal|ghana|nigeria|cameroon|tunisia|algeria|saudi arabia|iran|qatar)\b/gi;
    
    events.forEach(event => {
      const text = `${event.title} ${event.markets.map(m => m.question).join(' ')}`.toLowerCase();
      const matches = text.match(countryPatterns);
      if (matches) {
        matches.forEach(country => {
          const formatted = country.charAt(0).toUpperCase() + country.slice(1);
          countries.add(formatted);
        });
      }
    });

    return Array.from(countries).slice(0, 16);
  };

  const teams = extractCountries();

  // Country flag emojis map
  const flagMap: Record<string, string> = {
    'Argentina': '🇦🇷', 'Brazil': '🇧🇷', 'France': '🇫🇷', 'Germany': '🇩🇪',
    'Spain': '🇪🇸', 'Portugal': '🇵🇹', 'England': '🏴󐁧󐁢󐁥󐁮󐁧󐁿', 'Netherlands': '🇳🇱',
    'Italy': '🇮🇹', 'Belgium': '🇧🇪', 'Croatia': '🇭🇷', 'Uruguay': '🇺🇾',
    'Colombia': '🇨🇴', 'Mexico': '🇲🇽', 'Usa': '🇺🇸', 'Canada': '🇨🇦',
    'Chile': '🇨🇱', 'Ecuador': '🇪🇨', 'Peru': '🇵🇪', 'Japan': '🇯🇵',
    'South korea': '🇰🇷', 'Australia': '🇦🇺', 'Morocco': '🇲🇦', 'Senegal': '🇸🇳',
    'Ghana': '🇬🇭', 'Nigeria': '🇳🇬', 'Cameroon': '🇨🇲', 'Tunisia': '🇹🇳',
    'Algeria': '🇩🇿', 'Saudi arabia': '🇸🇦', 'Iran': '🇮🇷', 'Qatar': '🇶🇦'
  };

  if (teams.length === 0) {
    return (
      <div className="bg-white rounded-[8px] p-6">
        <h2 className="text-[2rem] font-bold text-[#111111] mb-4">Equipos &gt;</h2>
        <p className="text-gray-600 font-light">Loading teams...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[8px] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[2rem] font-bold text-[#111111]">Equipos &gt;</h2>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {teams.map((team, idx) => (
          <button
            key={idx}
            className="flex flex-col items-center justify-center p-4 rounded-[8px] border-2 border-[#DCDCDC] hover:border-[#31A159] hover:bg-[#31A159]/10 transition-all group"
          >
            <div className="w-10 h-10 rounded-full border-2 border-[#B1B1B1] bg-[#E6E6E6] flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform overflow-hidden">
              {flagMap[team] || '🏳️'}
            </div>
            <span className="text-xs font-medium text-[#111111] text-center">
              {team}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
