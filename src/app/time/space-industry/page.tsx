"use client";

import { useState } from "react";
import {
  Rocket,
  Globe,
  Users,
  TrendingUp,
  Building2,
  Satellite,
  Shield,
  Plane,
  Landmark,
  ExternalLink,
  Briefcase,
  MapPin,
  Calendar,
  Search,
  DollarSign,
  Factory,
  UserCheck,
  ChevronRight,
} from "lucide-react";
import AdBanner from '@/components/time/AdBanner';

/* ------------------------------------------------------------------ */
/*  TYPES                                                             */
/* ------------------------------------------------------------------ */

type CompanyCategory =
  | "all"
  | "launch"
  | "defense"
  | "satellite"
  | "tourism"
  | "agency";

interface Company {
  name: string;
  emoji: string;
  location: string;
  founded: string;
  employees?: string;
  description: string;
  website?: string;
  careersUrl?: string;
  category: CompanyCategory;
}

interface JobLink {
  name: string;
  url: string;
  description: string;
  icon: "rocket" | "globe" | "briefcase" | "search" | "building" | "satellite" | "landmark";
}

interface Resource {
  name: string;
  url: string;
  description: string;
  tag: string;
}

/* ------------------------------------------------------------------ */
/*  DATA                                                              */
/* ------------------------------------------------------------------ */

const CATEGORIES: { key: CompanyCategory; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "All Companies", icon: <Globe className="w-4 h-4" /> },
  { key: "launch", label: "Launch Providers", icon: <Rocket className="w-4 h-4" /> },
  { key: "defense", label: "Defense & Aerospace", icon: <Shield className="w-4 h-4" /> },
  { key: "satellite", label: "Satellite & Earth Observation", icon: <Satellite className="w-4 h-4" /> },
  { key: "tourism", label: "Space Tourism", icon: <Plane className="w-4 h-4" /> },
  { key: "agency", label: "Agencies", icon: <Landmark className="w-4 h-4" /> },
];

