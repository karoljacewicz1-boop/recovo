'use client'

import Link from 'next/link'
import { useLang } from '@/lib/LanguageContext'

export default function UseCases() {
  const { t } = useLang()
  const u = t.useCases

  const blocks = [
    { ...u.primary, variant: 'primary' as const },
    { ...u.secondary, variant: 'secondary' as const },
  ]

  return (
    <section id="use-cases" className="py-20 md:py-28 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-4">
            {u.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-5">
            {u.title}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">{u.sub}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {blocks.map((block) => {
            const isPrimary = block.variant === 'primary'
            return (
              <div
                key={block.tag}
                className={`relative rounded-2xl p-8 md:p-10 flex flex-col border-2 ${
                  isPrimary
                    ? 'bg-white border-[#E8512A] shadow-sm'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div
                  className={`inline-flex self-start items-center gap-2 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 ${
                    isPrimary
                      ? 'bg-[#E8512A] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {block.badge}
                </div>

                <p className="text-xs font-bold text-[#E8512A] uppercase tracking-wider mb-2">
                  {block.tag}
                </p>
                <h3 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] tracking-tight leading-tight mb-4">
                  {block.title}
                </h3>
                <p className="text-base text-gray-600 leading-relaxed mb-6">
                  {block.desc}
                </p>

                <ul className="space-y-3 mb-8 flex-1">
                  {block.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-gray-700">
                      <svg
                        className="w-5 h-5 text-[#E8512A] flex-shrink-0 mt-0.5"
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
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl font-extrabold text-[#1A1A1A]">
                      {block.price}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-5">{block.priceNote}</p>

                  <Link
                    href={block.ctaHref}
                    className={`block w-full text-center py-3.5 rounded-xl font-semibold text-sm transition-colors ${
                      isPrimary
                        ? 'bg-[#E8512A] text-white hover:bg-[#D4431F]'
                        : 'bg-[#1A1A1A] text-white hover:bg-gray-800'
                    }`}
                  >
                    {block.cta} →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
