'use client'

import { useState, useMemo } from 'react'
import { COUNTRIES } from '@/data/travel/destinations'
import type { Country, Attraction } from '@/data/travel/destinations'

const KID_ACTIVITIES: Record<string, { activity: string; ageRange: string; description: string }[]> = {
  japan: [
    { activity: 'Tokyo Disneyland & DisneySea', ageRange: 'All ages', description: 'Two world-class Disney parks in one location. DisneySea is unique to Japan and has more rides for older kids and adults.' },
    { activity: 'Studio Ghibli Museum', ageRange: '4+', description: 'Magical museum in Mitaka dedicated to Miyazaki films. Tickets must be purchased in advance — they sell out months ahead.' },
    { activity: 'TeamLab Borderless / Planets', ageRange: 'All ages', description: 'Immersive digital art installations that kids find mesmerizing. Planets involves wading through water — bring a change of clothes for little ones.' },
    { activity: 'Arcade Gaming in Akihabara', ageRange: '6+', description: 'Multi-story arcades with claw machines, rhythm games, and racing simulators. Many accept 100-yen coins — budget-friendly fun.' },
    { activity: 'Nara Deer Park', ageRange: 'All ages', description: 'Over 1,000 friendly deer roam free. Kids can buy deer crackers (shika senbei) to feed them. Supervise toddlers closely.' },
    { activity: 'Shinkansen (Bullet Train) Ride', ageRange: 'All ages', description: 'Kids love the speed. Book seats on the right side heading west from Tokyo for Mt. Fuji views. Under-6 ride free on a parent\'s lap.' },
  ],
  italy: [
    { activity: 'Gelato Making Classes', ageRange: '5+', description: 'Several schools in Florence and Rome offer family gelato-making workshops. Kids learn the craft and eat their creations.' },
    { activity: 'Colosseum Kids Tour', ageRange: '6+', description: 'Specialized guided tours designed for children include gladiator stories, underground chambers, and interactive elements.' },
    { activity: 'Venice Boat Rides', ageRange: 'All ages', description: 'Gondola rides are magical for kids. For budget-friendly options, use the traghetto (public gondola ferry) across the Grand Canal for just 2 euros.' },
    { activity: 'Pompeii Exploration', ageRange: '7+', description: 'The preserved Roman city fascinates older kids. Hire a family-friendly guide who brings the ruins to life with stories.' },
    { activity: 'Pizza Making in Naples', ageRange: '4+', description: 'Many pizzerias offer hands-on pizza-making experiences. Kids knead dough, add toppings, and watch their creation go into a wood-fired oven.' },
    { activity: 'Murano Glass Blowing Demo', ageRange: '6+', description: 'Watch master glassblowers shape molten glass into animals and vases. Free demos are offered at many Murano workshops.' },
  ],
  thailand: [
    { activity: 'Ethical Elephant Sanctuaries', ageRange: 'All ages', description: 'Elephant Nature Park near Chiang Mai lets families feed, bathe, and walk with rescued elephants. No riding — observation and care only.' },
    { activity: 'Island Beaches', ageRange: 'All ages', description: 'Koh Lanta and Koh Samui have calm, shallow waters ideal for young children. Avoid Koh Phangan\'s Full Moon Party beaches with kids.' },
    { activity: 'Night Markets', ageRange: 'All ages', description: 'Chiang Mai and Bangkok night markets offer kid-friendly food, cheap toys, and live entertainment. Watch for motorbikes in walking areas.' },
    { activity: 'Chiang Mai Zip-lining', ageRange: '7+', description: 'Flight of the Gibbon and Eagle Track offer jungle zip-line courses with safety harnesses. Minimum age and weight requirements apply.' },
    { activity: 'Thai Cooking Class (Family)', ageRange: '6+', description: 'Many Chiang Mai cooking schools offer family-friendly sessions. Kids love shopping at the market and preparing pad thai.' },
    { activity: 'Floating Markets', ageRange: 'All ages', description: 'Damnoen Saduak and Amphawa floating markets are exciting for kids. Arrive early to avoid the tour-bus crowds.' },
  ],
  france: [
    { activity: 'Disneyland Paris', ageRange: 'All ages', description: 'Two parks: Disneyland Park for younger kids, Walt Disney Studios for thrill-seekers. Located 40 minutes by train from central Paris.' },
    { activity: 'Luxembourg Gardens Playground', ageRange: '2-12', description: 'Beautiful playground in central Paris. Kids can also rent toy sailboats for the fountain, ride the carousel, and watch puppet shows.' },
    { activity: 'Cite des Sciences et de l\'Industrie', ageRange: '3+', description: 'Europe\'s largest science museum in Paris. The Cite des Enfants section is designed specifically for ages 2-7 and 5-12.' },
    { activity: 'Chateau de Versailles Gardens', ageRange: 'All ages', description: 'Kids can run freely in the vast gardens. Rent small boats on the Grand Canal and watch the fountain shows (seasonal weekends).' },
    { activity: 'Mont Saint-Michel', ageRange: '5+', description: 'The island fortress feels like a fairy tale. Guided bay walks across the sand at low tide are thrilling for adventurous families.' },
    { activity: 'Loire Valley Chateaux', ageRange: '6+', description: 'Many castles offer kids\' activity booklets, treasure hunts, and costume dress-up. Chateau de Chenonceau is especially family-friendly.' },
  ],
  india: [
    { activity: 'Forts Exploration in Rajasthan', ageRange: '5+', description: 'Amer Fort, Mehrangarh Fort, and Jaisalmer Fort have tunnels, ramparts, and panoramic views that captivate young explorers.' },
    { activity: 'Elephant Encounters in Rajasthan', ageRange: 'All ages', description: 'Elefantastic near Jaipur offers ethical elephant interaction — feeding, painting, and walking alongside these gentle giants.' },
    { activity: 'Goa Beaches', ageRange: 'All ages', description: 'Palolem and Agonda beaches have calm waters. Many beach shacks offer kids\' menus and play areas.' },
    { activity: 'Houseboat in Kerala', ageRange: 'All ages', description: 'A night on a traditional kettuvallam houseboat through the Kerala backwaters is a unique family experience. Crews prepare fresh local meals.' },
    { activity: 'Tiger Safari in Ranthambore', ageRange: '6+', description: 'Jeep safaris through Ranthambore National Park offer excellent chances to spot Bengal tigers, leopards, and deer.' },
    { activity: 'Toy Train Rides', ageRange: 'All ages', description: 'The Darjeeling Himalayan Railway and Nilgiri Mountain Railway are UNESCO Heritage rides through stunning mountain scenery.' },
  ],
}

