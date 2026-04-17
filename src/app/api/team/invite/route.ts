// ─────────────────────────────────────────────────────────────────────
// INVITATIONS API
//   POST   /api/team/invite   create invitation (returns link to share)
//   DELETE /api/team/invite?id=<invitationId>   revoke pending invitation
// Permission matrix enforced via permissions.ts.
// ─────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { supabaseService, getMembershipBySlug } from '@/lib/supabaseServer'
import { can, invitableRolesFor, type DashboardRole } from '@/lib/permissions'

function generateToken(): string {
  // 32 bytes → 43 chars base64url — URL-safe, unguessable.
  return randomBytes(32).toString('base64url')
}

function inviteLink(req: NextRequest, token: string): string {
  const origin =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ??
    req.nextUrl.origin
  return `${origin}/invite/${token}`
}

// ── POST: create invitation ──────────────────────────────────────────
export async function POST(req: NextRequest) {
  const { slug, email, role } = await req.json().catch(() => ({}))
  if (!slug || !email || !role) {
    return NextResponse.json(
      { error: 'slug, email, role required' },
      { status: 400 },
    )
  }
  const normalizedEmail = String(email).trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }
  if (!['admin', 'manager'].includes(role)) {
    return NextResponse.json(
      { error: 'role must be admin or manager' },
      { status: 400 },
    )
  }

  const actor = await getMembershipBySlug(slug)
  if (!actor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!can(actor.role, 'team.invite'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Managers can only invite managers; only owner/admin can invite admins.
  const allowed = invitableRolesFor(actor.role)
  if (!allowed.includes(role as DashboardRole)) {
    return NextResponse.json(
      { error: `Your role cannot invite a ${role}` },
      { status: 403 },
    )
  }

  // Is this email already a member of this tenant? (Look up via auth.admin.)
  const { data: authUsers } = await supabaseService.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  })
  const existingUser = (authUsers?.users ?? []).find(
    (u) => u.email?.toLowerCase() === normalizedEmail,
  )
  if (existingUser) {
    const { data: existingMembership } = await supabaseService
      .from('memberships')
      .select('id')
      .eq('client_id', actor.clientId)
      .eq('user_id', existingUser.id)
      .maybeSingle()
    if (existingMembership) {
      return NextResponse.json(
        { error: 'This user is already a member of this tenant' },
        { status: 409 },
      )
    }
  }

  // Is there already a pending invitation for this email + tenant? If yes,
  // refresh its token + expiry rather than creating a duplicate.
  const { data: existingInvite } = await supabaseService
    .from('invitations')
    .select('id')
    .eq('client_id', actor.clientId)
    .ilike('email', normalizedEmail)
    .is('accepted_at', null)
    .maybeSingle()

  const token = generateToken()
  const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()

  if (existingInvite) {
    const { data, error } = await supabaseService
      .from('invitations')
      .update({
        role,
        token,
        expires_at: expiresAt,
        invited_by: actor.userId,
      })
      .eq('id', existingInvite.id)
      .select('id, email, role, expires_at')
      .single()
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({
      invitation: data,
      link: inviteLink(req, token),
      refreshed: true,
    })
  }

  const { data, error } = await supabaseService
    .from('invitations')
    .insert({
      client_id: actor.clientId,
      email: normalizedEmail,
      role,
      token,
      invited_by: actor.userId,
      expires_at: expiresAt,
    })
    .select('id, email, role, expires_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    invitation: data,
    link: inviteLink(req, token),
  })
}

// ── DELETE: revoke pending invitation ────────────────────────────────
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  const slug = req.nextUrl.searchParams.get('slug')
  if (!id || !slug)
    return NextResponse.json({ error: 'id and slug required' }, { status: 400 })

  const actor = await getMembershipBySlug(slug)
  if (!actor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!can(actor.role, 'team.invite'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Scope delete to this tenant (prevents cross-tenant revocation via guessed id).
  const { data: target } = await supabaseService
    .from('invitations')
    .select('id, client_id, accepted_at')
    .eq('id', id)
    .maybeSingle()
  if (!target || target.client_id !== actor.clientId)
    return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
  if (target.accepted_at)
    return NextResponse.json(
      { error: 'Cannot revoke an invitation that has already been accepted' },
      { status: 400 },
    )

  const { error } = await supabaseService
    .from('invitations')
    .delete()
    .eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
