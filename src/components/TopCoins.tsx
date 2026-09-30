'use client';

import type { TopCoin } from '@/lib/api';
import { formatOtc, formatUsd, formatCompact } from '@/lib/utils';

export default function TopCoins({ coins }: { coins: TopCoin[] }) {
  return (
    <div className="card p-0">
      <div className="border-b border-[var(--border)] px-4 py-3">
        <h2 className="text-[13px] font-semibold">🏆 Top coins by rewards paid</h2>
        <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">Ranked by total distributed to holders</p>
      </div>
      <div>
        {coins.slice(0, 12).map((coin, i) => (
          <div key={coin.mint} className="feed-item">
            <span className="tnum w-5 shrink-0 text-[10px] text-[var(--text-dim)]">{i + 1}</span>
            <img
              src={coin.image}
              alt={coin.symbol}
              className="h-6 w-6 shrink-0 rounded-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px] font-medium">{coin.name}</div>
              <div className="text-[10px] text-[var(--text-muted)]">
                {coin.symbol} → <span className="text-[var(--chart-blue)]">{coin.rewardSymbol}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="tnum text-[12px] font-medium">{formatOtc(coin.distributed)}</div>
              <div className="tnum text-[10px] text-[var(--text-muted)]">
                {formatCompact(coin.holdersPaid)} paid
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
