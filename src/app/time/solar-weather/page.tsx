"use client";

import { useState, useEffect } from "react";
import {
  Sun,
  Activity,
  MapPin,
  Zap,
  Eye,
  RefreshCw,
  AlertTriangle,
  Globe,
  Compass,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

interface KpEntry {
  time_tag: string;
  kp_index: number;
  estimated_kp: number;
}

/* ------------------------------------------------------------------ */
/*  STATIC DATA                                                        */
/* ------------------------------------------------------------------ */

const auroraGuide: { range: string; label: string; locations: string; color: string }[] = [
  { range: "Kp 0-2", label: "Quiet", locations: "Far north only — Svalbard, Northern Alaska, Northern Siberia", color: "bg-green-500" },
  { range: "Kp 3", label: "Unsettled", locations: "Northern Scandinavia, Iceland, Northern Canada, Fairbanks", color: "bg-green-400" },
  { range: "Kp 4", label: "Active", locations: "Southern Scandinavia, Scotland, Northern US states (Montana, Minnesota)", color: "bg-yellow-400" },
  { range: "Kp 5", label: "Minor Storm", locations: "Northern England, Northern Germany, Seattle, Minneapolis, Southern Canada", color: "bg-yellow-500" },
  { range: "Kp 6-7", label: "Strong Storm", locations: "Could be visible as far south as London, Paris, New York, Chicago", color: "bg-orange-500" },
  { range: "Kp 8-9", label: "Extreme Storm", locations: "Historic event — aurora visible worldwide, even near the equator", color: "bg-red-500" },
];

const auroraLocations: {
  name: string;
  country: string;
  lat: string;
  bestSeason: string;
  highlight: string;
}[] = [
  { name: "Tromsoe", country: "Norway", lat: "69.6 deg N", bestSeason: "Sep-Mar", highlight: "Norway's aurora capital — fjord reflections under the lights" },
  { name: "Reykjavik", country: "Iceland", lat: "64.1 deg N", bestSeason: "Sep-Apr", highlight: "Dark winters, volcanic landscapes, and hot springs under the aurora" },
  { name: "Fairbanks", country: "Alaska, USA", lat: "64.8 deg N", bestSeason: "Sep-Mar", highlight: "Under the auroral oval — one of the most reliable spots on Earth" },
  { name: "Yellowknife", country: "Canada", lat: "62.5 deg N", bestSeason: "Aug-Apr", highlight: "Clear skies and flat terrain provide unobstructed 360-degree views" },
  { name: "Rovaniemi", country: "Finland", lat: "66.5 deg N", bestSeason: "Sep-Mar", highlight: "Arctic Circle location with glass igloos for aurora viewing" },
  { name: "Abisko", country: "Sweden", lat: "68.3 deg N", bestSeason: "Sep-Mar", highlight: "Rain shadow microclimate makes it one of the clearest spots in Scandinavia" },
  { name: "Svalbard", country: "Norway", lat: "78.2 deg N", bestSeason: "Oct-Feb", highlight: "Polar night offers 24-hour darkness and daytime aurora viewing" },
  { name: "Tasmania", country: "Australia", lat: "42.9 deg S", bestSeason: "Mar-Sep", highlight: "Southern Lights (Aurora Australis) visible during southern winter" },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function getKpColor(kp: number): string {
  if (kp <= 3) return "#22c55e";
  if (kp <= 5) return "#eab308";
  if (kp <= 7) return "#f97316";
  return "#ef4444";
}

function getKpLabel(kp: number): string {
  if (kp <= 1) return "Quiet";
  if (kp <= 3) return "Unsettled";
  if (kp <= 5) return "Active";
  if (kp <= 7) return "Strong Storm";
  return "Extreme Storm";
}

function getAuroraVisibility(kp: number): string {
  if (kp <= 2) return "Aurora unlikely at most locations";
  if (kp <= 3) return "Aurora possible at high latitudes";
  if (kp <= 5) return "Aurora visible at mid latitudes";
  return "Major aurora event!";
}

/* ------------------------------------------------------------------ */
/*  SUN SVG                                                            */
/* ------------------------------------------------------------------ */

function AnimatedSun() {
  return (
    <svg viewBox="0 0 200 200" className="w-40 h-40 md:w-56 md:h-56 mx-auto">
      {/* corona rays */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 100 + Math.cos(angle) * 60;
        const y1 = 100 + Math.sin(angle) * 60;
        const x2 = 100 + Math.cos(angle) * 90;
        const y2 = 100 + Math.sin(angle) * 90;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#FBBF24"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.7"
          >
            <animate
              attributeName="opacity"
              values="0.4;1;0.4"
              dur={`${2 + (i % 3) * 0.5}s`}
              repeatCount="indefinite"
              begin={`${i * 0.15}s`}
            />
            <animate
              attributeName="x2"
              values={`${x2};${100 + Math.cos(angle) * 95};${x2}`}
              dur={`${2.5 + (i % 4) * 0.3}s`}
              repeatCount="indefinite"
              begin={`${i * 0.1}s`}
            />
            <animate
              attributeName="y2"
              values={`${y2};${100 + Math.sin(angle) * 95};${y2}`}
              dur={`${2.5 + (i % 4) * 0.3}s`}
              repeatCount="indefinite"
              begin={`${i * 0.1}s`}
            />
          </line>
        );
      })}
      {/* outer glow */}
      <circle cx="100" cy="100" r="52" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.3">
        <animate attributeName="r" values="52;58;52" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* sun body */}
      <circle cx="100" cy="100" r="45" fill="url(#sunGrad)" />
      {/* surface detail */}
      <circle cx="88" cy="90" r="6" fill="#D97706" opacity="0.3">
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="115" cy="105" r="4" fill="#D97706" opacity="0.25">
        <animate attributeName="opacity" values="0.15;0.4;0.15" dur="5s" repeatCount="indefinite" />
      </circle>
      <defs>
        <radialGradient id="sunGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="60%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  KP METER                                                           */
