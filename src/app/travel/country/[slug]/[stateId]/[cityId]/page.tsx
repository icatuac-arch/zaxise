/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
// @ts-nocheck
// Types will come from @/data/travel/destinations
import { COUNTRIES } from '@/data/travel/destinations';
import { getSeasonalAdvice } from '@/data/travel/smart-tips';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin, Star, ChevronRight, Clock, Eye, Utensils, TreePine,
  Building, Landmark, Mountain, Waves, Camera, Music, ShoppingBag,
  Heart, Users, Trophy, Award, Thermometer, Droplets, Bus, Car,
  Train, Bike, Ship, Plane, Accessibility, Baby, Sun, Moon,
  Coffee, Sunset, Bed, Wallet, Hotel, Home, DollarSign, Shield,
  Ticket, Languages, AlertTriangle,
} from 'lucide-react';

export async function generateStaticParams() {
  const paths: Array<{ slug: string; stateId: string; cityId: string }> = [];
  for (const country of COUNTRIES) {
    for (const state of country.states) {
      for (const city of state.cities) {
        paths.push({ slug: country.slug, stateId: state.id, cityId: city.id });
      }
    }
  }
  return paths;
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

const CATEGORY_LARGE_ICONS: Record<string, React.ReactNode> = {
  temple: <Landmark className="w-10 h-10" />,
  shrine: <Landmark className="w-10 h-10" />,
  nature: <TreePine className="w-10 h-10" />,
  park: <TreePine className="w-10 h-10" />,
  museum: <Building className="w-10 h-10" />,
  food: <Utensils className="w-10 h-10" />,
  beach: <Waves className="w-10 h-10" />,
  mountain: <Mountain className="w-10 h-10" />,
  viewpoint: <Eye className="w-10 h-10" />,
  shopping: <ShoppingBag className="w-10 h-10" />,
  entertainment: <Music className="w-10 h-10" />,
  photography: <Camera className="w-10 h-10" />,
  historic: <Landmark className="w-10 h-10" />,
  cultural: <Heart className="w-10 h-10" />,
  landmark: <Landmark className="w-10 h-10" />,
  market: <ShoppingBag className="w-10 h-10" />,
};

const CATEGORY_GRADIENT: Record<string, string> = {
  landmark: 'from-blue-500 to-blue-700',
  museum: 'from-purple-500 to-purple-700',
  nature: 'from-green-500 to-green-700',
  temple: 'from-amber-500 to-amber-700',
  shrine: 'from-amber-500 to-amber-700',
  beach: 'from-cyan-400 to-cyan-600',
  market: 'from-orange-400 to-orange-600',
  shopping: 'from-orange-400 to-orange-600',
  park: 'from-emerald-500 to-emerald-700',
  historic: 'from-rose-500 to-rose-700',
  entertainment: 'from-pink-500 to-pink-700',
  viewpoint: 'from-sky-400 to-sky-600',
  mountain: 'from-teal-500 to-teal-700',
  food: 'from-red-400 to-red-600',
  cultural: 'from-indigo-500 to-indigo-700',
  photography: 'from-violet-400 to-violet-600',
};

function getUnsplashImage(attraction: any, _cityName: string): string | null {
  if (attraction.imageUrl) return attraction.imageUrl;
  return null;
}

function getCategoryGradient(category: string) {
  const key = category.toLowerCase();
  for (const [k, gradient] of Object.entries(CATEGORY_GRADIENT)) {
    if (key.includes(k)) return gradient;
  }
  return 'from-slate-500 to-slate-700';
}

function getLargeCategoryIcon(category: string) {
  const key = category.toLowerCase();
  for (const [k, icon] of Object.entries(CATEGORY_LARGE_ICONS)) {
    if (key.includes(k)) return icon;
  }
  return <Star className="w-10 h-10" />;
}

function getCategoryIcon(category: string) {
  const key = category.toLowerCase();
  for (const [k, icon] of Object.entries(CATEGORY_ICONS)) {
    if (key.includes(k)) return icon;
  }
  return <Star className="w-4 h-4" />;
}

function getTagColor(tag: string) {
  const colors: Record<string, string> = {
    free: 'bg-green-100 text-green-700 border border-green-200',
    outdoor: 'bg-sky-100 text-sky-700 border border-sky-200',
    indoor: 'bg-violet-100 text-violet-700 border border-violet-200',
    'kid-friendly': 'bg-amber-100 text-amber-700 border border-amber-200',
    'family': 'bg-amber-100 text-amber-700 border border-amber-200',
    romantic: 'bg-pink-100 text-pink-700 border border-pink-200',
    historic: 'bg-orange-100 text-orange-700 border border-orange-200',
    cultural: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
    nature: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    adventure: 'bg-red-100 text-red-700 border border-red-200',
    'must-see': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  };
  const key = tag.toLowerCase();
  for (const [k, v] of Object.entries(colors)) {
    if (key.includes(k)) return v;
  }
  return 'bg-slate-100 text-slate-700 border border-slate-200';
}

const TRANSPORT_ICONS: Record<string, React.ReactNode> = {
  bus: <Bus className="w-4 h-4" />,
  car: <Car className="w-4 h-4" />,
  train: <Train className="w-4 h-4" />,
  metro: <Train className="w-4 h-4" />,
  subway: <Train className="w-4 h-4" />,
  bicycle: <Bike className="w-4 h-4" />,
  bike: <Bike className="w-4 h-4" />,
  ferry: <Ship className="w-4 h-4" />,
  boat: <Ship className="w-4 h-4" />,
  flight: <Plane className="w-4 h-4" />,
  taxi: <Car className="w-4 h-4" />,
  rickshaw: <Car className="w-4 h-4" />,
  walk: <MapPin className="w-4 h-4" />,
};

function getTransportIcon(type: string) {
  const key = type.toLowerCase();
  for (const [k, icon] of Object.entries(TRANSPORT_ICONS)) {
    if (key.includes(k)) return icon;
  }
  return <Bus className="w-4 h-4" />;
}

const PRICE_TIER_CONFIG = {
  backpacker: { label: 'Backpacker', icon: <Home className="w-5 h-5" />, color: 'bg-green-50 border-green-200 text-green-700' },
  budget: { label: 'Budget', icon: <Wallet className="w-5 h-5" />, color: 'bg-sky-50 border-sky-200 text-sky-700' },
  'mid-range': { label: 'Mid-Range', icon: <Hotel className="w-5 h-5" />, color: 'bg-amber-50 border-amber-200 text-amber-700' },
  midRange: { label: 'Mid-Range', icon: <Hotel className="w-5 h-5" />, color: 'bg-amber-50 border-amber-200 text-amber-700' },
  luxury: { label: 'Luxury', icon: <Star className="w-5 h-5" />, color: 'bg-purple-50 border-purple-200 text-purple-700' },
};

function getAccessibilityLabel(rating: string | number | undefined) {
  if (!rating) return null;
  const r = typeof rating === 'string' ? rating.toLowerCase() : '';
  if (r === 'full' || rating === 5) return { label: 'Fully Accessible', color: 'text-green-600' };
  if (r === 'partial' || rating === 3 || rating === 4) return { label: 'Partially Accessible', color: 'text-amber-600' };
  return { label: 'Limited Access', color: 'text-red-600' };
}

function getCurrentMonth() {
  return new Date().getMonth();
}

function getContinentHeroGradient(continent: string) {
  const c = (continent || '').toLowerCase();
  if (c.includes('asia')) return 'from-rose-600 via-pink-600 to-rose-800';
  if (c.includes('europe')) return 'from-blue-600 via-indigo-600 to-blue-800';
  if (c.includes('america')) return 'from-emerald-600 via-green-600 to-emerald-800';
  if (c.includes('africa')) return 'from-amber-600 via-orange-600 to-amber-800';
  if (c.includes('oceania') || c.includes('australia')) return 'from-teal-600 via-cyan-600 to-teal-800';
  return 'from-[#0EA5E9] via-[#0284C7] to-[#0369A1]';
}

function getRankBadge(rank: number) {
  if (rank === 1) return { emoji: '🏆', gradient: 'bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-600', shadow: 'shadow-lg shadow-amber-300/50', size: 'w-16 h-16 text-xl' };
  if (rank === 2) return { emoji: '🥈', gradient: 'bg-gradient-to-br from-slate-300 via-gray-300 to-slate-400', shadow: 'shadow-lg shadow-slate-300/50', size: 'w-14 h-14 text-lg' };
  if (rank === 3) return { emoji: '🥉', gradient: 'bg-gradient-to-br from-amber-600 via-orange-500 to-amber-700', shadow: 'shadow-lg shadow-orange-300/50', size: 'w-14 h-14 text-lg' };
  return { emoji: `#${rank}`, gradient: 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600', shadow: 'shadow-lg shadow-blue-200/50', size: 'w-12 h-12 text-lg' };
}

function getDietaryEmoji(diet: string) {
  const key = diet.toLowerCase();
  if (key.includes('vegetarian')) return '🟢';
  if (key.includes('vegan')) return '🌱';
  if (key.includes('halal')) return '☪️';
  if (key.includes('kosher')) return '✡️';
  if (key.includes('gluten')) return '🌾';
  return '🍽️';
}

function getDietaryColor(diet: string) {
  const key = diet.toLowerCase();
  if (key.includes('vegetarian')) return 'bg-green-100 text-green-800 border-green-300';
  if (key.includes('vegan')) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  if (key.includes('halal')) return 'bg-teal-100 text-teal-800 border-teal-300';
  if (key.includes('kosher')) return 'bg-blue-100 text-blue-800 border-blue-300';
  if (key.includes('gluten')) return 'bg-amber-100 text-amber-800 border-amber-300';
  return 'bg-slate-100 text-slate-700 border-slate-300';
}

function getTemperatureBarColor(temp: number, maxTemp: number) {
  const ratio = maxTemp > 0 ? temp / maxTemp : 0.5;
  if (ratio > 0.85) return 'from-red-500 to-orange-400';
  if (ratio > 0.7) return 'from-orange-500 to-amber-400';
  if (ratio > 0.55) return 'from-amber-500 to-yellow-400';
  if (ratio > 0.4) return 'from-yellow-500 to-lime-400';
  if (ratio > 0.25) return 'from-lime-500 to-emerald-400';
  return 'from-sky-500 to-blue-400';
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ slug: string; stateId: string; cityId: string }>;
}) {
  'use cache';
  const { slug, stateId, cityId } = await params;
  const country = COUNTRIES.find((c) => c.slug === slug);
  if (!country) notFound();
  const state = country.states.find((s) => s.id === stateId);
  if (!state) notFound();
  const city = state.cities.find((c) => c.id === cityId);
  if (!city) notFound();

  const currentMonth = getCurrentMonth();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentWeather = city.weather?.[currentMonth];

  // Sort attractions by cityRank
  const sortedAttractions = [...(city.attractions || [])].sort(
    (a: any, b: any) => (a.cityRank || 99) - (b.cityRank || 99)
  );
  const top10Attractions = sortedAttractions.slice(0, 10);

  // Group accommodations by tier (normalize to lowercase for matching)
  const accommodations = city.accommodations || city.stays || [];
  const accommodationsByTier: Record<string, any[]> = {};
  for (const acc of accommodations as any[]) {
    const rawTier = acc.tier || acc.type || 'budget';
    const tier = rawTier.toLowerCase();
    if (!accommodationsByTier[tier]) accommodationsByTier[tier] = [];
    accommodationsByTier[tier].push(acc);
  }

  // Dietary badge colors (kept for backward compat but using new getDietaryColor)
  const dietaryColors: Record<string, string> = {
    vegetarian: 'bg-green-100 text-green-700',
    vegan: 'bg-emerald-100 text-emerald-700',
    halal: 'bg-teal-100 text-teal-700',
    kosher: 'bg-blue-100 text-blue-700',
    'gluten-free': 'bg-amber-100 text-amber-700',
  };

  const heroGradient = getContinentHeroGradient(country.continent);

  return (
    <main className="min-h-screen bg-[#FAFBFC]">
      {/* Hero */}
      <section className={`relative bg-gradient-to-br ${heroGradient} text-white overflow-hidden`}>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <nav className="flex items-center gap-2 text-white/70 text-sm mb-8 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/travel/destinations" className="hover:text-white transition-colors">Destinations</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/travel/country/${country.slug}`} className="hover:text-white transition-colors flex items-center gap-1">
              <span>{country.flag}</span> {country.name}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/travel/country/${country.slug}/${state.id}`} className="hover:text-white transition-colors">
              {state.name}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-medium">{city.name}</span>
          </nav>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-6xl sm:text-7xl drop-shadow-lg">{country.flag}</span>
                <div>
                  <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight drop-shadow-sm">
                    {city.name}
                  </h1>
                  <p className="text-lg text-white/80 mt-1">
                    {state.name}, {country.name}
                  </p>
                </div>
              </div>
            </div>
            {currentWeather && (
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-4 text-center border border-white/20 shadow-lg">
                <span className="text-xs text-white/70 uppercase tracking-wider font-semibold">{months[currentMonth]}</span>
                <div className="flex items-center gap-2 mt-1">
                  <Thermometer className="w-5 h-5" />
                  <span className="text-3xl font-bold">
                    {currentWeather.tempHigh ?? currentWeather.highC ?? currentWeather.high ?? '--'}°C
                  </span>
                </div>
                <span className="text-xs text-white/70">
                  Low: {currentWeather.tempLow ?? currentWeather.lowC ?? currentWeather.low ?? '--'}°C
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Top 10 Attractions */}
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200/50">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#0F172A]">
              Top 10 Attractions in {city.name}
            </h2>
          </div>
          <p className="text-slate-500 mb-6 ml-[52px]">Ranked by must-visit priority</p>

          {/* Top 3 — featured large cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
            {top10Attractions.slice(0, 3).map((attraction: any, idx: number) => {
              const rank = attraction.cityRank || idx + 1;
              const accessibility = getAccessibilityLabel(attraction.accessibilityRating || attraction.accessibility);
              const badge = getRankBadge(rank);
              return (
                <div
                  key={attraction.name}
                  className="bg-white rounded-2xl border border-[#E2E8F0] shadow-md hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden group col-span-1"
                >
                  {getUnsplashImage(attraction, city.name) ? (
                    <div className="relative w-full h-48 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={getUnsplashImage(attraction, city.name)!} alt={attraction.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className="absolute bottom-2 right-3 text-white/30 font-bold text-5xl font-serif select-none">#{rank}</span>
                    </div>
                  ) : (
                    <div className={`w-full h-48 bg-gradient-to-br ${getCategoryGradient(attraction.category || '')} flex items-center justify-between px-6 relative`}>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white/90">
                          {getLargeCategoryIcon(attraction.category || '')}
                        </div>
                        <div>
                          <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">{attraction.category || 'Attraction'}</p>
                          <p className="text-white text-sm font-medium mt-0.5 max-w-[200px] truncate">{attraction.name}</p>
                        </div>
                      </div>
                      <span className="text-white/15 font-bold text-7xl font-serif select-none absolute right-4 bottom-2">#{rank}</span>
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 ${badge.size} rounded-xl ${badge.gradient} ${badge.shadow} flex items-center justify-center text-white font-bold`}>
                        {badge.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-serif text-lg font-bold text-[#0F172A] group-hover:text-[#0EA5E9] transition-colors">
                            {attraction.name}
                          </h3>
                        </div>
                        {/* Cascade badges */}
                        <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                          {attraction.countryRank && attraction.countryRank <= 10 && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 text-amber-800 rounded-full px-3 py-1 border-2 border-amber-400 shadow-sm shadow-amber-200/50">
                              <Trophy className="w-3 h-3" /> Country Top 10
                            </span>
                          )}
                          {attraction.stateRank && attraction.stateRank <= 10 && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold bg-gradient-to-r from-blue-100 via-sky-50 to-blue-100 text-blue-800 rounded-full px-3 py-1 border-2 border-blue-400 shadow-sm shadow-blue-200/50">
                              <Award className="w-3 h-3" /> State Top 10
                            </span>
                          )}
                          {attraction.familyFriendly && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold bg-green-50 text-green-700 rounded-full px-3 py-1 border-2 border-green-300">
                              <Heart className="w-3 h-3 text-green-500" /> Family
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1.5 flex-wrap">
                          <span className="flex items-center gap-1">
                            {getCategoryIcon(attraction.category || '')}
                            {attraction.category}
                          </span>
                          {(attraction.bestTimeToVisit || attraction.bestTime) && (
                            <>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <Sun className="w-3 h-3" /> {attraction.bestTimeToVisit || attraction.bestTime}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600 mt-3 text-sm leading-relaxed line-clamp-3">{attraction.description}</p>
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
                      {attraction.entryFee !== undefined && (
                        <span className="text-xs font-medium bg-[#FAFBFC] border border-[#E2E8F0] rounded-full px-3 py-1">
                          {attraction.entryFee === 0 || attraction.entryFee === 'Free'
                            ? '🆓 Free'
                            : `💰 ${attraction.entryFee}`}
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
              );
            })}
          </div>

          {/* Ranks 4-10 — compact list */}
          <div className="space-y-3">
            {top10Attractions.slice(3).map((attraction: any, idx: number) => {
              const rank = attraction.cityRank || idx + 4;
              const accessibility = getAccessibilityLabel(attraction.accessibilityRating || attraction.accessibility);
              const badge = getRankBadge(rank);
              return (
                <div
                  key={attraction.name}
                  className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-lg hover:scale-[1.005] transition-all duration-200 overflow-hidden group"
                >
                  <div className="flex">
                    {getUnsplashImage(attraction, city.name) ? (
                      <div className="w-28 sm:w-36 flex-shrink-0 relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={getUnsplashImage(attraction, city.name)!} alt={attraction.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
                      </div>
                    ) : (
                      <div className={`w-1.5 bg-gradient-to-b ${getCategoryGradient(attraction.category || '')} flex-shrink-0`} />
                    )}
                    <div className="p-4 flex items-start gap-4 flex-1">
                      <div className={`flex-shrink-0 ${badge.size} rounded-xl ${badge.gradient} ${badge.shadow} flex items-center justify-center text-white font-bold`}>
                        {badge.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-serif text-lg font-bold text-[#0F172A] group-hover:text-[#0EA5E9] transition-colors">
                                {attraction.name}
                              </h3>
                              {attraction.countryRank && attraction.countryRank <= 10 && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 text-amber-800 rounded-full px-2.5 py-0.5 border-2 border-amber-400 shadow-sm">
                                  <Trophy className="w-3 h-3" /> Country Top 10
                                </span>
                              )}
                              {attraction.stateRank && attraction.stateRank <= 10 && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold bg-gradient-to-r from-blue-100 via-sky-50 to-blue-100 text-blue-800 rounded-full px-2.5 py-0.5 border-2 border-blue-400 shadow-sm">
                                  <Award className="w-3 h-3" /> State Top 10
                                </span>
                              )}
                              {attraction.familyFriendly && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold bg-green-50 text-green-700 rounded-full px-2.5 py-0.5 border-2 border-green-300">
                                  <Heart className="w-3 h-3 text-green-500" /> Family
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1 flex-wrap">
                              <span className="flex items-center gap-1">
                                {getCategoryIcon(attraction.category || '')}
                                {attraction.category}
                              </span>
                              {(attraction.bestTimeToVisit || attraction.bestTime) && (
                                <>
                                  <span>·</span>
                                  <span className="flex items-center gap-1">
                                    <Sun className="w-3 h-3" /> {attraction.bestTimeToVisit || attraction.bestTime}
                                  </span>
                                </>
                              )}
                              {accessibility && (
                                <>
                                  <span>·</span>
                                  <span className={`flex items-center gap-1 ${accessibility.color}`}>
                                    <Accessibility className="w-3 h-3" /> {accessibility.label}
                                  </span>
                                </>
                              )}
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
              );
            })}
          </div>
        </section>

        {/* Where to Eat */}
        {city.restaurants && city.restaurants.length > 0 && (
          <section className="bg-gradient-to-b from-orange-50/50 to-transparent -mx-4 px-4 py-10 rounded-3xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-200/50">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#0F172A]">Where to Eat</h2>
            </div>
            <p className="text-slate-500 mb-6 ml-[52px]">Top dining spots in {city.name}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {city.restaurants.map((restaurant: any, i: number) => (
                <div
                  key={restaurant.name || i}
                  className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#0F172A] group-hover:text-orange-600 transition-colors">{restaurant.name}</h3>
                      <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-2">
                        <Utensils className="w-3 h-3 text-[#F59E0B]" />
                        {restaurant.cuisine}
                      </p>
                    </div>
                    {restaurant.priceRange && (
                      <span className="flex-shrink-0 text-sm font-medium text-[#F59E0B] bg-amber-50 rounded-lg px-2.5 py-1 border border-amber-100">
                        {restaurant.priceRange}
                      </span>
                    )}
                  </div>
                  {restaurant.specialty && (
                    <p className="text-sm text-slate-600 mt-2">
                      <span className="font-medium">Specialty:</span> {restaurant.specialty}
                    </p>
                  )}
                  {(restaurant.vegetarianFriendly || restaurant.veganOptions || restaurant.halalCertified || (restaurant.dietaryOptions && restaurant.dietaryOptions.length > 0)) && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {restaurant.vegetarianFriendly && (
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1 border ${getDietaryColor('vegetarian')}`}>
                          <span className="text-sm">{getDietaryEmoji('vegetarian')}</span> Vegetarian
                        </span>
                      )}
                      {restaurant.veganOptions && (
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1 border ${getDietaryColor('vegan')}`}>
                          <span className="text-sm">{getDietaryEmoji('vegan')}</span> Vegan
                        </span>
                      )}
                      {restaurant.halalCertified && (
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1 border ${getDietaryColor('halal')}`}>
                          <span className="text-sm">{getDietaryEmoji('halal')}</span> Halal
                        </span>
                      )}
                      {restaurant.dietaryOptions?.map((diet: string) => (
                        <span key={diet} className={`inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1 border ${getDietaryColor(diet)}`}>
                          <span className="text-sm">{getDietaryEmoji(diet)}</span> {diet}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Where to Stay */}
        {Object.keys(accommodationsByTier).length > 0 && (
          <section>
            <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-2">Where to Stay</h2>
            <p className="text-slate-500 mb-6">Accommodation options for every budget</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {['backpacker', 'budget', 'mid-range', 'midRange', 'luxury'].map((tier) => {
                const items = accommodationsByTier[tier];
                if (!items || items.length === 0) return null;
                const config = PRICE_TIER_CONFIG[tier as keyof typeof PRICE_TIER_CONFIG] || {
                  label: tier,
                  icon: <Bed className="w-5 h-5" />,
                  color: 'bg-slate-50 border-slate-200 text-slate-700',
                };
                return (
                  <div
                    key={tier}
                    className={`rounded-xl border p-5 shadow-sm ${config.color}`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {config.icon}
                      <h3 className="font-serif font-bold text-lg">{config.label}</h3>
                    </div>
                    {items.map((acc: any, i: number) => (
                      <div key={acc.recommendation || acc.name || i} className="mb-3 last:mb-0">
                        <p className="text-sm font-medium">{acc.recommendation || acc.name || acc.area}</p>
                        {acc.area && (
                          <p className="text-xs opacity-70 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" /> {acc.area}
                          </p>
                        )}
                        {(acc.priceRange || acc.pricePerNight) && (
                          <p className="text-xs opacity-80 mt-0.5 flex items-center gap-1">
                            <DollarSign className="w-3 h-3" /> {acc.priceRange || acc.pricePerNight}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Getting Around */}
        {city.transport && city.transport.length > 0 && (
          <section className="bg-gradient-to-b from-slate-50/80 to-transparent -mx-4 px-4 py-10 rounded-3xl">
            <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-2">Getting Around</h2>
            <p className="text-slate-500 mb-6">Transport options in {city.name}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {city.transport.map((t: any, i: number) => (
                <div
                  key={t.type || i}
                  className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm hover:shadow-md transition-all flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-[#0EA5E9] flex-shrink-0">
                    {getTransportIcon(t.type || t.name || '')}
                  </div>
                  <div>
                    <h3 className="font-medium text-[#0F172A] text-sm">{t.type || t.name}</h3>
                    {t.cost && (
                      <p className="text-xs text-slate-500 mt-0.5">{t.cost}</p>
                    )}
                    {t.description && (
                      <p className="text-xs text-slate-500 mt-0.5">{t.description}</p>
                    )}
                    {t.tip && (
                      <p className="text-xs text-[#0EA5E9] mt-1">{t.tip}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Weather */}
        {city.weather && city.weather.length > 0 && (
          <section>
            <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-2">Weather</h2>
            <p className="text-slate-500 mb-6">Monthly climate overview for {city.name}</p>
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm overflow-x-auto">
              <div className="grid grid-cols-12 gap-2 min-w-[700px]">
                {city.weather.map((month: any, i: number) => {
                  const maxTemp = Math.max(...city.weather.map((m: any) => m.tempHigh || m.highC || m.high || 0));
                  const tempVal = month.tempHigh || month.highC || month.high || 0;
                  const barHeight = maxTemp > 0 ? (tempVal / maxTemp) * 100 : 50;
                  const isCurrentMonth = i === currentMonth;
                  const barGradient = getTemperatureBarColor(tempVal, maxTemp);
                  return (
                    <div
                      key={i}
                      className={`flex flex-col items-center gap-1 rounded-xl py-1.5 -my-1 transition-all ${isCurrentMonth ? 'bg-gradient-to-b from-amber-50 to-orange-50 ring-2 ring-amber-300 shadow-md' : 'hover:bg-slate-50'}`}
                    >
                      <span className={`text-xs font-bold ${isCurrentMonth ? 'text-amber-700' : 'text-[#0F172A]'}`}>
                        {month.tempHigh ?? month.highC ?? '--'}°
                      </span>
                      <div className="w-full h-24 bg-slate-50 rounded-lg relative overflow-hidden mx-1">
                        <div
                          className={`absolute bottom-0 w-full rounded-lg bg-gradient-to-t ${isCurrentMonth ? 'from-amber-500 to-orange-300' : barGradient}`}
                          style={{ height: `${Math.max(barHeight, 10)}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">
                        {month.tempLow ?? month.lowC ?? '--'}°
                      </span>
                      <div className="flex items-center gap-0.5 text-xs text-sky-500">
                        <Droplets className="w-3 h-3" />
                        {month.rainfall ?? month.rainfallMm ?? '--'}
                      </div>
                      <span className={`text-xs font-medium ${isCurrentMonth ? 'text-amber-600 font-bold' : 'text-slate-500'}`}>
                        {months[i]}
                      </span>
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
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> Current month
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Suggested Itineraries */}
        {city.itineraries && city.itineraries.length > 0 && (
          <section className="bg-gradient-to-b from-slate-50/80 to-transparent -mx-4 px-4 py-10 rounded-3xl">
            <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-2">Suggested Itineraries</h2>
            <p className="text-slate-500 mb-6">Make the most of your time in {city.name}</p>
            <div className="space-y-8">
              {city.itineraries.map((itinerary: any, itIdx: number) => (
                <div key={itinerary.title || itIdx} className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{itinerary.days || itinerary.dayPlans?.length || '?'}</span>
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-bold text-white">{itinerary.title || `${itinerary.days}-Day Itinerary`}</h3>
                        <p className="text-white/50 text-xs mt-0.5">{itinerary.days || itinerary.dayPlans?.length} days</p>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-xs text-white/50">
                      <span className="flex items-center gap-1"><Coffee className="w-3 h-3 text-amber-400" /> Morning</span>
                      <span className="flex items-center gap-1"><Sun className="w-3 h-3 text-sky-400" /> Afternoon</span>
                      <span className="flex items-center gap-1"><Moon className="w-3 h-3 text-indigo-400" /> Evening</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    {(itinerary.dayPlans || []).map((dayPlan: any, dayIdx: number) => (
                      <div key={dayPlan.day || dayIdx} className="space-y-3">
                        <h4 className="font-serif text-lg font-bold text-[#0F172A] flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] text-white flex items-center justify-center text-sm font-bold shadow">
                            {dayPlan.day || dayIdx + 1}
                          </span>
                          Day {dayPlan.day || dayIdx + 1}
                        </h4>
                        {dayPlan.morning && (
                          <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/30 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Coffee className="w-4 h-4 text-amber-600" />
                              <span className="font-bold text-amber-800 text-sm">Morning</span>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed">{dayPlan.morning}</p>
                          </div>
                        )}
                        {dayPlan.afternoon && (
                          <div className="rounded-xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-blue-50/30 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Sun className="w-4 h-4 text-sky-600" />
                              <span className="font-bold text-sky-800 text-sm">Afternoon</span>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed">{dayPlan.afternoon}</p>
                          </div>
                        )}
                        {dayPlan.evening && (
                          <div className="rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50/30 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Moon className="w-4 h-4 text-indigo-600" />
                              <span className="font-bold text-indigo-800 text-sm">Evening</span>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed">{dayPlan.evening}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Travel Tips */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-2">Travel Tips</h2>
          <p className="text-slate-500 mb-6">Essential info for visiting {city.name}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {country.etiquette && country.etiquette.length > 0 && (
              <div className="bg-gradient-to-br from-pink-50 to-rose-50/50 rounded-xl border border-pink-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-md shadow-pink-200/50">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-serif font-bold text-[#0F172A]">Local Etiquette</h3>
                </div>
                <ul className="text-sm text-slate-600 leading-relaxed space-y-1">
                  {country.etiquette.slice(0, 4).map((tip: string, i: number) => (
                    <li key={i} className="flex items-start gap-2"><span className="text-pink-400 mt-0.5">•</span> {tip}</li>
                  ))}
                </ul>
              </div>
            )}
            {country.safetyRating && (
              <div className={`bg-gradient-to-br ${country.safetyRating.toLowerCase() === 'high' ? 'from-green-50 to-emerald-50/50 border-green-200' : country.safetyRating.toLowerCase() === 'low' ? 'from-red-50 to-orange-50/50 border-red-200' : 'from-amber-50 to-yellow-50/50 border-amber-200'} rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${country.safetyRating.toLowerCase() === 'high' ? 'from-green-400 to-emerald-500 shadow-green-200/50' : country.safetyRating.toLowerCase() === 'low' ? 'from-red-400 to-orange-500 shadow-red-200/50' : 'from-amber-400 to-yellow-500 shadow-amber-200/50'} flex items-center justify-center shadow-md`}>
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-serif font-bold text-[#0F172A]">Safety</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Safety rating: <span className="font-semibold capitalize">{country.safetyRating}</span>. {country.safetyRating.toLowerCase() === 'high' ? 'Generally very safe for tourists.' : country.safetyRating.toLowerCase() === 'low' ? 'Exercise increased caution.' : 'Exercise normal precautions.'}
                </p>
              </div>
            )}
            {country.visaInfo && country.visaInfo.length > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-xl border border-green-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md shadow-green-200/50">
                    <Ticket className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-serif font-bold text-[#0F172A]">Visa Info</h3>
                </div>
                <ul className="text-sm text-slate-600 leading-relaxed space-y-1">
                  {country.visaInfo.slice(0, 3).map((v: any, i: number) => (
                    <li key={i}><span className="font-medium">{v.passport}:</span> {v.requirement} ({v.cost})</li>
                  ))}
                </ul>
              </div>
            )}
            {country.language && country.language.length > 0 && (
              <div className="bg-gradient-to-br from-violet-50 to-purple-50/50 rounded-xl border border-violet-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-md shadow-violet-200/50">
                    <Languages className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-serif font-bold text-[#0F172A]">Language</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{country.language.join(', ')}</p>
              </div>
            )}
            {country.emergencyNumbers && country.emergencyNumbers.length > 0 && (
              <div className="bg-gradient-to-br from-red-50 to-orange-50/50 rounded-xl border border-red-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center shadow-md shadow-red-200/50">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-serif font-bold text-[#0F172A]">Emergency Numbers</h3>
                </div>
                <ul className="text-sm text-slate-600 leading-relaxed space-y-1">
                  {country.emergencyNumbers.map((e: any, i: number) => (
                    <li key={i}><span className="font-medium">{e.service}:</span> {e.number}</li>
                  ))}
                </ul>
              </div>
            )}
            {country.currency && (
              <div className="bg-gradient-to-br from-blue-50 to-sky-50/50 rounded-xl border border-blue-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-sky-500 flex items-center justify-center shadow-md shadow-blue-200/50">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-serif font-bold text-[#0F172A]">Currency</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {country.currency.name} ({country.currency.symbol}) — {country.currency.code}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Pro Tips */}
        {(() => {
          const seasonalAdvice = getSeasonalAdvice(country.slug);
          if (!seasonalAdvice) return null;
          const avgBudget = (city as any).avgBudgetPerDay;
          return (
            <section className="bg-gradient-to-b from-amber-50/50 to-transparent -mx-4 px-4 py-10 rounded-3xl">
              <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-2">Pro Tips</h2>
              <p className="text-slate-500 mb-6">Smart travel advice for {city.name}</p>
              <div className="space-y-4">
                {/* Shoulder Season Advice */}
                <div className="relative bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-2xl border-2 border-amber-300 p-6 shadow-[0_0_20px_rgba(251,191,36,0.15)]">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-200/30 to-transparent rounded-bl-full" />
                  <div className="flex items-start gap-3 relative">
                    <span className="text-3xl flex-shrink-0 mt-0.5">💡</span>
                    <div>
                      <h3 className="font-bold text-amber-800 text-lg">Best Time to Visit</h3>
                      <p className="text-sm text-amber-900 leading-relaxed mt-1">
                        <strong>Shoulder season ({seasonalAdvice.shoulderSeason.months})</strong> — {seasonalAdvice.shoulderSeason.why}
                      </p>
                      <span className="text-xs font-semibold text-amber-600 mt-2 bg-amber-100 rounded-full px-3 py-1 inline-block">
                        {seasonalAdvice.shoulderSeason.savings}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 1-2 Weeks Early Rule */}
                <div className="bg-gradient-to-r from-sky-50 to-cyan-50 rounded-2xl border-2 border-sky-200 p-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0 mt-0.5">🎯</span>
                    <div>
                      <h3 className="font-bold text-sky-800 text-lg">The 1-2 Weeks Early Rule</h3>
                      <p className="text-sm text-sky-900 leading-relaxed mt-1">{seasonalAdvice.proTip}</p>
                      <p className="text-xs text-sky-700 mt-2 italic">
                        Arriving 1-2 weeks before peak season gives you 80% of the experience at 60% of the cost.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Budget Tips */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0 mt-0.5">💰</span>
                    <div>
                      <h3 className="font-bold text-[#0F172A] text-lg">Budget Tips for {city.name}</h3>
                      {avgBudget && (
                        <p className="text-sm text-slate-600 mt-1">
                          Average daily budget: <strong className="text-[#0EA5E9]">{typeof avgBudget === 'object' ? `${avgBudget.budget || avgBudget.min || '--'} - ${avgBudget.luxury || avgBudget.max || '--'}` : avgBudget}</strong>
                        </p>
                      )}
                      <ul className="mt-3 space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                          <span className="text-[#F59E0B] mt-0.5 flex-shrink-0">&#8226;</span>
                          Have your main meal at lunch — restaurants offer set menus at 30-50% less than dinner prices
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#F59E0B] mt-0.5 flex-shrink-0">&#8226;</span>
                          Use local public transport instead of taxis — day passes often pay for themselves after 3 rides
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#F59E0B] mt-0.5 flex-shrink-0">&#8226;</span>
                          Book accommodation one or two transit stops from the center for significantly lower prices
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#F59E0B] mt-0.5 flex-shrink-0">&#8226;</span>
                          Visit free attractions — parks, markets, viewpoints, and museums on free-admission days
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

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
      </div>
    </main>
  );
}
