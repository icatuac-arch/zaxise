'use client'

import { useState, useEffect, useRef, useCallback } from 'react'


import { Clock, Play, Pause, RotateCcw, Flag, Copy, Check } from 'lucide-react'

function formatTime(ms: number): string {
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  const centiseconds = Math.floor((ms % 1000) / 10)
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`
}

interface Lap {
  number: number
  lapTime: number
  totalTime: number
}

export default function StopwatchPage() {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState<Lap[]>([])
  const [copied, setCopied] = useState(false)
  const [mode, setMode] = useState<'stopwatch' | 'countdown'>('stopwatch')
  const [countdownMinutes, setCountdownMinutes] = useState(5)
  const [countdownMs, setCountdownMs] = useState(0)

  const startTimeRef = useRef(0)
  const rafRef = useRef<number>(0)
  const elapsedRef = useRef(0)

  const tick = useCallback(() => {
    const now = performance.now()
    const newElapsed = elapsedRef.current + (now - startTimeRef.current)
    setElapsed(newElapsed)
    startTimeRef.current = now
    elapsedRef.current = newElapsed
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const start = () => {
    startTimeRef.current = performance.now()
    setRunning(true)
    rafRef.current = requestAnimationFrame(tick)
  }

  const stop = () => {
    setRunning(false)
    cancelAnimationFrame(rafRef.current)
  }

  const reset = () => {
    stop()
    setElapsed(0)
    elapsedRef.current = 0
    setLaps([])
  }

  const lap = () => {
    const lastLapTotal = laps.length > 0 ? laps[0].totalTime : 0
    const lapTime = elapsed - lastLapTotal
    setLaps(prev => [{ number: prev.length + 1, lapTime, totalTime: elapsed }, ...prev])
  }

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const bestLapIdx = laps.length > 1 ? laps.reduce((best, l, i) => l.lapTime < laps[best].lapTime ? i : best, 0) : -1
  const worstLapIdx = laps.length > 1 ? laps.reduce((worst, l, i) => l.lapTime > laps[worst].lapTime ? i : worst, 0) : -1

  const handleCopyLaps = async () => {
    if (laps.length === 0) return
    const text = laps
      .slice()
      .reverse()
      .map(l => `Lap ${l.number}: ${formatTime(l.lapTime)} (Total: ${formatTime(l.totalTime)})`)
      .join('\n')
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070510] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col items-center">
        <div className="mb-6 w-full">
          <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <Clock size={28} /> Stopwatch
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Precise stopwatch with lap timing.</p>
        </div>

        {/* Intro Section */}
        <div className="mb-8 w-full rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="px-4 h-12 rounded-lg border-2 border-[#E8970A]/60 bg-[#E8970A]/10 flex items-center justify-center text-[#E8970A] text-lg font-mono font-bold">00:00:00</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Click start</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Record laps</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Review times</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Highlights best and worst lap times.
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex bg-[#070510] rounded-lg p-1 border border-[#1A1726] mb-6">
          <button onClick={() => { setMode('stopwatch'); reset() }} className={`px-4 py-2 rounded-lg text-sm ${mode === 'stopwatch' ? 'bg-[#E8970A] text-black font-medium' : 'text-gray-400'}`}>Stopwatch</button>
          <button onClick={() => { setMode('countdown'); reset(); setCountdownMs(countdownMinutes * 60000) }} className={`px-4 py-2 rounded-lg text-sm ${mode === 'countdown' ? 'bg-[#E8970A] text-black font-medium' : 'text-gray-400'}`}>Countdown</button>
        </div>

        {/* Countdown settings */}
        {mode === 'countdown' && !running && elapsed === 0 && (
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-gray-400">Minutes:</span>
            <input type="number" min={1} max={999} value={countdownMinutes} onChange={e => { const v = parseInt(e.target.value) || 1; setCountdownMinutes(v); setCountdownMs(v * 60000) }} className="w-20 px-3 py-2 rounded-lg bg-[#0F0D1A] border border-[#1A1726] text-white text-sm text-center" />
          </div>
        )}

        {/* Timer display */}
        <div className="text-6xl sm:text-7xl font-bold tabular-nums mb-8 tracking-tight">
          {mode === 'countdown' ? formatTime(Math.max(0, countdownMs - elapsed)) : formatTime(elapsed)}
        </div>

        {/* Controls */}
        <div className="flex gap-3 mb-8">
          {!running ? (
            <button onClick={start} className="flex items-center gap-2 px-6 py-3 rounded-xl text-black font-medium bg-[#E8970A] hover:bg-[#E8970A]/90">
              <Play size={18} /> {elapsed > 0 ? 'Resume' : 'Start'}
            </button>
          ) : (
            <button onClick={stop} className="flex items-center gap-2 px-6 py-3 rounded-xl text-black font-medium bg-[#E8970A] hover:bg-[#E8970A]/90">
              <Pause size={18} /> Stop
            </button>
          )}
          {running && (
            <button onClick={lap} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#1A1726] text-gray-300 hover:bg-white/5">
              <Flag size={18} /> Lap
            </button>
          )}
          {!running && elapsed > 0 && (
            <button onClick={reset} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#1A1726] text-gray-300 hover:bg-white/5">
              <RotateCcw size={18} /> Reset
            </button>
          )}
        </div>

        {/* Laps */}
        {laps.length > 0 && (
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-300">Laps</h2>
              <button onClick={handleCopyLaps} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-[#1A1726] hover:bg-white/10 text-gray-300">
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl overflow-hidden">
              <div className="grid grid-cols-3 text-xs text-gray-500 px-4 py-2 border-b border-[#1A1726]">
                <span>Lap</span>
                <span className="text-center">Lap Time</span>
                <span className="text-right">Total</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {laps.map((l, i) => (
                  <div
                    key={l.number}
                    className={`grid grid-cols-3 px-4 py-2 text-sm border-b border-[#1A1726] last:border-0 ${
                      i === bestLapIdx ? 'text-green-400' : i === worstLapIdx ? 'text-red-400' : 'text-gray-300'
                    }`}
                  >
                    <span>#{l.number}</span>
                    <span className="text-center tabular-nums">{formatTime(l.lapTime)}</span>
                    <span className="text-right tabular-nums">{formatTime(l.totalTime)}</span>
                  </div>
                ))}
              </div>
            </div>
            {laps.length > 1 && (
              <div className="flex gap-4 mt-2 text-xs text-gray-500">
                <span className="text-green-400">Best lap</span>
                <span className="text-red-400">Worst lap</span>
              </div>
            )}
          </div>
        )}
      </main>
      
    </div>
  )
}
