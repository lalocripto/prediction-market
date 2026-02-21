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
    <div className="bg-white rounded-[8px] p-6">
      <h2 className="text-[2rem] font-bold text-[#111111] mb-4">Comunidad</h2>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-[#DCDCDC] mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-2 text-sm font-medium transition-colors ${
              tab === "Comentarios"
                ? "text-[#111111] border-b-2 border-[#111111]"
                : "text-gray-600 hover:text-[#111111]"
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
          className="w-full px-4 py-2 bg-transparent border border-[#DCDCDC] rounded-[8px] text-sm placeholder:text-gray-400 text-[#111111] focus:outline-none focus:border-[#31A159] transition-all"
        />
        <button className="mt-2 px-4 py-2 rounded-[8px] bg-[#31A159] text-[#111111] text-sm font-medium hover:opacity-80 transition-opacity">
          Post
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setFilter("Recientes")}
          className={`px-3 py-1 rounded-[8px] text-xs font-medium transition-colors ${
            filter === "Recientes"
              ? "bg-[#111111] text-white"
              : "bg-[#E6E6E6] text-[#111111] hover:opacity-80"
          }`}
        >
          Recientes
        </button>
        <button
          onClick={() => setFilter("Holders")}
          className={`px-3 py-1 rounded-[8px] text-xs font-medium transition-colors ${
            filter === "Holders"
              ? "bg-[#111111] text-white"
              : "bg-[#E6E6E6] text-[#111111] hover:opacity-80"
          }`}
        >
          Holders
        </button>
      </div>

      {/* Comments */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-3 p-3 rounded-[8px] hover:bg-[#E6E6E6] transition-colors">
            <div className="w-8 h-8 rounded-full border-2 border-[#B1B1B1] bg-[#E6E6E6] flex items-center justify-center shrink-0">
              <span className="text-xs">👤</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-[#111111]">{comment.user}</div>
              <div className="text-sm text-gray-600 font-light mt-0.5">{comment.text}</div>
              <button className="flex items-center gap-1 mt-1 text-xs text-gray-600 hover:text-[#111111]">
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
