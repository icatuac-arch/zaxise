'use client';

import { useState, useEffect } from 'react';
import {
  Moon,
  Calendar,
  Star,
  Sparkles,
  Globe,
  Info,
  ChevronRight,
  Ruler,
  Timer,
  Orbit,
  Waves,
  Footprints,
  RotateCcw,
  CalendarDays,
  Eye,
} from 'lucide-react';
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

interface FullMoonData {
  date: string;        // ISO
  name: string;
  meaning: string;
  altNames: string[];
  tags?: string[];     // "Blue Moon" | "Supermoon" | "Eclipse"
  season: 'winter' | 'spring' | 'summer' | 'autumn';
}

const FULL_MOONS: FullMoonData[] = [
  { date: '2026-01-03', name: 'Wolf Moon', meaning: 'Named for howling wolves in winter.', altNames: ['Old Moon', 'Ice Moon'], season: 'winter' },
  { date: '2026-02-01', name: 'Snow Moon', meaning: 'Heaviest snowfalls of the year.', altNames: ['Hunger Moon', 'Storm Moon'], season: 'winter' },
  { date: '2026-03-03', name: 'Worm Moon', meaning: 'Earthworms emerge as ground thaws.', altNames: ['Crow Moon', 'Sap Moon'], season: 'winter' },
  { date: '2026-04-01', name: 'Pink Moon', meaning: 'Named for pink phlox flowers.', altNames: ['Sprouting Grass Moon', 'Fish Moon'], season: 'spring' },
  { date: '2026-05-01', name: 'Flower Moon', meaning: 'Abundant flowers bloom everywhere.', altNames: ['Corn Planting Moon', 'Milk Moon'], season: 'spring' },
  { date: '2026-05-31', name: 'Blue Moon', meaning: 'Second full moon in a month. Rare! "Once in a blue moon."', altNames: [], tags: ['Blue Moon'], season: 'spring' },
  { date: '2026-06-29', name: 'Strawberry Moon', meaning: 'Strawberry harvesting season begins.', altNames: ['Rose Moon', 'Hot Moon'], season: 'summer' },
  { date: '2026-07-29', name: 'Buck Moon', meaning: 'Male deer grow new antlers.', altNames: ['Thunder Moon', 'Hay Moon'], season: 'summer' },
  { date: '2026-08-28', name: 'Sturgeon Moon', meaning: 'Great Lakes sturgeon fishing season.', altNames: ['Green Corn Moon', 'Grain Moon'], season: 'summer' },
  { date: '2026-09-26', name: 'Harvest Moon', meaning: 'Closest full moon to the autumn equinox.', altNames: ['Corn Moon'], season: 'autumn' },
  { date: '2026-10-26', name: "Hunter's Moon", meaning: 'Time to hunt and prepare for winter.', altNames: ['Blood Moon', 'Dying Grass Moon'], season: 'autumn' },
  { date: '2026-11-24', name: 'Beaver Moon', meaning: 'Time to set beaver traps before freeze.', altNames: ['Frost Moon'], season: 'autumn' },
  { date: '2026-12-24', name: 'Cold Moon', meaning: 'Longest nights and coldest weather.', altNames: ['Long Night Moon'], season: 'winter' },
];

interface MoonPhaseData {
  name: string;
  illuminated: string;
  description: string;
}

const MOON_PHASES: MoonPhaseData[] = [
  { name: 'New Moon', illuminated: '0%', description: 'Moon is between Earth and Sun — invisible from Earth.' },
  { name: 'Waxing Crescent', illuminated: '1-49%', description: 'A sliver of light grows on the right side.' },
  { name: 'First Quarter', illuminated: '50%', description: 'Right half illuminated — halfway to full.' },
  { name: 'Waxing Gibbous', illuminated: '51-99%', description: 'More than half lit, approaching fullness.' },
  { name: 'Full Moon', illuminated: '100%', description: 'Fully illuminated — Earth is between Sun and Moon.' },
  { name: 'Waning Gibbous', illuminated: '99-51%', description: 'Light fades from the right after full moon.' },
  { name: 'Last Quarter', illuminated: '50%', description: 'Left half illuminated — halfway to new.' },
  { name: 'Waning Crescent', illuminated: '49-1%', description: 'A thin sliver remains before the next new moon.' },
];

