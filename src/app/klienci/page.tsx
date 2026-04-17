import Link from 'next/link'
import type { Metadata } from 'next'
import { LanguageProvider } from '@/lib/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Klienci Recovo — marki i 3PL, które odzyskują wartość ze zwrotów',
  description:
    'Case studies i logotypy firm, które używają Recovo do gradingu zwrotów i recommerce. D2C brands, marketplace i partnerzy 3PL.',
}

const CASE_STUDIES = [
  {
    brand: 'Brand Fashion · D2C',
    title: 'Z 22% zwrotów odzyskali 68% wartości w 3 miesiące',
    metric: '+540k PLN',
    metricLabel: 'odzyskanych w Q1 2026',
    desc: 'Marka fashion premium z 8-letnim stażem wdrożyła Recovo Inspect na własnym magazynie + recommerce na Grade B/C. Grade A wraca na stock w 24h, Grade B/C idzie do nas pod neutralnym sprzedawcą.',
    tags: ['Recovo Inspect', 'Recommerce'],
  },
  {
    brand: 'Marketplace Beauty',
    title: '60% mniej sporów reklamacyjnych przez dokumentację foto',
    metric: '–60%',
    metricLabel: 'sporów reklamacyjnych Y/Y',
    desc: 'Marketplace multi-seller beauty wdrożył scentralizowany grading z weight fraud detection. Sprzedawcy i kupujący dostają raport PDF, spory rozwiązują się w 24h zamiast tygodnia.',
    tags: ['Marketplace', 'API integration'],
  },
  {
    brand: '3PL Operator',
    title: 'Zaoferowali grading jako value-added service dla 14 klientów',
    metric: '+27%',
    metricLabel: 'średniej faktury miesięcznej',
    desc: 'Partner 3PL z Warszawy wdrożył Recovo jako white-label dla swoich klientów-marek. Każdy klient dostaje branded dashboard i PDF, 3PL rozlicza grading per sztuka obok fulfillmentu.',
    tags: ['3PL', 'White-label', 'Multi-tenant'],
  },
] as const

const LOGOS = [
  'Brand Fashion', 'Beauty Co', 'Lifestyle+', 'Marketplace.pl',
  '3PL Warsaw', 'Fulfillment EU', 'OutdoorGear', 'SmartHome',
  'UrbanWear', 'NatureCosm', 'TechStore', 'PetShop',
] as const

export default function KlienciPage() {
  return (
    <LanguageProvider>
      <Navbar />

      <main className="bg-[#FAFAFA]">
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-5">
              <span className="w-8 h-px bg-[#E8512A]" />
              Klienci
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#1A1A1A] leading-[1.05] tracking-tight mb-6">
              Marki i 3PL, które odzyskują{' '}
              <span className="text-[#E8512A]">wartość ze zwrotów.</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
              Każdy z naszych klientów ma inną konfigurację — sam SaaS, SaaS + recommerce, pełny
              fulfillment, lub white-label dla swoich klientów. Oto jak to działa w praktyce.
            </p>
          </div>
        </section>

        {/* Logo wall */}
        <section className="py-14 md:py-20 bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-10">
              Nasi klienci · wybrani spośród 40+ marek i 12 partnerów 3PL
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {LOGOS.map((l) => (
                <div
                  key={l}
                  className="h-16 bg-[#FAFAFA] rounded-xl border border-gray-100 flex items-center justify-center"
                >
                  <span className="text-xs font-bold text-gray-400 tracking-wider">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case studies */}
        <section className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-14">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-4">
                Case studies
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-5">
                Trzy historie. Trzy modele.
              </h2>
            </div>

            <div className="space-y-5">
              {CASE_STUDIES.map((c) => (
                <div
                  key={c.title}
                  className="bg-white rounded-2xl p-7 md:p-10 border border-gray-100 grid md:grid-cols-[1fr_auto] gap-8 md:gap-10"
                >
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                      {c.brand}
                    </p>
                    <h3 className="text-xl md:text-2xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-4">
                      {c.title}
                    </h3>
                    <p className="text-base text-gray-600 leading-relaxed mb-5">
                      {c.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {c.tags.map((t) => (
                        <span
                          key={t}
                          className="inline-block bg-[#FFF3EF] text-[#E8512A] text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="md:w-[200px] md:border-l md:border-gray-100 md:pl-10 flex md:flex-col items-center md:items-start gap-3 md:gap-1">
                    <p className="text-4xl md:text-5xl font-extrabold text-[#E8512A] tracking-tight">
                      {c.metric}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">{c.metricLabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-[#1A1A1A]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight mb-5">
              Dołącz do grona 40+ marek.
            </h2>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              14 dni trial, bez karty. Zobacz rozkład Grade swoich pierwszych 20 zwrotów
              i policz, ile możesz odzyskać.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="bg-[#E8512A] text-white font-semibold px-7 py-4 rounded-xl hover:bg-[#D4431F] transition-colors"
              >
                Zacznij trial
              </Link>
              <Link
                href="/kontakt"
                className="border-2 border-white/30 text-white font-semibold px-7 py-4 rounded-xl hover:bg-white hover:text-[#1A1A1A] transition-colors"
              >
                Umów demo →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </LanguageProvider>
  )
}
