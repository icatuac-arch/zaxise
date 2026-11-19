"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Satellite,
  Gauge,
  Mountain,
  Clock,
  MapPin,
  Globe,
  Users,
  Rocket,
  Ruler,
  RotateCcw,
  Eye,
  Flag,
  DollarSign,
  Orbit,
  Zap,
  Info,
} from "lucide-react";
import { MAP_PATH_DATA } from "@/app/time/world-clock/map-data";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ISSPosition {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface Astronaut {
  name: string;
  craft: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function latLngToSvg(lat: number, lng: number) {
  const x = ((lng + 180) / 360) * 1000;
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = 500 / 2 - (500 * mercN) / (2 * Math.PI);
  return { x, y };
}

function getRegionFromCoords(lat: number, lng: number): string {
  // Ocean checks first
  if (lat < -60) return "Antarctica";
  if (lat > 66) {
    if (lng > -180 && lng < 180) return "Arctic Region";
  }

  // Rough continent / ocean bounding boxes
  // North America
  if (lat > 15 && lat < 72 && lng > -170 && lng < -50) return "North America";
  // Central America
  if (lat > 7 && lat <= 15 && lng > -120 && lng < -60) return "Central America";
  // South America
  if (lat > -56 && lat <= 15 && lng > -82 && lng < -34) return "South America";
  // Europe
  if (lat > 35 && lat < 72 && lng > -12 && lng < 45) return "Europe";
  // North Africa
  if (lat > 15 && lat <= 37 && lng > -18 && lng < 55) return "North Africa";
  // Sub-Saharan Africa
  if (lat > -35 && lat <= 15 && lng > -18 && lng < 52) return "Sub-Saharan Africa";
  // Middle East
  if (lat > 12 && lat < 42 && lng >= 45 && lng < 65) return "Middle East";
  // Central Asia
  if (lat > 35 && lat < 55 && lng >= 45 && lng < 90) return "Central Asia";
  // South Asia
  if (lat > 5 && lat <= 35 && lng >= 65 && lng < 100) return "South Asia";
  // East Asia
  if (lat > 20 && lat < 55 && lng >= 100 && lng < 145) return "East Asia";
  // Southeast Asia
  if (lat > -10 && lat <= 20 && lng >= 90 && lng < 150) return "Southeast Asia";
  // Russia / Siberia
  if (lat > 50 && lat < 80 && lng >= 45 && lng < 180) return "Russia / Siberia";
  // Australia
  if (lat > -45 && lat < -10 && lng > 110 && lng < 155) return "Australia";
  // Oceania / Pacific
  if (lat > -20 && lat < 20 && lng > 150) return "Pacific Ocean";
  if (lat > -20 && lat < 20 && lng < -120) return "Pacific Ocean";

  // Ocean fallback by longitude bands
  if (lng > -80 && lng < 0 && lat > -60 && lat < 15) return "Atlantic Ocean";
  if (lng >= 0 && lng < 30) return "Atlantic Ocean";
  if (lng >= 30 && lng < 100 && lat < 15) return "Indian Ocean";
  return "Pacific Ocean";
}

/* ------------------------------------------------------------------ */
/*  ISS Facts Data                                                     */
/* ------------------------------------------------------------------ */

const issFacts = [
  {
    icon: Ruler,
    title: "Size of a Football Field",
    description:
      "The ISS spans 109 meters (357 ft) end to end — roughly the size of an American football field including end zones.",
  },
  {
    icon: RotateCcw,
    title: "16 Orbits Per Day",
    description:
      "The ISS completes one full orbit every ~92 minutes, circling Earth about 16 times every 24 hours.",
  },
  {
    icon: Eye,
    title: "Visible to the Naked Eye",
    description:
      "The ISS is the third brightest object in the night sky. It looks like a fast-moving bright star.",
  },
  {
    icon: Users,
    title: "6 People Live on Board",
    description:
      "A rotating crew of about 6 astronauts live and work aboard the ISS, conducting hundreds of experiments.",
  },
  {
    icon: Flag,
    title: "Built by 15 Nations",
    description:
      "The ISS is a joint project involving NASA, Roscosmos, JAXA, ESA, and CSA — representing 15 nations.",
  },
  {
    icon: DollarSign,
    title: "Cost: $150 Billion",
    description:
      "The ISS is the most expensive single object ever built, with a total cost of over $150 billion USD.",
  },
];

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function ISSTrackerPage() {
  const [position, setPosition] = useState<ISSPosition | null>(null);
  const [trail, setTrail] = useState<ISSPosition[]>([]);
  const [astronauts, setAstronauts] = useState<Astronaut[]>([]);
  const [astronautCount, setAstronautCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const trailRef = useRef<ISSPosition[]>([]);

  /* Fetch ISS position */
  const fetchPosition = useCallback(async () => {
    try {
      const res = await fetch("/api/iss-position", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch ISS position");
      const data = await res.json();
      const lat = parseFloat(data.iss_position.latitude);
      const lng = parseFloat(data.iss_position.longitude);
      const ts = data.timestamp;

      const newPos: ISSPosition = { latitude: lat, longitude: lng, timestamp: ts };
      setPosition(newPos);
      setLastUpdated(new Date());
      setError(null);

      // Update trail
      const prev = trailRef.current;
      const updated = [...prev, newPos].slice(-20);
      trailRef.current = updated;
      setTrail(updated);
    } catch {
      setError("Unable to fetch ISS position. Retrying...");
    }
  }, []);

  /* Fetch astronauts */
  const fetchAstronauts = useCallback(async () => {
    try {
      const res = await fetch("/api/astros", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch astronauts");
      const data = await res.json();
      setAstronauts(data.people || []);
      setAstronautCount(data.number || 0);
    } catch {
      // silently fail — not critical
    }
  }, []);

  useEffect(() => {
    fetchPosition();
    fetchAstronauts();
    const posInterval = setInterval(fetchPosition, 5000);
    const astroInterval = setInterval(fetchAstronauts, 60000);
    return () => {
      clearInterval(posInterval);
      clearInterval(astroInterval);
    };
  }, [fetchPosition, fetchAstronauts]);

  /* SVG coords */
  const issPoint = position ? latLngToSvg(position.latitude, position.longitude) : null;
  const trailPoints = trail.map((p) => latLngToSvg(p.latitude, p.longitude));

  /* Build trail path (skip segments that wrap around the map) */
  let trailPath = "";
  for (let i = 0; i < trailPoints.length; i++) {
    if (i === 0) {
      trailPath += `M${trailPoints[i].x},${trailPoints[i].y}`;
    } else {
      const dx = Math.abs(trailPoints[i].x - trailPoints[i - 1].x);
      if (dx > 400) {
        // Wrap-around — start new sub-path
        trailPath += ` M${trailPoints[i].x},${trailPoints[i].y}`;
      } else {
        trailPath += ` L${trailPoints[i].x},${trailPoints[i].y}`;
      }
    }
  }

  const region = position
    ? getRegionFromCoords(position.latitude, position.longitude)
    : "—";

  /* Group astronauts by craft */
  const craftMap: Record<string, string[]> = {};
  astronauts.forEach((a) => {
    if (!craftMap[a.craft]) craftMap[a.craft] = [];
    craftMap[a.craft].push(a.name);
  });

  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Hero */}
      <section className="relative pt-10 sm:pt-12 pb-8 overflow-hidden">
        {/* Subtle grid bg */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#4F46E5 1px, transparent 1px), linear-gradient(90deg, #4F46E5 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4F46E5]/10 border border-[#4F46E5]/20 text-[#4F46E5] text-sm font-medium mb-6">
            <Satellite className="w-4 h-4" />
            <span>Live Tracking</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
            style={{ fontFamily: "var(--font-outfit), Outfit, sans-serif", color: "#E2E8F0" }}
          >
            ISS{" "}
            <span className="bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] bg-clip-text text-transparent">
              Live Tracker
            </span>
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif", color: "#94A3B8" }}
          >
            Watch the International Space Station orbit Earth in real time at 27,600&nbsp;km/h.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-8">
        {/* ---- MAP ---- */}
        <div className="rounded-2xl border border-[#1E293B] bg-[#0F172A] p-4 sm:p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#06B6D4]" />
              <h2
                className="text-lg font-semibold text-[#E2E8F0]"
                style={{ fontFamily: "var(--font-outfit), Outfit, sans-serif" }}
              >
                Live Position
              </h2>
            </div>
            {lastUpdated && (
              <span className="text-xs text-[#94A3B8]">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>

          {error && (
            <div className="mb-3 text-sm text-amber-400/80 flex items-center gap-2">
              <Info className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="relative rounded-xl overflow-hidden border border-[#1E293B]">
            <svg
              viewBox="0 0 1000 500"
              className="w-full h-auto"
              style={{ background: "#0a1628" }}
            >
              {/* Subtle grid lines */}
              {[...Array(7)].map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1={0}
                  y1={(500 / 8) * (i + 1)}
                  x2={1000}
                  y2={(500 / 8) * (i + 1)}
                  stroke="#1E293B"
                  strokeWidth={0.3}
                  strokeDasharray="4 4"
                />
              ))}
              {[...Array(11)].map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={(1000 / 12) * (i + 1)}
                  y1={0}
                  x2={(1000 / 12) * (i + 1)}
                  y2={500}
                  stroke="#1E293B"
                  strokeWidth={0.3}
                  strokeDasharray="4 4"
                />
              ))}

              {/* Continents */}
              <path
                d={MAP_PATH_DATA}
                fill="#162035"
                stroke="#1E293B"
                strokeWidth={0.5}
              />

              {/* ISS Trail */}
              {trailPath && (
                <path
                  d={trailPath}
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.6}
                  filter="url(#trailGlow)"
                />
              )}

              {/* Trail dots (fading) */}
              {trailPoints.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r={1.5}
                  fill="#06B6D4"
                  opacity={0.15 + (i / trailPoints.length) * 0.55}
                />
              ))}

              {/* ISS Dot */}
              {issPoint && (
                <g>
                  {/* Outer pulse ring */}
                  <circle cx={issPoint.x} cy={issPoint.y} r={12} fill="none" stroke="#06B6D4" strokeWidth={1} opacity={0.3}>
                    <animate attributeName="r" from="8" to="20" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                  </circle>
                  {/* Second pulse */}
                  <circle cx={issPoint.x} cy={issPoint.y} r={8} fill="none" stroke="#4F46E5" strokeWidth={1} opacity={0.4}>
                    <animate attributeName="r" from="6" to="16" dur="2s" begin="0.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.6" to="0" dur="2s" begin="0.5s" repeatCount="indefinite" />
                  </circle>
                  {/* Glow */}
                  <circle cx={issPoint.x} cy={issPoint.y} r={6} fill="#06B6D4" opacity={0.2} filter="url(#issGlow)" />
                  {/* Core dot */}
                  <circle cx={issPoint.x} cy={issPoint.y} r={4} fill="#06B6D4" stroke="#fff" strokeWidth={1.5} />
                  {/* ISS label */}
                  <text
                    x={issPoint.x + 10}
                    y={issPoint.y - 8}
                    fill="#06B6D4"
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="Inter, sans-serif"
                  >
                    ISS
                  </text>
                </g>
              )}

              {/* SVG Filters */}
              <defs>
                <filter id="issGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
                </filter>
                <filter id="trailGlow" x="-5%" y="-5%" width="110%" height="110%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                </filter>
              </defs>
            </svg>

            {/* Coordinates overlay */}
            {position && (
              <div className="absolute bottom-3 left-3 bg-[#030712]/80 backdrop-blur-sm border border-[#1E293B] rounded-lg px-3 py-2 text-xs font-mono text-[#06B6D4] flex items-center gap-3">
                <span>
                  LAT {position.latitude.toFixed(4)}
                </span>
                <span className="text-[#1E293B]">|</span>
                <span>
                  LNG {position.longitude.toFixed(4)}
                </span>
              </div>
            )}
          </div>
        </div>

        <AdBanner />

        {/* ---- STATS + ASTRONAUTS ---- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Panel */}
          <div className="lg:col-span-2 rounded-2xl border border-[#1E293B] bg-[#0F172A] p-6">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-[#4F46E5]" />
              <h2
                className="text-lg font-semibold text-[#E2E8F0]"
                style={{ fontFamily: "var(--font-outfit), Outfit, sans-serif" }}
              >
                ISS Stats
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Speed */}
              <StatCard
                icon={<Gauge className="w-5 h-5 text-[#06B6D4]" />}
                label="Speed"
                value="27,600 km/h"
                sub="17,150 mph"
              />
              {/* Altitude */}
              <StatCard
                icon={<Mountain className="w-5 h-5 text-[#06B6D4]" />}
                label="Altitude"
                value="~408 km"
                sub="253 miles"
              />
              {/* Orbital period */}
              <StatCard
                icon={<Clock className="w-5 h-5 text-[#06B6D4]" />}
                label="Orbital Period"
                value="~92 min"
                sub="16 orbits / day"
              />
              {/* Latitude */}
              <StatCard
                icon={<MapPin className="w-5 h-5 text-[#4F46E5]" />}
                label="Latitude"
                value={position ? `${position.latitude.toFixed(4)}` : "—"}
                sub="Live"
                live
              />
              {/* Longitude */}
              <StatCard
                icon={<MapPin className="w-5 h-5 text-[#4F46E5]" />}
                label="Longitude"
                value={position ? `${position.longitude.toFixed(4)}` : "—"}
                sub="Live"
                live
              />
              {/* Region */}
              <StatCard
                icon={<Globe className="w-5 h-5 text-[#4F46E5]" />}
                label="Currently Over"
                value={region}
                sub="Approximate"
                live
              />
            </div>
          </div>

          {/* People in Space */}
          <div className="rounded-2xl border border-[#1E293B] bg-[#0F172A] p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Rocket className="w-5 h-5 text-[#4F46E5]" />
              <h2
                className="text-lg font-semibold text-[#E2E8F0]"
                style={{ fontFamily: "var(--font-outfit), Outfit, sans-serif" }}
              >
                People in Space
              </h2>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-[#4F46E5]/20 to-[#06B6D4]/20 border border-[#4F46E5]/30">
                <span className="text-2xl font-bold text-[#E2E8F0]">{astronautCount || "—"}</span>
              </div>
              <span className="text-sm text-[#94A3B8]">astronauts currently in orbit</span>
            </div>

            <div className="flex-1 overflow-auto space-y-4 max-h-[340px] pr-1 scrollbar-thin">
              {Object.entries(craftMap).map(([craft, names]) => (
                <div key={craft}>
                  <div className="flex items-center gap-2 mb-2">
                    <Orbit className="w-3.5 h-3.5 text-[#06B6D4]" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#06B6D4]">
                      {craft}
                    </span>
                    <span className="text-xs text-[#94A3B8]">({names.length})</span>
                  </div>
                  <ul className="space-y-1 ml-5">
                    {names.map((name) => (
                      <li key={name} className="text-sm text-[#E2E8F0]">
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {astronauts.length === 0 && (
                <p className="text-sm text-[#94A3B8]">Loading crew data...</p>
              )}
            </div>
          </div>
        </div>

        {/* ---- ISS FACTS ---- */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Satellite className="w-5 h-5 text-[#06B6D4]" />
            <h2
              className="text-2xl font-bold text-[#E2E8F0]"
              style={{ fontFamily: "var(--font-outfit), Outfit, sans-serif" }}
            >
              ISS Facts
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {issFacts.map((fact, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-[#1E293B] bg-[#0F172A] p-6 hover:border-[#4F46E5]/40 transition-colors duration-300"
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#4F46E5]/15 to-[#06B6D4]/15 border border-[#1E293B] group-hover:border-[#4F46E5]/30 transition-colors mb-4">
                  <fact.icon className="w-5 h-5 text-[#06B6D4]" />
                </div>
                <h3
                  className="text-base font-semibold text-[#E2E8F0] mb-2"
                  style={{ fontFamily: "var(--font-outfit), Outfit, sans-serif" }}
                >
                  {fact.title}
                </h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{fact.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat Card Sub-component                                            */
/* ------------------------------------------------------------------ */

function StatCard({
  icon,
  label,
  value,
  sub,
  live,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  live?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[#1E293B] bg-[#030712]/50 p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-[#94A3B8] uppercase tracking-wider font-medium">{label}</span>
        {live && (
          <span className="relative flex h-1.5 w-1.5 ml-auto">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
          </span>
        )}
      </div>
      <div className="text-lg font-bold text-[#E2E8F0] font-mono">{value}</div>
      <div className="text-xs text-[#94A3B8] mt-0.5">{sub}</div>
    </div>
  );
}
