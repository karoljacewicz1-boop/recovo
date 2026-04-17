import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service role bypasses RLS — used only in server API routes
const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function POST(req: NextRequest) {
  try {
    const { company, email, password } = await req.json()

    const slug = slugify(company ?? '')
    if (!slug) {
      return NextResponse.json({ error: 'Nieprawidłowa nazwa firmy.' }, { status: 400 })
    }

    // 1. Check slug availability
    const { data: existing } = await supabaseService
      .from('clients')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'Firma o tej nazwie już istnieje. Wybierz inną nazwę.' },
        { status: 409 }
      )
    }

    // 2. Create Supabase Auth user
    const { data: authData, error: authError } = await supabaseService.auth.admin.createUser({
      email,
      password,
      email_confirm: true,   // skip email verification for now (change to false to require it)
      user_metadata: { company, slug },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const userId = authData.user.id

    // 3. Create client record
    const { error: clientError } = await supabaseService.from('clients').insert({
      name: company,
      slug,
      user_id: userId,
      trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      plan: 'trial',
    })

    if (clientError) {
      // Roll back auth user
      await supabaseService.auth.admin.deleteUser(userId)
      return NextResponse.json({ error: 'Błąd tworzenia konta: ' + clientError.message }, { status: 500 })
    }

    return NextResponse.json({ slug })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Nieznany błąd' }, { status: 500 })
  }
}
