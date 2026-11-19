export interface SmartTip {
  country: string
  category: 'timing' | 'budget' | 'crowd' | 'weather' | 'insider' | 'first-timer'
  title: string
  tip: string
  icon: string
}

export interface SeasonalAdvice {
  country: string
  peakSeason: { months: string; why: string }
  shoulderSeason: { months: string; why: string; savings: string }
  offSeason: { months: string; why: string; savings: string }
  proTip: string
}

export const SEASONAL_ADVICE: SeasonalAdvice[] = [
  {
    country: 'japan',
    peakSeason: { months: 'Mar-Apr, Oct-Nov', why: 'Cherry blossom season and autumn leaves draw millions of visitors' },
    shoulderSeason: {
      months: 'May, Sep',
      why: 'Go first 2 weeks of May. Cherry blossom crowds gone, perfect weather, Golden Week gives festive atmosphere.',
      savings: 'Hotels 30-40% cheaper than April',
    },
    offSeason: {
      months: 'Jan-Feb, Jun-Jul',
      why: 'Rainy season and high humidity in summer, cold winters',
      savings: 'Up to 50% savings on flights and accommodation',
    },
    proTip:
      'Book 2 weeks before cherry blossom peak (mid-March). You\'ll catch early blooms with 40% fewer crowds and 30% lower prices. Same beauty, less chaos.',
  },
  {
    country: 'italy',
    peakSeason: { months: 'Jun-Aug, Easter week', why: 'Summer holidays and European vacation season' },
    shoulderSeason: {
      months: 'Apr-May, Sep-Oct',
      why: 'September is Italy\'s best-kept secret. Summer crowds leave, weather is perfect, prices drop 25-35%, and grape harvest season begins.',
      savings: '25-35% lower than peak season',
    },
    offSeason: {
      months: 'Nov-Feb (except Christmas/NYE)',
      why: 'Cold weather, shorter days, some coastal towns close',
      savings: 'Up to 50% savings on accommodation',
    },
    proTip:
      'Visit Rome in the last week of October. Summer tourists gone, weather still warm (18-22°C), Vatican has short queues, and hotel prices are half of July.',
  },
  {
    country: 'thailand',
    peakSeason: { months: 'Nov-Feb', why: 'Cool, dry weather — the most comfortable time to visit' },
    shoulderSeason: {
      months: 'Mar, Oct',
      why: 'Go early November. Rainy season just ended, everything is lush green, tourists haven\'t arrived yet. Prices are 30% lower than December.',
      savings: '30% lower than December',
    },
    offSeason: {
      months: 'Apr-Sep',
      why: 'Hot season and monsoon rains — but Koh Samui is dry Jun-Aug',
      savings: 'Up to 60% savings on beach resorts',
    },
    proTip:
      'The last 2 weeks of October offer the best value in Thailand. Rains become rare, temples are empty, flights are cheapest of the year, and you\'ll have beaches to yourself.',
  },
  {
    country: 'france',
    peakSeason: { months: 'Jun-Aug, Christmas/NYE in Paris', why: 'Summer holidays, longest daylight, outdoor festivals' },
    shoulderSeason: {
      months: 'Apr-May, Sep-Oct',
      why: 'Late September Paris is magical. Crowds thin, cafe terraces are golden, museum lines halve, and flight prices drop 30%.',
      savings: '30% savings on flights and hotels',
    },
    offSeason: {
      months: 'Nov-Mar (except holidays)',
      why: 'Grey skies and cold, but Paris has a special winter charm',
      savings: 'Up to 45% savings overall',
    },
    proTip:
      'Visit the Louvre on Wednesday or Friday evening (open until 9:45 PM). By 6 PM, 80% of day tourists have left. You\'ll have the Mona Lisa practically to yourself.',
  },
  {
    country: 'india',
    peakSeason: { months: 'Oct-Mar', why: 'Cool, dry weather — especially ideal for Rajasthan and Delhi' },
    shoulderSeason: {
      months: 'Sep, Mar-Apr',
      why: 'Early October is ideal for North India. Monsoon just ended, air is clean, everything is green, Diwali preparations add festive energy, prices are 40% below peak.',
      savings: '40% below peak season',
    },
    offSeason: {
      months: 'May-Aug',
      why: 'Extreme heat followed by monsoon rains',
      savings: 'Up to 60% savings on luxury hotels',
    },
    proTip:
      'For Rajasthan, go the last week of September. Summer heat breaks, monsoon rains end, forts and palaces are crowd-free, hotel prices are at their lowest, and the desert landscape is surprisingly green.',
  },
  // ─── Existing destinations without seasonal advice ───
  {
    country: 'united-states',
    peakSeason: { months: 'Jun-Aug, Dec holidays', why: 'Summer vacations and Christmas/New Year draw the largest crowds to major cities and national parks' },
    shoulderSeason: {
      months: 'Apr-May, Sep-Oct',
      why: 'September in NYC and New England is sublime — summer crowds vanish, fall foliage begins, hotel prices drop 25%, and the weather is still warm and sunny.',
      savings: '25-35% lower than summer peak',
    },
    offSeason: {
      months: 'Jan-Mar (except ski resorts)',
      why: 'Cold winters and post-holiday lull mean fewer tourists everywhere except ski towns',
      savings: 'Up to 40% savings on hotels and domestic flights',
    },
    proTip:
      'Visit national parks in mid-September — kids are back in school, summer crowds evaporate, and parks like Yosemite and Zion are at their most serene with perfect weather.',
  },
  {
    country: 'spain',
    peakSeason: { months: 'Jun-Aug, Easter week', why: 'European summer holidays and Semana Santa (Holy Week) bring massive crowds' },
    shoulderSeason: {
      months: 'Apr-May, Sep-Oct',
      why: 'October in Andalucia is perfect — still warm (25°C), crowds gone, hotel prices drop 30%, and the harvest season brings food festivals everywhere.',
      savings: '30% lower than peak summer',
    },
    offSeason: {
      months: 'Nov-Feb (except Christmas)',
      why: 'Cool, rainy weather in the north; mild in the south; fewer tourists everywhere',
      savings: 'Up to 45% savings on accommodation',
    },
    proTip:
      'Barcelona in mid-May has perfect weather, La Mercè preparations give local energy, and you avoid the cruise ship hordes of July-August. Tapas bars are 30% cheaper than peak season.',
  },
  {
    country: 'united-kingdom',
    peakSeason: { months: 'Jun-Aug, Christmas in London', why: 'Summer holidays, longest daylight hours, festivals like Edinburgh Fringe (August)' },
    shoulderSeason: {
      months: 'Apr-May, Sep-Oct',
      why: 'May is glorious — gardens peak, days are long, summer crowds haven\'t arrived. September is equally good with warm days and cultural season starting.',
      savings: '25-30% lower than summer peak',
    },
    offSeason: {
      months: 'Nov-Feb (except Christmas)',
      why: 'Short, dark, cold days — but London\'s museums are free and theatre tickets are cheapest',
      savings: 'Up to 40% savings on hotels outside London',
    },
    proTip:
      'Edinburgh in late April avoids the August Fringe chaos — you get the castle, Arthur\'s Seat, and whisky bars without the million-person festival crowds or triple hotel prices.',
  },
  {
    country: 'turkey',
    peakSeason: { months: 'Jun-Aug', why: 'European summer holidays flood Istanbul, Cappadocia, and the coasts' },
    shoulderSeason: {
      months: 'Apr-May, Sep-Oct',
      why: 'October in Cappadocia is magical — crisp mornings mean the best hot air balloon conditions, autumn colors on the rock formations, and hotel prices are 35% lower than August.',
      savings: '30-40% lower than summer peak',
    },
    offSeason: {
      months: 'Nov-Mar',
      why: 'Cold in central Turkey, grey in Istanbul, but Turkish baths and bazaars are crowd-free',
      savings: 'Up to 50% savings on flights and hotels',
    },
    proTip:
      'Visit Istanbul in the last week of September — weather is still warm (24°C), Bosphorus boat tours are uncrowded, and you can get 5-star hotels for mid-range prices.',
  },
  {
    country: 'greece',
    peakSeason: { months: 'Jul-Aug', why: 'European summer holidays and cruise ship season pack the islands' },
    shoulderSeason: {
      months: 'May-Jun, Sep-Oct',
      why: 'Late September is Greece\'s sweet spot — the sea is at its warmest from months of summer sun, islands are blissfully quiet, and prices drop 30-40% from August madness.',
      savings: '30-40% lower than peak summer',
    },
    offSeason: {
      months: 'Nov-Mar',
      why: 'Many island services close; mainland is cool but Athens remains vibrant year-round',
      savings: 'Up to 50% savings on accommodation',
    },
    proTip:
      'Santorini the first week of October — caldera sunset views without fighting for position, warm enough to swim, hotel prices are half of July, and you\'ll actually enjoy Oia.',
  },
  {
    country: 'australia',
    peakSeason: { months: 'Dec-Feb (summer), school holidays', why: 'Summer holidays, Christmas, and beach season draw domestic and international crowds' },
    shoulderSeason: {
      months: 'Mar-May, Sep-Nov',
      why: 'March in Sydney is ideal — summer heat fades, beaches are uncrowded, Vivid Sydney prep begins, and hotel prices drop 25% after the school holiday rush.',
      savings: '25-30% lower than peak summer',
    },
    offSeason: {
      months: 'Jun-Aug (except tropical north)',
      why: 'Winter in the south is mild but less popular; the tropical north is actually at its best (dry season)',
      savings: 'Up to 35% savings on flights within Australia',
    },
    proTip:
      'The Australian school holidays (mid-Dec to late Jan, Easter, Jun-Jul) triple prices everywhere. Shift your trip two weeks after any school holiday and you\'ll save 30%.',
  },
  {
    country: 'mexico',
    peakSeason: { months: 'Dec-Apr, Easter week', why: 'Dry season brings North American snowbirds, spring breakers, and holiday crowds' },
    shoulderSeason: {
      months: 'May, Nov',
      why: 'November is Mexico\'s secret — Day of the Dead just passed, rains are ending, prices drop 30%, and the landscape is at its greenest and most vibrant.',
      savings: '30% lower than dry season peak',
    },
    offSeason: {
      months: 'Jun-Oct',
      why: 'Rainy season with afternoon showers (mornings are usually dry); hurricane risk on coasts',
      savings: 'Up to 50% savings on beach resorts',
    },
    proTip:
      'Oaxaca the last week of October through early November — you catch Day of the Dead celebrations, the weather is warm, and hotel prices haven\'t yet hit December-April peaks.',
  },
  {
    country: 'egypt',
    peakSeason: { months: 'Oct-Apr', why: 'Cool, dry winter weather is the only comfortable time for the pyramids and Nile cruises' },
    shoulderSeason: {
      months: 'Mar-Apr, Oct',
      why: 'Early October is ideal — summer heat just broke, the Nile cruise boats aren\'t fully booked yet, and temple sites like Luxor have 40% fewer visitors than December.',
      savings: '30% lower than peak winter season',
    },
    offSeason: {
      months: 'May-Sep',
      why: 'Extreme heat (40-50°C) makes outdoor sightseeing dangerous; prices plummet',
      savings: 'Up to 60% savings on Nile cruises and hotels',
    },
    proTip:
      'Book a Nile cruise in the first week of October — temperatures drop below 35°C, boats are half-empty, and you\'ll have Valley of the Kings nearly to yourself.',
  },
  {
    country: 'morocco',
    peakSeason: { months: 'Mar-May, Sep-Nov', why: 'Pleasant spring and autumn weather draws the most tourists to Marrakech and the desert' },
    shoulderSeason: {
      months: 'Feb, Nov',
      why: 'Late February is an underrated gem — almond blossoms in the Atlas Mountains, mild weather in Marrakech, and riad prices are 30% cheaper than April.',
      savings: '30% lower than spring peak',
    },
    offSeason: {
      months: 'Jun-Aug, Dec-Jan',
      why: 'Scorching summer heat (45°C+ in Marrakech) and cold, wet winters in the mountains',
      savings: 'Up to 45% savings on riads and tours',
    },
    proTip:
      'Marrakech in mid-November — the souks are uncrowded, evening temperatures are perfect for rooftop dining, and riads that cost $200/night in April go for $120.',
  },
  {
    country: 'peru',
    peakSeason: { months: 'Jun-Aug', why: 'Dry season and northern hemisphere summer holidays pack Cusco and Machu Picchu' },
    shoulderSeason: {
      months: 'Apr-May, Sep-Oct',
      why: 'September is Peru\'s sweet spot — dry season continues, Inca Trail is less crowded than July, hotel prices in Cusco drop 30%, and daytime temperatures are warmer.',
      savings: '30% lower than peak dry season',
    },
    offSeason: {
      months: 'Nov-Mar',
      why: 'Rainy season; Inca Trail closed in February for maintenance; lush green landscapes',
      savings: 'Up to 50% savings on accommodation and tours',
    },
    proTip:
      'Book Machu Picchu for the first week of September — dry weather continues, the Inca Trail has far fewer trekkers than July, and permits are easier to get.',
  },
  // ─── New countries (Africa batch) ───
  {
    country: 'south-africa',
    peakSeason: { months: 'Dec-Feb (Cape Town), Jul-Sep (safari)', why: 'Summer in Cape Town and dry winter safari season in Kruger draw peak crowds' },
    shoulderSeason: {
      months: 'Mar, Oct',
      why: 'March in Cape Town is a local secret — summer crowds leave, wine harvest is in full swing, weather is still warm (26°C), and hotel prices drop 30%. October brings spring wildflowers.',
      savings: '25-35% lower than December peak',
    },
    offSeason: {
      months: 'Jun-Aug (Cape Town), Nov-Mar (safari parks)',
      why: 'Cape Town winter is rainy but mild; safari parks have lush vegetation (harder to spot game)',
      savings: 'Up to 40% savings on accommodation',
    },
    proTip:
      'Visit Kruger in June — dry season has just started, animals congregate at waterholes, lodge rates are 30% lower than August peak, and you\'ll share sightings with far fewer vehicles.',
  },
  {
    country: 'kenya',
    peakSeason: { months: 'Aug-Sep, Dec-Jan', why: 'Great Migration river crossings in August-September and dry January-February draw safari crowds' },
    shoulderSeason: {
      months: 'Jun-Jul',
      why: 'June-July in the Masai Mara is superb — the herds are arriving, dry season makes wildlife spotting easy, but the August Migration frenzy hasn\'t started. Lodge prices are 25% lower.',
      savings: '25-30% lower than August-September peak',
    },
    offSeason: {
      months: 'Apr-May (long rains)',
      why: 'Heavy rains make roads impassable in some parks; many lodges close or offer steep discounts',
      savings: 'Up to 50% savings on safari lodges',
    },
    proTip:
      'Book a Masai Mara safari the last week of June — the wildebeest herds are entering the reserve, predator action is constant, and you\'ll pay 25% less than the August river-crossing frenzy.',
  },
  {
    country: 'tanzania',
    peakSeason: { months: 'Jul-Sep, Dec-Feb', why: 'Great Migration in the Serengeti and Kilimanjaro climbing season bring peak crowds' },
    shoulderSeason: {
      months: 'Jun, Oct',
      why: 'June is Tanzania\'s best-kept secret — dry season begins, Serengeti herds are moving north, Ngorongoro Crater is crystal-clear, and lodge prices haven\'t hit July-August peaks.',
      savings: '25-30% lower than peak safari season',
    },
    offSeason: {
      months: 'Apr-May (long rains)',
      why: 'Heavy rains make many roads impassable; calving season (Jan-Feb) has lower crowds in southern Serengeti',
      savings: 'Up to 45% savings on safari packages',
    },
    proTip:
      'Climb Kilimanjaro in January-February — it\'s warm, the Lemosho route is quiet, clear summit views are common, and you avoid the cold July-August crowds on the mountain.',
  },
  {
    country: 'costa-rica',
    peakSeason: { months: 'Dec-Apr', why: 'Dry season brings North American winter escapees and school holiday crowds' },
    shoulderSeason: {
      months: 'May, Nov',
      why: 'November is magical — rains ease, everything is lush green, waterfalls are at their most powerful, turtle nesting continues, and prices drop 35% from dry season peaks.',
      savings: '30-40% lower than dry season peak',
    },
    offSeason: {
      months: 'Sep-Oct',
      why: 'Wettest months with heavy afternoon rains, but mornings are usually dry and prices bottom out',
      savings: 'Up to 50% savings on eco-lodges',
    },
    proTip:
      'Visit Monteverde Cloud Forest in May — the "green season" starts, the forest is at its most ethereal with mist, quetzals are nesting, and you\'ll have hanging bridges to yourself.',
  },
  {
    country: 'israel',
    peakSeason: { months: 'Mar-May, Sep-Oct (Jewish holidays), Christmas/Easter', why: 'Spring and autumn pilgrimages plus Jewish high holidays bring massive crowds' },
    shoulderSeason: {
      months: 'Nov, Feb-Mar',
      why: 'November in Jerusalem is ideal — pilgrimage season ends, weather is mild (18°C), hotel prices drop 30%, and the Old City feels authentically local rather than tourist-packed.',
      savings: '30% lower than peak seasons',
    },
    offSeason: {
      months: 'Jun-Aug',
      why: 'Intense heat (35°C+ in Jerusalem, 45°C at Dead Sea) but beaches in Tel Aviv are at their best',
      savings: 'Up to 40% savings on Jerusalem hotels',
    },
    proTip:
      'Visit Jerusalem the week after Sukkot (late October) — the holiday crowds vanish overnight, weather is still warm, and you can walk the Old City at your own pace.',
  },
  // ─── New countries (Asian batch from other agents) ───
  {
    country: 'indonesia',
    peakSeason: { months: 'Jul-Aug, Christmas/NYE', why: 'Peak dry season and holiday periods bring massive crowds to Bali and Komodo' },
    shoulderSeason: {
      months: 'May, Sep',
      why: 'May and September are Indonesia\'s golden months — dry season conditions, 30% fewer tourists than July-August, and Bali hotel prices drop significantly.',
      savings: '25-35% lower than peak season',
    },
    offSeason: {
      months: 'Nov-Mar',
      why: 'Wet season with heavy tropical rains, but Bali is still beautiful between showers',
      savings: 'Up to 50% savings on Bali villas and resorts',
    },
    proTip:
      'Visit Bali the first two weeks of September — dry season conditions, rice terraces are golden, temple ceremonies are frequent, and prices are 30% below August peaks.',
  },
  {
    country: 'vietnam',
    peakSeason: { months: 'Dec-Mar (south), Oct-Dec (north)', why: 'Dry, cool weather draws the most visitors to each region' },
    shoulderSeason: {
      months: 'Mar, Oct',
      why: 'March in the south and October in the north offer excellent weather with 25-30% fewer tourists. Ha Long Bay in October has clear skies and calm seas.',
      savings: '25-30% lower than peak season',
    },
    offSeason: {
      months: 'May-Sep (south), Jul-Sep (central coast)',
      why: 'Monsoon rains; central Vietnam typhoon risk in October-November',
      savings: 'Up to 45% savings on hotels and tours',
    },
    proTip:
      'Travel Vietnam from south to north in March — start in Ho Chi Minh City (dry, warm), end in Hanoi (spring bloom). You\'ll "chase the season" and get perfect weather the whole trip.',
  },
  {
    country: 'cambodia',
    peakSeason: { months: 'Dec-Feb', why: 'Cool, dry weather is the most comfortable time to explore Angkor Wat and Phnom Penh' },
    shoulderSeason: {
      months: 'Nov',
      why: 'November is Cambodia\'s best-kept secret — rains just ended, the moats at Angkor are full (best reflections), temperature is cool, and crowds haven\'t arrived for December peak.',
      savings: '20-30% lower than December-January peak',
    },
    offSeason: {
      months: 'May-Oct',
      why: 'Rainy season with afternoon downpours; Tonle Sap lake at its highest and most impressive',
      savings: 'Up to 50% savings on hotels and tours',
    },
    proTip:
      'Visit Angkor Wat the first week of November — the moat is perfectly full for mirror-like reflections, morning light is golden, and you\'ll beat the December tourist tsunami by a month.',
  },
  {
    country: 'south-korea',
    peakSeason: { months: 'Apr (cherry blossom), Oct (autumn leaves)', why: 'Cherry blossom season and autumn foliage draw massive domestic and international crowds' },
    shoulderSeason: {
      months: 'May, Oct',
      why: 'Late May is ideal — cherry blossoms are done, lush green everywhere, perfect hiking weather, and temple stays are available without weeks of advance booking.',
      savings: '20-30% lower than cherry blossom season',
    },
    offSeason: {
      months: 'Dec-Feb',
      why: 'Cold winters (-10°C in Seoul) but ski season thrives and jjimjilbangs (bathhouses) are cozy',
      savings: 'Up to 35% savings on accommodation',
    },
    proTip:
      'Visit Seoul in the third week of October — Bukchon Hanok Village with red maples is stunning, palace gardens peak, and you avoid the first-two-weeks madness when Korean tourists also flood in.',
  },
  {
    country: 'singapore',
    peakSeason: { months: 'Dec-Jan, Jun-Jul (school holidays)', why: 'Year-end holidays and school vacation periods bring family tourists' },
    shoulderSeason: {
      months: 'Feb, Sep',
      why: 'February is Singapore\'s driest month with the least rainfall. Chinese New Year adds festive energy and light displays. Gardens are in bloom.',
      savings: '15-25% lower than peak holiday season',
    },
    offSeason: {
      months: 'Year-round viable',
      why: 'Singapore is a 12-month destination — tropical climate varies little. March-May are slightly quieter.',
      savings: '10-20% savings on hotels mid-week',
    },
    proTip:
      'Singapore is expensive — but hawker centres serve Michelin-starred food for $3-5. Eat at Maxwell Food Centre and Lau Pa Sat and you\'ll eat better than most hotel restaurants.',
  },
  {
    country: 'uae',
    peakSeason: { months: 'Nov-Mar', why: 'Cool, dry winter weather (20-28°C) is the only comfortable time to be outdoors' },
    shoulderSeason: {
      months: 'Oct, Apr',
      why: 'October and April sit on the edges of comfort — temperatures are warm but not deadly (30-35°C), hotel prices drop 30%, and outdoor activities are still feasible in mornings and evenings.',
      savings: '30-40% lower than peak winter season',
    },
    offSeason: {
      months: 'Jun-Sep',
      why: 'Extreme heat (45-50°C) makes outdoor activities dangerous; indoor attractions still viable',
      savings: 'Up to 60% savings on 5-star hotels',
    },
    proTip:
      'Dubai in early October — summer heat breaks, hotel prices are at their lowest before November tourists arrive, and indoor attractions (malls, aquariums, ski slopes) are crowd-free.',
  },
  // ─── New countries (European/Americas batch from other agents) ───
  {
    country: 'portugal',
    peakSeason: { months: 'Jun-Aug', why: 'European summer holidays pack Lisbon, the Algarve beaches, and Porto' },
    shoulderSeason: {
      months: 'May, Oct',
      why: 'May and October are Portugal\'s sweet spots — warm sunshine (22-25°C), uncrowded tram rides in Lisbon, Algarve beaches without the umbrellas, and hotel prices 30% lower.',
      savings: '25-35% lower than summer peak',
    },
    offSeason: {
      months: 'Nov-Feb',
      why: 'Mild but rainy winters; Lisbon is still charming and many attractions are crowd-free',
      savings: 'Up to 40% savings on accommodation',
    },
    proTip:
      'Visit Lisbon the last week of May — weather is warm, Tram 28 is rideable without sardine-can crowds, pastéis de nata taste the same, and Airbnb prices are half of July.',
  },
  {
    country: 'germany',
    peakSeason: { months: 'Jun-Aug, Christmas markets (Dec)', why: 'Summer holidays and the famous Christmas markets draw peak crowds' },
    shoulderSeason: {
      months: 'May, Sep',
      why: 'September in Bavaria is ideal — Oktoberfest starts in late September, autumn colours begin, summer crowds leave, and hiking in the Alps is at its best with stable weather.',
      savings: '25-30% lower than summer peak',
    },
    offSeason: {
      months: 'Jan-Mar',
      why: 'Cold, grey, and dark — but beer halls are cozy, museums are empty, and Berlin is cheapest',
      savings: 'Up to 40% savings on hotels',
    },
    proTip:
      'Visit Berlin in early May — the city comes alive with outdoor cafés, Mauerpark flea market is buzzing, museum queues are short, and flights from anywhere in Europe are cheap.',
  },
  {
    country: 'brazil',
    peakSeason: { months: 'Dec-Mar (summer), Carnival (Feb/Mar)', why: 'Summer holidays, Carnival, and New Year\'s Eve in Rio draw massive crowds' },
    shoulderSeason: {
      months: 'Apr, Oct',
      why: 'April in Rio is beautiful — Carnival madness is over, weather is warm (27°C), beaches are reclaimed by locals, and hotel prices plummet 35% from the February frenzy.',
      savings: '30-40% lower than Carnival season',
    },
    offSeason: {
      months: 'Jun-Aug (except Pantanal)',
      why: 'Winter is mild in Rio (20-25°C) but cooler in the south; Amazon is flooding; Pantanal wildlife peaks',
      savings: 'Up to 45% savings on beachfront hotels',
    },
    proTip:
      'Rio in late April — post-Carnival, warm autumn weather, Sugarloaf and Christ the Redeemer without hour-long queues, and Copacabana hotels at 40% off. The city still has samba energy.',
  },
  {
    country: 'new-zealand',
    peakSeason: { months: 'Dec-Feb (summer)', why: 'Summer holidays bring domestic and international tourists for hiking, beaches, and outdoor adventure' },
    shoulderSeason: {
      months: 'Mar, Nov',
      why: 'March in New Zealand is sublime — summer crowds leave, autumn colours begin in Queenstown, the Great Walks are less booked, and campervan rental drops 30%.',
      savings: '25-35% lower than peak summer',
    },
    offSeason: {
      months: 'Jun-Aug',
      why: 'Winter brings ski season (Queenstown, Wanaka) but shorter days and rain on the South Island west coast',
      savings: 'Up to 40% savings on accommodation outside ski towns',
    },
    proTip:
      'Book the Milford Track or Routeburn Track for early March — the summer rush is over, hut bookings are available, and autumn light in Fiordland is spectacular.',
  },
  // ─── New countries (30 missing) ───
  {
    country: 'austria',
    peakSeason: { months: 'Jul-Aug (summer), Dec-Mar (ski)', why: 'Summer hiking and winter skiing bring peak crowds to the Alps and Vienna' },
    shoulderSeason: {
      months: 'May, Sep-Oct',
      why: 'Ski crowds are gone but hiking is perfect. Vienna\'s cafes have outdoor seating, alpine meadows are in bloom (May) or golden (Oct), and prices drop significantly.',
      savings: '25-35% lower than peak season',
    },
    offSeason: {
      months: 'Nov, Apr',
      why: 'Too late for autumn colour, too early for ski or summer — but Vienna is vibrant year-round and hotel prices bottom out',
      savings: 'Up to 40% savings on Alpine accommodation',
    },
    proTip:
      'Visit the Salzkammergut lake region in early September — summer tourists leave, the water is still warm enough for swimming, and autumn light on the mountains is extraordinary.',
  },
  {
    country: 'canada',
    peakSeason: { months: 'Jul-Aug, Dec-Mar (ski)', why: 'Summer road trips and winter ski season pack Banff, Vancouver, and the Rockies' },
    shoulderSeason: {
      months: 'Sep-Oct',
      why: 'Fall foliage across Eastern Canada is spectacular — Quebec and Ontario explode in red and gold. Crowds thin, temperatures are crisp, and hotel prices drop 30%.',
      savings: '30% lower than summer peak',
    },
    offSeason: {
      months: 'Nov, Mar-Apr (except ski)',
      why: 'Shoulder between seasons — mud season in the Rockies, but cities like Montreal and Toronto are lively',
      savings: 'Up to 40% savings on flights and hotels',
    },
    proTip:
      'Drive the Cabot Trail in Cape Breton during the first two weeks of October — the fall colours are at their peak, and it\'s one of the world\'s most scenic drives without summer RV traffic.',
  },
  {
    country: 'china',
    peakSeason: { months: 'May, Oct 1-7 (Golden Week)', why: 'Golden Week and Labour Day holidays bring 300+ million domestic tourists — avoid at all costs' },
    shoulderSeason: {
      months: 'Apr-May, Sep-Oct (avoid Oct 1-7!)',
      why: 'April and late September offer perfect weather for the Great Wall and Xi\'an. Skip Golden Week (Oct 1-7) when every site is overwhelmed.',
      savings: '25-35% lower than Golden Week',
    },
    offSeason: {
      months: 'Dec-Feb (except Chinese New Year)',
      why: 'Cold in the north, but southern China (Yunnan, Guangzhou) is pleasant. Fewer tourists everywhere',
      savings: 'Up to 45% savings on tours and hotels',
    },
    proTip:
      'Visit the Great Wall at Mutianyu section on a weekday in late September — crystal-clear autumn skies, no Golden Week crowds, and the surrounding hills are turning gold.',
  },
  {
    country: 'croatia',
    peakSeason: { months: 'Jul-Aug', why: 'European summer holidays and cruise ships flood Dubrovnik and Split' },
    shoulderSeason: {
      months: 'May, Sep-Oct',
      why: 'Dubrovnik without Game of Thrones crowds — September water is still warm, old town streets are walkable, and island ferries have empty seats. Prices drop 30%.',
      savings: '30-40% lower than summer peak',
    },
    offSeason: {
      months: 'Nov-Mar',
      why: 'Many coastal towns shut down. Zagreb is lively with Christmas markets in December',
      savings: 'Up to 50% savings on Adriatic accommodation',
    },
    proTip:
      'Visit Dubrovnik the last week of September — cruise ship traffic drops dramatically, the Adriatic is at its warmest, and you can walk the city walls without crowds.',
  },
  {
    country: 'cuba',
    peakSeason: { months: 'Dec-Mar', why: 'Dry season and North American winter drive peak tourism to Havana and the beaches' },
    shoulderSeason: {
      months: 'Apr-May, Nov',
      why: 'April and November sit on the edges of hurricane season but offer dry, warm weather. Havana\'s music scene is year-round and hotel prices drop 25%.',
      savings: '25-30% lower than dry season peak',
    },
    offSeason: {
      months: 'Jun-Oct',
      why: 'Hurricane season with heavy rains, but Havana\'s culture never stops and prices plummet',
      savings: 'Up to 45% savings on casa particulares',
    },
    proTip:
      'Visit Havana in early November — hurricane risk is fading, the city is uncrowded, jazz festivals begin, and classic car tours cost half of January prices.',
  },
  {
    country: 'czech-republic',
    peakSeason: { months: 'Jun-Aug, Christmas markets (Dec)', why: 'Summer holidays and December Christmas markets pack Prague\'s Old Town' },
    shoulderSeason: {
      months: 'May, Sep-Oct',
      why: 'Prague without summer hordes — September has warm days, golden light on the castle, Charles Bridge at sunrise is yours alone, and beer garden season continues.',
      savings: '25-35% lower than summer peak',
    },
    offSeason: {
      months: 'Jan-Mar',
      why: 'Cold and grey but Prague\'s pubs are cozy, museums are empty, and hotel prices are rock-bottom',
      savings: 'Up to 45% savings on accommodation',
    },
    proTip:
      'Walk Charles Bridge at 6 AM in late September — you\'ll have the 30 statues and Prague Castle view almost entirely to yourself. The morning mist on the Vltava is magical.',
  },
  {
    country: 'denmark',
    peakSeason: { months: 'Jun-Aug', why: 'Long daylight hours, Tivoli Gardens in full swing, and outdoor dining season' },
    shoulderSeason: {
      months: 'May-Jun, Sep',
      why: 'May and June bring the longest days and midnight sun approaching. September is warm, cheaper, and Copenhagen\'s food scene is always world-class.',
      savings: '20-30% lower than summer peak',
    },
    offSeason: {
      months: 'Nov-Mar',
      why: 'Dark and cold, but hygge culture peaks — candles, cozy cafes, and Tivoli\'s Christmas market is magical',
      savings: 'Up to 35% savings on hotels',
    },
    proTip:
      'Visit Copenhagen in late May — the city is alive with outdoor energy, Tivoli just opened for summer, and you get 17+ hours of daylight without July prices.',
  },
  {
    country: 'ecuador',
    peakSeason: { months: 'Jun-Sep (Galapagos), Dec-Apr (coast)', why: 'Galapagos peak season and coastal dry season bring the most visitors' },
    shoulderSeason: {
      months: 'Jun-Sep (highlands dry season)',
      why: 'The highlands are dry and sunny while the coast and Amazon are wetter. Quito and the Avenue of Volcanoes are at their best with clear skies.',
      savings: '20-30% lower than Galapagos peak',
    },
    offSeason: {
      months: 'Oct-Nov (except Galapagos)',
      why: 'Rainy season on the mainland, but the Amazon is lush and Galapagos has warm water and active wildlife',
      savings: 'Up to 40% savings on highland tours',
    },
    proTip:
      'Visit the Galapagos in June — the water is cooler (great for snorkeling with sea lions), seabird nesting season is underway, and prices haven\'t hit July-August peaks.',
  },
  {
    country: 'finland',
    peakSeason: { months: 'Jun-Aug, Dec-Jan (Lapland)', why: 'Midnight sun in summer and Northern Lights and Santa Claus Village in winter' },
    shoulderSeason: {
      months: 'May-Jun, Sep',
      why: 'June brings midnight sun without July crowds. September in Lapland offers ruska (autumn colours) and early Northern Lights with 30% lower prices than December.',
      savings: '30% lower than peak Lapland season',
    },
    offSeason: {
      months: 'Oct-Nov, Feb-Mar',
      why: 'Dark and cold but sauna culture thrives, and late February brings returning daylight and great skiing',
      savings: 'Up to 40% savings on Lapland cabins',
    },
    proTip:
      'Visit Lapland in mid-September for ruska season — the tundra turns red and gold, Northern Lights begin, and glass igloo hotels are half the price of December.',
  },
  {
    country: 'hungary',
    peakSeason: { months: 'Jun-Aug', why: 'Summer festivals (Sziget), Danube cruises, and thermal bath season draw peak crowds' },
    shoulderSeason: {
      months: 'Apr-May, Sep-Oct',
      why: 'Budapest thermal baths without crowds — September offers warm weather, open-air ruin bars, and the Budapest Wine Festival. Hotel prices drop 30%.',
      savings: '30% lower than summer peak',
    },
    offSeason: {
      months: 'Nov-Feb (except Christmas)',
      why: 'Cold but the thermal baths are magical with steam rising in winter air. Christmas markets are beautiful.',
      savings: 'Up to 40% savings on accommodation',
    },
    proTip:
      'Soak in Széchenyi Baths on a cold October evening — steam rises around the yellow palace, the outdoor pools are uncrowded, and you\'ll pay 25% less than summer.',
  },
  {
    country: 'iceland',
    peakSeason: { months: 'Jun-Aug', why: 'Midnight sun, accessible highland roads, and puffin season bring massive tourist numbers' },
    shoulderSeason: {
      months: 'May-Jun, Sep',
      why: 'June offers midnight sun with fewer crowds than July-August. September brings Northern Lights possibilities, autumn colours, and 30% cheaper accommodation.',
      savings: '25-35% lower than summer peak',
    },
    offSeason: {
      months: 'Nov-Mar',
      why: 'Dark winters with limited daylight, but Northern Lights are spectacular and ice caves open. Some highland roads close.',
      savings: 'Up to 40% savings on car rental and hotels',
    },
    proTip:
      'Drive the Ring Road in early September — all roads are still open, crowds have left, Northern Lights start appearing, and the landscape has autumn tones.',
  },
  {
    country: 'ireland',
    peakSeason: { months: 'Jun-Aug', why: 'Summer holidays bring the most visitors to Dublin, the Wild Atlantic Way, and the Cliffs of Moher' },
    shoulderSeason: {
      months: 'May, Sep',
      why: 'Ireland is green and not too rainy in May and September. Longer daylight, fewer tour buses on narrow roads, and B&B prices drop 25%.',
      savings: '25% lower than summer peak',
    },
    offSeason: {
      months: 'Nov-Feb',
      why: 'Cold, wet, and dark — but pubs have turf fires, trad music sessions are intimate, and hotels are cheapest',
      savings: 'Up to 40% savings on accommodation',
    },
    proTip:
      'Drive the Wild Atlantic Way in late May — the hedgerows are blooming, roads are empty, and you\'ll have the Cliffs of Moher viewpoints to yourself.',
  },
  {
    country: 'jamaica',
    peakSeason: { months: 'Dec-Apr', why: 'Dry season and North American winter bring peak tourist traffic to Montego Bay and Negril' },
    shoulderSeason: {
      months: 'Apr-Jun, Nov',
      why: 'The hurricane gap between seasons offers warm, mostly dry weather. April-June and November have great beach conditions with 25% lower prices.',
      savings: '25-30% lower than winter peak',
    },
    offSeason: {
      months: 'Jul-Oct',
      why: 'Hurricane season with occasional heavy rains, but reggae festivals continue and resort prices plummet',
      savings: 'Up to 50% savings on all-inclusive resorts',
    },
    proTip:
      'Visit Negril in early November — hurricane season is essentially over, the water is warm, Seven Mile Beach is uncrowded, and all-inclusive rates are at their lowest.',
  },
  {
    country: 'laos',
    peakSeason: { months: 'Nov-Feb', why: 'Cool, dry season is the most comfortable time for Luang Prabang and Mekong river trips' },
    shoulderSeason: {
      months: 'Oct-Nov',
      why: 'Rains are ending, everything is lush green, waterfalls like Kuang Si are at full power, and Luang Prabang is blissfully uncrowded. Prices are 30% lower.',
      savings: '30% lower than dry season peak',
    },
    offSeason: {
      months: 'May-Sep',
      why: 'Monsoon season with heavy rains, but the landscape is at its most beautiful and tourist sites are empty',
      savings: 'Up to 45% savings on guesthouses and tours',
    },
    proTip:
      'Visit Luang Prabang in late October — the morning alms-giving ceremony is intimate without tourist crowds, Kuang Si Falls is thundering, and the Mekong is high and scenic.',
  },
  {
    country: 'malaysia',
    peakSeason: { months: 'Dec-Feb, Jun-Aug', why: 'School holidays and dry season on the west coast bring the most visitors' },
    shoulderSeason: {
      months: 'Mar-Apr, Sep-Oct',
      why: 'Between monsoons — the weather is warm and generally dry on both coasts. KL is less crowded, island resorts drop prices, and diving conditions are excellent.',
      savings: '20-30% lower than peak season',
    },
    offSeason: {
      months: 'Nov-Jan (east coast)',
      why: 'Northeast monsoon closes many east coast islands (Perhentian, Redang). West coast and KL are fine year-round.',
      savings: 'Up to 40% savings on east coast resorts',
    },
    proTip:
      'Visit the Perhentian Islands in early March — the monsoon just ended, the water is crystal clear, resorts are reopening with introductory rates, and you\'ll have the beaches to yourself.',
  },
  {
    country: 'maldives',
    peakSeason: { months: 'Dec-Mar', why: 'Dry northeast monsoon season brings perfect weather and the highest resort prices' },
    shoulderSeason: {
      months: 'Apr-May, Nov',
      why: 'The shoulder of the dry season — still mostly sunny with occasional showers. Resort prices drop 30-40% from peak, and the reefs are just as stunning.',
      savings: '30-40% lower than dry season peak',
    },
    offSeason: {
      months: 'Jun-Oct',
      why: 'Southwest monsoon brings rain and waves, but surfing is excellent and resort prices bottom out',
      savings: 'Up to 50% savings on overwater villas',
    },
    proTip:
      'Book the Maldives in early November — the monsoon transition means improving weather, manta ray season peaks, and you\'ll get overwater villas at 40% off peak rates.',
  },
  {
    country: 'myanmar',
    peakSeason: { months: 'Nov-Feb', why: 'Cool, dry season is the best time for Bagan, Inle Lake, and temple exploration' },
    shoulderSeason: {
      months: 'Oct-Nov',
      why: 'Rains ending, landscapes are lush green, Bagan\'s temples are uncrowded, and the light for sunrise balloon rides is spectacular. Prices are 25% lower.',
      savings: '25-30% lower than peak season',
    },
    offSeason: {
      months: 'May-Sep',
      why: 'Monsoon rains — some roads become impassable, but Inle Lake is at its fullest and most photogenic',
      savings: 'Up to 45% savings on hotels and river cruises',
    },
    proTip:
      'Visit Bagan in late October — the rain clears to reveal dramatic skies, sunrise hot air balloon rides resume, and you can explore 2,000+ temples without another tourist in sight.',
  },
  {
    country: 'netherlands',
    peakSeason: { months: 'Apr (tulips), Jun-Aug', why: 'Tulip season and summer holidays pack Amsterdam\'s canals and museums' },
    shoulderSeason: {
      months: 'Apr-May (tulip season!), Sep',
      why: 'Late April is peak tulip season at Keukenhof — worth the crowds. September has warm weather, King\'s Night energy lingering, and canal-side terraces without summer madness.',
      savings: '20-30% lower than summer peak',
    },
    offSeason: {
      months: 'Nov-Feb',
      why: 'Cold and damp, but museums are empty, ice skating on canals is magical, and hotel prices in Amsterdam drop significantly',
      savings: 'Up to 40% savings on Amsterdam hotels',
    },
    proTip:
      'Visit Keukenhof in the third week of April — it\'s peak bloom for tulips, and if you arrive at opening (8 AM) you\'ll have 30 minutes of crowd-free photos before the tour buses.',
  },
  {
    country: 'norway',
    peakSeason: { months: 'Jun-Aug', why: 'Midnight sun, fjord cruises, and hiking season draw the largest crowds' },
    shoulderSeason: {
      months: 'May-Jun, Sep',
      why: 'Late May has midnight sun approaching without July\'s cruise ship crowds. September brings autumn colours in the fjords and 30% lower prices.',
      savings: '25-35% lower than summer peak',
    },
    offSeason: {
      months: 'Nov-Mar',
      why: 'Dark polar nights in the north, but Northern Lights in Tromsø are spectacular and Norway\'s ski season thrives',
      savings: 'Up to 40% savings on fjord region hotels',
    },
    proTip:
      'Cruise the Norwegian fjords in early June — the midnight sun is shining, waterfalls from spring snowmelt are at their most powerful, and prices haven\'t hit July peaks.',
  },
  {
    country: 'oman',
    peakSeason: { months: 'Nov-Mar', why: 'Cool winter weather (20-30°C) is the only comfortable time for desert and coastal exploration' },
    shoulderSeason: {
      months: 'Oct-Nov, Feb-Mar',
      why: 'The edges of the comfortable season — temperatures are warm but manageable (30-35°C), crowds are lighter, and hotel prices drop 25-30%.',
      savings: '25-30% lower than peak winter season',
    },
    offSeason: {
      months: 'May-Sep',
      why: 'Extreme heat (45°C+) makes desert and outdoor activities dangerous. Salalah is the exception — its khareef (monsoon) brings lush green.',
      savings: 'Up to 50% savings on luxury desert camps',
    },
    proTip:
      'Visit Salalah during the khareef season (Jul-Sep) — while the rest of Oman bakes, Salalah transforms into a lush green paradise with waterfalls and cool mist.',
  },
  {
    country: 'panama',
    peakSeason: { months: 'Dec-Apr', why: 'Dry season brings the most visitors to Panama City, the Canal, and the San Blas Islands' },
    shoulderSeason: {
      months: 'Dec-Apr (dry season), May',
      why: 'May edges into the rainy season but mornings are dry, the Canal operates normally, and hotel prices start dropping. December-April is reliably dry.',
      savings: '20-25% lower in May vs peak dry season',
    },
    offSeason: {
      months: 'Jun-Nov',
      why: 'Rainy season with heavy afternoon showers; Caribbean side is wetter. Mornings are usually dry and prices drop significantly.',
      savings: 'Up to 40% savings on hotels and tours',
    },
    proTip:
      'Visit San Blas Islands in early May — the dry season is just ending, the indigenous Guna communities welcome visitors, and boat trips are uncrowded and cheaper.',
  },
  {
    country: 'philippines',
    peakSeason: { months: 'Dec-Feb', why: 'Cool, dry season and Christmas holidays bring domestic and international peak crowds' },
    shoulderSeason: {
      months: 'Nov-Feb (dry)',
      why: 'November through February is the dry season — perfect for island-hopping in Palawan and Boracay. November and February are slightly less crowded than the Christmas peak.',
      savings: '20-25% lower than Christmas/New Year peak',
    },
    offSeason: {
      months: 'Jun-Oct',
      why: 'Typhoon season with heavy rains, especially August-October. But surfing in Siargao peaks during this time.',
      savings: 'Up to 45% savings on beach resorts',
    },
    proTip:
      'Visit Palawan (El Nido, Coron) in November — the rains have eased, island-hopping tours resume, the lagoons are emerald-green, and resort prices are 30% below January.',
  },
  {
    country: 'poland',
    peakSeason: { months: 'Jun-Aug', why: 'Summer holidays bring the most visitors to Krakow, Warsaw, and the Tatra Mountains' },
    shoulderSeason: {
      months: 'May, Sep-Oct',
      why: 'May and September offer perfect weather for exploring Krakow\'s Old Town and Auschwitz without summer crowds. Autumn colours in the Tatra Mountains are stunning.',
      savings: '25-30% lower than summer peak',
    },
    offSeason: {
      months: 'Nov-Mar',
      why: 'Cold and dark, but Krakow\'s Christmas market is magical and ski season in Zakopane begins',
      savings: 'Up to 40% savings on accommodation',
    },
    proTip:
      'Visit Krakow in the last week of September — the weather is still warm, Wawel Castle has short queues, and Kazimierz\'s Jewish quarter cafes have outdoor seating without July crowds.',
  },
  {
    country: 'romania',
    peakSeason: { months: 'Jun-Aug', why: 'Summer brings hikers to the Carpathians and tourists to Transylvania\'s castles' },
    shoulderSeason: {
      months: 'May, Sep-Oct',
      why: 'May has wildflowers in Transylvania and perfect hiking weather. September-October brings autumn colours, fewer tourists at Bran Castle, and lower prices.',
      savings: '25-30% lower than summer peak',
    },
    offSeason: {
      months: 'Nov-Mar',
      why: 'Cold winters, but ski season in Poiana Brașov and Christmas traditions in Maramureș are worth it',
      savings: 'Up to 40% savings on accommodation',
    },
    proTip:
      'Visit Transylvania in early October — autumn colours frame Bran and Peleș castles beautifully, the Carpathian hiking trails are empty, and you avoid the summer Dracula-tour crowds.',
  },
  {
    country: 'russia',
    peakSeason: { months: 'Jun-Aug', why: 'White Nights in St. Petersburg and warm summer weather draw the most visitors' },
    shoulderSeason: {
      months: 'May-Jun, Sep',
      why: 'Late May in Moscow has warm weather and Victory Day energy. September brings golden autumn — birch forests glow, museum queues shorten, and hotel prices drop 30%.',
      savings: '30% lower than White Nights peak',
    },
    offSeason: {
      months: 'Nov-Mar',
      why: 'Brutal cold (-20°C), but Moscow and St. Petersburg are stunningly beautiful under snow. Ballet season peaks.',
      savings: 'Up to 45% savings on hotels',
    },
    proTip:
      'Visit St. Petersburg in the last week of May — the White Nights are beginning, palace gardens open, the Hermitage has manageable queues, and you avoid the June-July crush.',
  },
  {
    country: 'sweden',
    peakSeason: { months: 'Jun-Aug', why: 'Midnight sun, Midsummer celebrations, and Stockholm archipelago cruises draw peak visitors' },
    shoulderSeason: {
      months: 'May-Jun, Sep',
      why: 'Late May brings long daylight and blooming Stockholm without July cruise ship crowds. September has golden autumn, fewer tourists, and the food scene is year-round excellent.',
      savings: '25-30% lower than summer peak',
    },
    offSeason: {
      months: 'Nov-Mar',
      why: 'Dark and cold, but Swedish Lapland offers Northern Lights, ice hotels, and dog sledding. Stockholm\'s Nobel season adds glamour.',
      savings: 'Up to 35% savings on hotels',
    },
    proTip:
      'Visit Stockholm in early June — the city celebrates the approach of Midsummer, outdoor restaurants open on every square, and daylight lasts nearly 19 hours.',
  },
  {
    country: 'switzerland',
    peakSeason: { months: 'Jul-Aug (summer), Dec-Mar (ski)', why: 'Alpine hiking in summer and skiing in winter bring the highest prices in Europe' },
    shoulderSeason: {
      months: 'May, Sep-Oct',
      why: 'Ski crowds are gone and hiking trails open. May wildflowers in the Alps are spectacular, September-October has clear skies and autumn colours on the mountains.',
      savings: '25-35% lower than peak season',
    },
    offSeason: {
      months: 'Nov, Apr',
      why: 'Between seasons — ski lifts close, some mountain passes shut. But cities like Zurich, Bern, and Lucerne are uncrowded.',
      savings: 'Up to 40% savings on Alpine hotels',
    },
    proTip:
      'Hike the Bernese Oberland in mid-September — the Eiger, Mönch, and Jungfrau are crystal clear, cable cars are running, crowds have vanished, and hotel prices are 30% below August.',
  },
  {
    country: 'tunisia',
    peakSeason: { months: 'Jun-Aug', why: 'European beach holidays pack the Mediterranean coast and resorts' },
    shoulderSeason: {
      months: 'Apr-May, Sep-Oct',
      why: 'Perfect for Sahara desert trips and coastal exploration. April-May has wildflowers, September-October has warm sea temperatures without the scorching summer heat.',
      savings: '25-35% lower than summer peak',
    },
    offSeason: {
      months: 'Nov-Mar',
      why: 'Cool and occasionally rainy, but the Sahara is comfortable and Tunis medina is atmospheric and uncrowded',
      savings: 'Up to 40% savings on beach resorts',
    },
    proTip:
      'Visit the Sahara (Douz, Tozeur) in October — the deadly summer heat has broken, the desert light is golden, and you can camp under the stars in perfect 25°C conditions.',
  },
  {
    country: 'sri-lanka',
    peakSeason: { months: 'Dec-Mar (west/south coast), Jul-Aug (east coast)', why: 'Dry seasons on each coast bring peak tourist numbers' },
    shoulderSeason: {
      months: 'Oct-Nov, Mar-Apr',
      why: 'October-November brings the inter-monsoon period — short showers but mostly sunny. The cultural triangle (Sigiriya, Kandy) is uncrowded and prices drop 30%.',
      savings: '30% lower than peak season',
    },
    offSeason: {
      months: 'May-Jun (west coast), Nov-Dec (east coast)',
      why: 'Monsoon season on each coast, but you can chase the dry side of the island year-round',
      savings: 'Up to 40% savings on beach resorts',
    },
    proTip:
      'Visit the hill country (Ella, Nuwara Eliya) in March-April — the tea plantations are lush green, the famous train ride is magical, and highland temperatures are perfect for hiking.',
  },
  {
    country: 'nepal',
    peakSeason: { months: 'Oct-Nov, Mar-Apr', why: 'Clear skies for Himalayan trekking and Everest Base Camp expeditions' },
    shoulderSeason: {
      months: 'Oct-Nov, Mar-Apr',
      why: 'These are also the best trekking months — October has the clearest mountain views after monsoon, March-April brings rhododendron blooms. Book trekking permits early.',
      savings: '15-20% lower than peak October weeks',
    },
    offSeason: {
      months: 'Jun-Sep (monsoon), Dec-Feb (cold)',
      why: 'Monsoon rains make trekking difficult. Winter is cold at altitude but Chitwan safari is excellent and Kathmandu valley is pleasant.',
      savings: 'Up to 40% savings on trekking lodges and flights',
    },
    proTip:
      'Trek the Annapurna Circuit in late October — the monsoon has cleared the air for crystal-clear Himalayan views, the trails are busy but manageable, and teahouse accommodation is plentiful.',
  },
]

