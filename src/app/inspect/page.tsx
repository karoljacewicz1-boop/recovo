'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Worker = { id: string; name: string; role: string }

function InspectLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const clientSlug = searchParams.get('c') ?? ''

  const [workers, setWorkers] = useState<Worker[]>([])
  const [loadingWorkers, setLoadingWorkers] = useState(false)
  const [slugInput, setSlugInput] = useState(clientSlug)
  const [slugConfirmed, setSlugConfirmed] = useState(!!clientSlug)
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Load workers when slug is confirmed
  useEffect(() => {
    if (!slugConfirmed || !slugInput) return
    setLoadingWorkers(true)
    setWorkers([])
    fetch(`/api/workers?slug=${slugInput}`)
      .then(r => r.json())
      .then(d => {
        setWorkers(d.workers ?? [])
        setLoadingWorkers(false)
        if (!d.workers?.length && d.error) setError('Nie znaleziono firmy.')
      })
      .catch(() => setLoadingWorkers(false))
  }, [slugInput, slugConfirmed])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedWorker) return
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/worker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workerName: selectedWorker.name, pin, slug: slugInput }),
    })

    setLoading(false)

    if (res.ok) {
      const data = await res.json()
      localStorage.setItem('worker_name', selectedWorker.name)
      localStorage.setItem('worker_id', data.worker.id)
      localStorage.setItem('client_id', data.clientId)
      localStorage.setItem('client_slug', slugInput)
      router.push('/inspect/scan')
    } else {
      setError('Nieprawidłowy PIN. Spróbuj ponownie.')
      setPin('')
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <p className="text-2xl font-extrabold text-white text-center mb-2 tracking-tight">
          Recovo Inspect
        </p>
        <p className="text-zinc-500 text-sm text-center mb-10">
          Warehouse inspection tool
        </p>

        {/* Step 0 — enter company slug if not in URL */}
        {!slugConfirmed ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
              Kod firmy
            </p>
            <input
              type="text"
              value={slugInput}
              onChange={e => setSlugInput(e.target.value.toLowerCase().replace(/\s/g, '-'))}
              placeholder="np. fashion-brand"
              className="w-full h-14 rounded-xl bg-zinc-900 border border-zinc-700 text-white px-4 text-base focus:outline-none focus:border-[#E8512A] transition-colors"
            />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              onClick={() => { setError(''); setSlugConfirmed(true) }}
              disabled={!slugInput}
              className="w-full h-14 rounded-xl bg-[#E8512A] text-white font-bold text-base hover:bg-[#d14420] transition-colors disabled:opacity-40"
            >
              Dalej →
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            {/* Company badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#E8512A]" />
                <span className="text-zinc-400 text-xs font-mono">{slugInput}</span>
              </div>
              <button
                type="button"
                onClick={() => { setSlugConfirmed(false); setSelectedWorker(null); setWorkers([]); setPin(''); setError('') }}
                className="text-zinc-600 text-xs hover:text-zinc-400 transition"
              >
                zmień
              </button>
            </div>

            {/* Step 1: Select worker */}
            <div>
              <p className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wide">
                Kto pracuje dziś?
              </p>
              {loadingWorkers ? (
                <div className="flex justify-center py-4">
                  <div className="w-5 h-5 border-2 border-zinc-700 border-t-[#E8512A] rounded-full animate-spin" />
                </div>
              ) : workers.length === 0 ? (
                <p className="text-zinc-600 text-sm text-center py-4">
                  Brak pracowników. Dodaj ich w panelu klienta.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {workers.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setSelectedWorker(w)}
                      className={`w-full h-14 rounded-xl border text-white text-base font-semibold transition-all active:scale-95 ${
                        selectedWorker?.id === w.id
                          ? 'border-[#E8512A] bg-[#E8512A]/10 text-[#E8512A]'
                          : 'border-zinc-700 bg-zinc-900 hover:border-zinc-500'
                      }`}
                    >
                      {w.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: PIN */}
            {selectedWorker && (
              <div>
                <p className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wide">
                  Wprowadź PIN
                </p>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  autoFocus
                  className="w-full h-14 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-[#E8512A] transition-colors"
                  required
                />
                {error && (
                  <p className="text-red-400 text-sm text-center mt-2">{error}</p>
                )}
              </div>
            )}

            {selectedWorker && (
              <button
                type="submit"
                disabled={loading || pin.length < 4}
                className="w-full h-14 rounded-xl bg-[#E8512A] text-white text-base font-bold hover:bg-[#d14420] transition-colors disabled:opacity-40"
              >
                {loading ? 'Sprawdzanie…' : 'Zacznij inspekcję →'}
              </button>
            )}
          </form>
        )}

        <p className="text-zinc-600 text-xs text-center mt-10">
          Recovo Sp. z o.o. · Wysogotowo
        </p>
      </div>
    </div>
  )
}

export default function InspectLogin() {
  return (
    <Suspense>
      <InspectLoginForm />
    </Suspense>
  )
}
