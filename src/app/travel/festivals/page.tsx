'use client'

import { useState, useMemo } from 'react'
import { COUNTRIES } from '@/data/travel/destinations'

/* ── Festival data ── */
interface Festival {
  name: string
  country: string
  countryFlag: string
  months: number[]          // 1-12
  dateLabel: string
  description: string
  crowdLevel: 'Extreme' | 'High' | 'Moderate'
  hotelImpact: string
  highlight: boolean
}

const FESTIVALS: Festival[] = [
  // Japan
  { name: 'Cherry Blossom Season (Hanami)', country: 'Japan', countryFlag: '\u{1F1EF}\u{1F1F5}', months: [3, 4], dateLabel: 'Late March -- Mid April', description: 'One of the most magical natural events in the world. Parks and riversides bloom with pink and white cherry blossoms. Locals picnic under the trees in a tradition called hanami.', crowdLevel: 'Extreme', hotelImpact: 'Hotels in Kyoto and Tokyo book out months ahead. Prices increase 50-100%. Book 3-6 months in advance.', highlight: true },
  { name: 'Gion Matsuri', country: 'Japan', countryFlag: '\u{1F1EF}\u{1F1F5}', months: [7], dateLabel: 'July (main parade July 17 & 24)', description: 'Kyoto\'s most famous festival dating back to 869 AD. Massive decorated floats (yamaboko) parade through the streets. Evening festivities (yoiyama) feature street food and yukata-clad locals.', crowdLevel: 'High', hotelImpact: 'Kyoto hotels surge in price. Book 2-3 months ahead. Consider staying in Osaka and taking the train.', highlight: false },
  { name: 'Obon Festival', country: 'Japan', countryFlag: '\u{1F1EF}\u{1F1F5}', months: [8], dateLabel: 'August 13--16', description: 'A Buddhist tradition honoring the spirits of ancestors. Bon-odori dances, floating lanterns, and fireworks mark the celebrations. Many Japanese travel to hometowns, making transport crowded.', crowdLevel: 'High', hotelImpact: 'Domestic travel peaks. Trains and flights are heavily booked. Reserve shinkansen seats well in advance.', highlight: false },
  { name: 'Japanese New Year (Shogatsu)', country: 'Japan', countryFlag: '\u{1F1EF}\u{1F1F5}', months: [1, 12], dateLabel: 'December 31 -- January 3', description: 'The most important holiday in Japan. Temples ring bells 108 times at midnight. Shrines overflow with hatsumode (first shrine visit) crowds. Special osechi ryori meals are prepared.', crowdLevel: 'Extreme', hotelImpact: 'Many businesses close Dec 29 -- Jan 3. Hotels in Kyoto and Tokyo are very expensive. Book months ahead.', highlight: false },

  // Italy
  { name: 'Carnival of Venice', country: 'Italy', countryFlag: '\u{1F1EE}\u{1F1F9}', months: [2], dateLabel: 'February (2 weeks before Ash Wednesday)', description: 'A spectacular masked festival dating to the 12th century. Elaborate costumes and ornate masks fill St. Mark\'s Square. Parades, gondola processions, and masquerade balls make it unforgettable.', crowdLevel: 'Extreme', hotelImpact: 'Venice hotel prices triple or more. Book 4-6 months ahead. Consider staying in Mestre for lower prices.', highlight: true },
  { name: 'Easter in Rome', country: 'Italy', countryFlag: '\u{1F1EE}\u{1F1F9}', months: [3, 4], dateLabel: 'March or April (varies yearly)', description: 'The Pope leads Easter Mass in St. Peter\'s Square for hundreds of thousands. The Via Crucis procession at the Colosseum on Good Friday is deeply moving. Churches display special artworks.', crowdLevel: 'Extreme', hotelImpact: 'Rome is at peak capacity during Holy Week. Prices increase 50-80%. Book 3+ months in advance.', highlight: false },
  { name: 'Palio di Siena', country: 'Italy', countryFlag: '\u{1F1EE}\u{1F1F9}', months: [7, 8], dateLabel: 'July 2 & August 16', description: 'A thrilling bareback horse race around Siena\'s Piazza del Campo dating to the 17th century. Neighborhoods (contrade) fiercely compete. Pageantry, flag-throwing, and incredible atmosphere.', crowdLevel: 'High', hotelImpact: 'Siena accommodation is nearly impossible to find last-minute. Book months ahead or stay in nearby towns.', highlight: true },
  { name: 'Ferragosto', country: 'Italy', countryFlag: '\u{1F1EE}\u{1F1F9}', months: [8], dateLabel: 'August 15', description: 'Italy\'s biggest summer holiday. Cities empty as Italians head to the coast. Fireworks, festivals, and beach parties across the country. Many shops and restaurants close in major cities.', crowdLevel: 'High', hotelImpact: 'Coastal hotels fully booked. Cities like Rome and Milan are quieter but some businesses close. Beach areas are packed.', highlight: false },

  // Thailand
  { name: 'Songkran Water Festival', country: 'Thailand', countryFlag: '\u{1F1F9}\u{1F1ED}', months: [4], dateLabel: 'April 13--15', description: 'Thai New Year celebrated with the world\'s biggest water fight. Streets transform into water battle zones. Temples hold traditional ceremonies, merit-making, and Buddha image washing.', crowdLevel: 'Extreme', hotelImpact: 'Hotels across Thailand book fast. Bangkok, Chiang Mai, and islands are most popular. Book 2-3 months ahead.', highlight: true },
  { name: 'Loy Krathong', country: 'Thailand', countryFlag: '\u{1F1F9}\u{1F1ED}', months: [11], dateLabel: 'November (full moon of 12th lunar month)', description: 'The festival of lights. Thousands of lotus-shaped krathongs with candles and flowers are floated on rivers and lakes. A stunning, peaceful celebration of gratitude to the water goddess.', crowdLevel: 'Moderate', hotelImpact: 'Popular destinations like Chiang Mai and Sukhothai see moderate price increases. Book 1-2 months ahead.', highlight: true },
  { name: 'Yi Peng Lantern Festival', country: 'Thailand', countryFlag: '\u{1F1F9}\u{1F1ED}', months: [11], dateLabel: 'November (alongside Loy Krathong)', description: 'Thousands of glowing paper lanterns (khom loi) are released into the night sky in Chiang Mai. One of the most photographed events in Asia. Some organized events require tickets.', crowdLevel: 'High', hotelImpact: 'Chiang Mai hotels book out quickly. Ticketed lantern release events sell out months in advance.', highlight: true },

  // France
  { name: 'Bastille Day', country: 'France', countryFlag: '\u{1F1EB}\u{1F1F7}', months: [7], dateLabel: 'July 14', description: 'France\'s national day with the largest military parade in Europe down the Champs-Elysees. Fireworks at the Eiffel Tower are legendary. Firefighter balls (Bals des Pompiers) are open to the public.', crowdLevel: 'High', hotelImpact: 'Paris hotels increase prices moderately. Most tourists are domestic. Public transport runs late.', highlight: true },
  { name: 'Tour de France', country: 'France', countryFlag: '\u{1F1EB}\u{1F1F7}', months: [7], dateLabel: 'July (3 weeks)', description: 'The world\'s most famous cycling race winds through French countryside and finishes on the Champs-Elysees. Watching from mountain stages in the Alps or Pyrenees is an incredible experience.', crowdLevel: 'Moderate', hotelImpact: 'Hotels along the route get busy on race days. Mountain towns book up early. Paris is busy for the final stage.', highlight: false },
  { name: 'Cannes Film Festival', country: 'France', countryFlag: '\u{1F1EB}\u{1F1F7}', months: [5], dateLabel: 'Mid-May (12 days)', description: 'The world\'s most prestigious film festival draws celebrities and cinephiles. The red carpet at Palais des Festivals is iconic. Public screenings on the beach (Cinema de la Plage) are free.', crowdLevel: 'High', hotelImpact: 'Cannes and nearby Nice hotel prices triple. Book 3-6 months ahead. The entire Cote d\'Azur gets expensive.', highlight: false },
  { name: 'Fete de la Musique', country: 'France', countryFlag: '\u{1F1EB}\u{1F1F7}', months: [6], dateLabel: 'June 21', description: 'Free live music fills every street, park, and square in France on the summer solstice. Genres range from classical to electronic. Every city and village participates in this joyous celebration.', crowdLevel: 'Moderate', hotelImpact: 'Minimal hotel impact. A wonderful bonus if you happen to be in France on this date.', highlight: false },

  // India
  { name: 'Diwali (Festival of Lights)', country: 'India', countryFlag: '\u{1F1EE}\u{1F1F3}', months: [10, 11], dateLabel: 'October or November (varies yearly)', description: 'India\'s biggest festival celebrating the victory of light over darkness. Oil lamps (diyas), fireworks, rangoli art, and sweets transform the entire country. Varanasi\'s ghats glow with millions of lamps.', crowdLevel: 'Extreme', hotelImpact: 'Domestic travel peaks. Hotels in major cities and Varanasi book up fast. Flights are expensive. Book 2-3 months ahead.', highlight: true },
  { name: 'Holi (Festival of Colors)', country: 'India', countryFlag: '\u{1F1EE}\u{1F1F3}', months: [3], dateLabel: 'March (full moon day)', description: 'The exuberant festival where people throw colored powders and water at each other. Marks the arrival of spring and the triumph of good over evil. Mathura and Vrindavan celebrations are legendary.', crowdLevel: 'High', hotelImpact: 'Hotels in Rajasthan and UP increase prices. Organized Holi events sell out. Wear old clothes you do not mind ruining.', highlight: true },
  { name: 'Navratri & Durga Puja', country: 'India', countryFlag: '\u{1F1EE}\u{1F1F3}', months: [10], dateLabel: 'October (9 nights)', description: 'Nine nights of dance (Garba in Gujarat), worship, and celebration of the goddess Durga. Kolkata\'s Durga Puja is UNESCO-recognized with spectacular pandals (artistic temporary temples).', crowdLevel: 'High', hotelImpact: 'Gujarat and Kolkata hotels book up weeks ahead. Kolkata comes alive with pandal-hopping crowds.', highlight: false },
  { name: 'Republic Day', country: 'India', countryFlag: '\u{1F1EE}\u{1F1F3}', months: [1], dateLabel: 'January 26', description: 'India\'s grand national celebration with a spectacular military and cultural parade down Rajpath in New Delhi. Elaborate floats represent each state. Tickets for the parade are highly sought after.', crowdLevel: 'High', hotelImpact: 'Delhi hotels increase prices around Jan 26. Security is heightened. Book a week ahead minimum.', highlight: false },
  { name: 'Pushkar Camel Fair', country: 'India', countryFlag: '\u{1F1EE}\u{1F1F3}', months: [11], dateLabel: 'November (5 days around full moon)', description: 'One of the world\'s largest camel fairs in the holy city of Pushkar, Rajasthan. Thousands of camels, horses, and cattle are traded. Cultural events, music, and the sacred Pushkar Lake add magic.', crowdLevel: 'High', hotelImpact: 'Pushkar has limited accommodation. Luxury tent camps book out months ahead. Nearby Ajmer is an alternative.', highlight: true },
]

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

