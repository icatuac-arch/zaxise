'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Sun,
  Moon,
  MapPin,
  Clock,
  Sparkles,
  Info,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import AdBanner from '@/components/time/AdBanner';

/* ───────────────── constants ───────────────── */

const CITIES = [
  { name: 'New York', lat: 40.7128, lng: -74.006, tz: 'America/New_York' },
  { name: 'London', lat: 51.5074, lng: -0.1278, tz: 'Europe/London' },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, tz: 'Europe/Paris' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, tz: 'Asia/Tokyo' },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, tz: 'Australia/Sydney' },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708, tz: 'Asia/Dubai' },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777, tz: 'Asia/Kolkata' },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, tz: 'America/Los_Angeles' },
  { name: 'Chicago', lat: 41.8781, lng: -87.6298, tz: 'America/Chicago' },
  { name: 'Berlin', lat: 52.52, lng: 13.405, tz: 'Europe/Berlin' },
  { name: 'Rome', lat: 41.9028, lng: 12.4964, tz: 'Europe/Rome' },
  { name: 'Cairo', lat: 30.0444, lng: 31.2357, tz: 'Africa/Cairo' },
  { name: 'São Paulo', lat: -23.5505, lng: -46.6333, tz: 'America/Sao_Paulo' },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, tz: 'Asia/Singapore' },
  { name: 'Hong Kong', lat: 22.3193, lng: 114.1694, tz: 'Asia/Hong_Kong' },
  { name: 'Istanbul', lat: 41.0082, lng: 28.9784, tz: 'Europe/Istanbul' },
  { name: 'Moscow', lat: 55.7558, lng: 37.6173, tz: 'Europe/Moscow' },
  { name: 'Mexico City', lat: 19.4326, lng: -99.1332, tz: 'America/Mexico_City' },
  { name: 'Bangkok', lat: 13.7563, lng: 100.5018, tz: 'Asia/Bangkok' },
  { name: 'Nairobi', lat: -1.2921, lng: 36.8219, tz: 'Africa/Nairobi' },
];

// Chaldean order (descending orbital period as known to ancients)
const CHALDEAN_ORDER = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'] as const;
type PlanetName = (typeof CHALDEAN_ORDER)[number];

// Day rulers: day-of-week → starting planet
// JS getDay(): 0=Sun,1=Mon,...6=Sat
const DAY_RULERS: PlanetName[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

const PLANET_META: Record<PlanetName, { symbol: string; color: string }> = {
  Sun: { symbol: '☉', color: '#FFD700' },
  Moon: { symbol: '☽', color: '#C0C0C0' },
  Mars: { symbol: '♂', color: '#FF4500' },
  Mercury: { symbol: '☿', color: '#87CEEB' },
  Jupiter: { symbol: '♃', color: '#FFA500' },
  Venus: { symbol: '♀', color: '#90EE90' },
  Saturn: { symbol: '♄', color: '#808080' },
};

interface HourEntry {
  index: number;
  start: Date;
  end: Date;
  planet: PlanetName;
  isDay: boolean;
}

/* ───────────────── helpers ───────────────── */

function formatTime(d: Date, tz: string) {
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: tz });
}

function calculatePlanetaryHours(
  sunrise: Date,
  sunset: Date,
  nextSunrise: Date,
  dayOfWeek: number,
): HourEntry[] {
  const dayDuration = sunset.getTime() - sunrise.getTime();
  const nightDuration = nextSunrise.getTime() - sunset.getTime();
  const dayHourLen = dayDuration / 12;
  const nightHourLen = nightDuration / 12;

  const startPlanet = DAY_RULERS[dayOfWeek];
  let chaldeanIdx = CHALDEAN_ORDER.indexOf(startPlanet);

  const hours: HourEntry[] = [];

  for (let i = 0; i < 12; i++) {
    const start = new Date(sunrise.getTime() + i * dayHourLen);
    const end = new Date(sunrise.getTime() + (i + 1) * dayHourLen);
    hours.push({
      index: i + 1,
      start,
      end,
      planet: CHALDEAN_ORDER[chaldeanIdx % 7],
      isDay: true,
    });
    chaldeanIdx++;
  }

  for (let i = 0; i < 12; i++) {
    const start = new Date(sunset.getTime() + i * nightHourLen);
    const end = new Date(sunset.getTime() + (i + 1) * nightHourLen);
    hours.push({
      index: i + 1,
      start,
      end,
      planet: CHALDEAN_ORDER[chaldeanIdx % 7],
      isDay: false,
    });
    chaldeanIdx++;
  }

  return hours;
}

/* ───────────────── component ───────────────── */

