"use client";

import { useState } from "react";
import { Bet } from "@/types/market";
import { useWalletContext } from "@/lib/WalletContext";
import {
  ExternalLink,
  Loader2,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
} from "lucide-react";

interface PositionsProps {
  bets: Bet[];
  onSellComplete: (betIndex: number, sellSignature: string, sellTxHash: string) => void;
}

type PositionTab = "open" | "history";

export default function Positions({ bets, onSellComplete }: PositionsProps) {
  const wallet = useWalletContext();
  const [activeTab, setActiveTab] = useState<PositionTab>("open");
  const [sellingIndex, setSellingIndex] = useState<number | null>(null);
  const [sellStep, setSellStep] = useState<"idle" | "approving" | "signing" | "done">("idle");
  const [sellError, setSellError] = useState<string | null>(null);

  // Separate open positions (not sold) from history (sold)
  const openPositions = bets.filter(b => !b.sellSignature);
  const closedPositions = bets.filter(b => b.sellSignature);

  const displayBets = activeTab === "open" ? openPositions : closedPositions;

  const handleSell = async (bet: Bet, index: number) => {
    if (!wallet.isConnected) {
      await wallet.connect();
      return;
    }

    setSellingIndex(index);
    setSellError(null);

    // Current value estimate (shares * current implied price)
    const shares = bet.amount / bet.price;
    const sellAmount = shares * bet.price; // Selling at same price for demo

    // Step 1: Approve
    let txHash = "";
    try {
      setSellStep("approving");
      txHash = await wallet.approveUSDC(sellAmount);
    } catch (err: unknown) {
      const e = err as { code?: number; message?: string };
      if (e.code === 4001) {
        setSellError("Rechazado en MetaMask");
      } else {
        setSellError(e.message || "Aprobación fallida");
      }
      setSellStep("idle");
      setSellingIndex(null);
      return;
    }

    // Step 2: Sign sell order
    let signature = "";
    try {
      setSellStep("signing");
      signature = await wallet.signTypedOrder({
        tokenId: bet.marketId,
        side: "SELL",
        makerAmount: shares,
        takerAmount: sellAmount,
      });
    } catch (err: unknown) {
      const e = err as { code?: number; message?: string };
      if (e.code === 4001) {
        setSellError("Firma rechazada");
      } else {
        setSellError(e.message || "Firma fallida");
      }
      setSellStep("idle");
      setSellingIndex(null);
      return;
    }

    // Step 3: Done
    setSellStep("done");
    onSellComplete(index, signature, txHash);
    wallet.refreshBalance();

    // Reset after short delay
    setTimeout(() => {
      setSellStep("idle");
      setSellingIndex(null);
    }, 2000);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString("es-MX", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-[8px] p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-[#111111]">Posiciones</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("open")}
            className={`px-2 py-0.5 rounded-[8px] text-[10px] font-medium transition-colors ${
              activeTab === "open"
                ? "bg-[#836EF9] text-white"
                : "bg-[#DAD3FF]/40 text-[#111111] hover:opacity-80"
            }`}
          >
            Abiertas ({openPositions.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-2 py-0.5 rounded-[8px] text-[10px] font-medium transition-colors ${
              activeTab === "history"
                ? "bg-[#836EF9] text-white"
                : "bg-[#DAD3FF]/40 text-[#111111] hover:opacity-80"
            }`}
          >
            Historial ({closedPositions.length})
          </button>
        </div>
      </div>

      {/* Error banner */}
      {sellError && (
        <div className="mb-2 p-2 rounded-[8px] bg-red-50 border border-red-200 text-[10px] text-red-600 font-light">
          {sellError}
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {displayBets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ArrowRightLeft className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-xs text-gray-500 font-light">
              {activeTab === "open"
                ? "No tienes posiciones abiertas"
                : "No tienes historial de ventas"}
            </p>
            {activeTab === "open" && (
              <p className="text-[10px] text-gray-400 font-light mt-1">
                Haz una apuesta para empezar
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {displayBets.map((bet, idx) => {
              const realIndex = bets.indexOf(bet);
              const shares = bet.amount / bet.price;
              const potentialReturn = shares * 1;
              const pnl = potentialReturn - bet.amount;
              const pnlPct = (pnl / bet.amount) * 100;
              const isSelling = sellingIndex === realIndex;

              return (
                <div
                  key={`${bet.marketId}-${bet.timestamp}`}
                  className="p-3 rounded-[8px] border border-[#DCDCDC] hover:border-[#B1B1B1] transition-colors"
                >
                  {/* Top row: outcome + timestamp */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                        activeTab === "open" ? "bg-[#836EF9]" : "bg-gray-400"
                      }`} />
                      <span className="text-xs font-semibold text-[#111111]">
                        {bet.outcome}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-light">
                      {formatTime(bet.timestamp)}
                    </span>
                  </div>

                  {/* Market question */}
                  <p className="text-[10px] text-gray-500 font-light mb-2 truncate">
                    {bet.marketQuestion || `Mercado: ${bet.marketId.slice(0, 20)}...`}
                  </p>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div>
                      <div className="text-[10px] text-gray-500 font-light">Costo</div>
                      <div className="text-xs font-semibold text-[#111111]">
                        ${bet.amount.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 font-light">Acciones</div>
                      <div className="text-xs font-semibold text-[#111111]">
                        {shares.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 font-light">G&P</div>
                      <div className={`text-xs font-semibold flex items-center gap-0.5 ${
                        pnl >= 0 ? "text-[#836EF9]" : "text-red-500"
                      }`}>
                        {pnl >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {pnl >= 0 ? "+" : ""}{pnlPct.toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  {/* Tx links */}
                  <div className="flex items-center gap-3 mb-2">
                    {bet.txHash && (
                      <a
                        href={`https://monadvision.com/tx/${bet.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-0.5 text-[10px] text-[#836EF9] hover:underline"
                      >
                        Tx {bet.txHash.slice(0, 6)}...
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                    {bet.signature && (
                      <span className="text-[10px] text-gray-400 font-mono">
                        Sig: {bet.signature.slice(0, 8)}...
                      </span>
                    )}
                  </div>

                  {/* Sell button (only for open positions) */}
                  {activeTab === "open" && (
                    <button
                      onClick={() => handleSell(bet, realIndex)}
                      disabled={isSelling}
                      className={`w-full py-1.5 rounded-[8px] text-xs font-medium transition-all ${
                        isSelling
                          ? sellStep === "done"
                            ? "bg-[#836EF9]/20 text-[#836EF9] border border-[#836EF9]"
                            : "bg-[#DAD3FF]/40 text-gray-500"
                          : "bg-[#F1FBB9] text-[#111111] hover:opacity-80"
                      }`}
                    >
                      {isSelling ? (
                        <span className="flex items-center justify-center gap-1.5">
                          {sellStep === "approving" && (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Aprobando...
                            </>
                          )}
                          {sellStep === "signing" && (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Firmando...
                            </>
                          )}
                          {sellStep === "done" && "Vendido ✓"}
                        </span>
                      ) : (
                        `Vender — $${(shares * bet.price).toFixed(2)}`
                      )}
                    </button>
                  )}

                  {/* Sold info for history */}
                  {activeTab === "history" && bet.sellSignature && (
                    <div className="flex items-center justify-between p-1.5 rounded-[8px] bg-[#DAD3FF]/40/50">
                      <span className="text-[10px] text-gray-500 font-light">Firma venta:</span>
                      <span className="text-[10px] text-gray-600 font-mono">
                        {bet.sellSignature.slice(0, 12)}...
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
