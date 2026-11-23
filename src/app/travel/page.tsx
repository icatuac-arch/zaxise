import { ChevronRight, Globe, Star, Shield, Sparkles } from "lucide-react";
import Link from "next/link";
import NearYou from "@/components/travel/NearYou";
import SearchBox from "@/components/travel/SearchBox";
import SeasonalHero from "@/components/travel/SeasonalHero";
import { COUNTRIES } from "@/data/travel/destinations";

// Derive city counts from actual data to keep hub in sync with country pages
function getCityCount(slug: string): number {
  const country = COUNTRIES.find((c) => c.slug === slug);
  if (!country) return 0;
  return country.states.reduce((acc, s) => acc + s.cities.length, 0);
}

const featuredCountries = [
  { name: "Japan", slug: "japan", flag: "🇯🇵", tagline: "Where tradition meets tomorrow", cities: getCityCount("japan"), image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Fushimi_Inari-taisha_in_Kyoto-1.jpg/1280px-Fushimi_Inari-taisha_in_Kyoto-1.jpg" },
  { name: "Italy", slug: "italy", flag: "🇮🇹", tagline: "Art, history & la dolce vita", cities: getCityCount("italy"), image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Colosseum_in_Rome-April_2007-1-_copie_2B.jpg/1280px-Colosseum_in_Rome-April_2007-1-_copie_2B.jpg" },
  { name: "France", slug: "france", flag: "🇫🇷", tagline: "Romance, culture & cuisine", cities: getCityCount("france"), image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg/800px-Tour_Eiffel_Wikimedia_Commons.jpg" },
  { name: "Thailand", slug: "thailand", flag: "🇹🇭", tagline: "The land of smiles", cities: getCityCount("thailand"), image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Wat_Arun%2C_Bangkok%2C_view_from_Chao_Phraya_river.jpg/1280px-Wat_Arun%2C_Bangkok%2C_view_from_Chao_Phraya_river.jpg" },
  { name: "USA", slug: "united-states", flag: "🇺🇸", tagline: "Coast to coast adventures", cities: getCityCount("united-states"), image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/New_york_times_square-terabass.jpg/1280px-New_york_times_square-terabass.jpg" },
  { name: "India", slug: "india", flag: "🇮🇳", tagline: "A kaleidoscope of experiences", cities: getCityCount("india"), image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Taj_Mahal%2C_Agra%2C_India_edit3.jpg/1280px-Taj_Mahal%2C_Agra%2C_India_edit3.jpg" },
];

const toolsAndFeatures = [
  { emoji: "🧠", title: "Travel Personality Quiz", desc: "Discover your travel style & get matched destinations", href: "/travel/travel-personality", gradient: "from-purple-500 to-violet-600" },
  { emoji: "⚖️", title: "Compare Destinations", desc: "Side-by-side on cost, weather, safety & vibe", href: "/travel/compare", gradient: "from-blue-500 to-cyan-600" },
  { emoji: "💎", title: "Hidden Gems", desc: "Off-the-beaten-path spots most tourists miss", href: "/travel/hidden-gems", gradient: "from-emerald-500 to-teal-600" },
  { emoji: "🗺️", title: "Interactive Maps", desc: "Visual exploration of every destination", href: "/travel/maps", gradient: "from-sky-500 to-blue-600" },
  { emoji: "💰", title: "Budget Calculator", desc: "Estimate costs for any trip in seconds", href: "/travel/travel-cost", gradient: "from-amber-500 to-orange-600" },
  { emoji: "✅", title: "Trip Preparation", desc: "Checklists, docs & pre-departure essentials", href: "/travel/trip-prep", gradient: "from-rose-500 to-pink-600" },
];

const guides = [
  { emoji: "🍕", label: "Food", href: "/travel/food-guide" },
  { emoji: "🌦️", label: "Weather", href: "/travel/weather-guide" },
  { emoji: "🛡️", label: "Safety", href: "/travel/safety" },
  { emoji: "📄", label: "Visa", href: "/travel/visa-guide" },
  { emoji: "🙏", label: "Etiquette", href: "/travel/etiquette-guide" },
  { emoji: "🗣️", label: "Language", href: "/travel/language-guide" },
  { emoji: "🛍️", label: "Shopping", href: "/travel/shopping-guide" },
  { emoji: "📸", label: "Photography", href: "/travel/photography-guide" },
  { emoji: "👪", label: "Family", href: "/travel/family-guide" },
  { emoji: "⛰️", label: "Adventure", href: "/travel/adventure-guide" },
  { emoji: "🎉", label: "Festivals", href: "/travel/festivals" },
  { emoji: "🌱", label: "Responsible Travel", href: "/travel/responsible-travel" },
];

export default function Home() {
  return (
    <>
      {/* 1. Seasonal Hero */}
      <SeasonalHero />

      {/* 2. Near You — personalized recommendations */}
      <NearYou />

      {/* 3. Featured Destinations */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark text-center mb-2">
            Explore {COUNTRIES.length} Countries
          </h2>
          <p className="text-dark/60 text-center mb-8 max-w-lg mx-auto">
            Curated guides, ranked attractions & local secrets for every destination.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredCountries.map((c) => (
              <Link
                key={c.slug}
                href={`/travel/country/${c.slug}`}
                className="group relative h-72 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image}
                  alt={c.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="relative h-full flex flex-col justify-end p-5">
                  <span className="text-3xl mb-1">{c.flag}</span>
                  <h3 className="font-heading text-xl font-bold text-white">{c.name}</h3>
                  <p className="text-sm text-white/80 mb-1">{c.tagline}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/60">{c.cities} cities</span>
                    <span className="flex items-center text-amber-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <ChevronRight className="w-4 h-4 ml-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link href="/travel/destinations" className="inline-flex items-center gap-1 text-sky-600 font-semibold hover:text-sky-700 transition-colors">
              View all {COUNTRIES.length} countries <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Tools & Features — unified section (was 2 separate sections) */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark text-center">
              Plan Like a Pro
            </h2>
          </div>
          <p className="text-dark/60 text-center mb-8 max-w-lg mx-auto">
            Unique tools to plan, compare & discover your perfect trip.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {toolsAndFeatures.map((f) => (
              <Link
                key={f.title}
                href={f.href}
                className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
              >
                <div className={`bg-gradient-to-br ${f.gradient} p-5 h-full min-h-[140px] flex flex-col justify-between`}>
                  <span className="text-3xl">{f.emoji}</span>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white mb-1">{f.title}</h3>
                    <p className="text-sm text-white/80 leading-snug">{f.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Travel Guides — quick-nav pills */}
      <section className="bg-gradient-to-b from-amber-50/40 to-white py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark text-center mb-6">
            Travel Guides
          </h2>

          <div className="flex flex-wrap justify-center gap-2.5">
            {guides.map((g) => (
              <Link
                key={g.label}
                href={g.href}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-medium text-dark/80 shadow-sm hover:shadow-md hover:border-amber-300 hover:bg-amber-50 transition-all duration-200"
              >
                <span>{g.emoji}</span> {g.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. What Travelers Love — social proof */}
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark text-center mb-6">
            What Travelers Love
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: Globe, stat: "500+ cities covered", desc: "From world capitals to hidden villages", color: "from-sky-400 to-blue-500" },
              { icon: Star, stat: "5,000+ attractions ranked", desc: "Curated & reviewed by real travelers", color: "from-amber-400 to-orange-500" },
              { icon: Shield, stat: "Free forever, no ads", desc: "Pure travel inspiration, always", color: "from-emerald-400 to-teal-500" },
            ].map((item) => (
              <div key={item.stat} className="text-center p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-100 shadow-sm">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-heading font-bold text-dark text-lg">{item.stat}</p>
                <p className="text-sm text-dark/55 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Footer CTA */}
      <section className="pb-12 pt-2">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 p-8 sm:p-10 text-center shadow-xl">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">
              Start planning your next adventure
            </h2>
            <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
              Search any country, city, or attraction to begin.
            </p>

            <div className="max-w-xl mx-auto mb-5">
              <SearchBox
                placeholder="Where do you want to go?"
                showButton={true}
                inputClassName="py-3.5 pl-12 pr-28 shadow-lg focus:ring-amber-400/50"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-white/50">Popular:</span>
              {[
                { name: "Japan", slug: "japan" },
                { name: "Italy", slug: "italy" },
                { name: "France", slug: "france" },
                { name: "Thailand", slug: "thailand" },
                { name: "USA", slug: "united-states" },
              ].map((c) => (
                <Link
                  key={c.slug}
                  href={`/travel/country/${c.slug}`}
                  className="px-3 py-1 rounded-full bg-white/15 text-white/80 hover:bg-white/25 hover:text-white transition-colors text-xs font-medium"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
