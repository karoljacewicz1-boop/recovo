'use client'

import { useLang } from '@/lib/LanguageContext'

const ICONS = ['⚡', '📸', '💰', '📍']

export default function TrustBar() {
  const { t } = useLang()
  const tr = t.trust

  const stats = [
    { icon: ICONS[0], value: tr.stat1v, label: tr.stat1l },
    { icon: ICONS[1], value: tr.stat2v, label: tr.stat2l },
    { icon: ICONS[2], value: tr.stat3v, label: tr.stat3l },
    { icon: ICONS[3], value: tr.stat4v, label: tr.stat4l },
  ]

  return (
    <section className="bg-[#1A1A1A] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-gray-700">
          {stats.map((stat) => (
            <div key={stat.value} className="flex flex-col items-center text-center px-6">
              <span className="text-3xl mb-2">{stat.icon}</span>
              <span className="text-xl font-extrabold text-white">{stat.value}</span>
              <span className="text-sm text-gray-400 mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
