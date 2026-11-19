'use client'

import { useState, useEffect } from 'react'
import { COUNTRY_IMAGES } from '@/data/travel/country-images'
import SearchBox from '@/components/travel/SearchBox'

// Map lat/lng to country slug for hero image lookup
// Order matters: smaller/more-specific countries BEFORE larger ones that overlap
function detectCountrySlug(lat: number, lng: number): string | null {
  // Small/specific countries first (so they don't get swallowed by neighbors)
  if (lat > 1 && lat < 2 && lng > 103 && lng < 104) return 'singapore'

  // Canada BEFORE USA (Toronto at lat 43 would match USA's box)
  if (lat > 41 && lat < 84 && lng > -141 && lng < -52) return 'canada'
  // USA (lower lat range to avoid Canada overlap)
  if (lat > 24 && lat < 50 && lng > -130 && lng < -60) return 'united-states'
  // Mexico
  if (lat > 14 && lat < 33 && lng > -118 && lng < -86) return 'mexico'

  // Europe — specific countries before broad regions
  if (lat > 49 && lat < 60 && lng > -8 && lng < 2) return 'united-kingdom'
  if (lat > 42 && lat < 51 && lng > -5 && lng < 8) return 'france'
  if (lat > 36 && lat < 47 && lng > 6 && lng < 19) return 'italy'
  if (lat > 36 && lat < 44 && lng > -10 && lng < 4) return 'spain'
  if (lat > 47 && lat < 55 && lng > 5 && lng < 16) return 'germany'
  if (lat > 50 && lat < 53 && lng > 3 && lng < 8) return 'netherlands'
  if (lat > 46 && lat < 48 && lng > 6 && lng < 11) return 'switzerland'
  if (lat > 36 && lat < 42 && lng > -10 && lng < -6) return 'portugal'
  if (lat > 35 && lat < 42 && lng > 19 && lng < 30) return 'greece'
  if (lat > 42 && lat < 46 && lng > 13 && lng < 20) return 'croatia'

  // Asia
  if (lat > 6 && lat < 36 && lng > 68 && lng < 98) return 'india'
  if (lat > 30 && lat < 46 && lng > 128 && lng < 146) return 'japan'
  if (lat > 33 && lat < 37 && lng > 124 && lng < 130) return 'south-korea'
  if (lat > 5 && lat < 21 && lng > 97 && lng < 106) return 'thailand'
  if (lat > 8 && lat < 22 && lng > 102 && lng < 110) return 'vietnam'
  if (lat > 1 && lat < 7 && lng > 100 && lng < 120) return 'malaysia'
  if (lat > -6 && lat < 6 && lng > 95 && lng < 141) return 'indonesia'
  if (lat > 18 && lat < 54 && lng > 73 && lng < 135) return 'china'

  // Middle East / Africa
  if (lat > 35 && lat < 42 && lng > 25 && lng < 45) return 'turkey'
  if (lat > 22 && lat < 32 && lng > 44 && lng < 56) return 'uae'
  if (lat > 22 && lat < 32 && lng > 25 && lng < 35) return 'egypt'
  if (lat > 27 && lat < 36 && lng > -14 && lng < -1) return 'morocco'

  // Oceania
  if (lat > -45 && lat < -10 && lng > 110 && lng < 155) return 'australia'
  if (lat > -48 && lat < -34 && lng > 165 && lng < 179) return 'new-zealand'

  // South America
  if (lat > -35 && lat < 6 && lng > -75 && lng < -34) return 'brazil'

  return null
}

interface SeasonContext {
  season: string
  mood: string
  gradient: string
  emoji: string
  tagline: string
  bgImage: string
  overlayColor: string
  textAccent: string
}

