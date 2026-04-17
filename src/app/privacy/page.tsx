import Link from 'next/link'
import type { Metadata } from 'next'
import { LanguageProvider } from '@/lib/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Polityka prywatności — Recovo',
  description:
    'Polityka prywatności Recovo sp. z o.o. — przetwarzanie danych osobowych w zgodzie z RODO, podstawy prawne, prawa użytkownika.',
}

export default function PrivacyPage() {
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
              Polityka prywatności
            </h1>
            <p className="text-base text-gray-600 leading-relaxed">
              Poniższy dokument opisuje, jak Recovo sp. z o.o. przetwarza dane osobowe
              zbierane w związku ze świadczeniem usług SaaS i recommerce.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 prose-policy space-y-10 text-[15px] leading-relaxed text-gray-700">

            <div>
              <h2 className="text-xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">1. Administrator danych</h2>
              <p>
                Administratorem Twoich danych osobowych jest Recovo sp. z o.o. z siedzibą
                w Warszawie, ul. Przykładowa 12, 00-001 Warszawa, wpisana do KRS pod
                numerem 0000000000, NIP 000-00-00-000. Kontakt: hello@recovo.com.pl.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">2. Zakres przetwarzanych danych</h2>
              <p>W związku ze świadczeniem usług przetwarzamy następujące kategorie danych:</p>
              <ul className="mt-3 space-y-2 list-disc list-inside">
                <li>Dane kontaktowe (imię, nazwisko, email, telefon, firma)</li>
                <li>Dane rozliczeniowe (NIP, adres do faktury, metoda płatności)</li>
                <li>Dane operacyjne konta (PIN pracownika, role, preferencje)</li>
                <li>Zdjęcia i metadane produktów wytworzone podczas gradingu</li>
                <li>Logi systemowe (IP, user agent, znaczniki czasowe)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">3. Podstawy prawne</h2>
              <p>Przetwarzamy dane na podstawie:</p>
              <ul className="mt-3 space-y-2 list-disc list-inside">
                <li>Art. 6 ust. 1 lit. b RODO — wykonanie umowy (świadczenie usługi SaaS, recommerce, fulfillment)</li>
                <li>Art. 6 ust. 1 lit. c RODO — obowiązek prawny (księgowość, rozliczenia podatkowe)</li>
                <li>Art. 6 ust. 1 lit. f RODO — prawnie uzasadniony interes (bezpieczeństwo systemu, zapobieganie nadużyciom)</li>
                <li>Art. 6 ust. 1 lit. a RODO — zgoda (newsletter, marketing bezpośredni)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">4. Okres przechowywania</h2>
              <p>
                Dane konta przechowujemy przez okres jego aktywności plus 24 miesiące po
                zamknięciu (archiwizacja + obsługa ewentualnych reklamacji). Dane rozliczeniowe
                — 5 lat zgodnie z ustawą o rachunkowości. Zdjęcia produktów z gradingu — przez
                okres aktywności konta, z możliwością eksportu na żądanie.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">5. Odbiorcy danych</h2>
              <p>Dane udostępniamy wyłącznie:</p>
              <ul className="mt-3 space-y-2 list-disc list-inside">
                <li>Supabase Inc. — hosting bazy i plików (serwery w EU, umowa DPA)</li>
                <li>Stripe Inc. — obsługa płatności (PCI DSS Level 1)</li>
                <li>Anthropic PBC — model AI wykorzystywany do gradingu (bez zapisu danych w celach treningowych)</li>
                <li>Biuro księgowe — na podstawie umowy powierzenia</li>
                <li>Organom państwowym — na podstawie obowiązku prawnego</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">6. Prawa użytkownika</h2>
              <p>Masz prawo do:</p>
              <ul className="mt-3 space-y-2 list-disc list-inside">
                <li>Dostępu do swoich danych i otrzymania ich kopii</li>
                <li>Sprostowania (poprawienia) danych</li>
                <li>Usunięcia danych („prawo do bycia zapomnianym")</li>
                <li>Ograniczenia przetwarzania</li>
                <li>Przenoszenia danych (eksport w formacie JSON/CSV w 48h)</li>
                <li>Sprzeciwu wobec przetwarzania</li>
                <li>Wniesienia skargi do Prezesa UODO</li>
              </ul>
              <p className="mt-3">
                Z praw możesz skorzystać pisząc na adres hello@recovo.com.pl lub za pomocą
                formularza w panelu konta.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">7. Ciasteczka (cookies)</h2>
              <p>
                Stosujemy cookies niezbędne (sesja, preferencje) oraz — za Twoją zgodą — analityczne
                (Plausible Analytics w trybie bez PII). Nie używamy trackerów reklamowych.
                Ustawienia cookies możesz zmienić w każdej chwili w stopce strony.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">8. Zmiany polityki</h2>
              <p>
                Zastrzegamy sobie prawo do aktualizacji polityki. O istotnych zmianach
                informujemy 14 dni wcześniej mailowo oraz w panelu. Ostatnia aktualizacja:
                1 stycznia 2026.
              </p>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Masz pytania? Napisz na{' '}
                <a href="mailto:hello@recovo.com.pl" className="text-[#E8512A] hover:underline font-semibold">
                  hello@recovo.com.pl
                </a>
                {' '}lub użyj formularza <Link href="/kontakt" className="text-[#E8512A] hover:underline font-semibold">kontaktowego</Link>.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </LanguageProvider>
  )
}
