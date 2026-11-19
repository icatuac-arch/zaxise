"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Timer as TimerIcon,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Zap,
  Tag,
  Volume2,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

interface TimerItem {
  id: string;
  label: string;
  totalSeconds: number;
  secondsLeft: number;
  running: boolean;
  finished: boolean;
}

function playDing(ctx: AudioContext) {
  const now = ctx.currentTime;
  const pairs: [number, number][] = [
    [1046.5, 0],
    [1318.51, 0.15],
    [1567.98, 0.3],
    [1046.5, 0.5],
    [1318.51, 0.65],
    [1567.98, 0.8],
  ];
  pairs.forEach(([freq, offset]) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + offset);
    gain.gain.setValueAtTime(0, now + offset);
    gain.gain.linearRampToValueAtTime(0.2, now + offset + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.14);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + offset);
    osc.stop(now + offset + 0.15);
  });
}

export default function TimerPage() {
  const [timers, setTimers] = useState<TimerItem[]>([]);
  const [inputH, setInputH] = useState(0);
  const [inputM, setInputM] = useState(5);
  const [inputS, setInputS] = useState(0);
  const [inputLabel, setInputLabel] = useState("");
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  // Global tick for all running timers
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimers((prev) =>
        prev.map((t) => {
          if (!t.running || t.finished) return t;
          const next = t.secondsLeft - 1;
          if (next <= 0) {
            try {
              playDing(getAudioCtx());
            } catch {}
            return { ...t, secondsLeft: 0, running: false, finished: true };
          }
          return { ...t, secondsLeft: next };
        })
      );
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [getAudioCtx]);

  const addTimer = (totalSec?: number, label?: string) => {
    const sec = totalSec ?? inputH * 3600 + inputM * 60 + inputS;
    if (sec <= 0) return;
    // Init audio on user gesture
    try { getAudioCtx(); } catch {}
    const newTimer: TimerItem = {
      id: crypto.randomUUID(),
      label: label || inputLabel || "Timer",
      totalSeconds: sec,
      secondsLeft: sec,
      running: false,
      finished: false,
    };
    setTimers((prev) => [...prev, newTimer]);
    if (!totalSec) {
      setInputLabel("");
    }
  };

  const toggleTimer = (id: string) => {
    setTimers((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (t.finished) return t;
        // Init audio on user gesture
        if (!t.running) try { getAudioCtx(); } catch {}
        return { ...t, running: !t.running };
      })
    );
  };

  const resetTimer = (id: string) => {
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, secondsLeft: t.totalSeconds, running: false, finished: false }
          : t
      )
    );
  };

  const removeTimer = (id: string) => {
    setTimers((prev) => prev.filter((t) => t.id !== id));
  };

  const formatDisplay = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) {
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const presets = [
    { label: "1 min", sec: 60 },
    { label: "5 min", sec: 300 },
    { label: "10 min", sec: 600 },
    { label: "15 min", sec: 900 },
    { label: "30 min", sec: 1800 },
    { label: "1 hour", sec: 3600 },
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-2xl mx-auto px-4 pt-10 sm:pt-12 pb-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <TimerIcon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Timer</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-100 mb-2">
            Online Timer
          </h1>
          <p className="text-muted max-w-md mx-auto">
            Countdown timers with labels, presets, and audio alerts. Run multiple timers at once.
          </p>
        </div>

        {/* Create Timer */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-6 mb-6">
          <h2 className="font-heading font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-secondary" />
            New Timer
          </h2>
          {/* Label */}
          <div className="mb-4">
            <label className="block text-xs text-muted mb-1">Label (optional)</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="e.g., Pasta, Laundry, Workout..."
                value={inputLabel}
                onChange={(e) => setInputLabel(e.target.value)}
                className="w-full bg-dark-bg border border-card-border rounded-lg pl-9 pr-3 py-2.5 text-slate-200 placeholder:text-muted-dark focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          {/* Time inputs */}
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <label className="block text-xs text-muted mb-1">Hours</label>
              <input
                type="number"
                min={0}
                max={23}
                value={inputH}
                onChange={(e) => setInputH(Math.max(0, Math.min(23, Number(e.target.value))))}
                className="w-20 bg-dark-bg border border-card-border rounded-lg px-3 py-2.5 text-slate-200 font-mono text-lg text-center focus:outline-none focus:border-primary"
              />
            </div>
            <span className="text-2xl font-bold text-muted pb-2">:</span>
            <div>
              <label className="block text-xs text-muted mb-1">Minutes</label>
              <input
                type="number"
                min={0}
                max={59}
                value={inputM}
                onChange={(e) => setInputM(Math.max(0, Math.min(59, Number(e.target.value))))}
                className="w-20 bg-dark-bg border border-card-border rounded-lg px-3 py-2.5 text-slate-200 font-mono text-lg text-center focus:outline-none focus:border-primary"
              />
            </div>
            <span className="text-2xl font-bold text-muted pb-2">:</span>
            <div>
              <label className="block text-xs text-muted mb-1">Seconds</label>
              <input
                type="number"
                min={0}
                max={59}
                value={inputS}
                onChange={(e) => setInputS(Math.max(0, Math.min(59, Number(e.target.value))))}
                className="w-20 bg-dark-bg border border-card-border rounded-lg px-3 py-2.5 text-slate-200 font-mono text-lg text-center focus:outline-none focus:border-primary"
              />
            </div>
            <button
              onClick={() => addTimer()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Timer
            </button>
          </div>
        </div>

        <AdBanner />

        {/* Quick Presets */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-6 mb-6">
          <h2 className="font-heading font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-secondary" />
            Quick Presets
          </h2>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.sec}
                onClick={() => addTimer(p.sec, p.label)}
                className="px-4 py-2 rounded-lg bg-dark-bg border border-card-border hover:border-primary/50 text-sm text-slate-300 hover:text-slate-100 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Timers */}
        {timers.length === 0 ? (
          <div className="bg-card-bg border border-card-border rounded-2xl p-10 text-center">
            <TimerIcon className="w-10 h-10 mx-auto mb-3 text-muted opacity-40" />
            <p className="text-muted text-sm">No timers yet. Create one above or use a preset.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {timers.map((t) => {
              const progress =
                t.totalSeconds > 0 ? t.secondsLeft / t.totalSeconds : 0;
              return (
                <div
                  key={t.id}
                  className={`bg-card-bg border rounded-2xl p-5 transition-colors ${
                    t.finished
                      ? "border-primary/50 shadow-lg shadow-primary/10"
                      : "border-card-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-muted" />
                      <span className="text-sm font-medium text-slate-300">{t.label}</span>
                      {t.finished && (
                        <span className="flex items-center gap-1 text-xs text-primary font-medium">
                          <Volume2 className="w-3 h-3" /> Done!
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeTimer(t.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-muted hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Big display */}
                  <p
                    className={`font-heading text-4xl sm:text-5xl font-bold tabular-nums tracking-tight mb-3 ${
                      t.finished ? "text-primary" : "text-slate-100"
                    }`}
                  >
                    {formatDisplay(t.secondsLeft)}
                  </p>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-card-border rounded-full mb-4 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                        t.finished ? "bg-primary" : "bg-secondary"
                      }`}
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleTimer(t.id)}
                      disabled={t.finished}
                      className={`flex items-center gap-1.5 px-5 py-2 rounded-lg font-semibold text-sm text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                        t.running
                          ? "bg-amber-500 hover:bg-amber-600"
                          : "bg-primary hover:bg-primary-hover"
                      }`}
                    >
                      {t.running ? (
                        <>
                          <Pause className="w-4 h-4" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" /> {t.secondsLeft < t.totalSeconds && !t.finished ? "Resume" : "Start"}
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => resetTimer(t.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-card-border hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" /> Reset
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info */}
        <div className="mt-10 grid sm:grid-cols-3 gap-4">
          <div className="bg-card-bg border border-card-border rounded-xl p-4 text-center">
            <p className="text-2xl font-heading font-bold text-slate-100">{timers.length}</p>
            <p className="text-xs text-muted mt-1">Active Timers</p>
          </div>
          <div className="bg-card-bg border border-card-border rounded-xl p-4 text-center">
            <p className="text-2xl font-heading font-bold text-slate-100">
              {timers.filter((t) => t.running).length}
            </p>
            <p className="text-xs text-muted mt-1">Running</p>
          </div>
          <div className="bg-card-bg border border-card-border rounded-xl p-4 text-center">
            <p className="text-2xl font-heading font-bold text-slate-100">
              {timers.filter((t) => t.finished).length}
            </p>
            <p className="text-xs text-muted mt-1">Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
