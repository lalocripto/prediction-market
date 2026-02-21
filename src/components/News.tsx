"use client";

export default function News() {
  return (
    <div className="bg-white rounded-[8px] p-4">
      <h2 className="text-lg font-bold text-[#111111] mb-2">Noticias</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <article className="space-y-2">
          <div className="aspect-video rounded-[8px] overflow-hidden bg-[#DAD3FF]/30">
            <img
              src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=60"
              alt="News"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-sm font-bold text-[#111111] leading-tight">
            Cristiano ronaldo anota el gol del mundial
          </h3>
          <p className="text-[10px] text-gray-600 leading-relaxed font-light line-clamp-2">
            Detalle sobre la noticia bla bla bla bla. Detalle sobre la noticia bla bla bla bla.
          </p>
          <button className="text-xs font-medium text-[#836EF9] hover:opacity-80 transition-opacity underline">
            Leer más →
          </button>
        </article>

        <article className="space-y-2">
          <div className="aspect-video rounded-[8px] overflow-hidden bg-[#DAD3FF]/30">
            <img
              src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&q=60"
              alt="News"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-sm font-bold text-[#111111] leading-tight">
            Messi lidera a Argentina en las eliminatorias
          </h3>
          <p className="text-[10px] text-gray-600 leading-relaxed font-light line-clamp-2">
            La selección argentina avanza con paso firme hacia el mundial 2026.
          </p>
          <button className="text-xs font-medium text-[#836EF9] hover:opacity-80 transition-opacity underline">
            Leer más →
          </button>
        </article>
      </div>
    </div>
  );
}
