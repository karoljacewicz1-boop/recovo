'use client'

import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  DashboardProvider,
  type DashboardContextValue,
  type DashboardClient,
} from '@/lib/dashboardContext'
import { can, type Action, type DashboardRole } from '@/lib/permissions'

// ── Nav items — each carries the permission required to see it ──────
type NavItem = { label: string; href: string; icon: string; requires?: Action }
const NAV: NavItem[] = [
  { label: 'Overview',    href: '',             icon: '◉', requires: 'dashboard.view' },
  { label: 'Inspections', href: '/inspections', icon: '☰', requires: 'inspections.viewAll' },
  { label: 'Reports',     href: '/reports',     icon: '↓', requires: 'inspections.viewAll' },
  { label: 'Team',        href: '/team',        icon: '👥' }, // all roles
  { label: 'Settings',    href: '/settings',    icon: '⚙', requires: 'billing.view' },
]

function filterNav(role: DashboardRole): NavItem[] {
  return NAV.filter((item) => !item.requires || can(role, item.requires))
}

type TrialBannerProps = { trialEndsAt: string | null; plan: string }

function TrialBanner({ trialEndsAt, plan }: TrialBannerProps) {
  if (plan !== 'trial' || !trialEndsAt) return null
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  )
  const expired = daysLeft === 0
  return (
    <div
      className={`text-white text-sm font-semibold text-center py-2 px-4 sticky top-0 z-30 ${
        expired ? 'bg-red-600' : 'bg-[#E8512A]'
      }`}
    >
      {expired
        ? 'Trial wygasł — '
        : `Trial: ${daysLeft} ${daysLeft === 1 ? 'dzień' : 'dni'} pozostało — `}
      <Link href="/pricing" className="underline">
        Wybierz plan →
      </Link>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const slug = params.slug as string
  const isDemo = slug === 'demo-brand'

  const [ctx, setCtx] = useState<DashboardContextValue | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      // Demo mode — no auth needed, synthesize an owner-role context.
      if (isDemo) {
        const { data: client } = await supabase
          .from('clients')
          .select('id, name, plan, trial_ends_at')
          .eq('slug', slug)
          .maybeSingle()
        setCtx({
          slug,
          role: 'owner',
          client: (client as DashboardClient) ?? null,
          isDemo: true,
        })
        setAuthChecked(true)
        return
      }

      const isLoginPage = pathname.endsWith('/login')

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        if (!isLoginPage) router.replace(`/login?next=${pathname}`)
        setAuthChecked(true)
        return
      }

      // Fetch the client + membership in one round-trip by slug.
      const { data: client } = await supabase
        .from('clients')
        .select('id, name, plan, trial_ends_at')
        .eq('slug', slug)
        .maybeSingle()

      if (!client) {
        if (!isLoginPage) router.replace('/login')
        setAuthChecked(true)
        return
      }

      const { data: membership } = await supabase
        .from('memberships')
        .select('role')
        .eq('client_id', client.id)
        .eq('user_id', user.id)
        .maybeSingle()

      if (!membership) {
        // User is authenticated but isn't a member of this tenant.
        if (!isLoginPage) router.replace('/login')
        setAuthChecked(true)
        return
      }

      setCtx({
        slug,
        role: membership.role as DashboardRole,
        client: client as DashboardClient,
        isDemo: false,
      })
      setAuthChecked(true)
    }

    checkAuth()
  }, [slug, pathname, router, isDemo])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!authChecked || !ctx) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#E8512A] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const visibleNav = filterNav(ctx.role)

  return (
    <DashboardProvider value={ctx}>
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
        {/* Demo banner */}
        {isDemo && (
          <div className="bg-[#E8512A] text-white text-sm font-semibold text-center py-2 px-4 sticky top-0 z-30">
            Demo mode — this is sample data
          </div>
        )}

        {/* Trial banner */}
        {!isDemo && ctx.client && (
          <TrialBanner plan={ctx.client.plan} trialEndsAt={ctx.client.trial_ends_at} />
        )}

        <div className="flex flex-1">
          {/* Sidebar — desktop */}
          <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-100 min-h-screen sticky top-0 self-start">
            <div className="px-5 py-5 border-b border-gray-100">
              <p className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">Recovo</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {ctx.client?.name ?? slug.replace(/-/g, ' ')}
              </p>
              {!isDemo && (
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-semibold">
                  {ctx.role}
                </p>
              )}
            </div>
            <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
              {visibleNav.map((item) => {
                const href = `/dashboard/${slug}${item.href}`
                const active =
                  item.href === ''
                    ? pathname === `/dashboard/${slug}`
                    : pathname.startsWith(href)
                return (
                  <Link
                    key={item.href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[#FFF3EF] text-[#E8512A]'
                        : 'text-gray-500 hover:text-[#1A1A1A] hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div className="px-5 py-4 border-t border-gray-100 space-y-1">
              {!isDemo && (
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors w-full text-left"
                >
                  ↩ Wyloguj
                </button>
              )}
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>

        {/* Bottom nav — mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-20">
          {visibleNav.map((item) => {
            const href = `/dashboard/${slug}${item.href}`
            const active =
              item.href === ''
                ? pathname === `/dashboard/${slug}`
                : pathname.startsWith(href)
            return (
              <Link
                key={item.href}
                href={href}
                className={`flex-1 flex flex-col items-center py-2.5 text-xs font-medium transition-colors ${
                  active ? 'text-[#E8512A]' : 'text-gray-400'
                }`}
              >
                <span className="text-base mb-0.5">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </DashboardProvider>
  )
}
