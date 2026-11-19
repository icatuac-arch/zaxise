"use client";

import { useState } from "react";
import {
  Rocket,
  Globe,
  Users,
  Satellite,
  AlertTriangle,
  Moon,
  Timer,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Shield,
  Trash2,
  Orbit,
  Star,
  Calendar,
  User,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  TYPES                                                             */
/* ------------------------------------------------------------------ */

type Category =
  | "all"
  | "moon"
  | "mars"
  | "iss"
  | "stations"
  | "accidents"
  | "satellites";

type Outcome = "Success" | "Partial" | "Failure";

interface Mission {
  year: string;
  name: string;
  description: string;
  country: string;
  flag: string;
  crew?: string[];
  duration?: string;
  outcome: Outcome;
  category: Category;
}

interface Astronaut {
  name: string;
  achievement: string;
  year: string;
  country: string;
  flag: string;
}

/* ------------------------------------------------------------------ */
/*  DATA                                                              */
/* ------------------------------------------------------------------ */

const MISSIONS: Mission[] = [
  // Satellites
  {
    year: "1957",
    name: "Sputnik",
    description:
      "The first artificial satellite ever placed in Earth orbit. Launched by the Soviet Union, its distinctive radio beeps shocked the world and triggered the Space Race between the US and USSR.",
    country: "Soviet Union",
    flag: "\u2601\uFE0F",
    outcome: "Success",
    category: "satellites",
  },
  {
    year: "1958",
    name: "Explorer 1",
    description:
      "The first satellite launched by the United States. Discovered the Van Allen radiation belts surrounding Earth, a major scientific breakthrough that reshaped our understanding of near-Earth space.",
    country: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    outcome: "Success",
    category: "satellites",
  },
  {
    year: "1962",
    name: "Telstar",
    description:
      "The first active communications satellite, enabling the first live transatlantic television signal. Paved the way for the global telecommunications revolution we rely on today.",
    country: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    outcome: "Success",
    category: "satellites",
  },
  // Accidents
  {
    year: "1967",
    name: "Apollo 1",
    description:
      "A cabin fire during a launch rehearsal test killed astronauts Gus Grissom, Ed White, and Roger Chaffee. The tragedy led to major design and engineering changes in the Apollo command module.",
    country: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    crew: ["Gus Grissom", "Ed White", "Roger Chaffee"],
    outcome: "Failure",
    category: "accidents",
  },
  // Moon
  {
    year: "1969",
    name: "Apollo 11",
    description:
      'First humans to set foot on the Moon. Neil Armstrong\'s "one small step" became one of humanity\'s greatest achievements. Buzz Aldrin joined him on the lunar surface while Michael Collins orbited above.',
    country: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    crew: ["Neil Armstrong", "Buzz Aldrin", "Michael Collins"],
    duration: "8 days",
    outcome: "Success",
    category: "moon",
  },
  {
    year: "1969",
    name: "Apollo 12",
    description:
      "Second crewed Moon landing, demonstrating pinpoint landing capability by touching down near the Surveyor 3 probe. Pete Conrad and Alan Bean collected lunar samples and deployed scientific instruments.",
    country: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    crew: ["Pete Conrad", "Alan Bean", "Richard Gordon"],
    duration: "10 days",
    outcome: "Success",
    category: "moon",
  },
  {
    year: "1970",
    name: "Apollo 13",
    description:
      '"Houston, we\'ve had a problem." An oxygen tank exploded en route to the Moon, forcing the crew to abort the landing and use the lunar module as a lifeboat. A triumph of ingenuity and teamwork.',
    country: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    crew: ["Jim Lovell", "Jack Swigert", "Fred Haise"],
    duration: "5 days 22 hrs",
    outcome: "Partial",
    category: "moon",
  },
  {
    year: "1971",
    name: "Apollo 14",
    description:
      "Alan Shepard, America's first man in space, returned to flight and walked on the Moon. He famously hit two golf balls on the lunar surface. The mission restored confidence after Apollo 13.",
    country: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    crew: ["Alan Shepard", "Stuart Roosa", "Edgar Mitchell"],
    duration: "9 days",
    outcome: "Success",
    category: "moon",
  },
  {
    year: "1971",
    name: "Apollo 15",
    description:
      "First mission to use the Lunar Roving Vehicle, greatly extending exploration range. The crew conducted extensive geological surveys and discovered the Genesis Rock, believed to be 4 billion years old.",
    country: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    crew: ["David Scott", "Alfred Worden", "James Irwin"],
    duration: "12 days",
    outcome: "Success",
    category: "moon",
  },
  // Soyuz 11 accident
  {
    year: "1971",
    name: "Soyuz 11",
    description:
      "The crew successfully docked with the Salyut 1 space station and spent 23 days aboard. Tragically, a cabin vent valve opened during re-entry preparations, killing all three cosmonauts.",
    country: "Soviet Union",
    flag: "\u2601\uFE0F",
    crew: [
      "Georgy Dobrovolsky",
      "Vladislav Volkov",
      "Viktor Patsayev",
    ],
    duration: "23 days",
    outcome: "Failure",
    category: "accidents",
  },
  // Space stations - Salyut
  {
    year: "1971-1991",
    name: "Salyut Program",
    description:
      "A series of Soviet space stations that pioneered long-duration spaceflight. Salyut 1 was the world's first space station. The program included both civilian and military stations across seven launches.",
    country: "Soviet Union",
    flag: "\u2601\uFE0F",
    duration: "20 years",
    outcome: "Success",
    category: "stations",
  },
  {
    year: "1972",
    name: "Apollo 16",
    description:
      "John Young and Charles Duke explored the lunar highlands, the first mission to land in this terrain type. They collected 95.8 kg of lunar samples and conducted ultraviolet astronomy experiments.",
    country: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    crew: ["John Young", "Thomas Mattingly", "Charles Duke"],
    duration: "11 days",
    outcome: "Success",
    category: "moon",
  },
  {
    year: "1972",
    name: "Apollo 17",
    description:
      "The last crewed mission to the Moon. Eugene Cernan became the last human to walk on the lunar surface. Geologist Harrison Schmitt was the first scientist-astronaut to reach the Moon.",
    country: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    crew: ["Eugene Cernan", "Ronald Evans", "Harrison Schmitt"],
    duration: "12 days",
    outcome: "Success",
    category: "moon",
  },
  // Skylab
  {
    year: "1973-1974",
    name: "Skylab",
    description:
      "America's first space station, built from a converted Saturn V rocket stage. Three crews lived aboard for a total of 171 days, conducting solar astronomy and biomedical research in microgravity.",
    country: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    duration: "1 year",
    outcome: "Success",
    category: "stations",
  },
  // Challenger
  {
    year: "1986",
    name: "Space Shuttle Challenger (STS-51-L)",
    description:
      "Broke apart 73 seconds after launch due to O-ring failure in the right solid rocket booster. All seven crew members were killed, including teacher Christa McAuliffe. Led to a 32-month halt in shuttle flights.",
    country: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    crew: [
      "Dick Scobee",
      "Michael Smith",
      "Judith Resnik",
      "Ellison Onizuka",
      "Ronald McNair",
      "Gregory Jarvis",
      "Christa McAuliffe",
    ],
    outcome: "Failure",
    category: "accidents",
  },
  // Mir
  {
    year: "1986-2001",
    name: "Mir Space Station",
    description:
      "The Soviet/Russian space station that operated for 15 years in low Earth orbit. It was the first modular space station and held the record for longest continuous human presence in space (3,644 days).",
    country: "Russia",
    flag: "\uD83C\uDDF7\uD83C\uDDFA",
    duration: "15 years",
    outcome: "Success",
    category: "stations",
  },
  // Hubble
  {
    year: "1990",
    name: "Hubble Space Telescope",
    description:
      "Launched with a flawed mirror that was corrected by a dramatic shuttle servicing mission in 1993. Has since produced some of the most iconic images in astronomy and revolutionized our understanding of the universe.",
    country: "United States / ESA",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    duration: "34+ years",
    outcome: "Success",
    category: "satellites",
  },
  // Mars Pathfinder
  {
    year: "1997",
    name: "Mars Pathfinder & Sojourner",
    description:
      "First successful rover on Mars. The tiny Sojourner rover (just 10 kg) explored the Ares Vallis region for 83 days, far exceeding its 7-day design life. Proved that low-cost Mars exploration was feasible.",
    country: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    duration: "83 days",
    outcome: "Success",
    category: "mars",
  },
  // ISS
  {
    year: "1998-present",
    name: "International Space Station (ISS)",
    description:
      "The largest structure ever built in space, assembled by 15 nations. Continuously inhabited since November 2000, it orbits Earth every 90 minutes and has hosted over 270 visitors from 21 countries.",
    country: "International",
    flag: "\uD83C\uDF0D",
    duration: "25+ years",
    outcome: "Success",
    category: "iss",
  },
  // Columbia
  {
    year: "2003",
    name: "Space Shuttle Columbia (STS-107)",
    description:
      "Disintegrated during re-entry over Texas after foam insulation from the external tank struck and damaged the wing's thermal protection during launch. All seven crew members perished.",
    country: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    crew: [
      "Rick Husband",
      "William McCool",
      "Michael Anderson",
      "David Brown",
      "Kalpana Chawla",
      "Laurel Clark",
      "Ilan Ramon",
    ],
    outcome: "Failure",
    category: "accidents",
  },
  // Spirit & Opportunity
  {
    year: "2004",
    name: "Spirit & Opportunity Rovers",
    description:
      "Twin Mars rovers designed for 90-day missions. Spirit operated for 6 years. Opportunity became legendary, roving Mars for nearly 15 years and traveling over 45 km \u2014 the longest off-Earth driving record.",
    country: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    duration: "15 years (Opportunity)",
    outcome: "Success",
    category: "mars",
  },
  // Curiosity
  {
    year: "2012",
    name: "Curiosity Rover (MSL)",
    description:
      "A car-sized rover that landed via the daring \"sky crane\" maneuver. Still active and exploring Gale Crater, it has confirmed that Mars once had conditions suitable for microbial life, including liquid water.",
    country: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    duration: "12+ years (still active)",
    outcome: "Success",
    category: "mars",
  },
  // Perseverance
  {
    year: "2021",
    name: "Perseverance & Ingenuity",
    description:
      "Perseverance is searching for ancient life in Jezero Crater and caching samples for future return to Earth. Ingenuity, the helicopter drone, achieved the first powered flight on another planet \u2014 a Wright Brothers moment on Mars.",
    country: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    duration: "3+ years (still active)",
    outcome: "Success",
    category: "mars",
  },
  // JWST
  {
    year: "2021",
    name: "James Webb Space Telescope",
    description:
      "The most powerful space telescope ever built, orbiting the Sun at the L2 Lagrange point 1.5 million km from Earth. Its infrared instruments peer back over 13 billion years to the first galaxies that formed after the Big Bang.",
    country: "United States / ESA / CSA",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    duration: "3+ years (still active)",
    outcome: "Success",
    category: "satellites",
  },
  // Artemis
  {
    year: "2024",
    name: "Artemis Program",
    description:
      "NASA's ambitious program to return humans to the Moon and establish a sustainable presence. Artemis I successfully orbited the Moon uncrewed in 2022. The program aims to land the first woman and first person of color on the Moon.",
    country: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    outcome: "Success",
    category: "moon",
  },
];

const ASTRONAUTS: Astronaut[] = [
  {
    name: "Yuri Gagarin",
    achievement:
      "First human being to journey into outer space, completing one orbit of Earth aboard Vostok 1.",
    year: "1961",
    country: "Soviet Union",
    flag: "\u2601\uFE0F",
  },
  {
    name: "Valentina Tereshkova",
    achievement:
      "First woman in space. Orbited Earth 48 times aboard Vostok 6, spending nearly three days in space.",
    year: "1963",
    country: "Soviet Union",
    flag: "\u2601\uFE0F",
  },
  {
    name: "Neil Armstrong",
    achievement:
      'First human to walk on the Moon during Apollo 11. His words "one small step for man" became immortal.',
    year: "1969",
    country: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
  },
  {
    name: "John Glenn",
    achievement:
      "First American to orbit Earth (1962). Returned to space at age 77 aboard the Space Shuttle in 1998, making him the oldest person in space.",
    year: "1998",
    country: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
  },
  {
    name: "Kalpana Chawla",
    achievement:
      "First Indian-American woman in space. Tragically perished during the Columbia disaster in 2003 on her second mission.",
    year: "1997",
    country: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
  },
  {
    name: "Peggy Whitson",
    achievement:
      "Holds the record for most time in space by a US astronaut at 665 days. First female ISS commander.",
    year: "2002-2017",
    country: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
  },
  {
    name: "Scott Kelly",
    achievement:
      "Spent 340 consecutive days on the ISS for a landmark twin study comparing his biology with his twin brother Mark, who remained on Earth.",
    year: "2015-2016",
    country: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
  },
  {
    name: "Sunita Williams",
    achievement:
      "Indian-American astronaut who completed multiple ISS expeditions. Holds records for spacewalks by a female astronaut.",
    year: "2006-present",
    country: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
  },
  {
    name: "Chris Hadfield",
    achievement:
      'Canadian astronaut famous for recording David Bowie\'s "Space Oddity" aboard the ISS, inspiring millions about life in space.',
    year: "2012-2013",
    country: "Canada",
    flag: "\uD83C\uDDE8\uD83C\uDDE6",
  },
];

const CATEGORY_CONFIG: Record<
  Category,
  { label: string; color: string; icon: React.ReactNode }
> = {
  all: {
    label: "All Missions",
    color: "#4F46E5",
    icon: <Rocket className="w-4 h-4" />,
  },
  moon: {
    label: "Moon Missions",
    color: "#EAB308",
    icon: <Moon className="w-4 h-4" />,
  },
  mars: {
    label: "Mars Missions",
    color: "#EF4444",
    icon: <Globe className="w-4 h-4" />,
  },
  iss: {
    label: "ISS",
    color: "#06B6D4",
    icon: <Orbit className="w-4 h-4" />,
  },
  stations: {
    label: "Space Stations",
    color: "#8B5CF6",
    icon: <Satellite className="w-4 h-4" />,
  },
  accidents: {
    label: "Accidents",
    color: "#F97316",
    icon: <AlertTriangle className="w-4 h-4" />,
  },
  satellites: {
    label: "Satellites",
    color: "#10B981",
    icon: <Satellite className="w-4 h-4" />,
  },
};

const OUTCOME_CONFIG: Record<
  Outcome,
  { color: string; bg: string; icon: React.ReactNode }
> = {
  Success: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  Partial: {
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
  Failure: {
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

/* ------------------------------------------------------------------ */
/*  COMPONENTS                                                        */
/* ------------------------------------------------------------------ */

function OutcomeBadge({ outcome }: { outcome: Outcome }) {
  const cfg = OUTCOME_CONFIG[outcome];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color}`}
    >
      {cfg.icon}
      {outcome}
    </span>
  );
}

function CategoryTag({ category }: { category: Category }) {
  const cfg = CATEGORY_CONFIG[category];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border"
      style={{
        backgroundColor: `${cfg.color}15`,
        borderColor: `${cfg.color}30`,
        color: cfg.color,
      }}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function StatCard({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 text-center hover:border-[#4F46E5]/40 transition-colors">
      <div className="flex justify-center mb-3 text-[#06B6D4]">{icon}</div>
      <p className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-outfit)] text-[#E2E8F0]">
        {value}
      </p>
      <p className="text-sm text-[#94A3B8] mt-1">{label}</p>
    </div>
  );
}

function TimelineCard({ mission }: { mission: Mission }) {
  const catCfg = CATEGORY_CONFIG[mission.category];
  return (
    <div className="relative pl-8 md:pl-12 pb-10 group">
      {/* Timeline connector line */}
      <div className="absolute left-3 md:left-5 top-0 bottom-0 w-px bg-[#1E293B] group-last:bg-gradient-to-b group-last:from-[#1E293B] group-last:to-transparent" />

      {/* Timeline dot */}
      <div
        className="absolute left-1 md:left-3 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10"
        style={{
          borderColor: catCfg.color,
          backgroundColor: `${catCfg.color}20`,
        }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: catCfg.color }}
        />
      </div>

      {/* Card */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 md:p-6 hover:border-[#4F46E5]/30 transition-all hover:shadow-lg hover:shadow-[#4F46E5]/5">
        {/* Header row */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-sm font-semibold text-[#06B6D4] font-[family-name:var(--font-outfit)]">
            {mission.year}
          </span>
          <span className="text-lg">{mission.flag}</span>
          <span className="text-xs text-[#94A3B8]">{mission.country}</span>
          <div className="ml-auto flex items-center gap-2">
            <CategoryTag category={mission.category} />
            <OutcomeBadge outcome={mission.outcome} />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold font-[family-name:var(--font-outfit)] text-[#E2E8F0] mb-2">
          {mission.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#94A3B8] leading-relaxed mb-3">
          {mission.description}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap gap-3 text-xs text-[#94A3B8]">
          {mission.duration && (
            <span className="inline-flex items-center gap-1">
              <Timer className="w-3.5 h-3.5 text-[#06B6D4]" />
              {mission.duration}
            </span>
          )}
          {mission.crew && mission.crew.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#06B6D4]" />
              {mission.crew.join(", ")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function AstronautCard({ astronaut }: { astronaut: Astronaut }) {
  return (
    <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 hover:border-[#4F46E5]/30 transition-all hover:shadow-lg hover:shadow-[#4F46E5]/5">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-[#4F46E5]/10 border border-[#4F46E5]/20 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-[#4F46E5]" />
        </div>
        <div>
          <h4 className="font-bold font-[family-name:var(--font-outfit)] text-[#E2E8F0]">
            {astronaut.name}
          </h4>
          <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
            <span>{astronaut.flag} {astronaut.country}</span>
            <span className="text-[#1E293B]">|</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#06B6D4]" />
              {astronaut.year}
            </span>
          </div>
        </div>
      </div>
      <p className="text-sm text-[#94A3B8] leading-relaxed">
        {astronaut.achievement}
      </p>
    </div>
  );
}

function DebrisStat({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div
      className="rounded-xl p-4 border text-center"
      style={{
        backgroundColor: `${color}08`,
        borderColor: `${color}25`,
      }}
    >
      <p
        className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-outfit)]"
        style={{ color }}
      >
        {value}
      </p>
      <p className="text-xs text-[#94A3B8] mt-1">{label}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                              */
/* ------------------------------------------------------------------ */

export default function SpaceMissionsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [showAllDebris, setShowAllDebris] = useState(false);

  const filteredMissions =
    activeCategory === "all"
      ? MISSIONS
      : MISSIONS.filter((m) => m.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#030712]">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden pt-10 sm:pt-12 pb-8">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#4F46E5]/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#06B6D4]/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4F46E5]/10 border border-[#4F46E5]/20 text-[#4F46E5] text-sm font-medium mb-6">
            <Rocket className="w-4 h-4" />
            From Sputnik to the Stars
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-[family-name:var(--font-outfit)] text-[#E2E8F0] mb-4 leading-tight">
            Space Exploration{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#06B6D4]">
              Timeline
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto">
            A journey through humanity&apos;s greatest adventure &mdash; from the
            first satellite beep to rovers on Mars and telescopes peering at the
            dawn of the universe.
          </p>
        </div>
      </section>

      {/* ============ STATS ROW ============ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-4 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            value="200+"
            label="Major Space Missions"
            icon={<Rocket className="w-7 h-7" />}
          />
          <StatCard
            value="622+"
            label="Astronauts in Space"
            icon={<Users className="w-7 h-7" />}
          />
          <StatCard
            value="72"
            label="Countries with Space Programs"
            icon={<Globe className="w-7 h-7" />}
          />
          <StatCard
            value="270+"
            label="ISS Visitors"
            icon={<Orbit className="w-7 h-7" />}
          />
        </div>
      </section>

      {/* ============ FILTER TABS ============ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CATEGORY_CONFIG) as Category[]).map((cat) => {
            const cfg = CATEGORY_CONFIG[cat];
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                  isActive
                    ? "text-white shadow-lg"
                    : "text-[#94A3B8] bg-[#0F172A] border-[#1E293B] hover:border-[#4F46E5]/40 hover:text-[#E2E8F0]"
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: cfg.color,
                        borderColor: cfg.color,
                        boxShadow: `0 4px 20px ${cfg.color}30`,
                      }
                    : undefined
                }
              >
                {cfg.icon}
                {cfg.label}
              </button>
            );
          })}
        </div>
        <p className="text-sm text-[#94A3B8] mt-3">
          Showing {filteredMissions.length} mission
          {filteredMissions.length !== 1 && "s"}
        </p>
      </section>

      {/* ============ TIMELINE ============ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-20">
        <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-outfit)] text-[#E2E8F0] mb-8 flex items-center gap-3">
          <Star className="w-6 h-6 text-[#4F46E5]" />
          Mission Timeline
        </h2>
        <div>
          {filteredMissions.map((mission, idx) => (
            <TimelineCard key={`${mission.name}-${idx}`} mission={mission} />
          ))}
        </div>
        {filteredMissions.length === 0 && (
          <div className="text-center py-16 text-[#94A3B8]">
            <Satellite className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg">
              No missions found for this category.
            </p>
          </div>
        )}
      </section>

      <AdBanner />

      {/* ============ PEOPLE WHO VISITED SPACE ============ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-20">
        <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-outfit)] text-[#E2E8F0] mb-3 flex items-center gap-3">
          <Users className="w-6 h-6 text-[#06B6D4]" />
          People Who Visited Space
        </h2>
        <p className="text-[#94A3B8] mb-8 max-w-2xl">
          From the first cosmonaut to modern-day explorers, these pioneers
          pushed the boundaries of what it means to be human.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ASTRONAUTS.map((a) => (
            <AstronautCard key={a.name} astronaut={a} />
          ))}
        </div>
      </section>

      {/* ============ SPACE DEBRIS ============ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-20">
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-outfit)] text-[#E2E8F0] mb-3 flex items-center gap-3">
            <Shield className="w-6 h-6 text-[#F97316]" />
            Space Debris &mdash; The Growing Threat
          </h2>
          <p className="text-[#94A3B8] mb-8 max-w-3xl">
            Decades of space activity have littered Earth&apos;s orbit with millions
            of debris fragments, each traveling fast enough to destroy a
            spacecraft on impact.
          </p>

          {/* Debris stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <DebrisStat
              value="~36,500"
              label="Tracked objects > 10 cm"
              color="#EF4444"
            />
            <DebrisStat
              value="~1 million"
              label="Objects 1-10 cm"
              color="#F97316"
            />
            <DebrisStat
              value="~130 million"
              label="Objects < 1 cm"
              color="#EAB308"
            />
            <DebrisStat
              value="28,000 km/h"
              label="Average orbital speed"
              color="#06B6D4"
            />
          </div>

          {/* Major events */}
          <h3 className="text-lg font-bold font-[family-name:var(--font-outfit)] text-[#E2E8F0] mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#F97316]" />
            Major Debris Events
          </h3>
          <div className="space-y-3 mb-6">
            <div className="flex gap-3 items-start">
              <span className="text-sm font-semibold text-[#06B6D4] font-[family-name:var(--font-outfit)] w-12 flex-shrink-0">
                2007
              </span>
              <p className="text-sm text-[#94A3B8]">
                <span className="text-[#E2E8F0] font-medium">
                  Chinese ASAT Test
                </span>{" "}
                &mdash; China destroyed its own Fengyun-1C weather satellite with
                a missile, creating over 3,500 trackable debris fragments and
                thousands more smaller pieces. One of the worst debris-generating
                events in history.
              </p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-sm font-semibold text-[#06B6D4] font-[family-name:var(--font-outfit)] w-12 flex-shrink-0">
                2009
              </span>
              <p className="text-sm text-[#94A3B8]">
                <span className="text-[#E2E8F0] font-medium">
                  Iridium-Cosmos Collision
                </span>{" "}
                &mdash; An active Iridium 33 communications satellite and a
                defunct Russian Cosmos 2251 collided at nearly 42,000 km/h,
                producing over 2,300 trackable debris fragments in the first
                accidental hypervelocity collision between two intact satellites.
              </p>
            </div>
          </div>

          {/* Kessler Syndrome + Cleanup */}
          <button
            onClick={() => setShowAllDebris(!showAllDebris)}
            className="inline-flex items-center gap-2 text-sm text-[#4F46E5] hover:text-[#06B6D4] transition-colors cursor-pointer mb-4"
          >
            {showAllDebris ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            {showAllDebris ? "Show less" : "Learn about Kessler Syndrome & cleanup efforts"}
          </button>

          {showAllDebris && (
            <div className="space-y-6 animate-in">
              <div className="bg-[#030712] border border-[#1E293B] rounded-xl p-5">
                <h4 className="text-base font-bold font-[family-name:var(--font-outfit)] text-[#E2E8F0] mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#EAB308]" />
                  Kessler Syndrome
                </h4>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  Proposed by NASA scientist Donald Kessler in 1978, this
                  scenario describes a cascading chain reaction where collisions
                  between orbiting objects generate debris that causes further
                  collisions, exponentially increasing the number of fragments.
                  At a critical density, this runaway effect could render certain
                  orbital altitudes unusable for generations, threatening
                  communications satellites, weather monitoring, GPS, and human
                  spaceflight.
                </p>
              </div>

              <div className="bg-[#030712] border border-[#1E293B] rounded-xl p-5">
                <h4 className="text-base font-bold font-[family-name:var(--font-outfit)] text-[#E2E8F0] mb-2 flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-[#10B981]" />
                  Cleanup Efforts
                </h4>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  <span className="text-[#E2E8F0] font-medium">
                    ESA ClearSpace-1
                  </span>{" "}
                  is a pioneering mission planned to launch in 2026. It will use
                  a four-armed robotic capture mechanism to grab and deorbit a
                  piece of debris (a Vega rocket adapter). If successful, it
                  will be the first active debris removal mission in history.
                  Other efforts include JAXA&apos;s ELSA-d, Astroscale&apos;s
                  ADRAS-J, and laser-based nudging concepts being researched
                  by multiple agencies.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============ BOTTOM CTA ============ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-20 text-center">
        <div className="bg-gradient-to-br from-[#4F46E5]/10 to-[#06B6D4]/10 border border-[#1E293B] rounded-2xl p-8 md:p-12">
          <Rocket className="w-10 h-10 text-[#4F46E5] mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-outfit)] text-[#E2E8F0] mb-3">
            The Journey Continues
          </h2>
          <p className="text-[#94A3B8] max-w-xl mx-auto">
            From the first beep of Sputnik in 1957 to rovers driving on Mars
            and telescopes revealing the first galaxies, humanity&apos;s reach
            into space grows every year. The best chapters are still being
            written.
          </p>
        </div>
      </section>
    </div>
  );
}
