"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Calendar,
  Moon,
  Star,
  Sun,
  Sparkles,
  Globe,
  Copy,
  Check,
  Info,
  Heart,
  Flame,
  Wind,
  Droplets,
  Mountain,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  WESTERN ZODIAC DATA                                                */
/* ------------------------------------------------------------------ */

interface ZodiacSign {
  name: string;
  symbol: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  element: "Fire" | "Earth" | "Air" | "Water";
  quality: "Cardinal" | "Fixed" | "Mutable";
  rulingPlanet: string;
  traits: string[];
  compatible: string[];
  color: string;
}

const zodiacSigns: ZodiacSign[] = [
  {
    name: "Aries",
    symbol: "\u2648",
    startMonth: 3, startDay: 21, endMonth: 4, endDay: 19,
    element: "Fire", quality: "Cardinal", rulingPlanet: "Mars",
    traits: ["Bold", "Ambitious", "Energetic", "Courageous"],
    compatible: ["Leo", "Sagittarius", "Gemini", "Aquarius"],
    color: "from-red-500 to-orange-500",
  },
  {
    name: "Taurus",
    symbol: "\u2649",
    startMonth: 4, startDay: 20, endMonth: 5, endDay: 20,
    element: "Earth", quality: "Fixed", rulingPlanet: "Venus",
    traits: ["Reliable", "Patient", "Devoted", "Sensual"],
    compatible: ["Virgo", "Capricorn", "Cancer", "Pisces"],
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Gemini",
    symbol: "\u264A",
    startMonth: 5, startDay: 21, endMonth: 6, endDay: 20,
    element: "Air", quality: "Mutable", rulingPlanet: "Mercury",
    traits: ["Curious", "Adaptable", "Witty", "Communicative"],
    compatible: ["Libra", "Aquarius", "Aries", "Leo"],
    color: "from-yellow-400 to-amber-500",
  },
  {
    name: "Cancer",
    symbol: "\u264B",
    startMonth: 6, startDay: 21, endMonth: 7, endDay: 22,
    element: "Water", quality: "Cardinal", rulingPlanet: "Moon",
    traits: ["Nurturing", "Intuitive", "Protective", "Emotional"],
    compatible: ["Scorpio", "Pisces", "Taurus", "Virgo"],
    color: "from-slate-400 to-blue-400",
  },
  {
    name: "Leo",
    symbol: "\u264C",
    startMonth: 7, startDay: 23, endMonth: 8, endDay: 22,
    element: "Fire", quality: "Fixed", rulingPlanet: "Sun",
    traits: ["Creative", "Generous", "Warm", "Charismatic"],
    compatible: ["Aries", "Sagittarius", "Gemini", "Libra"],
    color: "from-orange-500 to-yellow-500",
  },
  {
    name: "Virgo",
    symbol: "\u264D",
    startMonth: 8, startDay: 23, endMonth: 9, endDay: 22,
    element: "Earth", quality: "Mutable", rulingPlanet: "Mercury",
    traits: ["Analytical", "Practical", "Diligent", "Kind"],
    compatible: ["Taurus", "Capricorn", "Cancer", "Scorpio"],
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "Libra",
    symbol: "\u264E",
    startMonth: 9, startDay: 23, endMonth: 10, endDay: 22,
    element: "Air", quality: "Cardinal", rulingPlanet: "Venus",
    traits: ["Diplomatic", "Harmonious", "Fair", "Charming"],
    compatible: ["Gemini", "Aquarius", "Leo", "Sagittarius"],
    color: "from-pink-400 to-rose-500",
  },
  {
    name: "Scorpio",
    symbol: "\u264F",
    startMonth: 10, startDay: 23, endMonth: 11, endDay: 21,
    element: "Water", quality: "Fixed", rulingPlanet: "Pluto",
    traits: ["Passionate", "Resourceful", "Determined", "Magnetic"],
    compatible: ["Cancer", "Pisces", "Virgo", "Capricorn"],
    color: "from-red-600 to-purple-600",
  },
  {
    name: "Sagittarius",
    symbol: "\u2650",
    startMonth: 11, startDay: 22, endMonth: 12, endDay: 21,
    element: "Fire", quality: "Mutable", rulingPlanet: "Jupiter",
    traits: ["Adventurous", "Optimistic", "Philosophical", "Free-spirited"],
    compatible: ["Aries", "Leo", "Libra", "Aquarius"],
    color: "from-purple-500 to-indigo-500",
  },
  {
    name: "Capricorn",
    symbol: "\u2651",
    startMonth: 12, startDay: 22, endMonth: 1, endDay: 19,
    element: "Earth", quality: "Cardinal", rulingPlanet: "Saturn",
    traits: ["Disciplined", "Ambitious", "Practical", "Wise"],
    compatible: ["Taurus", "Virgo", "Scorpio", "Pisces"],
    color: "from-gray-500 to-slate-600",
  },
  {
    name: "Aquarius",
    symbol: "\u2652",
    startMonth: 1, startDay: 20, endMonth: 2, endDay: 18,
    element: "Air", quality: "Fixed", rulingPlanet: "Uranus",
    traits: ["Innovative", "Independent", "Humanitarian", "Eccentric"],
    compatible: ["Gemini", "Libra", "Aries", "Sagittarius"],
    color: "from-cyan-500 to-blue-500",
  },
  {
    name: "Pisces",
    symbol: "\u2653",
    startMonth: 2, startDay: 19, endMonth: 3, endDay: 20,
    element: "Water", quality: "Mutable", rulingPlanet: "Neptune",
    traits: ["Compassionate", "Artistic", "Intuitive", "Dreamy"],
    compatible: ["Cancer", "Scorpio", "Taurus", "Capricorn"],
    color: "from-blue-400 to-violet-500",
  },
];

