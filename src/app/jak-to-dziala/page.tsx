import Link from 'next/link'
import type { Metadata } from 'next'
import { LanguageProvider } from '@/lib/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Jak działa Recovo — proces obsługi zwrotów od A do Z',
  description:
    'Pełny proces Recovo: od przyjęcia zwrotu, przez AI grading i dokumentację, po decyzję klienta i realizację. Wszystko w 48 godzin.',
}

const STEPS = [
  {
    num: '01',
    title: 'Zwroty trafiają do naszego magazynu',
    lead: 'Twoi klienci zwracają lokalnie — InPost, DPD, kurier. My przyjmujemy każdą paczkę i rejestrujemy ją w systemie w ciągu 24 godzin.',
    bullets: [
      'Lokalny polski adres do zwrotów (bez transgranicznych opłat)',
      'Automatyczne powiadomienia o każdej nowej paczce',
      'Zabezpieczenie i dokumentacja wejścia',
      'Skanowanie kodu kreskowego — każdy produkt trafia do Twojego panelu',
    ],
    metric: '< 24h',
    metricLabel: 'od dostawy do rejestracji',
  },
  {
    num: '02',
    title: 'AI grading + dokumentacja foto',
    lead: 'Każdy produkt jest fotografowany (5 zdjęć) i oceniany przez AI. Zamiast subiektywnej oceny człowieka — spójny, udokumentowany proces.',
    bullets: [
      '5 zdjęć na produkt (all sides + tag + defekty)',
      'AI opisuje kategorię uszkodzenia: A (jak nowy), B (drobna wada), C (uszkodzony), D (utylizacja)',
      'Pełny raport PDF ze zdjęciami — bez domysłów',
      'Czas gradingu: 3× szybszy niż manualny',
    ],
    metric: '3×',
    metricLabel: 'szybszy grading niż manualny',
  },
  {
    num: '03',
    title: 'Ty decydujesz — per SKU albo per grade',
    lead: 'W panelu klienta widzisz każdy produkt z oceną i zdjęciami. Ustawiasz reguły (np. "wszystkie A odsyłaj, B/C na Allegro") albo decydujesz per sztuka.',
    bullets: [
      'Panel klienta real-time — widzisz każdy zwrot natychmiast',
      'Reguły globalne albo decyzje case-by-case',
      'Cztery opcje: odesłanie, magazyn, recommerce, utylizacja',
      'Pełna kontrola — zero czarnej skrzynki',
    ],
    metric: '100%',
    metricLabel: 'transparentność procesu',
  },
  {
    num: '04',
    title: 'My realizujemy, Ty odzyskujesz kapitał',
    lead: 'Odsyłamy, magazynujemy albo sprzedajemy na Allegro/eBay/OLX — zgodnie z Twoją decyzją. Pieniądze wracają do Ciebie co miesiąc.',
    bullets: [
      'Skonsolidowana wysyłka Grade A do Twojego magazynu w UE',
      'Sprzedaż komisowa Grade B/C — 75% dla Ciebie, 25% prowizja',
      'Elastyczne magazynowanie (krótko- lub długoterminowe)',
      'Miesięczny raport + przelew za sprzedane sztuki',
    ],
    metric: '60–80%',
    metricLabel: 'odzysk wartości na Grade B/C',
  },
] as const

const TECH = [
  {
    title: 'AI grading z Anthropic Claude',
    desc: 'Model AI ocenia stan produktu ze zdjęć — kategoryzuje uszkodzenia, generuje opis sprzedażowy, sugeruje cenę rynkową.',
  },
  {
    title: 'Skanowanie kodów kreskowych',
    desc: 'Każdy produkt skanowany przy wejściu (EAN/UPC). Automatyczne rozpoznawanie SKU, bez manualnej identyfikacji.',
  },
  {
    title: 'Raporty PDF + panel real-time',
    desc: 'Natychmiastowy dostęp do danych. Eksport raportów dla księgowości, insights o topowych kategoriach zwrotów.',
  },
  {
    title: 'Własny kanał recommerce',
    desc: 'Wystawiamy na Allegro, eBay, OLX — sami zarządzamy aukcjami, odpowiadamy na pytania, pakujemy i wysyłamy.',
  },
] as const

