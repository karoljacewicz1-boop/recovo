// ─────────────────────────────────────────────────────────────────────
// PLAN ENFORCEMENT WITH GRACE
// Grace policy:
//   • Workers:     +1 extra seat allowed for 7 days once you hit the cap.
//   • Inspections: +10% (or min +5) allowed for 7 days from first over-period.
//   • Beyond grace cap or past 7 days → hard block (402 Payment Required).
//   • Trial: same limits as plan; expiry turns everything into hard block.
// ─────────────────────────────────────────────────────────────────────

import { SupabaseClient } from '@supabase/supabase-js'
import { getPlan, PlanId } from './plans'

export type ClientRow = {
  id: string
  plan: string | null
  trial_ends_at: string | null
  plan_period_end: string | null
  workers_grace_started_at: string | null
  inspections_grace_started_at: string | null
}

export const GRACE_DAYS = 7
export const WORKERS_GRACE_EXTRA = 1
export const INSPECTIONS_GRACE_PCT = 0.10
export const INSPECTIONS_GRACE_MIN = 5

export type EnforcementResult =
  | { ok: true; status: 'under'; remaining: number }
  | { ok: true; status: 'warn'; remaining: number; used: number; limit: number } // 80%+
  | { ok: true; status: 'grace'; daysLeft: number; used: number; limit: number; graceCap: number }
  | { ok: false; status: 'trial_expired' }
  | { ok: false; status: 'hard_blocked'; used: number; limit: number; graceCap: number }

// ── Time helpers ─────────────────────────────────────────────────────
function isTrialExpired(client: ClientRow): boolean {
  if (client.plan && client.plan !== 'trial') return false
  if (!client.trial_ends_at) return false
  return new Date(client.trial_ends_at).getTime() < Date.now()
}

function periodStart(client: ClientRow): Date {
  if (client.plan_period_end) {
    const end = new Date(client.plan_period_end)
    return new Date(end.getTime() - 30 * 86400000)
  }
  const d = new Date()
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}

// ── Count helpers ────────────────────────────────────────────────────
async function countWorkers(supabase: SupabaseClient, clientId: string): Promise<number> {
  const { count } = await supabase
    .from('workers')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', clientId)
  return count ?? 0
}

async function countInspectionsThisPeriod(
  supabase: SupabaseClient,
  client: ClientRow,
): Promise<number> {
  const from = periodStart(client).toISOString()
  const { count } = await supabase
    .from('inspections')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', client.id)
    .gte('created_at', from)
  return count ?? 0
}

// ── Generic enforcer ─────────────────────────────────────────────────
type Resource = 'workers' | 'inspections'

async function evaluate(
  supabase: SupabaseClient,
  client: ClientRow,
  resource: Resource,
): Promise<EnforcementResult> {
  if (isTrialExpired(client)) {
    return { ok: false, status: 'trial_expired' }
  }

  const plan = getPlan(client.plan as PlanId)
  const used =
    resource === 'workers'
      ? await countWorkers(supabase, client.id)
      : await countInspectionsThisPeriod(supabase, client)
  const limit = resource === 'workers' ? plan.workerLimit : plan.inspectionLimit

  // Unlimited plan (Scale, trial)
  if (limit >= 999) {
    return { ok: true, status: 'under', remaining: limit - used }
  }

  // Grace caps
  const graceCap =
    resource === 'workers'
      ? limit + WORKERS_GRACE_EXTRA
      : limit + Math.max(INSPECTIONS_GRACE_MIN, Math.ceil(limit * INSPECTIONS_GRACE_PCT))

  // Still under the hard limit
  if (used < limit) {
    const pct = used / limit
    if (pct >= 0.8) return { ok: true, status: 'warn', remaining: limit - used, used, limit }
    return { ok: true, status: 'under', remaining: limit - used }
  }

  // At or over limit — check grace
  const graceStartedAt =
    resource === 'workers'
      ? client.workers_grace_started_at
      : client.inspections_grace_started_at

  // First time hitting limit → start grace clock
  if (!graceStartedAt) {
    const field =
      resource === 'workers' ? 'workers_grace_started_at' : 'inspections_grace_started_at'
    await supabase.from('clients').update({ [field]: new Date().toISOString() }).eq('id', client.id)
    if (used >= graceCap) {
      return { ok: false, status: 'hard_blocked', used, limit, graceCap }
    }
    return { ok: true, status: 'grace', daysLeft: GRACE_DAYS, used, limit, graceCap }
  }

  // Grace already running
  const daysElapsed = daysSince(graceStartedAt)
  const daysLeft = Math.max(0, GRACE_DAYS - daysElapsed)

  if (used >= graceCap || daysLeft <= 0) {
    return { ok: false, status: 'hard_blocked', used, limit, graceCap }
  }
  return { ok: true, status: 'grace', daysLeft, used, limit, graceCap }
}

/** Called by POST /api/workers BEFORE insert. */
export async function canAddWorker(
  supabase: SupabaseClient,
  client: ClientRow,
): Promise<EnforcementResult> {
  return evaluate(supabase, client, 'workers')
}

/** Called by POST /api/inspections BEFORE insert. */
export async function canCreateInspection(
  supabase: SupabaseClient,
  client: ClientRow,
): Promise<EnforcementResult> {
  return evaluate(supabase, client, 'inspections')
}

/** Read current usage status without side-effects — used for banners. */
export async function getUsageSnapshot(supabase: SupabaseClient, client: ClientRow) {
  const plan = getPlan(client.plan as PlanId)
  const [workers, inspections] = await Promise.all([
    countWorkers(supabase, client.id),
    countInspectionsThisPeriod(supabase, client),
  ])
  return {
    plan: plan.id,
    planName: plan.name,
    trialExpired: isTrialExpired(client),
    workers: {
      used: workers,
      limit: plan.workerLimit,
      pct: plan.workerLimit >= 999 ? 0 : workers / plan.workerLimit,
      graceStartedAt: client.workers_grace_started_at,
      graceDaysLeft: client.workers_grace_started_at
        ? Math.max(0, GRACE_DAYS - daysSince(client.workers_grace_started_at))
        : null,
    },
    inspections: {
      used: inspections,
      limit: plan.inspectionLimit,
      pct: plan.inspectionLimit >= 9999 ? 0 : inspections / plan.inspectionLimit,
      graceStartedAt: client.inspections_grace_started_at,
      graceDaysLeft: client.inspections_grace_started_at
        ? Math.max(0, GRACE_DAYS - daysSince(client.inspections_grace_started_at))
        : null,
    },
  }
}

/** HTTP response body helper for blocked requests. */
export function blockResponse(result: EnforcementResult) {
  if (result.ok) throw new Error('blockResponse called on ok result')
  if (result.status === 'trial_expired') {
    return {
      status: 402,
      body: {
        error: 'trial_expired',
        message: 'Okres próbny wygasł. Wybierz plan, aby kontynuować.',
      },
    }
  }
  return {
    status: 402,
    body: {
      error: 'plan_limit',
      message: `Osiągnięto maksymalny limit Twojego planu (${result.used}/${result.limit}, grace cap ${result.graceCap}). Przejdź wyższy plan, aby kontynuować.`,
      used: result.used,
      limit: result.limit,
      graceCap: result.graceCap,
    },
  }
}
