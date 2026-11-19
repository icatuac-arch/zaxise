// WorldTourly — Destination data (modular index)

import { Country } from './types'
import { ASIA_COUNTRIES } from './countries/asia'
import { EUROPE_COUNTRIES } from './countries/europe'
import { AMERICAS_COUNTRIES } from './countries/americas'
import { AFRICA_COUNTRIES } from './countries/africa'
import { OCEANIA_COUNTRIES } from './countries/oceania'
import { MIDDLE_EAST_COUNTRIES } from './countries/middle-east'

export type { Attraction, Restaurant, City, State, Country } from './types'

export const COUNTRIES: Country[] = [
  ...ASIA_COUNTRIES,
  ...EUROPE_COUNTRIES,
  ...AMERICAS_COUNTRIES,
  ...AFRICA_COUNTRIES,
  ...OCEANIA_COUNTRIES,
  ...MIDDLE_EAST_COUNTRIES,
]
