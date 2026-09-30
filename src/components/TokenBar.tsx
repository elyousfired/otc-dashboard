'use client';

import type { RevenueData } from '@/lib/api';
import { formatUsd, formatPercent } from '@/lib/utils';

export default function TokenBar({ data }: { data: RevenueData }) {
  const { otc, volume, buyback } = data;
  const isUp = otc.change24h >= 0;

  return (
    <div className="card flex flex-wrap items-center gap-x-8 gap-y-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)]/10">
          <span className="text-xs font-bold text-[var(--accent)]">OTC</span>
        </div>
        <div>
          <div className="tnum text-lg font-semibold leading-none">{formatUsd(otc.usdPrice)}</div>
          <div className="mt-0.5 text-[10px] text-[var(--text-muted)]">$OTC token</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px]">
        <Stat label="24h" value={formatPercent(otc.change24h)} color={isUp ? 'green' : 'red'} />
        <Stat label="Mkt Cap" value={formatUsd(otc.marketCap, true)} />
        <Stat label="Vol 24h" value={formatUsd(volume.d1, true)} />
        <Stat label="Buybacks" value={buyback.buys.toLocaleString()} color="blue" />
        <Stat label="Burns" value={buyback.burns.toLocaleString()} color="orange" />
        <Stat label="SOL in wallet" value={`${(buyback.balance / 1e9).toFixed(2)} SOL`} />
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  const colorClass =
    color === 'green' ? 'text-[var(--green)]' :
    color === 'red'   ? 'text-[var(--red)]' :
    color === 'blue'  ? 'text-[var(--chart-blue)]' :
    color === 'orange'? 'text-[var(--chart-orange)]' : '';
  return (
    <div>
      <span className="text-[var(--text-muted)]">{label} </span>
      <span className={`tnum font-medium ${colorClass}`}>{value}</span>
    </div>
  );
}
