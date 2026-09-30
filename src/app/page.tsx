'use client';

import { SWRConfig } from 'swr';
import { useRevenue, useRewards, useCoins } from '@/lib/api';
import HeroCards from '@/components/HeroCards';
import TokenBar from '@/components/TokenBar';
import BuybackChart from '@/components/BuybackChart';
import RevenueChart from '@/components/RevenueChart';
import DailyLaunchesChart from '@/components/DailyLaunchesChart';
import LiveFeed from '@/components/LiveFeed';
import SupplyDestroyed from '@/components/SupplyDestroyed';
import TopCoins from '@/components/TopCoins';
import RecentLaunches from '@/components/RecentLaunches';
import StatsBar from '@/components/StatsBar';
import DexChart from '@/components/DexChart';

function Skeleton({ h = 200 }: { h?: number }) {
  return (
    <div className="card flex items-center justify-center" style={{ minHeight: h }}>
      <div className="skeleton" style={{ width: '50%', height: 16 }} />
    </div>
  );
}

function Dashboard() {
  const { data: revenue, error: revErr } = useRevenue();
  const { data: rewards, error: rewErr } = useRewards();
  const { data: coins } = useCoins();

  if (revErr) {
    return (
      <div className="card mt-8 text-center text-[13px] text-[var(--red)]">
        Failed to load revenue data. Check network or CORS.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Hero Cards */}
      {revenue
        ? (
          <HeroCards
            data={revenue}
            totalCoins={coins?.total}
            payingCoins={rewards?.paying}
          />
        )
        : <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[1,2,3,4,5].map(i => <Skeleton key={i} h={110} />)}
          </div>
      }

      {/* Token Bar */}
      {revenue ? <TokenBar data={revenue} /> : <Skeleton h={64} />}

      {/* DexScreener Chart */}
      <DexChart />

      {/* Chart + Live Feed — 2 columns */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.75fr_1fr]">
        {revenue
          ? <BuybackChart daily={revenue.daily} otcPrice={revenue.otc.usdPrice} />
          : <Skeleton h={360} />
        }
        {revenue
          ? <LiveFeed recent={revenue.recent} />
          : <Skeleton h={360} />
        }
      </div>

      {/* Revenue breakdown chart */}
      {revenue
        ? <RevenueChart daily={revenue.daily} otcPrice={revenue.otc.usdPrice} />
        : <Skeleton h={330} />
      }

      {/* Daily Tokens Launched Histogram */}
      {coins?.daily ? (
        <DailyLaunchesChart daily={coins.daily} total={coins.total} />
      ) : (
        <Skeleton h={330} />
      )}

      {/* Supply Destroyed */}
      {revenue ? <SupplyDestroyed data={revenue} /> : <Skeleton h={130} />}

      {/* Top Coins + Right Column */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Top coins */}
        {rewards
          ? <TopCoins coins={rewards.top} />
          : rewErr
            ? <div className="card text-center text-[12px] text-[var(--text-muted)]">Rewards data unavailable</div>
            : <Skeleton h={400} />
        }

        {/* Recently Launched + Rewards overview + Stats */}
        <div className="space-y-4">
          {coins ? (
            <RecentLaunches coins={coins.coins} total={coins.total} />
          ) : (
            <Skeleton h={320} />
          )}

          {rewards && (
            <div className="card">
              <h2 className="mb-4 text-[13px] font-semibold">📊 Rewards overview</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Distributions', value: rewards.payouts.toLocaleString() },
                  { label: 'Wallets paid', value: rewards.holdersPaid.toLocaleString() },
                  { label: 'Paying coins',  value: rewards.paying.toLocaleString() },
                  { label: 'Reward assets', value: rewards.assets.toString() },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{label}</div>
                    <div className="tnum mt-1 text-[20px] font-semibold">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {rewards && coins
            ? <StatsBar rewards={rewards} totalCoins={coins.total} />
            : <Skeleton h={90} />
          }
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-[11px] text-[var(--text-dim)]">
        Data from{' '}
        <a
          href="https://otcdesks.cash"
          target="_blank"
          rel="noreferrer"
          className="text-[var(--accent)] hover:underline"
        >
          otcdesks.cash
        </a>
        {' '}· Auto-refreshes every 60s · All figures verified on-chain
      </footer>
    </div>
  );
}

export default function Page() {
  return (
    <SWRConfig value={{ revalidateOnFocus: true }}>
      <Dashboard />
    </SWRConfig>
  );
}
