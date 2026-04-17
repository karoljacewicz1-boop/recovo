import Link from 'next/link'
import type { Metadata } from 'next'
import { LanguageProvider } from '@/lib/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Usługi Recovo — grading, recommerce, magazynowanie',
  description:
    'Cztery usługi Recovo: ocena i inspekcja, pełne przetwarzanie, sprzedaż komisowa na Allegro/eBay/OLX, magazynowanie. Wybierz, co pasuje do Twojego biznesu.',
}

const SERVICES = [
  {
    id: 'grading',
    tag: 'Ocena & Inspekcja',
    title: 'Grading A/B/C/D + pełna dokumentacja foto',
    forWhom:
      'Dla marek i sklepów, które chcą wiedzieć dokładnie, co wraca w zwrotach — bez outsourcowania dalszych decyzji.',
    price: '2,90 PLN',
    priceUnit: '/ sztuka',
    included: [
      'Przyjęcie paczki i rozpakowanie',
      '5 zdjęć na produkt (all sides, tag, defekty)',
      'Ocena A / B / C / D z AI',
      'Pisemny raport o stanie w PDF',
      '7 dni magazynowania w cenie',
      'Skonsolidowana przesyłka zwrotna',
    ],
    benefit: 'Zero zgadywania — pełen raport ze zdjęciami per sztuka',
    icon: '🔍',
  },
  {
    id: 'full',
    tag: 'Pełne przetwarzanie',
    title: 'Grading + relabeling + kitting + priorytet',
    forWhom:
      'Dla e-commerce z dużym wolumenem zwrotów, gdzie liczy się czas i gotowość towaru do ponownej sprzedaży.',
    price: '6,50 PLN',
    priceUnit: '/ sztuka',
    badge: 'Najpopularniejsze',
    included: [
      'Wszystko z Oceny & Inspekcji',
      'Relabeling (Twoje etykiety lub FNSKU)',
      'Kitting w zestawy',
      '14 dni magazynowania w cenie',
      'Priorytetowa kolejka realizacji (24h)',
      'Dedykowany opiekun konta',
    ],
    benefit: 'Towar wraca na stock gotowy do wysyłki — bez dodatkowej obróbki',
    icon: '📦',
  },
  {
    id: 'recommerce',
    tag: 'Sprzedaż komisowa',
    title: 'Recommerce na Allegro, eBay, OLX',
    forWhom:
      'Dla każdego, kto nie chce trzymać towaru z grade B/C w magazynie — wystawiamy, sprzedajemy, wysyłamy, rozliczamy.',
    price: '0 PLN',
    priceUnit: 'z góry · 25% prowizji',
    included: [
      '25% prowizji od ceny sprzedaży',
      'Zatrzymujesz 75% z każdej sprzedaży',
      'Listing na Allegro, eBay, OLX',
      'AI-generowane opisy i tytuły',
      'Obsługa komunikacji z kupującymi',
      'Miesięczny raport + przelew',
    ],
    benefit: 'Odzysk 60–80% wartości zamiast utylizacji lub dead-stocku',
    icon: '💰',
  },
  {
    id: 'warehousing',
    tag: 'Magazynowanie',
    title: 'Bezpieczne magazynowanie paletowe i półkowe',
    forWhom:
      'Dla marek, które potrzebują elastycznego magazynu w Polsce — z fulfillmentem na żądanie.',
    price: '2 PLN',
    priceUnit: '/ sztuka / miesiąc',
    included: [
      'Bezpieczne magazynowanie paletowe i półkowe',
      'Panel inwentaryzacyjny w czasie rzeczywistym',
      'Pick & pack na żądanie',
      'Wysyłka w ciągu 24h od zamówienia',
      'Ubezpieczenie w cenie',
      'Brak minimalnego okresu magazynowania',
    ],
    benefit: 'Magazyn w Polsce = niższe koszty + szybsza wysyłka do klientów PL',
    icon: '🏭',
  },
] as const

const FAQ = [
  {
    q: 'Czy mogę łączyć kilka usług?',
    a: 'Tak — to najczęstszy setup. Typowa kombinacja: pełne przetwarzanie (Grade A → odesłanie) + sprzedaż komisowa (Grade B/C → Allegro). Rozliczamy się per produkt.',
  },
  {
    q: 'Jak szybko wchodzę w pracę z Recovo?',
    a: 'Trial w 5 minut — rejestracja, ustawienie reguł gradingu, i już możesz przekierować adres zwrotów na nasz magazyn. Pierwsze zwroty obsługujemy tego samego dnia.',
  },
  {
    q: 'Co z produktami klasy D (do utylizacji)?',
    a: 'Rozliczamy ekologicznie i zgodnie z przepisami — recykling, donacja, utylizacja. Pełny certyfikat dla Twojej księgowości i ESG.',
  },
  {
    q: 'Czy działacie tylko w Polsce?',
    a: 'Magazyn w Wysogotowie (Poznań), ale obsługujemy marki z całej Europy. Klienci końcowi zwracają lokalnie w PL, my konsolidujemy i odsyłamy do UE.',
  },
  {
    q: 'Jak wygląda rozliczenie ze sprzedaży komisowej?',
    a: 'Co miesiąc: raport sprzedaży (co, kiedy, za ile) + przelew 75% wartości sprzedaży. Prowizja 25% pokrywa wystawienie, komunikację, pakowanie i wysyłkę.',
  },
] as const

