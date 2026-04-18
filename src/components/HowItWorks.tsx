'use client'

import { useLang } from '@/lib/LanguageContext'

/**
 * HowItWorks — engineered timeline. Replaces the three-columns-with-hairlines
 * pattern with a single connected horizontal track on desktop and vertical
 * on mobile. Numbered checkpoints on the track anchor each step; a mono
 * duration badge at each stop reinforces the "we quote real times" ethos.
 */
export default function HowItWorks() {
  const { t } = useLang()
  const h = t.howItWorks

  // Step durations are hardcoded (they're design data, not copy).
  const durations = ['T + 00h', 'T + 24h', 'T + 48h']

  return (
    <section id="how-it-works" className="relative py-3xl bg-surface">
      <div className="absolute top-0 inset-x-0 h-px bg-border" />
      <div className="max-w-content mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg mb-2xl">
          <div className="lg:col-span-7">
            <p className="label mb-4">
              <span className="text-accent mono">§.02</span> &nbsp; {h.eyebrow}
            </p>
            <h2 className="text-display-sm lg:text-display font-bold text-ink tracking-[-0.025em]">
              {h.title}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-10 flex items-start">
            <div className="flex items-center gap-2 mono text-[11px] uppercase tracking-[0.12em] text-ink-mute">
              <span className="w-6 h-px bg-border" />
              <span>3 steps · 48 hours · fully tracked</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Horizontal track (desktop) */}
          <div
            aria-hidden
            className="hidden md:block absolute top-[18px] left-0 right-0 h-px bg-border"
          />
          {/* Accent progress fill — implies momentum */}
          <div
            aria-hidden
            className="hidden md:block absolute top-[18px] left-0 h-px bg-accent"
            style={{ width: '82%' }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl md:gap-lg">
            {h.steps.map((step, i) => (
              <div key={step.number} className="relative flex flex-col">
                {/* Track node */}
                <div className="flex items-center gap-3 mb-lg">
                  <span
                    className={`relative z-10 w-9 h-9 flex items-center justify-center mono text-[13px] tabular-nums font-medium ${
                      i < 2
                        ? 'bg-accent text-carbon-ink'
                        : 'bg-ink text-carbon-ink'
                    }`}
                  >
                    {step.number}
                  </span>
                  <span className="mono text-[10px] uppercase tracking-[0.12em] text-ink-mute tabular-nums">
                    {durations[i]}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-ink leading-[1.2] tracking-[-0.015em] mb-3 max-w-xs">
                  {step.title}
                </h3>
                <p className="text-sm text-ink-soft leading-[1.6] max-w-sm">
                  {step.desc}
                </p>

                {/* Mono micro-detail per step — makes it feel operational */}
                <div className="mt-lg pt-md border-t border-border flex items-center justify-between">
                  <span className="mono text-[10px] uppercase tracking-[0.12em] text-ink-mute">
                    step {String(i + 1).padStart(2, '0')} / 03
                  </span>
                  <span className="mono text-[10px] tabular-nums text-accent">
                    {['receive', 'grade', 'execute'][i]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
