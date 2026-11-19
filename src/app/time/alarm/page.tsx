"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Bell,
  BellRing,
  Plus,
  Trash2,
  Clock,
  AlarmClockOff,
  Zap,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

interface Alarm {
  id: string;
  hour: number;
  minute: number;
  label: string;
  enabled: boolean;
}

const STORAGE_KEY = "dateandtimezone-alarms";

function playAlarmTone(ctx: AudioContext) {
  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + i * 0.3);
    gain.gain.setValueAtTime(0, now + i * 0.3);
    gain.gain.linearRampToValueAtTime(0.3, now + i * 0.3 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.3 + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.3);
    osc.stop(now + i * 0.3 + 0.3);
  });
}

function formatAlarmTime(hour: number, minute: number) {
  const ampm = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 || 12;
  return `${h}:${String(minute).padStart(2, "0")} ${ampm}`;
}

export default function AlarmPage() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(0);
  const [ampm, setAmpm] = useState<"AM" | "PM">("AM");
  const [currentTime, setCurrentTime] = useState("");
  const [firingAlarm, setFiringAlarm] = useState<Alarm | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const toneIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const firedIdsRef = useRef<Set<string>>(new Set());

  // Load alarms from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setAlarms(JSON.parse(saved));
    } catch {}
  }, []);

  // Save alarms to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
    } catch {}
  }, [alarms]);

  // Update current time every second
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Check alarms
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const nowH = now.getHours();
      const nowM = now.getMinutes();
      const nowS = now.getSeconds();
      if (nowS !== 0) return;
      for (const alarm of alarms) {
        if (!alarm.enabled) continue;
        if (alarm.hour === nowH && alarm.minute === nowM) {
          const key = `${alarm.id}-${nowH}-${nowM}`;
          if (firedIdsRef.current.has(key)) continue;
          firedIdsRef.current.add(key);
          setFiringAlarm(alarm);
          startAlarmSound();
          return;
        }
      }
    };
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, [alarms]);

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const startAlarmSound = useCallback(() => {
    const ctx = getAudioCtx();
    playAlarmTone(ctx);
    toneIntervalRef.current = setInterval(() => playAlarmTone(ctx), 1500);
  }, [getAudioCtx]);

  const stopAlarmSound = useCallback(() => {
    if (toneIntervalRef.current) {
      clearInterval(toneIntervalRef.current);
      toneIntervalRef.current = null;
    }
  }, []);

  const dismiss = useCallback(() => {
    stopAlarmSound();
    setFiringAlarm(null);
  }, [stopAlarmSound]);

  const snooze = useCallback(() => {
    stopAlarmSound();
    if (!firingAlarm) return;
    const snoozeTime = new Date(Date.now() + 5 * 60 * 1000);
    const newAlarm: Alarm = {
      id: crypto.randomUUID(),
      hour: snoozeTime.getHours(),
      minute: snoozeTime.getMinutes(),
      label: `${firingAlarm.label} (Snooze)`,
      enabled: true,
    };
    setAlarms((prev) => [...prev, newAlarm]);
    setFiringAlarm(null);
  }, [firingAlarm, stopAlarmSound]);

  const addAlarm = () => {
    const h24 = ampm === "PM" ? (hour === 12 ? 12 : hour + 12) : hour === 12 ? 0 : hour;
    const newAlarm: Alarm = {
      id: crypto.randomUUID(),
      hour: h24,
      minute,
      label: "Alarm",
      enabled: true,
    };
    setAlarms((prev) => [...prev, newAlarm]);
  };

  const addQuickAlarm = (minutes: number) => {
    const target = new Date(Date.now() + minutes * 60 * 1000);
    const newAlarm: Alarm = {
      id: crypto.randomUUID(),
      hour: target.getHours(),
      minute: target.getMinutes(),
      label: `In ${minutes} min`,
      enabled: true,
    };
    setAlarms((prev) => [...prev, newAlarm]);
  };

  const removeAlarm = (id: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleAlarm = (id: string) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Firing overlay */}
      {firingAlarm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg/90 backdrop-blur-sm animate-pulse-slow">
          <div className="bg-card-bg border border-primary/50 rounded-2xl p-8 sm:p-10 max-w-md w-full mx-4 text-center shadow-2xl shadow-primary/20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <BellRing className="w-10 h-10 text-primary animate-bounce" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-slate-100 mb-1">
              {firingAlarm.label}
            </h2>
            <p className="text-3xl font-heading font-bold text-primary mb-6">
              {formatAlarmTime(firingAlarm.hour, firingAlarm.minute)}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={snooze}
                className="px-6 py-3 rounded-xl bg-card-border hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
              >
                Snooze (5 min)
              </button>
              <button
                onClick={dismiss}
                className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 pt-10 sm:pt-12 pb-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Bell className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Alarm Clock</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-100 mb-2">
            Online Alarm Clock
          </h1>
          <p className="text-muted max-w-md mx-auto">
            Set alarms with pleasant tones, snooze support, and quick presets.
          </p>
        </div>

        {/* Current Time */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-6 mb-6 text-center">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Current Time</p>
          <p className="font-heading text-5xl sm:text-6xl font-bold text-slate-100 tabular-nums tracking-tight">
            {currentTime}
          </p>
        </div>

        {/* Set Alarm */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-6 mb-6">
          <h2 className="font-heading font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-secondary" />
            Set New Alarm
          </h2>
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <label className="block text-xs text-muted mb-1">Hour</label>
              <select
                value={hour}
                onChange={(e) => setHour(Number(e.target.value))}
                className="bg-dark-bg border border-card-border rounded-lg px-3 py-2.5 text-slate-200 font-mono text-lg focus:outline-none focus:border-primary"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-2xl font-bold text-muted pb-2">:</span>
            <div>
              <label className="block text-xs text-muted mb-1">Minute</label>
              <select
                value={minute}
                onChange={(e) => setMinute(Number(e.target.value))}
                className="bg-dark-bg border border-card-border rounded-lg px-3 py-2.5 text-slate-200 font-mono text-lg focus:outline-none focus:border-primary"
              >
                {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                  <option key={m} value={m}>
                    {String(m).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">AM/PM</label>
              <select
                value={ampm}
                onChange={(e) => setAmpm(e.target.value as "AM" | "PM")}
                className="bg-dark-bg border border-card-border rounded-lg px-3 py-2.5 text-slate-200 font-mono text-lg focus:outline-none focus:border-primary"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <button
              onClick={addAlarm}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Set Alarm
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
            {[
              { label: "15 minutes", min: 15 },
              { label: "30 minutes", min: 30 },
              { label: "1 hour", min: 60 },
              { label: "2 hours", min: 120 },
            ].map((p) => (
              <button
                key={p.min}
                onClick={() => addQuickAlarm(p.min)}
                className="px-4 py-2 rounded-lg bg-dark-bg border border-card-border hover:border-primary/50 text-sm text-slate-300 hover:text-slate-100 transition-colors"
              >
                Wake me in {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Alarms */}
        <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-card-border flex items-center justify-between">
            <h2 className="font-heading font-semibold text-slate-200">
              Active Alarms ({alarms.filter((a) => a.enabled).length})
            </h2>
          </div>
          {alarms.length === 0 ? (
            <div className="p-8 text-center text-muted">
              <AlarmClockOff className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No alarms set. Add one above.</p>
            </div>
          ) : (
            <div className="divide-y divide-card-border/50">
              {alarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className={`flex items-center justify-between px-5 py-3 ${
                    !alarm.enabled ? "opacity-40" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleAlarm(alarm.id)}
                      className={`w-10 h-6 rounded-full relative transition-colors ${
                        alarm.enabled ? "bg-primary" : "bg-card-border"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                          alarm.enabled ? "left-[18px]" : "left-0.5"
                        }`}
                      />
                    </button>
                    <div>
                      <p className="font-heading text-xl font-bold text-slate-100 tabular-nums">
                        {formatAlarmTime(alarm.hour, alarm.minute)}
                      </p>
                      <p className="text-xs text-muted">{alarm.label}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeAlarm(alarm.id)}
                    className="p-2 rounded-lg hover:bg-rose-500/10 text-muted hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