export default function UslugiPage() {
  return (
    <LanguageProvider>
      <Navbar />

      <main className="bg-[#FAFAFA]">
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 bg-[#FFF3EF] text-[#E8512A] text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
              Dodatkowa opcja do Recovo SaaS
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-[#1A1A1A] leading-[1.05] tracking-tight mb-6">
              Nie masz magazynu?{' '}
              <span className="text-[#E8512A]">Zrobimy to za Ciebie.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mb-8">
              Fulfillment to dodatkowa opcja dla marek, które nie chcą (albo nie mają gdzie)
              robić gradingu u siebie. Wysyłasz zwroty do naszego magazynu w Wysogotowie, my
              przejmujemy cały proces: grading, magazynowanie, recommerce, odsyłanie.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <Link
                href="/#use-cases"
                className="text-sm text-gray-500 hover:text-[#E8512A] transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Wolisz grading u siebie? Zobacz Recovo Inspect (SaaS)
              </Link>
            </div>
          </div>
        </section>

        {/* Services cards */}
        <section className="py-20 md:py-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="space-y-6">
              {SERVICES.map((s) => (
                <div
                  key={s.id}
                  id={s.id}
                  className={`bg-white rounded-2xl p-8 md:p-10 border-2 grid md:grid-cols-[1fr_1fr] gap-10 ${
                    'badge' in s && s.badge ? 'border-[#E8512A]' : 'border-gray-100'
                  } relative`}
                >
                  {'badge' in s && s.badge && (
                    <div className="absolute -top-3 left-8 bg-[#E8512A] text-white text-xs font-bold px-3 py-1 rounded-full">
                      {s.badge}
                    </div>
                  )}

                  {/* Left: title + for whom + benefit */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{s.icon}</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#E8512A]">
                        {s.tag}
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] mb-4 tracking-tight leading-tight">
                      {s.title}
                    </h2>

                    <div className="mb-6">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Dla kogo
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">{s.forWhom}</p>
                    </div>

                    <div className="bg-[#FFF3EF] rounded-xl p-4 border border-[#E8512A]/20">
                      <p className="text-xs font-bold text-[#E8512A] uppercase tracking-wider mb-1">
                        Benefit
                      </p>
                      <p className="text-sm text-[#1A1A1A] font-medium">{s.benefit}</p>
                    </div>
                  </div>

                  {/* Right: price + included */}
                  <div className="flex flex-col">
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Cena
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold text-[#1A1A1A]">
                          od {s.price}
                        </span>
                        <span className="text-sm text-gray-500">{s.priceUnit}</span>
                      </div>
                    </div>

                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                      Co zawiera
                    </p>
                    <ul className="space-y-2 mb-6 flex-1">
                      {s.included.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
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
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/register"
                      className="bg-[#1A1A1A] text-white font-semibold px-5 py-3 rounded-xl hover:bg-gray-800 transition-colors text-center text-sm"
                    >
                      Wypróbuj tę usługę →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison teaser */}
        <section className="py-16 bg-[#1A1A1A]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#E8512A] mb-3">
              Porównanie planów
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-5 max-w-2xl mx-auto">
              Kup Recovo jako SaaS albo płać za sztukę — jak Ci wygodniej.
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Trial, Starter, Growth i Scale — plany dopasowane do wolumenu zwrotów.
            </p>
            <Link
              href="/pricing"
              className="inline-block bg-[#E8512A] text-white font-semibold px-7 py-4 rounded-xl hover:bg-[#D4431F] transition-colors"
            >
              Zobacz cennik SaaS →
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-4">
                FAQ
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight">
                Najczęstsze pytania
              </h2>
            </div>

            <div className="space-y-4">
              {FAQ.map((f) => (
                <details
                  key={f.q}
                  className="group bg-white rounded-xl border border-gray-100 open:border-[#E8512A]/30 transition-colors"
                >
                  <summary className="flex items-center justify-between gap-4 cursor-pointer px-6 py-5 list-none">
                    <span className="text-sm md:text-base font-bold text-[#1A1A1A]">
                      {f.q}
                    </span>
                    <svg
                      className="w-4 h-4 text-[#E8512A] flex-shrink-0 transition-transform group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">
                    {f.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="pb-20 md:pb-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <div className="bg-white rounded-2xl border border-gray-100 p-10 md:p-14">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-4">
                Nie wiesz, która usługa pasuje?
              </h2>
              <p className="text-gray-600 mb-7 leading-relaxed">
                15 minut rozmowy — opowiesz o wolumenie zwrotów, my zaproponujemy setup.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/register"
                  className="bg-[#E8512A] text-white font-semibold px-7 py-4 rounded-xl hover:bg-[#D4431F] transition-colors"
                >
                  Zacznij trial
                </Link>
                <Link
                  href="/#contact"
                  className="border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold px-7 py-4 rounded-xl hover:bg-[#1A1A1A] hover:text-white transition-colors"
                >
                  Porozmawiajmy →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </LanguageProvider>
  )
}
