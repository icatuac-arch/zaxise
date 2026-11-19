// WorldTourly — Type definitions for destination data model

export interface Attraction {
  id: string
  name: string
  description: string
  category: 'landmark' | 'museum' | 'nature' | 'temple' | 'beach' | 'market' | 'park' | 'historic' | 'entertainment' | 'viewpoint'
  bestTimeToVisit: string
  visitDuration: { rush: string; noRush: string }
  entryFee: string
  accessibilityRating: 'fully' | 'partial' | 'limited'
  lat: number
  lng: number
  cityRank: number
  stateRank: number | null
  countryRank: number | null
  tags: string[]
  seasonalNote?: string
  photoTip?: string
  familyFriendly: boolean
  imageUrl?: string
}

export interface Restaurant {
  name: string
  cuisine: string
  priceRange: '$' | '$$' | '$$$' | '$$$$'
  specialty: string
  vegetarianFriendly: boolean
  veganOptions: boolean
  halalCertified: boolean
}

export interface City {
  id: string
  name: string
  stateId: string
  countryId: string
  description: string
  lat: number
  lng: number
  population: string
  bestSeason: string
  avgBudgetPerDay: { backpacker: string; midRange: string; comfort: string }
  language: string[]
  currency: string
  safetyRating: 'low' | 'moderate' | 'high'
  timezone: string
  attractions: Attraction[]
  restaurants: Restaurant[]
  weather: { month: string; tempHigh: number; tempLow: number; rainfall: number; description: string }[]
  transport: { type: string; description: string; cost: string }[]
  stays: { tier: string; recommendation: string; area: string; priceRange: string }[]
  itineraries: { days: number; title: string; dayPlans: { day: number; morning: string; afternoon: string; evening: string }[] }[]
}

export interface State {
  id: string
  name: string
  countryId: string
  description: string
  cities: City[]
}

export interface Country {
  id: string
  name: string
  slug: string
  flag: string
  continent: string
  capital: string
  description: string
  tagline: string
  language: string[]
  currency: { name: string; code: string; symbol: string }
  visaInfo: { passport: string; requirement: string; cost: string; duration: string }[]
  safetyRating: 'low' | 'moderate' | 'high'
  bestTimeToVisit: string
  states: State[]
  etiquette: string[]
  emergencyNumbers: { service: string; number: string }[]
}
