"use client";

import { useState, useMemo } from "react";
import {
  Star,
  Eye,
  Sparkles,
  Search,
  MapPin,
  Compass,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  Leaf,
  Snowflake,
  Flower2,
  CloudSun,
  Info,
  Target,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

type Season = "winter" | "spring" | "summer" | "fall";
type Difficulty = "Easy" | "Medium" | "Hard";

interface Constellation {
  name: string;
  commonName: string;
  brightestStar: string;
  notableObjects: string;
  mythology: string;
  bestMonth: string;
  difficulty: Difficulty;
}

interface ZodiacConstellation {
  name: string;
  symbol: string;
  dates: string;
  brightestStar: string;
  info: string;
}

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const seasonalConstellations: Record<Season, Constellation[]> = {
  winter: [
    {
      name: "Orion",
      commonName: "The Hunter",
      brightestStar: "Rigel (mag 0.12)",
      notableObjects: "Orion Nebula (M42), Horsehead Nebula",
      mythology:
        "Greek hunter placed in the sky by Zeus. The three belt stars are one of the most recognizable patterns in the night sky.",
      bestMonth: "January",
      difficulty: "Easy",
    },
    {
      name: "Taurus",
      commonName: "The Bull",
      brightestStar: "Aldebaran (mag 0.85)",
      notableObjects: "Pleiades (M45), Hyades cluster, Crab Nebula (M1)",
      mythology:
        "Zeus transformed into a white bull to carry Europa across the sea. The Pleiades star cluster sits on the bull's shoulder.",
      bestMonth: "January",
      difficulty: "Easy",
    },
    {
      name: "Gemini",
      commonName: "The Twins",
      brightestStar: "Pollux (mag 1.14)",
      notableObjects: "Eskimo Nebula (NGC 2392), M35 open cluster",
      mythology:
        "Castor and Pollux, twin brothers from Greek myth. Pollux was immortal; he asked Zeus to share immortality with Castor.",
      bestMonth: "February",
      difficulty: "Easy",
    },
    {
      name: "Canis Major",
      commonName: "The Great Dog",
      brightestStar: "Sirius (mag -1.46) - brightest star in the sky",
      notableObjects: "M41 open cluster, Thor's Helmet Nebula",
      mythology:
        "One of Orion's hunting dogs. Sirius, the Dog Star, is the brightest star visible from Earth at just 8.6 light-years away.",
      bestMonth: "February",
      difficulty: "Easy",
    },
    {
      name: "Canis Minor",
      commonName: "The Little Dog",
      brightestStar: "Procyon (mag 0.34)",
      notableObjects: "No major deep-sky objects",
      mythology:
        "Orion's smaller hunting dog. Procyon means 'before the dog' in Greek, as it rises just before Sirius.",
      bestMonth: "February",
      difficulty: "Medium",
    },
    {
      name: "Auriga",
      commonName: "The Charioteer",
      brightestStar: "Capella (mag 0.08)",
      notableObjects: "M36, M37, M38 open clusters",
      mythology:
        "Often depicted as a charioteer holding a goat. Capella means 'little goat' in Latin and is the 6th brightest star.",
      bestMonth: "January",
      difficulty: "Medium",
    },
    {
      name: "Monoceros",
      commonName: "The Unicorn",
      brightestStar: "Beta Monocerotis (mag 3.76)",
      notableObjects: "Rosette Nebula, Christmas Tree Cluster (NGC 2264)",
      mythology:
        "A modern constellation added in the 17th century. Located between Orion and Canis Major in the winter Milky Way.",
      bestMonth: "February",
      difficulty: "Hard",
    },
    {
      name: "Leo",
      commonName: "The Lion (early riser)",
      brightestStar: "Regulus (mag 1.35)",
      notableObjects: "Leo Triplet galaxies (M65, M66, NGC 3628)",
      mythology:
        "The Nemean Lion slain by Heracles. Late winter sees Leo rising in the east, heralding the coming of spring.",
      bestMonth: "February",
      difficulty: "Easy",
    },
  ],
  spring: [
    {
      name: "Leo",
      commonName: "The Lion",
      brightestStar: "Regulus (mag 1.35)",
      notableObjects: "Leo Triplet galaxies, M95, M96",
      mythology:
        "The Nemean Lion with impenetrable hide, slain by Heracles as his first labor. Its sickle shape is easy to spot.",
      bestMonth: "April",
      difficulty: "Easy",
    },
    {
      name: "Virgo",
      commonName: "The Maiden",
      brightestStar: "Spica (mag 0.97)",
      notableObjects: "Virgo Galaxy Cluster (1,000+ galaxies), M87",
      mythology:
        "Associated with Demeter, goddess of harvest. The Virgo Cluster behind it contains over 1,000 galaxies.",
      bestMonth: "May",
      difficulty: "Medium",
    },
    {
      name: "Bootes",
      commonName: "The Herdsman",
      brightestStar: "Arcturus (mag -0.05)",
      notableObjects: "Bootes Void (vast empty region of space)",
      mythology:
        "The plowman who drives the bears (Ursa Major/Minor) around the pole. Arcturus is the 4th brightest star in the sky.",
      bestMonth: "May",
      difficulty: "Medium",
    },
    {
      name: "Ursa Major",
      commonName: "The Great Bear / Big Dipper",
      brightestStar: "Alioth (mag 1.77)",
      notableObjects: "M81 & M82 galaxies, Owl Nebula (M97), Pinwheel Galaxy (M101)",
      mythology:
        "Callisto, transformed into a bear by Hera. The Big Dipper asterism forms the bear's hindquarters and tail.",
      bestMonth: "April",
      difficulty: "Easy",
    },
    {
      name: "Corona Borealis",
      commonName: "The Northern Crown",
      brightestStar: "Alphecca (mag 2.23)",
      notableObjects: "T Coronae Borealis (recurrent nova, 'Blaze Star')",
      mythology:
        "The crown given by Dionysus to Ariadne. This small semicircle of stars is one of the sky's most elegant patterns.",
      bestMonth: "May",
      difficulty: "Medium",
    },
    {
      name: "Hydra",
      commonName: "The Water Serpent",
      brightestStar: "Alphard (mag 1.98)",
      notableObjects: "Ghost of Jupiter Nebula, M83 (Southern Pinwheel Galaxy)",
      mythology:
        "The many-headed serpent slain by Heracles. It is the largest of all 88 constellations, stretching over 100 degrees.",
      bestMonth: "April",
      difficulty: "Hard",
    },
    {
      name: "Canes Venatici",
      commonName: "The Hunting Dogs",
      brightestStar: "Cor Caroli (mag 2.81)",
      notableObjects: "Whirlpool Galaxy (M51), Sunflower Galaxy (M63)",
      mythology:
        "The two dogs held by Bootes. Home to the stunning Whirlpool Galaxy, one of the finest spiral galaxies to observe.",
      bestMonth: "May",
      difficulty: "Hard",
    },
    {
      name: "Coma Berenices",
      commonName: "Berenice's Hair",
      brightestStar: "Beta Comae (mag 4.26)",
      notableObjects: "Coma Cluster of galaxies, Black Eye Galaxy (M64)",
      mythology:
        "Queen Berenice's hair, offered to the gods. Contains the north galactic pole and thousands of distant galaxies.",
      bestMonth: "May",
      difficulty: "Hard",
    },
  ],
  summer: [
    {
      name: "Scorpius",
      commonName: "The Scorpion",
      brightestStar: "Antares (mag 1.06) - red supergiant",
      notableObjects: "Butterfly Cluster (M6), Ptolemy Cluster (M7), Cat's Paw Nebula",
      mythology:
        "The scorpion sent by Gaia to slay Orion. They are placed on opposite sides of the sky so they are never visible together.",
      bestMonth: "July",
      difficulty: "Easy",
    },
    {
      name: "Sagittarius",
      commonName: "The Archer / Teapot",
      brightestStar: "Kaus Australis (mag 1.85)",
      notableObjects: "Lagoon Nebula (M8), Trifid Nebula (M20), Galactic Center",
      mythology:
        "A centaur archer aiming at Scorpius. The center of the Milky Way lies in this direction, making it rich in nebulae.",
      bestMonth: "August",
      difficulty: "Medium",
    },
    {
      name: "Lyra",
      commonName: "The Harp",
      brightestStar: "Vega (mag 0.03) - 5th brightest star",
      notableObjects: "Ring Nebula (M57), Double Double star (Epsilon Lyrae)",
      mythology:
        "The lyre of Orpheus, whose music could charm all living things. Vega is part of the famous Summer Triangle.",
      bestMonth: "August",
      difficulty: "Easy",
    },
    {
      name: "Cygnus",
      commonName: "The Swan / Northern Cross",
      brightestStar: "Deneb (mag 1.25)",
      notableObjects: "North America Nebula (NGC 7000), Veil Nebula, Cygnus X-1 (black hole)",
      mythology:
        "Zeus disguised as a swan. Deneb marks the tail. The constellation lies along the Milky Way and is rich in deep-sky objects.",
      bestMonth: "August",
      difficulty: "Easy",
    },
    {
      name: "Aquila",
      commonName: "The Eagle",
      brightestStar: "Altair (mag 0.76)",
      notableObjects: "Dark Rift of the Milky Way",
      mythology:
        "The eagle that carried Zeus's thunderbolts. Altair completes the Summer Triangle with Vega and Deneb.",
      bestMonth: "August",
      difficulty: "Easy",
    },
    {
      name: "Summer Triangle",
      commonName: "Asterism (Vega, Deneb, Altair)",
      brightestStar: "Vega (mag 0.03) - brightest of the three",
      notableObjects: "Spans Lyra, Cygnus, and Aquila; Milky Way runs through it",
      mythology:
        "Not a constellation but a famous asterism. These three brilliant stars dominate the summer sky overhead.",
      bestMonth: "July",
      difficulty: "Easy",
    },
    {
      name: "Hercules",
      commonName: "The Strongman",
      brightestStar: "Kornephoros (mag 2.77)",
      notableObjects: "Great Globular Cluster (M13), M92 globular cluster",
      mythology:
        "The greatest of Greek heroes. M13, the Hercules Cluster, contains over 300,000 stars packed in a ball 145 light-years wide.",
      bestMonth: "July",
      difficulty: "Medium",
    },
    {
      name: "Ophiuchus",
      commonName: "The Serpent Bearer",
      brightestStar: "Rasalhague (mag 2.07)",
      notableObjects: "Barnard's Star (2nd closest star system), multiple globular clusters",
      mythology:
        "Asclepius, the healer. Though the Sun passes through it, it is not traditionally a zodiac sign.",
      bestMonth: "July",
      difficulty: "Hard",
    },
  ],
  fall: [
    {
      name: "Pegasus",
      commonName: "The Winged Horse / Great Square",
      brightestStar: "Enif (mag 2.39)",
      notableObjects: "M15 globular cluster, Stephan's Quintet galaxy group",
      mythology:
        "Born from the blood of Medusa when Perseus slew her. The Great Square asterism is the key fall signpost.",
      bestMonth: "October",
      difficulty: "Easy",
    },
    {
      name: "Andromeda",
      commonName: "The Chained Princess",
      brightestStar: "Alpheratz (mag 2.06)",
      notableObjects: "Andromeda Galaxy (M31) - nearest major galaxy, 2.5M light-years away",
      mythology:
        "Princess chained as sacrifice to a sea monster, rescued by Perseus. M31 is the farthest object visible to the naked eye.",
      bestMonth: "November",
      difficulty: "Easy",
    },
    {
      name: "Cassiopeia",
      commonName: "The Queen / The W",
      brightestStar: "Schedar (mag 2.24)",
      notableObjects: "Pacman Nebula (NGC 281), Heart & Soul Nebulae",
      mythology:
        "The vain queen who boasted her beauty rivaled the sea nymphs. Her W shape is circumpolar and visible year-round in the north.",
      bestMonth: "November",
      difficulty: "Easy",
    },
    {
      name: "Perseus",
      commonName: "The Hero",
      brightestStar: "Mirfak (mag 1.79)",
      notableObjects: "Double Cluster (NGC 869/884), Algol (eclipsing binary 'Demon Star')",
      mythology:
        "Slayer of Medusa and rescuer of Andromeda. Algol, the 'Demon Star,' visibly dims every 2.87 days as its companion eclipses it.",
      bestMonth: "November",
      difficulty: "Medium",
    },
    {
      name: "Pisces",
      commonName: "The Fish",
      brightestStar: "Eta Piscium (mag 3.62)",
      notableObjects: "M74 (grand-design spiral galaxy)",
      mythology:
        "Aphrodite and Eros transformed into fish and tied together to escape the monster Typhon.",
      bestMonth: "October",
      difficulty: "Hard",
    },
    {
      name: "Aries",
      commonName: "The Ram",
      brightestStar: "Hamal (mag 2.00)",
      notableObjects: "No major deep-sky objects; sparse field",
      mythology:
        "The golden-fleeced ram that rescued Phrixus and Helle. Once held the vernal equinox point 2,000 years ago.",
      bestMonth: "November",
      difficulty: "Medium",
    },
    {
      name: "Cetus",
      commonName: "The Sea Monster",
      brightestStar: "Diphda (mag 2.02)",
      notableObjects: "Mira (famous variable star), M77 Seyfert galaxy",
      mythology:
        "The sea monster sent to devour Andromeda. Mira, in its body, was the first variable star discovered, pulsing over 332 days.",
      bestMonth: "October",
      difficulty: "Hard",
    },
    {
      name: "Aquarius",
      commonName: "The Water Bearer",
      brightestStar: "Sadalsuud (mag 2.87)",
      notableObjects: "Helix Nebula (NGC 7293), Saturn Nebula (NGC 7009)",
      mythology:
        "Ganymede, cupbearer to the gods. The Helix Nebula is the closest planetary nebula to Earth at 655 light-years.",
      bestMonth: "October",
      difficulty: "Hard",
    },
  ],
};

const zodiacConstellations: ZodiacConstellation[] = [
  { name: "Aries", symbol: "\u2648", dates: "Mar 21 - Apr 19", brightestStar: "Hamal", info: "Small but historically important; once held the vernal equinox point." },
  { name: "Taurus", symbol: "\u2649", dates: "Apr 20 - May 20", brightestStar: "Aldebaran", info: "Home to the Pleiades and Hyades, two of the finest naked-eye star clusters." },
  { name: "Gemini", symbol: "\u264A", dates: "May 21 - Jun 20", brightestStar: "Pollux", info: "The twin stars Castor and Pollux are easy to find near Orion." },
  { name: "Cancer", symbol: "\u264B", dates: "Jun 21 - Jul 22", brightestStar: "Tarf", info: "Faint but contains the Beehive Cluster (M44), visible to the naked eye." },
  { name: "Leo", symbol: "\u264C", dates: "Jul 23 - Aug 22", brightestStar: "Regulus", info: "Its sickle asterism looks like a backwards question mark in the sky." },
  { name: "Virgo", symbol: "\u264D", dates: "Aug 23 - Sep 22", brightestStar: "Spica", info: "Second-largest constellation; gateway to the Virgo Galaxy Cluster." },
  { name: "Libra", symbol: "\u264E", dates: "Sep 23 - Oct 22", brightestStar: "Zubeneschamali", info: "The only zodiac constellation representing an inanimate object (scales)." },
  { name: "Scorpio", symbol: "\u264F", dates: "Oct 23 - Nov 21", brightestStar: "Antares", info: "Red supergiant Antares rivals Mars in color; its name means 'rival of Ares.'" },
  { name: "Sagittarius", symbol: "\u2650", dates: "Nov 22 - Dec 21", brightestStar: "Kaus Australis", info: "Points toward the Milky Way's center; richest area for nebulae and clusters." },
  { name: "Capricorn", symbol: "\u2651", dates: "Dec 22 - Jan 19", brightestStar: "Deneb Algedi", info: "One of the oldest recognized constellations, dating to Babylonian times." },
  { name: "Aquarius", symbol: "\u2652", dates: "Jan 20 - Feb 18", brightestStar: "Sadalsuud", info: "Contains the Helix Nebula, the closest planetary nebula to Earth." },
  { name: "Pisces", symbol: "\u2653", dates: "Feb 19 - Mar 20", brightestStar: "Eta Piscium", info: "Currently holds the vernal equinox point, where the Sun crosses the equator." },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function getCurrentSeason(): Season {
  const month = new Date().getMonth(); // 0-11
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "fall";
  return "winter";
}

const seasonMeta: Record<Season, { label: string; icon: typeof Sun; color: string }> = {
  winter: { label: "Winter", icon: Snowflake, color: "text-blue-400" },
  spring: { label: "Spring", icon: Flower2, color: "text-green-400" },
  summer: { label: "Summer", icon: Sun, color: "text-yellow-400" },
  fall: { label: "Fall", icon: Leaf, color: "text-orange-400" },
};

const difficultyColor: Record<Difficulty, string> = {
  Easy: "bg-green-500/20 text-green-400 border-green-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Hard: "bg-red-500/20 text-red-400 border-red-500/30",
};

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function ConstellationsPage() {
  const [season, setSeason] = useState<Season>(getCurrentSeason);
  const [expandedZodiac, setExpandedZodiac] = useState(false);
  const [expandedTips, setExpandedTips] = useState(false);

  const constellations = useMemo(() => seasonalConstellations[season], [season]);
  const meta = seasonMeta[season];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ---- Header ---- */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
          <Star className="w-4 h-4" />
          Constellation Guide
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-slate-100 mb-4">
          What&apos;s in the Sky Tonight
        </h1>
        <p className="text-muted max-w-2xl mx-auto text-lg">
          Explore the constellations visible each season. From Orion&apos;s belt in winter to the Summer Triangle overhead, discover mythology, bright stars, and deep-sky treasures.
        </p>
      </div>

      {/* ---- Season Selector ---- */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {(Object.keys(seasonMeta) as Season[]).map((s) => {
          const m = seasonMeta[s];
          const Icon = m.icon;
          const active = s === season;
          return (
            <button
              key={s}
              onClick={() => setSeason(s)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                active
                  ? "bg-primary/20 border-primary text-white shadow-lg shadow-primary/10"
                  : "bg-card-bg border-card-border text-muted hover:border-muted-dark hover:text-slate-200"
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? m.color : ""}`} />
              {m.label}
              {s === getCurrentSeason() && (
                <span className="ml-1 text-[10px] uppercase tracking-wider bg-secondary/20 text-secondary px-1.5 py-0.5 rounded-full">
                  Now
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ---- Season Label ---- */}
      <div className="flex items-center gap-3 mb-8">
        {(() => {
          const Icon = meta.icon;
          return <Icon className={`w-6 h-6 ${meta.color}`} />;
        })()}
        <h2 className="font-heading text-2xl font-bold text-slate-100">
          {meta.label} Constellations
        </h2>
        <span className="text-sm text-muted">({constellations.length} constellations)</span>
      </div>

      {/* ---- Constellation Cards ---- */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-20">
        {constellations.map((c) => (
          <div
            key={c.name + season}
            className="bg-card-bg border border-card-border rounded-2xl p-5 hover:border-primary/40 transition-all duration-300 flex flex-col"
          >
            {/* Top row */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-100">{c.name}</h3>
                <p className="text-sm text-secondary">{c.commonName}</p>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold ${difficultyColor[c.difficulty]}`}>
                {c.difficulty}
              </span>
            </div>

            {/* Star */}
            <div className="flex items-center gap-2 text-sm text-muted mb-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <span className="truncate">{c.brightestStar}</span>
            </div>

            {/* Objects */}
            <div className="flex items-start gap-2 text-sm text-muted mb-3">
              <Eye className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
              <span>{c.notableObjects}</span>
            </div>

            {/* Mythology */}
            <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-1">{c.mythology}</p>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-muted pt-3 border-t border-card-border">
              <span className="flex items-center gap-1">
                <Moon className="w-3 h-3" /> Best: {c.bestMonth}
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3" /> {c.difficulty}
              </span>
            </div>
          </div>
        ))}
      </div>

      <AdBanner />

      {/* ---- Zodiac Constellations ---- */}
      <div className="mb-20">
        <button
          onClick={() => setExpandedZodiac(!expandedZodiac)}
          className="w-full flex items-center justify-between bg-card-bg border border-card-border rounded-2xl p-6 hover:border-primary/40 transition-all"
        >
          <div className="flex items-center gap-3">
            <Sun className="w-6 h-6 text-primary" />
            <div className="text-left">
              <h2 className="font-heading text-2xl font-bold text-slate-100">Zodiac Constellations</h2>
              <p className="text-sm text-muted mt-1">The 12 constellations along the ecliptic — the Sun&apos;s apparent path through the sky</p>
            </div>
          </div>
          {expandedZodiac ? <ChevronUp className="w-5 h-5 text-muted" /> : <ChevronDown className="w-5 h-5 text-muted" />}
        </button>

        {expandedZodiac && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
            {zodiacConstellations.map((z) => (
              <div
                key={z.name}
                className="bg-card-bg border border-card-border rounded-xl p-4 hover:border-secondary/40 transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{z.symbol}</span>
                  <div>
                    <h3 className="font-heading font-bold text-slate-100">{z.name}</h3>
                    <p className="text-xs text-secondary">{z.dates}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted mb-2">
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                  {z.brightestStar}
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{z.info}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---- How to Find Them ---- */}
      <div>
        <button
          onClick={() => setExpandedTips(!expandedTips)}
          className="w-full flex items-center justify-between bg-card-bg border border-card-border rounded-2xl p-6 hover:border-primary/40 transition-all"
        >
          <div className="flex items-center gap-3">
            <Compass className="w-6 h-6 text-secondary" />
            <div className="text-left">
              <h2 className="font-heading text-2xl font-bold text-slate-100">How to Find Them</h2>
              <p className="text-sm text-muted mt-1">Practical tips for navigating the night sky</p>
            </div>
          </div>
          {expandedTips ? <ChevronUp className="w-5 h-5 text-muted" /> : <ChevronDown className="w-5 h-5 text-muted" />}
        </button>

        {expandedTips && (
          <div className="grid gap-6 sm:grid-cols-2 mt-6">
            {[
              {
                icon: MapPin,
                title: "Start with Polaris (the North Star)",
                text: "Find the Big Dipper and extend a line through its two 'pointer stars' (Dubhe and Merak) about five times the distance between them. That leads you to Polaris, which marks true north and the end of the Little Dipper's handle.",
              },
              {
                icon: Search,
                title: "Use the Big Dipper as Your Anchor",
                text: "The Big Dipper is visible year-round in most of the Northern Hemisphere. Follow its handle's arc to 'arc to Arcturus' (Bootes) and then 'spike to Spica' (Virgo). The pointer stars lead to Polaris.",
              },
              {
                icon: Star,
                title: "Star-Hopping Technique",
                text: "Start from a bright star you know and hop to nearby patterns. From Orion's belt, follow the line down-left to Sirius (brightest star), or up-right to Aldebaran (Taurus). Each known star becomes a stepping stone to the next.",
              },
              {
                icon: Eye,
                title: "Give Your Eyes 20 Minutes",
                text: "Full dark adaptation takes about 20 minutes. Avoid looking at your phone (use a red-light app if you must). Once adapted, you'll see many more stars and can spot fainter constellations like Cancer and Pisces.",
              },
              {
                icon: CloudSun,
                title: "Check Conditions First",
                text: "Clear skies, low humidity, and minimal light pollution make a huge difference. New Moon nights are best. Even a short drive away from city lights can reveal hundreds more stars.",
              },
              {
                icon: Info,
                title: "Use a Planetarium App",
                text: "Apps like Stellarium, Sky Map, or Star Walk let you point your phone at the sky to identify stars and constellations in real-time. They can also show you what's rising and setting throughout the night.",
              },
            ].map((tip) => {
              const Icon = tip.icon;
              return (
                <div
                  key={tip.title}
                  className="bg-card-bg border border-card-border rounded-xl p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                    <h3 className="font-heading font-bold text-slate-100">{tip.title}</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{tip.text}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
