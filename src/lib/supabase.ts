import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ── Browser client (React components / client components) ──────────────────
export const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ── Simple client (no cookie handling) for server-side DB queries ──────────
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
