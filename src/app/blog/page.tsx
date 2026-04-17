import Link from 'next/link'
import type { Metadata } from 'next'
import { LanguageProvider } from '@/lib/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Blog Recovo — insighty z branży zwrotów i recommerce',
  description:
    'Dane, case studies i analizy z polskiego rynku zwrotów e-commerce. Jak zarządzać Grade B/C, kiedy recommerce się opłaca, co mówią liczby.',
}

const POSTS = [
  {
    slug: 'anatomia-zwrotu-2026',
    title: 'Anatomia zwrotu w polskim e-commerce 2026',
    excerpt:
      'Rozbieramy na czynniki pierwsze 10 000 zwrotów z fashion i beauty. Ile to kosztuje, ile można odzyskać, gdzie jest największa strata.',
    category: 'Raport',
    readTime: '8 min',
    date: '2026-04-10',
  },
  {
    slug: 'grade-b-vs-outlet',
    title: 'Grade B vs outlet — dlaczego własny outlet niszczy markę',
    excerpt:
      'Dlaczego 30% marek premium wycofało się z własnych outletów w ostatnich 2 latach i co zamiast tego zrobili z towarem Grade B.',
    category: 'Strategia',
    readTime: '6 min',
    date: '2026-03-28',
  },
  {
    slug: 'ai-grading-vs-human',
    title: 'AI grading vs pracownik magazynu — spójność na 3 zmianach',
    excerpt:
      'Test porównawczy 500 zwrotów: co dostaje każdy produkt, gdy ocenia go AI Claude, a co gdy ocenia go ten sam pracownik w poniedziałek i w piątek.',
    category: 'Dane',
    readTime: '10 min',
    date: '2026-03-15',
  },
  {
    slug: 'logistyka-zwrotna-koszty',
    title: 'Ile naprawdę kosztuje Cię zwrot — pełny rachunek',
    excerpt:
      'Transport, rozpakowanie, ocena, przepakowanie, magazyn, utracona marża. Kalkulator który uwzględnia wszystko — z przykładowymi liczbami z fashion.',
    category: 'Finanse',
    readTime: '7 min',
    date: '2026-02-22',
  },
  {
    slug: 'esg-recommerce-raport',
    title: 'Recommerce jako narzędzie ESG — raport za Q1 2026',
    excerpt:
      'Ile produktów uratowaliśmy przed utylizacją w I kwartale. Wyliczony ślad węglowy, współpraca z NGO na Grade D, perspektywa regulacyjna.',
    category: 'ESG',
    readTime: '5 min',
    date: '2026-02-10',
  },
  {
    slug: 'stripe-subskrypcje-saas',
    title: 'Jak wdrożyliśmy Stripe w SaaS dla 3PL — backstage Recovo',
    excerpt:
      'Techniczny post z naszej drogi do multi-tenant subskrypcji Stripe. Pułapki z webhookami, limity per plan, plan enforcement bez blokowania pracy.',
    category: 'Tech',
    readTime: '12 min',
    date: '2026-01-30',
  },
] as const

const CATEGORIES = ['Wszystko', 'Raport', 'Strategia', 'Dane', 'Finanse', 'ESG', 'Tech'] as const

export default function BlogPage() {
  const featured = POSTS[0]
  const rest = POSTS.slice(1)

  return (
    <LanguageProvider>
      <Navbar />

      <main className="bg-[#FAFAFA]">
        {/* Hero */}
        <section className="pt-32 pb-12 md:pt-40 md:pb-16 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E8512A] mb-5">
              <span className="w-8 h-px bg-[#E8512A]" />
              Blog Recovo
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#1A1A1A] leading-[1.05] tracking-tight mb-6">
              Dane, które zmieniają{' '}
              <span className="text-[#E8512A]">decyzje o zwrotach.</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
              Piszemy o tym, co widzimy w liczbach naszych klientów — bez lania wody, bez clickbaitu.
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b border-gray-100 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-wrap gap-2">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat}
                className={`text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full transition-colors ${
                  i === 0
                    ? 'bg-[#1A1A1A] text-white'
                    : 'bg-[#FAFAFA] text-gray-600 hover:bg-[#FFF3EF] hover:text-[#E8512A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Featured */}
        <section className="py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 grid md:grid-cols-[1.2fr_1fr] gap-0">
                <div className="aspect-[4/3] md:aspect-auto bg-gradient-to-br from-[#FFF3EF] to-[#FCD8C9] relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-[#E8512A]/10 flex items-center justify-center">
                      <svg className="w-10 h-10 text-[#E8512A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-7 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4 text-xs">
                    <span className="inline-block bg-[#FFF3EF] text-[#E8512A] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      {featured.category}
                    </span>
                    <span className="text-gray-500">{featured.readTime} · {featured.date}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-3 group-hover:text-[#E8512A] transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-base text-gray-600 leading-relaxed mb-5">
                    {featured.excerpt}
                  </p>
                  <span className="text-sm font-semibold text-[#E8512A] group-hover:text-[#D4431F]">
                    Czytaj artykuł →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Grid */}
        <section className="py-8 md:py-12 pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#E8512A] transition-colors flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-4 text-xs">
                    <span className="inline-block bg-[#FFF3EF] text-[#E8512A] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-gray-500">{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-3 group-hover:text-[#E8512A] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  <span className="text-xs text-gray-500">{post.date}</span>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-gray-500">
                Nowe artykuły co dwa tygodnie. Chcesz dostawać je na maila?{' '}
                <Link href="/#newsletter" className="text-[#E8512A] hover:underline font-semibold">
                  Zapisz się do newslettera
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </LanguageProvider>
  )
}
