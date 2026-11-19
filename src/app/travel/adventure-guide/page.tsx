'use client'

import { useState, useMemo } from 'react'

type Difficulty = 'beginner' | 'intermediate' | 'expert'
type ActivityCategory = 'hiking' | 'diving' | 'surfing' | 'climbing' | 'cycling' | 'skiing' | 'safari' | 'water-sports'

interface Activity {
  name: string
  country: string
  countryFlag: string
  category: ActivityCategory
  difficulty: Difficulty
  bestSeason: string
  estimatedCost: string
  physicalRequirements: string
  description: string
  recommendedOperators: string
  safetyGear: string
}

const CATEGORY_LABELS: Record<ActivityCategory, string> = {
  hiking: 'Hiking & Trekking',
  diving: 'Diving & Snorkeling',
  surfing: 'Surfing',
  climbing: 'Climbing',
  cycling: 'Cycling',
  skiing: 'Skiing & Snowboarding',
  safari: 'Safari & Desert',
  'water-sports': 'Water Sports',
}

const DIFFICULTY_STYLES: Record<Difficulty, { bg: string; text: string }> = {
  beginner: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  intermediate: { bg: 'bg-amber-100', text: 'text-amber-800' },
  expert: { bg: 'bg-red-100', text: 'text-red-800' },
}

