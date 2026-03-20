'use client'

import { useLang } from '@/lib/LanguageContext'

export default function WhoWeServe() {
  const { t } = useLang()
  const s = t.segments

  return (
    <section id="who-we-serve" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E8512A]">
            {s.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] mt-3">
            {s.title}
          </h2>
        </div>

        {/* Two cards side by side */}
        <div className="grid md:grid-cols-2 gap-8">
          {s.cards.map((card, i) => (
            <div
              key={i}
              className="flex flex-col rounded-lg border border-gray-100 bg-[#FAFAFA] p-8 hover:border-[#E8512A]/30 transition-colors"
            >
              {/* Tag */}
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E8512A] mb-5">
                <span className="text-xl">{card.icon}</span>
                {card.tag}
              </span>

              {/* Title */}
              <h3 className="text-xl font-extrabold text-[#1A1A1A] mb-3">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {card.desc}
              </p>

              {/* Bullets */}
              <ul className="flex flex-col gap-2.5 flex-1 mb-8">
                {card.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <span className="mt-0.5 text-[#E8512A] font-bold">✓</span>
                    {b}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#contact"
                className="inline-block text-center bg-[#E8512A] text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-[#d14420] transition-colors"
              >
                {card.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
