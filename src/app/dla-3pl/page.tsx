import Link from 'next/link'
import type { Metadata } from 'next'
import { LanguageProvider } from '@/lib/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Recovo dla 3PL — grading zwrotów jako value-added service',
  description:
    'Zaoferuj swoim klientom (markom) grading zwrotów bez budowania systemu od zera. Multi-tenant SaaS Recovo, branded raport PDF per klient, rewenuy share lub fixed fee.',
}

const CONTEXT = [
  {
    title: 'Klienci oczekują gradingu. 3PL rzadko go oferuje.',
    desc: 'Marki chcą wiedzieć, co wraca w zwrotach i w jakim stanie. Brak tej usługi to argument do przeniesienia całego kontraktu do konkurencji.',
  },
  {
    title: 'Budowa własnego systemu = 6+ miesięcy i 200k+ PLN',
    desc: 'Aplikacja dla pracowników, dashboard, AI model, integracje. To produkt na 6 miesięcy pracy zespołu dev, a Ty chcesz po prostu obsługiwać klientów.',
  },
  {
    title: 'Standaryzacja między klientami = problem',
    desc: 'Klient A chce ocenę w skali 1-5, klient B w A/B/C/D, klient C własne etykiety. Bez systemu — zespół magazynu się gubi, oceny są niespójne.',
  },
] as const

const OFFER = [
  {
    tag: '01',
    title: 'Gotowa aplikacja dla Twojego zespołu',
    desc: 'Pracownicy logują się PIN-em na telefonie/tablecie, skanują barcode, robią zdjęcia. Działa offline. Nie potrzebujesz hardware poza smartfonem.',
    bullets: [
      'Onboarding pracownika: 15 min',
      'Offline mode',
      'PIN zamiast logowania email/password',
    ],
  },
  {
    tag: '02',
    title: 'AI grading — jeden standard dla wszystkich klientów',
    desc: 'Model AI Claude analizuje zdjęcia i przypisuje ocenę A/B/C/D według tych samych kryteriów. Klient A dostaje ten sam standard co klient B.',
    bullets: [
      'Spójność między zmianami, magazynami, pracownikami',
      'Możliwość customizacji kryteriów per klient',
      'Dowód AI decyzji w raporcie PDF',
    ],
  },
  {
    tag: '03',
    title: 'Multi-tenant — każdy klient swój dashboard',
    desc: 'Klient A loguje się i widzi tylko swoje SKU, swoje raporty, swoje analityki. Klient B analogicznie. Ty jako 3PL masz widok operatorski.',
    bullets: [
      'Slug-based URL per klient',
      'Branded raport PDF z logo klienta',
      'RLS w bazie — pełna izolacja danych',
    ],
  },
  {
    tag: '04',
    title: 'Model komercyjny: rewenu share lub fixed fee',
    desc: 'Możesz doliczać grading jako usługę per sztuka do faktury za fulfillment, albo zawrzeć abonament miesięczny. Recovo sprzedaje Ci SaaS — Ty sprzedajesz klientowi.',
    bullets: [
      'Partnerski pricing SaaS dla 3PL',
      'Rewenu share z recommerce channel',
      'White-label dostępny (Scale plan)',
    ],
  },
] as const

const METRICS = [
  { value: '15 min', label: 'onboarding nowego pracownika magazynu' },
  { value: '0 dev', label: 'zero linii kodu po Twojej stronie' },
  { value: '×N', label: 'klientów z jednej instancji' },
] as const

export default function Dla3plPage() {
  return (
    <LanguageProvider>
      <Navbar />

      <main className="bg-[#FAFAFA]">
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-5">
              <span className="w-8 h-px bg-[#E8512A]" />
              Dla 3PL · Operatorów magazynowych · Fulfillment
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-[#1A1A1A] leading-[1.05] tracking-tight mb-6">
              Zaoferuj grading zwrotów{' '}
              <span className="text-[#E8512A]">bez budowania systemu.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mb-8">
              Recovo to SaaS, który wdrożysz u siebie w 5 minut i odsprzedasz klientom jako
              value-added service. Multi-tenant, branded PDF, API do Twojego WMS.
              Miesięczny abonament albo per sztuka — jak wolisz.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/kontakt"
                className="bg-[#E8512A] text-white font-semibold px-7 py-4 rounded-xl hover:bg-[#D4431F] transition-colors text-center"
              >
                Umów rozmowę partnerską
              </Link>
              <Link
                href="/pricing"
                className="border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold px-7 py-4 rounded-xl hover:bg-[#1A1A1A] hover:text-white transition-colors text-center"
              >
                Zobacz cennik
              </Link>
            </div>
          </div>
        </section>

        {/* Context */}
        <section className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-14">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-4">
                Dlaczego to ma sens
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-5">
                Trzy powody, przez które 3PL tracą kontrakty
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {CONTEXT.map((c) => (
                <div key={c.title} className="bg-white rounded-2xl p-7 border border-gray-100">
                  <h3 className="text-base font-extrabold text-[#1A1A1A] mb-2 tracking-tight">{c.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Offer */}
        <section className="py-20 md:py-28 bg-white border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-14">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-4">
                Oferta partnerska
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-5">
                Cztery elementy. Wdrożenie w 2 tygodnie.
              </h2>
            </div>

            <div className="space-y-5">
              {OFFER.map((o) => (
                <div
                  key={o.tag}
                  className="bg-[#FAFAFA] rounded-2xl p-7 md:p-10 border border-gray-100 grid md:grid-cols-[auto_1fr_auto] gap-6 md:gap-10 items-start"
                >
                  <div className="text-5xl font-extrabold text-[#E8512A] tracking-tighter leading-none">
                    {o.tag}
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">{o.title}</h3>
                    <p className="text-base text-gray-600 leading-relaxed">{o.desc}</p>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700 md:min-w-[260px]">
                    {o.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-[#E8512A] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="py-16 md:py-20 bg-[#1A1A1A]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-3 gap-10 md:gap-6">
              {METRICS.map((m) => (
                <div key={m.label} className="text-center md:text-left">
                  <p className="text-4xl sm:text-5xl font-extrabold text-[#E8512A] tracking-tight mb-2">
                    {m.value}
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-5">
              Porozmawiajmy o partnerstwie.
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Ustalimy model rozliczeń (rewenu share vs fixed fee), zakres white-label i
              uruchomimy u Ciebie pilota na jednym z Twoich klientów.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/kontakt"
                className="bg-[#E8512A] text-white font-semibold px-7 py-4 rounded-xl hover:bg-[#D4431F] transition-colors"
              >
                Umów rozmowę
              </Link>
              <Link
                href="/platforma"
                className="border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold px-7 py-4 rounded-xl hover:bg-[#1A1A1A] hover:text-white transition-colors"
              >
                Zobacz platformę →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </LanguageProvider>
  )
}
