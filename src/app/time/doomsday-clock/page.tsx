"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Clock,
  Atom,
  Flame,
  Cpu,
  Bug,
  Shield,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  DATA                                                                */
/* ------------------------------------------------------------------ */

interface ClockEntry {
  year: number;
  seconds: number; // seconds to midnight
  label: string;
  reason: string;
}

const HISTORY: ClockEntry[] = [
  {
    year: 1947,
    seconds: 7 * 60,
    label: "7 min",
    reason: "First setting of the Doomsday Clock after the atomic bombings of Hiroshima and Nagasaki.",
  },
  {
    year: 1949,
    seconds: 3 * 60,
    label: "3 min",
    reason: "The Soviet Union tests its first nuclear weapon, ending the US monopoly on atomic bombs.",
  },
  {
    year: 1953,
    seconds: 2 * 60,
    label: "2 min",
    reason: "Both the US and Soviet Union test thermonuclear (hydrogen) bombs within months of each other.",
  },
  {
    year: 1963,
    seconds: 12 * 60,
    label: "12 min",
    reason: "The Partial Test Ban Treaty limits nuclear testing, easing Cold War tensions.",
  },
  {
    year: 1972,
    seconds: 12 * 60,
    label: "12 min",
    reason: "The SALT I and ABM Treaty agreements signal progress in arms control between superpowers.",
  },
  {
    year: 1984,
    seconds: 3 * 60,
    label: "3 min",
    reason: "US-Soviet relations deteriorate sharply. Arms race accelerates with no meaningful dialogue.",
  },
  {
    year: 1991,
    seconds: 17 * 60,
    label: "17 min",
    reason: "The Cold War ends. The furthest the clock has ever been from midnight.",
  },
  {
    year: 2007,
    seconds: 5 * 60,
    label: "5 min",
    reason: "Nuclear ambitions in North Korea and Iran, plus growing concerns about climate change.",
  },
  {
    year: 2012,
    seconds: 5 * 60,
    label: "5 min",
    reason: "Insufficient action on nuclear weapons reduction and climate change.",
  },
  {
    year: 2015,
    seconds: 3 * 60,
    label: "3 min",
    reason: "Unchecked climate change, nuclear weapons modernization, and outsized nuclear arsenals.",
  },
  {
    year: 2018,
    seconds: 2 * 60,
    label: "2 min",
    reason: "North Korean nuclear crisis, Trump-era nuclear posturing, and climate inaction.",
  },
  {
    year: 2020,
    seconds: 100,
    label: "100 sec",
    reason: "Closest ever at the time. Nuclear tensions, climate crisis, and information warfare.",
  },
  {
    year: 2023,
    seconds: 90,
    label: "90 sec",
    reason: "Russia's invasion of Ukraine and thinly veiled nuclear threats move the clock closer.",
  },
  {
    year: 2024,
    seconds: 90,
    label: "90 sec",
    reason: "Continued nuclear risk from the Ukraine conflict, climate change, and AI-related dangers.",
  },
  {
    year: 2025,
    seconds: 89,
    label: "89 sec",
    reason: "Current setting. Ongoing nuclear tensions, accelerating climate change, disruptive AI, and biosecurity threats.",
  },
];

const FACTORS = [
  {
    icon: <Atom className="w-5 h-5 text-red-400" />,
    title: "Nuclear Weapons Risk",
    description:
      "The original and primary concern. Over 12,000 nuclear warheads still exist worldwide. Modernization programs, destabilizing doctrines, and regional conflicts keep this threat at the forefront.",
  },
  {
    icon: <Flame className="w-5 h-5 text-orange-400" />,
    title: "Climate Change",
    description:
      "Rising global temperatures, extreme weather events, sea-level rise, and ecosystem collapse threaten billions. Carbon emissions continue to rise despite international pledges.",
  },
  {
    icon: <Cpu className="w-5 h-5 text-yellow-400" />,
    title: "Disruptive Technologies",
    description:
      "Artificial intelligence, autonomous weapons, cyber warfare, and hypersonic missiles create new vectors for catastrophic miscalculation and escalation.",
  },
  {
    icon: <Bug className="w-5 h-5 text-green-400" />,
    title: "Biosecurity Threats",
    description:
      "Pandemic preparedness gaps, dual-use biological research, and the potential for engineered pathogens pose growing existential risks.",
  },
];

