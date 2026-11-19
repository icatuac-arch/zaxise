"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Timer, Play, Pause, RotateCcw, Flag, Keyboard } from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

interface Lap {
  number: number;
  lapTime: number;
  totalTime: number;
}

export default function StopwatchPage() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const accumulatedRef = useRef(0);

  const start = useCallback(() => {
    if (running) return;
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setElapsed(accumulatedRef.current + (Date.now() - startTimeRef.current));
    }, 10);
    setRunning(true);
  }, [running]);

  const stop = useCallback(() => {
    if (!running) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    accumulatedRef.current += Date.now() - startTimeRef.current;
    setElapsed(accumulatedRef.current);
    setRunning(false);
  }, [running]);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setElapsed(0);
    accumulatedRef.current = 0;
    startTimeRef.current = 0;
    setLaps([]);
  }, []);

  const lap = useCallback(() => {
    if (!running && elapsed === 0) return;
    const currentTotal = running
      ? accumulatedRef.current + (Date.now() - startTimeRef.current)
      : accumulatedRef.current;
    const prevTotal = laps.length > 0 ? laps[0].totalTime : 0;
    setLaps((prev) => [
      { number: prev.length + 1, lapTime: currentTotal - prevTotal, totalTime: currentTotal },
      ...prev,
    ]);
  }, [running, elapsed, laps]);

  const toggle = useCallback(() => {
    if (running) stop();
    else start();
  }, [running, start, stop]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        toggle();
      } else if (e.code === "KeyL") {
        e.preventDefault();
        lap();
      } else if (e.code === "KeyR") {
        e.preventDefault();
        reset();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggle, lap, reset]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const millis = Math.floor((ms % 1000) / 10);
    return {
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
      millis: String(millis).padStart(2, "0"),
    };
  };

  const display = formatTime(elapsed);

  const bestLap =
    laps.length > 1
      ? laps.reduce((best, l) => (l.lapTime < best.lapTime ? l : best), laps[0])
      : null;
  const worstLap =
    laps.length > 1
      ? laps.reduce((worst, l) => (l.lapTime > worst.lapTime ? l : worst), laps[0])
      : null;

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-2xl mx-auto px-4 pt-10 sm:pt-12 pb-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Timer className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Stopwatch</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-100 mb-2">
            Online Stopwatch
          </h1>
          <p className="text-muted max-w-md mx-auto">
            Millisecond-precision stopwatch with lap times and keyboard shortcuts.
          </p>
        </div>

        {/* Display */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-8 sm:p-12 mb-6 text-center">
          <div className="font-heading tabular-nums select-none">
            <span className="text-7xl sm:text-8xl lg:text-9xl font-bold text-slate-100 tracking-tight">
              {display.minutes}:{display.seconds}
            </span>
            <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary ml-1">
              .{display.millis}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {!running ? (
              <button
                onClick={start}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition-colors text-lg"
              >
                <Play className="w-5 h-5" />
                {elapsed > 0 ? "Resume" : "Start"}
              </button>
            ) : (
              <button
                onClick={stop}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors text-lg"
              >
                <Pause className="w-5 h-5" />
                Stop
              </button>
            )}
            <button
              onClick={lap}
              disabled={!running && elapsed === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-card-border hover:bg-slate-700 text-slate-200 font-semibold transition-colors text-lg disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Flag className="w-5 h-5" />
              Lap
            </button>
            <button
              onClick={reset}
              disabled={elapsed === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-card-border hover:bg-slate-700 text-slate-200 font-semibold transition-colors text-lg disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>
        </div>

        <AdBanner />

        {/* Keyboard Shortcuts */}
        <div className="flex items-center justify-center gap-6 text-xs text-muted mb-6">
          <span className="flex items-center gap-1.5">
            <Keyboard className="w-3.5 h-3.5" />
            <kbd className="px-1.5 py-0.5 rounded bg-card-border text-slate-300 font-mono">Space</kbd>
            Start/Stop
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-card-border text-slate-300 font-mono">L</kbd>
            Lap
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-card-border text-slate-300 font-mono">R</kbd>
            Reset
          </span>
        </div>

        {/* Laps */}
        {laps.length > 0 && (
          <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-card-border">
              <h2 className="font-heading font-semibold text-slate-200">
                Lap Times ({laps.length})
              </h2>
            </div>
            <div className="max-h-80 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted text-xs uppercase tracking-wider border-b border-card-border">
                    <th className="text-left px-5 py-2.5 font-medium">Lap</th>
                    <th className="text-right px-5 py-2.5 font-medium">Lap Time</th>
                    <th className="text-right px-5 py-2.5 font-medium">Total Time</th>
                  </tr>
                </thead>
                <tbody>
                  {laps.map((l) => {
                    const lt = formatTime(l.lapTime);
                    const tt = formatTime(l.totalTime);
                    const isBest = bestLap && l.number === bestLap.number;
                    const isWorst = worstLap && l.number === worstLap.number;
                    return (
                      <tr
                        key={l.number}
                        className={`border-b border-card-border/50 last:border-0 ${
                          isBest ? "bg-emerald-500/5" : isWorst ? "bg-rose-500/5" : ""
                        }`}
                      >
                        <td className="px-5 py-2.5 font-medium text-slate-300">
                          #{l.number}
                          {isBest && (
                            <span className="ml-2 text-xs text-emerald-400 font-medium">Best</span>
                          )}
                          {isWorst && (
                            <span className="ml-2 text-xs text-rose-400 font-medium">Worst</span>
                          )}
                        </td>
                        <td className="px-5 py-2.5 text-right font-mono tabular-nums text-slate-200">
                          {lt.minutes}:{lt.seconds}.{lt.millis}
                        </td>
                        <td className="px-5 py-2.5 text-right font-mono tabular-nums text-muted">
                          {tt.minutes}:{tt.seconds}.{tt.millis}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-10 grid sm:grid-cols-3 gap-4">
          <div className="bg-card-bg border border-card-border rounded-xl p-4 text-center">
            <p className="text-2xl font-heading font-bold text-slate-100">{laps.length}</p>
            <p className="text-xs text-muted mt-1">Laps Recorded</p>
          </div>
          <div className="bg-card-bg border border-card-border rounded-xl p-4 text-center">
            <p className="text-2xl font-heading font-bold text-slate-100">
              {bestLap ? `${formatTime(bestLap.lapTime).minutes}:${formatTime(bestLap.lapTime).seconds}.${formatTime(bestLap.lapTime).millis}` : "--:--"}
            </p>
            <p className="text-xs text-muted mt-1">Best Lap</p>
          </div>
          <div className="bg-card-bg border border-card-border rounded-xl p-4 text-center">
            <p className="text-2xl font-heading font-bold text-slate-100">10ms</p>
            <p className="text-xs text-muted mt-1">Precision</p>
          </div>
        </div>
      </div>
    </div>
  );
}