const AGE_SUITABILITY: Record<string, { age: string; tips: string }[]> = {
  japan: [
    { age: 'Babies (0-2)', tips: 'Japan is extremely baby-friendly. Most department stores and train stations have nursing rooms (junyuu-shitsu). Strollers work well on sidewalks but struggle on temple stairs.' },
    { age: 'Toddlers (2-5)', tips: 'Parks, deer feeding in Nara, and train rides captivate toddlers. Pack portable snacks — Japanese kid food portions are small. Many restaurants have kid seats.' },
    { age: 'Kids (6-12)', tips: 'Ideal age for Japan. Arcades, Disneyland, Studio Ghibli, and making friends at playgrounds. Kids love shinkansen rides and convenience store snack runs.' },
    { age: 'Teens (13+)', tips: 'Akihabara, Harajuku fashion district, karaoke, and ramen culture are big hits. Teens can navigate Tokyo\'s train system independently.' },
  ],
  italy: [
    { age: 'Babies (0-2)', tips: 'Italians adore babies and will fuss over yours. Cobblestones make strollers tough — baby carriers work better in Venice and hilltop towns.' },
    { age: 'Toddlers (2-5)', tips: 'Gelato is the ultimate toddler bribe. Parks and piazzas provide running space. Plan museum visits for mornings when energy is high.' },
    { age: 'Kids (6-12)', tips: 'Gladiator stories at the Colosseum, pizza making, and boat rides in Venice excite this age group. Evening passeggiate (walks) become family tradition.' },
    { age: 'Teens (13+)', tips: 'Fashion in Milan, history in Rome, and beach time on the Amalfi Coast appeal to teens. Italy\'s food culture wins over even picky eaters.' },
  ],
  thailand: [
    { age: 'Babies (0-2)', tips: 'Thais love babies. Heat is the main concern — stick to air-conditioned spaces during midday. Baby supplies are affordable and widely available at 7-Elevens and pharmacies.' },
    { age: 'Toddlers (2-5)', tips: 'Beach resorts with pools are ideal for this age. Night markets have kid-friendly foods. Beware of stray dogs and watch for traffic when walking.' },
    { age: 'Kids (6-12)', tips: 'Elephant sanctuaries, island hopping, and cooking classes create lasting memories. Thai kids are friendly — expect impromptu playdates.' },
    { age: 'Teens (13+)', tips: 'Zip-lining, snorkeling, rock climbing, and night market shopping give teens independence. The night scene in party areas is not suitable for teens.' },
  ],
  france: [
    { age: 'Babies (0-2)', tips: 'Paris parks are stroller-friendly. Most restaurants welcome babies, especially at lunch. Pack your own baby food — French options may be different from what your child is used to.' },
    { age: 'Toddlers (2-5)', tips: 'Luxembourg Gardens playground, the carousel at the foot of the Eiffel Tower, and Cite des Enfants are perfect. French crepes make great toddler snacks.' },
    { age: 'Kids (6-12)', tips: 'Disneyland Paris, castle explorations, and boat rides on canals keep kids engaged. Many museums offer kids\' audioguides or activity booklets.' },
    { age: 'Teens (13+)', tips: 'Street art in Montmartre, shopping in Le Marais, and day trips to Versailles and Mont Saint-Michel appeal to teens. The Louvre has a dedicated teen trail.' },
  ],
  india: [
    { age: 'Babies (0-2)', tips: 'Heat, crowds, and hygiene require extra preparation. Carry all baby supplies from home. Upscale hotels are the most comfortable base. Avoid street food for infants.' },
    { age: 'Toddlers (2-5)', tips: 'Goa beaches and Kerala houseboats are the most toddler-friendly options. Pre-book private cars instead of public transport. Stick to bottled water and well-cooked food.' },
    { age: 'Kids (6-12)', tips: 'Forts, tiger safaris, toy trains, and colorful festivals fascinate this age. Prepare kids for the sensory overload of Indian cities — it can be intense.' },
    { age: 'Teens (13+)', tips: 'Rajasthan\'s history, Goa\'s beach culture, and trekking in the Himalayas offer adventure. Teens should understand cultural sensitivities and dress codes.' },
  ],
}

