'use client'

import Link from 'next/link'
import { useLang } from '@/lib/LanguageContext'

/**
 * ROI block — honest math, not sliders. Softened visually: rounded
 * container, friendlier rows, warmer accent card. Numbers still do
 * the talking; everything else stays out of the way.
 */
export default function Calculator() {
  const { t } = useLang()
  const title = 'Liczby, które możesz sprawdzić.'

  return (
    <section id="roi" className="relative py-3xl">
      <div className="max-w-content mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg mb-2xl">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-3">ROI</p>
            <h2 className="text-display-sm lg:text-display font-bold text-ink tracking-[-0.025em]">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-8">
            <p className="text-base md:text-lg text-ink-soft leading-[1.6]">
              Tak wygląda typowa marka D2C na Recovo. Każda liczba pochodzi
              z naszych danych operacyjnych za 2025 — możesz porównać
              z własnym spreadsheetem.
            </p>
          </div>
        </div>

        {/* Ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: line items */}
          <div className="lg:col-span-8 rounded-xl bg-bg border border-border overflow-hidden shadow-card">
            <div className="px-lg py-3 border-b border-border bg-surface">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-mute">
                Unit economics
              </p>
            </div>
            <LedgerRow
              label="Zwroty / miesiąc"
              value="600"
              unit="szt."
              note="2,000 zamówień × 30% return rate (apparel D2C)"
            />
            <LedgerRow
              label="Inspekcja + grading + zdjęcia"
              value="2.90"
              unit="PLN / szt."
              note="plan Growth, cennik publiczny"
            />
            <LedgerRow
              label="Czas przetwarzania"
              value="2:47"
              unit="min"
              note="mediana z 41k SKU, kwiecień 2025"
            />
            <LedgerRow
              label="Resale rate (A + B)"
              value="73"
              unit="%"
              note="pozostałe 27% idzie do outletu lub utylizacji"
              highlight
            />
            <LedgerRow
              label="Średnia cena odzysku"
              value="€34.20"
              unit="/ szt."
              note="netto po prowizjach Allegro / eBay / OLX"
            />
            <LedgerRow
              label="Wartość odzyskana / miesiąc"
              value="€14,989"
              unit=""
              note="600 × 0.73 × €34.20"
              total
            />
          </div>

          {/* Right: headline card */}
          <aside className="lg:col-span-4 rounded-xl bg-carbon text-carbon-ink p-xl flex flex-col shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wider text-carbon-ink/60 mb-lg">
              Vs. scrap value
            </p>

            <div className="mb-sm">
              <span className="mono tabular-nums text-5xl md:text-6xl font-semibold leading-none">
                +€13.6k
              </span>
            </div>
            <p className="text-sm text-carbon-ink/70 mb-xl">
              odzyskanej wartości miesięcznie
            </p>

            <div className="mt-auto space-y-3 pt-lg border-t border-carbon-line">
              <Row k="Rocznie" v="€163k" />
              <Row k="Payback" v="< 1 miesiąc" />
              <Row k="Opłata setup" v="—" />
            </div>

            <Link
              href="/register"
              className="group mt-lg inline-flex items-center justify-between gap-2 bg-accent text-carbon-ink font-semibold px-4 py-3 rounded-md text-sm hover:bg-accent-deep transition-colors duration-micro ease-emil"
            >
              <span>Policz swoje liczby</span>
              <span className="transition-transform duration-micro ease-emil group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </aside>
        </div>

        <p className="mt-lg text-xs text-ink-mute">
          Metoda:{' '}
          <span className="mono text-ink">
            ([zwroty × resale_rate] × avg_recovery) − (zwroty × processing_fee)
          </span>
          . Twoje stawki będą się różnić — przejdziemy przez nie na rozmowie.
        </p>
      </div>
    </section>
  )
}

function LedgerRow({
  label,
  value,
  unit,
  note,
  highlight,
  total,
}: {
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
      <div className="col-span-7">
        <p className={`text-sm ${total ? 'font-semibold text-ink' : 'text-ink'}`}>
          {label}
        </p>
        {note && (
          <p className="text-xs text-ink-mute mt-0.5 leading-snug">
            {note}
          </p>
        )}
      </div>
      <span
        className={`col-span-3 text-right mono tabular-nums ${
          total ? 'text-ink text-xl font-semibold' : 'text-ink text-base font-medium'
        }`}
      >
        {value}
      </span>
      <span className="col-span-2 text-right text-xs text-ink-mute font-medium">
        {unit}
      </span>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-carbon-ink/70">{k}</span>
      <span className="mono tabular-nums text-carbon-ink font-medium">{v}</span>
    </div>
  )
}
