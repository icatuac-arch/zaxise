'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Phone,
  PhoneCall,
  Clock,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Sun,
  Moon,
} from 'lucide-react';
import AdBanner from '@/components/time/AdBanner';

/* ───────────────── city data ───────────────── */

const CITIES = [
  { name: 'New York', tz: 'America/New_York' },
  { name: 'Los Angeles', tz: 'America/Los_Angeles' },
  { name: 'Chicago', tz: 'America/Chicago' },
  { name: 'Denver', tz: 'America/Denver' },
  { name: 'Toronto', tz: 'America/Toronto' },
  { name: 'Vancouver', tz: 'America/Vancouver' },
  { name: 'Mexico City', tz: 'America/Mexico_City' },
  { name: 'São Paulo', tz: 'America/Sao_Paulo' },
  { name: 'Buenos Aires', tz: 'America/Argentina/Buenos_Aires' },
  { name: 'London', tz: 'Europe/London' },
  { name: 'Paris', tz: 'Europe/Paris' },
  { name: 'Berlin', tz: 'Europe/Berlin' },
  { name: 'Rome', tz: 'Europe/Rome' },
  { name: 'Madrid', tz: 'Europe/Madrid' },
  { name: 'Moscow', tz: 'Europe/Moscow' },
  { name: 'Istanbul', tz: 'Europe/Istanbul' },
  { name: 'Dubai', tz: 'Asia/Dubai' },
  { name: 'Mumbai', tz: 'Asia/Kolkata' },
  { name: 'Delhi', tz: 'Asia/Kolkata' },
  { name: 'Bangkok', tz: 'Asia/Bangkok' },
  { name: 'Singapore', tz: 'Asia/Singapore' },
  { name: 'Hong Kong', tz: 'Asia/Hong_Kong' },
  { name: 'Beijing', tz: 'Asia/Shanghai' },
  { name: 'Seoul', tz: 'Asia/Seoul' },
  { name: 'Tokyo', tz: 'Asia/Tokyo' },
  { name: 'Sydney', tz: 'Australia/Sydney' },
  { name: 'Melbourne', tz: 'Australia/Melbourne' },
  { name: 'Auckland', tz: 'Pacific/Auckland' },
  { name: 'Cairo', tz: 'Africa/Cairo' },
  { name: 'Nairobi', tz: 'Africa/Nairobi' },
  { name: 'Lagos', tz: 'Africa/Lagos' },
  { name: 'Johannesburg', tz: 'Africa/Johannesburg' },
];

