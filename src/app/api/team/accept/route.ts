// ─────────────────────────────────────────────────────────────────────
// INVITATION ACCEPT API
//   GET  /api/team/accept?token=...   preview invitation (no auth required)
//   POST /api/team/accept             accept; requires authenticated user
//                                     whose email matches invitation
// ─────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { supabaseService, getSessionUserId } from '@/lib/supabaseServer'

type InviteRow = {
  id: string
  client_id: string
  email: string
  role: 'admin' | 'manager'
  token: string
  expires_at: string
  accepted_at: string | null
}

// ── GET: preview invitation (token in query) ─────────────────────────
// Returns basic info so the landing page can say "You've been invited to
// <Company> as <role>" before the user signs in.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token)
    return NextResponse.json({ error: 'token required' }, { status: 400 })

  const { data: invite } = await supabaseService
    .from('invitations')
    .select('id, client_id, email, role, expires_at, accepted_at')
    .eq('token', token)
    .maybeSingle<Omit<InviteRow, 'token'>>()

  if (!invite)
    return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
  if (invite.accepted_at)
    return NextResponse.json(
      { error: 'This invitation has already been accepted', accepted: true },
      { status: 410 },
    )
  if (new Date(invite.expires_at).getTime() < Date.now())
    return NextResponse.json(
      { error: 'This invitation has expired', expired: true },
      { status: 410 },
    )

  const { data: client } = await supabaseService
    .from('clients')
    .select('name, slug')
    .eq('id', invite.client_id)
    .maybeSingle()

  return NextResponse.json({
    email: invite.email,
    role: invite.role,
    expiresAt: invite.expires_at,
    client: client ?? null,
  })
}

// ── POST: accept invitation (requires authenticated session) ────────
export async function POST(req: NextRequest) {
  const { token } = await req.json().catch(() => ({}))
  if (!token)
    return NextResponse.json({ error: 'token required' }, { status: 400 })

  const userId = await getSessionUserId()
  if (!userId)
    return NextResponse.json(
      { error: 'You must be signed in to accept an invitation', needsAuth: true },
      { status: 401 },
    )

  const { data: invite } = await supabaseService
    .from('invitations')
    .select('id, client_id, email, role, expires_at, accepted_at')
    .eq('token', token)
    .maybeSingle<Omit<InviteRow, 'token'>>()

  if (!invite)
    return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
  if (invite.accepted_at)
    return NextResponse.json(
      { error: 'This invitation has already been accepted' },
      { status: 410 },
    )
  if (new Date(invite.expires_at).getTime() < Date.now())
    return NextResponse.json(
      { error: 'This invitation has expired' },
      { status: 410 },
    )

  // Resolve the current user's email and require a match — prevents someone
  // with a stolen invite link from hijacking it under a different account.
  const { data: userRes } = await supabaseService.auth.admin.getUserById(userId)
  const currentEmail = userRes?.user?.email?.toLowerCase() ?? ''
  if (currentEmail !== invite.email.toLowerCase()) {
    return NextResponse.json(
      {
        error: `This invitation is for ${invite.email}. You're signed in as ${currentEmail}.`,
        emailMismatch: true,
      },
      { status: 403 },
    )
  }

  // Idempotent: if already a member, just mark invite accepted.
  const { data: existing } = await supabaseService
    .from('memberships')
    .select('id, role')
    .eq('client_id', invite.client_id)
    .eq('user_id', userId)
    .maybeSingle()

  if (!existing) {
    const { error: insertErr } = await supabaseService
      .from('memberships')
      .insert({
        client_id: invite.client_id,
        user_id: userId,
        role: invite.role,
      })
    if (insertErr)
      return NextResponse.json({ error: insertErr.message }, { status: 500 })
  }

  await supabaseService
    .from('invitations')
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', invite.id)

  const { data: client } = await supabaseService
    .from('clients')
    .select('slug')
    .eq('id', invite.client_id)
    .maybeSingle()

  return NextResponse.json({
    success: true,
    slug: client?.slug ?? null,
    role: invite.role,
  })
}
