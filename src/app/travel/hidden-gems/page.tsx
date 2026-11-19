'use client';

import { useState } from 'react';

/* ───────── types ───────── */
interface HiddenGem {
  name: string;
  country: string;
  countryFlag: string;
  countryId: string;
  whySpecial: string;
  bestTime: string;
  howToGetThere: string;
  estimatedCost: string;
  whyTouristsMissIt: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
}

/* ───────── data ───────── */
const HIDDEN_GEMS: HiddenGem[] = [
  // Japan
  {
    name: 'Naoshima Art Island',
    country: 'Japan',
    countryFlag: '🇯🇵',
    countryId: 'japan',
    whySpecial:
      'An entire island dedicated to contemporary art in the Seto Inland Sea. Imagine Yayoi Kusama pumpkin sculptures on rocky shores, Tadao Ando museums built into hillsides, and abandoned houses turned into immersive art installations. It feels like stepping into another dimension.',
    bestTime: 'March to November (ferries run more frequently)',
    howToGetThere: 'Ferry from Uno Port (Okayama Prefecture) or Takamatsu — about 20 minutes to 1 hour',
    estimatedCost: '$40-60/day (museums, ferry, simple accommodation)',
    whyTouristsMissIt: 'Most visitors stick to the Tokyo-Kyoto-Osaka triangle and never venture to the Seto Inland Sea. The island requires a deliberate detour and advance museum reservations.',
    difficulty: 'Moderate',
  },
  {
    name: 'Koyasan',
    country: 'Japan',
    countryFlag: '🇯🇵',
    countryId: 'japan',
    whySpecial:
      'Stay overnight in a Buddhist monastery temple, eat exquisite shojin ryori (monk food), and attend dawn prayers as mist rises through ancient cedar forests. The Okunoin cemetery — with 200,000 tombstones along a forest path — is one of the most spiritual places on Earth.',
    bestTime: 'Year-round (autumn foliage in November is magical)',
    howToGetThere: 'Train from Osaka Namba to Gokurakubashi, then cable car up the mountain — about 2 hours total',
    estimatedCost: '$80-150/night for temple lodging including meals',
    whyTouristsMissIt: 'It requires an overnight commitment and advance booking of temple stays. Day-trippers miss the entire point — the dawn prayers and evening atmosphere are everything.',
    difficulty: 'Easy',
  },
  {
    name: 'Yakushima Island',
    country: 'Japan',
    countryFlag: '🇯🇵',
    countryId: 'japan',
    whySpecial:
      'Ancient cedar forests that inspired Studio Ghibli\'s Princess Mononoke. Trees here are over 1,000 years old — the oldest, Jomon Sugi, is estimated at 2,170 to 7,200 years. Hiking through moss-draped forests feels like walking through a living fairy tale.',
    bestTime: 'May to July (lush and green, but rainy) or October to November',
    howToGetThere: 'Flight from Osaka or Kagoshima (1 hour) or high-speed ferry from Kagoshima (2 hours)',
    estimatedCost: '$60-100/day (lodging, guide for Jomon Sugi trek)',
    whyTouristsMissIt: 'It\'s a remote subtropical island south of Kyushu. The flagship Jomon Sugi hike is a 10-hour round trip — most tourists don\'t plan for that level of commitment.',
    difficulty: 'Challenging',
  },

  // Italy
  {
    name: 'Matera',
    country: 'Italy',
    countryFlag: '🇮🇹',
    countryId: 'italy',
    whySpecial:
      'Cave dwellings carved into cliffs — the Sassi di Matera are the oldest continuously inhabited settlement in the world. Once called "the shame of Italy" for its poverty, it\'s now a UNESCO World Heritage Site with cave hotels, restaurants carved into rock, and a hauntingly beautiful night skyline.',
    bestTime: 'April to June and September to October',
    howToGetThere: 'Train from Bari (1.5 hours) or drive from Naples (3 hours)',
    estimatedCost: '$50-120/day (cave hotel stays are surprisingly affordable)',
    whyTouristsMissIt: 'It\'s in Basilicata, southern Italy\'s least-visited region. Everyone goes to Rome, Florence, and Venice — Matera is a 3-hour detour from the standard tourist trail.',
    difficulty: 'Easy',
  },
  {
    name: 'Civita di Bagnoregio',
    country: 'Italy',
    countryFlag: '🇮🇹',
    countryId: 'italy',
    whySpecial:
      '"The dying city" perched on an eroding mesa of volcanic tuff, connected to the modern world by a single pedestrian footbridge. Only about a dozen people live here year-round. At sunset, it looks like a medieval city floating in the sky.',
    bestTime: 'Early morning or sunset for the best light; spring and autumn for weather',
    howToGetThere: 'Drive from Rome (2 hours) or Orvieto (30 minutes) — the footbridge is the only way in',
    estimatedCost: '$5 entry fee + transport; day trip from Rome or Orvieto',
    whyTouristsMissIt: 'No train station, no through-road, no major city nearby. You have to specifically decide to go here. The erosion means it genuinely won\'t exist forever.',
    difficulty: 'Moderate',
  },
  {
    name: 'Orvieto',
    country: 'Italy',
    countryFlag: '🇮🇹',
    countryId: 'italy',
    whySpecial:
      'An underground city of Etruscan caves beneath a hilltop medieval town. Above ground: a cathedral with one of Italy\'s finest facade. Below ground: a labyrinth of over 1,200 caves carved over 2,500 years — wine cellars, olive presses, pigeon roosts, and even escape tunnels.',
    bestTime: 'Year-round (underground tours run daily)',
    howToGetThere: 'Direct train from Rome (1 hour 15 minutes) then funicular up the cliff',
    estimatedCost: '$20-30 for underground tour + cathedral; perfect day trip from Rome',
    whyTouristsMissIt: 'Overshadowed by its famous neighbors. Travelers on the Rome-Florence train literally pass through Orvieto station without stopping. The underground world is almost entirely unknown.',
    difficulty: 'Easy',
  },

  // Thailand
  {
    name: 'Pai',
    country: 'Thailand',
    countryFlag: '🇹🇭',
    countryId: 'thailand',
    whySpecial:
      'A hippie mountain town near Chiang Mai with a vibe all its own — waterfalls, hot springs, canyons, and a walking street market with no crowds. Rent a motorbike and spend days exploring rice paddies, visiting the White Buddha on the hill, and soaking in natural hot springs under the stars.',
    bestTime: 'November to February (cool season; dry and clear)',
    howToGetThere: 'Minivan from Chiang Mai — 3 hours over 762 curves through the mountains',
    estimatedCost: '$15-30/day (Pai is remarkably cheap even by Thai standards)',
    whyTouristsMissIt: 'The 762-curve mountain road scares off many. It\'s also not on the "must-see" temple circuit, so tour groups skip it entirely. That\'s exactly why it stays special.',
    difficulty: 'Moderate',
  },
  {
    name: 'Koh Lipe',
    country: 'Thailand',
    countryFlag: '🇹🇭',
    countryId: 'thailand',
    whySpecial:
      'Thailand\'s Maldives — crystal-clear turquoise water, powdery white beaches, and world-class snorkeling right off the shore. No high-rise hotels, no jet skis, no mass tourism. Just a tiny island near the Malaysian border where you can walk across in 20 minutes.',
    bestTime: 'November to April (dry season; ferries don\'t run May-October)',
    howToGetThere: 'Speed boat from Pak Bara pier (Satun province) — 1.5 hours. Flights to Hat Yai then van to pier.',
    estimatedCost: '$30-80/day (beachfront bungalows start at $20)',
    whyTouristsMissIt: 'It\'s in Thailand\'s deep south, far from Bangkok and Phuket. Getting there takes effort — two flights and a boat, or a long drive. That isolation is its greatest asset.',
    difficulty: 'Moderate',
  },
  {
    name: 'Sukhothai',
    country: 'Thailand',
    countryFlag: '🇹🇭',
    countryId: 'thailand',
    whySpecial:
      'The original Thai kingdom ruins — older and more atmospheric than Ayutthaya, with a fraction of the visitors. Rent a bicycle and pedal through a vast historical park of crumbling temples, serene Buddha statues reflected in lotus ponds, and ancient city walls. At dawn, it feels like you have a UNESCO site to yourself.',
    bestTime: 'November to February (cool and dry; Loy Krathong festival in November is spectacular here)',
    howToGetThere: 'Bus from Chiang Mai (5 hours) or Bangkok (7 hours); small airport with Bangkok Airways flights',
    estimatedCost: '$20-40/day (very affordable; park entry 100 THB per zone)',
    whyTouristsMissIt: 'Ayutthaya gets all the attention because it\'s closer to Bangkok. Sukhothai requires a deliberate detour, and most travelers don\'t even know it exists.',
    difficulty: 'Easy',
  },

  // France
  {
    name: 'Colmar',
    country: 'France',
    countryFlag: '🇫🇷',
    countryId: 'france',
    whySpecial:
      'A fairy-tale Alsatian town that inspired Beauty and the Beast\'s village. Half-timbered houses in candy colors line canal banks, overflowing with flower boxes. The Petite Venise quarter is ridiculously photogenic. Add world-class Alsatian wine, flammekueche, and a Christmas market that rivals any in Europe.',
    bestTime: 'Late November to December (Christmas markets) or May to September',
    howToGetThere: 'TGV from Paris to Colmar (2.5 hours direct) or train from Strasbourg (30 minutes)',
    estimatedCost: '$60-120/day (moderate for France; wine tasting is affordable)',
    whyTouristsMissIt: 'Alsace is in France\'s far northeast corner, closer to Germany than Paris. Tourists flock to Provence and the Riviera; the east is an afterthought. Strasbourg gets most Alsace visitors, and Colmar stays blissfully quieter.',
    difficulty: 'Easy',
  },
  {
    name: 'Etretat',
    country: 'France',
    countryFlag: '🇫🇷',
    countryId: 'france',
    whySpecial:
      'Dramatic white chalk cliffs that rival — and predate — the White Cliffs of Dover. The natural arch formations plunging into the English Channel have inspired Monet, Maupassant, and Maurice Leblanc (who set Arsene Lupin\'s hidden treasure here). Walk the cliff paths at golden hour and understand why.',
    bestTime: 'May to September (clear skies; cliff walks are weather-dependent)',
    howToGetThere: 'Drive from Paris (2.5 hours) or train to Le Havre then bus (45 minutes)',
    estimatedCost: '$40-80/day (day trip from Paris or overnight in a small hotel)',
    whyTouristsMissIt: 'No train station directly in town. Normandy tourists go to Mont Saint-Michel and the D-Day beaches. Etretat is a detour that requires a car or an extra bus connection.',
    difficulty: 'Easy',
  },
  {
    name: 'Annecy',
    country: 'France',
    countryFlag: '🇫🇷',
    countryId: 'france',
    whySpecial:
      '"Venice of the Alps" — canals threading through a pastel-colored medieval old town, with crystal-clear lake water so clean you can drink it, and a backdrop of snow-capped mountains. Cycle the lake, eat Savoyard cheese, paraglide over the water, then wander cobbled streets with a crepe.',
    bestTime: 'June to September (lake swimming, paragliding, cycling) or December (Christmas markets)',
    howToGetThere: 'TGV from Paris to Annecy (4 hours) or drive from Geneva (45 minutes)',
    estimatedCost: '$70-140/day (slightly pricier in summer; lake activities add up)',
    whyTouristsMissIt: 'French Alps tourism is dominated by ski resorts in winter and Chamonix year-round. Annecy is a summer town that doesn\'t market itself internationally — it\'s where French people go on holiday.',
    difficulty: 'Easy',
  },

  // India
  {
    name: 'Hampi',
    country: 'India',
    countryFlag: '🇮🇳',
    countryId: 'india',
    whySpecial:
      'A surreal boulder-strewn landscape with 600-year-old Vijayanagara Empire ruins scattered across it — imagine ancient temples wedged between enormous granite boulders, banana plantations, and the Tungabhadra River. Rent a bicycle and lose yourself among the ruins at sunrise. It feels like exploring a lost civilization on Mars.',
    bestTime: 'October to February (cool and dry; unbearably hot March to May)',
    howToGetThere: 'Overnight train from Bangalore to Hospet (7 hours) then auto-rickshaw 13km to Hampi; or fly to Hubli then drive 3.5 hours',
    estimatedCost: '$10-25/day (Hampi is incredibly budget-friendly)',
    whyTouristsMissIt: 'It\'s in rural Karnataka with no nearby airport. The journey takes commitment — overnight trains and bumpy roads. Tourists heading to South India go to Kerala or Goa instead.',
    difficulty: 'Moderate',
  },
  {
    name: 'Spiti Valley',
    country: 'India',
    countryFlag: '🇮🇳',
    countryId: 'india',
    whySpecial:
      'A Himalayan cold desert with Buddhist monasteries clinging to impossibly steep mountainsides — Spiti feels like Tibet without the restrictions. Key Monastery, perched at 4,166m, and Dhankar Monastery on a crumbling cliff are among the most dramatic sights in Asia. The night sky here is staggering.',
    bestTime: 'June to September only (roads are closed by snow October to May)',
    howToGetThere: 'Drive from Manali (12-14 hours over Rohtang and Kunzum passes) or from Shimla via Kinnaur (2 days)',
    estimatedCost: '$15-40/day (homestays and basic guesthouses; permits are free)',
    whyTouristsMissIt: 'Reachable only 4 months per year via terrifying mountain roads. No railway, no airport, limited phone signal. It\'s India\'s last truly remote inhabited valley — and that\'s the whole point.',
    difficulty: 'Challenging',
  },
  {
    name: 'Pondicherry',
    country: 'India',
    countryFlag: '🇮🇳',
    countryId: 'india',
    whySpecial:
      'A French colonial town in South India where boulangeries sell pain au chocolat next to Tamil temples. The White Town quarter has mustard-yellow colonial mansions, bougainvillea-draped streets, and a promenade along the Bay of Bengal. Add Auroville (an experimental international township) nearby and you have one of India\'s most unique destinations.',
    bestTime: 'October to March (post-monsoon; pleasant weather)',
    howToGetThere: 'Drive from Chennai (3 hours) or bus; nearest airport is Chennai',
    estimatedCost: '$20-50/day (charming heritage hotels are surprisingly affordable)',
    whyTouristsMissIt: 'South India tourism focuses on Kerala, and Tamil Nadu visitors head to Madurai or Mahabalipuram. Pondicherry is a small town that doesn\'t appear on most international itineraries despite being one of India\'s most charming places.',
    difficulty: 'Easy',
  },
];

