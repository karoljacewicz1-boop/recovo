import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { PLANS, PlanId } from '@/lib/plans'
import { supabaseService, getMembershipBySlug } from '@/lib/supabaseServer'
import { can } from '@/lib/permissions'

export async function POST(req: NextRequest) {
  try {
    const { slug, planId } = (await req.json()) as { slug: string; planId: PlanId }

    if (!slug || !planId) {
      return NextResponse.json({ error: 'slug and planId required' }, { status: 400 })
    }

    const plan = PLANS[planId]
    if (!plan || !plan.stripePriceId) {
      return NextResponse.json(
        { error: 'Invalid plan or price not configured' },
        { status: 400 },
      )
    }

    // Only owner/admin can start a checkout — managers have billing.view only.
    const actor = await getMembershipBySlug(slug)
    if (!actor)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!can(actor.role, 'billing.manage'))
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // Find client
    const { data: client } = await supabaseService
      .from('clients')
      .select('id, name, slug, stripe_customer_id, user_id')
      .eq('slug', slug)
      .maybeSingle()

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Prefer the actor's email (user initiating checkout); fall back to the
    // tenant owner's email if actor has none (unlikely).
    const { data: actorUser } =
      await supabaseService.auth.admin.getUserById(actor.userId)
    let email = actorUser?.user?.email
    if (!email && client.user_id) {
      const { data: ownerUser } =
        await supabaseService.auth.admin.getUserById(client.user_id)
      email = ownerUser?.user?.email
    }

    // Create or reuse Stripe customer
    let customerId = client.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        name: client.name,
        metadata: { client_id: client.id, slug: client.slug },
      })
      customerId = customer.id
      await supabaseService
        .from('clients')
        .update({ stripe_customer_id: customerId })
        .eq('id', client.id)
    }

    const origin = req.headers.get('origin') ?? req.nextUrl.origin

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      success_url: `${origin}/dashboard/${slug}/settings?checkout=success`,
      cancel_url: `${origin}/dashboard/${slug}/settings?checkout=cancel`,
      client_reference_id: client.id,
      subscription_data: {
        metadata: { client_id: client.id, slug: client.slug, plan_id: planId },
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('[stripe checkout]', err)
    return NextResponse.json({ error: err.message ?? 'Checkout error' }, { status: 500 })
  }
}
