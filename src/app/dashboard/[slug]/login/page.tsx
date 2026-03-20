'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function DashboardLogin() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // demo-brand always works with password "demo"
    const res = await fetch('/api/auth/dashboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, password }),
    })

    setLoading(false)

    if (res.ok) {
      localStorage.setItem(`recovo_auth_${slug}`, '1')
      router.push(`/dashboard/${slug}`)
    } else {
      setError('Incorrect password. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="text-2xl font-extrabold text-[#1A1A1A] text-center mb-1 tracking-tight">
          Recovo
        </p>
        <p className="text-sm text-gray-400 text-center mb-10">
          Client Dashboard
        </p>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h1 className="text-lg font-bold text-[#1A1A1A] mb-1">
            Sign in
          </h1>
          <p className="text-sm text-gray-400 mb-6 capitalize">
            {slug.replace(/-/g, ' ')}
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:border-[#E8512A] transition-colors"
                autoFocus
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[#E8512A] text-white text-sm font-bold hover:bg-[#d4471f] transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          Recovo Sp. z o.o. · Wysogotowo, Poland
        </p>
      </div>
    </div>
  )
}
