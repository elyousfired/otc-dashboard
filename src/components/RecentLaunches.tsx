'use client';

import type { Coin } from '@/lib/api';
import { formatUsd, timeAgo } from '@/lib/utils';

export default function RecentLaunches({ coins, total }: { coins: Coin[]; total: number }) {
  return (
    <div className="card p-0">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <div>
          <h2 className="text-[13px] font-semibold">🚀 Recently launched tokens</h2>
          <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">
            Latest coins deployed via OTC Launcher
          </p>
        </div>
        <div className="rounded-full border border-[var(--chart-blue)]/30 bg-[var(--chart-blue)]/10 px-2.5 py-1 text-[11px] font-semibold text-[var(--chart-blue)] tnum">
          {total.toLocaleString()} total
        </div>
      </div>
      <div>
        {coins.slice(0, 8).map((coin) => (
          <div key={coin.mint} className="feed-item">
            <img
              src={coin.image}
              alt={coin.symbol}
              className="h-6 w-6 shrink-0 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px] font-medium">
                {coin.name}{' '}
                <span className="text-[10px] text-[var(--text-muted)]">${coin.symbol}</span>
              </div>
              <div className="text-[10px] text-[var(--text-muted)]">
                Rewards: <span className="text-[var(--chart-blue)]">{coin.rewardSymbol}</span>
                {coin.pairSymbol ? ` · Pair: ${coin.pairSymbol}` : ''}
              </div>
            </div>
            <div className="text-right">
              <div className="tnum text-[12px] font-medium">
                {coin.snapshot?.marketCap ? formatUsd(coin.snapshot.marketCap, true) : 'New'}
              </div>
              <div className="text-[10px] text-[var(--text-dim)]">
                {timeAgo(coin.createdAt)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
