'use client'

import { useState, useEffect, useRef, useCallback } from 'react'


import { Timer, Play, Pause, RotateCcw, Settings } from 'lucide-react'

type SessionType = 'work' | 'short' | 'long'

function playBeep() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 800
    osc.type = 'sine'
    gain.gain.value = 0.3
    osc.start()
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1)
    osc.stop(ctx.currentTime + 1)
    setTimeout(() => ctx.close(), 1500)
  } catch {
    // Audio not available
  }
}

export default function PomodoroPage() {
  const [workMin, setWorkMin] = useState(25)
  const [shortMin, setShortMin] = useState(5)
  const [longMin, setLongMin] = useState(15)
  const [longAfter, setLongAfter] = useState(4)
  const [showSettings, setShowSettings] = useState(false)

  const [session, setSession] = useState<SessionType>('work')
  const [timeLeft, setTimeLeft] = useState(25 * 60) // seconds
  const [running, setRunning] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [flash, setFlash] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [dailyStats, setDailyStats] = useState<Record<string, number>>({})

  // Load daily stats from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('freetools-pomodoro-stats')
      if (raw) setDailyStats(JSON.parse(raw))
    } catch {}
  }, [])

  const todayKey = new Date().toISOString().slice(0, 10)
  const todayCount = dailyStats[todayKey] || 0

  const savePomodoroComplete = () => {
    const updated = { ...dailyStats, [todayKey]: (dailyStats[todayKey] || 0) + 1 }
    setDailyStats(updated)
    try { localStorage.setItem('freetools-pomodoro-stats', JSON.stringify(updated)) } catch {}
  }

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const getDuration = useCallback((s: SessionType) => {
    switch (s) {
      case 'work': return workMin * 60
      case 'short': return shortMin * 60
      case 'long': return longMin * 60
    }
  }, [workMin, shortMin, longMin])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setRunning(false)
            if (soundEnabled) playBeep()
            setFlash(true)
            setTimeout(() => setFlash(false), 3000)

            // Advance session
            if (session === 'work') {
              const next = completedPomodoros + 1
              setCompletedPomodoros(next)
              savePomodoroComplete()
              if (next % longAfter === 0) {
                setSession('long')
                return longMin * 60
              } else {
                setSession('short')
                return shortMin * 60
              }
            } else {
              setSession('work')
              return workMin * 60
            }
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, session, completedPomodoros, workMin, shortMin, longMin, longAfter])

  const reset = () => {
    setRunning(false)
    setSession('work')
    setTimeLeft(workMin * 60)
    setCompletedPomodoros(0)
  }

  const skipSession = () => {
    setRunning(false)
    setTimeLeft(getDuration(session))
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const totalDuration = getDuration(session)
  const progress = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0

  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const sessionLabel = session === 'work' ? 'Working' : session === 'short' ? 'Short Break' : 'Long Break'
  const sessionColor = session === 'work' ? '#E8970A' : session === 'short' ? '#4ADE80' : '#60A5FA'

  return (
    <div className={`min-h-screen flex flex-col bg-[#070510] text-white transition-all ${flash ? 'ring-4 ring-[#E8970A] ring-inset' : ''}`} style={{ fontFamily: 'DM Sans, sans-serif' }}>
      
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col items-center">
        <div className="mb-6 w-full flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#E8970A] flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              <Timer size={28} /> Pomodoro Timer
            </h1>
            <p className="text-gray-400 mt-1 text-sm">Stay focused with the Pomodoro Technique.</p>
          </div>
          <button onClick={() => setShowSettings(!showSettings)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 border border-[#1A1726] hover:bg-white/5 text-sm">
            <Settings size={14} /> Settings
          </button>
        </div>

        {/* Intro Section */}
        <div className="mb-8 w-full rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-16 h-16 rounded-full border-2 border-[#E8970A]/60 bg-[#E8970A]/10 flex items-center justify-center text-[#E8970A] text-sm font-bold">25:00</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Set work/break times</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Start timer</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Stay focused</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Classic Pomodoro: 25 min work, 5 min break.
          </p>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div className="w-full bg-[#0F0D1A] border border-[#1A1726] rounded-xl p-4 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <label className="flex flex-col gap-1">
              <span className="text-gray-400">Work (min)</span>
              <input type="number" min={5} max={60} value={workMin} onChange={e => { const v = Math.max(5, Math.min(60, +e.target.value)); setWorkMin(v); if (session === 'work' && !running) setTimeLeft(v * 60) }} className="bg-[#070510] border border-[#1A1726] rounded px-2 py-1 text-white" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-gray-400">Short break (min)</span>
              <input type="number" min={1} max={15} value={shortMin} onChange={e => { const v = Math.max(1, Math.min(15, +e.target.value)); setShortMin(v); if (session === 'short' && !running) setTimeLeft(v * 60) }} className="bg-[#070510] border border-[#1A1726] rounded px-2 py-1 text-white" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-gray-400">Long break (min)</span>
              <input type="number" min={5} max={30} value={longMin} onChange={e => { const v = Math.max(5, Math.min(30, +e.target.value)); setLongMin(v); if (session === 'long' && !running) setTimeLeft(v * 60) }} className="bg-[#070510] border border-[#1A1726] rounded px-2 py-1 text-white" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-gray-400">Long break after</span>
              <input type="number" min={2} max={10} value={longAfter} onChange={e => setLongAfter(Math.max(2, Math.min(10, +e.target.value)))} className="bg-[#070510] border border-[#1A1726] rounded px-2 py-1 text-white" />
            </label>
          </div>
        )}

        {/* Status */}
        <div className="mb-4 text-center">
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${sessionColor}20`, color: sessionColor }}>
            {sessionLabel}
          </span>
        </div>

        {/* Circular timer */}
        <div className="relative w-64 h-64 mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 256 256">
            <circle cx="128" cy="128" r="120" stroke="#1A1726" strokeWidth="8" fill="none" />
            <circle
              cx="128" cy="128" r="120"
              stroke={sessionColor}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold tabular-nums" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setRunning(!running)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-black font-medium bg-[#E8970A] hover:bg-[#E8970A]/90"
          >
            {running ? <Pause size={18} /> : <Play size={18} />}
            {running ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#1A1726] text-gray-300 hover:bg-white/5"
          >
            <RotateCcw size={18} /> Reset
          </button>
        </div>

        {/* Sound toggle */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input type="checkbox" checked={soundEnabled} onChange={e => setSoundEnabled(e.target.checked)} className="accent-[#E8970A]" />
            Sound notifications
          </label>
        </div>

        {/* Pomodoro count */}
        <div className="flex gap-4 w-full max-w-md">
          <div className="flex-1 bg-[#0F0D1A] border border-[#1A1726] rounded-xl px-6 py-4 text-center">
            <div className="text-2xl font-bold text-[#E8970A]">{completedPomodoros}</div>
            <div className="text-sm text-gray-400">This Session</div>
          </div>
          <div className="flex-1 bg-[#0F0D1A] border border-[#1A1726] rounded-xl px-6 py-4 text-center">
            <div className="text-2xl font-bold text-[#E8970A]">{todayCount}</div>
            <div className="text-sm text-gray-400">Today</div>
          </div>
        </div>

        {/* Weekly stats */}
        {Object.keys(dailyStats).length > 0 && (
          <div className="bg-[#0F0D1A] border border-[#1A1726] rounded-xl px-6 py-4 mt-4 w-full max-w-md">
            <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3">Last 7 Days</h3>
            <div className="flex items-end gap-1 h-16">
              {Array.from({ length: 7 }).map((_, i) => {
                const date = new Date()
                date.setDate(date.getDate() - (6 - i))
                const key = date.toISOString().slice(0, 10)
                const count = dailyStats[key] || 0
                const maxCount = Math.max(1, ...Object.values(dailyStats))
                const height = count > 0 ? Math.max(8, (count / maxCount) * 100) : 4
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t" style={{ height: `${height}%`, backgroundColor: count > 0 ? '#E8970A' : '#1A1726' }} />
                    <span className="text-[8px] text-gray-500">{date.toLocaleDateString('en', { weekday: 'narrow' })}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
      
    </div>
  )
}
