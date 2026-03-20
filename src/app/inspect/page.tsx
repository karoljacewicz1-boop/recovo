'use client'

import { useRouter } from 'next/navigation'

const WORKERS = ['Pracownik 1', 'Pracownik 2', 'Pracownik 3']

export default function InspectLogin() {
  const router = useRouter()

  function handleWorker(name: string) {
    localStorage.setItem('worker_name', name)
    router.push('/inspect/scan')
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <p className="text-2xl font-extrabold text-white text-center mb-2 tracking-tight">
          Recovo Inspect
        </p>
        <p className="text-zinc-500 text-sm text-center mb-12">
          Warehouse inspection tool
        </p>

        <h1 className="text-xl font-bold text-white mb-6 text-center">
          Who&apos;s working today?
        </h1>

        <div className="flex flex-col gap-3">
          {WORKERS.map((w) => (
            <button
              key={w}
              onClick={() => handleWorker(w)}
              className="w-full h-16 rounded-xl border border-zinc-700 bg-zinc-900 text-white text-base font-semibold hover:border-[#E8512A] hover:bg-zinc-800 transition-all active:scale-95"
            >
              {w}
            </button>
          ))}
        </div>

        <p className="text-zinc-600 text-xs text-center mt-10">
          Recovo Sp. z o.o. · Wysogotowo
        </p>
      </div>
    </div>
  )
}
