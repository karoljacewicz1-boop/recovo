'use client'

import Link from 'next/link'
import { useLang } from '@/lib/LanguageContext'

export default function RecommerceCallout() {
  const { t } = useLang()
  const r = t.recommerce

  return (
    <section id="recommerce" className="py-20 md:py-28 bg-[#1A1A1A] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-[1fr_1fr] gap-12 items-start">
          {/* Left: intro */}
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-5">
              <span className="w-8 h-px bg-[#E8512A]" />
              {r.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight mb-6">
              {r.title}
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">{r.sub}</p>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {r.whyItems.map((item) => (
                <div
                  key={item.title}
                  className="bg-white/5 rounded-xl p-4 border border-white/10"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#E8512A]/20 flex items-center justify-center mb-3">
                    <svg className="w-4 h-4 text-[#E8512A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <p className="text-sm font-bold text-white mb-1">{item.title}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <Link
              href="/recommerce"
              className="inline-flex items-center gap-2 text-[#E8512A] font-semibold hover:text-white transition-colors"
            >
              Zobacz jak działa recommerce →
            </Link>
          </div>

          {/* Right: steps */}
          <div className="relative">
            <div className="space-y-4">
              {r.steps.map((step, idx) => (
                <div
                  key={step.num}
                  className="relative flex gap-5 bg-white/5 rounded-xl p-5 border border-white/10"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#E8512A] flex items-center justify-center">
                      <span className="text-sm font-extrabold text-white">{step.num}</span>
                    </div>
                    {idx < r.steps.length - 1 && (
                      <div className="w-px h-8 bg-gradient-to-b from-[#E8512A] to-transparent mx-auto mt-2" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-1">{step.title}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