const COMPANIES: Company[] = [
  // Launch Providers
  {
    name: "SpaceX",
    emoji: "🚀",
    location: "Hawthorne, CA",
    founded: "2002",
    employees: "~13,000",
    description: "Falcon 9, Starship. Pioneered reusable rocket technology, dramatically lowering launch costs.",
    website: "https://www.spacex.com",
    careersUrl: "https://www.spacex.com/careers",
    category: "launch",
  },
  {
    name: "Blue Origin",
    emoji: "🔵",
    location: "Kent, WA",
    founded: "2000",
    employees: "~11,000",
    description: "New Shepard, New Glenn. Founded by Jeff Bezos to enable millions of people living and working in space.",
    website: "https://www.blueorigin.com",
    careersUrl: "https://www.blueorigin.com/careers",
    category: "launch",
  },
  {
    name: "Rocket Lab",
    emoji: "⚡",
    location: "Long Beach, CA",
    founded: "2006",
    employees: "~1,800",
    description: "Electron rocket. Small satellite launch specialist with high-cadence, dedicated launches.",
    website: "https://www.rocketlabusa.com",
    careersUrl: "https://www.rocketlabusa.com/careers",
    category: "launch",
  },
  {
    name: "Relativity Space",
    emoji: "🖨️",
    location: "Long Beach, CA",
    founded: "2015",
    description: "3D-printed rockets. Building Terran R, the next generation of entirely 3D-printed launch vehicles.",
    website: "https://www.relativityspace.com",
    careersUrl: "https://www.relativityspace.com/careers",
    category: "launch",
  },
  {
    name: "ULA (United Launch Alliance)",
    emoji: "🛰️",
    location: "Centennial, CO",
    founded: "2006",
    description: "Atlas V, Vulcan Centaur. Boeing + Lockheed Martin joint venture with 100% mission success record.",
    website: "https://www.ulalaunch.com",
    careersUrl: "https://www.ulalaunch.com/careers",
    category: "launch",
  },
  {
    name: "Virgin Galactic",
    emoji: "✨",
    location: "Tustin, CA",
    founded: "2004",
    description: "Space tourism pioneer offering sub-orbital flights for commercial passengers.",
    website: "https://www.virgingalactic.com",
    careersUrl: "https://www.virgingalactic.com/careers",
    category: "tourism",
  },

  // Defense & Aerospace
  {
    name: "Lockheed Martin",
    emoji: "🦅",
    location: "Bethesda, MD",
    founded: "1926",
    employees: "~116,000",
    description: "Orion spacecraft, GPS satellites, missile defense systems. World's largest defense contractor.",
    website: "https://www.lockheedmartin.com",
    careersUrl: "https://www.lockheedmartin.com/careers",
    category: "defense",
  },
  {
    name: "Northrop Grumman",
    emoji: "🔭",
    location: "Falls Church, VA",
    founded: "1939",
    employees: "~95,000",
    description: "Built James Webb Space Telescope mirrors, Cygnus cargo spacecraft for ISS resupply.",
    website: "https://www.northropgrumman.com",
    careersUrl: "https://www.northropgrumman.com/careers",
    category: "defense",
  },
  {
    name: "Boeing Defense",
    emoji: "✈️",
    location: "Arlington, VA",
    founded: "1916",
    description: "Starliner crew capsule, Space Launch System (SLS) core stage for Artemis missions.",
    website: "https://www.boeing.com",
    careersUrl: "https://www.boeing.com/careers",
    category: "defense",
  },
  {
    name: "L3Harris Technologies",
    emoji: "📡",
    location: "Melbourne, FL",
    founded: "2019",
    description: "Advanced satellites, sensors, and space-based communication systems for defense and civil markets.",
    website: "https://www.l3harris.com",
    careersUrl: "https://www.l3harris.com/careers",
    category: "defense",
  },
  {
    name: "Raytheon / RTX",
    emoji: "🎯",
    location: "Arlington, VA",
    founded: "2020",
    description: "Space sensors, missile defense, satellite communications. Formed from Raytheon + UTC merger.",
    website: "https://www.rtx.com",
    careersUrl: "https://www.rtx.com/careers",
    category: "defense",
  },

  // Satellite & Earth Observation
  {
    name: "Planet Labs",
    emoji: "🌍",
    location: "San Francisco, CA",
    founded: "2010",
    employees: "~800",
    description: "Operates 200+ satellites capturing daily imagery of Earth's entire landmass.",
    website: "https://www.planet.com",
    careersUrl: "https://www.planet.com/careers",
    category: "satellite",
  },
  {
    name: "Maxar Technologies",
    emoji: "📸",
    location: "Westminster, CO",
    founded: "2017",
    employees: "~4,400",
    description: "High-resolution Earth imagery and geospatial data for defense, intelligence, and commercial use.",
    website: "https://www.maxar.com",
    careersUrl: "https://www.maxar.com/careers",
    category: "satellite",
  },
  {
    name: "Spire Global",
    emoji: "🌊",
    location: "Vienna, VA",
    founded: "2012",
    description: "Nanosatellite constellation for weather forecasting, maritime tracking, and aviation data.",
    website: "https://www.spire.com",
    careersUrl: "https://www.spire.com/careers",
    category: "satellite",
  },

  // Space Agencies
  {
    name: "NASA",
    emoji: "🇺🇸",
    location: "Washington, DC",
    founded: "1958",
    employees: "18,000+",
    description: "America's space agency. Artemis, Mars rovers, Hubble, JWST, and International Space Station.",
    website: "https://www.nasa.gov",
    careersUrl: "https://www.nasa.gov/careers",
    category: "agency",
  },
  {
    name: "ESA (European Space Agency)",
    emoji: "🇪🇺",
    location: "Paris, France",
    founded: "1975",
    employees: "~2,200",
    description: "Europe's gateway to space. Ariane rockets, Rosetta comet mission, Copernicus Earth observation.",
    website: "https://www.esa.int",
    careersUrl: "https://www.esa.int/About_Us/Careers_at_ESA",
    category: "agency",
  },
  {
    name: "ISRO (Indian Space Research Organisation)",
    emoji: "🇮🇳",
    location: "Bengaluru, India",
    founded: "1969",
    employees: "~17,000",
    description: "Chandrayaan lunar missions, Mangalyaan Mars orbiter. Known for cost-effective space programs.",
    website: "https://www.isro.gov.in",
    careersUrl: "https://www.isro.gov.in/career-opportunities",
    category: "agency",
  },
  {
    name: "JAXA (Japan Aerospace Exploration Agency)",
    emoji: "🇯🇵",
    location: "Tokyo, Japan",
    founded: "2003",
    description: "Hayabusa asteroid sample return, H-IIA rockets, International Space Station partner.",
    website: "https://global.jaxa.jp",
    careersUrl: "https://global.jaxa.jp/about/employ",
    category: "agency",
  },
  {
    name: "CNSA (China National Space Administration)",
    emoji: "🇨🇳",
    location: "Beijing, China",
    founded: "1993",
    description: "Tiangong space station, Chang'e lunar program, Zhurong Mars rover.",
    category: "agency",
  },
  {
    name: "Roscosmos",
    emoji: "🇷🇺",
    location: "Moscow, Russia",
    founded: "1992",
    description: "Soyuz launch vehicles, ISS partner, decades of human spaceflight heritage.",
    category: "agency",
  },
  {
    name: "CSA (Canadian Space Agency)",
    emoji: "🇨🇦",
    location: "Saint-Hubert, QC, Canada",
    founded: "1989",
    description: "Canadarm robotic arms on Shuttle and ISS, Radarsat Earth observation satellites.",
    website: "https://www.asc-csa.gc.ca",
    careersUrl: "https://www.asc-csa.gc.ca/eng/careers",
    category: "agency",
  },
];

