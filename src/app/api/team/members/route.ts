// ─────────────────────────────────────────────────────────────────────
// TEAM MEMBERS API
//   GET    /api/team/members?slug=...           list dashboard members
//   PATCH  /api/team/members                    change role
//   DELETE /api/team/members?id=<membershipId>  remove member
// All operations enforce memberships + permissions.ts matrix.
// ─────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { supabaseService, getMembershipBySlug } from '@/lib/supabaseServer'
import { can, canManageMemberRole, type DashboardRole } from '@/lib/permissions'

type Membership = {
  id: string
  client_id: string
  user_id: string
  role: DashboardRole
  created_at: string
}

// ── GET: list members (+ pending invitations) ────────────────────────
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

  const actor = await getMembershipBySlug(slug)
  if (!actor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!can(actor.role, 'dashboard.view'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Load memberships
  const { data: members } = await supabaseService
    .from('memberships')
    .select('id, user_id, role, created_at')
    .eq('client_id', actor.clientId)
    .order('created_at', { ascending: true })

  // Enrich with email from auth.users (service role can read this)
  const userIds = (members ?? []).map((m) => m.user_id)
  const emailMap: Record<string, string> = {}
  if (userIds.length > 0) {
    const { data: authUsers } =
      await supabaseService.auth.admin.listUsers({ page: 1, perPage: 200 })
    for (const u of authUsers?.users ?? []) {
      if (userIds.includes(u.id)) emailMap[u.id] = u.email ?? ''
    }
  }

  const membersWithEmail = (members ?? []).map((m) => ({
    id: m.id,
    userId: m.user_id,
    email: emailMap[m.user_id] ?? '—',
    role: m.role as DashboardRole,
    createdAt: m.created_at,
    isYou: m.user_id === actor.userId,
  }))

  // Pending invitations
  const { data: invites } = await supabaseService
    .from('invitations')
    .select('id, email, role, expires_at, created_at')
    .eq('client_id', actor.clientId)
    .is('accepted_at', null)
    .order('created_at', { ascending: false })

  return NextResponse.json({
    role: actor.role,
    members: membersWithEmail,
    invitations: invites ?? [],
  })
}

// ── PATCH: change a member's role ────────────────────────────────────
export async function PATCH(req: NextRequest) {
  const { slug, membershipId, newRole } = await req.json()
  if (!slug || !membershipId || !newRole) {
    return NextResponse.json(
      { error: 'slug, membershipId, newRole required' },
      { status: 400 },
    )
  }
  if (!['owner', 'admin', 'manager'].includes(newRole)) {
    return NextResponse.json({ error: 'invalid role' }, { status: 400 })
  }

  const actor = await getMembershipBySlug(slug)
  if (!actor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!can(actor.role, 'team.changeRole'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data: target } = await supabaseService
    .from('memberships')
    .select('id, user_id, role, client_id')
    .eq('id', membershipId)
    .maybeSingle<Membership>()

  if (!target || target.client_id !== actor.clientId) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 })
  }

  if (!canManageMemberRole(actor.role, target.role)) {
    return NextResponse.json(
      { error: 'You cannot modify this member' },
      { status: 403 },
    )
  }

  // Only owners can promote someone to owner (and must transfer ownership —
  // there is only one owner per tenant).
  if (newRole === 'owner') {
    if (actor.role !== 'owner') {
      return NextResponse.json(
        { error: 'Only the current owner can transfer ownership' },
        { status: 403 },
      )
    }
    // Demote current owner to admin, promote target to owner — atomic-ish.
    await supabaseService
      .from('memberships')
      .update({ role: 'admin' })
      .eq('client_id', actor.clientId)
      .eq('role', 'owner')
    await supabaseService
      .from('memberships')
      .update({ role: 'owner' })
      .eq('id', membershipId)
    return NextResponse.json({ success: true, transferred: true })
  }

  const { error } = await supabaseService
    .from('memberships')
    .update({ role: newRole })
    .eq('id', membershipId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

// ── DELETE: remove member (or leave tenant) ──────────────────────────
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  const slug = req.nextUrl.searchParams.get('slug')
  if (!id || !slug)
    return NextResponse.json({ error: 'id and slug required' }, { status: 400 })

  const actor = await getMembershipBySlug(slug)
  if (!actor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: target } = await supabaseService
    .from('memberships')
    .select('id, user_id, role, client_id')
    .eq('id', id)
    .maybeSingle<Membership>()

  if (!target || target.client_id !== actor.clientId) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 })
  }

  // Self-removal: anyone can leave (except the sole owner)
  const isSelf = target.user_id === actor.userId
  if (!isSelf) {
    if (!can(actor.role, 'team.remove'))
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    if (!canManageMemberRole(actor.role, target.role))
      return NextResponse.json(
        { error: 'You cannot remove this member' },
        { status: 403 },
      )
  }

  // Block removing the last owner
  if (target.role === 'owner') {
    const { count } = await supabaseService
      .from('memberships')
      .select('id', { count: 'exact', head: true })
      .eq('client_id', actor.clientId)
      .eq('role', 'owner')
    if ((count ?? 0) <= 1) {
      return NextResponse.json(
        { error: 'Cannot remove the last owner — transfer ownership first' },
        { status: 400 },
      )
    }
  }

  const { error } = await supabaseService.from('memberships').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
