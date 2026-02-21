"use client";

import { useState } from "react";
import { Market, Outcome, Bet } from "@/types/market";
import { useWalletContext } from "@/lib/WalletContext";
import {
  X,
  Info,
  Loader2,
  CheckCircle,
  ExternalLink,
  AlertCircle,
  Wallet,
} from "lucide-react";

type TradeStep = "input" | "approving" | "signing" | "confirmed";

interface TradeModalProps {
  market: Market;
  onClose: () => void;
  onPlaceBet: (bet: Bet) => void;
}

export default function TradeModal({
  market,
  onClose,
  onPlaceBet,
}: TradeModalProps) {
  const wallet = useWalletContext();
  const [selectedOutcome, setSelectedOutcome] = useState<Outcome>(
    market.outcomes[0]
  );
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<TradeStep>("input");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [tradeError, setTradeError] = useState<string | null>(null);

  const shares = amount ? parseFloat(amount) / selectedOutcome.price : 0;
  const potentialReturn = amount ? shares * 1 : 0;
  const profit = potentialReturn - (parseFloat(amount) || 0);

  const balance = wallet.usdcBalance ? parseFloat(wallet.usdcBalance) : 0;
  const amountNum = parseFloat(amount) || 0;
  const insufficientBalance = amountNum > balance;

  const handleSubmit = async () => {
    if (!amount || amountNum <= 0 || !wallet.isConnected) return;

    setTradeError(null);

    // Step 1: Approve USDC
    try {
      setStep("approving");
      const hash = await wallet.approveUSDC(amountNum);
      setTxHash(hash);
    } catch (err: unknown) {
      const e = err as { code?: number; message?: string };
      if (e.code === 4001) {
        setTradeError("Transaction rejected in MetaMask");
      } else {
        setTradeError(e.message || "Approval failed");
      }
      setStep("input");
      return;
    }

    // Step 2: Sign order
    try {
      setStep("signing");
      const sig = await wallet.signTypedOrder({
        tokenId: market.id,
        side: "BUY",
        makerAmount: amountNum,
        takerAmount: shares,
      });
      setSignature(sig);
    } catch (err: unknown) {
      const e = err as { code?: number; message?: string };
      if (e.code === 4001) {
        setTradeError("Signing rejected in MetaMask");
      } else {
        setTradeError(e.message || "Signing failed");
      }
      setStep("input");
      return;
    }

    // Step 3: Confirmed
    setStep("confirmed");
    wallet.refreshBalance();

    onPlaceBet({
      marketId: market.id,
      outcome: selectedOutcome.label,
      amount: amountNum,
      price: selectedOutcome.price,
      timestamp: Date.now(),
      txHash: txHash || undefined,
      signature: signature || undefined,
      walletAddress: wallet.address || undefined,
    });
  };

  const resetTrade = () => {
    setStep("input");
    setTxHash(null);
    setSignature(null);
    setTradeError(null);
  };

  const outcomeButtonColors = [
    {
      active:
        "bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-amber-500/10",
      submit:
        "bg-amber-500 hover:bg-amber-400 shadow-amber-500/25 disabled:bg-amber-500/20 disabled:text-amber-500/50",
    },
    {
      active:
        "bg-red-500/20 text-red-400 border-red-500/50 shadow-red-500/10",
      submit:
        "bg-red-500 hover:bg-red-400 shadow-red-500/25 disabled:bg-red-500/20 disabled:text-red-500/50",
    },
    {
      active:
        "bg-blue-500/20 text-blue-400 border-blue-500/50 shadow-blue-500/10",
      submit:
        "bg-blue-500 hover:bg-blue-400 shadow-blue-500/25 disabled:bg-blue-500/20 disabled:text-blue-500/50",
    },
    {
      active:
        "bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-amber-500/10",
      submit:
        "bg-amber-500 hover:bg-amber-400 shadow-amber-500/25 disabled:bg-amber-500/20 disabled:text-amber-500/50",
    },
  ];

  const selectedIdx = market.outcomes.findIndex(
    (o) => o.label === selectedOutcome.label
  );
  const colors = outcomeButtonColors[selectedIdx % outcomeButtonColors.length];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={step === "input" || step === "confirmed" ? onClose : undefined}
      />
      <div className="relative bg-[#12122a] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl shadow-amber-900/20">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">
            {step === "confirmed" ? "Trade Confirmed" : "Place Trade"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Market info (always shown) */}
          <div>
            <p className="text-xs text-gray-500 mb-1">{market.eventTitle}</p>
            <p className="text-sm text-gray-300 leading-relaxed font-medium">
              {market.question}
            </p>
          </div>

          {/* ============ INPUT STEP ============ */}
          {step === "input" && (
            <>
              {/* Not connected warning */}
              {!wallet.isConnected && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <Wallet className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-amber-400">
                      Wallet not connected
                    </p>
                  </div>
                  <button
                    onClick={wallet.connect}
                    className="text-xs font-medium text-amber-400 hover:text-amber-300 underline"
                  >
                    Connect
                  </button>
                </div>
              )}

              {/* Outcome selection */}
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(
                    market.outcomes.length,
                    3
                  )}, 1fr)`,
                }}
              >
                {market.outcomes.map((outcome, idx) => {
                  const btnColors =
                    outcomeButtonColors[idx % outcomeButtonColors.length];
                  const isSelected = selectedOutcome.label === outcome.label;
                  return (
                    <button
                      key={outcome.label}
                      onClick={() => setSelectedOutcome(outcome)}
                      className={`flex flex-col items-center gap-0.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isSelected
                          ? `${btnColors.active} border-2 shadow-lg`
                          : "bg-white/5 text-gray-400 border-2 border-transparent hover:bg-white/10"
                      }`}
                    >
                      <span className="truncate max-w-full px-2 text-xs">
                        {outcome.label}
                      </span>
                      <span className="text-[10px] opacity-70">
                        {Math.round(outcome.price * 100)}¢
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Amount input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-400">
                    Amount (USDC)
                  </label>
                  {wallet.isConnected && (
                    <button
                      onClick={() => setAmount(balance.toString())}
                      className="text-[10px] text-amber-400/70 hover:text-amber-400 transition-colors"
                    >
                      Balance: {balance.toFixed(2)} USDC
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className={`w-full bg-white/5 border rounded-xl py-3 pl-8 pr-4 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 transition-all ${
                      insufficientBalance && amountNum > 0
                        ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/25"
                        : "border-white/10 focus:border-amber-500/50 focus:ring-amber-500/25"
                    }`}
                  />
                </div>
                {insufficientBalance && amountNum > 0 && (
                  <p className="text-[10px] text-red-400 mt-1">
                    Insufficient USDC balance
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  {[10, 25, 50, 100].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAmount(preset.toString())}
                      className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white/[0.03] rounded-xl p-4 space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Outcome</span>
                  <span className="text-gray-300">{selectedOutcome.label}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Avg. Price</span>
                  <span className="text-gray-300">
                    {Math.round(selectedOutcome.price * 100)}¢
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Est. Shares</span>
                  <span className="text-gray-300">{shares.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Potential Return</span>
                  <span className="text-amber-400 font-medium">
                    ${potentialReturn.toFixed(2)}{" "}
                    {profit > 0 && (
                      <span className="text-amber-500">
                        (+
                        {(
                          (profit / (parseFloat(amount) || 1)) *
                          100
                        ).toFixed(0)}
                        %)
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Network</span>
                  <span className="text-gray-300">Monad</span>
                </div>
              </div>

              {/* Error */}
              {tradeError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="text-xs text-red-400">{tradeError}</p>
                </div>
              )}

              <div className="flex items-start gap-2 text-xs text-gray-500">
                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>
                  Each share pays $1 if the outcome resolves in your favor.
                  Prices from Polymarket.
                </span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={
                  !amount ||
                  amountNum <= 0 ||
                  !wallet.isConnected ||
                  insufficientBalance
                }
                className={`w-full py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg ${colors.submit} disabled:shadow-none disabled:cursor-not-allowed`}
              >
                {!wallet.isConnected
                  ? "Connect Wallet First"
                  : `Buy "${selectedOutcome.label}"`}
              </button>
            </>
          )}

          {/* ============ APPROVING STEP ============ */}
          {step === "approving" && (
            <div className="flex flex-col items-center py-6">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
              </div>
              <h3 className="text-white font-semibold mb-1">
                Approve USDC Spending
              </h3>
              <p className="text-xs text-gray-400 text-center mb-4">
                Confirm the approval transaction in MetaMask to allow spending{" "}
                {amountNum.toFixed(2)} USDC
              </p>
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Waiting for MetaMask confirmation...
              </div>
            </div>
          )}

          {/* ============ SIGNING STEP ============ */}
          {step === "signing" && (
            <div className="flex flex-col items-center py-6">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
              <h3 className="text-white font-semibold mb-1">Sign Order</h3>
              <p className="text-xs text-gray-400 text-center mb-4">
                Sign the EIP-712 order in MetaMask to place your trade
              </p>
              {txHash && (
                <a
                  href={`https://monadvision.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] text-amber-400 hover:underline mb-2"
                >
                  Approval tx: {txHash.slice(0, 10)}...{txHash.slice(-6)}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                Waiting for signature...
              </div>
            </div>
          )}

          {/* ============ CONFIRMED STEP ============ */}
          {step === "confirmed" && (
            <div className="flex flex-col items-center py-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-white font-semibold mb-1">
                Order Placed Successfully!
              </h3>
              <p className="text-xs text-gray-400 text-center mb-4">
                Your order to buy &quot;{selectedOutcome.label}&quot; for $
                {amountNum.toFixed(2)} has been signed
              </p>

              <div className="w-full bg-white/[0.03] rounded-xl p-4 space-y-2 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Outcome</span>
                  <span className="text-white">{selectedOutcome.label}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Amount</span>
                  <span className="text-white">${amountNum.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Est. Shares</span>
                  <span className="text-white">{shares.toFixed(2)}</span>
                </div>
                {txHash && (
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-gray-500">Approval Tx</span>
                    <a
                      href={`https://monadvision.com/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-amber-400 hover:underline"
                    >
                      {txHash.slice(0, 8)}...{txHash.slice(-4)}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                {signature && (
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-gray-500">Signature</span>
                    <span className="text-gray-300 font-mono text-[10px]">
                      {signature.slice(0, 10)}...{signature.slice(-6)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 w-full">
                <button
                  onClick={() => {
                    resetTrade();
                    setAmount("");
                  }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                >
                  New Trade
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-amber-600 text-white hover:bg-amber-500 transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
