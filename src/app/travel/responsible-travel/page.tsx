'use client'

const ETHICAL_PRINCIPLES = [
  'Respect local cultures, traditions, and customs — you are a guest in someone else\'s home.',
  'Learn basic greetings and phrases in the local language before you arrive.',
  'Ask permission before photographing people, especially children and indigenous communities.',
  'Support locally owned businesses, restaurants, and guides rather than international chains.',
  'Minimize your environmental footprint — reduce waste, conserve water, and avoid single-use plastics.',
  'Pay fair prices — aggressive haggling can undermine local livelihoods.',
  'Avoid attractions that exploit animals, children, or vulnerable communities.',
  'Dress appropriately when visiting religious or sacred sites.',
  'Leave natural and cultural sites as you found them — take only photos, leave only footprints.',
  'Educate yourself about the history and socio-political context of your destination before you travel.',
]

const VOLUNTEER_OPPORTUNITIES = [
  {
    type: 'Teaching English',
    icon: '\uD83D\uDCDA',
    countries: [
      {
        name: 'Thailand',
        flag: '\uD83C\uDDF9\uD83C\uDDED',
        programs: [
          'Rural school teaching assistantships in Isaan and northern hill tribe communities.',
          'Conversation practice programs at Buddhist monasteries (monks learning English).',
          'After-school tutoring programs in Chiang Mai and Chiang Rai villages.',
        ],
      },
      {
        name: 'India',
        flag: '\uD83C\uDDEE\uD83C\uDDF3',
        programs: [
          'English literacy programs in Rajasthan rural schools.',
          'Women\'s empowerment classes combining English with vocational skills in Kerala.',
          'After-school programs for children in Delhi and Mumbai slum communities.',
        ],
      },
    ],
  },
  {
    type: 'Conservation',
    icon: '\uD83C\uDF3F',
    countries: [
      {
        name: 'Thailand',
        flag: '\uD83C\uDDF9\uD83C\uDDED',
        programs: [
          'Elephant sanctuary rehabilitation — caring for rescued elephants in Chiang Mai and Kanchanaburi.',
          'Marine conservation — coral reef restoration and sea turtle monitoring in Koh Tao and Koh Lanta.',
          'Gibbon rehabilitation and rainforest reforestation projects in Phuket and Khao Sok.',
        ],
      },
      {
        name: 'India',
        flag: '\uD83C\uDDEE\uD83C\uDDF3',
        programs: [
          'Tiger reserve monitoring and anti-poaching patrols in Ranthambore and Bandhavgarh.',
          'Snow leopard conservation research in Ladakh and Spiti Valley.',
          'Mangrove restoration and coastal ecosystem protection in the Sundarbans.',
        ],
      },
    ],
  },
  {
    type: 'Community Building',
    icon: '\uD83C\uDFE0',
    countries: [
      {
        name: 'India',
        flag: '\uD83C\uDDEE\uD83C\uDDF3',
        programs: [
          'Rural infrastructure projects — building water filtration systems in Rajasthan.',
          'Women\'s cooperative support — helping artisan communities market handmade goods.',
          'Healthcare outreach in remote Himalayan villages in Uttarakhand.',
        ],
      },
      {
        name: 'Thailand',
        flag: '\uD83C\uDDF9\uD83C\uDDED',
        programs: [
          'Sustainable farming workshops with hill tribe communities in northern Thailand.',
          'Community centre construction and renovation in rural Isaan villages.',
          'Youth mentorship and skill-building programs in Bangkok\'s underserved neighborhoods.',
        ],
      },
    ],
  },
]

const RED_FLAGS = [
  'No clear mission, goals, or measurable impact reports.',
  'Orphanage visits that allow drop-in tourist contact with children — often a front for exploitation.',
  'Programs that require no skills, background checks, or minimum time commitment.',
  'Organizations that prioritize volunteer experience over community needs.',
  'Fees are opaque — you cannot see where your money goes.',
]

