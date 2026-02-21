// Polymarket API types
export interface PolymarketTag {
  id: string;
  label: string;
  slug: string;
}

export interface PolymarketSeries {
  id: number;
  label: string;
  slug: string;
}

export interface PolymarketMarket {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  outcomes: string; // JSON string: '["Yes","No"]'
  outcomePrices: string; // JSON string: '["0.5","0.5"]'
  volume: string;
  volume24hr: string;
  liquidity: string;
  startDate: string;
  endDate: string;
  active: boolean;
  closed: boolean;
  lastTradePrice: string;
  bestBid: string;
  bestAsk: string;
  description: string;
  clobTokenIds: string; // JSON string
  acceptingOrders: boolean;
  image?: string;
  icon?: string;
}

export interface PolymarketEvent {
  id: string;
  ticker: string;
  slug: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  image: string;
  icon: string;
  active: boolean;
  closed: boolean;
  liquidity: number;
  volume: number;
  volume24hr: number;
  openInterest: number;
  markets: PolymarketMarket[];
  tags: PolymarketTag[];
  series?: PolymarketSeries[];
  // Sports-specific fields
  gameId?: string;
  score?: string;
  period?: string;
  elapsed?: string;
  live?: boolean;
  ended?: boolean;
  eventDate?: string;
  startTime?: string;
}

// App types (transformed from Polymarket data)
export interface Market {
  id: string;
  question: string;
  category: string;
  categorySlug: string;
  volume: string;
  volume24h: string;
  endDate: string;
  outcomes: Outcome[];
  image?: string;
  icon?: string;
  resolved: boolean;
  slug: string;
  liquidity: string;
  eventId: string;
  eventTitle: string;
  live?: boolean;
  score?: string;
}

export interface Outcome {
  label: string;
  price: number;
}

export interface SoccerEvent {
  id: string;
  title: string;
  slug: string;
  image: string;
  icon: string;
  endDate: string;
  volume: number;
  volume24hr: number;
  liquidity: number;
  markets: Market[];
  tags: string[];
  series?: string;
  live?: boolean;
  score?: string;
}

export type Tab = "all" | "qualifiers" | "winner" | "my-bets";

export interface Bet {
  marketId: string;
  marketQuestion?: string;
  outcome: string;
  amount: number;
  price: number;
  timestamp: number;
  txHash?: string;
  signature?: string;
  walletAddress?: string;
  // Sell fields
  sellSignature?: string;
  sellTxHash?: string;
  soldAt?: number;
}
