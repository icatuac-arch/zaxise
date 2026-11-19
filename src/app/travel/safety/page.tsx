'use client'

import { COUNTRIES } from '@/data/travel/destinations'

const SAFETY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  high: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'High' },
  moderate: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Moderate' },
  low: { bg: 'bg-red-100', text: 'text-red-800', label: 'Low' },
}

const GENERAL_TIPS = [
  'Register with your country\'s embassy before traveling abroad.',
  'Keep digital and physical copies of your passport, visa, and travel insurance.',
  'Research local laws and customs before you arrive — ignorance is not a defense.',
  'Avoid displaying expensive jewelry, electronics, or large amounts of cash.',
  'Use ATMs inside banks rather than standalone machines on the street.',
  'Share your itinerary with a trusted friend or family member back home.',
  'Purchase comprehensive travel insurance that covers medical evacuation.',
  'Stay aware of your surroundings, especially in crowded tourist areas.',
  'Learn a few basic phrases in the local language, including "help" and "emergency."',
  'Keep emergency contacts saved offline on your phone and written on paper.',
]

const SOLO_TRAVEL_TIPS = [
  'Stay in well-reviewed hostels or hotels in central, well-lit areas.',
  'Tell hotel staff or a friend your daily plans and expected return time.',
  'Trust your instincts — if a situation feels wrong, leave immediately.',
  'Avoid walking alone late at night in unfamiliar neighborhoods.',
  'Use official taxis or ride-share apps rather than unmarked vehicles.',
  'Keep a doorstop alarm for extra hotel room security.',
  'Join group tours or walking tours to meet other travelers safely.',
]

const SOLO_FEMALE_TIPS = [
  'Research dress codes and cultural norms around women in your destination.',
  'Carry a personal alarm or whistle within easy reach.',
  'Avoid sharing personal details (hotel name, room number) with strangers.',
  'Book ground-floor rooms with caution — upper floors can be safer.',
  'Use a money belt or hidden pouch for valuables under clothing.',
  'Consider wearing a fake wedding ring in conservative regions.',
  'Connect with female traveler communities online before and during your trip.',
  'Pre-book airport transfers for late-night arrivals.',
]

const COMMON_SCAMS: Record<string, { scam: string; howToAvoid: string }[]> = {
  Asia: [
    { scam: 'Tuk-tuk drivers offering "free" city tours that end at gem shops', howToAvoid: 'Politely decline and use metered taxis or ride-share apps.' },
    { scam: 'Temple or attraction "closed today" — redirected to a shop', howToAvoid: 'Check official hours online and walk to the entrance yourself.' },
    { scam: 'Inflated taxi meters or "broken" meters', howToAvoid: 'Agree on a price before getting in, or insist on the meter.' },
    { scam: 'Fake monks asking for donations', howToAvoid: 'Real monks do not solicit money on the street.' },
  ],
  Europe: [
    { scam: 'Petition signers who distract you while an accomplice pickpockets', howToAvoid: 'Do not stop or engage — keep walking.' },
    { scam: 'Friendship bracelet scam — someone ties a bracelet and demands payment', howToAvoid: 'Keep your hands in your pockets and firmly say "no."' },
    { scam: 'Fake police asking to see your wallet for "counterfeit inspection"', howToAvoid: 'Real police will not ask to inspect your cash. Walk to the nearest station.' },
    { scam: 'Restaurant overcharging via unmarked "tourist menus"', howToAvoid: 'Ask for a printed menu with prices before ordering.' },
  ],
}

