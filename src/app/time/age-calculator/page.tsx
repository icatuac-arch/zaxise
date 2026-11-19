"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Heart,
  Wind,
  Moon,
  Bed,
  UtensilsCrossed,
  Orbit,
  Rocket,
  Users,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function fmt(n: number): string {
  return Math.floor(n).toLocaleString("en-US");
}

function dayOfWeek(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "long" });
}

function getAge(birth: Date, now: Date) {
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

function getGeneration(year: number): { name: string; range: string } {
  if (year >= 2013) return { name: "Gen Alpha", range: "2013 +" };
  if (year >= 1997) return { name: "Gen Z", range: "1997 - 2012" };
  if (year >= 1981) return { name: "Millennial", range: "1981 - 1996" };
  if (year >= 1965) return { name: "Gen X", range: "1965 - 1980" };
  if (year >= 1946) return { name: "Baby Boomer", range: "1946 - 1964" };
  if (year >= 1928) return { name: "Silent Generation", range: "1928 - 1945" };
  return { name: "Greatest Generation", range: "Before 1928" };
}

function daysUntilNextBirthday(birth: Date, now: Date): number {
  let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBday.getTime() <= now.getTime()) {
    nextBday = new Date(
      now.getFullYear() + 1,
      birth.getMonth(),
      birth.getDate()
    );
  }
  return Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function AgeCalculatorPage() {
  const [birthStr, setBirthStr] = useState<string>("");
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 100);
    return () => clearInterval(id);
  }, []);

  const birth = birthStr ? new Date(birthStr + "T00:00:00") : null;
  const valid = birth && !isNaN(birth.getTime()) && birth.getTime() < now.getTime();

  const totalMs = valid ? now.getTime() - birth.getTime() : 0;
  const totalSeconds = totalMs / 1000;
  const totalMinutes = totalSeconds / 60;
  const totalHours = totalMinutes / 60;
  const totalDays = totalHours / 24;
  const totalWeeks = totalDays / 7;
  const totalMonthsApprox = totalDays / 30.4375;

  const age = valid ? getAge(birth, now) : null;
  const gen = valid ? getGeneration(birth.getFullYear()) : null;
  const bornDay = valid ? dayOfWeek(birth) : null;
  const nextBdayDays = valid ? daysUntilNextBirthday(birth, now) : 0;

  const heartbeats = totalDays * 100_000;
  const breaths = totalDays * 23_000;
  const hoursSept = totalDays * 8;
  const meals = totalDays * 3;
  const orbits = age ? age.years + (age.months / 12) + (age.days / 365.25) : 0;
  const kmThroughSpace = totalHours * 107_000;
  const fullMoons = totalDays / 29.53059;

  return (
    <main className="min-h-screen bg-dark-bg text-[#E2E8F0]">
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:pt-12 pb-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-card-border bg-card-bg px-4 py-1.5 text-sm text-muted">
            <Calendar className="h-4 w-4 text-secondary" />
            Life Calculator
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Age{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            How old are you, exactly? Down to the second.
          </p>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  BIRTHDATE INPUT                                          */}
        {/* -------------------------------------------------------- */}
        <section className="mb-12 rounded-2xl border border-card-border bg-card-bg p-6 sm:p-10">
          <label
            htmlFor="birth-input"
            className="mb-2 block text-sm font-medium text-muted"
          >
            Enter your date of birth
          </label>
          <input
            id="birth-input"
            type="date"
            value={birthStr}
            onChange={(e) => setBirthStr(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="w-full rounded-lg border border-card-border bg-dark-bg px-4 py-3 text-xl font-bold text-white outline-none focus:border-primary sm:text-2xl"
          />
        </section>

        {valid && age && (
          <>
            {/* -------------------------------------------------------- */}
            {/*  YOUR AGE                                                */}
            {/* -------------------------------------------------------- */}
            <section className="mb-12">
              <h2 className="font-heading mb-6 flex items-center gap-2 text-2xl font-bold">
                <Clock className="h-6 w-6 text-primary" />
                Your Age
              </h2>

              {/* Primary age */}
              <div className="mb-6 rounded-2xl border border-card-border bg-card-bg p-6 text-center sm:p-10">
                <p className="font-heading text-4xl font-extrabold text-white sm:text-5xl">
                  {age.years}{" "}
                  <span className="text-muted text-3xl sm:text-4xl">years</span>{" "}
                  {age.months}{" "}
                  <span className="text-muted text-3xl sm:text-4xl">months</span>{" "}
                  {age.days}{" "}
                  <span className="text-muted text-3xl sm:text-4xl">days</span>
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <UnitCard label="Total Months" value={fmt(totalMonthsApprox)} />
                <UnitCard label="Total Weeks" value={fmt(totalWeeks)} />
                <UnitCard label="Total Days" value={fmt(totalDays)} />
                <UnitCard label="Total Hours" value={fmt(totalHours)} />
                <UnitCard label="Total Minutes" value={fmt(totalMinutes)} />
                <UnitCard
                  label="Total Seconds"
                  value={fmt(totalSeconds)}
                  highlight
                />
              </div>

            <AdBanner />
            </section>

            {/* -------------------------------------------------------- */}
            {/*  NEXT BIRTHDAY COUNTDOWN                                 */}
            {/* -------------------------------------------------------- */}
            <section className="mb-12">
              <h2 className="font-heading mb-6 flex items-center gap-2 text-2xl font-bold">
                <PartyPopper className="h-6 w-6 text-secondary" />
                Next Birthday
              </h2>
              <div className="rounded-2xl border border-card-border bg-card-bg p-6 text-center sm:p-10">
                {nextBdayDays === 0 ? (
                  <p className="font-heading text-4xl font-bold text-green-400">
                    Happy Birthday!
                  </p>
                ) : (
                  <>
                    <p className="font-heading text-5xl font-extrabold text-secondary sm:text-6xl">
                      {nextBdayDays}
                    </p>
                    <p className="mt-2 text-lg text-muted">
                      days until your next birthday
                    </p>
                  </>
                )}
              </div>
            </section>

            {/* -------------------------------------------------------- */}
            {/*  LIFE STATS                                              */}
            {/* -------------------------------------------------------- */}
            <section className="mb-12">
              <h2 className="font-heading mb-6 flex items-center gap-2 text-2xl font-bold">
                <Sparkles className="h-6 w-6 text-primary" />
                Life Stats
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <LifeStatCard
                  icon={<Heart className="h-5 w-5 text-red-400" />}
                  label="Heartbeats"
                  value={fmt(heartbeats)}
                  sub="~100,000/day"
                />
                <LifeStatCard
                  icon={<Wind className="h-5 w-5 text-secondary" />}
                  label="Breaths Taken"
                  value={fmt(breaths)}
                  sub="~23,000/day"
                />
                <LifeStatCard
                  icon={<Bed className="h-5 w-5 text-primary" />}
                  label="Hours Slept"
                  value={fmt(hoursSept)}
                  sub="avg 8h/day"
                />
                <LifeStatCard
                  icon={<UtensilsCrossed className="h-5 w-5 text-yellow-400" />}
                  label="Meals Eaten"
                  value={fmt(meals)}
                  sub="avg 3/day"
                />
                <LifeStatCard
                  icon={<Orbit className="h-5 w-5 text-green-400" />}
                  label="Earth Orbits"
                  value={orbits.toFixed(2)}
                  sub="trips around the Sun"
                />
                <LifeStatCard
                  icon={<Rocket className="h-5 w-5 text-secondary" />}
                  label="Distance Through Space"
                  value={`${(kmThroughSpace / 1e9).toFixed(1)}B km`}
                  sub="Earth orbits Sun at 107,000 km/h"
                />
                <LifeStatCard
                  icon={<Moon className="h-5 w-5 text-muted" />}
                  label="Full Moons Witnessed"
                  value={fmt(fullMoons)}
                  sub="~1 every 29.5 days"
                />
              </div>
            </section>

            {/* -------------------------------------------------------- */}
            {/*  GENERATION & DAY OF BIRTH                               */}
            {/* -------------------------------------------------------- */}
            <section className="mb-4 grid gap-6 sm:grid-cols-2">
              {/* Generation */}
              <div className="rounded-2xl border border-card-border bg-card-bg p-6 text-center sm:p-8">
                <Users className="mx-auto mb-3 h-8 w-8 text-primary" />
                <p className="text-sm text-muted">Your Generation</p>
                <p className="mt-2 font-heading text-3xl font-bold text-white">
                  {gen!.name}
                </p>
                <p className="mt-1 text-sm text-muted">{gen!.range}</p>
              </div>

              {/* Day of birth */}
              <div className="rounded-2xl border border-card-border bg-card-bg p-6 text-center sm:p-8">
                <Calendar className="mx-auto mb-3 h-8 w-8 text-secondary" />
                <p className="text-sm text-muted">You Were Born On</p>
                <p className="mt-2 font-heading text-3xl font-bold text-white">
                  {bornDay}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {birth.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  SUB-COMPONENTS                                                     */
/* ------------------------------------------------------------------ */

function UnitCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 text-center ${
        highlight
          ? "border-secondary/40 bg-secondary/10"
          : "border-card-border bg-card-bg"
      }`}
    >
      <p className="text-xs text-muted">{label}</p>
      <p
        className={`mt-1 font-heading text-2xl font-bold ${
          highlight ? "text-secondary" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function LifeStatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-xl border border-card-border bg-card-bg p-5">
      <div className="mb-2 flex items-center gap-2 text-sm text-muted">
        {icon}
        {label}
      </div>
      <p className="font-heading text-xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-muted">{sub}</p>
    </div>
  );
}
