'use client'

import { useMemo } from 'react'
import { COUNTRIES } from '@/data/travel/destinations'
import type { Attraction } from '@/data/travel/destinations'

/* ── Pull accessibility data from attractions ── */
function getAllAttractions(): (Attraction & { cityName: string; countryName: string })[] {
  const results: (Attraction & { cityName: string; countryName: string })[] = []
  for (const country of COUNTRIES) {
    for (const state of country.states) {
      for (const city of state.cities) {
        for (const a of city.attractions) {
          results.push({ ...a, cityName: city.name, countryName: country.name })
        }
      }
    }
  }
  return results
}

/* ── Country transport accessibility ── */
const TRANSPORT_ACCESS: Record<string, { mode: string; rating: string; details: string }[]> = {
  japan: [
    { mode: 'Trains & Metro', rating: 'Excellent', details: 'Most major stations have elevators, tactile paving, and ramps. Priority seating available. Staff assist with boarding ramps for wheelchair users.' },
    { mode: 'Buses', rating: 'Good', details: 'Many city buses are low-floor with ramps. Kneel function available. Rural buses may be less accessible.' },
    { mode: 'Taxis', rating: 'Good', details: 'Universal Design taxis (Toyota JPN Taxi) are increasingly common. Rear ramp for wheelchair access. Book through hotel for easiest experience.' },
    { mode: 'Bullet Trains', rating: 'Excellent', details: 'Shinkansen has designated wheelchair spaces, accessible restrooms, and staff assistance. Book wheelchair seats in advance through JR offices.' },
  ],
  italy: [
    { mode: 'Trains', rating: 'Moderate', details: 'Newer Frecciarossa and Frecciargento trains have wheelchair spaces. Older regional trains are less accessible. Book Sala Blu assistance 48 hours ahead.' },
    { mode: 'Metro', rating: 'Limited', details: 'Rome Metro has elevators at some stations but many are out of service. Milan Metro is better equipped. Florence and Venice have no metro.' },
    { mode: 'Buses', rating: 'Moderate', details: 'Most city buses have low floors and ramps. Water buses (vaporetti) in Venice have limited accessibility.' },
    { mode: 'Taxis', rating: 'Moderate', details: 'Accessible taxis must be pre-booked. Few are wheelchair-adapted. Hotels can arrange accessible transfers.' },
  ],
  thailand: [
    { mode: 'BTS/MRT', rating: 'Good', details: 'Bangkok BTS Skytrain and MRT have elevators at most stations. Staff available to help. Gaps between platform and train can be challenging.' },
    { mode: 'Buses', rating: 'Limited', details: 'Most city buses are not wheelchair accessible. Air-conditioned buses are slightly better. Minivans to other cities are inaccessible.' },
    { mode: 'Taxis', rating: 'Limited', details: 'Standard taxis cannot accommodate wheelchairs. Grab (ride-hailing) is the best option. Wheelchair-accessible vehicles must be specially arranged.' },
    { mode: 'Tuk-Tuks', rating: 'Not Accessible', details: 'Not suitable for wheelchair users. Open sides are also difficult for mobility-impaired travelers.' },
  ],
  france: [
    { mode: 'TGV Trains', rating: 'Excellent', details: 'All TGV trains have wheelchair spaces, accessible toilets, and boarding assistance. Book "Accueil Plus" service through SNCF for station assistance.' },
    { mode: 'Paris Metro', rating: 'Limited', details: 'Most stations lack elevators (built in 1900). Line 14 and RER Line A are the most accessible. Buses are a better option in Paris.' },
    { mode: 'Buses', rating: 'Good', details: 'All Paris RATP buses are wheelchair accessible with ramps. Drivers lower the bus and deploy ramps on request.' },
    { mode: 'Taxis', rating: 'Good', details: 'G7 Access taxis in Paris are wheelchair-adapted. Book via app or call center. Uber also offers accessible vehicle options.' },
  ],
  india: [
    { mode: 'Metro', rating: 'Good', details: 'Delhi Metro is among the most accessible transit systems in India with elevators, tactile paths, and wheelchair spaces. Mumbai and Bangalore metros are newer and accessible.' },
    { mode: 'Trains', rating: 'Limited', details: 'Long-distance trains have limited accessibility. Newer Vande Bharat Express trains are better. Railway stations are working on adding elevators and ramps.' },
    { mode: 'Buses', rating: 'Limited', details: 'Most city and intercity buses are not wheelchair accessible. AC Volvo buses in some cities have lower floors.' },
    { mode: 'Auto-Rickshaws', rating: 'Not Accessible', details: 'Not suitable for wheelchair users. Pre-book accessible vehicles through hotels or tour operators specializing in accessible travel.' },
  ],
}

