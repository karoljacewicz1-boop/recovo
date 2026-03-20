'use client'

import { useState } from 'react'
import { useLang } from '@/lib/LanguageContext'
import type { Lang } from '@/lib/translations'

const LANGUAGES: Lang[] = ['EN', 'DE', 'PL']

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { lang, setLang, t } = useLang()
  const n = t.nav

  const NAV_LINKS = [
    { label: n.howItWorks, href: '#how-it-works' },
    { label: n.services,   href: '#services' },
    { label: n.pricing,    href: '#services' },
    { label: n.contact,    href: '#contact' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAFA] border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">
          Recovo
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href + link.label}
              href={link.href}
              className="text-sm font-medium text-[#1A1A1A] hover:text-[#E8512A] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side: lang toggle + CTA */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs font-medium">
            {LANGUAGES.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-1 rounded transition-colors ${
                  lang === l
                    ? 'bg-[#E8512A] text-white'
                    : 'text-gray-400 hover:text-[#1A1A1A]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <a
            href="#contact"
            className="bg-[#E8512A] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#d14420] transition-colors"
          >
            {n.cta}
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-0.5 bg-[#1A1A1A] mb-1" />
          <span className="block w-5 h-0.5 bg-[#1A1A1A] mb-1" />
          <span className="block w-5 h-0.5 bg-[#1A1A1A]" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#FAFAFA] border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href + link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-[#1A1A1A] hover:text-[#E8512A]"
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-1 text-xs font-medium">
            {LANGUAGES.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-1 rounded ${
                  lang === l ? 'bg-[#E8512A] text-white' : 'text-gray-400'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="bg-[#E8512A] text-white text-sm font-semibold px-5 py-2 rounded-lg text-center"
          >
            {n.cta}
          </a>
        </div>
      )}
    </nav>
  )
}
