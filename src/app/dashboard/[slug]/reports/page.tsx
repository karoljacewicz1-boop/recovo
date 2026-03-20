'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ReportsPage() {
  const params = useParams()
  const slug = params.slug as string
  const [toast, setToast] = useState('')
  const [inspections, setInspections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: client } = await supabase.from('clients').select('id').eq('slug', slug).single()
      if (!client) { setLoading(false); return }
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const { data } = await supabase
        .from('inspections')
        .select('*')
        .eq('client_id', client.id)
        .gte('created_at', monthStart.toISOString())
      setInspections(data || [])
      setLoading(false)
    }
    load()
  }, [slug])

  function downloadCSV() {
    if (!inspections.length) return
    const headers = ['id', 'tracking_number', 'category', 'grade', 'notes', 'worker_name', 'created_at']
    const rows = inspections.map(i => headers.map(h => JSON.stringify((i as any)[h] ?? '')).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `recovo-${slug}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  function showComingSoon() {
    setToast('Coming soon!')
    setTimeout(() => setToast(''), 2500)
  }

  const total = inspections.length
  const gradeCounts = { A: 0, B: 0, C: 0, D: 0 } as Record<string, number>
  inspections.forEach(i => { if (i.grade in gradeCounts) gradeCounts[i.grade]++ })
  const recoveryValue = (gradeCounts.A * 0.85 + gradeCounts.B * 0.5 + gradeCounts.C * 0.2) * 45 // rough PLN

  return (
    <div className="p-6 md:p-8 pb-24 md:pb-8">
      <div className="mb-6">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Reports</p>
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">Monthly summary</h1>
        <p className="text-gray-400 text-sm mt-1">
          {new Date().toLocaleString('en-GB', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Summary card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Total items</p>
              <p className="text-3xl font-extrabold text-[#1A1A1A]">{total}</p>
            </div>
            {(['A', 'B', 'C', 'D'] as const).map(g => (
              <div key={g}>
                <p className="text-xs text-gray-400 mb-1">Grade {g}</p>
                <p className="text-3xl font-extrabold text-[#1A1A1A]">{gradeCounts[g]}</p>
              </div>
            ))}
            <div>
              <p className="text-xs text-gray-400 mb-1">Est. recovery value</p>
              <p className="text-3xl font-extrabold text-[#E8512A]">{Math.round(recoveryValue)} PLN</p>
            </div>
          </div>
        )}
      </div>

      {/* Download buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={downloadCSV}
          className="flex items-center justify-center gap-2 bg-[#1A1A1A] text-white font-semibold px-6 py-3 rounded-xl hover:bg-zinc-800 transition-colors text-sm"
        >
          ↓ Download CSV
        </button>
        <button
          onClick={showComingSoon}
          className="flex items-center justify-center gap-2 border border-gray-200 text-gray-500 font-semibold px-6 py-3 rounded-xl hover:border-gray-300 transition-colors text-sm"
        >
          ↓ Download PDF summary
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
