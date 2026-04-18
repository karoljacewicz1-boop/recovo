'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/LanguageContext'

/**
 * Footer — warm carbon section. Newsletter card, friendly columns,
 * rounded social buttons. No uptime strip, no column indexes.
 */
export default function Footer() {
  const { t } = useLang()
  const f = t.footer
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setEmail('')
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <footer className="relative bg-carbon text-carbon-ink">
      <div className="max-w-content mx-auto px-6 py-3xl">
        {/* Newsletter block */}
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-xl pb-2xl border-b border-carbon-line">
          <div>
            <p className="text-2xl md:text-3xl font-bold text-carbon-ink leading-[1.15] tracking-[-0.02em] mb-sm max-w-lg">
              {f.newsletterTitle}
            </p>
            <p className="text-sm text-carbon-ink/60 max-w-md leading-[1.6]">
              {f.newsletterSub}
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-end gap-2"
          >
            <div className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={f.newsletterPh}
                className="flex-1 bg-carbon-soft/40 border border-carbon-line text-carbon-ink placeholder:text-carbon-ink/40 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-accent transition-colors duration-micro ease-emil"
              />
              <button
                type="submit"
                className="group inline-flex items-center gap-1.5 bg-accent hover:bg-accent-deep text-carbon-ink text-sm font-semibold px-5 py-3 rounded-md transition-colors duration-micro ease-emil whitespace-nowrap"
              >
                {f.newsletterCta}
                <span className="transition-transform duration-micro ease-emil group-hover:translate-x-0.5">
                  →
                </span>
              </button>
            </div>
            {submitted && (
              <p className="text-xs text-accent">✓ Zapisano. Dzięki!</p>
            )}
          </form>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-lg md:gap-xl py-2xl">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-md group">
              <span
                aria-hidden
                className="inline-block w-2.5 h-2.5 rounded-sm bg-accent transition-transform duration-micro ease-emil group-hover:rotate-45"
              />
              <span className="text-lg font-bold tracking-[-0.02em] text-carbon-ink">
                Recovo
              </span>
            </Link>
            <p className="text-sm text-carbon-ink/60 leading-[1.6] mb-lg max-w-xs">
              {f.tagline}
            </p>
            <div className="flex gap-2">
              <SocialBtn href="https://linkedin.com" label="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </SocialBtn>
              <SocialBtn href="mailto:hello@recovo.com.pl" label="Email">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </SocialBtn>
            </div>
          </div>

          <FooterCol
            title={f.product}
            links={[
              { label: 'Recovo Inspect', href: '/platforma' },
              { label: f.productLinks.recommerce, href: '/recommerce' },
              { label: 'Fulfillment', href: '/uslugi' },
              { label: f.productLinks.howItWorks, href: '/jak-to-dziala' },
              { label: f.productLinks.pricing, href: '/pricing' },
            ]}
          />
          <FooterCol
            title={f.forWhom}
            links={[
              { label: f.forWhomLinks.brands, href: '/dla-marek' },
              { label: f.forWhomLinks.marketplaces, href: '/dla-marketplace' },
              { label: f.forWhomLinks.logistics, href: '/dla-3pl' },
            ]}
          />
          <FooterCol
            title={f.resources}
            links={[
              { label: f.resourcesLinks.blog, href: '/blog' },
              { label: f.resourcesLinks.calculator, href: '/#roi' },
              { label: f.resourcesLinks.faq, href: '/faq' },
              { label: f.resourcesLinks.clients, href: '/klienci' },
            ]}
          />
          <FooterCol
            title={f.company}
            links={[
              { label: f.companyLinks.about, href: '/o-nas' },
              { label: f.companyLinks.contact, href: '/kontakt' },
              { label: f.companyLinks.careers, href: '/kariera' },
            ]}
          />
        </div>

        {/* Bottom legal strip */}
        <div className="border-t border-carbon-line pt-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-carbon-ink/50">
          <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-6">
            <span>{f.copyright}</span>
            <span className="hidden md:inline text-carbon-ink/30">·</span>
            <span>{f.address}</span>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-carbon-ink transition-colors duration-micro ease-emil">
              {f.privacy}
            </Link>
            <Link href="/terms" className="hover:text-carbon-ink transition-colors duration-micro ease-emil">
              {f.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-carbon-ink mb-md">
        {title}
      </p>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link
              href={l.href}
              className="text-carbon-ink/60 hover:text-carbon-ink transition-colors duration-micro ease-emil"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SocialBtn({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 flex items-center justify-center rounded-md bg-carbon-soft/40 border border-carbon-line text-carbon-ink/70 hover:text-accent hover:border-accent transition-colors duration-micro ease-emil"
    >
      {children}
    </a>
  )
}
