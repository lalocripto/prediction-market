"use client";

import { useWalletContext } from "@/lib/WalletContext";
import { Wallet, Loader2 } from "lucide-react";

export default function Header() {
  const wallet = useWalletContext();

  const handleConnect = async () => {
    try {
      console.log("Attempting to connect wallet...");
      await wallet.connect();
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

  return (
    <header className="bg-white sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#31A159] flex items-center justify-center">
              <span className="text-xl">⚽</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#111111]">World Cup 2026</h1>
              <p className="text-xs text-gray-600 font-light">Mercados de Predicción</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {wallet.error && (
              <div className="px-3 py-1 rounded-[8px] bg-red-100 border border-red-300 text-xs text-red-600 max-w-xs truncate">
                {wallet.error}
              </div>
            )}
            {wallet.isConnected ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-[8px] bg-transparent border border-[#DCDCDC]">
                <div className="w-2 h-2 rounded-full bg-[#31A159]" />
                <span className="text-sm font-medium text-[#111111]">
                  {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                </span>
                {wallet.usdcBalance && (
                  <span className="text-sm text-[#111111] border-l border-[#DCDCDC] pl-2">
                    {parseFloat(wallet.usdcBalance).toFixed(2)} USDC
                  </span>
                )}
              </div>
            ) : (
              <button
                onClick={handleConnect}
                disabled={wallet.isConnecting}
                className="flex items-center gap-2 px-4 py-2 rounded-[8px] bg-[#31A159] text-[#111111] hover:opacity-90 transition-all disabled:opacity-50 font-medium"
              >
                {wallet.isConnecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Wallet className="w-4 h-4" />
                )}
                {wallet.isConnecting ? "Conectando..." : "Conectar Wallet"}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
