import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseService, getMembershipBySlug } from '@/lib/supabaseServer'
import { can } from '@/lib/permissions'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json()
    if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

    // Must be a member, and must be allowed to manage billing.
    const actor = await getMembershipBySlug(slug)
    if (!actor)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!can(actor.role, 'billing.manage'))
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { data: client } = await supabaseService
      .from('clients')
      .select('stripe_customer_id')
      .eq('slug', slug)
      .maybeSingle()

    if (!client?.stripe_customer_id) {
      return NextResponse.json({ error: 'No subscription yet' }, { status: 404 })
    }

    const origin = req.headers.get('origin') ?? req.nextUrl.origin

    const session = await stripe.billingPortal.sessions.create({
      customer: client.stripe_customer_id,
      return_url: `${origin}/dashboard/${slug}/settings`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('[stripe portal]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
