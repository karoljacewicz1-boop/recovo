import Link from 'next/link'
import type { Metadata } from 'next'
import { LanguageProvider } from '@/lib/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Recovo dla marketplace — centralny grading zwrotów od sprzedawców',
  description:
    'Scentralizuj inspekcję zwrotów od wszystkich sprzedawców na Twoim marketplace. AI grading, weight-fraud detection, raporty PDF do rozliczenia reklamacji. White-label dostępny.',
}

const CHALLENGES = [
  {
    title: 'Dziesiątki sprzedawców, jeden standard jakości',
    desc: 'Każdy sprzedawca inaczej pakuje, inaczej opisuje stan. Klient końcowy oczekuje spójnej jakości od Twojej platformy.',
  },
  {
    title: 'Reklamacje „nie taki stan jak w ofercie"',
    desc: 'Bez dokumentacji foto i obiektywnej oceny reklamacje to Twoje słowo przeciw słowu sprzedawcy. Kosztowne i długie.',
  },
  {
    title: 'Fraud na wadze i zawartości paczek',
    desc: 'Klienci odsyłają paczki lżejsze niż wysłane lub z innym produktem. Bez systemu — nie udowodnisz.',
  },
  {
    title: 'Logistyka zwrotna bez kontroli kosztów',
    desc: 'Zwroty od multi-sellerów bez scentralizowanego punktu inspekcji mnożą koszty transportu i magazynowania.',
  },
] as const

const FEATURES = [
  {
    title: 'Scentralizowany punkt inspekcji',
    desc: 'Wszystkie zwroty z marketplace lądują u nas lub w Twoim magazynie. Jednolity flow: skan → foto → AI grading → raport.',
    icon: 'hub',
  },
  {
    title: 'Weight fraud detection',
    desc: 'System porównuje wagę przy wysyłce vs wagę przy zwrocie. Odchylenie powyżej progu → automatyczna flaga do weryfikacji.',
    icon: 'scale',
  },
  {
    title: 'Raport PDF per sztuka',
    desc: '5 zdjęć, waga, ocena A/B/C/D, wykryte defekty, timestamp. Dowód w sporze ze sprzedawcą lub klientem końcowym.',
    icon: 'doc',
  },
  {
    title: 'API integracja + webhooks',
    desc: 'Automatyczne ściąganie numerów zamówień, pushowanie wyników gradingu z powrotem do Twojego systemu. REST + webhooks.',
    icon: 'api',
  },
  {
    title: 'Multi-tenant per sprzedawca',
    desc: 'Każdy sprzedawca widzi tylko swoje zwroty. Ty jako operator marketplace masz widok agregujący wszystko.',
    icon: 'tenant',
  },
  {
    title: 'White-label dostępny',
    desc: 'Dashboard i raport PDF pod Twoim brandem. Sprzedawca nie widzi logo Recovo — widzi Twój marketplace.',
    icon: 'brand',
  },
] as const

const METRICS = [
  { value: '–60%', label: 'sporów reklamacyjnych dzięki dokumentacji foto' },
  { value: '48h', label: 'SLA od przyjęcia do raportu' },
  { value: 'API', label: 'integracja z Twoim panelem sprzedawcy' },
] as const

export default function DlaMarketplacePage() {
  return (
    <LanguageProvider>
      <Navbar />

      <main className="bg-[#FAFAFA]">
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-5">
              <span className="w-8 h-px bg-[#E8512A]" />
              Dla marketplace · Multi-seller · Platformy
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-[#1A1A1A] leading-[1.05] tracking-tight mb-6">
              Jeden standard gradingu{' '}
              <span className="text-[#E8512A]">dla każdego sprzedawcy.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mb-8">
              Marketplace'y tracą kontrolę jakości, gdy każdy sprzedawca inaczej obsługuje
              zwroty. Recovo daje Ci centralny punkt inspekcji z AI gradingiem,
              wykrywaniem fraudu i raportem PDF — integrowany przez API z Twoim panelem.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/kontakt"
                className="bg-[#E8512A] text-white font-semibold px-7 py-4 rounded-xl hover:bg-[#D4431F] transition-colors text-center"
              >
                Umów rozmowę techniczną
              </Link>
              <Link
                href="/platforma"
                className="border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold px-7 py-4 rounded-xl hover:bg-[#1A1A1A] hover:text-white transition-colors text-center"
              >
                Zobacz platformę
              </Link>
            </div>
          </div>
        </section>

        {/* Challenges */}
        <section className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-14">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-4">
                Wyzwania
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-5">
                Cztery problemy, które skalują się razem z Twoim GMV
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Im więcej sprzedawców na Twoim marketplace, tym większy bałagan ze zwrotami —
                o ile nie masz jednego systemu do grading i arbitrażu.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {CHALLENGES.map((c) => (
                <div key={c.title} className="bg-white rounded-2xl p-7 border border-gray-100">
                  <h3 className="text-base font-extrabold text-[#1A1A1A] mb-2 tracking-tight">{c.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 md:py-28 bg-white border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-14">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-4">
                Co dostajesz
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-5">
                Narzędzia dopasowane do modelu marketplace
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f) => (
                <div key={f.title} className="bg-[#FAFAFA] rounded-2xl p-7 border border-gray-100">
                  <div className="w-11 h-11 rounded-xl bg-[#FFF3EF] flex items-center justify-center mb-5">
                    <svg className="w-5 h-5 text-[#E8512A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {f.icon === 'hub' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      )}
                      {f.icon === 'scale' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      )}
                      {f.icon === 'doc' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      )}
                      {f.icon === 'api' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      )}
                      {f.icon === 'tenant' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      )}
                      {f.icon === 'brand' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
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
              Zacznij od pilota na 100 zwrotów.
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Ustalimy zakres integracji, wybieramy kategorie produktów do pilotu i w 2 tyg.
              masz pierwsze raporty z Twojego marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/kontakt"
                className="bg-[#E8512A] text-white font-semibold px-7 py-4 rounded-xl hover:bg-[#D4431F] transition-colors"
              >
                Umów rozmowę
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