function getCurrentTimeInTz(tz: string): string {
  return new Date().toLocaleTimeString('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function getCurrentHourInTz(tz: string): number {
  const str = new Date().toLocaleString('en-US', { timeZone: tz, hour: 'numeric', hour12: false });
  return parseInt(str, 10) % 24;
}

type SlotType = 'both-awake' | 'one-sleeping' | 'optimal';

function getSlotType(myHour: number, theirHour: number): SlotType {
  const myAwake = myHour >= 8 && myHour < 22;
  const theirAwake = theirHour >= 8 && theirHour < 22;
  if (myAwake && theirAwake) {
    // Optimal: both between 9-21
    const myGood = myHour >= 9 && myHour < 21;
    const theirGood = theirHour >= 9 && theirHour < 21;
    if (myGood && theirGood) return 'optimal';
    return 'both-awake';
  }
  return 'one-sleeping';
}

/* ───────────────── dropdown ───────────────── */

function CityDropdown({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (i: number) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = CITIES.map((c, i) => ({ ...c, idx: i })).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex-1 min-w-[200px]">
      <label className="block text-sm text-[#94A3B8] mb-1.5">{label}</label>
      <div className="relative">
        <button
          onClick={() => { setOpen(!open); setSearch(''); }}
          className="w-full flex items-center justify-between bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-3 text-[#E2E8F0] hover:border-primary/50 transition-colors"
        >
          <span>{CITIES[value].name}</span>
          <ChevronDown className={`w-4 h-4 text-[#94A3B8] transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="absolute z-50 top-full mt-1 w-full bg-[#0F172A] border border-[#1E293B] rounded-lg shadow-2xl max-h-64 overflow-hidden">
            <div className="p-2 border-b border-[#1E293B]">
              <input
                type="text"
                placeholder="Search cities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-dark-bg border border-[#1E293B] rounded px-3 py-1.5 text-sm text-[#E2E8F0] outline-none focus:border-primary/50"
                autoFocus
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filtered.map((c) => (
                <button
                  key={c.idx}
                  onClick={() => { onChange(c.idx); setOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-primary/10 transition-colors ${
                    c.idx === value ? 'text-primary bg-primary/5' : 'text-[#E2E8F0]'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────────────── component ───────────────── */

export default function CallPlannerPage() {
  const [myCity, setMyCity] = useState(0); // New York
  const [theirCity, setTheirCity] = useState(24); // Tokyo
  const [, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const myTz = CITIES[myCity].tz;
  const theirTz = CITIES[theirCity].tz;
  const myTime = getCurrentTimeInTz(myTz);
  const theirTime = getCurrentTimeInTz(theirTz);
  const theirCurrentHour = getCurrentHourInTz(theirTz);
  const theirAwakeNow = theirCurrentHour >= 8 && theirCurrentHour < 22;

  // Build 24-hour comparison (hours in YOUR city)
  const hourSlots = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 24 }, (_, myH) => {
      // For each local hour in your city, compute what hour it is in their city
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate(), myH, 0, 0);
      const theirStr = d.toLocaleString('en-US', { timeZone: theirTz, hour: 'numeric', hour12: false });
      const theirH = parseInt(theirStr, 10) % 24;
      const type = getSlotType(myH, theirH);
      return { myH, theirH, type };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myTz, theirTz]);

  // Best calling windows (contiguous optimal/both-awake blocks)
  const bestWindows = useMemo(() => {
    const good = hourSlots.filter((s) => s.type !== 'one-sleeping');
    if (good.length === 0) return [];
    // find contiguous
    const windows: { start: number; end: number; optimal: boolean }[] = [];
    let wStart = good[0].myH;
    let wOptimal = good[0].type === 'optimal';
    for (let i = 1; i < good.length; i++) {
      if (good[i].myH !== good[i - 1].myH + 1) {
        windows.push({ start: wStart, end: good[i - 1].myH + 1, optimal: wOptimal });
        wStart = good[i].myH;
        wOptimal = good[i].type === 'optimal';
      } else {
        if (good[i].type === 'optimal') wOptimal = true;
      }
    }
    windows.push({ start: wStart, end: good[good.length - 1].myH + 1, optimal: wOptimal });
    return windows.sort((a, b) => (b.end - b.start) - (a.end - a.start)).slice(0, 2);
  }, [hourSlots]);

  const formatH = (h: number) => {
    if (h === 0) return '12 AM';
    if (h < 12) return `${h} AM`;
    if (h === 12) return '12 PM';
    return `${h - 12} PM`;
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12 pb-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm mb-4">
            <Phone className="w-4 h-4" />
            Cross-timezone Calls
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-3">
            Call Planner
          </h1>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-base sm:text-lg">
            Find the best time to call friends and family across time zones.
          </p>
        </div>

        {/* City selectors */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <CityDropdown value={myCity} onChange={setMyCity} label="I'm in..." />
          <CityDropdown value={theirCity} onChange={setTheirCity} label="I want to call someone in..." />
        </div>

        {/* Live clocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 text-center">
            <p className="text-sm text-[#94A3B8] mb-1">Your time &mdash; {CITIES[myCity].name}</p>
            <p className="font-heading text-3xl font-bold text-[#E2E8F0] font-mono">{myTime}</p>
          </div>
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 text-center">
            <p className="text-sm text-[#94A3B8] mb-1">Their time &mdash; {CITIES[theirCity].name}</p>
            <p className="font-heading text-3xl font-bold text-[#E2E8F0] font-mono">{theirTime}</p>
          </div>
        </div>

        {/* Call now indicator */}
        <div
          className={`rounded-xl p-4 mb-8 flex items-center gap-3 border ${
            theirAwakeNow
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}
        >
          {theirAwakeNow ? (
            <>
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-emerald-400 font-semibold">Good time to call!</p>
                <p className="text-sm text-[#94A3B8]">
                  It&apos;s {theirTime} in {CITIES[theirCity].name} &mdash; they&apos;re likely awake.
                </p>
              </div>
              <PhoneCall className="w-5 h-5 text-emerald-400 ml-auto animate-pulse" />
            </>
          ) : (
            <>
              <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-red-400 font-semibold">Not the best time</p>
                <p className="text-sm text-[#94A3B8]">
                  It&apos;s {theirTime} in {CITIES[theirCity].name} &mdash; they may be sleeping.
                </p>
              </div>
              <Moon className="w-5 h-5 text-red-400 ml-auto" />
            </>
          )}
        </div>

        <AdBanner />

        {/* Best windows suggestion */}
        {bestWindows.length > 0 && (
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 mb-8">
            <h3 className="font-heading font-semibold text-[#E2E8F0] mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-secondary" />
              Best Calling Windows (your time)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bestWindows.map((w, i) => (
                <div
                  key={i}
                  className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4"
                >
                  <p className="text-emerald-400 font-semibold text-lg">
                    {formatH(w.start)} &mdash; {formatH(w.end)}
                  </p>
                  <p className="text-sm text-[#94A3B8] mt-1">
                    That&apos;s {formatH(hourSlots[w.start]?.theirH ?? 0)} &mdash;{' '}
                    {formatH(hourSlots[(w.end - 1 + 24) % 24]?.theirH !== undefined ? (hourSlots[(w.end - 1 + 24) % 24].theirH + 1) % 24 : 0)}{' '}
                    in {CITIES[theirCity].name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 24-hour visual grid */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1E293B]">
            <h3 className="font-heading font-semibold text-[#E2E8F0] flex items-center gap-2">
              <Sun className="w-4 h-4 text-yellow-400" />
              24-Hour Comparison
            </h3>
            <div className="flex gap-4 mt-2 text-xs text-[#94A3B8]">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-emerald-500/40" /> Both awake
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-emerald-400/60" /> Best time
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-red-500/30" /> Someone sleeping
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E293B] text-[#94A3B8]">
                  <th className="px-3 py-2 text-left">Your Time</th>
                  <th className="px-3 py-2 text-left">Their Time</th>
                  <th className="px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {hourSlots.map((slot) => {
                  const isCurrent =
                    getCurrentHourInTz(myTz) === slot.myH;
                  return (
                    <tr
                      key={slot.myH}
                      className={`border-b border-[#1E293B]/50 transition-colors ${
                        isCurrent ? 'bg-primary/10' : 'hover:bg-white/[0.02]'
                      }`}
                    >
                      <td className="px-3 py-2">
                        <span className="font-mono text-[#E2E8F0]">{formatH(slot.myH)}</span>
                        {isCurrent && (
                          <span className="ml-2 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-semibold">
                            NOW
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 font-mono text-[#E2E8F0]">{formatH(slot.theirH)}</td>
                      <td className="px-3 py-2">
                        {slot.type === 'optimal' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            Best time
                          </span>
                        ) : slot.type === 'both-awake' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400/70 text-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500/50" />
                            Both awake
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-400/70 text-xs">
                            <span className="w-2 h-2 rounded-full bg-red-500/40" />
                            Someone sleeping
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
