'use client'

import Link from 'next/link'
import { useLang } from '@/lib/LanguageContext'

/**
 * Hero — left-aligned copy on a ~60% column, a technical data panel on the
 * right. No blurry orange blobs, no centered stack. The right-hand panel is
 * deliberately non-decorative: it shows the kind of readout an ops manager
 * would see on a real Recovo dashboard, so the eye immediately understands
 * "this is an operators' tool."
 */
export default function Hero() {
  const { t } = useLang()
  const h = t.hero

  return (
    <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 overflow-hidden">
      {/* Faint engineered grid — replaces the generic blur blob */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(to right, oklch(88% 0.01 75 / 0.5) 1px, transparent 1px)',
          backgroundSize: '80px 100%',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 92%)',
        }}
      />

      <div className="relative max-w-content mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg lg:gap-xl items-end">
          {/* LEFT — copy column */}
          <div className="lg:col-span-7">
            {/* Eyebrow — mono label with run indicator */}
            <div className="flex items-center gap-2.5 mb-xl">
              <span className="relative flex items-center">
                <span className="absolute inline-flex w-2 h-2 rounded-full bg-accent opacity-75 animate-ping" />
                <span className="relative w-2 h-2 rounded-full bg-accent" />
              </span>
              <span className="label">{h.eyebrow}</span>
              <span className="h-px w-10 bg-border" />
              <span className="label !text-ink-mute">LIVE · 24/7</span>
            </div>

            <h1 className="text-display-sm sm:text-display lg:text-display-lg font-bold text-ink mb-lg">
              {h.headline1}{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-accent">{h.headline2}</span>
                {/* Underline mark — hand-drawn feel but precise */}
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
                    opacity="0.55"
                  />
                </svg>
              </span>{' '}
              {h.headline3}
            </h1>

            <p className="text-base md:text-lg text-ink-soft mb-xl max-w-xl leading-[1.55]">
              {h.sub}
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 bg-ink text-carbon-ink font-medium px-6 py-3.5 transition-colors duration-micro ease-emil hover:bg-accent text-[15px]"
              >
                {h.cta1}
                <span className="mono transition-transform duration-micro ease-emil group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
              <Link
                href="#roi"
                className="group inline-flex items-center justify-center gap-2 border border-border-strong text-ink font-medium px-6 py-3.5 transition-colors duration-micro ease-emil hover:border-ink hover:bg-surface text-[15px]"
              >
                {h.cta2}
              </Link>
            </div>

            <p className="mt-lg flex items-center gap-sm text-sm text-ink-mute">
              <span className="mono text-accent">[✓]</span>
              {h.noCard}
            </p>
          </div>

          {/* RIGHT — data panel */}
          <div className="lg:col-span-5">
            <DataPanel />
          </div>
        </div>
      </div>

      {/* Full-bleed hairline at section end */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-border" />
    </section>
  )
}

/**
 * A technical readout — mimics the Recovo dashboard summary. Uses tabular
 * numbers, mono type, and a sharp 2px-radius container. No glassmorphism.
 */
function DataPanel() {
  return (
    <div className="relative bg-surface border border-border">
      {/* Panel header strip */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-bg">
        <div className="flex items-center gap-2">
          <span className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-accent/70" />
            <span className="w-2 h-2 rounded-full bg-hazard/70" />
            <span className="w-2 h-2 rounded-full bg-border-strong" />
          </span>
          <span className="mono text-[10px] uppercase tracking-[0.12em] text-ink-mute">
            recovo · ops · today
          </span>
        </div>
        <span className="mono text-[10px] tabular-nums text-ink-mute">
          09:42:17
        </span>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2">
        <Stat
          label="Returns processed"
          value="1,284"
          delta="+18%"
          deltaPos
          border="r b"
        />
        <Stat
          label="Avg. time / SKU"
          value="2:47"
          unit="min"
          delta="−41%"
          deltaPos
          border="b"
        />
        <Stat
          label="Resale rate"
          value="73"
          unit="%"
          delta="+6.2"
          deltaPos
          border="r"
        />
        <Stat label="Recovered" value="€47,310" delta="vs. scrap" />
      </div>

      {/* Live ticker row */}
      <div className="border-t border-border px-4 py-3 flex items-center gap-3 bg-bg">
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
          </span>
          <span className="mono text-[10px] uppercase tracking-[0.12em] text-ink-mute">
            SKU-8831
          </span>
        </span>
        <span className="text-xs text-ink-soft flex-1 truncate">
          graded · <span className="mono tabular-nums">A-</span> · 96% confidence
        </span>
        <span className="mono text-[10px] tabular-nums text-accent">
          +€34.20
        </span>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  unit,
  delta,
  deltaPos,
  border,
}: {
  label: string
  value: string
  unit?: string
  delta?: string
  deltaPos?: boolean
  border?: string
}) {
  // We encode section borders via a small token so the grid reads as a data
  // sheet instead of 4 floating cards.
  const b = border ?? ''
  const cls = [
    'relative p-5',
    b.includes('r') ? 'lg:border-r border-border' : '',
    b.includes('b') ? 'border-b border-border' : '',
  ].join(' ')

  return (
    <div className={cls}>
      <p className="label mb-2">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="mono text-2xl md:text-3xl font-medium tabular-nums text-ink">
          {value}
        </span>
        {unit && (
          <span className="mono text-sm text-ink-mute tabular-nums">{unit}</span>
        )}
      </div>
      {delta && (
        <p
          className={`mt-1.5 mono text-[11px] tabular-nums ${
            deltaPos ? 'text-accent' : 'text-ink-mute'
          }`}
        >
          {delta}
        </p>
      )}
    </div>
  )
}
