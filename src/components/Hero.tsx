'use client'

import Link from 'next/link'
import { useLang } from '@/lib/LanguageContext'

export default function Hero() {
  const { t } = useLang()
  const h = t.hero

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-[#FAFAFA] relative overflow-hidden">
      {/* subtle geometric accent */}
      <div
        aria-hidden
        className="absolute top-24 right-[-10%] w-[520px] h-[520px] rounded-full bg-[#E8512A]/5 blur-3xl pointer-events-none"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-5">
            <span className="w-8 h-px bg-[#E8512A]" />
            {h.eyebrow}
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-[#1A1A1A] leading-[1.05] tracking-tight mb-6">
            {h.headline1}{' '}
            <span className="text-[#E8512A]">{h.headline2}</span>{' '}
            {h.headline3}
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
            {h.sub}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <Link
              href="/register"
              className="bg-[#E8512A] text-white font-semibold px-7 py-4 rounded-xl hover:bg-[#D4431F] transition-colors text-center text-base"
            >
              {h.cta1}
            </Link>
            <Link
              href="#calculator"
              className="border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold px-7 py-4 rounded-xl hover:bg-[#1A1A1A] hover:text-white transition-colors text-center text-base"
            >
              {h.cta2}
            </Link>
          </div>

          <p className="mt-5 text-sm text-gray-500 flex items-center gap-2">
            <svg className="w-4 h-4 text-[#E8512A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            {h.noCard}
          </p>
        </div>
      </div>
    </section>
  )
}
