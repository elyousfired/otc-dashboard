import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OTC Dashboard',
  description: 'Real-time analytics for the OTC protocol on Solana',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent)]">
                <span className="text-xs font-bold text-white">OTC</span>
              </div>
              <span className="text-sm font-semibold tracking-wide">Dashboard</span>
              <span className="hidden text-xs text-[var(--text-muted)] sm:block">
                — Solana protocol analytics
              </span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://otcdesks.cash"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-xs text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                otcdesks.cash
              </a>
              <div className="flex items-center gap-2">
                <div className="live-dot" />
                <span className="text-xs text-[var(--text-muted)]">Live · 60s</span>
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
