'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Client = { id: string; name: string; slug: string }
type Grade = 'A' | 'B' | 'C' | 'D'
type Confidence = 'high' | 'medium' | 'low'

const CATEGORIES = ['Clothing', 'Footwear', 'Electronics', 'Accessories', 'Other']

const GRADE_CONFIG: Record<Grade, { label: string; selectedClass: string; ringClass: string }> = {
  A: { label: 'A — As new',       selectedClass: 'bg-green-600  text-white border-green-600',   ringClass: 'ring-green-600'  },
  B: { label: 'B — Minor defect', selectedClass: 'bg-yellow-500 text-black border-yellow-500',  ringClass: 'ring-yellow-500' },
  C: { label: 'C — Damaged',      selectedClass: 'bg-orange-500 text-white border-orange-500',  ringClass: 'ring-orange-500' },
  D: { label: 'D — Dispose',      selectedClass: 'bg-red-600    text-white border-red-600',     ringClass: 'ring-red-600'    },
}

const CONFIDENCE_LABEL: Record<Confidence, { text: string; color: string }> = {
  high:   { text: 'high confidence',   color: 'text-green-400'  },
  medium: { text: 'medium confidence', color: 'text-yellow-400' },
  low:    { text: 'low confidence',    color: 'text-zinc-500'   },
}

/** Resize + compress a File to max 1024px and return a base64 data URL */
async function compressImage(file: File, maxPx = 1024, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height))
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = reject
    img.src = url
  })
}

// ─────────────────────────────────────────────────────────────────────────────

function InspectionFormInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const trackingNumber = searchParams.get('tracking') || ''

  const [clients, setClients]               = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [category, setCategory]             = useState('')
  const [grade, setGrade]                   = useState<Grade | null>(null)
  const [gradeOverridden, setGradeOverridden] = useState(false)
  const [notes, setNotes]                   = useState('')
  const [photos, setPhotos]                 = useState<File[]>([])
  const [photoUrls, setPhotoUrls]           = useState<string[]>([])

  // AI state
  const [aiGrade, setAiGrade]               = useState<Grade | null>(null)
  const [aiDescription, setAiDescription]   = useState('')
  const [aiConfidence, setAiConfidence]     = useState<Confidence | null>(null)
  const [aiLoading, setAiLoading]           = useState(false)
  const [aiError, setAiError]               = useState('')
  const [aiRan, setAiRan]                   = useState(false)     // has AI run at least once?

  // Submit state
  const [loading, setLoading]               = useState(false)
  const [error, setError]                   = useState('')
  const [success, setSuccess]               = useState(false)
  const [workerName, setWorkerName]         = useState('')
  const fileInputRef                        = useRef<HTMLInputElement>(null)

  // Track last analysed photo count so we don't re-run on identical sets
  const lastAnalysedCount = useRef(0)

  useEffect(() => {
    setWorkerName(localStorage.getItem('worker_name') || '')
    supabase.from('clients').select('id, name, slug').then(({ data }) => {
      if (data) setClients(data)
    })
  }, [])

  // ── AI analysis ────────────────────────────────────────────────────────────
  const runAI = useCallback(async (files: File[], cat: string) => {
    if (files.length === 0) return
    setAiLoading(true)
    setAiError('')
    try {
      // Compress images (max 4 sent to API)
      const compressed = await Promise.all(files.slice(0, 4).map((f) => compressImage(f)))

      const res = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: compressed, category: cat }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      const suggestedGrade = data.grade as Grade
      setAiGrade(suggestedGrade)
      setAiDescription(data.description || '')
      setAiConfidence(data.confidence || 'medium')
      setAiRan(true)
      lastAnalysedCount.current = files.length

      // Only apply if worker hasn't manually chosen yet
      if (!gradeOverridden) {
        setGrade(suggestedGrade)
      }
    } catch (e: any) {
      // Show the real error so it's easier to debug
      setAiError(`AI failed: ${e?.message ?? 'unknown error'} — select grade manually.`)
    } finally {
      setAiLoading(false)
    }
  }, [gradeOverridden])

  // Auto-run AI when photos are added (debounced — runs 600ms after last photo)
  useEffect(() => {
    if (photos.length === 0 || photos.length === lastAnalysedCount.current) return
    const timer = setTimeout(() => runAI(photos, category), 600)
    return () => clearTimeout(timer)
  }, [photos, category, runAI])

  // ── Photo handling ─────────────────────────────────────────────────────────
  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    const toAdd = files.slice(0, 8 - photos.length)
    const urls = toAdd.map((f) => URL.createObjectURL(f))
    setPhotos((prev) => [...prev, ...toAdd])
    setPhotoUrls((prev) => [...prev, ...urls])
  }

  function removePhoto(i: number) {
    setPhotos((prev) => prev.filter((_, idx) => idx !== i))
    setPhotoUrls((prev) => {
      URL.revokeObjectURL(prev[i])
      return prev.filter((_, idx) => idx !== i)
    })
  }

  // ── Manual grade selection ─────────────────────────────────────────────────
  function selectGrade(g: Grade) {
    setGrade(g)
    if (aiRan && g !== aiGrade) setGradeOverridden(true)
    else setGradeOverridden(false)
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    setError('')
    if (!selectedClient)  { setError('Select a client'); return }
    if (!category)         { setError('Select a category'); return }
    if (!grade)            { setError('Select a grade'); return }
    if (grade !== 'A' && photos.length === 0) {
      setError('At least 1 photo required for grade B / C / D')
      return
    }

    setLoading(true)
    try {
      const uploadedUrls: string[] = []
      const today = new Date().toISOString().split('T')[0]

      for (const photo of photos) {
        const filename = `${Date.now()}_${photo.name}`
        const path = `inspections/${selectedClient.id}/${today}/${trackingNumber}/${filename}`
        const { error: upErr } = await supabase.storage
          .from('inspections')
          .upload(path, photo)
        if (!upErr) {
          const { data: urlData } = supabase.storage
            .from('inspections')
            .getPublicUrl(path)
          uploadedUrls.push(urlData.publicUrl)
        }
      }

      const { error: saveErr } = await supabase.from('inspections').insert([{
        client_id:      selectedClient.id,
        tracking_number: trackingNumber,
        category,
        grade,
        notes:          notes || null,
        photos:         uploadedUrls,
        worker_name:    workerName,
        ai_description: aiDescription || null,
      }])
      if (saveErr) throw saveErr

      const todayKey = `today_count_${new Date().toDateString()}`
      localStorage.setItem(todayKey, String(parseInt(localStorage.getItem(todayKey) || '0') + 1))

      if (navigator.vibrate) navigator.vibrate([100, 50, 100])
      setSuccess(true)
      setTimeout(() => router.push('/inspect/scan'), 1800)
    } catch (e: any) {
      setError(e.message || 'Submit failed')
    } finally {
      setLoading(false)
    }
  }

  // ── Success overlay ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="fixed inset-0 bg-[#0F0F0F] flex flex-col items-center justify-center z-50">
        <div className="text-7xl mb-4 animate-bounce">✓</div>
        <p className="text-white text-2xl font-bold mb-2">Inspection logged</p>
        <p className="text-zinc-400 font-mono text-sm">{trackingNumber}</p>
      </div>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0F0F0F] pb-10">

      {/* ── Header ── */}
      <div className="sticky top-0 z-10 bg-[#0F0F0F]/90 backdrop-blur border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="text-zinc-400 text-sm hover:text-white">
          ← Back
        </button>
        <span className="font-mono text-white font-bold text-sm truncate max-w-[180px]">
          {trackingNumber}
        </span>
        <button onClick={() => router.push('/inspect/scan')} className="text-zinc-400 text-sm hover:text-white">
          Re-scan
        </button>
      </div>

      <div className="px-4 pt-5 flex flex-col gap-7">

        {/* ── 1. Client ── */}
        <div>
          <p className="text-zinc-400 text-xs uppercase tracking-widest mb-3 font-semibold">Client</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {clients.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedClient(c)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  selectedClient?.id === c.id
                    ? 'bg-[#E8512A] text-white'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── 2. Category ── */}
        <div>
          <p className="text-zinc-400 text-xs uppercase tracking-widest mb-3 font-semibold">Category</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  category === cat
                    ? 'bg-[#E8512A] text-white'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── 3. Photos (FIRST — triggers AI) ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-zinc-400 text-xs uppercase tracking-widest font-semibold">
              Photos
              <span className="ml-2 normal-case font-normal text-teal-400 text-[10px]">
                AI grades automatically after upload
              </span>
            </p>
            <span className="text-zinc-500 text-xs">{photos.length}/8</span>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-14 border-2 border-dashed border-zinc-700 rounded-xl text-zinc-400 text-sm font-medium flex items-center justify-center gap-2 hover:border-[#E8512A] hover:text-[#E8512A] transition-colors"
          >
            <span className="text-lg">📷</span>
            Add photos
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            className="hidden"
            onChange={handlePhotoChange}
          />

          {photoUrls.length > 0 && (
            <div className="flex gap-2 overflow-x-auto mt-3 pb-1">
              {photoUrls.map((url, i) => (
                <div key={i} className="relative flex-shrink-0">
                  <img src={url} alt="" className="w-20 h-20 rounded-lg object-cover" />
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* AI loading indicator */}
          {aiLoading && (
            <div className="mt-3 flex items-center gap-2 text-teal-400 text-xs">
              <span className="w-3.5 h-3.5 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin flex-shrink-0" />
              Analysing photos with AI…
            </div>
          )}
          {aiError && (
            <p className="mt-2 text-xs text-red-400">{aiError}</p>
          )}
        </div>

        {/* ── 4. Grade ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-zinc-400 text-xs uppercase tracking-widest font-semibold">Grade</p>
            {aiGrade && !aiLoading && (
              <span className={`text-[10px] font-semibold ${CONFIDENCE_LABEL[aiConfidence!]?.color}`}>
                AI: {aiGrade} · {CONFIDENCE_LABEL[aiConfidence!]?.text}
              </span>
            )}
          </div>

          {/* Loading skeleton */}
          {aiLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {(['A','B','C','D'] as const).map((g) => (
                <div key={g} style={{ height: 90 }}
                  className="rounded-xl bg-zinc-800 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(GRADE_CONFIG) as [Grade, typeof GRADE_CONFIG[Grade]][]).map(([g, cfg]) => {
                const isSelected = grade === g
                const isAiSuggested = aiGrade === g
                const isOverride = isSelected && gradeOverridden && isAiSuggested === false

                return (
                  <button
                    key={g}
                    onClick={() => selectGrade(g)}
                    style={{ height: 90 }}
                    className={`
                      relative rounded-xl border-2 font-bold text-base transition-all active:scale-95
                      ${isSelected
                        ? `${cfg.selectedClass} ring-2 ring-offset-2 ring-offset-[#0F0F0F] ${cfg.ringClass}`
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'}
                    `}
                  >
                    {cfg.label}

                    {/* AI badge on the suggested grade */}
                    {isAiSuggested && !aiLoading && (
                      <span className="absolute top-1.5 right-1.5 bg-teal-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                        AI ✦
                      </span>
                    )}

                    {/* Override indicator */}
                    {isSelected && gradeOverridden && (
                      <span className="absolute bottom-1.5 left-0 right-0 text-center text-[9px] opacity-75">
                        overriding AI
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {/* Re-analyse button (if photos exist but AI hasn't run or user wants refresh) */}
          {photos.length > 0 && !aiLoading && (
            <button
              onClick={() => { lastAnalysedCount.current = 0; runAI(photos, category) }}
              className="mt-2.5 text-xs text-zinc-500 hover:text-teal-400 transition-colors flex items-center gap-1"
            >
              ↺ Re-analyse with AI
            </button>
          )}
        </div>

        {/* ── 5. AI Report (auto-shown after analysis) ── */}
        {(aiDescription || aiLoading) && (
          <div>
            <p className="text-zinc-400 text-xs uppercase tracking-widest mb-3 font-semibold flex items-center gap-2">
              AI Condition Report
              <span className="text-teal-500 text-[9px] font-bold bg-teal-500/10 border border-teal-500/30 px-1.5 py-0.5 rounded-full">
                AI generated
              </span>
            </p>
            {aiLoading ? (
              <div className="h-20 bg-zinc-900 rounded-xl animate-pulse" />
            ) : (
              <textarea
                value={aiDescription}
                onChange={(e) => setAiDescription(e.target.value)}
                rows={4}
                className="w-full bg-zinc-900 border border-teal-500/30 rounded-xl px-4 py-3 text-zinc-200 text-sm focus:outline-none focus:border-teal-400 resize-none"
              />
            )}
          </div>
        )}

        {/* ── 6. Notes (worker additions) ── */}
        <div>
          <p className="text-zinc-400 text-xs uppercase tracking-widest mb-3 font-semibold">
            Notes
            <span className="ml-2 normal-case font-normal text-zinc-600">optional — add anything AI missed</span>
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Visible damage, missing parts, packaging state…"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#E8512A] resize-none"
          />
        </div>

        {/* ── Error ── */}
        {error && (
          <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        {/* ── Submit ── */}
        <button
          onClick={handleSubmit}
          disabled={loading || aiLoading}
          className="w-full h-14 bg-[#E8512A] text-white font-bold text-base rounded-xl hover:bg-[#d14420] disabled:opacity-60 transition-colors active:scale-95 flex items-center justify-center gap-2"
        >
          {loading
            ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : aiLoading
            ? 'Waiting for AI…'
            : 'Log inspection →'}
        </button>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function InspectionForm() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0F0F]" />}>
      <InspectionFormInner />
    </Suspense>
  )
}
