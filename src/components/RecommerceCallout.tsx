'use client'

import Link from 'next/link'
import { useLang } from '@/lib/LanguageContext'

/**
 * RecommerceCallout — the "dark section" of the page. Carbon bg, mono
 * typography, data-forward callouts. Steps are a numbered track.
 */
export default function RecommerceCallout() {
  const { t } = useLang()
  const r = t.recommerce

  return (
    <section
      id="recommerce"
      className="relative py-3xl bg-carbon text-carbon-ink overflow-hidden"
    >
      {/* Diagonal engineered pattern */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, oklch(96% 0.005 80) 0, oklch(96% 0.005 80) 1px, transparent 1px, transparent 12px)',
        }}
      />

      <div className="relative max-w-content mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
          {/* LEFT */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2.5 mb-xl">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="label !text-accent">{r.eyebrow}</span>
              <span className="h-px w-10 bg-carbon-line" />
              <span className="label !text-carbon-ink/50">channel · sales</span>
            </div>

            <h2 className="text-display-sm md:text-display lg:text-display-lg font-bold text-carbon-ink tracking-[-0.03em] leading-[1.02] mb-lg">
              {r.title}
            </h2>
            <p className="text-base md:text-lg text-carbon-ink/70 leading-[1.6] mb-xl max-w-xl">
              {r.sub}
            </p>

            {/* Why-items row */}
            <div className="grid sm:grid-cols-3 gap-0 border-t border-carbon-line mb-xl">
              {r.whyItems.map((item, i) => (
                <div
                  key={item.title}
                  className={`py-lg ${
                    i < r.whyItems.length - 1 ? 'sm:border-r border-carbon-line sm:pr-lg' : ''
                  } ${i > 0 ? 'sm:pl-lg' : ''}`}
                >
                  <p className="mono text-[10px] tabular-nums text-accent mb-2">
                    {String(i + 1).padStart(2, '0')} / 03
                  </p>
                  <p className="text-sm font-semibold text-carbon-ink mb-1.5">
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
              className="group inline-flex items-center gap-2 text-accent hover:text-carbon-ink font-medium transition-colors duration-micro ease-emil"
            >
              <span className="border-b border-accent group-hover:border-carbon-ink">
                Zobacz jak działa recommerce
              </span>
              <span className="mono transition-transform duration-micro ease-emil group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>

          {/* RIGHT — step list */}
          <div className="lg:col-span-5">
            <div className="border border-carbon-line">
              <div className="flex items-center justify-between px-4 py-3 border-b border-carbon-line bg-carbon-soft/40">
                <span className="mono text-[10px] uppercase tracking-[0.14em] text-carbon-ink/60">
                  recommerce · pipeline
                </span>
                <span className="mono text-[10px] tabular-nums text-accent">
                  {r.steps.length} steps
                </span>
              </div>
              <ol>
                {r.steps.map((step, idx) => (
                  <li
                    key={step.num}
                    className="flex gap-4 px-5 py-4 border-b border-carbon-line last:border-b-0 hover:bg-carbon-soft/30 transition-colors duration-micro ease-emil"
                  >
                    <div className="flex-shrink-0 relative">
                      <span className="w-8 h-8 flex items-center justify-center mono text-[12px] tabular-nums font-medium bg-accent text-carbon">
                        {step.num}
                      </span>
                      {idx < r.steps.length - 1 && (
                        <span className="absolute left-1/2 -translate-x-px top-8 w-px h-[calc(100%-8px)] bg-carbon-line" />
                      )}
                    </div>
                    <div className="pt-0.5 min-w-0">
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
