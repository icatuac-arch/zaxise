"use client";

import { useState, useMemo } from "react";
import {
  Star,
  Eye,
  MapPin,
  Telescope,
  Binoculars,
  Lightbulb,
  Moon,
  Sparkles,
  Globe,
  ChevronDown,
  ChevronUp,
  Info,
  Sun,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  TYPES & DATA                                                       */
/* ------------------------------------------------------------------ */

interface BortleLevel {
  class: number;
  name: string;
  color: string;
  colorHex: string;
  canSee: string;
  details: string;
  starCount: number;
}

const bortleScale: BortleLevel[] = [
  { class: 1, name: "Excellent Dark Sky", color: "bg-gray-900", colorHex: "#0c0c0c", canSee: "Zodiacal light, gegenschein, zodiacal band all visible. M33 (Triangulum Galaxy) visible to naked eye. Scorpius and Sagittarius regions cast shadows. Milky Way is stunning.", details: "The darkest skies on Earth. Found only in the most remote locations far from any human settlement.", starCount: 9 },
  { class: 2, name: "Typical Dark Site", color: "bg-gray-800", colorHex: "#1a1a2e", canSee: "Airglow may be visible near horizon. M33 easily spotted. Milky Way highly structured with dark lanes. Zodiacal light bright enough to cast faint shadows.", details: "Excellent dark sites, typically found in rural areas more than 100 miles from large cities.", starCount: 8 },
  { class: 3, name: "Rural Sky", color: "bg-slate-800", colorHex: "#1e293b", canSee: "Some light pollution on horizon. M33 visible with averted vision. Milky Way still appears complex. Globular clusters and faint nebulae visible in telescope.", details: "Light pollution glow visible low on the horizon. Still excellent for most observing.", starCount: 7 },
  { class: 4, name: "Rural/Suburban Transition", color: "bg-slate-700", colorHex: "#334155", canSee: "Light pollution domes visible over cities. Milky Way visible but losing detail. M31 (Andromeda) obvious to naked eye. Zodiacal light still visible on clear nights.", details: "Typical of areas between rural and suburban zones. Good for general observing.", starCount: 6 },
  { class: 5, name: "Suburban Sky", color: "bg-slate-600", colorHex: "#475569", canSee: "Milky Way is faint or washed out near horizon. M31 still faintly visible. Only bright Messier objects in telescope. Clouds are noticeably brighter than sky.", details: "The Milky Way is only visible overhead on the best nights. Many deep-sky objects lost.", starCount: 5 },
  { class: 6, name: "Bright Suburban", color: "bg-slate-500", colorHex: "#64748b", canSee: "Milky Way only visible at zenith on best nights. M31 difficult. Naked-eye limiting magnitude about 5.5. Bright planets and major constellations clear.", details: "Sky glow makes the sky appear grayish-white. Increasing difficulty for faint objects.", starCount: 4 },
  { class: 7, name: "Suburban/Urban Transition", color: "bg-amber-900", colorHex: "#78350f", canSee: "Milky Way invisible. Only major constellations recognizable. Limiting magnitude ~5.0. Moon-like glow covers entire sky.", details: "Entire sky has a vaguely grayish or yellowish cast. Most casual observers never notice stars.", starCount: 3 },
  { class: 8, name: "City Sky", color: "bg-orange-800", colorHex: "#9a3412", canSee: "Only bright constellations (Orion, Big Dipper) recognizable. Planets and a few bright stars visible. Limiting magnitude ~4.5.", details: "Sky glows white or orange. The sky is bright enough to read by in some areas.", starCount: 2 },
  { class: 9, name: "Inner-City Sky", color: "bg-orange-600", colorHex: "#ea580c", canSee: "Only Moon, planets, and a few brightest stars (Sirius, Vega) visible. Limiting magnitude ~4.0 or worse. Many people have never seen the Milky Way.", details: "The entire sky is brightly lit. Even with a telescope, only Moon, planets, and brightest star clusters.", starCount: 1 },
];

interface DarkSkyPark {
  name: string;
  location: string;
  bortle: number;
  bestSeason: string;
  whatToSee: string;
  notable: string;
}

const darkSkyParks: DarkSkyPark[] = [
  { name: "Big Bend National Park", location: "Texas, USA", bortle: 2, bestSeason: "Oct-Apr", whatToSee: "Milky Way core, zodiacal light, thousands of stars", notable: "Largest protected area of dark sky in North America" },
  { name: "Cherry Springs State Park", location: "Pennsylvania, USA", bortle: 2, bestSeason: "May-Oct", whatToSee: "Milky Way, deep-sky objects, Andromeda Galaxy", notable: "East Coast's premier dark sky destination with dedicated astronomy field" },
  { name: "Natural Bridges Nat'l Monument", location: "Utah, USA", bortle: 2, bestSeason: "Apr-Oct", whatToSee: "Milky Way arching over natural stone bridges", notable: "First International Dark Sky Park ever designated (2007)" },
  { name: "Galloway Forest Park", location: "Scotland, UK", bortle: 3, bestSeason: "Sep-Mar", whatToSee: "Milky Way, Andromeda, Northern Lights (occasionally)", notable: "UK's first Dark Sky Park — 300 square miles of darkness" },
  { name: "Aoraki Mackenzie", location: "New Zealand", bortle: 1, bestSeason: "Apr-Sep", whatToSee: "Southern Milky Way, Magellanic Clouds, Southern Cross", notable: "World's largest International Dark Sky Reserve — Gold tier" },
  { name: "NamibRand Nature Reserve", location: "Namibia", bortle: 1, bestSeason: "May-Oct", whatToSee: "Southern Milky Way, zodiacal band, airglow", notable: "Africa's first Dark Sky Reserve — among the darkest skies measured on Earth" },
  { name: "Zselic Starry Sky Park", location: "Hungary", bortle: 3, bestSeason: "Jun-Oct", whatToSee: "Milky Way, summer triangle, deep-sky objects", notable: "Central Europe's accessible dark oasis with observatory" },
  { name: "Pic du Midi", location: "France", bortle: 1, bestSeason: "Jun-Oct", whatToSee: "Milky Way, planets, deep-sky objects at 2877m altitude", notable: "Mountain-top observatory at 2877m with professional telescopes open to public" },
  { name: "Jasper National Park", location: "Canada", bortle: 2, bestSeason: "Oct-Mar", whatToSee: "Milky Way, Northern Lights, Andromeda Galaxy", notable: "Largest accessible Dark Sky Preserve in the world — 11,000 sq km" },
  { name: "Tekapo", location: "New Zealand", bortle: 2, bestSeason: "Apr-Sep", whatToSee: "Southern skies, Magellanic Clouds, Southern Cross over lake", notable: "Lake reflections create mirror-image starscapes; Mt. John Observatory" },
  { name: "Brecon Beacons", location: "Wales, UK", bortle: 3, bestSeason: "Sep-Mar", whatToSee: "Milky Way, Andromeda, meteor showers", notable: "Wales' first and only International Dark Sky Reserve" },
  { name: "Mauna Kea", location: "Hawaii, USA", bortle: 1, bestSeason: "Year-round", whatToSee: "Both hemispheres visible, Milky Way, planets, deep-sky objects", notable: "4,207m summit hosts world's premier astronomical observatory complex" },
];

const stargazingTips: { title: string; tip: string }[] = [
  { title: "Let your eyes adapt", tip: "Stay in the dark for at least 20-30 minutes without looking at any bright lights. Your pupils need time to fully dilate and your rod cells need time to reach maximum sensitivity." },
  { title: "Use red light only", tip: "Red light preserves your night vision. Use a red-filtered flashlight or cover your phone with red cellophane. Avoid white light completely — even a brief flash resets your adaptation." },
  { title: "Check the Moon phase", tip: "A bright Moon washes out faint stars and the Milky Way. Plan your observing sessions around the New Moon for darkest skies. Even a quarter Moon significantly brightens the sky." },
  { title: "Get away from city lights", tip: "Even 30 minutes of driving away from urban areas dramatically improves sky darkness. Use light pollution maps to find the darkest spots near you." },
  { title: "Check the weather", tip: "Clear skies are essential. Also check for atmospheric transparency (humidity, haze) and seeing conditions (atmospheric turbulence). High-altitude locations are often above cloud layers." },
  { title: "Learn with a star chart", tip: "Use a planisphere or a stargazing app (with night mode) to identify constellations. Start with easy patterns like the Big Dipper, Orion, and Cassiopeia." },
  { title: "Use averted vision", tip: "Faint objects are easier to see when you look slightly to the side. The center of your eye has fewer light-sensitive rod cells than the periphery." },
  { title: "Dress warmly", tip: "You will be standing still outdoors, often for hours. Dress in layers, bring hand warmers, and consider insulated boots. Being cold ruins the experience faster than anything else." },
  { title: "Bring binoculars first", tip: "Before investing in a telescope, try binoculars (7x50 or 10x50). They reveal Moon craters, Jupiter's moons, star clusters, and the Andromeda Galaxy. Much easier to use than a telescope." },
  { title: "Be patient", tip: "Your best views come after long observation. Details in the Milky Way, faint nebulae, and subtle colors emerge over time. Stargazing rewards patience." },
];

interface EquipmentTier {
  level: string;
  icon: typeof Eye;
  cost: string;
  canSee: string[];
  bestFor: string;
  color: string;
}

const equipmentTiers: EquipmentTier[] = [
  { level: "Naked Eye", icon: Eye, cost: "Free", canSee: ["Constellations & asterisms", "Bright planets (Venus, Jupiter, Mars, Saturn)", "Meteor showers", "Milky Way (from dark sites)", "Satellites & ISS passes", "Lunar eclipses"], bestFor: "Everyone — the perfect starting point", color: "text-green-400" },
  { level: "Binoculars", icon: Binoculars, cost: "$50-200", canSee: ["Moon craters & seas", "Jupiter's 4 Galilean moons", "Andromeda Galaxy (M31)", "Pleiades star cluster", "Double stars (Albireo, Mizar)", "Orion Nebula detail"], bestFor: "Beginners who want to see more without complexity", color: "text-blue-400" },
  { level: "Beginner Telescope", icon: Telescope, cost: "$200-500", canSee: ["Saturn's rings", "Jupiter's cloud bands & Great Red Spot", "Bright nebulae (Orion, Lagoon)", "Star clusters (M13, M44)", "Galaxy shapes (Andromeda, Whirlpool)", "Lunar detail — individual craters & rilles"], bestFor: "Dedicated beginners ready to invest time learning", color: "text-purple-400" },
  { level: "Advanced Telescope", icon: Star, cost: "$1,000+", canSee: ["Faint galaxies & galaxy groups", "Planetary nebulae (Ring, Dumbbell)", "Dark nebulae & emission nebulae", "Planet detail (Mars features, Saturn's Cassini Division)", "Astrophotography of deep-sky objects", "Comets, asteroids, and transient events"], bestFor: "Serious hobbyists and astrophotographers", color: "text-orange-400" },
];

/* ------------------------------------------------------------------ */
/*  SEASONAL SKY DATA                                                  */
/* ------------------------------------------------------------------ */

type Season = "winter" | "spring" | "summer" | "fall";

const seasonalHighlights: Record<Season, { objects: string[]; events: string[]; bestConstellation: string }> = {
  winter: {
    objects: ["Orion Nebula (M42) — visible to naked eye in Orion's sword", "Pleiades (M45) — the Seven Sisters in Taurus", "Betelgeuse & Rigel — contrasting red and blue supergiants", "Sirius — the brightest star in the sky, in Canis Major"],
    events: ["Geminid meteors peak mid-December (~150/hour)", "Quadrantid meteors in early January", "Winter Milky Way stretches from Cassiopeia through Orion"],
    bestConstellation: "Orion — the most recognizable winter constellation with nebula, supergiants, and the iconic belt",
  },
  spring: {
    objects: ["Leo the Lion dominates the southern sky", "Virgo Cluster — hundreds of galaxies in a telescope", "Arcturus — follow the arc of the Big Dipper's handle", "M81/M82 galaxy pair in Ursa Major"],
    events: ["Galaxy season — spring evenings look out of the Milky Way plane", "Lyrid meteor shower in April (~20/hour)", "Mercury's best evening appearances often occur in spring"],
    bestConstellation: "Leo — easy to spot with its backward question mark (the Sickle) and bright star Regulus",
  },
  summer: {
    objects: ["Summer Triangle (Vega, Deneb, Altair) overhead", "Milky Way core rises in Sagittarius & Scorpius", "Ring Nebula (M57) in Lyra", "Wild Duck Cluster (M11) in Scutum"],
    events: ["Perseid meteors peak mid-August (~100/hour)", "Noctilucent clouds visible at high latitudes", "Best time to see the Milky Way core from northern latitudes"],
    bestConstellation: "Scorpius — with red supergiant Antares and rich Milky Way star fields nearby",
  },
  fall: {
    objects: ["Andromeda Galaxy (M31) — visible to naked eye, highest in sky", "Great Square of Pegasus as sky signpost", "Double Cluster in Perseus", "Fomalhaut — the lonely autumn star in Piscis Austrinus"],
    events: ["Orionid meteors in October (~25/hour)", "Taurid fireballs in November", "Andromeda Galaxy reaches peak visibility overhead"],
    bestConstellation: "Andromeda & Pegasus — the Great Square leads you to our nearest major galaxy",
  },
};

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function getCurrentSeason(): Season {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "fall";
  return "winter";
}

function getMoonPhase(): { name: string; illumination: string; icon: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  // Simple moon phase calculation (Conways method approximation)
  let r = year % 100;
  r = r % 19;
  if (r > 9) r -= 19;
  r = ((r * 11) % 30) + month + day;
  if (month < 3) r += 2;
  r = Math.floor(r - (year < 2000 ? 4 : 8.3));
  r = ((r % 30) + 30) % 30;

  if (r === 0) return { name: "New Moon", illumination: "0%", icon: "new" };
  if (r < 7) return { name: "Waxing Crescent", illumination: "~25%", icon: "waxing-crescent" };
  if (r === 7) return { name: "First Quarter", illumination: "50%", icon: "first-quarter" };
  if (r < 15) return { name: "Waxing Gibbous", illumination: "~75%", icon: "waxing-gibbous" };
  if (r === 15) return { name: "Full Moon", illumination: "100%", icon: "full" };
  if (r < 22) return { name: "Waning Gibbous", illumination: "~75%", icon: "waning-gibbous" };
  if (r === 22) return { name: "Last Quarter", illumination: "50%", icon: "last-quarter" };
  return { name: "Waning Crescent", illumination: "~25%", icon: "waning-crescent" };
}

/* ------------------------------------------------------------------ */
/*  STAR FIELD SVG                                                     */
/* ------------------------------------------------------------------ */

function StarVisibilitySVG({ count }: { count: number }) {
  // Deterministic "random" positions based on index
  const stars = Array.from({ length: count * 4 }).map((_, i) => ({
    cx: ((i * 37 + 13) % 100),
    cy: ((i * 53 + 7) % 60) + 5,
    r: i % 3 === 0 ? 1.5 : i % 2 === 0 ? 1 : 0.7,
    opacity: 0.4 + (i % 5) * 0.15,
  }));

  return (
    <svg viewBox="0 0 100 70" className="w-full h-12 rounded" style={{ backgroundColor: "#0a0a1a" }}>
      {stars.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={s.opacity} />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  MOON PHASE SVG                                                     */
/* ------------------------------------------------------------------ */

function MoonPhaseSVG({ phase }: { phase: string }) {
  // Simple moon phase visualization
  let shadowX = 0;
  let shadowDir: "left" | "right" | "full" | "none" = "none";

  switch (phase) {
    case "new": shadowDir = "full"; break;
    case "waxing-crescent": shadowDir = "left"; shadowX = 20; break;
    case "first-quarter": shadowDir = "left"; shadowX = 0; break;
    case "waxing-gibbous": shadowDir = "right"; shadowX = 20; break;
    case "full": shadowDir = "none"; break;
    case "waning-gibbous": shadowDir = "left"; shadowX = -20; break;
    case "last-quarter": shadowDir = "right"; shadowX = 0; break;
    case "waning-crescent": shadowDir = "right"; shadowX = -20; break;
  }

  return (
    <svg viewBox="0 0 60 60" className="w-14 h-14">
      <circle cx="30" cy="30" r="25" fill="#E2E8F0" />
      {shadowDir === "full" && <circle cx="30" cy="30" r="25" fill="#1E293B" />}
      {shadowDir === "left" && (
        <path d={`M30,5 A25,25 0 0,1 30,55 A${25 - shadowX},25 0 0,0 30,5`} fill="#1E293B" />
      )}
      {shadowDir === "right" && (
        <path d={`M30,5 A25,25 0 0,0 30,55 A${25 + shadowX},25 0 0,1 30,5`} fill="#1E293B" />
      )}
      {/* surface detail */}
      <circle cx="22" cy="22" r="4" fill="#CBD5E1" opacity="0.3" />
      <circle cx="35" cy="30" r="3" fill="#CBD5E1" opacity="0.2" />
      <circle cx="25" cy="38" r="2.5" fill="#CBD5E1" opacity="0.25" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                          */
/* ------------------------------------------------------------------ */

export default function DarkSkyPage() {
  const [expandedBortle, setExpandedBortle] = useState<number | null>(null);
  const season = useMemo(() => getCurrentSeason(), []);
  const moonPhase = useMemo(() => getMoonPhase(), []);
  const highlights = seasonalHighlights[season];

  const seasonLabel = { winter: "Winter", spring: "Spring", summer: "Summer", fall: "Fall" }[season];

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden pt-10 sm:pt-12 pb-8">
        {/* starfield background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg viewBox="0 0 1200 400" className="w-full h-full opacity-40" preserveAspectRatio="xMidYMid slice">
            {Array.from({ length: 200 }).map((_, i) => (
              <circle
                key={i}
                cx={(i * 47 + 13) % 1200}
                cy={(i * 31 + 7) % 400}
                r={i % 7 === 0 ? 1.5 : i % 3 === 0 ? 1 : 0.5}
                fill="white"
                opacity={0.3 + (i % 5) * 0.15}
              >
                {i % 10 === 0 && (
                  <animate
                    attributeName="opacity"
                    values={`${0.3 + (i % 5) * 0.15};${0.8};${0.3 + (i % 5) * 0.15}`}
                    dur={`${3 + (i % 4)}s`}
                    repeatCount="indefinite"
                  />
                )}
              </circle>
            ))}
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Dark Sky Guide
          </h1>
          <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto mt-4">
            Understand light pollution, find the darkest skies, and make the most of your stargazing. From your backyard to the world&apos;s best dark sky parks.
          </p>
        </div>
      </section>

      {/* ==================== BORTLE SCALE ==================== */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-3 mb-4">
          <Eye className="w-6 h-6 text-secondary" />
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-100">The Bortle Scale</h2>
        </div>
        <p className="text-muted mb-8 max-w-3xl">
          Astronomer John Bortle created this 9-level numeric scale to rate the darkness of an observing site. Class 1 is the darkest sky possible; Class 9 is an inner-city sky.
        </p>
        <div className="space-y-3">
          {bortleScale.map((level) => {
            const isExpanded = expandedBortle === level.class;
            return (
              <div key={level.class} className="bg-card-bg border border-card-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedBortle(isExpanded ? null : level.class)}
                  className="w-full p-4 flex items-center gap-4 text-left hover:bg-slate-800/30 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-heading font-bold text-white shrink-0"
                    style={{ backgroundColor: level.colorHex }}
                  >
                    {level.class}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-semibold text-slate-100">Class {level.class}</span>
                      <span className="text-muted text-sm">— {level.name}</span>
                    </div>
                    <StarVisibilitySVG count={level.starCount} />
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-card-border">
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h4 className="text-sm font-semibold text-secondary mb-2">What You Can See</h4>
                        <p className="text-sm text-slate-300 leading-relaxed">{level.canSee}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-muted mb-2">About This Class</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">{level.details}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <AdBanner />

      {/* ==================== DARK SKY PLACES ==================== */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-6 h-6 text-secondary" />
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-100">International Dark Sky Places</h2>
        </div>
        <p className="text-muted mb-8">
          Certified by the International Dark-Sky Association, these locations are protected for their exceptional night skies.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {darkSkyParks.map((park) => (
            <div key={park.name} className="bg-card-bg border border-card-border rounded-2xl p-5 hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-heading font-semibold text-slate-100 leading-tight">{park.name}</h3>
                <span
                  className="shrink-0 ml-2 text-xs font-mono px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: park.bortle <= 1 ? "#064e3b" : park.bortle <= 2 ? "#065f46" : "#1e3a5f",
                    color: park.bortle <= 1 ? "#6ee7b7" : park.bortle <= 2 ? "#34d399" : "#93c5fd",
                  }}
                >
                  Bortle {park.bortle}
                </span>
              </div>
              <div className="space-y-1.5 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-muted shrink-0" />
                  <span className="text-slate-300">{park.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="w-3.5 h-3.5 text-muted shrink-0" />
                  <span className="text-slate-300">Best: {park.bestSeason}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-2">{park.whatToSee}</p>
              <p className="text-xs text-muted pt-2 border-t border-card-border italic">{park.notable}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== STARGAZING TIPS ==================== */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-3 mb-8">
          <Lightbulb className="w-6 h-6 text-yellow-400" />
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-100">10 Stargazing Tips for Beginners</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {stargazingTips.map((item, i) => (
            <div key={i} className="bg-card-bg border border-card-border rounded-xl p-5 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-heading font-bold text-sm shrink-0">
                {i + 1}
              </div>
              <div>
                <h3 className="font-heading font-semibold text-slate-100 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== EQUIPMENT GUIDE ==================== */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-3 mb-8">
          <Telescope className="w-6 h-6 text-secondary" />
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-100">Equipment Guide</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {equipmentTiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div key={tier.level} className="bg-card-bg border border-card-border rounded-2xl p-6 flex flex-col">
                <Icon className={`w-8 h-8 ${tier.color} mb-3`} />
                <h3 className="font-heading text-lg font-semibold text-slate-100">{tier.level}</h3>
                <div className={`text-sm font-mono ${tier.color} mb-3`}>{tier.cost}</div>
                <ul className="space-y-1.5 mb-4 flex-1">
                  {tier.canSee.map((item, j) => (
                    <li key={j} className="text-sm text-slate-400 flex items-start gap-2">
                      <Sparkles className="w-3 h-3 text-muted mt-1 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted pt-3 border-t border-card-border">{tier.bestFor}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================== TONIGHT'S SKY ==================== */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex items-center gap-3 mb-8">
          <Moon className="w-6 h-6 text-blue-400" />
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-100">Tonight&apos;s Sky</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Moon Phase */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-6">
            <h3 className="font-heading text-lg font-semibold text-slate-100 mb-4">Current Moon Phase</h3>
            <div className="flex items-center gap-4">
              <MoonPhaseSVG phase={moonPhase.icon} />
              <div>
                <div className="font-heading font-semibold text-slate-100">{moonPhase.name}</div>
                <div className="text-sm text-muted">Illumination: {moonPhase.illumination}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {moonPhase.name === "New Moon"
                    ? "Excellent for stargazing — darkest skies!"
                    : moonPhase.name === "Full Moon"
                    ? "Poor for faint objects — Moon is very bright"
                    : moonPhase.illumination === "~75%"
                    ? "Fair conditions — plan around moonrise/set"
                    : "Good conditions — some faint objects visible"}
                </div>
              </div>
            </div>
          </div>

          {/* Season Highlights */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-6">
            <h3 className="font-heading text-lg font-semibold text-slate-100 mb-2">{seasonLabel} Highlights</h3>
            <p className="text-xs text-muted mb-3">Best constellation: {highlights.bestConstellation.split(" — ")[0]}</p>
            <ul className="space-y-2">
              {highlights.objects.map((obj, i) => (
                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                  <Star className="w-3 h-3 text-yellow-400 mt-1 shrink-0" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>

          {/* Events */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-6">
            <h3 className="font-heading text-lg font-semibold text-slate-100 mb-2">{seasonLabel} Events</h3>
            <ul className="space-y-2">
              {highlights.events.map((event, i) => (
                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                  <Sparkles className="w-3 h-3 text-secondary mt-1 shrink-0" />
                  {event}
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-3 border-t border-card-border">
              <Info className="w-4 h-4 text-muted inline mr-1" />
              <span className="text-xs text-muted">
                {highlights.bestConstellation}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
