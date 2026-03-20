'use client'

import { useLang } from '@/lib/LanguageContext'

export default function Testimonials() {
  const { t } = useLang()
  const te = t.testimonials

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E8512A]">
            {te.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] mt-3">
            {te.title}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {te.items.map((item, i) => (
            <div key={i} className="bg-[#FFF3EF] rounded-lg p-8 flex flex-col gap-4">
              <div className="flex gap-1 text-[#E8512A]">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className="text-lg">★</span>
                ))}
              </div>

              <p className="text-gray-400 italic text-sm leading-relaxed">
                &ldquo;[{item.quote}]&rdquo;
              </p>

              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-orange-100">
                <div className="w-10 h-10 rounded-full bg-[#E8512A]/20 flex items-center justify-center text-[#E8512A] font-bold text-sm">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs text-gray-400">[{item.name}]</p>
                  <p className="text-xs text-gray-300">{te.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