/* ------------------------------------------------------------------ */
/*  CHINESE ZODIAC DATA                                                */
/* ------------------------------------------------------------------ */

interface ChineseAnimal {
  name: string;
  emoji: string;
  personality: string;
  element: string;
}

const chineseAnimals: ChineseAnimal[] = [
  { name: "Rat", emoji: "\uD83D\uDC00", personality: "Quick-witted, resourceful, and versatile. Rats are charming and humorous, with a knack for business.", element: "" },
  { name: "Ox", emoji: "\uD83D\uDC02", personality: "Diligent, dependable, and strong. Oxen are honest and patient, with a quiet determination.", element: "" },
  { name: "Tiger", emoji: "\uD83D\uDC05", personality: "Brave, competitive, and confident. Tigers are charming and have a magnetic personality.", element: "" },
  { name: "Rabbit", emoji: "\uD83D\uDC07", personality: "Gentle, elegant, and alert. Rabbits are kind and responsible, with refined taste.", element: "" },
  { name: "Dragon", emoji: "\uD83D\uDC09", personality: "Confident, intelligent, and enthusiastic. Dragons are natural leaders with big ambitions.", element: "" },
  { name: "Snake", emoji: "\uD83D\uDC0D", personality: "Wise, enigmatic, and intuitive. Snakes are graceful and thoughtful with a dry wit.", element: "" },
  { name: "Horse", emoji: "\uD83D\uDC0E", personality: "Energetic, warm-hearted, and impatient. Horses love freedom and traveling.", element: "" },
  { name: "Goat", emoji: "\uD83D\uDC10", personality: "Calm, gentle, and sympathetic. Goats are creative and have a strong sense of beauty.", element: "" },
  { name: "Monkey", emoji: "\uD83D\uDC12", personality: "Sharp, smart, and curious. Monkeys are playful problem-solvers with endless energy.", element: "" },
  { name: "Rooster", emoji: "\uD83D\uDC13", personality: "Observant, hardworking, and courageous. Roosters are confident and love being in the spotlight.", element: "" },
  { name: "Dog", emoji: "\uD83D\uDC15", personality: "Loyal, honest, and amiable. Dogs are faithful friends who value justice and fairness.", element: "" },
  { name: "Pig", emoji: "\uD83D\uDC16", personality: "Compassionate, generous, and diligent. Pigs enjoy life and are peace-loving.", element: "" },
];

