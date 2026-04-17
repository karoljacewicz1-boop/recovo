import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function planIdFromPriceId(priceId: string): 'starter' | 'growth' | null {
  if (priceId === process.env.STRIPE_PRICE_STARTER) return 'starter'
  if (priceId === process.env.STRIPE_PRICE_GROWTH) return 'growth'
  return null
}

async function updateClientFromSubscription(sub: Stripe.Subscription) {
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id
  const priceId = sub.items.data[0]?.price.id
  const planId = priceId ? planIdFromPriceId(priceId) : null

  // @ts-ignore — current_period_end exists on the subscription
  const periodEnd = (sub as any).current_period_end
    ? new Date((sub as any).current_period_end * 1000).toISOString()
    : null

  const update: Record<string, any> = {
    stripe_subscription_id: sub.id,
    stripe_customer_id: customerId,
  }

  if (sub.status === 'active' || sub.status === 'trialing') {
    if (planId) update.plan = planId
    if (periodEnd) update.plan_period_end = periodEnd
  } else if (sub.status === 'canceled' || sub.status === 'unpaid' || sub.status === 'incomplete_expired') {
    update.plan = 'trial'
    update.stripe_subscription_id = null
  }

  const { error } = await supabase
    .from('clients')
    .update(update)
    .eq('stripe_customer_id', customerId)

  if (error) console.error('[stripe webhook] update error', error)
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !secret) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret)
  } catch (err: any) {
    console.error('[stripe webhook] signature error', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.subscription) {
          const subId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id
          const sub = await stripe.subscriptions.retrieve(subId)
          await updateClientFromSubscription(sub)
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        await updateClientFromSubscription(sub)
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id
        await supabase
          .from('clients')
          .update({ plan: 'trial', stripe_subscription_id: null, plan_period_end: null })
          .eq('stripe_customer_id', customerId)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id
        if (customerId) {
          console.warn('[stripe webhook] payment failed for customer', customerId)
          // TODO: send email notification
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('[stripe webhook] handler error', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
