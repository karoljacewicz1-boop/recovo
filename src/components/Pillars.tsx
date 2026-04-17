'use client'

import { useLang } from '@/lib/LanguageContext'

export default function Pillars() {
  const { t } = useLang()
  const p = t.pillars

  return (
    <section className="py-20 md:py-28 bg-white border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-4">
            {p.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-5">
            {p.title}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {p.sub}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {p.items.map((item) => (
            <div
              key={item.tag}
              className="bg-[#FAFAFA] rounded-2xl p-8 border border-gray-100 hover:border-[#E8512A]/30 transition-colors flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-mono font-bold text-[#E8512A] bg-[#FFF3EF] rounded-full px-2.5 py-1">
                  {item.tag}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-[#1A1A1A] mb-3 leading-tight">
                {item.title}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed mb-8 flex-1">
                {item.desc}
              </p>

              <div className="pt-6 border-t border-gray-200">
                <p className="text-3xl font-extrabold text-[#E8512A] leading-none">
                  {item.metric}
                </p>
                <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider font-medium">
                  {item.metricLabel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