export default function JakToDzialaPage() {
  return (
    <LanguageProvider>
      <Navbar />

      <main className="bg-[#FAFAFA]">
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-5">
              <span className="w-8 h-px bg-[#E8512A]" />
              Proces
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-[#1A1A1A] leading-[1.05] tracking-tight mb-6">
              Od zwrotu do odzyskanej wartości{' '}
              <span className="text-[#E8512A]">w 48 godzin.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl">
              Cały proces jest zaprojektowany żeby minimalizować czas, maksymalizować
              odzysk wartości i dawać Ci pełną transparentność. Poniżej krok po kroku —
              od przyjęcia paczki po wypłatę za sprzedany towar.
            </p>
          </div>
        </section>

        {/* Steps timeline */}
        <section className="py-20 md:py-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="space-y-8 md:space-y-12">
              {STEPS.map((step) => (
                <div
                  key={step.num}
                  className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 bg-white rounded-2xl p-8 md:p-10 border border-gray-100"
                >
                  <div className="flex flex-col items-start md:items-center md:w-32">
                    <span className="text-5xl md:text-6xl font-extrabold text-[#E8512A] leading-none">
                      {step.num}
                    </span>
                    <div className="hidden md:block w-px h-12 bg-gradient-to-b from-[#E8512A] to-transparent mt-4" />
                  </div>

                  <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight leading-tight">
                      {step.title}
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6">
                      {step.lead}
                    </p>

                    <ul className="grid sm:grid-cols-2 gap-3 mb-6">
                      {step.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-gray-700">
                          <svg
                            className="w-4 h-4 text-[#E8512A] flex-shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="inline-flex items-baseline gap-2 bg-[#FFF3EF] text-[#E8512A] rounded-full px-4 py-2">
                      <span className="text-lg font-extrabold">{step.metric}</span>
                      <span className="text-xs font-medium uppercase tracking-wider">
                        {step.metricLabel}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech stack */}
        <section className="py-20 md:py-28 bg-white border-y border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-12">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-4">
                Technologia
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-5">
                Co siedzi pod maską
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Nie jesteśmy klasyczną logistyką. Recovo to software-first operacja — AI,
                automatyzacja i pełna digitalizacja każdego produktu.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {TECH.map((item) => (
                <div
                  key={item.title}
                  className="bg-[#FAFAFA] rounded-2xl p-7 border border-gray-100"
                >
                  <h3 className="text-lg font-extrabold text-[#1A1A1A] mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SLA strip */}
        <section className="py-16 bg-[#1A1A1A]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid sm:grid-cols-3 gap-6 sm:gap-10 text-center sm:text-left">
              <div>
                <p className="text-4xl font-extrabold text-white mb-2">48h</p>
                <p className="text-sm text-gray-400">
                  Maksymalny czas od przyjęcia zwrotu do zakończenia gradingu
                </p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-white mb-2">5×</p>
                <p className="text-sm text-gray-400">
                  Zdjęć na produkt — pełna dokumentacja przed sprzedażą
                </p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-white mb-2">100%</p>
                <p className="text-sm text-gray-400">
                  Produktów ubezpieczonych i archiwizowanych cyfrowo
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-5">
              Gotowy zobaczyć to w akcji?
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              14 dni triala, bez karty kredytowej. Zobacz panel klienta i proces end-to-end.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="bg-[#E8512A] text-white font-semibold px-7 py-4 rounded-xl hover:bg-[#D4431F] transition-colors text-base"
              >
                Zacznij trial za darmo
              </Link>
              <Link
                href="/uslugi"
                className="border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold px-7 py-4 rounded-xl hover:bg-[#1A1A1A] hover:text-white transition-colors text-base"
              >
                Zobacz usługi →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </LanguageProvider>
  )
}
