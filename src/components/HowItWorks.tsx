'use client'

import { useLang } from '@/lib/LanguageContext'

/**
 * HowItWorks — three-step timeline with a subtle connector track and
 * soft rounded step badges. No timestamps, no codes.
 */
export default function HowItWorks() {
  const { t } = useLang()
  const h = t.howItWorks

  return (
    <section id="how-it-works" className="relative py-3xl bg-surface">
      <div className="max-w-content mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg mb-2xl">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-3">{h.eyebrow}</p>
            <h2 className="text-display-sm lg:text-display font-bold text-ink tracking-[-0.025em]">
              {h.title}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-8 flex items-start">
            <p className="text-sm text-ink-mute">
              Trzy kroki. Pełna dokumentacja. 48 godzin od przyjęcia do decyzji.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Horizontal track (desktop) */}
          <div
            aria-hidden
            className="hidden md:block absolute top-6 left-12 right-12 h-0.5 bg-border rounded-pill"
          />
          <div
            aria-hidden
            className="hidden md:block absolute top-6 left-12 h-0.5 bg-accent rounded-pill"
            style={{ width: 'calc(66% - 24px)' }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {h.steps.map((step, i) => (
              <div
                key={step.number}
                className="relative p-lg rounded-xl bg-bg border border-border"
              >
                <span
                  className={`relative z-10 inline-flex items-center justify-center w-12 h-12 rounded-xl mb-lg mono text-lg font-semibold tabular-nums ${
                    i < 2
                      ? 'bg-accent text-carbon-ink shadow-card'
                      : 'bg-ink text-carbon-ink shadow-card'
                  }`}
                >
                  {step.number}
                </span>

                <h3 className="text-lg md:text-xl font-bold text-ink leading-[1.25] tracking-[-0.015em] mb-2 max-w-xs">
                  {step.title}
                </h3>
                <p className="text-sm text-ink-soft leading-[1.6]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