export default function PlanetaryHoursPage() {
  const [selectedCity, setSelectedCity] = useState(0);
  const [hours, setHours] = useState<HourEntry[]>([]);
  const [sunrise, setSunrise] = useState<Date | null>(null);
  const [sunset, setSunset] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [now, setNow] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Tick every 30s
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const city = CITIES[selectedCity];

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

      const [res1, res2] = await Promise.all([
        fetch(`/api/sunrise-sunset?lat=${city.lat}&lng=${city.lng}&date=${todayStr}`),
        fetch(`/api/sunrise-sunset?lat=${city.lat}&lng=${city.lng}&date=${tomorrowStr}`),
      ]);

      if (!res1.ok || !res2.ok) throw new Error('API error');
      const d1 = await res1.json();
      const d2 = await res2.json();

      if (d1.status === 'ERROR' || d2.status === 'ERROR') throw new Error('Data error');

      const sr = new Date(d1.results.sunrise);
      const ss = new Date(d1.results.sunset);
      const nsr = new Date(d2.results.sunrise);

      setSunrise(sr);
      setSunset(ss);

      const dayOfWeek = new Date().getDay();
      setHours(calculatePlanetaryHours(sr, ss, nsr, dayOfWeek));
    } catch {
      setError('Failed to fetch sunrise/sunset data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [city.lat, city.lng]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const currentHour = hours.find((h) => now >= h.start && now < h.end);

  const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
    new Date().getDay()
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12 pb-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            Ancient Time System
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-3">
            Planetary Hours Calculator
          </h1>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-base sm:text-lg">
            Discover which planet rules each hour of the day using the ancient Chaldean order from
            Babylonian and Hellenistic astrology.
          </p>
        </div>

        {/* City selector */}
        <div className="max-w-md mx-auto mb-8">
          <label className="block text-sm text-[#94A3B8] mb-2 flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> Select your location
          </label>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-3 text-[#E2E8F0] hover:border-primary/50 transition-colors"
            >
              <span>{city.name}</span>
              <ChevronDown className={`w-4 h-4 text-[#94A3B8] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute z-50 top-full mt-1 w-full bg-[#0F172A] border border-[#1E293B] rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                {CITIES.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => { setSelectedCity(i); setDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 hover:bg-primary/10 text-sm transition-colors ${
                      i === selectedCity ? 'text-primary bg-primary/5' : 'text-[#E2E8F0]'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Current info */}
        {currentHour && sunrise && sunset && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 text-center">
              <Sun className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <p className="text-xs text-[#94A3B8] mb-1">Sunrise</p>
              <p className="text-[#E2E8F0] font-medium">{formatTime(sunrise, city.tz)}</p>
            </div>
            <div
              className="border-2 rounded-xl p-4 text-center"
              style={{ borderColor: PLANET_META[currentHour.planet].color + '60', backgroundColor: PLANET_META[currentHour.planet].color + '08' }}
            >
              <span className="text-2xl" style={{ color: PLANET_META[currentHour.planet].color }}>
                {PLANET_META[currentHour.planet].symbol}
              </span>
              <p className="text-xs text-[#94A3B8] mt-1">Current Ruler</p>
              <p className="font-heading font-semibold" style={{ color: PLANET_META[currentHour.planet].color }}>
                {currentHour.planet}
              </p>
              <p className="text-xs text-[#94A3B8]">
                {currentHour.isDay ? 'Day' : 'Night'} Hour {currentHour.index}
              </p>
            </div>
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 text-center">
              <Moon className="w-5 h-5 text-blue-300 mx-auto mb-1" />
              <p className="text-xs text-[#94A3B8] mb-1">Sunset</p>
              <p className="text-[#E2E8F0] font-medium">{formatTime(sunset, city.tz)}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-[#94A3B8] mt-3">Calculating planetary hours...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center text-red-400 mb-8">
            {error}
          </div>
        )}

        {/* Tables */}
        {!loading && hours.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Day hours */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#1E293B] flex items-center gap-2">
                <Sun className="w-4 h-4 text-yellow-400" />
                <h2 className="font-heading font-semibold text-[#E2E8F0]">
                  Day Hours ({dayName})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#1E293B] text-[#94A3B8]">
                      <th className="px-3 py-2 text-left">#</th>
                      <th className="px-3 py-2 text-left">Start</th>
                      <th className="px-3 py-2 text-left">End</th>
                      <th className="px-3 py-2 text-left">Planet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hours.filter((h) => h.isDay).map((h) => {
                      const isCurrent = currentHour && h.start.getTime() === currentHour.start.getTime();
                      const meta = PLANET_META[h.planet];
                      return (
                        <tr
                          key={`day-${h.index}`}
                          className={`border-b border-[#1E293B]/50 transition-colors ${
                            isCurrent ? 'bg-primary/10' : 'hover:bg-white/[0.02]'
                          }`}
                        >
                          <td className="px-3 py-2 text-[#94A3B8]">{h.index}</td>
                          <td className="px-3 py-2 text-[#E2E8F0]">{formatTime(h.start, city.tz)}</td>
                          <td className="px-3 py-2 text-[#E2E8F0]">{formatTime(h.end, city.tz)}</td>
                          <td className="px-3 py-2">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="text-lg" style={{ color: meta.color }}>{meta.symbol}</span>
                              <span style={{ color: meta.color }} className="font-medium">{h.planet}</span>
                              {isCurrent && (
                                <span className="ml-1 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-semibold">
                                  NOW
                                </span>
                              )}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Night hours */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#1E293B] flex items-center gap-2">
                <Moon className="w-4 h-4 text-blue-300" />
                <h2 className="font-heading font-semibold text-[#E2E8F0]">Night Hours</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#1E293B] text-[#94A3B8]">
                      <th className="px-3 py-2 text-left">#</th>
                      <th className="px-3 py-2 text-left">Start</th>
                      <th className="px-3 py-2 text-left">End</th>
                      <th className="px-3 py-2 text-left">Planet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hours.filter((h) => !h.isDay).map((h) => {
                      const isCurrent = currentHour && h.start.getTime() === currentHour.start.getTime();
                      const meta = PLANET_META[h.planet];
                      return (
                        <tr
                          key={`night-${h.index}`}
                          className={`border-b border-[#1E293B]/50 transition-colors ${
                            isCurrent ? 'bg-primary/10' : 'hover:bg-white/[0.02]'
                          }`}
                        >
                          <td className="px-3 py-2 text-[#94A3B8]">{h.index}</td>
                          <td className="px-3 py-2 text-[#E2E8F0]">{formatTime(h.start, city.tz)}</td>
                          <td className="px-3 py-2 text-[#E2E8F0]">{formatTime(h.end, city.tz)}</td>
                          <td className="px-3 py-2">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="text-lg" style={{ color: meta.color }}>{meta.symbol}</span>
                              <span style={{ color: meta.color }} className="font-medium">{h.planet}</span>
                              {isCurrent && (
                                <span className="ml-1 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-semibold">
                                  NOW
                                </span>
                              )}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <AdBanner />

        {/* Planet Legend */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 mb-8">
          <h3 className="font-heading font-semibold text-[#E2E8F0] mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-secondary" /> The Seven Classical Planets
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {CHALDEAN_ORDER.map((p) => (
              <div key={p} className="bg-dark-bg rounded-lg p-3 text-center border border-[#1E293B]">
                <span className="text-2xl block mb-1" style={{ color: PLANET_META[p].color }}>
                  {PLANET_META[p].symbol}
                </span>
                <span className="text-sm font-medium" style={{ color: PLANET_META[p].color }}>
                  {p}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 mb-8">
          <h3 className="font-heading font-semibold text-[#E2E8F0] mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-secondary" /> What Are Planetary Hours?
          </h3>
          <div className="text-sm text-[#94A3B8] space-y-3 leading-relaxed">
            <p>
              Planetary hours are an ancient time-division system dating back to{' '}
              <span className="text-[#E2E8F0]">Babylonian astrology</span> (circa 7th century BCE)
              and later refined in{' '}
              <span className="text-[#E2E8F0]">Hellenistic astrology</span>. Unlike our modern
              60-minute hours, planetary hours divide the period of daylight into 12 equal segments
              and the period of darkness into another 12 segments.
            </p>
            <p>
              Each hour is ruled by one of the seven classical &ldquo;planets&rdquo; visible to the naked eye:{' '}
              <span className="text-[#E2E8F0]">Saturn, Jupiter, Mars, the Sun, Venus, Mercury, and the Moon</span>.
              They cycle in the <span className="text-[#E2E8F0]">Chaldean order</span> &mdash; from the
              slowest-moving celestial body (Saturn) to the fastest (Moon).
            </p>
            <p>
              The first hour after sunrise is ruled by the planet that governs that day of the week &mdash;
              which is why <span className="text-[#E2E8F0]">Sunday</span> begins with the{' '}
              <span style={{ color: '#FFD700' }}>Sun</span>,{' '}
              <span className="text-[#E2E8F0]">Monday</span> with the{' '}
              <span style={{ color: '#C0C0C0' }}>Moon</span>,{' '}
              <span className="text-[#E2E8F0]">Tuesday</span> with{' '}
              <span style={{ color: '#FF4500' }}>Mars</span> (Mardi in French), and so on. This
              system is preserved in the names of weekdays across many languages.
            </p>
            <p>
              In traditional practice, planetary hours were used to elect auspicious times for
              activities: the Hour of Venus for love, Jupiter for prosperity, Mars for courage, and
              Mercury for communication.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500/70 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-500/70">
            <span className="font-semibold">Disclaimer:</span> Planetary hours are presented for
            entertainment and cultural reference only. This tool is meant to explore an ancient
            historical system, not to provide astrological advice.
          </p>
        </div>
      </div>
    </div>
  );
}
