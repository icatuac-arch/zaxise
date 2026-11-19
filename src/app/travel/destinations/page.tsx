/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
// @ts-nocheck
'use client';

// Types will come from @/data/travel/destinations
import { COUNTRIES } from '@/data/travel/destinations';
import { COUNTRY_IMAGES } from '@/data/travel/country-images';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import {
  MapPin, Search, Globe, ChevronRight, Star, Filter,
} from 'lucide-react';

const CONTINENTS = ['All', 'Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania'];

export default function DestinationsPage() {
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter((country) => {
      const matchesContinent =
        selectedContinent === 'All' ||
        country.continent?.toLowerCase() === selectedContinent.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.tagline?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesContinent && matchesSearch;
    });
  }, [selectedContinent, searchQuery]);

  // Group by continent
  const grouped = useMemo(() => {
    const groups: Record<string, typeof filteredCountries> = {};
    for (const country of filteredCountries) {
      const continent = country.continent || 'Other';
      if (!groups[continent]) groups[continent] = [];
      groups[continent].push(country);
    }
    return groups;
  }, [filteredCountries]);

  const continentOrder = ['Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania', 'Other'];
  const sortedContinents = Object.keys(grouped).sort(
    (a, b) => continentOrder.indexOf(a) - continentOrder.indexOf(b)
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
            <span className="text-white">Destinations</span>
          </nav>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight">
            Explore the World
          </h1>
          <p className="text-xl text-white/80 mt-3 max-w-2xl">
            Discover detailed travel guides for countries across every continent. Find your next adventure.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Continent Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          {CONTINENTS.map((continent) => (
            <button
              key={continent}
              onClick={() => setSelectedContinent(continent)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedContinent === continent
                  ? 'bg-[#0EA5E9] text-white shadow-md'
                  : 'bg-white text-slate-600 border border-[#E2E8F0] hover:border-[#0EA5E9]/30 hover:text-[#0EA5E9]'
              }`}
            >
              {continent}
            </button>
          ))}
        </div>

        {/* Country Groups */}
        {sortedContinents.length === 0 ? (
          <div className="text-center py-16">
            <Globe className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No countries found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {sortedContinents.map((continent) => (
              <section key={continent}>
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="w-5 h-5 text-[#0EA5E9]" />
                  <h2 className="font-serif text-2xl font-bold text-[#0F172A]">{continent}</h2>
                  <span className="text-sm text-slate-400">
                    {grouped[continent].length} {grouped[continent].length === 1 ? 'country' : 'countries'}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {grouped[continent].map((country) => {
                    const cityCount = country.states.reduce(
                      (acc, s) => acc + s.cities.length,
                      0
                    );
                    const imageUrl = COUNTRY_IMAGES[country.slug];
                    return (
                      <Link
                        key={country.slug}
                        href={`/travel/country/${country.slug}`}
                        className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group relative"
                      >
                        {imageUrl ? (
                          <>
                            {/* Image background card */}
                            <div
                              className="absolute inset-0 bg-cover bg-center"
                              style={{ backgroundImage: `url("${imageUrl}")` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/70 group-hover:via-black/30 transition-all" />
                            <div className="relative p-5 min-h-[180px] flex flex-col justify-end text-white">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-3xl">{country.flag}</span>
                                <h3 className="font-serif text-lg font-bold drop-shadow-sm">
                                  {country.name}
                                </h3>
                              </div>
                              {country.tagline && (
                                <p className="text-sm text-white/80 mt-1 line-clamp-2">{country.tagline}</p>
                              )}
                              <div className="flex items-center gap-3 mt-3 text-sm text-white/70">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-white/90" />
                                  {cityCount} {cityCount === 1 ? 'city' : 'cities'}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Star className="w-3.5 h-3.5 text-amber-300" />
                                  {country.states.length} {country.states.length === 1 ? 'region' : 'regions'}
                                </span>
                              </div>
                              <div className="mt-3 flex items-center justify-end">
                                <span className="text-sm font-medium text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  Explore <ChevronRight className="w-4 h-4" />
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          /* Fallback: no image, plain card */
                          <div className="bg-white border border-[#E2E8F0] p-5 hover:border-[#0EA5E9]/30 transition-all h-full">
                            <div className="flex items-start gap-3">
                              <span className="text-4xl flex-shrink-0">{country.flag}</span>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-serif text-lg font-bold text-[#0F172A] group-hover:text-[#0EA5E9] transition-colors">
                                  {country.name}
                                </h3>
                                {country.tagline && (
                                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{country.tagline}</p>
                                )}
                                <div className="flex items-center gap-3 mt-3 text-sm text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-[#0EA5E9]" />
                                    {cityCount} {cityCount === 1 ? 'city' : 'cities'}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 text-[#F59E0B]" />
                                    {country.states.length} {country.states.length === 1 ? 'region' : 'regions'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 flex items-center justify-end">
                              <span className="text-sm font-medium text-[#0EA5E9] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                Explore <ChevronRight className="w-4 h-4" />
                              </span>
                            </div>
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
