'use client'

// ─────────────────────────────────────────────────────────────────────
// Dashboard-scope React context
//   Surfaces the authenticated user's role + client summary to any page
//   under /dashboard/[slug], so components can gate UI on permissions
//   without each one re-querying Supabase.
// ─────────────────────────────────────────────────────────────────────

import { createContext, useContext, type ReactNode } from 'react'
import type { Action, DashboardRole } from './permissions'
import { can as baseCan } from './permissions'

export type DashboardClient = {
  id: string
  name: string
  plan: string
  trial_ends_at: string | null
} | null

export type DashboardContextValue = {
  slug: string
  role: DashboardRole
  client: DashboardClient
  /** True when viewing /dashboard/demo-brand. Demo is read-only-ish (owner role, seeded data). */
  isDemo: boolean
}

const Ctx = createContext<DashboardContextValue | null>(null)

export function DashboardProvider({
  value,
  children,
}: {
  value: DashboardContextValue
  children: ReactNode
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useDashboard(): DashboardContextValue {
  const v = useContext(Ctx)
  if (!v)
    throw new Error(
      'useDashboard() must be called from a component rendered under DashboardProvider.',
    )
  return v
}

/** Convenience hook — returns whether the current viewer can perform `action`. */
export function useCan(action: Action): boolean {
  return baseCan(useDashboard().role, action)
}
