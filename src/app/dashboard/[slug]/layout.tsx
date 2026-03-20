'use client'

import { useParams, usePathname } from 'next/navigation'
import Link from 'next/link'

const NAV = [
  { label: 'Overview', href: '', icon: '◉' },
  { label: 'Inspections', href: '/inspections', icon: '☰' },
  { label: 'Reports', href: '/reports', icon: '↓' },
  { label: 'Settings', href: '/settings', icon: '⚙' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const slug = params.slug as string
  const isDemo = slug === 'demo-brand'

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Demo banner */}
      {isDemo && (
        <div className="bg-[#E8512A] text-white text-sm font-semibold text-center py-2 px-4 sticky top-0 z-30">
          Demo mode — this is sample data
        </div>
      )}

      <div className="flex flex-1">
        {/* Sidebar — desktop */}
        <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-100 min-h-screen sticky top-0 self-start">
          <div className="px-5 py-5 border-b border-gray-100">
            <p className="text-xl font-extrabold text-[#1A1A1A] tracking-tight">Recovo</p>
            <p className="text-xs text-gray-400 mt-0.5">Client Dashboard</p>
          </div>
          <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
            {NAV.map((item) => {
              const href = `/dashboard/${slug}${item.href}`
              const active = item.href === ''
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
          <div className="px-5 py-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-700 capitalize">{slug.replace(/-/g, ' ')}</p>
            <Link href="/admin" className="text-xs text-gray-400 hover:text-[#E8512A] transition-colors mt-0.5 inline-block">
              ⚙ Manage clients
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      {/* Bottom nav — mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-20">
        {NAV.map((item) => {
          const href = `/dashboard/${slug}${item.href}`
          const active = item.href === ''
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
  )
}
