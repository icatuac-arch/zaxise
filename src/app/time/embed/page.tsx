'use client';

import { useState, useEffect, useMemo } from 'react';
import { Code, Copy, Check, Clock, Settings, Eye } from 'lucide-react';
import AdBanner from '@/components/time/AdBanner';

const timezones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Honolulu',
];

export default function EmbedPage() {
  const [timezone, setTimezone] = useState('America/New_York');
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [showDate, setShowDate] = useState(true);
  const [now, setNow] = useState(new Date());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const dimensions = useMemo(() => {
    switch (size) {
      case 'small': return { width: 200, height: 100 };
      case 'medium': return { width: 300, height: 150 };
      case 'large': return { width: 400, height: 200 };
    }
  }, [size]);

  const embedCode = useMemo(() => {
    const params = new URLSearchParams({
      tz: timezone,
      size,
      date: showDate ? '1' : '0',
    });
    const src = typeof window !== 'undefined'
      ? `${window.location.origin}/embed/widget?${params.toString()}`
      : `/embed/widget?${params.toString()}`;
    return `<iframe src="${src}" width="${dimensions.width}" height="${dimensions.height}" style="border:none;border-radius:12px;" title="DateAndTimezone Clock Widget"></iframe>`;
  }, [timezone, size, showDate, dimensions]);

  function handleCopy() {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const timeStr = now.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const dateStr = now.toLocaleDateString('en-US', {
    timeZone: timezone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const cityName = timezone.split('/').pop()?.replace(/_/g, ' ') || timezone;

  return (
    <main className="min-h-screen bg-dark-bg px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-card-bg/40 border border-card-border px-4 py-2 mb-4">
            <Code className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted">Embed Widget</span>
          </div>
          <h1 className="font-heading text-4xl font-bold text-white mb-2">Embeddable Clock Widget</h1>
          <p className="text-muted">Add a beautiful clock widget to your website with a simple embed code</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customization */}
          <div className="rounded-2xl border border-card-border bg-card-bg/40 p-6 space-y-5">
            <h2 className="font-heading font-semibold text-white flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Customize Widget
            </h2>

            <div>
              <label className="block text-sm text-muted mb-2">Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full rounded-lg border border-card-border bg-dark-bg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {timezones.map(tz => (
                  <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-muted mb-2">Size</label>
              <div className="flex gap-2">
                {(['small', 'medium', 'large'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors border ${
                      size === s
                        ? 'bg-primary text-white border-primary'
                        : 'border-card-border text-muted hover:text-white hover:bg-card-bg'
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted mt-1">{dimensions.width} x {dimensions.height} px</p>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-muted">Show Date</label>
              <button
                onClick={() => setShowDate(!showDate)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  showDate ? 'bg-primary' : 'bg-card-border'
                }`}
              >
                <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  showDate ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>

          <AdBanner />

          {/* Preview */}
          <div className="rounded-2xl border border-card-border bg-card-bg/40 p-6">
            <h2 className="font-heading font-semibold text-white flex items-center gap-2 mb-4">
              <Eye className="h-5 w-5 text-primary" />
              Preview
            </h2>
            <div className="flex items-center justify-center min-h-[200px]">
              <div
                style={{ width: dimensions.width, height: dimensions.height }}
                className="rounded-xl bg-gradient-to-br from-dark-bg to-card-bg border border-card-border flex flex-col items-center justify-center gap-1 shadow-2xl"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock className={`${size === 'small' ? 'h-3 w-3' : 'h-4 w-4'} text-primary`} />
                  <span className={`text-muted ${size === 'small' ? 'text-[10px]' : 'text-xs'}`}>{cityName}</span>
                </div>
                <p className={`font-mono font-bold text-white ${
                  size === 'small' ? 'text-xl' : size === 'medium' ? 'text-3xl' : 'text-4xl'
                }`}>
                  {timeStr}
                </p>
                {showDate && (
                  <p className={`text-muted ${size === 'small' ? 'text-[10px]' : 'text-xs'} mt-0.5`}>
                    {dateStr}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Embed Code */}
        <div className="mt-6 rounded-2xl border border-card-border bg-card-bg/40 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-semibold text-white flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              Embed Code
            </h3>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-primary text-white hover:bg-primary/80'
              }`}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          <pre className="rounded-lg border border-card-border bg-dark-bg p-4 overflow-x-auto">
            <code className="text-sm text-green-400 font-mono">{embedCode}</code>
          </pre>
          <p className="text-xs text-muted mt-3">Paste this code into your HTML to embed the clock widget on your website.</p>
        </div>
      </div>
    </main>
  );
}
