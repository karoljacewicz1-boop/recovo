// ─────────────────────────────────────────────────────────────────────
// Server-side Supabase helpers
//   • supabaseService      — bypasses RLS (service role)
//   • supabaseRouteClient  — cookie-aware, respects Auth session (for
//                            API routes that need to know WHO is calling)
// ─────────────────────────────────────────────────────────────────────

import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? SUPABASE_ANON_KEY

/** Service-role client — bypasses RLS. Use only in trusted server code. */
export const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

/**
 * Cookie-aware client for Route Handlers / Server Components.
 * Uses the user's Auth session (auth.uid() populated) — RLS applies.
 */
export function supabaseRouteClient() {
  const store = cookies()
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get: (name: string) => store.get(name)?.value,
      // API routes can write auth cookies via NextResponse; for read-only
      // usage these no-op setters are fine.
      set: () => {},
      remove: () => {},
    },
  })
}

/** Resolve the current user id from session cookies; null if unauthenticated. */
export async function getSessionUserId(): Promise<string | null> {
  const supabase = supabaseRouteClient()
  const { data } = await supabase.auth.getUser()
  return data.user?.id ?? null
}

/**
 * Resolve membership of the current user in a given client (by slug).
 * Returns { clientId, role } or null if not a member / not found.
 */
export async function getMembershipBySlug(slug: string): Promise<
  | { clientId: string; role: 'owner' | 'admin' | 'manager'; userId: string }
  | null
> {
  const userId = await getSessionUserId()
  if (!userId) return null

  const { data: client } = await supabaseService
    .from('clients')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()
  if (!client) return null

  const { data: m } = await supabaseService
    .from('memberships')
    .select('role')
    .eq('client_id', client.id)
    .eq('user_id', userId)
    .maybeSingle()

  if (!m) return null
  return {
    clientId: client.id,
    role: m.role as 'owner' | 'admin' | 'manager',
    userId,
  }
}
