'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { generateInspectionPDF } from '@/lib/generatePDF'

type Inspection = {
  id: string
  tracking_number: string
  category: string
  grade: string
  notes: string | null
  photos: string[] | null
  ai_description: string | null
  created_at: string
  worker_name: string | null
}

const GRADE_BG: Record<string, string> = {
  A: 'bg-green-100 text-green-700',
  B: 'bg-yellow-100 text-yellow-700',
  C: 'bg-orange-100 text-orange-700',
  D: 'bg-red-100 text-red-700',
}

const DATE_FILTERS = [
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
  { label: 'All time', value: 'all' },
]

export default function InspectionsPage() {
  const params = useParams()
  const slug = params.slug as string
  const [clientId, setClientId] = useState<string | null>(null)
  const [clientName, setClientName] = useState('')
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState('month')
  const [gradeFilter, setGradeFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [lightbox, setLightbox] = useState<{ photos: string[]; idx: number } | null>(null)
  const [pdfLoading, setPdfLoading] = useState<string | null>(null)
  const PAGE_SIZE = 20

  useEffect(() => {
    supabase.from('clients').select('id, name').eq('slug', slug).single().then(({ data }) => {
      if (data) { setClientId(data.id); setClientName(data.name) }
    })
  }, [slug])

  const load = useCallback(async () => {
    if (!clientId) return
    setLoading(true)

    let query = supabase
      .from('inspections')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })

    const now = new Date()
    if (dateFilter === 'week') {
      const weekAgo = new Date(now)
      weekAgo.setDate(weekAgo.getDate() - 7)
      query = query.gte('created_at', weekAgo.toISOString())
    } else if (dateFilter === 'month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      query = query.gte('created_at', monthStart.toISOString())
    }

    if (gradeFilter !== 'all') query = query.eq('grade', gradeFilter)

    const { data } = await query
    let result = data || []
    if (search) result = result.filter(i => i.tracking_number.toLowerCase().includes(search.toLowerCase()))
    setInspections(result)
    setLoading(false)
  }, [clientId, dateFilter, gradeFilter, search])

  useEffect(() => { load() }, [load])

  const paginated = inspections.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const totalPages = Math.ceil(inspections.length / PAGE_SIZE)

  return (
    <div className="p-6 md:p-8 pb-24 md:pb-8">
      <div className="mb-6">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Inspections</p>
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">All inspections</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {DATE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => { setDateFilter(f.value); setPage(0) }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                dateFilter === f.value ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-gray-500'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {['all', 'A', 'B', 'C', 'D'].map((g) => (
            <button
              key={g}
              onClick={() => { setGradeFilter(g); setPage(0) }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                gradeFilter === g ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-gray-500'
              }`}
            >
              {g === 'all' ? 'All grades' : `Grade ${g}`}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search tracking #"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#E8512A] bg-white"
        />
      </div>

      {/* Table / cards */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-[#E8512A] rounded-full animate-spin" />
        </div>
      ) : inspections.length === 0 ? (
        <p className="text-gray-400 text-sm py-8">No inspections found.</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-semibold">Date & Time</th>
                  <th className="text-left px-5 py-3 font-semibold">Tracking #</th>
                  <th className="text-left px-5 py-3 font-semibold">Category</th>
                  <th className="text-left px-5 py-3 font-semibold">Grade</th>
                  <th className="text-left px-5 py-3 font-semibold">Photos</th>
                  <th className="text-left px-5 py-3 font-semibold">Notes</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      {' '}
                      {new Date(item.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-5 py-3 font-mono font-semibold text-[#1A1A1A]">
                      {item.tracking_number}
                    </td>
                    <td className="px-5 py-3 text-gray-600">{item.category}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${GRADE_BG[item.grade]}`}>
                        {item.grade}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {item.photos && item.photos.length > 0 ? (
                        <button
                          onClick={() => setLightbox({ photos: item.photos!, idx: 0 })}
                          className="flex items-center gap-1.5 hover:opacity-80"
                        >
                          <img src={item.photos[0]} alt="" className="w-10 h-10 rounded object-cover" />
                          {item.photos.length > 1 && (
                            <span className="text-xs text-gray-400">+{item.photos.length - 1}</span>
                          )}
                        </button>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-500 max-w-[200px] truncate">
                      {item.notes || '—'}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={async () => {
                          setPdfLoading(item.id)
                          await generateInspectionPDF(item, clientName)
                          setPdfLoading(null)
                        }}
                        disabled={pdfLoading === item.id}
                        className="text-xs text-gray-400 hover:text-[#E8512A] transition-colors disabled:opacity-40 flex items-center gap-1"
                      >
                        {pdfLoading === item.id
                          ? <span className="w-3 h-3 border border-gray-300 border-t-[#E8512A] rounded-full animate-spin" />
                          : '↓ PDF'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-3">
            {paginated.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-sm text-[#1A1A1A]">{item.tracking_number}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${GRADE_BG[item.grade]}`}>{item.grade}</span>
                </div>
                <p className="text-xs text-gray-400">{item.category} · {new Date(item.created_at).toLocaleDateString()}</p>
                {item.notes && <p className="text-xs text-gray-500 mt-1">{item.notes}</p>}
                {item.photos && item.photos.length > 0 && (
                  <div className="flex gap-1.5 mt-2">
                    {item.photos.slice(0, 3).map((p, i) => (
                      <img
                        key={i}
                        src={p} alt=""
                        onClick={() => setLightbox({ photos: item.photos!, idx: i })}
                        className="w-12 h-12 rounded object-cover cursor-pointer"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
              <span>{inspections.length} total</span>
              <div className="flex gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:border-gray-300"
                >
                  ← Prev
                </button>
                <span className="px-3 py-1.5">
                  {page + 1} / {totalPages}
                </span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:border-gray-300"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl font-bold z-10 hover:text-gray-300"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>
          <button
            className="absolute left-4 text-white text-3xl z-10 hover:text-gray-300 disabled:opacity-20"
            disabled={lightbox.idx === 0}
            onClick={(e) => { e.stopPropagation(); setLightbox({ ...lightbox, idx: lightbox.idx - 1 }) }}
          >
            ‹
          </button>
          <img
            src={lightbox.photos[lightbox.idx]}
            alt=""
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 text-white text-3xl z-10 hover:text-gray-300 disabled:opacity-20"
            disabled={lightbox.idx === lightbox.photos.length - 1}
            onClick={(e) => { e.stopPropagation(); setLightbox({ ...lightbox, idx: lightbox.idx + 1 }) }}
          >
            ›
          </button>
          <div className="absolute bottom-4 text-gray-400 text-sm">
            {lightbox.idx + 1} / {lightbox.photos.length}
          </div>
        </div>
      )}
    </div>
  )
}
