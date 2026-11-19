'use client';

import { useState, useMemo } from 'react';
import { Plane, Clock, Globe, ArrowRight } from 'lucide-react';
import AdBanner from '@/components/time/AdBanner';

interface CityData {
  name: string;
  timezone: string;
  utcOffset: number; // hours from UTC
}

const cities: CityData[] = [
  { name: 'New York', timezone: 'America/New_York', utcOffset: -5 },
  { name: 'Los Angeles', timezone: 'America/Los_Angeles', utcOffset: -8 },
  { name: 'Chicago', timezone: 'America/Chicago', utcOffset: -6 },
  { name: 'London', timezone: 'Europe/London', utcOffset: 0 },
  { name: 'Paris', timezone: 'Europe/Paris', utcOffset: 1 },
  { name: 'Berlin', timezone: 'Europe/Berlin', utcOffset: 1 },
  { name: 'Moscow', timezone: 'Europe/Moscow', utcOffset: 3 },
  { name: 'Dubai', timezone: 'Asia/Dubai', utcOffset: 4 },
  { name: 'Mumbai', timezone: 'Asia/Kolkata', utcOffset: 5.5 },
  { name: 'Delhi', timezone: 'Asia/Kolkata', utcOffset: 5.5 },
  { name: 'Bangkok', timezone: 'Asia/Bangkok', utcOffset: 7 },
  { name: 'Singapore', timezone: 'Asia/Singapore', utcOffset: 8 },
  { name: 'Hong Kong', timezone: 'Asia/Hong_Kong', utcOffset: 8 },
  { name: 'Beijing', timezone: 'Asia/Shanghai', utcOffset: 8 },
  { name: 'Tokyo', timezone: 'Asia/Tokyo', utcOffset: 9 },
  { name: 'Seoul', timezone: 'Asia/Seoul', utcOffset: 9 },
  { name: 'Sydney', timezone: 'Australia/Sydney', utcOffset: 11 },
  { name: 'Melbourne', timezone: 'Australia/Melbourne', utcOffset: 11 },
  { name: 'Toronto', timezone: 'America/Toronto', utcOffset: -5 },
  { name: 'Mexico City', timezone: 'America/Mexico_City', utcOffset: -6 },
  { name: 'São Paulo', timezone: 'America/Sao_Paulo', utcOffset: -3 },
  { name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires', utcOffset: -3 },
  { name: 'Cairo', timezone: 'Africa/Cairo', utcOffset: 2 },
  { name: 'Johannesburg', timezone: 'Africa/Johannesburg', utcOffset: 2 },
  { name: 'Istanbul', timezone: 'Europe/Istanbul', utcOffset: 3 },
  { name: 'Jakarta', timezone: 'Asia/Jakarta', utcOffset: 7 },
  { name: 'Kuala Lumpur', timezone: 'Asia/Kuala_Lumpur', utcOffset: 8 },
  { name: 'San Francisco', timezone: 'America/Los_Angeles', utcOffset: -8 },
  { name: 'Miami', timezone: 'America/New_York', utcOffset: -5 },
  { name: 'Honolulu', timezone: 'Pacific/Honolulu', utcOffset: -10 },
];

// Approximate flight durations in hours (one-way, direct)
const flightTimes: Record<string, Record<string, number>> = {
  'New York': { 'Los Angeles': 5.5, 'Chicago': 2.5, 'London': 7, 'Paris': 7.5, 'Berlin': 8.5, 'Moscow': 10, 'Dubai': 12.5, 'Mumbai': 16, 'Delhi': 15.5, 'Bangkok': 17, 'Singapore': 18.5, 'Hong Kong': 16, 'Beijing': 14, 'Tokyo': 14, 'Seoul': 14.5, 'Sydney': 20, 'Melbourne': 20.5, 'Toronto': 1.5, 'Mexico City': 5, 'São Paulo': 10, 'Buenos Aires': 11, 'Cairo': 11, 'Johannesburg': 15, 'Istanbul': 10, 'Jakarta': 20, 'Kuala Lumpur': 19, 'San Francisco': 6, 'Miami': 3, 'Honolulu': 10 },
  'Los Angeles': { 'New York': 5.5, 'Chicago': 4, 'London': 10.5, 'Paris': 11, 'Berlin': 11.5, 'Moscow': 12, 'Dubai': 16, 'Mumbai': 18, 'Delhi': 17, 'Bangkok': 17.5, 'Singapore': 18, 'Hong Kong': 14.5, 'Beijing': 12, 'Tokyo': 11.5, 'Seoul': 12, 'Sydney': 15, 'Melbourne': 16, 'Toronto': 5, 'Mexico City': 3.5, 'São Paulo': 12.5, 'Buenos Aires': 13, 'Cairo': 15, 'Johannesburg': 18, 'Istanbul': 13.5, 'Jakarta': 17, 'Kuala Lumpur': 17.5, 'San Francisco': 1.5, 'Miami': 5, 'Honolulu': 5.5 },
  'Chicago': { 'New York': 2.5, 'Los Angeles': 4, 'London': 8, 'Paris': 8.5, 'Berlin': 9, 'Moscow': 10.5, 'Dubai': 13.5, 'Mumbai': 16.5, 'Delhi': 16, 'Bangkok': 17, 'Singapore': 19, 'Hong Kong': 16, 'Beijing': 13.5, 'Tokyo': 12.5, 'Seoul': 13, 'Sydney': 19, 'Melbourne': 19.5, 'Toronto': 1.5, 'Mexico City': 4, 'São Paulo': 10.5, 'Buenos Aires': 11.5, 'Cairo': 12, 'Johannesburg': 16, 'Istanbul': 10.5, 'Jakarta': 19.5, 'Kuala Lumpur': 19, 'San Francisco': 4.5, 'Miami': 3, 'Honolulu': 9 },
  'London': { 'New York': 7, 'Los Angeles': 10.5, 'Chicago': 8, 'Paris': 1.5, 'Berlin': 2, 'Moscow': 4, 'Dubai': 7, 'Mumbai': 9, 'Delhi': 8.5, 'Bangkok': 11.5, 'Singapore': 13, 'Hong Kong': 12, 'Beijing': 10, 'Tokyo': 12, 'Seoul': 11, 'Sydney': 22, 'Melbourne': 22.5, 'Toronto': 7.5, 'Mexico City': 11, 'São Paulo': 11.5, 'Buenos Aires': 13.5, 'Cairo': 5, 'Johannesburg': 11, 'Istanbul': 4, 'Jakarta': 14, 'Kuala Lumpur': 13, 'San Francisco': 11, 'Miami': 9, 'Honolulu': 16 },
  'Paris': { 'New York': 7.5, 'Los Angeles': 11, 'Chicago': 8.5, 'London': 1.5, 'Berlin': 1.5, 'Moscow': 3.5, 'Dubai': 6.5, 'Mumbai': 8.5, 'Delhi': 8, 'Bangkok': 11, 'Singapore': 12.5, 'Hong Kong': 11.5, 'Beijing': 10.5, 'Tokyo': 12, 'Seoul': 11.5, 'Sydney': 22, 'Melbourne': 22, 'Toronto': 8, 'Mexico City': 11.5, 'São Paulo': 11, 'Buenos Aires': 13, 'Cairo': 4.5, 'Johannesburg': 11, 'Istanbul': 3.5, 'Jakarta': 14, 'Kuala Lumpur': 12.5, 'San Francisco': 11.5, 'Miami': 9.5, 'Honolulu': 17 },
  'Dubai': { 'New York': 12.5, 'Los Angeles': 16, 'Chicago': 13.5, 'London': 7, 'Paris': 6.5, 'Berlin': 6, 'Moscow': 5, 'Mumbai': 3, 'Delhi': 3.5, 'Bangkok': 6, 'Singapore': 7, 'Hong Kong': 8, 'Beijing': 8.5, 'Tokyo': 10, 'Seoul': 9, 'Sydney': 14, 'Melbourne': 14.5, 'Toronto': 13, 'Mexico City': 17, 'São Paulo': 14.5, 'Buenos Aires': 17, 'Cairo': 3.5, 'Johannesburg': 8, 'Istanbul': 4, 'Jakarta': 8, 'Kuala Lumpur': 7, 'San Francisco': 16.5, 'Miami': 13, 'Honolulu': 18 },
  'Tokyo': { 'New York': 14, 'Los Angeles': 11.5, 'Chicago': 12.5, 'London': 12, 'Paris': 12, 'Berlin': 11.5, 'Moscow': 10, 'Dubai': 10, 'Mumbai': 9.5, 'Delhi': 9, 'Bangkok': 6, 'Singapore': 7, 'Hong Kong': 4.5, 'Beijing': 3.5, 'Seoul': 2, 'Sydney': 9.5, 'Melbourne': 10, 'Toronto': 13, 'Mexico City': 13, 'São Paulo': 24, 'Buenos Aires': 24, 'Cairo': 12, 'Johannesburg': 15, 'Istanbul': 11.5, 'Jakarta': 7.5, 'Kuala Lumpur': 7, 'San Francisco': 10.5, 'Miami': 15, 'Honolulu': 8 },
  'Sydney': { 'New York': 20, 'Los Angeles': 15, 'Chicago': 19, 'London': 22, 'Paris': 22, 'Berlin': 21, 'Moscow': 18, 'Dubai': 14, 'Mumbai': 12, 'Delhi': 12, 'Bangkok': 9, 'Singapore': 8, 'Hong Kong': 9, 'Beijing': 11, 'Tokyo': 9.5, 'Seoul': 10, 'Melbourne': 1.5, 'Toronto': 20, 'Mexico City': 16, 'São Paulo': 16, 'Buenos Aires': 15, 'Cairo': 17, 'Johannesburg': 14, 'Istanbul': 18, 'Jakarta': 7, 'Kuala Lumpur': 8, 'San Francisco': 14.5, 'Miami': 19, 'Honolulu': 10 },
  'Singapore': { 'New York': 18.5, 'Los Angeles': 18, 'Chicago': 19, 'London': 13, 'Paris': 12.5, 'Berlin': 12, 'Moscow': 10.5, 'Dubai': 7, 'Mumbai': 5.5, 'Delhi': 5.5, 'Bangkok': 2.5, 'Hong Kong': 4, 'Beijing': 6.5, 'Tokyo': 7, 'Seoul': 6.5, 'Sydney': 8, 'Melbourne': 8, 'Toronto': 18.5, 'Mexico City': 20, 'São Paulo': 18, 'Buenos Aires': 19, 'Cairo': 9, 'Johannesburg': 10.5, 'Istanbul': 10, 'Jakarta': 2, 'Kuala Lumpur': 1, 'San Francisco': 17.5, 'Miami': 19, 'Honolulu': 11 },
};

function getFlightTime(origin: string, destination: string): number | null {
  if (origin === destination) return 0;
  if (flightTimes[origin]?.[destination]) return flightTimes[origin][destination];
  if (flightTimes[destination]?.[origin]) return flightTimes[destination][origin];
  // Estimate based on timezone difference as fallback
  const o = cities.find(c => c.name === origin);
  const d = cities.find(c => c.name === destination);
  if (o && d) {
    const diff = Math.abs(o.utcOffset - d.utcOffset);
    return Math.round((diff * 1.5 + 2) * 10) / 10;
  }
  return null;
}

function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0 && m === 0) return '0 min';
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function formatTime(hours: number, minutes: number): string {
  const h = ((hours % 24) + 24) % 24;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export default function FlightTimePage() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departHour, setDepartHour] = useState(9);
  const [departMinute, setDepartMinute] = useState(0);

  const result = useMemo(() => {
    if (!origin || !destination) return null;
    const duration = getFlightTime(origin, destination);
    if (duration === null) return null;

    const originCity = cities.find(c => c.name === origin)!;
    const destCity = cities.find(c => c.name === destination)!;
    const tzDiff = destCity.utcOffset - originCity.utcOffset;

    // Calculate arrival in local time of destination
    const departTotalMinutes = departHour * 60 + departMinute;
    const durationMinutes = Math.round(duration * 60);
    const arrivalMinutesLocal = departTotalMinutes + durationMinutes + tzDiff * 60;

    const arrivalHour = Math.floor(arrivalMinutesLocal / 60);
    const arrivalMin = Math.round(((arrivalMinutesLocal / 60) - Math.floor(arrivalMinutesLocal / 60)) * 60);

    const dayOffset = arrivalHour >= 24 ? Math.floor(arrivalHour / 24) : arrivalHour < 0 ? -1 : 0;

    return {
      duration,
      tzDiff,
      departTime: formatTime(departHour, departMinute),
      arrivalTime: formatTime(arrivalHour, arrivalMin),
      dayOffset,
    };
  }, [origin, destination, departHour, departMinute]);

  return (
    <main className="min-h-screen bg-dark-bg px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-card-bg/40 border border-card-border px-4 py-2 mb-4">
            <Plane className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted">Flight Time Calculator</span>
          </div>
          <h1 className="font-heading text-4xl font-bold text-white mb-2">Flight Time Calculator</h1>
          <p className="text-muted">Calculate flight duration and arrival times between 30 major world cities</p>
        </div>

        <div className="rounded-2xl border border-card-border bg-card-bg/40 p-6 space-y-6">
          {/* Origin & Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted mb-2">Origin City</label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full rounded-lg border border-card-border bg-dark-bg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select origin...</option>
                {cities.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Destination City</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full rounded-lg border border-card-border bg-dark-bg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select destination...</option>
                {cities.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Departure Time */}
          <div>
            <label className="block text-sm text-muted mb-2">Departure Time (local)</label>
            <div className="flex items-center gap-2">
              <select
                value={departHour}
                onChange={(e) => setDepartHour(Number(e.target.value))}
                className="rounded-lg border border-card-border bg-dark-bg px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                ))}
              </select>
              <span className="text-white font-bold">:</span>
              <select
                value={departMinute}
                onChange={(e) => setDepartMinute(Number(e.target.value))}
                className="rounded-lg border border-card-border bg-dark-bg px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {[0, 15, 30, 45].map(m => (
                  <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
                ))}
              </select>
            </div>
          </div>

          <AdBanner />

          {/* Results */}
          {result && (
            <div className="space-y-4 pt-4 border-t border-card-border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl bg-dark-bg border border-card-border p-4 text-center">
                  <Clock className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted mb-1">Flight Duration</p>
                  <p className="text-xl font-bold text-white">{formatDuration(result.duration)}</p>
                </div>
                <div className="rounded-xl bg-dark-bg border border-card-border p-4 text-center">
                  <Globe className="h-5 w-5 text-secondary mx-auto mb-2" />
                  <p className="text-xs text-muted mb-1">Timezone Difference</p>
                  <p className="text-xl font-bold text-white">
                    {result.tzDiff >= 0 ? '+' : ''}{result.tzDiff}h
                  </p>
                </div>
                <div className="rounded-xl bg-dark-bg border border-card-border p-4 text-center">
                  <Plane className="h-5 w-5 text-accent mx-auto mb-2" />
                  <p className="text-xs text-muted mb-1">Distance Category</p>
                  <p className="text-xl font-bold text-white">
                    {result.duration <= 3 ? 'Short' : result.duration <= 7 ? 'Medium' : result.duration <= 12 ? 'Long' : 'Ultra-Long'}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-dark-bg border border-card-border p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="text-center">
                    <p className="text-xs text-muted mb-1">Depart {origin}</p>
                    <p className="text-2xl font-bold text-white">{result.departTime}</p>
                  </div>
                  <div className="flex items-center gap-2 text-muted">
                    <div className="h-px w-8 bg-card-border" />
                    <ArrowRight className="h-5 w-5" />
                    <div className="h-px w-8 bg-card-border" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted mb-1">Arrive {destination}</p>
                    <p className="text-2xl font-bold text-white">{result.arrivalTime}</p>
                    {result.dayOffset !== 0 && (
                      <p className="text-xs text-secondary mt-1">
                        {result.dayOffset > 0 ? `+${result.dayOffset} day${result.dayOffset > 1 ? 's' : ''}` : `${result.dayOffset} day`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {origin && destination && origin === destination && (
            <p className="text-center text-muted italic">Please select two different cities.</p>
          )}
        </div>
      </div>
    </main>
  );
}
