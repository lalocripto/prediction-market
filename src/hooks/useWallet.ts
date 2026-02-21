"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  createPublicClient,
  createWalletClient,
  custom,
  formatUnits,
  parseUnits,
  type PublicClient,
  type WalletClient,
  type Address,
} from "viem";
import { monad, USDC_ADDRESS, USDC_DECIMALS, MONAD_CHAIN_PARAMS } from "@/lib/chains";
import { erc20Abi, POLYMARKET_ORDER_TYPES, POLYMARKET_DOMAIN, EXCHANGE_ADDRESS } from "@/lib/abis";

interface OrderData {
  tokenId: string;
  side: "BUY" | "SELL";
  makerAmount: number;
  takerAmount: number;
}

export function useWallet() {
  const [address, setAddress] = useState<Address | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<string | null>(null);
  const [monBalance, setMonBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const publicClientRef = useRef<PublicClient | null>(null);
  const walletClientRef = useRef<WalletClient | null>(null);

  const getProvider = useCallback(() => {
    if (typeof window === "undefined") return null;
    return window.ethereum ?? null;
  }, []);

  const readBalance = useCallback(async (addr: Address) => {
    const provider = getProvider();
    if (!provider) return;

    try {
      const client = createPublicClient({
        chain: monad,
        transport: custom(provider),
      });
      publicClientRef.current = client;

      // Read USDC balance
      const balance = await client.readContract({
        address: USDC_ADDRESS,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [addr],
      });
      setUsdcBalance(formatUnits(balance as bigint, USDC_DECIMALS));

      // Read MON balance
      const monBal = await client.getBalance({ address: addr });
      setMonBalance(formatUnits(monBal, 18));
    } catch (err) {
      console.error("Failed to read balance:", err);
      setUsdcBalance(null);
    }
  }, [getProvider]);

  const connect = useCallback(async () => {
    const provider = getProvider();
    if (!provider) {
      setError("MetaMask not installed. Please install MetaMask to continue.");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request accounts
      const accounts = (await provider.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (!accounts.length) {
        throw new Error("No accounts found");
      }

      // Add/switch to Monad network
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: MONAD_CHAIN_PARAMS.chainId }],
        });
      } catch (switchError: unknown) {
        const err = switchError as { code?: number };
        // Chain not added yet (4902) — add it
        if (err.code === 4902) {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [MONAD_CHAIN_PARAMS],
          });
        } else {
          throw switchError;
        }
      }

      const addr = accounts[0] as Address;
      setAddress(addr);
      setChainId(143);

      // Create wallet client
      walletClientRef.current = createWalletClient({
        chain: monad,
        transport: custom(provider),
        account: addr,
      });

      // Read balances
      await readBalance(addr);
    } catch (err: unknown) {
      const e = err as { code?: number; message?: string };
      if (e.code === 4001) {
        setError("Connection rejected by user");
      } else {
        setError(e.message || "Failed to connect wallet");
      }
    } finally {
      setIsConnecting(false);
    }
  }, [getProvider, readBalance]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setUsdcBalance(null);
    setMonBalance(null);
    setChainId(null);
    setError(null);
    publicClientRef.current = null;
    walletClientRef.current = null;
  }, []);

  const refreshBalance = useCallback(async () => {
    if (address) {
      await readBalance(address);
    }
  }, [address, readBalance]);

  const approveUSDC = useCallback(
    async (amount: number): Promise<string> => {
      if (!walletClientRef.current || !address) {
        throw new Error("Wallet not connected");
      }

      const amountWei = parseUnits(amount.toString(), USDC_DECIMALS);

      const hash = await walletClientRef.current.writeContract({
        address: USDC_ADDRESS,
        abi: erc20Abi,
        functionName: "approve",
        args: [EXCHANGE_ADDRESS, amountWei],
        account: address,
        chain: monad,
      });

      // Wait for confirmation with timeout (Monad RPC can hang)
      if (publicClientRef.current) {
        const timeout = new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), 15000)
        );
        await Promise.race([
          publicClientRef.current.waitForTransactionReceipt({ hash }),
          timeout,
        ]);
      }

      return hash;
    },
    [address]
  );

  const signTypedOrder = useCallback(
    async (orderData: OrderData): Promise<string> => {
      if (!walletClientRef.current || !address) {
        throw new Error("Wallet not connected");
      }

      const salt = BigInt(Math.floor(Math.random() * 1e18));
      const expiration = BigInt(Math.floor(Date.now() / 1000) + 86400); // 24h
      const nonce = BigInt(Math.floor(Math.random() * 1e12));

      const message = {
        salt,
        maker: address,
        signer: address,
        taker: "0x0000000000000000000000000000000000000000" as Address,
        tokenId: BigInt(orderData.tokenId || "0"),
        makerAmount: parseUnits(orderData.makerAmount.toString(), USDC_DECIMALS),
        takerAmount: parseUnits(orderData.takerAmount.toString(), USDC_DECIMALS),
        expiration,
        nonce,
        feeRateBps: BigInt(0),
        side: orderData.side === "BUY" ? 0 : 1,
        signatureType: 0,
      };

      const signature = await walletClientRef.current.signTypedData({
        account: address,
        domain: POLYMARKET_DOMAIN,
        types: POLYMARKET_ORDER_TYPES,
        primaryType: "Order",
        message,
      });

      return signature;
    },
    [address]
  );

  // Listen for account/chain changes
  useEffect(() => {
    const provider = getProvider();
    if (!provider) return;

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (accounts.length === 0) {
        disconnect();
      } else {
        const newAddr = accounts[0] as Address;
        setAddress(newAddr);
        readBalance(newAddr);
      }
    };

    const handleChainChanged = (...args: unknown[]) => {
      const newChainId = parseInt(args[0] as string, 16);
      setChainId(newChainId);
      if (newChainId !== 143 && address) {
        setError("Please switch to Monad network");
      } else {
        setError(null);
        if (address) readBalance(address);
      }
    };

    provider.on("accountsChanged", handleAccountsChanged);
    provider.on("chainChanged", handleChainChanged);

    return () => {
      provider.removeListener("accountsChanged", handleAccountsChanged);
      provider.removeListener("chainChanged", handleChainChanged);
    };
  }, [getProvider, disconnect, readBalance, address]);

  // Auto-reconnect on mount if previously connected
  useEffect(() => {
    const provider = getProvider();
    if (!provider) return;

    provider
      .request({ method: "eth_accounts" })
      .then((accounts) => {
        const accs = accounts as string[];
        if (accs.length > 0) {
          const addr = accs[0] as Address;
          setAddress(addr);

          provider
            .request({ method: "eth_chainId" })
            .then((id) => {
              const cid = parseInt(id as string, 16);
              setChainId(cid);
              if (cid === 143) {
                walletClientRef.current = createWalletClient({
                  chain: monad,
                  transport: custom(provider),
                  account: addr,
                });
                readBalance(addr);
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    address,
    usdcBalance,
    monBalance,
    isConnecting,
    chainId,
    error,
    isConnected: !!address,
    isWrongNetwork: chainId !== null && chainId !== 143,
    connect,
    disconnect,
    refreshBalance,
    approveUSDC,
    signTypedOrder,
  };
}
