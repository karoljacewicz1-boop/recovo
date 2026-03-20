'use client'

import { useLang } from '@/lib/LanguageContext'

export default function Footer() {
  const { t } = useLang()
  const f = t.footer

  return (
    <footer className="bg-[#111111] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="max-w-xs">
            <p className="text-2xl font-extrabold text-white mb-2">Recovo</p>
            <p className="text-sm text-gray-500 italic">{f.tagline}</p>
            <p className="text-xs text-gray-600 mt-4 leading-relaxed">
              Recovo Sp. z o.o.
              <br />
              Laurowa 19b, Wysogotowo
              <br />
              62-081 Przeźmierowo, Poland
            </p>
            <a
              href="mailto:hello@recovo.com"
              className="text-xs text-gray-500 hover:text-[#E8512A] transition-colors mt-2 inline-block"
            >
              hello@recovo.com
            </a>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-1">
              {f.legal}
            </p>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              {f.privacy}
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              {f.terms}
            </a>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-1">
              {f.site}
            </p>
            <a href="#how-it-works" className="text-gray-500 hover:text-white transition-colors">
              {f.howItWorks}
            </a>
            <a href="#services" className="text-gray-500 hover:text-white transition-colors">
              {f.services}
            </a>
            <a href="#calculator" className="text-gray-500 hover:text-white transition-colors">
              {f.calculator}
            </a>
            <a href="#contact" className="text-gray-500 hover:text-white transition-colors">
              {f.contact}
            </a>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 text-xs text-gray-700 text-center">
          {f.copyright}
        </div>
      </div>
    </footer>
  )
}