export const FIRST_TIMER_TIPS: Record<string, SmartTip[]> = {
  japan: [
    { country: 'japan', category: 'first-timer', title: 'Get a Japan Rail Pass', tip: 'Get a 7-day Japan Rail Pass before you arrive. It covers bullet trains, local JR lines, and some ferries — saving you hundreds of dollars.', icon: '🚄' },
    { country: 'japan', category: 'first-timer', title: 'Download Offline Japanese', tip: 'Download Google Translate offline Japanese pack. Most signs outside Tokyo are Japanese-only, and this will be your lifeline.', icon: '📱' },
    { country: 'japan', category: 'first-timer', title: 'Carry Cash', tip: 'Many restaurants, temples, and small shops don\'t accept cards. ATMs in 7-Eleven and post offices accept international cards.', icon: '💴' },
    { country: 'japan', category: 'first-timer', title: 'Buy a Suica Card', tip: 'Buy a Suica or Pasmo card at the airport. It works on all trains, buses, and even convenience stores across Japan.', icon: '🎫' },
    { country: 'japan', category: 'first-timer', title: 'Bow When Greeting', tip: 'A slight bow (15 degrees) when greeting shows respect. You don\'t need to go deep — just a polite nod goes a long way.', icon: '🙇' },
  ],
  italy: [
    { country: 'italy', category: 'first-timer', title: 'Validate Train Tickets', tip: 'Always validate your train ticket at the green/yellow machines on the platform before boarding. Unvalidated tickets can result in hefty fines.', icon: '🎫' },
    { country: 'italy', category: 'first-timer', title: 'Book Museums Early', tip: 'Book Vatican and Uffizi tickets weeks ahead online. Walk-up lines can be 2-3 hours in season. Skip-the-line tickets are worth every cent.', icon: '🏛️' },
    { country: 'italy', category: 'first-timer', title: 'Avoid Piazza Cafes', tip: 'Don\'t sit at cafes in major piazzas — tourist trap prices. Walk one block away and you\'ll pay half for the same (or better) coffee.', icon: '☕' },
    { country: 'italy', category: 'first-timer', title: 'Lunch Over Dinner', tip: 'Lunch is significantly cheaper than dinner everywhere in Italy. Many restaurants offer a "menu del giorno" (daily menu) at lunch for a fraction of dinner prices.', icon: '🍝' },
  ],
  thailand: [
    { country: 'thailand', category: 'first-timer', title: 'Respect the Head', tip: 'Never touch anyone\'s head — it\'s considered the most sacred part of the body in Thai culture. This includes children.', icon: '🙏' },
    { country: 'thailand', category: 'first-timer', title: 'Temple Etiquette', tip: 'Remove shoes before entering temples. Cover knees and shoulders. Carry a scarf or sarong in your bag for temple visits.', icon: '🛕' },
    { country: 'thailand', category: 'first-timer', title: 'Respect the Monarchy', tip: 'Never disrespect the Thai monarchy. Lese-majeste laws are strictly enforced and apply to foreigners. Don\'t step on money (it bears the King\'s image).', icon: '👑' },
    { country: 'thailand', category: 'first-timer', title: 'Street Food is Safe', tip: 'Eat at street stalls — they\'re safer than you think. Look for stalls with high turnover (long queues = fresh food). Some of Thailand\'s best food is on the street.', icon: '🍜' },
    { country: 'thailand', category: 'first-timer', title: 'Negotiate Tuk-Tuk Prices', tip: 'Always negotiate tuk-tuk prices BEFORE getting in. Agree on a fixed price upfront, or use Grab (Southeast Asia\'s Uber) for transparent pricing.', icon: '🛺' },
  ],
  france: [
    { country: 'france', category: 'first-timer', title: 'Learn Basic French', tip: 'Always say "Bonjour" before any interaction — in shops, restaurants, hotels. It\'s considered rude to skip the greeting. "Merci" and "Excusez-moi" go a long way.', icon: '🇫🇷' },
    { country: 'france', category: 'first-timer', title: 'Museum Pass Savings', tip: 'Get the Paris Museum Pass (2 or 4 days). It covers 50+ museums including the Louvre, Orsay, and Versailles with skip-the-line access.', icon: '🎨' },
    { country: 'france', category: 'first-timer', title: 'Metro Over Taxis', tip: 'The Paris Metro is excellent and cheap. Buy a carnet of 10 tickets for savings. Taxis are expensive and traffic is terrible.', icon: '🚇' },
    { country: 'france', category: 'first-timer', title: 'Lunch Set Menus', tip: 'Look for "formule" or "menu du jour" at lunch — fixed-price 2-3 course meals at a fraction of a la carte dinner prices, even at upscale restaurants.', icon: '🥐' },
  ],
  india: [
    { country: 'india', category: 'first-timer', title: 'Drink Bottled Water Only', tip: 'Only drink sealed bottled water. Check the seal is intact. Avoid ice in drinks from street stalls. This single tip prevents most traveler illness.', icon: '💧' },
    { country: 'india', category: 'first-timer', title: 'Carry Toilet Paper', tip: 'Most public restrooms don\'t provide toilet paper. Carry a roll or tissue pack at all times. Also bring hand sanitizer.', icon: '🧻' },
    { country: 'india', category: 'first-timer', title: 'Dress Modestly at Temples', tip: 'Cover shoulders and knees at temples and mosques. Some require head coverings. Carry a scarf — it doubles as sun protection.', icon: '👔' },
    { country: 'india', category: 'first-timer', title: 'Avoid Raw Street Salads', tip: 'Don\'t eat raw salads or unpeeled fruit from street stalls. Stick to cooked food served hot, and you\'ll be fine.', icon: '🥗' },
    { country: 'india', category: 'first-timer', title: 'Bargain at Markets', tip: 'Bargain at markets — start at 50% of the asking price and negotiate from there. Fixed-price shops exist too, but market shopping is part of the experience.', icon: '🛍️' },
    { country: 'india', category: 'first-timer', title: 'Use Ride-Hailing Apps', tip: 'Download Ola and Uber for taxis. They offer transparent pricing and are much safer than negotiating with random auto-rickshaws, especially at night.', icon: '🚕' },
  ],
  // ─── Existing destinations ───
  'united-states': [
    { country: 'united-states', category: 'first-timer', title: 'Tipping is Mandatory', tip: 'Tip 18-20% at restaurants, $1-2 per drink at bars, and $2-5 per bag for hotel porters. Servers earn most of their income from tips — not tipping is considered deeply rude.', icon: '💵' },
    { country: 'united-states', category: 'first-timer', title: 'Distances Are Huge', tip: 'The US is enormous — flying between cities saves days. Don\'t try to drive from NYC to LA "on the way." Download a US road trip app if driving.', icon: '🗺️' },
    { country: 'united-states', category: 'first-timer', title: 'Get Travel Health Insurance', tip: 'US healthcare is the most expensive in the world. A simple ER visit can cost $5,000+. Travel insurance is not optional — it\'s essential.', icon: '🏥' },
    { country: 'united-states', category: 'first-timer', title: 'Tax Is Added at Checkout', tip: 'Prices on shelves and menus do NOT include tax. Expect 6-10% added at the register. This surprises every first-time visitor.', icon: '🧾' },
    { country: 'united-states', category: 'first-timer', title: 'Rent a Car Outside Cities', tip: 'Public transit is great in NYC, Chicago, and SF, but nearly useless elsewhere. Rent a car for national parks, road trips, and suburban areas.', icon: '🚗' },
  ],
  spain: [
    { country: 'spain', category: 'first-timer', title: 'Eat on Spanish Time', tip: 'Lunch is 2-3:30 PM, dinner is 9-11 PM. Restaurants are empty (or closed) at 6 PM. Adjust your schedule and you\'ll eat where locals eat.', icon: '🕐' },
    { country: 'spain', category: 'first-timer', title: 'Siesta Is Real', tip: 'Many small shops close 2-5 PM. Don\'t plan shopping or errands during siesta hours. Use this time for a leisurely lunch or museum visit.', icon: '😴' },
    { country: 'spain', category: 'first-timer', title: 'Free Tapas Still Exist', tip: 'In Granada, León, and parts of Andalucía, bars serve free tapas with every drink. Order a beer, get a plate of food. Hop between bars for a full meal.', icon: '🍻' },
    { country: 'spain', category: 'first-timer', title: 'Beware Pickpockets on Las Ramblas', tip: 'Barcelona\'s La Rambla and Madrid\'s Gran Vía are pickpocket hotspots. Use a front pocket or crossbody bag. Never leave your phone on a restaurant table.', icon: '🔒' },
    { country: 'spain', category: 'first-timer', title: 'Book Alhambra Months Ahead', tip: 'Alhambra tickets sell out weeks or months in advance. Book the moment tickets are released. Same-day tickets are nearly impossible in season.', icon: '🎟️' },
  ],
  'united-kingdom': [
    { country: 'united-kingdom', category: 'first-timer', title: 'Get an Oyster or Contactless', tip: 'Use an Oyster card or contactless bank card on the Tube — never buy paper tickets. You\'ll save 50% on every ride. Daily caps prevent overspending.', icon: '🎫' },
    { country: 'united-kingdom', category: 'first-timer', title: 'Most Museums Are Free', tip: 'The British Museum, National Gallery, Tate Modern, V&A, Natural History Museum, and Science Museum are all free. Budget zero for museum entry.', icon: '🏛️' },
    { country: 'united-kingdom', category: 'first-timer', title: 'Pack Layers and Waterproofs', tip: 'British weather changes hourly. Carry a light waterproof jacket everywhere. Umbrellas are unreliable in the wind. Layers are your best friend.', icon: '🧥' },
    { country: 'united-kingdom', category: 'first-timer', title: 'Stand Right on Escalators', tip: 'On Tube escalators, stand on the right and walk on the left. Breaking this rule will earn you genuine hostility from commuters.', icon: '🚇' },
    { country: 'united-kingdom', category: 'first-timer', title: 'Queue Properly', tip: 'The British take queuing seriously. Never push ahead or cut in line — it\'s considered one of the worst social offenses. Wait your turn.', icon: '🇬🇧' },
  ],
  turkey: [
    { country: 'turkey', category: 'first-timer', title: 'Bargain at the Grand Bazaar', tip: 'Never pay the first price at the Grand Bazaar or markets. Start at 40-50% of the asking price and negotiate with a smile. Walking away often gets the best price.', icon: '🛍️' },
    { country: 'turkey', category: 'first-timer', title: 'Get an Istanbul Kart', tip: 'Buy an Istanbulkart at any kiosk for seamless metro, tram, bus, and ferry travel. It saves 50% vs single tickets and works across the whole transit system.', icon: '🎫' },
    { country: 'turkey', category: 'first-timer', title: 'Remove Shoes at Mosques', tip: 'Remove shoes and cover shoulders and knees before entering mosques. Women need a headscarf (usually provided at major mosques like the Blue Mosque).', icon: '🕌' },
    { country: 'turkey', category: 'first-timer', title: 'Accept Tea Offers', tip: 'Turks offer çay (tea) constantly — at shops, offices, even carpet stores. Accepting is polite and builds rapport. It doesn\'t obligate you to buy anything.', icon: '🫖' },
    { country: 'turkey', category: 'first-timer', title: 'Book Cappadocia Balloons Early', tip: 'Hot air balloon rides in Cappadocia sell out weeks ahead, especially in autumn. Book online before your trip. Sunrise flights offer the best light and experience.', icon: '🎈' },
  ],
  greece: [
    { country: 'greece', category: 'first-timer', title: 'Island-Hop by Ferry', tip: 'Greek ferries are affordable and scenic. Book on ferryhopper.com. High-speed ferries cost more but save hours. Slow ferries are the budget-friendly way to island-hop.', icon: '⛴️' },
    { country: 'greece', category: 'first-timer', title: 'Cash Is King on Islands', tip: 'Many island tavernas, taxis, and small shops are cash-only. ATMs on small islands can run dry in peak season. Withdraw cash on the mainland.', icon: '💶' },
    { country: 'greece', category: 'first-timer', title: 'Sunscreen Is Essential', tip: 'Greek sun is fierce, especially on white-washed islands that reflect UV. Bring high-SPF sunscreen from home — it\'s expensive on the islands.', icon: '☀️' },
    { country: 'greece', category: 'first-timer', title: 'Skip Tourist-Front Restaurants', tip: 'Avoid restaurants on the waterfront with picture menus. Walk one street back and eat where Greeks eat — better food at half the price.', icon: '🍽️' },
    { country: 'greece', category: 'first-timer', title: 'Book Acropolis First Thing', tip: 'Visit the Acropolis at 8 AM opening to beat the heat and crowds. By 10 AM the site is packed and there\'s no shade. The combined ticket covers 7 sites for 5 days.', icon: '🏛️' },
  ],
  australia: [
    { country: 'australia', category: 'first-timer', title: 'Distances Are Deceptive', tip: 'Australia is the size of continental US. Sydney to Melbourne is a 9-hour drive. Fly between major cities — domestic flights are affordable if booked early.', icon: '✈️' },
    { country: 'australia', category: 'first-timer', title: 'Slip Slop Slap', tip: 'Australia has the world\'s highest skin cancer rate. Wear sunscreen (SPF 50+), a hat, and sunglasses every day — even in winter. The UV index is extreme.', icon: '☀️' },
    { country: 'australia', category: 'first-timer', title: 'Swim Between the Flags', tip: 'At the beach, always swim between the red and yellow flags — that\'s the patrolled area. Rip currents kill more people than sharks. If caught, swim parallel to shore.', icon: '🏊' },
    { country: 'australia', category: 'first-timer', title: 'Don\'t Touch Wildlife', tip: 'Australia\'s wildlife is beautiful but dangerous. Don\'t touch or approach — even cute ones. Blue-ringed octopus, box jellyfish, and funnel-web spiders can kill.', icon: '🦎' },
    { country: 'australia', category: 'first-timer', title: 'Respect Indigenous Culture', tip: 'Ask permission before photographing Aboriginal art or ceremonies. Learn the traditional owners of the land you\'re visiting. Uluru climbing is permanently closed — respect this.', icon: '🪃' },
  ],
  mexico: [
    { country: 'mexico', category: 'first-timer', title: 'Drink Bottled Water', tip: 'Never drink tap water in Mexico. Use bottled water for drinking and brushing teeth. Ice in tourist restaurants is usually purified, but ask at street stalls.', icon: '💧' },
    { country: 'mexico', category: 'first-timer', title: 'Learn Basic Spanish', tip: 'English is limited outside tourist zones. "Por favor" (please), "Gracias" (thanks), and "La cuenta" (the bill) will make your trip much smoother.', icon: '🗣️' },
    { country: 'mexico', category: 'first-timer', title: 'Use Uber Over Street Taxis', tip: 'Uber is safer and cheaper than street taxis in most Mexican cities. If you must take a taxi, use official sitio (stand) taxis — never hail one on the street.', icon: '🚗' },
    { country: 'mexico', category: 'first-timer', title: 'Carry Small Bills', tip: 'Many vendors and small restaurants can\'t break large bills (500 pesos). Carry plenty of 20s, 50s, and 100s. ATMs give large bills — break them at convenience stores.', icon: '💰' },
    { country: 'mexico', category: 'first-timer', title: 'Eat Street Food Fearlessly', tip: 'The best Mexican food is on the street. Look for stalls with high turnover and locals queuing. Tacos al pastor, elote, and tamales from busy stalls are safe and incredible.', icon: '🌮' },
  ],
  egypt: [
    { country: 'egypt', category: 'first-timer', title: 'Baksheesh Is Expected', tip: 'Tipping (baksheesh) is a way of life. Carry small bills (EGP 10-20) for restroom attendants, luggage helpers, photo "guards" at monuments, and anyone who helps you.', icon: '💰' },
    { country: 'egypt', category: 'first-timer', title: 'Hire a Licensed Guide', tip: 'At the Pyramids and Luxor, hire only licensed guides (check for official ID). Unlicensed touts will overcharge and give inaccurate information.', icon: '🏛️' },
    { country: 'egypt', category: 'first-timer', title: 'Dress Modestly', tip: 'Cover shoulders and knees, especially in Upper Egypt and at mosques. Women may want a headscarf. This reduces unwanted attention significantly.', icon: '👔' },
    { country: 'egypt', category: 'first-timer', title: 'Bargain Everything', tip: 'At Khan el-Khalili bazaar and anywhere without fixed prices, bargain aggressively. Start at 25-30% of the asking price. Walk away if needed — they\'ll call you back.', icon: '🛒' },
    { country: 'egypt', category: 'first-timer', title: 'Avoid Rush Hour in Cairo', tip: 'Cairo traffic is legendary. Never schedule important transfers during rush hour (7-10 AM, 3-7 PM). Use the Metro for cross-city trips — it\'s fast and cheap.', icon: '🚇' },
  ],
  morocco: [
    { country: 'morocco', category: 'first-timer', title: 'Get Lost on Purpose in the Medina', tip: 'The best way to experience Fez or Marrakech medina is to wander. But keep your riad\'s card and phone location on. "Lost" guides who offer help expect a tip.', icon: '🏘️' },
    { country: 'morocco', category: 'first-timer', title: 'Bargain Hard at Souks', tip: 'Never pay the first price in a souk. Start at 30% of the asking price and enjoy the negotiation game. Tea will be offered — accept it, but it doesn\'t obligate a purchase.', icon: '🧵' },
    { country: 'morocco', category: 'first-timer', title: 'Dress Conservatively', tip: 'Morocco is Muslim — cover shoulders and knees, especially women outside tourist hotels. A headscarf isn\'t required but shows respect in rural areas.', icon: '👗' },
    { country: 'morocco', category: 'first-timer', title: 'Say No Firmly to Touts', tip: 'Touts in Marrakech can be persistent. A firm "La, shukran" (No, thank you) works. Don\'t engage or make eye contact if you don\'t want to be followed.', icon: '✋' },
    { country: 'morocco', category: 'first-timer', title: 'Eat Tagine Everywhere', tip: 'Tagine is Morocco\'s national dish and it\'s best from small, local restaurants — not tourist spots on Jemaa el-Fna. Ask your riad host for recommendations.', icon: '🥘' },
  ],
  peru: [
    { country: 'peru', category: 'first-timer', title: 'Acclimatize in Cusco', tip: 'Cusco is at 3,400 m. Altitude sickness is real. Spend your first day resting, drinking coca tea, and hydrating. Don\'t plan strenuous activities on day one.', icon: '🏔️' },
    { country: 'peru', category: 'first-timer', title: 'Book Machu Picchu Months Ahead', tip: 'Machu Picchu limits daily visitors. Book tickets 2-3 months in advance, especially for Huayna Picchu. Inca Trail permits sell out 6 months ahead.', icon: '🎟️' },
    { country: 'peru', category: 'first-timer', title: 'Try Guinea Pig (Cuy)', tip: 'Cuy (roasted guinea pig) is a traditional Andean delicacy. Try it at least once — it tastes like rich, gamey rabbit. Chicha restaurant in Cusco serves it well.', icon: '🍖' },
    { country: 'peru', category: 'first-timer', title: 'Carry Coca Leaves', tip: 'Coca tea and coca leaves are legal, culturally important, and genuinely help with altitude sickness. Accept offers from locals — it\'s a sign of hospitality.', icon: '🍃' },
    { country: 'peru', category: 'first-timer', title: 'Use Soles, Not Dollars', tip: 'Pay in Peruvian Soles for better prices. Tourist shops accept USD but give poor exchange rates. ATMs in Cusco\'s Plaza de Armas dispense both currencies.', icon: '💱' },
  ],
  // ─── New countries (Africa batch) ───
  'south-africa': [
    { country: 'south-africa', category: 'first-timer', title: 'Use Uber, Not Taxis', tip: 'Uber and Bolt are reliable, cheap, and safe in Cape Town and Johannesburg. Avoid metered taxis — they overcharge tourists. Never hail random cars.', icon: '🚗' },
    { country: 'south-africa', category: 'first-timer', title: 'Don\'t Flash Valuables', tip: 'Keep phones, cameras, and jewelry discreet, especially in city centres. Use hotel safes. Be aware of your surroundings, particularly after dark.', icon: '🔒' },
    { country: 'south-africa', category: 'first-timer', title: 'Lock Doors While Driving', tip: 'Lock car doors when driving, especially in cities. Don\'t leave valuables visible. Smash-and-grabs at traffic lights happen — keep windows up.', icon: '🚙' },
    { country: 'south-africa', category: 'first-timer', title: 'Try a Braai', tip: 'A braai (barbecue) is a South African institution. If invited, bring meat and drinks. South Africans are incredibly hospitable — say yes to every braai invitation.', icon: '🔥' },
    { country: 'south-africa', category: 'first-timer', title: 'Load Shedding Is Real', tip: 'South Africa experiences scheduled power outages (load shedding). Download the EskomSePush app to check your schedule. Hotels and restaurants have generators.', icon: '🔌' },
  ],
  kenya: [
    { country: 'kenya', category: 'first-timer', title: 'Book Safari Early', tip: 'Masai Mara camps during the Great Migration (Jul-Oct) book up 6+ months ahead. Budget lodges fill fastest. Book early or use a trusted local operator.', icon: '🦁' },
    { country: 'kenya', category: 'first-timer', title: 'Carry USD in Good Condition', tip: 'US dollars are widely accepted for safari and tourism. Bills must be post-2006, crisp, and unmarked — older or damaged bills are refused.', icon: '💵' },
    { country: 'kenya', category: 'first-timer', title: 'Anti-Malaria Precautions', tip: 'Take antimalarial medication for safari areas and the coast. Use DEET repellent and sleep under mosquito nets. Nairobi city is low-risk.', icon: '🦟' },
    { country: 'kenya', category: 'first-timer', title: 'Respect Maasai Customs', tip: 'Always ask and agree on a price before photographing Maasai people. Visit community-run cultural bomas for authentic experiences that benefit locals directly.', icon: '📷' },
    { country: 'kenya', category: 'first-timer', title: 'M-Pesa Is Everywhere', tip: 'Kenya runs on M-Pesa mobile payments. As a tourist, you can\'t easily set it up, but know that many locals don\'t carry cash. Safaricom SIM with data is essential.', icon: '📱' },
  ],
  tanzania: [
    { country: 'tanzania', category: 'first-timer', title: 'Budget for Park Fees', tip: 'Tanzania park fees are among Africa\'s highest ($53-82/person/day). Budget them separately — they add up fast on multi-day safaris. Serengeti and Ngorongoro are the priciest.', icon: '💰' },
    { country: 'tanzania', category: 'first-timer', title: 'Tip Safari Guides Well', tip: 'Safari guides and Kilimanjaro porters rely on tips. Budget $20-25/day for driver-guides and $15-20/day for porters. They make your trip — tip generously.', icon: '🎁' },
    { country: 'tanzania', category: 'first-timer', title: 'Carry Small USD Bills', tip: 'Bring clean US dollar bills in $1, $5, $10, and $20 denominations. Many lodges and activities quote in USD. ATMs in Arusha dispense Tanzanian Shillings only.', icon: '💵' },
    { country: 'tanzania', category: 'first-timer', title: 'Get a Yellow Fever Card', tip: 'A yellow fever vaccination certificate is required if arriving from an endemic country (including Kenya). Get vaccinated at least 10 days before travel.', icon: '💉' },
    { country: 'tanzania', category: 'first-timer', title: 'Don\'t Rush the Greeting', tip: 'Tanzanians greet at length — "Habari? Nzuri. Habari za asubuhi?" Rushing past greetings is considered very rude. Slow down and enjoy the human connection.', icon: '🤝' },
  ],
  'costa-rica': [
    { country: 'costa-rica', category: 'first-timer', title: 'Rent a 4WD', tip: 'Many roads to national parks and beaches are unpaved and river crossings are common. A 4WD is essential outside San José. Don\'t rely on GPS — Waze works better.', icon: '🚙' },
    { country: 'costa-rica', category: 'first-timer', title: 'Bring Rain Gear Always', tip: 'Even in dry season, rain can appear suddenly. A lightweight rain jacket and dry bags for electronics are essential. Waterproof phone cases save lives in rainforest.', icon: '🌧️' },
    { country: 'costa-rica', category: 'first-timer', title: 'Wildlife Is Everywhere', tip: 'Sloths, monkeys, toucans, and frogs are around every corner. Hire a naturalist guide — they spot 10x more wildlife than you will alone. Never touch or feed animals.', icon: '🦥' },
    { country: 'costa-rica', category: 'first-timer', title: 'Cash Is King Outside Cities', tip: 'Many rural lodges, sodas (small restaurants), and tours only accept cash. Colones are preferred. ATMs outside San José can be scarce — withdraw before heading out.', icon: '💰' },
    { country: 'costa-rica', category: 'first-timer', title: 'Book Cloud Forest Guides', tip: 'Monteverde and cloud forest reserves are far more rewarding with a certified guide. They know where the quetzals nest, which frogs are hidden, and which plants are medicinal.', icon: '🌿' },
  ],
  israel: [
    { country: 'israel', category: 'first-timer', title: 'Plan Around Shabbat', tip: 'From Friday sunset to Saturday sunset, most public transport stops and shops close (except in Arab areas and Tel Aviv). Plan travel, shopping, and meals around Shabbat.', icon: '🕯️' },
    { country: 'israel', category: 'first-timer', title: 'Expect Security Checks', tip: 'Security checks at malls, bus stations, train stations, and attractions are normal. Be patient, don\'t joke about security, and carry your passport at all times.', icon: '🔐' },
    { country: 'israel', category: 'first-timer', title: 'Dress Modestly at Holy Sites', tip: 'Cover shoulders and knees at the Western Wall, churches, and mosques. Women need a head covering at some sites. Carry a scarf — it\'s a universal problem solver.', icon: '👗' },
    { country: 'israel', category: 'first-timer', title: 'Try Street Food First', tip: 'Israel\'s best food is street food — falafel, shawarma, sabich, hummus, and burekas from stalls and hole-in-the-wall shops. Mahane Yehuda Market is a must.', icon: '🥙' },
    { country: 'israel', category: 'first-timer', title: 'Get a Rav-Kav Card', tip: 'Load a Rav-Kav transit card for buses and light rail. It works nationwide and saves money vs single tickets. Buy at central bus stations.', icon: '🎫' },
  ],
  // ─── New countries (Asian batch from other agents) ───
  indonesia: [
    { country: 'indonesia', category: 'first-timer', title: 'Respect Temple Etiquette', tip: 'Wear a sarong and sash at Balinese temples (usually provided). Never stand higher than a shrine. Remove shoes. Women on their period are traditionally asked not to enter.', icon: '🛕' },
    { country: 'indonesia', category: 'first-timer', title: 'Bargain at Markets', tip: 'In traditional markets and for taxis without meters, bargain to 50-60% of the first price. Shop-owners expect it and enjoy the interaction. Stay friendly.', icon: '🛍️' },
    { country: 'indonesia', category: 'first-timer', title: 'Use Grab and Gojek', tip: 'Ride-hailing apps Grab and Gojek are essential — for taxis, motorbike rides, and food delivery. Much cheaper and safer than negotiating with random drivers.', icon: '🛵' },
    { country: 'indonesia', category: 'first-timer', title: 'Don\'t Use Your Left Hand', tip: 'The left hand is considered unclean. Use your right hand for greetings, eating, giving/receiving items. This applies across Indonesia, especially in Muslim areas.', icon: '🤚' },
    { country: 'indonesia', category: 'first-timer', title: 'Beware of Bali Belly', tip: 'Avoid tap water, ice from unknown sources, and raw salads from street stalls. Eat at busy warungs (local eateries) where food turnover is high. Carry Imodium.', icon: '💊' },
  ],
  vietnam: [
    { country: 'vietnam', category: 'first-timer', title: 'Cross Streets with Confidence', tip: 'Vietnamese traffic never stops for pedestrians. Walk slowly and steadily across — motorbikes will flow around you. Stopping suddenly or running is what causes accidents.', icon: '🚶' },
    { country: 'vietnam', category: 'first-timer', title: 'Learn Dong Denominations', tip: 'Vietnamese Dong has many zeros — 100,000 VND is about $4. Count zeros carefully. Use the 1-2-5 rule: drop 4 zeros and divide by 2.5 for rough USD conversion.', icon: '💴' },
    { country: 'vietnam', category: 'first-timer', title: 'Eat Pho for Breakfast', tip: 'Join locals and eat pho (noodle soup) for breakfast. The best pho shops open at 6 AM and close by 10 AM. If there\'s a queue, it\'s good. Street-side stools are the real deal.', icon: '🍜' },
    { country: 'vietnam', category: 'first-timer', title: 'Use Grab, Not Taxis', tip: 'Grab is Vietnam\'s ride-hailing lifesaver. Traditional taxis (except Vinasun and Mai Linh) may use rigged meters. Grab gives a fixed price — no surprises.', icon: '📱' },
    { country: 'vietnam', category: 'first-timer', title: 'Carry Tissue Paper', tip: 'Most budget restaurants and public toilets don\'t provide napkins or toilet paper. Carry a pack of tissues everywhere. You\'ll thank yourself daily.', icon: '🧻' },
  ],
  cambodia: [
    { country: 'cambodia', category: 'first-timer', title: 'USD Is the Main Currency', tip: 'Cambodia uses US dollars for almost everything. Riel (KHR) is used for small change under $1. ATMs dispense USD. Carry small bills — change for $50-100 is hard.', icon: '💵' },
    { country: 'cambodia', category: 'first-timer', title: 'Buy Angkor Pass Online', tip: 'Buy your Angkor Archaeological Park pass online before arriving. 1-day ($37), 3-day ($62), or 7-day ($72). Sunrise at Angkor Wat is worth the early alarm.', icon: '🎟️' },
    { country: 'cambodia', category: 'first-timer', title: 'Cover Up at Temples', tip: 'Cover knees and shoulders at Angkor Wat and all temples. Guards will turn you away. Carry a light scarf or buy cheap temple-appropriate clothes at the entrance.', icon: '👔' },
    { country: 'cambodia', category: 'first-timer', title: 'Visit S-21 and Killing Fields', tip: 'The Tuol Sleng Genocide Museum and Choeung Ek Killing Fields are devastating but essential. Rent the audio guide. Go in the morning when you have emotional energy.', icon: '🙏' },
    { country: 'cambodia', category: 'first-timer', title: 'Don\'t Touch Children\'s Heads', tip: 'As in many Southeast Asian cultures, the head is sacred. Don\'t pat children on the head. Always remove shoes before entering homes and temples.', icon: '🏠' },
  ],
  'south-korea': [
    { country: 'south-korea', category: 'first-timer', title: 'Get a T-Money Card', tip: 'Buy a T-Money card at any convenience store. It works on all subways, buses, and even taxis across South Korea. The Seoul Metro is world-class.', icon: '🎫' },
    { country: 'south-korea', category: 'first-timer', title: 'Respect the Drinking Culture', tip: 'When someone older pours you a drink, hold your glass with both hands. Pour for others before yourself. Turning away slightly when drinking shows respect to elders.', icon: '🍺' },
    { country: 'south-korea', category: 'first-timer', title: 'Remove Shoes Indoors', tip: 'Always remove shoes when entering Korean homes, temples, and traditional restaurants. Look for a shoe rack or step at the entrance — that\'s your cue.', icon: '👟' },
    { country: 'south-korea', category: 'first-timer', title: 'Try a Jjimjilbang', tip: 'Korean bathhouses (jjimjilbangs) are a must-do cultural experience. They\'re mixed-gender in common areas but nude-only in bathing areas. Dragon Hill Spa in Seoul is tourist-friendly.', icon: '♨️' },
    { country: 'south-korea', category: 'first-timer', title: 'Download Naver Maps', tip: 'Google Maps barely works in South Korea (government restrictions). Download Naver Map or KakaoMap — they have accurate transit directions and English support.', icon: '🗺️' },
  ],
  singapore: [
    { country: 'singapore', category: 'first-timer', title: 'Don\'t Chew Gum', tip: 'Chewing gum is banned in Singapore (except therapeutic gum from pharmacies). Importing gum can result in fines. Leave it at home.', icon: '🚫' },
    { country: 'singapore', category: 'first-timer', title: 'Eat at Hawker Centres', tip: 'Hawker centres are Singapore\'s greatest treasure. A full meal costs $3-5. Maxwell Food Centre, Lau Pa Sat, and Old Airport Road are legendary. Michelin stars, street prices.', icon: '🍲' },
    { country: 'singapore', category: 'first-timer', title: 'Use the MRT Everywhere', tip: 'Singapore\'s MRT is clean, safe, cheap, and covers every tourist area. Get an EZ-Link card or use contactless payment. Taxis and Grab are cheap for groups.', icon: '🚇' },
    { country: 'singapore', category: 'first-timer', title: 'Carry an Umbrella', tip: 'Tropical downpours happen daily, often without warning. Carry a compact umbrella everywhere. The underground malls (especially Orchard) provide covered walking routes.', icon: '☂️' },
    { country: 'singapore', category: 'first-timer', title: 'Follow the Rules Strictly', tip: 'Singapore enforces laws strictly — no jaywalking, no littering, no eating on MRT, no smoking except designated areas. Fines start at SGD 300. Follow every sign.', icon: '📋' },
  ],
  uae: [
    { country: 'uae', category: 'first-timer', title: 'Dress Modestly Outside Hotels', tip: 'In malls, mosques, and public areas, cover shoulders and knees. Beachwear is for the beach only. Abu Dhabi is stricter than Dubai. Respect the local culture.', icon: '👔' },
    { country: 'uae', category: 'first-timer', title: 'Friday Is the Weekend', tip: 'The UAE weekend is Friday-Saturday. Friday morning is prayer time — malls open late, and the roads are empty. Plan shopping for Thursday evening or Saturday.', icon: '📅' },
    { country: 'uae', category: 'first-timer', title: 'No PDA in Public', tip: 'Public displays of affection (even hand-holding) can result in fines or arrest. Keep physical affection private. This applies to all couples, regardless of marital status.', icon: '⚠️' },
    { country: 'uae', category: 'first-timer', title: 'Don\'t Photograph People Without Permission', tip: 'Photographing Emirati women, military/government buildings, or people without consent is illegal. Always ask before photographing anyone.', icon: '📷' },
    { country: 'uae', category: 'first-timer', title: 'The Metro Is Excellent', tip: 'Dubai Metro is spotless, air-conditioned, and covers major attractions. Gold Class is worth it for the views. There\'s a women and children-only car — look for the pink sections.', icon: '🚇' },
  ],
  // ─── New countries (European/Americas batch from other agents) ───
  portugal: [
    { country: 'portugal', category: 'first-timer', title: 'Ride Tram 28 Early', tip: 'Lisbon\'s iconic Tram 28 is packed with tourists by 10 AM. Ride it at 8 AM or after 6 PM for a genuine experience without sardine-can conditions. Beware pickpockets.', icon: '🚋' },
    { country: 'portugal', category: 'first-timer', title: 'Try Pastéis de Nata Everywhere', tip: 'Don\'t just eat them at Belém — every bakery makes custard tarts. Try several and compare. Fresh from the oven, dusted with cinnamon and powdered sugar. Under 2 each.', icon: '🥧' },
    { country: 'portugal', category: 'first-timer', title: 'Carry Cash for Small Shops', tip: 'Many small tascas (taverns), market stalls, and tram ticket machines are cash-only. Multibanco ATMs are everywhere and charge no fees.', icon: '💶' },
    { country: 'portugal', category: 'first-timer', title: 'Wear Comfortable Shoes', tip: 'Lisbon and Porto are built on steep hills with cobblestone streets. Flat, grippy shoes are essential. Heels are impossible on calçada pavements.', icon: '👟' },
    { country: 'portugal', category: 'first-timer', title: 'Lunch Is the Best Deal', tip: 'The "prato do dia" (dish of the day) at lunch is a full meal for 7-10 at local restaurants. The same quality dinner costs double. Eat like a local — big lunch, light dinner.', icon: '🍽️' },
  ],
  germany: [
    { country: 'germany', category: 'first-timer', title: 'Cash Is King', tip: 'Germany is surprisingly cash-dependent. Many restaurants, bakeries, and small shops don\'t accept cards. Carry 50-100 in cash at all times. ATMs (Geldautomaten) are plentiful.', icon: '💶' },
    { country: 'germany', category: 'first-timer', title: 'Don\'t Jaywalk', tip: 'Germans follow pedestrian signals strictly — even at empty intersections. Jaywalking is frowned upon and can result in a fine. Wait for the green man.', icon: '🚦' },
    { country: 'germany', category: 'first-timer', title: 'Tap Water Is Free and Safe', tip: 'German tap water is excellent. Ask for "Leitungswasser" at restaurants — it\'s free but you may need to insist. Otherwise you\'ll get expensive mineral water.', icon: '💧' },
    { country: 'germany', category: 'first-timer', title: 'Recycle Your Bottles (Pfand)', tip: 'Most bottles and cans have a Pfand (deposit) of 0.08-0.25. Return them at supermarket machines for a receipt. It\'s the law and it\'s extra pocket money.', icon: '♻️' },
    { country: 'germany', category: 'first-timer', title: 'Sunday Everything Is Closed', tip: 'German shops are closed on Sundays by law. Stock up on Saturday. Gas stations and some bakeries are the only options. Restaurants and museums stay open.', icon: '🔒' },
  ],
  brazil: [
    { country: 'brazil', category: 'first-timer', title: 'Don\'t Flash Valuables', tip: 'Leave expensive jewelry and watches at the hotel. Use a cheap phone on the street. Carry a decoy wallet with small bills. Be especially careful on beaches and in crowded areas.', icon: '🔒' },
    { country: 'brazil', category: 'first-timer', title: 'Learn Basic Portuguese', tip: 'Brazilians speak Portuguese, not Spanish. "Obrigado/a" (thank you), "Tudo bem?" (how are you?), and a warm smile go incredibly far. English is rare outside tourist areas.', icon: '🗣️' },
    { country: 'brazil', category: 'first-timer', title: 'Use Uber, Not Taxis', tip: 'Uber (and 99) is safe, affordable, and widely available in Brazilian cities. Avoid unlicensed taxis. Always check the driver and plate match the app.', icon: '🚗' },
    { country: 'brazil', category: 'first-timer', title: 'Carry Reais, Not Dollars', tip: 'US dollars are not accepted anywhere. Withdraw Reais (R$) from ATMs inside bank branches. Notify your bank before traveling — Brazilian ATMs sometimes block foreign cards.', icon: '💱' },
    { country: 'brazil', category: 'first-timer', title: 'Sunscreen at the Beach', tip: 'Brazilian sun is intense. Use SPF 50+ and reapply often. Locals sell cold açaí, coconut water, and cheese on sticks on the beach — enjoy but negotiate prices first.', icon: '☀️' },
  ],
  'new-zealand': [
    { country: 'new-zealand', category: 'first-timer', title: 'Book the Great Walks Early', tip: 'New Zealand\'s Great Walks (Milford Track, Routeburn, etc.) book out months ahead, especially for Dec-Feb. DOC hut bookings open in June — set reminders.', icon: '🥾' },
    { country: 'new-zealand', category: 'first-timer', title: 'Respect Maori Culture', tip: 'Learn "Kia ora" (hello) and basic Maori greetings. Attend a powhiri (welcome ceremony) if invited. Don\'t sit on tables or pillows where food is prepared — it\'s tapu (sacred).', icon: '🇳🇿' },
    { country: 'new-zealand', category: 'first-timer', title: 'Rent a Campervan', tip: 'A campervan is the best way to see NZ — freedom camping is allowed at designated sites. Book 3+ months ahead for summer. Drive on the left. Roads are winding and slow.', icon: '🚐' },
    { country: 'new-zealand', category: 'first-timer', title: 'Weather Changes Fast', tip: 'New Zealand weather is famously unpredictable — "four seasons in one day" is real. Layer up and always carry rain gear, even on sunny mornings.', icon: '🌦️' },
    { country: 'new-zealand', category: 'first-timer', title: 'Declare Everything at Customs', tip: 'NZ has the strictest biosecurity in the world. Declare ALL food, hiking gear, and outdoor equipment. Fines are instant and heavy ($400+). Even dirty boots get inspected.', icon: '🛃' },
  ],
  // ─── New countries (30 missing) ───
  austria: [
    { country: 'austria', category: 'first-timer', title: 'Validate Your Train Ticket', tip: 'ÖBB trains require validated tickets. Buy them online or at machines — and remember to check in with the ÖBB app or stamp paper tickets before boarding.', icon: '🚄' },
    { country: 'austria', category: 'first-timer', title: 'Carry Cash', tip: 'Many Austrian restaurants, smaller hotels, and mountain huts don\'t accept cards. Keep €50-100 in cash. ATMs (Bankomaten) are common.', icon: '💶' },
    { country: 'austria', category: 'first-timer', title: 'Learn Basic German Greetings', tip: '"Grüß Gott" (hello) and "Danke" (thanks) go a long way. Austrians are polite and appreciate the effort, especially outside Vienna.', icon: '🗣️' },
    { country: 'austria', category: 'first-timer', title: 'Don\'t Skip the Coffee Houses', tip: 'Viennese coffee house culture is UNESCO-listed. Order a Melange (like a cappuccino), sit for hours, read newspapers. Rushing is frowned upon.', icon: '☕' },
    { country: 'austria', category: 'first-timer', title: 'Get a Vignette for Highways', tip: 'All Austrian motorways require a Vignette (toll sticker). Buy one at the border or a petrol station — fines for missing it are steep (€120+).', icon: '🛣️' },
  ],
  canada: [
    { country: 'canada', category: 'first-timer', title: 'Layer Your Clothing', tip: 'Canadian weather can swing 15°C in a day. Layer up — a base layer, fleece, and waterproof shell will handle anything from Vancouver rain to Rocky Mountain sun.', icon: '🧥' },
    { country: 'canada', category: 'first-timer', title: 'Tip 15-20%', tip: 'Tipping culture is the same as the US — 15-20% at restaurants, $1-2 per drink at bars. Servers rely on tips. Not tipping is considered very rude.', icon: '💵' },
    { country: 'canada', category: 'first-timer', title: 'Distances Are Enormous', tip: 'Canada is the world\'s second-largest country. Toronto to Vancouver is a 4-hour flight. Don\'t plan to "drive across" — take domestic flights between regions.', icon: '✈️' },
    { country: 'canada', category: 'first-timer', title: 'Learn Bear Safety', tip: 'In the Rockies, carry bear spray, make noise on trails, and store food properly. Know the difference between black bears (back away) and grizzlies (play dead).', icon: '🐻' },
    { country: 'canada', category: 'first-timer', title: 'Get Travel Insurance', tip: 'Canadian healthcare is only free for residents. A hospital visit can cost thousands. Travel insurance is absolutely essential — don\'t skip it.', icon: '🏥' },
  ],
  china: [
    { country: 'china', category: 'first-timer', title: 'Download a VPN Before Arrival', tip: 'Google, WhatsApp, Instagram, and most Western apps are blocked. Download and set up a VPN before you arrive — it won\'t work to download once you\'re in China.', icon: '📱' },
    { country: 'china', category: 'first-timer', title: 'Get WeChat and Alipay', tip: 'China runs on mobile payments. Set up WeChat Pay or Alipay before your trip if possible — many places don\'t accept international cards or cash easily.', icon: '💳' },
    { country: 'china', category: 'first-timer', title: 'Avoid Golden Week', tip: 'October 1-7 (National Day) sees 300+ million domestic travellers. Every attraction is overwhelmed, transport is booked out, and prices triple. Avoid at all costs.', icon: '📅' },
    { country: 'china', category: 'first-timer', title: 'Carry Toilet Paper', tip: 'Most public restrooms don\'t provide toilet paper. Carry a pack of tissues and hand sanitizer everywhere. Squat toilets are common outside major hotels.', icon: '🧻' },
    { country: 'china', category: 'first-timer', title: 'Learn a Few Mandarin Phrases', tip: '"Nǐ hǎo" (hello), "Xièxie" (thank you), "Duōshao qián?" (how much?). English is rare outside major hotels and tourist areas. Translation apps are essential.', icon: '🗣️' },
  ],
  croatia: [
    { country: 'croatia', category: 'first-timer', title: 'Bring Water Shoes', tip: 'Croatian beaches are often pebbly or rocky, not sandy. Bring water shoes for comfortable entry — they\'re essential for Dubrovnik\'s Banje Beach and Hvar\'s coves.', icon: '👟' },
    { country: 'croatia', category: 'first-timer', title: 'Book Dubrovnik Walls Early', tip: 'The Dubrovnik city wall walk is the top attraction. Go first thing in the morning (8 AM) to beat the cruise ship crowds. By 10 AM it\'s packed. Walk counter-clockwise.', icon: '🏰' },
    { country: 'croatia', category: 'first-timer', title: 'Use Ferries Between Islands', tip: 'Jadrolinija ferries connect the islands affordably. Book car ferries in advance for summer. Foot passengers can usually walk on. Catamaran routes are faster but pricier.', icon: '⛴️' },
    { country: 'croatia', category: 'first-timer', title: 'Pay in Euros', tip: 'Croatia adopted the Euro in 2023. Cards are widely accepted in tourist areas, but carry cash for island shops, konobas (taverns), and market stalls.', icon: '💶' },
    { country: 'croatia', category: 'first-timer', title: 'Try Peka', tip: 'Peka is Croatia\'s signature slow-cooked dish — meat or octopus under a bell-shaped lid with potatoes and herbs. It takes 2+ hours to prepare, so order in advance.', icon: '🍖' },
  ],
  cuba: [
    { country: 'cuba', category: 'first-timer', title: 'Bring Cash (Euros or Dollars)', tip: 'US credit and debit cards do NOT work in Cuba. Bring Euros or Canadian Dollars in cash — US Dollars incur a 10% surcharge. ATMs are unreliable.', icon: '💶' },
    { country: 'cuba', category: 'first-timer', title: 'Stay in Casas Particulares', tip: 'Government-run hotels are overpriced and underwhelming. Stay in casas particulares (private homestays) — they\'re cheaper, authentic, and the families are incredibly welcoming.', icon: '🏠' },
    { country: 'cuba', category: 'first-timer', title: 'Wi-Fi Is Limited', tip: 'Cuba has very limited internet access. Buy ETECSA Wi-Fi cards at hotels or telecom offices. Many parks have Wi-Fi hotspots where you\'ll see crowds of locals online.', icon: '📶' },
    { country: 'cuba', category: 'first-timer', title: 'Negotiate Classic Car Rides', tip: 'Classic car rides in Havana are fun but always agree on the price before getting in. A convertible tour should cost $30-40/hour. Locals pay a fraction in regular shared taxis.', icon: '🚗' },
    { country: 'cuba', category: 'first-timer', title: 'Bring Supplies from Home', tip: 'Cuba has shortages of many basics — sunscreen, medicines, toiletries, and batteries. Bring everything you\'ll need. Locals deeply appreciate gifts of these items.', icon: '🧴' },
  ],
  'czech-republic': [
    { country: 'czech-republic', category: 'first-timer', title: 'Pay in Czech Koruna', tip: 'The Czech Republic uses Koruna (CZK), not Euros. Tourist-area exchange offices have terrible rates — use ATMs or pay by card for the best exchange rate.', icon: '💱' },
    { country: 'czech-republic', category: 'first-timer', title: 'Avoid Exchange Offices', tip: 'Never use the "0% commission" exchange offices in Prague tourist areas — they hide awful rates. Use ATMs (Bankomat) at banks instead.', icon: '🏧' },
    { country: 'czech-republic', category: 'first-timer', title: 'Explore Beyond Prague', tip: 'Český Krumlov, Kutná Hora (bone church), and Brno deserve at least a day trip. Czech Republic\'s best experiences are often outside the capital.', icon: '🏘️' },
    { country: 'czech-republic', category: 'first-timer', title: 'Try Czech Beer Culture', tip: 'Czech Republic has the highest beer consumption per capita in the world. Try Pilsner Urquell at the source, and order "jedno pivo, prosím" (one beer, please).', icon: '🍺' },
    { country: 'czech-republic', category: 'first-timer', title: 'Walk the Charles Bridge at Dawn', tip: 'Charles Bridge is Prague\'s #1 attraction but it\'s mobbed by 10 AM. Visit at sunrise for a magical, crowd-free experience with mist on the Vltava.', icon: '🌅' },
  ],
  denmark: [
    { country: 'denmark', category: 'first-timer', title: 'Everything Is Expensive', tip: 'Denmark is one of Europe\'s priciest countries. Budget €15-20 for a basic lunch, €5 for coffee. The Copenhagen Card saves money on transport and 80+ attractions.', icon: '💰' },
    { country: 'denmark', category: 'first-timer', title: 'Bike Like a Local', tip: 'Copenhagen is the world\'s best cycling city. Rent a bike and use the dedicated bike lanes. Follow traffic rules — signal turns, stay in your lane, don\'t stop suddenly.', icon: '🚲' },
    { country: 'denmark', category: 'first-timer', title: 'Embrace Hygge', tip: 'Hygge (coziness) is Denmark\'s lifestyle philosophy. Visit candlelit cafes, bakeries, and wine bars. Slow down and enjoy — it\'s the Danish way.', icon: '🕯️' },
    { country: 'denmark', category: 'first-timer', title: 'Cards Are King', tip: 'Denmark is nearly cashless. Credit and debit cards (including contactless) work everywhere — even at street food stalls and small shops. You barely need cash.', icon: '💳' },
    { country: 'denmark', category: 'first-timer', title: 'Try Smørrebrød', tip: 'Open-faced sandwiches (smørrebrød) are Denmark\'s culinary pride. Start at a traditional smørrebrød restaurant for lunch — it\'s an art form of rye bread, pickled herring, and toppings.', icon: '🥪' },
  ],
  ecuador: [
    { country: 'ecuador', category: 'first-timer', title: 'Acclimatize in Quito', tip: 'Quito sits at 2,850 m altitude. Take it easy on day one — drink plenty of water, avoid alcohol, and don\'t plan strenuous activities. Altitude sickness is real.', icon: '🏔️' },
    { country: 'ecuador', category: 'first-timer', title: 'Carry Small USD Bills', tip: 'Ecuador uses the US Dollar. Many small vendors can\'t break $20 or $50 bills. Carry plenty of $1 and $5 bills. ATMs give $20 bills.', icon: '💵' },
    { country: 'ecuador', category: 'first-timer', title: 'Book Galapagos Months Ahead', tip: 'Galapagos cruises and national park permits sell out months in advance. Book at least 3-6 months ahead for the best boats and itineraries, especially Jun-Sep.', icon: '🐢' },
    { country: 'ecuador', category: 'first-timer', title: 'Pack for Four Climates', tip: 'Ecuador has the coast, highlands, Amazon, and Galapagos — each with different weather. Pack layers, rain gear, sun protection, and swimwear all in one bag.', icon: '🧳' },
    { country: 'ecuador', category: 'first-timer', title: 'Try Ceviche Ecuatoriano', tip: 'Ecuadorian ceviche is different from Peruvian — it\'s served with tomato-based broth, popcorn, and plantain chips. Try it at a local market for the authentic experience.', icon: '🍲' },
  ],
  finland: [
    { country: 'finland', category: 'first-timer', title: 'Try a Finnish Sauna', tip: 'Sauna is sacred in Finland — there are 3.3 million saunas for 5.5 million people. Try a public sauna like Löyly in Helsinki. Everyone goes nude (separated by gender).', icon: '♨️' },
    { country: 'finland', category: 'first-timer', title: 'Pack for Extreme Weather', tip: 'Finnish winters hit -30°C in Lapland. Layer with thermal underwear, fleece, and a windproof outer layer. In summer, pack for mosquitoes in the north.', icon: '🧥' },
    { country: 'finland', category: 'first-timer', title: 'Tap Water Is Excellent', tip: 'Finnish tap water is among the purest in the world. Drink freely from any tap — no need to buy bottled water. It tastes better than most bottled brands.', icon: '💧' },
    { country: 'finland', category: 'first-timer', title: 'Respect Personal Space', tip: 'Finns value personal space — don\'t stand too close, don\'t make small talk with strangers. Silence is comfortable, not awkward. Bus stops have wide spacing between people.', icon: '🧍' },
    { country: 'finland', category: 'first-timer', title: 'Book Northern Lights Tours', tip: 'Northern Lights in Lapland (Sep-Mar) aren\'t guaranteed. Book multi-night stays in Rovaniemi or Inari to increase your chances. Glass igloos book out 6+ months ahead.', icon: '🌌' },
  ],
  hungary: [
    { country: 'hungary', category: 'first-timer', title: 'Don\'t Exchange at the Airport', tip: 'Budapest airport exchange rates are terrible. Use ATMs at banks in the city center, or pay by card — Hungary uses the Forint (HUF), not the Euro.', icon: '💱' },
    { country: 'hungary', category: 'first-timer', title: 'Visit a Thermal Bath', tip: 'Budapest has 120+ thermal springs. Széchenyi (largest) and Gellért (most beautiful) are the must-visits. Bring your own towel or rent one. Go on a weekday morning.', icon: '♨️' },
    { country: 'hungary', category: 'first-timer', title: 'Explore the Ruin Bars', tip: 'Budapest\'s famous ruin bars (romkocsmák) are built in abandoned buildings. Szimpla Kert is the most famous — go early evening before it gets packed. Drinks are very affordable.', icon: '🍻' },
    { country: 'hungary', category: 'first-timer', title: 'Take a Danube River Walk', tip: 'Walk the Danube embankment at sunset — the Parliament, Chain Bridge, and Buda Castle are all illuminated. The Shoes on the Danube memorial is deeply moving.', icon: '🌅' },
    { country: 'hungary', category: 'first-timer', title: 'Try Goulash Soup', tip: 'Real Hungarian gulyás is a soup, not a stew. Try it at a market hall or traditional étterem (restaurant). Pair it with fresh bread and a glass of Tokaji wine.', icon: '🥘' },
  ],
  iceland: [
    { country: 'iceland', category: 'first-timer', title: 'Book the Blue Lagoon in Advance', tip: 'The Blue Lagoon sells out days or weeks ahead. Book online before your trip. Alternatives like Sky Lagoon and Mývatn Nature Baths are less crowded and equally stunning.', icon: '🎫' },
    { country: 'iceland', category: 'first-timer', title: 'Rent a 4WD in Winter', tip: 'Icelandic roads can be icy, snowy, and unpredictable. A 4WD is essential October-April. F-roads (highland) always require 4WD. Check road.is daily.', icon: '🚙' },
    { country: 'iceland', category: 'first-timer', title: 'Budget for Expensive Food', tip: 'Iceland is extremely expensive — a basic restaurant meal is $25-40. Save money at Bónus supermarkets and by cooking. Hot dogs from Bæjarins Beztu are a cheap classic.', icon: '💰' },
    { country: 'iceland', category: 'first-timer', title: 'Respect the Nature', tip: 'Stay on marked paths — Icelandic moss takes decades to regrow. Don\'t stack rocks, drive off-road, or approach wildlife. Fines are severe and environmental damage is real.', icon: '🌿' },
    { country: 'iceland', category: 'first-timer', title: 'Pack for All Seasons in One Day', tip: 'Icelandic weather changes every hour. Pack waterproof layers, warm base layers, and windproof outerwear. Cotton kills — use wool or synthetic materials.', icon: '🧥' },
  ],
  ireland: [
    { country: 'ireland', category: 'first-timer', title: 'Rent a Car for the Coast', tip: 'Public transport is limited outside Dublin. Rent a car for the Wild Atlantic Way and Ring of Kerry. Drive on the left. Roads are narrow — take your time.', icon: '🚗' },
    { country: 'ireland', category: 'first-timer', title: 'Pack Rain Gear Always', tip: 'Ireland gets rain year-round — sometimes multiple times a day. A waterproof jacket and layers are essential. Umbrellas are useless in the Atlantic wind.', icon: '🌧️' },
    { country: 'ireland', category: 'first-timer', title: 'Visit a Traditional Pub', tip: 'Irish pubs are living rooms, not bars. Order a Guinness (it tastes different in Ireland), enjoy trad music sessions, and chat with locals. "Sláinte!" means cheers.', icon: '🍺' },
    { country: 'ireland', category: 'first-timer', title: 'Don\'t Call It the UK', tip: 'Ireland (the Republic) is an independent country — never call it part of the UK or "British." It\'s a sensitive topic. Northern Ireland is part of the UK; the Republic is not.', icon: '🇮🇪' },
    { country: 'ireland', category: 'first-timer', title: 'Cash for Rural Areas', tip: 'Cards work in most places, but small B&Bs, rural pubs, and market stalls may be cash-only. Carry some Euros. ATMs can be scarce in remote areas.', icon: '💶' },
  ],
  jamaica: [
    { country: 'jamaica', category: 'first-timer', title: 'Negotiate Taxi Prices', tip: 'Jamaican taxis don\'t use meters. Agree on the price BEFORE getting in. Ask your hotel for standard rates to common destinations so you know what\'s fair.', icon: '🚕' },
    { country: 'jamaica', category: 'first-timer', title: 'Don\'t Leave the Resort Area Unprepared', tip: 'Venture beyond resorts for the real Jamaica, but be aware of your surroundings. Use reputable tour operators for excursions. Kingston requires more caution than Montego Bay.', icon: '🔒' },
    { country: 'jamaica', category: 'first-timer', title: 'Try Jerk Chicken from a Roadside Stand', tip: 'The best jerk chicken is from roadside pits, not resort restaurants. Boston Bay in Portland is the birthplace of jerk. Look for smoke and queues — those are the good ones.', icon: '🍗' },
    { country: 'jamaica', category: 'first-timer', title: 'Bring Reef-Safe Sunscreen', tip: 'Jamaica\'s coral reefs are precious. Use reef-safe sunscreen without oxybenzone. The sun is intense — reapply every 2 hours, even on cloudy days.', icon: '☀️' },
    { country: 'jamaica', category: 'first-timer', title: 'Carry Small Bills', tip: 'Carry small Jamaican Dollar bills for tips, roadside food, and markets. USD is widely accepted at tourist spots but you\'ll get better value paying in JMD.', icon: '💰' },
  ],
  laos: [
    { country: 'laos', category: 'first-timer', title: 'Respect the Alms Giving', tip: 'The morning alms ceremony in Luang Prabang is sacred — don\'t block monks, use flash photography, or touch them. If participating, kneel and offer sticky rice respectfully.', icon: '🙏' },
    { country: 'laos', category: 'first-timer', title: 'Carry Kip and USD', tip: 'The Lao Kip is the local currency, but Thai Baht and USD are widely accepted. ATMs dispense Kip. Carry small USD bills for guesthouses that quote in dollars.', icon: '💵' },
    { country: 'laos', category: 'first-timer', title: 'Cover Up at Temples', tip: 'Cover shoulders and knees at Buddhist temples. Remove shoes before entering. Don\'t point your feet at Buddha images — sit with feet tucked behind you.', icon: '🛕' },
    { country: 'laos', category: 'first-timer', title: 'Try Laap', tip: 'Laap (minced meat salad with herbs, lime, and chili) is the national dish. Try it everywhere — each region makes it differently. Street stall versions are often the best.', icon: '🥗' },
    { country: 'laos', category: 'first-timer', title: 'Take the Slow Boat', tip: 'The 2-day slow boat from Huay Xai to Luang Prabang on the Mekong is one of Southeast Asia\'s great journeys. Book the front seats and bring snacks.', icon: '🚣' },
  ],
  malaysia: [
    { country: 'malaysia', category: 'first-timer', title: 'Eat at Hawker Stalls', tip: 'Malaysia\'s best food is at hawker centres and mamak stalls — nasi lemak, char kway teow, roti canai. A full meal costs RM5-10 ($1-2). Follow the queues.', icon: '🍜' },
    { country: 'malaysia', category: 'first-timer', title: 'Dress Modestly at Mosques', tip: 'Malaysia is a Muslim-majority country. Cover shoulders and knees at mosques — robes are usually provided. Remove shoes before entering. Non-Muslims welcome outside prayer times.', icon: '🕌' },
    { country: 'malaysia', category: 'first-timer', title: 'Use Grab for Transport', tip: 'Grab is the ride-hailing app used across Malaysia — it\'s reliable, cheap, and safer than negotiating with random taxi drivers. Works in KL, Penang, and most cities.', icon: '📱' },
    { country: 'malaysia', category: 'first-timer', title: 'Carry a Rain Jacket', tip: 'Tropical downpours happen daily, usually in the afternoon. Carry a lightweight rain jacket or compact umbrella everywhere. The rain usually stops in 30 minutes.', icon: '🌧️' },
    { country: 'malaysia', category: 'first-timer', title: 'Don\'t Use Your Left Hand', tip: 'The left hand is considered unclean in Malay culture. Use your right hand for eating, giving, and receiving. This is especially important when interacting with Malay Muslims.', icon: '🤚' },
  ],
  maldives: [
    { country: 'maldives', category: 'first-timer', title: 'Book Direct for Best Rates', tip: 'Contact resorts directly after finding rates on booking sites — many offer price matching plus extras (free spa treatment, room upgrade). Always negotiate.', icon: '💰' },
    { country: 'maldives', category: 'first-timer', title: 'Budget for Seaplane Transfers', tip: 'Seaplane transfers from Malé to your resort can cost $300-600 per person return. Budget for this separately — it\'s not included in room rates.', icon: '✈️' },
    { country: 'maldives', category: 'first-timer', title: 'Alcohol Only at Resorts', tip: 'The Maldives is a Muslim country — alcohol is only available at resorts and resort-owned excursion boats. Inhabited islands (local guesthouses) are dry. Plan accordingly.', icon: '🚫' },
    { country: 'maldives', category: 'first-timer', title: 'Bring Reef-Safe Sunscreen', tip: 'The Maldives reefs are some of the world\'s most biodiverse. Use reef-safe sunscreen without harmful chemicals. Snorkeling is world-class — protect what you came to see.', icon: '🐠' },
    { country: 'maldives', category: 'first-timer', title: 'Consider a Local Island', tip: 'Local island guesthouses offer the Maldives experience at 70% less than resorts. Maafushi, Thulusdhoo, and Dhigurah have beaches, snorkeling, and whale shark trips.', icon: '🏝️' },
  ],
  myanmar: [
    { country: 'myanmar', category: 'first-timer', title: 'Carry USD in Perfect Condition', tip: 'US dollars must be crisp, unmarked, unfolded, and post-2006. Banks refuse even slightly worn bills. Bring pristine notes from your home bank.', icon: '💵' },
    { country: 'myanmar', category: 'first-timer', title: 'Remove Shoes at Every Pagoda', tip: 'Shoes and socks must be removed at all pagodas and temples. The ground can be scorching hot — bring a small towel to stand on. Carry a plastic bag for your shoes.', icon: '👟' },
    { country: 'myanmar', category: 'first-timer', title: 'Dress Modestly Everywhere', tip: 'Cover shoulders and knees at all times, not just at temples. Myanmar is conservative. A longyi (traditional wrap) makes a great souvenir and shows cultural respect.', icon: '👔' },
    { country: 'myanmar', category: 'first-timer', title: 'ATMs Have Limits', tip: 'ATMs charge high fees (5,000-10,000 Kyat per withdrawal) and have low limits. Bring USD cash as backup. KBZ and CB banks have the most reliable ATMs.', icon: '🏧' },
    { country: 'myanmar', category: 'first-timer', title: 'Hire an E-Bike in Bagan', tip: 'The best way to explore Bagan\'s 2,000+ temples is by e-bike (electric scooter). Rent one for ~$7/day and set your own pace. Bring a headlamp for pre-dawn temple visits.', icon: '🛵' },
  ],
  netherlands: [
    { country: 'netherlands', category: 'first-timer', title: 'Watch for Bikes', tip: 'Amsterdam has more bikes than people. NEVER walk in the bike lanes (red/brown paths) — cyclists are fast and won\'t stop. Look both ways before crossing any path.', icon: '🚲' },
    { country: 'netherlands', category: 'first-timer', title: 'Book Museums Online', tip: 'The Rijksmuseum, Van Gogh Museum, and Anne Frank House all require advance timed tickets. Anne Frank House tickets release 6 weeks ahead and sell out instantly. Set reminders.', icon: '🎟️' },
    { country: 'netherlands', category: 'first-timer', title: 'Use an OV-chipkaart', tip: 'Get an OV-chipkaart (transit card) for all trains, trams, buses, and metro. It works nationwide and saves money vs single tickets. Load it at any station.', icon: '🎫' },
    { country: 'netherlands', category: 'first-timer', title: 'Explore Beyond Amsterdam', tip: 'The Netherlands is tiny — The Hague, Rotterdam, Utrecht, and Haarlem are all under an hour by train. Each has a distinct character and far fewer tourists than Amsterdam.', icon: '🚆' },
    { country: 'netherlands', category: 'first-timer', title: 'Don\'t Buy Drugs from Street Dealers', tip: 'Coffeeshops (licensed cannabis shops) are legal and regulated. Never buy from street dealers — it\'s dangerous and illegal. Coffeeshops have menus and quality control.', icon: '⚠️' },
  ],
  norway: [
    { country: 'norway', category: 'first-timer', title: 'Budget for High Prices', tip: 'Norway is among the world\'s most expensive countries. A restaurant meal is $30-50, a beer is $10-15. Save money by shopping at REMA 1000 or Kiwi supermarkets.', icon: '💰' },
    { country: 'norway', category: 'first-timer', title: 'Pack Layers and Rain Gear', tip: 'Norwegian weather changes rapidly, especially in Bergen (300+ rainy days/year). Pack waterproof everything. The saying is "there\'s no bad weather, only bad clothing."', icon: '🧥' },
    { country: 'norway', category: 'first-timer', title: 'Use the Norway in a Nutshell Pass', tip: 'The "Norway in a Nutshell" self-guided tour combines train, bus, and fjord cruise from Bergen or Oslo. It\'s the easiest way to see fjords without renting a car.', icon: '🚂' },
    { country: 'norway', category: 'first-timer', title: 'Cards Accepted Everywhere', tip: 'Norway is almost entirely cashless — even hot dog stands and public toilets accept cards. You may not need any cash at all. Contactless payment works everywhere.', icon: '💳' },
    { country: 'norway', category: 'first-timer', title: 'Follow Right to Roam', tip: 'Norway\'s "allemannsretten" (right to roam) lets you hike and camp almost anywhere in nature. Respect the rules: leave no trace, stay 150m from houses, and take your rubbish.', icon: '🏕️' },
  ],
  oman: [
    { country: 'oman', category: 'first-timer', title: 'Dress Conservatively', tip: 'Oman is a Muslim country. Cover shoulders and knees in public. At mosques, women need a headscarf and full-length covering. Omanis appreciate respectful dressing.', icon: '👔' },
    { country: 'oman', category: 'first-timer', title: 'Rent a 4WD', tip: 'Many of Oman\'s best experiences (wadis, desert camping, Jebel Akhdar) require a 4WD vehicle. Standard rental cars can\'t handle gravel roads and wadi crossings.', icon: '🚙' },
    { country: 'oman', category: 'first-timer', title: 'Carry Cash for Small Towns', tip: 'While Muscat has wide card acceptance, smaller towns, souks, and roadside shops are cash-only. ATMs are available but can be scarce in remote areas.', icon: '💰' },
    { country: 'oman', category: 'first-timer', title: 'Visit the Grand Mosque', tip: 'The Sultan Qaboos Grand Mosque in Muscat is stunning and free. Non-Muslims welcome Saturday-Thursday 8-11 AM only. Modest dress required — robes provided.', icon: '🕌' },
    { country: 'oman', category: 'first-timer', title: 'Don\'t Photograph People Without Permission', tip: 'Omanis are private — never photograph people (especially women) without explicit permission. Photographing military or government buildings is prohibited.', icon: '📷' },
  ],
  panama: [
    { country: 'panama', category: 'first-timer', title: 'Visit the Canal Early', tip: 'The Miraflores Locks visitor centre opens at 9 AM. Arrive early for the best viewing — ships transit throughout the day but mornings tend to have more large vessels.', icon: '🚢' },
    { country: 'panama', category: 'first-timer', title: 'USD Is the Currency', tip: 'Panama uses the US Dollar (called Balboa locally). No need to exchange money. ATMs dispense dollars. Carry small bills for taxis and market purchases.', icon: '💵' },
    { country: 'panama', category: 'first-timer', title: 'Use Uber in Panama City', tip: 'Uber works well in Panama City and is safer and more transparent than regular taxis. Regular taxis don\'t use meters — always negotiate the price before getting in.', icon: '🚗' },
    { country: 'panama', category: 'first-timer', title: 'Pack for Rain', tip: 'Even in the "dry season," Panama can get sudden downpours. A lightweight rain jacket and waterproof bag for electronics are essential year-round.', icon: '🌧️' },
    { country: 'panama', category: 'first-timer', title: 'Visit San Blas Islands', tip: 'The San Blas Islands (Guna Yala) are run by the indigenous Guna people. Book through local operators, respect their customs, and bring cash — there are no ATMs on the islands.', icon: '🏝️' },
  ],
  philippines: [
    { country: 'philippines', category: 'first-timer', title: 'Island-Hop in Palawan', tip: 'El Nido and Coron offer the world\'s best island-hopping. Book tours (A, B, C, D) through local operators. Tour A in El Nido (Big Lagoon, Secret Lagoon) is the must-do.', icon: '🏝️' },
    { country: 'philippines', category: 'first-timer', title: 'Carry Cash Everywhere', tip: 'Outside Manila and tourist hubs, cash is king. ATMs can be scarce on islands. Withdraw pesos in Manila or Cebu before heading to remote areas.', icon: '💰' },
    { country: 'philippines', category: 'first-timer', title: 'Filipino Hospitality Is Real', tip: 'Filipinos are among the friendliest people on Earth. Accept invitations, try the food, smile back. "Salamat po" (thank you, respectfully) earns genuine warmth.', icon: '🤝' },
    { country: 'philippines', category: 'first-timer', title: 'Take Domestic Flights', tip: 'With 7,641 islands, flying between destinations saves days. Cebu Pacific and Philippine Airlines have cheap domestic routes — book early for the best fares.', icon: '✈️' },
    { country: 'philippines', category: 'first-timer', title: 'Bring Reef Shoes and Sunscreen', tip: 'Many beaches have coral or rocky entries. Reef shoes are essential. Use reef-safe sunscreen to protect the incredible marine biodiversity you came to see.', icon: '👟' },
  ],
  poland: [
    { country: 'poland', category: 'first-timer', title: 'Pay in Złoty', tip: 'Poland uses the Złoty (PLN), not the Euro. Avoid exchanging at "Kantor" offices in tourist zones with bad rates. Use bank ATMs for the best exchange rate.', icon: '💱' },
    { country: 'poland', category: 'first-timer', title: 'Visit Auschwitz Respectfully', tip: 'Book the guided tour in advance (free but reservations required). Dress appropriately, maintain silence in certain areas, and prepare yourself emotionally. It\'s a profound experience.', icon: '🙏' },
    { country: 'poland', category: 'first-timer', title: 'Try Polish Food', tip: 'Pierogi (dumplings), żurek (sourdough soup), and bigos (hunter\'s stew) are must-tries. Eat at a "bar mleczny" (milk bar) for incredibly cheap, authentic Polish meals.', icon: '🥟' },
    { country: 'poland', category: 'first-timer', title: 'Poland Is Very Affordable', tip: 'Poland offers excellent value — a full restaurant meal for $8-12, a beer for $2-3, and comfortable hotels for $40-60. Your budget goes much further than Western Europe.', icon: '💰' },
    { country: 'poland', category: 'first-timer', title: 'Explore Krakow\'s Underground', tip: 'Book the Wieliczka Salt Mine (30 min from Krakow) and the Rynek Underground Museum. Both are fascinating and provide escape from summer heat or winter cold.', icon: '⛏️' },
  ],
  romania: [
    { country: 'romania', category: 'first-timer', title: 'Rent a Car for Transylvania', tip: 'Public transport is limited between Transylvania\'s castles and villages. Rent a car for the Transfăgărășan highway (open Jun-Oct) — one of the world\'s greatest drives.', icon: '🚗' },
    { country: 'romania', category: 'first-timer', title: 'Romania Uses the Leu', tip: 'The Romanian Leu (RON) is the currency. Cards are widely accepted in cities, but carry cash for rural areas, village guesthouses, and small markets.', icon: '💱' },
    { country: 'romania', category: 'first-timer', title: 'Visit Painted Monasteries', tip: 'The Painted Monasteries of Bucovina (Voroneț, Sucevița) have stunning exterior frescoes from the 15th-16th centuries. They\'re UNESCO sites and far less crowded than Bran Castle.', icon: '🎨' },
    { country: 'romania', category: 'first-timer', title: 'Try Sarmale and Mici', tip: 'Sarmale (stuffed cabbage rolls) and mici (grilled meat rolls) are Romania\'s comfort foods. Try them at a traditional restaurant with a glass of țuică (plum brandy).', icon: '🍖' },
    { country: 'romania', category: 'first-timer', title: 'Romania Is Very Affordable', tip: 'Romania is one of Europe\'s best budget destinations — a restaurant meal for $5-10, a beer for $1-2. Bucharest and Brașov offer amazing value for quality.', icon: '💰' },
  ],
  russia: [
    { country: 'russia', category: 'first-timer', title: 'Get Your Visa Early', tip: 'Most nationalities need a visa for Russia. Apply at least 4-6 weeks ahead through a consulate or visa centre. You\'ll need a hotel confirmation or invitation letter.', icon: '📄' },
    { country: 'russia', category: 'first-timer', title: 'Learn Cyrillic Basics', tip: 'The Russian alphabet looks alien but is learnable in a day. Knowing Cyrillic helps read metro signs, menus, and street names. "Спасибо" (spasibo) means thank you.', icon: '🔤' },
    { country: 'russia', category: 'first-timer', title: 'Use the Metro', tip: 'Moscow\'s metro is spectacular — many stations are underground palaces with chandeliers and mosaics. It\'s also the fastest way around the city. Buy a Troika card.', icon: '🚇' },
    { country: 'russia', category: 'first-timer', title: 'Book Hermitage in Advance', tip: 'The Hermitage in St. Petersburg is one of the world\'s largest museums (3 million items). Book online to skip the queue. Free first Thursdays — arrive early.', icon: '🏛️' },
    { country: 'russia', category: 'first-timer', title: 'Carry Cash as Backup', tip: 'International cards may not work at all locations due to sanctions. Carry cash (rubles) as backup. Exchange at banks, not street vendors.', icon: '💰' },
  ],
  sweden: [
    { country: 'sweden', category: 'first-timer', title: 'Sweden Is Cashless', tip: 'Sweden is the world\'s most cashless society. Many places actively refuse cash. Bring a contactless credit card — it\'s all you need. Some places only accept Swish (local app).', icon: '💳' },
    { country: 'sweden', category: 'first-timer', title: 'Try Fika', tip: 'Fika (coffee and pastry break) is a Swedish institution — not just a coffee, but a social ritual. Try it with a kanelbulle (cinnamon bun) at a local café. Slow down and enjoy.', icon: '☕' },
    { country: 'sweden', category: 'first-timer', title: 'Visit IKEA\'s First Store', tip: 'The IKEA Museum in Älmhult (Småland) is a pilgrimage for design fans. Stockholm also has excellent design museums. Swedish design is everywhere — shops are worth browsing.', icon: '🪑' },
    { country: 'sweden', category: 'first-timer', title: 'Use the Allemansrätten', tip: 'Sweden\'s "Right to Roam" lets you walk, camp, and pick berries anywhere in nature. Respect the land — leave no trace, don\'t disturb wildlife, and stay away from private homes.', icon: '🏕️' },
    { country: 'sweden', category: 'first-timer', title: 'Dress for the Dark', tip: 'Swedish winters are very dark (6 hours of daylight in December in Stockholm, less up north). Bring warm layers, a good attitude, and embrace the candlelit indoor culture.', icon: '🕯️' },
  ],
  switzerland: [
    { country: 'switzerland', category: 'first-timer', title: 'Get a Swiss Travel Pass', tip: 'The Swiss Travel Pass covers unlimited trains, buses, boats, and free museum entry. It\'s expensive upfront but saves a fortune — Swiss transport prices are eye-watering without it.', icon: '🚄' },
    { country: 'switzerland', category: 'first-timer', title: 'Budget for High Prices', tip: 'Switzerland is the world\'s most expensive country for tourists. A basic restaurant meal is CHF 25-40 ($28-45). Save money by shopping at Coop or Migros supermarkets.', icon: '💰' },
    { country: 'switzerland', category: 'first-timer', title: 'Tap Water Is Excellent', tip: 'Swiss tap water is pristine — drink from any tap or public fountain (unless marked "kein Trinkwasser"). No need to ever buy bottled water.', icon: '💧' },
    { country: 'switzerland', category: 'first-timer', title: 'Four Languages', tip: 'Switzerland has four official languages — German (63%), French (23%), Italian (8%), Romansh (0.5%). "Grüezi" in Zurich, "Bonjour" in Geneva. English is widely spoken.', icon: '🗣️' },
    { country: 'switzerland', category: 'first-timer', title: 'Check Mountain Weather', tip: 'Mountain weather changes fast. Check MeteoSwiss before hiking. Cable cars close in bad weather. Even in summer, pack warm layers for altitude — temperatures drop 6°C per 1,000 m.', icon: '⛰️' },
  ],
  tunisia: [
    { country: 'tunisia', category: 'first-timer', title: 'Bargain at Souks', tip: 'Never pay the first price at Tunisian souks. Start at 40-50% of the asking price and negotiate with a smile. Walking away often gets the final price.', icon: '🛍️' },
    { country: 'tunisia', category: 'first-timer', title: 'Dress Modestly Outside Resorts', tip: 'Tunisia is Muslim-majority. Cover shoulders and knees in public, especially in the medinas and outside resort areas. A headscarf is not required but shows respect at mosques.', icon: '👔' },
    { country: 'tunisia', category: 'first-timer', title: 'Learn Basic French and Arabic', tip: 'French is widely spoken alongside Arabic. "Bonjour" and "Merci" work everywhere. "Shukran" (Arabic for thank you) earns extra warmth. English is limited outside hotels.', icon: '🗣️' },
    { country: 'tunisia', category: 'first-timer', title: 'Try a Brik', tip: 'Brik (thin pastry filled with egg, tuna, and capers, then deep-fried) is Tunisia\'s national snack. Eat it immediately — the runny egg is the best part. Found everywhere.', icon: '🥘' },
    { country: 'tunisia', category: 'first-timer', title: 'Visit Star Wars Sites', tip: 'Southern Tunisia was the filming location for Tatooine in Star Wars. Matmata\'s troglodyte dwellings and Mos Espa near Tozeur are pilgrimage sites for fans.', icon: '🎬' },
  ],
  'sri-lanka': [
    { country: 'sri-lanka', category: 'first-timer', title: 'Chase the Dry Coast', tip: 'Sri Lanka has two monsoons hitting different coasts. The west/south coast is dry Dec-Mar; the east coast is dry May-Sep. You can always find a dry, sunny coast.', icon: '🌤️' },
    { country: 'sri-lanka', category: 'first-timer', title: 'Take the Train to Ella', tip: 'The Kandy-to-Ella train is one of the world\'s most scenic rides — tea plantations, waterfalls, and misty mountains. Book 2nd class reserved seats 30 days ahead online.', icon: '🚂' },
    { country: 'sri-lanka', category: 'first-timer', title: 'Dress Modestly at Temples', tip: 'Cover shoulders and knees at Buddhist temples. Remove shoes and hats. White clothing is considered respectful. Never pose with your back to a Buddha statue for photos.', icon: '🛕' },
    { country: 'sri-lanka', category: 'first-timer', title: 'Try Rice and Curry', tip: 'Sri Lankan rice and curry is a feast of 5-10 small dishes served with rice. Eat with your right hand for the authentic experience. Every household makes it differently.', icon: '🍛' },
    { country: 'sri-lanka', category: 'first-timer', title: 'Use Tuk-Tuks Wisely', tip: 'Tuk-tuks are everywhere. Use the PickMe app for metered rides, or negotiate a price before getting in. For day trips, hire a tuk-tuk driver at a daily rate ($25-35).', icon: '🛺' },
  ],
  nepal: [
    { country: 'nepal', category: 'first-timer', title: 'Acclimatize Before Trekking', tip: 'Altitude sickness is the biggest danger on Himalayan treks. Spend 2-3 days in Kathmandu before heading to altitude. Above 3,000 m, don\'t ascend more than 500 m per day.', icon: '🏔️' },
    { country: 'nepal', category: 'first-timer', title: 'Get Trekking Permits', tip: 'Most treks require a TIMS card and national park entry permit. Get them in Kathmandu before you start. Annapurna and Everest regions have different permit requirements.', icon: '📋' },
    { country: 'nepal', category: 'first-timer', title: 'Hire a Local Guide', tip: 'Guides are not mandatory but highly recommended. They know the trails, handle permits, and support the local economy. Budget $25-35/day for an experienced guide.', icon: '🥾' },
    { country: 'nepal', category: 'first-timer', title: 'Carry Cash in Small Bills', tip: 'ATMs are only in Kathmandu, Pokhara, and major towns. On treks, everything is cash-only. Carry enough Nepali Rupees in small denominations for the entire trek.', icon: '💰' },
    { country: 'nepal', category: 'first-timer', title: 'Don\'t Touch with Your Left Hand', tip: 'The left hand is considered impure. Use your right hand for eating, giving, and receiving. Remove shoes before entering homes and temples. Walk clockwise around stupas.', icon: '🤚' },
  ],
}

