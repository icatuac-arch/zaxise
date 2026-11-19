"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { useTheme } from "@/components/time/ThemeProvider";
import MarsHome from "@/components/time/MarsHome";
import {
  Globe,
  ArrowLeftRight,
  Users,
  CalendarDays,
  Timer,
  Telescope,
  Satellite,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Clock,
  Rocket,
  Star,
  MapPin,
  Zap,
  Cloud,
  ChevronDown,
  Plus,
  X,
  Play,
  Pause,
  RotateCcw,
  Heart,
  Calculator,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

// ─── Live Clock Component ────────────────────────────────────
function LiveClock({ timezone }: { timezone: string }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [timezone]);
  return (
    <span className="font-mono text-5xl sm:text-6xl font-bold text-white tabular-nums tracking-tight">
      {time || "--:--:--"}
    </span>
  );
}

// ─── Analog Clock Component (premium country-themed) ─────────
function AnalogClock({ timezone, colors, size = 120 }: { timezone: string; colors: string[]; size?: number }) {
  const [angles, setAngles] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const str = now.toLocaleString("en-US", { timeZone: timezone, hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const [h, m, s] = str.split(":").map(Number);
      setAngles({
        h: ((h % 12) + m / 60) * 30,
        m: (m + s / 60) * 6,
        s: s * 6,
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [timezone]);

  const r = size / 2;
  const ringR = r - 4;
  const faceR = r - 10;

  // Arc path helper
  function arcPath(startDeg: number, endDeg: number, radius: number): string {
    const cx = r, cy = r;
    const s = (startDeg - 90) * Math.PI / 180;
    const e = (endDeg - 90) * Math.PI / 180;
    const x1 = cx + radius * Math.cos(s);
    const y1 = cy + radius * Math.sin(s);
    const x2 = cx + radius * Math.cos(e);
    const y2 = cy + radius * Math.sin(e);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ aspectRatio: "1/1", display: "block" }}>
      {/* Outer glow */}
      <circle cx={r} cy={r} r={r - 1} fill="none" stroke={colors[0]} strokeWidth={1} opacity={0.3} />
      {/* Flag color ring — 3 equal arcs */}
      <path d={arcPath(0, 120, ringR)} fill="none" stroke={colors[0]} strokeWidth={5} strokeLinecap="butt" />
      <path d={arcPath(120, 240, ringR)} fill="none" stroke={colors[1]} strokeWidth={5} strokeLinecap="butt" />
      <path d={arcPath(240, 360, ringR)} fill="none" stroke={colors[2]} strokeWidth={5} strokeLinecap="butt" />
      {/* Clock face with subtle gradient */}
      <circle cx={r} cy={r} r={faceR} fill="#0F172A" />
      <circle cx={r} cy={r} r={faceR} fill="url(#faceGrad)" opacity={0.3} />
      <defs>
        <radialGradient id="faceGrad">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      {/* Hour markers */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const isMain = i % 3 === 0;
        const inner = faceR - (isMain ? 12 : 7);
        const outer = faceR - 3;
        return (
          <line
            key={i}
            x1={r + inner * Math.cos(angle)} y1={r + inner * Math.sin(angle)}
            x2={r + outer * Math.cos(angle)} y2={r + outer * Math.sin(angle)}
            stroke={isMain ? "#E2E8F0" : "#475569"} strokeWidth={isMain ? 2.5 : 1} strokeLinecap="round"
          />
        );
      })}
      {/* Minute tick marks */}
      {Array.from({ length: 60 }).map((_, i) => {
        if (i % 5 === 0) return null;
        const angle = (i * 6 - 90) * (Math.PI / 180);
        const inner = faceR - 3;
        const outer = faceR - 1;
        return (
          <line
            key={`m${i}`}
            x1={r + inner * Math.cos(angle)} y1={r + inner * Math.sin(angle)}
            x2={r + outer * Math.cos(angle)} y2={r + outer * Math.sin(angle)}
            stroke="#334155" strokeWidth={0.5}
          />
        );
      })}
      {/* Hour hand — tapered */}
      <polygon
        points={`${r},${r - 3} ${r + (faceR * 0.5) * Math.sin((angles.h * Math.PI) / 180)},${r - (faceR * 0.5) * Math.cos((angles.h * Math.PI) / 180)} ${r},${r + 3}`}
        fill="#F1F5F9"
      />
      {/* Minute hand — tapered */}
      <polygon
        points={`${r},${r - 2} ${r + (faceR * 0.72) * Math.sin((angles.m * Math.PI) / 180)},${r - (faceR * 0.72) * Math.cos((angles.m * Math.PI) / 180)} ${r},${r + 2}`}
        fill="#CBD5E1"
      />
      {/* Second hand — thin with tail */}
      <line
        x1={r - (faceR * 0.2) * Math.sin((angles.s * Math.PI) / 180)}
        y1={r + (faceR * 0.2) * Math.cos((angles.s * Math.PI) / 180)}
        x2={r + (faceR * 0.78) * Math.sin((angles.s * Math.PI) / 180)}
        y2={r - (faceR * 0.78) * Math.cos((angles.s * Math.PI) / 180)}
        stroke={colors[0]} strokeWidth={1.5} strokeLinecap="round"
      />
      {/* Center cap */}
      <circle cx={r} cy={r} r={4} fill={colors[0]} />
      <circle cx={r} cy={r} r={2} fill="#0F172A" />
    </svg>
  );
}

// ─── Digital Time (inline, no card) ───���──────────────────────
function DigitalTime({ tz }: { tz: string }) {
  const [time, setTime] = useState({ h: "--", m: "--", s: "--", ampm: "", date: "" });
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
      const parts = timeStr.match(/(\d+):(\d+):(\d+)\s*(AM|PM)/i);
      const dateStr = now.toLocaleDateString("en-US", { timeZone: tz, weekday: "short", month: "short", day: "numeric" });
      if (parts) setTime({ h: parts[1], m: parts[2], s: parts[3], ampm: parts[4], date: dateStr });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [tz]);

  return (
    <>
      <div className="flex items-baseline justify-center gap-0.5">
        <span className="font-mono text-xl font-bold text-white tabular-nums">{time.h}</span>
        <span className="font-mono text-xl font-bold text-primary animate-pulse">:</span>
        <span className="font-mono text-xl font-bold text-white tabular-nums">{time.m}</span>
        <span className="font-mono text-sm text-muted tabular-nums ml-0.5">:{time.s}</span>
        <span className="text-[9px] font-bold text-secondary ml-1">{time.ampm}</span>
      </div>
      <p className="mt-1 text-[10px] text-muted-dark">{time.date}</p>
    </>
  );
}

// ─── World Clock Row ─────────────────────────────────────────
// Map timezone to city name + flag for the user's local clock
const TZ_TO_CITY: Record<string, { city: string; flag: string; colors: string[] }> = {
  "America/Los_Angeles": { city: "San Jose", flag: "🇺🇸", colors: ["#3C3B6E", "#B22234", "#FFFFFF"] },
  "America/New_York": { city: "New York", flag: "🇺🇸", colors: ["#3C3B6E", "#B22234", "#FFFFFF"] },
  "America/Chicago": { city: "Chicago", flag: "🇺🇸", colors: ["#3C3B6E", "#B22234", "#FFFFFF"] },
  "America/Denver": { city: "Denver", flag: "🇺🇸", colors: ["#3C3B6E", "#B22234", "#FFFFFF"] },
  "Europe/London": { city: "London", flag: "🇬🇧", colors: ["#012169", "#C8102E", "#FFFFFF"] },
  "Europe/Paris": { city: "Paris", flag: "🇫🇷", colors: ["#002395", "#ED2939", "#FFFFFF"] },
  "Europe/Berlin": { city: "Berlin", flag: "🇩🇪", colors: ["#000000", "#DD0000", "#FFCE00"] },
  "Asia/Kolkata": { city: "Mumbai", flag: "🇮🇳", colors: ["#FF9933", "#138808", "#FFFFFF"] },
  "Asia/Tokyo": { city: "Tokyo", flag: "🇯🇵", colors: ["#BC002D", "#FFFFFF", "#BC002D"] },
  "Asia/Shanghai": { city: "Shanghai", flag: "🇨🇳", colors: ["#DE2910", "#FFDE00", "#DE2910"] },
  "Asia/Dubai": { city: "Dubai", flag: "🇦🇪", colors: ["#00732F", "#FF0000", "#FFFFFF"] },
  "Asia/Singapore": { city: "Singapore", flag: "🇸🇬", colors: ["#ED2939", "#FFFFFF", "#ED2939"] },
  "Australia/Sydney": { city: "Sydney", flag: "🇦🇺", colors: ["#00008B", "#FFFFFF", "#FF0000"] },
  "Pacific/Auckland": { city: "Auckland", flag: "🇳🇿", colors: ["#00247D", "#CC142B", "#FFFFFF"] },
};

function MiniDigitalTime({ tz }: { tz: string }) {
  const [time, setTime] = useState("");
  const [dayDate, setDayDate] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit", hour12: true }));
      setDayDate(now.toLocaleDateString("en-US", { timeZone: tz, weekday: "short", month: "short", day: "numeric" }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [tz]);
  return (
    <div className="text-center mt-0.5">
      <p className="font-mono text-xs font-bold text-white/90">{time || "--:--"}</p>
      <p className="text-[9px] text-muted/70">{dayDate}</p>
    </div>
  );
}

const DEFAULT_WORLD_CLOCKS = [
  { city: "New York", tz: "America/New_York", flag: "🇺🇸", colors: ["#3C3B6E", "#B22234", "#FFFFFF"] },
  { city: "London", tz: "Europe/London", flag: "🇬🇧", colors: ["#012169", "#C8102E", "#FFFFFF"] },
  { city: "Paris", tz: "Europe/Paris", flag: "🇫🇷", colors: ["#002395", "#ED2939", "#FFFFFF"] },
  { city: "Moscow", tz: "Europe/Moscow", flag: "🇷🇺", colors: ["#FFFFFF", "#0039A6", "#D52B1E"] },
  { city: "Dubai", tz: "Asia/Dubai", flag: "🇦🇪", colors: ["#00732F", "#FF0000", "#FFFFFF"] },
  { city: "Mumbai", tz: "Asia/Kolkata", flag: "🇮🇳", colors: ["#FF9933", "#138808", "#FFFFFF"] },
  { city: "Singapore", tz: "Asia/Singapore", flag: "🇸🇬", colors: ["#ED2939", "#FFFFFF", "#ED2939"] },
  { city: "Shanghai", tz: "Asia/Shanghai", flag: "🇨🇳", colors: ["#DE2910", "#FFDE00", "#DE2910"] },
  { city: "Tokyo", tz: "Asia/Tokyo", flag: "🇯🇵", colors: ["#BC002D", "#FFFFFF", "#BC002D"] },
  { city: "Sydney", tz: "Australia/Sydney", flag: "🇦🇺", colors: ["#00008B", "#FFFFFF", "#FF0000"] },
];

function DigitalClockCard({ city, tz, flag }: { city: string; tz: string; flag: string }) {
  const [time, setTime] = useState({ h: "--", m: "--", s: "--", ampm: "", date: "" });
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
      const parts = timeStr.match(/(\d+):(\d+):(\d+)\s*(AM|PM)/i);
      const dateStr = now.toLocaleDateString("en-US", { timeZone: tz, weekday: "short", month: "short", day: "numeric" });
      if (parts) {
        setTime({ h: parts[1], m: parts[2], s: parts[3], ampm: parts[4], date: dateStr });
      }
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [tz]);

  return (
    <div className="rounded-xl border border-card-border bg-gradient-to-b from-card-bg/60 to-card-bg/30 p-4 text-center backdrop-blur-sm">
      <div className="flex items-center justify-center gap-1.5 mb-2">
        <span className="text-base">{flag}</span>
        <span className="text-xs font-medium text-muted">{city}</span>
      </div>
      <div className="flex items-baseline justify-center gap-0.5">
        <span className="font-mono text-2xl sm:text-3xl font-bold text-white tabular-nums">{time.h}</span>
        <span className="font-mono text-2xl sm:text-3xl font-bold text-primary animate-pulse">:</span>
        <span className="font-mono text-2xl sm:text-3xl font-bold text-white tabular-nums">{time.m}</span>
        <span className="font-mono text-base sm:text-lg text-muted tabular-nums ml-0.5">:{time.s}</span>
        <span className="text-[10px] font-bold text-secondary ml-1">{time.ampm}</span>
      </div>
      <p className="mt-1.5 text-[11px] text-muted-dark">{time.date}</p>
    </div>
  );
}

