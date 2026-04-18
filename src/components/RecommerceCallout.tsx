'use client'

import Link from 'next/link'
import { useLang } from '@/lib/LanguageContext'

/**
 * RecommerceCallout — the dark section. Carbon background, rounded
 * cards, friendly numbered steps. No diagonal hatching, no terminal
 * labels.
 */
export default function RecommerceCallout() {
  const { t } = useLang()
  const r = t.recommerce

  return (
    <section
      id="recommerce"
      className="relative py-3xl bg-carbon text-carbon-ink overflow-hidden"
    >
      {/* Soft accent glow */}
      <div
        aria-hidden
        className="absolute -top-40 right-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-[0.15]"
        style={{
          background:
            'radial-gradient(circle at center, oklch(62% 0.185 34) 0%, transparent 60%)',
        }}
      />

      <div className="relative max-w-content mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
          {/* LEFT */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 bg-accent/15 text-accent text-xs font-semibold px-3 py-1.5 rounded-pill mb-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              {r.eyebrow}
            </div>

            <h2 className="text-display-sm md:text-display lg:text-display-lg font-bold text-carbon-ink tracking-[-0.03em] leading-[1.05] mb-lg">
              {r.title}
            </h2>
            <p className="text-base md:text-lg text-carbon-ink/70 leading-[1.6] mb-xl max-w-xl">
              {r.sub}
            </p>

            {/* Why-items */}
            <div className="grid sm:grid-cols-3 gap-4 mb-xl">
              {r.whyItems.map((item) => (
                <div
                  key={item.title}
                  className="p-lg rounded-xl bg-carbon-soft/60 border border-carbon-line"
                >
                  <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center mb-md">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {item.icon === 'clock' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                      {item.icon === 'space' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      )}
                      {item.icon === 'scale' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      )}
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-carbon-ink mb-1">
                    {item.title}
                  </p>
                  <p className="text-xs text-carbon-ink/60 leading-[1.55]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/recommerce"
              className="group inline-flex items-center gap-2 text-accent hover:text-carbon-ink font-semibold transition-colors duration-micro ease-emil"
            >
              Zobacz jak działa recommerce
              <span className="transition-transform duration-micro ease-emil group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>

          {/* RIGHT — step list */}
          <div className="lg:col-span-5">
            <div className="rounded-xl bg-carbon-soft/40 border border-carbon-line overflow-hidden">
              <ol>
                {r.steps.map((step, idx) => (
                  <li
                    key={step.num}
                    className="flex gap-4 px-5 py-4 border-b border-carbon-line last:border-b-0 hover:bg-carbon-soft/60 transition-colors duration-micro ease-emil"
                  >
                    <div className="flex-shrink-0 relative">
                      <span className="w-10 h-10 flex items-center justify-center rounded-full mono text-sm font-semibold tabular-nums bg-accent text-carbon">
                        {step.num}
                      </span>
                      {idx < r.steps.length - 1 && (
                        <span className="absolute left-1/2 -translate-x-px top-10 w-px h-[calc(100%-16px)] bg-carbon-line" />
                      )}
                    </div>
                    <div className="pt-1.5 min-w-0">
                      <p className="text-sm font-semibold text-carbon-ink mb-1">
                        {step.title}
                      </p>
                      <p className="text-xs text-carbon-ink/60 leading-[1.6]">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
