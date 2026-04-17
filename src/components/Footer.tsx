'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/LanguageContext'

export default function Footer() {
  const { t } = useLang()
  const f = t.footer
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    // TODO: wire to newsletter backend
    setSubmitted(true)
    setEmail('')
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <footer className="bg-[#111111] pt-20 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top row: newsletter */}
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 pb-14 border-b border-white/10">
          <div>
            <p className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-3">
              {f.newsletterTitle}
            </p>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              {f.newsletterSub}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col justify-center gap-3">
            <div className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={f.newsletterPh}
                className="flex-1 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8512A] transition-colors"
              />
              <button
                type="submit"
                className="bg-[#E8512A] text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-[#D4431F] transition-colors whitespace-nowrap"
              >
                {f.newsletterCta}
              </button>
            </div>
            {submitted && (
              <p className="text-xs text-green-400">✓ Zapisano. Dzięki!</p>
            )}
          </form>
        </div>

        {/* Middle: columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-14">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-2xl font-extrabold text-white tracking-tight inline-block mb-4">
              Recovo
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              {f.tagline}
            </p>
            <div className="flex gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-[#E8512A] text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="mailto:hello@recovo.com.pl"
                aria-label="Email"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-[#E8512A] text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-widest mb-5">
              {f.product}
            </p>
            <ul className="space-y-3 text-sm">
              <li><Link href="/platforma" className="text-gray-400 hover:text-white transition-colors">Recovo Inspect (SaaS)</Link></li>
              <li><Link href="/recommerce" className="text-gray-400 hover:text-white transition-colors">{f.productLinks.recommerce}</Link></li>
              <li><Link href="/uslugi" className="text-gray-400 hover:text-white transition-colors">Fulfillment</Link></li>
              <li><Link href="/jak-to-dziala" className="text-gray-400 hover:text-white transition-colors">{f.productLinks.howItWorks}</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">{f.productLinks.pricing}</Link></li>
            </ul>
          </div>

          {/* For who */}
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-widest mb-5">
              {f.forWhom}
            </p>
            <ul className="space-y-3 text-sm">
              <li><Link href="/dla-marek" className="text-gray-400 hover:text-white transition-colors">{f.forWhomLinks.brands}</Link></li>
              <li><Link href="/dla-marketplace" className="text-gray-400 hover:text-white transition-colors">{f.forWhomLinks.marketplaces}</Link></li>
              <li><Link href="/dla-3pl" className="text-gray-400 hover:text-white transition-colors">{f.forWhomLinks.logistics}</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-widest mb-5">
              {f.resources}
            </p>
            <ul className="space-y-3 text-sm">
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">{f.resourcesLinks.blog}</Link></li>
              <li><Link href="/#calculator" className="text-gray-400 hover:text-white transition-colors">{f.resourcesLinks.calculator}</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">{f.resourcesLinks.faq}</Link></li>
              <li><Link href="/klienci" className="text-gray-400 hover:text-white transition-colors">{f.resourcesLinks.clients}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-widest mb-5">
              {f.company}
            </p>
            <ul className="space-y-3 text-sm">
              <li><Link href="/o-nas" className="text-gray-400 hover:text-white transition-colors">{f.companyLinks.about}</Link></li>
              <li><Link href="/kontakt" className="text-gray-400 hover:text-white transition-colors">{f.companyLinks.contact}</Link></li>
              <li><Link href="/kariera" className="text-gray-400 hover:text-white transition-colors">{f.companyLinks.careers}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom: legal + address */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-gray-500">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <span>{f.copyright}</span>
            <span className="hidden md:inline text-gray-700">·</span>
            <span>{f.address}</span>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">{f.privacy}</Link>
            <Link href="/terms" className="hover:text-white transition-colors">{f.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