const chineseElements = ["Wood", "Fire", "Earth", "Metal", "Water"];

function getChineseZodiac(year: number): { animal: ChineseAnimal; element: string } {
  const animalIndex = (year - 4) % 12;
  const elementIndex = Math.floor(((year - 4) % 10) / 2);
  const animal = { ...chineseAnimals[animalIndex >= 0 ? animalIndex : animalIndex + 12] };
  const element = chineseElements[elementIndex >= 0 ? elementIndex : elementIndex + 5];
  animal.element = element;
  return { animal, element };
}

/* ------------------------------------------------------------------ */
/*  MOON PHASE CALCULATION                                             */
/* ------------------------------------------------------------------ */

function getMoonPhase(date: Date): { phase: string; illumination: number; emoji: string } {
  // Synodic month ≈ 29.53059 days
  // Known new moon: January 6, 2000 18:14 UTC
  const knownNew = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
  const diff = date.getTime() - knownNew.getTime();
  const daysDiff = diff / (1000 * 60 * 60 * 24);
  const synodicMonth = 29.53059;
  const phase = ((daysDiff % synodicMonth) + synodicMonth) % synodicMonth;

  const fraction = phase / synodicMonth;
  let phaseName: string;
  let emoji: string;
  let illumination: number;

  if (fraction < 0.0625) {
    phaseName = "New Moon";
    emoji = "\uD83C\uDF11";
    illumination = Math.round(fraction / 0.0625 * 6);
  } else if (fraction < 0.1875) {
    phaseName = "Waxing Crescent";
    emoji = "\uD83C\uDF12";
    illumination = Math.round(12 + (fraction - 0.0625) / 0.125 * 25);
  } else if (fraction < 0.3125) {
    phaseName = "First Quarter";
    emoji = "\uD83C\uDF13";
    illumination = Math.round(37 + (fraction - 0.1875) / 0.125 * 13);
  } else if (fraction < 0.4375) {
    phaseName = "Waxing Gibbous";
    emoji = "\uD83C\uDF14";
    illumination = Math.round(62 + (fraction - 0.3125) / 0.125 * 25);
  } else if (fraction < 0.5625) {
    phaseName = "Full Moon";
    emoji = "\uD83C\uDF15";
    illumination = Math.round(94 + (fraction < 0.5 ? (fraction - 0.4375) / 0.0625 * 6 : (0.5625 - fraction) / 0.0625 * 6));
  } else if (fraction < 0.6875) {
    phaseName = "Waning Gibbous";
    emoji = "\uD83C\uDF16";
    illumination = Math.round(87 - (fraction - 0.5625) / 0.125 * 25);
  } else if (fraction < 0.8125) {
    phaseName = "Last Quarter";
    emoji = "\uD83C\uDF17";
    illumination = Math.round(50 - (fraction - 0.6875) / 0.125 * 13);
  } else if (fraction < 0.9375) {
    phaseName = "Waning Crescent";
    emoji = "\uD83C\uDF18";
    illumination = Math.round(37 - (fraction - 0.8125) / 0.125 * 31);
  } else {
    phaseName = "New Moon";
    emoji = "\uD83C\uDF11";
    illumination = Math.round((1 - fraction) / 0.0625 * 6);
  }

  illumination = Math.max(0, Math.min(100, illumination));
  return { phase: phaseName, illumination, emoji };
}

/* ------------------------------------------------------------------ */
/*  COSMIC CALCULATIONS                                                */
/* ------------------------------------------------------------------ */

function getCosmicFacts(birthDate: Date) {
  const now = new Date();
  const daysSince = (now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24);
  const yearsSince = daysSince / 365.25;

  // Full moons since birth
  const fullMoons = Math.floor(daysSince / 29.53059);

  // Solar eclipses (avg ~2.4 per year)
  const solarEclipses = Math.round(yearsSince * 2.4);

  // Distance Earth has traveled (Earth orbits at ~29.78 km/s, or ~940 million km/year)
  const kmTraveled = Math.round(yearsSince * 940_000_000);

  // Approximate closest planet on birthday (simplified seasonal approximation)
  const month = birthDate.getMonth();
  const closestPlanets = [
    "Venus", "Venus", "Venus", "Mars", "Mars", "Venus",
    "Venus", "Mars", "Venus", "Venus", "Venus", "Venus",
  ];
  const closestPlanet = closestPlanets[month];

  return { fullMoons, solarEclipses, kmTraveled, closestPlanet };
}

