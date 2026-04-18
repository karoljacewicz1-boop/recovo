'use client'

import { useLang } from '@/lib/LanguageContext'

/**
 * Testimonials — honest, early-stage framing. Content in translations is
 * still bracketed placeholders; rather than faking polish, we lean into it
 * with "pilot cohort" badging and sharp typographic treatment that reads
 * as confident even when quotes are anonymized.
 */
export default function Testimonials() {
  const { t } = useLang()
  const te = t.testimonials

  return (
    <section className="relative py-3xl">
      <div className="absolute top-0 inset-x-0 h-px bg-border" />
      <div className="max-w-content mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg mb-2xl">
          <div className="lg:col-span-7">
            <p className="label mb-4">
              <span className="text-accent mono">§.05</span> &nbsp; {te.eyebrow}
            </p>
            <h2 className="text-display-sm lg:text-display font-bold text-ink tracking-[-0.025em]">
              {te.title}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-10 flex items-center gap-2">
            <span className="mono text-[10px] uppercase tracking-[0.12em] text-ink-mute tabular-nums">
              pilot cohort · 2025 Q1 — ongoing
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-0 border border-border">
          {te.items.map((item, i) => (
            <figure
              key={i}
              className={`relative p-xl flex flex-col ${
                i < te.items.length - 1
                  ? 'border-b md:border-b-0 md:border-r border-border'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between mb-lg">
                <span className="mono text-[10px] tabular-nums text-accent uppercase tracking-[0.12em]">
                  op · {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} className="mono text-accent text-sm leading-none">
                      ▪
                    </span>
                  ))}
                </span>
              </div>

              <blockquote className="text-base text-ink leading-[1.55] mb-xl flex-1">
                &ldquo;{item.quote}&rdquo;
              </blockquote>

              <figcaption className="pt-md border-t border-border flex items-center gap-3">
                <span className="w-8 h-8 border border-border flex items-center justify-center mono text-xs text-ink-soft tabular-nums">
                  {item.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">
                    {item.name}
                  </p>
                  <p className="mono text-[10px] uppercase tracking-[0.1em] text-ink-mute">
                    {te.role}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
