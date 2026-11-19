"use client";

import { useState } from "react";
import {
  Globe,
  Thermometer,
  Ruler,
  Clock,
  Orbit,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CircleDot,
  Maximize2,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

interface Planet {
  name: string;
  color: string;
  knownFor: string;
  distanceAU: number;
  distanceKm: string;
  diameter: string;
  diameterKm: number;
  orbitalPeriod: string;
  dayLength: string;
  temperatureRange: string;
  moons: number;
  atmosphere: string;
  funFact: string;
  isDwarf?: boolean;
  relativeSize: number; // relative to Jupiter = 1
}

const planets: Planet[] = [
  {
    name: "Mercury",
    color: "#8C8C8C",
    knownFor: "Smallest planet",
    distanceAU: 0.39,
    distanceKm: "57.9M",
    diameter: "4,879 km",
    diameterKm: 4879,
    orbitalPeriod: "88 days",
    dayLength: "59 Earth days",
    temperatureRange: "-180 to 430 C",
    moons: 0,
    atmosphere: "Virtually none (thin exosphere of O2, Na, H2)",
    funFact:
      "Mercury's day-night cycle takes 176 Earth days, longer than its year of 88 days.",
    relativeSize: 0.034,
  },
  {
    name: "Venus",
    color: "#E8CDA0",
    knownFor: "Hottest planet",
    distanceAU: 0.72,
    distanceKm: "108.2M",
    diameter: "12,104 km",
    diameterKm: 12104,
    orbitalPeriod: "225 days",
    dayLength: "243 Earth days",
    temperatureRange: "462 C (average)",
    moons: 0,
    atmosphere: "96.5% CO2, 3.5% N2 (extremely dense)",
    funFact:
      "Venus rotates backwards compared to most planets, so the Sun rises in the west.",
    relativeSize: 0.085,
  },
  {
    name: "Earth",
    color: "#4F94CD",
    knownFor: "Our home",
    distanceAU: 1.0,
    distanceKm: "149.6M",
    diameter: "12,742 km",
    diameterKm: 12742,
    orbitalPeriod: "365.25 days",
    dayLength: "24 hours",
    temperatureRange: "-89 to 57 C",
    moons: 1,
    atmosphere: "78% N2, 21% O2, 1% Ar + trace gases",
    funFact:
      "Earth is the only planet not named after a Greek or Roman deity.",
    relativeSize: 0.089,
  },
  {
    name: "Mars",
    color: "#C1440E",
    knownFor: "The Red Planet",
    distanceAU: 1.52,
    distanceKm: "227.9M",
    diameter: "6,779 km",
    diameterKm: 6779,
    orbitalPeriod: "687 days",
    dayLength: "24h 37m",
    temperatureRange: "-140 to 20 C",
    moons: 2,
    atmosphere: "95% CO2, 2.7% N2, 1.6% Ar",
    funFact:
      "Olympus Mons on Mars is the tallest volcano in the Solar System at ~21.9 km high.",
    relativeSize: 0.047,
  },
  {
    name: "Jupiter",
    color: "#C88B3A",
    knownFor: "Largest planet",
    distanceAU: 5.2,
    distanceKm: "778.5M",
    diameter: "139,820 km",
    diameterKm: 139820,
    orbitalPeriod: "11.86 years",
    dayLength: "9h 56m",
    temperatureRange: "-145 C (cloud top)",
    moons: 95,
    atmosphere: "90% H2, 10% He, traces of CH4, NH3",
    funFact:
      "Jupiter's Great Red Spot is a storm larger than Earth that has raged for at least 350 years.",
    relativeSize: 1.0,
  },
  {
    name: "Saturn",
    color: "#EAD6A6",
    knownFor: "The Rings",
    distanceAU: 9.54,
    distanceKm: "1,427M",
    diameter: "116,460 km",
    diameterKm: 116460,
    orbitalPeriod: "29.46 years",
    dayLength: "10h 42m",
    temperatureRange: "-178 C (cloud top)",
    moons: 146,
    atmosphere: "96% H2, 3% He, traces of CH4, NH3",
    funFact:
      "Saturn's density is so low it would float if you could find a bathtub big enough.",
    relativeSize: 0.833,
  },
  {
    name: "Uranus",
    color: "#73C2D0",
    knownFor: "Tilted axis",
    distanceAU: 19.2,
    distanceKm: "2,871M",
    diameter: "50,724 km",
    diameterKm: 50724,
    orbitalPeriod: "84 years",
    dayLength: "17h 14m",
    temperatureRange: "-224 C",
    moons: 28,
    atmosphere: "83% H2, 15% He, 2% CH4",
    funFact:
      "Uranus rotates on its side with an axial tilt of 98 degrees, likely from an ancient collision.",
    relativeSize: 0.363,
  },
  {
    name: "Neptune",
    color: "#3F54BA",
    knownFor: "Windiest planet",
    distanceAU: 30.06,
    distanceKm: "4,495M",
    diameter: "49,528 km",
    diameterKm: 49528,
    orbitalPeriod: "164.8 years",
    dayLength: "16h 6m",
    temperatureRange: "-218 C",
    moons: 16,
    atmosphere: "80% H2, 19% He, 1.5% CH4",
    funFact:
      "Neptune's winds reach 2,100 km/h, making it the windiest planet in the Solar System.",
    relativeSize: 0.354,
  },
  {
    name: "Pluto",
    color: "#D2B48C",
    knownFor: "Dwarf planet",
    distanceAU: 39.48,
    distanceKm: "5,906M",
    diameter: "2,377 km",
    diameterKm: 2377,
    orbitalPeriod: "248 years",
    dayLength: "6.4 Earth days",
    temperatureRange: "-233 to -223 C",
    moons: 5,
    atmosphere: "Thin N2, CH4, CO (seasonally variable)",
    funFact:
      "Pluto has a heart-shaped glacier of frozen nitrogen called Tombaugh Regio.",
    isDwarf: true,
    relativeSize: 0.017,
  },
];

interface DwarfPlanet {
  name: string;
  color: string;
  distanceAU: string;
  diameter: string;
  orbitalPeriod: string;
  moons: number;
  fact: string;
}

const dwarfPlanets: DwarfPlanet[] = [
  {
    name: "Pluto",
    color: "#D2B48C",
    distanceAU: "29.7 - 49.3",
    diameter: "2,377 km",
    orbitalPeriod: "248 years",
    moons: 5,
    fact: "Has a heart-shaped nitrogen glacier and a thin, seasonally variable atmosphere.",
  },
  {
    name: "Eris",
    color: "#C0C0C0",
    distanceAU: "37.9 - 97.6",
    diameter: "2,326 km",
    orbitalPeriod: "559 years",
    moons: 1,
    fact: "Its discovery in 2005 prompted the IAU to redefine \"planet\", reclassifying Pluto.",
  },
  {
    name: "Ceres",
    color: "#A9A9A9",
    distanceAU: "2.56 - 2.98",
    diameter: "946 km",
    orbitalPeriod: "4.6 years",
    moons: 0,
    fact: "The largest object in the Asteroid Belt and the closest dwarf planet to the Sun.",
  },
  {
    name: "Makemake",
    color: "#CD853F",
    distanceAU: "38.6 - 53.1",
    diameter: "1,430 km",
    orbitalPeriod: "306 years",
    moons: 1,
    fact: "Named after the Rapa Nui god of fertility; one of the brightest Kuiper Belt objects.",
  },
  {
    name: "Haumea",
    color: "#F5F5DC",
    distanceAU: "34.7 - 51.5",
    diameter: "~1,632 km (elongated)",
    orbitalPeriod: "285 years",
    moons: 2,
    fact: "Shaped like an elongated egg due to its ultra-fast 4-hour rotation and has its own ring system.",
  },
];

/* ------------------------------------------------------------------ */
/*  HERO SVG — solar system orbital diagram                            */
/* ------------------------------------------------------------------ */

function SolarSystemDiagram() {
  // Relative display sizes (px radius) and positions
  const sunRadius = 28;
  const bodyData = [
    { name: "Sun", cx: 44, r: sunRadius, fill: "#FDB813" },
    { name: "Mercury", cx: 100, r: 3, fill: "#8C8C8C" },
    { name: "Venus", cx: 130, r: 6, fill: "#E8CDA0" },
    { name: "Earth", cx: 165, r: 6.5, fill: "#4F94CD" },
    { name: "Mars", cx: 205, r: 4.5, fill: "#C1440E" },
    { name: "Jupiter", cx: 280, r: 16, fill: "#C88B3A" },
    { name: "Saturn", cx: 370, r: 13, fill: "#EAD6A6" },
    { name: "Uranus", cx: 450, r: 9, fill: "#73C2D0" },
    { name: "Neptune", cx: 520, r: 8.5, fill: "#3F54BA" },
    { name: "Pluto", cx: 575, r: 2.5, fill: "#D2B48C" },
  ];

  return (
    <svg
      viewBox="0 0 620 120"
      className="w-full max-w-4xl mx-auto"
      aria-label="Solar system diagram showing relative planet sizes and order"
    >
      {/* orbit line */}
      <line
        x1="44"
        y1="60"
        x2="590"
        y2="60"
        stroke="#1E293B"
        strokeWidth="1"
        strokeDasharray="4 4"
      />

      {/* Sun glow */}
      <defs>
        <radialGradient id="sunGlow">
          <stop offset="0%" stopColor="#FDB813" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FDB813" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="earthGlow">
          <stop offset="0%" stopColor="#4F94CD" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4F94CD" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="44" cy="60" r="44" fill="url(#sunGlow)" />

      {/* Saturn ring */}
      <ellipse
        cx="370"
        cy="60"
        rx="20"
        ry="5"
        fill="none"
        stroke="#EAD6A6"
        strokeWidth="1.5"
        opacity="0.6"
      />

      {/* bodies */}
      {bodyData.map((b) => (
        <g key={b.name}>
          <circle cx={b.cx} cy={60} r={b.r} fill={b.fill} />
          {b.name === "Earth" && (
            <circle cx={b.cx} cy={60} r={12} fill="url(#earthGlow)" />
          )}
          <text
            x={b.cx}
            y={60 + b.r + 14}
            textAnchor="middle"
            fill="#94A3B8"
            fontSize="7"
            fontFamily="Inter, sans-serif"
          >
            {b.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  BELT DIAGRAM SVG                                                   */
/* ------------------------------------------------------------------ */

function BeltDiagram() {
  // Simplified top-down view
  return (
    <svg
      viewBox="0 0 500 500"
      className="w-full max-w-md mx-auto"
      aria-label="Diagram showing the Asteroid Belt and Kuiper Belt around the Sun"
    >
      <defs>
        <radialGradient id="sunCenter">
          <stop offset="0%" stopColor="#FDB813" />
          <stop offset="100%" stopColor="#FDB81300" />
        </radialGradient>
      </defs>

      {/* Kuiper Belt ring */}
      <circle
        cx="250"
        cy="250"
        r="220"
        fill="none"
        stroke="#3F54BA"
        strokeWidth="30"
        opacity="0.12"
      />
      <text
        x="250"
        y="22"
        textAnchor="middle"
        fill="#3F54BA"
        fontSize="11"
        fontFamily="Inter, sans-serif"
        fontWeight="600"
      >
        Kuiper Belt
      </text>

      {/* Asteroid Belt ring */}
      <circle
        cx="250"
        cy="250"
        r="120"
        fill="none"
        stroke="#94A3B8"
        strokeWidth="14"
        opacity="0.18"
      />
      <text
        x="250"
        y="118"
        textAnchor="middle"
        fill="#94A3B8"
        fontSize="10"
        fontFamily="Inter, sans-serif"
        fontWeight="600"
      >
        Asteroid Belt
      </text>

      {/* small asteroid dots in belt */}
      {Array.from({ length: 50 }).map((_, i) => {
        const angle = (i / 50) * Math.PI * 2 + (i * 0.3);
        const rOff = 120 + (Math.sin(i * 7) * 5);
        return (
          <circle
            key={`a${i}`}
            cx={250 + Math.cos(angle) * rOff}
            cy={250 + Math.sin(angle) * rOff}
            r={Math.random() > 0.5 ? 1.2 : 0.8}
            fill="#94A3B8"
            opacity={0.5}
          />
        );
      })}

      {/* Kuiper Belt dots */}
      {Array.from({ length: 70 }).map((_, i) => {
        const angle = (i / 70) * Math.PI * 2 + (i * 0.2);
        const rOff = 220 + (Math.sin(i * 5) * 10);
        return (
          <circle
            key={`k${i}`}
            cx={250 + Math.cos(angle) * rOff}
            cy={250 + Math.sin(angle) * rOff}
            r={Math.random() > 0.5 ? 1.5 : 1}
            fill="#3F54BA"
            opacity={0.4}
          />
        );
      })}

      {/* Sun */}
      <circle cx="250" cy="250" r="14" fill="#FDB813" />
      <circle cx="250" cy="250" r="24" fill="url(#sunCenter)" opacity="0.5" />

      {/* Inner planets orbits */}
      {[42, 56, 70, 90].map((r, i) => (
        <circle
          key={`orbit-${i}`}
          cx="250"
          cy="250"
          r={r}
          fill="none"
          stroke="#1E293B"
          strokeWidth="0.5"
        />
      ))}

      {/* Outer planets orbits */}
      {[150, 175, 195, 210].map((r, i) => (
        <circle
          key={`oobit-${i}`}
          cx="250"
          cy="250"
          r={r}
          fill="none"
          stroke="#1E293B"
          strokeWidth="0.5"
        />
      ))}

      {/* planet dots */}
      <circle cx={292} cy={250} r={2} fill="#8C8C8C" />
      <circle cx={250} cy={194} r={3} fill="#E8CDA0" />
      <circle cx={180} cy={250} r={3.2} fill="#4F94CD" />
      <circle cx={250} cy={340} r={2.5} fill="#C1440E" />
      <circle cx={400} cy={250} r={6} fill="#C88B3A" />
      <circle cx={250} cy={75} r={5} fill="#EAD6A6" />
      <circle cx={55} cy={250} r={4} fill="#73C2D0" />
      <circle cx={250} cy={460} r={3.8} fill="#3F54BA" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  PLANET CARD COMPONENT                                              */
/* ------------------------------------------------------------------ */

function PlanetCard({ planet }: { planet: Planet }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group relative rounded-2xl border border-[#1E293B] bg-[#0F172A] p-5 transition-all duration-300 hover:border-[#4F46E5]/40 hover:shadow-lg hover:shadow-[#4F46E5]/5">
      {/* header */}
      <div className="flex items-start gap-4 mb-4">
        {/* planet circle */}
        <div
          className="relative flex-shrink-0 rounded-full"
          style={{
            width: 48,
            height: 48,
            background: `radial-gradient(circle at 35% 35%, ${planet.color}cc, ${planet.color}80, ${planet.color}40)`,
            boxShadow: `0 0 20px ${planet.color}30`,
          }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-xl font-semibold text-[#E2E8F0]">
            {planet.name}
          </h3>
          <span
            className="inline-block mt-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: `${planet.color}18`,
              color: planet.color,
              border: `1px solid ${planet.color}30`,
            }}
          >
            {planet.knownFor}
          </span>
        </div>
      </div>

      {/* quick stats */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
        <StatRow icon={<Ruler className="w-3.5 h-3.5" />} label="Diameter" value={planet.diameter} />
        <StatRow icon={<Orbit className="w-3.5 h-3.5" />} label="Distance" value={`${planet.distanceAU} AU`} />
        <StatRow icon={<Clock className="w-3.5 h-3.5" />} label="Year" value={planet.orbitalPeriod} />
        <StatRow icon={<Thermometer className="w-3.5 h-3.5" />} label="Temp" value={planet.temperatureRange} />
        <StatRow icon={<Globe className="w-3.5 h-3.5" />} label="Moons" value={String(planet.moons)} />
        <StatRow icon={<Clock className="w-3.5 h-3.5" />} label="Day" value={planet.dayLength} />
      </div>

      {/* expandable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-[#06B6D4] hover:text-[#06B6D4]/80 transition-colors mt-1"
      >
        {expanded ? "Less" : "More details"}
        {expanded ? (
          <ChevronUp className="w-3.5 h-3.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" />
        )}
      </button>

      {expanded && (
        <div className="mt-3 space-y-2 text-sm animate-in fade-in slide-in-from-top-2">
          <div>
            <span className="text-[#94A3B8]">Distance from Sun: </span>
            <span className="text-[#E2E8F0]">
              {planet.distanceKm} km ({planet.distanceAU} AU)
            </span>
          </div>
          <div>
            <span className="text-[#94A3B8]">Atmosphere: </span>
            <span className="text-[#E2E8F0]">{planet.atmosphere}</span>
          </div>
          <div className="flex gap-2 items-start rounded-lg bg-[#030712] border border-[#1E293B] p-3 mt-2">
            <Sparkles className="w-4 h-4 text-[#06B6D4] flex-shrink-0 mt-0.5" />
            <p className="text-[#94A3B8] text-xs leading-relaxed">
              {planet.funFact}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[#94A3B8]">{icon}</span>
      <span className="text-[#94A3B8]">{label}:</span>
      <span className="text-[#E2E8F0] truncate">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  COMPARISON TABLE                                                   */
/* ------------------------------------------------------------------ */

function ComparisonTable() {
  const headers = [
    "Planet",
    "Diameter (km)",
    "Distance (AU)",
    "Moons",
    "Temperature",
    "Year Length",
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-[#1E293B]">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-[#0F172A] border-b border-[#1E293B]">
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 font-heading font-semibold text-[#E2E8F0] whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {planets.map((p, i) => (
            <tr
              key={p.name}
              className={`border-b border-[#1E293B]/60 transition-colors hover:bg-[#1E293B]/30 ${
                i % 2 === 0 ? "bg-[#030712]" : "bg-[#0F172A]/40"
              }`}
            >
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: p.color }}
                  />
                  <span className="font-medium text-[#E2E8F0]">
                    {p.name}
                    {p.isDwarf && (
                      <span className="ml-1 text-xs text-[#94A3B8]">
                        (dwarf)
                      </span>
                    )}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-[#94A3B8] whitespace-nowrap">
                {p.diameterKm.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-[#94A3B8] whitespace-nowrap">
                {p.distanceAU}
              </td>
              <td className="px-4 py-3 text-[#94A3B8]">{p.moons}</td>
              <td className="px-4 py-3 text-[#94A3B8] whitespace-nowrap">
                {p.temperatureRange}
              </td>
              <td className="px-4 py-3 text-[#94A3B8] whitespace-nowrap">
                {p.orbitalPeriod}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SIZE COMPARISON BAR                                                */
/* ------------------------------------------------------------------ */

function SizeComparison() {
  const maxDiameter = Math.max(...planets.map((p) => p.diameterKm));
  return (
    <div className="space-y-3">
      {planets.map((p) => {
        const pct = (p.diameterKm / maxDiameter) * 100;
        return (
          <div key={p.name} className="flex items-center gap-3">
            <span className="w-20 text-sm text-[#94A3B8] text-right flex-shrink-0">
              {p.name}
            </span>
            <div className="flex-1 h-5 bg-[#0F172A] rounded-full overflow-hidden border border-[#1E293B]">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.max(pct, 2)}%`,
                  backgroundColor: p.color,
                  opacity: 0.8,
                }}
              />
            </div>
            <span className="w-28 text-xs text-[#94A3B8] flex-shrink-0">
              {p.diameterKm.toLocaleString()} km
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export default function SolarSystemPage() {
  return (
    <main className="min-h-screen bg-[#030712]">
      {/* ---- HERO ---- */}
      <section className="relative overflow-hidden pt-10 sm:pt-12 pb-8">
        {/* subtle star field bg */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 10% 20%, #fff 50%, transparent 100%), " +
              "radial-gradient(1px 1px at 30% 60%, #fff 50%, transparent 100%), " +
              "radial-gradient(1px 1px at 50% 40%, #fff 50%, transparent 100%), " +
              "radial-gradient(1px 1px at 70% 80%, #fff 50%, transparent 100%), " +
              "radial-gradient(1px 1px at 90% 10%, #fff 50%, transparent 100%), " +
              "radial-gradient(0.5px 0.5px at 15% 85%, #fff 50%, transparent 100%), " +
              "radial-gradient(0.5px 0.5px at 45% 15%, #fff 50%, transparent 100%), " +
              "radial-gradient(0.5px 0.5px at 75% 55%, #fff 50%, transparent 100%), " +
              "radial-gradient(0.5px 0.5px at 85% 35%, #fff 50%, transparent 100%), " +
              "radial-gradient(0.5px 0.5px at 60% 90%, #fff 50%, transparent 100%)",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#4F46E5]/30 bg-[#4F46E5]/10 px-4 py-1.5 mb-6">
            <Orbit className="w-4 h-4 text-[#4F46E5]" />
            <span className="text-sm font-medium text-[#4F46E5]">
              Explore the cosmos
            </span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-[#E2E8F0] mb-4">
            Our{" "}
            <span className="bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] bg-clip-text text-transparent">
              Solar System
            </span>
          </h1>
          <p className="text-[#94A3B8] text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Eight planets, five recognized dwarf planets, two major debris belts,
            and one extraordinary star — explore them all.
          </p>

          {/* orbital diagram */}
          <SolarSystemDiagram />
        </div>
      </section>

      {/* ---- PLANET CARDS ---- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <SectionHeading
          icon={<Globe className="w-5 h-5" />}
          title="The Planets"
          subtitle="From scorching Mercury to icy Neptune — and our favorite dwarf planet."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          {planets.map((p) => (
            <PlanetCard key={p.name} planet={p} />
          ))}
        </div>
      </section>

      {/* ---- SIZE COMPARISON ---- */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <SectionHeading
          icon={<Maximize2 className="w-5 h-5" />}
          title="Size Comparison"
          subtitle="How the planets stack up by diameter."
        />
        <div className="mt-8 rounded-2xl border border-[#1E293B] bg-[#0F172A] p-6">
          <SizeComparison />
        </div>
      </section>

      {/* ---- COMPARISON TABLE ---- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <SectionHeading
          icon={<Info className="w-5 h-5" />}
          title="Planet Comparison"
          subtitle="Side-by-side metrics for every planet in the Solar System."
        />
        <div className="mt-8">
          <ComparisonTable />
        </div>
      </section>

      <AdBanner />

      {/* ---- DWARF PLANETS ---- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <SectionHeading
          icon={<CircleDot className="w-5 h-5" />}
          title="Dwarf Planets"
          subtitle="Small worlds with big stories — the five IAU-recognized dwarf planets."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          {dwarfPlanets.map((dp) => (
            <div
              key={dp.name}
              className="rounded-2xl border border-[#1E293B] bg-[#0F172A] p-5 transition-all hover:border-[#06B6D4]/30"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${dp.color}cc, ${dp.color}60)`,
                  }}
                />
                <h3 className="font-heading text-lg font-semibold text-[#E2E8F0]">
                  {dp.name}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm mb-3">
                <div>
                  <span className="text-[#94A3B8]">Distance: </span>
                  <span className="text-[#E2E8F0]">{dp.distanceAU} AU</span>
                </div>
                <div>
                  <span className="text-[#94A3B8]">Diameter: </span>
                  <span className="text-[#E2E8F0]">{dp.diameter}</span>
                </div>
                <div>
                  <span className="text-[#94A3B8]">Year: </span>
                  <span className="text-[#E2E8F0]">{dp.orbitalPeriod}</span>
                </div>
                <div>
                  <span className="text-[#94A3B8]">Moons: </span>
                  <span className="text-[#E2E8F0]">{dp.moons}</span>
                </div>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {dp.fact}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- ASTEROID & KUIPER BELT ---- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <SectionHeading
          icon={<Sparkles className="w-5 h-5" />}
          title="Asteroid Belt & Kuiper Belt"
          subtitle="Two vast regions of rocky and icy debris that shaped our Solar System."
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-2 items-start">
          {/* diagram */}
          <div className="rounded-2xl border border-[#1E293B] bg-[#0F172A] p-6">
            <BeltDiagram />
          </div>

          {/* text explainers */}
          <div className="space-y-6">
            {/* Asteroid Belt */}
            <div className="rounded-2xl border border-[#1E293B] bg-[#0F172A] p-6">
              <h3 className="font-heading text-xl font-semibold text-[#E2E8F0] mb-3 flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: "#94A3B8" }}
                />
                Asteroid Belt
              </h3>
              <div className="space-y-2 text-sm text-[#94A3B8] leading-relaxed">
                <p>
                  Located between Mars and Jupiter (2.2 - 3.2 AU from the Sun),
                  the Asteroid Belt contains millions of rocky bodies left over
                  from the Solar System&apos;s formation 4.6 billion years ago.
                </p>
                <p>
                  Despite what movies suggest, the belt is mostly empty space.
                  The total mass of all asteroids combined is only about 4% of
                  Earth&apos;s Moon. The largest object, Ceres, accounts for
                  roughly a third of the belt&apos;s total mass.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-lg bg-[#030712] border border-[#1E293B] px-3 py-2">
                    <div className="text-[#E2E8F0] font-semibold">2.2 - 3.2 AU</div>
                    <div className="text-xs text-[#94A3B8]">Distance from Sun</div>
                  </div>
                  <div className="rounded-lg bg-[#030712] border border-[#1E293B] px-3 py-2">
                    <div className="text-[#E2E8F0] font-semibold">~1.1M</div>
                    <div className="text-xs text-[#94A3B8]">Known asteroids (1 km+)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kuiper Belt */}
            <div className="rounded-2xl border border-[#1E293B] bg-[#0F172A] p-6">
              <h3 className="font-heading text-xl font-semibold text-[#E2E8F0] mb-3 flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: "#3F54BA" }}
                />
                Kuiper Belt
              </h3>
              <div className="space-y-2 text-sm text-[#94A3B8] leading-relaxed">
                <p>
                  Extending from Neptune&apos;s orbit (~30 AU) out to roughly
                  50 AU, the Kuiper Belt is a vast ring of icy bodies, including
                  dwarf planets Pluto, Eris, Makemake, and Haumea.
                </p>
                <p>
                  It is estimated to contain hundreds of thousands of objects
                  larger than 100 km and trillions of smaller icy bodies. The
                  belt is also the source of many short-period comets.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-lg bg-[#030712] border border-[#1E293B] px-3 py-2">
                    <div className="text-[#E2E8F0] font-semibold">30 - 50 AU</div>
                    <div className="text-xs text-[#94A3B8]">Distance from Sun</div>
                  </div>
                  <div className="rounded-lg bg-[#030712] border border-[#1E293B] px-3 py-2">
                    <div className="text-[#E2E8F0] font-semibold">20x wider</div>
                    <div className="text-xs text-[#94A3B8]">Than the Asteroid Belt</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  SECTION HEADING HELPER                                             */
/* ------------------------------------------------------------------ */

function SectionHeading({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[#4F46E5]">{icon}</span>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#E2E8F0]">
          {title}
        </h2>
      </div>
      <p className="text-[#94A3B8] max-w-2xl">{subtitle}</p>
    </div>
  );
}
