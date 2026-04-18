'use client'

import { useLang } from '@/lib/LanguageContext'

/**
 * Pillars — presented as a data sheet, not three equal cards.
 * A prominent hero pillar on the left (pillar 01) with supporting pillars
 * stacked on the right. This asymmetry breaks the "generic 3-column" rhythm
 * while keeping all three stories readable.
 */
export default function Pillars() {
  const { t } = useLang()
  const p = t.pillars
  const [lead, ...rest] = p.items

  return (
    <section className="relative py-3xl">
      <div className="max-w-content mx-auto px-6">
        {/* Section header row — eyebrow + title on left, sub on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg mb-2xl pb-lg border-b border-border">
          <div className="lg:col-span-7">
            <p className="label mb-4">
              <span className="text-accent mono">§.01</span> &nbsp; {p.eyebrow}
            </p>
            <h2 className="text-display-sm lg:text-display font-bold text-ink tracking-[-0.025em]">
              {p.title}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-10">
            <p className="text-base md:text-lg text-ink-soft leading-[1.55]">
              {p.sub}
            </p>
          </div>
        </div>

        {/* Asymmetric pillar grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-border">
          {/* Hero pillar — col-span-7, darker surface */}
          <article className="lg:col-span-7 relative p-xl lg:p-2xl bg-surface border-b lg:border-b-0 lg:border-r border-border">
            <div className="flex items-start justify-between mb-xl">
              <span className="mono text-[11px] tracking-[0.14em] text-accent uppercase">
                pillar · {lead.tag}
              </span>
              <span className="mono text-[10px] tracking-[0.12em] text-ink-mute uppercase">
                primary outcome
              </span>
            </div>

            <h3 className="text-3xl md:text-4xl font-bold text-ink leading-[1.05] tracking-[-0.02em] mb-lg max-w-md">
              {lead.title}
            </h3>

            <p className="text-ink-soft leading-[1.6] mb-2xl max-w-lg">
              {lead.desc}
            </p>

            {/* Big number readout */}
            <div className="flex items-end gap-lg pt-lg border-t border-border">
              <div>
                <span className="mono tabular-nums font-medium text-ink text-5xl md:text-6xl leading-none">
                  {lead.metric}
                </span>
                <p className="label mt-3">{lead.metricLabel}</p>
              </div>
              <div className="hidden md:block flex-1">
                {/* A little visual rhythm — stepped bar */}
                <StepBar />
              </div>
            </div>

            {/* Corner mark — "operator" flourish */}
            <span
              aria-hidden
              className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent"
            />
            <span
              aria-hidden
              className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-accent"
            />
          </article>

          {/* Supporting pillars — stacked */}
          <div className="lg:col-span-5 flex flex-col">
            {rest.map((item, i) => (
              <article
                key={item.tag}
                className={`p-xl lg:p-2xl flex-1 flex flex-col justify-between ${
                  i === 0 ? 'border-b border-border' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-md">
                    <span className="mono text-[11px] tracking-[0.14em] text-ink-mute uppercase">
                      pillar · {item.tag}
                    </span>
                    <span className="w-6 h-px bg-border" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-ink leading-[1.15] tracking-[-0.015em] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-ink-soft leading-[1.6] mb-lg">
                    {item.desc}
                  </p>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="mono tabular-nums font-medium text-ink text-3xl leading-none">
                    {item.metric}
                  </span>
                  <p className="label !normal-case !tracking-normal text-ink-mute">
                    {item.metricLabel}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * StepBar — 10 segmented bars, filled proportional to a ~70% recovery rate.
 * Purely decorative but reads as "this product deals in measurable %s."
 */
function StepBar() {
  const filled = 7
  return (
    <div className="flex items-end gap-[3px] h-12">
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className={`flex-1 ${i < filled ? 'bg-accent' : 'bg-border'}`}
          style={{ height: `${35 + i * 6.5}%` }}
        />
      ))}
    </div>
  )
}
