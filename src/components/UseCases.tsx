'use client'

import Link from 'next/link'
import { useLang } from '@/lib/LanguageContext'

/**
 * UseCases — two operational modes side-by-side. Primary is visually
 * pushed forward with a soft shadow and accent border.
 */
export default function UseCases() {
  const { t } = useLang()
  const u = t.useCases

  const blocks = [
    { ...u.primary, variant: 'primary' as const },
    { ...u.secondary, variant: 'secondary' as const },
  ]

  return (
    <section id="use-cases" className="relative py-3xl bg-surface">
      <div className="max-w-content mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg mb-2xl">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-3">{u.eyebrow}</p>
            <h2 className="text-display-sm lg:text-display font-bold text-ink tracking-[-0.025em]">
              {u.title}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-8">
            <p className="text-base md:text-lg text-ink-soft leading-[1.6]">
              {u.sub}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-lg">
          {blocks.map((block) => {
            const isPrimary = block.variant === 'primary'
            return (
              <article
                key={block.tag}
                className={`relative p-xl lg:p-2xl rounded-xl flex flex-col ${
                  isPrimary
                    ? 'bg-bg border-2 border-accent shadow-card-hover'
                    : 'bg-bg border border-border'
                }`}
              >
                {isPrimary && (
                  <span className="absolute -top-3 left-xl inline-flex items-center gap-1.5 bg-accent text-carbon-ink text-xs font-semibold px-3 py-1 rounded-pill">
                    <span className="w-1.5 h-1.5 rounded-full bg-carbon-ink" />
                    {block.badge}
                  </span>
                )}

                <p className="text-xs font-semibold uppercase tracking-wider text-ink-mute mb-sm">
                  {block.tag}
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-ink tracking-[-0.02em] leading-[1.15] mb-md">
                  {block.title}
                </h3>
                <p className="text-base text-ink-soft leading-[1.6] mb-lg">
                  {block.desc}
                </p>

                <ul className="space-y-3 mb-xl flex-1">
                  {block.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-ink">
                      <svg
                        className="w-5 h-5 text-accent flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="leading-[1.55]">{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-lg border-t border-border">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="mono tabular-nums text-3xl font-semibold text-ink">
                      {block.price}
                    </span>
                  </div>
                  <p className="text-xs text-ink-mute mb-lg">{block.priceNote}</p>

                  <Link
                    href={block.ctaHref}
                    className={`group inline-flex w-full items-center justify-center gap-2 px-4 py-3 rounded-md font-semibold text-sm transition-colors duration-micro ease-emil ${
                      isPrimary
                        ? 'bg-accent text-carbon-ink hover:bg-accent-deep'
                        : 'bg-ink text-carbon-ink hover:bg-accent'
                    }`}
                  >
                    <span>{block.cta}</span>
                    <span className="transition-transform duration-micro ease-emil group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