/* ------------------------------------------------------------------ */
/*  SVG CLOCK                                                          */
/* ------------------------------------------------------------------ */

function DoomsdayClock() {
  const cx = 200;
  const cy = 200;
  const r = 170;

  // Clock reads 11:58:31 (89 seconds to midnight)
  const hourAngle = (11 / 12) * 360 + (58 / 60) * 30 + (31 / 3600) * 30 - 90;
  const minuteAngle = (58 / 60) * 360 + (31 / 60) * 6 - 90;
  const secondAngle = (31 / 60) * 360 - 90;

  const hourRad = (hourAngle * Math.PI) / 180;
  const minRad = (minuteAngle * Math.PI) / 180;
  const secRad = (secondAngle * Math.PI) / 180;

  const hourLen = 90;
  const minLen = 120;
  const secLen = 135;

  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-sm mx-auto">
      <defs>
        <radialGradient id="clockGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a0000" />
          <stop offset="70%" stopColor="#0a0000" />
          <stop offset="100%" stopColor="#030712" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="strongGlow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <circle cx={cx} cy={cy} r={r + 20} fill="url(#clockGlow)" />

      {/* Outer ring */}
      <circle
        cx={cx}
        cy={cy}
        r={r + 5}
        fill="none"
        stroke="#991b1b"
        strokeWidth="2"
        opacity="0.6"
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#7f1d1d"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Hour markers */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const x1 = cx + (r - 15) * Math.cos(rad);
        const y1 = cy + (r - 15) * Math.sin(rad);
        const x2 = cx + (r - 4) * Math.cos(rad);
        const y2 = cy + (r - 4) * Math.sin(rad);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={i === 0 ? "#ef4444" : "#94A3B8"}
            strokeWidth={i === 0 ? 3 : 2}
            opacity={i === 0 ? 1 : 0.5}
          />
        );
      })}

      {/* "12" label at top */}
      <text
        x={cx}
        y={cy - r + 40}
        textAnchor="middle"
        fill="#ef4444"
        fontSize="18"
        fontWeight="bold"
        fontFamily="monospace"
        filter="url(#glow)"
      >
        12
      </text>

      {/* Minute markers */}
      {Array.from({ length: 60 }).map((_, i) => {
        if (i % 5 === 0) return null;
        const angle = (i / 60) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const x1 = cx + (r - 8) * Math.cos(rad);
        const y1 = cy + (r - 8) * Math.sin(rad);
        const x2 = cx + (r - 4) * Math.cos(rad);
        const y2 = cy + (r - 4) * Math.sin(rad);
        return (
          <line
            key={`m${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#94A3B8"
            strokeWidth={1}
            opacity={0.2}
          />
        );
      })}

      {/* Hour hand */}
      <line
        x1={cx}
        y1={cy}
        x2={cx + hourLen * Math.cos(hourRad)}
        y2={cy + hourLen * Math.sin(hourRad)}
        stroke="#f97316"
        strokeWidth="5"
        strokeLinecap="round"
        filter="url(#glow)"
      />

      {/* Minute hand */}
      <line
        x1={cx}
        y1={cy}
        x2={cx + minLen * Math.cos(minRad)}
        y2={cy + minLen * Math.sin(minRad)}
        stroke="#f97316"
        strokeWidth="3"
        strokeLinecap="round"
        filter="url(#glow)"
      />

      {/* Second hand */}
      <line
        x1={cx}
        y1={cy}
        x2={cx + secLen * Math.cos(secRad)}
        y2={cy + secLen * Math.sin(secRad)}
        stroke="#ef4444"
        strokeWidth="1.5"
        strokeLinecap="round"
        filter="url(#strongGlow)"
      />

      {/* Center dot */}
      <circle cx={cx} cy={cy} r="5" fill="#f97316" filter="url(#glow)" />

      {/* "MIDNIGHT" label */}
      <text
        x={cx}
        y={cy - r + 58}
        textAnchor="middle"
        fill="#991b1b"
        fontSize="9"
        fontFamily="monospace"
        letterSpacing="2"
      >
        MIDNIGHT
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  TIMELINE CHART                                                     */
/* ------------------------------------------------------------------ */

function HistoryChart() {
  const maxSeconds = 17 * 60; // 17 min = furthest
  const chartW = 800;
  const chartH = 300;
  const padL = 50;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  const minYear = 1947;
  const maxYear = 2025;

  function xPos(year: number): number {
    return padL + ((year - minYear) / (maxYear - minYear)) * plotW;
  }

  function yPos(seconds: number): number {
    return padT + plotH - (seconds / maxSeconds) * plotH;
  }

  const points = HISTORY.map(
    (h) => `${xPos(h.year)},${yPos(h.seconds)}`
  ).join(" ");

  return (
    <svg
      viewBox={`0 0 ${chartW} ${chartH}`}
      className="w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>

      {/* Grid lines for minutes */}
      {[1, 2, 3, 5, 7, 10, 12, 15, 17].map((min) => (
        <g key={min}>
          <line
            x1={padL}
            y1={yPos(min * 60)}
            x2={chartW - padR}
            y2={yPos(min * 60)}
            stroke="#1E293B"
            strokeWidth="1"
          />
          <text
            x={padL - 8}
            y={yPos(min * 60) + 4}
            textAnchor="end"
            fill="#94A3B8"
            fontSize="10"
            fontFamily="monospace"
          >
            {min}m
          </text>
        </g>
      ))}

      {/* Midnight line at bottom */}
      <line
        x1={padL}
        y1={yPos(0)}
        x2={chartW - padR}
        y2={yPos(0)}
        stroke="#ef4444"
        strokeWidth="1.5"
        strokeDasharray="4,4"
        opacity="0.5"
      />
      <text
        x={chartW - padR + 2}
        y={yPos(0) + 4}
        fill="#ef4444"
        fontSize="9"
        fontFamily="monospace"
      >
        0
      </text>

      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke="url(#lineGrad)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Dots & labels */}
      {HISTORY.map((h) => {
        const x = xPos(h.year);
        const y = yPos(h.seconds);
        const isHighlight =
          h.year === 1953 ||
          h.year === 1991 ||
          h.year === 2020 ||
          h.year === 2025;
        return (
          <g key={h.year}>
            <circle
              cx={x}
              cy={y}
              r={isHighlight ? 5 : 3}
              fill={h.seconds <= 120 ? "#ef4444" : "#f97316"}
              opacity={isHighlight ? 1 : 0.7}
            />
            {/* Year labels for highlighted entries */}
            {isHighlight && (
              <>
                <text
                  x={x}
                  y={chartH - 5}
                  textAnchor="middle"
                  fill="#E2E8F0"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {h.year}
                </text>
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  fill="#E2E8F0"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {h.label}
                </text>
              </>
            )}
          </g>
        );
      })}

      {/* Year axis labels */}
      {[1947, 1960, 1970, 1980, 1990, 2000, 2010, 2025].map((yr) => (
        <text
          key={yr}
          x={xPos(yr)}
          y={chartH - 5}
          textAnchor="middle"
          fill="#64748B"
          fontSize="9"
          fontFamily="monospace"
        >
          {yr}
        </text>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                          */
/* ------------------------------------------------------------------ */

export default function DoomsdayClockPage() {
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-dark-bg text-[#E2E8F0]">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 pt-10 sm:pt-12 pb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-6">
          <AlertTriangle className="w-4 h-4" />
          Existential Risk
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
          Doomsday Clock
        </h1>
        <p className="text-muted max-w-2xl mx-auto text-base sm:text-lg">
          The Bulletin of the Atomic Scientists&apos; symbolic clock representing
          how close humanity is to catastrophic destruction.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-950/50 border border-red-500/30">
          <Clock className="w-5 h-5 text-red-400" />
          <span className="text-red-300 font-heading font-bold text-lg">
            89 seconds to midnight
          </span>
          <span className="text-muted text-sm ml-1">(January 2025)</span>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-16 space-y-10">
        {/* ── The Clock ───────────────────────────────────────────── */}
        <section className="bg-card-bg border border-red-900/30 rounded-2xl p-6 sm:p-8">
          <DoomsdayClock />
          <p className="text-center text-muted text-sm mt-4">
            The clock reads <span className="text-red-400 font-mono font-semibold">11:58:31</span> — 89 seconds to midnight
          </p>
        </section>

        {/* ── What Is It ──────────────────────────────────────────── */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6">
          <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-orange-400" />
            What Is the Doomsday Clock?
          </h2>
          <div className="space-y-3 text-muted text-sm leading-relaxed">
            <p>
              The Doomsday Clock was created in <span className="text-white font-medium">1947</span> by the Bulletin of the Atomic Scientists, a group founded by Manhattan Project researchers who helped develop the first nuclear weapons. The clock is a symbol of how close humanity stands to catastrophic destruction — represented as &ldquo;midnight.&rdquo;
            </p>
            <p>
              The clock&apos;s position is set annually by the Bulletin&apos;s Science and Security Board, which includes <span className="text-white font-medium">Nobel laureates</span> and leading experts in nuclear policy, climate science, and emerging technologies.
            </p>
            <p>
              Originally focused solely on nuclear weapons, the clock now considers a broader range of existential threats: <span className="text-white font-medium">nuclear risk, climate change, disruptive technologies (including AI), and biosecurity threats</span>.
            </p>
          </div>
        </section>

        {/* ── History Timeline Chart ──────────────────────────────── */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6">
          <h2 className="font-heading text-xl font-semibold mb-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-400" />
            Clock Position Over Time
          </h2>
          <p className="text-muted text-sm mb-6">
            Minutes to midnight, 1947 &ndash; 2025. Lower means closer to catastrophe.
          </p>
          <HistoryChart />
        </section>

        {/* ── History List ────────────────────────────────────────── */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6">
          <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-400" />
            Complete Timeline
          </h2>
          <div className="space-y-2">
            {HISTORY.map((entry, i) => {
              const isExpanded = expandedEntry === i;
              const isDanger = entry.seconds <= 120;
              return (
                <button
                  key={entry.year}
                  onClick={() =>
                    setExpandedEntry(isExpanded ? null : i)
                  }
                  className={`w-full text-left bg-dark-bg border rounded-xl p-4 transition-colors ${
                    isDanger
                      ? "border-red-900/40 hover:border-red-500/40"
                      : "border-card-border hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-mono text-muted w-12">
                        {entry.year}
                      </span>
                      <span
                        className={`font-heading font-bold text-sm ${
                          isDanger ? "text-red-400" : "text-orange-300"
                        }`}
                      >
                        {entry.label}
                      </span>
                      {/* Visual bar */}
                      <div className="hidden sm:block w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(
                              (entry.seconds / (17 * 60)) * 100,
                              100
                            )}%`,
                            backgroundColor: isDanger ? "#ef4444" : "#f97316",
                          }}
                        />
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted" />
                    )}
                  </div>
                  {isExpanded && (
                    <p className="text-muted text-sm mt-3 leading-relaxed">
                      {entry.reason}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <AdBanner />

        {/* ── Factors ─────────────────────────────────────────────── */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6">
          <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            What the Scientists Consider
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FACTORS.map((factor) => (
              <div
                key={factor.title}
                className="bg-dark-bg border border-card-border rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  {factor.icon}
                  <h3 className="font-heading font-semibold text-sm text-white">
                    {factor.title}
                  </h3>
                </div>
                <p className="text-muted text-sm leading-relaxed">
                  {factor.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── What Can Be Done ────────────────────────────────────── */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6">
          <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            What Can Be Done
          </h2>
          <div className="space-y-3 text-muted text-sm leading-relaxed">
            <p>The Bulletin of the Atomic Scientists recommends several key actions to move the clock hands further from midnight:</p>
            <ul className="space-y-2 ml-4">
              {[
                "Negotiate and ratify new arms control agreements to reduce nuclear arsenals and prevent proliferation.",
                "Dramatically accelerate the transition away from fossil fuels to meet Paris Agreement climate targets.",
                "Establish international governance frameworks for artificial intelligence, autonomous weapons, and other disruptive technologies.",
                "Strengthen global biosecurity protocols and pandemic preparedness, including oversight of dual-use biological research.",
                "Restore and strengthen diplomatic channels between nuclear-armed states to reduce the risk of miscalculation.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">&#8226;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Disclaimer ──────────────────────────────────────────── */}
        <section className="bg-orange-950/20 border border-orange-900/30 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <p className="text-muted text-sm leading-relaxed">
              <span className="text-orange-300 font-medium">Disclaimer:</span>{" "}
              The Doomsday Clock is a symbol, not a scientific instrument. It
              represents the judgment of leading scientists about existential
              threats to humanity. The clock&apos;s position is set by the Bulletin of
              the Atomic Scientists&apos; Science and Security Board and does not
              predict specific events.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