const FAMILY_BUDGET: Record<string, { category: string; budget: string; midRange: string; comfort: string }[]> = {
  japan: [
    { category: 'Accommodation (per night)', budget: '$40-80 (family hostels)', midRange: '$120-200 (business hotels)', comfort: '$250-500 (ryokans, resorts)' },
    { category: 'Meals (family of 4)', budget: '$30-50/day', midRange: '$60-100/day', comfort: '$120-250/day' },
    { category: 'Transport', budget: '$60-100/day (JR Pass)', midRange: '$80-150/day (JR Pass + taxis)', comfort: '$150-300/day (private car + trains)' },
    { category: 'Activities', budget: '$20-40/day', midRange: '$50-100/day', comfort: '$100-250/day' },
  ],
  italy: [
    { category: 'Accommodation (per night)', budget: '$60-100 (apartments)', midRange: '$150-250 (hotels)', comfort: '$300-600 (boutique hotels, villas)' },
    { category: 'Meals (family of 4)', budget: '$40-70/day', midRange: '$80-140/day', comfort: '$150-300/day' },
    { category: 'Transport', budget: '$30-60/day (trains, buses)', midRange: '$60-120/day (rental car)', comfort: '$120-250/day (private transfers)' },
    { category: 'Activities', budget: '$20-50/day', midRange: '$50-120/day', comfort: '$120-300/day' },
  ],
  thailand: [
    { category: 'Accommodation (per night)', budget: '$20-50 (guesthouses)', midRange: '$60-120 (hotels)', comfort: '$150-400 (resorts)' },
    { category: 'Meals (family of 4)', budget: '$15-30/day', midRange: '$30-60/day', comfort: '$60-150/day' },
    { category: 'Transport', budget: '$10-25/day (public transport)', midRange: '$25-60/day (taxis, songthaews)', comfort: '$60-150/day (private car)' },
    { category: 'Activities', budget: '$15-30/day', midRange: '$40-80/day', comfort: '$80-200/day' },
  ],
  france: [
    { category: 'Accommodation (per night)', budget: '$70-120 (apartments)', midRange: '$150-280 (hotels)', comfort: '$300-700 (luxury hotels, chateaux)' },
    { category: 'Meals (family of 4)', budget: '$50-80/day', midRange: '$90-160/day', comfort: '$180-400/day' },
    { category: 'Transport', budget: '$30-60/day (trains, metro)', midRange: '$60-120/day (rental car)', comfort: '$150-300/day (private transfers)' },
    { category: 'Activities', budget: '$20-50/day', midRange: '$60-130/day', comfort: '$130-350/day' },
  ],
  india: [
    { category: 'Accommodation (per night)', budget: '$15-40 (guesthouses)', midRange: '$50-120 (hotels)', comfort: '$150-500 (heritage hotels, palaces)' },
    { category: 'Meals (family of 4)', budget: '$10-25/day', midRange: '$25-60/day', comfort: '$60-150/day' },
    { category: 'Transport', budget: '$10-20/day (trains, buses)', midRange: '$25-50/day (taxis, auto-rickshaws)', comfort: '$60-150/day (private car + driver)' },
    { category: 'Activities', budget: '$10-25/day', midRange: '$30-70/day', comfort: '$70-200/day' },
  ],
}

