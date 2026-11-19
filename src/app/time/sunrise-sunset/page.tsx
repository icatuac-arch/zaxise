"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Search,
  Sun,
  Sunrise,
  Sunset,
  Clock,
  Camera,
  Calendar,
  ChevronDown,
  MapPin,
  Sparkles,
  Globe,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  CITY DATA                                                          */
/* ------------------------------------------------------------------ */

interface City {
  name: string;
  country: string;
  lat: number;
  lng: number;
}

const CITIES: City[] = [
  { name: "New York", country: "US", lat: 40.71, lng: -74.01 },
  { name: "London", country: "UK", lat: 51.51, lng: -0.13 },
  { name: "Tokyo", country: "JP", lat: 35.68, lng: 139.69 },
  { name: "Mumbai", country: "IN", lat: 19.08, lng: 72.88 },
  { name: "Sydney", country: "AU", lat: -33.87, lng: 151.21 },
  { name: "Paris", country: "FR", lat: 48.86, lng: 2.35 },
  { name: "Dubai", country: "AE", lat: 25.2, lng: 55.27 },
  { name: "Los Angeles", country: "US", lat: 34.05, lng: -118.24 },
  { name: "Singapore", country: "SG", lat: 1.35, lng: 103.82 },
  { name: "Hong Kong", country: "CN", lat: 22.32, lng: 114.17 },
  { name: "Chicago", country: "US", lat: 41.88, lng: -87.63 },
  { name: "Berlin", country: "DE", lat: 52.52, lng: 13.41 },
  { name: "Moscow", country: "RU", lat: 55.76, lng: 37.62 },
  { name: "Cairo", country: "EG", lat: 30.04, lng: 31.24 },
  { name: "Sao Paulo", country: "BR", lat: -23.55, lng: -46.63 },
  { name: "Toronto", country: "CA", lat: 43.65, lng: -79.38 },
  { name: "Seoul", country: "KR", lat: 37.57, lng: 126.98 },
  { name: "Bangkok", country: "TH", lat: 13.76, lng: 100.5 },
  { name: "Mexico City", country: "MX", lat: 19.43, lng: -99.13 },
  { name: "Istanbul", country: "TR", lat: 40.98, lng: 29.02 },
  { name: "Jakarta", country: "ID", lat: -6.21, lng: 106.85 },
  { name: "Buenos Aires", country: "AR", lat: -34.6, lng: -58.38 },
  { name: "Lagos", country: "NG", lat: 6.45, lng: 3.4 },
  { name: "Nairobi", country: "KE", lat: -1.29, lng: 36.82 },
  { name: "Shanghai", country: "CN", lat: 31.23, lng: 121.47 },
  { name: "Delhi", country: "IN", lat: 28.61, lng: 77.21 },
  { name: "Bangalore", country: "IN", lat: 12.97, lng: 77.59 },
  { name: "San Francisco", country: "US", lat: 37.77, lng: -122.42 },
  { name: "Seattle", country: "US", lat: 47.61, lng: -122.33 },
  { name: "Denver", country: "US", lat: 39.74, lng: -104.99 },
  { name: "Miami", country: "US", lat: 25.76, lng: -80.19 },
  { name: "Houston", country: "US", lat: 29.76, lng: -95.37 },
  { name: "Dallas", country: "US", lat: 32.78, lng: -96.8 },
  { name: "Atlanta", country: "US", lat: 33.75, lng: -84.39 },
  { name: "Boston", country: "US", lat: 42.36, lng: -71.06 },
  { name: "Vancouver", country: "CA", lat: 49.28, lng: -123.12 },
  { name: "Rome", country: "IT", lat: 41.9, lng: 12.5 },
  { name: "Madrid", country: "ES", lat: 40.42, lng: -3.7 },
  { name: "Amsterdam", country: "NL", lat: 52.37, lng: 4.9 },
  { name: "Stockholm", country: "SE", lat: 59.33, lng: 18.07 },
  { name: "Oslo", country: "NO", lat: 59.91, lng: 10.75 },
  { name: "Helsinki", country: "FI", lat: 60.17, lng: 24.94 },
  { name: "Reykjavik", country: "IS", lat: 64.15, lng: -21.94 },
  { name: "Anchorage", country: "US", lat: 61.22, lng: -149.9 },
  { name: "Honolulu", country: "US", lat: 21.31, lng: -157.86 },
  { name: "Auckland", country: "NZ", lat: -36.85, lng: 174.76 },
  { name: "Cape Town", country: "ZA", lat: -33.93, lng: 18.42 },
  { name: "Johannesburg", country: "ZA", lat: -26.2, lng: 28.05 },
  { name: "Santiago", country: "CL", lat: -33.45, lng: -70.67 },
  { name: "Lima", country: "PE", lat: -12.05, lng: -77.04 },
];

