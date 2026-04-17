import Link from 'next/link'
import type { Metadata } from 'next'
import { LanguageProvider } from '@/lib/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Recovo dla marek D2C — grading zwrotów i recommerce bez utraty marży',
  description:
    'Marki fashion, beauty i lifestyle tracą 20–40% sprzedaży przez zwroty. Recovo zamienia Grade A → stock, a Grade B/C → przychód z recommerce, bez niszczenia wizerunku marki.',
}

const PAINS = [
  {
    title: '20–40% zwrotów w fashion i beauty',
    desc: 'Każdy zwrot to koszt: logistyka, obsługa, czas. Bez systemu grading większość ląduje jako dead-stock albo utylizacja.',
  },
  {
    title: 'Subiektywna ocena niszczy marżę',
    desc: 'Pracownik magazynu „na oko" ocenia towar inaczej niż pracownik obok. Brand traci Grade A sprzedawany jako outlet.',
  },
  {
    title: 'Brak widoczności — brak insightu produktowego',
    desc: 'Nie wiesz, który SKU wraca i dlaczego. Bez danych o defektach nie poprawisz produktu ani opisu na stronie.',
  },
  {
    title: 'Recommerce = ryzyko dla marki',
    desc: 'Sprzedaż B/C pod własnym brandem rozcieńcza pozycjonowanie premium. Trzeci kanał = utracona kontrola.',
  },
] as const

const SOLUTIONS = [
  {
    tag: '01',
    title: 'Obiektywny grading z AI',
    desc: 'AI Claude analizuje zdjęcia i kategoryzuje spójnie — A, B, C, D. Ten sam standard niezależnie od pracownika, zmiany, magazynu.',
    bullets: [
      'Rozkład Grade per SKU jako dashboard',
      'Automatyczne wykrywanie defektów',
      'Raport PDF ze zdjęciami per sztuka',
    ],
  },
  {
    tag: '02',
    title: 'Grade A — natychmiast z powrotem na stock',
    desc: 'Towar „jak nowy" wraca do sprzedaży w Twoim sklepie w 24h. Nie tracisz marży, nie wystawiasz jako outlet.',
    bullets: [
      'Relabeling i kitting w pakiecie',
      'FNSKU / EAN zachowane',
      'Priorytetowa kolejka 24h',
    ],
  },
  {
    tag: '03',
    title: 'Grade B/C — recommerce pod naszym kanałem',
    desc: 'Oddajesz towar Recovo, my sprzedajemy na Allegro/eBay/OLX pod neutralnym sprzedawcą. Twoja marka pozostaje premium.',
    bullets: [
      'Nie występujesz jako sprzedawca outletu',
      '75% przychodu do Ciebie, 25% dla nas',
      'Miesięczny raport + przelew',
    ],
  },
  {
    tag: '04',
    title: 'Dane, które poprawią Twój produkt',
    desc: 'Dashboard pokazuje, który SKU wraca najczęściej, z jakim defektem, z jakiego regionu. Marki używają tych danych do poprawy rozmiarówki, opisów, QC dostawcy.',
    bullets: [
      'Top 10 SKU z największym % zwrotów',
      'Najczęstsze przyczyny defektów',
      'Eksport do BI / ERP',
    ],
  },
] as const

const METRICS = [
  { value: '60–80%', label: 'odzyskanej wartości z każdego zwrotu' },
  { value: '48h', label: 'od przyjęcia do decyzji co dalej' },
  { value: '–35%', label: 'dead-stocku po 3 miesiącach' },
] as const

export default function DlaMarekPage() {
  return (
    <LanguageProvider>
      <Navbar />

      <main className="bg-[#FAFAFA]">
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-5">
              <span className="w-8 h-px bg-[#E8512A]" />
              Dla marek D2C · Fashion, Beauty, Lifestyle
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-[#1A1A1A] leading-[1.05] tracking-tight mb-6">
              Zwroty nie muszą{' '}
              <span className="text-[#E8512A]">niszczyć Twojej marży.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mb-8">
              Marki fashion i beauty tracą średnio 20–40% sprzedaży w zwrotach. Recovo
              zamienia ten problem w mierzalny przychód — Grade A wraca na stock, Grade B/C
              idzie do recommerce pod naszym kanałem, a Ty dostajesz dane produktowe na
              dashboardzie.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="bg-[#E8512A] text-white font-semibold px-7 py-4 rounded-xl hover:bg-[#D4431F] transition-colors text-center"
              >
                Zacznij trial za darmo
              </Link>
              <Link
                href="/kontakt"
                className="border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold px-7 py-4 rounded-xl hover:bg-[#1A1A1A] hover:text-white transition-colors text-center"
              >
                Umów demo 30 min
              </Link>
            </div>
          </div>
        </section>

        {/* Pains */}
        <section className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-14">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-4">
                Problem
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-5">
                Cztery rzeczy, które kosztują Twoją markę najwięcej
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Jeśli rozpoznajesz choć dwa z tych problemów, to znak, że zwroty zjadają
                Twoją marżę bardziej niż powinny.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {PAINS.map((p) => (
                <div key={p.title} className="bg-white rounded-2xl p-7 border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#DC2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#1A1A1A] mb-2 tracking-tight">{p.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions */}
        <section className="py-20 md:py-28 bg-white border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-14">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-4">
                Rozwiązanie
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-5">
                Cztery kroki. Zero chaosu.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Recovo nie zastępuje Twojego ERP ani sklepu. Wsuwa się pomiędzy „przyszedł
                zwrot" a „co z nim zrobić".
              </p>
            </div>

            <div className="space-y-5">
              {SOLUTIONS.map((s) => (
                <div
                  key={s.tag}
                  className="bg-[#FAFAFA] rounded-2xl p-7 md:p-10 border border-gray-100 grid md:grid-cols-[auto_1fr_auto] gap-6 md:gap-10 items-start"
                >
                  <div className="text-5xl font-extrabold text-[#E8512A] tracking-tighter leading-none">
                    {s.tag}
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">{s.title}</h3>
                    <p className="text-base text-gray-600 leading-relaxed">{s.desc}</p>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700 md:min-w-[260px]">
                    {s.bullets.map((b) => (
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
              Zobacz rozkład Grade swoich zwrotów.
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              14 dni trial. Wystarczy 20 pierwszych zwrotów, żeby zobaczyć jak wygląda Twój
              rozkład A/B/C/D — i ile realnie możesz odzyskać.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="bg-[#E8512A] text-white font-semibold px-7 py-4 rounded-xl hover:bg-[#D4431F] transition-colors"
              >
                Zacznij trial
              </Link>
              <Link
                href="/platforma"
                className="border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold px-7 py-4 rounded-xl hover:bg-[#1A1A1A] hover:text-white transition-colors"
              >
                Zobacz jak działa SaaS →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </LanguageProvider>
  )
}
