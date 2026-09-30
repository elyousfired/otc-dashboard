'use client';

import type { RevenueData } from '@/lib/api';
import { formatOtc, formatUsd } from '@/lib/utils';

export default function SupplyDestroyed({ data }: { data: RevenueData }) {
  const { buyback, desks, otc } = data;
  const total = buyback.burned + desks.burned;
  const totalUsd = (total / 1e6) * otc.usdPrice;

  // Total supply = marketCap / price
  const totalSupply = otc.usdPrice > 0 ? otc.marketCap / otc.usdPrice : 0;
  const burnedTokens = total / 1e6;
  const burnedPct = totalSupply > 0 ? (burnedTokens / (totalSupply + burnedTokens)) * 100 : 0;

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[13px] font-semibold">💀 Supply destroyed</h2>
        {/* % burned badge */}
        <div className="flex items-center gap-1.5 rounded-full border border-[var(--chart-orange)]/30 bg-[var(--chart-orange)]/10 px-3 py-1">
          <span className="text-[11px] font-bold text-[var(--chart-orange)]">
            {burnedPct.toFixed(2)}%
          </span>
          <span className="text-[10px] text-[var(--text-muted)]">of supply burned</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Item
          label="By buybacks"
          value={formatOtc(buyback.burned) + ' OTC'}
          sub={`${buyback.buys.toLocaleString()} buy txs`}
        />
        <Item
          label="By desk mints"
          value={formatOtc(desks.burned) + ' OTC'}
          sub={`${desks.count.toLocaleString()} desks minted`}
        />
        <Item
          label="Total destroyed"
          value={formatOtc(total) + ' OTC'}
          sub={`≈ ${formatUsd(totalUsd, true)} at current price`}
          orange
        />
      </div>

      {/* Progress bar */}
      <div className="mt-5">
        <div className="mb-1.5 flex justify-between text-[10px] text-[var(--text-muted)]">
          <span>Circulating supply</span>
          <span>{burnedPct.toFixed(2)}% burned</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-[var(--border)]">
          <div
            className="h-1.5 rounded-full bg-[var(--chart-orange)] transition-all"
            style={{ width: `${Math.min(burnedPct, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function Item({ label, value, sub, orange }: { label: string; value: string; sub: string; orange?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{label}</div>
      <div className={`tnum mt-1.5 text-[20px] font-semibold ${orange ? 'text-[var(--chart-orange)]' : ''}`}>
        {value}
      </div>
      <div className="mt-0.5 text-[11px] text-[var(--text-muted)]">{sub}</div>
    </div>
  );
}
