"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Star,
  ArrowRight,
  ArrowLeft,
  Info,
  Telescope,
  Satellite,
  Shield,
  Clock,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

/**
 * Convert a Gregorian calendar date to Julian Day Number.
 * Algorithm from Meeus, "Astronomical Algorithms" (1991).
 */
function gregorianToJD(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0
): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFraction = (hour + minute / 60 + second / 3600) / 24;

  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    dayFraction +
    B -
    1524.5
  );
}

/**
 * Convert Julian Day Number back to Gregorian date.
 */
function jdToGregorian(jd: number): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} {
  const JD = jd + 0.5;
  const Z = Math.floor(JD);
  const F = JD - Z;

  let A: number;
  if (Z < 2299161) {
    A = Z;
  } else {
    const alpha = Math.floor((Z - 1867216.25) / 36524.25);
    A = Z + 1 + alpha - Math.floor(alpha / 4);
  }

  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);

  const dayFrac = B - D - Math.floor(30.6001 * E) + F;
  const day = Math.floor(dayFrac);
  const remainder = (dayFrac - day) * 24;
  const hour = Math.floor(remainder);
  const minRemainder = (remainder - hour) * 60;
  const minute = Math.floor(minRemainder);
  const second = Math.round((minRemainder - minute) * 60);

  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;

  return { year, month, day, hour, minute, second };
}

function jdToMJD(jd: number): number {
  return jd - 2400000.5;
}

