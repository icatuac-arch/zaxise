/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
// @ts-nocheck
'use client';

import { useState, useMemo } from 'react';

// ─── TYPES ──────────────────────────────────────────────────

interface TrainJourney {
  id: string;
  name: string;
  country: string;
  continent: 'Asia' | 'Europe' | 'Americas' | 'Africa/Oceania';
  route: string;
  distance: string;
  duration: string;
  costRange: string;
  costSortValue: number;
  durationSortValue: number;
  bestSeason: string;
  whatYoullSee: string;
  bookingTips: string;
  classOptions: string;
  whyItsSpecial: string;
  bestForPhotography: boolean;
  mostAffordable: boolean;
  bucketList: boolean;
  emoji: string;
}

// ─── DATA ───────────────────────────────────────────────────

const JOURNEYS: TrainJourney[] = [
  // ── ASIA ──
  {
    id: 'shinkansen',
    name: 'Shinkansen (Bullet Train)',
    country: 'Japan',
    continent: 'Asia',
    route: 'Tokyo to Osaka (Tokaido line)',
    distance: '515 km',
    duration: '2.5 hours',
    costRange: 'JR Pass: ~$320/7 days (approx. 50,000 yen)',
    costSortValue: 320,
    durationSortValue: 2.5,
    bestSeason: 'Year-round. Spring (cherry blossom) and autumn (koyo) for the best Mount Fuji backdrop.',
    whatYoullSee: 'Mount Fuji on a clear day (sit on the right side heading to Osaka), rolling countryside, tea fields of Shizuoka, and a demonstration of Japanese engineering precision — trains arrive within seconds of schedule.',
    bookingTips: 'Purchase a Japan Rail Pass before arriving in Japan. Reserve seats for the Nozomi equivalent (Hikari/Kodama with JR Pass). Platform markings show exact car positions. Try the ekiben (station bento) for lunch.',
    classOptions: 'Ordinary Car (comfortable reclining seats), Green Car (first class with wider seats and more legroom), Gran Class (on some lines, luxury with meals)',
    whyItsSpecial: 'The world\'s most punctual and efficient high-speed rail. The fleeting glimpse of Mount Fuji framed by the window at 285 km/h is a quintessentially Japanese moment.',
    bestForPhotography: true,
    mostAffordable: false,
    bucketList: true,
    emoji: '🚅',
  },
  {
    id: 'palace-on-wheels',
    name: 'Palace on Wheels',
    country: 'India',
    continent: 'Asia',
    route: 'Rajasthan circuit: Delhi - Jaipur - Jodhpur - Udaipur - Agra',
    distance: 'Rajasthan loop (~2,500 km)',
    duration: '7 days',
    costRange: '$400 - $600/night',
    costSortValue: 2800,
    durationSortValue: 168,
    bestSeason: 'October - March (Indian winter). Avoids the extreme summer heat of Rajasthan.',
    whatYoullSee: 'The pink city of Jaipur, the blue city of Jodhpur, the white city of Udaipur on its lakes, the golden Thar Desert at Jaisalmer, Ranthambore\'s tigers, and the Taj Mahal at sunrise in Agra.',
    bookingTips: 'Book 3-6 months ahead as capacity is limited. The fare includes all meals, tours, and entrance fees. Tips for onboard staff are customary. Carry camera equipment for desert sunrise shoots.',
    classOptions: 'Deluxe Cabin (standard, beautifully appointed), Super Deluxe Cabin (larger with sitting area), each carriage is named after a former Rajput state',
    whyItsSpecial: 'Living like Indian royalty on rails. Each carriage is a palace-themed suite, and the journey unfolds the colours, forts, and desert landscapes of Rajasthan like a moving fairy tale.',
    bestForPhotography: true,
    mostAffordable: false,
    bucketList: true,
    emoji: '🏰',
  },
  {
    id: 'darjeeling-himalayan',
    name: 'Darjeeling Himalayan Railway',
    country: 'India',
    continent: 'Asia',
    route: 'New Jalpaiguri to Darjeeling (or joy ride loop)',
    distance: '88 km (full line)',
    duration: '7-8 hours (full); 2 hours (joy ride)',
    costRange: 'Joy ride: ~$18 (1,500 INR)',
    costSortValue: 18,
    durationSortValue: 2,
    bestSeason: 'October - November and March - May. Clear skies for Kanchenjunga views. Avoid monsoon (June-September).',
    whatYoullSee: 'Lush tea plantations carpeting the hillsides, the Batasia Loop spiral with Kanchenjunga panorama, misty Himalayan foothills, colonial hill station architecture, and the famous zigzag reverses and loops of narrow-gauge engineering.',
    bookingTips: 'The joy ride from Darjeeling station is easiest to book. Full journey from New Jalpaiguri runs limited services — check Indian Railways. First class has better windows. Sit on the left for valley views ascending.',
    classOptions: '1st Class (padded seats, windows), 2nd Class (wooden benches, authentic experience), Joy Ride (tourist special, 2-hour loop)',
    whyItsSpecial: 'A UNESCO World Heritage "Toy Train" that has chugged through the clouds since 1881. The romance of steam locomotion through tea gardens with the Himalayas as backdrop is timeless.',
    bestForPhotography: true,
    mostAffordable: true,
    bucketList: false,
    emoji: '🍵',
  },
  {
    id: 'kandy-ella',
    name: 'Kandy to Ella',
    country: 'Sri Lanka',
    continent: 'Asia',
    route: 'Kandy to Ella',
    distance: '~140 km',
    duration: '7 hours',
    costRange: '$2 - $10',
    costSortValue: 2,
    durationSortValue: 7,
    bestSeason: 'January - April for driest weather. The route is stunning year-round, but misty in monsoon.',
    whatYoullSee: 'Emerald tea plantations stretching to the horizon, the iconic Nine Arches Bridge, misty mountain peaks, cascading waterfalls, workers picking tea by hand, tunnels carved through rock, and lush tropical forest canopy.',
    bookingTips: 'Book 1st class observation seats 30 days ahead at the station. 2nd class unreserved is fine if you queue early. Sit on the right side from Kandy for the best views. Hang from the open doorway (carefully!) for the classic photo.',
    classOptions: '1st Class Observation (reserved seats, panoramic windows), 2nd Class (unreserved, open windows for photos), 3rd Class (very crowded, local experience)',
    whyItsSpecial: 'Consistently rated one of the most beautiful train rides on Earth. For as little as $2, you get seven hours of jaw-dropping scenery that rivals journeys costing hundreds of times more.',
    bestForPhotography: true,
    mostAffordable: true,
    bucketList: true,
    emoji: '🌿',
  },
  {
    id: 'eastern-oriental-express',
    name: 'Eastern & Oriental Express',
    country: 'Singapore / Malaysia / Thailand',
    continent: 'Asia',
    route: 'Singapore to Bangkok',
    distance: '~1,940 km',
    duration: '3 days',
    costRange: '$3,000+',
    costSortValue: 3000,
    durationSortValue: 72,
    bestSeason: 'November - March for the dry season across Southeast Asia. Avoid April (Songkran) if you want smooth scheduling.',
    whatYoullSee: 'The Malay Peninsula\'s rubber plantations and palm oil estates, Kuala Lumpur\'s skyline, Penang\'s George Town (UNESCO), the Bridge over the River Kwai, Thai Buddhist temples, lush tropical jungle, and limestone karst landscapes approaching Bangkok.',
    bookingTips: 'Book 6-12 months ahead on belmond.com as capacity is extremely limited. The fare includes all meals, cocktails, and off-train excursions. Smart-casual dress is required; formal dress for the observation car dinner. Tipping is included.',
    classOptions: 'Pullman Cabin (upper/lower berths, compact but elegant), State Cabin (larger with writing desk), Presidential Suite (full suite with living area, the ultimate splurge)',
    whyItsSpecial: 'Old-world glamour through the tropical heart of Southeast Asia. Three days of Belmond luxury — white-glove dining, cocktails in the observation car, and waking up to a new country each morning.',
    bestForPhotography: true,
    mostAffordable: false,
    bucketList: true,
    emoji: '🌴',
  },

  // ── EUROPE ──
  {
    id: 'glacier-express',
    name: 'Glacier Express',
    country: 'Switzerland',
    continent: 'Europe',
    route: 'Zermatt to St. Moritz',
    distance: '291 km',
    duration: '8 hours',
    costRange: 'CHF 152+ (~$170+)',
    costSortValue: 170,
    durationSortValue: 8,
    bestSeason: 'June - September for green Alps and wildflowers. December - March for snow-covered wonderland.',
    whatYoullSee: 'The Matterhorn (from Zermatt), 291 bridges, 91 tunnels, the Oberalp Pass at 2,033m, the Rhine Gorge ("Swiss Grand Canyon"), Alpine meadows with wildflowers, glacial valleys, and pristine mountain villages.',
    bookingTips: 'Book online well in advance, especially for summer window seats. Seat reservations are mandatory (CHF 49 extra for Excellence Class). The panoramic cars have floor-to-ceiling windows. Right side offers slightly better views overall.',
    classOptions: '2nd Class (panoramic windows, comfortable), 1st Class (wider seats, included 3-course meal served at your seat), Excellence Class (premium bar, 5-course meal, private lounge car)',
    whyItsSpecial: 'The "slowest express train in the world" — because you want every minute to last. Eight hours of non-stop Alpine grandeur that is virtually impossible to experience any other way.',
    bestForPhotography: true,
    mostAffordable: false,
    bucketList: true,
    emoji: '🏔️',
  },
  {
    id: 'bernina-express',
    name: 'Bernina Express',
    country: 'Switzerland / Italy',
    continent: 'Europe',
    route: 'Chur to Tirano (Italy)',
    distance: '144 km',
    duration: '4 hours',
    costRange: 'CHF 63+ (~$70+)',
    costSortValue: 70,
    durationSortValue: 4,
    bestSeason: 'Year-round. Summer for green valleys, winter for a snow-globe landscape.',
    whatYoullSee: 'The Landwasser Viaduct (iconic curved stone bridge), the Morteratsch Glacier, the Bernina Pass at 2,253m (highest Alpine railway crossing), Italian palm trees in Poschiavo, and the dramatic transition from Germanic to Italian culture.',
    bookingTips: 'Mandatory seat reservation. Book early for window seats. The Landwasser Viaduct is on the left side heading south. Consider combining with the Glacier Express for the ultimate Swiss rail trip.',
    classOptions: '2nd Class (panoramic), 1st Class (wider panoramic seats), both have the same massive windows',
    whyItsSpecial: 'A UNESCO World Heritage railway that crosses the Alps at their highest navigable point. The moment the train curves across the Landwasser Viaduct is one of rail travel\'s most photographed moments.',
    bestForPhotography: true,
    mostAffordable: false,
    bucketList: true,
    emoji: '🌉',
  },
  {
    id: 'bergen-railway',
    name: 'Bergen Railway',
    country: 'Norway',
    continent: 'Europe',
    route: 'Oslo to Bergen',
    distance: '496 km',
    duration: '7 hours',
    costRange: 'NOK 299+ (~$30+)',
    costSortValue: 30,
    durationSortValue: 7,
    bestSeason: 'June - August for midnight sun glow and green valleys. Winter for snow-covered Hardangervidda.',
    whatYoullSee: 'Dense forests giving way to the barren Hardangervidda plateau (Europe\'s largest), frozen lakes, snow sheds, the mountain station at Finse (1,222m, used for Star Wars Hoth scenes), fjord country approach, and Bergen\'s colourful Bryggen wharf.',
    bookingTips: 'Book on Vy.no for the best fares (minipris tickets from NOK 299). Sit on the left side from Oslo. Consider the Flam Railway branch from Myrdal for a dramatic side trip down to the fjords.',
    classOptions: 'Standard (comfortable seats, power outlets), Komfort (extra legroom, coffee/tea included, quieter car)',
    whyItsSpecial: 'Crossing the roof of Norway from east to west, this line traverses Europe\'s largest mountain plateau. The stark beauty of Hardangervidda under snow is otherworldly.',
    bestForPhotography: true,
    mostAffordable: true,
    bucketList: false,
    emoji: '❄️',
  },
  {
    id: 'jacobite-steam-train',
    name: 'Jacobite Steam Train',
    country: 'Scotland',
    continent: 'Europe',
    route: 'Fort William to Mallaig',
    distance: '66 km',
    duration: '2 hours (one way)',
    costRange: '~$55 round trip (45 GBP)',
    costSortValue: 55,
    durationSortValue: 4,
    bestSeason: 'May - October (the service runs seasonally). June for longest daylight. September for autumn colours.',
    whatYoullSee: 'The Glenfinnan Viaduct (the Harry Potter bridge), Loch Shiel, Ben Nevis in the distance, the silver sands of Morar, rugged Highland landscape, and the fishing village of Mallaig with views to the Isle of Skye.',
    bookingTips: 'Book months in advance — this is one of the UK\'s most popular rail experiences. Sit on the left side from Fort William for Glenfinnan Viaduct views. Morning service is more popular. Cameras ready at the viaduct (about 30 min in).',
    classOptions: 'Standard (compartment-style seating), First Class (quieter, table seating, complimentary refreshments)',
    whyItsSpecial: 'Real steam, real Highland scenery, and crossing the most famous railway viaduct in cinema. Even without the Harry Potter connection, this would be one of the world\'s greatest short rail journeys.',
    bestForPhotography: true,
    mostAffordable: false,
    bucketList: true,
    emoji: '🧙',
  },
  {
    id: 'flam-railway',
    name: 'Flam Railway (Flamsbana)',
    country: 'Norway',
    continent: 'Europe',
    route: 'Myrdal to Flam',
    distance: '20 km',
    duration: '1 hour',
    costRange: 'NOK 470+ (~$45+)',
    costSortValue: 45,
    durationSortValue: 1,
    bestSeason: 'May - September. The Kjosfossen waterfall is most dramatic after snowmelt (June).',
    whatYoullSee: 'One of the steepest normal-gauge railways in the world, plunging 863m in 20km. The thundering Kjosfossen waterfall (with a surprise performance), hairpin tunnels carved by hand, lush green valleys, and the Aurlandsfjord at the bottom.',
    bookingTips: 'Book on visitflam.com. Combine with the Bergen Railway (board at Myrdal) and a fjord cruise from Flam for the "Norway in a Nutshell" package. Sit on the right side descending for the waterfall. The train stops for photos.',
    classOptions: 'Standard only (but well-maintained with large windows). All seats offer excellent views.',
    whyItsSpecial: 'A masterpiece of Norwegian engineering that drops nearly a kilometre in altitude in one hour. When the train stops at Kjosfossen waterfall and the mist hits your face, you understand why this is a world-top-10 railway.',
    bestForPhotography: true,
    mostAffordable: false,
    bucketList: false,
    emoji: '🌊',
  },
  {
    id: 'cinque-terre-express',
    name: 'Cinque Terre Express',
    country: 'Italy',
    continent: 'Europe',
    route: 'La Spezia - Riomaggiore - Manarola - Corniglia - Vernazza - Monterosso',
    distance: '~15 km (5 villages)',
    duration: '30 minutes (end to end)',
    costRange: '~$18 day pass (16 EUR)',
    costSortValue: 18,
    durationSortValue: 0.5,
    bestSeason: 'April - June and September - October. Avoid August crowds. Spring has wildflowers on the terraces.',
    whatYoullSee: 'Five impossibly colourful fishing villages clinging to cliffsides above the Ligurian Sea. Terraced vineyards, turquoise water, tiny harbours with painted boats, tunnels between villages, and the Mediterranean coastline.',
    bookingTips: 'Buy the Cinque Terre Treno MS card for unlimited train travel between villages plus trail access. Trains run every 10-20 minutes. Explore villages on foot and hop back on the train. Start from either end.',
    classOptions: 'Standard regional train only. No class distinction. Standing room on busy days.',
    whyItsSpecial: 'Not a single spectacular journey but a scenic commuter line that connects five of the most photogenic villages in Europe. The ability to hop between these car-free coastal gems by train is pure Italian magic.',
    bestForPhotography: true,
    mostAffordable: true,
    bucketList: false,
    emoji: '🏘️',
  },
  {
    id: 'west-highland-line',
    name: 'West Highland Line',
    country: 'Scotland',
    continent: 'Europe',
    route: 'Glasgow to Mallaig',
    distance: '264 km',
    duration: '5.5 hours',
    costRange: '~$25+ (20 GBP+)',
    costSortValue: 25,
    durationSortValue: 5.5,
    bestSeason: 'May - September for long daylight and green Highlands. October for dramatic autumn colours and mist.',
    whatYoullSee: 'Loch Lomond, Rannoch Moor (one of Europe\'s last true wildernesses), Glen Coe mountains, Ben Nevis in the distance, the Glenfinnan Viaduct, Loch Shiel, the silver sands of Morar, and the fishing port of Mallaig with views to Skye and the Small Isles.',
    bookingTips: 'Book on ScotRail for the regular service (much cheaper than the Jacobite steam train that covers part of this route). Sit on the left from Glasgow for the best loch and mountain views. An advance single from Glasgow to Mallaig can be as low as £12.',
    classOptions: 'Standard (comfortable seats, tables), First Class (quieter, complimentary tea/coffee, wider seats)',
    whyItsSpecial: 'Voted the most scenic railway in the UK year after year. The full Glasgow-to-Mallaig line combines the raw beauty of the Highlands, lochs, moors, and coast in one unforgettable 5.5-hour journey at a fraction of the Jacobite\'s price.',
    bestForPhotography: true,
    mostAffordable: true,
    bucketList: false,
    emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  },

  // ── AMERICAS ──
  {
    id: 'rocky-mountaineer',
    name: 'Rocky Mountaineer',
    country: 'Canada',
    continent: 'Americas',
    route: 'Vancouver to Banff/Jasper (multiple routes)',
    distance: '~960 km (to Banff)',
    duration: '2 days',
    costRange: '$1,500 - $5,000+',
    costSortValue: 1500,
    durationSortValue: 48,
    bestSeason: 'April - October (operating season). June - September for best weather and longest days.',
    whatYoullSee: 'The Fraser Canyon, Hell\'s Gate, the Spiral Tunnels, Kicking Horse Pass, the Continental Divide, glacier-fed turquoise lakes, towering snow-capped Rockies, eagles, bears, and moose from your glass-dome car.',
    bookingTips: 'Book 4-6 months ahead. GoldLeaf service includes the iconic glass-dome car and outdoor viewing platform. The "First Passage to the West" route (Vancouver-Banff) is the most popular. All travel is daylight-only — you overnight in Kamloops.',
    classOptions: 'SilverLeaf (oversized windows, hot meals at seat), GoldLeaf (bi-level glass dome car, gourmet dining downstairs, outdoor viewing platform)',
    whyItsSpecial: 'All daylight, no sleeping — the Rocky Mountaineer only runs during the day so you never miss a moment. Gliding through the Canadian Rockies in a glass-dome car with gourmet food is the pinnacle of North American rail luxury.',
    bestForPhotography: true,
    mostAffordable: false,
    bucketList: true,
    emoji: '🏔️',
  },
  {
    id: 'the-canadian',
    name: 'The Canadian',
    country: 'Canada',
    continent: 'Americas',
    route: 'Toronto to Vancouver',
    distance: '4,466 km',
    duration: '4 days',
    costRange: '$500 - $3,000+',
    costSortValue: 500,
    durationSortValue: 96,
    bestSeason: 'June - September for warm weather. October for autumn colours. January for frozen prairies.',
    whatYoullSee: 'Ontario\'s lake country, the vast Canadian Prairies (Saskatchewan wheat fields stretching to infinity), the drama of entering the Rocky Mountains at Jasper, the Thompson and Fraser river canyons, and the Pacific coast approach to Vancouver.',
    bookingTips: 'Book on VIA Rail\'s website. Prestige class sells out months ahead. Economy is budget-friendly but bring food. The Panorama car is available to all sleeper classes. The journey runs 3 times weekly in summer, twice in winter.',
    classOptions: 'Economy (reclining seat, no meals), Sleeper Plus (berths and cabins, meals in dining car, Panorama dome car access), Prestige (luxury suite, private shower, concierge service)',
    whyItsSpecial: 'Crossing Canada coast to coast by train is the way the nation was built. Four days of watching the country transform from eastern lakes to prairies to mountains to Pacific is deeply moving.',
    bestForPhotography: true,
    mostAffordable: false,
    bucketList: true,
    emoji: '🍁',
  },
  {
    id: 'coast-starlight',
    name: 'Amtrak Coast Starlight',
    country: 'USA',
    continent: 'Americas',
    route: 'Seattle to Los Angeles',
    distance: '2,216 km',
    duration: '35 hours',
    costRange: '$100 - $400+',
    costSortValue: 100,
    durationSortValue: 35,
    bestSeason: 'May - October for clearest coastal views. Spring for green hillsides in California.',
    whatYoullSee: 'The Puget Sound, Mount Shasta, the Cascade Range, Sacramento Valley, the stunning California coastline between San Luis Obispo and Santa Barbara, the Pacific Ocean, and the approach to Los Angeles through beach towns.',
    bookingTips: 'Book on Amtrak.com. Coach is comfortable with wide seats. The Parlour Car (sleeper passengers only) has wine tastings. Sit on the left (west) side heading south for ocean views. The SLO-to-SB stretch is the highlight.',
    classOptions: 'Coach (wide reclining seats, legroom), Roomette (private room for 2, meals included), Bedroom (larger private room, en-suite shower, meals included)',
    whyItsSpecial: 'America\'s most beautiful long-distance train route. The stretch where the tracks hug the Pacific Ocean cliffs is the kind of scenery that makes you want to put your phone away and just stare.',
    bestForPhotography: true,
    mostAffordable: true,
    bucketList: false,
    emoji: '🌅',
  },
  {
    id: 'grand-canyon-railway',
    name: 'Grand Canyon Railway',
    country: 'USA',
    continent: 'Americas',
    route: 'Williams, AZ to Grand Canyon South Rim',
    distance: '103 km',
    duration: '2.25 hours (one way)',
    costRange: '$67+',
    costSortValue: 67,
    durationSortValue: 4.5,
    bestSeason: 'Year-round. Spring and autumn for comfortable temperatures. Winter for snow-dusted canyon rims.',
    whatYoullSee: 'High desert landscape, ponderosa pine forests, wildlife (elk, deer, eagles), and the unforgettable first glimpse of the Grand Canyon as you arrive at the historic depot on the South Rim.',
    bookingTips: 'Book at thetrain.com. The experience includes Wild West entertainment at Williams depot before departure. Combine with an overnight stay at El Tovar or Bright Angel Lodge on the rim. Return train departs at 3:30 PM.',
    classOptions: 'Coach (1950s-style cars), First Class (larger seats, snacks), Observation Dome (glass-ceiling car, drinks), Luxury Parlour (open-air platform, bar), Luxury Dome (premium glass-dome)',
    whyItsSpecial: 'Arriving at the Grand Canyon by vintage train feels like stepping back in time. No parking hassles, no traffic — just the anticipation building through the pines until the canyon suddenly reveals itself.',
    bestForPhotography: false,
    mostAffordable: true,
    bucketList: false,
    emoji: '🏜️',
  },
  // ── AFRICA / OCEANIA ──
  {
    id: 'blue-train',
    name: 'The Blue Train',
    country: 'South Africa',
    continent: 'Africa/Oceania',
    route: 'Pretoria to Cape Town',
    distance: '1,600 km',
    duration: '27 hours',
    costRange: '$1,500+',
    costSortValue: 1500,
    durationSortValue: 27,
    bestSeason: 'September - April (South African spring/summer). March for the winelands harvest.',
    whatYoullSee: 'The Highveld grasslands around Pretoria, the diamond town of Kimberley (with a stop for the Big Hole tour), the Great Karoo semi-desert, dramatic Hex River Mountains pass, and the lush Cape Winelands approaching Cape Town.',
    bookingTips: 'Book at bluetrain.co.za 3-6 months ahead. Price includes all meals, drinks, and an off-train excursion at Kimberley. Dress code is smart-casual during the day, formal for dinner. Butler service in every cabin.',
    classOptions: 'Deluxe Suite (3/4 or full-size bed, en-suite bathroom), Luxury Suite (full-size bed, full bathroom with tub)',
    whyItsSpecial: 'Five-star luxury on rails through the South African landscape. Sipping champagne as the Karoo desert rolls past your picture window, then waking up to the vineyards of the Cape is pure indulgence.',
    bestForPhotography: false,
    mostAffordable: false,
    bucketList: true,
    emoji: '💎',
  },
  {
    id: 'rovos-rail',
    name: 'Rovos Rail',
    country: 'South Africa',
    continent: 'Africa/Oceania',
    route: 'Pretoria to Cape Town (and other African routes)',
    distance: '1,600 km (Pretoria-Cape Town)',
    duration: '48 hours',
    costRange: '$1,800 - $5,000+',
    costSortValue: 1800,
    durationSortValue: 48,
    bestSeason: 'Year-round, with September - April being most popular. Also offers epic Pretoria-to-Dar es Salaam and Cape-to-Cairo routes.',
    whatYoullSee: 'The Highveld plateau, Kimberley\'s Big Hole, the Karoo semi-desert, Matjiesfontein (Victorian village stop), Hex River Mountains, and the Cape Winelands. Extended routes cross into Zimbabwe (Victoria Falls), Tanzania, and even to Cairo.',
    bookingTips: 'Book at rovos.com 6-12 months ahead, especially for the longer routes. Price includes all meals, fine wines, and off-train excursions. Formal dress required at dinner. No Wi-Fi or TV by design — this is about disconnecting.',
    classOptions: 'Pullman Suite (cosy with en-suite shower), Deluxe Suite (larger with Victorian bath), Royal Suite (75 sq metres with private lounge, the most spacious train suite in the world)',
    whyItsSpecial: 'Billed as "the most luxurious train in the world" — and it delivers. Edwardian-era restored carriages, five-course silver-service dinners, and the open observation car watching the African savanna roll past is incomparable.',
    bestForPhotography: true,
    mostAffordable: false,
    bucketList: true,
    emoji: '🦁',
  },
  {
    id: 'indian-pacific',
    name: 'Indian Pacific',
    country: 'Australia',
    continent: 'Africa/Oceania',
    route: 'Sydney to Perth',
    distance: '4,352 km',
    duration: '65 hours',
    costRange: '$800 - $3,500+',
    costSortValue: 800,
    durationSortValue: 65,
    bestSeason: 'March - May and September - November for comfortable temperatures across the Nullarbor.',
    whatYoullSee: 'The Blue Mountains west of Sydney, the agricultural heartland, Broken Hill mining town, the vast Nullarbor Plain (the world\'s longest straight stretch of railway — 478 km without a curve), the Nullarbor cliffs over the Southern Ocean, and the approach to Perth.',
    bookingTips: 'Book at journeybeyondrail.com.au. Gold Service includes all meals, off-train experiences, and the Outback Explorer Lounge. Platinum is ultra-luxury. Off-train excursions at Adelaide, Cook (ghost town), and Rawlinna are included.',
    classOptions: 'Red Service (reclining seat, no meals), Gold Service (private cabin, all meals, off-train tours, lounge car), Platinum Service (larger suite, premium dining, exclusive experiences)',
    whyItsSpecial: 'Crossing an entire continent from the Pacific to the Indian Ocean. The Nullarbor crossing — 478 km of dead-straight track through nothingness — redefines your concept of "vast".',
    bestForPhotography: false,
    mostAffordable: false,
    bucketList: true,
    emoji: '🦘',
  },
  {
    id: 'tranzalpine',
    name: 'TranzAlpine',
    country: 'New Zealand',
    continent: 'Africa/Oceania',
    route: 'Christchurch to Greymouth',
    distance: '223 km',
    duration: '4.5 hours',
    costRange: 'NZ$129+ (~$80+)',
    costSortValue: 80,
    durationSortValue: 4.5,
    bestSeason: 'October - April for best weather. Winter for snow-capped peaks. Autumn (March-April) for golden beech forests.',
    whatYoullSee: 'The Canterbury Plains, the Waimakariri River gorge, Arthur\'s Pass through the Southern Alps, alpine viaducts, beech forests, the Otira Tunnel (8.5 km), and the lush West Coast rainforest descending to Greymouth.',
    bookingTips: 'Book at greatjourneysofnz.co.nz. The open-air viewing carriage is the highlight — dress warmly even in summer. Sit on the left side from Christchurch for river views. Consider a one-way trip and returning via rental car along the coast.',
    classOptions: 'Scenic (standard comfortable seating), Scenic Plus (premium seats, complimentary food and drinks, priority access to viewing car)',
    whyItsSpecial: 'Coast to coast across the Southern Alps in under five hours. The open-air viewing car lets you feel the mountain air and hear the rivers roaring below as you cross viaducts in one of the world\'s most dramatic alpine crossings.',
    bestForPhotography: true,
    mostAffordable: false,
    bucketList: false,
    emoji: '🌿',
  },
];