export const GENERAL_FIRST_TIMER_TIPS: SmartTip[] = [
  { country: 'general', category: 'first-timer', title: 'Copy Your Passport', tip: 'Make copies of your passport and store them separately from the original — one in your luggage, one digitally in your email or cloud storage.', icon: '📄' },
  { country: 'general', category: 'first-timer', title: 'Notify Your Bank', tip: 'Tell your bank you\'re traveling to avoid card blocks. Nothing ruins a trip faster than having your card frozen at an ATM abroad.', icon: '🏦' },
  { country: 'general', category: 'first-timer', title: 'Download Offline Maps', tip: 'Download offline maps (Google Maps or Maps.me) before you go. WiFi isn\'t always available, and roaming data can be expensive.', icon: '🗺️' },
  { country: 'general', category: 'first-timer', title: 'Get Travel Insurance', tip: 'Get travel insurance — it\'s worth it. A single medical emergency abroad without insurance can cost tens of thousands. Don\'t skip this.', icon: '🛡️' },
  { country: 'general', category: 'first-timer', title: 'Learn Key Phrases', tip: 'Learn "hello", "thank you", and "excuse me" in the local language. Even imperfect attempts earn genuine warmth from locals everywhere.', icon: '💬' },
]

export const BUDGET_HACKS: SmartTip[] = [
  { country: 'general', category: 'budget', title: 'Eat Lunch, Not Dinner', tip: 'Have your main meal at lunch. Restaurants worldwide offer lunch specials and set menus at 30-50% less than dinner prices for the same quality.', icon: '🍽️' },
  { country: 'general', category: 'budget', title: 'Use Public Transport', tip: 'Use local public transport instead of taxis. You\'ll save a fortune and see the city like locals do. Day passes often pay for themselves after 3 rides.', icon: '🚌' },
  { country: 'general', category: 'budget', title: 'Visit Free Attractions', tip: 'Many world-class attractions are free — parks, markets, street art, viewpoints, and many museums on specific days. Research free days before you go.', icon: '🆓' },
  { country: 'general', category: 'budget', title: 'Travel on Weekdays', tip: 'Fly and book hotels for weekdays. Tuesday and Wednesday are typically the cheapest days to fly. Weekend hotel rates can be 20-40% higher.', icon: '📅' },
  { country: 'general', category: 'budget', title: 'Stay Outside City Center', tip: 'Book accommodation one or two transit stops from the center. Prices drop dramatically, and you\'re still just minutes away from everything.', icon: '🏠' },
  { country: 'general', category: 'budget', title: 'Cook Some Meals', tip: 'Book places with a kitchen and cook breakfast and simple meals. Visit local markets for fresh ingredients — it\'s cheaper and a cultural experience.', icon: '🥘' },
]