/* ------------------------------------------------------------------ */
/*  WESTERN ZODIAC LOOKUP                                              */
/* ------------------------------------------------------------------ */

function getWesternZodiac(month: number, day: number): ZodiacSign {
  for (const sign of zodiacSigns) {
    if (sign.startMonth === sign.endMonth) {
      if (month === sign.startMonth && day >= sign.startDay && day <= sign.endDay) return sign;
    } else if (sign.endMonth < sign.startMonth) {
      // Capricorn wraps around
      if (
        (month === sign.startMonth && day >= sign.startDay) ||
        (month === sign.endMonth && day <= sign.endDay)
      )
        return sign;
    } else {
      if (
        (month === sign.startMonth && day >= sign.startDay) ||
        (month === sign.endMonth && day <= sign.endDay)
      )
        return sign;
    }
  }
  return zodiacSigns[0]; // fallback
}

/* ------------------------------------------------------------------ */
/*  ELEMENT ICON                                                       */
/* ------------------------------------------------------------------ */

function ElementIcon({ element }: { element: string }) {
  switch (element) {
    case "Fire":
      return <Flame className="h-4 w-4 text-red-400" />;
    case "Earth":
      return <Mountain className="h-4 w-4 text-green-400" />;
    case "Air":
      return <Wind className="h-4 w-4 text-sky-400" />;
    case "Water":
      return <Droplets className="h-4 w-4 text-blue-400" />;
    default:
      return <Sparkles className="h-4 w-4 text-purple-400" />;
  }
}

