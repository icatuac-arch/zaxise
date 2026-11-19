"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Rocket,
  MapPin,
  Globe,
  Filter,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Flame,
  Timer,
  Building2,
  BarChart3,
  Loader2,
  Video,
  Calendar,
  Zap,
  Target,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  TYPES                                                             */
/* ------------------------------------------------------------------ */

interface Launch {
  id: string;
  name: string;
  net: string;
  status: { id: number; name: string; abbrev: string };
  launch_service_provider: { name: string; type: string };
  rocket: { configuration: { name: string; full_name: string } };
  pad: {
    name: string;
    location: { name: string; country_code: string };
  };
  mission: {
    name: string;
    description: string;
    type: string;
  } | null;
  image: string | null;
  webcast_live: boolean;
  vidURLs?: { url: string }[];
}

interface APIResponse {
  count: number;
  results: Launch[];
}

type ProviderFilter = "all" | "spacex" | "rocketlab" | "ula" | "other";

/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                         */
/* ------------------------------------------------------------------ */

const LAUNCH_SITES = [
  {
    name: "Kennedy Space Center (KSC)",
    location: "Florida, USA",
    flag: "🇺🇸",
    operators: "NASA / SpaceX",
  },
  {
    name: "Cape Canaveral SFS",
    location: "Florida, USA",
    flag: "🇺🇸",
    operators: "SpaceX / ULA",
  },
  {
    name: "Vandenberg SFB",
    location: "California, USA",
    flag: "🇺🇸",
    operators: "SpaceX / ULA",
  },
  {
    name: "Baikonur Cosmodrome",
    location: "Kazakhstan",
    flag: "🇰🇿",
    operators: "Roscosmos",
  },
  {
    name: "Satish Dhawan Space Centre",
    location: "Sriharikota, India",
    flag: "🇮🇳",
    operators: "ISRO",
  },
  {
    name: "Tanegashima Space Center",
    location: "Tanegashima, Japan",
    flag: "🇯🇵",
    operators: "JAXA",
  },
  {
    name: "Guiana Space Centre",
    location: "Kourou, French Guiana",
    flag: "🇫🇷",
    operators: "ESA / Arianespace",
  },
  {
    name: "Rocket Lab Launch Complex 1",
    location: "Mahia Peninsula, New Zealand",
    flag: "🇳🇿",
    operators: "Rocket Lab",
  },
];

const FILTER_TABS: { key: ProviderFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "spacex", label: "SpaceX" },
  { key: "rocketlab", label: "Rocket Lab" },
  { key: "ula", label: "ULA" },
  { key: "other", label: "Other" },
];

const KNOWN_PROVIDERS = ["spacex", "rocket lab", "united launch alliance"];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                           */
/* ------------------------------------------------------------------ */

function getCountdown(isoDate: string) {
  const now = Date.now();
  const target = new Date(isoDate).getTime();
  const diff = target - now;

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, past: false };
}

function formatLaunchDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function getStatusColor(statusName: string) {
  const lower = statusName.toLowerCase();
  if (lower.includes("go")) return { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30" };
  if (lower.includes("tbd") || lower.includes("tbc")) return { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" };
  if (lower.includes("hold") || lower.includes("fail") || lower.includes("abort"))
    return { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30" };
  return { bg: "bg-slate-500/15", text: "text-slate-400", border: "border-slate-500/30" };
}

function matchesFilter(launch: Launch, filter: ProviderFilter): boolean {
  if (filter === "all") return true;
  const provider = launch.launch_service_provider.name.toLowerCase();
  if (filter === "spacex") return provider.includes("spacex");
  if (filter === "rocketlab") return provider.includes("rocket lab");
  if (filter === "ula") return provider.includes("united launch alliance");
  if (filter === "other") return !KNOWN_PROVIDERS.some((p) => provider.includes(p));
  return true;
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "...";
}

/* ------------------------------------------------------------------ */
/*  COUNTDOWN HOOK                                                    */
/* ------------------------------------------------------------------ */

function useCountdown(isoDate: string | null) {
  const [countdown, setCountdown] = useState(() =>
    isoDate ? getCountdown(isoDate) : { days: 0, hours: 0, minutes: 0, seconds: 0, past: true }
  );

  useEffect(() => {
    if (!isoDate) return;
    const id = setInterval(() => setCountdown(getCountdown(isoDate)), 1000);
    return () => clearInterval(id);
  }, [isoDate]);

  return countdown;
}

/* ------------------------------------------------------------------ */
/*  SKELETON COMPONENTS                                               */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function HeroSkeleton() {
  return (
    <div className="animate-pulse text-center py-16">
      <div className="h-10 w-80 bg-slate-700/50 rounded-lg mx-auto mb-4" />
      <div className="h-5 w-96 bg-slate-700/30 rounded mx-auto" />
    </div>
  );
}

function BannerSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-[#1E293B] bg-[#0F172A] p-8 mb-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <div className="h-4 w-32 bg-slate-700/50 rounded" />
          <div className="h-8 w-64 bg-slate-700/40 rounded" />
          <div className="h-4 w-48 bg-slate-700/30 rounded" />
          <div className="flex gap-4 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 w-20 bg-slate-700/30 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="w-full md:w-72 h-48 bg-slate-700/30 rounded-xl" />
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-[#1E293B] bg-[#0F172A] p-5">
      <div className="flex gap-4">
        <div className="w-28 h-28 rounded-lg bg-slate-700/30 shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-5 w-3/4 bg-slate-700/40 rounded" />
          <div className="h-4 w-1/2 bg-slate-700/30 rounded" />
          <div className="h-4 w-2/3 bg-slate-700/30 rounded" />
          <div className="h-3 w-full bg-slate-700/20 rounded" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  COUNTDOWN DIGIT                                                   */
/* ------------------------------------------------------------------ */

function CountdownUnit({ value, label, large }: { value: number; label: string; large?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-[#1E293B] bg-[#030712] ${
        large ? "min-w-[5rem] p-4" : "min-w-[3.5rem] p-2"
      }`}
    >
      <span
        className={`font-[family-name:var(--font-outfit)] font-bold tabular-nums ${
          large ? "text-3xl" : "text-lg"
        } text-[#E2E8F0]`}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className={`text-[#94A3B8] uppercase tracking-wider ${large ? "text-xs" : "text-[10px]"}`}>{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  NEXT LAUNCH BANNER                                                */
/* ------------------------------------------------------------------ */

function NextLaunchBanner({ launch }: { launch: Launch }) {
  const countdown = useCountdown(launch.net);
  const statusColors = getStatusColor(launch.status.name);

  return (
    <section className="relative rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#0F172A] via-[#0F172A] to-indigo-950/30 p-6 md:p-8 mb-10 overflow-hidden">
      {/* glow accent */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} className="text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">Next Launch</span>
          </div>

          <h2 className="font-[family-name:var(--font-outfit)] text-2xl md:text-3xl font-bold text-[#E2E8F0] mb-2 leading-tight">
            {launch.name}
          </h2>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#94A3B8] mb-4">
            <span className="flex items-center gap-1.5">
              <Building2 size={14} className="text-indigo-400" />
              {launch.launch_service_provider.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Rocket size={14} className="text-cyan-400" />
              {launch.rocket.configuration.name}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-emerald-400" />
              {launch.pad.location.name}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm mb-1">
            <Calendar size={14} className="text-[#94A3B8]" />
            <span className="text-[#E2E8F0]">{formatLaunchDate(launch.net)}</span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
            >
              {launch.status.name}
            </span>
            {launch.webcast_live && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border border-red-500/30 bg-red-500/15 text-red-400">
                <Video size={12} /> LIVE
              </span>
            )}
          </div>

          {/* countdown */}
          <div className="flex gap-3 mt-6">
            {countdown.past ? (
              <span className="text-amber-400 font-medium text-sm">Launch window has passed or is in progress</span>
            ) : (
              <>
                <CountdownUnit value={countdown.days} label="Days" large />
                <CountdownUnit value={countdown.hours} label="Hrs" large />
                <CountdownUnit value={countdown.minutes} label="Min" large />
                <CountdownUnit value={countdown.seconds} label="Sec" large />
              </>
            )}
          </div>
        </div>

        {/* Image */}
        {launch.image && (
          <div className="w-full lg:w-72 shrink-0">
            <img
              src={launch.image}
              alt={launch.name}
              className="w-full h-48 lg:h-full object-cover rounded-xl border border-[#1E293B]"
            />
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  LAUNCH CARD                                                       */
/* ------------------------------------------------------------------ */

function LaunchCard({ launch }: { launch: Launch }) {
  const [expanded, setExpanded] = useState(false);
  const countdown = useCountdown(launch.net);
  const statusColors = getStatusColor(launch.status.name);

  return (
    <div className="group rounded-xl border border-[#1E293B] bg-[#0F172A] hover:border-indigo-500/30 transition-colors duration-300 overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        {launch.image && (
          <div className="w-full sm:w-36 md:w-44 shrink-0">
            <img
              src={launch.image}
              alt={launch.name}
              className="w-full h-40 sm:h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 p-4 md:p-5">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <h3 className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-[#E2E8F0] leading-snug">
              {launch.name}
            </h3>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
              >
                {launch.status.name}
              </span>
              {launch.webcast_live && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border border-red-500/30 bg-red-500/15 text-red-400">
                  <Video size={11} /> LIVE
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#94A3B8] mb-3">
            <span className="flex items-center gap-1">
              <Building2 size={12} className="text-indigo-400" />
              {launch.launch_service_provider.name}
            </span>
            <span className="flex items-center gap-1">
              <Rocket size={12} className="text-cyan-400" />
              {launch.rocket.configuration.name}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-emerald-400" />
              {launch.pad.name}
            </span>
          </div>

          {/* Date & countdown */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="flex items-center gap-1 text-xs text-[#E2E8F0]">
              <Calendar size={12} className="text-[#94A3B8]" />
              {formatLaunchDate(launch.net)}
            </span>
            <div className="flex items-center gap-1.5">
              <Timer size={12} className="text-indigo-400" />
              {countdown.past ? (
                <span className="text-xs text-amber-400">Launched</span>
              ) : (
                <span className="text-xs text-[#E2E8F0] tabular-nums font-medium">
                  T-{countdown.days}d {countdown.hours}h {countdown.minutes}m
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {launch.mission?.description && (
            <div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {expanded
                  ? launch.mission.description
                  : truncate(launch.mission.description, 160)}
              </p>
              {launch.mission.description.length > 160 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex items-center gap-0.5 text-[11px] text-indigo-400 hover:text-indigo-300 mt-1 transition-colors"
                >
                  {expanded ? (
                    <>
                      Show less <ChevronUp size={12} />
                    </>
                  ) : (
                    <>
                      Read more <ChevronDown size={12} />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                         */
/* ------------------------------------------------------------------ */

export default function LaunchesPage() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ProviderFilter>("all");

  const fetchLaunches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/launches");
      if (!res.ok) throw new Error("Failed to fetch launch data");
      const data: APIResponse = await res.json();
      setLaunches(data.results ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLaunches();
  }, [fetchLaunches]);

  const filtered = launches.filter((l) => matchesFilter(l, filter));
  const nextLaunch = launches[0] ?? null;

  /* Stats */
  const currentYear = new Date().getFullYear();
  const totalThisYear = launches.filter(
    (l) => new Date(l.net).getFullYear() === currentYear
  ).length;
  const spacexThisYear = launches.filter(
    (l) =>
      l.launch_service_provider.name.toLowerCase().includes("spacex") &&
      new Date(l.net).getFullYear() === currentYear
  ).length;

  const siteCounts: Record<string, number> = {};
  launches.forEach((l) => {
    const loc = l.pad.location.name;
    siteCounts[loc] = (siteCounts[loc] || 0) + 1;
  });
  const mostActiveSite =
    Object.entries(siteCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

  return (
    <main className="min-h-screen bg-[#030712]">
      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden border-b border-[#1E293B]">
        {/* bg accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 pt-10 sm:pt-12 pb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-medium mb-6">
            <Rocket size={14} />
            Mission Control Dashboard
          </div>

          <h1 className="font-[family-name:var(--font-outfit)] text-4xl md:text-5xl lg:text-6xl font-bold text-[#E2E8F0] mb-4">
            Upcoming Space Launches{" "}
            <span className="inline-block animate-bounce">🚀</span>
          </h1>

          <p className="text-[#94A3B8] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Track every rocket launch worldwide in real time. Countdown timers, mission details, and live webcast links
            — all in one place.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* ============================================================ */}
        {/*  LAUNCH STATS                                                */}
        {/* ============================================================ */}
        {!loading && !error && launches.length > 0 && (
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              {
                icon: <BarChart3 size={20} className="text-indigo-400" />,
                label: `Upcoming launches (${currentYear})`,
                value: totalThisYear,
              },
              {
                icon: <Flame size={20} className="text-cyan-400" />,
                label: `SpaceX launches (${currentYear})`,
                value: spacexThisYear,
              },
              {
                icon: <Target size={20} className="text-emerald-400" />,
                label: "Most active launch site",
                value: mostActiveSite,
                small: true,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-xl border border-[#1E293B] bg-[#0F172A] p-5"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#030712] border border-[#1E293B]">
                  {stat.icon}
                </div>
                <div>
                  <p
                    className={`font-[family-name:var(--font-outfit)] font-bold text-[#E2E8F0] ${
                      stat.small ? "text-sm" : "text-2xl"
                    }`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs text-[#94A3B8]">{stat.label}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ============================================================ */}
        {/*  NEXT LAUNCH BANNER                                          */}
        {/* ============================================================ */}
        {loading && <BannerSkeleton />}
        {!loading && !error && nextLaunch && <NextLaunchBanner launch={nextLaunch} />}

        {/* ============================================================ */}
        {/*  FILTER TABS                                                 */}
        {/* ============================================================ */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          <Filter size={16} className="text-[#94A3B8] shrink-0" />
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                filter === tab.key
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/40"
                  : "text-[#94A3B8] border border-transparent hover:text-[#E2E8F0] hover:bg-[#0F172A]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AdBanner />

        {/* ============================================================ */}
        {/*  ERROR STATE                                                 */}
        {/* ============================================================ */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center mb-10">
            <AlertCircle size={32} className="text-red-400 mx-auto mb-3" />
            <h3 className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-red-300 mb-1">
              Failed to load launch data
            </h3>
            <p className="text-sm text-red-400/80 mb-4">{error}</p>
            <button
              onClick={fetchLaunches}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 text-sm font-medium transition-colors"
            >
              <Loader2 size={14} /> Try Again
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/*  LAUNCH FEED                                                 */}
        {/* ============================================================ */}
        {loading && (
          <div className="grid gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-xl border border-[#1E293B] bg-[#0F172A] p-12 text-center">
            <Rocket size={40} className="text-[#94A3B8] mx-auto mb-3 opacity-40" />
            <p className="text-[#94A3B8]">No launches found for this filter.</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid gap-4 mb-16">
            {filtered.map((launch) => (
              <LaunchCard key={launch.id} launch={launch} />
            ))}
          </div>
        )}

        {/* ============================================================ */}
        {/*  LAUNCH SITES                                                */}
        {/* ============================================================ */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <Globe size={18} className="text-cyan-400" />
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-[#E2E8F0]">
                Major Launch Sites
              </h2>
              <p className="text-sm text-[#94A3B8]">Spaceports powering humanity&apos;s reach into orbit</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {LAUNCH_SITES.map((site) => (
              <div
                key={site.name}
                className="rounded-xl border border-[#1E293B] bg-[#0F172A] p-4 hover:border-cyan-500/30 transition-colors duration-300"
              >
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-2xl leading-none">{site.flag}</span>
                  <h3 className="font-[family-name:var(--font-outfit)] text-sm font-semibold text-[#E2E8F0] leading-snug">
                    {site.name}
                  </h3>
                </div>
                <p className="text-xs text-[#94A3B8] mb-1.5 flex items-center gap-1">
                  <MapPin size={11} className="shrink-0" />
                  {site.location}
                </p>
                <p className="text-xs text-indigo-400 font-medium">{site.operators}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/*  DATA ATTRIBUTION                                            */}
        {/* ============================================================ */}
        <div className="text-center pb-10">
          <p className="text-xs text-[#94A3B8]">
            Launch data provided by{" "}
            <a
              href="https://thespacedevs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              The Space Devs
            </a>{" "}
            Launch Library 2 API. Data refreshes every 5 minutes.
          </p>
        </div>
      </div>
    </main>
  );
}