/* Timezone to city rough mapping */
const TZ_CITY_MAP: Record<string, string> = {
  "America/New_York": "New York",
  "America/Chicago": "Chicago",
  "America/Denver": "Denver",
  "America/Los_Angeles": "Los Angeles",
  "America/Anchorage": "Anchorage",
  "Pacific/Honolulu": "Honolulu",
  "America/Toronto": "Toronto",
  "America/Vancouver": "Vancouver",
  "America/Mexico_City": "Mexico City",
  "America/Sao_Paulo": "Sao Paulo",
  "America/Buenos_Aires": "Buenos Aires",
  "America/Argentina/Buenos_Aires": "Buenos Aires",
  "America/Santiago": "Santiago",
  "America/Lima": "Lima",
  "America/Bogota": "Lima",
  "Europe/London": "London",
  "Europe/Paris": "Paris",
  "Europe/Berlin": "Berlin",
  "Europe/Rome": "Rome",
  "Europe/Madrid": "Madrid",
  "Europe/Amsterdam": "Amsterdam",
  "Europe/Stockholm": "Stockholm",
  "Europe/Oslo": "Oslo",
  "Europe/Helsinki": "Helsinki",
  "Europe/Moscow": "Moscow",
  "Europe/Istanbul": "Istanbul",
  "Atlantic/Reykjavik": "Reykjavik",
  "Asia/Dubai": "Dubai",
  "Asia/Kolkata": "Mumbai",
  "Asia/Calcutta": "Mumbai",
  "Asia/Bangkok": "Bangkok",
  "Asia/Singapore": "Singapore",
  "Asia/Hong_Kong": "Hong Kong",
  "Asia/Shanghai": "Shanghai",
  "Asia/Tokyo": "Tokyo",
  "Asia/Seoul": "Seoul",
  "Asia/Jakarta": "Jakarta",
  "Africa/Cairo": "Cairo",
  "Africa/Lagos": "Lagos",
  "Africa/Nairobi": "Nairobi",
  "Africa/Johannesburg": "Johannesburg",
  "Australia/Sydney": "Sydney",
  "Pacific/Auckland": "Auckland",
  "America/Houston": "Houston",
  "America/Phoenix": "Denver",
  "US/Eastern": "New York",
  "US/Central": "Chicago",
  "US/Mountain": "Denver",
  "US/Pacific": "Los Angeles",
};

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

interface SunData {
  sunrise: string;
  sunset: string;
  solar_noon: string;
  day_length: number;
  civil_twilight_begin: string;
  civil_twilight_end: string;
  nautical_twilight_begin: string;
  nautical_twilight_end: string;
  astronomical_twilight_begin: string;
  astronomical_twilight_end: string;
}

interface ForecastDay {
  date: string;
  data: SunData | null;
}

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function formatTime(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "--:--";
  }
}

