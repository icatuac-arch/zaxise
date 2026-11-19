"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  Timer,
  Plus,
  Trash2,
  Copy,
  Check,
  Link,
  Sparkles,
  Calendar,
  Palette,
  Type,
  AlignLeft,
  Rocket,
  PartyPopper,
  Moon,
  Sun,
  Star,
  Clock,
  ChevronRight,
  X,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  Types & constants                                                  */
/* ------------------------------------------------------------------ */

interface Countdown {
  id: string;
  name: string;
  date: string; // ISO string
  color: ColorKey;
  description?: string;
}

type ColorKey = "indigo" | "cyan" | "emerald" | "amber" | "rose" | "violet";

const COLOR_MAP: Record<ColorKey, { label: string; ring: string; bg: string; text: string; gradient: string; solid: string }> = {
  indigo: {
    label: "Indigo",
    ring: "ring-indigo-500",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    gradient: "from-indigo-500 to-indigo-700",
    solid: "bg-indigo-500",
  },
  cyan: {
    label: "Cyan",
    ring: "ring-cyan-500",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    gradient: "from-cyan-500 to-cyan-700",
    solid: "bg-cyan-500",
  },
  emerald: {
    label: "Emerald",
    ring: "ring-emerald-500",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    gradient: "from-emerald-500 to-emerald-700",
    solid: "bg-emerald-500",
  },
  amber: {
    label: "Amber",
    ring: "ring-amber-500",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    gradient: "from-amber-500 to-amber-700",
    solid: "bg-amber-500",
  },
  rose: {
    label: "Rose",
    ring: "ring-rose-500",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    gradient: "from-rose-500 to-rose-700",
    solid: "bg-rose-500",
  },
  violet: {
    label: "Violet",
    ring: "ring-violet-500",
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    gradient: "from-violet-500 to-violet-700",
    solid: "bg-violet-500",
  },
};

const PREMADE: { name: string; date: string; color: ColorKey; icon: typeof Rocket }[] = [
  { name: "New Year 2027", date: "2027-01-01T00:00", color: "amber", icon: PartyPopper },
  { name: "Next Solar Eclipse", date: "2026-08-12T17:00", color: "violet", icon: Sun },
  { name: "Christmas 2026", date: "2026-12-25T00:00", color: "rose", icon: Star },
  { name: "Summer Solstice 2026", date: "2026-06-21T03:24", color: "emerald", icon: Sun },
  { name: "Next Full Moon", date: "2026-04-26T00:00", color: "cyan", icon: Moon },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function getTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true, total: diff };
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, passed: false, total: diff };
}

function daysAway(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return "Passed";
  const d = Math.ceil(diff / 86400000);
  return d === 1 ? "1 day away" : `${d} days away`;
}

