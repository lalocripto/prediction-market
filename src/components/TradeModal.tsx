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

  // Design system outcome button colors
  const outcomeButtonStyles = (idx: number, isSelected: boolean) => {
    const bgColors = ['bg-[#B0CDFF]', 'bg-[#E6E6E6]', 'bg-[#FFD2A0]'];
    const bg = bgColors[idx % bgColors.length] || 'bg-[#E6E6E6]';
    if (isSelected) {
      return `${bg} text-[#111111] border-2 border-[#111111] shadow-md`;
    }
    return `${bg} text-[#111111] border-2 border-transparent hover:opacity-80`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={step === "input" || step === "confirmed" ? onClose : undefined}
      />
      <div className="relative bg-white rounded-[8px] w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#DCDCDC]">
          <h2 className="text-lg font-bold text-[#111111]">
            {step === "confirmed" ? "Trade Confirmed" : "Place Trade"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#111111] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Market info (always shown) */}
          <div>
            <p className="text-xs text-gray-500 font-light mb-1">{market.eventTitle}</p>
            <p className="text-sm text-[#111111] leading-relaxed font-medium">
              {market.question}
            </p>
          </div>

          {/* ============ INPUT STEP ============ */}
          {step === "input" && (
            <>
              {/* Not connected warning */}
              {!wallet.isConnected && (
                <div className="flex items-center gap-3 p-3 rounded-[8px] bg-[#31A159]/10 border border-[#31A159]/30">
                  <Wallet className="w-4 h-4 text-[#31A159] shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-[#111111] font-light">
                      Wallet not connected
                    </p>
                  </div>
                  <button
                    onClick={wallet.connect}
                    className="text-xs font-medium text-[#31A159] hover:opacity-80 underline"
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
                  const isSelected = selectedOutcome.label === outcome.label;
                  return (
                    <button
                      key={outcome.label}
                      onClick={() => setSelectedOutcome(outcome)}
                      className={`flex flex-col items-center gap-0.5 py-3 rounded-[8px] text-sm font-medium transition-all ${outcomeButtonStyles(idx, isSelected)}`}
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
                  <label className="text-xs font-light text-gray-600">
                    Amount (USDC)
                  </label>
                  {wallet.isConnected && (
                    <button
                      onClick={() => setAmount(balance.toString())}
                      className="text-[10px] text-[#31A159] hover:opacity-80 transition-colors font-light"
                    >
                      Balance: {balance.toFixed(2)} USDC
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className={`w-full bg-transparent border rounded-[8px] py-3 pl-8 pr-4 text-[#111111] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 transition-all ${
                      insufficientBalance && amountNum > 0
                        ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                        : "border-[#DCDCDC] focus:border-[#31A159] focus:ring-[#31A159]/25"
                    }`}
                  />
                </div>
                {insufficientBalance && amountNum > 0 && (
                  <p className="text-[10px] text-red-500 mt-1 font-light">
                    Insufficient USDC balance
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  {[10, 25, 50, 100].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAmount(preset.toString())}
                      className="flex-1 py-1.5 rounded-[8px] text-xs font-medium bg-[#E6E6E6] text-[#111111] hover:opacity-80 transition-all"
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-[#E6E6E6]/50 rounded-[8px] p-4 space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-light">Outcome</span>
                  <span className="text-[#111111]">{selectedOutcome.label}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-light">Avg. Price</span>
                  <span className="text-[#111111]">
                    {Math.round(selectedOutcome.price * 100)}¢
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-light">Est. Shares</span>
                  <span className="text-[#111111]">{shares.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-light">Potential Return</span>
                  <span className="text-[#31A159] font-medium">
                    ${potentialReturn.toFixed(2)}{" "}
                    {profit > 0 && (
                      <span className="text-[#31A159]">
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
                  <span className="text-gray-500 font-light">Network</span>
                  <span className="text-[#111111]">Monad</span>
                </div>
              </div>

              {/* Error */}
              {tradeError && (
                <div className="flex items-center gap-2 p-3 rounded-[8px] bg-red-50 border border-red-200">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-xs text-red-600 font-light">{tradeError}</p>
                </div>
              )}

              <div className="flex items-start gap-2 text-xs text-gray-500 font-light">
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
                className="w-full py-3 rounded-[8px] text-sm font-bold text-[#111111] bg-[#31A159] hover:opacity-90 transition-all disabled:bg-[#E6E6E6] disabled:text-gray-400 disabled:cursor-not-allowed"
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
              <div className="w-16 h-16 rounded-full bg-[#31A159]/10 flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 text-[#31A159] animate-spin" />
              </div>
              <h3 className="text-[#111111] font-semibold mb-1">
                Approve USDC Spending
              </h3>
              <p className="text-xs text-gray-500 font-light text-center mb-4">
                Confirm the approval transaction in MetaMask to allow spending{" "}
                {amountNum.toFixed(2)} USDC
              </p>
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-light">
                <div className="w-1.5 h-1.5 rounded-full bg-[#31A159] animate-pulse" />
                Waiting for MetaMask confirmation...
              </div>
            </div>
          )}

          {/* ============ SIGNING STEP ============ */}
          {step === "signing" && (
            <div className="flex flex-col items-center py-6">
              <div className="w-16 h-16 rounded-full bg-[#31A159]/10 flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 text-[#31A159] animate-spin" />
              </div>
              <h3 className="text-[#111111] font-semibold mb-1">Sign Order</h3>
              <p className="text-xs text-gray-500 font-light text-center mb-4">
                Sign the EIP-712 order in MetaMask to place your trade
              </p>
              {txHash && (
                <a
                  href={`https://monadvision.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] text-[#31A159] hover:underline mb-2"
                >
                  Approval tx: {txHash.slice(0, 10)}...{txHash.slice(-6)}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-light">
                <div className="w-1.5 h-1.5 rounded-full bg-[#31A159] animate-pulse" />
                Waiting for signature...
              </div>
            </div>
          )}

          {/* ============ CONFIRMED STEP ============ */}
          {step === "confirmed" && (
            <div className="flex flex-col items-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#31A159]/10 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-[#31A159]" />
              </div>
              <h3 className="text-[#111111] font-semibold mb-1">
                Order Placed Successfully!
              </h3>
              <p className="text-xs text-gray-500 font-light text-center mb-4">
                Your order to buy &quot;{selectedOutcome.label}&quot; for $
                {amountNum.toFixed(2)} has been signed
              </p>

              <div className="w-full bg-[#E6E6E6]/50 rounded-[8px] p-4 space-y-2 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-light">Outcome</span>
                  <span className="text-[#111111]">{selectedOutcome.label}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-light">Amount</span>
                  <span className="text-[#111111]">${amountNum.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-light">Est. Shares</span>
                  <span className="text-[#111111]">{shares.toFixed(2)}</span>
                </div>
                {txHash && (
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-gray-500 font-light">Approval Tx</span>
                    <a
                      href={`https://monadvision.com/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[#31A159] hover:underline"
                    >
                      {txHash.slice(0, 8)}...{txHash.slice(-4)}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                {signature && (
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-gray-500 font-light">Signature</span>
                    <span className="text-gray-600 font-mono text-[10px]">
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
                  className="flex-1 py-2.5 rounded-[8px] text-sm font-medium bg-transparent text-[#111111] border border-[#DCDCDC] hover:bg-[#E6E6E6] transition-all"
                >
                  New Trade
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-[8px] text-sm font-bold bg-[#31A159] text-[#111111] hover:opacity-90 transition-all"
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