const ADVISORY_SITES = [
  { name: 'US State Department — Travel Advisories', url: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.html/' },
  { name: 'UK FCDO — Foreign Travel Advice', url: 'https://www.gov.uk/foreign-travel-advice' },
  { name: 'Australian DFAT — Smartraveller', url: 'https://www.smartraveller.gov.au/' },
]

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Travel Safety Guide</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Stay informed and travel confidently. Safety ratings, tips, scam alerts, and emergency contacts for every destination.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
        {/* Safety Ratings */}
        <section>
          <h2 className="font-heading text-3xl font-bold text-[#0F172A] mb-6">Country Safety Ratings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COUNTRIES.map((country) => {
              const rating = SAFETY_COLORS[country.safetyRating]
              return (
                <div
                  key={country.id}
                  className="bg-white rounded-xl border border-[#E2E8F0] p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-4xl">{country.flag}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-lg font-semibold text-[#0F172A] truncate">{country.name}</h3>
                    <p className="text-sm text-[#0F172A]/60">{country.continent}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${rating.bg} ${rating.text}`}>
                    {rating.label}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        {/* General Tips */}
        <section>
          <h2 className="font-heading text-3xl font-bold text-[#0F172A] mb-6">10 Essential Safety Tips</h2>
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <ol className="space-y-3">
              {GENERAL_TIPS.map((tip, i) => (
                <li key={i} className="flex gap-3 text-[#0F172A]">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#0EA5E9] text-white flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{tip}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Solo Travel */}
        <section>
          <h2 className="font-heading text-3xl font-bold text-[#0F172A] mb-6">Solo Travel Safety</h2>
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <ul className="space-y-2">
              {SOLO_TRAVEL_TIPS.map((tip, i) => (
                <li key={i} className="flex gap-3 text-[#0F172A]">
                  <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-[#0EA5E9]" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Solo Female Traveler */}
        <section>
          <h2 className="font-heading text-3xl font-bold text-[#0F172A] mb-6">Solo Female Traveler Tips</h2>
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <ul className="space-y-2">
              {SOLO_FEMALE_TIPS.map((tip, i) => (
                <li key={i} className="flex gap-3 text-[#0F172A]">
                  <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-[#F59E0B]" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Common Scams */}
        <section>
          <h2 className="font-heading text-3xl font-bold text-[#0F172A] mb-6">Common Scams by Region</h2>
          <div className="space-y-6">
            {Object.entries(COMMON_SCAMS).map(([region, scams]) => (
              <div key={region} className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                <h3 className="font-heading text-xl font-semibold text-[#0F172A] mb-4">{region}</h3>
                <div className="space-y-4">
                  {scams.map((s, i) => (
                    <div key={i} className="border-l-4 border-[#F59E0B] pl-4">
                      <p className="font-semibold text-[#0F172A]">{s.scam}</p>
                      <p className="text-sm text-[#0F172A]/70 mt-1">
                        <span className="font-medium text-[#0EA5E9]">How to avoid:</span> {s.howToAvoid}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency Numbers */}
        <section>
          <h2 className="font-heading text-3xl font-bold text-[#0F172A] mb-6">Emergency Numbers</h2>
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#0EA5E9]/10">
                    <th className="px-6 py-3 font-heading font-semibold text-[#0F172A]">Country</th>
                    <th className="px-6 py-3 font-heading font-semibold text-[#0F172A]">Service</th>
                    <th className="px-6 py-3 font-heading font-semibold text-[#0F172A]">Number</th>
                  </tr>
                </thead>
                <tbody>
                  {COUNTRIES.map((country) =>
                    country.emergencyNumbers.map((en, i) => (
                      <tr key={`${country.id}-${i}`} className="border-t border-[#E2E8F0] hover:bg-[#FAFBFC]">
                        {i === 0 ? (
                          <td className="px-6 py-3 font-medium text-[#0F172A]" rowSpan={country.emergencyNumbers.length}>
                            <span className="mr-2">{country.flag}</span>
                            {country.name}
                          </td>
                        ) : null}
                        <td className="px-6 py-3 text-[#0F172A]/80">{en.service}</td>
                        <td className="px-6 py-3 font-mono font-semibold text-[#0EA5E9]">{en.number}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Official Advisory Sites */}
        <section>
          <h2 className="font-heading text-3xl font-bold text-[#0F172A] mb-6">Official Travel Advisory Sites</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ADVISORY_SITES.map((site) => (
              <a
                key={site.name}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md hover:border-[#0EA5E9] transition-all group"
              >
                <h3 className="font-heading text-base font-semibold text-[#0F172A] group-hover:text-[#0EA5E9] transition-colors">
                  {site.name}
                </h3>
                <p className="text-sm text-[#0EA5E9] mt-2 truncate">{site.url}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