// Seasonal/event backgrounds from Unsplash
const SEASONAL_THEMES: Record<string, SeasonContext> = {
  // Weather-based
  spring: {
    season: 'Spring',
    mood: 'bloom',
    gradient: 'from-pink-500 via-rose-400 to-amber-400',
    emoji: '🌸',
    tagline: 'Spring is here — cherry blossoms, tulips, and perfect travel weather await',
    bgImage: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=1200&h=600&fit=crop',
    overlayColor: 'rgba(190, 50, 90, 0.55)',
    textAccent: 'from-pink-200 to-amber-200',
  },
  summer: {
    season: 'Summer',
    mood: 'sun',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    emoji: '☀️',
    tagline: 'Summer adventures are calling — beaches, mountains, and golden sunsets',
    bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=600&fit=crop',
    overlayColor: 'rgba(180, 80, 20, 0.5)',
    textAccent: 'from-amber-200 to-yellow-100',
  },
  autumn: {
    season: 'Autumn',
    mood: 'golden',
    gradient: 'from-orange-600 via-amber-600 to-yellow-500',
    emoji: '🍂',
    tagline: 'Autumn colors are peaking — the smartest season to travel',
    bgImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop',
    overlayColor: 'rgba(120, 60, 10, 0.55)',
    textAccent: 'from-amber-200 to-orange-200',
  },
  winter: {
    season: 'Winter',
    mood: 'cozy',
    gradient: 'from-sky-700 via-blue-800 to-indigo-900',
    emoji: '❄️',
    tagline: 'Winter wonderlands and warm escapes — where will you go?',
    bgImage: 'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=1200&h=600&fit=crop',
    overlayColor: 'rgba(20, 40, 80, 0.55)',
    textAccent: 'from-sky-200 to-white',
  },
  // Special events
  christmas: {
    season: 'Holiday Season',
    mood: 'festive',
    gradient: 'from-red-700 via-red-600 to-green-700',
    emoji: '🎄',
    tagline: 'Tis the season — discover the world\'s best holiday destinations',
    bgImage: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=1200&h=600&fit=crop',
    overlayColor: 'rgba(100, 20, 20, 0.6)',
    textAccent: 'from-red-200 to-green-200',
  },
  rainy: {
    season: 'Rainy Season',
    mood: 'moody',
    gradient: 'from-slate-700 via-gray-600 to-blue-800',
    emoji: '🌧️',
    tagline: 'Rainy day? Perfect time to plan your next sunny escape',
    bgImage: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1200&h=600&fit=crop',
    overlayColor: 'rgba(30, 40, 60, 0.6)',
    textAccent: 'from-slate-200 to-blue-200',
  },
  tropical: {
    season: 'Tropical',
    mood: 'paradise',
    gradient: 'from-teal-500 via-cyan-500 to-sky-500',
    emoji: '🌴',
    tagline: 'Paradise is closer than you think',
    bgImage: 'https://images.unsplash.com/photo-1559628233-100c798642d4?w=1200&h=600&fit=crop',
    overlayColor: 'rgba(10, 80, 80, 0.5)',
    textAccent: 'from-teal-200 to-cyan-100',
  },
  newyear: {
    season: 'Happy New Year!',
    mood: 'celebration',
    gradient: 'from-violet-700 via-purple-600 to-pink-600',
    emoji: '🎆',
    tagline: 'New year, new adventures — where will this year take you?',
    bgImage: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1200&h=600&fit=crop',
    overlayColor: 'rgba(50, 20, 80, 0.55)',
    textAccent: 'from-pink-200 to-violet-200',
  },
  cny: {
    season: 'Chinese New Year',
    mood: 'lunar',
    gradient: 'from-red-700 via-red-600 to-amber-600',
    emoji: '🧧',
    tagline: 'Lunar New Year celebrations — experience the most colorful festivals in Asia',
    bgImage: 'https://images.unsplash.com/photo-1517315003714-a071486bd9ea?w=1200&h=600&fit=crop',
    overlayColor: 'rgba(140, 20, 20, 0.55)',
    textAccent: 'from-red-200 to-amber-200',
  },
  valentine: {
    season: 'Season of Love',
    mood: 'romantic',
    gradient: 'from-rose-600 via-pink-500 to-red-500',
    emoji: '💕',
    tagline: 'The most romantic destinations for couples — plan your getaway',
    bgImage: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=1200&h=600&fit=crop',
    overlayColor: 'rgba(140, 40, 60, 0.5)',
    textAccent: 'from-rose-200 to-pink-100',
  },
  holi: {
    season: 'Holi — Festival of Colors',
    mood: 'colorful',
    gradient: 'from-fuchsia-600 via-purple-500 to-cyan-500',
    emoji: '🎨',
    tagline: 'India explodes in color — experience the most joyful festival on Earth',
    bgImage: 'https://images.unsplash.com/photo-1535350356005-fd52b3b524fb?w=1200&h=600&fit=crop',
    overlayColor: 'rgba(80, 20, 100, 0.5)',
    textAccent: 'from-fuchsia-200 to-cyan-200',
  },
  cherry: {
    season: 'Cherry Blossom Season',
    mood: 'sakura',
    gradient: 'from-pink-400 via-rose-300 to-pink-500',
    emoji: '🌸',
    tagline: 'Sakura season is here — Japan\'s most magical time of year',
    bgImage: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=1200&h=600&fit=crop',
    overlayColor: 'rgba(180, 80, 120, 0.45)',
    textAccent: 'from-pink-100 to-white',
  },
  songkran: {
    season: 'Songkran — Thai New Year',
    mood: 'water',
    gradient: 'from-sky-500 via-cyan-500 to-blue-600',
    emoji: '💦',
    tagline: 'The world\'s biggest water fight — Thailand celebrates its New Year',
    bgImage: 'https://images.unsplash.com/photo-1504276048855-f3d60e69632f?w=1200&h=600&fit=crop',
    overlayColor: 'rgba(20, 80, 120, 0.5)',
    textAccent: 'from-cyan-200 to-sky-100',
  },
  july4: {
    season: 'Independence Day',
    mood: 'patriotic',
    gradient: 'from-blue-800 via-red-600 to-blue-800',
    emoji: '🇺🇸',
    tagline: 'Happy 4th of July! Fireworks, barbecues, and all-American adventures',
    bgImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=600&fit=crop',
    overlayColor: 'rgba(20, 30, 80, 0.55)',
    textAccent: 'from-red-200 to-blue-200',
  },
  oktoberfest: {
    season: 'Oktoberfest',
    mood: 'bavarian',
    gradient: 'from-amber-600 via-yellow-600 to-orange-600',
    emoji: '🍺',
    tagline: 'Prost! Experience the world\'s largest folk festival in Munich',
    bgImage: 'https://images.unsplash.com/photo-1505489435671-80a165c60816?w=1200&h=600&fit=crop',
    overlayColor: 'rgba(100, 60, 10, 0.55)',
    textAccent: 'from-amber-200 to-yellow-100',
  },
  diwali: {
    season: 'Diwali — Festival of Lights',
    mood: 'illuminated',
    gradient: 'from-amber-600 via-orange-500 to-yellow-500',
    emoji: '🪔',
    tagline: 'India glows with a billion lights — experience the most beautiful festival season',
    bgImage: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1200&h=600&fit=crop',
    overlayColor: 'rgba(120, 60, 10, 0.5)',
    textAccent: 'from-amber-200 to-yellow-100',
  },
  thanksgiving: {
    season: 'Thanksgiving',
    mood: 'grateful',
    gradient: 'from-orange-700 via-amber-600 to-yellow-600',
    emoji: '🦃',
    tagline: 'Giving thanks and planning adventures — the holiday travel season is here',
    bgImage: 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=1200&h=600&fit=crop',
    overlayColor: 'rgba(100, 50, 10, 0.55)',
    textAccent: 'from-orange-200 to-amber-100',
  },
  snow: {
    season: 'Snow Season',
    mood: 'frozen',
    gradient: 'from-blue-200 via-slate-300 to-white',
    emoji: '🏔️',
    tagline: 'Snowy landscapes and cozy retreats — embrace the cold',
    bgImage: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1200&h=600&fit=crop',
    overlayColor: 'rgba(40, 60, 90, 0.4)',
    textAccent: 'from-white to-blue-100',
  },
}

