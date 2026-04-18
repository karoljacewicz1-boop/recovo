'use client'

import Link from 'next/link'
import { useLang } from '@/lib/LanguageContext'

/**
 * UseCases — two operational modes presented as a comparison table.
 * Primary mode is accented, secondary is neutral. Engineered borders,
 * no gradient pills, mono labels.
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
      <div className="absolute top-0 inset-x-0 h-px bg-border" />
      <div className="max-w-content mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg mb-2xl">
          <div className="lg:col-span-7">
            <p className="label mb-4">
              <span className="text-accent mono">§.04</span> &nbsp; {u.eyebrow}
            </p>
            <h2 className="text-display-sm lg:text-display font-bold text-ink tracking-[-0.025em]">
              {u.title}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-10">
            <p className="text-base md:text-lg text-ink-soft leading-[1.55]">
              {u.sub}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-0 border border-border">
          {blocks.map((block, i) => {
            const isPrimary = block.variant === 'primary'
            return (
              <article
                key={block.tag}
                className={`relative p-xl lg:p-2xl flex flex-col ${
                  isPrimary ? 'bg-bg' : 'bg-surface'
                } ${i === 0 ? 'border-b md:border-b-0 md:border-r border-border' : ''}`}
              >
                <div className="flex items-center justify-between mb-lg">
                  <span className="mono text-[11px] tracking-[0.14em] uppercase text-accent">
                    mode · {block.tag}
                  </span>
                  <span
                    className={`mono text-[10px] tracking-[0.12em] uppercase px-2 py-1 ${
                      isPrimary
                        ? 'bg-accent text-carbon-ink'
                        : 'border border-border text-ink-mute'
                    }`}
                  >
                    {block.badge}
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-ink tracking-[-0.02em] leading-[1.1] mb-md">
                  {block.title}
                </h3>
                <p className="text-base text-ink-soft leading-[1.6] mb-lg">
                  {block.desc}
                </p>

                <ul className="space-y-3 mb-xl flex-1">
                  {block.bullets.map((b, bi) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-ink">
                      <span className="mono text-[10px] tabular-nums text-accent mt-1">
                        {String(bi + 1).padStart(2, '0')}
                      </span>
                      <span className="leading-[1.55]">{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-lg border-t border-border">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="mono tabular-nums text-3xl font-medium text-ink">
                      {block.price}
                    </span>
                  </div>
                  <p className="text-[11px] mono tabular-nums text-ink-mute uppercase tracking-[0.08em] mb-lg">
                    {block.priceNote}
                  </p>

                  <Link
                    href={block.ctaHref}
                    className={`group inline-flex w-full items-center justify-between gap-2 px-4 py-3 font-medium text-sm transition-colors duration-micro ease-emil ${
                      isPrimary
                        ? 'bg-accent text-carbon-ink hover:bg-accent-deep'
                        : 'bg-ink text-carbon-ink hover:bg-accent'
                    }`}
                  >
                    <span>{block.cta}</span>
                    <span className="mono transition-transform duration-micro ease-emil group-hover:translate-x-0.5">
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
