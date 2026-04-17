import Link from 'next/link'
import type { Metadata } from 'next'
import { LanguageProvider } from '@/lib/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'O Recovo — Returns & Recommerce expert dla e-commerce w Polsce',
  description:
    'Zamieniamy problem zwrotów w e-commerce w mierzalny przychód. Poznaj zespół, misję i standardy Recovo — SaaS do gradingu zwrotów + własny kanał recommerce.',
}

const VALUES = [
  {
    title: 'Mierzalny wynik, nie storytelling',
    desc: 'Każdy zwrot ma wartość w PLN. Dashboard pokazuje konkretną liczbę. Nie „poprawiamy procesy" — odzyskujemy pieniądze.',
  },
  {
    title: 'Pragmatyzm przed nowinkami',
    desc: 'Używamy AI tam, gdzie faktycznie pomaga (grading, opisy listingów). Nie wrzucamy ML do każdej decyzji, żeby było modnie.',
  },
  {
    title: 'Transparentność rozliczenia',
    desc: 'Model 75/25 jest w CRM, nie w drobnym druku. Klient widzi każdą sprzedaż w czasie rzeczywistym i dostaje przelew 10. dnia miesiąca.',
  },
  {
    title: 'ESG jako efekt uboczny',
    desc: 'Nie robimy recommerce „dla planety". Robimy, bo to najszybsza droga do zwrotu wartości. Mniej utylizacji to konsekwencja, nie cel PR-owy.',
  },
] as const

const STATS = [
  { value: '2024', label: 'Rok założenia' },
  { value: 'Warszawa', label: 'Siedziba + magazyn' },
  { value: '12', label: 'Osób w zespole' },
  { value: '10k+', label: 'Zwrotów przetworzonych miesięcznie' },
] as const

export default function ONasPage() {
  return (
    <LanguageProvider>
      <Navbar />

      <main className="bg-[#FAFAFA]">
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-5">
              <span className="w-8 h-px bg-[#E8512A]" />
              O Recovo
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-[#1A1A1A] leading-[1.05] tracking-tight mb-6">
              Zwroty to nie koszt.{' '}
              <span className="text-[#E8512A]">To stracona wartość.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl">
              Recovo powstało z obserwacji, że polski e-commerce traci rocznie setki milionów
              złotych, bo nie ma systemu do oceny i zagospodarowania zwróconego towaru. Budujemy
              platformę SaaS + własny kanał recommerce, żeby tę wartość odzyskać — dla marek,
              marketplace'ów i 3PL.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 md:py-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-[1fr_1.4fr] gap-10 md:gap-14">
              <div>
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-4">
                  Misja
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight">
                  Zamieniamy problem zwrotów w powtarzalny przychód.
                </h2>
              </div>
              <div className="space-y-5 text-lg text-gray-600 leading-relaxed">
                <p>
                  W fashion, beauty i lifestyle zwroty stanowią 20–40% sprzedaży. To skala, przy
                  której ręczne odpakowanie i „rzut okiem" na stan produktu przestaje działać — a
                  zaczyna realnie zjadać marżę.
                </p>
                <p>
                  Budujemy narzędzie, które w 48 godzin zamienia fizyczny zwrot w konkretną
                  decyzję: Grade A wraca na stock, Grade B/C idzie do naszego kanału recommerce,
                  Grade D — z pełną dokumentacją — do utylizacji lub charytatywnej dystrybucji.
                </p>
                <p>
                  Jesteśmy neutralnym operatorem sprzedaży wtórnej, więc sprzedawanie Twojego
                  towaru pod naszą stopką na Allegro/eBay/OLX nie rozcieńcza Twojej marki.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 md:py-28 bg-white border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-14">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-4">
                Jak pracujemy
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-5">
                Cztery zasady, które widać w produkcie
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {VALUES.map((v) => (
                <div key={v.title} className="bg-[#FAFAFA] rounded-2xl p-7 border border-gray-100">
                  <h3 className="text-lg font-extrabold text-[#1A1A1A] mb-3 tracking-tight">{v.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 md:py-20 bg-[#1A1A1A]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
              {STATS.map((s) => (
                <div key={s.label} className="text-center md:text-left">
                  <p className="text-3xl sm:text-4xl font-extrabold text-[#E8512A] tracking-tight mb-2">
                    {s.value}
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-5">
              Porozmawiajmy.
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Czy szukasz partnera do zwrotów, kanału recommerce, czy integracji w modelu 3PL —
              najlepiej zacząć od 30-minutowej rozmowy.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/kontakt"
                className="bg-[#E8512A] text-white font-semibold px-7 py-4 rounded-xl hover:bg-[#D4431F] transition-colors"
              >
                Umów rozmowę
              </Link>
              <Link
                href="/kariera"
                className="border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold px-7 py-4 rounded-xl hover:bg-[#1A1A1A] hover:text-white transition-colors"
              >
                Dołącz do zespołu →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </LanguageProvider>
  )
}