const CHILD_SAFETY_TIPS: Record<string, string[]> = {
  japan: [
    'Japan is one of the safest countries for families. Children as young as 6 walk to school alone.',
    'Earthquake preparedness: know hotel evacuation routes and keep shoes by the bed at night.',
    'Convenience stores and koban (police boxes) are safe havens if kids get separated from you.',
    'Many temple stairs and hillsides lack guardrails — supervise children closely.',
  ],
  italy: [
    'Pickpockets target distracted parents in Rome, Florence, and Naples — use a baby carrier to keep hands free.',
    'Italian drivers can be aggressive — hold children\'s hands when crossing streets, even at crosswalks.',
    'Swimming beaches may have strong currents — always swim near lifeguard stations.',
    'Keep kids hydrated in summer — temperatures frequently exceed 35 degrees C in southern Italy.',
  ],
  thailand: [
    'Traffic is chaotic — never assume vehicles will stop. Hold children\'s hands at all times near roads.',
    'Apply strong insect repellent daily — dengue fever is a real risk, especially in rural areas.',
    'Supervise children around temple ponds and wild monkeys — macaques can be aggressive over food.',
    'Rip currents are common on west-coast beaches during monsoon season (May-October).',
  ],
  france: [
    'Pickpockets are active around the Eiffel Tower, Sacre-Coeur, and metro stations — keep children close.',
    'The sun in southern France is strong — sunscreen, hats, and midday shade breaks are essential.',
    'Rivers and canals (especially in Provence and Burgundy) often lack fencing — watch toddlers carefully.',
    'Emergency number is 112 (European) or 15 (SAMU medical emergency). Save these in your phone.',
  ],
  india: [
    'Never drink tap water — use only bottled or purified water for drinking and brushing teeth.',
    'Traffic is extremely unpredictable — hold children at all times near roads. Use reputable transport only.',
    'Cover up against mosquitoes from dusk to dawn — malaria and dengue are present in some regions.',
    'Keep children close in crowded markets and tourist areas. Agree on a meeting point in case of separation.',
  ],
}

