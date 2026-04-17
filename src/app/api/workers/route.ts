import { NextRequest, NextResponse } from 'next/server'
import { canAddWorker, blockResponse, type ClientRow } from '@/lib/planEnforcement'
import { supabaseService, getMembershipBySlug } from '@/lib/supabaseServer'
import { can } from '@/lib/permissions'

const CLIENT_COLS =
  'id, plan, trial_ends_at, plan_period_end, workers_grace_started_at, inspections_grace_started_at'

// ─────────────────────────────────────────────────────────────────────
// NB: The Inspect login page (/inspect) calls GET with no session — it just
// needs the worker list to render the "who's working today?" buttons. We
// intentionally allow the unauthenticated GET, but the list returned is only
// non-sensitive fields (id, name, role). All mutating verbs require auth.
// ─────────────────────────────────────────────────────────────────────

// GET /api/workers?slug=fashion-brand — public list for the Inspect tool
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

  const { data: client } = await supabaseService
    .from('clients').select('id').eq('slug', slug).maybeSingle()
  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

  const { data: workers } = await supabaseService
    .from('workers')
    .select('id, name, role, created_at')
    .eq('client_id', client.id)
    .order('name')

  return NextResponse.json({ workers: workers ?? [] })
}

// POST /api/workers — add worker (auth + permission + plan enforcement)
export async function POST(req: NextRequest) {
  const { slug, name, pin, role = 'worker' } = await req.json()
  if (!slug || !name || !pin) {
    return NextResponse.json({ error: 'slug, name, pin required' }, { status: 400 })
  }

  const actor = await getMembershipBySlug(slug)
  if (!actor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!can(actor.role, 'workers.create'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data: client } = await supabaseService
    .from('clients')
    .select(CLIENT_COLS)
    .eq('id', actor.clientId)
    .maybeSingle<ClientRow>()
  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

  // ── Plan enforcement (grace-aware) ─────────────────────────────────
  const check = await canAddWorker(supabaseService, client)
  if (!check.ok) {
    const { status, body } = blockResponse(check)
    return NextResponse.json(body, { status })
  }

  const { data, error } = await supabaseService
    .from('workers')
    .insert({ client_id: actor.clientId, name, pin, role })
    .select('id, name, role, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Propagate grace warning in response body so the UI can surface it
  const graceWarning =
    check.status === 'grace'
      ? {
          type: 'grace',
          daysLeft: check.daysLeft,
          used: check.used,
          limit: check.limit,
          graceCap: check.graceCap,
        }
      : check.status === 'warn'
        ? { type: 'warn', used: check.used, limit: check.limit, remaining: check.remaining }
        : null

  return NextResponse.json({ worker: data, warning: graceWarning })
}

// DELETE /api/workers?id=uuid&slug=...
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  const slug = req.nextUrl.searchParams.get('slug')
  if (!id || !slug)
    return NextResponse.json({ error: 'id and slug required' }, { status: 400 })

  const actor = await getMembershipBySlug(slug)
  if (!actor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!can(actor.role, 'workers.delete'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Scope delete to caller's tenant — stop cross-tenant worker deletion.
  const { data: target } = await supabaseService
    .from('workers')
    .select('id, client_id')
    .eq('id', id)
    .maybeSingle()
  if (!target || target.client_id !== actor.clientId)
    return NextResponse.json({ error: 'Worker not found' }, { status: 404 })

  const { error } = await supabaseService.from('workers').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

// PATCH /api/workers — update PIN or name (requires slug for tenant scoping)
export async function PATCH(req: NextRequest) {
  const { id, pin, name, slug } = await req.json()
  if (!id || !slug)
    return NextResponse.json({ error: 'id and slug required' }, { status: 400 })

  const actor = await getMembershipBySlug(slug)
  if (!actor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!can(actor.role, 'workers.update'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data: target } = await supabaseService
    .from('workers')
    .select('id, client_id')
    .eq('id', id)
    .maybeSingle()
  if (!target || target.client_id !== actor.clientId)
    return NextResponse.json({ error: 'Worker not found' }, { status: 404 })

  const update: Record<string, string> = {}
  if (pin) update.pin = pin
  if (name) update.name = name

  const { data, error } = await supabaseService
    .from('workers')
    .update(update)
    .eq('id', id)
    .select('id, name, role, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ worker: data })
}
