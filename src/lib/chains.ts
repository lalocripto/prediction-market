import { defineChain } from "viem";

export const monad = defineChain({
  id: 143,
  name: "Monad",
  nativeCurrency: {
    decimals: 18,
    name: "MON",
    symbol: "MON",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.monad.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "MonadVision",
      url: "https://monadvision.com",
    },
  },
});

export const USDC_ADDRESS =
  "0x754704Bc059F8C67012fEd69BC8A327a5aafb603" as const;
export const USDC_DECIMALS = 6;

export const MONAD_CHAIN_PARAMS = {
  chainId: "0x8f", // 143 in hex
  chainName: "Monad",
  nativeCurrency: {
    name: "MON",
    symbol: "MON",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.monad.xyz"],
  blockExplorerUrls: ["https://monadvision.com"],
};
