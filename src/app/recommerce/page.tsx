import Link from 'next/link'
import type { Metadata } from 'next'
import { LanguageProvider } from '@/lib/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Recovo Recommerce — oddajesz towar nam, my go sprzedajemy',
  description:
    'Kanał sprzedaży dla zwrotów z grade B/C. Oddajesz nam towar, my listujemy na Allegro/eBay/OLX, pakujemy i wysyłamy. 75% wartości sprzedaży wraca do Ciebie co miesiąc.',
}

const STEPS = [
  {
    num: '01',
    title: 'Akceptujesz recommerce',
    desc: 'W dashboardzie zaznaczasz produkty Grade B/C, klikasz "Oddaj do recommerce" i potwierdzasz. To moment przejęcia — od tej chwili my odpowiadamy za każdy etap.',
  },
  {
    num: '02',
    title: 'Towar trafia do naszego magazynu',
    desc: 'Jeśli gradowałeś u siebie (Inspect SaaS) — wysyłasz paczkę do Wysogotowa, my opłacamy kuriera. Jeśli korzystasz z Fulfillment — towar już jest u nas, nie robisz nic.',
  },
  {
    num: '03',
    title: 'My wystawiamy — AI pisze opis, my dodajemy zdjęcia',
    desc: 'Listing idzie na Allegro, eBay, OLX. AI generuje opisy i tytuły, dobieramy cenę rynkową, korzystamy z naszego rankingu sprzedawcy. Używamy Twoich zdjęć z gradingu.',
  },
  {
    num: '04',
    title: 'Obsługa kupujących — na naszej głowie',
    desc: 'Odpowiadamy na pytania, pakujemy, wysyłamy, zajmujemy się reklamacjami kupujących. Twoja marka pozostaje anonimowa albo widoczna — jak wolisz.',
  },
  {
    num: '05',
    title: 'Co miesiąc: raport sprzedaży + przelew',
    desc: 'Pełna transparentność — co się sprzedało, kiedy, za ile, na której platformie. 75% wartości sprzedaży trafia na Twoje konto jednym przelewem.',
  },
] as const

const WHY = [
  {
    title: 'Odzyskujesz czas zespołu',
    desc: 'Listing + Q&A + pakowanie + reklamacje = kilka etatów, jeśli robisz to na dużą skalę. U nas to zero godzin Twoich ludzi.',
  },
  {
    title: 'Natychmiast zwalniasz magazyn',
    desc: 'Z chwilą akceptacji recommerce, towar fizycznie wychodzi z Twojego magazynu. Masz miejsce na aktywny stock.',
  },
  {
    title: 'Lepszy odzysk niż hurt / utylizacja',
    desc: 'Pojedyncza sprzedaż na marketplace daje zwykle 60–80% ceny detalicznej. Hurt daje 10–20%, utylizacja to czysta strata.',
  },
  {
    title: 'Profesjonalny profil sprzedawcy',
    desc: 'Mamy zbudowany ranking, setki opinii i zoptymalizowane szablony aukcji. Twoje sztuki sprzedadzą się szybciej niż na świeżym koncie.',
  },
  {
    title: 'Pełna zgodność z Twoim brandem',
    desc: 'Sprzedajemy pod neutralnym seller brandem albo pod Twoją marką (opcja). Ustalamy reguły: minimalne ceny, zakazane kanały, komunikacja.',
  },
  {
    title: 'ESG — mniej odpadów',
    desc: 'Każda sztuka sprzedana to produkt, który nie trafił na utylizację. Pełny raport dla Twojego zespołu ESG i księgowości.',
  },
] as const

const FAQ = [
  {
    q: 'Kiedy następuje przejęcie własności?',
    a: 'W momencie kliknięcia „Akceptuj recommerce" w dashboardzie. Od tej chwili odpowiadamy za towar i za wszelkie decyzje sprzedażowe.',
  },
  {
    q: 'Co, jeśli produkt się nie sprzeda?',
    a: 'Po 90 dniach od listingu obniżamy cenę automatycznie (do ustalonego minimum). Po 180 dniach proponujemy utylizację / donację. Decyzja zawsze po Twojej stronie.',
  },
  {
    q: 'Czy mogę wybrać, na których marketplace\'ach sprzedajecie?',
    a: 'Tak — w ustawieniach określasz dozwolone platformy (np. "tylko Allegro", "bez eBay międzynarodowy" itd.). Standardowo listujemy na najbardziej dopasowanym kanale.',
  },
  {
    q: 'Czy widzę listingi w czasie rzeczywistym?',
    a: 'Tak — każdy listing jest linkowany w Twoim dashboardzie. Widzisz status (aktywny/sprzedany/wycofany), liczbę views, liczbę pytań, finalną cenę.',
  },
  {
    q: 'Co z Grade A? Czy też możecie to sprzedawać?',
    a: 'Możemy, ale zwykle nie polecamy — Grade A ma większą wartość na Twoim kanale (sklep / FBA / własny marketplace). Recommerce jest zaprojektowany głównie pod B/C/D.',
  },
  {
    q: 'Kiedy dostaję przelew?',
    a: 'Do 10. dnia każdego miesiąca za sprzedaż z miesiąca poprzedniego. Raport PDF + CSV + przelew na wskazane konto.',
  },
] as const

