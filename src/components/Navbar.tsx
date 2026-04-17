'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/LanguageContext'

type DropdownKey = 'product' | 'forWhom' | 'resources' | 'about' | null

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null)
  const { t } = useLang()
  const n = t.nav
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }
  }, [])

  function handleEnter(key: DropdownKey) {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenDropdown(key)
  }
  function handleLeave() {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120)
  }

  const dropdowns = [
    {
      key: 'product' as const,
      label: n.product,
      items: [
        { label: n.productLinks.inspect, href: '/platforma' },
        { label: n.productLinks.recommerce, href: '/recommerce' },
        { label: n.productLinks.fulfillment, href: '/uslugi' },
        { label: n.productLinks.howItWorks, href: '/jak-to-dziala' },
        { label: n.productLinks.pricing, href: '/pricing' },
      ],
    },
    {
      key: 'forWhom' as const,
      label: n.forWhom,
      items: [
        { label: n.forWhomLinks.brands, href: '/dla-marek' },
        { label: n.forWhomLinks.marketplaces, href: '/dla-marketplace' },
        { label: n.forWhomLinks.logistics, href: '/dla-3pl' },
      ],
    },
    {
      key: 'resources' as const,
      label: n.resources,
      items: [
        { label: n.resourcesLinks.blog, href: '/blog' },
        { label: n.resourcesLinks.calculator, href: '/#calculator' },
        { label: n.resourcesLinks.faq, href: '/faq' },
      ],
    },
    {
      key: 'about' as const,
      label: n.about,
      items: [
        { label: n.aboutLinks.about, href: '/o-nas' },
        { label: n.aboutLinks.clients, href: '/klienci' },
        { label: n.aboutLinks.contact, href: '/kontakt' },
      ],
    },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAFA]/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">
          Recovo
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {dropdowns.map((d) => (
            <div
              key={d.key}
              className="relative"
              onMouseEnter={() => handleEnter(d.key)}
              onMouseLeave={handleLeave}
            >
              <button
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  openDropdown === d.key
                    ? 'text-[#E8512A] bg-white'
                    : 'text-[#1A1A1A] hover:text-[#E8512A]'
                }`}
                aria-expanded={openDropdown === d.key}
              >
                {d.label}
                <svg
                  className={`w-3 h-3 transition-transform ${openDropdown === d.key ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openDropdown === d.key && (
                <div className="absolute top-full left-0 pt-2 min-w-[220px]">
                  <div className="bg-white border border-gray-100 rounded-xl shadow-lg py-2">
                    {d.items.map((item) => (
                      <Link
                        key={item.href + item.label}
                        href={item.href}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#FFF3EF] hover:text-[#E8512A] transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right side: Login + CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-[#1A1A1A] hover:text-[#E8512A] transition-colors px-3 py-2"
          >
            {n.ctaLogin}
          </Link>
          <Link
            href="/register"
            className="bg-[#E8512A] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#D4431F] transition-colors"
          >
            {n.cta}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-[#1A1A1A] mb-1 transition-transform ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`block w-5 h-0.5 bg-[#1A1A1A] mb-1 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-[#1A1A1A] transition-transform ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#FAFAFA] border-t border-gray-100 px-4 py-6 flex flex-col gap-5 max-h-[80vh] overflow-y-auto">
          {dropdowns.map((d) => (
            <div key={d.key} className="flex flex-col gap-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{d.label}</p>
              <div className="flex flex-col gap-1">
                {d.items.map((item) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium text-[#1A1A1A] hover:text-[#E8512A] py-1.5"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-[#1A1A1A] py-2 text-center"
            >
              {n.ctaLogin}
            </Link>
            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="bg-[#E8512A] text-white text-sm font-semibold px-5 py-3 rounded-xl text-center hover:bg-[#D4431F]"
            >
              {n.cta}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
