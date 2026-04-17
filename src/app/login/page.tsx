'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

/**
 * Best-effort home-slug lookup. Owners have `clients.user_id`, but invited
 * admins/managers live only in `memberships` — check both, newest first.
 */
async function resolveHomeSlug(userId: string): Promise<string | null> {
  const { data: owned } = await supabase
    .from('clients')
    .select('slug')
    .eq('user_id', userId)
    .maybeSingle()
  if (owned?.slug) return owned.slug

  const { data: membership } = await supabase
    .from('memberships')
    .select('client_id, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (!membership?.client_id) return null

  const { data: client } = await supabase
    .from('clients')
    .select('slug')
    .eq('id', membership.client_id)
    .maybeSingle()
  return client?.slug ?? null
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get('next') ?? ''
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(searchParams.get('error') === 'auth' ? 'Link wygasł lub jest nieprawidłowy.' : '')

  // If already logged in, redirect to `next` (e.g. invite flow) or their dashboard.
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      if (nextPath) {
        router.replace(nextPath)
        return
      }
      const slug = await resolveHomeSlug(user.id)
      if (slug) router.replace(`/dashboard/${slug}`)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (authError) {
      setError('Nieprawidłowy e-mail lub hasło.')
      setLoading(false)
      return
    }

    const userId = data.user?.id
    if (!userId) {
      setError('Błąd logowania. Spróbuj ponownie.')
      setLoading(false)
      return
    }

    // Honour ?next=… (e.g. invite accept flow) before home-slug lookup —
    // invited members might not own a client.
    if (nextPath) {
      router.push(nextPath)
      return
    }

    const slug = await resolveHomeSlug(userId)
    if (!slug) {
      setError('Nie znaleziono konta. Skontaktuj się z pomocą.')
      setLoading(false)
      return
    }

    router.push(`/dashboard/${slug}`)
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <p className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Recovo</p>
          </Link>
          <p className="text-gray-500 text-sm mt-1">Panel klienta</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-xl font-bold text-[#1A1A1A] mb-6">Zaloguj się</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                E-mail
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
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Twoje hasło"
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
              {loading ? 'Logowanie…' : 'Zaloguj się →'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Nie masz konta?{' '}
            <Link href="/register" className="text-[#E8512A] font-medium hover:underline">
              Zarejestruj się za darmo
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Szukasz logowania dla pracownika?{' '}
          <Link href="/inspect" className="hover:underline text-gray-500">
            Przejdź do Inspect
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
