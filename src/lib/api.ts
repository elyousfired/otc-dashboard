import useSWR from 'swr';

// === TYPES ===

export interface RevenueData {
  at: number;
  sol: {
    earned: number;
    distributed: number;
    toPot: number;
    toProtocol: number;
    toBuyback: number;
    costs: number;
  };
  buyback: {
    spent: number;
    bought: number;
    burned: number;
    buys: number;
    burns: number;
    balance: number;
    holding: number;
    firstAt: number;
  };
  desks: {
    burned: number;
    count: number;
  };
  decimals: number;
  otc: {
    usdPrice: number;
    marketCap: number;
    change24h: number;
  };
  volume: {
    d1: number;
    d7: number;
    all: number;
  };
  daily: DailyEntry[];
  recent: RecentBuyback[];
  next: string | null;
}

export interface DailyEntry {
  day: string;
  earned: number;
  toHolders: number;
  toProtocol: number;
  toBuyback: number;
  toPot: number;
  spent: number;
  bought: number;
  burned: number;
}

export interface RecentBuyback {
  kind: 'buy' | 'burn';
  at: number;
  sol: number;
  otc: number;
  signature: string;
}

export interface RewardsData {
  at: number;
  distributed: number;
  owed: number;
  costs: number;
  payouts: number;
  holdersPaid: number;
  paying: number;
  lastDistributedAt: number;
  assets: number;
  top: TopCoin[];
  recent: RecentReward[];
  next: string | null;
}

export interface TopCoin {
  mint: string;
  symbol: string;
  name: string;
  image: string;
  rewardSymbol: string;
  distributed: number;
  holdersPaid: number;
  marketCap: number;
}

export interface RecentReward {
  image: string;
  symbol: string;
  amount: number;
  assetSymbol: string;
  signature: string;
  kind: string;
  usd: number;
  assetMint: string;
  mint: string;
  at: number;
  holders: number;
  decimals: number;
  name: string;
}

export interface DailyLaunchEntry {
  day: string;
  count: number;
}

export interface CoinsData {
  coins: Coin[];
  total: number;
  at: number;
  daily?: DailyLaunchEntry[];
}

export interface Coin {
  mint: string;
  symbol: string;
  name: string;
  image: string;
  createdAt: number;
  rewardCycle: number;
  rewardMint: string;
  rewardSymbol: string;
  rewardBasket: string[];
  pairMint?: string;
  pairSymbol?: string;
  snapshot?: {
    marketCap: number;
    usdPrice: number;
    change24h: number;
    volume24h: number;
    liquidity: number;
    holders: number;
    spark: number[];
  };
}

// === FETCHER ===

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
});

// === HOOKS — use local proxy routes to avoid CORS ===

export function useRevenue() {
  return useSWR<RevenueData>('/api/revenue', fetcher, {
    refreshInterval: 60_000,
    revalidateOnFocus: true,
  });
}

export function useRewards() {
  return useSWR<RewardsData>('/api/rewards', fetcher, {
    refreshInterval: 60_000,
    revalidateOnFocus: true,
  });
}

export function useCoins() {
  return useSWR<CoinsData>('/api/coins', fetcher, {
    refreshInterval: 60_000,
    revalidateOnFocus: true,
  });
}
