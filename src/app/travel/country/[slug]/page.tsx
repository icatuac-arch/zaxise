/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
// @ts-nocheck
// Types will come from @/data/travel/destinations
import { COUNTRIES } from '@/data/travel/destinations';
import { COUNTRY_IMAGES } from '@/data/travel/country-images';
import { getSeasonalAdvice, getFirstTimerTips } from '@/data/travel/smart-tips';
import { getAdvisory } from '@/data/travel/advisories';
import TravelAdvisoryBanner from '@/components/travel/TravelAdvisoryBanner';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin, Globe, Banknote, Languages, Calendar, Shield, Ticket,
  Clock, Star, ChevronRight, Thermometer, Droplets, Phone,
  AlertTriangle, Heart, Users, Eye, Utensils, Building, TreePine,
  Camera, Music, ShoppingBag, Landmark, Mountain, Waves,
} from 'lucide-react';

export async function generateStaticParams() {
  return COUNTRIES.map((country) => ({ slug: country.slug }));
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  temple: <Landmark className="w-4 h-4" />,
  shrine: <Landmark className="w-4 h-4" />,
  nature: <TreePine className="w-4 h-4" />,
  park: <TreePine className="w-4 h-4" />,
  museum: <Building className="w-4 h-4" />,
  food: <Utensils className="w-4 h-4" />,
  beach: <Waves className="w-4 h-4" />,
  mountain: <Mountain className="w-4 h-4" />,
  viewpoint: <Eye className="w-4 h-4" />,
  shopping: <ShoppingBag className="w-4 h-4" />,
  entertainment: <Music className="w-4 h-4" />,
  photography: <Camera className="w-4 h-4" />,
  historic: <Landmark className="w-4 h-4" />,
  cultural: <Heart className="w-4 h-4" />,
};

function getCategoryIcon(category: string) {
  const key = category.toLowerCase();
  for (const [k, icon] of Object.entries(CATEGORY_ICONS)) {
    if (key.includes(k)) return icon;
  }
  return <Star className="w-4 h-4" />;
}

function getAttractionImage(attraction: any): string | null {
  if (attraction.imageUrl) return attraction.imageUrl;
  return null;
}

function getCategoryBorderColor(category: string) {
  const key = (category || '').toLowerCase();
  if (key.includes('landmark') || key.includes('historic')) return 'border-l-blue-500';
  if (key.includes('nature') || key.includes('park')) return 'border-l-emerald-500';
  if (key.includes('temple') || key.includes('shrine')) return 'border-l-amber-500';
  if (key.includes('museum')) return 'border-l-purple-500';
  if (key.includes('beach')) return 'border-l-cyan-500';
  if (key.includes('food')) return 'border-l-red-500';
  if (key.includes('mountain')) return 'border-l-teal-500';
  if (key.includes('viewpoint') || key.includes('photography')) return 'border-l-sky-500';
  if (key.includes('cultural')) return 'border-l-indigo-500';
  if (key.includes('shopping') || key.includes('market')) return 'border-l-orange-500';
  if (key.includes('entertainment')) return 'border-l-pink-500';
  return 'border-l-slate-400';
}

function getRankGradient(rank: number) {
  if (rank === 1) return 'bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-600 shadow-amber-200/50';
  if (rank === 2) return 'bg-gradient-to-br from-slate-300 via-gray-300 to-slate-400 shadow-slate-200/50';
  if (rank === 3) return 'bg-gradient-to-br from-amber-600 via-orange-500 to-amber-700 shadow-orange-200/50';
  return 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 shadow-blue-200/50';
}

function getTagColor(tag: string) {
  const colors: Record<string, string> = {
    free: 'bg-green-100 text-green-700 border border-green-200',
    outdoor: 'bg-sky-100 text-sky-700 border border-sky-200',
    indoor: 'bg-violet-100 text-violet-700 border border-violet-200',
    'kid-friendly': 'bg-amber-100 text-amber-700 border border-amber-200',
    romantic: 'bg-pink-100 text-pink-700 border border-pink-200',
    historic: 'bg-orange-100 text-orange-700 border border-orange-200',
    cultural: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
    nature: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    adventure: 'bg-red-100 text-red-700 border border-red-200',
  };
  const key = tag.toLowerCase();
  for (const [k, v] of Object.entries(colors)) {
    if (key.includes(k)) return v;
  }
  return 'bg-slate-100 text-slate-700 border border-slate-200';
}

