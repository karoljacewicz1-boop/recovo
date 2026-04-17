'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Preview =
  | { ok: true; email: string; role: 'admin' | 'manager'; expiresAt: string; client: { name: string; slug: string } | null }
  | { ok: false; message: string; expired?: boolean; accepted?: boolean }

type Step = 'loading' | 'preview' | 'signup' | 'accepting' | 'done' | 'error'

const ROLE_LABEL: Record<'admin' | 'manager', string> = {
  admin: 'Administrator',
  manager: 'Manager',
}

export default function InviteAcceptPage() {
  const { token } = useParams() as { token: string }
  const router = useRouter()
  const [step, setStep] = useState<Step>('loading')
  const [preview, setPreview] = useState<Preview | null>(null)
  const [sessionEmail, setSessionEmail] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupBusy, setSignupBusy] = useState(false)

  // 1. Load invite preview + current session email in parallel.
  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch(`/api/team/accept?token=${encodeURIComponent(token)}`).then(async (r) => {
        const data = await r.json()
        if (!r.ok) {
          return {
            ok: false as const,
            message: data.error ?? 'Nie udało się wczytać zaproszenia.',
            expired: !!data.expired,
            accepted: !!data.accepted,
          }
        }
        return { ok: true as const, ...data }
      }),
      supabase.auth.getUser().then(({ data }) => data.user?.email ?? null),
    ]).then(([p, email]) => {
      if (cancelled) return
      setPreview(p)
      setSessionEmail(email)
      setStep(p.ok ? 'preview' : 'error')
    })
    return () => {
      cancelled = true
    }
  }, [token])

  // 2. Accept handler — only callable once signed in with matching email.
  const handleAccept = useCallback(async () => {
    setStep('accepting')
    setError('')
    const res = await fetch('/api/team/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Nie udało się zaakceptować zaproszenia.')
      setStep('preview')
      return
    }
    setStep('done')
    // Give the user a moment to read the success message.
    setTimeout(() => {
      if (data.slug) router.push(`/dashboard/${data.slug}`)
    }, 1200)
  }, [token, router])

  // 3. Auto-accept if already signed in with matching email.
  useEffect(() => {
    if (step !== 'preview' || !preview?.ok || !sessionEmail) return
    if (sessionEmail.toLowerCase() === preview.email.toLowerCase()) {
      handleAccept()
    }
  }, [step, preview, sessionEmail, handleAccept])

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!preview?.ok) return
    if (signupPassword.length < 8) {
      setError('Hasło musi mieć min. 8 znaków.')
      return
    }
    setSignupBusy(true)
    setError('')

    const res = await fetch('/api/auth/invitee-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password: signupPassword }),
    })
    const data = await res.json()

    if (!res.ok) {
      setSignupBusy(false)
      if (data.existingUser) {
        setError(
          'Konto z tym e-mailem już istnieje — zaloguj się zamiast rejestrować.',
        )
      } else {
        setError(data.error ?? 'Nie udało się założyć konta.')
      }
      return
    }

    // Sign in with the freshly-created user.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: preview.email,
      password: signupPassword,
    })
    if (signInError) {
      setSignupBusy(false)
      setError('Konto utworzone, ale logowanie się nie powiodło. Spróbuj ponownie.')
      return
    }

    setSessionEmail(preview.email)
    setSignupBusy(false)
    // handleAccept is kicked off by the auto-accept useEffect below once
    // sessionEmail matches.
  }

  // ── Rendering ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <p className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Recovo</p>
          </Link>
          <p className="text-gray-500 text-sm mt-1">Zaproszenie do zespołu</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {step === 'loading' && (
            <div className="flex flex-col items-center py-8">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-[#E8512A] rounded-full animate-spin mb-4" />
              <p className="text-sm text-gray-500">Wczytuję zaproszenie…</p>
            </div>
          )}

          {step === 'error' && preview && !preview.ok && (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-lg font-bold text-[#1A1A1A] mb-2">
                {preview.accepted
                  ? 'Zaproszenie już użyte'
                  : preview.expired
                    ? 'Zaproszenie wygasło'
                    : 'Zaproszenie nieprawidłowe'}
              </h1>
              <p className="text-sm text-gray-600 mb-6">{preview.message}</p>
              <Link
                href="/login"
                className="inline-block bg-[#1A1A1A] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-black transition"
              >
                Przejdź do logowania
              </Link>
            </div>
          )}

          {(step === 'preview' || step === 'accepting' || step === 'signup') && preview?.ok && (
            <>
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">
                {preview.client?.name ? (
                  <>
                    Dołącz do <span className="text-[#E8512A]">{preview.client.name}</span>
                  </>
                ) : (
                  'Zaproszenie do tenantu'
                )}
              </h1>
              <p className="text-sm text-gray-500 mb-6">
                Rola: <span className="font-semibold text-[#1A1A1A]">{ROLE_LABEL[preview.role]}</span>
                {' · '}
                e-mail:{' '}
                <span className="font-mono text-[#1A1A1A]">{preview.email}</span>
              </p>

              {/* Already signed in, emails match → auto-accepting */}
              {sessionEmail &&
                sessionEmail.toLowerCase() === preview.email.toLowerCase() && (
                  <div className="flex items-center gap-3 py-4">
                    <div className="w-5 h-5 border-2 border-gray-200 border-t-[#E8512A] rounded-full animate-spin" />
                    <p className="text-sm text-gray-600">Akceptowanie zaproszenia…</p>
                  </div>
                )}

              {/* Signed in under wrong email */}
              {sessionEmail &&
                sessionEmail.toLowerCase() !== preview.email.toLowerCase() && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 mb-4">
                    Jesteś zalogowany jako <span className="font-mono">{sessionEmail}</span>, ale
                    zaproszenie jest na adres <span className="font-mono">{preview.email}</span>.
                    Wyloguj się i zaloguj na poprawny e-mail.
                    <button
                      onClick={async () => {
                        await supabase.auth.signOut()
                        setSessionEmail(null)
                      }}
                      className="block mt-2 text-amber-900 font-semibold underline"
                    >
                      Wyloguj się
                    </button>
                  </div>
                )}

              {/* Not signed in — two paths */}
              {!sessionEmail && step !== 'signup' && (
                <div className="space-y-3 pt-2">
                  <Link
                    href={`/login?next=/invite/${token}`}
                    className="block text-center w-full bg-[#E8512A] hover:bg-[#D4431F] text-white font-semibold py-3 rounded-xl text-sm transition"
                  >
                    Mam już konto — zaloguj się
                  </Link>
                  <button
                    onClick={() => {
                      setError('')
                      setStep('signup')
                    }}
                    className="block w-full border border-gray-200 hover:border-[#E8512A] text-[#1A1A1A] font-semibold py-3 rounded-xl text-sm transition"
                  >
                    Utwórz konto
                  </button>
                  <p className="text-xs text-gray-400 text-center pt-2">
                    E-mail konta zostanie zablokowany na{' '}
                    <span className="font-mono">{preview.email}</span>.
                  </p>
                </div>
              )}

              {/* Inline sign-up (invitee — no company, just password) */}
              {!sessionEmail && step === 'signup' && (
                <form onSubmit={handleSignup} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={preview.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Ustaw hasło
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      autoFocus
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Minimum 8 znaków"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8512A]/20 focus:border-[#E8512A] transition"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={signupBusy}
                    className="w-full bg-[#E8512A] hover:bg-[#D4431F] text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-60"
                  >
                    {signupBusy ? 'Tworzenie konta…' : 'Utwórz konto i dołącz'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('preview')
                      setError('')
                    }}
                    className="block w-full text-xs text-gray-400 hover:text-gray-600 py-1"
                  >
                    Wróć
                  </button>
                </form>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 mt-4">
                  {error}
                </div>
              )}
            </>
          )}

          {step === 'done' && preview?.ok && (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-lg font-bold text-[#1A1A1A] mb-2">Zaproszenie zaakceptowane</h1>
              <p className="text-sm text-gray-500">Przekierowuję do panelu…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
