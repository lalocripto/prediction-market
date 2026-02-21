"use client";

export default function News() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Noticias</h2>

      <article className="space-y-3">
        {/* Featured image */}
        <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
          <img
            src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80"
            alt="News"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900">
          Cristiano ronaldo anota el gol del mundial
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed">
          Detalle sobre la noticia bla bla bla bla. Detalle sobre la noticia bla bla bla bla.
          Detalle sobre la noticia bla bla bla bla. Detalle sobre la noticia bla bla bla bla.
          Detalle sobre la noticia bla bla bla bla.
        </p>

        {/* Read more */}
        <button className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors">
          Leer más →
        </button>
      </article>
    </div>
  );
}