const elementColors: Record<string, string> = {
  Fire: "text-red-400 bg-red-400/10",
  Earth: "text-green-400 bg-green-400/10",
  Air: "text-sky-400 bg-sky-400/10",
  Water: "text-blue-400 bg-blue-400/10",
};

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function ZodiacPage() {
  const [birthDateStr, setBirthDateStr] = useState("");
  const [copied, setCopied] = useState(false);

  const birthDate = useMemo(() => {
    if (!birthDateStr) return null;
    const d = new Date(birthDateStr + "T12:00:00");
    return isNaN(d.getTime()) ? null : d;
  }, [birthDateStr]);

  const results = useMemo(() => {
    if (!birthDate) return null;
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    const year = birthDate.getFullYear();

    const western = getWesternZodiac(month, day);
    const chinese = getChineseZodiac(year);
    const moonPhase = getMoonPhase(birthDate);
    const cosmic = getCosmicFacts(birthDate);

    return { western, chinese, moonPhase, cosmic, month, day, year };
  }, [birthDate]);

  const handleShare = useCallback(() => {
    if (!results) return;
    const text = `My Cosmic Birthday Profile:\nWestern Zodiac: ${results.western.symbol} ${results.western.name}\nChinese Zodiac: ${results.chinese.animal.emoji} ${results.chinese.element} ${results.chinese.animal.name}\nBirth Moon Phase: ${results.moonPhase.emoji} ${results.moonPhase.phase}\n\nDiscover yours at DateAndTimezone.com/zodiac`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [results]);

  const formatKm = (km: number) => {
    if (km >= 1e12) return `${(km / 1e12).toFixed(1)} trillion`;
    if (km >= 1e9) return `${(km / 1e9).toFixed(1)} billion`;
    if (km >= 1e6) return `${(km / 1e6).toFixed(1)} million`;
    return km.toLocaleString();
  };

  return (
    <section className="relative min-h-screen bg-dark-bg pt-10 sm:pt-12 pb-8">
      {/* bg effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-1/4 h-80 w-80 rounded-full bg-purple-600/5 blur-[120px]" />
        <div className="absolute bottom-20 left-1/4 h-72 w-72 rounded-full bg-secondary/5 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        {/* ── HERO ── */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-card-border bg-card-bg/60 px-4 py-1.5 text-sm text-muted backdrop-blur">
            <Sparkles className="h-4 w-4 text-purple-400" />
            Cosmic Birthday Calculator
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-slate-100 sm:text-5xl">
            Zodiac &{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-secondary bg-clip-text text-transparent">
              Cosmic Birthday
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            Enter your birthdate to discover your Western zodiac, Chinese zodiac,
            birth moon phase, and cosmic birthday facts.
          </p>
        </div>

        {/* ── DATE INPUT ── */}
        <div className="mx-auto mb-12 max-w-sm">
          <label className="mb-2 block text-center text-sm font-medium text-slate-300">
            Your Birthdate
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              type="date"
              value={birthDateStr}
              onChange={(e) => setBirthDateStr(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              min="1900-01-01"
              className="w-full rounded-xl border border-card-border bg-card-bg py-3 pl-10 pr-4 text-center text-lg text-slate-200 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {results && (
          <div className="space-y-8 animate-in fade-in">
            {/* ── WESTERN ZODIAC ── */}
            <div className="rounded-2xl border border-card-border bg-card-bg/80 p-6 backdrop-blur">
              <div className="mb-4 flex items-center gap-3">
                <Sun className="h-5 w-5 text-yellow-400" />
                <h2 className="font-heading text-xl font-bold text-slate-100">
                  Western Zodiac
                </h2>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* sign card */}
                <div className="flex flex-col items-center rounded-xl border border-card-border bg-dark-bg/50 p-5">
                  <div
                    className={`mb-3 bg-gradient-to-br ${results.western.color} bg-clip-text text-7xl text-transparent`}
                  >
                    {results.western.symbol}
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-slate-100">
                    {results.western.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {new Date(2024, results.western.startMonth - 1, results.western.startDay).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    {" - "}
                    {new Date(2024, results.western.endMonth - 1, results.western.endDay).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>

                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${elementColors[results.western.element]}`}>
                      <ElementIcon element={results.western.element} />
                      {results.western.element}
                    </span>
                    <span className="rounded-full bg-purple-400/10 px-2.5 py-0.5 text-xs font-medium text-purple-400">
                      {results.western.quality}
                    </span>
                  </div>
                </div>

                {/* details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-1.5 text-sm font-semibold uppercase tracking-wider text-muted">
                      Ruling Planet
                    </h4>
                    <p className="text-lg text-slate-200">
                      {results.western.rulingPlanet}
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-1.5 text-sm font-semibold uppercase tracking-wider text-muted">
                      Personality Traits
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {results.western.traits.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-card-border bg-dark-bg/50 px-3 py-1 text-sm text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-muted">
                      <Heart className="h-3.5 w-3.5 text-pink-400" />
                      Compatible Signs
                    </h4>

            <AdBanner />
                    <div className="flex flex-wrap gap-2">
                      {results.western.compatible.map((c) => (
                        <span
                          key={c}
                          className="rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-1 text-sm text-pink-300"
                        >
                          {zodiacSigns.find((z) => z.name === c)?.symbol}{" "}
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── CHINESE ZODIAC ── */}
            <div className="rounded-2xl border border-card-border bg-card-bg/80 p-6 backdrop-blur">
              <div className="mb-4 flex items-center gap-3">
                <Star className="h-5 w-5 text-red-400" />
                <h2 className="font-heading text-xl font-bold text-slate-100">
                  Chinese Zodiac
                </h2>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col items-center rounded-xl border border-card-border bg-dark-bg/50 p-5">
                  <div className="mb-2 text-6xl">
                    {results.chinese.animal.emoji}
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-slate-100">
                    {results.chinese.element} {results.chinese.animal.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    Year of the {results.chinese.animal.name} ({results.year})
                  </p>
                  <span className="mt-2 rounded-full bg-red-500/10 px-3 py-0.5 text-xs font-medium text-red-400">
                    {results.chinese.element} Element
                  </span>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted">
                    Personality
                  </h4>
                  <p className="leading-relaxed text-slate-300">
                    {results.chinese.animal.personality}
                  </p>
                </div>
              </div>
            </div>

            {/* ── BIRTH MOON PHASE ── */}
            <div className="rounded-2xl border border-card-border bg-card-bg/80 p-6 backdrop-blur">
              <div className="mb-4 flex items-center gap-3">
                <Moon className="h-5 w-5 text-yellow-300" />
                <h2 className="font-heading text-xl font-bold text-slate-100">
                  Birth Moon Phase
                </h2>
              </div>

              <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-8">
                <div className="mb-4 flex flex-col items-center sm:mb-0">
                  <div className="text-7xl">{results.moonPhase.emoji}</div>
                  <h3 className="mt-2 font-heading text-xl font-bold text-slate-100">
                    {results.moonPhase.phase}
                  </h3>
                </div>
                <div className="flex-1">
                  <div className="mb-3">
                    <span className="text-sm text-muted">
                      Approximate illumination
                    </span>
                    <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-dark-bg">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-200 transition-all"
                        style={{
                          width: `${results.moonPhase.illumination}%`,
                        }}
                      />
                    </div>
                    <span className="mt-1 block text-right text-sm text-slate-300">
                      {results.moonPhase.illumination}%
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted">
                    On{" "}
                    {birthDate!.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                    , the Moon was in its{" "}
                    <span className="text-slate-200">
                      {results.moonPhase.phase.toLowerCase()}
                    </span>{" "}
                    phase. This is calculated using the synodic month (29.53 days)
                    from a known new moon reference.
                  </p>
                </div>
              </div>
            </div>

            {/* ── COSMIC BIRTHDAY FACTS ── */}
            <div className="rounded-2xl border border-card-border bg-card-bg/80 p-6 backdrop-blur">
              <div className="mb-4 flex items-center gap-3">
                <Globe className="h-5 w-5 text-secondary" />
                <h2 className="font-heading text-xl font-bold text-slate-100">
                  Cosmic Birthday Facts
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-card-border bg-dark-bg/50 p-4 text-center">
                  <p className="font-heading text-3xl font-bold text-secondary">
                    {results.cosmic.fullMoons.toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Full moons since your birth
                  </p>
                </div>
                <div className="rounded-xl border border-card-border bg-dark-bg/50 p-4 text-center">
                  <p className="font-heading text-3xl font-bold text-yellow-400">
                    ~{results.cosmic.solarEclipses}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Solar eclipses in your lifetime
                  </p>
                </div>
                <div className="rounded-xl border border-card-border bg-dark-bg/50 p-4 text-center">
                  <p className="font-heading text-3xl font-bold text-primary">
                    {results.cosmic.closestPlanet}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Closest planet on your birthday (approx.)
                  </p>
                </div>
                <div className="rounded-xl border border-card-border bg-dark-bg/50 p-4 text-center">
                  <p className="font-heading text-3xl font-bold text-emerald-400">
                    {formatKm(results.cosmic.kmTraveled)} km
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Distance Earth traveled since your birth
                  </p>
                </div>
              </div>
            </div>

            {/* ── SHARE ── */}
            <div className="flex justify-center">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-purple-500/20 transition hover:shadow-purple-500/40"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied to clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Share your cosmic profile
                  </>
                )}
              </button>
            </div>

            {/* ── DISCLAIMER ── */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex gap-3">
                <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />
                <p className="text-sm leading-relaxed text-amber-200/80">
                  This is for entertainment purposes. DateAndTimezone is a science
                  and astronomy site — zodiac calculations are included as a fun
                  cultural reference. Moon phase calculations use the synodic
                  month approximation. Cosmic facts are estimates based on
                  averages.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* placeholder when no date selected */}
        {!results && (
          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-card-border bg-card-bg/60 p-10 text-center backdrop-blur">
            <Sparkles className="mx-auto mb-4 h-12 w-12 text-purple-400/50" />
            <h3 className="font-heading text-lg font-semibold text-slate-300">
              Enter your birthdate above
            </h3>
            <p className="mt-2 text-sm text-muted">
              Discover your Western zodiac sign, Chinese zodiac animal, birth
              moon phase, and cosmic birthday stats.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
