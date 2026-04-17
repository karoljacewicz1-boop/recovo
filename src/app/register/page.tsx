'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get('next') ?? ''
  const prefilledEmail = searchParams.get('email') ?? ''

  const [form, setForm] = useState({
    company: '',
    email: prefilledEmail,
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Keep email input in sync if the query param changes (rare, but cheap).
  useEffect(() => {
    if (prefilledEmail) setForm((f) => ({ ...f, email: prefilledEmail }))
  }, [prefilledEmail])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 1. Create user + client via server API
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Błąd rejestracji.')
      setLoading(false)
      return
    }

    const { slug } = data

    // 2. Sign in (since admin.createUser with email_confirm:true creates confirmed user)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (signInError) {
      // User created but sign-in failed — send to login, preserving `next`.
      router.push(
        `/login?next=${encodeURIComponent(nextPath || `/dashboard/${slug}`)}`,
      )
      return
    }

    router.push(nextPath || `/dashboard/${slug}`)
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <p className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Recovo</p>
          </Link>
          <p className="text-gray-500 text-sm mt-1">Rozpocznij 14-dniowy trial — bez karty kredytowej</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-xl font-bold text-[#1A1A1A] mb-6">Zarejestruj firmę</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Nazwa firmy
              </label>
              <input
                type="text"
                required
                value={form.company}
                onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                placeholder="np. Fashion Brand sp. z o.o."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8512A]/20 focus:border-[#E8512A] transition"
              />
              {form.company && (
                <p className="text-xs text-gray-400 mt-1">
                  Twój URL: /dashboard/<span className="text-[#E8512A] font-medium">{slugify(form.company)}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                E-mail służbowy
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="karol@marka.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8512A]/20 focus:border-[#E8512A] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Hasło
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Minimum 8 znaków"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8512A]/20 focus:border-[#E8512A] transition"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E8512A] hover:bg-[#D4431F] text-white font-semibold py-3.5 rounded-xl text-sm transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Tworzenie konta…' : 'Rozpocznij trial →'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="flex items-start gap-3 text-xs text-gray-500">
              <span className="text-[#E8512A] text-base mt-0.5">✓</span>
              <span>14 dni za darmo — bez karty kredytowej</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-gray-500 mt-2">
              <span className="text-[#E8512A] text-base mt-0.5">✓</span>
              <span>Pełny dostęp do wszystkich funkcji podczas trialu</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-gray-500 mt-2">
              <span className="text-[#E8512A] text-base mt-0.5">✓</span>
              <span>Możesz anulować w dowolnym momencie</span>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-5">
            Masz już konto?{' '}
            <Link
              href={`/login${nextPath ? `?next=${encodeURIComponent(nextPath)}` : ''}`}
              className="text-[#E8512A] font-medium hover:underline"
            >
              Zaloguj się
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Rejestrując się, akceptujesz{' '}
          <Link href="/terms" className="hover:underline">Regulamin</Link>
          {' '}i{' '}
          <Link href="/privacy" className="hover:underline">Politykę prywatności</Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}
