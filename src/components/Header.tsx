"use client";

import { Tab } from "@/types/market";
import { useWalletContext } from "@/lib/WalletContext";
import { Globe, Wallet, Loader2, AlertTriangle, LogOut } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "winner", label: "Winner" },
  { id: "qualifiers", label: "Qualifiers" },
  { id: "my-bets", label: "My Bets" },
];

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const wallet = useWalletContext();
  const [showDropdown, setShowDropdown] = useState(false);

  const formattedBalance = wallet.usdcBalance
    ? parseFloat(wallet.usdcBalance).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : null;

  return (
    <header className="border-b border-white/10 bg-[#0d0d1a]/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              World Cup 2026
            </span>
            <span className="text-[10px] font-medium text-gray-500 bg-white/5 px-2 py-0.5 rounded-full ml-1">
              powered by Polymarket
            </span>
          </div>

          <nav className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-amber-600 text-white shadow-lg shadow-amber-600/25"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="relative">
            {wallet.isConnected ? (
              <>
                {/* Wrong network warning */}
                {wallet.isWrongNetwork && (
                  <div className="absolute -top-1 -right-1 z-10">
                    <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                  </div>
                )}

                <button
                  onClick={() => setShowDropdown((v) => !v)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    wallet.isWrongNetwork
                      ? "bg-red-500/15 text-red-400 border border-red-500/30"
                      : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {wallet.isWrongNetwork ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                  )}
                  <span className="hidden sm:inline">
                    {wallet.isWrongNetwork
                      ? "Wrong Network"
                      : truncateAddress(wallet.address!)}
                  </span>
                  {formattedBalance && !wallet.isWrongNetwork && (
                    <span className="text-xs text-amber-400/70 border-l border-amber-500/20 pl-2">
                      {formattedBalance} USDC
                    </span>
                  )}
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 top-12 z-50 w-64 bg-[#12122a] border border-white/10 rounded-xl shadow-2xl p-3 space-y-2">
                      <div className="text-xs text-gray-500 px-2">
                        Connected to Monad
                      </div>
                      <div className="text-sm text-white font-mono px-2 truncate">
                        {wallet.address}
                      </div>
                      {formattedBalance && (
                        <div className="flex justify-between px-2 py-1.5 bg-white/5 rounded-lg">
                          <span className="text-xs text-gray-400">USDC</span>
                          <span className="text-xs text-white font-medium">
                            {formattedBalance}
                          </span>
                        </div>
                      )}
                      {wallet.monBalance && (
                        <div className="flex justify-between px-2 py-1.5 bg-white/5 rounded-lg">
                          <span className="text-xs text-gray-400">MON</span>
                          <span className="text-xs text-white font-medium">
                            {parseFloat(wallet.monBalance).toFixed(4)}
                          </span>
                        </div>
                      )}
                      {wallet.isWrongNetwork && (
                        <button
                          onClick={() => {
                            wallet.connect();
                            setShowDropdown(false);
                          }}
                          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Switch to Monad
                        </button>
                      )}
                      <button
                        onClick={() => {
                          wallet.disconnect();
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Disconnect
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <button
                onClick={wallet.connect}
                disabled={wallet.isConnecting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-amber-600 text-white hover:bg-amber-500 shadow-lg shadow-amber-600/25 transition-all disabled:opacity-50"
              >
                {wallet.isConnecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Wallet className="w-4 h-4" />
                )}
                {wallet.isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )}

            {/* Error toast */}
            {wallet.error && (
              <div className="absolute right-0 top-12 z-50 w-72 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-400">
                {wallet.error}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
