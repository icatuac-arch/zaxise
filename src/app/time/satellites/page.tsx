'use client';

import {
  Orbit,
  Satellite,
  Globe,
  Rocket,
  Radio,
  Eye,
  Sun,
  Navigation,
  Wifi,
  Cloud,
  AlertTriangle,
  Shield,
  Trash2,
  ExternalLink,
  Zap,
  Clock,
  ArrowUp,
  Activity,
  Star,
  ChevronRight,
} from 'lucide-react';
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  SVG Components                                                     */
/* ------------------------------------------------------------------ */

function HeroOrbitalSVG() {
  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-md mx-auto" aria-label="Earth with LEO, MEO, and GEO orbital rings">
      <defs>
        <radialGradient id="earthGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#1E40AF" stopOpacity="1" />
        </radialGradient>
        <radialGradient id="earthGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Glow */}
      <circle cx="200" cy="200" r="120" fill="url(#earthGlow)" />

      {/* GEO orbit */}
      <ellipse cx="200" cy="200" rx="180" ry="60" fill="none" stroke="#4F46E5" strokeWidth="1" strokeDasharray="6 4" opacity="0.5" transform="rotate(-15 200 200)">
        <animateTransform attributeName="transform" type="rotate" from="-15 200 200" to="345 200 200" dur="40s" repeatCount="indefinite" />
      </ellipse>
      <circle cx="380" cy="200" r="4" fill="#A78BFA" filter="url(#glow)">
        <animateTransform attributeName="transform" type="rotate" from="-15 200 200" to="345 200 200" dur="40s" repeatCount="indefinite" />
      </circle>

      {/* MEO orbit */}
      <ellipse cx="200" cy="200" rx="140" ry="50" fill="none" stroke="#06B6D4" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.6" transform="rotate(10 200 200)">
        <animateTransform attributeName="transform" type="rotate" from="10 200 200" to="370 200 200" dur="24s" repeatCount="indefinite" />
      </ellipse>
      <circle cx="340" cy="200" r="3.5" fill="#22D3EE" filter="url(#glow)">
        <animateTransform attributeName="transform" type="rotate" from="10 200 200" to="370 200 200" dur="24s" repeatCount="indefinite" />
      </circle>

      {/* LEO orbit */}
      <ellipse cx="200" cy="200" rx="95" ry="40" fill="none" stroke="#34D399" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.7" transform="rotate(-5 200 200)">
        <animateTransform attributeName="transform" type="rotate" from="-5 200 200" to="355 200 200" dur="12s" repeatCount="indefinite" />
      </ellipse>
      <circle cx="295" cy="200" r="3" fill="#6EE7B7" filter="url(#glow)">
        <animateTransform attributeName="transform" type="rotate" from="-5 200 200" to="355 200 200" dur="12s" repeatCount="indefinite" />
      </circle>

      {/* Second LEO satellite */}
      <circle cx="105" cy="200" r="2.5" fill="#6EE7B7" filter="url(#glow)">
        <animateTransform attributeName="transform" type="rotate" from="175 200 200" to="535 200 200" dur="12s" repeatCount="indefinite" />
      </circle>

      {/* Earth */}
      <circle cx="200" cy="200" r="50" fill="url(#earthGrad)" />
      {/* Continent hints */}
      <ellipse cx="190" cy="185" rx="12" ry="15" fill="#22C55E" opacity="0.4" />
      <ellipse cx="215" cy="200" rx="8" ry="10" fill="#22C55E" opacity="0.35" />
      <ellipse cx="195" cy="215" rx="6" ry="5" fill="#22C55E" opacity="0.3" />

      {/* Labels */}
      <text x="200" y="132" textAnchor="middle" fill="#6EE7B7" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="600">LEO</text>
      <text x="200" y="108" textAnchor="middle" fill="#22D3EE" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="600">MEO</text>
      <text x="200" y="78" textAnchor="middle" fill="#A78BFA" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="600">GEO</text>
    </svg>
  );
}

