export type PlanId = 'trial' | 'starter' | 'growth' | 'scale'

export type Plan = {
  id: PlanId
  name: string
  price: number | null        // USD/mo, null = custom
  priceDisplay: string         // shown on UI
  workerLimit: number
  inspectionLimit: number      // per month
  stripePriceId?: string | null
  features: string[]
  cta: string
  highlighted?: boolean
}

export const PLANS: Record<PlanId, Plan> = {
  trial: {
    id: 'trial',
    name: 'Trial',
    price: 0,
    priceDisplay: 'Free',
    workerLimit: 999,
    inspectionLimit: 999,
    features: [
      '14 dni za darmo',
      'Wszystkie funkcje aktywne',
      'Bez karty kredytowej',
    ],
    cta: 'Aktywny',
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 9,
    priceDisplay: '$9',
    workerLimit: 1,
    inspectionLimit: 50,
    stripePriceId: process.env.STRIPE_PRICE_STARTER ?? process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER,
    features: [
      '1 pracownik',
      'Do 50 inspekcji / mies',
      'AI grading',
      'PDF raporty',
      'Dashboard klienta',
    ],
    cta: 'Wybierz Starter',
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    price: 49,
    priceDisplay: '$49',
    workerLimit: 3,
    inspectionLimit: 200,
    stripePriceId: process.env.STRIPE_PRICE_GROWTH ?? process.env.NEXT_PUBLIC_STRIPE_PRICE_GROWTH,
    features: [
      '3 pracowników',
      'Do 200 inspekcji / mies',
      'AI grading + photos',
      'PDF raporty',
      'Dashboard klienta',
      'Priority support',
    ],
    cta: 'Wybierz Growth',
    highlighted: true,
  },
  scale: {
    id: 'scale',
    name: 'Scale',
    price: null,
    priceDisplay: 'Indywidualnie',
    workerLimit: 999,
    inspectionLimit: 9999,
    features: [
      'Nieograniczeni pracownicy',
      'Nieograniczone inspekcje',
      'Dedykowany warehouse space',
      'Recommerce / buyback',
      'Custom SLA',
      'Account manager',
    ],
    cta: 'Skontaktuj się',
  },
}

export function getPlan(id: string | null | undefined): Plan {
  return PLANS[(id ?? 'trial') as PlanId] ?? PLANS.trial
}

export function isOverLimit(plan: PlanId, workers: number, inspectionsThisPeriod: number) {
  const p = PLANS[plan]
  return {
    workersOver: workers > p.workerLimit,
    inspectionsOver: inspectionsThisPeriod > p.inspectionLimit,
  }
}
