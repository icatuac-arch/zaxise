'use client'

import { useState, useMemo } from 'react'
import { COUNTRIES } from '@/data/travel/destinations'
import type { Restaurant, Country } from '@/data/travel/destinations'

const DIETARY_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'halal', label: 'Halal' },
  { id: 'budget', label: 'Budget-Friendly' },
] as const

type FilterType = (typeof DIETARY_FILTERS)[number]['id']

const TOP_DISHES: Record<string, { name: string; description: string; vegetarian: boolean }[]> = {
  japan: [
    { name: 'Sushi', description: 'Vinegared rice paired with fresh raw fish, seafood, or vegetables — a defining Japanese culinary art.', vegetarian: false },
    { name: 'Ramen', description: 'Rich, steaming noodle soup in pork, miso, soy, or salt-based broth with various toppings.', vegetarian: false },
    { name: 'Tempura', description: 'Light, crispy battered and deep-fried seafood and vegetables.', vegetarian: false },
    { name: 'Okonomiyaki', description: 'Savory pancake loaded with cabbage, meat, and drizzled with special sauce and bonito flakes.', vegetarian: false },
    { name: 'Matcha Desserts', description: 'Green tea-flavored ice cream, mochi, and cakes found everywhere.', vegetarian: true },
  ],
  italy: [
    { name: 'Pasta Carbonara', description: 'Classic Roman pasta with egg, pecorino cheese, guanciale, and black pepper.', vegetarian: false },
    { name: 'Neapolitan Pizza', description: 'Wood-fired pizza with San Marzano tomatoes, mozzarella di bufala, and fresh basil.', vegetarian: true },
    { name: 'Risotto alla Milanese', description: 'Creamy saffron-infused risotto, a staple of Milanese cuisine.', vegetarian: true },
    { name: 'Gelato', description: 'Italian-style ice cream with intense flavors and a smooth, dense texture.', vegetarian: true },
    { name: 'Osso Buco', description: 'Braised veal shanks in white wine, broth, and gremolata.', vegetarian: false },
  ],
  thailand: [
    { name: 'Pad Thai', description: 'Stir-fried rice noodles with shrimp, tofu, peanuts, bean sprouts, and tamarind sauce.', vegetarian: false },
    { name: 'Tom Yum Goong', description: 'Spicy and sour soup with shrimp, lemongrass, galangal, and lime.', vegetarian: false },
    { name: 'Green Curry', description: 'Coconut milk-based curry with green chili paste, Thai basil, and your choice of protein.', vegetarian: false },
    { name: 'Mango Sticky Rice', description: 'Sweet sticky rice topped with fresh mango slices and coconut cream.', vegetarian: true },
    { name: 'Som Tum', description: 'Green papaya salad with chili, lime, fish sauce, and peanuts.', vegetarian: false },
  ],
  france: [
    { name: 'Croissant', description: 'Buttery, flaky pastry perfected by French bakers — best enjoyed warm from a boulangerie.', vegetarian: true },
    { name: 'Coq au Vin', description: 'Chicken braised in red wine with mushrooms, onions, and herbs.', vegetarian: false },
    { name: 'Ratatouille', description: 'Provencal vegetable stew with eggplant, zucchini, peppers, and tomatoes.', vegetarian: true },
    { name: 'Croque Monsieur', description: 'Grilled ham and cheese sandwich topped with bechamel sauce.', vegetarian: false },
    { name: 'Creme Brulee', description: 'Rich custard topped with a caramelized sugar crust.', vegetarian: true },
  ],
  india: [
    { name: 'Butter Chicken', description: 'Tender chicken in a creamy tomato-based sauce with butter and spices.', vegetarian: false },
    { name: 'Biryani', description: 'Fragrant layered rice dish with spices, saffron, and meat or vegetables.', vegetarian: false },
    { name: 'Masala Dosa', description: 'Crispy rice and lentil crepe filled with spiced potato filling, served with sambar and chutney.', vegetarian: true },
    { name: 'Chole Bhature', description: 'Spiced chickpea curry served with deep-fried puffed bread.', vegetarian: true },
    { name: 'Gulab Jamun', description: 'Deep-fried milk solid balls soaked in rose-flavored sugar syrup.', vegetarian: true },
  ],
}

