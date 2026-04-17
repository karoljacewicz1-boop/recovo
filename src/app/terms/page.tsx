import Link from 'next/link'
import type { Metadata } from 'next'
import { LanguageProvider } from '@/lib/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Regulamin — Recovo',
  description:
    'Regulamin świadczenia usług SaaS, recommerce i fulfillment przez Recovo sp. z o.o.',
}

export default function TermsPage() {
  return (
    <LanguageProvider>
      <Navbar />

      <main className="bg-[#FAFAFA]">
        <section className="pt-32 pb-16 md:pt-40 md:pb-20 border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-5">
              <span className="w-8 h-px bg-[#E8512A]" />
              Dokument prawny · Obowiązuje od 2026-01-01
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1A1A1A] leading-[1.1] tracking-tight mb-6">
              Regulamin świadczenia usług
            </h1>
            <p className="text-base text-gray-600 leading-relaxed">
              Niniejszy regulamin określa zasady korzystania z usług świadczonych przez Recovo
              sp. z o.o. — SaaS Recovo Inspect, usługi fulfillment oraz kanał recommerce.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10 text-[15px] leading-relaxed text-gray-700">

            <div>
              <h2 className="text-xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">§ 1. Definicje</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Usługodawca</strong> — Recovo sp. z o.o., ul. Przykładowa 12, 00-001 Warszawa, NIP 000-00-00-000.</li>
                <li><strong>Klient</strong> — osoba prawna lub fizyczna prowadząca działalność gospodarczą korzystająca z usług Recovo.</li>
                <li><strong>SaaS</strong> — aplikacja Recovo Inspect udostępniana w modelu subskrypcyjnym.</li>
                <li><strong>Recommerce</strong> — usługa sprzedaży komisowej towaru Klienta przez Usługodawcę na platformach Allegro/eBay/OLX.</li>
                <li><strong>Fulfillment</strong> — usługa przyjęcia, oceny (grading) i zagospodarowania zwrotów w magazynie Usługodawcy.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">§ 2. Zawarcie umowy</h2>
              <p>
                Umowa jest zawierana w momencie akceptacji niniejszego regulaminu oraz rejestracji
                konta w serwisie lub podpisania odrębnej umowy ramowej (dla klientów Enterprise /
                partnerstw 3PL). Klient oświadcza, że jest przedsiębiorcą, a usługi nabywane są
                w związku z prowadzoną działalnością gospodarczą.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">§ 3. Plany SaaS</h2>
              <p>
                Recovo Inspect jest dostępne w trzech planach: Starter, Growth i Scale. Aktualne
                limity i ceny są publikowane na stronie{' '}
                <Link href="/pricing" className="text-[#E8512A] hover:underline font-semibold">/pricing</Link>.
                Opłata pobierana jest z góry za okres miesięczny przez Stripe. Klient może anulować
                subskrypcję w dowolnym momencie — usługa pozostaje aktywna do końca opłaconego
                okresu.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">§ 4. Trial</h2>
              <p>
                Trial darmowy obowiązuje przez 14 dni od rejestracji. W okresie trial Klient ma
                dostęp do pełnej funkcjonalności planu Growth, z miękkim limitem 50 inspekcji.
                Po zakończeniu trial Klient wybiera plan lub konto zostaje zawieszone.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">§ 5. Recommerce — przeniesienie własności</h2>
              <p>
                W momencie akceptacji przez Klienta wyceny recommerce przedstawionej przez
                Usługodawcę, własność towaru przechodzi na Usługodawcę. Od tego momentu Usługodawca
                występuje jako sprzedawca wobec kupujących końcowych, ponosi odpowiedzialność
                z tytułu rękojmi i obsługuje reklamacje.
              </p>
              <p className="mt-3">
                Klient otrzymuje 75% ceny brutto uzyskanej ze sprzedaży (po odjęciu kosztów
                platform i wysyłki). Rozliczenie następuje 10. dnia każdego miesiąca za sprzedaże
                z poprzedniego miesiąca kalendarzowego.
              </p>
              <p className="mt-3">
                Towar nieprzedany w ciągu 180 dni od wystawienia podlega dalszym działaniom
                ustalonym z Klientem (outlet B2B, donation, utylizacja). Klient ma prawo wycofania
                towaru przed tym terminem, pod warunkiem pokrycia kosztu logistyki zwrotnej.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">§ 6. Fulfillment — ocena i grading</h2>
              <p>
                Usługodawca realizuje grading towaru według skali A/B/C/D. SLA przyjęcia paczki
                wynosi 48 godzin od fizycznego wpłynięcia do magazynu (24h na planie priorytetowym).
                Klient otrzymuje pełen raport PDF ze zdjęciami per sztuka.
              </p>
              <p className="mt-3">
                Cennik fulfillment publikowany na stronie{' '}
                <Link href="/uslugi" className="text-[#E8512A] hover:underline font-semibold">/uslugi</Link>.
                Faktura VAT wystawiana raz w miesiącu z terminem płatności 14 dni.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">§ 7. Odpowiedzialność</h2>
              <p>
                Usługodawca dokłada należytej staranności przy realizacji usługi. Odpowiedzialność
                Usługodawcy jest ograniczona do wysokości opłat uiszczonych przez Klienta w ciągu
                12 miesięcy poprzedzających zdarzenie. Wyłączenie odpowiedzialności nie dotyczy
                winy umyślnej i rażącego niedbalstwa.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">§ 8. Reklamacje</h2>
              <p>
                Reklamacje można składać na adres hello@recovo.com.pl. Usługodawca rozpatruje
                reklamację w terminie 14 dni roboczych.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">§ 9. Rozwiązanie umowy</h2>
              <p>
                Każda ze stron może wypowiedzieć umowę SaaS z zachowaniem terminu do końca
                bieżącego okresu rozliczeniowego. Umowy na fulfillment i recommerce — zgodnie
                z zapisami umowy ramowej lub, wobec braku umowy, z zachowaniem 30-dniowego okresu
                wypowiedzenia.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">§ 10. Postanowienia końcowe</h2>
              <p>
                Prawo właściwe: polskie. Sądem właściwym jest sąd powszechny właściwy dla siedziby
                Usługodawcy. Regulamin może być zmieniony za 14-dniowym uprzedzeniem mailowym.
              </p>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Pełną wersję PDF regulaminu możesz pobrać na żądanie mailowe.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </LanguageProvider>
  )
}