export default function RecommercePage() {
  return (
    <LanguageProvider>
      <Navbar />

      <main className="bg-[#FAFAFA]">
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-5">
              <span className="w-8 h-px bg-[#E8512A]" />
              Recovo Recommerce
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-[#1A1A1A] leading-[1.05] tracking-tight mb-6">
              Oddajesz towar nam.{' '}
              <span className="text-[#E8512A]">My go sprzedamy.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mb-8">
              Recommerce to nasz core. W momencie gdy akceptujesz recommerce w dashboardzie,
              towar fizycznie przechodzi do naszego magazynu. Od tej chwili my wystawiamy,
              sprzedajemy, pakujemy i wysyłamy — Ty dostajesz przelew co miesiąc.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="bg-[#E8512A] text-white font-semibold px-7 py-4 rounded-xl hover:bg-[#D4431F] transition-colors text-center"
              >
                Zacznij trial i zobacz, jak to działa
              </Link>
              <Link
                href="#jak-dziala"
                className="border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold px-7 py-4 rounded-xl hover:bg-[#1A1A1A] hover:text-white transition-colors text-center"
              >
                Zobacz proces krok po kroku
              </Link>
            </div>
          </div>
        </section>

        {/* Numbers */}
        <section className="py-14 bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
              <div>
                <p className="text-4xl font-extrabold text-[#E8512A] mb-2">75 / 25</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Podział wartości sprzedaży</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-[#E8512A] mb-2">0 zł</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Opłat wstępnych i miesięcznych</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-[#E8512A] mb-2">3</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Platformy sprzedaży (Allegro/eBay/OLX)</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-[#E8512A] mb-2">10.</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Dzień miesiąca — przelew za sprzedaż</p>
              </div>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section id="jak-dziala" className="py-20 md:py-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-12">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-4">
                Proces
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-5">
                Od akceptacji do przelewu — 5 kroków
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Każdy etap jest cyfrowo udokumentowany w Twoim dashboardzie. Zero czarnej skrzynki.
              </p>
            </div>

            <div className="space-y-4">
              {STEPS.map((step, idx) => (
                <div
                  key={step.num}
                  className="bg-white rounded-2xl p-8 border border-gray-100 grid md:grid-cols-[auto_1fr] gap-6"
                >
                  <div className="flex md:flex-col items-center md:items-start gap-4 md:w-24">
                    <span className="text-4xl md:text-5xl font-extrabold text-[#E8512A] leading-none">
                      {step.num}
                    </span>
                    {idx < STEPS.length - 1 && (
                      <div className="hidden md:block w-px h-10 bg-gradient-to-b from-[#E8512A] to-transparent" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-base text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why hand it over */}
        <section className="py-20 md:py-28 bg-white border-y border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-12">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-4">
                Dlaczego recommerce
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-5">
                Dlaczego oddać, a nie sprzedawać samemu?
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Kalkulacja jest prosta: 25% prowizji vs koszt własnej operacji + czas zespołu + niższy ranking sprzedawcy.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {WHY.map((item) => (
                <div
                  key={item.title}
                  className="bg-[#FAFAFA] rounded-2xl p-7 border border-gray-100"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#FFF3EF] flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-[#E8512A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-base font-extrabold text-[#1A1A1A] mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Price split */}
        <section className="py-20 md:py-24 bg-[#1A1A1A] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-4">
              Rozliczenie
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight mb-6">
              Prosta struktura: 75 / 25
            </h2>
            <div className="inline-flex items-baseline gap-2 text-7xl md:text-8xl font-extrabold mb-6">
              <span>75</span>
              <span className="text-gray-500 text-5xl">/</span>
              <span className="text-[#E8512A]">25</span>
              <span className="text-gray-400 text-2xl">%</span>
            </div>
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
              <strong className="text-white">75% wartości sprzedaży dla Ciebie.</strong>{' '}
              25% dla nas — to pokrywa wystawienie, fotografowanie, pakowanie, wysyłkę i
              obsługę kupujących. <strong className="text-white">Bez opłat wstępnych, bez miesięcznego abonamentu, bez kosztów ukrytych.</strong>
            </p>
            <Link
              href="/register"
              className="inline-block bg-[#E8512A] text-white font-semibold px-7 py-4 rounded-xl hover:bg-[#D4431F] transition-colors"
            >
              Zacznij trial i zobacz, jak to działa →
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
                Pytania o recommerce
              </h2>
            </div>

            <div className="space-y-4">
              {FAQ.map((f) => (
                <details
                  key={f.q}
                  className="group bg-white rounded-xl border border-gray-100 open:border-[#E8512A]/30 transition-colors"
                >
                  <summary className="flex items-center justify-between gap-4 cursor-pointer px-6 py-5 list-none">
                    <span className="text-sm md:text-base font-bold text-[#1A1A1A]">{f.q}</span>
                    <svg
                      className="w-4 h-4 text-[#E8512A] flex-shrink-0 transition-transform group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </LanguageProvider>
  )
}
