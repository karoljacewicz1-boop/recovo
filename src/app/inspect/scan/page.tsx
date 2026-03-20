'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function ScanPage() {
  const router = useRouter()
  const [workerName, setWorkerName] = useState('')
  const [todayCount, setTodayCount] = useState(0)
  const [manualInput, setManualInput] = useState('')
  const [cameraError, setCameraError] = useState(false)
  const [scanning, setScanning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const readerRef = useRef<any>(null)

  useEffect(() => {
    const name = localStorage.getItem('worker_name')
    if (!name) { router.replace('/inspect'); return }
    setWorkerName(name)

    const todayKey = `today_count_${new Date().toDateString()}`
    setTodayCount(parseInt(localStorage.getItem(todayKey) || '0'))
  }, [router])

  const startScanner = useCallback(async () => {
    if (typeof window === 'undefined' || !videoRef.current) return
    try {
      const { BrowserMultiFormatReader } = await import('@zxing/library')
      const reader = new BrowserMultiFormatReader()
      readerRef.current = reader
      setScanning(true)

      await reader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
        if (result) {
          const text = result.getText()
          if (navigator.vibrate) navigator.vibrate([200])
          reader.reset()
          router.push(`/inspect/form?tracking=${encodeURIComponent(text)}`)
        }
      })
    } catch {
      setCameraError(true)
    }
  }, [router])

  useEffect(() => {
    startScanner()
    return () => {
      readerRef.current?.reset()
    }
  }, [startScanner])

  function handleManual() {
    const val = manualInput.trim()
    if (!val) return
    router.push(`/inspect/form?tracking=${encodeURIComponent(val)}`)
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-[#0F0F0F]/90 backdrop-blur border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <span className="text-zinc-400 text-xs">{workerName}</span>
        <span className="text-white font-bold text-sm">Recovo Inspect</span>
        <span className="bg-teal-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
          {todayCount} today
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center px-4 py-6 gap-6">
        {/* Viewfinder */}
        <div className="relative w-full max-w-sm rounded-xl overflow-hidden border-2 border-zinc-700" style={{ height: 260 }}>
          {cameraError ? (
            <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center gap-2">
              <span className="text-3xl">📷</span>
              <p className="text-zinc-400 text-sm">Camera unavailable</p>
              <p className="text-zinc-600 text-xs">Use manual input below</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted
                playsInline
              />
              {/* Animated scan line */}
              {scanning && (
                <div
                  className="absolute left-0 right-0 h-0.5 bg-green-400 shadow-[0_0_8px_2px_rgba(74,222,128,0.6)]"
                  style={{ animation: 'scanline 2s linear infinite' }}
                />
              )}
              {/* Corner brackets */}
              <div className="absolute inset-4 pointer-events-none">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-green-400 rounded-tl" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-green-400 rounded-tr" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-green-400 rounded-bl" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-green-400 rounded-br" />
              </div>
            </>
          )}
        </div>

        <style>{`
          @keyframes scanline {
            0% { top: 10%; }
            50% { top: 85%; }
            100% { top: 10%; }
          }
        `}</style>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full max-w-sm">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-zinc-500 text-xs">or enter manually</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* Manual input */}
        <div className="flex gap-2 w-full max-w-sm">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleManual()}
            placeholder="Tracking number / barcode"
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white text-lg placeholder-zinc-600 focus:outline-none focus:border-[#E8512A]"
          />
          <button
            onClick={handleManual}
            className="bg-[#E8512A] text-white px-5 rounded-xl font-bold text-xl hover:bg-[#d14420] transition-colors active:scale-95"
          >
            →
          </button>
        </div>

        {/* Log button */}
        <button
          onClick={() => router.push('/inspect/log')}
          className="w-full max-w-sm bg-zinc-800 text-zinc-300 text-sm font-medium py-3 rounded-xl hover:bg-zinc-700 transition-colors mt-auto"
        >
          Today&apos;s log →
        </button>
      </div>
    </div>
  )
}
