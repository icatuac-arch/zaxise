'use client'

import { useState, useEffect, useMemo } from 'react'
import { Sun, Moon, Search, Globe, Clock, MapPin } from 'lucide-react'
import { MAP_PATH_DATA, MAP_DOT_DATA } from './map-data'
import AdBanner from '@/components/time/AdBanner';

// ─── City Data Interface ─────────────────────────────────────
interface City {
  name: string
  country: string
  timezone: string
  utcOffset: string
  offsetMinutes: number
  lat: number
  lng: number
  region: 'North America' | 'South America' | 'Europe' | 'Africa' | 'Middle East' | 'South Asia' | 'Central Asia' | 'East Asia' | 'Southeast Asia' | 'Oceania & Pacific'
  flag: string
}

// ─── Complete City Database — Every UTC offset covered ───────
const CITIES: City[] = [
  // UTC-12
  { name: 'Baker Island', country: 'US Minor Outlying Islands', timezone: 'Etc/GMT+12', utcOffset: 'UTC-12', offsetMinutes: -720, lat: 0.19, lng: -176.48, region: 'Oceania & Pacific', flag: '\u{1F1FA}\u{1F1F2}' },

  // UTC-11
  { name: 'Pago Pago', country: 'American Samoa', timezone: 'Pacific/Pago_Pago', utcOffset: 'UTC-11', offsetMinutes: -660, lat: -14.28, lng: -170.70, region: 'Oceania & Pacific', flag: '\u{1F1E6}\u{1F1F8}' },
  { name: 'Midway Island', country: 'US Minor Outlying Islands', timezone: 'Pacific/Midway', utcOffset: 'UTC-11', offsetMinutes: -660, lat: 28.21, lng: -177.37, region: 'Oceania & Pacific', flag: '\u{1F1FA}\u{1F1F2}' },

  // UTC-10
  { name: 'Honolulu', country: 'United States', timezone: 'Pacific/Honolulu', utcOffset: 'UTC-10', offsetMinutes: -600, lat: 21.31, lng: -157.86, region: 'North America', flag: '\u{1F1FA}\u{1F1F8}' },
  { name: 'Rarotonga', country: 'Cook Islands', timezone: 'Pacific/Rarotonga', utcOffset: 'UTC-10', offsetMinutes: -600, lat: -21.23, lng: -159.78, region: 'Oceania & Pacific', flag: '\u{1F1E8}\u{1F1F0}' },

  // UTC-9:30
  { name: 'Marquesas Islands', country: 'French Polynesia', timezone: 'Pacific/Marquesas', utcOffset: 'UTC-9:30', offsetMinutes: -570, lat: -9.00, lng: -139.50, region: 'Oceania & Pacific', flag: '\u{1F1F5}\u{1F1EB}' },

  // UTC-9
  { name: 'Anchorage', country: 'United States', timezone: 'America/Anchorage', utcOffset: 'UTC-9', offsetMinutes: -540, lat: 61.22, lng: -149.90, region: 'North America', flag: '\u{1F1FA}\u{1F1F8}' },
  { name: 'Juneau', country: 'United States', timezone: 'America/Juneau', utcOffset: 'UTC-9', offsetMinutes: -540, lat: 58.30, lng: -134.42, region: 'North America', flag: '\u{1F1FA}\u{1F1F8}' },

  // UTC-8
  { name: 'Los Angeles', country: 'United States', timezone: 'America/Los_Angeles', utcOffset: 'UTC-8', offsetMinutes: -480, lat: 34.05, lng: -118.24, region: 'North America', flag: '\u{1F1FA}\u{1F1F8}' },
  { name: 'San Francisco', country: 'United States', timezone: 'America/Los_Angeles', utcOffset: 'UTC-8', offsetMinutes: -480, lat: 37.77, lng: -122.42, region: 'North America', flag: '\u{1F1FA}\u{1F1F8}' },
  { name: 'Seattle', country: 'United States', timezone: 'America/Los_Angeles', utcOffset: 'UTC-8', offsetMinutes: -480, lat: 47.61, lng: -122.33, region: 'North America', flag: '\u{1F1FA}\u{1F1F8}' },
  { name: 'Tijuana', country: 'Mexico', timezone: 'America/Tijuana', utcOffset: 'UTC-8', offsetMinutes: -480, lat: 32.51, lng: -117.02, region: 'North America', flag: '\u{1F1F2}\u{1F1FD}' },
  { name: 'Vancouver', country: 'Canada', timezone: 'America/Vancouver', utcOffset: 'UTC-8', offsetMinutes: -480, lat: 49.28, lng: -123.12, region: 'North America', flag: '\u{1F1E8}\u{1F1E6}' },

  // UTC-7
  { name: 'Denver', country: 'United States', timezone: 'America/Denver', utcOffset: 'UTC-7', offsetMinutes: -420, lat: 39.74, lng: -104.99, region: 'North America', flag: '\u{1F1FA}\u{1F1F8}' },
  { name: 'Edmonton', country: 'Canada', timezone: 'America/Edmonton', utcOffset: 'UTC-7', offsetMinutes: -420, lat: 53.54, lng: -113.49, region: 'North America', flag: '\u{1F1E8}\u{1F1E6}' },
  { name: 'Phoenix', country: 'United States', timezone: 'America/Phoenix', utcOffset: 'UTC-7', offsetMinutes: -420, lat: 33.45, lng: -112.07, region: 'North America', flag: '\u{1F1FA}\u{1F1F8}' },
  { name: 'Salt Lake City', country: 'United States', timezone: 'America/Denver', utcOffset: 'UTC-7', offsetMinutes: -420, lat: 40.76, lng: -111.89, region: 'North America', flag: '\u{1F1FA}\u{1F1F8}' },

  // UTC-6
  { name: 'Chicago', country: 'United States', timezone: 'America/Chicago', utcOffset: 'UTC-6', offsetMinutes: -360, lat: 41.88, lng: -87.63, region: 'North America', flag: '\u{1F1FA}\u{1F1F8}' },
  { name: 'Dallas', country: 'United States', timezone: 'America/Chicago', utcOffset: 'UTC-6', offsetMinutes: -360, lat: 32.78, lng: -96.80, region: 'North America', flag: '\u{1F1FA}\u{1F1F8}' },
  { name: 'Guatemala City', country: 'Guatemala', timezone: 'America/Guatemala', utcOffset: 'UTC-6', offsetMinutes: -360, lat: 14.63, lng: -90.51, region: 'North America', flag: '\u{1F1EC}\u{1F1F9}' },
  { name: 'Houston', country: 'United States', timezone: 'America/Chicago', utcOffset: 'UTC-6', offsetMinutes: -360, lat: 29.76, lng: -95.37, region: 'North America', flag: '\u{1F1FA}\u{1F1F8}' },
  { name: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City', utcOffset: 'UTC-6', offsetMinutes: -360, lat: 19.43, lng: -99.13, region: 'North America', flag: '\u{1F1F2}\u{1F1FD}' },
  { name: 'San Salvador', country: 'El Salvador', timezone: 'America/El_Salvador', utcOffset: 'UTC-6', offsetMinutes: -360, lat: 13.69, lng: -89.22, region: 'North America', flag: '\u{1F1F8}\u{1F1FB}' },
  { name: 'Tegucigalpa', country: 'Honduras', timezone: 'America/Tegucigalpa', utcOffset: 'UTC-6', offsetMinutes: -360, lat: 14.07, lng: -87.21, region: 'North America', flag: '\u{1F1ED}\u{1F1F3}' },
  { name: 'Winnipeg', country: 'Canada', timezone: 'America/Winnipeg', utcOffset: 'UTC-6', offsetMinutes: -360, lat: 49.90, lng: -97.14, region: 'North America', flag: '\u{1F1E8}\u{1F1E6}' },

  // UTC-5
  { name: 'Bogota', country: 'Colombia', timezone: 'America/Bogota', utcOffset: 'UTC-5', offsetMinutes: -300, lat: 4.71, lng: -74.07, region: 'South America', flag: '\u{1F1E8}\u{1F1F4}' },
  { name: 'Havana', country: 'Cuba', timezone: 'America/Havana', utcOffset: 'UTC-5', offsetMinutes: -300, lat: 23.11, lng: -82.37, region: 'North America', flag: '\u{1F1E8}\u{1F1FA}' },
  { name: 'Kingston', country: 'Jamaica', timezone: 'America/Jamaica', utcOffset: 'UTC-5', offsetMinutes: -300, lat: 18.00, lng: -76.79, region: 'North America', flag: '\u{1F1EF}\u{1F1F2}' },
  { name: 'Lima', country: 'Peru', timezone: 'America/Lima', utcOffset: 'UTC-5', offsetMinutes: -300, lat: -12.05, lng: -77.04, region: 'South America', flag: '\u{1F1F5}\u{1F1EA}' },
  { name: 'Miami', country: 'United States', timezone: 'America/New_York', utcOffset: 'UTC-5', offsetMinutes: -300, lat: 25.76, lng: -80.19, region: 'North America', flag: '\u{1F1FA}\u{1F1F8}' },
  { name: 'New York', country: 'United States', timezone: 'America/New_York', utcOffset: 'UTC-5', offsetMinutes: -300, lat: 40.71, lng: -74.01, region: 'North America', flag: '\u{1F1FA}\u{1F1F8}' },
  { name: 'Panama City', country: 'Panama', timezone: 'America/Panama', utcOffset: 'UTC-5', offsetMinutes: -300, lat: 8.98, lng: -79.52, region: 'North America', flag: '\u{1F1F5}\u{1F1E6}' },
  { name: 'Quito', country: 'Ecuador', timezone: 'America/Guayaquil', utcOffset: 'UTC-5', offsetMinutes: -300, lat: -0.18, lng: -78.47, region: 'South America', flag: '\u{1F1EA}\u{1F1E8}' },
  { name: 'Toronto', country: 'Canada', timezone: 'America/Toronto', utcOffset: 'UTC-5', offsetMinutes: -300, lat: 43.65, lng: -79.38, region: 'North America', flag: '\u{1F1E8}\u{1F1E6}' },
  { name: 'Washington DC', country: 'United States', timezone: 'America/New_York', utcOffset: 'UTC-5', offsetMinutes: -300, lat: 38.91, lng: -77.04, region: 'North America', flag: '\u{1F1FA}\u{1F1F8}' },

  // UTC-4
  { name: 'Caracas', country: 'Venezuela', timezone: 'America/Caracas', utcOffset: 'UTC-4', offsetMinutes: -240, lat: 10.49, lng: -66.88, region: 'South America', flag: '\u{1F1FB}\u{1F1EA}' },
  { name: 'Georgetown', country: 'Guyana', timezone: 'America/Guyana', utcOffset: 'UTC-4', offsetMinutes: -240, lat: 6.80, lng: -58.16, region: 'South America', flag: '\u{1F1EC}\u{1F1FE}' },
  { name: 'Halifax', country: 'Canada', timezone: 'America/Halifax', utcOffset: 'UTC-4', offsetMinutes: -240, lat: 44.65, lng: -63.57, region: 'North America', flag: '\u{1F1E8}\u{1F1E6}' },
  { name: 'La Paz', country: 'Bolivia', timezone: 'America/La_Paz', utcOffset: 'UTC-4', offsetMinutes: -240, lat: -16.50, lng: -68.15, region: 'South America', flag: '\u{1F1E7}\u{1F1F4}' },
  { name: 'Santiago', country: 'Chile', timezone: 'America/Santiago', utcOffset: 'UTC-4', offsetMinutes: -240, lat: -33.45, lng: -70.67, region: 'South America', flag: '\u{1F1E8}\u{1F1F1}' },
  { name: 'Santo Domingo', country: 'Dominican Republic', timezone: 'America/Santo_Domingo', utcOffset: 'UTC-4', offsetMinutes: -240, lat: 18.47, lng: -69.90, region: 'North America', flag: '\u{1F1E9}\u{1F1F4}' },

  // UTC-3:30
  { name: "St. John's", country: 'Canada', timezone: 'America/St_Johns', utcOffset: 'UTC-3:30', offsetMinutes: -210, lat: 47.56, lng: -52.71, region: 'North America', flag: '\u{1F1E8}\u{1F1E6}' },

  // UTC-3
  { name: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires', utcOffset: 'UTC-3', offsetMinutes: -180, lat: -34.60, lng: -58.38, region: 'South America', flag: '\u{1F1E6}\u{1F1F7}' },
  { name: 'Montevideo', country: 'Uruguay', timezone: 'America/Montevideo', utcOffset: 'UTC-3', offsetMinutes: -180, lat: -34.88, lng: -56.16, region: 'South America', flag: '\u{1F1FA}\u{1F1FE}' },
  { name: 'Sao Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', utcOffset: 'UTC-3', offsetMinutes: -180, lat: -23.55, lng: -46.63, region: 'South America', flag: '\u{1F1E7}\u{1F1F7}' },
  { name: 'Rio de Janeiro', country: 'Brazil', timezone: 'America/Sao_Paulo', utcOffset: 'UTC-3', offsetMinutes: -180, lat: -22.91, lng: -43.17, region: 'South America', flag: '\u{1F1E7}\u{1F1F7}' },
  { name: 'Paramaribo', country: 'Suriname', timezone: 'America/Paramaribo', utcOffset: 'UTC-3', offsetMinutes: -180, lat: 5.85, lng: -55.20, region: 'South America', flag: '\u{1F1F8}\u{1F1F7}' },

  // UTC-2
  { name: 'Fernando de Noronha', country: 'Brazil', timezone: 'America/Noronha', utcOffset: 'UTC-2', offsetMinutes: -120, lat: -3.85, lng: -32.42, region: 'South America', flag: '\u{1F1E7}\u{1F1F7}' },
  { name: 'South Georgia', country: 'UK Overseas Territory', timezone: 'Atlantic/South_Georgia', utcOffset: 'UTC-2', offsetMinutes: -120, lat: -54.25, lng: -36.75, region: 'South America', flag: '\u{1F1EC}\u{1F1F8}' },

  // UTC-1
  { name: 'Azores', country: 'Portugal', timezone: 'Atlantic/Azores', utcOffset: 'UTC-1', offsetMinutes: -60, lat: 38.72, lng: -27.22, region: 'Europe', flag: '\u{1F1F5}\u{1F1F9}' },
  { name: 'Cape Verde', country: 'Cape Verde', timezone: 'Atlantic/Cape_Verde', utcOffset: 'UTC-1', offsetMinutes: -60, lat: 14.93, lng: -23.51, region: 'Africa', flag: '\u{1F1E8}\u{1F1FB}' },

  // UTC+0
  { name: 'Accra', country: 'Ghana', timezone: 'Africa/Accra', utcOffset: 'UTC+0', offsetMinutes: 0, lat: 5.56, lng: -0.19, region: 'Africa', flag: '\u{1F1EC}\u{1F1ED}' },
  { name: 'Casablanca', country: 'Morocco', timezone: 'Africa/Casablanca', utcOffset: 'UTC+0', offsetMinutes: 0, lat: 33.57, lng: -7.59, region: 'Africa', flag: '\u{1F1F2}\u{1F1E6}' },
  { name: 'Dakar', country: 'Senegal', timezone: 'Africa/Dakar', utcOffset: 'UTC+0', offsetMinutes: 0, lat: 14.69, lng: -17.44, region: 'Africa', flag: '\u{1F1F8}\u{1F1F3}' },
  { name: 'Dublin', country: 'Ireland', timezone: 'Europe/Dublin', utcOffset: 'UTC+0', offsetMinutes: 0, lat: 53.35, lng: -6.26, region: 'Europe', flag: '\u{1F1EE}\u{1F1EA}' },
  { name: 'Lisbon', country: 'Portugal', timezone: 'Europe/Lisbon', utcOffset: 'UTC+0', offsetMinutes: 0, lat: 38.72, lng: -9.14, region: 'Europe', flag: '\u{1F1F5}\u{1F1F9}' },
  { name: 'London', country: 'United Kingdom', timezone: 'Europe/London', utcOffset: 'UTC+0', offsetMinutes: 0, lat: 51.51, lng: -0.13, region: 'Europe', flag: '\u{1F1EC}\u{1F1E7}' },
  { name: 'Monrovia', country: 'Liberia', timezone: 'Africa/Monrovia', utcOffset: 'UTC+0', offsetMinutes: 0, lat: 6.30, lng: -10.80, region: 'Africa', flag: '\u{1F1F1}\u{1F1F7}' },
  { name: 'Reykjavik', country: 'Iceland', timezone: 'Atlantic/Reykjavik', utcOffset: 'UTC+0', offsetMinutes: 0, lat: 64.15, lng: -21.94, region: 'Europe', flag: '\u{1F1EE}\u{1F1F8}' },

  // UTC+1
  { name: 'Algiers', country: 'Algeria', timezone: 'Africa/Algiers', utcOffset: 'UTC+1', offsetMinutes: 60, lat: 36.75, lng: 3.04, region: 'Africa', flag: '\u{1F1E9}\u{1F1FF}' },
  { name: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam', utcOffset: 'UTC+1', offsetMinutes: 60, lat: 52.37, lng: 4.90, region: 'Europe', flag: '\u{1F1F3}\u{1F1F1}' },
  { name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', utcOffset: 'UTC+1', offsetMinutes: 60, lat: 52.52, lng: 13.41, region: 'Europe', flag: '\u{1F1E9}\u{1F1EA}' },
  { name: 'Brussels', country: 'Belgium', timezone: 'Europe/Brussels', utcOffset: 'UTC+1', offsetMinutes: 60, lat: 50.85, lng: 4.35, region: 'Europe', flag: '\u{1F1E7}\u{1F1EA}' },
  { name: 'Copenhagen', country: 'Denmark', timezone: 'Europe/Copenhagen', utcOffset: 'UTC+1', offsetMinutes: 60, lat: 55.68, lng: 12.57, region: 'Europe', flag: '\u{1F1E9}\u{1F1F0}' },
  { name: 'Lagos', country: 'Nigeria', timezone: 'Africa/Lagos', utcOffset: 'UTC+1', offsetMinutes: 60, lat: 6.45, lng: 3.40, region: 'Africa', flag: '\u{1F1F3}\u{1F1EC}' },
  { name: 'Luanda', country: 'Angola', timezone: 'Africa/Luanda', utcOffset: 'UTC+1', offsetMinutes: 60, lat: -8.84, lng: 13.23, region: 'Africa', flag: '\u{1F1E6}\u{1F1F4}' },
  { name: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid', utcOffset: 'UTC+1', offsetMinutes: 60, lat: 40.42, lng: -3.70, region: 'Europe', flag: '\u{1F1EA}\u{1F1F8}' },
  { name: 'Oslo', country: 'Norway', timezone: 'Europe/Oslo', utcOffset: 'UTC+1', offsetMinutes: 60, lat: 59.91, lng: 10.75, region: 'Europe', flag: '\u{1F1F3}\u{1F1F4}' },
  { name: 'Paris', country: 'France', timezone: 'Europe/Paris', utcOffset: 'UTC+1', offsetMinutes: 60, lat: 48.86, lng: 2.35, region: 'Europe', flag: '\u{1F1EB}\u{1F1F7}' },
  { name: 'Rome', country: 'Italy', timezone: 'Europe/Rome', utcOffset: 'UTC+1', offsetMinutes: 60, lat: 41.90, lng: 12.50, region: 'Europe', flag: '\u{1F1EE}\u{1F1F9}' },
  { name: 'Stockholm', country: 'Sweden', timezone: 'Europe/Stockholm', utcOffset: 'UTC+1', offsetMinutes: 60, lat: 59.33, lng: 18.07, region: 'Europe', flag: '\u{1F1F8}\u{1F1EA}' },
  { name: 'Tunis', country: 'Tunisia', timezone: 'Africa/Tunis', utcOffset: 'UTC+1', offsetMinutes: 60, lat: 36.81, lng: 10.18, region: 'Africa', flag: '\u{1F1F9}\u{1F1F3}' },
  { name: 'Vienna', country: 'Austria', timezone: 'Europe/Vienna', utcOffset: 'UTC+1', offsetMinutes: 60, lat: 48.21, lng: 16.37, region: 'Europe', flag: '\u{1F1E6}\u{1F1F9}' },
  { name: 'Warsaw', country: 'Poland', timezone: 'Europe/Warsaw', utcOffset: 'UTC+1', offsetMinutes: 60, lat: 52.23, lng: 21.01, region: 'Europe', flag: '\u{1F1F5}\u{1F1F1}' },
  { name: 'Zurich', country: 'Switzerland', timezone: 'Europe/Zurich', utcOffset: 'UTC+1', offsetMinutes: 60, lat: 47.38, lng: 8.54, region: 'Europe', flag: '\u{1F1E8}\u{1F1ED}' },

  // UTC+2
  { name: 'Athens', country: 'Greece', timezone: 'Europe/Athens', utcOffset: 'UTC+2', offsetMinutes: 120, lat: 37.98, lng: 23.73, region: 'Europe', flag: '\u{1F1EC}\u{1F1F7}' },
  { name: 'Bucharest', country: 'Romania', timezone: 'Europe/Bucharest', utcOffset: 'UTC+2', offsetMinutes: 120, lat: 44.43, lng: 26.10, region: 'Europe', flag: '\u{1F1F7}\u{1F1F4}' },
  { name: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', utcOffset: 'UTC+2', offsetMinutes: 120, lat: 30.04, lng: 31.24, region: 'Africa', flag: '\u{1F1EA}\u{1F1EC}' },
  { name: 'Cape Town', country: 'South Africa', timezone: 'Africa/Johannesburg', utcOffset: 'UTC+2', offsetMinutes: 120, lat: -33.93, lng: 18.42, region: 'Africa', flag: '\u{1F1FF}\u{1F1E6}' },
  { name: 'Harare', country: 'Zimbabwe', timezone: 'Africa/Harare', utcOffset: 'UTC+2', offsetMinutes: 120, lat: -17.83, lng: 31.05, region: 'Africa', flag: '\u{1F1FF}\u{1F1FC}' },
  { name: 'Helsinki', country: 'Finland', timezone: 'Europe/Helsinki', utcOffset: 'UTC+2', offsetMinutes: 120, lat: 60.17, lng: 24.94, region: 'Europe', flag: '\u{1F1EB}\u{1F1EE}' },
  { name: 'Jerusalem', country: 'Israel', timezone: 'Asia/Jerusalem', utcOffset: 'UTC+2', offsetMinutes: 120, lat: 31.77, lng: 35.23, region: 'Middle East', flag: '\u{1F1EE}\u{1F1F1}' },
  { name: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg', utcOffset: 'UTC+2', offsetMinutes: 120, lat: -26.20, lng: 28.04, region: 'Africa', flag: '\u{1F1FF}\u{1F1E6}' },
  { name: 'Kampala', country: 'Uganda', timezone: 'Africa/Kampala', utcOffset: 'UTC+2', offsetMinutes: 120, lat: 0.35, lng: 32.58, region: 'Africa', flag: '\u{1F1FA}\u{1F1EC}' },
  { name: 'Kigali', country: 'Rwanda', timezone: 'Africa/Kigali', utcOffset: 'UTC+2', offsetMinutes: 120, lat: -1.95, lng: 30.06, region: 'Africa', flag: '\u{1F1F7}\u{1F1FC}' },
  { name: 'Kyiv', country: 'Ukraine', timezone: 'Europe/Kyiv', utcOffset: 'UTC+2', offsetMinutes: 120, lat: 50.45, lng: 30.52, region: 'Europe', flag: '\u{1F1FA}\u{1F1E6}' },
  { name: 'Tallinn', country: 'Estonia', timezone: 'Europe/Tallinn', utcOffset: 'UTC+2', offsetMinutes: 120, lat: 59.44, lng: 24.75, region: 'Europe', flag: '\u{1F1EA}\u{1F1EA}' },

  // UTC+3
  { name: 'Addis Ababa', country: 'Ethiopia', timezone: 'Africa/Addis_Ababa', utcOffset: 'UTC+3', offsetMinutes: 180, lat: 9.02, lng: 38.75, region: 'Africa', flag: '\u{1F1EA}\u{1F1F9}' },
  { name: 'Baghdad', country: 'Iraq', timezone: 'Asia/Baghdad', utcOffset: 'UTC+3', offsetMinutes: 180, lat: 33.31, lng: 44.37, region: 'Middle East', flag: '\u{1F1EE}\u{1F1F6}' },
  { name: 'Dar es Salaam', country: 'Tanzania', timezone: 'Africa/Dar_es_Salaam', utcOffset: 'UTC+3', offsetMinutes: 180, lat: -6.79, lng: 39.28, region: 'Africa', flag: '\u{1F1F9}\u{1F1FF}' },
  { name: 'Doha', country: 'Qatar', timezone: 'Asia/Qatar', utcOffset: 'UTC+3', offsetMinutes: 180, lat: 25.29, lng: 51.53, region: 'Middle East', flag: '\u{1F1F6}\u{1F1E6}' },
  { name: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul', utcOffset: 'UTC+3', offsetMinutes: 180, lat: 41.01, lng: 28.98, region: 'Middle East', flag: '\u{1F1F9}\u{1F1F7}' },
  { name: 'Kuwait City', country: 'Kuwait', timezone: 'Asia/Kuwait', utcOffset: 'UTC+3', offsetMinutes: 180, lat: 29.38, lng: 47.99, region: 'Middle East', flag: '\u{1F1F0}\u{1F1FC}' },
  { name: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow', utcOffset: 'UTC+3', offsetMinutes: 180, lat: 55.76, lng: 37.62, region: 'Europe', flag: '\u{1F1F7}\u{1F1FA}' },
  { name: 'Nairobi', country: 'Kenya', timezone: 'Africa/Nairobi', utcOffset: 'UTC+3', offsetMinutes: 180, lat: -1.29, lng: 36.82, region: 'Africa', flag: '\u{1F1F0}\u{1F1EA}' },
  { name: 'Riyadh', country: 'Saudi Arabia', timezone: 'Asia/Riyadh', utcOffset: 'UTC+3', offsetMinutes: 180, lat: 24.69, lng: 46.72, region: 'Middle East', flag: '\u{1F1F8}\u{1F1E6}' },

  // UTC+3:30
  { name: 'Tehran', country: 'Iran', timezone: 'Asia/Tehran', utcOffset: 'UTC+3:30', offsetMinutes: 210, lat: 35.69, lng: 51.39, region: 'Middle East', flag: '\u{1F1EE}\u{1F1F7}' },

  // UTC+4
  { name: 'Baku', country: 'Azerbaijan', timezone: 'Asia/Baku', utcOffset: 'UTC+4', offsetMinutes: 240, lat: 40.41, lng: 49.87, region: 'Central Asia', flag: '\u{1F1E6}\u{1F1FF}' },
  { name: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', utcOffset: 'UTC+4', offsetMinutes: 240, lat: 25.20, lng: 55.27, region: 'Middle East', flag: '\u{1F1E6}\u{1F1EA}' },
  { name: 'Muscat', country: 'Oman', timezone: 'Asia/Muscat', utcOffset: 'UTC+4', offsetMinutes: 240, lat: 23.59, lng: 58.54, region: 'Middle East', flag: '\u{1F1F4}\u{1F1F2}' },
  { name: 'Port Louis', country: 'Mauritius', timezone: 'Indian/Mauritius', utcOffset: 'UTC+4', offsetMinutes: 240, lat: -20.16, lng: 57.50, region: 'Africa', flag: '\u{1F1F2}\u{1F1FA}' },
  { name: 'Tbilisi', country: 'Georgia', timezone: 'Asia/Tbilisi', utcOffset: 'UTC+4', offsetMinutes: 240, lat: 41.72, lng: 44.79, region: 'Central Asia', flag: '\u{1F1EC}\u{1F1EA}' },
  { name: 'Yerevan', country: 'Armenia', timezone: 'Asia/Yerevan', utcOffset: 'UTC+4', offsetMinutes: 240, lat: 40.18, lng: 44.51, region: 'Central Asia', flag: '\u{1F1E6}\u{1F1F2}' },

  // UTC+4:30
  { name: 'Kabul', country: 'Afghanistan', timezone: 'Asia/Kabul', utcOffset: 'UTC+4:30', offsetMinutes: 270, lat: 34.53, lng: 69.17, region: 'Central Asia', flag: '\u{1F1E6}\u{1F1EB}' },

  // UTC+5
  { name: 'Islamabad', country: 'Pakistan', timezone: 'Asia/Karachi', utcOffset: 'UTC+5', offsetMinutes: 300, lat: 33.69, lng: 73.04, region: 'South Asia', flag: '\u{1F1F5}\u{1F1F0}' },
  { name: 'Karachi', country: 'Pakistan', timezone: 'Asia/Karachi', utcOffset: 'UTC+5', offsetMinutes: 300, lat: 24.86, lng: 67.01, region: 'South Asia', flag: '\u{1F1F5}\u{1F1F0}' },
  { name: 'Tashkent', country: 'Uzbekistan', timezone: 'Asia/Tashkent', utcOffset: 'UTC+5', offsetMinutes: 300, lat: 41.30, lng: 69.28, region: 'Central Asia', flag: '\u{1F1FA}\u{1F1FF}' },
  { name: 'Yekaterinburg', country: 'Russia', timezone: 'Asia/Yekaterinburg', utcOffset: 'UTC+5', offsetMinutes: 300, lat: 56.84, lng: 60.60, region: 'Central Asia', flag: '\u{1F1F7}\u{1F1FA}' },
  { name: 'Dushanbe', country: 'Tajikistan', timezone: 'Asia/Dushanbe', utcOffset: 'UTC+5', offsetMinutes: 300, lat: 38.56, lng: 68.77, region: 'Central Asia', flag: '\u{1F1F9}\u{1F1EF}' },

  // UTC+5:30
  { name: 'Bangalore', country: 'India', timezone: 'Asia/Kolkata', utcOffset: 'UTC+5:30', offsetMinutes: 330, lat: 12.97, lng: 77.59, region: 'South Asia', flag: '\u{1F1EE}\u{1F1F3}' },
  { name: 'Chennai', country: 'India', timezone: 'Asia/Kolkata', utcOffset: 'UTC+5:30', offsetMinutes: 330, lat: 13.08, lng: 80.27, region: 'South Asia', flag: '\u{1F1EE}\u{1F1F3}' },
  { name: 'Colombo', country: 'Sri Lanka', timezone: 'Asia/Colombo', utcOffset: 'UTC+5:30', offsetMinutes: 330, lat: 6.93, lng: 79.85, region: 'South Asia', flag: '\u{1F1F1}\u{1F1F0}' },
  { name: 'Delhi', country: 'India', timezone: 'Asia/Kolkata', utcOffset: 'UTC+5:30', offsetMinutes: 330, lat: 28.61, lng: 77.21, region: 'South Asia', flag: '\u{1F1EE}\u{1F1F3}' },
  { name: 'Kolkata', country: 'India', timezone: 'Asia/Kolkata', utcOffset: 'UTC+5:30', offsetMinutes: 330, lat: 22.57, lng: 88.36, region: 'South Asia', flag: '\u{1F1EE}\u{1F1F3}' },
  { name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', utcOffset: 'UTC+5:30', offsetMinutes: 330, lat: 19.08, lng: 72.88, region: 'South Asia', flag: '\u{1F1EE}\u{1F1F3}' },
  { name: 'Hyderabad', country: 'India', timezone: 'Asia/Kolkata', utcOffset: 'UTC+5:30', offsetMinutes: 330, lat: 17.39, lng: 78.49, region: 'South Asia', flag: '\u{1F1EE}\u{1F1F3}' },

  // UTC+5:45
  { name: 'Kathmandu', country: 'Nepal', timezone: 'Asia/Kathmandu', utcOffset: 'UTC+5:45', offsetMinutes: 345, lat: 27.72, lng: 85.32, region: 'South Asia', flag: '\u{1F1F3}\u{1F1F5}' },

  // UTC+6
  { name: 'Almaty', country: 'Kazakhstan', timezone: 'Asia/Almaty', utcOffset: 'UTC+6', offsetMinutes: 360, lat: 43.24, lng: 76.95, region: 'Central Asia', flag: '\u{1F1F0}\u{1F1FF}' },
  { name: 'Dhaka', country: 'Bangladesh', timezone: 'Asia/Dhaka', utcOffset: 'UTC+6', offsetMinutes: 360, lat: 23.81, lng: 90.41, region: 'South Asia', flag: '\u{1F1E7}\u{1F1E9}' },
  { name: 'Novosibirsk', country: 'Russia', timezone: 'Asia/Novosibirsk', utcOffset: 'UTC+6', offsetMinutes: 360, lat: 55.01, lng: 82.92, region: 'Central Asia', flag: '\u{1F1F7}\u{1F1FA}' },
  { name: 'Bishkek', country: 'Kyrgyzstan', timezone: 'Asia/Bishkek', utcOffset: 'UTC+6', offsetMinutes: 360, lat: 42.87, lng: 74.59, region: 'Central Asia', flag: '\u{1F1F0}\u{1F1EC}' },
  { name: 'Thimphu', country: 'Bhutan', timezone: 'Asia/Thimphu', utcOffset: 'UTC+6', offsetMinutes: 360, lat: 27.47, lng: 89.64, region: 'South Asia', flag: '\u{1F1E7}\u{1F1F9}' },

  // UTC+6:30
  { name: 'Yangon', country: 'Myanmar', timezone: 'Asia/Yangon', utcOffset: 'UTC+6:30', offsetMinutes: 390, lat: 16.87, lng: 96.20, region: 'Southeast Asia', flag: '\u{1F1F2}\u{1F1F2}' },
  { name: 'Cocos Islands', country: 'Australia', timezone: 'Indian/Cocos', utcOffset: 'UTC+6:30', offsetMinutes: 390, lat: -12.17, lng: 96.83, region: 'Oceania & Pacific', flag: '\u{1F1E8}\u{1F1E8}' },

  // UTC+7
  { name: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', utcOffset: 'UTC+7', offsetMinutes: 420, lat: 13.76, lng: 100.50, region: 'Southeast Asia', flag: '\u{1F1F9}\u{1F1ED}' },
  { name: 'Hanoi', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', utcOffset: 'UTC+7', offsetMinutes: 420, lat: 21.03, lng: 105.85, region: 'Southeast Asia', flag: '\u{1F1FB}\u{1F1F3}' },
  { name: 'Ho Chi Minh City', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', utcOffset: 'UTC+7', offsetMinutes: 420, lat: 10.82, lng: 106.63, region: 'Southeast Asia', flag: '\u{1F1FB}\u{1F1F3}' },
  { name: 'Jakarta', country: 'Indonesia', timezone: 'Asia/Jakarta', utcOffset: 'UTC+7', offsetMinutes: 420, lat: -6.21, lng: 106.85, region: 'Southeast Asia', flag: '\u{1F1EE}\u{1F1E9}' },
  { name: 'Krasnoyarsk', country: 'Russia', timezone: 'Asia/Krasnoyarsk', utcOffset: 'UTC+7', offsetMinutes: 420, lat: 56.01, lng: 92.87, region: 'Central Asia', flag: '\u{1F1F7}\u{1F1FA}' },
  { name: 'Phnom Penh', country: 'Cambodia', timezone: 'Asia/Phnom_Penh', utcOffset: 'UTC+7', offsetMinutes: 420, lat: 11.56, lng: 104.92, region: 'Southeast Asia', flag: '\u{1F1F0}\u{1F1ED}' },
  { name: 'Vientiane', country: 'Laos', timezone: 'Asia/Vientiane', utcOffset: 'UTC+7', offsetMinutes: 420, lat: 17.97, lng: 102.63, region: 'Southeast Asia', flag: '\u{1F1F1}\u{1F1E6}' },

  // UTC+8
  { name: 'Beijing', country: 'China', timezone: 'Asia/Shanghai', utcOffset: 'UTC+8', offsetMinutes: 480, lat: 39.90, lng: 116.41, region: 'East Asia', flag: '\u{1F1E8}\u{1F1F3}' },
  { name: 'Brunei', country: 'Brunei', timezone: 'Asia/Brunei', utcOffset: 'UTC+8', offsetMinutes: 480, lat: 4.93, lng: 114.95, region: 'Southeast Asia', flag: '\u{1F1E7}\u{1F1F3}' },
  { name: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong', utcOffset: 'UTC+8', offsetMinutes: 480, lat: 22.32, lng: 114.17, region: 'East Asia', flag: '\u{1F1ED}\u{1F1F0}' },
  { name: 'Kuala Lumpur', country: 'Malaysia', timezone: 'Asia/Kuala_Lumpur', utcOffset: 'UTC+8', offsetMinutes: 480, lat: 3.14, lng: 101.69, region: 'Southeast Asia', flag: '\u{1F1F2}\u{1F1FE}' },
  { name: 'Manila', country: 'Philippines', timezone: 'Asia/Manila', utcOffset: 'UTC+8', offsetMinutes: 480, lat: 14.60, lng: 120.98, region: 'Southeast Asia', flag: '\u{1F1F5}\u{1F1ED}' },
  { name: 'Perth', country: 'Australia', timezone: 'Australia/Perth', utcOffset: 'UTC+8', offsetMinutes: 480, lat: -31.95, lng: 115.86, region: 'Oceania & Pacific', flag: '\u{1F1E6}\u{1F1FA}' },
  { name: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai', utcOffset: 'UTC+8', offsetMinutes: 480, lat: 31.23, lng: 121.47, region: 'East Asia', flag: '\u{1F1E8}\u{1F1F3}' },
  { name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', utcOffset: 'UTC+8', offsetMinutes: 480, lat: 1.35, lng: 103.82, region: 'Southeast Asia', flag: '\u{1F1F8}\u{1F1EC}' },
  { name: 'Taipei', country: 'Taiwan', timezone: 'Asia/Taipei', utcOffset: 'UTC+8', offsetMinutes: 480, lat: 25.03, lng: 121.57, region: 'East Asia', flag: '\u{1F1F9}\u{1F1FC}' },
  { name: 'Ulaanbaatar', country: 'Mongolia', timezone: 'Asia/Ulaanbaatar', utcOffset: 'UTC+8', offsetMinutes: 480, lat: 47.91, lng: 106.91, region: 'East Asia', flag: '\u{1F1F2}\u{1F1F3}' },

  // UTC+9
  { name: 'Pyongyang', country: 'North Korea', timezone: 'Asia/Pyongyang', utcOffset: 'UTC+9', offsetMinutes: 540, lat: 39.02, lng: 125.75, region: 'East Asia', flag: '\u{1F1F0}\u{1F1F5}' },
  { name: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', utcOffset: 'UTC+9', offsetMinutes: 540, lat: 37.57, lng: 126.98, region: 'East Asia', flag: '\u{1F1F0}\u{1F1F7}' },
  { name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', utcOffset: 'UTC+9', offsetMinutes: 540, lat: 35.68, lng: 139.69, region: 'East Asia', flag: '\u{1F1EF}\u{1F1F5}' },
  { name: 'Osaka', country: 'Japan', timezone: 'Asia/Tokyo', utcOffset: 'UTC+9', offsetMinutes: 540, lat: 34.69, lng: 135.50, region: 'East Asia', flag: '\u{1F1EF}\u{1F1F5}' },
  { name: 'Irkutsk', country: 'Russia', timezone: 'Asia/Irkutsk', utcOffset: 'UTC+9', offsetMinutes: 540, lat: 52.30, lng: 104.30, region: 'East Asia', flag: '\u{1F1F7}\u{1F1FA}' },

  // UTC+9:30
  { name: 'Adelaide', country: 'Australia', timezone: 'Australia/Adelaide', utcOffset: 'UTC+9:30', offsetMinutes: 570, lat: -34.93, lng: 138.60, region: 'Oceania & Pacific', flag: '\u{1F1E6}\u{1F1FA}' },
  { name: 'Darwin', country: 'Australia', timezone: 'Australia/Darwin', utcOffset: 'UTC+9:30', offsetMinutes: 570, lat: -12.46, lng: 130.84, region: 'Oceania & Pacific', flag: '\u{1F1E6}\u{1F1FA}' },

  // UTC+10
  { name: 'Brisbane', country: 'Australia', timezone: 'Australia/Brisbane', utcOffset: 'UTC+10', offsetMinutes: 600, lat: -27.47, lng: 153.03, region: 'Oceania & Pacific', flag: '\u{1F1E6}\u{1F1FA}' },
  { name: 'Guam', country: 'US Territory', timezone: 'Pacific/Guam', utcOffset: 'UTC+10', offsetMinutes: 600, lat: 13.44, lng: 144.79, region: 'Oceania & Pacific', flag: '\u{1F1EC}\u{1F1FA}' },
  { name: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne', utcOffset: 'UTC+10', offsetMinutes: 600, lat: -37.81, lng: 144.96, region: 'Oceania & Pacific', flag: '\u{1F1E6}\u{1F1FA}' },
  { name: 'Port Moresby', country: 'Papua New Guinea', timezone: 'Pacific/Port_Moresby', utcOffset: 'UTC+10', offsetMinutes: 600, lat: -9.44, lng: 147.18, region: 'Oceania & Pacific', flag: '\u{1F1F5}\u{1F1EC}' },
  { name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', utcOffset: 'UTC+10', offsetMinutes: 600, lat: -33.87, lng: 151.21, region: 'Oceania & Pacific', flag: '\u{1F1E6}\u{1F1FA}' },
  { name: 'Vladivostok', country: 'Russia', timezone: 'Asia/Vladivostok', utcOffset: 'UTC+10', offsetMinutes: 600, lat: 43.12, lng: 131.87, region: 'East Asia', flag: '\u{1F1F7}\u{1F1FA}' },

  // UTC+10:30
  { name: 'Lord Howe Island', country: 'Australia', timezone: 'Australia/Lord_Howe', utcOffset: 'UTC+10:30', offsetMinutes: 630, lat: -31.56, lng: 159.08, region: 'Oceania & Pacific', flag: '\u{1F1E6}\u{1F1FA}' },

  // UTC+11
  { name: 'Noumea', country: 'New Caledonia', timezone: 'Pacific/Noumea', utcOffset: 'UTC+11', offsetMinutes: 660, lat: -22.28, lng: 166.46, region: 'Oceania & Pacific', flag: '\u{1F1F3}\u{1F1E8}' },
  { name: 'Solomon Islands', country: 'Solomon Islands', timezone: 'Pacific/Guadalcanal', utcOffset: 'UTC+11', offsetMinutes: 660, lat: -9.43, lng: 160.03, region: 'Oceania & Pacific', flag: '\u{1F1F8}\u{1F1E7}' },
  { name: 'Magadan', country: 'Russia', timezone: 'Asia/Magadan', utcOffset: 'UTC+11', offsetMinutes: 660, lat: 59.57, lng: 150.80, region: 'East Asia', flag: '\u{1F1F7}\u{1F1FA}' },

  // UTC+12
  { name: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', utcOffset: 'UTC+12', offsetMinutes: 720, lat: -36.85, lng: 174.76, region: 'Oceania & Pacific', flag: '\u{1F1F3}\u{1F1FF}' },
  { name: 'Fiji', country: 'Fiji', timezone: 'Pacific/Fiji', utcOffset: 'UTC+12', offsetMinutes: 720, lat: -17.77, lng: 177.96, region: 'Oceania & Pacific', flag: '\u{1F1EB}\u{1F1EF}' },
  { name: 'Kamchatka', country: 'Russia', timezone: 'Asia/Kamchatka', utcOffset: 'UTC+12', offsetMinutes: 720, lat: 53.01, lng: 158.65, region: 'East Asia', flag: '\u{1F1F7}\u{1F1FA}' },
  { name: 'Wellington', country: 'New Zealand', timezone: 'Pacific/Auckland', utcOffset: 'UTC+12', offsetMinutes: 720, lat: -41.29, lng: 174.78, region: 'Oceania & Pacific', flag: '\u{1F1F3}\u{1F1FF}' },

  // UTC+12:45
  { name: 'Chatham Islands', country: 'New Zealand', timezone: 'Pacific/Chatham', utcOffset: 'UTC+12:45', offsetMinutes: 765, lat: -43.95, lng: -176.56, region: 'Oceania & Pacific', flag: '\u{1F1F3}\u{1F1FF}' },

  // UTC+13
  { name: 'Apia', country: 'Samoa', timezone: 'Pacific/Apia', utcOffset: 'UTC+13', offsetMinutes: 780, lat: -13.83, lng: -171.76, region: 'Oceania & Pacific', flag: '\u{1F1FC}\u{1F1F8}' },
  { name: "Nuku'alofa", country: 'Tonga', timezone: 'Pacific/Tongatapu', utcOffset: 'UTC+13', offsetMinutes: 780, lat: -21.21, lng: -175.20, region: 'Oceania & Pacific', flag: '\u{1F1F9}\u{1F1F4}' },

  // UTC+14
  { name: 'Kiritimati', country: 'Kiribati', timezone: 'Pacific/Kiritimati', utcOffset: 'UTC+14', offsetMinutes: 840, lat: 1.87, lng: -157.47, region: 'Oceania & Pacific', flag: '\u{1F1F0}\u{1F1EE}' },
]

// ─── All unique offsets for the filter ───────────────────────
const ALL_OFFSETS = Array.from(new Set(CITIES.map(c => c.utcOffset))).sort((a, b) => {
  const getMin = (s: string) => {
    const city = CITIES.find(c => c.utcOffset === s)
    return city ? city.offsetMinutes : 0
  }
  return getMin(a) - getMin(b)
})

// ─── All regions ─────────────────────────────────────────────
const ALL_REGIONS: City['region'][] = [
  'North America', 'South America', 'Europe', 'Africa', 'Middle East',
  'South Asia', 'Central Asia', 'East Asia', 'Southeast Asia', 'Oceania & Pacific'
]

// ─── Helper: format time in timezone ─────────────────────────
function getTimeInZone(tz: string, date?: Date): { hours: number; minutes: number; seconds: number; dateStr: string; dayName: string; fullStr: string } {
  const d = date || new Date()
  try {
    const fmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: false })
    const parts = fmt.formatToParts(d)
    const h = parseInt(parts.find(p => p.type === 'hour')?.value || '0')
    const m = parseInt(parts.find(p => p.type === 'minute')?.value || '0')
    const s = parseInt(parts.find(p => p.type === 'second')?.value || '0')
    const dateFmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    const dayFmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'long' })
    const fullFmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })
    return { hours: h === 24 ? 0 : h, minutes: m, seconds: s, dateStr: dateFmt.format(d), dayName: dayFmt.format(d), fullStr: fullFmt.format(d) }
  } catch {
    return { hours: 0, minutes: 0, seconds: 0, dateStr: '', dayName: '', fullStr: '' }
  }
}

// ─── Analog Clock Component ──────────────────────────────────
function AnalogClock({ hours, minutes, seconds, size = 120 }: { hours: number; minutes: number; seconds: number; size?: number }) {
  const cx = size / 2
  const cy = size / 2
  const hourAngle = ((hours % 12) + minutes / 60) * 30 - 90
  const minAngle = (minutes + seconds / 60) * 6 - 90
  const secAngle = seconds * 6 - 90
  const hourLen = size * 0.25
  const minLen = size * 0.35
  const secLen = size * 0.38
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const r = cx - 2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="#0F172A" stroke="#4F46E5" strokeWidth="2.5" opacity="0.7" />
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 - 90) * Math.PI / 180
        const isMajor = i % 3 === 0
        const x1 = cx + Math.cos(angle) * (r - (isMajor ? 10 : 6))
        const y1 = cy + Math.sin(angle) * (r - (isMajor ? 10 : 6))
        const x2 = cx + Math.cos(angle) * (r - 3)
        const y2 = cy + Math.sin(angle) * (r - 3)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={isMajor ? '#94A3B8' : '#334155'} strokeWidth={isMajor ? 2 : 1} strokeLinecap="round" />
      })}
      <line x1={cx} y1={cy} x2={cx + Math.cos(toRad(hourAngle)) * hourLen} y2={cy + Math.sin(toRad(hourAngle)) * hourLen} stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={cx + Math.cos(toRad(minAngle)) * minLen} y2={cy + Math.sin(toRad(minAngle)) * minLen} stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={cx + Math.cos(toRad(secAngle)) * secLen} y2={cy + Math.sin(toRad(secAngle)) * secLen} stroke="#06B6D4" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      <circle cx={cx} cy={cy} r={3} fill="#4F46E5" />
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function WorldClockPage() {
  const [now, setNow] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'offset' | 'region'>('offset')
  const [selectedOffset, setSelectedOffset] = useState<string>('all')
  const [hoveredMapCity, setHoveredMapCity] = useState<string | null>(null)
  const [mapTheme, setMapTheme] = useState<'ocean' | 'emerald' | 'midnight'>('ocean')
  const [mapStyle, setMapStyle] = useState<'filled' | 'dots' | 'outline'>('filled')

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // ─── Filtered + sorted cities ──────────────────────────────
  const filteredCities = useMemo(() => {
    let result = [...CITIES]

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.utcOffset.toLowerCase().includes(q)
      )
    }

    // Offset filter
    if (selectedOffset !== 'all') {
      result = result.filter(c => c.utcOffset === selectedOffset)
    }

    // Sort
    if (viewMode === 'offset') {
      result.sort((a, b) => {
        if (a.offsetMinutes !== b.offsetMinutes) return a.offsetMinutes - b.offsetMinutes
        return a.name.localeCompare(b.name)
      })
    } else {
      // By region, then by offset within region, then alphabetical
      const regionOrder = ALL_REGIONS
      result.sort((a, b) => {
        const ra = regionOrder.indexOf(a.region)
        const rb = regionOrder.indexOf(b.region)
        if (ra !== rb) return ra - rb
        if (a.offsetMinutes !== b.offsetMinutes) return a.offsetMinutes - b.offsetMinutes
        return a.name.localeCompare(b.name)
      })
    }

    return result
  }, [searchQuery, selectedOffset, viewMode])

  // ─── Group cities for rendering ────────────────────────────
  const groupedCities = useMemo(() => {
    const groups: { label: string; cities: City[] }[] = []

    if (viewMode === 'offset') {
      const offsetMap = new Map<string, City[]>()
      filteredCities.forEach(c => {
        if (!offsetMap.has(c.utcOffset)) offsetMap.set(c.utcOffset, [])
        offsetMap.get(c.utcOffset)!.push(c)
      })
      offsetMap.forEach((cities, offset) => {
        groups.push({ label: offset, cities })
      })
    } else {
      const regionMap = new Map<string, City[]>()
      filteredCities.forEach(c => {
        if (!regionMap.has(c.region)) regionMap.set(c.region, [])
        regionMap.get(c.region)!.push(c)
      })
      regionMap.forEach((cities, region) => {
        groups.push({ label: region, cities })
      })
    }

    return groups
  }, [filteredCities, viewMode])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-[#4F46E5] text-2xl">Loading World Clock...</div>
      </div>
    )
  }

  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const localTime = getTimeInZone(localTz, now)
  const localDateStr = new Intl.DateTimeFormat('en-US', { timeZone: localTz, month: 'short', day: 'numeric' }).format(now)

  // ─── Map cities (subset for the map pins) ──────────────────
  const MAP_CITIES = [
    { name: 'New York', timezone: 'America/New_York', lat: 40.71, lng: -74.01, flag: '\u{1F1FA}\u{1F1F8}', country: 'USA' },
    { name: 'Los Angeles', timezone: 'America/Los_Angeles', lat: 34.05, lng: -118.24, flag: '\u{1F1FA}\u{1F1F8}', country: 'USA' },
    { name: 'Mexico City', timezone: 'America/Mexico_City', lat: 19.43, lng: -99.13, flag: '\u{1F1F2}\u{1F1FD}', country: 'Mexico' },
    { name: 'Sao Paulo', timezone: 'America/Sao_Paulo', lat: -23.55, lng: -46.63, flag: '\u{1F1E7}\u{1F1F7}', country: 'Brazil' },
    { name: 'Santiago', timezone: 'America/Santiago', lat: -33.45, lng: -70.67, flag: '\u{1F1E8}\u{1F1F1}', country: 'Chile' },
    { name: 'Vancouver', timezone: 'America/Vancouver', lat: 49.28, lng: -123.12, flag: '\u{1F1E8}\u{1F1E6}', country: 'Canada' },
    { name: 'Anchorage', timezone: 'America/Anchorage', lat: 61.22, lng: -149.90, flag: '\u{1F1FA}\u{1F1F8}', country: 'Alaska' },
    { name: 'Honolulu', timezone: 'Pacific/Honolulu', lat: 21.31, lng: -157.86, flag: '\u{1F1FA}\u{1F1F8}', country: 'Hawaii' },
    { name: 'London', timezone: 'Europe/London', lat: 51.51, lng: -0.13, flag: '\u{1F1EC}\u{1F1E7}', country: 'UK' },
    { name: 'Moscow', timezone: 'Europe/Moscow', lat: 55.76, lng: 37.62, flag: '\u{1F1F7}\u{1F1FA}', country: 'Russia' },
    { name: 'Cairo', timezone: 'Africa/Cairo', lat: 30.04, lng: 31.24, flag: '\u{1F1EA}\u{1F1EC}', country: 'Egypt' },
    { name: 'Lagos', timezone: 'Africa/Lagos', lat: 6.45, lng: 3.40, flag: '\u{1F1F3}\u{1F1EC}', country: 'Nigeria' },
    { name: 'Nairobi', timezone: 'Africa/Nairobi', lat: -1.29, lng: 36.82, flag: '\u{1F1F0}\u{1F1EA}', country: 'Kenya' },
    { name: 'Dubai', timezone: 'Asia/Dubai', lat: 25.20, lng: 55.27, flag: '\u{1F1E6}\u{1F1EA}', country: 'UAE' },
    { name: 'Mumbai', timezone: 'Asia/Kolkata', lat: 19.08, lng: 72.88, flag: '\u{1F1EE}\u{1F1F3}', country: 'India' },
    { name: 'Singapore', timezone: 'Asia/Singapore', lat: 1.35, lng: 103.82, flag: '\u{1F1F8}\u{1F1EC}', country: 'Singapore' },
    { name: 'Shanghai', timezone: 'Asia/Shanghai', lat: 31.23, lng: 121.47, flag: '\u{1F1E8}\u{1F1F3}', country: 'China' },
    { name: 'Hong Kong', timezone: 'Asia/Hong_Kong', lat: 22.32, lng: 114.17, flag: '\u{1F1ED}\u{1F1F0}', country: 'Hong Kong' },
    { name: 'Tokyo', timezone: 'Asia/Tokyo', lat: 35.68, lng: 139.69, flag: '\u{1F1EF}\u{1F1F5}', country: 'Japan' },
    { name: 'Sydney', timezone: 'Australia/Sydney', lat: -33.87, lng: 151.21, flag: '\u{1F1E6}\u{1F1FA}', country: 'Australia' },
    { name: 'Auckland', timezone: 'Pacific/Auckland', lat: -36.85, lng: 174.76, flag: '\u{1F1F3}\u{1F1FF}', country: 'New Zealand' },
  ]

  // Mercator projection
  function latLngToSvg(lat: number, lng: number) {
    const x = ((lng + 180) / 360) * 1000
    const latRad = (lat * Math.PI) / 180
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2))
    const y = 500 / 2 - (500 * mercN) / (2 * Math.PI)
    return { x, y }
  }

  // Get relative date label
  function getDateLabel(tz: string): string {
    const cityDateStr = new Intl.DateTimeFormat('en-US', { timeZone: tz, month: 'short', day: 'numeric' }).format(now)
    if (cityDateStr === localDateStr) return ''
    const cityDay = new Intl.DateTimeFormat('en-US', { timeZone: tz, day: 'numeric' }).format(now)
    const localDay = new Intl.DateTimeFormat('en-US', { timeZone: localTz, day: 'numeric' }).format(now)
    const diff = parseInt(cityDay) - parseInt(localDay)
    if (diff === 1 || diff < -25) return 'Tomorrow'
    if (diff === -1 || diff > 25) return 'Yesterday'
    return cityDateStr
  }

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: '#E2E8F0' }}>
            World Clock
          </h1>
          <p className="text-sm sm:text-base mt-3 max-w-2xl mx-auto" style={{ color: '#94A3B8' }}>
            Every timezone in the world covered. {CITIES.length} cities across {ALL_OFFSETS.length} UTC offsets, updating live.
          </p>
        </div>

        {/* ── Interactive World Map (desktop) ── */}
        <div className="hidden md:block mb-8" style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', overflow: 'hidden' }}>
          <div className="px-6 pt-5 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#E2E8F0', fontFamily: 'Outfit, sans-serif' }}>
                Live World Map
              </h3>
              <p className="text-xs mt-1" style={{ color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}>
                Hover over any city for details
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                {([
                  { key: 'filled' as const, label: 'Filled' },
                  { key: 'dots' as const, label: 'Dots' },
                  { key: 'outline' as const, label: 'Outline' },
                ]).map(s => (
                  <button
                    key={s.key}
                    onClick={() => setMapStyle(s.key)}
                    className="px-2.5 py-1 rounded-lg text-xs transition-all"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: mapStyle === s.key ? 600 : 400,
                      background: mapStyle === s.key ? 'rgba(79,70,229,0.15)' : 'transparent',
                      color: mapStyle === s.key ? '#4F46E5' : '#94A3B8',
                      border: mapStyle === s.key ? '1px solid rgba(79,70,229,0.3)' : '1px solid transparent',
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div style={{ width: '1px', height: '20px', background: '#1E293B' }} />
              <div className="flex items-center gap-1.5">
                {([
                  { key: 'ocean' as const, label: 'Ocean', colors: ['#0a1628', '#1e3a5f'] },
                  { key: 'emerald' as const, label: 'Emerald', colors: ['#0a1a14', '#1a4a35'] },
                  { key: 'midnight' as const, label: 'Midnight', colors: ['#120a1e', '#3a1e5f'] },
                ]).map(t => (
                  <button
                    key={t.key}
                    onClick={() => setMapTheme(t.key)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: mapTheme === t.key ? 600 : 400,
                      background: mapTheme === t.key ? 'rgba(79,70,229,0.15)' : 'transparent',
                      color: mapTheme === t.key ? '#4F46E5' : '#94A3B8',
                      border: mapTheme === t.key ? '1px solid rgba(79,70,229,0.3)' : '1px solid transparent',
                    }}
                  >
                    <span className="w-3 h-3 rounded-full" style={{ background: `linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]})`, border: '1px solid rgba(255,255,255,0.15)' }} />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {(() => {
            const themes = {
              ocean: { bg: '#0a1628', grad1: '#1e3a5f', grad2: '#132d4a', stroke: '#3a6a9b', grid: '#12283f', eq: '#1a3550', labelBg: 'rgba(11,22,36,0.85)', labelStroke: 'rgba(42,74,107,0.3)' },
              emerald: { bg: '#0a1a14', grad1: '#1a4a35', grad2: '#0f3325', stroke: '#2a8a5b', grid: '#0f2a1f', eq: '#1a5040', labelBg: 'rgba(10,26,20,0.85)', labelStroke: 'rgba(42,138,91,0.3)' },
              midnight: { bg: '#120a1e', grad1: '#2e1a50', grad2: '#1f1238', stroke: '#6a3a9b', grid: '#1a1230', eq: '#2a1a45', labelBg: 'rgba(18,10,30,0.85)', labelStroke: 'rgba(106,58,155,0.3)' },
            }
            const th = themes[mapTheme]
            return (
              <div className="w-full overflow-hidden" style={{ background: th.bg }}>
                <svg viewBox="0 0 1000 500" className="w-full h-auto" style={{ minHeight: '280px', maxHeight: '500px' }} xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={th.grad1} />
                      <stop offset="100%" stopColor={th.grad2} />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>

                  {/* Grid lines */}
                  {[-60, -30, 0, 30, 60].map(lat => {
                    const { y } = latLngToSvg(lat, 0)
                    return <line key={`lat${lat}`} x1="0" y1={y} x2="1000" y2={y} stroke={th.grid} strokeWidth="0.5" />
                  })}
                  {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map(lng => {
                    const { x } = latLngToSvg(0, lng)
                    return <line key={`lng${lng}`} x1={x} y1="0" x2={x} y2="500" stroke={th.grid} strokeWidth="0.5" />
                  })}
                  {(() => { const { y } = latLngToSvg(0, 0); return <line x1="0" y1={y} x2="1000" y2={y} stroke={th.eq} strokeWidth="0.8" strokeDasharray="8,4" /> })()}

                  {/* Map */}
                  {mapStyle === 'filled' && <path d={MAP_PATH_DATA} fill="url(#landGrad)" stroke={th.stroke} strokeWidth="0.3" />}
                  {mapStyle === 'outline' && <path d={MAP_PATH_DATA} fill="none" stroke={th.stroke} strokeWidth="0.5" />}
                  {mapStyle === 'dots' && MAP_DOT_DATA.split(' ').map((coord, i) => {
                    const [cx, cy] = coord.split(',')
                    return <circle key={i} cx={cx} cy={cy} r="2" fill={th.grad1} opacity="0.7" />
                  })}

                  {/* Day/Night terminator overlay */}
                  {(() => {
                    const utcH = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
                    const subLng = ((12 - utcH) / 24) * 360;
                    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
                    const decl = 23.44 * Math.sin(((2 * Math.PI) / 365) * (dayOfYear - 81));
                    const decRad = (decl * Math.PI) / 180;
                    const pts: string[] = [];
                    for (let lng = -180; lng <= 180; lng += 2) {
                      const lngRad = ((lng - subLng) * Math.PI) / 180;
                      const latRad = Math.atan(-Math.cos(lngRad) / Math.tan(decRad));
                      const lat = Math.max(-85, Math.min(85, (latRad * 180) / Math.PI));
                      const { x, y } = latLngToSvg(lat, lng);
                      pts.push(`${x},${y}`);
                    }
                    if (decl > 0) { pts.push('1000,500'); pts.push('0,500'); }
                    else { pts.push('1000,0'); pts.push('0,0'); }
                    // Sun marker
                    const sunPos = latLngToSvg(decl, subLng);
                    return (
                      <>
                        <polygon points={pts.join(' ')} fill="rgba(0,0,0,0.45)" />
                        <circle cx={sunPos.x} cy={sunPos.y} r={10} fill="rgba(250,204,21,0.15)" />
                        <circle cx={sunPos.x} cy={sunPos.y} r={5} fill="#fbbf24" stroke="#f59e0b" strokeWidth={1.5} />
                      </>
                    );
                  })()}

                  {/* City pins */}
                  {MAP_CITIES.map(city => {
                    const { x, y } = latLngToSvg(city.lat, city.lng)
                    const isHovered = hoveredMapCity === city.name
                    const hourFmt = new Intl.DateTimeFormat('en-US', { timeZone: city.timezone, hour: 'numeric', hour12: false }).format(now)
                    const hour = parseInt(hourFmt)
                    const isDaytime = hour >= 6 && hour < 18
                    const dotColor = isDaytime ? '#818CF8' : '#22D3EE'
                    const timeColor = isDaytime ? '#FDE68A' : '#7DD3FC'
                    const timeFmt = new Intl.DateTimeFormat('en-US', { timeZone: city.timezone, hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }).format(now)
                    const forceRight = ['Hong Kong', 'Singapore', 'Mumbai', 'Auckland', 'Tokyo'].includes(city.name)
                    const labelOnLeft = !forceRight && x > 700
                    const labelX = labelOnLeft ? x - 10 : x + 10
                    const anchor = labelOnLeft ? 'end' as const : 'start' as const
                    const labelW = city.name.length * 4.5 + 80
                    const bgX = labelOnLeft ? labelX - labelW : labelX - 2

                    return (
                      <g key={city.name} onMouseEnter={() => setHoveredMapCity(city.name)} onMouseLeave={() => setHoveredMapCity(null)} style={{ cursor: 'pointer' }}>
                        <circle cx={x} cy={y} r={isHovered ? 14 : 8} fill={dotColor} fillOpacity={isHovered ? 0.25 : 0.12} />
                        <circle cx={x} cy={y} r={isHovered ? 5 : 3.5} fill={dotColor} stroke={th.bg} strokeWidth="1.5" />
                        <rect x={bgX} y={y - 8} width={labelW} height={16} rx="3" fill={th.labelBg} stroke={isHovered ? 'rgba(129,140,248,0.5)' : th.labelStroke} strokeWidth="0.5" />
                        <text x={labelX} y={y + 2} textAnchor={anchor} fill={isHovered ? '#A5B4FC' : '#E2E8F0'} fontSize="8.5" fontFamily="Inter, sans-serif" fontWeight="600">
                          {isDaytime ? '\u{2600} ' : '\u{1F319} '}{city.name}
                        </text>
                        <text x={labelOnLeft ? bgX + 3 : bgX + labelW - 3} y={y + 2} textAnchor={labelOnLeft ? 'start' : 'end'} fill={timeColor} fontSize="8.5" fontFamily="Inter, sans-serif" fontWeight="700">
                          {timeFmt}
                        </text>
                        {isHovered && (
                          <foreignObject x={x - 90} y={y - 95} width="180" height="85">
                            <div style={{ background: 'rgba(11,22,36,0.97)', border: '1px solid rgba(79,70,229,0.4)', borderRadius: '10px', padding: '8px 12px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', textAlign: 'center' }}>
                              <div style={{ fontSize: '13px', fontWeight: 700, color: '#4F46E5', fontFamily: 'Inter, sans-serif' }}>
                                {city.flag} {city.name}, {city.country}
                              </div>
                              <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', fontFamily: 'Inter, sans-serif', marginTop: '4px' }}>
                                {timeFmt}
                              </div>
                              <div style={{ fontSize: '10px', color: '#CBD5E1', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                                {isDaytime ? '\u{2600}\u{FE0F} Day' : '\u{1F319} Night'} · {new Intl.DateTimeFormat('en-US', { timeZone: city.timezone, weekday: 'short', month: 'short', day: 'numeric' }).format(now)}
                              </div>
                            </div>
                          </foreignObject>
                        )}
                      </g>
                    )
                  })}
                </svg>
              </div>
            )
          })()}
        </div>

        <AdBanner />

        {/* ── Controls: Search + View Toggle + Offset Filter ── */}
        <div className="space-y-4 mb-8">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
            <input
              type="text"
              placeholder="Search by city, country, or offset (e.g. UTC+5:30)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              style={{ background: '#0F172A', border: '1px solid #1E293B', color: '#E2E8F0', fontFamily: 'Inter, sans-serif' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#E2E8F0] text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* View toggle + stats */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #334155' }}>
                <button
                  className="px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1.5"
                  style={viewMode === 'offset' ? { background: '#4F46E5', color: '#fff' } : { background: '#1E293B', color: '#E2E8F0' }}
                  onClick={() => setViewMode('offset')}
                >
                  <Clock size={14} /> By Time Zone
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1.5"
                  style={viewMode === 'region' ? { background: '#4F46E5', color: '#fff' } : { background: '#1E293B', color: '#E2E8F0' }}
                  onClick={() => setViewMode('region')}
                >
                  <Globe size={14} /> By Region
                </button>
              </div>
            </div>
            <div className="text-xs" style={{ color: '#94A3B8' }}>
              <MapPin size={12} className="inline mr-1" />
              Showing {filteredCities.length} of {CITIES.length} cities
            </div>
          </div>

          {/* Offset jump filter */}
          <div className="flex flex-wrap gap-1.5">
            <button
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={selectedOffset === 'all' ? { background: '#4F46E5', color: '#fff' } : { background: '#1E293B', color: '#94A3B8', border: '1px solid #334155' }}
              onClick={() => setSelectedOffset('all')}
            >
              All Offsets
            </button>
            {ALL_OFFSETS.map(offset => (
              <button
                key={offset}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={selectedOffset === offset ? { background: '#4F46E5', color: '#fff' } : { background: '#1E293B', color: '#94A3B8', border: '1px solid #334155' }}
                onClick={() => setSelectedOffset(offset)}
              >
                {offset}
              </button>
            ))}
          </div>
        </div>

        {/* ── Your Local Time ── */}
        <div className="rounded-xl p-5 border-2 mb-8" style={{ background: '#0F172A', borderColor: '#4F46E5' }}>
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: '#4F46E5', fontFamily: 'Inter, sans-serif' }}>Your Local Time</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: '#4F46E5' }}>
                {localTime.hours >= 6 && localTime.hours < 18 ? '\u{2600}\u{FE0F}' : '\u{1F319}'} {localTime.fullStr}
              </div>
              <div className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                {localTime.dateStr} &middot; {localTz}
              </div>
            </div>
            <AnalogClock hours={localTime.hours} minutes={localTime.minutes} seconds={localTime.seconds} size={100} />
          </div>
        </div>

        {/* ── City Cards Grid — grouped ── */}
        {groupedCities.length === 0 ? (
          <div className="text-center py-16">
            <Search size={48} className="mx-auto mb-4" style={{ color: '#334155' }} />
            <p className="text-lg" style={{ color: '#94A3B8' }}>No cities match your search.</p>
            <button onClick={() => { setSearchQuery(''); setSelectedOffset('all') }} className="mt-3 text-sm underline" style={{ color: '#4F46E5' }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedCities.map(group => (
              <div key={group.label}>
                {/* Group header */}
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: '#4F46E5', fontFamily: 'Inter, sans-serif', letterSpacing: '2px' }}>
                    {group.label}
                  </h3>
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(79,70,229,0.3) 0%, transparent 100%)' }} />
                  <span className="text-xs" style={{ color: '#64748B' }}>{group.cities.length} {group.cities.length === 1 ? 'city' : 'cities'}</span>
                </div>
                {/* Cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {group.cities.map(city => {
                    const t = getTimeInZone(city.timezone, now)
                    const isDaytime = t.hours >= 6 && t.hours < 18
                    const dateLabel = getDateLabel(city.timezone)

                    return (
                      <div
                        key={`${city.name}-${city.country}`}
                        className="group relative rounded-xl overflow-hidden transition-all duration-200 hover:scale-[1.02]"
                        style={{
                          background: '#0F172A',
                          border: '1px solid #1E293B',
                          padding: '16px',
                        }}
                      >
                        {/* Top: flag + city + country */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-xl leading-none flex-shrink-0">{city.flag}</span>
                            <div className="min-w-0">
                              <div className="font-semibold text-sm truncate" style={{ color: '#E2E8F0', fontFamily: 'Inter, sans-serif' }}>
                                {city.name}
                              </div>
                              <div className="text-xs truncate" style={{ color: '#94A3B8' }}>
                                {city.country}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {/* Day/Night indicator */}
                            <div style={{ color: isDaytime ? '#4F46E5' : '#06B6D4' }}>
                              {isDaytime ? <Sun size={14} /> : <Moon size={14} />}
                            </div>
                          </div>
                        </div>

                        {/* Time display */}
                        <div className="text-xl font-bold mt-1" style={{ fontFamily: 'Outfit, sans-serif', color: '#fff', letterSpacing: '0.3px' }}>
                          {t.fullStr}
                        </div>

                        {/* UTC offset badge + date info */}
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className="px-2 py-0.5 rounded text-xs font-semibold"
                            style={{ background: 'rgba(79,70,229,0.12)', color: '#4F46E5', border: '1px solid rgba(79,70,229,0.2)' }}
                          >
                            {city.utcOffset}
                          </span>
                          {dateLabel && (
                            <span className="text-xs font-medium" style={{ color: '#F59E0B' }}>
                              {dateLabel}
                            </span>
                          )}
                        </div>

                        {/* Date line */}
                        <div className="text-xs mt-1.5" style={{ color: '#64748B' }}>
                          {t.dateStr}
                        </div>

                        {/* Bottom accent */}
                        <div
                          className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            background: isDaytime
                              ? 'linear-gradient(90deg, transparent, rgba(79,70,229,0.5), transparent)'
                              : 'linear-gradient(90deg, transparent, rgba(6,182,212,0.4), transparent)',
                          }}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