const JOB_LINKS: JobLink[] = [
  {
    name: "NASA Careers",
    url: "https://www.nasa.gov/careers/",
    description: "Official NASA job openings and internship programs",
    icon: "rocket",
  },
  {
    name: "SpaceX Careers",
    url: "https://www.spacex.com/careers/",
    description: "Join the team building Falcon 9 and Starship",
    icon: "rocket",
  },
  {
    name: "Blue Origin Careers",
    url: "https://www.blueorigin.com/careers",
    description: "Build the road to space with Blue Origin",
    icon: "building",
  },
  {
    name: "ESA Careers",
    url: "https://www.esa.int/About_Us/Careers_at_ESA",
    description: "Work with Europe's space agency on cutting-edge missions",
    icon: "landmark",
  },
  {
    name: "ISRO Career Opportunities",
    url: "https://www.isro.gov.in/career-opportunities",
    description: "Join India's space program and lunar/Mars missions",
    icon: "satellite",
  },
  {
    name: "Indeed — Aerospace & Space Jobs",
    url: "https://www.indeed.com/jobs?q=aerospace+space",
    description: "Browse thousands of aerospace and space industry listings",
    icon: "search",
  },
  {
    name: "LinkedIn — Space & Aerospace Jobs",
    url: "https://www.linkedin.com/jobs/search/?keywords=aerospace%20space",
    description: "Find aerospace roles and connect with industry professionals",
    icon: "briefcase",
  },
];

const RESOURCES: Resource[] = [
  { name: "NASA.gov", url: "https://www.nasa.gov", description: "Space news, missions, and open data", tag: "Agency" },
  { name: "SpaceNews.com", url: "https://www.spacenews.com", description: "Industry news and analysis", tag: "News" },
  { name: "Space.com", url: "https://www.space.com", description: "Consumer space news and features", tag: "News" },
  { name: "Spaceflight Now", url: "https://www.spaceflightnow.com", description: "Launch updates and mission coverage", tag: "News" },
  { name: "Everyday Astronaut", url: "https://www.everydayastronaut.com", description: "YouTube educational content on rockets and space", tag: "Education" },
  { name: "Ars Technica Space", url: "https://www.arstechnica.com/space", description: "Tech-focused space coverage and analysis", tag: "News" },
  { name: "The Planetary Society", url: "https://www.planetary.org", description: "Space exploration advocacy and citizen science", tag: "Advocacy" },
  { name: "SpaceWeather.com", url: "https://www.spaceweather.com", description: "Solar activity, aurora forecasts, and near-Earth objects", tag: "Data" },
  { name: "Heavens-Above.com", url: "https://www.heavens-above.com", description: "Satellite passes, ISS tracking, and sky charts", tag: "Tracking" },
  { name: "N2YO.com", url: "https://www.n2yo.com", description: "Real-time satellite tracking and 3D visualization", tag: "Tracking" },
];

