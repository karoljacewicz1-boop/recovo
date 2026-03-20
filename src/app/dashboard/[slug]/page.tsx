'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Inspection = {
  id: string
  tracking_number: string
  category: string
  grade: string
  created_at: string
  photos: string[] | null
}

type Client = { id: string; name: string; slug: string }

const GRADE_COLORS: Record<string, string> = {
  A: '#16a34a', B: '#eab308', C: '#f97316', D: '#dc2626',
}
const GRADE_BG: Record<string, string> = {
  A: 'bg-green-100 text-green-700',
  B: 'bg-yellow-100 text-yellow-700',
  C: 'bg-orange-100 text-orange-700',
  D: 'bg-red-100 text-red-700',
}

export default function DashboardOverview() {
  const params = useParams()
  const slug = params.slug as string
  const isDemo = slug === 'demo-brand'
  const [client, setClient] = useState<Client | null>(null)
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const { data: c } = await supabase.from('clients').select('*').eq('slug', slug).single()
    if (!c) { setLoading(false); return }
    setClient(c)

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { data } = await supabase
      .from('inspections')
      .select('*')
      .eq('client_id', c.id)
      .gte('created_at', startOfMonth.toISOString())
      .order('created_at', { ascending: false })

    setInspections(data || [])
    setLoading(false)
  }, [slug])

  useEffect(() => { load() }, [load])

  async function handleSeedDemo() {
    setSeeding(true)
    setSeedMsg('')
    try {
      const res = await fetch('/api/seed-demo', { method: 'POST' })
      const data = await res.json()
      if (data.ok) {
        setSeedMsg(`✓ ${data.inserted} sample inspections loaded!`)
        await load()
      } else {
        setSeedMsg(data.message || data.error || 'Something went wrong')
      }
    } catch {
      setSeedMsg('Network error')
    } finally {
      setSeeding(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-[#E8512A] rounded-full animate-spin" />
      </div>
    )
  }

  if (!client) {
    return <div className="p-8 text-gray-500">Client not found: {slug}</div>
  }

  const total = inspections.length
  const gradeCounts = { A: 0, B: 0, C: 0, D: 0 }
  inspections.forEach((i) => { if (i.grade in gradeCounts) (gradeCounts as any)[i.grade]++ })
  const gradeAPct = total ? Math.round((gradeCounts.A / total) * 100) : 0
  const forResale = gradeCounts.B + gradeCounts.C
  const pendingPayout = forResale * 35 // rough PLN estimate

  // Donut data
  const donutSegments = (['A', 'B', 'C', 'D'] as const).filter(g => gradeCounts[g] > 0).map(g => ({
    grade: g,
    count: gradeCounts[g],
    pct: total ? Math.round((gradeCounts[g] / total) * 100) : 0,
    color: GRADE_COLORS[g],
  }))

  const recentInspections = inspections.slice(0, 5)

  return (
    <div className="p-6 md:p-8 pb-24 md:pb-8">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Overview</p>
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">{client.name}</h1>
        <p className="text-gray-400 text-sm mt-1">
          {new Date().toLocaleString('en-GB', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Demo seed banner */}
      {isDemo && inspections.length === 0 && (
        <div className="mb-8 bg-[#FFF3EF] border border-[#E8512A]/30 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-bold text-[#1A1A1A]">No demo data yet</p>
            <p className="text-xs text-gray-500 mt-0.5">Load 25 sample inspections to explore the dashboard.</p>
            {seedMsg && <p className="text-xs text-[#E8512A] font-medium mt-1">{seedMsg}</p>}
          </div>
          <button
            onClick={handleSeedDemo}
            disabled={seeding}
            className="flex-shrink-0 bg-[#E8512A] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#d14420] disabled:opacity-60 transition-colors flex items-center gap-2"
          >
            {seeding && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {seeding ? 'Loading...' : 'Load demo data →'}
          </button>
        </div>
      )}

      {/* Seed success message (after data loaded) */}
      {isDemo && inspections.length > 0 && seedMsg && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl px-5 py-3 text-sm text-green-700 font-medium">
          {seedMsg}
        </div>
      )}

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Items this month', value: total.toString() },
          { label: 'Grade A %', value: `${gradeAPct}%` },
          { label: 'For resale (B/C)', value: forResale.toString() },
          { label: 'Pending payout', value: `${pendingPayout} PLN` },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-5 border border-gray-100">
            <p className="text-xs text-gray-400 mb-2">{card.label}</p>
            <p className="text-2xl font-extrabold text-[#1A1A1A]">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Donut chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <p className="text-sm font-bold text-[#1A1A1A] mb-5">Grade distribution</p>
          {total === 0 ? (
            <p className="text-gray-400 text-sm">No data yet</p>
          ) : (
            <div className="flex items-center gap-6">
              {/* CSS donut */}
              <div className="relative w-28 h-28 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-28 h-28 -rotate-90">
                  {(() => {
                    let offset = 0
                    return donutSegments.map((seg) => {
                      const el = (
                        <circle
                          key={seg.grade}
                          cx="18" cy="18" r="15.9"
                          fill="none"
                          stroke={seg.color}
                          strokeWidth="3.5"
                          strokeDasharray={`${seg.pct} ${100 - seg.pct}`}
                          strokeDashoffset={-offset}
                        />
                      )
                      offset += seg.pct
                      return el
                    })
                  })()}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-extrabold text-[#1A1A1A]">{total}</span>
                </div>
              </div>
              {/* Legend */}
              <div className="flex flex-col gap-2">
                {donutSegments.map((seg) => (
                  <div key={seg.grade} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: seg.color }} />
                    <span className="text-sm text-gray-600">
                      Grade {seg.grade}: <span className="font-semibold text-[#1A1A1A]">{seg.count}</span>
                      <span className="text-gray-400 text-xs ml-1">({seg.pct}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent inspections */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-[#1A1A1A]">Recent inspections</p>
            <Link
              href={`/dashboard/${slug}/inspections`}
              className="text-xs text-[#E8512A] font-semibold hover:underline"
            >
              View all →
            </Link>
          </div>
          {recentInspections.length === 0 ? (
            <p className="text-gray-400 text-sm">No inspections yet</p>
          ) : (
            <div className="flex flex-col gap-2">
              {recentInspections.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-1.5">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${GRADE_BG[item.grade]}`}>
                    {item.grade}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono text-[#1A1A1A] font-semibold truncate">
                      {item.tracking_number}
                    </p>
                    <p className="text-xs text-gray-400">{item.category}</p>
                  </div>
                  <p className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
