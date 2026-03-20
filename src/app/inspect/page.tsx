'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const WORKERS = ['Pracownik 1', 'Pracownik 2', 'Pracownik 3']

export default function InspectLogin() {
  const router = useRouter()
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedWorker) return
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/worker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    })

    setLoading(false)

    if (res.ok) {
      localStorage.setItem('worker_name', selectedWorker)
      router.push('/inspect/scan')
    } else {
      setError('Incorrect PIN. Try again.')
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

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          {/* Step 1: Select worker */}
          <div>
            <p className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wide">
              Who&apos;s working today?
            </p>
            <div className="flex flex-col gap-2">
              {WORKERS.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setSelectedWorker(w)}
                  className={`w-full h-14 rounded-xl border text-white text-base font-semibold transition-all active:scale-95 ${
                    selectedWorker === w
                      ? 'border-[#E8512A] bg-[#E8512A]/10 text-[#E8512A]'
                      : 'border-zinc-700 bg-zinc-900 hover:border-zinc-500'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: PIN */}
          {selectedWorker && (
            <div>
              <p className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wide">
                Enter PIN
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
              className="w-full h-14 rounded-xl bg-[#E8512A] text-white text-base font-bold hover:bg-[#d4471f] transition-colors disabled:opacity-40"
            >
              {loading ? 'Checking...' : 'Start inspecting →'}
            </button>
          )}
        </form>

        <p className="text-zinc-600 text-xs text-center mt-10">
          Recovo Sp. z o.o. · Wysogotowo
        </p>
      </div>
    </div>
  )
}
