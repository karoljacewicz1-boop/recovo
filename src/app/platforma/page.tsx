import Link from 'next/link'
import type { Metadata } from 'next'
import { LanguageProvider } from '@/lib/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Recovo Inspect — SaaS do gradingu zwrotów w Twoim magazynie',
  description:
    'Aplikacja mobilna dla pracowników, AI grading, dashboard real-time. Uruchom grading zwrotów u siebie w 5 minut. Od 9 $/mies.',
}

const FEATURES = [
  {
    icon: 'phone',
    title: 'Aplikacja mobilna dla pracowników',
    desc: 'Twoi pracownicy logują się PIN-em na telefonie lub tablecie, skanują kod kreskowy i robią zdjęcia. Interfejs zaprojektowany pod magazyn — duże przyciski, offline mode.',
  },
  {
    icon: 'ai',
    title: 'AI grading z Anthropic Claude',
    desc: 'AI analizuje zdjęcia produktu i kategoryzuje stan: A (jak nowy), B (drobna wada), C (uszkodzony), D (utylizacja). Spójne oceny bez subiektywnego osądu człowieka.',
  },
  {
    icon: 'barcode',
    title: 'Skanowanie barcode',
    desc: 'EAN, UPC, QR — automatyczne rozpoznawanie SKU. Integracja z Twoim ERP lub plikiem CSV. Każdy produkt ma cyfrową historię.',
  },
  {
    icon: 'dashboard',
    title: 'Dashboard real-time',
    desc: 'Widzisz każdy zwrot w momencie zakończenia gradingu. Filtry po SKU, pracowniku, dacie, ocenie. Eksport do PDF lub CSV.',
  },
  {
    icon: 'recommerce',
    title: 'Click-to-Recommerce',
    desc: 'Zaznaczasz Grade B/C i jednym kliknięciem oddajesz towar do naszego kanału sprzedaży. Towar fizycznie przechodzi do nas, my listujemy i sprzedajemy.',
  },
  {
    icon: 'team',
    title: 'Zarządzanie zespołem',
    desc: 'Dodajesz pracowników, wystawiasz PIN-y, widzisz statystyki: ile sztuk dziennie, jaki rozkład ocen, jaki czas gradingu per osoba.',
  },
] as const

const PLANS_PREVIEW = [
  { name: 'Starter', price: '$9', limit: '1 pracownik · 50 inspekcji/mies', best: 'Małe sklepy, freelancerzy, test na magazynie' },
  { name: 'Growth', price: '$49', limit: '3 pracowników · 200 inspekcji/mies', best: 'Rosnące e-commerce i 3PL', highlight: true },
  { name: 'Scale', price: 'Indywidualnie', limit: 'Nielimitowane + integracje', best: 'Enterprise, marki z wysokim wolumenem' },
] as const

export default function PlatformaPage() {
  return (
    <LanguageProvider>
      <Navbar />

      <main className="bg-[#FAFAFA]">
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-5">
              <span className="w-8 h-px bg-[#E8512A]" />
              Recovo Inspect · SaaS
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-[#1A1A1A] leading-[1.05] tracking-tight mb-6">
              Graduj zwroty{' '}
              <span className="text-[#E8512A]">u siebie w magazynie.</span>{' '}
              Z AI.
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mb-8">
              Aplikacja mobilna dla pracowników, AI analizujące zdjęcia, dashboard z
              analityką. Uruchomisz grading u siebie w 5 minut — bez integracji z ERP, bez
              dedykowanego hardware&apos;u.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="bg-[#E8512A] text-white font-semibold px-7 py-4 rounded-xl hover:bg-[#D4431F] transition-colors text-center"
              >
                Zacznij trial za darmo
              </Link>
              <Link
                href="/pricing"
                className="border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold px-7 py-4 rounded-xl hover:bg-[#1A1A1A] hover:text-white transition-colors text-center"
              >
                Zobacz cennik
              </Link>
            </div>
            <p className="mt-5 text-sm text-gray-500 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#E8512A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              14 dni trial · bez karty kredytowej · anulujesz w każdej chwili
            </p>
          </div>
        </section>

        {/* Features grid */}
        <section className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-14">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-4">
                Funkcje
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-5">
                Wszystko, czego potrzebujesz, żeby gradować u siebie
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Nie musisz kupować dodatkowego sprzętu ani integrować się z systemem ERP.
                Inspect działa na każdym smartfonie i tablecie z kamerą.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f) => (
                <div key={f.title} className="bg-white rounded-2xl p-7 border border-gray-100">
                  <div className="w-11 h-11 rounded-xl bg-[#FFF3EF] flex items-center justify-center mb-5">
                    <svg className="w-5 h-5 text-[#E8512A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {f.icon === 'phone' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      )}
                      {f.icon === 'ai' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      )}
                      {f.icon === 'barcode' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16M8 4v16M12 4v4m0 4v8M16 4v16M20 4v16" />
                      )}
                      {f.icon === 'dashboard' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z" />
                      )}
                      {f.icon === 'recommerce' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                      {f.icon === 'team' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      )}
                    </svg>
                  </div>
                  <h3 className="text-base font-extrabold text-[#1A1A1A] mb-2 tracking-tight">{f.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing preview */}
        <section className="py-20 md:py-28 bg-white border-y border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-4">
                Cennik Inspect
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-4">
                Trzy plany. Skalowalne.
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                SaaS model — płacisz miesięcznie za limit pracowników i inspekcji. Bez setup fee.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {PLANS_PREVIEW.map((p) => (
                <div
                  key={p.name}
                  className={`bg-[#FAFAFA] rounded-2xl p-7 border-2 ${
                    'highlight' in p && p.highlight ? 'border-[#E8512A]' : 'border-gray-100'
                  } flex flex-col`}
                >
                  <p className="text-sm font-bold text-[#1A1A1A] mb-2">{p.name}</p>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-3xl font-extrabold text-[#1A1A1A]">{p.price}</span>
                    {p.name !== 'Scale' && <span className="text-sm text-gray-500">/mies</span>}
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{p.limit}</p>
                  <p className="text-sm text-gray-700 mb-6 flex-1 leading-relaxed">{p.best}</p>
                  <Link
                    href="/pricing"
                    className="block text-center text-sm font-semibold text-[#E8512A] hover:text-[#D4431F]"
                  >
                    Szczegóły →
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
              Trial w 5 minut.
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Rejestracja → dodajesz pracowników → pracownicy logują się PIN-em → skanujesz pierwszy zwrot.
              Cały onboarding bez kontaktu z supportem.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="bg-[#E8512A] text-white font-semibold px-7 py-4 rounded-xl hover:bg-[#D4431F] transition-colors"
              >
                Zacznij trial
              </Link>
              <Link
                href="/recommerce"
                className="border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold px-7 py-4 rounded-xl hover:bg-[#1A1A1A] hover:text-white transition-colors"
              >
                Zobacz Recommerce →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </LanguageProvider>
  )
}
