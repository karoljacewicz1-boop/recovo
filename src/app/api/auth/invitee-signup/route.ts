// ─────────────────────────────────────────────────────────────────────
// INVITEE SIGNUP
//   POST /api/auth/invitee-signup { token, password }
// Creates a Supabase auth user whose email is bound by the invitation
// token (prevents invitees from claiming a different email address).
// Does NOT create a client — invitees join via memberships, not ownership.
// The caller is expected to sign in + POST /api/team/accept afterwards.
// ─────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabaseServer'

export async function POST(req: NextRequest) {
  const { token, password } = await req.json().catch(() => ({}))
  if (!token || !password) {
    return NextResponse.json(
      { error: 'token and password required' },
      { status: 400 },
    )
  }
  if (typeof password !== 'string' || password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters' },
      { status: 400 },
    )
  }

  // Verify invitation is live.
  const { data: invite } = await supabaseService
    .from('invitations')
    .select('id, email, expires_at, accepted_at')
    .eq('token', token)
    .maybeSingle()
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

  const email = invite.email.toLowerCase()

  // If a user with this email already exists, short-circuit and tell the
  // client to sign in instead — don't silently create a duplicate.
  const { data: listed } = await supabaseService.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  })
  const existing = (listed?.users ?? []).find(
    (u) => u.email?.toLowerCase() === email,
  )
  if (existing) {
    return NextResponse.json(
      {
        error: 'User with this email already exists — please sign in instead.',
        existingUser: true,
      },
      { status: 409 },
    )
  }

  const { data, error } = await supabaseService.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { invited: true },
  })
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({
    success: true,
    email,
    userId: data.user?.id ?? null,
  })
}