/* ── Resources ── */
const ORGANIZATIONS = [
  { name: 'Accessible Travel Online', url: 'accessibletravelonline.com', desc: 'Database of accessible hotels, tours, and destinations worldwide' },
  { name: 'Wheel the World', url: 'wheeltheworld.com', desc: 'Book verified accessible travel experiences and accommodations' },
  { name: 'Sage Traveling', url: 'sagetraveling.com', desc: 'European accessible travel specialists with detailed city guides' },
  { name: 'Enable Holidays', url: 'enableholidays.com', desc: 'Accessible holiday packages with adapted equipment and support' },
  { name: 'Tourism for All (UK)', url: 'tourismforall.org.uk', desc: 'UK charity promoting accessible tourism with an information service' },
  { name: 'Disability Travel', url: 'disabilitytravel.com', desc: 'Travel agency specializing in accessible vacations and cruises' },
]

const BOOKING_PLATFORMS = [
  { name: 'Booking.com', feature: 'Filter by "wheelchair accessible" and "roll-in shower"' },
  { name: 'Airbnb', feature: 'Accessibility filters for step-free access, wide doorways, and adapted bathrooms' },
  { name: 'Handiscover', feature: 'Dedicated platform for accessible accommodation with verified details' },
  { name: 'Accomable (Airbnb)', feature: 'Now merged with Airbnb accessibility features' },
]

