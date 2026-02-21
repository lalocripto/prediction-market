"use client";

import { useWalletContext } from "@/lib/WalletContext";
import { Wallet, Loader2 } from "lucide-react";

export default function Header() {
  const wallet = useWalletContext();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
              <span className="text-xl">⚽</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">World Cup 2026</h1>
              <p className="text-xs text-gray-500">Prediction Markets</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {wallet.isConnected ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 border border-amber-200">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-sm font-medium text-gray-900">
                  {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                </span>
                {wallet.usdcBalance && (
                  <span className="text-sm text-gray-600 border-l border-amber-200 pl-2">
                    {parseFloat(wallet.usdcBalance).toFixed(2)} USDC
                  </span>
                )}
              </div>
            ) : (
              <button
                onClick={wallet.connect}
                disabled={wallet.isConnecting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-500 transition-all disabled:opacity-50"
              >
                {wallet.isConnecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Wallet className="w-4 h-4" />
                )}
                {wallet.isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