export const SAFETY_SMART_TIPS: SmartTip[] = [
  { country: 'general', category: 'insider', title: 'Share Your Itinerary', tip: 'Share your daily itinerary with someone back home. Use Google Maps timeline or WhatsApp location sharing for real-time tracking.', icon: '📍' },
  { country: 'general', category: 'insider', title: 'Avoid Flashy Displays', tip: 'Don\'t display expensive jewelry, electronics, or large amounts of cash. Use a money belt or hidden pouch for valuables in crowded areas.', icon: '💎' },
  { country: 'general', category: 'insider', title: 'Use ATMs Inside Banks', tip: 'Always use ATMs inside banks or shopping centers — never standalone machines on the street. Skimming devices are more common on unmonitored ATMs.', icon: '🏧' },
  { country: 'general', category: 'insider', title: 'Keep Emergency Contacts Offline', tip: 'Save emergency numbers offline on your phone and written on paper. Include your embassy, travel insurance, and a local emergency contact.', icon: '📞' },
  { country: 'general', category: 'insider', title: 'Trust Your Instincts', tip: 'If a situation feels wrong, leave immediately. Your gut feeling is your best security system. It\'s always better to be overly cautious.', icon: '🧠' },
]

export function getSeasonalAdvice(countrySlug: string): SeasonalAdvice | undefined {
  return SEASONAL_ADVICE.find((s) => s.country === countrySlug)
}

export function getFirstTimerTips(countrySlug: string): SmartTip[] {
  return FIRST_TIMER_TIPS[countrySlug] || []
}
