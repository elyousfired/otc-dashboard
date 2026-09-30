'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  CartesianGrid,
} from 'recharts';
import type { DailyLaunchEntry } from '@/lib/api';

interface Props {
  daily: DailyLaunchEntry[];
  total: number;
}

function fmtDate(d: string) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface TooltipPayloadItem {
  value: number;
  payload: {
    label: string;
    day: string;
    count: number;
    cumulative: number;
    isToday: boolean;
  };
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div
      style={{
        background: '#0d0d14',
        border: '1px solid #1a1a2e',
        borderRadius: 8,
        padding: '10px 14px',
        fontSize: 12,
        minWidth: 180,
      }}
    >
      <div style={{ color: '#e4e4ed', fontWeight: 600, marginBottom: 8 }}>
        {item.label} {item.isToday ? '· 🟢 Live' : ''}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 4,
        }}
      >
        <span style={{ color: item.isToday ? '#22c55e' : '#3b82f6' }}>
          🚀 Tokens launched
        </span>
        <span
          style={{
            color: '#e4e4ed',
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {item.count.toLocaleString()}
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          borderTop: '1px solid #1a1a2e',
          marginTop: 6,
          paddingTop: 6,
        }}
      >
        <span style={{ color: '#6b6b80' }}>Cumulative total</span>
        <span
          style={{
            color: '#e4e4ed',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {item.cumulative.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default function DailyLaunchesChart({ daily, total }: Props) {
  const lastIdx = daily.length - 1;
  let runningTotal = 0;

  const data = daily.map((e, idx) => {
    runningTotal += e.count;
    return {
      label: fmtDate(e.day),
      day: e.day,
      count: e.count,
      cumulative: idx === lastIdx ? total : runningTotal,
      isToday: idx === lastIdx,
    };
  });

  const completeDays = data.filter((d) => !d.isToday);
  const avgPerDay =
    completeDays.length > 0
      ? Math.round(
          completeDays.reduce((s, d) => s + d.count, 0) / completeDays.length
        )
      : 0;

  const todayCount = data[lastIdx]?.count ?? 0;
  const peakDay = data.reduce(
    (max, d) => (d.count > max.count ? d : max),
    data[0] ?? { label: '-', count: 0 }
  );

  const tickInterval = Math.max(0, Math.floor(data.length / 9));

  return (
    <div className="card">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[14px] font-semibold">
            Daily tokens launched (Histogram)
          </h2>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            Number of coins deployed via OTC Launcher each day across{' '}
            {completeDays.length} complete days — today&apos;s bar updates live.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <span className="text-[var(--text-muted)]">
            Peak{' '}
            <span className="tnum font-semibold text-[var(--text)]">
              {peakDay.count.toLocaleString()} ({peakDay.label})
            </span>
          </span>
          <span className="text-[var(--text-muted)]">
            Daily avg{' '}
            <span className="tnum font-semibold text-[var(--text)]">
              {avgPerDay.toLocaleString()}
            </span>
          </span>
          <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
            <span className="live-dot" />
            Today{' '}
            <span className="tnum font-semibold text-[var(--green)]">
              {todayCount.toLocaleString()}
            </span>
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={270}>
        <BarChart data={data} barCategoryGap="18%">
          <CartesianGrid
            vertical={false}
            stroke="#1a1a2e"
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: '#6b6b80' }}
            axisLine={{ stroke: '#1a1a2e' }}
            tickLine={false}
            interval={tickInterval}
          />
          <YAxis
            tickFormatter={(v: number) =>
              v >= 1000 ? `${(v / 1000).toFixed(1)}K` : String(v)
            }
            tick={{ fontSize: 10, fill: '#6b6b80' }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          />
          {avgPerDay > 0 && (
            <ReferenceLine
              y={avgPerDay}
              stroke="rgba(59,130,246,0.4)"
              strokeDasharray="6 4"
              strokeWidth={1.5}
              label={{
                value: `avg/day ${avgPerDay.toLocaleString()}`,
                position: 'insideTopRight',
                fill: '#6b6b80',
                fontSize: 10,
                dy: -8,
              }}
            />
          )}
          <Bar dataKey="count" radius={[3, 3, 0, 0]} maxBarSize={22}>
            {data.map((d, i) => (
              <Cell
                key={i}
                fill={d.isToday ? '#22c55e' : '#3b82f6'}
                opacity={d.isToday ? 1 : 0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
