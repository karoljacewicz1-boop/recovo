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
  client_action: string | null
  return_address: string | null
  action_note: string | null
  value_retention: number | null
  retail_price_eur: number | null
  resale_price_eur: number | null
}

type ActionModalData = {
  inspection: Inspection
  action: string
  returnAddress: string
  note: string
}

const GRADE_BG: Record<string, string> = {
  A: 'bg-green-100 text-green-700',
  B: 'bg-yellow-100 text-yellow-700',
  C: 'bg-orange-100 text-orange-700',
  D: 'bg-red-100 text-red-700',
}

const ACTION_OPTIONS = [
  {
    value: 'accepted',
    icon: '✅',
    label: 'Accept grade',
    desc: 'I confirm the assessment and accept the grade.',
    color: 'border-green-200 bg-green-50 hover:border-green-400',
    activeColor: 'border-green-500 bg-green-50',
    badge: 'bg-green-100 text-green-700',
  },
  {
    value: 'grade_change',
    icon: '✏️',
    label: 'Request grade change',
    desc: 'I disagree with the grade — please review.',
    color: 'border-blue-200 bg-blue-50 hover:border-blue-400',
    activeColor: 'border-blue-500 bg-blue-50',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    value: 'list_used',
    icon: '🏷️',
    label: 'List as used product',
    desc: 'Please list this item as a used/refurbished product.',
    color: 'border-purple-200 bg-purple-50 hover:border-purple-400',
    activeColor: 'border-purple-500 bg-purple-50',
    badge: 'bg-purple-100 text-purple-700',
  },
  {
    value: 'return',
    icon: '📦',
    label: 'Return to address',
    desc: 'Please send this item back to the address I provide.',
    color: 'border-orange-200 bg-orange-50 hover:border-orange-400',
    activeColor: 'border-orange-500 bg-orange-50',
    badge: 'bg-orange-100 text-orange-700',
  },
]

const DATE_FILTERS = [
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
  { label: 'All time', value: 'all' },
]

