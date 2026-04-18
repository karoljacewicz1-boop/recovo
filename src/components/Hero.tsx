'use client'

import Link from 'next/link'
import { useLang } from '@/lib/LanguageContext'

/**
 * Hero — left-aligned copy on a ~60% column, a clean dashboard-preview
 * card on the right with real-feeling metrics. Soft surfaces, rounded
 * corners, accent highlights. No terminal tropes.
 */
export default function Hero() {
  const { t } = useLang()
  const h = t.hero

  return (
    <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden">
      {/* Soft accent wash top-right — replaces the harsh grid + blob */}
      <div
        aria-hidden
        className="absolute -top-40 -right-40 w-[720px] h-[720px] rounded-full pointer-events-none opacity-60"
        style={{
          background:
            'radial-gradient(circle at center, oklch(96% 0.03 40) 0%, transparent 60%)',
        }}
      />

      <div className="relative max-w-content mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl items-center">
          {/* LEFT — copy column */}
          <div className="lg:col-span-7">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-accent-tint text-accent text-xs font-semibold px-3 py-1.5 rounded-pill mb-lg">
              <span className="relative flex items-center">
                <span className="absolute inline-flex w-2 h-2 rounded-full bg-accent opacity-75 animate-ping" />
                <span className="relative w-2 h-2 rounded-full bg-accent" />
              </span>
              {h.eyebrow}
            </div>

            <h1 className="text-display-sm sm:text-display lg:text-display-lg font-bold text-ink mb-lg">
              {h.headline1}{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-accent">{h.headline2}</span>
                <svg
                  aria-hidden
                  className="absolute left-0 -bottom-1 w-full"
                  viewBox="0 0 300 10"
                  preserveAspectRatio="none"
                  style={{ height: '0.35em' }}
                >
                  <path
                    d="M2 7 C 60 2, 140 9, 298 4"
                    stroke="oklch(62% 0.185 34)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.4"
                  />
                </svg>
              </span>{' '}
              {h.headline3}
            </h1>

            <p className="text-base md:text-lg text-ink-soft mb-xl max-w-xl leading-[1.55]">
              {h.sub}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 bg-accent text-carbon-ink font-semibold px-6 py-3.5 rounded-md transition-all duration-micro ease-emil hover:bg-accent-deep hover:shadow-card-hover text-[15px]"
              >
                {h.cta1}
                <span className="transition-transform duration-micro ease-emil group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
              <Link
                href="#roi"
                className="inline-flex items-center justify-center gap-2 text-ink font-semibold px-6 py-3.5 rounded-md border border-border-strong hover:border-ink hover:bg-surface transition-colors duration-micro ease-emil text-[15px]"
              >
                {h.cta2}
              </Link>
            </div>

            <p className="mt-md flex items-center gap-2 text-sm text-ink-mute">
              <svg
                className="w-4 h-4 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {h.noCard}
            </p>
          </div>

          {/* RIGHT — dashboard preview */}
          <div className="lg:col-span-5">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * A trimmed dashboard preview. Soft cards, rounded corners, real numbers,
 * a single delta indicator. No timestamps, no SKU tickers, no "LIVE" chip.
 */
function DashboardPreview() {
  return (
    <div className="relative">
      {/* Subtle floating accent shape behind card */}
      <div
        aria-hidden
        className="absolute -inset-4 rounded-2xl bg-accent-tint opacity-50 blur-xl"
      />

      <div className="relative bg-bg border border-border rounded-xl shadow-card overflow-hidden">
        {/* Soft header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-surface">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-sm font-semibold text-ink">
              This month
            </span>
          </div>
          <span className="text-xs text-ink-mute">Apr 2025</span>
        </div>

        {/* Stat grid */}
        <div className="grid grid-cols-2">
          <Stat
            label="Returns processed"
            value="1,284"
            delta="+18%"
            border="r b"
          />
          <Stat
            label="Avg. time / item"
            value="2:47"
            unit="min"
            delta="−41%"
            border="b"
          />
          <Stat label="Resale rate" value="73" unit="%" delta="+6.2" border="r" />
          <Stat label="Recovered" value="€47,310" delta="this month" muted />
        </div>

        {/* Tiny footer */}
        <div className="px-5 py-3 border-t border-border bg-surface/50 flex items-center justify-between">
          <span className="text-xs text-ink-mute">Live sync with Baselinker</span>
          <span className="text-xs font-semibold text-accent">
            View full dashboard →
          </span>
        </div>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  unit,
  delta,
  border,
  muted,
}: {
  label: string
  value: string
  unit?: string
  delta?: string
  border?: string
  muted?: boolean
}) {
  const b = border ?? ''
  const cls = [
    'p-5',
    b.includes('r') ? 'lg:border-r border-border' : '',
    b.includes('b') ? 'border-b border-border' : '',
  ].join(' ')

  return (
    <div className={cls}>
      <p className="text-xs font-medium text-ink-mute mb-2">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="mono text-2xl md:text-[28px] font-semibold tabular-nums text-ink leading-none">
          {value}
        </span>
        {unit && (
          <span className="text-sm text-ink-mute font-medium">{unit}</span>
        )}
      </div>
      {delta && (
        <p
          className={`mt-2 text-xs font-medium tabular-nums ${
            muted ? 'text-ink-mute' : 'text-accent'
          }`}
        >
          {delta}
        </p>
      )}
    </div>
  )
}