// ─── Today's Sky Widget ──────────────────────────────────────
function TodaySky() {
  const [data, setData] = useState<{ moonPhase: string; moonEmoji: string; dayLength: string; sunrise: string; sunset: string } | null>(null);

  useEffect(() => {
    // Calculate approximate moon phase
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    // Simple moon phase calculation
    const c = Math.floor(365.25 * year) + Math.floor(30.6 * month) + day - 694039.09;
    const phase = (c / 29.5305882) % 1;
    let moonPhase: string;
    let moonEmoji: string;
    if (phase < 0.03 || phase > 0.97) { moonPhase = "New Moon"; moonEmoji = "🌑"; }
    else if (phase < 0.22) { moonPhase = "Waxing Crescent"; moonEmoji = "🌒"; }
    else if (phase < 0.28) { moonPhase = "First Quarter"; moonEmoji = "🌓"; }
    else if (phase < 0.47) { moonPhase = "Waxing Gibbous"; moonEmoji = "🌔"; }
    else if (phase < 0.53) { moonPhase = "Full Moon"; moonEmoji = "🌕"; }
    else if (phase < 0.72) { moonPhase = "Waning Gibbous"; moonEmoji = "🌖"; }
    else if (phase < 0.78) { moonPhase = "Last Quarter"; moonEmoji = "🌗"; }
    else { moonPhase = "Waning Crescent"; moonEmoji = "🌘"; }

    // Approximate sunrise/sunset for user's latitude (rough)
    const dayOfYear = Math.floor((now.getTime() - new Date(year, 0, 0).getTime()) / 86400000);
    const hoursOfLight = 12 + 2.5 * Math.sin((dayOfYear - 80) * (2 * Math.PI / 365));
    const sunrise = `${Math.floor(12 - hoursOfLight / 2)}:${String(Math.round((12 - hoursOfLight / 2) % 1 * 60)).padStart(2, "0")} AM`;
    const sunset = `${Math.floor(12 + hoursOfLight / 2) - 12}:${String(Math.round((12 + hoursOfLight / 2) % 1 * 60)).padStart(2, "0")} PM`;
    const dayLength = `${Math.floor(hoursOfLight)}h ${Math.round((hoursOfLight % 1) * 60)}m`;

    setData({ moonPhase, moonEmoji, dayLength, sunrise, sunset });
  }, []);

  if (!data) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="flex items-center gap-3 rounded-xl border border-card-border bg-card-bg/40 px-4 py-3">
        <span className="text-2xl">{data.moonEmoji}</span>
        <div>
          <p className="text-xs text-muted">Moon Phase</p>
          <p className="text-sm font-medium text-white">{data.moonPhase}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-card-border bg-card-bg/40 px-4 py-3">
        <Sunrise className="w-6 h-6 text-amber-400" />
        <div>
          <p className="text-xs text-muted">Sunrise</p>
          <p className="text-sm font-medium text-white">{data.sunrise}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-card-border bg-card-bg/40 px-4 py-3">
        <Sunset className="w-6 h-6 text-orange-400" />
        <div>
          <p className="text-xs text-muted">Sunset</p>
          <p className="text-sm font-medium text-white">{data.sunset}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-card-border bg-card-bg/40 px-4 py-3">
        <Sun className="w-6 h-6 text-yellow-400" />
        <div>
          <p className="text-xs text-muted">Day Length</p>
          <p className="text-sm font-medium text-white">{data.dayLength}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Hero Section (time + weather + location) ───────────────
// ─── Hero Fact (random mind-blowing fact — shared across all themes) ──
import { HERO_FACTS } from '@/lib/time/facts';

function HeroFact() {
  const [fact, setFact] = useState("");
  useEffect(() => {
    setFact(HERO_FACTS[Math.floor(Math.random() * HERO_FACTS.length)]);
  }, []);
  if (!fact) return null;
  return (
    <div className="mt-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-rose-500/15 border-2 border-amber-500/40 px-5 py-3 max-w-2xl shadow-lg shadow-amber-500/5">
      <p className="text-sm text-white/90 leading-relaxed">
        <span className="font-bold text-amber-300 mr-2">🤯 Did you know?</span>
        {fact}
      </p>
    </div>
  );
}

const LOCATION_PRESETS = [
  { label: "San Jose", tz: "America/Los_Angeles" },
  { label: "New York", tz: "America/New_York" },
  { label: "London", tz: "Europe/London" },
  { label: "Paris", tz: "Europe/Paris" },
  { label: "Dubai", tz: "Asia/Dubai" },
  { label: "Mumbai", tz: "Asia/Kolkata" },
  { label: "Tokyo", tz: "Asia/Tokyo" },
  { label: "Sydney", tz: "Australia/Sydney" },
  { label: "Singapore", tz: "Asia/Singapore" },
  { label: "Berlin", tz: "Europe/Berlin" },
  { label: "Toronto", tz: "America/Toronto" },
  { label: "Seoul", tz: "Asia/Seoul" },
];

function HeroSection({ userTz, dateStr, weekNum }: { userTz: string | null; dateStr: string; weekNum: number }) {
  const [weather, setWeather] = useState<{ temp: number; desc: string; humidity: number; wind: number } | null>(null);
  const [locationOpen, setLocationOpen] = useState(false);
  const [cityName, setCityName] = useState("");
  const tz = userTz || "America/New_York";

  useEffect(() => {
    const preset = LOCATION_PRESETS.find(l => l.tz === tz);
    const city = preset?.label || tz.split('/').pop()?.replace(/_/g, ' ') || 'London';
    setCityName(city);
    fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`)
      .then(r => r.json())
      .then(data => {
        const c = data.current_condition[0];
        setWeather({
          temp: parseInt(c.temp_C),
          desc: c.weatherDesc[0].value,
          humidity: parseInt(c.humidity),
          wind: parseInt(c.windspeedKmph),
        });
      })
      .catch(() => {});
  }, [tz]);

  const getWeatherEmoji = (d: string) => {
    const desc = d.toLowerCase();
    if (desc.includes('rain')) return '🌧️';
    if (desc.includes('cloud') || desc.includes('overcast')) return '☁️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('thunder')) return '⛈️';
    if (desc.includes('clear') || desc.includes('sunny')) return '☀️';
    if (desc.includes('fog') || desc.includes('mist')) return '🌫️';
    return '🌤️';
  };

  const changeLocation = (newTz: string) => {
    // Store in localStorage and reload
    localStorage.setItem('dateandtimezone_tz_override', newTz);
    setLocationOpen(false);
    window.location.reload();
  };

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-primary/8 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-5 pb-4 sm:px-6 sm:pt-8 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Live Clock */}
          <LiveClock timezone={tz} />
          <p className="mt-3 text-base text-muted">{dateStr}</p>

          {/* Location + Week + Weather row */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm">
            {/* Location with changer */}
            <div className="relative">
              <button
                onClick={() => setLocationOpen(!locationOpen)}
                className="flex items-center gap-1.5 text-muted-dark hover:text-white transition-colors rounded-lg px-3 py-1.5 border border-transparent hover:border-card-border"
              >
                <MapPin className="w-3.5 h-3.5 text-secondary" />
                <span>{cityName}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${locationOpen ? 'rotate-180' : ''}`} />
              </button>

              {locationOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 rounded-xl border border-card-border bg-[#0F172A] shadow-2xl py-2 z-[100]">
                  {LOCATION_PRESETS.map(loc => (
                    <button
                      key={loc.tz}
                      onClick={() => changeLocation(loc.tz)}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-card-bg transition-colors ${loc.tz === tz ? 'text-primary font-medium' : 'text-muted hover:text-white'}`}
                    >
                      {loc.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-muted-dark">·</span>
            <span className="text-muted-dark">Week {weekNum} of 52</span>

            {/* Weather inline */}
            {weather && (
              <>
                <span className="text-muted-dark">·</span>
                <Link href="/weather" className="flex items-center gap-2 rounded-lg px-3 py-1.5 border border-card-border bg-card-bg/40 hover:border-primary/40 transition-colors">
                  <span className="text-lg">{getWeatherEmoji(weather.desc)}</span>
                  <span className="font-bold text-white">{weather.temp}°C</span>
                  <span className="text-xs text-muted capitalize hidden sm:inline">{weather.desc}</span>
                </Link>
              </>
            )}
          </div>

          {/* Did You Know — in hero */}
          <HeroFact />
        </div>
      </div>
    </section>
  );
}

// ─── Weather Widget (standalone, kept for /weather link) ─────
function WeatherWidget({ userTz }: { userTz: string | null }) {
  const [weather, setWeather] = useState<{ temp: number; desc: string; city: string; humidity: number; wind: number } | null>(null);

  useEffect(() => {
    if (!userTz) return;
    const city = userTz.split('/').pop()?.replace(/_/g, ' ') || 'London';
    fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`)
      .then(r => r.json())
      .then(data => {
        const c = data.current_condition[0];
        const area = data.nearest_area[0];
        setWeather({
          temp: parseInt(c.temp_C),
          desc: c.weatherDesc[0].value,
          city: area.areaName[0].value,
          humidity: parseInt(c.humidity),
          wind: parseInt(c.windspeedKmph),
        });
      })
      .catch(() => {});
  }, [userTz]);

  if (!weather) return null;

  const getIcon = (d: string) => {
    const desc = d.toLowerCase();
    if (desc.includes('rain')) return '🌧️';
    if (desc.includes('cloud') || desc.includes('overcast')) return '☁️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('thunder')) return '⛈️';
    if (desc.includes('clear') || desc.includes('sunny')) return '☀️';
    if (desc.includes('fog') || desc.includes('mist')) return '🌫️';
    return '🌤️';
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
          <Cloud className="w-5 h-5 text-sky-400" /> Weather
        </h2>
        <Link href="/weather" className="text-xs text-primary hover:text-primary/80 transition-colors">
          Full weather page →
        </Link>
      </div>
      <div className="rounded-xl border border-card-border bg-card-bg/40 p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{getIcon(weather.desc)}</span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{weather.temp}°C</span>
            </div>
            <p className="text-sm text-muted capitalize">{weather.desc}</p>
            <p className="text-xs text-muted-dark flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{weather.city}</p>
          </div>
        </div>
        <div className="hidden sm:flex gap-6 text-sm text-muted">
          <div className="text-center">
            <p className="text-white font-medium">{weather.humidity}%</p>
            <p className="text-xs">Humidity</p>
          </div>
          <div className="text-center">
            <p className="text-white font-medium">{weather.wind} km/h</p>
            <p className="text-xs">Wind</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Space News Widget ───────────────────────────────────────
function SpaceNewsWidget() {
  const [articles, setArticles] = useState<Array<{ id: number; title: string; url: string; news_site: string; published_at: string }>>([]);

  useEffect(() => {
    fetch('https://api.spaceflightnewsapi.net/v4/articles/?limit=4&ordering=-published_at')
      .then(r => r.json())
      .then(data => setArticles(data.results || []))
      .catch(() => {});
  }, []);

  if (articles.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
          <Rocket className="w-5 h-5 text-orange-400" /> Space News
        </h2>
        <Link href="/news" className="text-xs text-primary hover:text-primary/80 transition-colors">
          All news →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {articles.map(a => (
          <a key={a.id} href={a.url} target="_blank" rel="noopener noreferrer" className="group rounded-xl border border-card-border bg-card-bg/40 p-4 hover:border-primary/40 transition-colors">
            <p className="text-sm font-medium text-white group-hover:text-primary transition-colors line-clamp-2">{a.title}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted">
              <span>{a.news_site}</span>
              <span>·</span>
              <span>{new Date(a.published_at).toLocaleDateString()}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ─── Sky Bar (sunrise, sunset, moon, daylight — below hero) ──
function SkyBar({ userTz }: { userTz: string | null }) {
  const [sky, setSky] = useState<{ moonPhase: string; moonEmoji: string; dayLength: string; sunrise: string; sunset: string } | null>(null);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const c = Math.floor(365.25 * year) + Math.floor(30.6 * (now.getMonth() + 1)) + now.getDate() - 694039.09;
    const phase = (c / 29.5305882) % 1;
    let moonPhase: string, moonEmoji: string;
    if (phase < 0.03 || phase > 0.97) { moonPhase = "New Moon"; moonEmoji = "🌑"; }
    else if (phase < 0.22) { moonPhase = "Waxing Crescent"; moonEmoji = "🌒"; }
    else if (phase < 0.28) { moonPhase = "First Quarter"; moonEmoji = "🌓"; }
    else if (phase < 0.47) { moonPhase = "Waxing Gibbous"; moonEmoji = "🌔"; }
    else if (phase < 0.53) { moonPhase = "Full Moon"; moonEmoji = "🌕"; }
    else if (phase < 0.72) { moonPhase = "Waning Gibbous"; moonEmoji = "🌖"; }
    else if (phase < 0.78) { moonPhase = "Last Quarter"; moonEmoji = "🌗"; }
    else { moonPhase = "Waning Crescent"; moonEmoji = "🌘"; }

    const dayOfYear = Math.floor((now.getTime() - new Date(year, 0, 0).getTime()) / 86400000);
    const hoursOfLight = 12 + 2.5 * Math.sin((dayOfYear - 80) * (2 * Math.PI / 365));
    const sunriseH = 12 - hoursOfLight / 2;
    const sunsetH = 12 + hoursOfLight / 2;
    setSky({
      moonPhase, moonEmoji,
      dayLength: `${Math.floor(hoursOfLight)}h ${Math.round((hoursOfLight % 1) * 60)}m`,
      sunrise: `${Math.floor(sunriseH)}:${String(Math.round((sunriseH % 1) * 60)).padStart(2, '0')} AM`,
      sunset: `${Math.floor(sunsetH) - 12}:${String(Math.round((sunsetH % 1) * 60)).padStart(2, '0')} PM`,
    });
  }, [userTz]);

  if (!sky) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap py-2 px-4 rounded-xl border border-card-border/50 bg-card-bg/20">
        <div className="flex items-center gap-2">
          <span className="text-lg">{sky.moonEmoji}</span>
          <span className="text-xs text-muted">{sky.moonPhase}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sunrise className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-white">{sky.sunrise}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sunset className="w-4 h-4 text-orange-400" />
          <span className="text-xs text-white">{sky.sunset}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sun className="w-4 h-4 text-yellow-400" />
          <span className="text-xs text-muted">{sky.dayLength} daylight</span>
        </div>
      </div>
    </section>
  );
}

// ─── Today Dashboard (sky + day progress + seconds + next event — full box) ─
function TodayDashboard({ userTz }: { userTz: string | null }) {
  const [pct, setPct] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [elapsed, setElapsed] = useState("");
  const [remaining, setRemaining] = useState("");
  const [sky, setSky] = useState<{ moonPhase: string; moonEmoji: string; dayLength: string; sunrise: string; sunset: string } | null>(null);
  const [nextEvent, setNextEvent] = useState<{ name: string; emoji: string; days: number } | null>(null);

  useEffect(() => {
    const tz = userTz || 'America/New_York';
    const update = () => {
      const now = new Date();
      const timeStr = now.toLocaleString('en-US', { timeZone: tz, hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });
      const [h, m, s] = timeStr.split(':').map(Number);
      const totalSec = h * 3600 + m * 60 + s;
      setPct((totalSec / 86400) * 100);
      setSeconds(totalSec);
      setElapsed(`${Math.floor(totalSec / 3600)}h ${Math.floor((totalSec % 3600) / 60)}m`);
      const rem = 86400 - totalSec;
      setRemaining(`${Math.floor(rem / 3600)}h ${Math.floor((rem % 3600) / 60)}m`);
    };
    update();
    const id = setInterval(update, 1000);

    // Moon phase + sky
    const now = new Date();
    const year = now.getFullYear();
    const c = Math.floor(365.25 * year) + Math.floor(30.6 * (now.getMonth() + 1)) + now.getDate() - 694039.09;
    const phase = (c / 29.5305882) % 1;
    let moonPhase: string, moonEmoji: string;
    if (phase < 0.03 || phase > 0.97) { moonPhase = "New Moon"; moonEmoji = "🌑"; }
    else if (phase < 0.22) { moonPhase = "Waxing Crescent"; moonEmoji = "🌒"; }
    else if (phase < 0.28) { moonPhase = "First Quarter"; moonEmoji = "🌓"; }
    else if (phase < 0.47) { moonPhase = "Waxing Gibbous"; moonEmoji = "🌔"; }
    else if (phase < 0.53) { moonPhase = "Full Moon"; moonEmoji = "🌕"; }
    else if (phase < 0.72) { moonPhase = "Waning Gibbous"; moonEmoji = "🌖"; }
    else if (phase < 0.78) { moonPhase = "Last Quarter"; moonEmoji = "🌗"; }
    else { moonPhase = "Waning Crescent"; moonEmoji = "🌘"; }

    const dayOfYear = Math.floor((now.getTime() - new Date(year, 0, 0).getTime()) / 86400000);
    const hoursOfLight = 12 + 2.5 * Math.sin((dayOfYear - 80) * (2 * Math.PI / 365));
    const sunriseH = 12 - hoursOfLight / 2;
    const sunsetH = 12 + hoursOfLight / 2;
    setSky({
      moonPhase, moonEmoji,
      dayLength: `${Math.floor(hoursOfLight)}h ${Math.round((hoursOfLight % 1) * 60)}m`,
      sunrise: `${Math.floor(sunriseH)}:${String(Math.round((sunriseH % 1) * 60)).padStart(2, '0')} AM`,
      sunset: `${Math.floor(sunsetH) - 12}:${String(Math.round((sunsetH % 1) * 60)).padStart(2, '0')} PM`,
    });

    // Next event
    const events = [
      { name: "Summer Solstice", date: new Date(year, 5, 21), emoji: "☀️" },
      { name: "Autumn Equinox", date: new Date(year, 8, 22), emoji: "🍂" },
      { name: "Winter Solstice", date: new Date(year, 11, 21), emoji: "❄️" },
      { name: "Perseid Meteors", date: new Date(year, 7, 12), emoji: "☄️" },
      { name: "Geminid Meteors", date: new Date(year, 11, 14), emoji: "🌠" },
    ];
    const upcoming = events.filter(e => e.date > now).sort((a, b) => a.date.getTime() - b.date.getTime());
    if (upcoming[0]) {
      const days = Math.floor((upcoming[0].date.getTime() - now.getTime()) / 86400000);
      setNextEvent({ name: upcoming[0].name, emoji: upcoming[0].emoji, days });
    }

    return () => clearInterval(id);
  }, [userTz]);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-card-border bg-card-bg/30 p-4 space-y-3">
        {/* Day progress bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted">🌅 {elapsed} elapsed · {seconds.toLocaleString()} seconds</span>
            <span className="text-xs font-medium text-white">{pct.toFixed(0)}% of day</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-amber-400 transition-all duration-1000" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-muted">Midnight</span>
            <span className="text-[10px] text-muted">{remaining} remaining 🌙</span>
          </div>
        </div>

        {/* Sky + Next Event row */}
        {sky && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{sky.moonEmoji}</span>
              <div>
                <p className="text-[10px] text-muted">Moon</p>
                <p className="text-xs font-medium text-white">{sky.moonPhase}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sunrise className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-[10px] text-muted">Sunrise</p>
                <p className="text-xs font-medium text-white">{sky.sunrise}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sunset className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-[10px] text-muted">Sunset</p>
                <p className="text-xs font-medium text-white">{sky.sunset}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-[10px] text-muted">Daylight</p>
                <p className="text-xs font-medium text-white">{sky.dayLength}</p>
              </div>
            </div>
            {nextEvent && (
              <div className="flex items-center gap-2">
                <span className="text-xl">{nextEvent.emoji}</span>
                <div>
                  <p className="text-[10px] text-muted">{nextEvent.name}</p>
                  <p className="text-xs font-medium text-white">in {nextEvent.days} days</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── World Activity Ticker ──────────────────────────────────
const TICKER_CITIES = [
  { city: "Tokyo", flag: "\u{1F1EF}\u{1F1F5}", tz: "Asia/Tokyo" },
  { city: "Mumbai", flag: "\u{1F1EE}\u{1F1F3}", tz: "Asia/Kolkata" },
  { city: "Dubai", flag: "\u{1F1E6}\u{1F1EA}", tz: "Asia/Dubai" },
  { city: "London", flag: "\u{1F1EC}\u{1F1E7}", tz: "Europe/London" },
  { city: "New York", flag: "\u{1F1FA}\u{1F1F8}", tz: "America/New_York" },
  { city: "Los Angeles", flag: "\u{1F1FA}\u{1F1F8}", tz: "America/Los_Angeles" },
  { city: "Sydney", flag: "\u{1F1E6}\u{1F1FA}", tz: "Australia/Sydney" },
  { city: "Paris", flag: "\u{1F1EB}\u{1F1F7}", tz: "Europe/Paris" },
  { city: "Singapore", flag: "\u{1F1F8}\u{1F1EC}", tz: "Asia/Singapore" },
  { city: "São Paulo", flag: "\u{1F1E7}\u{1F1F7}", tz: "America/Sao_Paulo" },
];

function getActivityForHour(hour: number): string {
  if (hour >= 0 && hour < 5) return "Sleeping";
  if (hour >= 5 && hour < 7) return "Early risers up";
  if (hour >= 7 && hour < 9) return "Morning commute";
  if (hour >= 9 && hour < 12) return "Working";
  if (hour >= 12 && hour < 14) return "Lunch break";
  if (hour >= 14 && hour < 17) return "Afternoon work";
  if (hour >= 17 && hour < 19) return "Evening rush";
  if (hour >= 19 && hour < 21) return "Dinner time";
  if (hour >= 21 && hour < 23) return "Winding down";
  return "Late night";
}

function WorldActivityTicker() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const result = TICKER_CITIES.map(({ city, flag, tz }) => {
        const timeStr = now.toLocaleTimeString("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit", hour12: true });
        const hourStr = now.toLocaleString("en-US", { timeZone: tz, hour: "numeric", hour12: false });
        const hour = parseInt(hourStr);
        const activity = getActivityForHour(hour);
        return `${flag} ${city}: ${activity} (${timeStr})`;
      });
      setItems(result);
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  if (items.length === 0) return null;

  const tickerText = items.join("  \u00B7  ");

  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-card-border/50 bg-card-bg/20 overflow-hidden py-2">
        <div className="relative overflow-hidden">
          <div className="ticker-scroll flex whitespace-nowrap">
            <span className="inline-block text-xs text-muted px-4">{tickerText}</span>
            <span className="inline-block text-xs text-muted px-4">{tickerText}</span>
          </div>
        </div>
      </div>
      <style jsx>{`
        .ticker-scroll {
          animation: ticker-scroll 45s linear infinite;
        }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

// ─── Daily Streak Counter ───────────────────────────────────
function DailyStreakCounter() {
  const [streak, setStreak] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const lastVisit = localStorage.getItem("dateandtimezone_last_visit");
    const storedStreak = parseInt(localStorage.getItem("dateandtimezone_streak") || "0");

    if (lastVisit === today) {
      // Already visited today
      setStreak(storedStreak);
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      let newStreak: number;
      if (lastVisit === yesterdayStr) {
        newStreak = storedStreak + 1;
      } else {
        newStreak = 1;
      }

      localStorage.setItem("dateandtimezone_last_visit", today);
      localStorage.setItem("dateandtimezone_streak", String(newStreak));
      setStreak(newStreak);

      // Update achievement for 7-day streak
      if (newStreak >= 7) {
        localStorage.setItem("dateandtimezone_badge_on_fire", "true");
      }
    }
  }, []);

  useEffect(() => {
    if (streak >= 365) setMessage("Legendary! A full year!");
    else if (streak >= 100) setMessage("Triple digits! Incredible!");
    else if (streak >= 30) setMessage("30 days! You're dedicated!");
    else if (streak >= 14) setMessage("Two weeks strong!");
    else if (streak >= 7) setMessage("One week! Keep it up!");
    else if (streak >= 3) setMessage("Building momentum!");
    else setMessage("");
  }, [streak]);

  // Flame size grows with streak
  const flameSize = streak >= 30 ? "text-3xl" : streak >= 7 ? "text-2xl" : "text-xl";

  return (
    <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-card-border bg-card-bg/40 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`${flameSize} ${streak >= 7 ? "animate-pulse" : ""}`}>
            {streak >= 30 ? "\u{1F525}\u{1F525}\u{1F525}" : streak >= 7 ? "\u{1F525}\u{1F525}" : "\u{1F525}"}
          </span>
          <div>
            <p className="text-sm font-medium text-white">
              {streak}-day streak!
            </p>
            {message && <p className="text-xs text-muted mt-0.5">{message}</p>}
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white font-mono">{streak}</p>
          <p className="text-[10px] text-muted">days</p>
        </div>
      </div>
    </section>
  );
}

// ─── Achievement Badges ─────────────────────────────────────
const BADGE_DEFINITIONS = [
  { id: "night_owl", emoji: "\u{1F319}", name: "Night Owl", desc: "Visited between midnight and 5 AM", storageKey: "dateandtimezone_badge_night_owl" },
  { id: "globe_trotter", emoji: "\u{1F30D}", name: "Globe Trotter", desc: "Checked 10+ different timezones", storageKey: "dateandtimezone_badge_globe_trotter" },
  { id: "quiz_master", emoji: "\u{1F9E0}", name: "Quiz Master", desc: "Scored 10/10 on any quiz", storageKey: "dateandtimezone_badge_quiz_master" },
  { id: "on_fire", emoji: "\u{1F525}", name: "On Fire", desc: "7-day visit streak", storageKey: "dateandtimezone_badge_on_fire" },
  { id: "space_fan", emoji: "\u{1F6F0}\u{FE0F}", name: "Space Fan", desc: "Visited ISS tracker 3+ times", storageKey: "dateandtimezone_badge_space_fan" },
  { id: "speed_demon", emoji: "\u26A1", name: "Speed Demon", desc: "Answered quiz question in under 3 seconds", storageKey: "dateandtimezone_badge_speed_demon" },
];

function AchievementBadges() {
  const [unlockedKeys, setUnlockedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Check which badges are unlocked
    const unlocked = new Set<string>();
    BADGE_DEFINITIONS.forEach(badge => {
      if (localStorage.getItem(badge.storageKey) === "true") {
        unlocked.add(badge.id);
      }
    });

    // Check Night Owl on current visit
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) {
      localStorage.setItem("dateandtimezone_badge_night_owl", "true");
      unlocked.add("night_owl");
    }

    // Check streak for On Fire
    const streak = parseInt(localStorage.getItem("dateandtimezone_streak") || "0");
    if (streak >= 7) {
      localStorage.setItem("dateandtimezone_badge_on_fire", "true");
      unlocked.add("on_fire");
    }

    setUnlockedKeys(unlocked);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-card-border bg-card-bg/40 p-4">
        <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-400" /> Achievements
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {BADGE_DEFINITIONS.map(badge => {
            const isUnlocked = unlockedKeys.has(badge.id);
            return (
              <div
                key={badge.id}
                className={`rounded-lg border p-3 text-center transition-all ${
                  isUnlocked
                    ? "border-yellow-500/40 bg-yellow-500/10 shadow-sm shadow-yellow-500/10"
                    : "border-card-border/50 bg-card-bg/20 opacity-50 grayscale"
                }`}
              >
                <span className={`text-2xl block ${isUnlocked ? "animate-bounce" : ""}`} style={isUnlocked ? { animationDuration: "2s" } : {}}>
                  {isUnlocked ? badge.emoji : "\u{1F512}"}
                </span>
                <p className={`text-[11px] font-medium mt-1 ${isUnlocked ? "text-white" : "text-muted"}`}>
                  {isUnlocked ? badge.name : "???"}
                </p>
                <p className="text-[9px] text-muted mt-0.5 leading-tight">
                  {isUnlocked ? badge.desc : "Keep exploring!"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Live Pulse (animated counters) ──────────────────────────
function LivePulse() {
  const [seconds, setSeconds] = useState(0);
  const [earthKm, setEarthKm] = useState(0);

  useEffect(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const secToday = Math.floor((now.getTime() - startOfDay.getTime()) / 1000);
    setSeconds(secToday);
    // Earth travels ~30 km/s around the Sun
    setEarthKm(secToday * 30);

    const id = setInterval(() => {
      setSeconds(prev => prev + 1);
      setEarthKm(prev => prev + 30);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-card-border bg-card-bg/40 p-3 text-center">
          <p className="font-mono text-lg sm:text-xl font-bold text-white tabular-nums">{seconds.toLocaleString()}</p>
          <p className="text-[10px] text-muted mt-1">Seconds elapsed today</p>
        </div>
        <div className="rounded-xl border border-card-border bg-card-bg/40 p-3 text-center">
          <p className="font-mono text-lg sm:text-xl font-bold text-emerald-400 tabular-nums">{Math.floor(earthKm / 1000).toLocaleString()}k</p>
          <p className="text-[10px] text-muted mt-1">km Earth traveled today</p>
        </div>
        <div className="rounded-xl border border-card-border bg-card-bg/40 p-3 text-center">
          <ISSPosition />
        </div>
      </div>
    </section>
  );
}

function ISSPosition() {
  const [info, setInfo] = useState<{ region: string; speed: string } | null>(null);
  useEffect(() => {
    fetch('https://api.wheretheithiss.at/v1/satellites/25544')
      .then(r => r.json())
      .then(data => {
        const latN = data.latitude;
        const lngN = data.longitude;
        let region = "Pacific Ocean 🌊";
        if (latN > 15 && latN < 55 && lngN > -130 && lngN < -60) region = "North America 🌎";
        else if (latN > -55 && latN < 15 && lngN > -80 && lngN < -35) region = "South America 🌎";
        else if (latN > 35 && latN < 72 && lngN > -10 && lngN < 40) region = "Europe 🌍";
        else if (latN > -35 && latN < 37 && lngN > -20 && lngN < 55) region = "Africa 🌍";
        else if (latN > 5 && latN < 55 && lngN > 40 && lngN < 150) region = "Asia 🌏";
        else if (latN > -50 && latN < -10 && lngN > 110 && lngN < 180) region = "Australia 🌏";
        else if (latN > -70 && latN < -50) region = "Antarctica 🧊";
        else if (lngN > -180 && lngN < -130) region = "Pacific Ocean 🌊";
        else if (lngN > 150 && lngN < 180) region = "Pacific Ocean 🌊";
        else if (latN > 55 && lngN > -60 && lngN < 0) region = "Atlantic Ocean 🌊";
        else if (latN > 0 && latN < 35 && lngN > 55 && lngN < 100) region = "Indian Ocean 🌊";
        const speed = data.velocity ? `${Math.round(data.velocity)} km/h` : "27,600 km/h";
        setInfo({ region, speed });
      })
      .catch(() => setInfo({ region: "Orbiting Earth 🌍", speed: "27,600 km/h" }));
  }, []);
  return (
    <>
      <p className="text-lg">🛰️</p>
      <p className="text-[10px] text-white font-medium mt-0.5">{info?.region || "Loading..."}</p>
      <p className="text-[9px] text-muted">{info?.speed || ""}</p>
    </>
  );
}

// ─── Day Progress ────────────────────────────────────────────
function DayProgress({ userTz }: { userTz: string | null }) {
  const [pct, setPct] = useState(0);
  const [elapsed, setElapsed] = useState("");
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const tz = userTz || 'America/New_York';
      const timeStr = now.toLocaleString('en-US', { timeZone: tz, hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });
      const [h, m, s] = timeStr.split(':').map(Number);
      const totalSec = h * 3600 + m * 60 + s;
      const dayPct = (totalSec / 86400) * 100;
      setPct(dayPct);
      const elH = Math.floor(totalSec / 3600);
      const elM = Math.floor((totalSec % 3600) / 60);
      setElapsed(`${elH}h ${elM}m`);
      const remSec = 86400 - totalSec;
      const remH = Math.floor(remSec / 3600);
      const remM = Math.floor((remSec % 3600) / 60);
      setRemaining(`${remH}h ${remM}m`);
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, [userTz]);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-card-border bg-card-bg/40 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted">Your day so far</span>
          <span className="text-xs text-white font-medium">{pct.toFixed(0)}% complete</span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-amber-400 transition-all duration-1000"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-muted">
          <span>🌅 {elapsed} elapsed</span>
          <span>{remaining} remaining 🌙</span>
        </div>
      </div>
    </section>
  );
}

// ─── Next Big Event Countdown ────────────────────────────────
function NextEventCountdown() {
  const [event, setEvent] = useState<{ name: string; date: Date; emoji: string; days: number; hours: number } | null>(null);

  useEffect(() => {
    const now = new Date();
    const events = [
      { name: "Summer Solstice", date: new Date(now.getFullYear(), 5, 21), emoji: "☀️" },
      { name: "Autumn Equinox", date: new Date(now.getFullYear(), 8, 22), emoji: "🍂" },
      { name: "Winter Solstice", date: new Date(now.getFullYear(), 11, 21), emoji: "❄️" },
      { name: "Spring Equinox", date: new Date(now.getFullYear() + 1, 2, 20), emoji: "🌸" },
      { name: "Next Solar Eclipse", date: new Date(2026, 7, 12), emoji: "🌑" },
      { name: "Next Lunar Eclipse", date: new Date(2025, 8, 7), emoji: "🌕" },
      { name: "Perseid Meteor Shower", date: new Date(now.getFullYear(), 7, 12), emoji: "☄️" },
      { name: "Geminid Meteor Shower", date: new Date(now.getFullYear(), 11, 14), emoji: "🌠" },
    ];
    // Find next upcoming
    const upcoming = events.filter(e => e.date > now).sort((a, b) => a.date.getTime() - b.date.getTime());
    if (upcoming.length > 0) {
      const next = upcoming[0];
      const diff = next.date.getTime() - now.getTime();
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      setEvent({ ...next, days, hours });
    }
  }, []);

  if (!event) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-violet-500/30 bg-gradient-to-r from-violet-950/40 to-indigo-950/40 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{event.emoji}</span>
          <div>
            <p className="text-sm font-medium text-white">{event.name}</p>
            <p className="text-xs text-muted">{event.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-white">{event.days}<span className="text-sm text-muted ml-1">days</span> {event.hours}<span className="text-sm text-muted ml-1">hrs</span></p>
          <p className="text-[10px] text-violet-300">Next celestial event</p>
        </div>
      </div>
    </section>
  );
}

// ─── On This Day in Space ────────────────────────────────────
const SPACE_HISTORY: Record<string, { year: number; event: string }[]> = {
  "1-1": [{ year: 2019, event: "New Horizons flew past Ultima Thule, the most distant object ever visited" }],
  "1-28": [{ year: 1986, event: "Space Shuttle Challenger disaster — 73 seconds after launch" }],
  "2-1": [{ year: 2003, event: "Space Shuttle Columbia broke apart during re-entry" }],
  "2-20": [{ year: 1962, event: "John Glenn became the first American to orbit Earth" }],
  "3-18": [{ year: 1965, event: "Alexei Leonov performed the first spacewalk (12 minutes)" }],
  "4-12": [{ year: 1961, event: "Yuri Gagarin became the first human in space" }],
  "4-24": [{ year: 1990, event: "Hubble Space Telescope launched into orbit aboard Discovery" }],
  "5-5": [{ year: 1961, event: "Alan Shepard became the first American in space" }],
  "5-25": [{ year: 1961, event: "JFK declared the goal of landing on the Moon before the decade's end" }],
  "6-16": [{ year: 1963, event: "Valentina Tereshkova became the first woman in space" }],
  "7-20": [{ year: 1969, event: "Apollo 11 — Neil Armstrong and Buzz Aldrin walked on the Moon" }],
  "7-4": [{ year: 1997, event: "Mars Pathfinder landed on Mars with Sojourner rover" }],
  "8-6": [{ year: 2012, event: "Curiosity rover landed on Mars" }],
  "8-25": [{ year: 2012, event: "Voyager 1 entered interstellar space" }],
  "9-12": [{ year: 1962, event: "JFK's 'We choose to go to the Moon' speech at Rice University" }],
  "10-4": [{ year: 1957, event: "Sputnik 1 launched — the first artificial satellite" }],
  "10-29": [{ year: 1998, event: "John Glenn returned to space at age 77 on Shuttle Discovery" }],
  "11-3": [{ year: 1957, event: "Laika the dog became the first animal in orbit aboard Sputnik 2" }],
  "11-20": [{ year: 1998, event: "First module of the International Space Station launched" }],
  "12-14": [{ year: 1972, event: "Apollo 17 — last humans walked on the Moon" }],
  "12-21": [{ year: 1968, event: "Apollo 8 launched — first humans to orbit the Moon" }],
  "12-25": [{ year: 2021, event: "James Webb Space Telescope launched" }],
};

function OnThisDayInSpace() {
  const [randomFact, setRandomFact] = useState<{ year: number; event: string } | null>(null);
  const now = new Date();
  const key = `${now.getMonth() + 1}-${now.getDate()}`;
  const todayEvents = SPACE_HISTORY[key];
  const allEvents = Object.values(SPACE_HISTORY).flat();

  useEffect(() => {
    // Pick truly random fact each page load
    setRandomFact(allEvents[Math.floor(Math.random() * allEvents.length)]);
  }, []);

  if (!randomFact) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
      <div className="space-y-3">
        {/* Today's match (if any) */}
        {todayEvents && todayEvents.map((ev, i) => (
          <div key={i} className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-card-bg/60 to-amber-950/20 p-4 flex items-start gap-3">
            <span className="text-2xl mt-0.5">📅</span>
            <div>
              <p className="text-xs text-amber-400 font-medium mb-1">On This Day in Space</p>
              <p className="text-sm text-white">{ev.event}</p>
              <p className="text-[10px] text-muted mt-1">{now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {ev.year}</p>
            </div>
          </div>
        ))}
        {/* Random fact (always shown, different each refresh) */}
        <div className="rounded-xl border border-card-border bg-gradient-to-r from-card-bg/60 to-indigo-950/20 p-4 flex items-start gap-3">
          <span className="text-2xl mt-0.5">🚀</span>
          <div>
            <p className="text-xs text-indigo-400 font-medium mb-1">Did You Know?</p>
            <p className="text-sm text-white">{randomFact.event}</p>
            <p className="text-[10px] text-muted mt-1">{randomFact.year}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Quick Time Challenge ────────────────────────────────────
const QUICK_QUESTIONS = [
  { q: "What is the largest planet in our solar system?", opts: ["Saturn", "Jupiter", "Neptune", "Uranus"], a: "Jupiter", fact: "Jupiter is so large that 1,300 Earths could fit inside!" },
  { q: "How long does light take to travel from the Sun to Earth?", opts: ["8 seconds", "8 minutes", "80 minutes", "8 hours"], a: "8 minutes", fact: "Light travels at 300,000 km/s but the Sun is still 150 million km away." },
  { q: "Which planet rains diamonds?", opts: ["Mars", "Venus", "Neptune", "Mercury"], a: "Neptune", fact: "Extreme pressure turns carbon into diamonds that fall like rain." },
  { q: "How many time zones does Russia span?", opts: ["6", "9", "11", "14"], a: "11", fact: "Russia covers 11 time zones — the most of any country." },
  { q: "What is the hottest planet in our solar system?", opts: ["Mercury", "Venus", "Mars", "Jupiter"], a: "Venus", fact: "Venus (462°C) is hotter than Mercury despite being farther from the Sun — greenhouse effect." },
  { q: "How fast does the ISS orbit Earth?", opts: ["8,000 km/h", "17,500 km/h", "28,000 km/h", "40,000 km/h"], a: "28,000 km/h", fact: "At this speed, astronauts see 16 sunrises every day!" },
  { q: "What year did humans first walk on the Moon?", opts: ["1965", "1967", "1969", "1971"], a: "1969", fact: "Neil Armstrong's first step was on July 20, 1969." },
  { q: "Which country does NOT observe Daylight Saving Time?", opts: ["USA", "Japan", "Germany", "UK"], a: "Japan", fact: "Japan abolished DST in 1952 and hasn't used it since." },
  { q: "How old is the Universe?", opts: ["4.6 billion years", "10.2 billion years", "13.8 billion years", "20 billion years"], a: "13.8 billion years", fact: "Measured from the cosmic microwave background radiation." },
  { q: "A day on Venus is longer than a year on Venus.", opts: ["True", "False", "Same length", "Unknown"], a: "True", fact: "Venus rotates so slowly (243 days) that its day exceeds its orbit (225 days)." },
  { q: "Which Moon phase comes after First Quarter?", opts: ["Full Moon", "Waxing Gibbous", "Waning Crescent", "New Moon"], a: "Waxing Gibbous", fact: "Waxing = growing. Gibbous = more than half lit." },
  { q: "What is the smallest country by area?", opts: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"], a: "Vatican City", fact: "Vatican City is only 0.44 km² — smaller than many golf courses." },
  { q: "How many Earths could fit inside the Sun?", opts: ["1,000", "100,000", "1.3 million", "10 million"], a: "1.3 million", fact: "The Sun contains 99.86% of all mass in our solar system." },
  { q: "What causes tides on Earth?", opts: ["Wind", "Earth's rotation", "Moon's gravity", "Sun's heat"], a: "Moon's gravity", fact: "The Moon's gravitational pull creates bulges in Earth's oceans." },
  { q: "Which planet has the most moons?", opts: ["Jupiter", "Saturn", "Uranus", "Neptune"], a: "Saturn", fact: "Saturn has 146 known moons — more than any other planet." },
  { q: "What is the International Date Line?", opts: ["Prime Meridian", "Equator", "180° longitude", "Tropic of Cancer"], a: "180° longitude", fact: "Crossing it can make you jump forward or back an entire day." },
  { q: "How long is a year on Mars?", opts: ["365 days", "520 days", "687 days", "900 days"], a: "687 days", fact: "Nearly 2 Earth years — Mars is farther from the Sun so it orbits slower." },
  { q: "What is a pulsar?", opts: ["Dying star", "Spinning neutron star", "Black hole", "Comet"], a: "Spinning neutron star", fact: "Pulsars emit beams of radiation and can spin hundreds of times per second." },
  { q: "The Great Wall of China is visible from space.", opts: ["True", "False", "Only from ISS", "Only at night"], a: "False", fact: "It's too narrow. Astronauts confirm it's NOT visible from orbit without zoom." },
  { q: "Which timezone is UTC+5:30?", opts: ["Pakistan", "India", "Bangladesh", "Nepal"], a: "India", fact: "India uses a half-hour offset — one of the few countries to do so." },
];

function QuickChallenge() {
  const [question, setQuestion] = useState<typeof QUICK_QUESTIONS[0] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const generateChallenge = () => {
    setQuestion(QUICK_QUESTIONS[Math.floor(Math.random() * QUICK_QUESTIONS.length)]);
    setSelected(null);
  };

  useEffect(() => { generateChallenge(); }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
      {question && (
      <div className="rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 to-indigo-900/20 p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-primary font-medium">⚡ Quick Challenge</p>
          <button onClick={generateChallenge} className="text-[10px] text-muted hover:text-white transition-colors">New question →</button>
        </div>
        <p className="text-sm text-white mb-3">{question.q}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {question.opts.map(opt => (
            <button
              key={opt}
              onClick={() => setSelected(opt)}
              disabled={selected !== null}
              className={`py-2.5 px-3 rounded-lg text-xs font-medium transition-all ${
                selected === null ? 'border border-card-border hover:border-primary text-muted hover:text-white' :
                opt === question.a ? 'bg-green-500/30 border border-green-400 text-green-200' :
                opt === selected ? 'bg-red-500/30 border border-red-400 text-red-200' :
                'border border-card-border/50 text-muted/50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {selected && (
          <div className="mt-3 p-2.5 rounded-lg bg-card-bg/60 border border-card-border/50">
            <p className={`text-xs ${selected === question.a ? 'text-green-400' : 'text-red-400'}`}>
              {selected === question.a ? '✅ Correct!' : `❌ Answer: ${question.a}`}
            </p>
            <p className="text-[11px] text-muted mt-1">{question.fact}</p>
            <Link href="/quiz" className="text-[10px] text-primary hover:underline mt-1 inline-block">Take a full quiz →</Link>
          </div>
        )}
      </div>
      )}
    </section>
  );
}

// ─── Home World Clock (customizable) ─────────────────────────
const ALL_CLOCK_OPTIONS = [
  // ─── Americas ───────────────────────────────────────────────
  { city: "New York", tz: "America/New_York", flag: "🇺🇸", colors: ["#3C3B6E", "#B22234", "#FFFFFF"] },
  { city: "Los Angeles", tz: "America/Los_Angeles", flag: "🇺🇸", colors: ["#3C3B6E", "#B22234", "#FFFFFF"] },
  { city: "Chicago", tz: "America/Chicago", flag: "🇺🇸", colors: ["#3C3B6E", "#B22234", "#FFFFFF"] },
  { city: "Anchorage", tz: "America/Anchorage", flag: "🇺🇸", colors: ["#3C3B6E", "#B22234", "#FFFFFF"] },
  { city: "Toronto", tz: "America/Toronto", flag: "🇨🇦", colors: ["#FF0000", "#FFFFFF", "#FF0000"] },
  { city: "Vancouver", tz: "America/Vancouver", flag: "🇨🇦", colors: ["#FF0000", "#FFFFFF", "#FF0000"] },
  { city: "Mexico City", tz: "America/Mexico_City", flag: "🇲🇽", colors: ["#006341", "#CE1126", "#FFFFFF"] },
  { city: "São Paulo", tz: "America/Sao_Paulo", flag: "🇧🇷", colors: ["#009C3B", "#FFDF00", "#002776"] },
  { city: "Rio de Janeiro", tz: "America/Sao_Paulo", flag: "🇧🇷", colors: ["#009C3B", "#FFDF00", "#002776"] },
  { city: "Buenos Aires", tz: "America/Argentina/Buenos_Aires", flag: "🇦🇷", colors: ["#74ACDF", "#FFFFFF", "#74ACDF"] },
  { city: "Bogotá", tz: "America/Bogota", flag: "🇨🇴", colors: ["#FCD116", "#003893", "#CE1126"] },
  { city: "Santiago", tz: "America/Santiago", flag: "🇨🇱", colors: ["#D52B1E", "#FFFFFF", "#0039A6"] },
  { city: "Lima", tz: "America/Lima", flag: "🇵🇪", colors: ["#D91023", "#FFFFFF", "#D91023"] },
  { city: "Havana", tz: "America/Havana", flag: "🇨🇺", colors: ["#002A8F", "#CB1515", "#FFFFFF"] },
  { city: "Kingston", tz: "America/Jamaica", flag: "🇯🇲", colors: ["#009B3A", "#FED100", "#000000"] },
  { city: "Panama City", tz: "America/Panama", flag: "🇵🇦", colors: ["#005293", "#D21034", "#FFFFFF"] },
  { city: "San José", tz: "America/Costa_Rica", flag: "🇨🇷", colors: ["#002B7F", "#CE1126", "#FFFFFF"] },
  { city: "Quito", tz: "America/Guayaquil", flag: "🇪🇨", colors: ["#FFD100", "#034EA2", "#CE1126"] },
  { city: "Caracas", tz: "America/Caracas", flag: "🇻🇪", colors: ["#FFCC00", "#003893", "#CF142B"] },
  { city: "Montevideo", tz: "America/Montevideo", flag: "🇺🇾", colors: ["#0038A8", "#FFFFFF", "#0038A8"] },
  { city: "Asunción", tz: "America/Asuncion", flag: "🇵🇾", colors: ["#D52B1E", "#FFFFFF", "#0038A8"] },
  { city: "La Paz", tz: "America/La_Paz", flag: "🇧🇴", colors: ["#D52B1E", "#F9E300", "#007934"] },
  { city: "Santo Domingo", tz: "America/Santo_Domingo", flag: "🇩🇴", colors: ["#002D62", "#CE1126", "#FFFFFF"] },
  { city: "Guatemala City", tz: "America/Guatemala", flag: "🇬🇹", colors: ["#4997D0", "#FFFFFF", "#4997D0"] },
  { city: "Tegucigalpa", tz: "America/Tegucigalpa", flag: "🇭🇳", colors: ["#0073CF", "#FFFFFF", "#0073CF"] },
  { city: "San Salvador", tz: "America/El_Salvador", flag: "🇸🇻", colors: ["#0F47AF", "#FFFFFF", "#0F47AF"] },
  { city: "Managua", tz: "America/Managua", flag: "🇳🇮", colors: ["#0067C6", "#FFFFFF", "#0067C6"] },
  { city: "Port-au-Prince", tz: "America/Port-au-Prince", flag: "🇭🇹", colors: ["#00209F", "#D21034", "#00209F"] },
  { city: "Port of Spain", tz: "America/Port_of_Spain", flag: "🇹🇹", colors: ["#CE1126", "#000000", "#FFFFFF"] },
  { city: "Nassau", tz: "America/Nassau", flag: "🇧🇸", colors: ["#00778B", "#FFC72C", "#000000"] },
  { city: "Bridgetown", tz: "America/Barbados", flag: "🇧🇧", colors: ["#00267F", "#FFC726", "#00267F"] },
  { city: "Paramaribo", tz: "America/Paramaribo", flag: "🇸🇷", colors: ["#377E3F", "#B40A2D", "#FFFFFF"] },
  { city: "Georgetown", tz: "America/Guyana", flag: "🇬🇾", colors: ["#009E49", "#FCD116", "#CE1126"] },
  { city: "Belmopan", tz: "America/Belize", flag: "🇧🇿", colors: ["#003F87", "#CE1126", "#FFFFFF"] },
  // ─── Europe ─────────────────────────────────────────────────
  { city: "London", tz: "Europe/London", flag: "🇬🇧", colors: ["#012169", "#C8102E", "#FFFFFF"] },
  { city: "Paris", tz: "Europe/Paris", flag: "🇫🇷", colors: ["#002395", "#ED2939", "#FFFFFF"] },
  { city: "Berlin", tz: "Europe/Berlin", flag: "🇩🇪", colors: ["#000000", "#DD0000", "#FFCE00"] },
  { city: "Madrid", tz: "Europe/Madrid", flag: "🇪🇸", colors: ["#AA151B", "#F1BF00", "#AA151B"] },
  { city: "Rome", tz: "Europe/Rome", flag: "🇮🇹", colors: ["#008C45", "#FFFFFF", "#CD212A"] },
  { city: "Amsterdam", tz: "Europe/Amsterdam", flag: "🇳🇱", colors: ["#AE1C28", "#FFFFFF", "#21468B"] },
  { city: "Brussels", tz: "Europe/Brussels", flag: "🇧🇪", colors: ["#000000", "#FDDA24", "#EF3340"] },
  { city: "Zurich", tz: "Europe/Zurich", flag: "🇨🇭", colors: ["#FF0000", "#FFFFFF", "#FF0000"] },
  { city: "Vienna", tz: "Europe/Vienna", flag: "🇦🇹", colors: ["#ED2939", "#FFFFFF", "#ED2939"] },
  { city: "Stockholm", tz: "Europe/Stockholm", flag: "🇸🇪", colors: ["#006AA7", "#FECC00", "#006AA7"] },
  { city: "Oslo", tz: "Europe/Oslo", flag: "🇳🇴", colors: ["#EF2B2D", "#002868", "#FFFFFF"] },
  { city: "Copenhagen", tz: "Europe/Copenhagen", flag: "🇩🇰", colors: ["#C60C30", "#FFFFFF", "#C60C30"] },
  { city: "Helsinki", tz: "Europe/Helsinki", flag: "🇫🇮", colors: ["#003580", "#FFFFFF", "#003580"] },
  { city: "Warsaw", tz: "Europe/Warsaw", flag: "🇵🇱", colors: ["#FFFFFF", "#DC143C", "#FFFFFF"] },
  { city: "Prague", tz: "Europe/Prague", flag: "🇨🇿", colors: ["#11457E", "#D7141A", "#FFFFFF"] },
  { city: "Lisbon", tz: "Europe/Lisbon", flag: "🇵🇹", colors: ["#006600", "#FF0000", "#FFCC00"] },
  { city: "Athens", tz: "Europe/Athens", flag: "🇬🇷", colors: ["#0D5EAF", "#FFFFFF", "#0D5EAF"] },
  { city: "Dublin", tz: "Europe/Dublin", flag: "🇮🇪", colors: ["#169B62", "#FFFFFF", "#FF883E"] },
  { city: "Budapest", tz: "Europe/Budapest", flag: "🇭🇺", colors: ["#CE2939", "#FFFFFF", "#477050"] },
  { city: "Bucharest", tz: "Europe/Bucharest", flag: "🇷🇴", colors: ["#002B7F", "#FCD116", "#CE1126"] },
  { city: "Sofia", tz: "Europe/Sofia", flag: "🇧🇬", colors: ["#FFFFFF", "#009B74", "#D62612"] },
  { city: "Zagreb", tz: "Europe/Zagreb", flag: "🇭🇷", colors: ["#FF0000", "#FFFFFF", "#171796"] },
  { city: "Belgrade", tz: "Europe/Belgrade", flag: "🇷🇸", colors: ["#C6363C", "#0C4076", "#FFFFFF"] },
  { city: "Kyiv", tz: "Europe/Kyiv", flag: "🇺🇦", colors: ["#005BBB", "#FFD500", "#005BBB"] },
  { city: "Moscow", tz: "Europe/Moscow", flag: "🇷🇺", colors: ["#FFFFFF", "#0039A6", "#D52B1E"] },
  { city: "Novosibirsk", tz: "Asia/Novosibirsk", flag: "🇷🇺", colors: ["#FFFFFF", "#0039A6", "#D52B1E"] },
  { city: "Reykjavik", tz: "Atlantic/Reykjavik", flag: "🇮🇸", colors: ["#003897", "#D72828", "#FFFFFF"] },
  { city: "Istanbul", tz: "Europe/Istanbul", flag: "🇹🇷", colors: ["#E30A17", "#FFFFFF", "#E30A17"] },
  { city: "Bratislava", tz: "Europe/Bratislava", flag: "🇸🇰", colors: ["#FFFFFF", "#0B4EA2", "#EE1C25"] },
  { city: "Ljubljana", tz: "Europe/Ljubljana", flag: "🇸🇮", colors: ["#FFFFFF", "#003DA5", "#ED1C24"] },
  { city: "Tallinn", tz: "Europe/Tallinn", flag: "🇪🇪", colors: ["#0072CE", "#000000", "#FFFFFF"] },
  { city: "Riga", tz: "Europe/Riga", flag: "🇱🇻", colors: ["#9E3039", "#FFFFFF", "#9E3039"] },
  { city: "Vilnius", tz: "Europe/Vilnius", flag: "🇱🇹", colors: ["#FDB913", "#006A44", "#C1272D"] },
  { city: "Tbilisi", tz: "Asia/Tbilisi", flag: "🇬🇪", colors: ["#FFFFFF", "#FF0000", "#FFFFFF"] },
  { city: "Yerevan", tz: "Asia/Yerevan", flag: "🇦🇲", colors: ["#D90012", "#0033A0", "#F2A800"] },
  { city: "Baku", tz: "Asia/Baku", flag: "🇦🇿", colors: ["#0092BC", "#E4002B", "#00AF66"] },
  { city: "Chisinau", tz: "Europe/Chisinau", flag: "🇲🇩", colors: ["#003DA5", "#FFD200", "#CC0000"] },
  { city: "Tirana", tz: "Europe/Tirane", flag: "🇦🇱", colors: ["#E41E20", "#000000", "#E41E20"] },
  { city: "Skopje", tz: "Europe/Skopje", flag: "🇲🇰", colors: ["#D20000", "#FFE600", "#D20000"] },
  { city: "Podgorica", tz: "Europe/Podgorica", flag: "🇲🇪", colors: ["#D4AF37", "#C40308", "#D4AF37"] },
  { city: "Sarajevo", tz: "Europe/Sarajevo", flag: "🇧🇦", colors: ["#002395", "#FECB00", "#002395"] },
  { city: "Luxembourg", tz: "Europe/Luxembourg", flag: "🇱🇺", colors: ["#EF3340", "#FFFFFF", "#00A3E0"] },
  { city: "Valletta", tz: "Europe/Malta", flag: "🇲🇹", colors: ["#FFFFFF", "#CF142B", "#FFFFFF"] },
  { city: "Nicosia", tz: "Asia/Nicosia", flag: "🇨🇾", colors: ["#FFFFFF", "#D57800", "#4E7A3E"] },
  { city: "Monaco", tz: "Europe/Monaco", flag: "🇲🇨", colors: ["#CE1126", "#FFFFFF", "#CE1126"] },
  { city: "Andorra la Vella", tz: "Europe/Andorra", flag: "🇦🇩", colors: ["#0032A0", "#FEDF00", "#D1001F"] },
  // ─── Africa ─────────────────────────────────────────────────
  { city: "Cairo", tz: "Africa/Cairo", flag: "🇪🇬", colors: ["#CE1126", "#FFFFFF", "#000000"] },
  { city: "Lagos", tz: "Africa/Lagos", flag: "🇳🇬", colors: ["#008751", "#FFFFFF", "#008751"] },
  { city: "Johannesburg", tz: "Africa/Johannesburg", flag: "🇿🇦", colors: ["#007749", "#FFB81C", "#DE3831"] },
  { city: "Cape Town", tz: "Africa/Johannesburg", flag: "🇿🇦", colors: ["#007749", "#FFB81C", "#DE3831"] },
  { city: "Nairobi", tz: "Africa/Nairobi", flag: "🇰🇪", colors: ["#000000", "#BB0000", "#006600"] },
  { city: "Casablanca", tz: "Africa/Casablanca", flag: "🇲🇦", colors: ["#C1272D", "#006233", "#C1272D"] },
  { city: "Addis Ababa", tz: "Africa/Addis_Ababa", flag: "🇪🇹", colors: ["#009A44", "#FCDD09", "#DA121A"] },
  { city: "Accra", tz: "Africa/Accra", flag: "🇬🇭", colors: ["#CE1126", "#FCD116", "#006B3F"] },
  { city: "Dar es Salaam", tz: "Africa/Dar_es_Salaam", flag: "🇹🇿", colors: ["#1EB53A", "#FCD116", "#00A3DD"] },
  { city: "Algiers", tz: "Africa/Algiers", flag: "🇩🇿", colors: ["#006233", "#FFFFFF", "#D21034"] },
  { city: "Tunis", tz: "Africa/Tunis", flag: "🇹🇳", colors: ["#E70013", "#FFFFFF", "#E70013"] },
  { city: "Dakar", tz: "Africa/Dakar", flag: "🇸🇳", colors: ["#00853F", "#FDEF42", "#E31B23"] },
  { city: "Kinshasa", tz: "Africa/Kinshasa", flag: "🇨🇩", colors: ["#007FFF", "#CE1021", "#F7D618"] },
  { city: "Abidjan", tz: "Africa/Abidjan", flag: "🇨🇮", colors: ["#F77F00", "#FFFFFF", "#009E60"] },
  { city: "Douala", tz: "Africa/Douala", flag: "🇨🇲", colors: ["#007A5E", "#CE1126", "#FCD116"] },
  { city: "Kampala", tz: "Africa/Kampala", flag: "🇺🇬", colors: ["#000000", "#FCDC04", "#D90000"] },
  { city: "Harare", tz: "Africa/Harare", flag: "🇿🇼", colors: ["#006400", "#FFD200", "#D21034"] },
  { city: "Luanda", tz: "Africa/Luanda", flag: "🇦🇴", colors: ["#CE1126", "#000000", "#FFCE00"] },
  { city: "Maputo", tz: "Africa/Maputo", flag: "🇲🇿", colors: ["#009A44", "#000000", "#FCE100"] },
  { city: "Lusaka", tz: "Africa/Lusaka", flag: "🇿🇲", colors: ["#198A00", "#000000", "#EF7D00"] },
  { city: "Antananarivo", tz: "Indian/Antananarivo", flag: "🇲🇬", colors: ["#FFFFFF", "#FC3D32", "#007E3A"] },
  { city: "Kigali", tz: "Africa/Kigali", flag: "🇷🇼", colors: ["#00A1DE", "#FAD201", "#20603D"] },
  { city: "Tripoli", tz: "Africa/Tripoli", flag: "🇱🇾", colors: ["#E70013", "#000000", "#239E46"] },
  { city: "Windhoek", tz: "Africa/Windhoek", flag: "🇳🇦", colors: ["#003580", "#009543", "#D21034"] },
  { city: "Gaborone", tz: "Africa/Gaborone", flag: "🇧🇼", colors: ["#75AADB", "#000000", "#FFFFFF"] },
  { city: "Bamako", tz: "Africa/Bamako", flag: "🇲🇱", colors: ["#14B53A", "#FCD116", "#CE1126"] },
  { city: "Nouakchott", tz: "Africa/Nouakchott", flag: "🇲🇷", colors: ["#006233", "#FFC400", "#006233"] },
  // ─── Middle East ────────────────────────────────────────────
  { city: "Dubai", tz: "Asia/Dubai", flag: "🇦🇪", colors: ["#00732F", "#FF0000", "#FFFFFF"] },
  { city: "Riyadh", tz: "Asia/Riyadh", flag: "🇸🇦", colors: ["#006C35", "#FFFFFF", "#006C35"] },
  { city: "Tel Aviv", tz: "Asia/Jerusalem", flag: "🇮🇱", colors: ["#0038B8", "#FFFFFF", "#0038B8"] },
  { city: "Doha", tz: "Asia/Qatar", flag: "🇶🇦", colors: ["#8D1B3D", "#FFFFFF", "#8D1B3D"] },
  { city: "Kuwait City", tz: "Asia/Kuwait", flag: "🇰🇼", colors: ["#007A33", "#CE1126", "#000000"] },
  { city: "Muscat", tz: "Asia/Muscat", flag: "🇴🇲", colors: ["#DB161B", "#FFFFFF", "#008000"] },
  { city: "Manama", tz: "Asia/Bahrain", flag: "🇧🇭", colors: ["#CE1126", "#FFFFFF", "#CE1126"] },
  { city: "Amman", tz: "Asia/Amman", flag: "🇯🇴", colors: ["#000000", "#007A33", "#CE1126"] },
  { city: "Beirut", tz: "Asia/Beirut", flag: "🇱🇧", colors: ["#ED1C24", "#00A651", "#FFFFFF"] },
  { city: "Baghdad", tz: "Asia/Baghdad", flag: "🇮🇶", colors: ["#CE1126", "#FFFFFF", "#007A33"] },
  { city: "Tehran", tz: "Asia/Tehran", flag: "🇮🇷", colors: ["#239F40", "#FFFFFF", "#DA0000"] },
  { city: "Sanaa", tz: "Asia/Aden", flag: "🇾🇪", colors: ["#CE1126", "#FFFFFF", "#000000"] },
  // ─── South Asia ─────────────────────────────────────────────
  { city: "Mumbai", tz: "Asia/Kolkata", flag: "🇮🇳", colors: ["#FF9933", "#138808", "#FFFFFF"] },
  { city: "Delhi", tz: "Asia/Kolkata", flag: "🇮🇳", colors: ["#FF9933", "#138808", "#FFFFFF"] },
  { city: "Bangalore", tz: "Asia/Kolkata", flag: "🇮🇳", colors: ["#FF9933", "#138808", "#FFFFFF"] },
  { city: "Kolkata", tz: "Asia/Kolkata", flag: "🇮🇳", colors: ["#FF9933", "#138808", "#FFFFFF"] },
  { city: "Karachi", tz: "Asia/Karachi", flag: "🇵🇰", colors: ["#01411C", "#FFFFFF", "#01411C"] },
  { city: "Lahore", tz: "Asia/Karachi", flag: "🇵🇰", colors: ["#01411C", "#FFFFFF", "#01411C"] },
  { city: "Dhaka", tz: "Asia/Dhaka", flag: "🇧🇩", colors: ["#006A4E", "#F42A41", "#006A4E"] },
  { city: "Colombo", tz: "Asia/Colombo", flag: "🇱🇰", colors: ["#8D153A", "#FCBE24", "#005641"] },
  { city: "Kathmandu", tz: "Asia/Kathmandu", flag: "🇳🇵", colors: ["#DC143C", "#003893", "#FFFFFF"] },
  { city: "Kabul", tz: "Asia/Kabul", flag: "🇦🇫", colors: ["#000000", "#D32011", "#007A36"] },
  { city: "Malé", tz: "Indian/Maldives", flag: "🇲🇻", colors: ["#D21034", "#007E3A", "#FFFFFF"] },
  { city: "Thimphu", tz: "Asia/Thimphu", flag: "🇧🇹", colors: ["#FFD520", "#FF4E12", "#FFFFFF"] },
  // ─── Central Asia ───────────────────────────────────────────
  { city: "Almaty", tz: "Asia/Almaty", flag: "🇰🇿", colors: ["#00AFCA", "#FEC50C", "#00AFCA"] },
  { city: "Tashkent", tz: "Asia/Tashkent", flag: "🇺🇿", colors: ["#0099B5", "#CE1126", "#1EB53A"] },
  { city: "Bishkek", tz: "Asia/Bishkek", flag: "🇰🇬", colors: ["#E8112D", "#FFEF00", "#E8112D"] },
  { city: "Dushanbe", tz: "Asia/Dushanbe", flag: "🇹🇯", colors: ["#006600", "#CC0000", "#FFFFFF"] },
  { city: "Ashgabat", tz: "Asia/Ashgabat", flag: "🇹🇲", colors: ["#00843D", "#FFFFFF", "#CC0000"] },
  // ─── East Asia ──────────────────────────────────────────────
  { city: "Tokyo", tz: "Asia/Tokyo", flag: "🇯🇵", colors: ["#BC002D", "#FFFFFF", "#BC002D"] },
  { city: "Osaka", tz: "Asia/Tokyo", flag: "🇯🇵", colors: ["#BC002D", "#FFFFFF", "#BC002D"] },
  { city: "Shanghai", tz: "Asia/Shanghai", flag: "🇨🇳", colors: ["#DE2910", "#FFDE00", "#DE2910"] },
  { city: "Beijing", tz: "Asia/Shanghai", flag: "🇨🇳", colors: ["#DE2910", "#FFDE00", "#DE2910"] },
  { city: "Hong Kong", tz: "Asia/Hong_Kong", flag: "🇭🇰", colors: ["#DE2910", "#FFFFFF", "#DE2910"] },
  { city: "Seoul", tz: "Asia/Seoul", flag: "🇰🇷", colors: ["#003478", "#CD2E3A", "#FFFFFF"] },
  { city: "Taipei", tz: "Asia/Taipei", flag: "🇹🇼", colors: ["#FE0000", "#000095", "#FFFFFF"] },
  { city: "Ulaanbaatar", tz: "Asia/Ulaanbaatar", flag: "🇲🇳", colors: ["#003DA5", "#CE1126", "#003DA5"] },
  { city: "Pyongyang", tz: "Asia/Pyongyang", flag: "🇰🇵", colors: ["#024FA2", "#ED1C27", "#FFFFFF"] },
  // ─── Southeast Asia ─────────────────────────────────────────
  { city: "Singapore", tz: "Asia/Singapore", flag: "🇸🇬", colors: ["#ED2939", "#FFFFFF", "#ED2939"] },
  { city: "Bangkok", tz: "Asia/Bangkok", flag: "🇹🇭", colors: ["#A51931", "#FFFFFF", "#2D2A4A"] },
  { city: "Ho Chi Minh City", tz: "Asia/Ho_Chi_Minh", flag: "🇻🇳", colors: ["#DA251D", "#FFCD00", "#DA251D"] },
  { city: "Jakarta", tz: "Asia/Jakarta", flag: "🇮🇩", colors: ["#FF0000", "#FFFFFF", "#FF0000"] },
  { city: "Bali", tz: "Asia/Makassar", flag: "🇮🇩", colors: ["#FF0000", "#FFFFFF", "#FF0000"] },
  { city: "Manila", tz: "Asia/Manila", flag: "🇵🇭", colors: ["#0038A8", "#CE1126", "#FCD116"] },
  { city: "Kuala Lumpur", tz: "Asia/Kuala_Lumpur", flag: "🇲🇾", colors: ["#010066", "#CC0001", "#FFCC00"] },
  { city: "Yangon", tz: "Asia/Yangon", flag: "🇲🇲", colors: ["#FECB00", "#34B233", "#EA2839"] },
  { city: "Phnom Penh", tz: "Asia/Phnom_Penh", flag: "🇰🇭", colors: ["#032EA1", "#E00025", "#032EA1"] },
  { city: "Vientiane", tz: "Asia/Vientiane", flag: "🇱🇦", colors: ["#002868", "#CE1126", "#FFFFFF"] },
  { city: "Hanoi", tz: "Asia/Ho_Chi_Minh", flag: "🇻🇳", colors: ["#DA251D", "#FFCD00", "#DA251D"] },
  { city: "Bandar Seri Begawan", tz: "Asia/Brunei", flag: "🇧🇳", colors: ["#F7E017", "#000000", "#FFFFFF"] },
  { city: "Dili", tz: "Asia/Dili", flag: "🇹🇱", colors: ["#DC241F", "#000000", "#FFC726"] },
  // ─── Oceania ────────────────────────────────────────────────
  { city: "Sydney", tz: "Australia/Sydney", flag: "🇦🇺", colors: ["#00008B", "#FFFFFF", "#FF0000"] },
  { city: "Melbourne", tz: "Australia/Melbourne", flag: "🇦🇺", colors: ["#00008B", "#FFFFFF", "#FF0000"] },
  { city: "Perth", tz: "Australia/Perth", flag: "🇦🇺", colors: ["#00008B", "#FFFFFF", "#FF0000"] },
  { city: "Auckland", tz: "Pacific/Auckland", flag: "🇳🇿", colors: ["#00247D", "#CC142B", "#FFFFFF"] },
  { city: "Suva", tz: "Pacific/Fiji", flag: "🇫🇯", colors: ["#68BFE5", "#002868", "#CE1126"] },
  { city: "Port Moresby", tz: "Pacific/Port_Moresby", flag: "🇵🇬", colors: ["#000000", "#CE1126", "#FCD116"] },
  { city: "Apia", tz: "Pacific/Apia", flag: "🇼🇸", colors: ["#002B7F", "#CE1126", "#FFFFFF"] },
  { city: "Nuku'alofa", tz: "Pacific/Tongatapu", flag: "🇹🇴", colors: ["#C10000", "#FFFFFF", "#C10000"] },
  { city: "Honiara", tz: "Pacific/Guadalcanal", flag: "🇸🇧", colors: ["#0051A5", "#008000", "#FCD116"] },
  { city: "Port Vila", tz: "Pacific/Efate", flag: "🇻🇺", colors: ["#009543", "#D21034", "#000000"] },
  { city: "Tarawa", tz: "Pacific/Tarawa", flag: "🇰🇮", colors: ["#CE1126", "#003F87", "#FCD116"] },
  { city: "Majuro", tz: "Pacific/Majuro", flag: "🇲🇭", colors: ["#003893", "#FFFFFF", "#DD7500"] },
  { city: "Noumea", tz: "Pacific/Noumea", flag: "🇳🇨", colors: ["#009543", "#CE1126", "#003DA5"] },
  { city: "Pago Pago", tz: "Pacific/Pago_Pago", flag: "🇦🇸", colors: ["#003478", "#D52B1E", "#FFFFFF"] },
];

const HOME_CLOCK_STORAGE = 'dateandtimezone_home_clocks';

function HomeWorldClock({ userTz }: { userTz: string | null }) {
  // Store city names (not timezones) so Delhi and Mumbai can coexist
  const [selectedCityNames, setSelectedCityNames] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(HOME_CLOCK_STORAGE);
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (Array.isArray(p) && p.length > 0) {
          // Migrate old format (timezone strings) to city names
          const migrated: string[] = p.map((item: string) => {
            if (item.includes('/')) {
              const match = ALL_CLOCK_OPTIONS.find(c => c.tz === item);
              return match ? match.city : '';
            }
            return item;
          }).filter((x: string) => x.length > 0);
          if (migrated.length > 0) {
            setSelectedCityNames(migrated);
            localStorage.setItem(HOME_CLOCK_STORAGE, JSON.stringify(migrated));
            return;
          }
        }
      } catch {}
    }
    setSelectedCityNames(['London', 'Paris', 'Dubai', 'Mumbai', 'Singapore', 'Shanghai', 'Tokyo', 'Sydney', 'New York', 'Moscow']);
  }, []);

  const tz = userTz || "America/New_York";

  const getOffset = (targetTz: string): number => {
    const now = new Date();
    const userTime = new Date(now.toLocaleString("en-US", { timeZone: tz }));
    const targetTime = new Date(now.toLocaleString("en-US", { timeZone: targetTz }));
    return Math.round((targetTime.getTime() - userTime.getTime()) / 3600000 * 2) / 2;
  };

  const userInfo = ALL_CLOCK_OPTIONS.find(c => c.tz === tz) || {
    city: TZ_TO_CITY[tz]?.city || tz.split("/").pop()?.replace(/_/g, " ") || "Local",
    tz, flag: "📍", colors: ["#0EA5E9", "#F59E0B", "#FFFFFF"],
  };

  const otherClocks = selectedCityNames
    .map(name => ALL_CLOCK_OPTIONS.find(c => c.city === name))
    .filter((c): c is typeof ALL_CLOCK_OPTIONS[0] => !!c && c.city !== userInfo.city)
    .map(c => ({ ...c, offset: getOffset(c.tz) }))
    .sort((a, b) => a.offset - b.offset);

  const addCity = (cityName: string) => {
    if (selectedCityNames.includes(cityName) || selectedCityNames.length >= 10) return;
    const updated = [...selectedCityNames, cityName];
    setSelectedCityNames(updated);
    localStorage.setItem(HOME_CLOCK_STORAGE, JSON.stringify(updated));
  };

  const removeCity = (cityName: string) => {
    const updated = selectedCityNames.filter(n => n !== cityName);
    setSelectedCityNames(updated);
    localStorage.setItem(HOME_CLOCK_STORAGE, JSON.stringify(updated));
  };

  // Search matches city name OR country name (from flag→country mapping)
  const CITY_COUNTRY: Record<string, string> = {
    // Americas
    "New York": "United States", "Los Angeles": "United States", "Chicago": "United States", "Anchorage": "United States",
    "Toronto": "Canada", "Vancouver": "Canada",
    "Mexico City": "Mexico", "São Paulo": "Brazil", "Rio de Janeiro": "Brazil",
    "Buenos Aires": "Argentina", "Bogotá": "Colombia", "Santiago": "Chile", "Lima": "Peru",
    "Havana": "Cuba", "Kingston": "Jamaica", "Panama City": "Panama", "San José": "Costa Rica",
    "Quito": "Ecuador", "Caracas": "Venezuela", "Montevideo": "Uruguay", "Asunción": "Paraguay",
    "La Paz": "Bolivia", "Santo Domingo": "Dominican Republic", "Guatemala City": "Guatemala",
    "Tegucigalpa": "Honduras", "San Salvador": "El Salvador", "Managua": "Nicaragua",
    "Port-au-Prince": "Haiti", "Port of Spain": "Trinidad and Tobago", "Nassau": "Bahamas",
    "Bridgetown": "Barbados", "Paramaribo": "Suriname", "Georgetown": "Guyana", "Belmopan": "Belize",
    // Europe
    "London": "United Kingdom", "Paris": "France", "Berlin": "Germany", "Madrid": "Spain",
    "Rome": "Italy", "Amsterdam": "Netherlands", "Brussels": "Belgium", "Zurich": "Switzerland",
    "Vienna": "Austria", "Stockholm": "Sweden", "Oslo": "Norway", "Copenhagen": "Denmark",
    "Helsinki": "Finland", "Warsaw": "Poland", "Prague": "Czech Republic", "Lisbon": "Portugal",
    "Athens": "Greece", "Dublin": "Ireland", "Budapest": "Hungary", "Bucharest": "Romania",
    "Sofia": "Bulgaria", "Zagreb": "Croatia", "Belgrade": "Serbia", "Kyiv": "Ukraine",
    "Moscow": "Russia", "Novosibirsk": "Russia", "Reykjavik": "Iceland", "Istanbul": "Turkey",
    "Bratislava": "Slovakia", "Ljubljana": "Slovenia", "Tallinn": "Estonia", "Riga": "Latvia",
    "Vilnius": "Lithuania", "Tbilisi": "Georgia", "Yerevan": "Armenia", "Baku": "Azerbaijan",
    "Chisinau": "Moldova", "Tirana": "Albania", "Skopje": "North Macedonia", "Podgorica": "Montenegro",
    "Sarajevo": "Bosnia and Herzegovina", "Luxembourg": "Luxembourg", "Valletta": "Malta",
    "Nicosia": "Cyprus", "Monaco": "Monaco", "Andorra la Vella": "Andorra",
    // Africa
    "Cairo": "Egypt", "Lagos": "Nigeria", "Johannesburg": "South Africa", "Cape Town": "South Africa",
    "Nairobi": "Kenya", "Casablanca": "Morocco", "Addis Ababa": "Ethiopia", "Accra": "Ghana",
    "Dar es Salaam": "Tanzania", "Algiers": "Algeria", "Tunis": "Tunisia", "Dakar": "Senegal",
    "Kinshasa": "DR Congo", "Abidjan": "Ivory Coast", "Douala": "Cameroon", "Kampala": "Uganda",
    "Harare": "Zimbabwe", "Luanda": "Angola", "Maputo": "Mozambique", "Lusaka": "Zambia",
    "Antananarivo": "Madagascar", "Kigali": "Rwanda", "Tripoli": "Libya", "Windhoek": "Namibia",
    "Gaborone": "Botswana", "Bamako": "Mali", "Nouakchott": "Mauritania",
    // Middle East
    "Dubai": "UAE", "Riyadh": "Saudi Arabia", "Tel Aviv": "Israel", "Doha": "Qatar",
    "Kuwait City": "Kuwait", "Muscat": "Oman", "Manama": "Bahrain", "Amman": "Jordan",
    "Beirut": "Lebanon", "Baghdad": "Iraq", "Tehran": "Iran", "Sanaa": "Yemen",
    // South Asia
    "Mumbai": "India", "Delhi": "India", "Bangalore": "India", "Kolkata": "India",
    "Karachi": "Pakistan", "Lahore": "Pakistan", "Dhaka": "Bangladesh", "Colombo": "Sri Lanka",
    "Kathmandu": "Nepal", "Kabul": "Afghanistan", "Malé": "Maldives", "Thimphu": "Bhutan",
    // Central Asia
    "Almaty": "Kazakhstan", "Tashkent": "Uzbekistan", "Bishkek": "Kyrgyzstan",
    "Dushanbe": "Tajikistan", "Ashgabat": "Turkmenistan",
    // East Asia
    "Tokyo": "Japan", "Osaka": "Japan", "Shanghai": "China", "Beijing": "China",
    "Hong Kong": "China", "Seoul": "South Korea", "Taipei": "Taiwan",
    "Ulaanbaatar": "Mongolia", "Pyongyang": "North Korea",
    // Southeast Asia
    "Singapore": "Singapore", "Bangkok": "Thailand", "Ho Chi Minh City": "Vietnam",
    "Jakarta": "Indonesia", "Bali": "Indonesia", "Manila": "Philippines",
    "Kuala Lumpur": "Malaysia", "Yangon": "Myanmar", "Phnom Penh": "Cambodia",
    "Vientiane": "Laos", "Hanoi": "Vietnam", "Bandar Seri Begawan": "Brunei",
    "Dili": "Timor-Leste",
    // Oceania
    "Sydney": "Australia", "Melbourne": "Australia", "Perth": "Australia",
    "Auckland": "New Zealand", "Suva": "Fiji", "Port Moresby": "Papua New Guinea",
    "Apia": "Samoa", "Nuku'alofa": "Tonga", "Honiara": "Solomon Islands",
    "Port Vila": "Vanuatu", "Tarawa": "Kiribati", "Majuro": "Marshall Islands",
    "Noumea": "New Caledonia", "Pago Pago": "American Samoa",
  };
  const filtered = ALL_CLOCK_OPTIONS.filter(c => {
    if (selectedCityNames.includes(c.city) || c.city === userInfo.city) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    const country = CITY_COUNTRY[c.city] || "";
    return c.city.toLowerCase().includes(q) || country.toLowerCase().includes(q);
  });

  return (
    <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" /> World Clock
        </h2>
        <div className="flex items-center gap-3">
          <button onClick={() => setEditMode(!editMode)} className="text-[10px] text-muted hover:text-primary transition-colors">
            {editMode ? '✓ Done' : '✏️ Customize'}
          </button>
          <Link href="/world-clock" className="text-xs text-primary hover:text-primary/80 transition-colors">
            All cities →
          </Link>
        </div>
      </div>

      {/* Clock row */}
      <div className="flex items-end justify-center gap-1 sm:gap-2 flex-wrap">
        {/* User's clock */}
        <div className="flex flex-col items-center w-[11%] sm:w-auto">
          <AnalogClock timezone={tz} colors={userInfo.colors} size={95} />
          <span className="text-[10px] mt-1 text-primary font-bold">{userInfo.city} (You)</span>
          <MiniDigitalTime tz={tz} />
          <span className="text-[9px] font-mono font-medium mt-0.5 text-emerald-400">Home</span>
        </div>

        {/* Other clocks */}
        {otherClocks.map(c => {
          const offsetLabel = c.offset === 0 ? "Same" : c.offset > 0 ? `+${c.offset}h` : `${c.offset}h`;
          return (
            <div key={c.tz} className="flex flex-col items-center w-[11%] sm:w-auto relative group">
              {editMode && (
                <button onClick={() => removeCity(c.city)} className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center z-10 opacity-80 hover:opacity-100">×</button>
              )}
              <AnalogClock timezone={c.tz} colors={c.colors} size={95} />
              <span className="text-[10px] mt-1 text-muted">{c.city}</span>
              <MiniDigitalTime tz={c.tz} />
              <span className={`text-[9px] font-mono font-medium mt-0.5 ${c.offset > 0 ? 'text-amber-400' : c.offset < 0 ? 'text-sky-400' : 'text-emerald-400'}`}>{offsetLabel}</span>
            </div>
          );
        })}
      </div>

      {/* Edit mode: add cities */}
      {editMode && (
        <div className="mt-4 p-4 rounded-xl border border-card-border bg-card-bg/40">
          <p className="text-xs text-muted mb-2">Add cities (up to 10):</p>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search cities..."
            className="w-full px-3 py-2 text-sm rounded-lg bg-dark-bg border border-card-border text-white focus:outline-none focus:border-primary mb-2"
          />
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
            {filtered.slice(0, 20).map(c => (
              <button
                key={c.tz}
                onClick={() => addCity(c.city)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-card-border text-xs text-muted hover:border-primary hover:text-white transition-colors"
              >
                <span>{c.flag}</span> {c.city}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Home Meeting Planner (embedded full planner) ────────────
const PLANNER_CITIES = [
  { name: 'New York', tz: 'America/New_York' },
  { name: 'Los Angeles', tz: 'America/Los_Angeles' },
  { name: 'Chicago', tz: 'America/Chicago' },
  { name: 'Toronto', tz: 'America/Toronto' },
  { name: 'São Paulo', tz: 'America/Sao_Paulo' },
  { name: 'London', tz: 'Europe/London' },
  { name: 'Paris', tz: 'Europe/Paris' },
  { name: 'Berlin', tz: 'Europe/Berlin' },
  { name: 'Dubai', tz: 'Asia/Dubai' },
  { name: 'Mumbai', tz: 'Asia/Kolkata' },
  { name: 'Singapore', tz: 'Asia/Singapore' },
  { name: 'Tokyo', tz: 'Asia/Tokyo' },
  { name: 'Sydney', tz: 'Australia/Sydney' },
  { name: 'Auckland', tz: 'Pacific/Auckland' },
];

function getHourInTz(tz: string, utcHour: number): number {
  const d = new Date();
  d.setUTCHours(utcHour, 0, 0, 0);
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', hour12: false }).formatToParts(d);
  const h = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
  return h === 24 ? 0 : h;
}

function getHourColorHome(hour: number): string {
  if (hour >= 9 && hour < 18) return 'bg-green-700/50 text-green-200 font-medium';
  if (hour >= 7 && hour < 9) return 'bg-yellow-700/40 text-yellow-200';
  if (hour >= 18 && hour < 21) return 'bg-yellow-700/40 text-yellow-200';
  return 'bg-red-900/40 text-red-300/70';
}

function formatHrHome(h: number): string {
  const hour = ((h % 24) + 24) % 24;
  if (hour === 0) return '12am';
  if (hour < 12) return `${hour}am`;
  if (hour === 12) return '12pm';
  return `${hour - 12}pm`;
}

// ─── Live World Map (day/night terminator — uses real map paths) ──
import { MAP_PATH_DATA } from './world-clock/map-data';

const MAP_CITIES = [
  { name: 'New York', tz: 'America/New_York', lat: 40.71, lng: -74.01, flag: '🇺🇸', country: 'USA' },
  { name: 'Los Angeles', tz: 'America/Los_Angeles', lat: 34.05, lng: -118.24, flag: '🇺🇸', country: 'USA' },
  { name: 'Mexico City', tz: 'America/Mexico_City', lat: 19.43, lng: -99.13, flag: '🇲🇽', country: 'Mexico' },
  { name: 'Sao Paulo', tz: 'America/Sao_Paulo', lat: -23.55, lng: -46.63, flag: '🇧🇷', country: 'Brazil' },
  { name: 'Santiago', tz: 'America/Santiago', lat: -33.45, lng: -70.67, flag: '🇨🇱', country: 'Chile' },
  { name: 'Vancouver', tz: 'America/Vancouver', lat: 49.28, lng: -123.12, flag: '🇨🇦', country: 'Canada' },
  { name: 'Anchorage', tz: 'America/Anchorage', lat: 61.22, lng: -149.90, flag: '🇺🇸', country: 'Alaska' },
  { name: 'Honolulu', tz: 'Pacific/Honolulu', lat: 21.31, lng: -157.86, flag: '🇺🇸', country: 'Hawaii' },
  { name: 'London', tz: 'Europe/London', lat: 51.51, lng: -0.13, flag: '🇬🇧', country: 'UK' },
  { name: 'Moscow', tz: 'Europe/Moscow', lat: 55.76, lng: 37.62, flag: '🇷🇺', country: 'Russia' },
  { name: 'Cairo', tz: 'Africa/Cairo', lat: 30.04, lng: 31.24, flag: '🇪🇬', country: 'Egypt' },
  { name: 'Lagos', tz: 'Africa/Lagos', lat: 6.45, lng: 3.40, flag: '🇳🇬', country: 'Nigeria' },
  { name: 'Nairobi', tz: 'Africa/Nairobi', lat: -1.29, lng: 36.82, flag: '🇰🇪', country: 'Kenya' },
  { name: 'Dubai', tz: 'Asia/Dubai', lat: 25.20, lng: 55.27, flag: '🇦🇪', country: 'UAE' },
  { name: 'Mumbai', tz: 'Asia/Kolkata', lat: 19.08, lng: 72.88, flag: '🇮🇳', country: 'India' },
  { name: 'Singapore', tz: 'Asia/Singapore', lat: 1.35, lng: 103.82, flag: '🇸🇬', country: 'Singapore' },
  { name: 'Shanghai', tz: 'Asia/Shanghai', lat: 31.23, lng: 121.47, flag: '🇨🇳', country: 'China' },
  { name: 'Hong Kong', tz: 'Asia/Hong_Kong', lat: 22.32, lng: 114.17, flag: '🇭🇰', country: 'Hong Kong' },
  { name: 'Tokyo', tz: 'Asia/Tokyo', lat: 35.68, lng: 139.69, flag: '🇯🇵', country: 'Japan' },
  { name: 'Sydney', tz: 'Australia/Sydney', lat: -33.87, lng: 151.21, flag: '🇦🇺', country: 'Australia' },
  { name: 'Auckland', tz: 'Pacific/Auckland', lat: -36.85, lng: 174.76, flag: '🇳🇿', country: 'New Zealand' },
];

function mapLatLngToSvg(lat: number, lng: number) {
  const x = ((lng + 180) / 360) * 1000;
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = 500 / 2 - (500 * mercN) / (2 * Math.PI);
  return { x, y };
}

function LiveWorldMap() {
  const [subsolarLng, setSubsolarLng] = useState(0);
  const [declination, setDeclination] = useState(0);
  const [now, setNow] = useState<Date | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setNow(d);
      const utcH = d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600;
      setSubsolarLng(((12 - utcH) / 24) * 360);
      const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);
      setDeclination(23.44 * Math.sin(((2 * Math.PI) / 365) * (dayOfYear - 81)));
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, []);

  const terminatorPoints = useMemo(() => {
    const pts: string[] = [];
    const decRad = (declination * Math.PI) / 180;
    for (let lng = -180; lng <= 180; lng += 2) {
      const lngRad = ((lng - subsolarLng) * Math.PI) / 180;
      const latRad = Math.atan(-Math.cos(lngRad) / Math.tan(decRad));
      const lat = Math.max(-85, Math.min(85, (latRad * 180) / Math.PI));
      const { x, y } = mapLatLngToSvg(lat, lng);
      pts.push(`${x},${y}`);
    }
    if (declination > 0) { pts.push('1000,500'); pts.push('0,500'); }
    else { pts.push('1000,0'); pts.push('0,0'); }
    return pts.join(' ');
  }, [subsolarLng, declination]);

  function isDay(lat: number, lng: number): boolean {
    const decRad = (declination * Math.PI) / 180;
    const latRad = (lat * Math.PI) / 180;
    const lngRad = (((lng - subsolarLng + 540) % 360 - 180) * Math.PI) / 180;
    return Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(lngRad) > 0;
  }

  if (!now) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-card-border bg-card-bg/40 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-card-border/40">
          <h2 className="font-heading text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" /> Live World Map
          </h2>
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="flex items-center gap-1"><Sun className="w-3 h-3 text-amber-400" /> Day</span>
            <span className="flex items-center gap-1"><Moon className="w-3 h-3 text-blue-400" /> Night</span>
            <span className="font-mono">
              {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' })} UTC
            </span>
          </div>
        </div>
        <div className="w-full overflow-hidden" style={{ background: '#0a1628' }}>
          <svg viewBox="0 0 1000 500" className="w-full h-auto" style={{ minHeight: '250px', maxHeight: '450px' }}>
            <defs>
              <linearGradient id="homeLandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e3a5f" />
                <stop offset="100%" stopColor="#132d4a" />
              </linearGradient>
              <filter id="homeGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Grid lines — same as world-clock */}
            {[-60, -30, 0, 30, 60].map(lat => {
              const { y } = mapLatLngToSvg(lat, 0);
              return <line key={`hlat${lat}`} x1="0" y1={y} x2="1000" y2={y} stroke="#12283f" strokeWidth="0.5" />;
            })}
            {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map(lng => {
              const { x } = mapLatLngToSvg(0, lng);
              return <line key={`hlng${lng}`} x1={x} y1="0" x2={x} y2="500" stroke="#12283f" strokeWidth="0.5" />;
            })}
            {/* Equator */}
            {(() => { const { y } = mapLatLngToSvg(0, 0); return <line x1="0" y1={y} x2="1000" y2={y} stroke="#1a3550" strokeWidth="0.8" strokeDasharray="8,4" />; })()}

            {/* Real continent shapes */}
            <path d={MAP_PATH_DATA} fill="url(#homeLandGrad)" stroke="#3a6a9b" strokeWidth="0.3" />

            {/* Night overlay */}
            <polygon points={terminatorPoints} fill="rgba(0,0,0,0.5)" />

            {/* City pins — matching world-clock style */}
            {MAP_CITIES.map(city => {
              const { x, y } = mapLatLngToSvg(city.lat, city.lng);
              const inDay = isDay(city.lat, city.lng);
              const isHov = hovered === city.name;
              const dotColor = inDay ? '#818CF8' : '#22D3EE';
              const timeColor = inDay ? '#FDE68A' : '#7DD3FC';
              let timeFmt = '';
              try { timeFmt = new Intl.DateTimeFormat('en-US', { timeZone: city.tz, hour: 'numeric', minute: '2-digit', hour12: true }).format(now); } catch { timeFmt = '--:--'; }
              const forceRight = ['Singapore', 'Mumbai', 'Tokyo', 'Seoul', 'Hong Kong'].includes(city.name);
              const labelOnLeft = !forceRight && x > 700;
              const labelX = labelOnLeft ? x - 10 : x + 10;
              const anchor = labelOnLeft ? 'end' as const : 'start' as const;
              const labelW = city.name.length * 4.5 + 70;
              const bgX = labelOnLeft ? labelX - labelW : labelX - 2;

              return (
                <g key={city.name} onMouseEnter={() => setHovered(city.name)} onMouseLeave={() => setHovered(null)} style={{ cursor: 'pointer' }}>
                  <circle cx={x} cy={y} r={isHov ? 12 : 7} fill={dotColor} fillOpacity={isHov ? 0.25 : 0.12} />
                  <circle cx={x} cy={y} r={isHov ? 4.5 : 3} fill={dotColor} stroke="#0a1628" strokeWidth="1.5" />
                  <rect x={bgX} y={y - 8} width={labelW} height={16} rx="3" fill="rgba(11,22,36,0.9)" stroke={isHov ? 'rgba(129,140,248,0.5)' : 'rgba(42,74,107,0.4)'} strokeWidth="0.5" />
                  <text x={labelX} y={y + 2} textAnchor={anchor} fill={isHov ? '#A5B4FC' : '#E2E8F0'} fontSize="8" fontFamily="Inter, sans-serif" fontWeight="600">
                    {inDay ? '☀ ' : '🌙 '}{city.name}
                  </text>
                  <text x={labelOnLeft ? bgX + 3 : bgX + labelW - 3} y={y + 2} textAnchor={labelOnLeft ? 'start' : 'end'} fill={timeColor} fontSize="8" fontFamily="Inter, sans-serif" fontWeight="700">
                    {timeFmt}
                  </text>
                  {isHov && (
                    <foreignObject x={x - 85} y={y - 80} width="170" height="70">
                      <div style={{ background: 'rgba(11,22,36,0.97)', border: '1px solid rgba(79,70,229,0.4)', borderRadius: '10px', padding: '6px 10px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#4F46E5', fontFamily: 'Inter, sans-serif' }}>
                          {city.flag} {city.name}, {city.country}
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                          {timeFmt}
                        </div>
                        <div style={{ fontSize: '9px', color: '#CBD5E1', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                          {inDay ? '☀️ Day' : '🌙 Night'} · {new Intl.DateTimeFormat('en-US', { timeZone: city.tz, weekday: 'short', month: 'short', day: 'numeric' }).format(now)}
                        </div>
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}

            {/* Sun marker */}
            {(() => {
              const { x, y } = mapLatLngToSvg(declination, subsolarLng);
              return (
                <g>
                  <circle cx={x} cy={y} r={10} fill="rgba(250,204,21,0.15)" />
                  <circle cx={x} cy={y} r={5} fill="#fbbf24" stroke="#f59e0b" strokeWidth={1.5} />
                </g>
              );
            })()}
          </svg>
        </div>
        {/* City time strip at bottom */}
        <div className="flex overflow-x-auto gap-0 border-t border-card-border/40" style={{ scrollbarWidth: 'none' }}>
          {MAP_CITIES.map((city) => {
            const inDay = isDay(city.lat, city.lng);
            return (
              <div key={city.name} className={`shrink-0 px-3 py-2 text-center border-r border-card-border/20 ${inDay ? 'bg-amber-500/5' : 'bg-blue-500/5'}`} style={{ minWidth: '100px' }}>
                <div className="text-[10px] text-muted truncate">{city.flag} {city.name}</div>
                <CityTime tz={city.tz} inDay={inDay} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CityTime({ tz, inDay }: { tz: string; inDay: boolean }) {
  const [t, setT] = useState('');
  useEffect(() => {
    const update = () => {
      try { setT(new Date().toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true })); }
      catch { setT('--:--'); }
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [tz]);
  return <div className={`font-mono text-xs font-bold ${inDay ? 'text-amber-300' : 'text-sky-300'}`}>{t}</div>;
}

function HomeMeetingPlanner() {
  const [cities, setCities] = useState<string[]>(['America/New_York', 'Europe/London', 'Asia/Kolkata', 'Asia/Tokyo']);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('home-planner-cities');
    if (saved) { try { const p = JSON.parse(saved); if (Array.isArray(p) && p.length > 0) { setCities(p); return; } } catch {} }
    // Most common global meeting corridors:
    // US East ↔ UK ↔ India ↔ Singapore ↔ US West
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const defaults = ['America/New_York', 'Europe/London', 'Asia/Kolkata', 'Asia/Singapore', 'Asia/Tokyo'];
    if (!defaults.includes(userTz)) {
      setCities([userTz, ...defaults.slice(0, 4)]);
    } else {
      setCities(defaults);
    }
  }, []);

  const addCity = (tz: string) => {
    if (!cities.includes(tz) && cities.length < 6) {
      const updated = [...cities, tz];
      setCities(updated);
      localStorage.setItem('home-planner-cities', JSON.stringify(updated));
    }
    setSearchOpen(false); setSearchQ('');
  };
  const removeCity = (tz: string) => {
    if (cities.length <= 1) return;
    const updated = cities.filter(c => c !== tz);
    setCities(updated);
    localStorage.setItem('home-planner-cities', JSON.stringify(updated));
  };

  // Best hours (green) and acceptable hours (yellow)
  const { bestHours, okHours } = useMemo(() => {
    const best = new Set<number>();
    const ok = new Set<number>();
    for (let h = 0; h < 24; h++) {
      const allBusiness = cities.every(tz => { const lh = getHourInTz(tz, h); return lh >= 9 && lh < 18; });
      const allAwake = cities.every(tz => { const lh = getHourInTz(tz, h); return lh >= 7 && lh < 21; });
      if (allBusiness) best.add(h);
      else if (allAwake) ok.add(h);
    }
    return { bestHours: best, okHours: ok };
  }, [cities]);

  const filtered = PLANNER_CITIES.filter(c => !cities.includes(c.tz) && c.name.toLowerCase().includes(searchQ.toLowerCase()));

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-violet-400" /> Meeting Planner
        </h2>
        <Link href="/meeting-planner" className="text-xs text-primary hover:text-primary/80 transition-colors">
          Full page →
        </Link>
      </div>

      {/* Best window banner */}
      {bestHours.size > 0 && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-green-900/30 border border-green-500/50 text-xs text-green-300 flex items-center gap-2">
          <span>✅</span>
          <span className="font-medium">{bestHours.size}h overlap — {formatHrHome(getHourInTz(cities[0], Array.from(bestHours).sort((a,b)=>a-b)[0]))} to {formatHrHome(getHourInTz(cities[0], Array.from(bestHours).sort((a,b)=>a-b)[bestHours.size - 1] + 1))} ({PLANNER_CITIES.find(c => c.tz === cities[0])?.name || 'local'})</span>
        </div>
      )}
      {bestHours.size === 0 && okHours.size > 0 && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-yellow-900/20 border border-yellow-500/50 text-xs text-yellow-300 flex items-center gap-2">
          <span>🟡</span>
          <span className="font-medium">{okHours.size}h acceptable window (early/evening for some)</span>
        </div>
      )}

      {/* Timeline grid */}
      <div className="rounded-xl border border-card-border bg-card-bg/30 overflow-hidden">
        {cities.map(tz => {
          const info = PLANNER_CITIES.find(c => c.tz === tz) || { name: tz.split('/').pop()?.replace(/_/g, ' ') || tz };
          return (
            <div key={tz} className="flex border-b border-card-border/40 last:border-b-0">
              <div className="w-28 sm:w-36 flex-shrink-0 px-3 py-2 border-r border-card-border flex items-center justify-between">
                <span className="text-xs font-medium text-white truncate">{info.name}</span>
                <button onClick={() => removeCity(tz)} className="p-0.5 text-muted/40 hover:text-red-400 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="flex-1 flex">
                {Array.from({ length: 24 }).map((_, utcH) => {
                  const localH = getHourInTz(tz, utcH);
                  const isBest = bestHours.has(utcH);
                  return (
                    <div
                      key={utcH}
                      className={`flex-1 flex items-center justify-center text-[9px] sm:text-[10px] py-2 cursor-pointer transition-all ${isBest ? 'bg-green-500/50 text-white font-bold shadow-[inset_0_2px_0_0_rgba(74,222,128,0.9),inset_0_-2px_0_0_rgba(74,222,128,0.9)]' : okHours.has(utcH) ? 'bg-yellow-500/30 text-yellow-100 font-medium shadow-[inset_0_2px_0_0_rgba(234,179,8,0.6),inset_0_-2px_0_0_rgba(234,179,8,0.6)]' : `border-r border-card-border/20 ${getHourColorHome(localH)}`} ${hovered === utcH ? 'brightness-150' : ''}`}
                      onMouseEnter={() => setHovered(utcH)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <span className="hidden sm:inline">{formatHrHome(localH)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend + Add city + Reset */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3 text-[10px] text-muted">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-green-700/50"></span>Good</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-yellow-700/40"></span>Maybe</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-900/40"></span>Avoid</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => { localStorage.removeItem('home-planner-cities'); window.location.reload(); }} className="text-[10px] text-muted hover:text-white transition-colors">
            ↺ Defaults
          </button>
        <div className="relative">
          {!searchOpen ? (
            <button onClick={() => setSearchOpen(true)} className="flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 transition-colors">
              <Plus className="w-3 h-3" /> Add city
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <input autoFocus value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search..." className="w-32 px-2 py-1 text-xs rounded-lg bg-card-bg border border-card-border text-white focus:outline-none focus:border-primary" />
              <button onClick={() => { setSearchOpen(false); setSearchQ(''); }} className="text-muted hover:text-white"><X className="w-3 h-3" /></button>
            </div>
          )}
          {searchOpen && filtered.length > 0 && (
            <div className="absolute right-0 top-full mt-1 w-40 max-h-40 overflow-y-auto rounded-lg border border-card-border bg-[#0F172A] shadow-xl z-50">
              {filtered.map(c => (
                <button key={c.tz} onClick={() => addCity(c.tz)} className="w-full text-left px-3 py-1.5 text-xs text-muted hover:bg-card-bg hover:text-white">{c.name}</button>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </section>
  );
}

// ─── Tool Cards ──────────────────────────────────────────────
const quickTools = [
  { href: "/world-clock", icon: Globe, title: "World Clock", desc: "Current time in any city", color: "from-primary/20 to-primary/5", iconColor: "text-primary" },
  { href: "/timezone-compare", icon: ArrowLeftRight, title: "Time Zone Converter", desc: "Convert between time zones", color: "from-pink-500/20 to-pink-500/5", iconColor: "text-pink-400" },
  { href: "/meeting-planner", icon: Users, title: "Meeting Planner", desc: "Find overlap across zones", color: "from-violet-500/20 to-violet-500/5", iconColor: "text-violet-400" },
  { href: "/countdown", icon: Timer, title: "Countdown Timer", desc: "Count down to any event", color: "from-rose-500/20 to-rose-500/5", iconColor: "text-rose-400" },
  { href: "/calendar", icon: CalendarDays, title: "Calendar", desc: "Monthly view with holidays", color: "from-amber-500/20 to-amber-500/5", iconColor: "text-amber-400" },
];

const exploreCategories = [
  { href: "/astronomy", icon: Telescope, title: "Astronomy", desc: "Moon phases, planets, APOD", color: "text-purple-400" },
  { href: "/iss-tracker", icon: Satellite, title: "Space", desc: "ISS tracker, launches, news", color: "text-emerald-400" },
  { href: "/eclipses", icon: Moon, title: "Eclipses", desc: "Upcoming solar & lunar", color: "text-amber-400" },
  { href: "/launches", icon: Rocket, title: "Launches", desc: "Upcoming rocket launches", color: "text-orange-400" },
];

// ─── Inline Age Calculator ──────────────────────────────────
function InlineAgeCalculator() {
  const [dob, setDob] = useState("");
  const [expanded, setExpanded] = useState(false);

  const result = useMemo(() => {
    if (!dob) return null;
    const birth = new Date(dob + "T00:00:00");
    if (isNaN(birth.getTime())) return null;
    const now = new Date();
    if (birth > now) return null;

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }

    const totalDays = Math.floor((now.getTime() - birth.getTime()) / 86400000);
    const totalHours = totalDays * 24;

    // Next birthday
    const nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday <= now) nextBday.setFullYear(nextBday.getFullYear() + 1);
    const daysUntilBday = Math.ceil((nextBday.getTime() - now.getTime()) / 86400000);

    // Extended info
    const dayOfWeek = birth.toLocaleDateString("en-US", { weekday: "long" });
    const zodiacSigns = [
      { sign: "Capricorn", start: [0, 20] }, { sign: "Aquarius", start: [1, 19] },
      { sign: "Pisces", start: [2, 19] }, { sign: "Aries", start: [3, 21] },
      { sign: "Taurus", start: [4, 20] }, { sign: "Gemini", start: [5, 21] },
      { sign: "Cancer", start: [6, 22] }, { sign: "Leo", start: [7, 23] },
      { sign: "Virgo", start: [8, 23] }, { sign: "Libra", start: [9, 23] },
      { sign: "Scorpio", start: [10, 22] }, { sign: "Sagittarius", start: [11, 22] },
      { sign: "Capricorn", start: [11, 32] },
    ];
    const m = birth.getMonth(), d = birth.getDate();
    let zodiac = "Capricorn";
    for (let i = zodiacSigns.length - 1; i >= 0; i--) {
      if (m > zodiacSigns[i].start[0] || (m === zodiacSigns[i].start[0] && d >= zodiacSigns[i].start[1])) {
        zodiac = zodiacSigns[i].sign; break;
      }
    }

    const birthYear = birth.getFullYear();
    let generation = "Unknown";
    if (birthYear >= 2013) generation = "Gen Alpha";
    else if (birthYear >= 1997) generation = "Gen Z";
    else if (birthYear >= 1981) generation = "Millennial";
    else if (birthYear >= 1965) generation = "Gen X";
    else if (birthYear >= 1946) generation = "Baby Boomer";
    else generation = "Silent Generation";

    const heartbeats = Math.round(totalDays * 24 * 60 * 72);
    const breaths = Math.round(totalDays * 24 * 60 * 16);

    return { years, months, days, totalDays, totalHours, daysUntilBday, dayOfWeek, zodiac, generation, heartbeats, breaths };
  }, [dob]);

  return (
    <div className="rounded-xl border border-card-border bg-card-bg/40 overflow-hidden flex flex-col">
      <div className="h-1.5 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500" />
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-bold text-white">Age Calculator</h3>
        </div>
        <input
          type="date"
          value={dob}
          onChange={e => setDob(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg bg-dark-bg border border-card-border text-white focus:outline-none focus:border-rose-400 mb-3"
          max={new Date().toISOString().split("T")[0]}
        />
        {!result && <p className="text-xs text-muted">Enter your birth date</p>}
        {result && (
          <div className="space-y-2 flex-1">
            <p className="text-sm text-white font-medium">
              You are <span className="text-rose-400">{result.years}</span> years, <span className="text-rose-400">{result.months}</span> months, <span className="text-rose-400">{result.days}</span> days old
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-dark-bg/60 rounded-lg p-2">
                <p className="text-muted">Total days</p>
                <p className="text-white font-mono font-medium">{result.totalDays.toLocaleString()}</p>
              </div>
              <div className="bg-dark-bg/60 rounded-lg p-2">
                <p className="text-muted">Total hours</p>
                <p className="text-white font-mono font-medium">{result.totalHours.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs text-muted">Next birthday in <span className="text-rose-300 font-medium">{result.daysUntilBday}</span> days</p>

            {!expanded && (
              <button onClick={() => setExpanded(true)} className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors">
                More details...
              </button>
            )}
            {expanded && (
              <div className="space-y-1.5 pt-1 border-t border-card-border/50">
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                  <p className="text-muted">Generation: <span className="text-white">{result.generation}</span></p>
                  <p className="text-muted">Zodiac: <span className="text-white">{result.zodiac}</span></p>
                  <p className="text-muted">Born on: <span className="text-white">{result.dayOfWeek}</span></p>
                  <p className="text-muted">Heartbeats: <span className="text-white">~{(result.heartbeats / 1e9).toFixed(1)}B</span></p>
                  <p className="text-muted">Breaths: <span className="text-white">~{(result.breaths / 1e6).toFixed(0)}M</span></p>
                </div>
                <button onClick={() => setExpanded(false)} className="text-[11px] text-muted hover:text-white transition-colors">
                  Show less
                </button>
              </div>
            )}
          </div>
        )}
        <Link href="/age-calculator" className="mt-auto pt-2 text-[11px] text-rose-400 hover:text-rose-300 transition-colors">
          Full version &rarr;
        </Link>
      </div>
    </div>
  );
}

// ─── Inline Stopwatch ───────────────────────────────────────
function InlineStopwatch() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  const tick = useCallback(() => {
    setElapsed(Date.now() - startRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = () => {
    startRef.current = Date.now() - elapsed;
    setRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  };

  const stop = () => {
    setRunning(false);
    cancelAnimationFrame(rafRef.current);
  };

  const reset = () => {
    stop();
    setElapsed(0);
    setLaps([]);
  };

  const lap = () => {
    if (running) setLaps(prev => [elapsed, ...prev]);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const mins = Math.floor(elapsed / 60000);
  const secs = Math.floor((elapsed % 60000) / 1000);
  const ms = Math.floor((elapsed % 1000) / 10);

  return (
    <div className="rounded-xl border border-card-border bg-card-bg/40 overflow-hidden flex flex-col">
      <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Timer className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Stopwatch</h3>
        </div>

        {/* Time display */}
        <div className="text-center mb-4">
          <p className="font-mono text-3xl font-bold text-white tabular-nums">
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
            <span className="text-lg text-muted">.{String(ms).padStart(2, "0")}</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {!running ? (
            <button onClick={start} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors">
              <Play className="w-3 h-3" /> Start
            </button>
          ) : (
            <button onClick={stop} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors">
              <Pause className="w-3 h-3" /> Stop
            </button>
          )}
          <button onClick={lap} disabled={!running} className="px-3 py-2 rounded-lg border border-card-border text-xs text-muted hover:text-white hover:border-primary disabled:opacity-40 transition-colors">
            Lap
          </button>
          <button onClick={reset} className="flex items-center gap-1 px-3 py-2 rounded-lg border border-card-border text-xs text-muted hover:text-white hover:border-red-400 transition-colors">
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>

        {/* Laps */}
        {laps.length > 0 && (
          <div className="max-h-[100px] overflow-y-auto space-y-1 border-t border-card-border/50 pt-2">
            {laps.slice(0, 5).map((l, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-muted">Lap {laps.length - i}</span>
                <span className="font-mono text-white">
                  {String(Math.floor(l / 60000)).padStart(2, "0")}:{String(Math.floor((l % 60000) / 1000)).padStart(2, "0")}.{String(Math.floor((l % 1000) / 10)).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        )}

        <Link href="/stopwatch" className="mt-auto pt-2 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors">
          Full version &rarr;
        </Link>
      </div>
    </div>
  );
}

// ─── Inline Date Difference ─────────────────────────────────
function InlineDateDifference() {
  const today = new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState(today);
  const [showTotal, setShowTotal] = useState(false);

  const result = useMemo(() => {
    if (!fromDate || !toDate) return null;
    const from = new Date(fromDate + "T00:00:00");
    const to = new Date(toDate + "T00:00:00");
    if (isNaN(from.getTime()) || isNaN(to.getTime())) return null;

    const diffMs = Math.abs(to.getTime() - from.getTime());
    const totalDays = Math.round(diffMs / 86400000);

    // Breakdown
    const start = from <= to ? from : to;
    const end = from <= to ? to : from;
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    if (days < 0) { months--; days += new Date(end.getFullYear(), end.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }

    const weeks = Math.floor(totalDays / 7);
    const hours = totalDays * 24;

    return { years, months, days, totalDays, weeks, hours };
  }, [fromDate, toDate]);

  return (
    <div className="rounded-xl border border-card-border bg-card-bg/40 overflow-hidden flex flex-col">
      <div className="h-1.5 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-bold text-white">Date Difference</h3>
        </div>

        <div className="space-y-2 mb-3">
          <div>
            <label className="text-[10px] text-muted block mb-0.5">From</label>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-full px-3 py-1.5 text-sm rounded-lg bg-dark-bg border border-card-border text-white focus:outline-none focus:border-sky-400" />
          </div>
          <div>
            <label className="text-[10px] text-muted block mb-0.5">To</label>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-full px-3 py-1.5 text-sm rounded-lg bg-dark-bg border border-card-border text-white focus:outline-none focus:border-sky-400" />
          </div>
        </div>

        {result && (
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => setShowTotal(false)} className={`text-[11px] px-2 py-0.5 rounded ${!showTotal ? 'bg-sky-500/30 text-sky-200' : 'text-muted hover:text-white'} transition-colors`}>Breakdown</button>
              <button onClick={() => setShowTotal(true)} className={`text-[11px] px-2 py-0.5 rounded ${showTotal ? 'bg-sky-500/30 text-sky-200' : 'text-muted hover:text-white'} transition-colors`}>Total days</button>
            </div>

            {!showTotal ? (
              <p className="text-sm text-white font-medium">
                <span className="text-sky-400">{result.years}</span> years, <span className="text-sky-400">{result.months}</span> months, <span className="text-sky-400">{result.days}</span> days
              </p>
            ) : (
              <p className="text-sm text-white font-medium">
                <span className="text-sky-400 text-lg font-mono">{result.totalDays.toLocaleString()}</span> total days
              </p>
            )}

            <p className="text-[11px] text-muted">
              That&apos;s about <span className="text-sky-300">{result.weeks.toLocaleString()}</span> weeks or <span className="text-sky-300">{result.hours.toLocaleString()}</span> hours
            </p>
          </div>
        )}

        <Link href="/date-difference" className="mt-auto pt-2 text-[11px] text-sky-400 hover:text-sky-300 transition-colors">
          Full version &rarr;
        </Link>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────
export default function Home() {
  const { theme } = useTheme();

  // If Mars theme, render completely different layout
  if (theme === 'mars') {
    return <MarsHome />;
  }

  return <DefaultHome />;
}

function DefaultHome() {
  const [userTz, setUserTz] = useState<string | null>(null);
  const [dateStr, setDateStr] = useState("");
  const [weekNum, setWeekNum] = useState(0);

  useEffect(() => {
    // Check for manual override first
    const override = localStorage.getItem('dateandtimezone_tz_override');
    const tz = override || Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTz(tz || "America/New_York");

    const now = new Date();
    setDateStr(
      now.toLocaleDateString("en-US", {
        timeZone: tz,
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );

    // Week number
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    setWeekNum(Math.ceil((diff / 86400000 + start.getDay() + 1) / 7));
  }, []);

  return (
    <>
      {/* ─── 1. Hero: Your Local Time + Weather + Location ─────── */}
      <HeroSection userTz={userTz} dateStr={dateStr} weekNum={weekNum} />

      {/* ─── 1b. Today Dashboard (sky + day progress + next event) ─ */}
      <TodayDashboard userTz={userTz} />

      {/* ─── 3. World Activity Ticker ────────────────────────── */}
      <WorldActivityTicker />

      {/* ─── 4. World Clock Row (customizable) ────────────────── */}
      <HomeWorldClock userTz={userTz} />

      {/* ─── 4b. Live World Map (day/night) ──────────────────── */}
      <LiveWorldMap />

      {/* ─── 5. Meeting Planner (Full) ──────────────────────── */}
      <HomeMeetingPlanner />

      {/* ─── 6. Inline Tools: Age Calculator + Stopwatch + Date Difference ─── */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="font-heading text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" /> Quick Calculators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InlineAgeCalculator />
          <InlineStopwatch />
          <InlineDateDifference />
        </div>
      </section>

      {/* ─── 7. Quick Tools ───────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="font-heading text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-secondary" /> Quick Tools
        </h2>
        <div className="grid gap-2 grid-cols-2 lg:grid-cols-3">
          {quickTools.map(({ href, icon: Icon, title, desc, color, iconColor }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-3 rounded-xl border border-card-border bg-card-bg/40 px-4 py-3 transition-all hover:border-primary/40 hover:bg-card-bg/70"
            >
              <div className={`shrink-0 h-9 w-9 flex items-center justify-center rounded-lg bg-gradient-to-br ${color}`}>
                <Icon className={`h-4 w-4 ${iconColor}`} />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading text-sm font-semibold text-white group-hover:text-primary transition-colors truncate">{title}</h3>
                <p className="text-[11px] text-muted leading-snug truncate">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 8. Test Your Knowledge ──────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-card-border bg-gradient-to-br from-violet-950/40 via-card-bg/60 to-indigo-950/40 p-6 sm:p-8 overflow-hidden relative">
          {/* Background sparkles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="absolute w-1 h-1 bg-violet-400/40 rounded-full animate-pulse" style={{ top: `${10 + Math.random() * 80}%`, left: `${5 + Math.random() * 90}%`, animationDelay: `${i * 0.3}s` }} />
            ))}
          </div>

          <div className="relative">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold text-white">Test Your Knowledge</h2>
                <p className="text-xs text-muted">5 quizzes · 55 questions · compete with yourself</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mt-5">
              <Link href="/quiz/timezone" className="group rounded-xl bg-gradient-to-br from-primary/20 to-indigo-500/10 border border-primary/30 p-4 hover:border-primary/60 hover:from-primary/30 transition-all">
                <Globe className="w-6 h-6 text-primary mb-2" />
                <p className="font-semibold text-sm text-white group-hover:text-primary transition-colors">Timezone Challenge</p>
                <p className="text-[11px] text-muted mt-1">Guess the time worldwide</p>
              </Link>
              <Link href="/quiz/space" className="group rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 p-4 hover:border-orange-500/60 hover:from-orange-500/30 transition-all">
                <Rocket className="w-6 h-6 text-orange-400 mb-2" />
                <p className="font-semibold text-sm text-white group-hover:text-orange-400 transition-colors">Space Trivia</p>
                <p className="text-[11px] text-muted mt-1">15 questions about space</p>
              </Link>
              <Link href="/quiz/flags" className="group rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 p-4 hover:border-green-500/60 hover:from-green-500/30 transition-all">
                <Globe className="w-6 h-6 text-green-400 mb-2" />
                <p className="font-semibold text-sm text-white group-hover:text-green-400 transition-colors">Flags & Countries</p>
                <p className="text-[11px] text-muted mt-1">Match flags to nations</p>
              </Link>
              <Link href="/quiz/moon" className="group rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/10 border border-yellow-500/30 p-4 hover:border-yellow-500/60 hover:from-yellow-500/30 transition-all">
                <Moon className="w-6 h-6 text-yellow-400 mb-2" />
                <p className="font-semibold text-sm text-white group-hover:text-yellow-400 transition-colors">Moon & Eclipse</p>
                <p className="text-[11px] text-muted mt-1">Test your lunar knowledge</p>
              </Link>
              <Link href="/quiz/astronomy" className="group rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/10 border border-cyan-500/30 p-4 hover:border-cyan-500/60 hover:from-cyan-500/30 transition-all">
                <Telescope className="w-6 h-6 text-cyan-400 mb-2" />
                <p className="font-semibold text-sm text-white group-hover:text-cyan-400 transition-colors">Astronomy</p>
                <p className="text-[11px] text-muted mt-1">Stars & constellations</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AdBanner />

      {/* ─── 9. Quick Time Challenge ─────────────────────────── */}
      <QuickChallenge />

      {/* ─── 10. Explore ───────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <h2 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Telescope className="w-5 h-5 text-purple-400" /> Explore
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {exploreCategories.map(({ href, icon: Icon, title, desc, color }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col items-center text-center rounded-xl border border-card-border bg-card-bg/40 p-4 transition-all hover:border-primary/40 hover:bg-card-bg/70"
            >
              <Icon className={`h-7 w-7 ${color} mb-2`} />
              <h3 className="text-sm font-semibold text-white group-hover:text-primary transition-colors">{title}</h3>
              <p className="mt-1 text-[11px] text-muted leading-snug">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 11. Space News ───────────────────────────────────── */}
      <SpaceNewsWidget />

      {/* ─── 12. Daily Streak Counter ──────────────────────── */}
      <DailyStreakCounter />

      {/* ─── 13. Achievement Badges ────────────────────────── */}
      <AchievementBadges />

      {/* ─── 14. Footer CTA ────────────────────────────────────── */}
      <section className="border-t border-card-border/60 bg-card-bg/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-xl font-bold text-white sm:text-2xl">
            Free tools for time, dates, and space
          </h2>
          <p className="mt-2 text-sm text-muted max-w-lg mx-auto">
            50+ tools for time zones, calendars, astronomy, and space exploration. No sign-up, no ads, completely free.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/world-clock" className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
              World Clock
            </Link>
            <Link href="/astronomy" className="px-5 py-2.5 rounded-lg border border-card-border text-white text-sm font-medium hover:bg-card-bg transition-colors">
              Astronomy
            </Link>
            <Link href="/iss-tracker" className="px-5 py-2.5 rounded-lg border border-card-border text-white text-sm font-medium hover:bg-card-bg transition-colors">
              ISS Tracker
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