const GREEN_FLAGS = [
  'Transparent financials showing how fees support the community directly.',
  'Long-term partnerships with local organizations and community leaders.',
  'Background checks and minimum commitment periods (usually 2+ weeks).',
  'Programs designed and led by local people, not foreign organizations.',
  'Clear impact metrics and published annual reports.',
]

const WILDLIFE_AVOID = [
  { activity: 'Elephant rides', reason: 'Elephants are broken through a brutal process called "phajaan" to accept riders. Their spines are not built to carry weight.' },
  { activity: 'Tiger selfies', reason: 'Tigers are typically drugged, declawed, or chained. These facilities breed tigers for profit, not conservation.' },
  { activity: 'Dolphin shows', reason: 'Dolphins are captured from the wild, kept in tiny pools, and forced to perform. Captivity drastically shortens their lifespan.' },
  { activity: 'Animal circuses', reason: 'Animals are trained through fear and punishment, kept in cramped cages, and deprived of natural behaviors.' },
]

const WILDLIFE_SUPPORT = [
  { activity: 'Ethical elephant sanctuaries', description: 'Observe elephants roaming freely, bathing, and socializing — no riding, no chains, no performances.' },
  { activity: 'National parks and reserves', description: 'Support conservation funding by visiting protected areas with trained naturalist guides.' },
  { activity: 'Wildlife observation tours', description: 'Whale watching, bird watching, and safari tours that maintain safe distances and follow ethical guidelines.' },
  { activity: 'Marine conservation snorkeling', description: 'Guided reef tours that educate about marine ecosystems while funding coral restoration projects.' },
]

const SUSTAINABLE_TIPS = [
  { title: 'Reduce plastic', description: 'Carry a reusable water bottle, shopping bag, and utensils. Refuse single-use plastics at every opportunity.' },
  { title: 'Support local businesses', description: 'Eat at family-run restaurants, shop at local markets, and book locally owned accommodations.' },
  { title: 'Eat local', description: 'Choose seasonal, locally sourced food. It reduces transport emissions and supports local farmers.' },
  { title: 'Use public transport', description: 'Trains, buses, and shared transport produce a fraction of the emissions per person compared to taxis or rental cars.' },
  { title: 'Carbon offset', description: 'Calculate your flight emissions and offset through verified programs like Gold Standard or Verra.' },
  { title: 'Conserve water', description: 'Take shorter showers, reuse hotel towels, and be mindful of water scarcity in your destination.' },
]

const COMMUNITY_TOURISM = [
  { type: 'Homestays', description: 'Live with a local family to experience authentic daily life. Your payment goes directly to the household, supporting the local economy far more than international hotels.', tips: 'Bring a small gift from home, learn table manners and customs in advance, and be open to unfamiliar routines.' },
  { type: 'Local guides', description: 'Hire guides from the community you are visiting. They offer deeper cultural knowledge and your fees stay in the local economy.', tips: 'Ask your accommodation for recommendations, verify credentials, and agree on a fair price before starting.' },
  { type: 'Village visits', description: 'Organized community tourism programs where villages welcome visitors, share traditions, and sell handmade crafts.', tips: 'Only visit through established programs with community consent. Never treat villages as a zoo — engage respectfully.' },
]

const LEAVE_NO_TRACE = [
  'Plan ahead and prepare — research regulations and conditions before you go.',
  'Travel and camp on durable surfaces — stick to established trails and campsites.',
  'Dispose of waste properly — pack out all trash, leftover food, and litter.',
  'Leave what you find — do not pick flowers, move rocks, or take natural souvenirs.',
  'Minimize campfire impact — use established fire rings and keep fires small.',
  'Respect wildlife — observe from a distance, never feed animals, and store food securely.',
  'Be considerate of other visitors — keep noise down, yield on trails, and let nature\'s sounds prevail.',
]

