'use client'

import { useLang } from '@/lib/LanguageContext'

export default function Hero() {
  const { t } = useLang()
  const h = t.hero

  return (
    <section className="pt-32 pb-20 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-4">
            {h.eyebrow}
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1A1A1A] leading-tight mb-6">
            {h.headline1}{' '}
            <span className="text-[#E8512A]">{h.headline2}</span>{' '}
            {h.headline3}
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl">
            {h.sub}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#calculator"
              className="bg-[#E8512A] text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-[#d14420] transition-colors text-center text-base"
            >
              {h.cta1}
            </a>
            <a
              href="#how-it-works"
              className="border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold px-7 py-3.5 rounded-lg hover:bg-[#1A1A1A] hover:text-white transition-colors text-center text-base"
            >
              {h.cta2}
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            <a href="/demo" className="hover:text-[#E8512A] transition-colors underline underline-offset-2">
              View live demo →
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