function ActionBadge({ action }: { action: string | null }) {
  if (!action) return <span className="text-xs text-gray-300">—</span>
  const opt = ACTION_OPTIONS.find(o => o.value === action)
  if (!opt) return null
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${opt.badge}`}>
      {opt.icon} {opt.label}
    </span>
  )
}

export default function InspectionsPage() {
  const params = useParams()
  const slug = params.slug as string
  const [clientId, setClientId] = useState<string | null>(null)
  const [clientName, setClientName] = useState('')
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState('month')
  const [gradeFilter, setGradeFilter] = useState('all')
  const [actionFilter, setActionFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [lightbox, setLightbox] = useState<{ photos: string[]; idx: number } | null>(null)
  const [pdfLoading, setPdfLoading] = useState<string | null>(null)
  const [modal, setModal] = useState<ActionModalData | null>(null)
  const [saving, setSaving] = useState(false)
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
    if (actionFilter === 'pending') result = result.filter(i => !i.client_action)
    else if (actionFilter !== 'all') result = result.filter(i => i.client_action === actionFilter)
    setInspections(result)
    setLoading(false)
  }, [clientId, dateFilter, gradeFilter, search, actionFilter])

  useEffect(() => { load() }, [load])

  function openModal(inspection: Inspection) {
    setModal({
      inspection,
      action: inspection.client_action || '',
      returnAddress: inspection.return_address || '',
      note: inspection.action_note || '',
    })
  }

  async function saveAction() {
    if (!modal || !modal.action) return
    setSaving(true)

    await supabase
      .from('inspections')
      .update({
        client_action: modal.action,
        return_address: modal.action === 'return' ? modal.returnAddress : null,
        action_note: modal.note || null,
      })
      .eq('id', modal.inspection.id)

    setSaving(false)
    setModal(null)
    load()
  }

  const paginated = inspections.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const totalPages = Math.ceil(inspections.length / PAGE_SIZE)
  const pendingCount = inspections.filter(i => !i.client_action).length

  return (
    <div className="p-6 md:p-8 pb-24 md:pb-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Inspections</p>
          <h1 className="text-2xl font-extrabold text-[#1A1A1A]">All inspections</h1>
        </div>
        {pendingCount > 0 && (
          <div className="bg-[#FFF3EF] border border-[#E8512A]/20 rounded-xl px-4 py-2 text-sm">
            <span className="font-bold text-[#E8512A]">{pendingCount}</span>
            <span className="text-[#E8512A]/70 ml-1">awaiting your decision</span>
          </div>
        )}
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

        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {[
            { value: 'all', label: 'All' },
            { value: 'pending', label: '⏳ Pending' },
            { value: 'accepted', label: '✅ Accepted' },
            { value: 'grade_change', label: '✏️ Review' },
            { value: 'list_used', label: '🏷️ List used' },
            { value: 'return', label: '📦 Return' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => { setActionFilter(f.value); setPage(0) }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                actionFilter === f.value ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-gray-500'
              }`}
            >
              {f.label}
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

      {/* Table */}
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
                  <th className="text-left px-5 py-3 font-semibold">Date</th>
                  <th className="text-left px-5 py-3 font-semibold">Tracking #</th>
                  <th className="text-left px-5 py-3 font-semibold">Category</th>
                  <th className="text-left px-5 py-3 font-semibold">Grade</th>
                  <th className="text-left px-5 py-3 font-semibold">Value</th>
                  <th className="text-left px-5 py-3 font-semibold">Photos</th>
                  <th className="text-left px-5 py-3 font-semibold">Your decision</th>
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
                      {item.value_retention !== null && item.value_retention !== undefined ? (
                        <div className="flex items-center gap-2 min-w-[80px]">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                item.value_retention >= 80 ? 'bg-green-400' :
                                item.value_retention >= 50 ? 'bg-yellow-400' :
                                item.value_retention >= 20 ? 'bg-orange-400' : 'bg-red-400'
                              }`}
                              style={{ width: `${item.value_retention}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold ${
                            item.value_retention >= 80 ? 'text-green-600' :
                            item.value_retention >= 50 ? 'text-yellow-600' :
                            item.value_retention >= 20 ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {item.value_retention}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
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
                    <td className="px-5 py-3">
                      <ActionBadge action={item.client_action} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openModal(item)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                            item.client_action
                              ? 'text-gray-400 hover:text-[#E8512A] border border-gray-200 hover:border-[#E8512A]'
                              : 'bg-[#E8512A] text-white hover:bg-[#d4471f]'
                          }`}
                        >
                          {item.client_action ? 'Change' : 'Decide →'}
                        </button>
                        <button
                          onClick={async () => {
                            setPdfLoading(item.id)
                            await generateInspectionPDF(item, clientName)
                            setPdfLoading(null)
                          }}
                          disabled={pdfLoading === item.id}
                          className="text-xs text-gray-400 hover:text-[#E8512A] transition-colors disabled:opacity-40"
                        >
                          {pdfLoading === item.id
                            ? <span className="w-3 h-3 border border-gray-300 border-t-[#E8512A] rounded-full animate-spin inline-block" />
                            : '↓ PDF'}
                        </button>
                      </div>
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
                <p className="text-xs text-gray-400 mb-2">{item.category} · {new Date(item.created_at).toLocaleDateString()}</p>
                {item.photos && item.photos.length > 0 && (
                  <div className="flex gap-1.5 mb-3">
                    {item.photos.slice(0, 3).map((p, i) => (
                      <img key={i} src={p} alt="" onClick={() => setLightbox({ photos: item.photos!, idx: i })} className="w-12 h-12 rounded object-cover cursor-pointer" />
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <ActionBadge action={item.client_action} />
                  <button
                    onClick={() => openModal(item)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                      item.client_action
                        ? 'text-gray-400 border border-gray-200'
                        : 'bg-[#E8512A] text-white'
                    }`}
                  >
                    {item.client_action ? 'Change' : 'Decide →'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
              <span>{inspections.length} total</span>
              <div className="flex gap-2">
                <button disabled={page === 0} onClick={() => setPage(page - 1)} className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:border-gray-300">← Prev</button>
                <span className="px-3 py-1.5">{page + 1} / {totalPages}</span>
                <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:border-gray-300">Next →</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Action Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Decision for</p>
              <p className="font-mono font-bold text-[#1A1A1A]">{modal.inspection.tracking_number}</p>
              <p className="text-xs text-gray-400 mt-1">{modal.inspection.category} · Grade <span className={`font-bold px-1.5 py-0.5 rounded text-xs ${GRADE_BG[modal.inspection.grade]}`}>{modal.inspection.grade}</span></p>
            </div>

            <div className="p-6 flex flex-col gap-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Choose an action</p>

              {ACTION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setModal({ ...modal, action: opt.value })}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    modal.action === opt.value ? opt.activeColor + ' border-2' : opt.color + ' border'
                  }`}
                >
                  <p className="font-semibold text-sm text-[#1A1A1A]">{opt.icon} {opt.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                </button>
              ))}

              {/* Return address field */}
              {modal.action === 'return' && (
                <div className="mt-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Return address</label>
                  <textarea
                    value={modal.returnAddress}
                    onChange={(e) => setModal({ ...modal, returnAddress: e.target.value })}
                    placeholder="Street, City, Postcode, Country"
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8512A] resize-none"
                  />
                </div>
              )}

              {/* Optional note */}
              {modal.action && modal.action !== 'accepted' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Note (optional)</label>
                  <input
                    type="text"
                    value={modal.note}
                    onChange={(e) => setModal({ ...modal, note: e.target.value })}
                    placeholder="Any additional information..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8512A]"
                  />
                </div>
              )}
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setModal(null)} className="flex-1 h-11 rounded-xl border border-gray-200 text-sm text-gray-500 hover:border-gray-300 transition-colors">
                Cancel
              </button>
              <button
                onClick={saveAction}
                disabled={!modal.action || saving || (modal.action === 'return' && !modal.returnAddress.trim())}
                className="flex-1 h-11 rounded-xl bg-[#E8512A] text-white text-sm font-bold hover:bg-[#d4471f] transition-colors disabled:opacity-40"
              >
                {saving ? 'Saving...' : 'Confirm decision →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white text-2xl font-bold z-10 hover:text-gray-300" onClick={() => setLightbox(null)}>×</button>
          <button className="absolute left-4 text-white text-3xl z-10 hover:text-gray-300 disabled:opacity-20" disabled={lightbox.idx === 0} onClick={(e) => { e.stopPropagation(); setLightbox({ ...lightbox, idx: lightbox.idx - 1 }) }}>‹</button>
          <img src={lightbox.photos[lightbox.idx]} alt="" className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-4 text-white text-3xl z-10 hover:text-gray-300 disabled:opacity-20" disabled={lightbox.idx === lightbox.photos.length - 1} onClick={(e) => { e.stopPropagation(); setLightbox({ ...lightbox, idx: lightbox.idx + 1 }) }}>›</button>
          <div className="absolute bottom-4 text-gray-400 text-sm">{lightbox.idx + 1} / {lightbox.photos.length}</div>
        </div>
      )}
    </div>
  )
}
