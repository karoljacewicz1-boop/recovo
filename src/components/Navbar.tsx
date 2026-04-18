'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/LanguageContext'

type DropdownKey = 'product' | 'forWhom' | 'resources' | 'about' | null

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null)
  const [scrolled, setScrolled] = useState(false)
  const { t } = useLang()
  const n = t.nav
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
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
        { label: n.resourcesLinks.calculator, href: '/#roi' },
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
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,border-color] duration-base ease-emil ${
        scrolled
          ? 'bg-bg/85 backdrop-blur border-b border-border'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-content mx-auto px-6 flex items-center h-16">
        {/* Wordmark — engineered, not cute. Mark + tight wordmark. */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <span
            aria-hidden
            className="inline-block w-2.5 h-2.5 bg-accent transition-transform duration-micro ease-emil group-hover:rotate-45"
          />
          <span className="text-lg font-bold tracking-[-0.02em] text-ink">
            Recovo
          </span>
          <span className="hidden sm:inline-block mono text-[10px] text-ink-mute uppercase tracking-[0.14em] border border-border px-1.5 py-px ml-1">
            v2
          </span>
        </Link>

        {/* Desktop nav — centered, but left-leaning, single-row */}
        <div className="hidden md:flex items-center gap-0 ml-10">
          {dropdowns.map((d) => (
            <div
              key={d.key}
              className="relative"
              onMouseEnter={() => handleEnter(d.key)}
              onMouseLeave={handleLeave}
            >
              <button
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors duration-micro ease-emil ${
                  openDropdown === d.key
                    ? 'text-accent'
                    : 'text-ink hover:text-accent'
                }`}
                aria-expanded={openDropdown === d.key}
              >
                {d.label}
                <svg
                  className={`w-2.5 h-2.5 transition-transform duration-micro ease-emil ${
                    openDropdown === d.key ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openDropdown === d.key && (
                <div className="absolute top-full left-0 pt-1 min-w-[240px]">
                  {/* Sharp card — 2px radius, real border, no shadow pillow */}
                  <div className="bg-bg border border-border py-1 shadow-[0_8px_24px_-12px_oklch(20%_0.02_60_/_0.12)]">
                    {d.items.map((item, i) => (
                      <Link
                        key={item.href + item.label}
                        href={item.href}
                        className="group/item flex items-center justify-between px-4 py-2.5 text-sm text-ink hover:bg-surface transition-colors duration-micro ease-emil"
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="mono text-[10px] text-ink-mute group-hover/item:text-accent tabular-nums">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="group-hover/item:text-accent">{item.label}</span>
                        </span>
                        <span className="mono text-ink-mute group-hover/item:text-accent transition-transform duration-micro ease-emil group-hover/item:translate-x-0.5">
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right: login + primary CTA */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          <Link
            href="/login"
            className="text-sm font-medium text-ink hover:text-accent transition-colors duration-micro ease-emil px-3 py-2"
          >
            {n.ctaLogin}
          </Link>
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 bg-ink text-carbon-ink text-sm font-medium px-4 py-2.5 transition-colors duration-micro ease-emil hover:bg-accent"
          >
            {n.cta}
            <span className="mono transition-transform duration-micro ease-emil group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 ml-auto"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-ink mb-1.5 transition-transform duration-micro ease-emil ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-5 h-px bg-ink mb-1.5 transition-opacity duration-micro ease-emil ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-ink transition-transform duration-micro ease-emil ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-bg border-t border-border px-6 py-8 flex flex-col gap-8 max-h-[80vh] overflow-y-auto">
          {dropdowns.map((d) => (
            <div key={d.key} className="flex flex-col gap-3">
              <p className="label">{d.label}</p>
              <div className="flex flex-col">
                {d.items.map((item, i) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 py-2 text-sm font-medium text-ink hover:text-accent"
                  >
                    <span className="mono text-[10px] text-ink-mute tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-2 pt-6 border-t border-border">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-ink py-3 text-center"
            >
              {n.ctaLogin}
            </Link>
            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="bg-ink text-carbon-ink text-sm font-medium px-5 py-3 text-center hover:bg-accent transition-colors duration-micro ease-emil"
            >
              {n.cta} →
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
