import Stripe from 'stripe'

// Lazy singleton — instantiating Stripe at module load throws when
// STRIPE_SECRET_KEY is absent (e.g. during Next.js build "collect page data"
// phase on Vercel). We defer creation until first use so `next build`
// succeeds even without secrets present.

let _stripe: Stripe | null = null

function getStripe(): Stripe {
  if (_stripe) return _stripe
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error(
      '[stripe] STRIPE_SECRET_KEY is not set — cannot call Stripe API'
    )
  }
  _stripe = new Stripe(key, {
    // Use the SDK's pinned default API version instead of a hard-coded
    // string, so we never desync with the installed Stripe types.
    typescript: true,
  })
  return _stripe
}

// Proxy so existing `import { stripe } from '@/lib/stripe'` callers keep
// working. Any property access triggers lazy init; at build time nothing
// is accessed, so no throw.
export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    const instance = getStripe()
    const value = Reflect.get(instance as object, prop, receiver)
    return typeof value === 'function' ? value.bind(instance) : value
  },
})