function formatDayLength(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function timeToMinutes(isoStr: string): number {
  const d = new Date(isoStr);
  return d.getUTCHours() * 60 + d.getUTCMinutes();
}

function todayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function friendlyDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/*  HERO SVG                                                           */
/* ------------------------------------------------------------------ */

function HeroSVG() {
  return (
    <svg
      viewBox="0 0 800 200"
      className="w-full max-w-3xl mx-auto h-auto"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="25%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#38BDF8" />
          <stop offset="75%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </linearGradient>
        <linearGradient id="sunGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
        <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#030712" />
        </linearGradient>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0F172A" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#030712" />
        </linearGradient>
      </defs>
      {/* Sky */}
      <rect x="0" y="0" width="800" height="140" fill="url(#skyGrad)" />
      {/* Sun glow */}
      <circle cx="200" cy="120" r="80" fill="url(#glowGrad)" />
      {/* Sun */}
      <circle cx="200" cy="120" r="28" fill="url(#sunGrad)" />
      {/* Horizon line */}
      <rect x="0" y="130" width="800" height="2" fill="#F97316" opacity="0.5" />
      {/* Ground / water */}
      <rect x="0" y="132" width="800" height="68" fill="url(#groundGrad)" />
      {/* Water reflections */}
      <rect x="170" y="140" width="60" height="2" rx="1" fill="#FBBF24" opacity="0.25" />
      <rect x="180" y="150" width="40" height="1.5" rx="1" fill="#FBBF24" opacity="0.15" />
      <rect x="185" y="158" width="30" height="1" rx="1" fill="#FBBF24" opacity="0.1" />
      {/* Stars (right/night side) */}
      {[
        [620, 30],
        [680, 55],
        [740, 20],
        [710, 80],
        [660, 100],
        [750, 60],
        [600, 70],
        [770, 110],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.2} fill="white" opacity={0.6 + (i % 3) * 0.15} />
      ))}
      {/* Clouds */}
      <ellipse cx="350" cy="60" rx="40" ry="12" fill="white" opacity="0.08" />
      <ellipse cx="370" cy="55" rx="30" ry="10" fill="white" opacity="0.06" />
      <ellipse cx="500" cy="40" rx="35" ry="10" fill="white" opacity="0.05" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  TIMELINE BAR                                                       */
/* ------------------------------------------------------------------ */

function TimelineBar({ data }: { data: SunData }) {
  const segments = useMemo(() => {
    const toMin = (iso: string) => timeToMinutes(iso);
    const astroBegin = toMin(data.astronomical_twilight_begin);
    const nautBegin = toMin(data.nautical_twilight_begin);
    const civilBegin = toMin(data.civil_twilight_begin);
    const sunrise = toMin(data.sunrise);
    const sunset = toMin(data.sunset);
    const civilEnd = toMin(data.civil_twilight_end);
    const nautEnd = toMin(data.nautical_twilight_end);
    const astroEnd = toMin(data.astronomical_twilight_end);

    return [
      { start: 0, end: astroBegin, color: "#0C1526", label: "Night" },
      { start: astroBegin, end: nautBegin, color: "#1E2A5E", label: "Astronomical" },
      { start: nautBegin, end: civilBegin, color: "#2D4A8C", label: "Nautical" },
      { start: civilBegin, end: sunrise, color: "#F97316", label: "Civil" },
      { start: sunrise, end: sunset, color: "#FBBF24", label: "Daytime" },
      { start: sunset, end: civilEnd, color: "#F97316", label: "Civil" },
      { start: civilEnd, end: nautEnd, color: "#2D4A8C", label: "Nautical" },
      { start: nautEnd, end: astroEnd, color: "#1E2A5E", label: "Astronomical" },
      { start: astroEnd, end: 1440, color: "#0C1526", label: "Night" },
    ];
  }, [data]);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-slate-400 font-outfit">
        24-Hour Daylight Timeline (UTC)
      </h4>
      <div className="relative w-full h-8 rounded-lg overflow-hidden flex">
        {segments.map((seg, i) => {
          const width = ((seg.end - seg.start) / 1440) * 100;
          if (width <= 0) return null;
          return (
            <div
              key={i}
              className="h-full relative group"
              style={{ width: `${width}%`, backgroundColor: seg.color }}
            >
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-xs text-slate-300 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 border border-slate-700">
                {seg.label}
              </div>
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        {[
          { color: "#0C1526", label: "Night" },
          { color: "#1E2A5E", label: "Astro. Twilight" },
          { color: "#2D4A8C", label: "Nautical Twilight" },
          { color: "#F97316", label: "Civil Twilight" },
          { color: "#FBBF24", label: "Daytime" },
        ].map((item) => (
          <span key={item.label} className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PAGE COMPONENT                                                */
/* ------------------------------------------------------------------ */

export default function SunriseSunsetPage() {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [sunData, setSunData] = useState<SunData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [error, setError] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* --- Detect timezone city on mount --- */
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const cityName = TZ_CITY_MAP[tz];
      if (cityName) {
        const found = CITIES.find((c) => c.name === cityName);
        if (found) {
          setSelectedCity(found);
          setQuery(`${found.name}, ${found.country}`);
        }
      }
    } catch {
      /* fallback: New York */
      setSelectedCity(CITIES[0]);
      setQuery(`${CITIES[0].name}, ${CITIES[0].country}`);
    }
  }, []);

  /* --- Close dropdown on outside click --- */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* --- Filtered cities --- */
  const filtered = useMemo(() => {
    if (!query.trim()) return CITIES.slice(0, 12);
    const q = query.toLowerCase();
    return CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [query]);

  /* --- Fetch sun data --- */
  const fetchSunData = useCallback(
    async (city: City, date: string) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `/api/sunrise-sunset?lat=${city.lat}&lng=${city.lng}&date=${date}`
        );
        const json = await res.json();
        if (json.status === "OK" && json.results) {
          setSunData(json.results);
        } else {
          setError("Unable to retrieve sun data for this location.");
          setSunData(null);
        }
      } catch {
        setError("Network error. Please try again.");
        setSunData(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /* --- Fetch 7-day forecast --- */
  const fetchForecast = useCallback(async (city: City, startDate: string) => {
    setForecastLoading(true);
    const days: ForecastDay[] = [];
    try {
      const promises = Array.from({ length: 7 }, (_, i) => {
        const d = addDays(startDate, i);
        return fetch(`/api/sunrise-sunset?lat=${city.lat}&lng=${city.lng}&date=${d}`)
          .then((r) => r.json())
          .then((json) => ({
            date: d,
            data: json.status === "OK" ? json.results : null,
          }));
      });
      const results = await Promise.all(promises);
      days.push(...results);
    } catch {
      /* partial results are fine */
    }
    setForecast(days);
    setForecastLoading(false);
  }, []);

  /* --- Auto-fetch when city or date changes --- */
  useEffect(() => {
    if (selectedCity) {
      fetchSunData(selectedCity, selectedDate);
      fetchForecast(selectedCity, selectedDate);
    }
  }, [selectedCity, selectedDate, fetchSunData, fetchForecast]);

  /* --- Select a city --- */
  function selectCity(city: City) {
    setSelectedCity(city);
    setQuery(`${city.name}, ${city.country}`);
    setShowDropdown(false);
  }

  /* --- Golden hour helpers --- */
  function goldenHourMorning(data: SunData): string {
    const sr = new Date(data.sunrise);
    const end = new Date(sr.getTime() + 60 * 60 * 1000);
    return `${formatTime(data.sunrise)} - ${formatTime(end.toISOString())}`;
  }
  function goldenHourEvening(data: SunData): string {
    const ss = new Date(data.sunset);
    const start = new Date(ss.getTime() - 60 * 60 * 1000);
    return `${formatTime(start.toISOString())} - ${formatTime(data.sunset)}`;
  }

  return (
    <div className="min-h-screen bg-[#030712]">
      {/* ===== HERO ===== */}
      <section className="relative pt-16 pb-10 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-950/20 via-indigo-950/20 to-[#030712] pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-400 text-sm font-medium">
            <Sunrise className="w-4 h-4" />
            Sun Calculator
          </div>
          <h1 className="font-outfit text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-amber-300 to-indigo-400 bg-clip-text text-transparent">
            Sunrise & Sunset Calculator
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            Discover precise sunrise, sunset, twilight, golden hour, and day
            length for any city worldwide.
          </p>
          <HeroSVG />
        </div>
      </section>

      {/* ===== SEARCH & DATE ===== */}
      <section className="max-w-5xl mx-auto px-4 -mt-2 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
          {/* City search */}
          <div className="relative" ref={dropdownRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search for a city..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0F172A] border border-[#1E293B] text-[#E2E8F0] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 font-inter text-sm transition-all"
              />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            </div>
            {showDropdown && filtered.length > 0 && (
              <div className="absolute z-30 top-full mt-1 w-full max-h-64 overflow-y-auto rounded-xl bg-[#0F172A] border border-[#1E293B] shadow-2xl">
                {filtered.map((city) => (
                  <button
                    key={`${city.name}-${city.country}`}
                    onClick={() => selectCity(city)}
                    className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-indigo-500/10 text-left transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="text-sm text-[#E2E8F0]">
                      {city.name},{" "}
                      <span className="text-slate-500">{city.country}</span>
                    </span>
                    <span className="ml-auto text-xs text-slate-600">
                      {city.lat.toFixed(2)}, {city.lng.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date picker */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none z-10" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-11 pr-4 py-3 rounded-xl bg-[#0F172A] border border-[#1E293B] text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 font-inter text-sm transition-all w-full md:w-52 [color-scheme:dark]"
            />
          </div>
        </div>
      </section>

      {/* ===== RESULTS ===== */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="max-w-5xl mx-auto px-4 pb-8">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        </div>
      )}

      {sunData && !loading && selectedCity && (
        <section className="max-w-5xl mx-auto px-4 pb-16 space-y-8">
          {/* Location header */}
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Globe className="w-4 h-4" />
            <span>
              {selectedCity.name}, {selectedCity.country}
            </span>
            <span className="text-slate-600">|</span>
            <span>{friendlyDate(selectedDate)}</span>
            <span className="text-slate-600">|</span>
            <span>
              {selectedCity.lat.toFixed(2)}N, {selectedCity.lng.toFixed(2)}E
            </span>
          </div>

          {/* Main cards row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Sunrise */}
            <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] p-6 text-center space-y-2 hover:border-orange-500/30 transition-colors">
              <div className="text-3xl">&#x1F305;</div>
              <div className="text-xs uppercase tracking-wider text-orange-400 font-medium">
                Sunrise
              </div>
              <div className="text-3xl font-bold text-[#E2E8F0] font-outfit">
                {formatTime(sunData.sunrise)}
              </div>
            </div>

            {/* Sunset */}
            <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] p-6 text-center space-y-2 hover:border-indigo-500/30 transition-colors">
              <div className="text-3xl">&#x1F307;</div>
              <div className="text-xs uppercase tracking-wider text-indigo-400 font-medium">
                Sunset
              </div>
              <div className="text-3xl font-bold text-[#E2E8F0] font-outfit">
                {formatTime(sunData.sunset)}
              </div>
            </div>

            {/* Day Length */}
            <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] p-6 text-center space-y-2 hover:border-cyan-500/30 transition-colors">
              <Clock className="w-8 h-8 mx-auto text-cyan-400" />
              <div className="text-xs uppercase tracking-wider text-cyan-400 font-medium">
                Day Length
              </div>
              <div className="text-3xl font-bold text-[#E2E8F0] font-outfit">
                {formatDayLength(sunData.day_length)}
              </div>
            </div>
          </div>

          <AdBanner />

          {/* Timeline */}
          <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] p-6">
            <TimelineBar data={sunData} />
          </div>

          {/* Detail grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Solar Noon & Twilight */}
            <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] p-6 space-y-4">
              <h3 className="text-lg font-semibold text-[#E2E8F0] font-outfit flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-400" />
                Solar Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Solar Noon</span>
                  <span className="text-[#E2E8F0] font-medium">
                    {formatTime(sunData.solar_noon)}
                  </span>
                </div>
                <div className="h-px bg-[#1E293B]" />
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Civil Twilight</span>
                  <span className="text-[#E2E8F0] font-medium">
                    {formatTime(sunData.civil_twilight_begin)} -{" "}
                    {formatTime(sunData.civil_twilight_end)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Nautical Twilight</span>
                  <span className="text-[#E2E8F0] font-medium">
                    {formatTime(sunData.nautical_twilight_begin)} -{" "}
                    {formatTime(sunData.nautical_twilight_end)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Astronomical Twilight</span>
                  <span className="text-[#E2E8F0] font-medium">
                    {formatTime(sunData.astronomical_twilight_begin)} -{" "}
                    {formatTime(sunData.astronomical_twilight_end)}
                  </span>
                </div>
              </div>
            </div>

            {/* Golden Hour */}
            <div className="rounded-2xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 p-6 space-y-4">
              <h3 className="text-lg font-semibold text-[#E2E8F0] font-outfit flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                Golden Hour
                <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  Best for photos
                </span>
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[#94A3B8] flex items-center gap-2">
                    <Sunrise className="w-4 h-4 text-orange-400" />
                    Morning Golden Hour
                  </span>
                  <span className="text-[#E2E8F0] font-medium">
                    {goldenHourMorning(sunData)}
                  </span>
                </div>
                <div className="h-px bg-amber-500/10" />
                <div className="flex justify-between items-center">
                  <span className="text-[#94A3B8] flex items-center gap-2">
                    <Sunset className="w-4 h-4 text-orange-400" />
                    Evening Golden Hour
                  </span>
                  <span className="text-[#E2E8F0] font-medium">
                    {goldenHourEvening(sunData)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-amber-400/60 mt-2">
                The golden hour produces warm, soft light ideal for photography.
                The low angle of the sun creates long shadows and a magical glow.
              </p>
            </div>
          </div>

          {/* ===== 7-DAY FORECAST ===== */}
          <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] p-6 space-y-4">
            <h3 className="text-lg font-semibold text-[#E2E8F0] font-outfit flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              7-Day Forecast
            </h3>
            {forecastLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-500 text-xs uppercase tracking-wider">
                      <th className="text-left py-2 pr-4 font-medium">Date</th>
                      <th className="text-center py-2 px-2 font-medium">
                        Sunrise
                      </th>
                      <th className="text-center py-2 px-2 font-medium">
                        Sunset
                      </th>
                      <th className="text-center py-2 px-2 font-medium">
                        Day Length
                      </th>
                      <th className="text-center py-2 pl-2 font-medium">
                        Solar Noon
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {forecast.map((day, i) => (
                      <tr
                        key={day.date}
                        className={`border-t border-[#1E293B] ${
                          i === 0 ? "bg-indigo-500/5" : ""
                        } hover:bg-indigo-500/5 transition-colors`}
                      >
                        <td className="py-3 pr-4 text-[#E2E8F0] font-medium whitespace-nowrap">
                          {friendlyDate(day.date)}
                          {i === 0 && (
                            <span className="ml-2 text-xs text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                              Today
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-center text-orange-400">
                          {day.data ? formatTime(day.data.sunrise) : "--"}
                        </td>
                        <td className="py-3 px-2 text-center text-indigo-400">
                          {day.data ? formatTime(day.data.sunset) : "--"}
                        </td>
                        <td className="py-3 px-2 text-center text-[#94A3B8]">
                          {day.data
                            ? formatDayLength(day.data.day_length)
                            : "--"}
                        </td>
                        <td className="py-3 pl-2 text-center text-[#94A3B8]">
                          {day.data
                            ? formatTime(day.data.solar_noon)
                            : "--"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ===== FUN FACTS ===== */}
          <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] p-6 space-y-6">
            <h3 className="text-lg font-semibold text-[#E2E8F0] font-outfit flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Sun Facts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Solstices */}
              <div className="rounded-xl bg-gradient-to-br from-orange-500/5 to-amber-500/5 border border-orange-500/10 p-5 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="w-5 h-5 text-orange-400" />
                  <h4 className="font-semibold text-[#E2E8F0] font-outfit text-sm">
                    Solstices
                  </h4>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  The <strong className="text-orange-400">summer solstice</strong> (around
                  June 21 in the Northern Hemisphere) is the longest day of the year, with the
                  sun reaching its highest point. The{" "}
                  <strong className="text-indigo-400">winter solstice</strong> (around Dec 21)
                  is the shortest day. In the Southern Hemisphere these dates are reversed.
                </p>
              </div>

              {/* Midnight Sun */}
              <div className="rounded-xl bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 border border-indigo-500/10 p-5 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-indigo-400" />
                  <h4 className="font-semibold text-[#E2E8F0] font-outfit text-sm">
                    Midnight Sun & Polar Night
                  </h4>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Above the <strong className="text-cyan-400">Arctic Circle</strong> (66.5 N)
                  and below the Antarctic Circle, the sun can stay above the horizon for 24
                  hours (<strong className="text-amber-400">midnight sun</strong>) in summer,
                  or never rise (<strong className="text-indigo-400">polar night</strong>) in
                  winter. Svalbard, Norway experiences midnight sun from April to August.
                </p>
              </div>

              {/* Red Sunsets */}
              <div className="rounded-xl bg-gradient-to-br from-red-500/5 to-orange-500/5 border border-red-500/10 p-5 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Sunset className="w-5 h-5 text-red-400" />
                  <h4 className="font-semibold text-[#E2E8F0] font-outfit text-sm">
                    Why Sunsets Are Red
                  </h4>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  At sunset the sun&apos;s light travels through more of Earth&apos;s
                  atmosphere. Shorter blue wavelengths scatter away (
                  <strong className="text-cyan-400">Rayleigh scattering</strong>), leaving
                  longer red and orange wavelengths to paint the sky. Dust, moisture, and
                  pollution can intensify the colors even further.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Prompt if no city selected yet */}
      {!selectedCity && !loading && (
        <div className="max-w-5xl mx-auto px-4 pb-16 text-center">
          <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] p-12 space-y-4">
            <MapPin className="w-12 h-12 mx-auto text-indigo-400 opacity-50" />
            <h3 className="text-lg font-semibold text-[#E2E8F0] font-outfit">
              Select a City
            </h3>
            <p className="text-sm text-[#94A3B8] max-w-md mx-auto">
              Search for a city above to see sunrise, sunset, twilight times,
              golden hour, and a 7-day forecast.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
