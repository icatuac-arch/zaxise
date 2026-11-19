"use client";

import { useState } from "react";
import {
  Rocket,
  Star,
  Sparkles,
  Globe,
  Telescope,
  Orbit,
  MapPin,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  DATA                                                                */
/* ------------------------------------------------------------------ */

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  yearsAgo: number; // approximate years ago for positioning
}

interface Era {
  name: string;
  dateRange: string;
  color: string;
  colorBg: string;
  colorBorder: string;
  icon: React.ReactNode;
  events: TimelineEvent[];
}

const ERAS: Era[] = [
  {
    name: "The Beginning",
    dateRange: "13.8 – 13 billion years ago",
    color: "text-orange-400",
    colorBg: "bg-orange-500/10",
    colorBorder: "border-orange-500/40",
    icon: <Sparkles className="w-5 h-5 text-orange-400" />,
    events: [
      {
        date: "13.8 BYA",
        title: "Big Bang",
        description:
          "The universe begins as an infinitely dense singularity, exploding outward in the most energetic event in all of history.",
        yearsAgo: 13.8e9,
      },
      {
        date: "13.8 BYA",
        title: "Inflation",
        description:
          "The universe expands exponentially in a fraction of a second, growing from subatomic to cosmic scale almost instantly.",
        yearsAgo: 13.799e9,
      },
      {
        date: "13.5 BYA",
        title: "First Stars Form",
        description:
          'The "cosmic dawn" ends the dark ages as hydrogen and helium collapse into the first luminous stars.',
        yearsAgo: 13.5e9,
      },
      {
        date: "13.4 BYA",
        title: "First Galaxies Form",
        description:
          "Gravity pulls stars together into the earliest galaxies — small, irregular collections of young, hot stars.",
        yearsAgo: 13.4e9,
      },
    ],
  },
  {
    name: "Cosmic Evolution",
    dateRange: "13 – 5 billion years ago",
    color: "text-purple-400",
    colorBg: "bg-purple-500/10",
    colorBorder: "border-purple-500/40",
    icon: <Orbit className="w-5 h-5 text-purple-400" />,
    events: [
      {
        date: "13.2 BYA",
        title: "Milky Way Begins Forming",
        description:
          "Our home galaxy starts as a small collection of stars and gas, gradually growing through mergers and accretion.",
        yearsAgo: 13.2e9,
      },
      {
        date: "10 BYA",
        title: "Heavy Elements Forged in Supernovae",
        description:
          "Massive stars explode as supernovae, scattering carbon, oxygen, iron, and other heavy elements that will enable rocky planets.",
        yearsAgo: 10e9,
      },
      {
        date: "9 BYA",
        title: "Milky Way's Disk Takes Shape",
        description:
          "Our galaxy settles into its iconic spiral disk structure with well-defined arms of stars, gas, and dust.",
        yearsAgo: 9e9,
      },
    ],
  },
  {
    name: "Our Solar System",
    dateRange: "5 – 3.5 billion years ago",
    color: "text-blue-400",
    colorBg: "bg-blue-500/10",
    colorBorder: "border-blue-500/40",
    icon: <Globe className="w-5 h-5 text-blue-400" />,
    events: [
      {
        date: "4.6 BYA",
        title: "Solar System Forms",
        description:
          "A cloud of gas and dust collapses under gravity, igniting our Sun and forming a swirling disk of material that becomes the planets.",
        yearsAgo: 4.6e9,
      },
      {
        date: "4.5 BYA",
        title: "Earth Forms, Moon Created",
        description:
          "Earth coalesces from rocky debris. A Mars-sized body slams into early Earth, ejecting material that becomes our Moon.",
        yearsAgo: 4.5e9,
      },
      {
        date: "4.1 BYA",
        title: "Late Heavy Bombardment",
        description:
          "A barrage of asteroids pummels the inner planets, cratering surfaces and delivering water and organic molecules to Earth.",
        yearsAgo: 4.1e9,
      },
      {
        date: "3.8 BYA",
        title: "First Life on Earth",
        description:
          "Single-celled organisms appear in Earth's oceans — the first known life, likely near hydrothermal vents on the ocean floor.",
        yearsAgo: 3.8e9,
      },
    ],
  },
  {
    name: "Life Evolves",
    dateRange: "3.5 BYA – 10,000 years ago",
    color: "text-green-400",
    colorBg: "bg-green-500/10",
    colorBorder: "border-green-500/40",
    icon: <Star className="w-5 h-5 text-green-400" />,
    events: [
      {
        date: "2.4 BYA",
        title: "Great Oxygenation Event",
        description:
          "Cyanobacteria flood the atmosphere with oxygen, transforming Earth's chemistry and enabling complex aerobic life.",
        yearsAgo: 2.4e9,
      },
      {
        date: "540 MYA",
        title: "Cambrian Explosion",
        description:
          "Complex multicellular life appears in an extraordinary burst of evolution — most major animal groups emerge in a geological instant.",
        yearsAgo: 540e6,
      },
      {
        date: "230 MYA",
        title: "First Dinosaurs",
        description:
          "Small, bipedal reptiles in the Triassic period mark the beginning of the dinosaur lineage that will dominate for 165 million years.",
        yearsAgo: 230e6,
      },
      {
        date: "66 MYA",
        title: "Asteroid Kills Dinosaurs",
        description:
          "A 10-km asteroid strikes the Yucatan Peninsula, triggering mass extinction. 75% of species vanish, clearing the way for mammals.",
        yearsAgo: 66e6,
      },
      {
        date: "300,000 YA",
        title: "Homo Sapiens Appear",
        description:
          "Modern humans emerge in Africa, eventually spreading across every continent and fundamentally transforming the planet.",
        yearsAgo: 300000,
      },
      {
        date: "5,000 YA",
        title: "First Civilizations & Astronomy",
        description:
          "Mesopotamia and Egypt develop writing, mathematics, and systematic astronomy — humanity begins mapping the cosmos.",
        yearsAgo: 5000,
      },
    ],
  },
  {
    name: "Space Age",
    dateRange: "1957 – present",
    color: "text-cyan-400",
    colorBg: "bg-cyan-500/10",
    colorBorder: "border-cyan-500/40",
    icon: <Rocket className="w-5 h-5 text-cyan-400" />,
    events: [
      {
        date: "1957",
        title: "Sputnik — First Satellite",
        description:
          "The Soviet Union launches Sputnik 1, a beeping metal sphere that becomes the first artificial object to orbit Earth.",
        yearsAgo: 2026 - 1957,
      },
      {
        date: "1961",
        title: "Yuri Gagarin — First Human in Space",
        description:
          "Soviet cosmonaut Yuri Gagarin completes one orbit of Earth aboard Vostok 1, proving humans can survive in space.",
        yearsAgo: 2026 - 1961,
      },
      {
        date: "1969",
        title: "Apollo 11 — First Humans on the Moon",
        description:
          'Neil Armstrong and Buzz Aldrin walk on the lunar surface. "That\'s one small step for man, one giant leap for mankind."',
        yearsAgo: 2026 - 1969,
      },
      {
        date: "1971",
        title: "First Space Station (Salyut 1)",
        description:
          "The Soviet Union launches the first crewed orbital station, pioneering long-duration spaceflight.",
        yearsAgo: 2026 - 1971,
      },
      {
        date: "1977",
        title: "Voyager 1 & 2 Launched",
        description:
          "NASA's twin probes embark on a grand tour of the outer planets, carrying golden records with sounds and images of Earth.",
        yearsAgo: 2026 - 1977,
      },
      {
        date: "1981",
        title: "First Space Shuttle Flight",
        description:
          "Columbia launches, inaugurating the Space Shuttle era — the first reusable crewed spacecraft.",
        yearsAgo: 2026 - 1981,
      },
      {
        date: "1990",
        title: "Hubble Space Telescope",
        description:
          "Hubble launches into orbit, eventually delivering some of the most iconic and scientifically important images of the cosmos.",
        yearsAgo: 2026 - 1990,
      },
      {
        date: "1998",
        title: "ISS Construction Begins",
        description:
          "The first modules of the International Space Station launch, beginning assembly of humanity's largest structure in orbit.",
        yearsAgo: 2026 - 1998,
      },
      {
        date: "2004",
        title: "Mars Rovers Spirit & Opportunity",
        description:
          "NASA lands twin rovers on Mars. Opportunity operates for 15 years, far exceeding its 90-day mission.",
        yearsAgo: 2026 - 2004,
      },
      {
        date: "2012",
        title: "Voyager 1 Enters Interstellar Space",
        description:
          "After 35 years, Voyager 1 crosses the heliopause and becomes the first human-made object to reach interstellar space.",
        yearsAgo: 2026 - 2012,
      },
      {
        date: "2021",
        title: "James Webb Space Telescope",
        description:
          "JWST launches on Christmas Day, carrying the most powerful space telescope ever built to peer back at the universe's first light.",
        yearsAgo: 2026 - 2021,
      },
      {
        date: "2024",
        title: "Artemis Program — Return to the Moon",
        description:
          "NASA's Artemis program begins the next chapter of lunar exploration, aiming to establish a sustained human presence on the Moon.",
        yearsAgo: 2026 - 2024,
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function SpaceTimelinePage() {
  const [viewMode, setViewMode] = useState<"logarithmic" | "linear">(
    "logarithmic"
  );

  /** For logarithmic view, calculate relative bar width (log scale). */
  function getRelativeSize(yearsAgo: number): number {
    if (yearsAgo <= 0) return 1;
    const logVal = Math.log10(yearsAgo);
    const maxLog = Math.log10(13.8e9);
    return (logVal / maxLog) * 100;
  }

  return (
    <main className="min-h-screen bg-dark-bg text-[#E2E8F0]">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 pt-10 sm:pt-12 pb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm mb-6">
          <Telescope className="w-4 h-4" />
          History of Space
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          13.8 Billion Years of Cosmic History
        </h1>
        <p className="text-muted max-w-2xl mx-auto text-base sm:text-lg">
          From the first spark of the Big Bang to today&apos;s space telescopes
          — explore every milestone in the story of our universe on one
          continuous timeline.
        </p>
      </section>

      {/* ── Scale Toggle ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 pb-8">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setViewMode("logarithmic")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === "logarithmic"
                ? "bg-primary text-white"
                : "bg-card-bg border border-card-border text-muted hover:text-white"
            }`}
          >
            <ZoomOut className="w-4 h-4" />
            Logarithmic (All Eras)
          </button>
          <button
            onClick={() => setViewMode("linear")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === "linear"
                ? "bg-primary text-white"
                : "bg-card-bg border border-card-border text-muted hover:text-white"
            }`}
          >
            <ZoomIn className="w-4 h-4" />
            Linear (Recent History)
          </button>
        </div>
        <p className="text-center text-muted text-xs mt-2">
          {viewMode === "logarithmic"
            ? "Logarithmic scale — all eras are visible with proportional spacing"
            : "Linear scale — recent history is expanded, ancient eras are compressed"}
        </p>
      </section>

      {/* ── Timeline ──────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-purple-500 via-blue-500 via-green-500 to-cyan-500 opacity-30" />

          {ERAS.map((era, eraIdx) => {
            /** In linear mode, compress old eras and expand Space Age */
            const shouldCollapse =
              viewMode === "linear" && eraIdx < ERAS.length - 2;

            return (
              <div key={era.name} className="mb-10 last:mb-0">
                {/* Era header */}
                <div className="relative flex items-start gap-4 mb-6">
                  <div
                    className={`relative z-10 flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl ${era.colorBg} border ${era.colorBorder} flex items-center justify-center`}
                  >
                    {era.icon}
                  </div>

            <AdBanner />
                  <div>
                    <h2
                      className={`font-heading text-xl sm:text-2xl font-bold ${era.color}`}
                    >
                      {era.name}
                    </h2>
                    <p className="text-muted text-sm">{era.dateRange}</p>
                  </div>
                </div>

                {/* Events */}
                <div className="ml-14 sm:ml-20 space-y-4">
                  {(shouldCollapse ? era.events.slice(0, 2) : era.events).map(
                    (event) => (
                      <div
                        key={event.date + event.title}
                        className="relative group"
                      >
                        {/* Dot on timeline */}
                        <div
                          className={`absolute -left-[2.55rem] sm:-left-[3.05rem] top-2 w-3 h-3 rounded-full border-2 ${era.colorBorder} ${era.colorBg}`}
                        />

                        <div className="bg-card-bg border border-card-border rounded-xl p-4 hover:border-white/10 transition-colors">
                          {/* Log bar (only logarithmic mode) */}
                          {viewMode === "logarithmic" && (
                            <div className="mb-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${era.colorBg} border ${era.colorBorder}`}
                                style={{
                                  width: `${getRelativeSize(event.yearsAgo)}%`,
                                }}
                              />
                            </div>
                          )}

                          <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                            <span
                              className={`text-xs font-mono font-semibold whitespace-nowrap ${era.color}`}
                            >
                              {event.date}
                            </span>
                            <div>
                              <h3 className="font-heading font-semibold text-white text-sm sm:text-base">
                                {event.title}
                              </h3>
                              <p className="text-muted text-sm mt-1 leading-relaxed">
                                {event.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  {shouldCollapse && era.events.length > 2 && (
                    <p className="text-muted text-xs italic pl-2">
                      + {era.events.length - 2} more event
                      {era.events.length - 2 > 1 ? "s" : ""} (switch to
                      logarithmic view to see all)
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {/* ── "You Are Here" marker ─────────────────────────────── */}
          <div className="relative flex items-start gap-4 mt-10">
            <div className="relative z-10 flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-secondary/10 border border-secondary/40 flex items-center justify-center animate-pulse">
              <MapPin className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-secondary">
                You Are Here
              </h2>
              <p className="text-muted text-sm">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                — 13.8 billion years after it all began
              </p>
              <p className="text-muted text-xs mt-1">
                If the universe&apos;s history were a 24-hour day, all of human
                civilization would fit in the last 0.2 seconds.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