const PACKING_LIST = [
  { category: 'Documents & Essentials', items: [
    'Passports and copies for every family member',
    'Travel insurance documents with pediatric coverage',
    'Vaccination records and prescription medications',
    'Printed itinerary and hotel confirmations (backup to digital)',
    'Emergency contacts list (embassy, pediatrician, insurance)',
  ]},
  { category: 'Health & Safety', items: [
    'First aid kit with child-friendly pain relief, band-aids, and antiseptic',
    'Insect repellent (DEET or picaridin, child-safe formula)',
    'Sunscreen SPF 50+ and sun hats for everyone',
    'Rehydration salts (for stomach bugs)',
    'Hand sanitizer and wet wipes (lots of them)',
    'Digital thermometer',
  ]},
  { category: 'Comfort & Entertainment', items: [
    'Tablet or phone loaded with offline movies, games, and audiobooks',
    'Headphones (kid-sized, volume-limiting)',
    'Coloring books, stickers, and small toys for flights and restaurants',
    'Favorite stuffed animal or comfort item',
    'Refillable water bottles for everyone',
    'Portable snacks from home for picky eaters',
  ]},
  { category: 'Baby/Toddler Specific', items: [
    'Lightweight stroller or baby carrier (carrier preferred for cobblestones and stairs)',
    'Portable high chair or clip-on seat',
    'Diaper bag with supplies for 24+ hours (delays happen)',
    'Portable white noise machine or app',
    'Zip-lock bags (for wet clothes, diapers, snacks, and emergencies)',
    'Baby food and formula (enough for travel days plus buffer)',
  ]},
]

function getFamilyFriendlyAttractions(country: Country): (Attraction & { cityName: string })[] {
  const results: (Attraction & { cityName: string })[] = []
  for (const state of country.states) {
    for (const city of state.cities) {
      for (const attr of city.attractions) {
        if (attr.familyFriendly) {
          results.push({ ...attr, cityName: city.name })
        }
      }
    }
  }
  return results
}