function OrbitDiagramSVG({ type }: { type: string }) {
  const configs: Record<string, { rx: number; ry: number; color: string; earthR: number; satR: number; dasharray: string }> = {
    LEO: { rx: 38, ry: 14, color: '#34D399', earthR: 18, satR: 2.5, dasharray: '3 2' },
    MEO: { rx: 48, ry: 16, color: '#06B6D4', earthR: 14, satR: 2.5, dasharray: '4 3' },
    GEO: { rx: 55, ry: 10, color: '#A78BFA', earthR: 12, satR: 2.5, dasharray: '5 3' },
    HEO: { rx: 55, ry: 30, color: '#F59E0B', earthR: 12, satR: 2.5, dasharray: '6 4' },
    Polar: { rx: 14, ry: 50, color: '#EC4899', earthR: 14, satR: 2.5, dasharray: '3 2' },
    'Sun-Sync': { rx: 16, ry: 48, color: '#F97316', earthR: 14, satR: 2.5, dasharray: '4 2' },
  };
  const c = configs[type] || configs.LEO;
  const cx = 60, cy = 55;

  return (
    <svg viewBox="0 0 120 110" className="w-full h-24" aria-label={`${type} orbit diagram`}>
      <defs>
        <radialGradient id={`eg-${type}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#1E40AF" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={c.earthR} fill={`url(#eg-${type})`} />
      {type === 'HEO' ? (
        <ellipse cx={cx + 15} cy={cy} rx={c.rx} ry={c.ry} fill="none" stroke={c.color} strokeWidth="1" strokeDasharray={c.dasharray} opacity="0.7" />
      ) : (
        <ellipse cx={cx} cy={cy} rx={c.rx} ry={c.ry} fill="none" stroke={c.color} strokeWidth="1" strokeDasharray={c.dasharray} opacity="0.7"
          transform={type === 'Polar' || type === 'Sun-Sync' ? `rotate(${type === 'Sun-Sync' ? -8 : 0} ${cx} ${cy})` : undefined}
        />
      )}
      <circle r={c.satR} fill={c.color} opacity="0.9">
        <animateMotion dur={type === 'LEO' ? '4s' : type === 'MEO' ? '6s' : '8s'} repeatCount="indefinite">
          {type === 'HEO' ? (
            <mpath xlinkHref={`#path-${type}`} />
          ) : (
            <mpath xlinkHref={`#path-${type}`} />
          )}
        </animateMotion>
      </circle>
      {type === 'HEO' ? (
        <ellipse id={`path-${type}`} cx={cx + 15} cy={cy} rx={c.rx} ry={c.ry} fill="none" stroke="none" />
      ) : (
        <ellipse id={`path-${type}`} cx={cx} cy={cy} rx={c.rx} ry={c.ry} fill="none" stroke="none"
          transform={type === 'Polar' || type === 'Sun-Sync' ? `rotate(${type === 'Sun-Sync' ? -8 : 0} ${cx} ${cy})` : undefined}
        />
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const orbitTypes = [
  {
    name: 'LEO',
    fullName: 'Low Earth Orbit',
    altitude: '200 - 2,000 km',
    period: '~90 minutes',
    uses: 'ISS, Hubble, Starlink, Earth observation, crewed missions',
    activeSats: '~9,000+',
    color: '#34D399',
    icon: Satellite,
    description: 'The most crowded orbital zone. Home to the ISS, Hubble Space Telescope, and mega-constellations like Starlink. Low latency makes it ideal for communications and imaging.',
  },
  {
    name: 'MEO',
    fullName: 'Medium Earth Orbit',
    altitude: '2,000 - 35,786 km',
    period: '~2 - 12 hours',
    uses: 'GPS, GLONASS, Galileo, navigation systems',
    activeSats: '~150',
    color: '#06B6D4',
    icon: Navigation,
    description: 'The navigation belt. GPS, GLONASS, and Galileo satellites orbit here, providing precise positioning to billions of devices on Earth.',
  },
  {
    name: 'GEO',
    fullName: 'Geostationary Orbit',
    altitude: '35,786 km (exact)',
    period: '24 hours',
    uses: 'Weather monitoring, TV broadcast, telecommunications',
    activeSats: '~560',
    color: '#A78BFA',
    icon: Radio,
    description: 'Satellites here match Earth\'s rotation, appearing stationary from the ground. Perfect for weather satellites and TV broadcasts that need continuous coverage of one region.',
  },
  {
    name: 'HEO',
    fullName: 'Highly Elliptical Orbit',
    altitude: '500 - 40,000+ km',
    period: '~12 hours (Molniya)',
    uses: 'High-latitude coverage, Russia\'s Molniya communications, Sirius XM',
    activeSats: '~30',
    color: '#F59E0B',
    icon: Activity,
    description: 'Highly elongated orbits that spend most of their time far from Earth at apogee. Molniya orbits provide coverage to high-latitude regions that GEO cannot reach.',
  },
  {
    name: 'Polar',
    fullName: 'Polar Orbit',
    altitude: '600 - 800 km',
    period: '~100 minutes',
    uses: 'Earth observation, mapping, environmental monitoring',
    activeSats: '~1,200',
    color: '#EC4899',
    icon: Globe,
    description: 'Passes over both poles while Earth rotates beneath, eventually covering the entire surface. Essential for comprehensive Earth observation and mapping.',
  },
  {
    name: 'Sun-Sync',
    fullName: 'Sun-Synchronous Orbit',
    altitude: '600 - 800 km',
    period: '~100 minutes',
    uses: 'Imaging, remote sensing, spy satellites, weather',
    activeSats: '~800',
    color: '#F97316',
    icon: Sun,
    description: 'A special polar orbit that always crosses the equator at the same local solar time. Consistent lighting conditions make it ideal for imaging and remote sensing.',
  },
];

const satelliteStats = [
  { label: 'Active Satellites in Orbit', value: '~13,000', icon: Satellite, color: '#4F46E5' },
  { label: 'Total Tracked Objects', value: '~36,500', icon: Eye, color: '#06B6D4' },
  { label: 'SpaceX Starlink Constellation', value: '6,000+', icon: Wifi, color: '#34D399' },
  { label: 'GPS Constellation', value: '31', icon: Navigation, color: '#F59E0B' },
  { label: 'Countries with Satellites', value: '80+', icon: Globe, color: '#EC4899' },
  { label: 'Launches in 2025', value: '200+', icon: Rocket, color: '#A78BFA' },
];

const famousSatellites = [
  {
    name: 'Hubble Space Telescope',
    year: 1990,
    orbit: 'LEO',
    altitude: '540 km',
    icon: Eye,
    color: '#A78BFA',
    description: 'Transformed our understanding of the universe with deep-field images revealing thousands of galaxies. Has been serviced 5 times by Space Shuttle crews.',
  },
  {
    name: 'James Webb Space Telescope',
    year: 2021,
    orbit: 'L2 Point',
    altitude: '1.5 million km',
    icon: Star,
    color: '#F59E0B',
    description: 'The most powerful space telescope ever built. Orbits the Sun-Earth L2 Lagrange point, observing the universe in infrared to see the first galaxies ever formed.',
  },
  {
    name: 'GPS Constellation',
    year: 1978,
    orbit: 'MEO',
    altitude: '20,200 km',
    icon: Navigation,
    color: '#06B6D4',
    description: '31 satellites maintained by the US Space Force providing global positioning to billions of devices. Accuracy within a few meters for civilian use.',
  },
  {
    name: 'Starlink',
    year: 2019,
    orbit: 'LEO',
    altitude: '550 km',
    icon: Wifi,
    color: '#34D399',
    description: 'SpaceX mega-constellation providing broadband internet worldwide. The largest satellite constellation ever deployed, with plans for 42,000+ satellites.',
  },
  {
    name: 'GOES Weather Satellites',
    year: 1975,
    orbit: 'GEO',
    altitude: '35,786 km',
    icon: Cloud,
    color: '#3B82F6',
    description: 'NOAA\'s geostationary weather satellites providing real-time hurricane tracking, severe weather warnings, and climate monitoring across the Western Hemisphere.',
  },
  {
    name: 'Voyager 1',
    year: 1977,
    orbit: 'Interstellar',
    altitude: '24+ billion km',
    icon: Rocket,
    color: '#EC4899',
    description: 'The farthest human-made object from Earth, now in interstellar space. Still transmitting data after 48+ years. Carries the Golden Record for any extraterrestrial finders.',
  },
  {
    name: 'Chandrayaan (ISRO)',
    year: 2008,
    orbit: 'Lunar',
    altitude: '100 km (lunar)',
    icon: Globe,
    color: '#F97316',
    description: 'India\'s lunar exploration program. Chandrayaan-1 discovered water molecules on the Moon. Chandrayaan-3 achieved a soft landing near the lunar south pole in 2023.',
  },
  {
    name: 'Mangalyaan (ISRO)',
    year: 2013,
    orbit: 'Mars Orbit',
    altitude: '423 km (Mars)',
    icon: Orbit,
    color: '#EF4444',
    description: 'India\'s Mars Orbiter Mission. Made India the first country to succeed on its first attempt at Mars. Cost just $74 million — less than the movie Gravity.',
  },
];

const spaceAgencies = [
  {
    name: 'NASA',
    country: 'United States',
    founded: 1958,
    achievement: 'Moon landings, Mars rovers, Hubble, JWST',
    website: 'https://www.nasa.gov',
    flag: '🇺🇸',
    color: '#3B82F6',
  },
  {
    name: 'ESA',
    country: 'Europe',
    founded: 1975,
    achievement: 'Rosetta comet landing, Galileo navigation',
    website: 'https://www.esa.int',
    flag: '🇪🇺',
    color: '#4F46E5',
  },
  {
    name: 'Roscosmos',
    country: 'Russia',
    founded: 1992,
    achievement: 'First satellite, first human in space, ISS partner',
    website: 'https://www.roscosmos.ru',
    flag: '🇷🇺',
    color: '#EF4444',
  },
  {
    name: 'ISRO',
    country: 'India',
    founded: 1969,
    achievement: 'Mars orbiter on first attempt, Chandrayaan lunar program',
    website: 'https://www.isro.gov.in',
    flag: '🇮🇳',
    color: '#F97316',
  },
  {
    name: 'CNSA',
    country: 'China',
    founded: 1993,
    achievement: 'Tiangong space station, Chang\'e lunar missions, Mars rover',
    website: 'https://www.cnsa.gov.cn',
    flag: '🇨🇳',
    color: '#EF4444',
  },
  {
    name: 'JAXA',
    country: 'Japan',
    founded: 2003,
    achievement: 'Hayabusa asteroid sample return, lunar lander SLIM',
    website: 'https://www.jaxa.jp',
    flag: '🇯🇵',
    color: '#EC4899',
  },
  {
    name: 'SpaceX',
    country: 'Private (US)',
    founded: 2002,
    achievement: 'Reusable rockets, Starlink, crewed Dragon missions',
    website: 'https://www.spacex.com',
    flag: '🚀',
    color: '#06B6D4',
  },
  {
    name: 'Blue Origin',
    country: 'Private (US)',
    founded: 2000,
    achievement: 'New Shepard suborbital flights, New Glenn orbital rocket',
    website: 'https://www.blueorigin.com',
    flag: '🚀',
    color: '#3B82F6',
  },
];

const debrisEvents = [
  {
    year: 2007,
    title: 'Chinese ASAT Test',
    description: 'China destroyed its Fengyun-1C weather satellite with a missile, creating 3,500+ tracked debris pieces — the single worst debris-generating event in history.',
  },
  {
    year: 2009,
    title: 'Iridium-Cosmos Collision',
    description: 'Active Iridium 33 and defunct Cosmos 2251 collided at 42,000 km/h over Siberia, creating nearly 2,000 trackable debris fragments.',
  },
  {
    year: 2021,
    title: 'Russian ASAT Test',
    description: 'Russia destroyed its Cosmos 1408 satellite, creating 1,500+ debris pieces and forcing ISS crew to shelter in escape vehicles.',
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SatellitesPage() {
  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: '#030712',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* ====================== HERO ====================== */}
      <section className="relative overflow-hidden pt-10 sm:pt-12 pb-8 px-4 sm:px-6">
        {/* Subtle grid bg */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #4F46E5 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6" style={{ borderColor: '#1E293B', backgroundColor: '#0F172A' }}>
            <Satellite className="w-4 h-4" style={{ color: '#06B6D4' }} />
            <span className="text-sm font-medium" style={{ color: '#94A3B8' }}>Explore Earth&apos;s orbital neighborhood</span>
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight"
            style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}
          >
            Satellites &{' '}
            <span style={{ color: '#4F46E5' }}>Space Orbits</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: '#94A3B8' }}>
            Over 13,000 active satellites circle our planet in carefully choreographed orbits — from communications and navigation to weather monitoring and deep-space exploration.
          </p>

          <HeroOrbitalSVG />

          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {[
              { label: 'LEO', color: '#34D399' },
              { label: 'MEO', color: '#06B6D4' },
              { label: 'GEO', color: '#A78BFA' },
            ].map((o) => (
              <div key={o.label} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: o.color }} />
                <span className="text-sm font-medium" style={{ color: o.color }}>{o.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== ORBIT TYPES ====================== */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}>
              Orbit Types Explained
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: '#94A3B8' }}>
              Different missions require different orbits. Here are the six major orbital categories used by satellites today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orbitTypes.map((orbit) => {
              const Icon = orbit.icon;
              return (
                <div
                  key={orbit.name}
                  className="rounded-xl p-6 border transition-all duration-300 hover:border-opacity-60 hover:-translate-y-1"
                  style={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }}
                >
                  {/* SVG diagram */}
                  <OrbitDiagramSVG type={orbit.name} />

                  {/* Header */}
                  <div className="flex items-center gap-3 mt-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: orbit.color + '18' }}>
                      <Icon className="w-5 h-5" style={{ color: orbit.color }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}>
                        {orbit.name}
                      </h3>
                      <p className="text-xs" style={{ color: '#94A3B8' }}>{orbit.fullName}</p>
                    </div>
                  </div>

                  <p className="text-sm mb-4 leading-relaxed" style={{ color: '#94A3B8' }}>{orbit.description}</p>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg p-2.5" style={{ backgroundColor: '#030712' }}>
                      <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#64748B' }}>Altitude</p>
                      <p className="text-xs font-semibold" style={{ color: '#E2E8F0' }}>{orbit.altitude}</p>
                    </div>
                    <div className="rounded-lg p-2.5" style={{ backgroundColor: '#030712' }}>
                      <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#64748B' }}>Period</p>
                      <p className="text-xs font-semibold" style={{ color: '#E2E8F0' }}>{orbit.period}</p>
                    </div>
                    <div className="rounded-lg p-2.5" style={{ backgroundColor: '#030712' }}>
                      <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#64748B' }}>Active Sats</p>
                      <p className="text-xs font-semibold" style={{ color: orbit.color }}>{orbit.activeSats}</p>
                    </div>
                    <div className="rounded-lg p-2.5" style={{ backgroundColor: '#030712' }}>
                      <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#64748B' }}>Used For</p>
                      <p className="text-xs font-semibold leading-snug" style={{ color: '#E2E8F0' }}>{orbit.uses.split(',')[0]}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================== SATELLITE STATS ====================== */}
      <section className="py-12 sm:py-16 px-4 sm:px-6" style={{ backgroundColor: '#0F172A' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}>
              Satellites by the Numbers
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: '#94A3B8' }}>
              The scale of humanity&apos;s presence in orbit is staggering and growing fast.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {satelliteStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-xl p-6 border text-center"
                  style={{ backgroundColor: '#030712', borderColor: '#1E293B' }}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: stat.color + '18' }}>
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif', color: stat.color }}>
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium" style={{ color: '#94A3B8' }}>{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <AdBanner />

      {/* ====================== FAMOUS SATELLITES ====================== */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}>
              Famous Satellites & Spacecraft
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: '#94A3B8' }}>
              From the telescope that changed astronomy to the farthest object humans have ever sent into space.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {famousSatellites.map((sat) => {
              const Icon = sat.icon;
              return (
                <div
                  key={sat.name}
                  className="rounded-xl p-6 border flex gap-5 transition-all duration-300 hover:-translate-y-1"
                  style={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }}
                >
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: sat.color + '18' }}>
                      <Icon className="w-6 h-6" style={{ color: sat.color }} />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="text-base font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}>
                        {sat.name}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: sat.color + '18', color: sat.color }}>
                        {sat.orbit}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-2 text-xs" style={{ color: '#64748B' }}>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {sat.year}
                      </span>
                      <span className="flex items-center gap-1">
                        <ArrowUp className="w-3 h-3" />
                        {sat.altitude}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>{sat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================== SPACE AGENCIES ====================== */}
      <section className="py-12 sm:py-16 px-4 sm:px-6" style={{ backgroundColor: '#0F172A' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}>
              Space Agencies & Organizations
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: '#94A3B8' }}>
              The governmental and private organizations pushing the boundaries of space exploration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {spaceAgencies.map((agency) => (
              <a
                key={agency.name}
                href={agency.website}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl p-5 border block transition-all duration-300 hover:-translate-y-1 group"
                style={{ backgroundColor: '#030712', borderColor: '#1E293B' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{agency.flag}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#64748B' }} />
                </div>
                <h3 className="text-lg font-bold mb-0.5" style={{ fontFamily: 'Outfit, sans-serif', color: agency.color }}>
                  {agency.name}
                </h3>
                <p className="text-xs mb-2" style={{ color: '#64748B' }}>{agency.country} &middot; Est. {agency.founded}</p>
                <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>{agency.achievement}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== SPACE DEBRIS ====================== */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6" style={{ borderColor: '#1E293B', backgroundColor: '#0F172A' }}>
              <AlertTriangle className="w-4 h-4" style={{ color: '#F59E0B' }} />
              <span className="text-sm font-medium" style={{ color: '#F59E0B' }}>Critical challenge</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}>
              Space Debris: The Growing Threat
            </h2>
            <p className="text-base max-w-2xl mx-auto" style={{ color: '#94A3B8' }}>
              Decades of space activity have left Earth&apos;s orbits littered with defunct satellites, spent rocket stages, and collision fragments.
            </p>
          </div>

          {/* Debris infographic strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {[
              { value: '36,500+', label: 'Tracked objects > 10 cm', color: '#EF4444' },
              { value: '1,000,000+', label: 'Objects 1-10 cm', color: '#F59E0B' },
              { value: '130 million+', label: 'Particles < 1 cm', color: '#F97316' },
              { value: '28,000 km/h', label: 'Average debris speed', color: '#EC4899' },
            ].map((d) => (
              <div key={d.label} className="rounded-xl p-4 border text-center" style={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }}>
                <p className="text-xl sm:text-2xl font-bold mb-1" style={{ fontFamily: 'Outfit, sans-serif', color: d.color }}>{d.value}</p>
                <p className="text-[11px] leading-tight" style={{ color: '#94A3B8' }}>{d.label}</p>
              </div>
            ))}
          </div>

          {/* What is space debris */}
          <div className="rounded-xl border p-6 sm:p-8 mb-8" style={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3" style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}>
              <Trash2 className="w-5 h-5" style={{ color: '#F59E0B' }} />
              What Is Space Debris?
            </h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#94A3B8' }}>
              Space debris (also called space junk or orbital debris) consists of all non-functional, human-made objects in Earth orbit. This includes defunct satellites, spent upper stages of launch vehicles, mission-related debris, fragments from satellite breakups and collisions, and even tiny flecks of paint.
            </p>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#94A3B8' }}>
              At orbital velocities, even a 1 cm object carries the kinetic energy of a hand grenade. A 10 cm object can completely destroy a spacecraft. The International Space Station regularly performs debris avoidance maneuvers — sometimes with only hours of warning.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>
              The most densely populated zones are in LEO between 700-1,000 km altitude, which is particularly concerning because debris at these altitudes can persist for centuries before atmospheric drag pulls it down.
            </p>
          </div>

          {/* Kessler Syndrome */}
          <div className="rounded-xl border p-6 sm:p-8 mb-8" style={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3" style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}>
              <Zap className="w-5 h-5" style={{ color: '#EF4444' }} />
              Kessler Syndrome
            </h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#94A3B8' }}>
              Proposed by NASA scientist Donald Kessler in 1978, the Kessler Syndrome describes a catastrophic cascade scenario: as the density of objects in orbit increases, collisions produce more debris, which causes more collisions, creating an exponentially growing cloud of fragments.
            </p>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#94A3B8' }}>
              In the worst case, this runaway chain reaction could render entire orbital altitudes unusable for generations. Some scientists believe the cascade has already begun in the most congested regions of LEO.
            </p>
            <div className="rounded-lg p-4" style={{ backgroundColor: '#030712', borderLeft: '3px solid #EF4444' }}>
              <p className="text-sm font-medium" style={{ color: '#E2E8F0' }}>
                &ldquo;We&apos;re at the point where even if we stopped all launches today, the debris population would continue to grow due to collisions between existing objects.&rdquo;
              </p>
              <p className="text-xs mt-2" style={{ color: '#64748B' }}>
                — Donald Kessler, NASA (retired)
              </p>
            </div>
          </div>

          {/* Major collision events */}
          <div className="rounded-xl border p-6 sm:p-8 mb-8" style={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }}>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3" style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}>
              <AlertTriangle className="w-5 h-5" style={{ color: '#F59E0B' }} />
              Major Debris-Creating Events
            </h3>
            <div className="space-y-6">
              {debrisEvents.map((event) => (
                <div key={event.year} className="flex gap-4">
                  <div className="shrink-0 w-14 h-14 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#030712' }}>
                    <span className="text-sm font-bold" style={{ color: '#F59E0B' }}>{event.year}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-1" style={{ color: '#E2E8F0' }}>{event.title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cleanup efforts */}
          <div className="rounded-xl border p-6 sm:p-8" style={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3" style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}>
              <Shield className="w-5 h-5" style={{ color: '#34D399' }} />
              Cleanup Efforts & Future Solutions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: 'Active Debris Removal (ADR)',
                  desc: 'Missions like ClearSpace-1 (ESA, 2026) plan to capture and deorbit large debris using robotic arms and nets.',
                },
                {
                  title: 'Deorbiting Regulations',
                  desc: 'The FCC now requires satellites to deorbit within 5 years of end-of-life. Many operators use drag sails or ion thrusters.',
                },
                {
                  title: 'Space Situational Awareness',
                  desc: 'US Space Command, LeoLabs, and ESA track debris 24/7, issuing collision avoidance alerts to satellite operators worldwide.',
                },
                {
                  title: 'Laser Ablation & Tethers',
                  desc: 'Ground-based lasers could nudge small debris to lower orbits. Electrodynamic tethers could use Earth\'s magnetic field for deorbiting.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-lg p-4" style={{ backgroundColor: '#030712' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <ChevronRight className="w-4 h-4" style={{ color: '#34D399' }} />
                    <h4 className="text-sm font-bold" style={{ color: '#E2E8F0' }}>{item.title}</h4>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================== BOTTOM CTA ====================== */}
      <section className="py-16 px-4 sm:px-6" style={{ backgroundColor: '#0F172A' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm mb-3" style={{ color: '#64748B' }}>
            Data sourced from UCS Satellite Database, ESA Space Debris Office, NASA Orbital Debris Program, and CelesTrak. Figures are approximate and updated periodically.
          </p>
          <p className="text-xs" style={{ color: '#334155' }}>
            Last updated: April 2026
          </p>
        </div>
      </section>
    </main>
  );
}
