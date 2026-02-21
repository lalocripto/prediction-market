"use client";

import { useWalletContext } from "@/lib/WalletContext";
import { Wallet, Loader2, BarChart3, Trophy, Newspaper, TrendingUp } from "lucide-react";

export default function Sidebar() {
  const wallet = useWalletContext();

  const handleConnect = async () => {
    try {
      await wallet.connect();
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

  return (
    <aside className="w-[72px] bg-[#1A1A2E] flex flex-col items-center py-4 gap-3 shrink-0 rounded-[12px] m-2 mr-0">
      {/* Logo */}
      <div className="w-10 h-10 rounded-[10px] bg-[#836EF9] flex items-center justify-center mb-2 overflow-hidden">
        <img src="/mondial_logo.svg" alt="Mondial" className="w-9 h-9 object-contain" />
      </div>

      {/* Nav icons */}
      <nav className="flex flex-col items-center gap-2 flex-1">
        <button className="w-10 h-10 rounded-[10px] bg-[#836EF9] flex items-center justify-center hover:opacity-80 transition-opacity" title="Mercados">
          <BarChart3 className="w-5 h-5 text-white" />
        </button>
        <button className="w-10 h-10 rounded-[10px] bg-[#DAD3FF] flex items-center justify-center hover:opacity-80 transition-opacity" title="Equipos">
          <Trophy className="w-5 h-5 text-[#836EF9]" />
        </button>
        <button className="w-10 h-10 rounded-[10px] bg-[#F1FBB9] flex items-center justify-center hover:opacity-80 transition-opacity" title="Tendencias">
          <TrendingUp className="w-5 h-5 text-[#1A1A2E]" />
        </button>
        <button className="w-10 h-10 rounded-[10px] bg-[#DAD3FF]/50 flex items-center justify-center hover:opacity-80 transition-opacity" title="Noticias">
          <Newspaper className="w-5 h-5 text-[#836EF9]/70" />
        </button>
      </nav>

      {/* Wallet at bottom */}
      <div className="flex flex-col items-center gap-2">
        {wallet.isConnected ? (
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-[10px] bg-[#836EF9]/20 border border-[#836EF9]/40 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#836EF9]" />
            </div>
            <span className="text-[8px] text-gray-400 font-mono">
              {wallet.address?.slice(0, 4)}..{wallet.address?.slice(-3)}
            </span>
            {wallet.usdcBalance && (
              <span className="text-[8px] text-[#DAD3FF] font-medium">
                {parseFloat(wallet.usdcBalance).toFixed(0)}
              </span>
            )}
          </div>
        ) : (
          <button
            onClick={handleConnect}
            disabled={wallet.isConnecting}
            className="w-10 h-10 rounded-[10px] bg-[#836EF9] flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-50"
            title="Conectar Wallet"
          >
            {wallet.isConnecting ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Wallet className="w-5 h-5 text-white" />
            )}
          </button>
        )}
      </div>
    </aside>
  );
}
