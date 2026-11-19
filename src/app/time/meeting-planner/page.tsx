'use client';

import { useState, useMemo, useEffect } from 'react';
import { Plus, X, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import AdBanner from '@/components/time/AdBanner';

const CITIES = [
  { name: 'New York', tz: 'America/New_York' },
  { name: 'Los Angeles', tz: 'America/Los_Angeles' },
  { name: 'Chicago', tz: 'America/Chicago' },
  { name: 'Denver', tz: 'America/Denver' },
  { name: 'Toronto', tz: 'America/Toronto' },
  { name: 'São Paulo', tz: 'America/Sao_Paulo' },
  { name: 'London', tz: 'Europe/London' },
  { name: 'Paris', tz: 'Europe/Paris' },
  { name: 'Berlin', tz: 'Europe/Berlin' },
  { name: 'Amsterdam', tz: 'Europe/Amsterdam' },
  { name: 'Moscow', tz: 'Europe/Moscow' },
  { name: 'Istanbul', tz: 'Europe/Istanbul' },
  { name: 'Dubai', tz: 'Asia/Dubai' },
  { name: 'Mumbai', tz: 'Asia/Kolkata' },
  { name: 'Delhi', tz: 'Asia/Kolkata' },
  { name: 'Bangalore', tz: 'Asia/Kolkata' },
  { name: 'Singapore', tz: 'Asia/Singapore' },
  { name: 'Hong Kong', tz: 'Asia/Hong_Kong' },
  { name: 'Shanghai', tz: 'Asia/Shanghai' },
  { name: 'Tokyo', tz: 'Asia/Tokyo' },
  { name: 'Seoul', tz: 'Asia/Seoul' },
  { name: 'Sydney', tz: 'Australia/Sydney' },
  { name: 'Auckland', tz: 'Pacific/Auckland' },
];

function getHourInTz(tz: string, baseDate: Date, utcHour: number): number {
  const d = new Date(baseDate);
  d.setUTCHours(utcHour, 0, 0, 0);
  // Use hour12: false to get 0-23 range
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', hour12: false }).formatToParts(d);
  const hourPart = parts.find(p => p.type === 'hour');
  const h = parseInt(hourPart?.value || '0');
  return h === 24 ? 0 : h;
}

function getHourColor(hour: number): string {
  // Traffic light: green = good, yellow = maybe, red = bad
  if (hour >= 9 && hour < 18) return 'bg-green-700/50 text-green-200 font-medium';
  if (hour >= 7 && hour < 9) return 'bg-yellow-700/40 text-yellow-200';
  if (hour >= 18 && hour < 21) return 'bg-yellow-700/40 text-yellow-200';
  return 'bg-red-900/40 text-red-300/70';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getHourBg(hour: number): string {
  if (hour >= 0 && hour < 6) return '#1e293b';
  if (hour >= 6 && hour < 9) return '#0c4a6e';
  if (hour >= 9 && hour < 18) return '#064e3b';
  if (hour >= 18 && hour < 21) return '#78350f';
  return '#1e293b';
}

function formatHour(h: number): string {
  const hour = ((h % 24) + 24) % 24;
  if (hour === 0) return '12am';
  if (hour < 12) return `${hour}am`;
  if (hour === 12) return '12pm';
  return `${hour - 12}pm`;
}

function formatHourFull(h: number): string {
  const hour = ((h % 24) + 24) % 24;
  if (hour === 0) return '12:00 AM';
  if (hour < 12) return `${hour}:00 AM`;
  if (hour === 12) return '12:00 PM';
  return `${hour - 12}:00 PM`;
}

export default function MeetingPlannerPage() {
  const [selectedCities, setSelectedCities] = useState<string[]>(['America/New_York', 'Europe/London', 'Asia/Kolkata', 'Asia/Tokyo']);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [baseDate, setBaseDate] = useState(new Date());
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // Load saved cities — if none saved, use defaults with user's TZ
    const saved = localStorage.getItem('meeting-planner-cities');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedCities(parsed);
          return;
        }
      } catch {}
    }
    // First visit — same 5 defaults as homepage planner
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const base = ['America/New_York', 'Europe/London', 'Asia/Kolkata', 'Asia/Singapore', 'Asia/Tokyo'];
    const defaults = (base.includes(userTz) ? base : [userTz, ...base.slice(0, 4)]).filter((v, i, a) => a.indexOf(v) === i);
    setSelectedCities(defaults);
    localStorage.setItem('meeting-planner-cities', JSON.stringify(defaults));
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const addCity = (tz: string) => {
    if (!selectedCities.includes(tz) && selectedCities.length < 8) {
      const updated = [...selectedCities, tz];
      setSelectedCities(updated);
      localStorage.setItem('meeting-planner-cities', JSON.stringify(updated));
    }
    setSearchOpen(false);
    setSearchQuery('');
  };

  const removeCity = (tz: string) => {
    if (selectedCities.length <= 1) return; // must keep at least 1
    const updated = selectedCities.filter(c => c !== tz);
    setSelectedCities(updated);
    localStorage.setItem('meeting-planner-cities', JSON.stringify(updated));
  };

  const filteredCities = useMemo(() => {
    if (!searchQuery) return CITIES.filter(c => !selectedCities.includes(c.tz));
    return CITIES.filter(c => !selectedCities.includes(c.tz) && c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, selectedCities]);

  const shiftDate = (days: number) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + days);
    setBaseDate(d);
  };

  // Get current hour in UTC for the "now" indicator
  const nowUtcHour = now.getUTCHours() + now.getUTCMinutes() / 60;

  // Find hours where ALL cities are in business hours (green = 9-18)
  // Also find "acceptable" hours (yellow = 7-21, everyone awake)
  const { bestHours, okHours } = useMemo(() => {
    const best = new Set<number>();
    const ok = new Set<number>();
    for (let utcH = 0; utcH < 24; utcH++) {
      const allBusiness = selectedCities.every(tz => {
        const localH = getHourInTz(tz, baseDate, utcH);
        return localH >= 9 && localH < 18;
      });
      const allAwake = selectedCities.every(tz => {
        const localH = getHourInTz(tz, baseDate, utcH);
        return localH >= 7 && localH < 21;
      });
      if (allBusiness) best.add(utcH);
      else if (allAwake) ok.add(utcH);
    }
    return { bestHours: best, okHours: ok };
  }, [selectedCities, baseDate]);

  return (
    <div className="min-h-screen bg-dark-bg text-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold text-white flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" /> Meeting Planner
            </h1>
            <p className="text-sm text-muted mt-1">Find the perfect time across time zones</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => shiftDate(-1)} className="p-2 rounded-lg border border-card-border hover:bg-card-bg transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium px-3">{baseDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            <button onClick={() => shiftDate(1)} className="p-2 rounded-lg border border-card-border hover:bg-card-bg transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={() => setBaseDate(new Date())} className="px-3 py-2 text-xs rounded-lg border border-card-border hover:bg-card-bg transition-colors ml-2">
              Today
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-xs text-muted">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-700/50"></span> Good (9am–6pm)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-yellow-700/40"></span> Maybe (7–9am, 6–9pm)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-900/40"></span> Avoid (night)</span>
        </div>

        {/* Best time banner */}
        {bestHours.size > 0 && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-green-900/30 border-2 border-green-500/60 flex items-center gap-3">
            <span className="text-xl">✅</span>
            <div>
              <p className="text-sm font-semibold text-green-300">Best meeting window ({bestHours.size}h overlap)</p>
              <p className="text-xs text-green-400/80">
                {(() => {
                  const hours = Array.from(bestHours).sort((a, b) => a - b);
                  const first = getHourInTz(selectedCities[0], baseDate, hours[0]);
                  const last = getHourInTz(selectedCities[0], baseDate, hours[hours.length - 1]);
                  const cityName = CITIES.find(c => c.tz === selectedCities[0])?.name || selectedCities[0].split('/').pop();
                  return `${formatHourFull(first)} – ${formatHourFull(last + 1)} ${cityName} time`;
                })()}
              </p>
              {okHours.size > 0 && (
                <p className="text-xs text-yellow-400/70 mt-1">
                  + {okHours.size}h acceptable window (early/evening — highlighted in yellow below)
                </p>
              )}
            </div>
          </div>
        )}
        {bestHours.size === 0 && okHours.size > 0 && selectedCities.length > 1 && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-yellow-900/20 border-2 border-yellow-500/50 flex items-center gap-3">
            <span className="text-xl">🟡</span>
            <div>
              <p className="text-sm font-semibold text-yellow-300">No perfect overlap, but {okHours.size}h acceptable window found</p>
              <p className="text-xs text-yellow-400/80">
                {(() => {
                  const hours = Array.from(okHours).sort((a, b) => a - b);
                  const first = getHourInTz(selectedCities[0], baseDate, hours[0]);
                  const last = getHourInTz(selectedCities[0], baseDate, hours[hours.length - 1]);
                  const cityName = CITIES.find(c => c.tz === selectedCities[0])?.name || selectedCities[0].split('/').pop();
                  return `${formatHourFull(first)} – ${formatHourFull(last + 1)} ${cityName} time (early morning or evening for some)`;
                })()}
              </p>
            </div>
          </div>
        )}
        {bestHours.size === 0 && okHours.size === 0 && selectedCities.length > 1 && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-900/20 border border-red-500/40 flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <p className="text-sm text-red-300">No reasonable overlap found. These time zones are too far apart — consider async communication or splitting into two meetings.</p>
          </div>
        )}

        {/* Timeline Grid */}
        <div className="rounded-2xl border border-card-border bg-card-bg/30 overflow-hidden relative">
          {/* Hour header row */}
          <div className="flex border-b border-card-border">
            <div className="w-36 sm:w-44 flex-shrink-0 p-3 border-r border-card-border">
              <span className="text-xs text-muted">Location</span>
            </div>
            <div className="flex-1 flex">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 text-center text-[10px] py-2 border-r border-card-border/30 ${bestHours.has(i) ? 'bg-green-500/30 text-green-200 font-bold border-b-2 border-b-green-400' : okHours.has(i) ? 'bg-yellow-500/20 text-yellow-200 font-medium border-b-2 border-b-yellow-400/60' : 'text-muted'}`}
                >
                  {i % 3 === 0 ? `${i}:00` : ''}
                </div>
              ))}
            </div>
          </div>

          {/* City rows — horizontal timeline bars */}
          {selectedCities.map(tz => {
            const cityInfo = CITIES.find(c => c.tz === tz) || { name: tz.split('/').pop()?.replace(/_/g, ' ') || tz, tz };
            return (
              <div key={tz} className="flex border-b border-card-border/50 last:border-b-0 group">
                {/* City label */}
                <div className="w-36 sm:w-44 flex-shrink-0 p-3 border-r border-card-border flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{cityInfo.name}</p>
                    <p className="text-[10px] text-muted">
                      {now.toLocaleTimeString('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true })}
                    </p>
                  </div>
                  <button onClick={() => removeCity(tz)} className="p-1 rounded hover:bg-red-500/20 text-muted/50 hover:text-red-400 transition-all">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 24 hour tiles */}
                <div className="flex-1 flex">
                  {Array.from({ length: 24 }).map((_, utcHour) => {
                    const localHour = getHourInTz(tz, baseDate, utcHour);
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const isNow = Math.floor(nowUtcHour) === utcHour;
                    const isHovered = hoveredHour === utcHour;
                    return (
                      <div
                        key={utcHour}
                        className={`flex-1 flex items-center justify-center text-[10px] sm:text-xs py-3 cursor-pointer transition-all ${bestHours.has(utcHour) ? 'bg-green-500/50 text-white font-bold border-x border-green-400/80 shadow-[inset_0_2px_0_0_rgba(74,222,128,0.9),inset_0_-2px_0_0_rgba(74,222,128,0.9)]' : okHours.has(utcHour) ? 'bg-yellow-500/30 text-yellow-100 font-medium border-x border-yellow-400/50 shadow-[inset_0_2px_0_0_rgba(234,179,8,0.6),inset_0_-2px_0_0_rgba(234,179,8,0.6)]' : `border-r border-card-border/20 ${getHourColor(localHour)}`} ${isHovered ? 'brightness-150' : ''}`}
                        onMouseEnter={() => setHoveredHour(utcHour)}
                        onMouseLeave={() => setHoveredHour(null)}
                        title={`${cityInfo.name}: ${formatHourFull(localHour)}`}
                      >
                        <span className="hidden sm:inline">{formatHour(localHour)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <AdBanner />

        {/* Hover indicator */}
        {hoveredHour !== null && (
          <div className="mt-3 p-3 rounded-xl border border-card-border bg-card-bg/60 text-sm">
            <div className="flex flex-wrap gap-4">
              {selectedCities.map(tz => {
                const cityInfo = CITIES.find(c => c.tz === tz) || { name: tz.split('/').pop()?.replace(/_/g, ' ') || tz };
                const localHour = getHourInTz(tz, baseDate, hoveredHour);
                const isBusinessHour = localHour >= 9 && localHour < 18;
                return (
                  <span key={tz} className="flex items-center gap-1.5">
                    <span className="font-medium text-white">{cityInfo.name}:</span>
                    <span className={isBusinessHour ? 'text-emerald-400 font-medium' : 'text-muted'}>{formatHourFull(localHour)}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Add city + Reset */}
        <div className="mt-4 flex items-center gap-3">
          <div className="relative">
          {!searchOpen ? (
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-card-border text-sm text-muted hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="w-4 h-4" /> Add city
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search city..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-card-bg border border-card-border text-white text-sm focus:outline-none focus:border-primary"
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="p-2.5 rounded-xl border border-card-border hover:bg-card-bg">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {searchOpen && filteredCities.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-72 max-h-60 overflow-y-auto rounded-xl border border-card-border bg-[#0F172A] shadow-2xl z-50">
              {filteredCities.map(city => (
                <button
                  key={city.tz + city.name}
                  onClick={() => addCity(city.tz)}
                  className="w-full text-left px-4 py-2.5 text-sm text-muted hover:bg-card-bg hover:text-white transition-colors border-b border-card-border/30 last:border-b-0"
                >
                  {city.name}
                </button>
              ))}
            </div>
          )}
          </div>
          <button
            onClick={() => { localStorage.removeItem('meeting-planner-cities'); window.location.reload(); }}
            className="px-4 py-2.5 rounded-xl border border-card-border text-sm text-muted hover:border-primary hover:text-white transition-colors"
          >
            ↺ Reset to defaults
          </button>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 rounded-xl border border-card-border/50 bg-card-bg/20 text-xs text-muted">
          <p className="font-medium text-white mb-1">Tips:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Green zones are ideal for meetings (9am–6pm business hours)</li>
            <li>Hover over any hour to see the exact time in all locations</li>
            <li>The highlighted column shows the current time</li>
            <li>Add up to 8 cities to compare</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
