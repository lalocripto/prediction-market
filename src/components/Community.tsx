"use client";

import { useState } from "react";

export default function Community() {
  const [comment, setComment] = useState("");
  const [filter, setFilter] = useState("Recientes");

  const comments = [
    {
      id: 1,
      user: "Usuario",
      text: "Detalle del comentario",
      likes: 1
    },
    {
      id: 2,
      user: "Usuario",
      text: "Detalle del comentario",
      likes: 1
    }
  ];

  const tabs = ["Comentarios", "Top Holders", "Position", "Activity"];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Comunidad</h2>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-2 text-sm font-medium transition-colors ${
              tab === "Comentarios"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Comment input */}
      <div className="mb-4">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Agrega comentario"
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/25 transition-all"
        />
        <button className="mt-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors">
          Post
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setFilter("Recientes")}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
            filter === "Recientes"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Recientes
        </button>
        <button
          onClick={() => setFilter("Holders")}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
            filter === "Holders"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Holders
        </button>
      </div>

      {/* Comments */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
              <span className="text-xs">👤</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900">{comment.user}</div>
              <div className="text-sm text-gray-600 mt-0.5">{comment.text}</div>
              <button className="flex items-center gap-1 mt-1 text-xs text-gray-500 hover:text-gray-700">
                <span>❤️</span>
                <span>{comment.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