/* ------------------------------------------------------------------ */
/*  Confetti                                                           */
/* ------------------------------------------------------------------ */

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
        color: ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#F43F5E", "#8B5CF6"][
          Math.floor(Math.random() * 6)
        ],
        size: 6 + Math.random() * 8,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute animate-bounce"
          style={{
            left: `${p.left}%`,
            top: "-20px",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CountdownPage() {
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);
  const [activeCountdown, setActiveCountdown] = useState<Countdown | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiShown = useRef(false);

  /* Form state */
  const [formName, setFormName] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formColor, setFormColor] = useState<ColorKey>("indigo");
  const [formDesc, setFormDesc] = useState("");
  const [copied, setCopied] = useState(false);

  /* Tick */
  const [, setTick] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  /* Load from localStorage */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dz-countdowns");
      if (saved) setCountdowns(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  /* Parse query params on load */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const date = params.get("date");
    const color = params.get("color") as ColorKey | null;
    if (name && date) {
      const shared: Countdown = {
        id: "shared",
        name,
        date,
        color: color && COLOR_MAP[color] ? color : "indigo",
        description: params.get("desc") || undefined,
      };
      setActiveCountdown(shared);
    }
  }, []);

  /* Save to localStorage */
  const persist = useCallback((list: Countdown[]) => {
    setCountdowns(list);
    try {
      localStorage.setItem("dz-countdowns", JSON.stringify(list));
    } catch { /* ignore */ }
  }, []);

  /* Confetti trigger */
  useEffect(() => {
    if (!activeCountdown) {
      confettiShown.current = false;
      return;
    }
    const tl = getTimeLeft(activeCountdown.date);
    if (tl.passed && !confettiShown.current) {
      confettiShown.current = true;
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [activeCountdown]);

  /* Create countdown */
  const create = () => {
    if (!formName.trim() || !formDate) return;
    const c: Countdown = {
      id: generateId(),
      name: formName.trim(),
      date: formDate,
      color: formColor,
      description: formDesc.trim() || undefined,
    };
    persist([c, ...countdowns]);
    setActiveCountdown(c);
    setFormName("");
    setFormDate("");
    setFormDesc("");
  };

  const deleteCountdown = (id: string) => {
    persist(countdowns.filter((c) => c.id !== id));
    if (activeCountdown?.id === id) setActiveCountdown(null);
  };

  const getShareUrl = (c: Countdown) => {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    const params = new URLSearchParams();
    params.set("name", c.name);
    params.set("date", c.date);
    params.set("color", c.color);
    if (c.description) params.set("desc", c.description);
    return `${base}/countdown?${params.toString()}`;
  };

  const copyLink = (c: Countdown) => {
    navigator.clipboard.writeText(getShareUrl(c));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startPremade = (p: (typeof PREMADE)[number]) => {
    const c: Countdown = {
      id: generateId(),
      name: p.name,
      date: p.date,
      color: p.color,
    };
    persist([c, ...countdowns]);
    setActiveCountdown(c);
  };

  /* Active countdown time */
  const activeTL = activeCountdown ? getTimeLeft(activeCountdown.date) : null;
  const activeColor = activeCountdown ? COLOR_MAP[activeCountdown.color] : null;

  return (
    <main className="min-h-screen bg-dark-bg text-[#E2E8F0]">
      {showConfetti && <Confetti />}

      {/* Hero */}
      <section className="pt-10 sm:pt-12 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
            <Timer className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Countdown Creator</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Countdown
            </span>{" "}
            Creator
          </h1>
          <p className="text-muted text-lg sm:text-xl max-w-2xl mx-auto">
            Create beautiful countdown timers for any event. Save, share, and celebrate
            when the moment arrives.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-16 space-y-8">
        {/* ------------------------------------------------------------ */}
        {/*  Active Countdown Display                                     */}
        {/* ------------------------------------------------------------ */}
        {activeCountdown && activeTL && activeColor && (
          <section
            className={`relative bg-gradient-to-br ${activeColor.bg} border border-card-border rounded-2xl p-8 sm:p-12 text-center overflow-hidden`}
          >
            <button
              onClick={() => setActiveCountdown(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-card-bg/50 hover:bg-card-bg text-muted hover:text-[#E2E8F0] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h2
              className={`font-heading text-2xl sm:text-3xl font-bold mb-2 ${activeColor.text}`}
            >
              {activeCountdown.name}
            </h2>
            {activeCountdown.description && (
              <p className="text-muted text-sm mb-6">{activeCountdown.description}</p>
            )}

            {activeTL.passed ? (
              <div className="py-8">
                <PartyPopper className={`w-16 h-16 mx-auto mb-4 ${activeColor.text}`} />
                <p className="font-heading text-3xl sm:text-4xl font-bold">
                  The moment has arrived!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-xl mx-auto my-8">
                {([
                  ["Days", activeTL.days],
                  ["Hours", activeTL.hours],
                  ["Minutes", activeTL.minutes],
                  ["Seconds", activeTL.seconds],
                ] as const).map(([label, val]) => (
                  <div key={label} className="bg-card-bg/80 rounded-xl p-3 sm:p-5 border border-card-border">
                    <p className={`font-heading text-3xl sm:text-5xl font-bold ${activeColor.text}`}>
                      {String(val).padStart(2, "0")}
                    </p>
                    <p className="text-xs sm:text-sm text-muted mt-1">{label}</p>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-muted-dark mb-4">
              {new Date(activeCountdown.date).toLocaleString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <button
              onClick={() => copyLink(activeCountdown)}
              className="inline-flex items-center gap-2 bg-card-bg border border-card-border hover:border-primary/50 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Link className="w-4 h-4 text-muted" />}
              {copied ? "Link Copied!" : "Copy Shareable Link"}
            </button>
          </section>
        )}

        {/* ------------------------------------------------------------ */}
        {/*  Create Form                                                  */}
        {/* ------------------------------------------------------------ */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6">
          <h2 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Create a Countdown
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {/* Name */}
            <div>
              <label className="flex items-center gap-1.5 text-sm text-muted mb-1">
                <Type className="w-3.5 h-3.5" /> Event Name
              </label>
              <input
                type="text"
                placeholder="e.g. Trip to Japan"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                maxLength={60}
                className="w-full bg-dark-bg border border-card-border rounded-lg px-3 py-2 text-[#E2E8F0] placeholder-muted-dark focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            {/* Date */}
            <div>
              <label className="flex items-center gap-1.5 text-sm text-muted mb-1">
                <Calendar className="w-3.5 h-3.5" /> Target Date & Time
              </label>
              <input
                type="datetime-local"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full bg-dark-bg border border-card-border rounded-lg px-3 py-2 text-[#E2E8F0] focus:outline-none focus:border-primary transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Color picker */}
          <div className="mb-4">
            <label className="flex items-center gap-1.5 text-sm text-muted mb-2">
              <Palette className="w-3.5 h-3.5" /> Color Theme
            </label>
            <div className="flex gap-3">
              {(Object.keys(COLOR_MAP) as ColorKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setFormColor(key)}
                  className={`w-10 h-10 rounded-full ${COLOR_MAP[key].solid} ring-2 ring-offset-2 ring-offset-dark-bg transition-all ${
                    formColor === key ? COLOR_MAP[key].ring : "ring-transparent"
                  }`}
                  title={COLOR_MAP[key].label}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="flex items-center gap-1.5 text-sm text-muted mb-1">
              <AlignLeft className="w-3.5 h-3.5" /> Description (optional)
            </label>
            <input
              type="text"
              placeholder="What are you counting down to?"
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              maxLength={120}
              className="w-full bg-dark-bg border border-card-border rounded-lg px-3 py-2 text-[#E2E8F0] placeholder-muted-dark focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            onClick={create}
            disabled={!formName.trim() || !formDate}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-40 text-white rounded-lg px-6 py-2.5 font-medium transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Create Countdown
          </button>
        </section>

        <AdBanner />

        {/* ------------------------------------------------------------ */}
        {/*  Pre-made Countdowns                                          */}
        {/* ------------------------------------------------------------ */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6">
          <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-secondary" />
            Quick-Start Countdowns
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PREMADE.map((p) => {
              const tl = getTimeLeft(p.date);
              const c = COLOR_MAP[p.color];
              return (
                <button
                  key={p.name}
                  onClick={() => startPremade(p)}
                  className="group flex items-center gap-3 bg-dark-bg rounded-xl p-4 border border-card-border hover:border-primary/40 transition-colors text-left"
                >
                  <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center flex-shrink-0`}>
                    <p.icon className={`w-5 h-5 ${c.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-sm truncate">{p.name}</h3>
                    <p className="text-xs text-muted">
                      {tl.passed ? "Passed" : `${tl.days}d ${tl.hours}h ${tl.minutes}m`}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-dark group-hover:text-primary transition-colors" />
                </button>
              );
            })}
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/*  My Countdowns                                                */}
        {/* ------------------------------------------------------------ */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6">
          <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            My Countdowns
          </h2>

          {countdowns.length === 0 ? (
            <p className="text-muted text-sm py-4">
              No saved countdowns yet. Create one above or pick a quick-start!
            </p>
          ) : (
            <div className="space-y-3">
              {countdowns.map((c) => {
                const clr = COLOR_MAP[c.color];
                const away = daysAway(c.date);
                return (
                  <div
                    key={c.id}
                    className="flex items-center gap-4 bg-dark-bg rounded-xl p-4 border border-card-border"
                  >
                    <div className={`w-3 h-3 rounded-full ${clr.solid} flex-shrink-0`} />
                    <button
                      onClick={() => {
                        setActiveCountdown(c);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="flex-1 min-w-0 text-left hover:text-primary transition-colors"
                    >
                      <h3 className="font-heading font-semibold text-sm truncate">
                        {c.name}
                      </h3>
                      <p className="text-xs text-muted">
                        {new Date(c.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        &mdash;{" "}
                        <span className={away === "Passed" ? "text-rose-400" : clr.text}>
                          {away}
                        </span>
                      </p>
                    </button>
                    <button
                      onClick={() => copyLink(c)}
                      className="p-2 rounded-lg hover:bg-card-bg text-muted hover:text-[#E2E8F0] transition-colors"
                      title="Copy share link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteCountdown(c.id)}
                      className="p-2 rounded-lg hover:bg-rose-500/10 text-muted hover:text-rose-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
