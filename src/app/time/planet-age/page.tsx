"use client";

import { useState, useMemo } from "react";
import {
  Calendar,
  Scale,
  Sunrise,
  Rocket,
  PartyPopper,
  Info,
  Globe,
  CircleDot,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

interface PlanetData {
  name: string;
  color: string;
  orbitalPeriodDays: number;
  gravity: number; // relative to Earth = 1
  dayLengthEarthDays: number; // length of one solar day on the planet in Earth days
  funFact: string;
  emoji: string;
  ringSize: number; // visual diameter for the planet circle (px)
}

const planets: PlanetData[] = [
  {
    name: "Mercury",
    color: "#8C8C8C",
    orbitalPeriodDays: 87.97,
    gravity: 0.38,
    dayLengthEarthDays: 175.94,
    funFact: "A year is shorter than a day on Mercury!",
    emoji: "\u263F",
    ringSize: 28,
  },
  {
    name: "Venus",
    color: "#E8CDA0",
    orbitalPeriodDays: 224.7,
    gravity: 0.91,
    dayLengthEarthDays: 116.75,
    funFact: "Venus rotates backwards - the Sun rises in the west!",
    emoji: "\u2640",
    ringSize: 40,
  },
  {
    name: "Earth",
    color: "#4F94CD",
    orbitalPeriodDays: 365.25,
    gravity: 1.0,
    dayLengthEarthDays: 1.0,
    funFact: "Home sweet home - our reference point.",
    emoji: "\u2641",
    ringSize: 42,
  },
  {
    name: "Mars",
    color: "#C1440E",
    orbitalPeriodDays: 687,
    gravity: 0.38,
    dayLengthEarthDays: 1.03,
    funFact: "A Mars day (sol) is just 37 minutes longer than Earth's!",
    emoji: "\u2642",
    ringSize: 34,
  },
  {
    name: "Jupiter",
    color: "#C88B3A",
    orbitalPeriodDays: 4333,
    gravity: 2.34,
    dayLengthEarthDays: 0.414,
    funFact: "Jupiter spins so fast its day is under 10 hours!",
    emoji: "\u2643",
    ringSize: 64,
  },
  {
    name: "Saturn",
    color: "#E2BF7D",
    orbitalPeriodDays: 10759,
    gravity: 1.06,
    dayLengthEarthDays: 0.444,
    funFact: "Saturn could float in a bathtub - it's less dense than water!",
    emoji: "\u2644",
    ringSize: 58,
  },
  {
    name: "Uranus",
    color: "#73C2D0",
    orbitalPeriodDays: 30687,
    gravity: 0.92,
    dayLengthEarthDays: 0.718,
    funFact: "Uranus rolls on its side with a 98-degree axial tilt!",
    emoji: "\u2645",
    ringSize: 50,
  },
  {
    name: "Neptune",
    color: "#3F54BA",
    orbitalPeriodDays: 60190,
    gravity: 1.19,
    dayLengthEarthDays: 0.671,
    funFact: "Winds on Neptune reach 2,100 km/h - the fastest in the Solar System!",
    emoji: "\u2646",
    ringSize: 48,
  },
  {
    name: "Pluto",
    color: "#9B8E82",
    orbitalPeriodDays: 90560,
    gravity: 0.06,
    dayLengthEarthDays: 6.39,
    funFact: "A Pluto year is 248 Earth years. Nobody born on Earth has lived a full Pluto year!",
    emoji: "\u2647",
    ringSize: 22,
  },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function getAgeFunComment(name: string, years: number): string {
  if (name === "Earth") return "";
  if (years > 1000) return "An ancient beyond measure!";
  if (years > 100) return "An elder of the cosmos!";
  if (years > 50) return "A wise old soul!";
  if (years > 20) return "A full-grown adult!";
  if (years > 10) return "A young adult!";
  if (years > 5) return "Still in school!";
  if (years > 1) return "You'd be a toddler!";
  if (years > 0.5) return "Just a baby!";
  return "Not even born yet!";
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function PlanetAgePage() {
  const [birthdate, setBirthdate] = useState<string>("");
  const [weight, setWeight] = useState<string>("");

  const results = useMemo(() => {
    if (!birthdate) return null;

    const birth = new Date(birthdate + "T00:00:00");
    const now = new Date();
    if (birth >= now) return null;

    const totalEarthDays = (now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24);

    return planets.map((p) => {
      const planetYears = totalEarthDays / p.orbitalPeriodDays;
      const fullYears = Math.floor(planetYears);
      const remainderDays = Math.floor((planetYears - fullYears) * p.orbitalPeriodDays);

      // Next birthday: remaining days in current planet year
      const daysIntoCurrentYear = (planetYears - fullYears) * p.orbitalPeriodDays;
      const daysUntilNextBirthday = Math.ceil(p.orbitalPeriodDays - daysIntoCurrentYear);

      // Sunrises seen
      const sunrises = Math.floor(totalEarthDays / p.dayLengthEarthDays);

      // Weight
      const earthWeight = parseFloat(weight) || 0;
      const planetWeight = earthWeight * p.gravity;

      return {
        planet: p,
        planetYears,
        fullYears,
        remainderDays,
        daysUntilNextBirthday,
        sunrises,
        planetWeight,
        funComment: getAgeFunComment(p.name, planetYears),
      };
    });
  }, [birthdate, weight]);

  return (
    <section className="pt-10 sm:pt-12 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ---- Header ---- */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
          <Rocket className="w-4 h-4" />
          Planet Age Calculator
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-slate-100 mb-4">
          Your Age on Other Planets
        </h1>
        <p className="text-muted max-w-2xl mx-auto text-lg">
          Every planet orbits the Sun at a different speed. Enter your birthdate to discover how old you&apos;d be on Mercury, Mars, Jupiter, and beyond.
        </p>
      </div>

      {/* ---- Inputs ---- */}
      <div className="max-w-xl mx-auto mb-14">
        <div className="bg-card-bg border border-card-border rounded-2xl p-6 space-y-5">
          {/* Birthdate */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-2">
              <Calendar className="w-4 h-4 text-primary" />
              Your Birthdate
            </label>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full bg-dark-bg border border-card-border rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-2">
              <Scale className="w-4 h-4 text-secondary" />
              Your Weight on Earth (kg)
              <span className="text-xs text-muted font-normal ml-1">(optional)</span>
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 70"
              min={0}
              max={1000}
              className="w-full bg-dark-bg border border-card-border rounded-xl px-4 py-3 text-slate-200 placeholder:text-muted-dark focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
        </div>
      </div>

      {/* ---- Results ---- */}
      {!results && (
        <div className="text-center text-muted py-20">
          <Globe className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p>Enter your birthdate above to see your age across the Solar System.</p>
        </div>
      )}

      {results && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
          {results.map(({ planet: p, planetYears, fullYears, remainderDays, daysUntilNextBirthday, sunrises, planetWeight, funComment }) => (
            <div
              key={p.name}
              className={`bg-card-bg border rounded-2xl p-5 transition-all duration-300 hover:shadow-lg ${
                p.name === "Earth"
                  ? "border-primary/50 ring-1 ring-primary/20"
                  : "border-card-border hover:border-primary/30"
              }`}
            >
              {/* Planet header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="rounded-full flex items-center justify-center shrink-0"
                  style={{
                    width: p.ringSize,
                    height: p.ringSize,
                    background: `radial-gradient(circle at 35% 35%, ${p.color}cc, ${p.color}44)`,
                    boxShadow: `0 0 12px ${p.color}33`,
                  }}
                />
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-100">{p.name}</h3>
                  <p className="text-xs text-muted">
                    1 year = {formatNumber(p.orbitalPeriodDays)} Earth days
                  </p>

            <AdBanner />
                </div>
              </div>

              {/* Age */}
              <div className="bg-dark-bg rounded-xl p-4 mb-4">
                <p className="text-sm text-muted mb-1">Your age</p>
                <p className="font-heading text-2xl font-bold" style={{ color: p.color }}>
                  {fullYears} <span className="text-base font-normal text-muted">years</span>{" "}
                  {remainderDays} <span className="text-base font-normal text-muted">days</span>
                </p>
                {funComment && (
                  <p className="text-sm text-secondary mt-1.5 flex items-center gap-1.5">
                    <PartyPopper className="w-3.5 h-3.5" />
                    {funComment}
                  </p>
                )}
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {/* Next birthday */}
                <div className="bg-dark-bg rounded-lg p-3">
                  <p className="text-xs text-muted mb-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Next birthday
                  </p>
                  <p className="font-semibold text-slate-200">
                    {p.name === "Earth"
                      ? `${daysUntilNextBirthday} days`
                      : `${formatNumber(daysUntilNextBirthday)} days`}
                  </p>
                </div>

                {/* Sunrises */}
                <div className="bg-dark-bg rounded-lg p-3">
                  <p className="text-xs text-muted mb-0.5 flex items-center gap-1">
                    <Sunrise className="w-3 h-3" /> Sunrises seen
                  </p>
                  <p className="font-semibold text-slate-200">{formatNumber(sunrises)}</p>
                </div>

                {/* Weight */}
                {parseFloat(weight) > 0 && (
                  <div className="bg-dark-bg rounded-lg p-3 col-span-2">
                    <p className="text-xs text-muted mb-0.5 flex items-center gap-1">
                      <Scale className="w-3 h-3" /> Your weight on {p.name}
                    </p>
                    <p className="font-semibold text-slate-200">
                      {formatNumber(planetWeight)} kg
                      <span className="text-xs text-muted ml-1.5">
                        ({p.gravity}x Earth gravity)
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Fun fact */}
              <div className="mt-4 flex items-start gap-2 text-xs text-slate-400">
                <Info className="w-3.5 h-3.5 text-muted shrink-0 mt-0.5" />
                <span>{p.funFact}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---- Explanation ---- */}
      <div className="mt-16 bg-card-bg border border-card-border rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <CircleDot className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-xl font-bold text-slate-100">How It Works</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 text-sm text-slate-400">
          <div>
            <h3 className="font-semibold text-slate-200 mb-1">Age Calculation</h3>
            <p>
              Your Earth age in days is divided by each planet&apos;s orbital period (how long it takes to complete one trip around the Sun). Mercury zooms around in 88 days, while Pluto takes 248 Earth years.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-200 mb-1">Weight on Other Planets</h3>
            <p>
              Weight depends on surface gravity. Jupiter&apos;s gravity is 2.34x Earth&apos;s, so you&apos;d feel much heavier. On Pluto, gravity is just 6% of Earth&apos;s - you could jump over a house!
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-200 mb-1">Sunrises</h3>
            <p>
              Each planet rotates at a different speed. Jupiter&apos;s day is under 10 hours (you&apos;d see ~2.4 sunrises per Earth day), while Venus takes 117 Earth days for one sunrise.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