const ALL_ACTIVITIES: Activity[] = [
  // ── Japan ──
  {
    name: 'Mt. Fuji Climbing',
    country: 'Japan',
    countryFlag: '\u{1F1EF}\u{1F1F5}',
    category: 'hiking',
    difficulty: 'intermediate',
    bestSeason: 'July to mid-September (official climbing season)',
    estimatedCost: '$100-200 (mountain hut stay, gear rental, transport)',
    physicalRequirements: 'Good cardiovascular fitness. The climb is not technically difficult but altitude (3,776m) causes headaches and fatigue. Acclimatize by starting early.',
    description: 'Japan\'s iconic peak draws over 300,000 climbers annually during the short summer season. The Yoshida Trail is the most popular route, starting from the 5th Station. Most climbers do an overnight hike, staying in a mountain hut to summit at sunrise (goraiko).',
    recommendedOperators: 'Willer Express runs direct buses to 5th Station. Mountain huts like Taishi-kan and Goraikoukan should be booked months in advance. Local guides are available through Fuji Mountain Guides for first-timers.',
    safetyGear: 'Layered clothing (temperatures drop to near-freezing at the summit), headlamp for pre-dawn hiking, rain gear, sturdy hiking boots, and trekking poles. Bring altitude sickness medication as a precaution.',
  },
  {
    name: 'Skiing in Niseko',
    country: 'Japan',
    countryFlag: '\u{1F1EF}\u{1F1F5}',
    category: 'skiing',
    difficulty: 'beginner',
    bestSeason: 'December to March (peak powder: January-February)',
    estimatedCost: '$150-300/day (lift pass, rental, accommodation)',
    physicalRequirements: 'No prior experience needed for beginner slopes. Intermediate and advanced terrain requires solid skiing or snowboarding skills. Backcountry requires avalanche training.',
    description: 'Niseko in Hokkaido is famous for some of the lightest, driest powder snow in the world — averaging 15+ meters annually. Four interconnected resorts (Grand Hirafu, Hanazono, Niseko Village, Annupuri) offer terrain for all levels, plus exceptional apres-ski hot springs (onsen).',
    recommendedOperators: 'Niseko United manages all four resorts. NISS (Niseko International Snowsports School) offers lessons in English. For backcountry, Black Diamond Lodge and Niseko Xtreme are reputable guide services.',
    safetyGear: 'Helmet (mandatory for backcountry, recommended on-piste), goggles, layered waterproof clothing. Backcountry requires avalanche transceiver, probe, shovel, and an ABS airbag pack.',
  },
  {
    name: 'Diving in Okinawa',
    country: 'Japan',
    countryFlag: '\u{1F1EF}\u{1F1F5}',
    category: 'diving',
    difficulty: 'beginner',
    bestSeason: 'April to November (water temperature 24-29 degrees C)',
    estimatedCost: '$80-150 per dive (introductory dives), $300-500 (PADI Open Water course)',
    physicalRequirements: 'Basic swimming ability. Introductory dives require no certification. Open Water certification requires pool sessions and 4 open-water dives over 3-4 days.',
    description: 'Okinawa\'s subtropical waters host vibrant coral reefs, manta rays, sea turtles, and the famous Kerama Blue waters. The Kerama Islands, Blue Cave at Cape Maeda, and Yonaguni\'s underwater ruins offer world-class diving for all levels.',
    recommendedOperators: 'Reef Encounters and Piranha Divers in Naha are popular English-speaking dive centers. For Yonaguni\'s ruins, Sou-Wes Diving is the original operator. Kerama Islands day trips run from Naha\'s Tomari Port.',
    safetyGear: 'All gear is provided by dive operators. Bring reef-safe sunscreen, rash guard for sun protection, and motion sickness medication for boat rides. Dive insurance (DAN) is recommended.',
  },
  {
    name: 'Cycling in Kyoto',
    country: 'Japan',
    countryFlag: '\u{1F1EF}\u{1F1F5}',
    category: 'cycling',
    difficulty: 'beginner',
    bestSeason: 'March to May (cherry blossoms) and October to November (autumn colors)',
    estimatedCost: '$10-25/day (bike rental), $50-100 (guided tour)',
    physicalRequirements: 'Basic cycling ability. Kyoto is mostly flat with gentle hills toward the eastern temples. E-bikes are available for those wanting extra assistance.',
    description: 'Kyoto is one of Japan\'s best cycling cities — flat terrain, bike-friendly streets, and attractions spread across the city make two wheels the ideal way to explore. Ride through the Arashiyama bamboo grove, along the Philosopher\'s Path, and between ancient temples.',
    recommendedOperators: 'Kyoto Cycling Tour Project offers guided rides with English-speaking guides. For rentals, emusica and J-Cycle have locations near Kyoto Station. Many guesthouses also offer free or cheap bike lending.',
    safetyGear: 'Helmet (not legally required in Japan for adults but recommended), lights for evening riding, and a good lock. Follow Japanese cycling rules: ride on the left, no phone use, and walk your bike through crowded pedestrian areas.',
  },
  // ── Italy ──
  {
    name: 'Hiking Cinque Terre',
    country: 'Italy',
    countryFlag: '\u{1F1EE}\u{1F1F9}',
    category: 'hiking',
    difficulty: 'intermediate',
    bestSeason: 'April to June and September to October (avoid summer crowds and heat)',
    estimatedCost: '$10-15 (Cinque Terre Card for trail access), free for some paths',
    physicalRequirements: 'Moderate fitness required. Trails involve steep stone staircases, narrow clifftop paths, and significant elevation changes. The Monterosso-to-Vernazza section is the most demanding.',
    description: 'The Sentiero Azzurro (Blue Trail) connects all five colorful fishing villages along the Ligurian coast. Each section takes 1-2 hours through vineyards, olive groves, and dramatic cliffside panoramas. Train connections between villages allow you to hike only the sections you choose.',
    recommendedOperators: 'No guide is strictly needed — trails are well-marked. The Cinque Terre National Park office in each village provides updated trail conditions. For guided experiences, Arbaspaa and Cinque Terre Insider offer small-group hikes with local knowledge.',
    safetyGear: 'Sturdy hiking shoes with good grip (trails are rocky and can be slippery when wet), sun protection, 1.5+ liters of water per person, and trekking poles for steep descents. Check trail closures at the park office before starting.',
  },
  {
    name: 'Diving in Sardinia',
    country: 'Italy',
    countryFlag: '\u{1F1EE}\u{1F1F9}',
    category: 'diving',
    difficulty: 'intermediate',
    bestSeason: 'May to October (water temperature 18-26 degrees C)',
    estimatedCost: '$60-120 per dive, $350-500 (PADI Advanced course)',
    physicalRequirements: 'Open Water certification required for most sites. Good swimming ability and comfort in open water. Some sites have currents that require intermediate skills.',
    description: 'Sardinia offers some of the Mediterranean\'s clearest waters with visibility exceeding 40 meters. Highlights include the Nereo Cave (one of the largest underwater caves in the Mediterranean), the Lavezzi Islands marine reserve, and wreck diving near Cagliari.',
    recommendedOperators: 'Orso Diving in Poltu Quatu, Dive Tribe Sardinia in Alghero, and ASD Centro Sub Cagliari are well-regarded. For cave diving, experienced local guides are essential — never attempt cave dives independently.',
    safetyGear: 'Wetsuit (5mm recommended May-June and September-October, 3mm in high summer), dive computer, and surface marker buoy. Cave dives require redundant lights, reels, and specialized training.',
  },
  {
    name: 'Skiing in the Dolomites',
    country: 'Italy',
    countryFlag: '\u{1F1EE}\u{1F1F9}',
    category: 'skiing',
    difficulty: 'intermediate',
    bestSeason: 'December to March (peak conditions: January-February)',
    estimatedCost: '$150-350/day (Dolomiti Superski pass, rental, accommodation)',
    physicalRequirements: 'Intermediate skiing or snowboarding ability recommended. The Sella Ronda circuit requires confident parallel turns. Beginner areas exist in every resort.',
    description: 'The Dolomiti Superski area is one of the world\'s largest ski domains — 1,200km of interconnected slopes across 12 resorts with a single lift pass. The Sella Ronda circuit is a must-do 40km loop around the Sella massif with stunning UNESCO-protected scenery.',
    recommendedOperators: 'Dolomiti Superski manages the unified pass system. Ski schools operate in every resort (Alta Badia, Val Gardena, Cortina are top picks). For heli-skiing and backcountry, Dolomite Mountains and San Martino Guides are experienced operators.',
    safetyGear: 'Helmet (mandatory for under-18 in Italy, recommended for all), goggles, layered clothing, and sunscreen (high-altitude sun is intense). Backcountry requires full avalanche safety equipment.',
  },
  {
    name: 'Cycling in Tuscany',
    country: 'Italy',
    countryFlag: '\u{1F1EE}\u{1F1F9}',
    category: 'cycling',
    difficulty: 'intermediate',
    bestSeason: 'April to June and September to October',
    estimatedCost: '$30-60/day (bike rental), $100-250/day (guided tour with lunch and wine)',
    physicalRequirements: 'Moderate fitness — Tuscan hills involve regular climbing. E-bikes make it accessible to less fit riders. Road cycling experience is helpful for navigating rural roads.',
    description: 'Tuscany\'s rolling hills, cypress-lined roads, and medieval hilltop villages make it a cyclist\'s paradise. Popular routes include the Chianti wine region between Florence and Siena, Val d\'Orcia\'s iconic landscapes, and the white gravel roads (strade bianche) made famous by professional racing.',
    recommendedOperators: 'I Bike Tuscany and Bike Florence & Tuscany offer guided day rides and multi-day tours with support vehicles, gourmet lunches, and wine tastings. For self-guided, Ciclismo Classico provides route maps and luggage transfers between hotels.',
    safetyGear: 'Helmet, cycling gloves, padded shorts for comfort, high-visibility clothing, and front/rear lights. Carry a repair kit with spare tube, pump, and tire levers. Italian drivers are generally bike-aware but stay alert on narrow roads.',
  },
  // ── Thailand ──
  {
    name: 'Rock Climbing in Railay',
    country: 'Thailand',
    countryFlag: '\u{1F1F9}\u{1F1ED}',
    category: 'climbing',
    difficulty: 'beginner',
    bestSeason: 'November to March (dry season)',
    estimatedCost: '$30-50 (half-day course), $50-80 (full day with guide)',
    physicalRequirements: 'No experience needed for beginner courses. Upper body strength helps but is not essential — technique matters more. Routes range from 5a (easy) to 8b (world-class).',
    description: 'Railay Beach near Krabi is one of the world\'s top rock climbing destinations with over 700 bolted routes on towering limestone karst cliffs. Beginners can start on gentle overhangs above white sand beaches, while experts tackle the challenging Thaiwand Wall.',
    recommendedOperators: 'Basecamp Tonsai, Real Rocks, and King Climbers are the most established climbing schools in Railay. All provide certified guides, gear, and instruction. Half-day courses typically cover 4-6 routes.',
    safetyGear: 'All gear (harness, shoes, ropes, quickdraws, helmet) is provided by operators. Wear lightweight, breathable clothing. Bring water, sunscreen, and insect repellent. Check equipment condition before climbing — budget operators may have worn gear.',
  },
  {
    name: 'Diving in Koh Tao',
    country: 'Thailand',
    countryFlag: '\u{1F1F9}\u{1F1ED}',
    category: 'diving',
    difficulty: 'beginner',
    bestSeason: 'March to October (calmest seas, best visibility)',
    estimatedCost: '$250-350 (PADI Open Water course — one of the cheapest in the world)',
    physicalRequirements: 'Basic swimming ability required. Open Water course takes 3-4 days. Koh Tao is one of the world\'s most popular places to learn diving due to calm, warm waters.',
    description: 'Koh Tao certifies more divers annually than almost anywhere else in the world. Warm, clear waters (26-30 degrees C) with abundant marine life including whale sharks, barracuda, and sea turtles. Over 25 dive sites surround the small island, from shallow coral gardens to deeper pinnacles.',
    recommendedOperators: 'Crystal Dive, Ban\'s Diving Resort, and Big Blue Diving are the largest and most professional schools. For smaller class sizes, Sairee Cottage Diving and New Heaven Dive School (with a marine conservation focus) are excellent choices.',
    safetyGear: 'All equipment provided. Bring reef-safe sunscreen and a rash guard. Motion sickness medication for boat rides. Ensure the dive school has oxygen kits and emergency action plans. Koh Tao has a hyperbaric chamber (SSS Network) for emergencies.',
  },
  {
    name: 'Jungle Trekking in Chiang Mai',
    country: 'Thailand',
    countryFlag: '\u{1F1F9}\u{1F1ED}',
    category: 'hiking',
    difficulty: 'intermediate',
    bestSeason: 'November to February (cool season, less rain)',
    estimatedCost: '$25-60/day (guided group treks), $100-200/day (private guided)',
    physicalRequirements: 'Moderate fitness for hill walking on uneven terrain. Multi-day treks involve 4-6 hours of walking daily with elevation changes. Leeches are common in wet season.',
    description: 'Northern Thailand\'s mountainous terrain around Chiang Mai offers multi-day jungle treks through dense forest, past waterfalls, and to remote hill-tribe villages. Treks often combine hiking with bamboo rafting, elephant sanctuary visits, and overnight stays in village homestays.',
    recommendedOperators: 'Pooh Eco-Trekking, Eagle Track, and Chiang Mai Trekking with Piroon are consistently well-reviewed. Choose operators that use local hill-tribe guides and support community-based tourism. Avoid companies offering elephant riding.',
    safetyGear: 'Lightweight long sleeves and pants (protection from thorns and insects), sturdy shoes or hiking sandals, DEET insect repellent, rain jacket, and a small daypack. Bring water purification tablets for multi-day treks.',
  },
  {
    name: 'Kayaking in Phang Nga Bay',
    country: 'Thailand',
    countryFlag: '\u{1F1F9}\u{1F1ED}',
    category: 'water-sports',
    difficulty: 'beginner',
    bestSeason: 'November to April (calm seas, dry weather)',
    estimatedCost: '$50-120 (full-day guided kayaking tour)',
    physicalRequirements: 'No experience needed — sit-on-top kayaks are stable and easy. Basic swimming ability recommended. Guides accompany all kayaks. Suitable for families with children 4+.',
    description: 'Paddle through the dramatic limestone karst islands of Phang Nga Bay, exploring hidden lagoons (hongs) accessible only through sea caves at low tide. James Bond Island is the most famous landmark, but the real magic is in the lesser-known hongs teeming with mangroves and wildlife.',
    recommendedOperators: 'John Gray\'s Sea Canoe (the original and most respected operator), Phuket Paddle, and Paddle Asia offer guided tours with knowledgeable local guides. John Gray\'s Starlight trip — paddling into bioluminescent waters at dusk — is a highlight.',
    safetyGear: 'Life jacket (provided by operators), waterproof bag for electronics, reef shoes or secure sandals, sunscreen, hat, and plenty of water. Wear quick-dry clothing.',
  },
  // ── France ──
  {
    name: 'Skiing in the Alps',
    country: 'France',
    countryFlag: '\u{1F1EB}\u{1F1F7}',
    category: 'skiing',
    difficulty: 'beginner',
    bestSeason: 'December to April (best snow: January-March)',
    estimatedCost: '$150-400/day (lift pass, rental, accommodation)',
    physicalRequirements: 'All levels catered for. Major resorts have extensive beginner areas. Advanced terrain includes steep couloirs, off-piste, and glacier skiing. Altitude ranges from 1,500m to 3,800m.',
    description: 'France is home to some of the world\'s largest ski domains: Les 3 Vallees (Courchevel, Meribel, Val Thorens), Paradiski (Les Arcs, La Plagne), and Portes du Soleil. The combination of high-altitude snow reliability, vast terrain, and French cuisine makes it a top destination.',
    recommendedOperators: 'ESF (Ecole du Ski Francais) operates in every resort with multilingual instructors. For off-piste guiding, Bureau des Guides in Chamonix is world-renowned. Ski weekends from Paris to the Alps are offered by TGV + transfer packages.',
    safetyGear: 'Helmet (strongly recommended, mandatory for children under 13 in many resorts), goggles, UV-rated sunglasses, sunscreen SPF 50, and layered waterproof clothing. Off-piste requires avalanche transceiver, probe, shovel, and ABS airbag.',
  },
  {
    name: 'Surfing in Biarritz',
    country: 'France',
    countryFlag: '\u{1F1EB}\u{1F1F7}',
    category: 'surfing',
    difficulty: 'beginner',
    bestSeason: 'May to October (warmest water), September-November (best waves)',
    estimatedCost: '$40-80 (lesson + board rental), $20-30/day (board rental only)',
    physicalRequirements: 'Swimming ability essential. No surfing experience needed for lessons. Intermediate surfers should be comfortable in waist-to-head-high waves. Autumn swells can be powerful.',
    description: 'Biarritz is the birthplace of European surfing, with a culture dating back to the 1950s. The Grande Plage, Cote des Basques, and Marbella beaches offer waves for all levels. The Basque Country coastline extends south with more powerful breaks for experienced surfers.',
    recommendedOperators: 'Hastea Surf School, Jo Moraiz Surf School, and Biarritz Surf Training are highly rated. For intermediate to advanced coaching, Rip Curl School and local independent coaches offer technique clinics. Board rentals are available at every beach.',
    safetyGear: 'Wetsuit (3/2mm in summer, 4/3mm in spring/autumn, 5/4mm in winter), leash, rash guard, reef boots for rocky entries, and sunscreen. Learn rip current awareness before entering the water. Lifeguards patrol flagged beaches in summer.',
  },
  {
    name: 'Cycling the Loire Valley',
    country: 'France',
    countryFlag: '\u{1F1EB}\u{1F1F7}',
    category: 'cycling',
    difficulty: 'beginner',
    bestSeason: 'May to September (longest days, warmest weather)',
    estimatedCost: '$20-40/day (bike rental), $100-250/day (guided tour with chateau entries)',
    physicalRequirements: 'Easy to moderate — the Loire Valley is largely flat along the river. The Loire a Velo route is well-paved and suitable for families. E-bikes available for any inclines.',
    description: 'The Loire a Velo is a 900km signposted cycling route along the Loire River, passing Renaissance chateaux (Chambord, Chenonceau, Amboise), vineyards, and charming villages. Most cyclists ride sections of 30-60km per day, stopping for chateau tours and wine tastings.',
    recommendedOperators: 'Detours de Loire and Loire Valley Bike Tours offer guided and self-guided packages with luggage transfer between hotels. Bike rentals are available at most train stations along the route through Loire a Velo partner shops.',
    safetyGear: 'Helmet, comfortable cycling clothing, rain jacket (weather changes quickly), sun protection, and a lock for chateau stops. The route is largely separated from traffic, but some road sections require visibility gear and caution.',
  },
  {
    name: 'Canyoning in Verdon Gorge',
    country: 'France',
    countryFlag: '\u{1F1EB}\u{1F1F7}',
    category: 'water-sports',
    difficulty: 'intermediate',
    bestSeason: 'June to September (warm enough for water activities)',
    estimatedCost: '$50-100 (half-day guided canyoning)',
    physicalRequirements: 'Moderate fitness and comfort in water required. Activities include jumping into pools (up to 10m), abseiling waterfalls, and swimming through narrow canyons. Not suitable for non-swimmers or those with a fear of heights.',
    description: 'The Gorges du Verdon, Europe\'s deepest canyon (700m), offers spectacular canyoning through turquoise waters, natural slides, cliff jumps, and rappels down waterfalls. Multiple routes range from family-friendly wading to technical descents for experienced adventurers.',
    recommendedOperators: 'Aboard Rafting, Raft Session, and Latitude Challenge operate from Castellane and Moustiers-Sainte-Marie. All provide certified guides, full equipment, and transport to canyon entry points. Book in advance during July-August.',
    safetyGear: 'Wetsuit, helmet, harness, and rope equipment are all provided by operators. Bring secure footwear (old trainers or canyoning shoes), swimwear to go underneath the wetsuit, and a dry bag for valuables. Water temperature is cold (12-18 degrees C) even in summer.',
  },
  // ── India ──
  {
    name: 'Trekking in the Himalayas',
    country: 'India',
    countryFlag: '\u{1F1EE}\u{1F1F3}',
    category: 'hiking',
    difficulty: 'intermediate',
    bestSeason: 'May to June and September to October (post-monsoon clarity)',
    estimatedCost: '$30-80/day (guided group trek with meals and camping)',
    physicalRequirements: 'Good cardiovascular fitness. Treks reach 3,500-5,000m altitude. Acclimatization days are essential. Prior hiking experience recommended. Altitude sickness affects some trekkers above 3,500m.',
    description: 'The Indian Himalayas offer treks for every level — from the accessible Valley of Flowers and Triund to challenging routes like Roopkund and Stok Kangri. Kashmir\'s Great Lakes Trek is often called the most beautiful trek in India, crossing five alpine lakes above 3,500m.',
    recommendedOperators: 'Indiahikes (nonprofit, eco-focused) is the most respected trekking organization in India. Trek The Himalayas and Bikat Adventures are also well-regarded. For Ladakh, Rimo Expeditions and Adventure Sindbad specialize in high-altitude treks.',
    safetyGear: 'Layered clothing for extreme temperature variation, insulated sleeping bag (operators usually provide), waterproof jacket, sturdy trekking boots, trekking poles, sunscreen, UV sunglasses, and altitude sickness medication (Diamox). Portable water purification is essential.',
  },
  {
    name: 'Surfing in Goa',
    country: 'India',
    countryFlag: '\u{1F1EE}\u{1F1F3}',
    category: 'surfing',
    difficulty: 'beginner',
    bestSeason: 'June to September (monsoon swells), October-May (calmer, better for beginners)',
    estimatedCost: '$15-30 (lesson), $5-15/day (board rental)',
    physicalRequirements: 'Swimming ability required. Goa\'s waves are generally mellow, making it ideal for beginners. Monsoon season brings bigger swells for intermediate surfers.',
    description: 'Goa\'s surf scene is growing rapidly. Ashwem, Mandrem, and Arambol beaches in North Goa offer consistent beginner-friendly waves. During monsoon season, Morjim and Ashwem get head-high swells. The warm water (26-30 degrees C) means no wetsuit is needed.',
    recommendedOperators: 'Banana Surf School (Ashwem), Surf Wala (Mandrem), and Goa Surf Co. are the main surf schools. All offer lessons, board rentals, and multi-day surf camps. The community is welcoming to newcomers of all levels.',
    safetyGear: 'Rash guard for sun protection, reef-safe sunscreen, and leash. No wetsuit needed — water is warm year-round. Be aware of rip currents, especially during monsoon. Some beaches have rocky sections — ask locals about entry and exit points.',
  },
  {
    name: 'Desert Safari in Rajasthan',
    country: 'India',
    countryFlag: '\u{1F1EE}\u{1F1F3}',
    category: 'safari',
    difficulty: 'beginner',
    bestSeason: 'October to March (cooler temperatures)',
    estimatedCost: '$30-80 (overnight camel safari with meals), $100-300 (luxury desert camp)',
    physicalRequirements: 'Minimal — camel riding requires balance but no fitness. Walking on sand dunes can be tiring. Heat management is the main concern. Suitable for all ages with basic mobility.',
    description: 'The Thar Desert near Jaisalmer and Sam Sand Dunes offers camel safaris through golden sand dunes, overnight camping under star-filled skies, and visits to remote desert villages. Luxury camps offer glamping-style experiences with traditional Rajasthani music and dance performances.',
    recommendedOperators: 'Real Desert Man (run by a local family) is consistently the top-rated operator in Jaisalmer. Mystic Jaisalmer and Trotters offer different tiers from budget camping to luxury glamping. Book directly to avoid middleman markups at the train station.',
    safetyGear: 'Wide-brimmed hat, high-SPF sunscreen, sunglasses, scarf to cover nose and mouth during sandstorms, light long-sleeved clothing, and at least 3 liters of water per person per day. Warm layers needed for desert nights (temperatures can drop sharply after sunset).',
  },
  {
    name: 'White Water Rafting in Rishikesh',
    country: 'India',
    countryFlag: '\u{1F1EE}\u{1F1F3}',
    category: 'water-sports',
    difficulty: 'intermediate',
    bestSeason: 'September to November and March to May',
    estimatedCost: '$15-40 (half-day rafting trip, 16-26km)',
    physicalRequirements: 'Swimming ability required. Participants must be comfortable in turbulent water. Rapids range from Grade II (easy) to Grade IV (challenging). Minimum age is typically 14 for the harder sections.',
    description: 'Rishikesh on the Ganges River is India\'s white water rafting capital, with rapids ranging from playful Grade II to adrenaline-pumping Grade IV. The most popular stretch runs from Shivpuri to Rishikesh (16km) with rapids like Roller Coaster, Golf Course, and Club House.',
    recommendedOperators: 'Red Chilli Adventure, Jumpin Heights, and Aquaterra Adventures are established operators with proper safety records. Avoid the cheapest operators — they often cut corners on guide training and equipment maintenance.',
    safetyGear: 'Life jacket and helmet (provided by operators). Wear secure footwear (not flip-flops), quick-dry clothing, and bring a change of clothes. Waterproof pouch for phone and valuables. Do not raft after heavy rains when water levels are dangerously high.',
  },
]

