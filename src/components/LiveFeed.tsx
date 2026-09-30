'use client';

import type { RecentBuyback } from '@/lib/api';
import { formatSol, formatOtc, timeAgo, truncSig } from '@/lib/utils';

export default function LiveFeed({ recent }: { recent: RecentBuyback[] }) {
  const buys = recent.filter((r) => r.kind === 'buy').length;
  const burns = recent.filter((r) => r.kind === 'burn').length;

  return (
    <div className="card p-0 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="live-dot" />
          <h2 className="text-[13px] font-semibold">Live buyback feed</h2>
        </div>
        <span className="text-[10px] text-[var(--text-muted)]">
          {buys} buys · {burns} burns
        </span>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto" style={{ maxHeight: 270 }}>
        {recent.map((item) => (
          <div key={item.signature} className="feed-item">
            <span className={`badge ${item.kind === 'buy' ? 'badge-buy' : 'badge-burn'}`}>
              {item.kind}
            </span>
            <span className="tnum flex-1 text-[11px] text-[var(--text)]">
              {item.kind === 'buy'
                ? `${formatSol(item.sol)} SOL → ${formatOtc(item.otc)} OTC`
                : `🔥 ${formatOtc(item.otc)} OTC`}
            </span>
            <span className="text-[10px] text-[var(--text-dim)] whitespace-nowrap">
              {timeAgo(item.at)}
            </span>
            <a
              href={`https://solscan.io/tx/${item.signature}`}
              target="_blank"
              rel="noreferrer"
              className="tnum text-[10px] text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors"
              title={item.signature}
            >
              {truncSig(item.signature)}
            </a>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--border)] px-4 py-2 text-[9.5px] text-[var(--text-dim)]">
        Every row is a transaction — click to verify on Solscan
      </div>
    </div>
  );
}
