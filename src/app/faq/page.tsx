import Link from 'next/link'
import type { Metadata } from 'next'
import { LanguageProvider } from '@/lib/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'FAQ — Recovo | Odpowiedzi na najczęstsze pytania',
  description:
    'Jak działa AI grading? Ile kosztuje SaaS? Kto jest właścicielem towaru po oddaniu do recommerce? Odpowiedzi na wszystkie pytania o Recovo.',
}

type FAQItem = { q: string; a: string }
type FAQSection = { title: string; items: FAQItem[] }

const SECTIONS: FAQSection[] = [
  {
    title: 'Recovo Inspect (SaaS)',
    items: [
      {
        q: 'Jak szybko uruchomię grading u siebie?',
        a: 'Rejestracja zajmuje 2 minuty, dodanie pracowników kolejne 3. Pierwszy zeskanowany zwrot możesz zrobić w ciągu 5 minut od założenia konta. Nie wymagamy integracji z ERP ani dedykowanego hardware — wystarczy smartfon lub tablet z kamerą.',
      },
      {
        q: 'Czy pracownik musi mieć konto email?',
        a: 'Nie. Pracownicy logują się PIN-em wystawionym przez managera. To świadomy wybór — w magazynie często nie ma potrzeby budowania tożsamości email dla każdej osoby zmianowej.',
      },
      {
        q: 'Co się dzieje, gdy przekroczę limit planu?',
        a: 'Dostajesz powiadomienie na 80% i 100% limitu. Po przekroczeniu system nie blokuje gradingu bieżącego dnia, ale prosi o upgrade planu od następnego dnia rozliczeniowego.',
      },
      {
        q: 'Czy mogę przenieść dane do innego systemu?',
        a: 'Tak. Dashboard ma eksport CSV/PDF każdego widoku. Pełny dump danych (Twoje SKU, zdjęcia, raporty) na żądanie w formie ZIP w 48h.',
      },
    ],
  },
  {
    title: 'AI grading',
    items: [
      {
        q: 'Jak dokładne jest AI grading?',
        a: 'Model AI Claude osiąga ~92% zgodności z oceną eksperta na danych treningowych z fashion. Każdą ocenę AI Twój pracownik może nadpisać jednym tapnięciem — my uczymy się z tych korekt w czasie.',
      },
      {
        q: 'Według jakich kryteriów oceniamy A/B/C/D?',
        a: 'A — towar jak nowy, bez śladów użytkowania, z tagami. B — drobna wada lub brak opakowania, możliwa sprzedaż z rabatem. C — wyraźne uszkodzenie, tylko recommerce outlet. D — nie nadaje się do sprzedaży (utylizacja lub donation). Na planie Scale kryteria można customizować per kategoria.',
      },
      {
        q: 'Co z kategoriami innymi niż fashion?',
        a: 'Obecnie najlepiej wytrenowany jest model na fashion i beauty. Elektronika, meble i kategorie techniczne działają poprawnie, ale z niższą pewnością. Dla nowych kategorii polecamy plan Growth + korekty manualne pracownika w pierwszym miesiącu.',
      },
    ],
  },
  {
    title: 'Recommerce (75/25)',
    items: [
      {
        q: 'Kiedy towar przechodzi na Waszą własność?',
        a: 'W momencie, w którym zaakceptujesz naszą ofertę cenową (zazwyczaj w 48h od przyjęcia paczki). Od tego momentu: my listujemy, my wysyłamy, my obsługujemy reklamacje. Ty nie jesteś sprzedawcą na Allegro/eBay/OLX.',
      },
      {
        q: 'Co się dzieje z towarem, którego nie uda się sprzedać?',
        a: 'Aktywny listing utrzymujemy do 90 dni. Po tym okresie obniżamy cenę o 30% i dajemy kolejne 90 dni. Po 180 dniach towar idzie do outlet B2B lub — za Twoją zgodą — do donation. Nigdy nie kasujemy wartości bez Twojej wiedzy.',
      },
      {
        q: 'Kiedy dostaję pieniądze?',
        a: 'Przelew 10. dnia każdego miesiąca za wszystkie sprzedaże z poprzedniego miesiąca. Dashboard pokazuje na żywo, która sztuka się sprzedała i ile jest należne.',
      },
      {
        q: 'Czy mogę zostać wyłącznym dostawcą na Waszym kanale?',
        a: 'Nie. Recovo Recommerce to platforma multi-brand. Dzięki temu mamy ruch i rozpoznawalność jako zaufany sprzedawca — a Ty nie rozcieńczasz własnej marki outletem.',
      },
    ],
  },
  {
    title: 'Fulfillment (usługa)',
    items: [
      {
        q: 'Czym różni się usługa od SaaS?',
        a: 'SaaS (Inspect) = robisz grading u siebie na swoim magazynie, Twoi pracownicy, nasza aplikacja. Fulfillment = wysyłasz paczki do nas, nasz zespół robi grading, odsyłamy lub oddajemy do recommerce. Usługa jest dodatkową opcją dla firm bez własnego magazynu.',
      },
      {
        q: 'Jaki jest SLA przyjęcia paczki?',
        a: '48h od fizycznego wpłynięcia paczki do raportu w dashboardzie. Priorytetowa kolejka (plan „Pełne przetwarzanie") to 24h.',
      },
      {
        q: 'Ile to kosztuje?',
        a: 'Od 2,90 PLN / sztuka za sam grading, do 6,50 PLN / sztuka za pełne przetwarzanie (grading + relabeling + kitting + priorytet). Szczegóły w /uslugi.',
      },
    ],
  },
  {
    title: 'Rozliczenia i płatności',
    items: [
      {
        q: 'Jakie metody płatności akceptujecie?',
        a: 'SaaS: Stripe (karty + przelewy SEPA). Fulfillment i recommerce: faktura VAT z terminem 14 dni (polskie firmy) lub przelew ekspresowy.',
      },
      {
        q: 'Czy wystawiacie fakturę VAT?',
        a: 'Tak, zawsze. Polski numer NIP wymagany. Faktura wystawiana automatycznie po każdej płatności Stripe lub ręcznie dla rozliczeń recommerce.',
      },
      {
        q: 'Co z zabezpieczeniem danych?',
        a: 'Dane klienta + zdjęcia hostowane w Supabase (EU, GDPR-compliant). Pełna izolacja między tenantami przez Row-Level Security. Dostęp do Twoich danych mają tylko osoby, które Ty wpiszesz jako użytkowników konta.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <LanguageProvider>
      <Navbar />

      <main className="bg-[#FAFAFA]">
        {/* Hero */}
        <section className="pt-32 pb-12 md:pt-40 md:pb-16 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-5">
              <span className="w-8 h-px bg-[#E8512A]" />
              FAQ
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#1A1A1A] leading-[1.05] tracking-tight mb-6">
              Najczęściej zadawane{' '}
              <span className="text-[#E8512A]">pytania.</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
              Nie znajdujesz odpowiedzi? Napisz na{' '}
              <Link href="/kontakt" className="text-[#E8512A] hover:underline font-semibold">
                hello@recovo.com.pl
              </Link>
              {' '}— wracamy w 24h.
            </p>
          </div>
        </section>

        {/* Sections */}
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-16">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight mb-6">
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <details
                      key={item.q}
                      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden"
                    >
                      <summary className="cursor-pointer list-none flex items-start justify-between gap-4 p-6 hover:bg-[#FFF3EF] transition-colors">
                        <span className="text-base font-extrabold text-[#1A1A1A] tracking-tight">{item.q}</span>
                        <svg
                          className="w-5 h-5 text-[#E8512A] flex-shrink-0 mt-0.5 transition-transform group-open:rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-6 pb-6 -mt-1 text-sm text-gray-600 leading-relaxed">
                        {item.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-24 border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-5">
              Wciąż masz pytanie?
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Odpowiemy maksymalnie w dzień roboczy — na czysto techniczne pytania zwykle w parę godzin.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/kontakt"
                className="bg-[#E8512A] text-white font-semibold px-7 py-4 rounded-xl hover:bg-[#D4431F] transition-colors"
              >
                Napisz do nas
              </Link>
              <Link
                href="/register"
                className="border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold px-7 py-4 rounded-xl hover:bg-[#1A1A1A] hover:text-white transition-colors"
              >
                Zacznij trial →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </LanguageProvider>
  )
}