// Geo-fenced events — ONLY show if user is actually IN or NEAR the relevant region
function getSpecialEvent(month: number, day: number, lat: number, lng: number): string | null {
  const inUSA = lat > 24 && lat < 50 && lng > -130 && lng < -60
  const inIndia = lat > 6 && lat < 36 && lng > 68 && lng < 98
  const inJapan = lat > 30 && lat < 46 && lng > 128 && lng < 146
  const inChina = lat > 18 && lat < 54 && lng > 73 && lng < 135
  const inSEAsia = lat > -10 && lat < 25 && lng > 95 && lng < 142
  const inThailand = lat > 5 && lat < 21 && lng > 97 && lng < 106
  const inGermany = lat > 47 && lat < 55 && lng > 5 && lng < 16
  const inEurope = lat > 35 && lat < 72 && lng > -10 && lng < 40
  // inMiddleEast reserved for future Ramadan/Eid geo-fencing
  const inAustralia = lat > -45 && lat < -10 && lng > 110 && lng < 155

  // === TRULY GLOBAL (everyone celebrates) ===
  // New Year's (Dec 31 - Jan 2) — universal
  if ((month === 11 && day >= 31) || (month === 0 && day <= 1)) return 'newyear'

  // === GEO-FENCED: Only in the relevant country/region ===

  // India-specific
  if (inIndia) {
    if (month === 2 && day >= 5 && day <= 20) return 'holi'           // Holi (March)
    if (month === 9 && day >= 15 || month === 10 && day <= 10) return 'diwali'  // Diwali (Oct-Nov)
  }

  // USA-specific
  if (inUSA) {
    if (month === 6 && day >= 2 && day <= 5) return 'july4'           // 4th of July
    if (month === 10 && day >= 22 && day <= 28) return 'thanksgiving' // Thanksgiving
    if (month === 11 && day >= 15 && day <= 26) return 'christmas'    // Christmas
  }

  // Japan-specific
  if (inJapan) {
    if (month === 2 && day >= 20 || month === 3 && day <= 15) return 'cherry'  // Cherry blossom
  }

  // China / East Asia
  if (inChina || inSEAsia) {
    if (month === 0 && day >= 20 || month === 1 && day <= 10) return 'cny'     // Chinese New Year
  }

  // Thailand
  if (inThailand) {
    if (month === 3 && day >= 12 && day <= 16) return 'songkran'      // Songkran water festival
  }

  // Germany
  if (inGermany) {
    if ((month === 8 && day >= 17) || (month === 9 && day <= 7)) return 'oktoberfest'
  }

  // Europe-wide Christmas
  if (inEurope && month === 11 && day >= 10 && day <= 26) return 'christmas'

  // Valentine's — show in Western countries only
  if ((inUSA || inEurope || inAustralia) && month === 1 && day >= 13 && day <= 15) return 'valentine'

  // Middle East — no Christmas/Valentine, keep seasonal
  // Australia — reverse seasons handled by main function

  return null
}

function getSeasonForLocation(lat: number, month: number, day: number, lng: number, temp?: number): string {
  // Check for special events first
  const event = getSpecialEvent(month, day, lat, lng)
  if (event) return event

  const isNorthern = lat >= 0

  // Temperature-based overrides
  if (temp !== undefined) {
    if (temp < 0) return 'snow'
    if (temp > 33 && Math.abs(lat) < 15) return 'tropical'
  }

  // Latitude-based: tropical regions
  if (Math.abs(lat) < 15) return 'tropical'

  // Season by hemisphere
  if (isNorthern) {
    if (month >= 2 && month <= 4) return 'spring'
    if (month >= 5 && month <= 7) return 'summer'
    if (month >= 8 && month <= 10) return 'autumn'
    return 'winter'
  } else {
    if (month >= 2 && month <= 4) return 'autumn'
    if (month >= 5 && month <= 7) return 'winter'
    if (month >= 8 && month <= 10) return 'spring'
    return 'summer'
  }
}

// Country-specific local context — unique tagline and recommendation per country
// Keyed by approximate lat/lng bounding box → country-specific seasonal content
interface LocalContext {
  country: string
  getTagline: (month: number) => string
}