export default function ResponsibleTravelPage() {
  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Responsible &amp; Volunteer Travel Guide</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Travel in a way that respects communities, protects wildlife, and preserves destinations for future generations.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
        {/* Ethical Principles */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-6">10 Ethical Tourism Principles</h2>
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <ol className="space-y-3">
              {ETHICAL_PRINCIPLES.map((tip, i) => (
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

        {/* Volunteer Opportunities */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-6">Volunteering Opportunities</h2>
          <div className="space-y-8">
            {VOLUNTEER_OPPORTUNITIES.map((category) => (
              <div key={category.type}>
                <h3 className="font-serif text-2xl font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  {category.type}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.countries.map((country) => (
                    <div
                      key={country.name}
                      className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">{country.flag}</span>
                        <h4 className="font-serif text-lg font-semibold text-[#0F172A]">{country.name}</h4>
                      </div>
                      <ul className="space-y-2">
                        {country.programs.map((program, i) => (
                          <li key={i} className="flex gap-3 text-[#0F172A] text-sm">
                            <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-[#F59E0B]" />
                            <span>{program}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Genuine vs Exploitative */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-6">Genuine vs. Exploitative Volunteer Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-red-200 p-6 shadow-sm">
              <h3 className="font-serif text-xl font-semibold text-red-700 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-lg font-bold">!</span>
                5 Red Flags
              </h3>
              <ul className="space-y-3">
                {RED_FLAGS.map((flag, i) => (
                  <li key={i} className="flex gap-3 text-[#0F172A]">
                    <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-sm">{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-sm">
              <h3 className="font-serif text-xl font-semibold text-emerald-700 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg font-bold">{'\u2713'}</span>
                5 Green Flags
              </h3>
              <ul className="space-y-3">
                {GREEN_FLAGS.map((flag, i) => (
                  <li key={i} className="flex gap-3 text-[#0F172A]">
                    <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm">{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Wildlife Tourism Ethics */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-6">Wildlife Tourism Ethics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-serif text-xl font-semibold text-red-700 mb-4">Avoid These Activities</h3>
              <div className="space-y-3">
                {WILDLIFE_AVOID.map((item, i) => (
                  <div key={i} className="bg-white rounded-xl border border-red-200 p-4 shadow-sm">
                    <h4 className="font-semibold text-[#0F172A] mb-1">{item.activity}</h4>
                    <p className="text-sm text-[#0F172A]/70">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-emerald-700 mb-4">Support These Instead</h3>
              <div className="space-y-3">
                {WILDLIFE_SUPPORT.map((item, i) => (
                  <div key={i} className="bg-white rounded-xl border border-emerald-200 p-4 shadow-sm">
                    <h4 className="font-semibold text-[#0F172A] mb-1">{item.activity}</h4>
                    <p className="text-sm text-[#0F172A]/70">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sustainable Travel Tips */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-6">Sustainable Travel Tips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUSTAINABLE_TIPS.map((tip, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                <h3 className="font-serif text-lg font-semibold text-[#0EA5E9] mb-2">{tip.title}</h3>
                <p className="text-sm text-[#0F172A]/80">{tip.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Community Tourism */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-6">Community Tourism</h2>
          <div className="space-y-4">
            {COMMUNITY_TOURISM.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                <h3 className="font-serif text-xl font-semibold text-[#0F172A] mb-2">{item.type}</h3>
                <p className="text-[#0F172A]/80 mb-3">{item.description}</p>
                <div className="bg-[#FAFBFC] rounded-lg p-3 border border-[#E2E8F0]">
                  <p className="text-sm text-[#0F172A]/70">
                    <span className="font-semibold text-[#F59E0B]">Tip:</span> {item.tips}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Leave No Trace */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[#0F172A] mb-6">Leave No Trace Principles</h2>
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <ol className="space-y-3">
              {LEAVE_NO_TRACE.map((principle, i) => (
                <li key={i} className="flex gap-3 text-[#0F172A]">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{principle}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </div>
  )
}
