'use client'

import { useLang } from '@/lib/LanguageContext'

export default function HowItWorks() {
  const { t } = useLang()
  const h = t.howItWorks

  return (
    <section id="how-it-works" className="py-24 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E8512A]">
            {h.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] mt-3">
            {h.title}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {h.steps.map((step) => (
            <div key={step.number} className="flex flex-col">
              <span className="text-5xl font-extrabold text-[#E8512A] opacity-30 leading-none mb-4">
                {step.number}
              </span>
              <div className="w-12 h-1 bg-[#E8512A] mb-5" />
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
