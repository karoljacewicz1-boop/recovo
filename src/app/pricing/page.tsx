'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PLANS } from '@/lib/plans'
import { supabase } from '@/lib/supabase'

function PricingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const expired = searchParams.get('expired') === '1'

  const [loading, setLoading] = useState<string | null>(null)
  const [userSlug, setUserSlug] = useState<string | null>(null)
  const [currentPlan, setCurrentPlan] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data: client } = await supabase
        .from('clients')
        .select('slug, plan')
        .eq('user_id', user.id)
        .maybeSingle()
      if (client) {
        setUserSlug(client.slug)
        setCurrentPlan(client.plan)
      }
    })
  }, [])

  async function handleSubscribe(planId: 'starter' | 'growth') {
    // Not logged in — send to register
    if (!userSlug) {
      router.push(`/register?next=/pricing`)
      return
    }

    setLoading(planId)

    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: userSlug, planId }),
    })

    const data = await res.json()
    setLoading(null)

    if (!res.ok || !data.url) {
      alert(data.error ?? 'Błąd płatności')
      return
    }

    window.location.href = data.url
  }

  const planCards = [PLANS.starter, PLANS.growth, PLANS.scale]

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">Recovo</Link>
          <div className="flex items-center gap-4 text-sm">
            {userSlug ? (
              <Link href={`/dashboard/${userSlug}`} className="text-gray-500 hover:text-[#1A1A1A]">
                Dashboard →
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-gray-500 hover:text-[#1A1A1A]">Zaloguj</Link>
                <Link href="/register" className="bg-[#E8512A] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#D4431F] transition">
                  Trial za darmo
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {expired && (
          <div className="max-w-2xl mx-auto mb-12 bg-red-50 border border-red-200 rounded-xl p-5 text-center">
            <p className="text-red-800 font-bold mb-1">Trial wygasł</p>
            <p className="text-red-700 text-sm">Wybierz plan, aby kontynuować korzystanie z Recovo.</p>
          </div>
        )}

        <div className="text-center mb-14">
          <p className="text-xs text-[#E8512A] uppercase tracking-widest font-bold mb-3">Pricing</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A] mb-4">Wybierz plan</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Zacznij od 14-dniowego triala, upgrade kiedy chcesz.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {planCards.map((plan) => {
            const isCurrent = currentPlan === plan.id
            const isScale = plan.id === 'scale'

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl p-8 border-2 flex flex-col ${
                  plan.highlighted
                    ? 'border-[#E8512A] shadow-lg relative'
                    : 'border-gray-100'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E8512A] text-white text-xs font-bold px-3 py-1 rounded-full">
                    Najpopularniejszy
                  </div>
                )}

                <div className="flex-1">
                  <p className="text-lg font-bold text-[#1A1A1A] mb-1">{plan.name}</p>
                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-4xl font-extrabold text-[#1A1A1A]">{plan.priceDisplay}</span>
                    {plan.price !== null && (
                      <span className="text-gray-400 text-sm">/mies</span>
                    )}
                  </div>

                  <ul className="space-y-2.5 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-[#E8512A] mt-0.5">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl bg-gray-100 text-gray-400 font-semibold text-sm cursor-not-allowed"
                  >
                    Twój aktualny plan
                  </button>
                ) : isScale ? (
                  <a
                    href="mailto:hello@recovo.com.pl?subject=Zapytanie%20-%20plan%20Scale"
                    className="w-full block text-center py-3 rounded-xl border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold text-sm hover:bg-[#1A1A1A] hover:text-white transition"
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan.id as 'starter' | 'growth')}
                    disabled={loading === plan.id}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition disabled:opacity-60 ${
                      plan.highlighted
                        ? 'bg-[#E8512A] text-white hover:bg-[#D4431F]'
                        : 'bg-[#1A1A1A] text-white hover:bg-gray-800'
                    }`}
                  >
                    {loading === plan.id ? 'Przekierowywanie…' : plan.cta}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center text-sm text-gray-400">
          Wszystkie plany zawierają 14-dniowy trial. Bez karty kredytowej.
          Anulowanie w każdej chwili.
        </div>
      </div>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense>
      <PricingContent />
    </Suspense>
  )
}
