"use client";

export default function News() {
  return (
    <div className="bg-white rounded-[8px] p-6">
      <h2 className="text-[2rem] font-bold text-[#111111] mb-4">Noticias</h2>

      <article className="space-y-3">
        {/* Featured image */}
        <div className="aspect-video rounded-[8px] overflow-hidden bg-[#E6E6E6]">
          <img
            src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80"
            alt="News"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-[#111111]">
          Cristiano ronaldo anota el gol del mundial
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed font-light">
          Detalle sobre la noticia bla bla bla bla. Detalle sobre la noticia bla bla bla bla.
          Detalle sobre la noticia bla bla bla bla. Detalle sobre la noticia bla bla bla bla.
          Detalle sobre la noticia bla bla bla bla.
        </p>

        {/* Read more */}
        <button className="text-sm font-medium text-[#31A159] hover:opacity-80 transition-opacity underline">
          Leer más →
        </button>
      </article>
    </div>
  );
}