function RatingBadge({ rating }: { rating: string }) {
  const colors: Record<string, string> = {
    Excellent: 'bg-emerald-100 text-emerald-700',
    Good: 'bg-blue-100 text-blue-700',
    Moderate: 'bg-amber-100 text-amber-700',
    Limited: 'bg-orange-100 text-orange-700',
    'Not Accessible': 'bg-red-100 text-red-600',
  }
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[rating] || 'bg-gray-100 text-gray-700'}`}>
      {rating}
    </span>
  )
}

export default function AccessibilityGuidePage() {
  const allAttractions = useMemo(() => getAllAttractions(), [])

  const fullyAccessible = allAttractions.filter((a) => a.accessibilityRating === 'fully')
  const partiallyAccessible = allAttractions.filter((a) => a.accessibilityRating === 'partial')
  const familyFriendly = allAttractions.filter((a) => a.familyFriendly)

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* ── Header ── */}
      <div className="mb-12 text-center">
        <h1 className="font-heading text-4xl font-bold text-dark sm:text-5xl">
          Accessible Travel Guide
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-dark/70">
          Travel should be for everyone. Find wheelchair-accessible destinations, family-friendly attractions, and resources for travelers of all abilities.
        </p>
      </div>

      {/* ── General Accessibility Tips ── */}
      <div className="mb-10 rounded-2xl border border-border bg-card-bg p-6 shadow-sm">
        <h2 className="font-heading text-2xl font-bold text-dark mb-6">General Accessibility Tips</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { title: 'Plan Ahead', tip: 'Contact hotels and attractions in advance to confirm specific accessibility features. Website descriptions may not be fully up to date.' },
            { title: 'Travel Insurance', tip: 'Get comprehensive travel insurance that covers pre-existing conditions and medical equipment. Verify coverage for mobility aids and assistive devices.' },
            { title: 'Airport Assistance', tip: 'Request special assistance when booking flights. Airlines provide wheelchair service, priority boarding, and aisle chairs at no extra charge.' },
            { title: 'Medication & Equipment', tip: 'Carry medical documentation, extra medication, and essential equipment in carry-on luggage. Pack a basic repair kit for wheelchairs or mobility aids.' },
            { title: 'Accessible Accommodation', tip: 'Book rooms on ground floors or near elevators. Confirm roll-in showers, grab bars, and doorway widths meet your needs.' },
            { title: 'Local SOS Info', tip: 'Save local emergency numbers, accessible taxi services, and nearest hospitals with your specific medical needs noted.' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl bg-page-bg border border-border/50 p-4">
              <h3 className="font-semibold text-dark mb-1">{item.title}</h3>
              <p className="text-sm text-dark/70 leading-relaxed">{item.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Wheelchair-Accessible Attractions ── */}
      <div className="mb-10 rounded-2xl border border-border bg-card-bg p-6 shadow-sm">
        <h2 className="font-heading text-2xl font-bold text-dark mb-2">
          Fully Wheelchair-Accessible Attractions
        </h2>
        <p className="text-sm text-dark/60 mb-6">{fullyAccessible.length} attractions rated &quot;fully accessible&quot; across all destinations</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {fullyAccessible.map((a) => (
            <div key={a.id} className="rounded-xl bg-page-bg border border-border/50 p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  Fully Accessible
                </span>
              </div>
              <h3 className="font-semibold text-dark text-sm mt-2">{a.name}</h3>
              <p className="text-xs text-dark/60 mt-0.5">{a.cityName}, {a.countryName}</p>
              <p className="text-xs text-dark/50 mt-1">{a.category} &middot; Entry: {a.entryFee}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Partially Accessible ── */}
      <div className="mb-10 rounded-2xl border border-border bg-card-bg p-6 shadow-sm">
        <h2 className="font-heading text-2xl font-bold text-dark mb-2">
          Partially Accessible Attractions
        </h2>
        <p className="text-sm text-dark/60 mb-6">{partiallyAccessible.length} attractions with partial accessibility -- some areas may have steps or uneven terrain</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {partiallyAccessible.map((a) => (
            <div key={a.id} className="rounded-xl bg-page-bg border border-border/50 p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  Partial Access
                </span>
              </div>
              <h3 className="font-semibold text-dark text-sm mt-2">{a.name}</h3>
              <p className="text-xs text-dark/60 mt-0.5">{a.cityName}, {a.countryName}</p>
              <p className="text-xs text-dark/50 mt-1">{a.category} &middot; Entry: {a.entryFee}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Family & Stroller Friendliness ── */}
      <div className="mb-10 rounded-2xl border border-border bg-card-bg p-6 shadow-sm">
        <h2 className="font-heading text-2xl font-bold text-dark mb-2">
          Family &amp; Stroller-Friendly Attractions
        </h2>
        <p className="text-sm text-dark/60 mb-6">{familyFriendly.length} attractions marked as family-friendly</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {familyFriendly.slice(0, 12).map((a) => (
            <div key={a.id} className="rounded-xl bg-page-bg border border-border/50 p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                  Family Friendly
                </span>
              </div>
              <h3 className="font-semibold text-dark text-sm mt-2">{a.name}</h3>
              <p className="text-xs text-dark/60 mt-0.5">{a.cityName}, {a.countryName}</p>
              <p className="text-xs text-dark/50 mt-1">
                {a.accessibilityRating === 'fully' ? 'Wheelchair accessible' : a.accessibilityRating === 'partial' ? 'Partial wheelchair access' : 'Limited wheelchair access'}
              </p>
            </div>
          ))}
        </div>
        {familyFriendly.length > 12 && (
          <p className="mt-4 text-center text-sm text-dark/50">
            + {familyFriendly.length - 12} more family-friendly attractions across all destinations
          </p>
        )}
      </div>

      {/* ── Elderly Traveler Considerations ── */}
      <div className="mb-10 rounded-2xl border border-border bg-card-bg p-6 shadow-sm">
        <h2 className="font-heading text-2xl font-bold text-dark mb-6">Elderly Traveler Considerations</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { title: 'Pace Your Itinerary', tip: 'Plan no more than 2-3 major activities per day. Include rest breaks and allow extra time for walking between sites. Afternoon rest is highly recommended.' },
            { title: 'Comfortable Footwear', tip: 'Cobblestones in Italy and France, temple steps in Thailand and Japan -- sturdy, non-slip shoes are essential. Break them in before the trip.' },
            { title: 'Medical Preparedness', tip: 'Carry a translated list of medications and conditions. Research hospitals near your hotel. Bring extra prescription medication in original packaging.' },
            { title: 'Climate Considerations', tip: 'Avoid midday heat in Thailand and India (11 AM - 3 PM). Stay hydrated. Japan and France can be very hot in summer -- schedule outdoor activities for morning.' },
            { title: 'Seating & Rest', tip: 'Carry a lightweight folding seat for queues at popular attractions. Many museums offer folding stools for loan -- ask at the entrance.' },
            { title: 'Travel Insurance', tip: 'Essential for travelers over 65. Ensure comprehensive coverage including medical evacuation, as some standard policies exclude older travelers.' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl bg-page-bg border border-border/50 p-4">
              <h3 className="font-semibold text-dark mb-1">{item.title}</h3>
              <p className="text-sm text-dark/70 leading-relaxed">{item.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sensory-Friendly Travel Tips ── */}
      <div className="mb-10 rounded-2xl border border-border bg-card-bg p-6 shadow-sm">
        <h2 className="font-heading text-2xl font-bold text-dark mb-6">Sensory-Friendly Travel Tips</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { title: 'Noise Reduction', tip: 'Pack noise-canceling headphones for airports, trains, and crowded markets. Many museums offer quiet hours -- check websites for schedules.' },
            { title: 'Visual Sensitivities', tip: 'Carry sunglasses and a hat for bright environments. Ask hotels for rooms away from neon signs. Japan and Thailand can be visually overwhelming at night.' },
            { title: 'Quiet Spaces', tip: 'Identify calm retreats: Japanese gardens, European parks, temple grounds. Build recovery time into your schedule after busy activities.' },
            { title: 'Dietary Needs', tip: 'For sensory issues with food textures, research local cuisines in advance. Japan and Thailand especially have diverse textures. Carry safe snacks.' },
            { title: 'Routine Maintenance', tip: 'Keep consistent sleep and meal times where possible. Pack familiar comfort items. Book accommodation with kitchen access for dietary control.' },
            { title: 'Communication Cards', tip: 'Prepare printed cards in the local language explaining your needs. Apps like Proloquo2Go support AAC (Augmentative and Alternative Communication).' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl bg-page-bg border border-border/50 p-4">
              <h3 className="font-semibold text-dark mb-1">{item.title}</h3>
              <p className="text-sm text-dark/70 leading-relaxed">{item.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Accessible Transport by Country ── */}
      <div className="mb-10 rounded-2xl border border-border bg-card-bg p-6 shadow-sm">
        <h2 className="font-heading text-2xl font-bold text-dark mb-6">Accessible Transport by Country</h2>
        <div className="space-y-6">
          {COUNTRIES.map((c) => {
            const transData = TRANSPORT_ACCESS[c.id]
            if (!transData) return null
            return (
              <div key={c.id} className="rounded-xl bg-page-bg border border-border/50 p-5">
                <h3 className="font-heading text-lg font-bold text-dark mb-4">
                  {c.flag} {c.name}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {transData.map((t) => (
                    <div key={t.mode} className="rounded-lg bg-card-bg border border-border/50 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-dark">{t.mode}</span>
                        <RatingBadge rating={t.rating} />
                      </div>
                      <p className="text-xs text-dark/70 leading-relaxed">{t.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Resources ── */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card-bg p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-dark mb-4">
            Disability Travel Organizations
          </h2>
          <div className="space-y-3">
            {ORGANIZATIONS.map((org) => (
              <div key={org.name} className="rounded-lg bg-page-bg border border-border/50 p-3">
                <h3 className="font-semibold text-sm text-primary">{org.name}</h3>
                <p className="text-xs text-dark/50 mb-1">{org.url}</p>
                <p className="text-xs text-dark/70">{org.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card-bg p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-dark mb-4">
            Accessible Booking Platforms
          </h2>
          <div className="space-y-3">
            {BOOKING_PLATFORMS.map((p) => (
              <div key={p.name} className="rounded-lg bg-page-bg border border-border/50 p-3">
                <h3 className="font-semibold text-sm text-dark">{p.name}</h3>
                <p className="text-xs text-dark/70 mt-1">{p.feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