const FOOD_ETIQUETTE: Record<string, string[]> = {
  japan: [
    'Say "Itadakimasu" (I humbly receive) before eating.',
    'Never stick chopsticks upright in rice.',
    'Slurping noodles is polite — it shows you enjoy the food.',
    'Do not pour your own drink; pour for others and let them pour for you.',
    'Tipping is considered rude.',
  ],
  italy: [
    'Cappuccino is only for breakfast — ordering one after lunch is a faux pas.',
    'Bread is for mopping up sauce, not as an appetizer with olive oil (that\'s American-Italian).',
    'Do not ask for parmesan on seafood pasta.',
    'Dinner starts late — 8 PM or later.',
    'The "coperto" (cover charge) on the bill is normal, not a scam.',
  ],
  thailand: [
    'Use a fork to push food onto a spoon — eat from the spoon, not the fork.',
    'The eldest or most senior person should be served first.',
    'Street food is eaten standing or on small plastic stools.',
    'Do not leave chopsticks across the top of your bowl.',
    'Sharing dishes family-style is the norm.',
  ],
  france: [
    'Keep both hands on the table (but not elbows).',
    'Bread goes directly on the table, not on your plate.',
    'Say "Bon appetit" before eating.',
    'Wine is sipped, never gulped.',
    'Wait for the host to begin eating before you start.',
  ],
  india: [
    'Eating with your right hand is traditional — the left hand is considered unclean.',
    'Wash hands before and after eating.',
    'Decline food politely at first; the host will offer again.',
    'Shoes are often removed before entering a dining room.',
    'Sharing food from your plate is a sign of closeness.',
  ],
}

const STREET_FOOD_SAFETY = [
  'Eat where the locals eat — high turnover means fresher food.',
  'Watch the food being cooked fresh in front of you.',
  'Avoid raw salads, unpeeled fruits, and tap-water ice in areas with poor water quality.',
  'Carry hand sanitizer or wet wipes since handwashing may not always be available.',
  'Start slow — let your stomach adjust to new cuisines over the first couple of days.',
  'Avoid pre-cut fruit that has been sitting out for long periods.',
  'Look for vendors who use separate utensils for raw and cooked ingredients.',
  'Bottled or boiled water is always the safest option.',
]

function filterRestaurant(r: Restaurant, filter: FilterType): boolean {
  switch (filter) {
    case 'vegetarian': return r.vegetarianFriendly
    case 'vegan': return r.veganOptions
    case 'halal': return r.halalCertified
    case 'budget': return r.priceRange === '$' || r.priceRange === '$$'
    default: return true
  }
}

function getAllRestaurants(country: Country): (Restaurant & { cityName: string })[] {
  const result: (Restaurant & { cityName: string })[] = []
  for (const state of country.states) {
    for (const city of state.cities) {
      for (const r of city.restaurants) {
        result.push({ ...r, cityName: city.name })
      }
    }
  }
  return result
}

