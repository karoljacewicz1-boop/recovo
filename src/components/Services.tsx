'use client'

import { useLang } from '@/lib/LanguageContext'

export default function Services() {
  const { t } = useLang()
  const s = t.services

  const highlights = [false, true, false]

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E8512A]">
            {s.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] mt-3">
            {s.title}
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl">{s.sub}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {s.plans.map((plan, i) => {
            const isHighlight = highlights[i]
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-lg p-8 ${
                  isHighlight ? 'bg-[#E8512A] text-white' : 'bg-[#FFF3EF] text-[#1A1A1A]'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </span>
                )}

                <h3
                  className={`text-lg font-bold mb-4 ${
                    isHighlight ? 'text-white' : 'text-[#1A1A1A]'
                  }`}
                >
                  {plan.name}
                </h3>

                <div className="mb-6">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span
                    className={`text-sm ml-1 ${
                      isHighlight ? 'text-white/70' : 'text-gray-500'
                    }`}
                  >
                    {plan.unit}
                  </span>
                </div>

                <ul className="flex flex-col gap-3 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <span
                        className={`mt-0.5 text-base ${
                          isHighlight ? 'text-white' : 'text-[#E8512A]'
                        }`}
                      >
                        ✓
                      </span>
                      <span className={isHighlight ? 'text-white/90' : 'text-gray-700'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`mt-8 text-center text-sm font-semibold py-3 rounded-lg transition-colors ${
                    isHighlight
                      ? 'bg-white text-[#E8512A] hover:bg-[#FFF3EF]'
                      : 'bg-[#E8512A] text-white hover:bg-[#d14420]'
                  }`}
                >
                  {s.cta}
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
