import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { canCreateInspection, blockResponse, type ClientRow } from '@/lib/planEnforcement'

// Server-side client with service role (bypasses RLS for inspection writes
// authenticated via worker PIN — we enforce at app level via slug + PIN).
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const CLIENT_COLS =
  'id, name, slug, plan, trial_ends_at, plan_period_end, workers_grace_started_at, inspections_grace_started_at'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const clientSlug = searchParams.get('client_slug')
  const dateFrom = searchParams.get('date_from')
  const dateTo = searchParams.get('date_to')
  const grade = searchParams.get('grade')

  if (!clientSlug) {
    return NextResponse.json({ error: 'client_slug required' }, { status: 400 })
  }

  const { data: client } = await supabase
    .from('clients')
    .select('id, name, slug')
    .eq('slug', clientSlug)
    .single()

  if (!client) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  }

  let query = supabase
    .from('inspections')
    .select('*')
    .eq('client_id', client.id)
    .order('created_at', { ascending: false })

  if (dateFrom) query = query.gte('created_at', dateFrom)
  if (dateTo) query = query.lte('created_at', dateTo + 'T23:59:59')
  if (grade && grade !== 'all') query = query.eq('grade', grade)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ client, inspections: data })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Resolve client_id: either passed directly or via slug
    let clientId: string | null = body.client_id ?? null
    let slug: string | null = body.client_slug ?? null

    if (!clientId && !slug) {
      return NextResponse.json(
        { error: 'client_id or client_slug required' },
        { status: 400 },
      )
    }

    let client: ClientRow | null = null
    if (clientId) {
      const { data } = await supabase
        .from('clients')
        .select(CLIENT_COLS)
        .eq('id', clientId)
        .maybeSingle<ClientRow & { name: string; slug: string }>()
      client = data
    } else if (slug) {
      const { data } = await supabase
        .from('clients')
        .select(CLIENT_COLS)
        .eq('slug', slug)
        .maybeSingle<ClientRow & { name: string; slug: string }>()
      client = data
      clientId = client?.id ?? null
    }

    if (!client || !clientId) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // ── Plan enforcement (grace-aware) ───────────────────────────────
    const check = await canCreateInspection(supabase, client)
    if (!check.ok) {
      const { status, body: blockBody } = blockResponse(check)
      return NextResponse.json(blockBody, { status })
    }

    // Strip slug-only fields from body; ensure client_id is set
    const insertBody: Record<string, unknown> = { ...body, client_id: clientId }
    delete insertBody.client_slug

    const { data, error } = await supabase
      .from('inspections')
      .insert([insertBody])
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const warning =
      check.status === 'grace'
        ? {
            type: 'grace',
            daysLeft: check.daysLeft,
            used: check.used + 1,
            limit: check.limit,
            graceCap: check.graceCap,
          }
        : check.status === 'warn'
          ? { type: 'warn', used: check.used + 1, limit: check.limit }
          : null

    return NextResponse.json({ inspection: data, warning })
  } catch (err) {
    console.error('POST /api/inspections error:', err)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
