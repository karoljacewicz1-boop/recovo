'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getPlan } from '@/lib/plans'
import { useCan } from '@/lib/dashboardContext'

type ClientData = {
  id: string
  name: string
  slug: string
  plan: string
  trial_ends_at: string | null
  plan_period_end: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
}

function periodStart(planPeriodEnd: string | null): Date {
  if (planPeriodEnd) {
    const end = new Date(planPeriodEnd)
    return new Date(end.getTime() - 30 * 86400000)
  }
  const start = new Date()
  start.setDate(1)
  start.setHours(0, 0, 0, 0)
  return start
}

function SettingsContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params.slug as string
  const checkoutStatus = searchParams.get('checkout')
  const canManageBilling = useCan('billing.manage')

  const [client, setClient] = useState<ClientData | null>(null)
  const [workers, setWorkers] = useState(0)
  const [inspectionsThisPeriod, setInspectionsThisPeriod] = useState(0)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data: c } = await supabase
      .from('clients')
      .select('id, name, slug, plan, trial_ends_at, plan_period_end, stripe_customer_id, stripe_subscription_id')
      .eq('slug', slug)
      .maybeSingle()

    if (!c) { setLoading(false); return }
    setClient(c)

    const [{ count: wc }, { count: ic }] = await Promise.all([
      supabase.from('workers').select('*', { count: 'exact', head: true }).eq('client_id', c.id),
      supabase.from('inspections').select('*', { count: 'exact', head: true })
        .eq('client_id', c.id)
        .gte('created_at', periodStart(c.plan_period_end).toISOString()),
    ])

    setWorkers(wc ?? 0)
    setInspectionsThisPeriod(ic ?? 0)
    setLoading(false)
  }, [slug])

  useEffect(() => { load() }, [load])

  async function openPortal() {
    setPortalLoading(true)
    const res = await fetch('/api/stripe/portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
    const data = await res.json()
    setPortalLoading(false)
    if (data.url) window.location.href = data.url
    else alert(data.error ?? 'Błąd')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-[#E8512A] rounded-full animate-spin" />
      </div>
    )
  }

  if (!client) return <div className="p-8 text-gray-500">Nie znaleziono klienta.</div>

  const plan = getPlan(client.plan)
  const isPaid = plan.id === 'starter' || plan.id === 'growth'
  const isTrial = plan.id === 'trial'
  const trialDaysLeft = client.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(client.trial_ends_at).getTime() - Date.now()) / 86400000))
    : 0

  const workersPct = Math.min(100, (workers / plan.workerLimit) * 100)
  const inspectionsPct = Math.min(100, (inspectionsThisPeriod / plan.inspectionLimit) * 100)

  return (
    <div className="p-6 md:p-8 pb-24 md:pb-8 max-w-3xl">
      <div className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Ustawienia</p>
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">Plan i rozliczenia</h1>
      </div>

      {checkoutStatus === 'success' && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl px-5 py-4">
          <p className="font-bold text-green-800">Płatność zakończona sukcesem!</p>
          <p className="text-sm text-green-700 mt-1">Twój plan został zaktualizowany.</p>
        </div>
      )}
      {checkoutStatus === 'cancel' && (
        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl px-5 py-4">
          <p className="text-sm text-gray-700">Płatność anulowana. Możesz spróbować ponownie.</p>
        </div>
      )}

      <div className={`rounded-2xl p-6 mb-6 ${isPaid ? 'bg-white border border-gray-100' : 'bg-[#FFF3EF] border border-[#E8512A]/30'}`}>
        <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Aktualny plan</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-2xl font-extrabold text-[#1A1A1A]">{plan.name}</h2>
              {plan.price !== null && plan.price > 0 && (
                <span className="text-gray-500">· {plan.priceDisplay}/mies</span>
              )}
            </div>
            {isTrial && (
              <p className={`text-sm mt-1 font-medium ${trialDaysLeft <= 3 ? 'text-red-600' : 'text-[#E8512A]'}`}>
                Trial: {trialDaysLeft} {trialDaysLeft === 1 ? 'dzień' : 'dni'} pozostało
              </p>
            )}
            {isPaid && client.plan_period_end && (
              <p className="text-xs text-gray-400 mt-1">
                Następne odnowienie: {new Date(client.plan_period_end).toLocaleDateString('pl-PL', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isTrial && canManageBilling && (
              <Link
                href="/pricing"
                className="bg-[#E8512A] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#D4431F] transition"
              >
                Wybierz plan →
              </Link>
            )}
            {isPaid && canManageBilling && (
              <button
                onClick={openPortal}
                disabled={portalLoading}
                className="bg-[#1A1A1A] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-800 transition disabled:opacity-60"
              >
                {portalLoading ? 'Otwieranie…' : 'Zarządzaj subskrypcją'}
              </button>
            )}
            {!canManageBilling && (
              <span className="text-xs text-gray-400 italic">
                Tylko owner/admin może zmieniać plan
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <p className="text-sm font-bold text-[#1A1A1A] mb-5">Wykorzystanie w tym okresie</p>

        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Pracownicy</span>
              <span className="text-sm font-mono">
                <span className="font-bold text-[#1A1A1A]">{workers}</span>
                <span className="text-gray-400"> / {plan.workerLimit === 999 ? '∞' : plan.workerLimit}</span>
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${workersPct >= 100 ? 'bg-red-500' : workersPct >= 80 ? 'bg-yellow-500' : 'bg-[#E8512A]'}`}
                style={{ width: `${workersPct}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Inspekcje (bieżący okres)</span>
              <span className="text-sm font-mono">
                <span className="font-bold text-[#1A1A1A]">{inspectionsThisPeriod}</span>
                <span className="text-gray-400"> / {plan.inspectionLimit === 9999 ? '∞' : plan.inspectionLimit}</span>
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${inspectionsPct >= 100 ? 'bg-red-500' : inspectionsPct >= 80 ? 'bg-yellow-500' : 'bg-[#E8512A]'}`}
                style={{ width: `${inspectionsPct}%` }}
              />
            </div>
          </div>
        </div>

        {(workersPct >= 80 || inspectionsPct >= 80) && plan.id !== 'scale' && (
          <div className="mt-5 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
            <p className="text-xs text-yellow-800">
              {canManageBilling
                ? 'Zbliżasz się do limitu planu. Rozważ upgrade.'
                : 'Zbliżasz się do limitu planu — poinformuj ownera/admina.'}
            </p>
            {canManageBilling && (
              <Link
                href="/pricing"
                className="text-xs font-semibold text-[#E8512A] hover:underline flex-shrink-0"
              >
                Upgrade →
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <p className="text-sm font-bold text-[#1A1A1A] mb-4">Co zawiera twój plan</p>
        <ul className="space-y-2">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-[#E8512A] mt-0.5">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {plan.id !== 'scale' && (
          <Link
            href="/pricing"
            className="mt-5 inline-block text-sm text-[#E8512A] font-semibold hover:underline"
          >
            Porównaj plany →
          </Link>
        )}
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsContent />
    </Suspense>
  )
}
