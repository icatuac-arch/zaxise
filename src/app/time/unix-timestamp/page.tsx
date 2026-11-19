"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  Info,
  Timer,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

const COMMON_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Kolkata",
  "Australia/Sydney",
  "Pacific/Auckland",
];

function toLocalInputStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${day}T${h}:${min}:${s}`;
}

function formatInTz(ts: number, tz: string): string {
  try {
    return new Date(ts * 1000).toLocaleString("en-US", {
      timeZone: tz,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZoneName: "short",
    });
  } catch {
    return "Invalid timezone";
  }
}

const BOOKMARKS = [
  { label: "Unix Epoch", ts: 0, desc: "January 1, 1970 00:00:00 UTC" },
  { label: "Y2K", ts: 946684800, desc: "January 1, 2000 00:00:00 UTC" },
  {
    label: "32-bit Overflow (2038)",
    ts: 2147483647,
    desc: "January 19, 2038 03:14:07 UTC",
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function UnixTimestampPage() {
  const [nowTs, setNowTs] = useState(Math.floor(Date.now() / 1000));
  const [copied, setCopied] = useState(false);

  // Timestamp -> Human
  const [inputTs, setInputTs] = useState(String(nowTs));
  const [tz, setTz] = useState("UTC");
  const [isMs, setIsMs] = useState(false);

  // Human -> Timestamp
  const [humanDate, setHumanDate] = useState(toLocalInputStr(new Date()));

  useEffect(() => {
    const id = setInterval(() => setNowTs(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const tsToHuman = useMemo(() => {
    const raw = parseInt(inputTs);
    if (isNaN(raw)) return null;
    const seconds = isMs ? Math.floor(raw / 1000) : raw;
    return formatInTz(seconds, tz);
  }, [inputTs, tz, isMs]);

  const humanToTs = useMemo(() => {
    if (!humanDate) return null;
    const d = new Date(humanDate);
    if (isNaN(d.getTime())) return null;
    return Math.floor(d.getTime() / 1000);
  }, [humanDate]);

  async function copyTimestamp() {
    try {
      await navigator.clipboard.writeText(String(nowTs));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12 pb-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Timer className="w-4 h-4" />
            Timestamp Tool
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#E2E8F0] mb-3">
            Unix Timestamp Converter
          </h1>
          <p className="text-muted max-w-2xl mx-auto">
            Seconds since January 1, 1970 00:00:00 UTC &mdash; the universal
            way computers track time.
          </p>
        </div>

        {/* Live ticker */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-8 sm:p-10 text-center mb-8">
          <p className="text-muted text-sm mb-2 uppercase tracking-wider">
            Current Unix Timestamp
          </p>
          <p className="text-4xl sm:text-6xl font-heading font-extrabold text-[#E2E8F0] font-mono tracking-wider">
            {nowTs}
          </p>
          <p className="text-muted text-sm mt-2 mb-4">
            Milliseconds: {nowTs * 1000}
          </p>
          <button
            onClick={copyTimestamp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-hover transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Timestamp
              </>
            )}
          </button>
        </div>

        {/* Converters */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Timestamp -> Human */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-6">
            <h2 className="font-heading text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-primary" />
              Timestamp to Date
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                value={inputTs}
                onChange={(e) => setInputTs(e.target.value)}
                placeholder="Enter Unix timestamp..."
                className="w-full bg-dark-bg border border-card-border rounded-lg px-4 py-3 text-[#E2E8F0] font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <div className="flex gap-3">
                <select
                  value={tz}
                  onChange={(e) => setTz(e.target.value)}
                  className="flex-1 bg-dark-bg border border-card-border rounded-lg px-3 py-2 text-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {COMMON_TIMEZONES.map((z) => (
                    <option key={z} value={z}>
                      {z.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setIsMs(!isMs)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isMs
                      ? "bg-secondary/20 text-secondary"
                      : "bg-dark-bg border border-card-border text-muted"
                  }`}
                >
                  ms
                </button>
              </div>
              {tsToHuman && (
                <div className="bg-dark-bg rounded-lg p-4 border border-card-border">
                  <p className="text-[#E2E8F0] font-medium">{tsToHuman}</p>
                </div>
              )}
            </div>
          </div>

          {/* Human -> Timestamp */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-6">
            <h2 className="font-heading text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
              <ArrowLeft className="w-5 h-5 text-secondary" />
              Date to Timestamp
            </h2>
            <div className="space-y-3">
              <input
                type="datetime-local"
                value={humanDate}
                onChange={(e) => setHumanDate(e.target.value)}
                className="w-full bg-dark-bg border border-card-border rounded-lg px-4 py-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {humanToTs !== null && (
                <div className="bg-dark-bg rounded-lg p-4 border border-card-border space-y-1">
                  <p className="text-[#E2E8F0]">
                    <span className="text-muted text-sm">Seconds: </span>
                    <span className="font-mono font-bold text-xl text-primary">
                      {humanToTs}
                    </span>
                  </p>
                  <p className="text-[#E2E8F0]">
                    <span className="text-muted text-sm">Milliseconds: </span>
                    <span className="font-mono text-secondary">
                      {humanToTs * 1000}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <AdBanner />

        {/* Common timestamps */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-6 sm:p-8 mb-8">
          <h2 className="font-heading text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-secondary" />
            Notable Timestamps
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              ...BOOKMARKS,
              {
                label: "Right Now",
                ts: nowTs,
                desc: formatInTz(nowTs, "UTC"),
              },
            ].map((b) => (
              <button
                key={b.label}
                onClick={() => {
                  setInputTs(String(b.ts));
                  setIsMs(false);
                }}
                className="bg-dark-bg border border-card-border rounded-xl p-4 text-left hover:border-primary/50 transition-colors"
              >
                <p className="font-heading font-semibold text-[#E2E8F0] text-sm">
                  {b.label}
                </p>
                <p className="font-mono text-primary text-lg">
                  {b.ts.toLocaleString("en-US")}
                </p>
                <p className="text-muted text-xs mt-1">{b.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-6 sm:p-8">
          <h2 className="font-heading text-lg font-semibold text-[#E2E8F0] mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            What Is a Unix Timestamp?
          </h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              A <span className="text-[#E2E8F0] font-medium">Unix timestamp</span>{" "}
              (also called Epoch time or POSIX time) is the number of seconds that
              have elapsed since{" "}
              <span className="text-[#E2E8F0] font-medium">
                January 1, 1970, 00:00:00 UTC
              </span>
              , not counting leap seconds. It is widely used in computing because
              it provides a simple, timezone-independent way to represent a point
              in time.
            </p>
            <p>
              <span className="text-secondary font-medium">JavaScript</span> uses{" "}
              <code className="bg-dark-bg px-1.5 py-0.5 rounded text-[#E2E8F0]">
                Date.now()
              </code>{" "}
              which returns <span className="text-[#E2E8F0]">milliseconds</span>{" "}
              since the epoch. Divide by 1000 to get the standard Unix timestamp in
              seconds.
            </p>
            <p>
              <span className="text-primary font-medium">
                The Year 2038 Problem:
              </span>{" "}
              32-bit systems store timestamps as a signed 32-bit integer, which
              overflows on{" "}
              <span className="text-[#E2E8F0] font-medium">
                January 19, 2038, at 03:14:07 UTC
              </span>{" "}
              (timestamp 2,147,483,647). Modern 64-bit systems do not have this
              limitation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
