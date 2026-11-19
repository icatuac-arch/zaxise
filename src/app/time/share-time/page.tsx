'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Share2, Copy, Check, Globe, Clock } from 'lucide-react';
import AdBanner from '@/components/time/AdBanner';

const majorCities = [
  { name: 'New York', timezone: 'America/New_York' },
  { name: 'London', timezone: 'Europe/London' },
  { name: 'Paris', timezone: 'Europe/Paris' },
  { name: 'Dubai', timezone: 'Asia/Dubai' },
  { name: 'Mumbai', timezone: 'Asia/Kolkata' },
  { name: 'Singapore', timezone: 'Asia/Singapore' },
  { name: 'Tokyo', timezone: 'Asia/Tokyo' },
  { name: 'Sydney', timezone: 'Australia/Sydney' },
];

const allTimezones = Intl.supportedValuesOf('timeZone');

function formatTimeInZone(date: Date, timezone: string): string {
  return date.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDateInZone(date: Date, timezone: string): string {
  return date.toLocaleDateString('en-US', {
    timeZone: timezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export default function ShareTimePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-bg" />}>
      <ShareTimeContent />
    </Suspense>
  );
}

function ShareTimeContent() {
  const searchParams = useSearchParams();
  const sharedTz = searchParams.get('tz');

  const [selectedTz, setSelectedTz] = useState(sharedTz || Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [now, setNow] = useState(new Date());
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredTimezones = useMemo(() => {
    if (!search) return allTimezones.slice(0, 50);
    return allTimezones.filter(tz =>
      tz.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 50);
  }, [search]);

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/share-time?tz=${encodeURIComponent(selectedTz)}`;
  }, [selectedTz]);

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isSharedView = !!sharedTz;

  return (
    <main className="min-h-screen bg-dark-bg px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-card-bg/40 border border-card-border px-4 py-2 mb-4">
            <Share2 className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted">Share My Time</span>
          </div>
          <h1 className="font-heading text-4xl font-bold text-white mb-2">
            {isSharedView ? 'Shared Time View' : 'Share My Time'}
          </h1>
          <p className="text-muted">
            {isSharedView
              ? `Showing time conversions from ${selectedTz.replace(/_/g, ' ')}`
              : 'Generate a shareable link showing your time across the world'}
          </p>
        </div>

        {/* Timezone Selector */}
        {!isSharedView && (
          <div className="mb-6 rounded-2xl border border-card-border bg-card-bg/40 p-6">
            <label className="block text-sm text-muted mb-2">Your Timezone</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search timezones..."
              className="w-full mb-2 rounded-lg border border-card-border bg-dark-bg px-4 py-3 text-white placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={selectedTz}
              onChange={(e) => setSelectedTz(e.target.value)}
              className="w-full rounded-lg border border-card-border bg-dark-bg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              size={5}
            >
              {filteredTimezones.map(tz => (
                <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        )}

        {/* Time Conversion Table */}
        <div className="mb-6 rounded-2xl border border-card-border bg-card-bg/40 overflow-hidden">
          <div className="p-4 border-b border-card-border flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <h2 className="font-heading font-semibold text-white">
              When it&apos;s <span className="text-primary">{formatTimeInZone(now, selectedTz)}</span> in {selectedTz.split('/').pop()?.replace(/_/g, ' ')}
            </h2>
          </div>
          <div className="divide-y divide-card-border">
            {majorCities.map(city => (
              <div key={city.timezone} className="flex items-center justify-between px-6 py-4 hover:bg-card-bg/60 transition-colors">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted" />
                  <span className="text-white font-medium">{city.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-mono text-lg">{formatTimeInZone(now, city.timezone)}</p>
                  <p className="text-xs text-muted">{formatDateInZone(now, city.timezone)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share Link */}
        <div className="rounded-2xl border border-card-border bg-card-bg/40 p-6">
          <h3 className="text-sm text-muted mb-3">Shareable Link</h3>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 rounded-lg border border-card-border bg-dark-bg px-4 py-3 text-white text-sm font-mono truncate focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 rounded-lg px-4 py-3 font-medium transition-colors ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-primary text-white hover:bg-primary/80'
              }`}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-xs text-muted mt-2">Share this link and others will see your current time converted to their cities.</p>
        </div>

        <AdBanner />
      </div>
    </main>
  );
}
