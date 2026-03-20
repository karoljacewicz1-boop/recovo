'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Inspection = {
  id: string
  tracking_number: string
  category: string
  grade: string
  notes: string | null
  photos: string[] | null
  ai_description: string | null
  created_at: string
  clients?: { name: string }
}

const GRADE_COLORS: Record<string, string> = {
  A: 'bg-green-600',
  B: 'bg-yellow-500',
  C: 'bg-orange-500',
  D: 'bg-red-600',
}

export default function TodayLog() {
  const router = useRouter()
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const todayCount = inspections.length

  async function load() {
    setLoading(true)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const { data } = await supabase
      .from('inspections')
      .select('*, clients(name)')
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString())
      .order('created_at', { ascending: false })

    setInspections((data as any) || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const todayDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0F0F0F]/90 backdrop-blur border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.push('/inspect/scan')} className="text-zinc-400 text-sm hover:text-white">
          ← Scanner
        </button>
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-semibold">{todayDate}</span>
          <span className="bg-teal-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {todayCount}
          </span>
        </div>
        <button onClick={load} className="text-zinc-400 text-sm hover:text-white">
          Refresh
        </button>
      </div>

      <div className="px-4 py-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-zinc-700 border-t-[#E8512A] rounded-full animate-spin" />
          </div>
        ) : inspections.length === 0 ? (
          <div className="text-center py-16 text-zinc-600">
            <p className="text-4xl mb-3">📦</p>
            <p>No inspections logged today</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {inspections.map((item) => (
              <div key={item.id} className="bg-zinc-900 rounded-xl overflow-hidden">
                <button
                  className="w-full px-4 py-3 flex items-center gap-3 text-left"
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                >
                  {/* Grade badge */}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-extrabold text-white text-sm flex-shrink-0 ${GRADE_COLORS[item.grade] || 'bg-zinc-700'}`}>
                    {item.grade}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm font-mono truncate">{item.tracking_number}</p>
                    <p className="text-zinc-400 text-xs">{(item as any).clients?.name || '—'} · {item.category}</p>
                  </div>
                  {/* Time */}
                  <span className="text-zinc-500 text-xs flex-shrink-0">
                    {new Date(item.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </button>

                {/* Expanded */}
                {expandedId === item.id && (
                  <div className="px-4 pb-4 border-t border-zinc-800 pt-3 flex flex-col gap-3">
                    {item.photos && item.photos.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {item.photos.map((p, i) => (
                          <img key={i} src={p} alt="" className="w-[72px] h-[72px] rounded-lg object-cover flex-shrink-0" />
                        ))}
                      </div>
                    )}
                    {item.notes && (
                      <p className="text-zinc-300 text-sm">{item.notes}</p>
                    )}
                    {item.ai_description && (
                      <p className="text-zinc-500 text-xs italic">{item.ai_description}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