const MOON_FACTS = [
  { icon: Ruler, label: 'Average Distance', value: '384,400 km', detail: 'From Earth to Moon' },
  { icon: Globe, label: 'Diameter', value: '3,474 km', detail: 'About 1/4 of Earth' },
  { icon: Timer, label: 'Age', value: '4.5 billion years', detail: 'Formed from a giant impact' },
  { icon: Orbit, label: 'Gravity', value: '1/6 of Earth', detail: 'You\'d weigh 6x less' },
  { icon: Footprints, label: 'Moonwalkers', value: '12 people', detail: 'Have walked on the Moon' },
  { icon: RotateCcw, label: 'Tidal Locking', value: 'Same side', detail: 'Always faces Earth' },
  { icon: CalendarDays, label: 'Full Cycle', value: '29.5 days', detail: 'Synodic month' },
  { icon: Waves, label: 'Ocean Tides', value: 'Twice daily', detail: 'Gravitational pull on water' },
];

const CULTURES = [
  { tradition: 'Hindu', detail: 'Purnima festivals celebrated on every full moon — Guru Purnima, Kartik Purnima, and Buddha Purnima are among the most sacred.' },
  { tradition: 'Chinese', detail: 'The Mid-Autumn Festival (Zhongqiu Jie) celebrates the harvest moon with mooncakes, lanterns, and family reunions.' },
  { tradition: 'Islamic', detail: 'The lunar Hijri calendar governs the timing of Ramadan, Eid, and Hajj — months begin with the sighting of the new crescent moon.' },
  { tradition: 'Native American', detail: 'Each full moon received a traditional name reflecting seasonal events — Wolf Moon, Harvest Moon, and others remain in common use today.' },
  { tradition: 'Harvest Festivals', detail: 'Cultures worldwide — from Europe to East Asia — have celebrated full moons near the autumn equinox as the start of the harvest season.' },
];

/* ------------------------------------------------------------------ */
/*  SVG COMPONENTS                                                     */
/* ------------------------------------------------------------------ */

function HeroMoonSVG() {
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48 md:w-64 md:h-64 drop-shadow-[0_0_60px_rgba(255,255,255,0.3)]">
      <defs>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moonSurface" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="60%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="98" fill="url(#moonGlow)" />
      <circle cx="100" cy="100" r="80" fill="url(#moonSurface)" />
      {/* Craters */}
      <circle cx="70" cy="60" r="12" fill="#CBD5E1" opacity="0.5" />
      <circle cx="120" cy="80" r="8" fill="#CBD5E1" opacity="0.4" />
      <circle cx="90" cy="110" r="15" fill="#CBD5E1" opacity="0.35" />
      <circle cx="55" cy="100" r="6" fill="#CBD5E1" opacity="0.4" />
      <circle cx="130" cy="55" r="5" fill="#CBD5E1" opacity="0.3" />
      <circle cx="110" cy="130" r="10" fill="#CBD5E1" opacity="0.35" />
      <circle cx="75" cy="140" r="7" fill="#CBD5E1" opacity="0.3" />
      <circle cx="140" cy="110" r="4" fill="#CBD5E1" opacity="0.3" />
      {/* Highlight */}
      <ellipse cx="75" cy="55" rx="30" ry="25" fill="white" opacity="0.12" />
    </svg>
  );
}

function CardMoonSVG({ season }: { season: string }) {
  const tint = season === 'summer' ? '#FDE68A' : season === 'spring' ? '#E0F2FE' : season === 'autumn' ? '#FBBF24' : '#BFDBFE';
  const tint2 = season === 'summer' ? '#F59E0B' : season === 'spring' ? '#93C5FD' : season === 'autumn' ? '#D97706' : '#93C5FD';
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16 shrink-0">
      <defs>
        <radialGradient id={`cm-${season}`} cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor={tint} />
          <stop offset="100%" stopColor={tint2} />
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="35" fill={`url(#cm-${season})`} opacity="0.9" />
      <circle cx="30" cy="30" r="5" fill={tint2} opacity="0.3" />
      <circle cx="50" cy="42" r="4" fill={tint2} opacity="0.25" />
      <circle cx="38" cy="55" r="6" fill={tint2} opacity="0.3" />
      <circle cx="55" cy="28" r="3" fill={tint2} opacity="0.2" />
      <ellipse cx="32" cy="26" rx="10" ry="8" fill="white" opacity="0.1" />
    </svg>
  );
}

