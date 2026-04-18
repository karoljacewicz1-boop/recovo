'use client'

import { useLang } from '@/lib/LanguageContext'

/**
 * Pillars — asymmetric: hero pillar (left, 7 cols) + two stacked
 * supporting pillars (right, 5 cols). Rounded cards, soft surfaces,
 * numeric metric in each footer.
 */
export default function Pillars() {
  const { t } = useLang()
  const p = t.pillars
  const [lead, ...rest] = p.items

  return (
    <section className="relative py-3xl">
      <div className="max-w-content mx-auto px-6">
        {/* Section header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg mb-2xl">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-3">{p.eyebrow}</p>
            <h2 className="text-display-sm lg:text-display font-bold text-ink tracking-[-0.025em]">
              {p.title}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-8">
            <p className="text-base md:text-lg text-ink-soft leading-[1.6]">
              {p.sub}
            </p>
          </div>
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Hero pillar */}
          <article className="lg:col-span-7 relative p-xl lg:p-2xl rounded-xl bg-surface border border-border">
            <div className="flex items-center gap-2 mb-lg">
              <span className="w-8 h-8 rounded-md bg-accent text-carbon-ink flex items-center justify-center mono text-sm font-semibold tabular-nums">
                {lead.tag}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-mute">
                Primary outcome
              </span>
            </div>

            <h3 className="text-3xl md:text-4xl font-bold text-ink leading-[1.1] tracking-[-0.02em] mb-md max-w-md">
              {lead.title}
            </h3>
            <p className="text-ink-soft leading-[1.6] mb-2xl max-w-lg">
              {lead.desc}
            </p>

            {/* Big number + step bar */}
            <div className="flex items-end gap-lg pt-lg border-t border-border">
              <div>
                <span className="mono tabular-nums font-semibold text-ink text-5xl md:text-6xl leading-none">
                  {lead.metric}
                </span>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-mute mt-3">
                  {lead.metricLabel}
                </p>
              </div>
              <div className="hidden md:block flex-1">
                <StepBar />
              </div>
            </div>
          </article>

          {/* Supporting pillars */}
          <div className="lg:col-span-5 grid gap-4">
            {rest.map((item) => (
              <article
                key={item.tag}
                className="p-xl rounded-xl bg-bg border border-border hover:shadow-card transition-shadow duration-base ease-emil flex flex-col"
              >
                <div className="flex items-center gap-2 mb-md">
                  <span className="w-7 h-7 rounded-md bg-accent-tint text-accent flex items-center justify-center mono text-xs font-semibold tabular-nums">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-ink leading-[1.2] tracking-[-0.015em] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-ink-soft leading-[1.6] mb-lg flex-1">
                  {item.desc}
                </p>

                <div className="flex items-baseline gap-3 pt-md border-t border-border">
                  <span className="mono tabular-nums font-semibold text-ink text-3xl leading-none">
                    {item.metric}
                  </span>
                  <p className="text-xs text-ink-mute">
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

function StepBar() {
  const filled = 7
  return (
    <div className="flex items-end gap-[3px] h-12">
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className={`flex-1 rounded-xs ${i < filled ? 'bg-accent' : 'bg-border'}`}
          style={{ height: `${35 + i * 6.5}%` }}
        />
      ))}
    </div>
  )
}