// ─── CONTINENT CONFIG ───────────────────────────────────────

const CONTINENTS = ['All', 'Asia', 'Europe', 'Americas', 'Africa/Oceania'] as const;
type ContinentFilter = (typeof CONTINENTS)[number];

const CONTINENT_COLORS: Record<string, { bg: string; text: string; border: string; tag: string }> = {
  Asia: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200', tag: 'bg-red-100 text-red-700' },
  Europe: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', tag: 'bg-blue-100 text-blue-700' },
  Americas: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', tag: 'bg-emerald-100 text-emerald-700' },
  'Africa/Oceania': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', tag: 'bg-amber-100 text-amber-700' },
};

type SortBy = 'default' | 'cost-asc' | 'cost-desc' | 'duration-asc' | 'duration-desc';
type PickFilter = 'all' | 'photography' | 'affordable' | 'bucket-list';

// ─── PAGE ───────────────────────────────────────────────────

export default function TrainJourneysPage() {
  const [continent, setContinent] = useState<ContinentFilter>('All');
  const [sortBy, setSortBy] = useState<SortBy>('default');
  const [pick, setPick] = useState<PickFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...JOURNEYS];

    // continent filter
    if (continent !== 'All') {
      list = list.filter((j) => j.continent === continent);
    }

    // pick filter
    if (pick === 'photography') list = list.filter((j) => j.bestForPhotography);
    if (pick === 'affordable') list = list.filter((j) => j.mostAffordable);
    if (pick === 'bucket-list') list = list.filter((j) => j.bucketList);

    // sort
    if (sortBy === 'cost-asc') list.sort((a, b) => a.costSortValue - b.costSortValue);
    if (sortBy === 'cost-desc') list.sort((a, b) => b.costSortValue - a.costSortValue);
    if (sortBy === 'duration-asc') list.sort((a, b) => a.durationSortValue - b.durationSortValue);
    if (sortBy === 'duration-desc') list.sort((a, b) => b.durationSortValue - a.durationSortValue);

    return list;
  }, [continent, sortBy, pick]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* ── Header ── */}
      <header className="text-center mb-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-sky-600 mb-3">WorldTourly Presents</p>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4">
          World&apos;s Most Scenic Train Journeys
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          The ultimate guide to scenic rail travel. 20 iconic train journeys across 6 continents — from the Trans-Siberian
          to the TranzAlpine. Slow down, watch the world roll by, and discover why the journey really is the destination.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full">
            <span>🚂</span> 20 Journeys
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full">
            <span>🌍</span> 15 Countries
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full">
            <span>📸</span> Photography Picks
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full">
            <span>💰</span> Budget Options from $2
          </span>
        </div>
      </header>

      {/* ── Filters ── */}
      <section className="mb-10 space-y-4">
        {/* Continent filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide mr-1">Continent:</span>
          {CONTINENTS.map((c) => (
            <button
              key={c}
              onClick={() => setContinent(c)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                continent === c
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Sort + Picks */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="default">Default Order</option>
              <option value="cost-asc">Cost: Low to High</option>
              <option value="cost-desc">Cost: High to Low</option>
              <option value="duration-asc">Duration: Shortest First</option>
              <option value="duration-desc">Duration: Longest First</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Picks:</span>
            {([
              { val: 'all', label: 'All' },
              { val: 'photography', label: '📸 Photography' },
              { val: 'affordable', label: '💰 Most Affordable' },
              { val: 'bucket-list', label: '🎯 Bucket List' },
            ] as const).map((p) => (
              <button
                key={p.val}
                onClick={() => setPick(p.val)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  pick === p.val
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Results count ── */}
      <p className="text-sm text-slate-500 mb-6">
        Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of {JOURNEYS.length} journeys
      </p>

      {/* ── Journey Cards ── */}
      <div className="space-y-5">
        {filtered.map((j, idx) => {
          const colors = CONTINENT_COLORS[j.continent] || CONTINENT_COLORS.Asia;
          const isExpanded = expandedId === j.id;

          return (
            <article
              key={j.id}
              className={`border rounded-2xl overflow-hidden transition-all ${colors.border} ${isExpanded ? colors.bg : 'bg-white hover:shadow-md'}`}
            >
              {/* Card Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : j.id)}
                className="w-full text-left p-5 sm:p-6 flex items-start gap-4"
              >
                <span className="text-3xl sm:text-4xl flex-shrink-0 mt-0.5">{j.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${colors.tag}`}>
                      {j.continent}
                    </span>
                    {j.bucketList && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                        Bucket List
                      </span>
                    )}
                    {j.bestForPhotography && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700">
                        📸 Photo Pick
                      </span>
                    )}
                    {j.mostAffordable && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
                        💰 Affordable
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                    {j.name}
                  </h2>
                  <p className="text-sm text-slate-600 mt-0.5">{j.country}</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2.5 text-sm text-slate-700">
                    <span><strong className="text-slate-500">Route:</strong> {j.route}</span>
                    <span><strong className="text-slate-500">Distance:</strong> {j.distance}</span>
                    <span><strong className="text-slate-500">Duration:</strong> {j.duration}</span>
                    <span><strong className="text-slate-500">Cost:</strong> {j.costRange}</span>
                  </div>
                </div>
                <span className="text-slate-400 flex-shrink-0 mt-1">
                  {isExpanded ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  )}
                </span>
              </button>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-0 space-y-5">
                  <div className="border-t border-slate-200 pt-5" />

                  {/* Why it's special */}
                  <blockquote className="bg-white border-l-4 border-sky-500 pl-4 py-3 rounded-r-lg italic text-slate-700 text-base leading-relaxed">
                    &ldquo;{j.whyItsSpecial}&rdquo;
                  </blockquote>

                  <div className="grid sm:grid-cols-2 gap-5">
                    {/* What you'll see */}
                    <div className="bg-white rounded-xl p-4 border border-slate-100">
                      <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <span>👁️</span> What You&apos;ll See
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{j.whatYoullSee}</p>
                    </div>

                    {/* Best season */}
                    <div className="bg-white rounded-xl p-4 border border-slate-100">
                      <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <span>🗓️</span> Best Season
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{j.bestSeason}</p>
                    </div>

                    {/* Class options */}
                    <div className="bg-white rounded-xl p-4 border border-slate-100">
                      <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <span>🎫</span> Class Options
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{j.classOptions}</p>
                    </div>

                    {/* Booking tips */}
                    <div className="bg-white rounded-xl p-4 border border-slate-100">
                      <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <span>💡</span> Booking Tips
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{j.bookingTips}</p>
                    </div>
                  </div>

                  {/* Quick facts bar */}
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">
                      📏 {j.distance}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">
                      ⏱️ {j.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">
                      💵 {j.costRange}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">
                      🌍 {j.country}
                    </span>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🚂</p>
          <p className="text-lg font-semibold text-slate-700">No journeys match your filters</p>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your continent or pick filters.</p>
        </div>
      )}

      {/* ── Summary Sections ── */}
      <section className="mt-16 space-y-12">
        {/* Best for Photography */}
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <span>📸</span> Best for Photography
          </h2>
          <p className="text-slate-600 mb-5">Journeys where the scenery alone justifies bringing your best camera gear.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {JOURNEYS.filter((j) => j.bestForPhotography).map((j) => (
              <div
                key={j.id}
                className="flex items-center gap-3 bg-pink-50 border border-pink-100 rounded-xl p-4 cursor-pointer hover:shadow-sm transition-shadow"
                onClick={() => { setExpandedId(j.id); setPick('all'); setContinent('All'); setSortBy('default'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                <span className="text-2xl">{j.emoji}</span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{j.name}</p>
                  <p className="text-xs text-slate-500">{j.country} &middot; {j.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Affordable */}
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <span>💰</span> Most Affordable
          </h2>
          <p className="text-slate-600 mb-5">Spectacular scenery that does not require a spectacular budget.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {JOURNEYS.filter((j) => j.mostAffordable).map((j) => (
              <div
                key={j.id}
                className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl p-4 cursor-pointer hover:shadow-sm transition-shadow"
                onClick={() => { setExpandedId(j.id); setPick('all'); setContinent('All'); setSortBy('default'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                <span className="text-2xl">{j.emoji}</span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{j.name}</p>
                  <p className="text-xs text-slate-500">{j.country} &middot; {j.costRange}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bucket List */}
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <span>🎯</span> Bucket List Picks
          </h2>
          <p className="text-slate-600 mb-5">The journeys that belong on every traveller&apos;s lifetime list.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {JOURNEYS.filter((j) => j.bucketList).map((j) => (
              <div
                key={j.id}
                className="flex items-center gap-3 bg-purple-50 border border-purple-100 rounded-xl p-4 cursor-pointer hover:shadow-sm transition-shadow"
                onClick={() => { setExpandedId(j.id); setPick('all'); setContinent('All'); setSortBy('default'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                <span className="text-2xl">{j.emoji}</span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{j.name}</p>
                  <p className="text-xs text-slate-500">{j.country} &middot; {j.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer note ── */}
      <footer className="mt-16 text-center border-t border-slate-100 pt-8 pb-4">
        <p className="text-sm text-slate-500">
          Prices and schedules are approximate and subject to change. Always check with the official operator before booking.
        </p>
        <p className="text-xs text-slate-400 mt-2">
          WorldTourly &mdash; Your trusted travel companion
        </p>
      </footer>
    </div>
  );
}