function mjdToJD(mjd: number): number {
  return mjd + 2400000.5;
}

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toTimeStr(d: Date): string {
  const h = String(d.getUTCHours()).padStart(2, "0");
  const m = String(d.getUTCMinutes()).padStart(2, "0");
  const s = String(d.getUTCSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function JulianDatePage() {
  const [now, setNow] = useState(new Date());

  // Calendar -> JD
  const [calDate, setCalDate] = useState(toDateStr(new Date()));
  const [calTime, setCalTime] = useState(toTimeStr(new Date()));

  // JD -> Calendar
  const [jdInput, setJdInput] = useState("");

  // MJD input
  const [mjdInput, setMjdInput] = useState("");

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const currentJD = useMemo(() => {
    return gregorianToJD(
      now.getUTCFullYear(),
      now.getUTCMonth() + 1,
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds()
    );
  }, [now]);

  const currentMJD = jdToMJD(currentJD);

  // Calendar -> JD result
  const calToJDResult = useMemo(() => {
    if (!calDate) return null;
    const parts = calDate.split("-").map(Number);
    const timeParts = calTime ? calTime.split(":").map(Number) : [0, 0, 0];
    if (parts.length < 3) return null;
    const jd = gregorianToJD(
      parts[0],
      parts[1],
      parts[2],
      timeParts[0] || 0,
      timeParts[1] || 0,
      timeParts[2] || 0
    );
    return { jd, mjd: jdToMJD(jd) };
  }, [calDate, calTime]);

  // JD -> Calendar result
  const jdToCalResult = useMemo(() => {
    const val = parseFloat(jdInput);
    if (isNaN(val)) return null;
    const res = jdToGregorian(val);
    return res;
  }, [jdInput]);

  // MJD -> Calendar result
  const mjdToCalResult = useMemo(() => {
    const val = parseFloat(mjdInput);
    if (isNaN(val)) return null;
    const jd = mjdToJD(val);
    const res = jdToGregorian(jd);
    return { ...res, jd };
  }, [mjdInput]);

  return (
    <div className="min-h-screen bg-dark-bg">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12 pb-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            Astronomy Tool
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#E2E8F0] mb-3">
            Julian Date Converter
          </h1>
          <p className="text-muted max-w-2xl mx-auto">
            Convert between calendar dates and Julian Day Numbers &mdash; the
            continuous day count used in astronomy, military, and satellite
            tracking since 4713 BC.
          </p>
        </div>

        {/* Live display */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-8 sm:p-10 text-center mb-8">
          <p className="text-muted text-sm mb-2 uppercase tracking-wider">
            Current Julian Date (UTC)
          </p>
          <p className="text-4xl sm:text-5xl font-heading font-extrabold text-[#E2E8F0] font-mono tracking-wider">
            {currentJD.toFixed(5)}
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div>
              <span className="text-muted">MJD: </span>
              <span className="text-secondary font-mono font-semibold">
                {currentMJD.toFixed(5)}
              </span>
            </div>
            <div>
              <span className="text-muted">UTC: </span>
              <span className="text-[#E2E8F0] font-mono">
                {now.toISOString().replace("T", " ").slice(0, 19)}
              </span>
            </div>
          </div>
        </div>

        {/* Converters */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Calendar -> JD */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-6">
            <h2 className="font-heading text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-primary" />
              Calendar Date to Julian Date
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-muted mb-1">
                  Date (UTC)
                </label>
                <input
                  type="date"
                  value={calDate}
                  onChange={(e) => setCalDate(e.target.value)}
                  className="w-full bg-dark-bg border border-card-border rounded-lg px-4 py-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">
                  Time (UTC)
                </label>
                <input
                  type="time"
                  step="1"
                  value={calTime}
                  onChange={(e) => setCalTime(e.target.value)}
                  className="w-full bg-dark-bg border border-card-border rounded-lg px-4 py-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              {calToJDResult && (
                <div className="bg-dark-bg rounded-lg p-4 border border-card-border space-y-1">
                  <p className="text-[#E2E8F0]">
                    <span className="text-muted text-sm">JD: </span>
                    <span className="font-mono font-bold text-xl text-primary">
                      {calToJDResult.jd.toFixed(5)}
                    </span>
                  </p>
                  <p className="text-[#E2E8F0]">
                    <span className="text-muted text-sm">MJD: </span>
                    <span className="font-mono text-secondary">
                      {calToJDResult.mjd.toFixed(5)}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* JD -> Calendar */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-6">
            <h2 className="font-heading text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
              <ArrowLeft className="w-5 h-5 text-secondary" />
              Julian Date to Calendar Date
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-muted mb-1">
                  Julian Day Number
                </label>
                <input
                  type="text"
                  value={jdInput}
                  onChange={(e) => setJdInput(e.target.value)}
                  placeholder="e.g. 2460408.5"
                  className="w-full bg-dark-bg border border-card-border rounded-lg px-4 py-3 text-[#E2E8F0] font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              {jdToCalResult && (
                <div className="bg-dark-bg rounded-lg p-4 border border-card-border">
                  <p className="text-[#E2E8F0] font-mono font-bold text-lg">
                    {jdToCalResult.year}-{pad2(jdToCalResult.month)}-
                    {pad2(jdToCalResult.day)}{" "}
                    <span className="text-muted text-base">
                      {pad2(jdToCalResult.hour)}:{pad2(jdToCalResult.minute)}:
                      {pad2(jdToCalResult.second)} UTC
                    </span>
                  </p>
                </div>
              )}

              <div className="pt-2">
                <label className="block text-sm text-muted mb-1">
                  Modified Julian Date
                </label>
                <input
                  type="text"
                  value={mjdInput}
                  onChange={(e) => setMjdInput(e.target.value)}
                  placeholder="e.g. 60408.0"
                  className="w-full bg-dark-bg border border-card-border rounded-lg px-4 py-3 text-[#E2E8F0] font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              {mjdToCalResult && (
                <div className="bg-dark-bg rounded-lg p-4 border border-card-border space-y-1">
                  <p className="text-[#E2E8F0] font-mono font-bold">
                    {mjdToCalResult.year}-{pad2(mjdToCalResult.month)}-
                    {pad2(mjdToCalResult.day)}{" "}
                    <span className="text-muted text-sm">
                      {pad2(mjdToCalResult.hour)}:{pad2(mjdToCalResult.minute)}:
                      {pad2(mjdToCalResult.second)} UTC
                    </span>
                  </p>
                  <p className="text-xs text-muted">
                    JD: {mjdToCalResult.jd.toFixed(5)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <AdBanner />

        {/* Use cases */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card-bg border border-card-border rounded-xl p-5">
            <Telescope className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-heading font-semibold text-[#E2E8F0] mb-1">
              Astronomy
            </h3>
            <p className="text-sm text-muted">
              Astronomers use Julian Dates to time celestial events precisely,
              avoiding calendar complications like leap years and varying month
              lengths.
            </p>
          </div>
          <div className="bg-card-bg border border-card-border rounded-xl p-5">
            <Shield className="w-6 h-6 text-secondary mb-3" />
            <h3 className="font-heading font-semibold text-[#E2E8F0] mb-1">
              Military
            </h3>
            <p className="text-sm text-muted">
              Military logistics and communications use Julian date codes (ordinal
              day of year) for unambiguous date stamping across different time
              zones.
            </p>
          </div>
          <div className="bg-card-bg border border-card-border rounded-xl p-5">
            <Satellite className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-heading font-semibold text-[#E2E8F0] mb-1">
              Satellite Tracking
            </h3>
            <p className="text-sm text-muted">
              TLE (Two-Line Element) sets for satellites use Julian dates to
              specify epoch times, enabling precise orbital calculations.
            </p>
          </div>
        </div>

        {/* MJD explanation */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-6 sm:p-8 mb-8">
          <h2 className="font-heading text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-secondary" />
            Modified Julian Date (MJD)
          </h2>
          <div className="text-sm text-muted leading-relaxed space-y-2">
            <p>
              The Modified Julian Date was introduced to provide a more manageable
              number. It is defined as:
            </p>
            <div className="bg-dark-bg rounded-lg p-4 border border-card-border text-center">
              <code className="text-[#E2E8F0] text-lg">
                MJD = JD &minus; 2,400,000.5
              </code>
            </div>
            <p>
              The MJD epoch is{" "}
              <span className="text-[#E2E8F0] font-medium">
                November 17, 1858, at 00:00 UTC
              </span>
              . Unlike the Julian Date (which starts at noon), MJD starts at
              midnight, making it more practical for civil timekeeping.
            </p>
          </div>
        </div>

        {/* Formula & explanation */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-6 sm:p-8">
          <h2 className="font-heading text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            How Julian Day Numbers Work
          </h2>
          <div className="text-sm text-muted leading-relaxed space-y-3">
            <p>
              The <span className="text-[#E2E8F0] font-medium">Julian Day Number</span>{" "}
              is a continuous count of days since the beginning of the Julian
              Period on{" "}
              <span className="text-[#E2E8F0] font-medium">
                January 1, 4713 BC
              </span>{" "}
              (proleptic Julian calendar), or November 24, 4714 BC in the
              proleptic Gregorian calendar. The Julian Day starts at{" "}
              <span className="text-[#E2E8F0]">Greenwich noon</span> (12:00 UT).
            </p>
            <p className="font-medium text-[#E2E8F0]">
              Conversion Formula (Gregorian to JD):
            </p>
            <div className="bg-dark-bg rounded-lg p-4 border border-card-border font-mono text-xs sm:text-sm text-[#E2E8F0] space-y-1">
              <p>
                <span className="text-muted">{"// If month <= 2:"}</span> Y = year
                - 1, M = month + 12
              </p>
              <p>A = floor(Y / 100)</p>
              <p>B = 2 - A + floor(A / 4)</p>
              <p>
                JD = floor(365.25 * (Y + 4716)) + floor(30.6001 * (M + 1)) + day
                + B - 1524.5
              </p>
            </div>
            <p>
              This algorithm (from Jean Meeus,{" "}
              <em>Astronomical Algorithms</em>) is valid for all Gregorian
              calendar dates. The fractional part represents the time of day, where
              0.0 = noon UTC, 0.5 = midnight UTC.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