const COUNTRY_CONTEXTS: { minLat: number, maxLat: number, minLng: number, maxLng: number, ctx: LocalContext }[] = [
  // Asia
  { minLat: 30, maxLat: 46, minLng: 128, maxLng: 146, ctx: { country: 'Japan', getTagline: (m) => m >= 2 && m <= 3 ? 'Cherry blossom season is here — explore Japan\'s most magical time' : m >= 8 && m <= 10 ? 'Autumn foliage in Japan — golden temples and crimson leaves await' : m >= 5 && m <= 7 ? 'Summer festivals light up Japan — fireworks, yukatas, and matsuri' : 'Winter onsen and skiing in Japan — the cozy side of the Land of the Rising Sun' }},
  { minLat: 6, maxLat: 36, minLng: 68, maxLng: 98, ctx: { country: 'India', getTagline: (m) => m >= 9 && m <= 10 ? 'Festival season in India — Diwali lights, Navratri dances, and incredible energy' : m >= 2 && m <= 3 ? 'Holi colors and spring warmth — North India at its most vibrant' : m >= 4 && m <= 5 ? 'Beat the Indian summer — head to the hills or Kerala\'s backwaters' : m >= 6 && m <= 8 ? 'Monsoon magic in India — lush green landscapes and dramatic skies' : 'Perfect weather in India — the best season for Rajasthan, Goa, and Kerala' }},
  { minLat: 5, maxLat: 21, minLng: 97, maxLng: 106, ctx: { country: 'Thailand', getTagline: (m) => m >= 10 && m <= 1 ? 'Thailand\'s cool season — perfect beaches, temple visits, and street food' : m >= 3 && m <= 3 ? 'Songkran is coming — the world\'s biggest water fight starts April 13' : m >= 4 && m <= 9 ? 'Green season deals in Thailand — fewer crowds, lower prices, tropical beauty' : 'Island hopping season in Thailand — crystal clear waters await' }},
  { minLat: 18, maxLat: 54, minLng: 73, maxLng: 135, ctx: { country: 'China', getTagline: (m) => m >= 0 && m <= 1 ? 'Chinese New Year celebrations — the most colorful time in China' : m >= 2 && m <= 4 ? 'Spring blooms across China — cherry blossoms, rapeseed fields, and mild weather' : m >= 8 && m <= 10 ? 'Golden Week and autumn colors — China at its most beautiful' : 'Winter in China — ice festivals, hot pot, and the Great Wall in snow' }},
  { minLat: 33, maxLat: 39, minLng: 124, maxLng: 132, ctx: { country: 'South Korea', getTagline: (m) => m >= 2 && m <= 4 ? 'Cherry blossoms and spring vibes — Seoul is blooming' : m >= 8 && m <= 10 ? 'Autumn in Korea — stunning foliage and harvest festivals' : 'K-culture, Korean BBQ, and temple stays — discover South Korea' }},
  { minLat: 1, maxLat: 2, minLng: 103, maxLng: 104, ctx: { country: 'Singapore', getTagline: () => 'Year-round sunshine in Singapore — hawker food, gardens, and city magic' }},
  { minLat: -10, maxLat: 6, minLng: 95, maxLng: 141, ctx: { country: 'Indonesia', getTagline: (m) => m >= 4 && m <= 9 ? 'Dry season in Bali — perfect for temple visits, rice terraces, and beaches' : 'Bali\'s green season — fewer crowds, lush landscapes, great deals' }},
  { minLat: 1, maxLat: 8, minLng: 100, maxLng: 119, ctx: { country: 'Malaysia', getTagline: () => 'Tropical Malaysia — Petronas Towers, street food paradise, and island escapes' }},
  { minLat: 25, maxLat: 40, minLng: 50, maxLng: 60, ctx: { country: 'UAE', getTagline: (m) => m >= 10 && m <= 2 ? 'Dubai\'s perfect season — clear skies, outdoor dining, and desert adventures' : 'Dubai\'s indoor season — mega malls, aquariums, and air-conditioned luxury' }},
  { minLat: 26, maxLat: 30, minLng: 44, maxLng: 60, ctx: { country: 'Jordan', getTagline: () => 'Ancient Petra, the Dead Sea, and Wadi Rum — Jordan\'s timeless wonders' }},
  // Europe
  { minLat: 48, maxLat: 52, minLng: -6, maxLng: 2, ctx: { country: 'UK', getTagline: (m) => m >= 5 && m <= 7 ? 'British summer — long days, pub gardens, and countryside walks' : m === 11 ? 'Christmas markets and festive London — the most wonderful time' : 'London calling — rain or shine, there\'s always something extraordinary' }},
  { minLat: 42, maxLat: 51, minLng: -5, maxLng: 8, ctx: { country: 'France', getTagline: (m) => m >= 5 && m <= 8 ? 'French summer — lavender fields, riviera beaches, and café terraces' : m >= 2 && m <= 4 ? 'Springtime in Paris — the city of light at its most romantic' : m >= 8 && m <= 10 ? 'Autumn in France — wine harvest, golden light, fewer tourists' : 'Winter in France — Alps skiing, Christmas markets, cozy bistros' }},
  { minLat: 36, maxLat: 47, minLng: 6, maxLng: 19, ctx: { country: 'Italy', getTagline: (m) => m >= 3 && m <= 5 ? 'Spring in Italy — perfect weather, art, and gelato without summer crowds' : m >= 8 && m <= 10 ? 'Autumn in Italy — grape harvest, truffle season, and golden Tuscan light' : 'La dolce vita — Italy\'s timeless beauty awaits in every season' }},
  { minLat: 36, maxLat: 44, minLng: -10, maxLng: 5, ctx: { country: 'Spain', getTagline: (m) => m >= 5 && m <= 8 ? 'Spanish summer — beaches, tapas, and fiestas until midnight' : 'Flamenco, Gaudí, and paella — Spain sizzles in every season' }},
  { minLat: 47, maxLat: 55, minLng: 5, maxLng: 16, ctx: { country: 'Germany', getTagline: (m) => m >= 8 && m <= 9 ? 'Oktoberfest is coming — Bavaria\'s legendary beer festival awaits' : m === 11 ? 'German Christmas markets — mulled wine, gingerbread, and pure magic' : 'Castles, beer gardens, and vibrant cities — Germany surprises at every turn' }},
  { minLat: 51, maxLat: 54, minLng: 3, maxLng: 8, ctx: { country: 'Netherlands', getTagline: (m) => m >= 2 && m <= 4 ? 'Tulip season in the Netherlands — Keukenhof is in full bloom!' : 'Canals, bikes, and Vermeer — Amsterdam charm in any weather' }},
  { minLat: 45, maxLat: 48, minLng: 5, maxLng: 11, ctx: { country: 'Switzerland', getTagline: (m) => m >= 11 && m <= 2 ? 'Swiss Alps skiing — powder snow and fondue season' : 'Alpine lakes, chocolate, and mountain railways — Switzerland takes your breath away' }},
  { minLat: 63, maxLat: 67, minLng: -25, maxLng: -13, ctx: { country: 'Iceland', getTagline: (m) => m >= 9 && m <= 2 ? 'Northern Lights season in Iceland — chase the aurora across volcanic landscapes' : 'Midnight sun in Iceland — endless daylight for exploring waterfalls and glaciers' }},
  { minLat: 55, maxLat: 70, minLng: 4, maxLng: 32, ctx: { country: 'Scandinavia', getTagline: (m) => m >= 5 && m <= 7 ? 'Midnight sun in Scandinavia — endless summer days in the land of the Vikings' : m >= 10 && m <= 2 ? 'Northern Lights and hygge — Scandinavian winter magic' : 'Fjords, design, and ABBA — Scandinavia is calling' }},
  // Americas
  { minLat: 24, maxLat: 50, minLng: -130, maxLng: -60, ctx: { country: 'USA', getTagline: (m) => m >= 2 && m <= 4 ? 'Spring road trips — cherry blossoms in DC, wildflowers in Texas, baseball season starts' : m >= 5 && m <= 7 ? 'American summer — national parks, beach towns, and BBQ' : m >= 8 && m <= 10 ? 'Fall foliage and football — America\'s most photogenic season' : 'Holiday season in the USA — NYC lights, ski resorts, and warm fireplaces' }},
  { minLat: 42, maxLat: 84, minLng: -141, maxLng: -52, ctx: { country: 'Canada', getTagline: (m) => m >= 8 && m <= 9 ? 'Canadian fall — the most spectacular autumn colors on the planet' : m >= 11 && m <= 2 ? 'Winter wonderland in Canada — skiing, skating, and northern lights' : 'Maple syrup, mountains, and friendly locals — Oh, Canada!' }},
  { minLat: 14, maxLat: 33, minLng: -118, maxLng: -86, ctx: { country: 'Mexico', getTagline: (m) => m >= 9 && m <= 10 ? 'Día de los Muertos is coming — Mexico\'s most colorful celebration' : 'Tacos, temples, and turquoise waters — Mexico is pure magic' }},
  { minLat: -34, maxLat: 5, minLng: -74, maxLng: -35, ctx: { country: 'Brazil', getTagline: (m) => m === 1 || m === 0 ? 'Carnival is coming — Rio de Janeiro\'s biggest party of the year!' : 'Samba, beaches, and the Amazon — Brazil is larger than life' }},
  // Africa
  { minLat: -35, maxLat: -22, minLng: 16, maxLng: 33, ctx: { country: 'South Africa', getTagline: (m) => m >= 8 && m <= 10 ? 'Spring in South Africa — whale watching, wildflowers, and safari season' : 'Table Mountain, safari, and wine country — South Africa has it all' }},
  { minLat: -5, maxLat: 5, minLng: 33, maxLng: 42, ctx: { country: 'Kenya', getTagline: (m) => m >= 6 && m <= 9 ? 'The Great Migration is happening NOW — millions of wildebeest crossing the Masai Mara' : 'Safari, beaches, and the Rift Valley — Kenya is unforgettable' }},
  { minLat: 27, maxLat: 32, minLng: 24, maxLng: 37, ctx: { country: 'Egypt', getTagline: (m) => m >= 9 && m <= 3 ? 'Perfect season for Egypt — cool enough to explore pyramids and temples' : 'The Pyramids, the Nile, 5,000 years of wonder — Egypt is timeless' }},
  { minLat: 27, maxLat: 36, minLng: -13, maxLng: -1, ctx: { country: 'Morocco', getTagline: () => 'Souks, riads, and the Sahara — Morocco is a feast for all senses' }},
  // Oceania
  { minLat: -45, maxLat: -10, minLng: 110, maxLng: 155, ctx: { country: 'Australia', getTagline: (m) => m >= 11 && m <= 2 ? 'Aussie summer — beaches, BBQs, and the Great Barrier Reef' : m >= 5 && m <= 8 ? 'Winter escapes to tropical Queensland — warm while the south is cool' : 'G\'day! From Sydney Opera House to the Outback — Australia is epic' }},
  { minLat: -47, maxLat: -34, minLng: 166, maxLng: 179, ctx: { country: 'New Zealand', getTagline: (m) => m >= 11 && m <= 2 ? 'NZ summer — hiking, kayaking, and Middle Earth landscapes' : 'Kia ora! New Zealand — where every view is a screensaver' }},
  // South America
  { minLat: -56, maxLat: -22, minLng: -74, maxLng: -53, ctx: { country: 'Argentina', getTagline: (m) => m >= 2 && m <= 4 ? 'Autumn in Patagonia — golden forests and dramatic glaciers' : 'Tango, steak, and Patagonia — Argentina is passion personified' }},
  { minLat: -18, maxLat: 2, minLng: -82, maxLng: -67, ctx: { country: 'Peru', getTagline: () => 'Machu Picchu, ceviche, and the Sacred Valley — Peru is bucket-list magic' }},
  { minLat: 7, maxLat: 12, minLng: -77, maxLng: -72, ctx: { country: 'Colombia', getTagline: () => 'Cartagena\'s colorful streets, Caribbean beaches, and coffee country — Colombia surprises everyone' }},
  // Missing countries — completing full coverage
  { minLat: 46, maxLat: 49, minLng: 9, maxLng: 18, ctx: { country: 'Austria', getTagline: (m) => m >= 11 && m <= 2 ? 'Austrian Alps skiing and Vienna Christmas markets — winter magic' : m >= 5 && m <= 8 ? 'Sound of Music summer — Alpine meadows, lake swimming, and Viennese cafés' : 'Schönbrunn, strudel, and Strauss — Austria is elegance in every season' }},
  { minLat: 10, maxLat: 15, minLng: 102, maxLng: 108, ctx: { country: 'Cambodia', getTagline: (m) => m >= 10 && m <= 2 ? 'Dry season in Cambodia — perfect for exploring Angkor Wat at sunrise' : 'Angkor Wat, floating villages, and ancient temples — Cambodia is awe-inspiring' }},
  { minLat: 8, maxLat: 11, minLng: -85, maxLng: -82, ctx: { country: 'Costa Rica', getTagline: (m) => m >= 11 && m <= 3 ? 'Dry season in Costa Rica — volcanoes, rainforests, and perfect beaches' : 'Pura Vida! Costa Rica\'s cloud forests and wildlife are calling' }},
  { minLat: 42, maxLat: 47, minLng: 13, maxLng: 20, ctx: { country: 'Croatia', getTagline: (m) => m >= 5 && m <= 8 ? 'Croatian summer — Dubrovnik\'s walls, island hopping, and Adriatic sunsets' : 'Game of Thrones scenery and ancient cities — Croatia off-season is a hidden gem' }},
  { minLat: 19, maxLat: 24, minLng: -85, maxLng: -74, ctx: { country: 'Cuba', getTagline: () => 'Classic cars, salsa, and crumbling grandeur — Cuba is frozen in time' }},
  { minLat: 48, maxLat: 51, minLng: 12, maxLng: 19, ctx: { country: 'Czech Republic', getTagline: (m) => m >= 11 ? 'Prague Christmas markets — mulled wine and fairy-tale squares' : m >= 3 && m <= 5 ? 'Spring in Prague — blooming gardens, fewer tourists, perfect weather' : 'Prague\'s bridges, beer, and Bohemian charm — a city that enchants' }},
  { minLat: 54, maxLat: 58, minLng: 8, maxLng: 16, ctx: { country: 'Denmark', getTagline: (m) => m >= 5 && m <= 7 ? 'Danish summer — Tivoli Gardens, Nyhavn, and hygge outdoors' : m === 11 ? 'Copenhagen Christmas — Tivoli transforms into a winter wonderland' : 'Hygge capital of the world — Copenhagen\'s cozy cafés and design await' }},
  { minLat: -5, maxLat: 2, minLng: -81, maxLng: -75, ctx: { country: 'Ecuador', getTagline: () => 'Straddle the equator, hike volcanoes, and explore the Amazon — Ecuador packs it all in' }},
  { minLat: 59, maxLat: 70, minLng: 20, maxLng: 32, ctx: { country: 'Finland', getTagline: (m) => m >= 11 && m <= 2 ? 'Finnish Lapland — meet Santa, chase northern lights, and sleep in glass igloos' : m >= 5 && m <= 7 ? 'Midnight sun in Finland — endless summer days and lake district magic' : 'Saunas, design, and silence — Finland is the world\'s happiest country' }},
  { minLat: 34, maxLat: 42, minLng: 19, maxLng: 30, ctx: { country: 'Greece', getTagline: (m) => m >= 5 && m <= 9 ? 'Greek island season — turquoise waters, white villages, and mythology come alive' : 'Ancient Athens, olive groves, and Mediterranean sun — Greece is eternal' }},
  { minLat: 45, maxLat: 49, minLng: 16, maxLng: 23, ctx: { country: 'Hungary', getTagline: (m) => m >= 11 ? 'Budapest Christmas markets and thermal baths — winter at its coziest' : 'Ruin bars, thermal spas, and paprika — Budapest is Europe\'s hidden gem' }},
  { minLat: 51, maxLat: 56, minLng: -11, maxLng: -5, ctx: { country: 'Ireland', getTagline: (m) => m >= 4 && m <= 6 ? 'Ireland turns emerald green — the best time for cliff walks and pub crawls' : 'Guinness, green hills, and Celtic charm — Ireland warms every heart' }},
  { minLat: 29, maxLat: 34, minLng: 34, maxLng: 36, ctx: { country: 'Israel', getTagline: () => 'Jerusalem\'s ancient stones, Dead Sea floats, and Tel Aviv beaches — Israel is layers of history' }},
  { minLat: 17, maxLat: 19, minLng: -78, maxLng: -76, ctx: { country: 'Jamaica', getTagline: () => 'Reggae, jerk chicken, and turquoise waters — Jamaica is pure vibes, mon' }},
  { minLat: 13, maxLat: 23, minLng: 100, maxLng: 108, ctx: { country: 'Laos', getTagline: (m) => m >= 10 && m <= 2 ? 'Cool season in Laos — Kuang Si Falls, monks\' alms, and Mekong sunsets' : 'The most peaceful country in Southeast Asia — Laos moves at its own pace' }},
  { minLat: -1, maxLat: 5, minLng: 72, maxLng: 74, ctx: { country: 'Maldives', getTagline: (m) => m >= 11 && m <= 3 ? 'Dry season in the Maldives — crystal clear water and perfect diving' : 'Overwater bungalows, whale sharks, and the bluest water on Earth — the Maldives' }},
  { minLat: 9, maxLat: 22, minLng: 92, maxLng: 102, ctx: { country: 'Myanmar', getTagline: (m) => m >= 10 && m <= 2 ? 'Golden pagodas and cool weather — the best time to explore Myanmar' : 'Bagan\'s 2,000 temples at sunrise — Myanmar is unforgettable' }},
  { minLat: 26, maxLat: 31, minLng: 80, maxLng: 89, ctx: { country: 'Nepal', getTagline: (m) => m >= 9 && m <= 10 ? 'Trekking season in Nepal — clear Himalayan views and Dashain festivities' : m >= 2 && m <= 4 ? 'Spring in Nepal — rhododendrons bloom on the way to Everest Base Camp' : 'Namaste! Nepal — where the highest mountains meet the warmest people' }},
  { minLat: 57, maxLat: 72, minLng: 4, maxLng: 32, ctx: { country: 'Norway', getTagline: (m) => m >= 5 && m <= 7 ? 'Norwegian midnight sun — fjord cruises in 24-hour daylight' : m >= 10 && m <= 2 ? 'Northern Lights over the fjords — Norway\'s winter is otherworldly' : 'Fjords, Vikings, and dramatic coastlines — Norway takes your breath away' }},
  { minLat: 21, maxLat: 26, minLng: 51, maxLng: 60, ctx: { country: 'Oman', getTagline: (m) => m >= 10 && m <= 3 ? 'Cool season in Oman — wadis, forts, and desert nights under the stars' : 'Arabian Nights come alive — Oman is the Gulf\'s best-kept secret' }},
  { minLat: 7, maxLat: 10, minLng: -83, maxLng: -77, ctx: { country: 'Panama', getTagline: () => 'The Panama Canal, tropical rainforests, and Caribbean islands — a bridge between two worlds' }},
  { minLat: 4, maxLat: 21, minLng: 116, maxLng: 127, ctx: { country: 'Philippines', getTagline: (m) => m >= 11 && m <= 4 ? 'Dry season in the Philippines — perfect for island hopping and diving' : 'More fun in the Philippines — 7,000 islands of tropical paradise' }},
  { minLat: 49, maxLat: 55, minLng: 14, maxLng: 25, ctx: { country: 'Poland', getTagline: (m) => m >= 11 ? 'Polish Christmas traditions — pierogi, lights, and medieval market squares' : 'Kraków\'s charm, pierogi feasts, and Auschwitz\'s powerful lessons — Poland moves you deeply' }},
  { minLat: 36, maxLat: 42, minLng: -10, maxLng: -6, ctx: { country: 'Portugal', getTagline: (m) => m >= 4 && m <= 6 ? 'Lisbon\'s pastel streets, Porto\'s port wine, and Algarve beaches — Portugal in spring' : 'Pastéis de nata, fado music, and golden coastlines — Portugal is Europe\'s sunniest secret' }},
  { minLat: 43, maxLat: 48, minLng: 20, maxLng: 30, ctx: { country: 'Romania', getTagline: () => 'Dracula\'s castle, painted monasteries, and the last wild forests of Europe — Romania surprises' }},
  { minLat: 41, maxLat: 82, minLng: 19, maxLng: 180, ctx: { country: 'Russia', getTagline: (m) => m >= 5 && m <= 8 ? 'White nights in St. Petersburg — the city glows at midnight in summer' : 'Red Square, the Kremlin, and the Trans-Siberian — Russia is epic in scale' }},
  { minLat: 5, maxLat: 10, minLng: 79, maxLng: 82, ctx: { country: 'Sri Lanka', getTagline: (m) => m >= 11 && m <= 3 ? 'Dry season on Sri Lanka\'s west coast — temples, tea, and tropical beaches' : 'The teardrop of India — Sri Lanka packs a continent into an island' }},
  { minLat: 56, maxLat: 69, minLng: 11, maxLng: 25, ctx: { country: 'Sweden', getTagline: (m) => m >= 5 && m <= 7 ? 'Swedish midsummer — flower crowns, midnight sun, and archipelago sailing' : 'ABBA, design, and fika — Sweden\'s cozy charm in every season' }},
  { minLat: 30, maxLat: 37, minLng: 7, maxLng: 12, ctx: { country: 'Tunisia', getTagline: () => 'Star Wars deserts, ancient Carthage, and Mediterranean beaches — Tunisia is Africa\'s hidden gem' }},
  { minLat: 36, maxLat: 42, minLng: 26, maxLng: 45, ctx: { country: 'Turkey', getTagline: (m) => m >= 3 && m <= 5 ? 'Tulip season in Istanbul and Cappadocia balloon rides — Turkey in spring' : m >= 8 && m <= 10 ? 'Turkish autumn — warm seas, fewer crowds, and golden mosque light' : 'Where East meets West — Istanbul\'s bazaars, Cappadocia\'s caves, and Aegean coasts' }},
  { minLat: 8, maxLat: 24, minLng: 102, maxLng: 110, ctx: { country: 'Vietnam', getTagline: (m) => m >= 1 && m <= 3 ? 'Tết celebrations and spring warmth — Vietnam\'s most festive time' : m >= 8 && m <= 10 ? 'Halong Bay, phở, and motorbike adventures — Vietnam in autumn' : 'From Hanoi\'s Old Quarter to Hoi An\'s lanterns — Vietnam is addictive' }},
  { minLat: -10, maxLat: -1, minLng: 29, maxLng: 41, ctx: { country: 'Tanzania', getTagline: (m) => m >= 5 && m <= 7 ? 'Wildebeest calving season and Kilimanjaro climbing weather — Tanzania calls' : 'Serengeti, Kilimanjaro, and Zanzibar — Tanzania is Africa at its most dramatic' }},
]