function PhaseSVG({ index }: { index: number }) {
  // 0=New, 1=WaxCres, 2=FirstQ, 3=WaxGib, 4=Full, 5=WanGib, 6=LastQ, 7=WanCres
  const bg = '#1E293B';
  const lit = '#E2E8F0';
  return (
    <svg viewBox="0 0 60 60" className="w-12 h-12">
      <defs>
        <clipPath id={`phase-clip-${index}`}>
          <circle cx="30" cy="30" r="26" />
        </clipPath>
      </defs>
      {/* Dark base */}
      <circle cx="30" cy="30" r="26" fill={bg} />
      {/* Lit portion */}
      {index === 0 && null}
      {index === 1 && <ellipse cx="42" cy="30" rx="14" ry="26" fill={lit} clipPath={`url(#phase-clip-${index})`} />}
      {index === 2 && <rect x="30" y="4" width="26" height="52" fill={lit} clipPath={`url(#phase-clip-${index})`} />}
      {index === 3 && (
        <>
          <rect x="30" y="4" width="26" height="52" fill={lit} clipPath={`url(#phase-clip-${index})`} />
          <ellipse cx="30" cy="30" rx="14" ry="26" fill={lit} clipPath={`url(#phase-clip-${index})`} />
        </>
      )}
      {index === 4 && <circle cx="30" cy="30" r="26" fill={lit} />}
      {index === 5 && (
        <>
          <rect x="4" y="4" width="26" height="52" fill={lit} clipPath={`url(#phase-clip-${index})`} />
          <ellipse cx="30" cy="30" rx="14" ry="26" fill={lit} clipPath={`url(#phase-clip-${index})`} />
        </>
      )}
      {index === 6 && <rect x="4" y="4" width="26" height="52" fill={lit} clipPath={`url(#phase-clip-${index})`} />}
      {index === 7 && <ellipse cx="18" cy="30" rx="14" ry="26" fill={lit} clipPath={`url(#phase-clip-${index})`} />}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function getNextFullMoon(now: Date) {
  return FULL_MOONS.find((m) => new Date(m.date + 'T00:00:00') >= now) ?? FULL_MOONS[FULL_MOONS.length - 1];
}

/** Rough current moon phase index (0-7) based on known full moon dates */
function getCurrentPhaseIndex(now: Date): number {
  // Find surrounding full moons
  const fullDates = FULL_MOONS.map((m) => new Date(m.date + 'T00:00:00').getTime());
  const t = now.getTime();
  let prev = fullDates[0];
  let next = fullDates[0];
  for (let i = 0; i < fullDates.length; i++) {
    if (fullDates[i] <= t) prev = fullDates[i];
    if (fullDates[i] > t) { next = fullDates[i]; break; }
  }
  const cycle = next - prev || 29.5 * 86_400_000;
  const elapsed = t - prev;
  const frac = elapsed / cycle;
  // Map fraction to 8 phases
  if (frac < 0.0625) return 4; // just after full
  if (frac < 0.1875) return 5;
  if (frac < 0.3125) return 6;
  if (frac < 0.4375) return 7;
  if (frac < 0.5625) return 0;
  if (frac < 0.6875) return 1;
  if (frac < 0.8125) return 2;
  if (frac < 0.9375) return 3;
  return 4;
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function FullMoonPage() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  const nextMoon = getNextFullMoon(now);
  const nextDate = new Date(nextMoon.date + 'T00:00:00');
  const diffMs = nextDate.getTime() - now.getTime();
  const daysUntil = Math.max(0, Math.floor(diffMs / 86_400_000));
  const hoursUntil = Math.max(0, Math.floor((diffMs % 86_400_000) / 3_600_000));
  const minutesUntil = Math.max(0, Math.floor((diffMs % 3_600_000) / 60_000));
  const currentPhase = getCurrentPhaseIndex(now);

  return (
    <main className="min-h-screen" style={{ background: '#030712', fontFamily: 'Inter, sans-serif' }}>
      {/* -------- HERO -------- */}
      <section className="relative overflow-hidden pt-10 sm:pt-12 pb-8 text-center">
        {/* Glow backdrop */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 px-4 max-w-3xl mx-auto">
          <HeroMoonSVG />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}>
            Full Moon Calendar <span style={{ color: '#4F46E5' }}>2026</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl" style={{ color: '#94A3B8' }}>
            Track every full moon of 2026 with traditional names, countdowns, moon phases, and cultural significance.
          </p>
        </div>
      </section>

      {/* -------- NEXT FULL MOON BANNER -------- */}
      <section className="px-4 max-w-4xl mx-auto -mt-4 mb-16">
        <div className="rounded-2xl p-6 md:p-8 border" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)', borderColor: '#4F46E5' }}>
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <CardMoonSVG season={nextMoon.season} />
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm font-medium uppercase tracking-widest mb-1" style={{ color: '#06B6D4' }}>Next Full Moon</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}>
                {nextMoon.name}
              </h2>
              <p style={{ color: '#94A3B8' }}>{formatDate(nextMoon.date)}</p>
              <p className="mt-2 text-sm" style={{ color: '#94A3B8' }}>{nextMoon.meaning}</p>
            </div>
            <div className="flex gap-4 text-center">
              {[
                { val: daysUntil, label: 'Days' },
                { val: hoursUntil, label: 'Hours' },
                { val: minutesUntil, label: 'Min' },
              ].map((u) => (
                <div key={u.label} className="rounded-xl px-4 py-3 min-w-[70px]" style={{ background: '#030712' }}>
                  <p className="text-2xl md:text-3xl font-bold" style={{ color: '#4F46E5', fontFamily: 'Outfit, sans-serif' }}>{u.val}</p>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>{u.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* -------- 2026 FULL MOON CALENDAR -------- */}
      <section className="px-4 max-w-6xl mx-auto mb-20">
        <div className="flex items-center gap-3 mb-8">
          <Calendar className="w-6 h-6" style={{ color: '#4F46E5' }} />
          <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}>
            2026 Full Moon Calendar
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FULL_MOONS.map((moon) => {
            const moonDate = new Date(moon.date + 'T00:00:00');
            const diff = daysBetween(now, moonDate);
            const isPast = diff < 0;
            return (
              <div
                key={moon.date}
                className="rounded-2xl border p-5 flex flex-col gap-3 transition-all hover:border-[#4F46E5]/60 hover:shadow-lg hover:shadow-indigo-500/5"
                style={{ background: '#0F172A', borderColor: '#1E293B' }}
              >
                <div className="flex items-start gap-4">
                  <CardMoonSVG season={moon.season} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold truncate" style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}>
                      {moon.name}
                    </h3>
                    <p className="text-sm" style={{ color: '#94A3B8' }}>{formatDate(moon.date)}</p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>{moon.meaning}</p>

                {moon.altNames.length > 0 && (
                  <p className="text-xs" style={{ color: '#64748B' }}>
                    Also known as: {moon.altNames.join(', ')}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-auto pt-2 flex-wrap">
                  {moon.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{
                        background: tag === 'Blue Moon' ? 'rgba(6,182,212,0.15)' : tag === 'Supermoon' ? 'rgba(79,70,229,0.15)' : 'rgba(239,68,68,0.15)',
                        color: tag === 'Blue Moon' ? '#06B6D4' : tag === 'Supermoon' ? '#818CF8' : '#F87171',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  <span
                    className="ml-auto text-xs font-medium px-2.5 py-0.5 rounded-full"
                    style={{
                      background: isPast ? 'rgba(148,163,184,0.1)' : 'rgba(79,70,229,0.1)',
                      color: isPast ? '#64748B' : '#818CF8',
                    }}
                  >
                    {isPast ? `${Math.abs(diff)} days ago` : diff === 0 ? 'Today!' : `in ${diff} days`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <AdBanner />

      {/* -------- MOON PHASE GUIDE -------- */}
      <section className="px-4 max-w-6xl mx-auto mb-20">
        <div className="flex items-center gap-3 mb-8">
          <Moon className="w-6 h-6" style={{ color: '#06B6D4' }} />
          <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}>
            Moon Phase Guide
          </h2>
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {MOON_PHASES.map((phase, idx) => {
            const isActive = idx === currentPhase;
            return (
              <div
                key={phase.name}
                className="rounded-2xl border p-5 flex flex-col items-center text-center gap-3 transition-all"
                style={{
                  background: isActive ? 'linear-gradient(135deg, #1E1B4B, #0F172A)' : '#0F172A',
                  borderColor: isActive ? '#4F46E5' : '#1E293B',
                  boxShadow: isActive ? '0 0 30px rgba(79,70,229,0.15)' : 'none',
                }}
              >
                <PhaseSVG index={idx} />
                <h3 className="text-sm font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: isActive ? '#A5B4FC' : '#E2E8F0' }}>
                  {phase.name}
                </h3>
                <p className="text-xs font-semibold" style={{ color: '#06B6D4' }}>{phase.illuminated}</p>
                <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>{phase.description}</p>
                {isActive && (
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: 'rgba(79,70,229,0.2)', color: '#818CF8' }}>
                    Current Phase
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* -------- SUPERMOON CALENDAR -------- */}
      <section className="px-4 max-w-4xl mx-auto mb-20">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="w-6 h-6" style={{ color: '#4F46E5' }} />
          <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}>
            Supermoon Calendar
          </h2>
        </div>

        <div className="rounded-2xl border p-6 md:p-8" style={{ background: '#0F172A', borderColor: '#1E293B' }}>
          <div className="flex items-start gap-4 mb-6">
            <Info className="w-5 h-5 mt-0.5 shrink-0" style={{ color: '#06B6D4' }} />
            <div>
              <h3 className="font-bold mb-1" style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}>
                What Is a Supermoon?
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>
                A supermoon occurs when the full moon coincides with lunar perigee — the point in its orbit closest to Earth. A supermoon appears <span style={{ color: '#E2E8F0' }}>about 14% larger</span> and <span style={{ color: '#E2E8F0' }}>up to 30% brighter</span> than an average full moon.
              </p>
            </div>
          </div>

          <div className="rounded-xl p-5 border mb-6" style={{ background: '#030712', borderColor: '#1E293B' }}>
            <h4 className="font-bold text-sm mb-3" style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}>2026 Perigee Proximity</h4>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#94A3B8' }}>
              2026 does not feature any exceptionally close perigee-syzygy events that meet the strictest supermoon definitions. However, the full moons closest to perigee in 2026 are:
            </p>
            <div className="space-y-3">
              {[
                { name: 'Sturgeon Moon', date: 'August 28', note: 'Nearest perigee alignment of 2026 — visually slightly larger than average.' },
                { name: 'Buck Moon', date: 'July 29', note: 'Close runner-up — perigee falls within a few days.' },
                { name: 'Harvest Moon', date: 'September 26', note: 'Third closest — combined with low-angle harvest glow, appears especially large.' },
              ].map((s) => (
                <div key={s.name} className="flex items-start gap-3">
                  <ChevronRight className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#4F46E5' }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#E2E8F0' }}>
                      {s.name} <span className="font-normal" style={{ color: '#94A3B8' }}>— {s.date}</span>
                    </p>
                    <p className="text-xs" style={{ color: '#64748B' }}>{s.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs" style={{ color: '#64748B' }}>
            Tip: Even when not an official supermoon, any full moon on the horizon appears dramatically larger due to the &quot;moon illusion&quot; — an optical trick of the brain.
          </p>
        </div>
      </section>

      {/* -------- MOON FACTS -------- */}
      <section className="px-4 max-w-6xl mx-auto mb-20">
        <div className="flex items-center gap-3 mb-8">
          <Star className="w-6 h-6" style={{ color: '#06B6D4' }} />
          <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}>
            Moon Facts
          </h2>
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {MOON_FACTS.map((fact) => {
            const Icon = fact.icon;
            return (
              <div
                key={fact.label}
                className="rounded-2xl border p-5 flex flex-col gap-2 hover:border-[#4F46E5]/40 transition-colors"
                style={{ background: '#0F172A', borderColor: '#1E293B' }}
              >
                <Icon className="w-5 h-5" style={{ color: '#4F46E5' }} />
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>{fact.label}</p>
                <p className="text-lg font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}>{fact.value}</p>
                <p className="text-xs" style={{ color: '#94A3B8' }}>{fact.detail}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* -------- CULTURAL SIGNIFICANCE -------- */}
      <section className="px-4 max-w-4xl mx-auto mb-20">
        <div className="flex items-center gap-3 mb-8">
          <Globe className="w-6 h-6" style={{ color: '#4F46E5' }} />
          <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}>
            Cultural Significance
          </h2>
        </div>

        <p className="text-sm leading-relaxed mb-6" style={{ color: '#94A3B8' }}>
          Full moons have held deep spiritual, agricultural, and calendrical significance across every civilization in human history.
        </p>

        <div className="space-y-4">
          {CULTURES.map((c) => (
            <div
              key={c.tradition}
              className="rounded-2xl border p-5 flex items-start gap-4 hover:border-[#4F46E5]/40 transition-colors"
              style={{ background: '#0F172A', borderColor: '#1E293B' }}
            >
              <Eye className="w-5 h-5 mt-0.5 shrink-0" style={{ color: '#06B6D4' }} />
              <div>
                <h3 className="font-bold text-sm mb-1" style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}>{c.tradition}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>{c.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom spacer */}
      <div className="h-12" />
    </main>
  );
}
