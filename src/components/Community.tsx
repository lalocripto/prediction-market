"use client";

import { useState } from "react";

export default function Community() {
  const [comment, setComment] = useState("");
  const [filter, setFilter] = useState("Recientes");

  const comments = [
    { id: 1, user: "Usuario", text: "Detalle del comentario", likes: 1 },
    { id: 2, user: "Usuario", text: "Detalle del comentario", likes: 1 }
  ];

  const tabs = ["Comentarios", "Top Holders", "Position", "Activity"];

  return (
    <div className="bg-white rounded-[8px] p-4 h-full">
      <h2 className="text-lg font-bold text-[#111111] mb-2">Comunidad</h2>

      <div className="flex items-center gap-3 border-b border-[#DCDCDC] mb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-1.5 text-[10px] font-medium transition-colors ${
              tab === "Comentarios"
                ? "text-[#111111] border-b-2 border-[#111111]"
                : "text-gray-600 hover:text-[#111111]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mb-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Agrega comentario"
            className="flex-1 px-3 py-1.5 bg-transparent border border-[#DCDCDC] rounded-[8px] text-xs placeholder:text-gray-400 text-[#111111] focus:outline-none focus:border-[#31A159] transition-all"
          />
          <button className="px-3 py-1.5 rounded-[8px] bg-[#31A159] text-[#111111] text-xs font-medium hover:opacity-80 transition-opacity">
            Post
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => setFilter("Recientes")}
          className={`px-2 py-0.5 rounded-[8px] text-[10px] font-medium transition-colors ${
            filter === "Recientes"
              ? "bg-[#111111] text-white"
              : "bg-[#E6E6E6] text-[#111111] hover:opacity-80"
          }`}
        >
          Recientes
        </button>
        <button
          onClick={() => setFilter("Holders")}
          className={`px-2 py-0.5 rounded-[8px] text-[10px] font-medium transition-colors ${
            filter === "Holders"
              ? "bg-[#111111] text-white"
              : "bg-[#E6E6E6] text-[#111111] hover:opacity-80"
          }`}
        >
          Holders
        </button>
      </div>

      <div className="space-y-2">
        {comments.map((c) => (
          <div key={c.id} className="flex items-start gap-2 p-2 rounded-[8px] hover:bg-[#E6E6E6] transition-colors">
            <div className="w-6 h-6 rounded-full border border-[#B1B1B1] bg-[#E6E6E6] flex items-center justify-center shrink-0">
              <span className="text-[10px]">👤</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-xs text-[#111111]">{c.user}</div>
              <div className="text-[10px] text-gray-600 font-light">{c.text}</div>
              <button className="flex items-center gap-1 text-[10px] text-gray-600 hover:text-[#111111]">
                <span>❤️</span>
                <span>{c.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