function getLocalContext(lat: number, lng: number, month: number): { tagline: string, country: string } | null {
  for (const entry of COUNTRY_CONTEXTS) {
    if (lat >= entry.minLat && lat <= entry.maxLat && lng >= entry.minLng && lng <= entry.maxLng) {
      return {
        tagline: entry.ctx.getTagline(month),
        country: entry.ctx.country,
      }
    }
  }
  return null
}

const DEBUG_CITIES: { label: string; lat: number; lng: number }[] = [
  { label: 'New York, USA', lat: 40.7128, lng: -73.9352 },
  { label: 'London, UK', lat: 51.5074, lng: -0.1278 },
  { label: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
  { label: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
  { label: 'Mumbai, India', lat: 19.076, lng: 72.8777 },
  { label: 'Paris, France', lat: 48.8566, lng: 2.3522 },
  { label: 'Bangkok, Thailand', lat: 13.7563, lng: 100.5018 },
  { label: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
  { label: 'Nairobi, Kenya', lat: -1.2921, lng: 36.8219 },
  { label: 'Sao Paulo, Brazil', lat: -23.5505, lng: -46.6333 },
  { label: 'Reykjavik, Iceland', lat: 64.1466, lng: -21.9426 },
  { label: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { label: 'Cape Town, South Africa', lat: -33.9249, lng: 18.4241 },
  { label: 'Munich, Germany', lat: 48.1351, lng: 11.582 },
]

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

interface DebugOverride {
  lat?: number
  lng?: number
  month?: number // 0-11
  cityLabel?: string
}

function loadDebugOverride(): DebugOverride | null {
  if (typeof window === 'undefined') return null
  try {
    // Check shared LocationBar override first
    const shared = localStorage.getItem('worldtourly_location')
    if (shared) {
      const loc = JSON.parse(shared)
      if (loc.lat !== undefined && loc.lng !== undefined) {
        return { lat: loc.lat, lng: loc.lng, cityLabel: loc.label }
      }
    }
    // Fall back to old debug override
    const raw = localStorage.getItem('worldtourly_debug_override')
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function saveDebugOverride(override: DebugOverride | null) {
  if (typeof window === 'undefined') return
  if (override) {
    localStorage.setItem('worldtourly_debug_override', JSON.stringify(override))
  } else {
    localStorage.removeItem('worldtourly_debug_override')
  }
}

export default function SeasonalHero() {
  const [context, setContext] = useState<SeasonContext>(SEASONAL_THEMES.spring)
  const [localTagline, setLocalTagline] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [debugOpen, setDebugOpen] = useState(false)
  const [debugOverride, setDebugOverride] = useState<DebugOverride | null>(null)
  const [activeThemeKey, setActiveThemeKey] = useState<string>('spring')
  const [manualLat, setManualLat] = useState('')
  const [manualLng, setManualLng] = useState('')

  // Compute the season context from given params
  const computeContext = (lat: number, lng: number, month: number, day: number) => {
    const local = getLocalContext(lat, lng, month)
    if (local) setLocalTagline(local.tagline)
    else setLocalTagline(null)

    const season = getSeasonForLocation(lat, month, day, lng)
    setActiveThemeKey(season)
    const theme = { ...(SEASONAL_THEMES[season] || SEASONAL_THEMES.spring) }

    // Override bgImage with country-specific image if available
    const countrySlug = detectCountrySlug(lat, lng)
    if (countrySlug && COUNTRY_IMAGES[countrySlug]) {
      // Use the country image at hero resolution (1200x600)
      const countryImg = COUNTRY_IMAGES[countrySlug].replace(/w=\d+/, 'w=1200').replace(/h=\d+/, 'h=600')
      theme.bgImage = countryImg
    }

    setContext(theme)
    setLoaded(true)
  }

  // Apply a debug override
  const applyOverride = (override: DebugOverride | null) => {
    setDebugOverride(override)
    saveDebugOverride(override)

    if (override && override.lat !== undefined && override.lng !== undefined) {
      const now = new Date()
      const month = override.month !== undefined ? override.month : now.getMonth()
      const day = now.getDate()
      computeContext(override.lat, override.lng, month, day)
    }
  }

  const resetToAuto = () => {
    setDebugOverride(null)
    saveDebugOverride(null)
    setManualLat('')
    setManualLng('')
    // Re-trigger geolocation
    const now = new Date()
    const month = now.getMonth()
    const day = now.getDate()

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          computeContext(latitude, longitude, month, day)
        },
        () => {
          computeContext(40, -74, month, day)
        },
        { timeout: 3000 }
      )
    } else {
      computeContext(40, -74, month, day)
    }
  }

  useEffect(() => {
    const now = new Date()
    const month = now.getMonth()
    const day = now.getDate()

    // Check for saved debug override
    const saved = loadDebugOverride()
    if (saved && saved.lat !== undefined && saved.lng !== undefined) {
      setDebugOverride(saved)
      setManualLat(String(saved.lat))
      setManualLng(String(saved.lng))
      const m = saved.month !== undefined ? saved.month : month
      computeContext(saved.lat, saved.lng, m, day)
      return
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          computeContext(latitude, longitude, month, day)
        },
        () => {
          computeContext(40, -74, month, day)
        },
        { timeout: 3000 }
      )
    } else {
      computeContext(40, -74, month, day)
    }
  }, [])

  return (
    <section className="relative overflow-hidden min-h-[420px] sm:min-h-[480px]">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{
          backgroundImage: `url("${context.bgImage}")`,
          opacity: loaded ? 1 : 0,
        }}
      />
      {/* Color overlay */}
      <div className="absolute inset-0" style={{ background: context.overlayColor }} />
      {/* Fallback gradient (shows before image loads) */}
      <div className={`absolute inset-0 bg-gradient-to-br ${context.gradient} transition-opacity duration-1000`} style={{ opacity: loaded ? 0 : 1 }} />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <div className="text-center max-w-3xl mx-auto">
          {/* Season badge — shows local tagline if available, otherwise generic */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-white/20 max-w-2xl text-center leading-snug">
            <span className="text-lg shrink-0">{context.emoji}</span>
            {localTagline || context.tagline}
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            Discover the World&apos;s{' '}
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${context.textAccent}`}>
              Best Destinations
            </span>
          </h1>

          <p className="text-lg text-white/80 leading-relaxed mb-6 max-w-2xl mx-auto">
            Curated Top 10 lists, insider tips, and smart itineraries for 60+ countries.
            Your journey starts here.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 text-white/70 text-sm mb-8">
            <span className="font-semibold">60+ countries</span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span className="font-semibold">900+ attractions</span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span className="font-semibold">Free forever</span>
          </div>

          {/* Search */}
          <div className="max-w-lg mx-auto">
            <SearchBox
              placeholder="Where do you want to go? Try 'Japan', 'Paris', 'Rome'..."
              inputClassName="py-4 pl-12 text-base rounded-2xl bg-white/15 backdrop-blur-md text-white placeholder-white/50 border-white/25 focus:border-white/50 focus:bg-white/20 focus:ring-white/20"
            />
          </div>
        </div>
      </div>

      {/* Debug Panel */}
      <div className="fixed bottom-4 right-4 z-50">
        {debugOpen && (
          <div className="mb-2 bg-gray-900/95 backdrop-blur-sm text-white rounded-xl shadow-2xl border border-white/10 p-4 w-80 text-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-xs uppercase tracking-wider text-white/60">Season Debug</span>
              <button onClick={() => setDebugOpen(false)} className="text-white/40 hover:text-white text-lg leading-none">&times;</button>
            </div>

            {/* Current info */}
            <div className="bg-white/10 rounded-lg p-2.5 mb-3 space-y-1">
              <div className="flex justify-between">
                <span className="text-white/50">Theme:</span>
                <span className="font-mono">{activeThemeKey}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Season:</span>
                <span>{context.season} {context.emoji}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Tagline:</span>
                <span className="text-right text-xs max-w-[180px] truncate">{localTagline || context.tagline}</span>
              </div>
              {debugOverride && (
                <div className="flex justify-between">
                  <span className="text-white/50">Override:</span>
                  <span className="text-amber-300 text-xs">{debugOverride.cityLabel || `${debugOverride.lat}, ${debugOverride.lng}`}</span>
                </div>
              )}
            </div>

            {/* City dropdown */}
            <label className="block text-white/50 text-xs mb-1">City preset</label>
            <select
              className="w-full bg-white/10 border border-white/20 rounded-lg px-2.5 py-1.5 mb-3 text-white text-sm focus:outline-none focus:border-white/40"
              value={debugOverride?.cityLabel || ''}
              onChange={(e) => {
                const city = DEBUG_CITIES.find(c => c.label === e.target.value)
                if (city) {
                  setManualLat(String(city.lat))
                  setManualLng(String(city.lng))
                  applyOverride({ lat: city.lat, lng: city.lng, month: debugOverride?.month, cityLabel: city.label })
                }
              }}
            >
              <option value="">Select a city...</option>
              {DEBUG_CITIES.map(city => (
                <option key={city.label} value={city.label}>{city.label}</option>
              ))}
            </select>

            {/* Manual lat/lng */}
            <label className="block text-white/50 text-xs mb-1">Manual lat/lng</label>
            <div className="flex gap-2 mb-3">
              <input
                type="number"
                placeholder="Lat"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2.5 py-1.5 text-white text-sm focus:outline-none focus:border-white/40 placeholder:text-white/30"
              />
              <input
                type="number"
                placeholder="Lng"
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2.5 py-1.5 text-white text-sm focus:outline-none focus:border-white/40 placeholder:text-white/30"
              />
              <button
                onClick={() => {
                  const lat = parseFloat(manualLat)
                  const lng = parseFloat(manualLng)
                  if (!isNaN(lat) && !isNaN(lng)) {
                    applyOverride({ lat, lng, month: debugOverride?.month, cityLabel: undefined })
                  }
                }}
                className="bg-white/20 hover:bg-white/30 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors"
              >
                Go
              </button>
            </div>

            {/* Month override */}
            <label className="block text-white/50 text-xs mb-1">Month override</label>
            <select
              className="w-full bg-white/10 border border-white/20 rounded-lg px-2.5 py-1.5 mb-3 text-white text-sm focus:outline-none focus:border-white/40"
              value={debugOverride?.month !== undefined ? debugOverride.month : ''}
              onChange={(e) => {
                const val = e.target.value
                if (val === '') {
                  applyOverride(debugOverride ? { ...debugOverride, month: undefined } : null)
                } else {
                  const month = parseInt(val, 10)
                  const lat = debugOverride?.lat ?? 40
                  const lng = debugOverride?.lng ?? -74
                  applyOverride({ ...debugOverride, lat, lng, month })
                }
              }}
            >
              <option value="">Auto (current month)</option>
              {MONTH_NAMES.map((name, i) => (
                <option key={i} value={i}>{name}</option>
              ))}
            </select>

            {/* Reset */}
            <button
              onClick={resetToAuto}
              className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
            >
              Reset to Auto
            </button>
          </div>
        )}
        <button
          onClick={() => setDebugOpen(!debugOpen)}
          className="w-10 h-10 bg-gray-900/80 backdrop-blur-sm hover:bg-gray-900 text-white rounded-full shadow-lg border border-white/10 flex items-center justify-center text-lg transition-all hover:scale-110"
          title="Season debug panel"
        >
          🔧
        </button>
      </div>
    </section>
  )
}
