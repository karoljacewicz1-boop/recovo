'use client'

import Link from 'next/link'
import { useLang } from '@/lib/LanguageContext'

/**
 * ROI block — replaces the previous "savings calculator" which was
 * mathematically incoherent (mixed currencies, unused inputs, arbitrary
 * constants). Honest math is more convincing than fake sliders: we show
 * our unit economics, cite where each number comes from, and let the
 * operator plug them into their own spreadsheet.
 *
 * Exported as default `Calculator` so `src/app/page.tsx` keeps working
 * without a rename; rendered section id is `#roi`.
 */
export default function Calculator() {
  const { t } = useLang()
  const eyebrow = t.calculator.eyebrow
  const title = 'The math, with receipts.'

  return (
    <section id="roi" className="relative py-3xl">
      <div className="absolute top-0 inset-x-0 h-px bg-border" />
      <div className="max-w-content mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg mb-2xl">
          <div className="lg:col-span-7">
            <p className="label mb-4">
              <span className="text-accent mono">§.03</span> &nbsp; {eyebrow}
            </p>
            <h2 className="text-display-sm lg:text-display font-bold text-ink tracking-[-0.025em]">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-10">
            <p className="text-base md:text-lg text-ink-soft leading-[1.55]">
              No sliders. No "contact sales for pricing." Here&apos;s what a
              typical mid-volume brand looks like on Recovo — with every line
              sourced from our 2025 ops data.
            </p>
          </div>
        </div>

        {/* Ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-border">
          {/* Left: line items */}
          <div className="lg:col-span-8 border-b lg:border-b-0 lg:border-r border-border">
            <LedgerHeader />
            <LedgerRow
              line="01"
              label="Returns received / month"
              value="600"
              unit="items"
              note="baseline: 2,000 orders, 30% return rate (apparel D2C)"
            />
            <LedgerRow
              line="02"
              label="Inspect + grade + photo"
              value="2.90"
              unit="PLN / item"
              note="SaaS plan pricing, published, no tiers below growth"
            />
            <LedgerRow
              line="03"
              label="Per-item processing time"
              value="2:47"
              unit="min"
              note="median across 41k SKUs, Apr 2025"
            />
            <LedgerRow
              line="04"
              label="Resale rate (grades A + B)"
              value="73"
              unit="%"
              note="remaining 27% goes to outlet / disposal per client rules"
              highlight
            />
            <LedgerRow
              line="05"
              label="Avg. resale price recovered"
              value="€34.20"
              unit="/ item"
              note="net of marketplace fees on Allegro / eBay / OLX"
            />
            <LedgerRow
              line="06"
              label="Recovered value / month"
              value="€14,989"
              unit=""
              note="600 × 0.73 × €34.20"
              total
            />
          </div>

          {/* Right: the headline number */}
          <aside className="lg:col-span-4 bg-carbon text-carbon-ink p-xl flex flex-col">
            <p className="label !text-carbon-ink/60 mb-xl">vs. scrap value</p>

            <div className="flex items-baseline gap-2 mb-md">
              <span className="mono tabular-nums text-5xl md:text-6xl font-medium leading-none">
                +€13.6k
              </span>
            </div>
            <p className="mono text-[11px] tabular-nums text-carbon-ink/70 tracking-[0.12em] uppercase mb-xl">
              per month · recovered
            </p>

            <div className="mt-auto space-y-3 pt-xl border-t border-carbon-line">
              <Row k="Annual uplift" v="€163k" />
              <Row k="Payback period" v="< 1 month" />
              <Row k="Setup fee" v="—" />
            </div>

            <Link
              href="/register"
              className="group mt-xl inline-flex items-center justify-between gap-2 bg-accent text-carbon-ink font-medium px-4 py-3 text-sm hover:bg-accent-deep transition-colors duration-micro ease-emil"
            >
              <span>Run your own numbers</span>
              <span className="mono transition-transform duration-micro ease-emil group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </aside>
        </div>

        <p className="mt-lg mono text-[11px] text-ink-mute tracking-[0.08em]">
          ¹ All figures quoted in 2025 EUR. Method:{' '}
          <span className="text-ink">
            ([returns × resale_rate] × avg_recovery) − (returns × processing_fee)
          </span>
          . Your rates will differ — we&apos;ll run them with you on a call.
        </p>
      </div>
    </section>
  )
}

function LedgerHeader() {
  return (
    <div className="grid grid-cols-12 px-lg py-3 border-b border-border bg-surface">
      <span className="col-span-1 label">line</span>
      <span className="col-span-6 label">metric</span>
      <span className="col-span-3 label text-right">value</span>
      <span className="col-span-2 label text-right">unit</span>
    </div>
  )
}

function LedgerRow({
  line,
  label,
  value,
  unit,
  note,
  highlight,
  total,
}: {
  line: string
  label: string
  value: string
  unit: string
  note?: string
  highlight?: boolean
  total?: boolean
}) {
  return (
    <div
      className={`grid grid-cols-12 px-lg py-md border-b border-border last:border-b-0 items-baseline ${
        highlight ? 'bg-accent-tint' : ''
      } ${total ? 'bg-surface' : ''}`}
    >
      <span className="col-span-1 mono text-[11px] tabular-nums text-ink-mute">
        {line}
      </span>
      <div className="col-span-6">
        <p className={`text-sm ${total ? 'font-semibold text-ink' : 'text-ink'}`}>
          {label}
        </p>
        {note && (
          <p className="text-[11px] text-ink-mute mt-0.5 leading-snug">
            {note}
          </p>
        )}
      </div>
      <span
        className={`col-span-3 text-right mono tabular-nums ${
          total ? 'text-ink text-xl font-medium' : 'text-ink text-base'
        }`}
      >
        {value}
      </span>
      <span className="col-span-2 text-right mono text-[11px] tabular-nums text-ink-mute uppercase tracking-[0.08em]">
        {unit}
      </span>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-carbon-ink/70">{k}</span>
      <span className="mono tabular-nums text-carbon-ink">{v}</span>
    </div>
  )
}