export default function FamilyGuidePage() {
  const [selectedCountry, setSelectedCountry] = useState<string>('')

  const countriesToShow = useMemo(() => {
    if (selectedCountry) {
      const c = COUNTRIES.find((c) => c.id === selectedCountry)
      return c ? [c] : []
    }
    return COUNTRIES
  }, [selectedCountry])

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0EA5E9] to-[#10B981] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Family Travel Guide</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Family-friendly attractions, kid activities, age-specific tips, budget guidance, and everything you need for traveling with children.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
        {/* Country Filter */}
        <div>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
          >
            <option value="">All Countries</option>
            {COUNTRIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Per-Country Sections */}
        {countriesToShow.map((country) => {
          const familyAttractions = getFamilyFriendlyAttractions(country)
          const activities = KID_ACTIVITIES[country.id] || []
          const ages = AGE_SUITABILITY[country.id] || []
          const budget = FAMILY_BUDGET[country.id] || []
          const safety = CHILD_SAFETY_TIPS[country.id] || []

          return (
            <section key={country.id} className="space-y-8">
              <h2 className="font-heading text-3xl font-bold text-[#0F172A]">
                <span className="mr-2">{country.flag}</span>{country.name}
              </h2>

              {/* Family-Friendly Attractions from Data */}
              {familyAttractions.length > 0 && (
                <div>
                  <h3 className="font-heading text-xl font-semibold text-[#0F172A] mb-3">
                    Family-Friendly Attractions
                    <span className="ml-2 text-sm font-normal text-[#0F172A]/50">({familyAttractions.length} spots)</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {familyAttractions.slice(0, 9).map((attr) => (
                      <div key={attr.id} className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-heading font-semibold text-[#0F172A] text-sm">{attr.name}</h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium shrink-0 ml-2">
                            {attr.category}
                          </span>
                        </div>
                        <p className="text-xs text-[#0F172A]/50 mb-2">{attr.cityName} &middot; {attr.visitDuration.noRush}</p>
                        <p className="text-sm text-[#0F172A]/70 line-clamp-2">{attr.description}</p>
                        {attr.entryFee && (
                          <p className="text-xs text-[#0EA5E9] mt-2 font-medium">{attr.entryFee}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Kid-Specific Activities */}
              {activities.length > 0 && (
                <div>
                  <h3 className="font-heading text-xl font-semibold text-[#0F172A] mb-3">Kid-Specific Activities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activities.map((act) => (
                      <div key={act.activity} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-heading font-semibold text-[#0F172A]">{act.activity}</h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9] font-medium shrink-0 ml-2">
                            {act.ageRange}
                          </span>
                        </div>
                        <p className="text-sm text-[#0F172A]/70 leading-relaxed">{act.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Age Suitability */}
              {ages.length > 0 && (
                <div>
                  <h3 className="font-heading text-xl font-semibold text-[#0F172A] mb-3">Age Suitability Guide</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ages.map((a) => (
                      <div key={a.age} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                        <h4 className="font-heading font-semibold text-[#0F172A] mb-2">{a.age}</h4>
                        <p className="text-sm text-[#0F172A]/70 leading-relaxed">{a.tips}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Family Budget */}
              {budget.length > 0 && (
                <div>
                  <h3 className="font-heading text-xl font-semibold text-[#0F172A] mb-3">Family Budget Guide</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden text-sm">
                      <thead>
                        <tr className="bg-[#0EA5E9]/5 border-b border-[#E2E8F0]">
                          <th className="text-left px-4 py-3 font-semibold text-[#0F172A]">Category</th>
                          <th className="text-left px-4 py-3 font-semibold text-[#0F172A]">Budget</th>
                          <th className="text-left px-4 py-3 font-semibold text-[#0F172A]">Mid-Range</th>
                          <th className="text-left px-4 py-3 font-semibold text-[#0F172A]">Comfort</th>
                        </tr>
                      </thead>
                      <tbody>
                        {budget.map((row, i) => (
                          <tr key={row.category} className={i % 2 === 1 ? 'bg-[#FAFBFC]' : ''}>
                            <td className="px-4 py-3 font-medium text-[#0F172A]">{row.category}</td>
                            <td className="px-4 py-3 text-[#0F172A]/70">{row.budget}</td>
                            <td className="px-4 py-3 text-[#0F172A]/70">{row.midRange}</td>
                            <td className="px-4 py-3 text-[#0F172A]/70">{row.comfort}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Child Safety */}
              {safety.length > 0 && (
                <div>
                  <h3 className="font-heading text-xl font-semibold text-[#0F172A] mb-3">Child Safety Tips</h3>
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                    <ul className="space-y-2">
                      {safety.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#0F172A]/80">
                          <span className="text-[#0EA5E9] font-bold mt-0.5 shrink-0">&bull;</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </section>
          )
        })}

        {/* Packing List */}
        <section className="space-y-4">
          <h2 className="font-heading text-3xl font-bold text-[#0F172A]">Family Packing Checklist</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PACKING_LIST.map((section) => (
              <div key={section.category} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                <h3 className="font-heading font-semibold text-[#0F172A] mb-3">{section.category}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#0F172A]/70">
                      <span className="text-[#0EA5E9] mt-0.5 shrink-0">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
