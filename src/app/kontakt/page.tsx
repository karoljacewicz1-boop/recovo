'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LanguageProvider } from '@/lib/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

type Topic = 'saas' | 'recommerce' | 'fulfillment' | '3pl' | 'other'

const TOPICS: { value: Topic; label: string }[] = [
  { value: 'saas', label: 'Recovo Inspect (SaaS) — trial / demo' },
  { value: 'recommerce', label: 'Recommerce — oddaj nam towar do sprzedaży' },
  { value: 'fulfillment', label: 'Fulfillment — obsługa zwrotów u nas' },
  { value: '3pl', label: 'Partnerstwo 3PL / white-label' },
  { value: 'other', label: 'Coś innego' },
]

export default function KontaktPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    topic: 'saas' as Topic,
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    // TODO: wire to contact backend / email
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
      setForm({ name: '', email: '', company: '', topic: 'saas', message: '' })
    }, 600)
  }

  return (
    <LanguageProvider>
      <Navbar />

      <main className="bg-[#FAFAFA]">
        {/* Hero */}
        <section className="pt-32 pb-12 md:pt-40 md:pb-16 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-5">
              <span className="w-8 h-px bg-[#E8512A]" />
              Kontakt
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#1A1A1A] leading-[1.05] tracking-tight mb-6">
              Napisz do nas.{' '}
              <span className="text-[#E8512A]">Odpowiadamy w 24h.</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
              Odpowiemy w dzień roboczy. Jeżeli chcesz od razu zobaczyć produkt — zacznij trial
              SaaS na <Link href="/register" className="text-[#E8512A] hover:underline font-semibold">/register</Link>.
            </p>
          </div>
        </section>

        {/* Form + sidebar */}
        <section className="py-20 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-[1.4fr_1fr] gap-10 md:gap-14">
              {/* Form */}
              <div className="bg-white rounded-2xl p-7 md:p-10 border border-gray-100">
                {submitted ? (
                  <div className="py-16 text-center">
                    <div className="w-14 h-14 rounded-full bg-[#ECFDF5] flex items-center justify-center mx-auto mb-5">
                      <svg className="w-7 h-7 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">
                      Dzięki, wiadomość doszła.
                    </h2>
                    <p className="text-base text-gray-600 leading-relaxed max-w-md mx-auto">
                      Odezwiemy się na podany email w ciągu 24 godzin (dni robocze).
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-6 text-sm font-semibold text-[#E8512A] hover:text-[#D4431F]"
                    >
                      Wyślij kolejną wiadomość →
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-2">
                          Imię i nazwisko
                        </label>
                        <input
                          id="name"
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#E8512A] transition-colors"
                          placeholder="Jan Kowalski"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-2">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#E8512A] transition-colors"
                          placeholder="jan@firma.pl"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-2">
                        Firma
                      </label>
                      <input
                        id="company"
                        type="text"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#E8512A] transition-colors"
                        placeholder="Nazwa marki lub spółki"
                      />
                    </div>
                    <div>
                      <label htmlFor="topic" className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-2">
                        Czego dotyczy zapytanie?
                      </label>
                      <select
                        id="topic"
                        value={form.topic}
                        onChange={(e) => setForm({ ...form, topic: e.target.value as Topic })}
                        className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#E8512A] transition-colors"
                      >
                        {TOPICS.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-2">
                        Wiadomość
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#E8512A] transition-colors resize-none"
                        placeholder="Kilka słów o skali zwrotów, kategoriach produktowych, oczekiwaniach…"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto bg-[#E8512A] text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-[#D4431F] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Wysyłanie…' : 'Wyślij wiadomość'}
                    </button>
                  </form>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-7 border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF3EF] flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-[#E8512A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">E-mail</p>
                  <a href="mailto:hello@recovo.com.pl" className="text-base font-semibold text-[#1A1A1A] hover:text-[#E8512A] transition-colors">
                    hello@recovo.com.pl
                  </a>
                </div>

                <div className="bg-white rounded-2xl p-7 border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF3EF] flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-[#E8512A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Magazyn + biuro</p>
                  <p className="text-base font-semibold text-[#1A1A1A] leading-relaxed">
                    Recovo sp. z o.o.<br />
                    ul. Przykładowa 12<br />
                    00-001 Warszawa
                  </p>
                </div>

                <div className="bg-[#1A1A1A] rounded-2xl p-7">
                  <p className="text-xs font-bold text-[#E8512A] uppercase tracking-widest mb-3">Wolisz self-service?</p>
                  <p className="text-sm text-gray-300 leading-relaxed mb-5">
                    Rejestracja w SaaS i pierwszy grading w 5 minut — bez rozmowy z handlowcem.
                  </p>
                  <Link
                    href="/register"
                    className="inline-block bg-[#E8512A] text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-[#D4431F] transition-colors"
                  >
                    Zacznij trial →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </LanguageProvider>
  )
}
