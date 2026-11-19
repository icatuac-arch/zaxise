"use client";

import { useState } from "react";
import {
  Ruler,
  Scale,
  Thermometer,
  Gauge,
  ArrowRightLeft,
  Zap,
  Rocket,
  Globe,
  Star,
  Sun,
  Moon,
  Info,
  ChevronDown,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ConverterTab = "distance" | "mass" | "temperature" | "speed";

/* ------------------------------------------------------------------ */
/*  Distance units (all relative to km)                                */
/* ------------------------------------------------------------------ */

const DISTANCE_UNITS: { key: string; label: string; toKm: number }[] = [
  { key: "km", label: "Kilometers (km)", toKm: 1 },
  { key: "mi", label: "Miles (mi)", toKm: 1.609344 },
  { key: "au", label: "Astronomical Units (AU)", toKm: 149_597_870.7 },
  { key: "ls", label: "Light-seconds", toKm: 299_792.458 },
  { key: "lm", label: "Light-minutes", toKm: 17_987_547.48 },
  { key: "lh", label: "Light-hours", toKm: 1_079_252_848.8 },
  { key: "ly", label: "Light-years", toKm: 9_460_730_472_580.8 },
  { key: "pc", label: "Parsecs", toKm: 30_856_775_814_913.673 },
];

const EARTH_MOON_KM = 384_400;

function distanceContext(km: number): string {
  if (km <= 0) return "";
  const ratio = km / EARTH_MOON_KM;
  if (ratio < 0.001) return `About ${(km * 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} meters`;
  if (ratio < 0.1) return `About ${(ratio * 100).toFixed(2)}% of the Earth-Moon distance`;
  if (ratio < 100) return `About ${ratio.toFixed(2)}x the Earth-Moon distance (${EARTH_MOON_KM.toLocaleString()} km)`;
  if (ratio < 1_000_000) return `About ${ratio.toLocaleString(undefined, { maximumFractionDigits: 0 })}x the Earth-Moon distance`;
  const au = km / 149_597_870.7;
  if (au < 100) return `About ${au.toFixed(4)} AU (Earth-Sun distances)`;
  const ly = km / 9_460_730_472_580.8;
  if (ly < 100) return `About ${ly.toFixed(4)} light-years`;
  return `About ${ly.toLocaleString(undefined, { maximumFractionDigits: 1 })} light-years`;
}

/* ------------------------------------------------------------------ */
/*  Mass units (all relative to kg)                                    */
/* ------------------------------------------------------------------ */

const MASS_UNITS: { key: string; label: string; toKg: number }[] = [
  { key: "kg", label: "Kilograms (kg)", toKg: 1 },
  { key: "lunar", label: "Lunar Masses", toKg: 7.342e22 },
  { key: "earth", label: "Earth Masses", toKg: 5.972e24 },
  { key: "jupiter", label: "Jupiter Masses", toKg: 1.898e27 },
  { key: "solar", label: "Solar Masses", toKg: 1.989e30 },
];

function massContext(kg: number): string {
  if (kg <= 0) return "";
  const earthMass = 5.972e24;
  const ratio = kg / earthMass;
  if (ratio < 0.001) return `About ${(kg / 7.342e22).toFixed(4)} Lunar masses`;
  if (ratio < 1000) return `About ${ratio.toFixed(4)} Earth masses`;
  const jup = kg / 1.898e27;
  if (jup < 1000) return `About ${jup.toFixed(4)} Jupiter masses`;
  return `About ${(kg / 1.989e30).toFixed(6)} Solar masses`;
}

/* ------------------------------------------------------------------ */
/*  Temperature                                                        */
/* ------------------------------------------------------------------ */

function celsiusFrom(val: number, unit: string): number {
  if (unit === "C") return val;
  if (unit === "F") return (val - 32) * (5 / 9);
  return val - 273.15; // K
}

function fromCelsius(c: number, unit: string): number {
  if (unit === "C") return c;
  if (unit === "F") return c * (9 / 5) + 32;
  return c + 273.15;
}

const TEMP_UNITS = [
  { key: "C", label: "Celsius (\u00b0C)" },
  { key: "F", label: "Fahrenheit (\u00b0F)" },
  { key: "K", label: "Kelvin (K)" },
];

const TEMP_REFS = [
  { label: "Absolute Zero", c: -273.15 },
  { label: "Outer Space", c: -270 },
  { label: "Liquid Nitrogen", c: -196 },
  { label: "Water Freezes", c: 0 },
  { label: "Room Temperature", c: 22 },
  { label: "Water Boils", c: 100 },
  { label: "Surface of Venus", c: 465 },
  { label: "Surface of Sun", c: 5500 },
  { label: "Core of Earth", c: 5400 },
  { label: "Core of Sun", c: 15_000_000 },
];

function tempContext(c: number): string {
  if (c <= -273) return "Near absolute zero \u2014 colder than outer space";
  if (c <= -200) return "Colder than liquid nitrogen (-196\u00b0C)";
  if (c <= -100) return "Colder than the coldest place on Earth";
  if (c <= 0) return "Below freezing";
  if (c <= 100) return "Within the range of liquid water on Earth";
  if (c <= 500) return "Hotter than an oven \u2014 approaching Venus surface temps";
  if (c <= 6000) return "In the range of the Sun\u2019s surface temperature (~5,500\u00b0C)";
  return "Hotter than the surface of the Sun!";
}

/* ------------------------------------------------------------------ */
/*  Speed units (all relative to km/s)                                 */
/* ------------------------------------------------------------------ */

const SPEED_C = 299_792.458; // km/s
const MACH = 0.343; // km/s (at sea level, 20\u00b0C)
const ESCAPE_V = 11.2; // km/s

const SPEED_UNITS: { key: string; label: string; toKmS: number }[] = [
  { key: "kmh", label: "km/h", toKmS: 1 / 3600 },
  { key: "mph", label: "mph", toKmS: 1.609344 / 3600 },
  { key: "kms", label: "km/s", toKmS: 1 },
  { key: "c", label: "Speed of Light (c)", toKmS: SPEED_C },
  { key: "pct_c", label: "% of Speed of Light", toKmS: SPEED_C / 100 },
  { key: "mach", label: "Mach", toKmS: MACH },
  { key: "esc", label: "Earth Escape Velocities", toKmS: ESCAPE_V },
];

function speedContext(kms: number): string {
  if (kms <= 0) return "";
  const pctC = (kms / SPEED_C) * 100;
  if (pctC >= 100) return "At or beyond the speed of light!";
  if (pctC >= 1) return `${pctC.toFixed(4)}% the speed of light`;
  const machs = kms / MACH;
  if (machs >= 1) return `About Mach ${machs.toFixed(1)} \u2014 ${(kms / ESCAPE_V).toFixed(2)}x Earth escape velocity`;
  return `About ${(kms * 3600).toFixed(1)} km/h`;
}

/* ------------------------------------------------------------------ */
/*  Quick references                                                   */
/* ------------------------------------------------------------------ */

const QUICK_REFS = [
  { label: "Earth to Moon", value: "384,400 km", icon: Moon },
  { label: "Earth to Sun", value: "1 AU (149.6M km)", icon: Sun },
  { label: "Earth to Mars (closest)", value: "~55 million km", icon: Rocket },
  { label: "Solar System diameter", value: "~287 billion km", icon: Globe },
  { label: "Nearest star (Proxima)", value: "4.24 light-years", icon: Star },
  { label: "Milky Way diameter", value: "100,000 light-years", icon: Star },
  { label: "Observable universe", value: "93 billion light-years", icon: Zap },
];

/* ------------------------------------------------------------------ */
/*  Formatting                                                         */
/* ------------------------------------------------------------------ */

function fmt(n: number): string {
  if (!isFinite(n) || isNaN(n)) return "0";
  const abs = Math.abs(n);
  if (abs === 0) return "0";
  if (abs >= 1e15) return n.toExponential(4);
  if (abs >= 1e6) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (abs >= 1) return n.toLocaleString(undefined, { maximumFractionDigits: 6 });
  if (abs >= 1e-6) return n.toFixed(10).replace(/0+$/, "").replace(/\.$/, "");
  return n.toExponential(4);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SpaceUnitsPage() {
  const [tab, setTab] = useState<ConverterTab>("distance");

  /* Distance */
  const [distVal, setDistVal] = useState("");
  const [distUnit, setDistUnit] = useState("km");

  /* Mass */
  const [massVal, setMassVal] = useState("");
  const [massUnit, setMassUnit] = useState("kg");

  /* Temperature */
  const [tempVal, setTempVal] = useState("");
  const [tempUnit, setTempUnit] = useState("C");

  /* Speed */
  const [speedVal, setSpeedVal] = useState("");
  const [speedUnit, setSpeedUnit] = useState("kmh");

  const tabs: { key: ConverterTab; label: string; icon: typeof Ruler }[] = [
    { key: "distance", label: "Distance", icon: Ruler },
    { key: "mass", label: "Mass", icon: Scale },
    { key: "temperature", label: "Temperature", icon: Thermometer },
    { key: "speed", label: "Speed", icon: Gauge },
  ];

  /* Compute conversions */
  const distNum = parseFloat(distVal) || 0;
  const distKm = distNum * (DISTANCE_UNITS.find((u) => u.key === distUnit)?.toKm ?? 1);

  const massNum = parseFloat(massVal) || 0;
  const massKg = massNum * (MASS_UNITS.find((u) => u.key === massUnit)?.toKg ?? 1);

  const tempNum = parseFloat(tempVal);
  const tempC = isNaN(tempNum) ? null : celsiusFrom(tempNum, tempUnit);

  const speedNum = parseFloat(speedVal) || 0;
  const speedKmS = speedNum * (SPEED_UNITS.find((u) => u.key === speedUnit)?.toKmS ?? 1);

  return (
    <main className="min-h-screen bg-dark-bg text-[#E2E8F0]">
      {/* Hero */}
      <section className="pt-10 sm:pt-12 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
            <ArrowRightLeft className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Space Unit Converter</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Space{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Unit Converter
            </span>
          </h1>
          <p className="text-muted text-lg sm:text-xl max-w-2xl mx-auto">
            Convert between astronomical distances, cosmic masses, extreme temperatures,
            and mind-bending speeds. Results update live as you type.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="lg:grid lg:grid-cols-[1fr_280px] gap-8">
          {/* Main converter area */}
          <div className="space-y-8">
            {/* Tab bar */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-colors ${
                    tab === t.key
                      ? "bg-primary text-white"
                      : "bg-card-bg border border-card-border text-muted hover:text-[#E2E8F0]"
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
            </div>

            {/* ---- Distance ---- */}
            {tab === "distance" && (
              <section className="bg-card-bg border border-card-border rounded-2xl p-6">
                <h2 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-primary" />
                  Distance Converter
                </h2>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-muted mb-1">Value</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="Enter a value"
                      value={distVal}
                      onChange={(e) => setDistVal(e.target.value)}
                      className="w-full bg-dark-bg border border-card-border rounded-lg px-3 py-2 text-[#E2E8F0] placeholder-muted-dark focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-1">Unit</label>
                    <div className="relative">
                      <select
                        value={distUnit}
                        onChange={(e) => setDistUnit(e.target.value)}
                        className="w-full appearance-none bg-dark-bg border border-card-border rounded-lg px-3 py-2 text-[#E2E8F0] focus:outline-none focus:border-primary transition-colors pr-8"
                      >
                        {DISTANCE_UNITS.map((u) => (
                          <option key={u.key} value={u.key}>{u.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                    </div>
                  </div>
                </div>

                {distNum > 0 && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-3 mb-4">
                      {DISTANCE_UNITS.filter((u) => u.key !== distUnit).map((u) => {
                        const converted = distKm / u.toKm;
                        return (
                          <div key={u.key} className="bg-dark-bg rounded-xl p-4 border border-card-border">
                            <p className="text-xs text-muted mb-1">{u.label}</p>
                            <p className="font-heading font-bold text-lg text-primary">{fmt(converted)}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl">
                      <p className="text-sm text-muted flex items-start gap-2">
                        <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        {distanceContext(distKm)}
                      </p>
                    </div>
                  </>
                )}
              </section>
            )}

            {/* ---- Mass ---- */}
            {tab === "mass" && (
              <section className="bg-card-bg border border-card-border rounded-2xl p-6">
                <h2 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-secondary" />
                  Mass Converter
                </h2>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-muted mb-1">Value</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="Enter a value"
                      value={massVal}
                      onChange={(e) => setMassVal(e.target.value)}
                      className="w-full bg-dark-bg border border-card-border rounded-lg px-3 py-2 text-[#E2E8F0] placeholder-muted-dark focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

            <AdBanner />
                  <div>
                    <label className="block text-sm text-muted mb-1">Unit</label>
                    <div className="relative">
                      <select
                        value={massUnit}
                        onChange={(e) => setMassUnit(e.target.value)}
                        className="w-full appearance-none bg-dark-bg border border-card-border rounded-lg px-3 py-2 text-[#E2E8F0] focus:outline-none focus:border-primary transition-colors pr-8"
                      >
                        {MASS_UNITS.map((u) => (
                          <option key={u.key} value={u.key}>{u.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                    </div>
                  </div>
                </div>

                {massNum > 0 && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-3 mb-4">
                      {MASS_UNITS.filter((u) => u.key !== massUnit).map((u) => {
                        const converted = massKg / u.toKg;
                        return (
                          <div key={u.key} className="bg-dark-bg rounded-xl p-4 border border-card-border">
                            <p className="text-xs text-muted mb-1">{u.label}</p>
                            <p className="font-heading font-bold text-lg text-secondary">{fmt(converted)}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="p-3 bg-secondary/5 border border-secondary/20 rounded-xl">
                      <p className="text-sm text-muted flex items-start gap-2">
                        <Info className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                        {massContext(massKg)}
                      </p>
                    </div>
                  </>
                )}
              </section>
            )}

            {/* ---- Temperature ---- */}
            {tab === "temperature" && (
              <section className="bg-card-bg border border-card-border rounded-2xl p-6">
                <h2 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-amber-400" />
                  Temperature Converter
                </h2>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-muted mb-1">Value</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="Enter a value"
                      value={tempVal}
                      onChange={(e) => setTempVal(e.target.value)}
                      className="w-full bg-dark-bg border border-card-border rounded-lg px-3 py-2 text-[#E2E8F0] placeholder-muted-dark focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-1">Unit</label>
                    <div className="relative">
                      <select
                        value={tempUnit}
                        onChange={(e) => setTempUnit(e.target.value)}
                        className="w-full appearance-none bg-dark-bg border border-card-border rounded-lg px-3 py-2 text-[#E2E8F0] focus:outline-none focus:border-primary transition-colors pr-8"
                      >
                        {TEMP_UNITS.map((u) => (
                          <option key={u.key} value={u.key}>{u.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                    </div>
                  </div>
                </div>

                {tempC !== null && (
                  <>
                    <div className="grid sm:grid-cols-3 gap-3 mb-4">
                      {TEMP_UNITS.filter((u) => u.key !== tempUnit).map((u) => {
                        const converted = fromCelsius(tempC, u.key);
                        return (
                          <div key={u.key} className="bg-dark-bg rounded-xl p-4 border border-card-border">
                            <p className="text-xs text-muted mb-1">{u.label}</p>
                            <p className="font-heading font-bold text-lg text-amber-400">{fmt(converted)}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl mb-4">
                      <p className="text-sm text-muted flex items-start gap-2">
                        <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        {tempContext(tempC)}
                      </p>
                    </div>

                    {/* Reference points */}
                    <h3 className="font-heading text-sm font-semibold text-muted mb-3">
                      Reference Temperatures
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {TEMP_REFS.map((ref) => (
                        <button
                          key={ref.label}
                          onClick={() => {
                            setTempUnit("C");
                            setTempVal(String(ref.c));
                          }}
                          className="bg-dark-bg rounded-lg p-2 border border-card-border hover:border-amber-500/30 transition-colors text-left"
                        >
                          <p className="text-[10px] text-muted truncate">{ref.label}</p>
                          <p className="text-xs font-bold text-amber-400">
                            {ref.c.toLocaleString()}&deg;C
                          </p>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </section>
            )}

            {/* ---- Speed ---- */}
            {tab === "speed" && (
              <section className="bg-card-bg border border-card-border rounded-2xl p-6">
                <h2 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-emerald-400" />
                  Speed Converter
                </h2>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-muted mb-1">Value</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="Enter a value"
                      value={speedVal}
                      onChange={(e) => setSpeedVal(e.target.value)}
                      className="w-full bg-dark-bg border border-card-border rounded-lg px-3 py-2 text-[#E2E8F0] placeholder-muted-dark focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-1">Unit</label>
                    <div className="relative">
                      <select
                        value={speedUnit}
                        onChange={(e) => setSpeedUnit(e.target.value)}
                        className="w-full appearance-none bg-dark-bg border border-card-border rounded-lg px-3 py-2 text-[#E2E8F0] focus:outline-none focus:border-primary transition-colors pr-8"
                      >
                        {SPEED_UNITS.map((u) => (
                          <option key={u.key} value={u.key}>{u.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                    </div>
                  </div>
                </div>

                {speedNum > 0 && (
                  <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                      {SPEED_UNITS.filter((u) => u.key !== speedUnit).map((u) => {
                        const converted = speedKmS / u.toKmS;
                        return (
                          <div key={u.key} className="bg-dark-bg rounded-xl p-4 border border-card-border">
                            <p className="text-xs text-muted mb-1">{u.label}</p>
                            <p className="font-heading font-bold text-lg text-emerald-400">{fmt(converted)}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                      <p className="text-sm text-muted flex items-start gap-2">
                        <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        {speedContext(speedKmS)}
                      </p>
                    </div>
                  </>
                )}
              </section>
            )}
          </div>

          {/* ------------------------------------------------------------ */}
          {/*  Sidebar: Quick References                                    */}
          {/* ------------------------------------------------------------ */}
          <aside className="mt-8 lg:mt-0">
            <div className="bg-card-bg border border-card-border rounded-2xl p-5 sticky top-6">
              <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Quick References
              </h2>
              <div className="space-y-3">
                {QUICK_REFS.map((ref) => (
                  <div
                    key={ref.label}
                    className="flex items-start gap-3 p-3 bg-dark-bg rounded-xl border border-card-border"
                  >
                    <ref.icon className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted">{ref.label}</p>
                      <p className="text-sm font-heading font-semibold">{ref.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fun facts */}
              <div className="mt-6 p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-primary/10">
                <h3 className="font-heading text-sm font-semibold mb-2 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                  Fun Fact
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  If you could travel at the speed of light, you&apos;d reach the Moon in
                  1.3 seconds, the Sun in 8.3 minutes, and the nearest star in 4.24 years.
                  The edge of the observable universe? 46.5 billion years.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
