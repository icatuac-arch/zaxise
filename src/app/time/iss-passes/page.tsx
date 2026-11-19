"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Satellite,
  MapPin,
  Globe,
  Eye,
  Clock,
  Gauge,
  Mountain,
  Ruler,
  RotateCcw,
  Sun,
  Sunrise,
  Star,
  ExternalLink,
  Bell,
  Mail,
  Navigation,
  Binoculars,
  CloudOff,
  Locate,
  ChevronDown,
  Info,
  Lightbulb,
  Zap,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ISSPosition {
  latitude: number;
  longitude: number;
  timestamp: number;
}

/* ------------------------------------------------------------------ */
/*  Common cities with lat/lng                                         */
/* ------------------------------------------------------------------ */

const CITIES = [
  { name: "New York, USA", lat: 40.7128, lng: -74.006 },
  { name: "Los Angeles, USA", lat: 34.0522, lng: -118.2437 },
  { name: "Chicago, USA", lat: 41.8781, lng: -87.6298 },
  { name: "Houston, USA", lat: 29.7604, lng: -95.3698 },
  { name: "Miami, USA", lat: 25.7617, lng: -80.1918 },
  { name: "San Francisco, USA", lat: 37.7749, lng: -122.4194 },
  { name: "London, UK", lat: 51.5074, lng: -0.1278 },
  { name: "Paris, France", lat: 48.8566, lng: 2.3522 },
  { name: "Berlin, Germany", lat: 52.52, lng: 13.405 },
  { name: "Madrid, Spain", lat: 40.4168, lng: -3.7038 },
  { name: "Rome, Italy", lat: 41.9028, lng: 12.4964 },
  { name: "Amsterdam, Netherlands", lat: 52.3676, lng: 4.9041 },
  { name: "Tokyo, Japan", lat: 35.6762, lng: 139.6503 },
  { name: "Beijing, China", lat: 39.9042, lng: 116.4074 },
  { name: "Seoul, South Korea", lat: 37.5665, lng: 126.978 },
  { name: "Mumbai, India", lat: 19.076, lng: 72.8777 },
  { name: "Delhi, India", lat: 28.7041, lng: 77.1025 },
  { name: "Bangkok, Thailand", lat: 13.7563, lng: 100.5018 },
  { name: "Singapore", lat: 1.3521, lng: 103.8198 },
  { name: "Dubai, UAE", lat: 25.2048, lng: 55.2708 },
  { name: "Sydney, Australia", lat: -33.8688, lng: 151.2093 },
  { name: "Melbourne, Australia", lat: -37.8136, lng: 144.9631 },
  { name: "Toronto, Canada", lat: 43.6532, lng: -79.3832 },
  { name: "Mexico City, Mexico", lat: 19.4326, lng: -99.1332 },
  { name: "S\u00e3o Paulo, Brazil", lat: -23.5505, lng: -46.6333 },
  { name: "Buenos Aires, Argentina", lat: -34.6037, lng: -58.3816 },
  { name: "Cairo, Egypt", lat: 30.0444, lng: 31.2357 },
  { name: "Moscow, Russia", lat: 55.7558, lng: 37.6173 },
  { name: "Istanbul, Turkey", lat: 41.0082, lng: 28.9784 },
  { name: "Johannesburg, South Africa", lat: -26.2041, lng: 28.0473 },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getRegionFromCoords(lat: number, lng: number): string {
  if (lat < -60) return "Antarctica";
  if (lat > 66) return "Arctic Region";
  if (lat > 15 && lat < 72 && lng > -170 && lng < -50) return "North America";
  if (lat > 7 && lat <= 15 && lng > -120 && lng < -60) return "Central America";
  if (lat > -56 && lat <= 15 && lng > -82 && lng < -34) return "South America";
  if (lat > 35 && lat < 72 && lng > -12 && lng < 45) return "Europe";
  if (lat > 15 && lat <= 37 && lng > -18 && lng < 55) return "North Africa";
  if (lat > -35 && lat <= 15 && lng > -18 && lng < 52) return "Sub-Saharan Africa";
  if (lat > 12 && lat < 42 && lng >= 45 && lng < 65) return "Middle East";
  if (lat > 35 && lat < 55 && lng >= 45 && lng < 90) return "Central Asia";
  if (lat > 5 && lat <= 35 && lng >= 65 && lng < 100) return "South Asia";
  if (lat > 20 && lat < 55 && lng >= 100 && lng < 145) return "East Asia";
  if (lat > -10 && lat <= 20 && lng >= 90 && lng < 150) return "Southeast Asia";
  if (lat > -50 && lat < -10 && lng >= 110 && lng < 180) return "Oceania";

  if (lng > -80 && lng < 0 && lat > 0 && lat < 40) return "Atlantic Ocean";
  if (lng > 20 && lng < 120 && lat > -40 && lat < 30) return "Indian Ocean";
  return "Pacific Ocean";
}

function formatCoord(val: number, pos: string, neg: string): string {
  const dir = val >= 0 ? pos : neg;
  return `${Math.abs(val).toFixed(4)}\u00b0 ${dir}`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ISSPassesPage() {
  /* Location state */
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [locationName, setLocationName] = useState("");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [cityOpen, setCityOpen] = useState(false);

  /* ISS state */
  const [issPos, setIssPos] = useState<ISSPosition | null>(null);
  const [issLoading, setIssLoading] = useState(true);

  /* Fetch ISS position */
  const fetchISS = useCallback(async () => {
    try {
      const res = await fetch("/api/iss-position");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setIssPos({
        latitude: parseFloat(data.iss_position.latitude),
        longitude: parseFloat(data.iss_position.longitude),
        timestamp: data.timestamp,
      });
    } catch {
      /* ignore */
    } finally {
      setIssLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchISS();
    const iv = setInterval(fetchISS, 5000);
    return () => clearInterval(iv);
  }, [fetchISS]);

  /* Geolocation */
  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(4));
        setLng(pos.coords.longitude.toFixed(4));
        setLocationName("Your Location");
        setLocating(false);
      },
      () => {
        setLocationError("Unable to get your location. Please enter it manually.");
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const selectCity = (city: (typeof CITIES)[number]) => {
    setLat(city.lat.toFixed(4));
    setLng(city.lng.toFixed(4));
    setLocationName(city.name);
    setCityOpen(false);
  };

  const hasLocation = lat !== "" && lng !== "";

  /* Distance to ISS (if both available) */
  const distanceToISS =
    hasLocation && issPos
      ? (() => {
          const R = 6371;
          const dLat = ((issPos.latitude - parseFloat(lat)) * Math.PI) / 180;
          const dLng = ((issPos.longitude - parseFloat(lng)) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos((parseFloat(lat) * Math.PI) / 180) *
              Math.cos((issPos.latitude * Math.PI) / 180) *
              Math.sin(dLng / 2) ** 2;
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return Math.round(R * c);
        })()
      : null;

  return (
    <main className="min-h-screen bg-dark-bg text-[#E2E8F0]">
      {/* Hero */}
      <section className="pt-10 sm:pt-12 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
            <Satellite className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">ISS Viewing Guide</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            When Can I See the{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ISS
            </span>
            ?
          </h1>
          <p className="text-muted text-lg sm:text-xl max-w-2xl mx-auto">
            Find out when the International Space Station will pass over your location,
            get viewing tips, and sign up for NASA alerts.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-16 space-y-8">
        {/* ------------------------------------------------------------ */}
        {/*  Location Input                                               */}
        {/* ------------------------------------------------------------ */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6">
          <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Your Location
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Latitude */}
            <div>
              <label className="block text-sm text-muted mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                min={-90}
                max={90}
                placeholder="e.g. 40.7128"
                value={lat}
                onChange={(e) => {
                  setLat(e.target.value);
                  setLocationName("");
                }}
                className="w-full bg-dark-bg border border-card-border rounded-lg px-3 py-2 text-[#E2E8F0] placeholder-muted-dark focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            {/* Longitude */}
            <div>
              <label className="block text-sm text-muted mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                min={-180}
                max={180}
                placeholder="e.g. -74.0060"
                value={lng}
                onChange={(e) => {
                  setLng(e.target.value);
                  setLocationName("");
                }}
                className="w-full bg-dark-bg border border-card-border rounded-lg px-3 py-2 text-[#E2E8F0] placeholder-muted-dark focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            {/* Use My Location */}
            <div className="flex items-end">
              <button
                onClick={useMyLocation}
                disabled={locating}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-lg px-4 py-2 font-medium transition-colors"
              >
                <Locate className="w-4 h-4" />
                {locating ? "Locating..." : "Use My Location"}
              </button>
            </div>
            {/* City Dropdown */}
            <div className="relative flex items-end">
              <button
                onClick={() => setCityOpen(!cityOpen)}
                className="w-full flex items-center justify-between gap-2 bg-card-bg border border-card-border hover:border-primary/50 text-[#E2E8F0] rounded-lg px-4 py-2 font-medium transition-colors"
              >
                <span className="truncate text-sm">
                  {locationName && locationName !== "Your Location"
                    ? locationName
                    : "Select a City"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-muted transition-transform ${
                    cityOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {cityOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card-bg border border-card-border rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                  {CITIES.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => selectCity(city)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-primary/10 text-[#E2E8F0] transition-colors"
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {locationError && (
            <p className="text-red-400 text-sm mt-2">{locationError}</p>
          )}

          {hasLocation && (
            <div className="mt-4 p-4 bg-dark-bg rounded-xl border border-card-border">
              <p className="text-sm text-muted mb-1">
                {locationName && <span className="text-secondary font-medium">{locationName} &mdash; </span>}
                {formatCoord(parseFloat(lat), "N", "S")}, {formatCoord(parseFloat(lng), "E", "W")}
              </p>
              {distanceToISS !== null && (
                <p className="text-sm text-muted">
                  The ISS is currently <span className="text-primary font-semibold">{distanceToISS.toLocaleString()} km</span> from your ground position.
                </p>
              )}
            </div>
          )}
        </section>

        {/* ------------------------------------------------------------ */}
        {/*  Current ISS Position                                         */}
        {/* ------------------------------------------------------------ */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6">
          <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-secondary" />
            Current ISS Position
          </h2>

          {issLoading ? (
            <div className="flex items-center gap-3 text-muted">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Fetching ISS position...
            </div>
          ) : issPos ? (
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-dark-bg rounded-xl p-4 border border-card-border text-center">
                <p className="text-sm text-muted mb-1">Latitude</p>
                <p className="text-xl font-bold font-heading">
                  {formatCoord(issPos.latitude, "N", "S")}
                </p>
              </div>
              <div className="bg-dark-bg rounded-xl p-4 border border-card-border text-center">
                <p className="text-sm text-muted mb-1">Longitude</p>
                <p className="text-xl font-bold font-heading">
                  {formatCoord(issPos.longitude, "E", "W")}
                </p>
              </div>
              <div className="bg-dark-bg rounded-xl p-4 border border-card-border text-center">
                <p className="text-sm text-muted mb-1">Flying Over</p>
                <p className="text-xl font-bold font-heading text-secondary">
                  {getRegionFromCoords(issPos.latitude, issPos.longitude)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-muted">Unable to fetch ISS position. Try again later.</p>
          )}
          <p className="text-xs text-muted-dark mt-3">Updates every 5 seconds</p>
        </section>

        <AdBanner />

        {/* ------------------------------------------------------------ */}
        {/*  Pass Prediction Links                                        */}
        {/* ------------------------------------------------------------ */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6">
          <h2 className="font-heading text-xl font-semibold mb-2 flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            ISS Pass Predictions for Your Location
          </h2>
          <p className="text-muted text-sm mb-6">
            For precise, up-to-the-minute ISS pass times tailored to your exact location,
            use these trusted resources:
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="https://spotthestation.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 bg-dark-bg rounded-xl p-5 border border-card-border hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Satellite className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold group-hover:text-primary transition-colors flex items-center gap-1.5">
                  NASA Spot The Station
                  <ExternalLink className="w-3.5 h-3.5 text-muted" />
                </h3>
                <p className="text-sm text-muted mt-1">
                  Official NASA tool. Enter your location to get exact pass times,
                  max elevation, and appear/disappear directions. Sign up for email or
                  text alerts.
                </p>
              </div>
            </a>

            <a
              href="https://heavens-above.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 bg-dark-bg rounded-xl p-5 border border-card-border hover:border-secondary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold group-hover:text-secondary transition-colors flex items-center gap-1.5">
                  Heavens-Above
                  <ExternalLink className="w-3.5 h-3.5 text-muted" />
                </h3>
                <p className="text-sm text-muted mt-1">
                  Detailed sky charts, pass predictions for the ISS and other satellites.
                  Shows exact sky path, brightness magnitude, and timing.
                </p>
              </div>
            </a>
          </div>

          {hasLocation && (
            <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <p className="text-sm text-muted flex items-start gap-2">
                <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>
                  Use your coordinates (<strong>{parseFloat(lat).toFixed(2)}, {parseFloat(lng).toFixed(2)}</strong>)
                  when entering your location on either site for the most accurate predictions.
                </span>
              </p>
            </div>
          )}
        </section>

        {/* ------------------------------------------------------------ */}
        {/*  Viewing Tips                                                 */}
        {/* ------------------------------------------------------------ */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6">
          <h2 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
            <Binoculars className="w-5 h-5 text-secondary" />
            ISS Viewing Tips
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Sunrise,
                title: "Best Time to Look",
                desc: "The ISS is best seen 1\u20132 hours before sunrise or after sunset, when the sky is dark but the station is still in sunlight.",
                color: "text-amber-400",
                bg: "bg-amber-400/10",
              },
              {
                icon: Star,
                title: "What It Looks Like",
                desc: "A very bright, steady \u201cstar\u201d moving smoothly across the sky. It does NOT blink or flash \u2014 that\u2019s how you tell it from a plane.",
                color: "text-yellow-300",
                bg: "bg-yellow-300/10",
              },
              {
                icon: Clock,
                title: "How Long It\u2019s Visible",
                desc: "A typical pass lasts 2\u20136 minutes. It moves faster than any plane and crosses a large part of the sky.",
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                icon: Sun,
                title: "Brighter Than Any Star",
                desc: "The ISS can reach magnitude -5.9, making it the brightest moving object in the night sky (after the Moon).",
                color: "text-secondary",
                bg: "bg-secondary/10",
              },
              {
                icon: Navigation,
                title: "Where to Look",
                desc: "The ISS most often appears from the west or southwest and moves toward the east or northeast. Face west to catch it early.",
                color: "text-emerald-400",
                bg: "bg-emerald-400/10",
              },
              {
                icon: CloudOff,
                title: "Clear Skies Needed",
                desc: "You need clear skies and minimal light pollution. Get away from bright city lights for the best view. No telescope needed!",
                color: "text-violet-400",
                bg: "bg-violet-400/10",
              },
            ].map((tip) => (
              <div
                key={tip.title}
                className="bg-dark-bg rounded-xl p-5 border border-card-border"
              >
                <div
                  className={`w-10 h-10 rounded-lg ${tip.bg} flex items-center justify-center mb-3`}
                >
                  <tip.icon className={`w-5 h-5 ${tip.color}`} />
                </div>
                <h3 className="font-heading font-semibold mb-2">{tip.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/*  ISS Quick Facts                                              */}
        {/* ------------------------------------------------------------ */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6">
          <h2 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            ISS Quick Facts
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                icon: Gauge,
                label: "Speed",
                value: "27,600 km/h",
                sub: "17,150 mph",
              },
              {
                icon: Mountain,
                label: "Altitude",
                value: "~408 km",
                sub: "~253 miles",
              },
              {
                icon: RotateCcw,
                label: "Orbit Time",
                value: "~92 min",
                sub: "15.5 orbits/day",
              },
              {
                icon: Ruler,
                label: "Size",
                value: "109m \u00d7 73m",
                sub: "Football field",
              },
              {
                icon: Globe,
                label: "Inclination",
                value: "51.6\u00b0",
                sub: "Orbital tilt",
              },
              {
                icon: Clock,
                label: "In Orbit Since",
                value: "Nov 1998",
                sub: "25+ years",
              },
            ].map((fact) => (
              <div
                key={fact.label}
                className="bg-dark-bg rounded-xl p-4 border border-card-border text-center"
              >
                <fact.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted mb-1">{fact.label}</p>
                <p className="font-heading font-bold text-sm">{fact.value}</p>
                <p className="text-xs text-muted-dark">{fact.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/*  Sign Up for Alerts                                           */}
        {/* ------------------------------------------------------------ */}
        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-6">
          <h2 className="font-heading text-xl font-semibold mb-2 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Get Notified Before the ISS Passes Over You
          </h2>
          <p className="text-muted text-sm mb-6">
            NASA offers free email and text alerts so you never miss a visible ISS pass.
            Sign up once and get notified every time the ISS is visible from your location.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="https://spotthestation.nasa.gov/signup.cfm"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-card-bg rounded-xl p-4 border border-card-border hover:border-primary/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-sm group-hover:text-primary transition-colors flex items-center gap-1.5">
                  NASA Email Alerts
                  <ExternalLink className="w-3 h-3 text-muted" />
                </h3>
                <p className="text-xs text-muted">
                  Get an email a few hours before each visible pass
                </p>
              </div>
            </a>

            <a
              href="https://spotthestation.nasa.gov/signup.cfm"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-card-bg rounded-xl p-4 border border-card-border hover:border-secondary/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-sm group-hover:text-secondary transition-colors flex items-center gap-1.5">
                  NASA Text Alerts
                  <ExternalLink className="w-3 h-3 text-muted" />
                </h3>
                <p className="text-xs text-muted">
                  Get a text message before the ISS is visible from your area
                </p>
              </div>
            </a>
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/*  What is the ISS?                                             */}
        {/* ------------------------------------------------------------ */}
        <section className="bg-card-bg border border-card-border rounded-2xl p-6">
          <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
            <Satellite className="w-5 h-5 text-secondary" />
            What Is the International Space Station?
          </h2>
          <div className="space-y-3 text-sm text-muted leading-relaxed">
            <p>
              The International Space Station (ISS) is the largest human-made object in
              orbit. It is a collaborative project among five space agencies: NASA (USA),
              Roscosmos (Russia), ESA (Europe), JAXA (Japan), and CSA (Canada).
            </p>
            <p>
              The station orbits Earth at an altitude of about 408 km (253 miles), traveling
              at approximately 27,600 km/h (17,150 mph). At that speed, it circles Earth
              every 92 minutes, experiencing about 16 sunrises and sunsets per day.
            </p>
            <p>
              With its large solar arrays, the ISS is one of the brightest objects in the
              night sky. It is easily visible to the naked eye and can outshine Venus. It
              looks like a bright, fast-moving star that doesn&apos;t blink.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