export default function FoodGuidePage() {
  const [selectedCountryId, setSelectedCountryId] = useState<string>('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  const countriesToShow = useMemo(() => {
    if (selectedCountryId) {
      const c = COUNTRIES.find((c) => c.id === selectedCountryId)
      return c ? [c] : []
    }
    return COUNTRIES
  }, [selectedCountryId])

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">World Food Guide</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Discover local dishes, restaurant recommendations, dietary options, and food etiquette for every destination.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedCountryId}
            onChange={(e) => setSelectedCountryId(e.target.value)}
            className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
          >
            <option value="">All Countries</option>
            {COUNTRIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>

          <div className="flex flex-wrap gap-2">
            {DIETARY_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === f.id
                    ? 'bg-[#F59E0B] text-white shadow-md'
                    : 'bg-white text-[#0F172A]/70 border border-[#E2E8F0] hover:border-[#F59E0B]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Per-Country Sections */}
        {countriesToShow.map((country) => {
          const dishes = TOP_DISHES[country.id] || []
          const etiquette = FOOD_ETIQUETTE[country.id] || []
          const allRestaurants = getAllRestaurants(country)
          const filteredRestaurants = allRestaurants.filter((r) => filterRestaurant(r, activeFilter))

          return (
            <section key={country.id} className="space-y-6">
              <h2 className="font-heading text-3xl font-bold text-[#0F172A]">
                <span className="mr-2">{country.flag}</span>{country.name}
              </h2>

              {/* Top Dishes */}
              {dishes.length > 0 && (
                <div>
                  <h3 className="font-heading text-xl font-semibold text-[#0F172A] mb-3">Top Local Dishes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dishes
                      .filter((d) => {
                        if (activeFilter === 'vegetarian' || activeFilter === 'vegan') return d.vegetarian
                        return true
                      })
                      .map((dish) => (
                        <div key={dish.name} className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-heading font-semibold text-[#0F172A]">{dish.name}</h4>
                            {dish.vegetarian && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                Veg
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#0F172A]/70">{dish.description}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Restaurant Recommendations */}
              {filteredRestaurants.length > 0 && (
                <div>
                  <h3 className="font-heading text-xl font-semibold text-[#0F172A] mb-3">
                    Restaurant Recommendations
                    {activeFilter !== 'all' && (
                      <span className="ml-2 text-sm font-normal text-[#0F172A]/50">
                        (filtered: {activeFilter})
                      </span>
                    )}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredRestaurants.map((r, i) => (
                      <div key={`${r.name}-${i}`} className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-heading font-semibold text-[#0F172A]">{r.name}</h4>
                            <p className="text-xs text-[#0F172A]/50">{r.cityName} &middot; {r.cuisine}</p>
                          </div>
                          <span className="text-[#F59E0B] font-bold text-sm">{r.priceRange}</span>
                        </div>
                        <p className="text-sm text-[#0F172A]/70 mb-2">{r.specialty}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {r.vegetarianFriendly && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700">Vegetarian</span>
                          )}
                          {r.veganOptions && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">Vegan Options</span>
                          )}
                          {r.halalCertified && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-violet-100 text-violet-700">Halal</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Food Etiquette */}
              {etiquette.length > 0 && (
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                  <h3 className="font-heading text-xl font-semibold text-[#0F172A] mb-3">Food Etiquette</h3>
                  <ul className="space-y-2">
                    {etiquette.map((tip, i) => (
                      <li key={i} className="flex gap-3 text-[#0F172A] text-sm">
                        <span className="flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-[#F59E0B]" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {countriesToShow.length > 1 && (
                <hr className="border-[#E2E8F0]" />
              )}
            </section>
          )
        })}

        {/* Dietary Sections */}
        <section className="space-y-6">
          <h2 className="font-heading text-3xl font-bold text-[#0F172A]">Dietary Options Guide</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-xl mb-3">🥬</div>
              <h3 className="font-heading text-lg font-semibold text-[#0F172A] mb-2">Vegetarian Friendly</h3>
              <p className="text-sm text-[#0F172A]/70 mb-3">
                India offers the most vegetarian-friendly dining with dedicated vegetarian restaurants everywhere. Japan has shojin ryori (Buddhist temple cuisine). Italy has excellent cheese- and vegetable-based dishes.
              </p>
              <p className="text-xs text-[#0F172A]/50">
                Tip: In Japan, confirm no dashi (fish stock) is used. In Thailand, ask for &quot;jay&quot; (vegan Buddhist food).
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-xl mb-3">🌱</div>
              <h3 className="font-heading text-lg font-semibold text-[#0F172A] mb-2">Vegan Options</h3>
              <p className="text-sm text-[#0F172A]/70 mb-3">
                Thailand and India are most vegan-friendly with coconut milk-based curries and lentil dishes. France and Italy are adapting with growing vegan restaurant scenes in Paris, Rome, and Milan.
              </p>
              <p className="text-xs text-[#0F172A]/50">
                Tip: Learn to say &quot;no milk, no egg, no fish&quot; in the local language. Print a dietary card to show restaurants.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center text-xl mb-3">🕌</div>
              <h3 className="font-heading text-lg font-semibold text-[#0F172A] mb-2">Halal Options</h3>
              <p className="text-sm text-[#0F172A]/70 mb-3">
                Thailand has abundant halal food, especially in southern regions and Bangkok. India offers halal options throughout, particularly in Muslim-majority areas. France has halal butchers in major cities.
              </p>
              <p className="text-xs text-[#0F172A]/50">
                Tip: Look for halal certification signs. In Japan, halal restaurants are growing but still limited — plan ahead.
              </p>
            </div>
          </div>
        </section>

        {/* Street Food Safety */}
        <section>
          <h2 className="font-heading text-3xl font-bold text-[#0F172A] mb-6">Street Food Safety Tips</h2>
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {STREET_FOOD_SAFETY.map((tip, i) => (
                <div key={i} className="flex gap-3 text-[#0F172A]">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="text-sm pt-0.5">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
