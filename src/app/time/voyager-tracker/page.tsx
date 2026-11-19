"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Rocket,
  Gauge,
  Clock,
  Radio,
  Disc3,
  Globe,
  Music,
  Languages,
  Image,
  Milestone,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Satellite,
  Zap,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                          */
/* ------------------------------------------------------------------ */

// Voyager 1
const V1_BASE_KM = 24_500_000_000; // ~24.5 billion km as of Jan 1, 2026
const V1_SPEED_KMS = 17.0; // km/s
const V1_BASE_DATE = new Date("2026-01-01T00:00:00Z");

// Voyager 2
const V2_BASE_KM = 20_500_000_000; // ~20.5 billion km as of Jan 1, 2026
const V2_SPEED_KMS = 15.4; // km/s
const V2_BASE_DATE = new Date("2026-01-01T00:00:00Z");

// Conversions
const KM_PER_MILE = 1.60934;
const KM_PER_AU = 149_597_870.7;
const LIGHT_SPEED_KMS = 299_792.458;

/* ------------------------------------------------------------------ */
/*  TIMELINE                                                           */
/* ------------------------------------------------------------------ */

const timeline = [
  {
    year: "1977",
    title: "Launch from Cape Canaveral",
    desc: "Voyager 1 launched on September 5, 1977 aboard a Titan IIIE rocket, 16 days after its twin Voyager 2.",
  },
  {
    year: "1979",
    title: "Jupiter Flyby",
    desc: "Captured the first detailed images of Jupiter's atmosphere, discovered active volcanoes on moon Io, and studied the faint ring system.",
  },
  {
    year: "1980",
    title: "Saturn Flyby",
    desc: "Revealed the intricate structure of Saturn's rings and discovered several new moons. Titan's atmosphere was studied in detail.",
  },
  {
    year: "1990",
    title: '"Pale Blue Dot" Photo',
    desc: 'At 6 billion km away, Voyager 1 turned around to take the famous "Pale Blue Dot" photo of Earth, inspiring Carl Sagan\'s iconic reflection.',
  },
  {
    year: "1998",
    title: "Most Distant Human-Made Object",
    desc: "Surpassed Pioneer 10 to become the most distant human-made object from Earth, a record it still holds today.",
  },
  {
    year: "2012",
    title: "Entered Interstellar Space",
    desc: "Became the first human-made object to cross the heliopause and enter interstellar space, at about 18.2 billion km from the Sun.",
  },
  {
    year: "2025",
    title: "Still Transmitting After 47+ Years",
    desc: "Despite its nuclear power source slowly fading, Voyager 1 continues to send data back to Earth, taking over 22 hours for signals to arrive.",
  },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function getCurrentDistance(baseKm: number, speedKms: number, baseDate: Date): number {
  const secondsElapsed = (Date.now() - baseDate.getTime()) / 1000;
  return baseKm + secondsElapsed * speedKms;
}

function formatBigNumber(n: number, decimals = 0): string {
  if (n >= 1e9) return (n / 1e9).toFixed(decimals) + " billion";
  if (n >= 1e6) return (n / 1e6).toFixed(decimals) + " million";
  return n.toLocaleString("en-US", { maximumFractionDigits: decimals });
}

function formatWithCommas(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 3 });
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function VoyagerTrackerPage() {
  const [v1Km, setV1Km] = useState(0);
  const [v2Km, setV2Km] = useState(0);
  const [kmSinceLoad, setKmSinceLoad] = useState(0);
  const [secondsSinceLoad, setSecondsSinceLoad] = useState(0);
  const [showTimeline, setShowTimeline] = useState(true);
  const [showGoldenRecord, setShowGoldenRecord] = useState(false);
  const loadTimeRef = useRef<number>(Date.now());

  const tick = useCallback(() => {
    const now = Date.now();
    setV1Km(getCurrentDistance(V1_BASE_KM, V1_SPEED_KMS, V1_BASE_DATE));
    setV2Km(getCurrentDistance(V2_BASE_KM, V2_SPEED_KMS, V2_BASE_DATE));
    const elapsed = (now - loadTimeRef.current) / 1000;
    setSecondsSinceLoad(elapsed);
    setKmSinceLoad(elapsed * V1_SPEED_KMS);
  }, []);

  useEffect(() => {
    tick();
    const id = setInterval(tick, 100);
    return () => clearInterval(id);
  }, [tick]);

  // Derived values
  const v1Miles = v1Km / KM_PER_MILE;
  const v1AU = v1Km / KM_PER_AU;
  const v1LightHours = v1Km / (LIGHT_SPEED_KMS * 3600);

  const v2Miles = v2Km / KM_PER_MILE;
  const v2AU = v2Km / KM_PER_AU;

  return (
    <section className="pt-10 sm:pt-12 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ---- Header ---- */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
          <Satellite className="w-4 h-4" />
          Live Tracker
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-slate-100 mb-4">
          Where Is Voyager 1?
        </h1>
        <p className="text-muted max-w-2xl mx-auto text-lg">
          Launched in 1977, Voyager 1 is the farthest human-made object from Earth. Watch its distance tick up in real-time as it hurtles through interstellar space.
        </p>
      </div>

      {/* ---- Live Distance Counter ---- */}
      <div className="bg-card-bg border border-primary/30 rounded-2xl p-6 sm:p-8 mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Radio className="w-5 h-5 text-green-400 animate-pulse" />
          <span className="text-sm font-semibold text-green-400 uppercase tracking-wider">Live Distance</span>
        </div>

        {/* Big number */}
        <div className="mb-6">
          <p className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-slate-100 tabular-nums tracking-tight">
            {formatWithCommas(Math.floor(v1Km))}
            <span className="text-xl sm:text-2xl text-muted ml-2">km</span>
          </p>
          <p className="text-sm text-muted mt-2">from Earth</p>
        </div>

        {/* Other units */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div className="bg-dark-bg rounded-xl p-3">
            <p className="text-xs text-muted mb-1">Miles</p>
            <p className="font-semibold text-slate-200 tabular-nums text-sm">
              {formatBigNumber(v1Miles, 3)}
            </p>
          </div>
          <div className="bg-dark-bg rounded-xl p-3">
            <p className="text-xs text-muted mb-1">Astronomical Units</p>
            <p className="font-semibold text-slate-200 tabular-nums text-sm">
              {v1AU.toFixed(4)} AU
            </p>
          </div>
          <div className="bg-dark-bg rounded-xl p-3">
            <p className="text-xs text-muted mb-1">Light-Hours</p>
            <p className="font-semibold text-slate-200 tabular-nums text-sm">
              {v1LightHours.toFixed(4)} hrs
            </p>
          </div>
          <div className="bg-dark-bg rounded-xl p-3">
            <p className="text-xs text-muted mb-1">Signal Delay (one-way)</p>
            <p className="font-semibold text-slate-200 tabular-nums text-sm">
              {(v1LightHours * 60).toFixed(1)} min
            </p>
          </div>
        </div>
      </div>

      {/* ---- Speed ---- */}
      <div className="grid gap-6 sm:grid-cols-3 mb-8">
        <div className="bg-card-bg border border-card-border rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Gauge className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted mb-0.5">Speed (km/s)</p>
            <p className="font-heading text-xl font-bold text-slate-100">{V1_SPEED_KMS} km/s</p>
          </div>
        </div>
        <div className="bg-card-bg border border-card-border rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-secondary/10">
            <Zap className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <p className="text-xs text-muted mb-0.5">Speed (km/h)</p>
            <p className="font-heading text-xl font-bold text-slate-100">
              {formatWithCommas(V1_SPEED_KMS * 3600)}
            </p>
          </div>
        </div>
        <div className="bg-card-bg border border-card-border rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-orange-500/10">
            <Rocket className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <p className="text-xs text-muted mb-0.5">Speed (mph)</p>
            <p className="font-heading text-xl font-bold text-slate-100">
              {formatWithCommas((V1_SPEED_KMS * 3600) / KM_PER_MILE)}
            </p>
          </div>
        </div>
      </div>

      {/* ---- Since You Opened This Page ---- */}
      <div className="bg-card-bg border border-secondary/30 rounded-2xl p-6 mb-14 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-secondary" />
          <span className="text-sm font-semibold text-secondary">Since You Opened This Page</span>
        </div>
        <p className="font-heading text-3xl sm:text-4xl font-bold text-slate-100 tabular-nums">
          {formatWithCommas(Math.floor(kmSinceLoad))}
          <span className="text-lg text-muted ml-2">km traveled</span>
        </p>
        <p className="text-sm text-muted mt-2">
          ({secondsSinceLoad.toFixed(0)} seconds x {V1_SPEED_KMS} km/s)
        </p>
      </div>

      {/* ---- Voyager 2 Comparison ---- */}
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-6 h-6 text-secondary" />
          <h2 className="font-heading text-2xl font-bold text-slate-100">Voyager 1 vs Voyager 2</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Voyager 1 */}
          <div className="bg-card-bg border border-primary/30 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Satellite className="w-5 h-5 text-primary" />
              <h3 className="font-heading text-lg font-bold text-slate-100">Voyager 1</h3>
              <span className="text-[10px] uppercase tracking-wider bg-primary/20 text-primary px-2 py-0.5 rounded-full ml-auto">Farther</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Distance</span>
                <span className="text-slate-200 tabular-nums font-semibold">{formatBigNumber(v1Km, 3)} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Distance (miles)</span>
                <span className="text-slate-200 tabular-nums">{formatBigNumber(v1Miles, 3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Distance (AU)</span>
                <span className="text-slate-200 tabular-nums">{v1AU.toFixed(2)} AU</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Speed</span>
                <span className="text-slate-200">{V1_SPEED_KMS} km/s ({formatWithCommas(V1_SPEED_KMS * 3600)} km/h)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Launched</span>
                <span className="text-slate-200">Sep 5, 1977</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Status</span>
                <span className="text-green-400">Interstellar space (since 2012)</span>
              </div>
            </div>
          </div>

          {/* Voyager 2 */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Satellite className="w-5 h-5 text-secondary" />
              <h3 className="font-heading text-lg font-bold text-slate-100">Voyager 2</h3>
              <span className="text-[10px] uppercase tracking-wider bg-secondary/20 text-secondary px-2 py-0.5 rounded-full ml-auto">Only Uranus/Neptune visitor</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Distance</span>
                <span className="text-slate-200 tabular-nums font-semibold">{formatBigNumber(v2Km, 3)} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Distance (miles)</span>
                <span className="text-slate-200 tabular-nums">{formatBigNumber(v2Miles, 3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Distance (AU)</span>
                <span className="text-slate-200 tabular-nums">{v2AU.toFixed(2)} AU</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Speed</span>
                <span className="text-slate-200">{V2_SPEED_KMS} km/s ({formatWithCommas(V2_SPEED_KMS * 3600)} km/h)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Launched</span>
                <span className="text-slate-200">Aug 20, 1977</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Status</span>
                <span className="text-green-400">Interstellar space (since 2018)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gap indicator */}
        <div className="mt-4 bg-dark-bg border border-card-border rounded-xl p-4 text-center">
          <p className="text-sm text-muted">
            Gap between them:{" "}
            <span className="text-slate-200 font-semibold tabular-nums">
              {formatBigNumber(v1Km - v2Km, 3)} km
            </span>
            <span className="text-muted ml-1">
              ({((v1Km - v2Km) / KM_PER_AU).toFixed(2)} AU)
            </span>
          </p>
        </div>
      </div>

      <AdBanner />

      {/* ---- Timeline ---- */}
      <div className="mb-14">
        <button
          onClick={() => setShowTimeline(!showTimeline)}
          className="w-full flex items-center justify-between bg-card-bg border border-card-border rounded-2xl p-6 hover:border-primary/40 transition-all"
        >
          <div className="flex items-center gap-3">
            <Milestone className="w-6 h-6 text-primary" />
            <div className="text-left">
              <h2 className="font-heading text-2xl font-bold text-slate-100">Voyager 1 Timeline</h2>
              <p className="text-sm text-muted mt-1">Key milestones from launch to interstellar space</p>
            </div>
          </div>
          {showTimeline ? <ChevronUp className="w-5 h-5 text-muted" /> : <ChevronDown className="w-5 h-5 text-muted" />}
        </button>

        {showTimeline && (
          <div className="mt-6 relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-card-border sm:left-[23px]" />

            <div className="space-y-6">
              {timeline.map((item, i) => (
                <div key={item.year} className="relative flex gap-4 sm:gap-6">
                  {/* Dot */}
                  <div
                    className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border-2 ${
                      i === timeline.length - 1
                        ? "bg-green-500/20 border-green-500 text-green-400"
                        : "bg-primary/20 border-primary text-primary"
                    }`}
                  >
                    {item.year.slice(2)}
                  </div>

                  {/* Content */}
                  <div className="bg-card-bg border border-card-border rounded-xl p-4 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-primary">{item.year}</span>
                      <ArrowRight className="w-3 h-3 text-muted" />
                      <h3 className="font-heading font-bold text-slate-100 text-sm">{item.title}</h3>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ---- Golden Record ---- */}
      <div>
        <button
          onClick={() => setShowGoldenRecord(!showGoldenRecord)}
          className="w-full flex items-center justify-between bg-card-bg border border-card-border rounded-2xl p-6 hover:border-yellow-500/40 transition-all"
        >
          <div className="flex items-center gap-3">
            <Disc3 className="w-6 h-6 text-yellow-400" />
            <div className="text-left">
              <h2 className="font-heading text-2xl font-bold text-slate-100">The Golden Record</h2>
              <p className="text-sm text-muted mt-1">A message in a bottle cast into the cosmic ocean</p>
            </div>
          </div>
          {showGoldenRecord ? <ChevronUp className="w-5 h-5 text-muted" /> : <ChevronDown className="w-5 h-5 text-muted" />}
        </button>

        {showGoldenRecord && (
          <div className="mt-6 bg-card-bg border border-card-border rounded-2xl p-6">
            <p className="text-slate-400 leading-relaxed mb-6">
              Each Voyager spacecraft carries a gold-plated copper phonograph record containing sounds and images selected to portray the diversity of life and culture on Earth. The record was curated by a committee chaired by <span className="text-slate-200 font-semibold">Carl Sagan</span> of Cornell University. It is intended as a message to any extraterrestrial civilization that might encounter the spacecraft millions of years from now.
            </p>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-dark-bg rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Languages className="w-5 h-5 text-primary" />
                  <h3 className="font-heading font-bold text-slate-100">Greetings</h3>
                </div>
                <p className="text-sm text-slate-400">
                  Spoken greetings in <span className="text-slate-200">55 languages</span>, from Akkadian (ancient Sumerian) to Wu Chinese, plus a greeting from the UN Secretary-General and a message from President Jimmy Carter.
                </p>
              </div>

              <div className="bg-dark-bg rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Music className="w-5 h-5 text-secondary" />
                  <h3 className="font-heading font-bold text-slate-100">Music</h3>
                </div>
                <p className="text-sm text-slate-400">
                  <span className="text-slate-200">27 musical selections</span> spanning cultures and eras: Bach, Beethoven, Mozart, Stravinsky, Chuck Berry&apos;s &quot;Johnny B. Goode,&quot; Javanese gamelan, Indian raga, Peruvian panpipes, and more.
                </p>
              </div>

              <div className="bg-dark-bg rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Image className="w-5 h-5 text-green-400" />
                  <h3 className="font-heading font-bold text-slate-100">Images</h3>
                </div>
                <p className="text-sm text-slate-400">
                  <span className="text-slate-200">115 encoded images</span> showing mathematical definitions, the Solar System, human anatomy, DNA structure, families, architecture, food, landscapes, animals, and more.
                </p>
              </div>

              <div className="bg-dark-bg rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Radio className="w-5 h-5 text-orange-400" />
                  <h3 className="font-heading font-bold text-slate-100">Sounds of Earth</h3>
                </div>
                <p className="text-sm text-slate-400">
                  Natural sounds: surf, wind, thunder, birds, whales, a baby&apos;s cry. Human-made sounds: footsteps, heartbeats, laughter, a tractor, a train, a Saturn V launch.
                </p>
              </div>
            </div>

            <div className="mt-6 bg-dark-bg border border-yellow-500/20 rounded-xl p-4">
              <p className="text-sm text-slate-400 italic leading-relaxed">
                &quot;The spacecraft will be encountered and the record played only if there are advanced space-faring civilizations in interstellar space, but the launching of this bottle into the cosmic ocean says something very hopeful about life on this planet.&quot;
                <span className="text-yellow-400 not-italic font-semibold block mt-2">- Carl Sagan</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
