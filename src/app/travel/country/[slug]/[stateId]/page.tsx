/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
// @ts-nocheck
// Types will come from @/data/travel/destinations
import { COUNTRIES } from '@/data/travel/destinations';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin, Star, ChevronRight, Clock, Eye, Utensils, TreePine,
  Building, Landmark, Mountain, Waves, Camera, Music, ShoppingBag,
  Heart, Users, Award, Trophy, Crown,
} from 'lucide-react';

export async function generateStaticParams() {
  const paths: Array<{ slug: string; stateId: string }> = [];
  for (const country of COUNTRIES) {
    for (const state of country.states) {
      paths.push({ slug: country.slug, stateId: state.id });
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

function getCategoryIcon(category: string) {
  const key = category.toLowerCase();
  for (const [k, icon] of Object.entries(CATEGORY_ICONS)) {
    if (key.includes(k)) return icon;
  }
  return <Star className="w-4 h-4" />;
}

function getTagColor(tag: string) {
  const colors: Record<string, string> = {
    free: 'bg-green-100 text-green-700',
    outdoor: 'bg-sky-100 text-sky-700',
    indoor: 'bg-violet-100 text-violet-700',
    'kid-friendly': 'bg-amber-100 text-amber-700',
    romantic: 'bg-pink-100 text-pink-700',
    historic: 'bg-orange-100 text-orange-700',
    cultural: 'bg-indigo-100 text-indigo-700',
    nature: 'bg-emerald-100 text-emerald-700',
  };
  const key = tag.toLowerCase();
  for (const [k, v] of Object.entries(colors)) {
    if (key.includes(k)) return v;
  }
  return 'bg-slate-100 text-slate-700';
}

export default async function StatePage({ params }: { params: Promise<{ slug: string; stateId: string }> }) {
  const { slug, stateId } = await params;
  const country = COUNTRIES.find((c) => c.slug === slug);
  if (!country) notFound();
  const state = country.states.find((s) => s.id === stateId);
  if (!state) notFound();

  // Gather all attractions from cities in this state
  const allAttractions: Array<{
    attraction: any;
    city: any;
    stateRank: number;
    countryRank?: number;
  }> = [];

  for (const city of state.cities) {
    for (const attraction of city.attractions) {
      if (attraction.stateRank && attraction.stateRank <= 10) {
        allAttractions.push({
          attraction,
          city,
          stateRank: attraction.stateRank,
          countryRank: attraction.countryRank,
        });
      }
    }
  }
  allAttractions.sort((a, b) => a.stateRank - b.stateRank);
  const top10 = allAttractions.slice(0, 10);

  // Quick picks — exclude attractions already in Top 10 to avoid duplication
  const top10Names = new Set(top10.map(t => t.attraction.name));
  const allAttractionsFlat = state.cities.flatMap((c) =>
    c.attractions.map((a: any) => ({ ...a, cityName: c.name, cityId: c.id }))
  ).filter((a: any) => !top10Names.has(a.name));
  const bestRestaurant = state.cities
    .flatMap((c) => (c.restaurants || []).map((r: any) => ({ ...r, cityName: c.name })))[0];
  const bestViewpoint = allAttractionsFlat.find(
    (a: any) => a.category?.toLowerCase().includes('viewpoint') || a.category?.toLowerCase().includes('view')
  );
  const bestFamily = allAttractionsFlat.find(
    (a: any) => a.familyFriendly || a.tags?.some((t: string) => t.toLowerCase().includes('kid') || t.toLowerCase().includes('family'))
  );

  return (
    <main className="min-h-screen bg-[#FAFBFC]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0EA5E9] via-[#0284C7] to-[#0369A1] text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <nav className="flex items-center gap-2 text-white/70 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/travel/destinations" className="hover:text-white transition-colors">Destinations</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/travel/country/${country.slug}`} className="hover:text-white transition-colors flex items-center gap-1">
              <span>{country.flag}</span> {country.name}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">{state.name}</span>
          </nav>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{country.flag}</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight">
              {state.name}
            </h1>
          </div>
          <p className="text-lg text-white/80 mt-2">
            {state.cities.length} {state.cities.length === 1 ? 'city' : 'cities'} to explore in {state.name}, {country.name}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Top 10 Attractions */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-2">
            Top 10 Attractions in {state.name}
          </h2>
          <p className="text-slate-500 mb-8">The best experiences across all cities in {state.name}</p>
          <div className="space-y-4">
            {top10.map(({ attraction, city, stateRank, countryRank }) => (
              <div
                key={`${city.id}-${attraction.name}`}
                className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    #{stateRank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-serif text-xl font-bold text-[#0F172A] group-hover:text-[#0EA5E9] transition-colors">
                            {attraction.name}
                          </h3>
                          {countryRank && countryRank <= 10 && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 rounded-full px-2.5 py-0.5 border border-amber-200">
                              <Trophy className="w-3 h-3" /> Country Top 10
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
                        <span className="text-xs bg-sky-50 text-sky-700 rounded-full px-3 py-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Rush: {attraction.visitDuration?.rush || attraction.durationRush}
                        </span>
                      )}
                      {(attraction.visitDuration?.noRush || attraction.durationNoRush) && (
                        <span className="text-xs bg-emerald-50 text-emerald-700 rounded-full px-3 py-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> No rush: {attraction.visitDuration?.noRush || attraction.durationNoRush}
                        </span>
                      )}
                      {attraction.tags?.map((tag: string) => (
                        <span key={tag} className={`text-xs rounded-full px-3 py-1 ${getTagColor(tag)}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {top10.length === 0 && (
              <p className="text-slate-400 text-center py-8">Attraction rankings coming soon.</p>
            )}
          </div>
        </section>

        {/* Cities Grid */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-2">Cities in {state.name}</h2>
          <p className="text-slate-500 mb-8">Pick a city to dive deeper</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.cities.map((city) => {
              const topAttraction = city.attractions
                ?.slice()
                .sort((a: any, b: any) => (a.cityRank || 99) - (b.cityRank || 99))[0];
              return (
                <Link
                  key={city.id}
                  href={`/travel/country/${country.slug}/${state.id}/${city.id}`}
                  className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md hover:border-[#0EA5E9]/30 transition-all group"
                >
                  <h3 className="font-serif text-lg font-bold text-[#0F172A] group-hover:text-[#0EA5E9] transition-colors">
                    {city.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0EA5E9]" />
                    {city.attractions?.length || 0} attractions
                  </div>
                  {topAttraction && (
                    <div className="mt-3 bg-[#FAFBFC] rounded-lg p-3 border border-[#E2E8F0]">
                      <span className="text-xs text-slate-400 uppercase tracking-wider">Top attraction</span>
                      <p className="text-sm font-medium text-[#0F172A] mt-0.5 flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#F59E0B]" />
                        {topAttraction.name}
                      </p>
                    </div>
                  )}
                  <div className="mt-3 text-sm text-[#0EA5E9] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore city <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick Stats */}
        {(bestRestaurant || bestViewpoint || bestFamily) && (
          <section>
            <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-2">
              Quick Picks in {state.name}
            </h2>
            <p className="text-slate-500 mb-8">Handpicked highlights across all cities</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {bestRestaurant && (
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                      <Utensils className="w-5 h-5 text-[#F59E0B]" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider">Must-Try Restaurant</span>
                      <h3 className="font-serif font-bold text-[#0F172A] text-sm">{bestRestaurant.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    {bestRestaurant.cuisine} in {bestRestaurant.cityName}
                    {bestRestaurant.priceRange && ` · ${bestRestaurant.priceRange}`}
                  </p>
                </div>
              )}
              {bestViewpoint && (
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-[#0EA5E9]" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider">Best Viewpoint</span>
                      <h3 className="font-serif font-bold text-[#0F172A] text-sm">{bestViewpoint.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    {bestViewpoint.cityName}
                    {bestViewpoint.description && ` — ${bestViewpoint.description.slice(0, 80)}...`}
                  </p>
                </div>
              )}
              {bestFamily && (
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                      <Users className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider">Best for Families</span>
                      <h3 className="font-serif font-bold text-[#0F172A] text-sm">{bestFamily.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    {bestFamily.cityName}
                    {bestFamily.description && ` — ${bestFamily.description.slice(0, 80)}...`}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
