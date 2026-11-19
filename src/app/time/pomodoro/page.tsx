"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Brain,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Coffee,
  Settings,
  Target,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

type SessionType = "work" | "shortBreak" | "longBreak";

interface DayStats {
  date: string;
  sessionsCompleted: number;
  totalFocusSeconds: number;
}

const STATS_KEY = "dateandtimezone-pomodoro-stats";

function playBeep(ctx: AudioContext) {
  const now = ctx.currentTime;
  const frequencies = [880, 0, 880, 0, 1174.66];
  frequencies.forEach((freq, i) => {
    if (freq === 0) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + i * 0.2);
    gain.gain.setValueAtTime(0, now + i * 0.2);
    gain.gain.linearRampToValueAtTime(0.25, now + i * 0.2 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.2 + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.2);
    osc.stop(now + i * 0.2 + 0.2);
  });
}

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

export default function PomodoroPage() {
  const [workMin, setWorkMin] = useState(25);
  const [shortBreakMin, setShortBreakMin] = useState(5);
  const [longBreakMin, setLongBreakMin] = useState(15);
  const [longBreakInterval, setLongBreakInterval] = useState(4);
  const [showSettings, setShowSettings] = useState(false);

  const [sessionType, setSessionType] = useState<SessionType>("work");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  const [stats, setStats] = useState<DayStats>({
    date: getTodayKey(),
    sessionsCompleted: 0,
    totalFocusSeconds: 0,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Load stats
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STATS_KEY);
      if (saved) {
        const parsed: DayStats = JSON.parse(saved);
        if (parsed.date === getTodayKey()) {
          setStats(parsed);
          setPomodoroCount(parsed.sessionsCompleted);
        }
      }
    } catch {}
  }, []);

  // Save stats
  useEffect(() => {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {}
  }, [stats]);

  const getSessionDuration = useCallback(
    (type: SessionType) => {
      switch (type) {
        case "work":
          return workMin * 60;
        case "shortBreak":
          return shortBreakMin * 60;
        case "longBreak":
          return longBreakMin * 60;
      }
    },
    [workMin, shortBreakMin, longBreakMin]
  );

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const switchSession = useCallback(
    (type: SessionType) => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setRunning(false);
      setSessionType(type);
      const dur = getSessionDuration(type);
      setSecondsLeft(dur);
      setTotalSeconds(dur);
    },
    [getSessionDuration]
  );

  // Timer tick
  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setRunning(false);
          // Play sound
          try {
            playBeep(getAudioCtx());
          } catch {}
          // Handle session end
          if (sessionType === "work") {
            const newCount = pomodoroCount + 1;
            setPomodoroCount(newCount);
            setStats((s) => ({
              ...s,
              date: getTodayKey(),
              sessionsCompleted: newCount,
              totalFocusSeconds: s.totalFocusSeconds + totalSeconds,
            }));
            // Auto-switch to break
            const isLongBreak = newCount % longBreakInterval === 0;
            const nextType: SessionType = isLongBreak ? "longBreak" : "shortBreak";
            const dur = getSessionDuration(nextType);
            setSessionType(nextType);
            setSecondsLeft(dur);
            setTotalSeconds(dur);
          } else {
            // Break ended, switch to work
            const dur = getSessionDuration("work");
            setSessionType("work");
            setSecondsLeft(dur);
            setTotalSeconds(dur);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, sessionType, pomodoroCount, totalSeconds, longBreakInterval, getSessionDuration, getAudioCtx]);

  const toggle = () => {
    if (running) {
      setRunning(false);
    } else {
      // Init audio context on user gesture
      try { getAudioCtx(); } catch {}
      setRunning(true);
    }
  };

  const skip = () => {
    if (sessionType === "work") {
      const isLongBreak = (pomodoroCount + 1) % longBreakInterval === 0;
      switchSession(isLongBreak ? "longBreak" : "shortBreak");
    } else {
      switchSession("work");
    }
  };

  const reset = () => {
    switchSession(sessionType);
  };

  const applySettings = () => {
    if (!running) {
      const dur = getSessionDuration(sessionType);
      setSecondsLeft(dur);
      setTotalSeconds(dur);
    }
    setShowSettings(false);
  };

  // Format
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;

  // SVG ring
  const size = 280;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const sessionLabel =
    sessionType === "work"
      ? "Focus Time"
      : sessionType === "shortBreak"
      ? "Short Break"
      : "Long Break";

  const sessionColor =
    sessionType === "work"
      ? "text-primary"
      : sessionType === "shortBreak"
      ? "text-secondary"
      : "text-emerald-400";

  const ringColor =
    sessionType === "work"
      ? "#4F46E5"
      : sessionType === "shortBreak"
      ? "#06B6D4"
      : "#34D399";

  const focusMinutes = Math.floor(stats.totalFocusSeconds / 60);
  const focusHours = Math.floor(focusMinutes / 60);
  const focusRemMin = focusMinutes % 60;

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-2xl mx-auto px-4 pt-10 sm:pt-12 pb-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Pomodoro</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-100 mb-2">
            Pomodoro Timer
          </h1>
          <p className="text-muted max-w-md mx-auto">
            Stay focused with timed work sessions and scheduled breaks.
          </p>
        </div>

        {/* Session tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {(
            [
              { type: "work" as SessionType, label: "Focus", icon: Target },
              { type: "shortBreak" as SessionType, label: "Short Break", icon: Coffee },
              { type: "longBreak" as SessionType, label: "Long Break", icon: Coffee },
            ] as const
          ).map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => !running && switchSession(type)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sessionType === type
                  ? "bg-card-bg border border-card-border text-slate-100"
                  : "text-muted hover:text-slate-300"
              } ${running ? "cursor-not-allowed" : ""}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Timer Ring */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-8 sm:p-10 mb-6 flex flex-col items-center">
          <div className="relative mb-6">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background ring */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#1E293B"
                strokeWidth={stroke}
              />
              {/* Progress ring */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={ringColor}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${sessionColor}`}>
                {sessionLabel}
              </p>
              <p className="font-heading text-6xl sm:text-7xl font-bold text-slate-100 tabular-nums tracking-tight">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </p>
              <p className="text-xs text-muted mt-1">
                Pomodoro #{pomodoroCount + 1}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-colors text-lg text-white ${
                running
                  ? "bg-amber-500 hover:bg-amber-600"
                  : "bg-primary hover:bg-primary-hover"
              }`}
            >
              {running ? (
                <>
                  <Pause className="w-5 h-5" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" /> {secondsLeft < totalSeconds ? "Resume" : "Start"}
                </>
              )}
            </button>
            <button
              onClick={skip}
              className="p-3 rounded-xl bg-card-border hover:bg-slate-700 text-slate-200 transition-colors"
              title="Skip to next session"
            >
              <SkipForward className="w-5 h-5" />
            </button>
            <button
              onClick={reset}
              className="p-3 rounded-xl bg-card-border hover:bg-slate-700 text-slate-200 transition-colors"
              title="Reset current session"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <AdBanner />

        {/* Today Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-card-bg border border-card-border rounded-xl p-5 text-center">
            <p className="text-3xl font-heading font-bold text-slate-100">{stats.sessionsCompleted}</p>
            <p className="text-xs text-muted mt-1">Sessions Completed</p>
          </div>
          <div className="bg-card-bg border border-card-border rounded-xl p-5 text-center">
            <p className="text-3xl font-heading font-bold text-slate-100">
              {focusHours > 0 ? `${focusHours}h ${focusRemMin}m` : `${focusMinutes}m`}
            </p>
            <p className="text-xs text-muted mt-1">Total Focus Time</p>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-card-border/30 transition-colors"
          >
            <span className="flex items-center gap-2 font-heading font-semibold text-slate-200">
              <Settings className="w-4 h-4 text-secondary" />
              Settings
            </span>
            {showSettings ? (
              <ChevronUp className="w-4 h-4 text-muted" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted" />
            )}
          </button>
          {showSettings && (
            <div className="px-5 py-4 border-t border-card-border space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted mb-1">Focus (min)</label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={workMin}
                    onChange={(e) => setWorkMin(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-dark-bg border border-card-border rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">Short Break (min)</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={shortBreakMin}
                    onChange={(e) => setShortBreakMin(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-dark-bg border border-card-border rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">Long Break (min)</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={longBreakMin}
                    onChange={(e) => setLongBreakMin(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-dark-bg border border-card-border rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">Long Break Every</label>
                  <input
                    type="number"
                    min={2}
                    max={10}
                    value={longBreakInterval}
                    onChange={(e) => setLongBreakInterval(Math.max(2, Number(e.target.value)))}
                    className="w-full bg-dark-bg border border-card-border rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <button
                onClick={applySettings}
                className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