const COUNTRY_FILTERS = [
  { id: 'all', label: 'All Countries', flag: '🌍' },
  { id: 'japan', label: 'Japan', flag: '🇯🇵' },
  { id: 'italy', label: 'Italy', flag: '🇮🇹' },
  { id: 'thailand', label: 'Thailand', flag: '🇹🇭' },
  { id: 'france', label: 'France', flag: '🇫🇷' },
  { id: 'india', label: 'India', flag: '🇮🇳' },
];

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string }> = {
  Easy: { bg: '#DCFCE7', text: '#166534' },
  Moderate: { bg: '#FEF3C7', text: '#92400E' },
  Challenging: { bg: '#FEE2E2', text: '#991B1B' },
};

/* ───────── component ───────── */
export default function HiddenGemsPage() {
  const [filter, setFilter] = useState('all');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const gems = filter === 'all' ? HIDDEN_GEMS : HIDDEN_GEMS.filter((g) => g.countryId === filter);

  function handleShare(gem: HiddenGem, idx: number) {
    const text = `Hidden gem alert: ${gem.name} in ${gem.country} — ${gem.whySpecial.slice(0, 100)}... Discover more at WorldTourly.com/hidden-gems`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  }

  return (
    <div className="min-h-screen" style={{ background: '#FAFBFC' }}>
      <div className="mx-auto max-w-4xl px-4 py-16">
        {/* header */}
        <div className="text-center mb-12">
          <div className="inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-4" style={{ background: '#FEF3C7', color: '#92400E' }}>
            Off the Beaten Path
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3" style={{ color: '#0F172A' }}>
            Hidden Gems
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#64748B' }}>
            Spots tourists don&apos;t know about. These are the places your well-traveled friend whispers about over drinks — the ones that make you immediately open a new browser tab.
          </p>
        </div>

        {/* country filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {COUNTRY_FILTERS.map((cf) => (
            <button
              key={cf.id}
              onClick={() => setFilter(cf.id)}
              className="rounded-full px-5 py-2 text-sm font-semibold border-2 transition-all"
              style={{
                borderColor: filter === cf.id ? '#0EA5E9' : '#E2E8F0',
                background: filter === cf.id ? '#F0F9FF' : '#fff',
                color: filter === cf.id ? '#0369A1' : '#64748B',
              }}
            >
              {cf.flag} {cf.label}
            </button>
          ))}
        </div>

        {/* gems list */}
        <div className="space-y-8">
          {gems.map((gem, idx) => {
            const dc = DIFFICULTY_COLORS[gem.difficulty];
            return (
              <article
                key={gem.name}
                className="rounded-2xl border overflow-hidden transition-shadow hover:shadow-lg"
                style={{ background: '#fff', borderColor: '#E2E8F0' }}
              >
                {/* top bar */}
                <div className="flex items-center justify-between px-6 py-3 border-b" style={{ background: '#F8FAFC', borderColor: '#F1F5F9' }}>
                  <span className="text-sm font-semibold" style={{ color: '#64748B' }}>
                    {gem.countryFlag} {gem.country}
                  </span>
                  <span
                    className="text-xs font-bold rounded-full px-3 py-1"
                    style={{ background: dc.bg, color: dc.text }}
                  >
                    {gem.difficulty} to reach
                  </span>
                </div>

                {/* content */}
                <div className="p-6 md:p-8">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3" style={{ color: '#0F172A' }}>
                    {gem.name}
                  </h2>

                  <p className="text-base leading-relaxed mb-6" style={{ color: '#475569' }}>
                    {gem.whySpecial}
                  </p>

                  {/* details grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="rounded-xl p-4" style={{ background: '#F0F9FF' }}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#0EA5E9' }}>
                        Best Time to Visit
                      </p>
                      <p className="text-sm font-medium" style={{ color: '#0F172A' }}>{gem.bestTime}</p>
                    </div>
                    <div className="rounded-xl p-4" style={{ background: '#FFFBEB' }}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#F59E0B' }}>
                        Estimated Cost
                      </p>
                      <p className="text-sm font-medium" style={{ color: '#0F172A' }}>{gem.estimatedCost}</p>
                    </div>
                    <div className="rounded-xl p-4" style={{ background: '#F0FDF4' }}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#10B981' }}>
                        How to Get There
                      </p>
                      <p className="text-sm font-medium" style={{ color: '#0F172A' }}>{gem.howToGetThere}</p>
                    </div>
                    <div className="rounded-xl p-4" style={{ background: '#FDF2F8' }}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#EC4899' }}>
                        Why Tourists Miss It
                      </p>
                      <p className="text-sm font-medium" style={{ color: '#0F172A' }}>{gem.whyTouristsMissIt}</p>
                    </div>
                  </div>

                  {/* share button */}
                  <button
                    onClick={() => handleShare(gem, idx)}
                    className="rounded-full px-5 py-2 text-sm font-semibold transition-all hover:scale-105"
                    style={{
                      background: copiedIdx === idx ? '#10B981' : '#0EA5E9',
                      color: '#fff',
                    }}
                  >
                    {copiedIdx === idx ? 'Copied!' : 'Share This Gem'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* bottom note */}
        <div className="mt-12 text-center rounded-2xl p-8 border" style={{ background: '#fff', borderColor: '#E2E8F0' }}>
          <span className="text-4xl block mb-3">🤫</span>
          <p className="font-serif text-xl font-bold mb-2" style={{ color: '#0F172A' }}>
            Know a hidden gem we missed?
          </p>
          <p className="text-sm" style={{ color: '#64748B' }}>
            We&apos;re always looking for places the guidebooks haven&apos;t found yet. These 15 gems are just the beginning.
          </p>
        </div>
      </div>
    </div>
  );
}