const CATEGORY_OPTIONS: ActivityCategory[] = ['hiking', 'diving', 'surfing', 'climbing', 'cycling', 'skiing', 'safari', 'water-sports']
const COUNTRY_OPTIONS = [
  { id: 'Japan', flag: '\u{1F1EF}\u{1F1F5}' },
  { id: 'Italy', flag: '\u{1F1EE}\u{1F1F9}' },
  { id: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}' },
  { id: 'France', flag: '\u{1F1EB}\u{1F1F7}' },
  { id: 'India', flag: '\u{1F1EE}\u{1F1F3}' },
]

export default function AdventureGuidePage() {
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | ''>('')

  const filteredActivities = useMemo(() => {
    return ALL_ACTIVITIES.filter((a) => {
      if (selectedCountry && a.country !== selectedCountry) return false
      if (selectedCategory && a.category !== selectedCategory) return false
      return true
    })
  }, [selectedCountry, selectedCategory])

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0F172A] to-[#0EA5E9] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Adventure & Activities Guide</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Hiking, diving, surfing, climbing, cycling, and more. Difficulty ratings, best seasons, costs, and safety tips for every adventure.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
          >
            <option value="">All Countries</option>
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.id}
              </option>
            ))}
          </select>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === ''
                  ? 'bg-[#0EA5E9] text-white shadow-md'
                  : 'bg-white text-[#0F172A]/70 border border-[#E2E8F0] hover:border-[#0EA5E9]'
              }`}
            >
              All
            </button>
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#0EA5E9] text-white shadow-md'
                    : 'bg-white text-[#0F172A]/70 border border-[#E2E8F0] hover:border-[#0EA5E9]'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-[#0F172A]/50">
          Showing {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'}
          {selectedCountry && ` in ${selectedCountry}`}
          {selectedCategory && ` — ${CATEGORY_LABELS[selectedCategory]}`}
        </p>

        {/* Activity Cards */}
        <div className="space-y-6">
          {filteredActivities.map((activity) => (
            <div key={`${activity.country}-${activity.name}`} className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#0F172A]">{activity.name}</h3>
                  <p className="text-sm text-[#0F172A]/50">
                    {activity.countryFlag} {activity.country} &middot; {CATEGORY_LABELS[activity.category]}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold self-start ${DIFFICULTY_STYLES[activity.difficulty].bg} ${DIFFICULTY_STYLES[activity.difficulty].text}`}>
                  {activity.difficulty.charAt(0).toUpperCase() + activity.difficulty.slice(1)}
                </span>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                <p className="text-sm text-[#0F172A]/80 leading-relaxed">{activity.description}</p>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#FAFBFC] rounded-lg p-3">
                    <p className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-wide mb-1">Best Season</p>
                    <p className="text-sm text-[#0F172A]/80">{activity.bestSeason}</p>
                  </div>
                  <div className="bg-[#FAFBFC] rounded-lg p-3">
                    <p className="text-xs font-semibold text-[#F59E0B] uppercase tracking-wide mb-1">Estimated Cost</p>
                    <p className="text-sm text-[#0F172A]/80">{activity.estimatedCost}</p>
                  </div>
                  <div className="bg-[#FAFBFC] rounded-lg p-3">
                    <p className="text-xs font-semibold text-[#0F172A]/50 uppercase tracking-wide mb-1">Physical Requirements</p>
                    <p className="text-sm text-[#0F172A]/80">{activity.physicalRequirements}</p>
                  </div>
                </div>

                {/* Recommended Operators */}
                <div>
                  <h4 className="text-sm font-semibold text-[#0F172A] mb-1">Recommended Operators</h4>
                  <p className="text-sm text-[#0F172A]/70 leading-relaxed">{activity.recommendedOperators}</p>
                </div>

                {/* Safety Gear */}
                <div className="bg-[#0EA5E9]/5 rounded-lg p-4 border border-[#0EA5E9]/10">
                  <h4 className="text-sm font-semibold text-[#0EA5E9] mb-1">Safety & Gear Notes</h4>
                  <p className="text-sm text-[#0F172A]/70 leading-relaxed">{activity.safetyGear}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#0F172A]/50 text-lg">No activities match your current filters. Try adjusting your selection.</p>
          </div>
        )}
      </div>
    </div>
  )
}
