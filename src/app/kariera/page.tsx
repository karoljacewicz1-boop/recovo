import Link from 'next/link'
import type { Metadata } from 'next'
import { LanguageProvider } from '@/lib/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Kariera w Recovo — dołącz do zespołu Returns & Recommerce',
  description:
    'Otwarte stanowiska w Recovo: engineering, operations, sprzedaż. Budujemy platformę SaaS + własny kanał recommerce. Warszawa + zdalnie.',
}

const OPENINGS = [
  {
    team: 'Engineering',
    title: 'Senior Full-Stack Engineer (Next.js + TypeScript)',
    location: 'Warszawa / zdalnie',
    type: 'Full-time',
    desc: 'Rozwijasz platformę SaaS (Next.js 14 App Router, TypeScript, Supabase). Prowadzisz decyzje architektoniczne, mentorujesz zespół.',
  },
  {
    team: 'Engineering',
    title: 'AI/ML Engineer — grading & listing generation',
    location: 'Warszawa / zdalnie',
    type: 'Full-time',
    desc: 'Tuningujesz pipeline AI grading (Anthropic Claude) i automatyczną generację opisów listingów. Eval harness, prompt engineering, A/B tests.',
  },
  {
    team: 'Operations',
    title: 'Kierownik magazynu — recommerce & fulfillment',
    location: 'Warszawa',
    type: 'Full-time',
    desc: 'Prowadzisz magazyn 2 000 m², zespół 6-10 osób, SLA 48h. Odpowiadasz za processing, grading, wysyłki recommerce.',
  },
  {
    team: 'Operations',
    title: 'Pracownik magazynu — grading (2 zmiany)',
    location: 'Warszawa',
    type: 'Full-time',
    desc: 'Przyjmujesz zwroty, robisz grading z naszą aplikacją, pakujesz do wysyłki. Szkolenie w firmie.',
  },
  {
    team: 'Sales',
    title: 'Account Executive — D2C brands',
    location: 'Warszawa / zdalnie',
    type: 'Full-time',
    desc: 'Budujesz relacje z markami fashion/beauty, prowadzisz demo SaaS, zamykasz deale Growth i Scale. 70/30 base/commission.',
  },
] as const

const BENEFITS = [
  {
    title: 'Equity dla wszystkich',
    desc: 'Każdy pracownik etatowy ma ESOP. Budujesz wartość firmy = budujesz swoją.',
  },
  {
    title: 'Warszawa + remote',
    desc: 'Biuro w centrum Warszawy, ale większość stanowisk ma pełny remote lub hybrydę 2/3.',
  },
  {
    title: 'Budżet rozwojowy 5k PLN/rok',
    desc: 'Konferencje, kursy, książki — decydujesz. Bez długich procedur aprobaty.',
  },
  {
    title: 'MacBook Pro + wyposażenie',
    desc: 'Sprzęt Apple, zewnętrzny monitor 4K, fotel ergonomiczny w biurze. Remote — pokrywamy home office setup.',
  },
  {
    title: 'Prywatna opieka medyczna',
    desc: 'Medicover Premium dla Ciebie + 50% pakietu dla partnera/dziecka.',
  },
  {
    title: 'Mentorzy z branży',
    desc: 'Inwestorzy i advisory board pomagają całemu zespołowi — nie tylko founderom. Raz na miesiąc pitch day.',
  },
] as const

export default function KarieraPage() {
  return (
    <LanguageProvider>
      <Navbar />

      <main className="bg-[#FAFAFA]">
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-5">
              <span className="w-8 h-px bg-[#E8512A]" />
              Kariera w Recovo
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-[#1A1A1A] leading-[1.05] tracking-tight mb-6">
              Buduj z nami nową kategorię{' '}
              <span className="text-[#E8512A]">w e-commerce.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mb-8">
              Zamieniamy zwroty — największy ukryty koszt e-commerce — w mierzalny przychód.
              Szukamy osób, które chcą pracować nad czymś namacalnym i realnym, nie nad kolejnym
              klonem.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#openings"
                className="bg-[#E8512A] text-white font-semibold px-7 py-4 rounded-xl hover:bg-[#D4431F] transition-colors text-center"
              >
                Zobacz otwarte stanowiska
              </a>
              <Link
                href="/o-nas"
                className="border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold px-7 py-4 rounded-xl hover:bg-[#1A1A1A] hover:text-white transition-colors text-center"
              >
                Poznaj zespół →
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-14">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-4">
                Co oferujemy
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-5">
                Warunki, które mają znaczenie
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {BENEFITS.map((b) => (
                <div key={b.title} className="bg-white rounded-2xl p-7 border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF3EF] flex items-center justify-center mb-5">
                    <svg className="w-5 h-5 text-[#E8512A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-base font-extrabold text-[#1A1A1A] mb-2 tracking-tight">{b.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Openings */}
        <section id="openings" className="py-20 md:py-28 bg-white border-y border-gray-100 scroll-mt-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-12">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-4">
                Otwarte stanowiska
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-5">
                Aktualnie rekrutujemy
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Nie widzisz swojej roli? Napisz — regularnie otwieramy nowe.
              </p>
            </div>

            <div className="space-y-3">
              {OPENINGS.map((o, i) => (
                <div
                  key={i}
                  className="bg-[#FAFAFA] rounded-2xl p-6 md:p-7 border border-gray-100 hover:border-[#E8512A] transition-colors grid md:grid-cols-[1fr_auto] gap-4 md:gap-8 items-center"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-block bg-[#FFF3EF] text-[#E8512A] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                        {o.team}
                      </span>
                      <span className="text-xs text-gray-500">· {o.location} · {o.type}</span>
                    </div>
                    <h3 className="text-lg font-extrabold text-[#1A1A1A] tracking-tight mb-1.5">{o.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{o.desc}</p>
                  </div>
                  <Link
                    href={`/kontakt?role=${encodeURIComponent(o.title)}`}
                    className="whitespace-nowrap bg-[#1A1A1A] text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-[#E8512A] transition-colors text-center"
                  >
                    Aplikuj →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-5">
              Nie widzisz swojej roli?
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Napisz do nas nawet jeśli nie mamy otwartego ogłoszenia — regularnie otwieramy nowe
              pozycje i chętnie poznajemy ludzi, którzy chcą pracować przy returns i recommerce.
            </p>
            <Link
              href="/kontakt"
              className="inline-block bg-[#E8512A] text-white font-semibold px-7 py-4 rounded-xl hover:bg-[#D4431F] transition-colors"
            >
              Napisz do nas
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </LanguageProvider>
  )
}