/* ------------------------------------------------------------------ */
/*  HELPER                                                            */
/* ------------------------------------------------------------------ */

function jobIcon(icon: JobLink["icon"]) {
  const cls = "w-6 h-6";
  switch (icon) {
    case "rocket": return <Rocket className={cls} />;
    case "globe": return <Globe className={cls} />;
    case "briefcase": return <Briefcase className={cls} />;
    case "search": return <Search className={cls} />;
    case "building": return <Building2 className={cls} />;
    case "satellite": return <Satellite className={cls} />;
    case "landmark": return <Landmark className={cls} />;
  }
}

function tagColor(tag: string) {
  switch (tag) {
    case "News": return "bg-blue-500/20 text-blue-400";
    case "Agency": return "bg-indigo-500/20 text-indigo-400";
    case "Education": return "bg-green-500/20 text-green-400";
    case "Advocacy": return "bg-purple-500/20 text-purple-400";
    case "Data": return "bg-amber-500/20 text-amber-400";
    case "Tracking": return "bg-cyan-500/20 text-cyan-400";
    default: return "bg-slate-500/20 text-slate-400";
  }
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                         */
/* ------------------------------------------------------------------ */

export default function SpaceIndustryPage() {
  const [activeCategory, setActiveCategory] = useState<CompanyCategory>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = COMPANIES.filter((c) => {
    const matchCategory = activeCategory === "all" || c.category === activeCategory;
    const matchSearch =
      searchTerm === "" ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div
      className="min-h-screen"
      style={{ background: "#030712", fontFamily: "Inter, sans-serif" }}
    >
      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-10 sm:pt-12 pb-8">
        {/* background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
            style={{ background: "radial-gradient(circle, #4F46E5 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
            style={{ background: "radial-gradient(circle, #06B6D4 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6" style={{ borderColor: "#1E293B", background: "#0F172A" }}>
            <Rocket className="w-4 h-4" style={{ color: "#06B6D4" }} />
            <span className="text-sm font-medium" style={{ color: "#94A3B8" }}>
              Explore the Space Economy
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "Outfit, sans-serif", color: "#E2E8F0" }}
          >
            Space Industry{" "}
            <span style={{ color: "#4F46E5" }}>&amp;</span>{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #4F46E5, #06B6D4)" }}
            >
              Careers
            </span>
          </h1>
          <p
            className="max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed"
            style={{ color: "#94A3B8" }}
          >
            Your directory of space companies, agencies, career opportunities, and
            industry resources. From launch providers to satellite operators &mdash;
            find your place in the final frontier.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  INDUSTRY STATS                                              */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <DollarSign className="w-6 h-6" />, value: "$546B", label: "Global Space Economy (2024)", accent: "#4F46E5" },
            { icon: <Factory className="w-6 h-6" />, value: "10,000+", label: "Space Companies Worldwide", accent: "#06B6D4" },
            { icon: <UserCheck className="w-6 h-6" />, value: "1M+", label: "Jobs in the Space Sector", accent: "#4F46E5" },
            { icon: <TrendingUp className="w-6 h-6" />, value: "$1T", label: "Projected by 2040", accent: "#06B6D4" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-6 text-center border transition-colors hover:border-opacity-60"
              style={{ background: "#0F172A", borderColor: "#1E293B" }}
            >
              <div className="flex justify-center mb-3">
                <div className="p-2 rounded-lg" style={{ background: `${stat.accent}20`, color: stat.accent }}>
                  {stat.icon}
                </div>
              </div>
              <p
                className="text-2xl sm:text-3xl font-bold mb-1"
                style={{ fontFamily: "Outfit, sans-serif", color: "#E2E8F0" }}
              >
                {stat.value}
              </p>
              <p className="text-sm" style={{ color: "#94A3B8" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  COMPANIES DIRECTORY                                         */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="text-center mb-10">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ fontFamily: "Outfit, sans-serif", color: "#E2E8F0" }}
          >
            Space Companies Directory
          </h2>
          <p style={{ color: "#94A3B8" }}>
            Browse top companies and agencies shaping the space industry
          </p>
        </div>

        {/* Search + Filters */}
        <div className="mb-8 space-y-4">
          {/* search bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#94A3B8" }} />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 text-sm"
              style={{
                background: "#0F172A",
                borderColor: "#1E293B",
                color: "#E2E8F0",
                // @ts-expect-error -- CSS custom property for ring color
                "--tw-ring-color": "#4F46E5",
              }}
            />
          </div>

          {/* category pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  background: activeCategory === cat.key ? "#4F46E5" : "#0F172A",
                  color: activeCategory === cat.key ? "#fff" : "#94A3B8",
                  border: `1px solid ${activeCategory === cat.key ? "#4F46E5" : "#1E293B"}`,
                }}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Company grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((company) => (
            <div
              key={company.name}
              className="rounded-xl border p-5 flex flex-col transition-all hover:border-[#4F46E5]/40"
              style={{ background: "#0F172A", borderColor: "#1E293B" }}
            >
              {/* header */}
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{company.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-semibold text-lg truncate"
                    style={{ fontFamily: "Outfit, sans-serif", color: "#E2E8F0" }}
                  >
                    {company.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs" style={{ color: "#94A3B8" }}>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {company.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Est. {company.founded}
                    </span>
                    {company.employees && (
                      <span className="inline-flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {company.employees}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* description */}
              <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: "#94A3B8" }}>
                {company.description}
              </p>

              {/* links */}
              <div className="flex items-center gap-3 mt-auto">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md border transition-colors hover:bg-[#1E293B]"
                    style={{ color: "#06B6D4", borderColor: "#1E293B" }}
                  >
                    <Globe className="w-3 h-3" />
                    Website
                  </a>
                )}
                {company.careersUrl && (
                  <a
                    href={company.careersUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
                    style={{ background: "#4F46E520", color: "#4F46E5", border: "1px solid #4F46E540" }}
                  >
                    <Briefcase className="w-3 h-3" />
                    Careers
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-10 h-10 mx-auto mb-4" style={{ color: "#94A3B8" }} />
            <p style={{ color: "#94A3B8" }}>No companies match your search.</p>
          </div>
        )}
      </section>

      <AdBanner />

      {/* ============================================================ */}
      {/*  JOB LINKS                                                   */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="text-center mb-10">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ fontFamily: "Outfit, sans-serif", color: "#E2E8F0" }}
          >
            Find Space Careers
          </h2>
          <p style={{ color: "#94A3B8" }}>
            Direct links to career pages and job boards for the aerospace industry
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {JOB_LINKS.map((job) => (
            <a
              key={job.name}
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border p-5 flex items-start gap-4 transition-all hover:border-[#4F46E5]/40 hover:scale-[1.01]"
              style={{ background: "#0F172A", borderColor: "#1E293B" }}
            >
              <div
                className="shrink-0 p-3 rounded-lg"
                style={{ background: "#4F46E520", color: "#4F46E5" }}
              >
                {jobIcon(job.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="font-semibold mb-1 flex items-center gap-1.5"
                  style={{ fontFamily: "Outfit, sans-serif", color: "#E2E8F0" }}
                >
                  {job.name}
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#06B6D4" }} />
                </h3>
                <p className="text-sm" style={{ color: "#94A3B8" }}>
                  {job.description}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#4F46E5" }} />
            </a>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  RESOURCES                                                   */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="text-center mb-10">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ fontFamily: "Outfit, sans-serif", color: "#E2E8F0" }}
          >
            Related Websites &amp; Resources
          </h2>
          <p style={{ color: "#94A3B8" }}>
            Useful links for staying up-to-date with space news, data, and education
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RESOURCES.map((r) => (
            <a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border p-5 transition-all hover:border-[#06B6D4]/40 hover:scale-[1.01]"
              style={{ background: "#0F172A", borderColor: "#1E293B" }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3
                  className="font-semibold flex items-center gap-1.5"
                  style={{ fontFamily: "Outfit, sans-serif", color: "#E2E8F0" }}
                >
                  {r.name}
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#06B6D4" }} />
                </h3>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tagColor(r.tag)}`}>
                  {r.tag}
                </span>
              </div>
              <p className="text-sm" style={{ color: "#94A3B8" }}>
                {r.description}
              </p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