function CrowdBadge({ level }: { level: Festival['crowdLevel'] }) {
  const colors: Record<string, string> = {
    Extreme: 'bg-red-100 text-red-600',
    High: 'bg-orange-100 text-orange-700',
    Moderate: 'bg-amber-100 text-amber-700',
  }
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[level]}`}>
      {level} crowds
    </span>
  )
}

export default function FestivalsPage() {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  const filteredFestivals = useMemo(() => {
    return FESTIVALS.filter((f) => {
      if (selectedMonth && !f.months.includes(selectedMonth)) return false
      if (selectedCountry) {
        const countryObj = COUNTRIES.find((c) => c.id === selectedCountry || c.slug === selectedCountry);
        if (!countryObj || f.country !== countryObj.name) return false;
      }
      return true
    })
  }, [selectedMonth, selectedCountry])

  const highlights = FESTIVALS.filter((f) => f.highlight)

  /* calendar grid: for each month, which festivals fall in it */
  const calendarData = MONTH_NAMES.map((name, i) => ({
    name,
    short: MONTH_SHORT[i],
    month: i + 1,
    festivals: FESTIVALS.filter((f) => f.months.includes(i + 1)),
  }))

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* ── Header ── */}
      <div className="mb-12 text-center">
        <h1 className="font-heading text-4xl font-bold text-dark sm:text-5xl">
          Festivals &amp; Events Calendar
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-dark/70">
          Plan your trip around the world&apos;s most incredible celebrations. From cherry blossoms in Japan to Diwali in India.
        </p>
      </div>

      {/* ── Best Festivals Highlight ── */}
      <div className="mb-12 rounded-2xl border border-border bg-gradient-to-br from-secondary/5 to-primary/5 p-8 shadow-sm">
        <h2 className="font-heading text-2xl font-bold text-dark mb-2 text-center">
          Best Festivals to Plan Your Trip Around
        </h2>
        <p className="text-sm text-dark/60 text-center mb-6">These festivals are bucket-list experiences worth building an entire trip around</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((f) => (
            <div
              key={f.name}
              className="rounded-xl bg-card-bg border border-border/50 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{f.countryFlag}</span>
                <span className="rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-semibold text-secondary">
                  Must-See
                </span>
              </div>
              <h3 className="font-heading text-base font-bold text-dark mt-1">{f.name}</h3>
              <p className="text-xs text-primary font-medium mt-1">{f.dateLabel}</p>
              <p className="text-xs text-dark/70 mt-2 leading-relaxed line-clamp-3">{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Monthly Calendar View ── */}
      <div className="mb-12 rounded-2xl border border-border bg-card-bg p-6 shadow-sm">
        <h2 className="font-heading text-2xl font-bold text-dark mb-6">Monthly Calendar</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {calendarData.map((m) => (
            <button
              key={m.month}
              onClick={() => setSelectedMonth(selectedMonth === m.month ? null : m.month)}
              className={`rounded-xl border p-3 text-left transition-all ${
                selectedMonth === m.month
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border/50 bg-page-bg hover:border-primary/30'
              }`}
            >
              <span className="block text-sm font-bold text-dark">{m.short}</span>
              <span className="block text-xs text-dark/50 mt-1">
                {m.festivals.length} {m.festivals.length === 1 ? 'festival' : 'festivals'}
              </span>
              <div className="mt-2 flex flex-wrap gap-1">
                {m.festivals.slice(0, 3).map((f) => (
                  <span key={f.name} className="text-xs" title={f.name}>
                    {f.countryFlag}
                  </span>
                ))}
                {m.festivals.length > 3 && (
                  <span className="text-xs text-dark/40">+{m.festivals.length - 3}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-dark/70">Filter by country:</span>
          <button
            onClick={() => setSelectedCountry(null)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              !selectedCountry
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-card-bg text-dark/70 border border-border hover:border-primary/40'
            }`}
          >
            All Countries
          </button>
          {COUNTRIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCountry(selectedCountry === c.id ? null : c.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCountry === c.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-card-bg text-dark/70 border border-border hover:border-primary/40'
              }`}
            >
              {c.flag} {c.name}
            </button>
          ))}
        </div>
        {selectedMonth && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-dark/70">Showing festivals in:</span>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {MONTH_NAMES[selectedMonth - 1]}
            </span>
            <button
              onClick={() => setSelectedMonth(null)}
              className="text-xs text-dark/50 hover:text-primary underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* ── Festival List ── */}
      <div className="space-y-4">
        {filteredFestivals.length === 0 && (
          <div className="rounded-2xl border border-border bg-card-bg p-12 text-center shadow-sm">
            <p className="text-dark/50">No festivals match the current filters. Try a different month or country.</p>
          </div>
        )}
        {filteredFestivals.map((f) => (
          <div
            key={f.name}
            className="rounded-2xl border border-border bg-card-bg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{f.countryFlag}</span>
                  <h3 className="font-heading text-lg font-bold text-dark">{f.name}</h3>
                  {f.highlight && (
                    <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-semibold text-secondary">
                      Must-See
                    </span>
                  )}
                </div>
                <p className="text-sm text-primary font-medium">{f.dateLabel} &middot; {f.country}</p>
              </div>
              <CrowdBadge level={f.crowdLevel} />
            </div>
            <p className="text-sm text-dark/70 leading-relaxed mb-4">{f.description}</p>
            <div className="rounded-xl bg-page-bg border border-border/50 p-4">
              <div className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 mt-0.5">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </span>
                <div>
                  <span className="text-xs font-semibold text-dark/80 uppercase tracking-wide">Travel Impact</span>
                  <p className="text-sm text-dark/70 mt-0.5 leading-relaxed">{f.hotelImpact}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