/* ------------------------------------------------------------------ */

function KpMeter({ kp }: { kp: number }) {
  const segments = 9;
  return (
    <div className="flex items-end gap-1 h-20">
      {Array.from({ length: segments }).map((_, i) => {
        const level = i + 1;
        const active = level <= Math.round(kp);
        let color = "bg-green-500";
        if (level >= 8) color = "bg-red-500";
        else if (level >= 6) color = "bg-orange-500";
        else if (level >= 4) color = "bg-yellow-500";
        const heightPercent = 30 + (level / segments) * 70;
        return (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <div
              className={`w-full rounded-sm transition-all duration-500 ${active ? color : "bg-slate-700"}`}
              style={{ height: `${heightPercent}%`, opacity: active ? 1 : 0.3 }}
            />
            <span className="text-[10px] text-muted">{level}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                          */
/* ------------------------------------------------------------------ */

export default function SolarWeatherPage() {
  const [kpIndex, setKpIndex] = useState<number | null>(null);
  const [kpTime, setKpTime] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchSolarData();
  }, []);

  async function fetchSolarData() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/solar");
      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      if (data.kp && data.kp.length > 0) {
        const latest = data.kp[data.kp.length - 1] as KpEntry;
        setKpIndex(latest.kp_index ?? latest.estimated_kp ?? 0);
        setKpTime(latest.time_tag);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const currentKp = kpIndex ?? 0;

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden pt-10 sm:pt-12 pb-8">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <AnimatedSun />
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mt-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            Solar Weather &amp; Aurora Forecast
          </h1>
          <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto mt-4">
            Real-time solar data from NOAA. Track geomagnetic activity, predict aurora visibility, and discover the best places to see the Northern Lights.
          </p>
        </div>
      </section>

      {/* ==================== LIVE SOLAR DATA ==================== */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-3 mb-8">
          <Activity className="w-6 h-6 text-secondary" />
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-100">Live Solar Data</h2>
          <button
            onClick={fetchSolarData}
            className="ml-auto flex items-center gap-2 text-sm text-muted hover:text-slate-200 transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-red-300 text-sm">Unable to fetch solar data from NOAA. Please try again later.</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Kp Index Card */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-6">
            <div className="text-sm text-muted mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Current Kp Index
            </div>
            {loading ? (
              <div className="h-20 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-5xl font-heading font-bold"
                    style={{ color: getKpColor(currentKp) }}
                  >
                    {currentKp.toFixed(1)}
                  </span>
                  <span className="text-muted text-sm">/ 9</span>
                </div>
                <div
                  className="text-sm font-medium mt-1"
                  style={{ color: getKpColor(currentKp) }}
                >
                  {getKpLabel(currentKp)}
                </div>
                {kpTime && (
                  <div className="text-xs text-muted mt-2">
                    Updated: {new Date(kpTime).toLocaleString()}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Aurora Visibility Card */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-6">
            <div className="text-sm text-muted mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Aurora Visibility
            </div>
            {loading ? (
              <div className="h-20 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <p className="text-xl font-heading font-semibold text-slate-100 mt-2">
                  {getAuroraVisibility(currentKp)}
                </p>
                <p className="text-sm text-muted mt-3">
                  {currentKp >= 6
                    ? "Check outside now! This is a significant event."
                    : currentKp >= 4
                    ? "Worth checking if you have clear dark skies."
                    : "Normal conditions. Head north for best chances."}
                </p>
              </>
            )}
          </div>

          {/* Kp Meter Card */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-6">
            <div className="text-sm text-muted mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Geomagnetic Activity
            </div>
            {loading ? (
              <div className="h-20 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <KpMeter kp={currentKp} />
            )}
            <div className="flex justify-between text-[10px] text-muted mt-1">
              <span>Quiet</span>
              <span>Moderate</span>
              <span>Extreme</span>
            </div>
          </div>
        </div>
      </section>

      <AdBanner />

      {/* ==================== AURORA VIEWING GUIDE ==================== */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-3 mb-8">
          <Compass className="w-6 h-6 text-secondary" />
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-100">Aurora Viewing Guide</h2>
        </div>
        <p className="text-muted mb-6 max-w-3xl">
          The Kp index directly determines how far south (or north in the Southern Hemisphere) the aurora can be seen. Higher Kp means the auroral oval expands, making the lights visible to more people.
        </p>
        <div className="space-y-3">
          {auroraGuide.map((item) => (
            <div
              key={item.range}
              className="bg-card-bg border border-card-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <div className="flex items-center gap-3 sm:w-40 shrink-0">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="font-heading font-semibold text-slate-100">{item.range}</span>
                <span className="text-xs text-muted">({item.label})</span>
              </div>
              <p className="text-sm text-slate-300">{item.locations}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== SOLAR CYCLE 25 ==================== */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-3 mb-8">
          <Sun className="w-6 h-6 text-yellow-400" />
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-100">Solar Cycle 25</h2>
        </div>
        <div className="bg-card-bg border border-card-border rounded-2xl p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-heading text-xl font-semibold text-slate-100 mb-3">We Are Near Solar Maximum</h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                The Sun follows an approximately 11-year activity cycle. We are currently in <strong className="text-yellow-400">Solar Cycle 25</strong>, which began in December 2019. The cycle reached its predicted peak around mid-2025, and solar activity remains elevated through 2026.
              </p>
              <p className="text-slate-300 leading-relaxed mb-4">
                During solar maximum, the Sun produces more sunspots, solar flares, and coronal mass ejections (CMEs). These events send charged particles toward Earth, fueling spectacular aurora displays.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Solar Cycle 25 has actually exceeded initial predictions, with sunspot numbers surpassing expected levels. This means <strong className="text-green-400">enhanced aurora activity</strong> and more frequent geomagnetic storms through 2026 and potentially into 2027.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-dark-bg rounded-xl p-4 border border-card-border">
                <div className="text-sm text-muted mb-1">Cycle Start</div>
                <div className="font-heading text-lg font-semibold text-slate-100">December 2019</div>
              </div>
              <div className="bg-dark-bg rounded-xl p-4 border border-card-border">
                <div className="text-sm text-muted mb-1">Predicted Peak</div>
                <div className="font-heading text-lg font-semibold text-yellow-400">Mid-2025 (ongoing)</div>
              </div>
              <div className="bg-dark-bg rounded-xl p-4 border border-card-border">
                <div className="text-sm text-muted mb-1">Peak Sunspot Number</div>
                <div className="font-heading text-lg font-semibold text-orange-400">~150-180 (exceeding predictions)</div>
              </div>
              <div className="bg-dark-bg rounded-xl p-4 border border-card-border">
                <div className="text-sm text-muted mb-1">What It Means</div>
                <div className="text-sm text-slate-300">More frequent aurora, occasional radio blackouts, and higher radiation levels for astronauts and polar flights.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WHAT CAUSES AURORA ==================== */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="w-6 h-6 text-green-400" />
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-100">What Causes the Aurora</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "1",
              title: "Solar Wind",
              desc: "The Sun constantly emits a stream of charged particles (electrons and protons) called the solar wind, traveling at 400-800 km/s. During solar storms, bursts of plasma called coronal mass ejections dramatically increase this flow.",
              color: "text-yellow-400",
              borderColor: "border-yellow-400/30",
            },
            {
              step: "2",
              title: "Magnetosphere",
              desc: "Earth's magnetic field creates a protective bubble — the magnetosphere. When the solar wind hits it, the magnetic field lines on the night side reconnect, funneling charged particles toward the polar regions along magnetic field lines.",
              color: "text-blue-400",
              borderColor: "border-blue-400/30",
            },
            {
              step: "3",
              title: "Atmospheric Collision",
              desc: "The charged particles slam into gas molecules in Earth's upper atmosphere (100-300 km altitude). The energy transfer excites these molecules, and when they return to their ground state they release photons — light.",
              color: "text-green-400",
              borderColor: "border-green-400/30",
            },
            {
              step: "4",
              title: "Aurora Colors",
              desc: "Green (most common): oxygen at 100-300 km. Red: oxygen above 300 km. Purple/blue: nitrogen below 100 km. The color depends on which gas is excited and at what altitude the collision occurs.",
              color: "text-purple-400",
              borderColor: "border-purple-400/30",
            },
          ].map((item) => (
            <div key={item.step} className={`bg-card-bg border ${item.borderColor} rounded-2xl p-6`}>
              <div className={`font-heading text-3xl font-bold ${item.color} mb-2`}>{item.step}</div>
              <h3 className="font-heading text-lg font-semibold text-slate-100 mb-3">{item.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== BEST AURORA LOCATIONS ==================== */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex items-center gap-3 mb-8">
          <Globe className="w-6 h-6 text-secondary" />
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-100">Best Aurora Destinations</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {auroraLocations.map((loc) => (
            <div
              key={loc.name}
              className="bg-card-bg border border-card-border rounded-2xl p-5 hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-primary group-hover:text-secondary transition-colors" />
                <h3 className="font-heading font-semibold text-slate-100">{loc.name}</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Country</span>
                  <span className="text-slate-300">{loc.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Latitude</span>
                  <span className="text-slate-300">{loc.lat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Best Season</span>
                  <span className="text-slate-300">{loc.bestSeason}</span>
                </div>
              </div>
              <p className="text-xs text-muted mt-3 pt-3 border-t border-card-border leading-relaxed">
                {loc.highlight}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