function getContinentColor(continent: string) {
  const c = (continent || '').toLowerCase();
  if (c.includes('asia')) return 'from-rose-500 via-pink-500 to-rose-600';
  if (c.includes('europe')) return 'from-blue-500 via-indigo-500 to-blue-700';
  if (c.includes('america')) return 'from-emerald-500 via-green-500 to-emerald-700';
  if (c.includes('africa')) return 'from-amber-500 via-orange-500 to-amber-700';
  if (c.includes('oceania') || c.includes('australia')) return 'from-teal-500 via-cyan-500 to-teal-700';
  return 'from-[#0EA5E9] via-[#0284C7] to-[#0369A1]';
}

function getWhyVisit(country: any) {
  const tagline = country.tagline || '';
  if (tagline) return tagline;
  return `Discover the beauty and culture of ${country.name}`;
}

export default async function CountryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const country = COUNTRIES.find((c) => c.slug === slug);
  if (!country) notFound();

  const advisory = getAdvisory(country.slug);

  // Gather all attractions across all cities, ranked by country rank
  const allAttractions: Array<{
    attraction: any;
    city: any;
    state: any;
    countryRank: number;
  }> = [];

  let totalRestaurants = 0;
  for (const state of country.states) {
    for (const city of state.cities) {
      totalRestaurants += city.restaurants?.length || 0;
      for (const attraction of city.attractions) {
        if (attraction.countryRank && attraction.countryRank <= 10) {
          allAttractions.push({
            attraction,
            city,
            state,
            countryRank: attraction.countryRank,
          });
        }
      }
    }
  }
  allAttractions.sort((a, b) => a.countryRank - b.countryRank);
  const top10 = allAttractions.slice(0, 10);

  const totalCities = country.states.reduce((acc, s) => acc + s.cities.length, 0);
  const totalAttractions = country.states.reduce(
    (acc, s) => acc + s.cities.reduce((a2, c) => a2 + (c.attractions?.length || 0), 0),
    0
  );

  // Capital city weather
  const capitalCity = country.states
    .flatMap((s) => s.cities)
    .find((c) => c.isCapital) || country.states[0]?.cities[0];

  const safetyColors: Record<string, string> = {
    high: 'text-green-600 bg-green-50',
    medium: 'text-amber-600 bg-amber-50',
    low: 'text-red-600 bg-red-50',
  };

  // Build JSON-LD TouristDestination structured data
  const top3Attractions = top10.slice(0, 3).map(({ attraction }) => ({
    "@type": "TouristAttraction",
    name: attraction.name,
    description: attraction.description || `A top attraction in ${country.name}`,
  }));

  const touristTypes: string[] = [];
  const categories = new Set(top10.map(({ attraction }) => (attraction.category || '').toLowerCase()));
  if (categories.has('temple') || categories.has('shrine') || categories.has('historic') || categories.has('cultural')) touristTypes.push('Cultural tourism');
  if (categories.has('food')) touristTypes.push('Food tourism');
  if (categories.has('nature') || categories.has('park') || categories.has('mountain') || categories.has('beach')) touristTypes.push('Nature tourism');
  if (categories.has('adventure')) touristTypes.push('Adventure tourism');
  if (categories.has('museum')) touristTypes.push('Heritage tourism');
  if (touristTypes.length === 0) touristTypes.push('Cultural tourism', 'Leisure tourism');

  const countryJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: country.name,
    description: `${country.tagline} Explore the top attractions, cities, and travel essentials for ${country.name} on Zaxise.`,
    touristType: touristTypes,
    includesAttraction: top3Attractions,
  };

  const continentBarColor = getContinentColor(country.continent);

  return (
    <main className="min-h-screen bg-[#FAFBFC]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(countryJsonLd) }}
      />
      {/* Travel Advisory Banner */}
      <TravelAdvisoryBanner advisory={advisory} countryName={country.name} />
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0EA5E9] via-[#0284C7] to-[#0369A1] text-white overflow-hidden">
        {/* Unsplash background image (if available) */}
        {COUNTRY_IMAGES[country.slug] ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url("${COUNTRY_IMAGES[country.slug]}")` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
          </>
        ) : (
          <>
            {/* Pattern overlay (fallback when no image) */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 50%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
          </>
        )}
        <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-28">
          <nav className="flex items-center gap-2 text-white/70 text-sm mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/travel/destinations" className="hover:text-white transition-colors">Destinations</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-medium">{country.name}</span>
          </nav>
          <div className="flex items-center gap-5 mb-3">
            <span className="text-7xl sm:text-8xl drop-shadow-lg">{country.flag}</span>
            <div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight drop-shadow-sm">
                {country.name}
              </h1>
              <p className="text-lg sm:text-xl text-white/80 mt-2 max-w-xl">{getWhyVisit(country)}</p>
            </div>
          </div>
          {/* Stat bar pills */}
          <div className="flex flex-wrap gap-3 mt-8">
            <span className="bg-gradient-to-r from-emerald-400/90 to-green-500/90 backdrop-blur-sm rounded-full px-5 py-2 text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald-500/20">
              <MapPin className="w-4 h-4" />
              {totalCities} Cities
            </span>
            <span className="bg-gradient-to-r from-amber-400/90 to-orange-500/90 backdrop-blur-sm rounded-full px-5 py-2 text-sm font-semibold flex items-center gap-2 shadow-lg shadow-amber-500/20">
              <Star className="w-4 h-4" />
              {totalAttractions} Attractions
            </span>
            <span className="bg-gradient-to-r from-pink-400/90 to-rose-500/90 backdrop-blur-sm rounded-full px-5 py-2 text-sm font-semibold flex items-center gap-2 shadow-lg shadow-pink-500/20">
              <Utensils className="w-4 h-4" />
              {totalRestaurants} Restaurants
            </span>
            <span className="bg-gradient-to-r from-violet-400/90 to-purple-500/90 backdrop-blur-sm rounded-full px-5 py-2 text-sm font-semibold flex items-center gap-2 shadow-lg shadow-violet-500/20">
              <Globe className="w-4 h-4" />
              {country.continent}
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Quick Facts */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-8">Quick Facts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: <Building className="w-5 h-5 text-[#0EA5E9]" />, label: 'Capital', value: country.capital },
              { icon: <Languages className="w-5 h-5 text-[#0EA5E9]" />, label: 'Language', value: country.language.join(', ') },
              { icon: <Banknote className="w-5 h-5 text-[#0EA5E9]" />, label: 'Currency', value: `${country.currency.name} (${country.currency.symbol})` },
              { icon: <Calendar className="w-5 h-5 text-[#0EA5E9]" />, label: 'Best Time', value: country.bestTimeToVisit },
              {
                icon: <Shield className="w-5 h-5 text-[#0EA5E9]" />,
                label: 'Safety',
                value: country.safetyRating,
                className: safetyColors[country.safetyRating?.toLowerCase()] || '',
              },
              { icon: <Ticket className="w-5 h-5 text-[#0EA5E9]" />, label: 'Visa', value: country.visaInfo?.[0]?.requirement || 'Check embassy' },
            ].map((fact, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
              >
                {fact.icon}
                <span className="text-xs text-slate-500 mt-2 uppercase tracking-wider">{fact.label}</span>
                <span className={`text-sm font-semibold mt-1 ${fact.className || 'text-[#0F172A]'}`}>
                  {fact.value || 'N/A'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Top 10 Attractions */}
        <section>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200/50">
              <Star className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#0F172A]">
              Top 10 Attractions in {country.name}
            </h2>
          </div>
          <p className="text-slate-500 mb-8 ml-[52px]">The must-visit places across the entire country</p>
          <div className="space-y-4">
            {top10.map(({ attraction, city, state, countryRank }) => (
              <div
                key={`${city.id}-${attraction.name}`}
                className={`bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-200 group`}
              >
                <div className="flex">
                  {getAttractionImage(attraction) ? (
                    <div className="w-32 sm:w-44 flex-shrink-0 relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={getAttractionImage(attraction)!} alt={attraction.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                      <div className={`absolute top-2 left-2 w-10 h-10 rounded-lg ${getRankGradient(countryRank)} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                        {countryRank === 1 ? '🥇' : countryRank === 2 ? '🥈' : countryRank === 3 ? '🥉' : `#${countryRank}`}
                      </div>
                    </div>
                  ) : (
                    <div className={`w-32 sm:w-44 flex-shrink-0 relative overflow-hidden bg-gradient-to-br ${getCategoryBorderColor(attraction.category || '').replace('border-l-', 'from-')}/20 to-slate-50 flex flex-col items-center justify-center`}>
                      <div className={`w-14 h-14 rounded-xl ${getRankGradient(countryRank)} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                        {countryRank === 1 ? '🥇' : countryRank === 2 ? '🥈' : countryRank === 3 ? '🥉' : `#${countryRank}`}
                      </div>
                      <span className="text-xs text-slate-400 mt-2 font-medium">{attraction.category}</span>
                    </div>
                  )}
                <div className="flex items-start gap-4 p-5 flex-1">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-serif text-xl font-bold text-[#0F172A] group-hover:text-[#0EA5E9] transition-colors">
                            {attraction.name}
                          </h3>
                          {attraction.countryRank && attraction.countryRank <= 10 && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 text-amber-800 rounded-full px-3 py-1 border-2 border-amber-300 shadow-sm shadow-amber-100">
                              🏆 Country Top 10
                            </span>
                          )}
                          {attraction.stateRank && attraction.stateRank <= 10 && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold bg-gradient-to-r from-blue-100 via-sky-100 to-blue-100 text-blue-800 rounded-full px-3 py-1 border-2 border-blue-300 shadow-sm shadow-blue-100">
                              ⭐ State Top 10
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            {getCategoryIcon(attraction.category || '')}
                            {attraction.category}
                          </span>
                          <span>·</span>
                          <Link
                            href={`/travel/country/${country.slug}/${state.id}/${city.id}`}
                            className="text-[#0EA5E9] hover:underline flex items-center gap-1"
                          >
                            <MapPin className="w-3 h-3" />
                            {city.name}
                          </Link>
                        </div>
                      </div>
                      {attraction.entryFee !== undefined && (
                        <span className="flex-shrink-0 text-sm font-medium bg-[#FAFBFC] border border-[#E2E8F0] rounded-lg px-3 py-1">
                          {attraction.entryFee === 0 || attraction.entryFee === 'Free'
                            ? '🆓 Free'
                            : `💰 ${attraction.entryFee}`}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 mt-2 text-sm leading-relaxed">{attraction.description}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {(attraction.visitDuration?.rush || attraction.durationRush) && (
                        <span className="text-xs bg-sky-50 text-sky-700 rounded-full px-3 py-1 flex items-center gap-1 border border-sky-200 font-medium">
                          <Clock className="w-3 h-3" /> Rush: {attraction.visitDuration?.rush || attraction.durationRush}
                        </span>
                      )}
                      {(attraction.visitDuration?.noRush || attraction.durationNoRush) && (
                        <span className="text-xs bg-emerald-50 text-emerald-700 rounded-full px-3 py-1 flex items-center gap-1 border border-emerald-200 font-medium">
                          <Clock className="w-3 h-3" /> No rush: {attraction.visitDuration?.noRush || attraction.durationNoRush}
                        </span>
                      )}
                      {attraction.tags?.map((tag: string) => (
                        <span key={tag} className={`text-xs rounded-full px-3 py-1 font-medium ${getTagColor(tag)}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              </div>
            ))}
          </div>
        </section>

        {/* States / Regions */}
        <section className="bg-gradient-to-b from-slate-50/80 to-transparent -mx-4 px-4 py-12 rounded-3xl">
          <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-2">
            States &amp; Regions
          </h2>
          <p className="text-slate-500 mb-8">Explore {country.name} by region</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {country.states.map((state) => {
              const attractionCount = state.cities.reduce(
                (acc, c) => acc + (c.attractions?.length || 0),
                0
              );
              // Find the top attraction in this state
              const topAttraction = state.cities
                .flatMap((c) => c.attractions || [])
                .sort((a, b) => (a.stateRank || 99) - (b.stateRank || 99))[0];
              return (
                <Link
                  key={state.id}
                  href={`/travel/country/${country.slug}/${state.id}`}
                  className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-xl hover:border-[#0EA5E9]/40 transition-all duration-200 group overflow-hidden"
                >
                  {/* Colored top bar */}
                  <div className={`h-1.5 bg-gradient-to-r ${continentBarColor}`} />
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-bold text-[#0F172A] group-hover:text-[#0EA5E9] transition-colors">
                      {state.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-[#0EA5E9]" />
                        {state.cities.length} {state.cities.length === 1 ? 'city' : 'cities'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-[#F59E0B]" />
                        {attractionCount} attractions
                      </span>
                    </div>
                    {topAttraction && (
                      <p className="mt-3 text-xs text-slate-400 truncate">
                        <span className="text-amber-500 font-medium">Top:</span> {topAttraction.name}
                      </p>
                    )}
                    <div className="mt-3 text-sm text-[#0EA5E9] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                      Explore <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Travel Essentials */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-8">Travel Essentials</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Visa Info */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-xl border border-green-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md shadow-green-200/50">
                  <Ticket className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-serif font-bold text-[#0F172A]">Visa Info</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {country.travelEssentials?.visa || country.visaSummary || 'Check with your local embassy for visa requirements.'}
              </p>
            </div>

            {/* Currency */}
            <div className="bg-gradient-to-br from-blue-50 to-sky-50/50 rounded-xl border border-blue-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-sky-500 flex items-center justify-center shadow-md shadow-blue-200/50">
                  <Banknote className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-serif font-bold text-[#0F172A]">Currency</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {`The local currency is ${country.currency.name} (${country.currency.code}, ${country.currency.symbol}).`}
              </p>
            </div>

            {/* Language */}
            <div className="bg-gradient-to-br from-violet-50 to-purple-50/50 rounded-xl border border-violet-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-md shadow-violet-200/50">
                  <Languages className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-serif font-bold text-[#0F172A]">Language</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {`The primary languages are ${country.language.join(', ')}.`}
              </p>
            </div>

            {/* Etiquette */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50/50 rounded-xl border border-pink-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-md shadow-pink-200/50">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-serif font-bold text-[#0F172A]">Etiquette</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {country.travelEssentials?.etiquette || 'Research local customs before your visit to ensure a respectful experience.'}
              </p>
            </div>

            {/* Emergency Numbers */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50/50 rounded-xl border border-red-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center shadow-md shadow-red-200/50">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-serif font-bold text-[#0F172A]">Emergency Numbers</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {country.travelEssentials?.emergencyNumbers || 'Save local emergency numbers before traveling.'}
              </p>
            </div>

            {/* Safety */}
            {(() => {
              const rating = (country.safetyRating || '').toLowerCase();
              const safetyGradient = rating === 'high'
                ? 'from-green-50 to-emerald-50/50 border-green-200'
                : rating === 'low'
                  ? 'from-red-50 to-orange-50/50 border-red-200'
                  : 'from-amber-50 to-yellow-50/50 border-amber-200';
              const safetyIconGradient = rating === 'high'
                ? 'from-green-400 to-emerald-500 shadow-green-200/50'
                : rating === 'low'
                  ? 'from-red-400 to-orange-500 shadow-red-200/50'
                  : 'from-amber-400 to-yellow-500 shadow-amber-200/50';
              return (
                <div className={`bg-gradient-to-br ${safetyGradient} rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${safetyIconGradient} flex items-center justify-center shadow-md`}>
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-serif font-bold text-[#0F172A]">Safety</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {country.travelEssentials?.safety || `Safety rating: ${country.safetyRating || 'N/A'}. Always stay aware of your surroundings.`}
                  </p>
                </div>
              );
            })()}
          </div>
        </section>

        {/* Smart Recommendations */}
        {(() => {
          const seasonalAdvice = getSeasonalAdvice(country.slug);
          const firstTimerTips = getFirstTimerTips(country.slug);
          if (!seasonalAdvice && firstTimerTips.length === 0) return null;
          return (
            <section className="bg-gradient-to-b from-slate-50/80 to-transparent -mx-4 px-4 py-12 rounded-3xl">
              <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-2">
                Smart Recommendations
              </h2>
              <p className="text-slate-500 mb-8">Insider tips for visiting {country.name}</p>

              <div className="space-y-6">
                {/* Best Time to Visit */}
                {seasonalAdvice && (
                  <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-[#0EA5E9]/5 to-transparent px-6 py-4 border-b border-[#E2E8F0]">
                      <h3 className="font-serif text-xl font-bold text-[#0F172A] flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sm">📅</span>
                        Best Time to Visit
                      </h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div className="rounded-xl bg-red-50 border border-red-100 p-4">
                          <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Peak Season</span>
                          <p className="text-sm font-bold text-red-800 mt-1">{seasonalAdvice.peakSeason.months}</p>
                          <p className="text-xs text-red-700 mt-1 leading-relaxed">{seasonalAdvice.peakSeason.why}</p>
                        </div>
                        <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
                          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Shoulder Season</span>
                          <p className="text-sm font-bold text-amber-800 mt-1">{seasonalAdvice.shoulderSeason.months}</p>
                          <p className="text-xs text-amber-700 mt-1 leading-relaxed">{seasonalAdvice.shoulderSeason.why}</p>
                          <p className="text-xs font-semibold text-amber-600 mt-2 bg-amber-100 rounded-full px-2.5 py-0.5 inline-block">{seasonalAdvice.shoulderSeason.savings}</p>
                        </div>
                        <div className="rounded-xl bg-sky-50 border border-sky-100 p-4">
                          <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">Off Season</span>
                          <p className="text-sm font-bold text-sky-800 mt-1">{seasonalAdvice.offSeason.months}</p>
                          <p className="text-xs text-sky-700 mt-1 leading-relaxed">{seasonalAdvice.offSeason.why}</p>
                          <p className="text-xs font-semibold text-sky-600 mt-2 bg-sky-100 rounded-full px-2.5 py-0.5 inline-block">{seasonalAdvice.offSeason.savings}</p>
                        </div>
                      </div>
                      {/* Pro Tip */}
                      <div className="relative rounded-xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-2 border-amber-300 p-6 shadow-[0_0_20px_rgba(251,191,36,0.15)]">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-200/30 to-transparent rounded-bl-full" />
                        <div className="flex items-start gap-4 relative">
                          <span className="text-4xl flex-shrink-0">💡</span>
                          <div>
                            <span className="text-base font-extrabold text-amber-800 uppercase tracking-wider">Pro Tip</span>
                            <p className="text-base text-amber-900 leading-relaxed mt-2 font-semibold">{seasonalAdvice.proTip}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* First-Timer Tips */}
                {firstTimerTips.length > 0 && (
                  <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-[#0EA5E9]/5 to-transparent px-6 py-4 border-b border-[#E2E8F0]">
                      <h3 className="font-serif text-xl font-bold text-[#0F172A] flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-sm">🎒</span>
                        First-Timer Tips for {country.name}
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {firstTimerTips.map((tip, i) => (
                          <div key={i} className="rounded-xl border border-[#E2E8F0] p-4 hover:shadow-sm transition-shadow">
                            <div className="flex items-start gap-3">
                              <span className="text-xl flex-shrink-0">{tip.icon}</span>
                              <div>
                                <h4 className="font-bold text-sm text-[#0F172A]">{tip.title}</h4>
                                <p className="text-xs text-slate-600 leading-relaxed mt-1">{tip.tip}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Link to full tips page */}
                <div className="text-center">
                  <Link
                    href="/travel/smart-tips"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#0EA5E9] hover:text-[#0284C7] transition-colors"
                  >
                    View all smart travel tips
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>
          );
        })()}

        {/* Weather Overview */}
        {capitalCity?.weather && (
          <section>
            <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-2">
              Weather Overview
            </h2>
            <p className="text-slate-500 mb-8">
              Monthly climate data for {capitalCity.name} (capital)
            </p>
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm overflow-x-auto">
              <div className="grid grid-cols-12 gap-2 min-w-[700px]">
                {capitalCity.weather.map((month: any, i: number) => {
                  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                  const maxTemp = Math.max(...capitalCity.weather.map((m: any) => m.tempHigh || m.highC || m.high || 0));
                  const barHeight = maxTemp > 0 ? ((month.tempHigh || month.highC || month.high || 0) / maxTemp) * 100 : 50;
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <span className="text-xs font-medium text-[#0F172A]">
                        {month.tempHigh ?? month.highC ?? month.high ?? '--'}°
                      </span>
                      <div className="w-full h-24 bg-slate-50 rounded-lg relative overflow-hidden">
                        <div
                          className="absolute bottom-0 w-full rounded-lg bg-gradient-to-t from-[#0EA5E9] to-[#38BDF8]"
                          style={{ height: `${Math.max(barHeight, 10)}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">
                        {month.tempLow ?? month.lowC ?? month.low ?? '--'}°
                      </span>
                      <div className="flex items-center gap-0.5 text-xs text-sky-500">
                        <Droplets className="w-3 h-3" />
                        {month.rainfall ?? month.rainfallMm ?? '--'}
                      </div>
                      <span className="text-xs font-medium text-slate-500">{months[i]}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-[#0EA5E9]" /> Temperature (°C)
                </span>
                <span className="flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-sky-500" /> Rainfall (mm)
                </span>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
