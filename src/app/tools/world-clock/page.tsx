'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Sun, Moon, MapPin } from 'lucide-react'


import { MAP_PATH_DATA, MAP_DOT_DATA } from './map-data'

// ─── City Data with Lat/Lng ─────────────────────────────────
interface City {
  name: string
  country: string
  timezone: string
  lat: number
  lng: number
  region: 'US' | 'India' | 'Europe' | 'Asia-Pacific'
}

const CITIES: City[] = [
  { name: 'New York', country: 'US', timezone: 'America/New_York', lat: 40.71, lng: -74.01, region: 'US' },
  { name: 'Los Angeles', country: 'US', timezone: 'America/Los_Angeles', lat: 34.05, lng: -118.24, region: 'US' },
  { name: 'Chicago', country: 'US', timezone: 'America/Chicago', lat: 41.88, lng: -87.63, region: 'US' },
  { name: 'Houston', country: 'US', timezone: 'America/Chicago', lat: 29.76, lng: -95.37, region: 'US' },
  { name: 'Dallas', country: 'US', timezone: 'America/Chicago', lat: 32.78, lng: -96.80, region: 'US' },
  { name: 'San Francisco', country: 'US', timezone: 'America/Los_Angeles', lat: 37.77, lng: -122.42, region: 'US' },
  { name: 'Seattle', country: 'US', timezone: 'America/Los_Angeles', lat: 47.61, lng: -122.33, region: 'US' },
  { name: 'Boston', country: 'US', timezone: 'America/New_York', lat: 42.36, lng: -71.06, region: 'US' },
  { name: 'Washington DC', country: 'US', timezone: 'America/New_York', lat: 38.91, lng: -77.04, region: 'US' },
  { name: 'Miami', country: 'US', timezone: 'America/New_York', lat: 25.76, lng: -80.19, region: 'US' },
  { name: 'Atlanta', country: 'US', timezone: 'America/New_York', lat: 33.75, lng: -84.39, region: 'US' },
  { name: 'Austin', country: 'US', timezone: 'America/Chicago', lat: 30.27, lng: -97.74, region: 'US' },
  { name: 'Denver', country: 'US', timezone: 'America/Denver', lat: 39.74, lng: -104.99, region: 'US' },
  { name: 'Phoenix', country: 'US', timezone: 'America/Phoenix', lat: 33.45, lng: -112.07, region: 'US' },
  { name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', lat: 19.08, lng: 72.88, region: 'India' },
  { name: 'Delhi', country: 'India', timezone: 'Asia/Kolkata', lat: 28.61, lng: 77.21, region: 'India' },
  { name: 'Bangalore', country: 'India', timezone: 'Asia/Kolkata', lat: 12.97, lng: 77.59, region: 'India' },
  { name: 'Chennai', country: 'India', timezone: 'Asia/Kolkata', lat: 13.08, lng: 80.27, region: 'India' },
  { name: 'Kolkata', country: 'India', timezone: 'Asia/Kolkata', lat: 22.57, lng: 88.36, region: 'India' },
  { name: 'Hyderabad', country: 'India', timezone: 'Asia/Kolkata', lat: 17.39, lng: 78.49, region: 'India' },
  { name: 'Pune', country: 'India', timezone: 'Asia/Kolkata', lat: 18.52, lng: 73.86, region: 'India' },
  { name: 'Ahmedabad', country: 'India', timezone: 'Asia/Kolkata', lat: 23.02, lng: 72.57, region: 'India' },
  { name: 'London', country: 'UK', timezone: 'Europe/London', lat: 51.51, lng: -0.13, region: 'Europe' },
  { name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', lat: 52.52, lng: 13.41, region: 'Europe' },
  { name: 'Paris', country: 'France', timezone: 'Europe/Paris', lat: 48.86, lng: 2.35, region: 'Europe' },
  { name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', lat: 35.68, lng: 139.69, region: 'Asia-Pacific' },
  { name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', lat: -33.87, lng: 151.21, region: 'Asia-Pacific' },
  { name: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', lat: 25.20, lng: 55.27, region: 'Asia-Pacific' },
  { name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', lat: 1.35, lng: 103.82, region: 'Asia-Pacific' },
  { name: 'Toronto', country: 'Canada', timezone: 'America/Toronto', lat: 43.65, lng: -79.38, region: 'US' },
  { name: 'Vancouver', country: 'Canada', timezone: 'America/Vancouver', lat: 49.28, lng: -123.12, region: 'US' },
  { name: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong', lat: 22.32, lng: 114.17, region: 'Asia-Pacific' },
  { name: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai', lat: 31.23, lng: 121.47, region: 'Asia-Pacific' },
  { name: 'Seoul', country: 'S. Korea', timezone: 'Asia/Seoul', lat: 37.57, lng: 126.98, region: 'Asia-Pacific' },
]

// ─── Holiday Data ───────────────────────────────────────────
interface Holiday {
  name: string
  date: string // YYYY-MM-DD
  country: 'US' | 'India' | 'Both'
  type: string
}

const HOLIDAYS_2026: Holiday[] = [
  { name: "New Year's Day", date: '2026-01-01', country: 'Both', type: 'Public Holiday' },
  { name: 'Republic Day', date: '2026-01-26', country: 'India', type: 'National Holiday' },
  { name: 'Martin Luther King Jr. Day', date: '2026-01-19', country: 'US', type: 'Federal Holiday' },
  { name: 'Maha Shivaratri', date: '2026-02-15', country: 'India', type: 'Festival' },
  { name: "Presidents' Day", date: '2026-02-16', country: 'US', type: 'Federal Holiday' },
  { name: 'Holi', date: '2026-03-10', country: 'India', type: 'Festival' },
  { name: 'Ugadi / Gudi Padwa', date: '2026-03-22', country: 'India', type: 'Festival' },
  { name: 'Ram Navami', date: '2026-03-30', country: 'India', type: 'Festival' },
  { name: 'Good Friday', date: '2026-04-03', country: 'Both', type: 'Holiday' },
  { name: 'Easter Sunday', date: '2026-04-05', country: 'US', type: 'Holiday' },
  { name: 'Baisakhi', date: '2026-04-13', country: 'India', type: 'Festival' },
  { name: 'Memorial Day', date: '2026-05-25', country: 'US', type: 'Federal Holiday' },
  { name: 'Buddha Purnima', date: '2026-05-12', country: 'India', type: 'Festival' },
  { name: 'Eid ul-Fitr', date: '2026-03-21', country: 'India', type: 'Festival' },
  { name: 'Juneteenth', date: '2026-06-19', country: 'US', type: 'Federal Holiday' },
  { name: 'Independence Day (US)', date: '2026-07-04', country: 'US', type: 'Federal Holiday' },
  { name: 'Eid ul-Adha', date: '2026-05-27', country: 'India', type: 'Festival' },
  { name: 'Raksha Bandhan', date: '2026-08-12', country: 'India', type: 'Festival' },
  { name: 'Independence Day (India)', date: '2026-08-15', country: 'India', type: 'National Holiday' },
  { name: 'Janmashtami', date: '2026-08-22', country: 'India', type: 'Festival' },
  { name: 'Labor Day', date: '2026-09-07', country: 'US', type: 'Federal Holiday' },
  { name: 'Ganesh Chaturthi', date: '2026-09-01', country: 'India', type: 'Festival' },
  { name: 'Onam', date: '2026-09-07', country: 'India', type: 'Festival' },
  { name: 'Navratri Begins', date: '2026-10-08', country: 'India', type: 'Festival' },
  { name: 'Dussehra / Vijayadashami', date: '2026-10-17', country: 'India', type: 'Festival' },
  { name: 'Columbus Day', date: '2026-10-12', country: 'US', type: 'Federal Holiday' },
  { name: 'Karva Chauth', date: '2026-10-28', country: 'India', type: 'Festival' },
  { name: 'Diwali', date: '2026-11-05', country: 'India', type: 'Festival' },
  { name: 'Bhai Dooj', date: '2026-11-07', country: 'India', type: 'Festival' },
  { name: 'Guru Nanak Jayanti', date: '2026-11-15', country: 'India', type: 'Festival' },
  { name: 'Veterans Day', date: '2026-11-11', country: 'US', type: 'Federal Holiday' },
  { name: 'Thanksgiving', date: '2026-11-26', country: 'US', type: 'Federal Holiday' },
  { name: 'Christmas Day', date: '2026-12-25', country: 'Both', type: 'Public Holiday' },
  { name: 'Makar Sankranti / Pongal', date: '2026-01-14', country: 'India', type: 'Festival' },
  { name: "Gandhi Jayanti", date: '2026-10-02', country: 'India', type: 'National Holiday' },
]

// ─── Famous birthdays per month ──────────────────────────────
const FAMOUS_BIRTHDAYS: Record<number, string[]> = {
  1: ['Martin Luther King Jr. (Jan 15)', 'Benjamin Franklin (Jan 17)', 'Ellen DeGeneres (Jan 26)', 'Oprah Winfrey (Jan 29)', 'Mozart (Jan 27)'],
  2: ['Abraham Lincoln (Feb 12)', 'Charles Darwin (Feb 12)', 'Steve Jobs (Feb 24)', 'George Washington (Feb 22)', 'Rihanna (Feb 20)'],
  3: ['Albert Einstein (Mar 14)', 'Stephen Curry (Mar 14)', 'Lady Gaga (Mar 28)', 'Vincent van Gogh (Mar 30)', 'Alexander Graham Bell (Mar 3)'],
  4: ['Leonardo da Vinci (Apr 15)', 'Charlie Chaplin (Apr 16)', 'Queen Elizabeth II (Apr 21)', 'William Shakespeare (Apr 23)', 'Sachin Tendulkar (Apr 24)'],
  5: ['Mark Zuckerberg (May 14)', 'David Beckham (May 2)', 'Audrey Hepburn (May 4)', 'Dwayne Johnson (May 2)', 'John F. Kennedy (May 29)'],
  6: ['Marilyn Monroe (Jun 1)', 'Elon Musk (Jun 28)', 'Lionel Messi (Jun 24)', 'Anne Frank (Jun 12)', 'Tupac Shakur (Jun 16)'],
  7: ['Nelson Mandela (Jul 18)', 'Malala Yousafzai (Jul 12)', 'Tom Hanks (Jul 9)', 'Nikola Tesla (Jul 10)', 'Frida Kahlo (Jul 6)'],
  8: ['Barack Obama (Aug 4)', 'Michael Jackson (Aug 29)', 'Mother Teresa (Aug 26)', 'Usain Bolt (Aug 21)', 'Neil Armstrong (Aug 5)'],
  9: ['Beyonce (Sep 4)', 'Michael Faraday (Sep 22)', 'Freddie Mercury (Sep 5)', 'Bill Murray (Sep 21)', 'Adam Sandler (Sep 9)'],
  10: ['Mahatma Gandhi (Oct 2)', 'Bill Gates (Oct 28)', 'John Lennon (Oct 9)', 'Vladimir Putin (Oct 7)', 'Katy Perry (Oct 25)'],
  11: ['Leonardo DiCaprio (Nov 11)', 'Virat Kohli (Nov 5)', 'Marie Curie (Nov 7)', 'Scarlett Johansson (Nov 22)', 'Bruce Lee (Nov 27)'],
  12: ['Taylor Swift (Dec 13)', 'Beethoven (Dec 17)', 'Brad Pitt (Dec 18)', 'Frank Sinatra (Dec 12)', 'Isaac Newton (Dec 25)'],
}

// ─── Zodiac Data ─────────────────────────────────────────────
function getWesternZodiac(month: number, day: number): string {
  const signs = [
    { sign: 'Capricorn ♑', start: [12,22], end: [1,19] },
    { sign: 'Aquarius ♒', start: [1,20], end: [2,18] },
    { sign: 'Pisces ♓', start: [2,19], end: [3,20] },
    { sign: 'Aries ♈', start: [3,21], end: [4,19] },
    { sign: 'Taurus ♉', start: [4,20], end: [5,20] },
    { sign: 'Gemini ♊', start: [5,21], end: [6,20] },
    { sign: 'Cancer ♋', start: [6,21], end: [7,22] },
    { sign: 'Leo ♌', start: [7,23], end: [8,22] },
    { sign: 'Virgo ♍', start: [8,23], end: [9,22] },
    { sign: 'Libra ♎', start: [9,23], end: [10,22] },
    { sign: 'Scorpio ♏', start: [10,23], end: [11,21] },
    { sign: 'Sagittarius ♐', start: [11,22], end: [12,21] },
  ]
  for (const z of signs) {
    if ((month === z.start[0] && day >= z.start[1]) || (month === z.end[0] && day <= z.end[1])) return z.sign
  }
  return 'Capricorn ♑'
}

function getChineseZodiac(year: number): string {
  const animals = ['Rat 🐀', 'Ox 🐂', 'Tiger 🐅', 'Rabbit 🐇', 'Dragon 🐉', 'Snake 🐍', 'Horse 🐴', 'Goat 🐐', 'Monkey 🐒', 'Rooster 🐓', 'Dog 🐕', 'Pig 🐖']
  return animals[(year - 4) % 12]
}

function getGeneration(year: number): string {
  if (year >= 2013) return 'Gen Alpha'
  if (year >= 1997) return 'Gen Z'
  if (year >= 1981) return 'Millennial'
  if (year >= 1965) return 'Gen X'
  if (year >= 1946) return 'Baby Boomer'
  return 'Silent Generation'
}

function getSeason(month: number, lat: number): string {
  const northern = lat >= 0
  if ([3,4,5].includes(month)) return northern ? 'Spring 🌸' : 'Autumn 🍂'
  if ([6,7,8].includes(month)) return northern ? 'Summer ☀️' : 'Winter ❄️'
  if ([9,10,11].includes(month)) return northern ? 'Autumn 🍂' : 'Spring 🌸'
  return northern ? 'Winter ❄️' : 'Summer ☀️'
}

// ─── Sun/Moon Calculations ───────────────────────────────────
function getSunTimes(lat: number, lng: number, date: Date) {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  const declination = 23.45 * Math.sin((2 * Math.PI / 365) * (dayOfYear - 81))
  const decRad = declination * Math.PI / 180
  const latRad = lat * Math.PI / 180
  const hourAngle = Math.acos(-Math.tan(latRad) * Math.tan(decRad))
  const hourAngleDeg = hourAngle * 180 / Math.PI
  const solarNoon = 12 - lng / 15
  const sunriseUTC = solarNoon - hourAngleDeg / 15
  const sunsetUTC = solarNoon + hourAngleDeg / 15
  const dayLength = 2 * hourAngleDeg / 15
  return {
    sunrise: sunriseUTC,
    sunset: sunsetUTC,
    dayLength,
  }
}

function formatSunTime(decimalHours: number, timezone: string): string {
  let h = Math.floor(decimalHours)
  let m = Math.round((decimalHours - h) * 60)
  if (m === 60) { h++; m = 0 }
  if (h < 0) h += 24
  if (h >= 24) h -= 24
  const d = new Date()
  d.setUTCHours(h, m, 0, 0)
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: timezone }).format(d)
}

function getMoonPhase(date: Date): number {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  const day = date.getDate()
  if (month < 3) { year--; month += 12 }
  const c = 365.25 * year
  const e = 30.6 * (month + 1)
  const phase = (c + e + day - 694039.09) / 29.5305882 % 1
  return phase < 0 ? phase + 1 : phase
}

function getMoonPhaseName(phase: number): { name: string; emoji: string } {
  if (phase < 0.0625) return { name: 'New Moon', emoji: '🌑' }
  if (phase < 0.1875) return { name: 'Waxing Crescent', emoji: '🌒' }
  if (phase < 0.3125) return { name: 'First Quarter', emoji: '🌓' }
  if (phase < 0.4375) return { name: 'Waxing Gibbous', emoji: '🌔' }
  if (phase < 0.5625) return { name: 'Full Moon', emoji: '🌕' }
  if (phase < 0.6875) return { name: 'Waning Gibbous', emoji: '🌖' }
  if (phase < 0.8125) return { name: 'Last Quarter', emoji: '🌗' }
  if (phase < 0.9375) return { name: 'Waning Crescent', emoji: '🌘' }
  return { name: 'New Moon', emoji: '🌑' }
}

// ─── Roman Numerals ──────────────────────────────────────────
function toRoman(num: number): string {
  if (num < 1 || num > 3999) return 'Out of range'
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1]
  const syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I']
  let result = ''
  for (let i = 0; i < vals.length; i++) {
    while (num >= vals[i]) { result += syms[i]; num -= vals[i] }
  }
  return result
}

function fromRoman(str: string): number {
  const map: Record<string, number> = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 }
  let result = 0
  const s = str.toUpperCase().replace(/[^IVXLCDM]/g, '')
  for (let i = 0; i < s.length; i++) {
    if (i + 1 < s.length && map[s[i]] < map[s[i+1]]) {
      result -= map[s[i]]
    } else {
      result += map[s[i]]
    }
  }
  return result
}

// ─── ISO Week Number ─────────────────────────────────────────
function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

// ─── US Business Day Holidays (2026) ────────────────────────
const US_HOLIDAYS_2026 = [
  '2026-01-01', '2026-01-19', '2026-02-16', '2026-05-25',
  '2026-06-19', '2026-07-04', '2026-09-07', '2026-10-12',
  '2026-11-11', '2026-11-26', '2026-12-25',
]

function isUSHoliday(d: Date): boolean {
  const str = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  return US_HOLIDAYS_2026.includes(str)
}

function isBusinessDay(d: Date, excludeHolidays: boolean): boolean {
  const dow = d.getDay()
  if (dow === 0 || dow === 6) return false
  if (excludeHolidays && isUSHoliday(d)) return false
  return true
}

// ─── Helper: format time in timezone ────────────────────────
function getTimeInZone(tz: string, date?: Date): { hours: number; minutes: number; seconds: number; dateStr: string; dayName: string; fullStr: string } {
  const d = date || new Date()
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: false })
  const parts = fmt.formatToParts(d)
  const h = parseInt(parts.find(p => p.type === 'hour')?.value || '0')
  const m = parseInt(parts.find(p => p.type === 'minute')?.value || '0')
  const s = parseInt(parts.find(p => p.type === 'second')?.value || '0')
  const dateFmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  const dayFmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'long' })
  const fullFmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })
  return { hours: h === 24 ? 0 : h, minutes: m, seconds: s, dateStr: dateFmt.format(d), dayName: dayFmt.format(d), fullStr: fullFmt.format(d) }
}

function getWeatherEmoji(hours: number): string {
  if (hours >= 6 && hours < 8) return '🌅'
  if (hours >= 8 && hours < 17) return '☀️'
  if (hours >= 17 && hours < 19) return '🌇'
  return '🌙'
}

// ─── Tabs Definition ────────────────────────────────────────
const TABS = [
  { id: 'world-clock', label: 'World Clock', icon: '🌍' },
  { id: 'tz-converter', label: 'TZ Converter', icon: '🔄' },
  { id: 'meeting', label: 'Meeting Planner', icon: '📅' },
  { id: 'calendar', label: 'Calendar', icon: '📆' },
  { id: 'holidays', label: 'Holidays', icon: '🎉' },
  { id: 'countdown', label: 'Countdown', icon: '⏳' },
  { id: 'date-calc', label: 'Date Calculator', icon: '🧮' },
  { id: 'age-calc', label: 'Age Calculator', icon: '🎂' },
  { id: 'stopwatch', label: 'Stopwatch', icon: '⏱️' },
  { id: 'timer', label: 'Timer', icon: '⏰' },
  { id: 'sun-moon', label: 'Sun & Moon', icon: '🌞' },
  { id: 'unix', label: 'Unix Timestamp', icon: '🔢' },
  { id: 'week-number', label: 'Week Number', icon: '📊' },
  { id: 'roman', label: 'Roman Numerals', icon: '🏛️' },
  { id: 'call-planner', label: 'Call Planner', icon: '📞' },
]

// ─── Analog Clock Component ─────────────────────────────────
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
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={cx - 2} fill="none" stroke="#E8970A" strokeWidth="2" opacity="0.3" />
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 - 90) * Math.PI / 180
        const x = cx + Math.cos(angle) * (cx - 10)
        const y = cy + Math.sin(angle) * (cx - 10)
        return <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 3 : 1.5} fill="#E8970A" opacity={i % 3 === 0 ? 0.8 : 0.4} />
      })}
      <line x1={cx} y1={cy} x2={cx + Math.cos(toRad(hourAngle)) * hourLen} y2={cy + Math.sin(toRad(hourAngle)) * hourLen} stroke="#E8970A" strokeWidth="3" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={cx + Math.cos(toRad(minAngle)) * minLen} y2={cy + Math.sin(toRad(minAngle)) * minLen} stroke="#ccc" strokeWidth="2" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={cx + Math.cos(toRad(secAngle)) * secLen} y2={cy + Math.sin(toRad(secAngle)) * secLen} stroke="#E8970A" strokeWidth="1" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={3} fill="#E8970A" />
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function TimeToolsPage() {
  const [activeTab, setActiveTab] = useState('world-clock')
  const [now, setNow] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  // World Clock state
  const [clockMode, setClockMode] = useState<'digital' | 'analog'>('digital')
  const [wcFilter, setWcFilter] = useState<string>('all')
  const [wcSearch, setWcSearch] = useState('')
  const [hoveredMapCity, setHoveredMapCity] = useState<string | null>(null)
  const [selectedMapCity, setSelectedMapCity] = useState<string | null>(null)
  const [mapTheme, setMapTheme] = useState<'ocean' | 'emerald' | 'midnight'>('ocean')
  const [mapStyle, setMapStyle] = useState<'filled' | 'dots' | 'outline'>('filled')

  // TZ Converter state
  const [tzFrom, setTzFrom] = useState(0) // city index
  const [tzTo, setTzTo] = useState(14) // Mumbai
  const [tzDate, setTzDate] = useState('')
  const [tzTime, setTzTime] = useState('12:00')
  const [favConversions, setFavConversions] = useState<string[]>([])

  // Meeting planner state
  const [meetingCities, setMeetingCities] = useState<number[]>([0, 14, 22]) // NY, Mumbai, London
  const [meetingPreset, setMeetingPreset] = useState('')
  const [meetingClickedHour, setMeetingClickedHour] = useState<number | null>(null)

  // Calendar state
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [calYear, setCalYear] = useState(new Date().getFullYear())
  const [calSelectedDate, setCalSelectedDate] = useState<Date | null>(null)

  // Holiday state
  const [holidayFilter, setHolidayFilter] = useState<'Both' | 'US' | 'India'>('Both')
  const [holidayMonth, setHolidayMonth] = useState<number>(-1)

  // Countdown state
  interface CountdownItem { id: string; name: string; target: Date; color: string }
  const [countdowns, setCountdowns] = useState<CountdownItem[]>([
    { id: 'diwali', name: 'Diwali 2026', target: new Date('2026-11-05T00:00:00'), color: '#E8970A' },
    { id: 'ny', name: 'New Year 2027', target: new Date('2027-01-01T00:00:00'), color: '#4CAF50' },
    { id: 'holi', name: 'Holi 2026', target: new Date('2026-03-10T00:00:00'), color: '#E91E63' },
  ])
  const [newCdName, setNewCdName] = useState('')
  const [newCdDate, setNewCdDate] = useState('')

  // Date Calculator state
  const [dateCalcMode, setDateCalcMode] = useState<'between' | 'add' | 'business'>('between')
  const [dcDate1, setDcDate1] = useState('')
  const [dcDate2, setDcDate2] = useState('')
  const [dcAddDays, setDcAddDays] = useState(0)
  const [dcAddMonths, setDcAddMonths] = useState(0)
  const [dcAddYears, setDcAddYears] = useState(0)
  const [dcSubtract, setDcSubtract] = useState(false)
  const [dcExcludeHolidays, setDcExcludeHolidays] = useState(false)

  // Age Calculator state
  const [birthDate, setBirthDate] = useState('')

  // Stopwatch state
  const [swRunning, setSwRunning] = useState(false)
  const [swElapsed, setSwElapsed] = useState(0)
  const [swLaps, setSwLaps] = useState<number[]>([])
  const swStartRef = useRef<number>(0)
  const swIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Timer state
  const [timerDuration, setTimerDuration] = useState(300) // 5 min default
  const [timerRemaining, setTimerRemaining] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerCustomH, setTimerCustomH] = useState(0)
  const [timerCustomM, setTimerCustomM] = useState(5)
  const [timerCustomS, setTimerCustomS] = useState(0)
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timerAudioRef = useRef<AudioContext | null>(null)

  // Sun & Moon state
  const [sunMoonCity, setSunMoonCity] = useState(0)

  // Unix state
  const [unixInput, setUnixInput] = useState('')
  const [unixDateInput, setUnixDateInput] = useState('')

  // Week Number state
  const [weekDateInput, setWeekDateInput] = useState('')

  // Roman Numerals state
  const [romanNumber, setRomanNumber] = useState('')
  const [romanString, setRomanString] = useState('')

  // Call Planner state
  const [callFrom, setCallFrom] = useState(0)
  const [callTo, setCallTo] = useState(14)

  // ─── Effects ────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true)
    const d = new Date()
    setTzDate(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`)
    // Load favorites
    try {
      const saved = localStorage.getItem('tz-favorites')
      if (saved) setFavConversions(JSON.parse(saved))
    } catch {}
    // Load saved countdowns
    try {
      const savedCd = localStorage.getItem('custom-countdowns')
      if (savedCd) {
        const parsed = JSON.parse(savedCd)
        setCountdowns(prev => [...prev, ...parsed.map((c: { id: string; name: string; target: string; color: string }) => ({ ...c, target: new Date(c.target) }))])
      }
    } catch {}
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Stopwatch effect
  useEffect(() => {
    if (swRunning) {
      swStartRef.current = Date.now() - swElapsed
      swIntervalRef.current = setInterval(() => {
        setSwElapsed(Date.now() - swStartRef.current)
      }, 10)
    } else if (swIntervalRef.current) {
      clearInterval(swIntervalRef.current)
    }
    return () => { if (swIntervalRef.current) clearInterval(swIntervalRef.current) }
  }, [swRunning])

  // Timer effect
  useEffect(() => {
    if (timerRunning && timerRemaining > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerRemaining(prev => {
          if (prev <= 100) {
            setTimerRunning(false)
            playBeep()
            return 0
          }
          return prev - 100
        })
      }, 100)
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }
    return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current) }
  }, [timerRunning, timerRemaining])

  // Keyboard shortcut for stopwatch
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (activeTab === 'stopwatch' && e.code === 'Space' && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault()
        setSwRunning(r => !r)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeTab])

  const playBeep = useCallback(() => {
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 800
      gain.gain.value = 0.3
      osc.start()
      setTimeout(() => { osc.stop(); ctx.close() }, 500)
    } catch {}
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#070510] text-white">
        
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-[#E8970A] text-2xl">Loading Time Tools...</div>
        </div>
        
      </div>
    )
  }

  // ─── Helper: card styles ────────────────────────────────────
  const cardCls = "rounded-xl p-5 border"
  const cardStyle = { background: '#0F0D1A', borderColor: '#1A1726' }
  const inputCls = "rounded-lg px-3 py-2 text-sm outline-none w-full"
  const inputStyle = { background: '#1A1726', border: '1px solid #2A2736', color: '#E0DFE3' }
  const btnCls = "rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
  const btnPrimary = { background: '#E8970A', color: '#070510' }
  const btnSecondary = { background: '#1A1726', color: '#E0DFE3', border: '1px solid #2A2736' }

  // ─── World Map City Pins ────────────────────────────────────
  // Uses SVG overlay with Mercator projection — positions are always correct
  // regardless of background image, since pins live in SVG coordinate space
  const MAP_CITIES = [
    { name: 'New York',     timezone: 'America/New_York',     lat: 40.71,  lng: -74.01,  flag: '🇺🇸', country: 'USA' },
    { name: 'Los Angeles',  timezone: 'America/Los_Angeles',  lat: 34.05,  lng: -118.24, flag: '🇺🇸', country: 'USA' },
    { name: 'Mexico City',  timezone: 'America/Mexico_City',  lat: 19.43,  lng: -99.13,  flag: '🇲🇽', country: 'Mexico' },
    { name: 'São Paulo',    timezone: 'America/Sao_Paulo',    lat: -23.55, lng: -46.63,  flag: '🇧🇷', country: 'Brazil' },
    { name: 'Santiago',      timezone: 'America/Santiago',     lat: -33.45, lng: -70.67,  flag: '🇨🇱', country: 'Chile' },
    { name: 'Vancouver',    timezone: 'America/Vancouver',    lat: 49.28,  lng: -123.12, flag: '🇨🇦', country: 'Canada' },
    { name: 'Anchorage',    timezone: 'America/Anchorage',    lat: 61.22,  lng: -149.90, flag: '🇺🇸', country: 'Alaska' },
    { name: 'Honolulu',     timezone: 'Pacific/Honolulu',     lat: 21.31,  lng: -157.86, flag: '🇺🇸', country: 'Hawaii' },

    { name: 'Nuuk',         timezone: 'America/Nuuk',         lat: 64.17,  lng: -51.74,  flag: '🇬🇱', country: 'Greenland' },
    { name: 'London',       timezone: 'Europe/London',        lat: 51.51,  lng: -0.13,   flag: '🇬🇧', country: 'UK' },
    { name: 'Moscow',       timezone: 'Europe/Moscow',        lat: 55.76,  lng: 37.62,   flag: '🇷🇺', country: 'Russia' },
    { name: 'Cairo',        timezone: 'Africa/Cairo',         lat: 30.04,  lng: 31.24,   flag: '🇪🇬', country: 'Egypt' },
    { name: 'Lagos',        timezone: 'Africa/Lagos',         lat: 6.45,   lng: 3.40,    flag: '🇳🇬', country: 'Nigeria' },
    { name: 'Nairobi',      timezone: 'Africa/Nairobi',       lat: -1.29,  lng: 36.82,   flag: '🇰🇪', country: 'Kenya' },
    { name: 'Mumbai',       timezone: 'Asia/Kolkata',         lat: 19.08,  lng: 72.88,   flag: '🇮🇳', country: 'India' },
    { name: 'Bangkok',      timezone: 'Asia/Bangkok',         lat: 13.76,  lng: 100.50,  flag: '🇹🇭', country: 'Thailand' },
    { name: 'Singapore',    timezone: 'Asia/Singapore',       lat: 1.35,   lng: 103.82,  flag: '🇸🇬', country: 'Singapore' },
    { name: 'Shanghai',     timezone: 'Asia/Shanghai',        lat: 31.23,  lng: 121.47,  flag: '🇨🇳', country: 'China' },
    { name: 'Hong Kong',    timezone: 'Asia/Hong_Kong',       lat: 22.32,  lng: 114.17,  flag: '🇭🇰', country: 'Hong Kong' },
    { name: 'Tokyo',        timezone: 'Asia/Tokyo',           lat: 35.68,  lng: 139.69,  flag: '🇯🇵', country: 'Japan' },
    { name: 'Sydney',       timezone: 'Australia/Sydney',     lat: -33.87, lng: 151.21,  flag: '🇦🇺', country: 'Australia' },
    { name: 'Auckland',     timezone: 'Pacific/Auckland',     lat: -36.85, lng: 174.76,  flag: '🇳🇿', country: 'New Zealand' },
  ]

  // Mercator projection: lat/lng → SVG coordinates (viewBox 0 0 1000 500)
  function latLngToSvg(lat: number, lng: number) {
    const x = ((lng + 180) / 360) * 1000
    const latRad = (lat * Math.PI) / 180
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2))
    const y = 500 / 2 - (500 * mercN) / (2 * Math.PI)
    return { x, y }
  }

  // ═══════════════════════════════════════════════════════════
  // TAB 1: WORLD CLOCK
  // ═══════════════════════════════════════════════════════════
  function renderWorldClock() {
    const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const localTime = getTimeInZone(localTz)
    const regions = ['all', 'US', 'India', 'Europe', 'Asia-Pacific']
    const regionFiltered = wcFilter === 'all' ? CITIES : CITIES.filter(c => c.region === wcFilter)
    const filteredCities = wcSearch.trim()
      ? regionFiltered.filter(c => c.name.toLowerCase().includes(wcSearch.toLowerCase()) || c.country.toLowerCase().includes(wcSearch.toLowerCase()))
      : regionFiltered

    return (
      <div className="space-y-6">
        {/* ── Interactive World Map (desktop only) ── */}
        <div className="hidden md:block" style={{ background: '#0F0D1A', border: '1px solid #1A1726', borderRadius: '12px', overflow: 'hidden' }}>
          <div className="px-6 pt-5 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#E0DFE3', fontFamily: 'Playfair Display, serif' }}>
                Live World Clock
              </h3>
              <p className="text-xs mt-1" style={{ color: '#8B8A90', fontFamily: 'DM Sans, sans-serif' }}>
                Hover over any city for details
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Map style */}
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
                      fontFamily: 'DM Sans, sans-serif',
                      fontWeight: mapStyle === s.key ? 600 : 400,
                      background: mapStyle === s.key ? 'rgba(232,151,10,0.15)' : 'transparent',
                      color: mapStyle === s.key ? '#E8970A' : '#8B8A90',
                      border: mapStyle === s.key ? '1px solid rgba(232,151,10,0.3)' : '1px solid transparent',
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div style={{ width: '1px', height: '20px', background: '#1A1726' }} />
              {/* Color theme */}
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
                      fontFamily: 'DM Sans, sans-serif',
                      fontWeight: mapTheme === t.key ? 600 : 400,
                      background: mapTheme === t.key ? 'rgba(232,151,10,0.15)' : 'transparent',
                      color: mapTheme === t.key ? '#E8970A' : '#8B8A90',
                      border: mapTheme === t.key ? '1px solid rgba(232,151,10,0.3)' : '1px solid transparent',
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
              ocean:    { bg: '#0a1628', grad1: '#1e3a5f', grad2: '#132d4a', stroke: '#3a6a9b', grid: '#12283f', eq: '#1a3550', labelBg: 'rgba(11,22,36,0.85)', labelStroke: 'rgba(42,74,107,0.3)' },
              emerald:  { bg: '#0a1a14', grad1: '#1a4a35', grad2: '#0f3325', stroke: '#2a8a5b', grid: '#0f2a1f', eq: '#1a5040', labelBg: 'rgba(10,26,20,0.85)', labelStroke: 'rgba(42,138,91,0.3)' },
              midnight: { bg: '#120a1e', grad1: '#2e1a50', grad2: '#1f1238', stroke: '#6a3a9b', grid: '#1a1230', eq: '#2a1a45', labelBg: 'rgba(18,10,30,0.85)', labelStroke: 'rgba(106,58,155,0.3)' },
            }
            const th = themes[mapTheme]
            return (
          <div className="w-full overflow-hidden" style={{ background: th.bg }}>
            <svg
              viewBox="0 0 1000 500"
              className="w-full h-auto"
              style={{ minHeight: '280px', maxHeight: '500px' }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={th.grad1} />
                  <stop offset="100%" stopColor={th.grad2} />
                </linearGradient>
                {/* Glow filter for city dots */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Ocean texture — subtle grid */}
              {[-60, -30, 0, 30, 60].map(lat => {
                const { y } = latLngToSvg(lat, 0)
                return <line key={`lat${lat}`} x1="0" y1={y} x2="1000" y2={y} stroke={th.grid} strokeWidth="0.5" />
              })}
              {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map(lng => {
                const { x } = latLngToSvg(0, lng)
                return <line key={`lng${lng}`} x1={x} y1="0" x2={x} y2="500" stroke={th.grid} strokeWidth="0.5" />
              })}
              {/* Equator */}
              {(() => { const { y } = latLngToSvg(0, 0); return <line x1="0" y1={y} x2="1000" y2={y} stroke={th.eq} strokeWidth="0.8" strokeDasharray="8,4" /> })()}

              {/* Map rendering — 3 styles */}
              {mapStyle === 'filled' && (
                <path d={MAP_PATH_DATA} fill="url(#landGrad)" stroke={th.stroke} strokeWidth="0.3" />
              )}
              {mapStyle === 'outline' && (
                <path d={MAP_PATH_DATA} fill="none" stroke={th.stroke} strokeWidth="0.5" />
              )}
              {mapStyle === 'dots' && (
                MAP_DOT_DATA.split(' ').map((coord, i) => {
                  const [cx, cy] = coord.split(',')
                  return <circle key={i} cx={cx} cy={cy} r="2" fill={th.grad1} opacity="0.7" />
                })
              )}

              {/* City pins with live time */}
              {MAP_CITIES.map(city => {
                const { x, y } = latLngToSvg(city.lat, city.lng)
                const isHovered = hoveredMapCity === city.name
                const hourFmt = new Intl.DateTimeFormat('en-US', { timeZone: city.timezone, hour: 'numeric', hour12: false }).format(now)
                const hour = parseInt(hourFmt)
                const isDaytime = hour >= 6 && hour < 18
                const dotColor = isDaytime ? '#E8970A' : '#7B8CDE'
                const timeFmt = new Intl.DateTimeFormat('en-US', { timeZone: city.timezone, hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }).format(now)

                // Label positioning — "labelOnLeft" means label goes LEFT of pin (for cities near right edge)
                const forceRight = ['Hong Kong', 'Singapore', 'Bangkok', 'Mumbai', 'Auckland', 'Tokyo'].includes(city.name)
                const labelOnLeft = !forceRight && x > 700
                const labelX = labelOnLeft ? x - 10 : x + 10
                const anchor = labelOnLeft ? 'end' as const : 'start' as const
                const labelW = city.name.length * 4.2 + 75
                const bgX = labelOnLeft ? labelX - labelW : labelX - 2

                return (
                  <g
                    key={city.name}
                    onMouseEnter={() => setHoveredMapCity(city.name)}
                    onMouseLeave={() => setHoveredMapCity(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Glow ring */}
                    <circle cx={x} cy={y} r={isHovered ? 14 : 8} fill={dotColor} fillOpacity={isHovered ? 0.2 : 0.1} />
                    {/* Pin dot */}
                    <circle cx={x} cy={y} r={isHovered ? 5 : 3.5} fill={dotColor} stroke={th.bg} strokeWidth="1.5" />

                    {/* Always-visible label: name + time */}
                    <rect x={bgX} y={y - 7} width={labelW} height={14} rx="3" fill={th.labelBg} stroke={isHovered ? 'rgba(232,151,10,0.5)' : th.labelStroke} strokeWidth="0.5" />
                    <text x={labelX} y={y + 1.5} textAnchor={anchor} fill={isHovered ? '#E8970A' : '#c8d6e5'} fontSize="7.5" fontFamily="DM Sans, sans-serif" fontWeight="600">
                      {isDaytime ? '☀ ' : '🌙 '}{city.name}
                    </text>
                    <text x={labelOnLeft ? bgX + 3 : bgX + labelW - 3} y={y + 1.5} textAnchor={labelOnLeft ? 'start' : 'end'} fill={dotColor} fontSize="7.5" fontFamily="DM Sans, sans-serif" fontWeight="700">
                      {timeFmt}
                    </text>

                    {/* Hover tooltip */}
                    {isHovered && (
                      <foreignObject x={x - 90} y={y - 95} width="180" height="85">
                        <div style={{ background: 'rgba(11,22,36,0.97)', border: '1px solid rgba(232,151,10,0.4)', borderRadius: '10px', padding: '8px 12px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', textAlign: 'center' }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#E8970A', fontFamily: 'DM Sans, sans-serif' }}>
                            {city.flag} {city.name}, {city.country}
                          </div>
                          <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', fontFamily: 'DM Sans, sans-serif', marginTop: '4px' }}>
                            {new Intl.DateTimeFormat('en-US', { timeZone: city.timezone, hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }).format(now)}
                          </div>
                          <div style={{ fontSize: '10px', color: '#B0AFB5', fontFamily: 'DM Sans, sans-serif', marginTop: '2px' }}>
                            {isDaytime ? '☀️ Day' : '🌙 Night'} · {new Intl.DateTimeFormat('en-US', { timeZone: city.timezone, weekday: 'short', month: 'short', day: 'numeric' }).format(now)}
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

        {/* ── City Clock Cards Grid — grouped by region ── */}
        {(() => {
          const localTzName = Intl.DateTimeFormat().resolvedOptions().timeZone
          const regionGroups: { label: string; keys: string[]; cities: typeof MAP_CITIES }[] = [
            {
              label: 'Americas',
              keys: ['America/', 'Pacific/'],
              cities: MAP_CITIES.filter(c => c.timezone.startsWith('America/') || c.timezone.startsWith('Pacific/')).filter(c => c.country !== 'New Zealand'),
            },
            {
              label: 'Europe & Africa',
              keys: ['Europe/', 'Africa/'],
              cities: MAP_CITIES.filter(c => c.timezone.startsWith('Europe/') || c.timezone.startsWith('Africa/')),
            },
            {
              label: 'Asia',
              keys: ['Asia/'],
              cities: MAP_CITIES.filter(c => c.timezone.startsWith('Asia/')),
            },
            {
              label: 'Oceania',
              keys: ['Australia/', 'Pacific/'],
              cities: MAP_CITIES.filter(c => c.timezone.startsWith('Australia/') || (c.timezone.startsWith('Pacific/') && c.country === 'New Zealand')),
            },
          ]

          return (
            <div className="space-y-6">
              {regionGroups.map(group => {
                if (group.cities.length === 0) return null
                return (
                  <div key={group.label}>
                    {/* Region header */}
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-sm font-bold uppercase tracking-widest" style={{ color: '#E8970A', fontFamily: 'DM Sans, sans-serif', letterSpacing: '2px' }}>
                        {group.label}
                      </h4>
                      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(232,151,10,0.3) 0%, transparent 100%)' }} />
                    </div>
                    {/* Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {group.cities.map(city => {
                        const hourFmt = new Intl.DateTimeFormat('en-US', { timeZone: city.timezone, hour: 'numeric', hour12: false }).format(now)
                        const hour = parseInt(hourFmt)
                        const isDaytime = hour >= 6 && hour < 18
                        const isLocal = city.timezone === localTzName
                        const isSelected = selectedMapCity === city.name
                        const isHighlighted = isSelected || hoveredMapCity === city.name

                        const timeFmt = new Intl.DateTimeFormat('en-US', {
                          timeZone: city.timezone,
                          hour: 'numeric',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true,
                        }).format(now)

                        const weekdayFmt = new Intl.DateTimeFormat('en-US', {
                          timeZone: city.timezone,
                          weekday: 'long',
                        }).format(now)

                        const dateFmt = new Intl.DateTimeFormat('en-US', {
                          timeZone: city.timezone,
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }).format(now)

                        return (
                          <div
                            key={city.name + '-card'}
                            className="group relative rounded-xl overflow-hidden transition-all duration-200 cursor-pointer"
                            style={{
                              background: isHighlighted
                                ? 'linear-gradient(135deg, #15122A 0%, #1A1530 100%)'
                                : isLocal
                                  ? 'linear-gradient(135deg, #1A1520 0%, #120F1E 100%)'
                                  : '#0F0D1A',
                              border: isLocal
                                ? '1.5px solid rgba(232,151,10,0.5)'
                                : isHighlighted
                                  ? '1px solid rgba(232,151,10,0.35)'
                                  : '1px solid #1A1726',
                              padding: '16px',
                              boxShadow: isHighlighted
                                ? '0 4px 24px rgba(232,151,10,0.08), 0 0 0 1px rgba(232,151,10,0.05)'
                                : 'none',
                              transform: isHighlighted ? 'scale(1.02)' : 'scale(1)',
                            }}
                            onClick={() => setSelectedMapCity(isSelected ? null : city.name)}
                            onMouseEnter={() => setHoveredMapCity(city.name)}
                            onMouseLeave={() => setHoveredMapCity(null)}
                          >
                            {/* Local timezone badge */}
                            {isLocal && (
                              <div
                                className="absolute top-0 right-0 px-2 py-0.5 rounded-bl-lg text-[9px] font-bold uppercase tracking-wider"
                                style={{ background: 'rgba(232,151,10,0.15)', color: '#E8970A', fontFamily: 'DM Sans, sans-serif' }}
                              >
                                You
                              </div>
                            )}

                            {/* Top row: Flag + city info + day/night icon */}
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2.5">
                                <span className="text-2xl leading-none">{city.flag}</span>
                                <div>
                                  <div style={{ fontSize: '14px', fontWeight: 700, color: isHighlighted ? '#E8970A' : '#E0DFE3', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.2, transition: 'color 0.2s ease' }}>
                                    {city.name}
                                  </div>
                                  <div style={{ fontSize: '11px', color: '#8B8A90', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.3 }}>
                                    {city.country}
                                  </div>
                                </div>
                              </div>
                              <div style={{ color: isDaytime ? '#E8970A' : '#7B8CDE', marginTop: '2px', opacity: 0.8 }}>
                                {isDaytime ? <Sun size={16} /> : <Moon size={16} />}
                              </div>
                            </div>

                            {/* Large live time */}
                            <div
                              style={{
                                fontSize: '22px',
                                fontWeight: 700,
                                color: '#fff',
                                fontFamily: 'DM Sans, sans-serif',
                                lineHeight: 1.2,
                                letterSpacing: '0.3px',
                                marginTop: '4px',
                              }}
                            >
                              {timeFmt}
                            </div>

                            {/* Day of week + date */}
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span style={{ fontSize: '12px', color: isDaytime ? 'rgba(232,151,10,0.7)' : 'rgba(123,140,222,0.7)', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                                {weekdayFmt}
                              </span>
                              <span style={{ fontSize: '10px', color: '#3A3746' }}>|</span>
                              <span style={{ fontSize: '11px', color: '#8B8A90', fontFamily: 'DM Sans, sans-serif' }}>
                                {dateFmt}
                              </span>
                            </div>

                            {/* Bottom glow accent line */}
                            <div
                              className="absolute bottom-0 left-0 right-0 h-[2px] transition-opacity duration-200"
                              style={{
                                background: isDaytime
                                  ? 'linear-gradient(90deg, transparent, rgba(232,151,10,0.4), transparent)'
                                  : 'linear-gradient(90deg, transparent, rgba(123,140,222,0.3), transparent)',
                                opacity: isHighlighted ? 1 : 0,
                              }}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })()}

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #2A2736' }}>
            <button className={btnCls} style={clockMode === 'digital' ? btnPrimary : btnSecondary} onClick={() => setClockMode('digital')}>Digital</button>
            <button className={btnCls} style={clockMode === 'analog' ? btnPrimary : btnSecondary} onClick={() => setClockMode('analog')}>Analog</button>
          </div>
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #2A2736' }}>
            {regions.map(r => (
              <button key={r} className={`${btnCls} text-xs`} style={wcFilter === r ? btnPrimary : btnSecondary} onClick={() => setWcFilter(r)}>
                {r === 'all' ? 'All' : r}
              </button>
            ))}
          </div>
          <input
            value={wcSearch}
            onChange={e => setWcSearch(e.target.value)}
            placeholder="Search cities..."
            className="px-3 py-1.5 rounded-lg text-sm bg-[#070510] border border-[#1A1726] text-white placeholder-gray-500 focus:outline-none focus:border-[#E8970A] w-40"
          />
        </div>

        {/* Your Local Time */}
        <div className={cardCls} style={{ ...cardStyle, borderColor: '#E8970A', borderWidth: 2 }}>
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: '#E8970A' }}>Your Local Time</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#E8970A' }}>
                {getWeatherEmoji(localTime.hours)} {localTime.fullStr}
              </div>
              <div className="text-sm mt-1" style={{ color: '#8B8A90' }}>{localTime.dateStr} &middot; {localTz}</div>
            </div>
            {clockMode === 'analog' && <AnalogClock hours={localTime.hours} minutes={localTime.minutes} seconds={localTime.seconds} />}
          </div>
        </div>

        {/* City Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredCities.map(city => {
            const t = getTimeInZone(city.timezone)
            const emoji = getWeatherEmoji(t.hours)
            return (
              <div key={city.name} className={cardCls} style={cardStyle}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold" style={{ color: '#E0DFE3' }}>{city.name}</div>
                    <div className="text-xs" style={{ color: '#8B8A90' }}>{city.country}</div>
                  </div>
                  <span className="text-2xl">{emoji}</span>
                </div>
                {clockMode === 'digital' ? (
                  <div className="text-2xl font-bold mt-2" style={{ fontFamily: 'Playfair Display, serif', color: '#E8970A' }}>
                    {t.fullStr}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 mt-2">
                    <AnalogClock hours={t.hours} minutes={t.minutes} seconds={t.seconds} size={80} />
                    <div className="text-lg font-bold" style={{ color: '#E8970A' }}>{t.fullStr}</div>
                  </div>
                )}
                <div className="text-xs mt-1" style={{ color: '#8B8A90' }}>
                  {t.dateStr}
                  {t.dateStr !== localTime.dateStr && <span className="ml-1" style={{ color: '#E8970A' }}>(date line crossing)</span>}
                </div>
                {/* Time difference and sunrise/sunset */}
                {(() => {
                  const localOffset = new Date().getTimezoneOffset()
                  const cityDate = new Date(now.toLocaleString('en-US', { timeZone: city.timezone }))
                  const localDate = new Date(now.toLocaleString('en-US', { timeZone: localTz }))
                  const diffHrs = Math.round((cityDate.getTime() - localDate.getTime()) / 3600000)
                  const sunTimes = getSunTimes(city.lat, city.lng, now)
                  return (
                    <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-[#1A1726]">
                      <span className="text-[10px]" style={{ color: diffHrs >= 0 ? '#4ADE80' : '#F87171' }}>
                        {diffHrs >= 0 ? '+' : ''}{diffHrs}h from you
                      </span>
                      <span className="text-[10px]" style={{ color: '#8B8A90' }}>
                        {formatSunTime(sunTimes.sunrise, city.timezone)} - {formatSunTime(sunTimes.sunset, city.timezone)}
                      </span>
                    </div>
                  )
                })()}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // TAB 2: TIMEZONE CONVERTER
  // ═══════════════════════════════════════════════════════════
  function renderTZConverter() {
    const fromCity = CITIES[tzFrom]
    const toCity = CITIES[tzTo]
    const convKey = `${fromCity.name}-${toCity.name}`

    function getConvertedTime() {
      if (!tzDate || !tzTime) return null
      const [h, m] = tzTime.split(':').map(Number)
      const d = new Date(tzDate + 'T00:00:00')
      d.setHours(h, m, 0, 0)
      const fromFmt = new Intl.DateTimeFormat('en-US', { timeZone: fromCity.timezone, hour: 'numeric', minute: '2-digit', hour12: true, weekday: 'short', month: 'short', day: 'numeric' })
      const toFmt = new Intl.DateTimeFormat('en-US', { timeZone: toCity.timezone, hour: 'numeric', minute: '2-digit', hour12: true, weekday: 'short', month: 'short', day: 'numeric' })
      // Create a UTC date that represents the "from" time in the from timezone
      const fromOffset = getTimezoneOffset(fromCity.timezone, d)
      const utcMs = d.getTime() + fromOffset * 60000
      const utcDate = new Date(utcMs)
      return { from: fromFmt.format(utcDate), to: toFmt.format(utcDate), utcDate }
    }

    function getTimezoneOffset(tz: string, date: Date): number {
      const str = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' }).format(date)
      const match = str.match(/GMT([+-]\d+:?\d*)/)
      if (!match) return 0
      const parts = match[1].split(':')
      const hours = parseInt(parts[0])
      const mins = parts[1] ? parseInt(parts[1]) : 0
      return -(hours * 60 + (hours < 0 ? -mins : mins))
    }

    const toggleFav = () => {
      setFavConversions(prev => {
        const next = prev.includes(convKey) ? prev.filter(f => f !== convKey) : [...prev, convKey]
        localStorage.setItem('tz-favorites', JSON.stringify(next))
        return next
      })
    }

    // Build comparison table for all major zones
    const majorZones = [
      { label: 'EST (New York)', tz: 'America/New_York' },
      { label: 'CST (Chicago)', tz: 'America/Chicago' },
      { label: 'MST (Denver)', tz: 'America/Denver' },
      { label: 'PST (LA)', tz: 'America/Los_Angeles' },
      { label: 'IST (India)', tz: 'Asia/Kolkata' },
      { label: 'GMT (London)', tz: 'Europe/London' },
      { label: 'CET (Berlin)', tz: 'Europe/Berlin' },
      { label: 'JST (Tokyo)', tz: 'Asia/Tokyo' },
      { label: 'AEST (Sydney)', tz: 'Australia/Sydney' },
      { label: 'SGT (Singapore)', tz: 'Asia/Singapore' },
      { label: 'GST (Dubai)', tz: 'Asia/Dubai' },
    ]

    const result = getConvertedTime()

    return (
      <div className="space-y-6">
        {/* Converter */}
        <div className={cardCls} style={cardStyle}>
          <h3 className="text-lg font-bold mb-4" style={{ color: '#E0DFE3', fontFamily: 'Playfair Display, serif' }}>Convert Time Between Zones</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#8B8A90' }}>From</label>
              <select className={inputCls} style={inputStyle} value={tzFrom} onChange={e => setTzFrom(Number(e.target.value))}>
                {CITIES.map((c, i) => <option key={i} value={i}>{c.name}, {c.country}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#8B8A90' }}>To</label>
              <select className={inputCls} style={inputStyle} value={tzTo} onChange={e => setTzTo(Number(e.target.value))}>
                {CITIES.map((c, i) => <option key={i} value={i}>{c.name}, {c.country}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#8B8A90' }}>Date</label>
              <input type="date" className={inputCls} style={inputStyle} value={tzDate} onChange={e => setTzDate(e.target.value)} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#8B8A90' }}>Time</label>
              <input type="time" className={inputCls} style={inputStyle} value={tzTime} onChange={e => setTzTime(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button className={btnCls} style={btnPrimary} onClick={() => { const t = tzFrom; setTzFrom(tzTo); setTzTo(t) }}>⇄ Swap</button>
            <button className={btnCls} style={favConversions.includes(convKey) ? btnPrimary : btnSecondary} onClick={toggleFav}>
              {favConversions.includes(convKey) ? '★ Saved' : '☆ Save'}
            </button>
          </div>
          {result && (
            <div className="mt-4 p-4 rounded-lg" style={{ background: '#1A1726' }}>
              <div className="text-sm" style={{ color: '#8B8A90' }}>{fromCity.name}: {result.from}</div>
              <div className="text-2xl font-bold mt-1" style={{ color: '#E8970A', fontFamily: 'Playfair Display, serif' }}>{toCity.name}: {result.to}</div>
            </div>
          )}
        </div>

        {/* Favorites */}
        {favConversions.length > 0 && (
          <div className={cardCls} style={cardStyle}>
            <h3 className="text-sm font-bold mb-2" style={{ color: '#E8970A' }}>★ Favorite Conversions</h3>
            <div className="flex flex-wrap gap-2">
              {favConversions.map(f => (
                <span key={f} className="text-xs px-3 py-1 rounded-full" style={{ background: '#1A1726', color: '#E0DFE3', border: '1px solid #E8970A' }}>
                  {f.replace('-', ' → ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* All Zones Comparison Table */}
        <div className={cardCls} style={cardStyle}>
          <h3 className="text-lg font-bold mb-4" style={{ color: '#E0DFE3', fontFamily: 'Playfair Display, serif' }}>Current Time Across All Major Zones</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2" style={{ color: '#8B8A90' }}>Timezone</th>
                  <th className="text-left p-2" style={{ color: '#8B8A90' }}>Current Time</th>
                  <th className="text-left p-2" style={{ color: '#8B8A90' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {majorZones.map(z => {
                  const t = getTimeInZone(z.tz)
                  return (
                    <tr key={z.tz} style={{ borderTop: '1px solid #1A1726' }}>
                      <td className="p-2 font-medium" style={{ color: '#E0DFE3' }}>{z.label}</td>
                      <td className="p-2 font-bold" style={{ color: '#E8970A' }}>{t.fullStr}</td>
                      <td className="p-2" style={{ color: '#8B8A90' }}>{t.dateStr}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // TAB 3: MEETING PLANNER
  // ═══════════════════════════════════════════════════════════
  function renderMeetingPlanner() {
    const presets: Record<string, number[]> = {
      'US East + India': [0, 14],
      'US West + India': [1, 14],
      'US + UK + India': [0, 22, 14],
      'Global Team': [0, 22, 14, 25],
    }

    function getHourColor(hour: number): string {
      if (hour >= 9 && hour < 17) return '#22c55e' // green - business
      if ((hour >= 7 && hour < 9) || (hour >= 17 && hour < 19)) return '#eab308' // yellow - extended
      return '#374151' // gray - sleeping
    }

    function getHourInZone(baseHourUTC: number, tz: string): number {
      const d = new Date()
      d.setUTCHours(baseHourUTC, 0, 0, 0)
      const fmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', hour12: false })
      return parseInt(fmt.format(d))
    }

    // Find best meeting time
    function findBestTime(): string {
      let bestHour = -1
      let bestScore = -1
      for (let utcH = 0; utcH < 24; utcH++) {
        let score = 0
        for (const ci of meetingCities) {
          const localH = getHourInZone(utcH, CITIES[ci].timezone)
          if (localH >= 9 && localH < 17) score += 3
          else if ((localH >= 7 && localH < 9) || (localH >= 17 && localH < 19)) score += 1
        }
        if (score > bestScore) { bestScore = score; bestHour = utcH }
      }
      if (bestHour < 0) return 'No good overlap found'
      return meetingCities.map(ci => {
        const h = getHourInZone(bestHour, CITIES[ci].timezone)
        const ampm = h >= 12 ? 'PM' : 'AM'
        const h12 = h % 12 || 12
        return `${CITIES[ci].name}: ${h12}:00 ${ampm}`
      }).join(' | ')
    }

    const applyPreset = (name: string) => {
      setMeetingPreset(name)
      setMeetingCities(presets[name])
    }

    const addCity = (idx: number) => {
      if (!meetingCities.includes(idx)) setMeetingCities([...meetingCities, idx])
    }

    const removeCity = (idx: number) => {
      setMeetingCities(meetingCities.filter(c => c !== idx))
    }

    return (
      <div className="space-y-6">
        <div className={cardCls} style={cardStyle}>
          <h3 className="text-lg font-bold mb-4" style={{ color: '#E0DFE3', fontFamily: 'Playfair Display, serif' }}>Meeting Planner</h3>

          {/* Presets */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(presets).map(p => (
              <button key={p} className={btnCls} style={meetingPreset === p ? btnPrimary : btnSecondary} onClick={() => applyPreset(p)}>{p}</button>
            ))}
          </div>

          {/* Add city */}
          <div className="flex gap-2 mb-4">
            <select className={inputCls} style={{ ...inputStyle, maxWidth: 200 }} onChange={e => { if (e.target.value) addCity(Number(e.target.value)) }}>
              <option value="">+ Add city...</option>
              {CITIES.map((c, i) => <option key={i} value={i}>{c.name}, {c.country}</option>)}
            </select>
          </div>

          {/* Selected cities */}
          <div className="flex flex-wrap gap-2 mb-4">
            {meetingCities.map(ci => (
              <span key={ci} className="text-xs px-3 py-1 rounded-full flex items-center gap-1" style={{ background: '#1A1726', color: '#E0DFE3', border: '1px solid #E8970A' }}>
                {CITIES[ci].name}
                <button onClick={() => removeCity(ci)} className="ml-1 opacity-60 hover:opacity-100">&times;</button>
              </span>
            ))}
          </div>

          {/* Legend */}
          <div className="flex gap-4 mb-3 text-xs" style={{ color: '#8B8A90' }}>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: '#22c55e' }}></span> Business (9-5)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: '#eab308' }}></span> Extended (7-9, 5-7)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: '#374151' }}></span> Off hours</span>
          </div>

          {/* Time strips */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Hour headers */}
              <div className="flex mb-1">
                <div className="w-32 flex-shrink-0"></div>
                {[...Array(24)].map((_, h) => (
                  <div key={h} className="flex-1 text-center text-[10px]" style={{ color: '#8B8A90' }}>{h}</div>
                ))}
              </div>
              {meetingCities.map(ci => (
                <div key={ci} className="flex mb-1 items-center">
                  <div className="w-32 flex-shrink-0 text-xs truncate pr-2" style={{ color: '#E0DFE3' }}>{CITIES[ci].name}</div>
                  {[...Array(24)].map((_, utcH) => {
                    const localH = getHourInZone(utcH, CITIES[ci].timezone)
                    return (
                      <div
                        key={utcH}
                        className="flex-1 h-8 cursor-pointer border-r transition-opacity hover:opacity-80"
                        style={{ background: getHourColor(localH), borderColor: '#0F0D1A', opacity: meetingClickedHour === utcH ? 1 : 0.7 }}
                        onClick={() => setMeetingClickedHour(utcH)}
                        title={`${CITIES[ci].name}: ${localH}:00`}
                      >
                        <div className="text-[9px] text-center pt-1" style={{ color: localH >= 9 && localH < 17 ? '#fff' : '#aaa' }}>
                          {localH}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Clicked hour detail */}
          {meetingClickedHour !== null && (
            <div className="mt-4 p-3 rounded-lg" style={{ background: '#1A1726' }}>
              <div className="text-xs mb-1" style={{ color: '#8B8A90' }}>UTC {meetingClickedHour}:00</div>
              <div className="flex flex-wrap gap-3">
                {meetingCities.map(ci => {
                  const h = getHourInZone(meetingClickedHour, CITIES[ci].timezone)
                  const ampm = h >= 12 ? 'PM' : 'AM'
                  const h12 = h % 12 || 12
                  return (
                    <span key={ci} className="text-sm font-medium" style={{ color: '#E8970A' }}>
                      {CITIES[ci].name}: {h12}:00 {ampm}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Best meeting time */}
          <div className="mt-4 p-3 rounded-lg" style={{ background: '#1A1726', borderLeft: '3px solid #E8970A' }}>
            <div className="text-xs mb-1 font-bold" style={{ color: '#E8970A' }}>Best Meeting Time</div>
            <div className="text-sm" style={{ color: '#E0DFE3' }}>{findBestTime()}</div>
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // TAB 4: CALENDAR
  // ═══════════════════════════════════════════════════════════
  function renderCalendar() {
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
    const firstDow = new Date(calYear, calMonth, 1).getDay()
    const today = new Date()
    const days: (number | null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    const monthHolidays = HOLIDAYS_2026.filter(h => {
      const d = new Date(h.date + 'T00:00:00')
      return d.getMonth() === calMonth && d.getFullYear() === calYear
    })

    function isHolidayDay(day: number): Holiday | undefined {
      return monthHolidays.find(h => {
        const d = new Date(h.date + 'T00:00:00')
        return d.getDate() === day
      })
    }

    function isToday(day: number): boolean {
      return day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear()
    }

    const prevMonth = () => {
      if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1) }
      else setCalMonth(calMonth - 1)
    }
    const nextMonth = () => {
      if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1) }
      else setCalMonth(calMonth + 1)
    }

    function getDateInfo(d: Date) {
      const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000)
      const weekNum = getISOWeek(d)
      const diff = Math.floor((d.getTime() - today.getTime()) / 86400000)
      const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(d)
      return { dayOfYear, weekNum, diff, dayOfWeek }
    }

    return (
      <div className="space-y-6">
        <div className={cardCls} style={cardStyle}>
          {/* Nav */}
          <div className="flex items-center justify-between mb-4">
            <button className={btnCls} style={btnSecondary} onClick={prevMonth}>&larr; Prev</button>
            <h3 className="text-xl font-bold" style={{ color: '#E0DFE3', fontFamily: 'Playfair Display, serif' }}>
              {monthNames[calMonth]} {calYear}
            </h3>
            <button className={btnCls} style={btnSecondary} onClick={nextMonth}>Next &rarr;</button>
          </div>
          <button className={`${btnCls} mb-4 text-xs`} style={btnPrimary} onClick={() => { setCalMonth(today.getMonth()); setCalYear(today.getFullYear()); setCalSelectedDate(null) }}>Today</button>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-1">
            {dayNames.map(d => (
              <div key={d} className="text-center text-xs font-bold py-2" style={{ color: '#8B8A90' }}>{d}</div>
            ))}
            {days.map((day, i) => {
              if (day === null) return <div key={`e-${i}`} />
              const holiday = isHolidayDay(day)
              const todayFlag = isToday(day)
              const selected = calSelectedDate && calSelectedDate.getDate() === day && calSelectedDate.getMonth() === calMonth && calSelectedDate.getFullYear() === calYear
              return (
                <div
                  key={i}
                  className="text-center py-2 rounded-lg cursor-pointer transition-colors relative"
                  style={{
                    background: selected ? '#E8970A' : todayFlag ? '#1A1726' : 'transparent',
                    color: selected ? '#070510' : todayFlag ? '#E8970A' : '#E0DFE3',
                    border: todayFlag && !selected ? '1px solid #E8970A' : '1px solid transparent',
                  }}
                  onClick={() => setCalSelectedDate(new Date(calYear, calMonth, day))}
                >
                  <div className="text-sm font-medium">{day}</div>
                  {holiday && <div className="w-1.5 h-1.5 rounded-full mx-auto mt-0.5" style={{ background: holiday.country === 'India' ? '#ff9933' : holiday.country === 'US' ? '#3b82f6' : '#E8970A' }}></div>}
                </div>
              )
            })}
          </div>

          {/* Holidays this month */}
          {monthHolidays.length > 0 && (
            <div className="mt-4 space-y-1">
              <div className="text-xs font-bold mb-2" style={{ color: '#8B8A90' }}>Holidays & Festivals this month:</div>
              {monthHolidays.map(h => (
                <div key={h.name} className="flex items-center gap-2 text-xs" style={{ color: '#E0DFE3' }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: h.country === 'India' ? '#ff9933' : h.country === 'US' ? '#3b82f6' : '#E8970A' }}></span>
                  <span>{new Date(h.date + 'T00:00:00').getDate()} — {h.name}</span>
                  <span className="text-[10px]" style={{ color: '#8B8A90' }}>({h.country})</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected date info */}
        {calSelectedDate && (
          <div className={cardCls} style={{ ...cardStyle, borderColor: '#E8970A' }}>
            <h4 className="text-lg font-bold mb-2" style={{ color: '#E8970A', fontFamily: 'Playfair Display, serif' }}>
              {new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(calSelectedDate)}
            </h4>
            {(() => {
              const info = getDateInfo(calSelectedDate)
              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <div className="text-xs" style={{ color: '#8B8A90' }}>Day of Week</div>
                    <div className="font-bold" style={{ color: '#E0DFE3' }}>{info.dayOfWeek}</div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: '#8B8A90' }}>Week Number</div>
                    <div className="font-bold" style={{ color: '#E0DFE3' }}>W{info.weekNum}</div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: '#8B8A90' }}>Day of Year</div>
                    <div className="font-bold" style={{ color: '#E0DFE3' }}>{info.dayOfYear} / {new Date(calSelectedDate.getFullYear(), 11, 31).getDate() === 31 ? (calSelectedDate.getFullYear() % 4 === 0 ? 366 : 365) : 365}</div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: '#8B8A90' }}>{info.diff === 0 ? 'Today' : info.diff > 0 ? 'Days from today' : 'Days ago'}</div>
                    <div className="font-bold" style={{ color: '#E8970A' }}>{info.diff === 0 ? 'Today!' : Math.abs(info.diff) + ' days'}</div>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // TAB 5: HOLIDAY CALENDAR
  // ═══════════════════════════════════════════════════════════
  function renderHolidays() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const filtered = HOLIDAYS_2026
      .filter(h => holidayFilter === 'Both' ? true : h.country === holidayFilter || h.country === 'Both')
      .filter(h => holidayMonth === -1 ? true : new Date(h.date + 'T00:00:00').getMonth() === holidayMonth)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Group by month
    const grouped: Record<number, typeof filtered> = {}
    for (const h of filtered) {
      const m = new Date(h.date + 'T00:00:00').getMonth()
      if (!grouped[m]) grouped[m] = []
      grouped[m].push(h)
    }

    // Stats
    const upcoming = HOLIDAYS_2026.filter(h => {
      const d = new Date(h.date + 'T00:00:00')
      const diff = Math.ceil((d.getTime() - now.getTime()) / 86400000)
      return diff > 0 && diff <= 30
    })
    const nextHoliday = HOLIDAYS_2026
      .filter(h => new Date(h.date + 'T00:00:00').getTime() > now.getTime())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
    const nextDays = nextHoliday ? Math.ceil((new Date(nextHoliday.date + 'T00:00:00').getTime() - now.getTime()) / 86400000) : 0

    const countryEmoji: Record<string, string> = { US: '🇺🇸', India: '🇮🇳', Both: '🌍' }
    const countryColor: Record<string, string> = { US: '#3b82f6', India: '#ff9933', Both: '#E8970A' }
    const typeEmoji: Record<string, string> = {
      'Festival': '🪔', 'Public Holiday': '🎉', 'Federal Holiday': '🏛️',
      'National Holiday': '🇮🇳', 'Holiday': '✨',
    }

    return (
      <div className="space-y-6">
        {/* Next holiday banner */}
        {nextHoliday && (
          <div className="rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1520 0%, #0F0D1A 100%)', border: '1px solid rgba(232,151,10,0.3)' }}>
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#E8970A', fontFamily: 'DM Sans, sans-serif' }}>Next Holiday</div>
                <div className="text-2xl font-bold" style={{ color: '#E0DFE3', fontFamily: 'Playfair Display, serif' }}>
                  {countryEmoji[nextHoliday.country]} {nextHoliday.name}
                </div>
                <div className="text-sm mt-1" style={{ color: '#8B8A90', fontFamily: 'DM Sans, sans-serif' }}>
                  {new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(nextHoliday.date + 'T00:00:00'))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold" style={{ color: '#E8970A', fontFamily: 'DM Sans, sans-serif' }}>{nextDays}</div>
                <div className="text-xs" style={{ color: '#8B8A90', fontFamily: 'DM Sans, sans-serif' }}>days away</div>
              </div>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Holidays', value: HOLIDAYS_2026.length, icon: '📅' },
            { label: 'This Month', value: upcoming.length, icon: '🔜' },
            { label: 'India Festivals', value: HOLIDAYS_2026.filter(h => h.country === 'India').length, icon: '🪔' },
          ].map(s => (
            <div key={s.label} className={cardCls} style={{ ...cardStyle, padding: '16px', textAlign: 'center' as const }}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold" style={{ color: '#E0DFE3', fontFamily: 'DM Sans, sans-serif' }}>{s.value}</div>
              <div className="text-xs" style={{ color: '#8B8A90', fontFamily: 'DM Sans, sans-serif' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className={cardCls} style={cardStyle}>
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <h3 className="text-lg font-bold" style={{ color: '#E0DFE3', fontFamily: 'Playfair Display, serif' }}>2026 Holidays & Festivals</h3>
            <div className="flex-1" />
            <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #2A2736' }}>
              {(['Both', 'US', 'India'] as const).map(f => (
                <button key={f} className={btnCls} style={holidayFilter === f ? btnPrimary : btnSecondary} onClick={() => setHolidayFilter(f)}>
                  {f === 'Both' ? 'All' : f === 'US' ? 'US' : 'India'}
                </button>
              ))}
            </div>
            <select className={inputCls} style={{ ...inputStyle, width: 'auto' }} value={holidayMonth} onChange={e => setHolidayMonth(Number(e.target.value))}>
              <option value={-1}>All Months</option>
              {monthShort.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
          </div>

          {/* Grouped by month */}
          {Object.entries(grouped).map(([monthIdx, holidays]) => {
            const mi = parseInt(monthIdx)
            const isCurrentMonth = now.getMonth() === mi
            return (
              <div key={monthIdx} className="mb-6 last:mb-0">
                {/* Month header */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="px-3 py-1 rounded-lg text-sm font-bold"
                    style={{
                      background: isCurrentMonth ? 'rgba(232,151,10,0.15)' : '#1A1726',
                      color: isCurrentMonth ? '#E8970A' : '#8B8A90',
                      border: isCurrentMonth ? '1px solid rgba(232,151,10,0.3)' : '1px solid transparent',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    {monthNames[mi]}
                  </div>
                  <div className="flex-1 h-px" style={{ background: isCurrentMonth ? 'rgba(232,151,10,0.2)' : '#1A1726' }} />
                  <span className="text-xs" style={{ color: '#8B8A90' }}>{holidays.length} {holidays.length === 1 ? 'holiday' : 'holidays'}</span>
                </div>

                {/* Holiday cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {holidays.map(h => {
                    const d = new Date(h.date + 'T00:00:00')
                    const daysUntil = Math.ceil((d.getTime() - now.getTime()) / 86400000)
                    const isPast = daysUntil < 0
                    const isToday = daysUntil === 0
                    const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(d)
                    const dayNum = d.getDate()

                    return (
                      <div
                        key={h.name + h.date}
                        className="rounded-xl p-4 transition-all duration-200 hover:scale-[1.01]"
                        style={{
                          background: isToday ? 'linear-gradient(135deg, rgba(232,151,10,0.1) 0%, #0F0D1A 100%)' : '#0F0D1A',
                          border: isToday ? '1px solid rgba(232,151,10,0.4)' : '1px solid #1A1726',
                          opacity: isPast ? 0.5 : 1,
                        }}
                      >
                        <div className="flex gap-3">
                          {/* Date block */}
                          <div
                            className="flex-shrink-0 w-14 h-14 rounded-lg flex flex-col items-center justify-center"
                            style={{
                              background: isToday ? 'rgba(232,151,10,0.2)' : '#1A1726',
                              border: isToday ? '1px solid rgba(232,151,10,0.3)' : 'none',
                            }}
                          >
                            <div className="text-[10px] font-bold uppercase" style={{ color: countryColor[h.country], fontFamily: 'DM Sans, sans-serif' }}>
                              {monthShort[d.getMonth()]}
                            </div>
                            <div className="text-xl font-bold" style={{ color: '#E0DFE3', fontFamily: 'DM Sans, sans-serif', lineHeight: 1 }}>
                              {dayNum}
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{typeEmoji[h.type] || '📌'}</span>
                              <span className="font-semibold text-sm truncate" style={{ color: '#E0DFE3', fontFamily: 'DM Sans, sans-serif' }}>
                                {h.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs" style={{ color: '#8B8A90', fontFamily: 'DM Sans, sans-serif' }}>{dayOfWeek}</span>
                              <span style={{ color: '#2A2736' }}>·</span>
                              <span className="text-xs px-1.5 py-0.5 rounded" style={{
                                background: h.country === 'India' ? 'rgba(255,153,51,0.1)' : h.country === 'US' ? 'rgba(59,130,246,0.1)' : 'rgba(232,151,10,0.1)',
                                color: countryColor[h.country],
                                fontFamily: 'DM Sans, sans-serif',
                              }}>
                                {countryEmoji[h.country]} {h.country === 'Both' ? 'Both' : h.country}
                              </span>
                              <span style={{ color: '#2A2736' }}>��</span>
                              <span className="text-xs" style={{ color: '#8B8A90', fontFamily: 'DM Sans, sans-serif' }}>{h.type}</span>
                            </div>
                          </div>

                          {/* Days counter */}
                          <div className="flex-shrink-0 text-right">
                            {isToday ? (
                              <div className="px-2 py-1 rounded-lg text-xs font-bold" style={{ background: 'rgba(232,151,10,0.2)', color: '#E8970A' }}>
                                Today!
                              </div>
                            ) : daysUntil > 0 ? (
                              <div>
                                <div className="text-lg font-bold" style={{ color: '#E8970A', fontFamily: 'DM Sans, sans-serif', lineHeight: 1 }}>{daysUntil}</div>
                                <div className="text-[10px]" style={{ color: '#8B8A90' }}>days</div>
                              </div>
                            ) : (
                              <div className="text-xs" style={{ color: '#8B8A90' }}>Passed</div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          <div className="text-xs mt-4 pt-3" style={{ color: '#8B8A90', borderTop: '1px solid #1A1726', fontFamily: 'DM Sans, sans-serif' }}>
            Showing {filtered.length} holidays & festivals · Past holidays are dimmed
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // TAB 6: COUNTDOWN TIMER
  // ═══════════════════════════════════════════════════════════
  function renderCountdown() {
    function getCountdownParts(target: Date) {
      const diff = target.getTime() - now.getTime()
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true }
      const days = Math.floor(diff / 86400000)
      const hours = Math.floor((diff % 86400000) / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      return { days, hours, minutes, seconds, past: false }
    }

    const addCountdown = () => {
      if (!newCdName || !newCdDate) return
      const item = { id: Date.now().toString(), name: newCdName, target: new Date(newCdDate + 'T00:00:00'), color: '#E8970A' }
      const next = [...countdowns, item]
      setCountdowns(next)
      setNewCdName('')
      setNewCdDate('')
      try {
        const custom = next.filter(c => !['diwali', 'ny', 'holi'].includes(c.id))
        localStorage.setItem('custom-countdowns', JSON.stringify(custom))
      } catch {}
    }

    const removeCountdown = (id: string) => {
      const next = countdowns.filter(c => c.id !== id)
      setCountdowns(next)
      try {
        const custom = next.filter(c => !['diwali', 'ny', 'holi'].includes(c.id))
        localStorage.setItem('custom-countdowns', JSON.stringify(custom))
      } catch {}
    }

    return (
      <div className="space-y-6">
        {/* Add custom */}
        <div className={cardCls} style={cardStyle}>
          <h3 className="text-lg font-bold mb-4" style={{ color: '#E0DFE3', fontFamily: 'Playfair Display, serif' }}>Create Countdown</h3>
          <div className="flex flex-wrap gap-3">
            <input className={inputCls} style={{ ...inputStyle, maxWidth: 200 }} placeholder="Event name" value={newCdName} onChange={e => setNewCdName(e.target.value)} />
            <input type="date" className={inputCls} style={{ ...inputStyle, maxWidth: 180 }} value={newCdDate} onChange={e => setNewCdDate(e.target.value)} />
            <button className={btnCls} style={btnPrimary} onClick={addCountdown}>+ Add</button>
          </div>
        </div>

        {/* Countdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {countdowns.map(cd => {
            const parts = getCountdownParts(cd.target)
            return (
              <div key={cd.id} className={cardCls} style={{ ...cardStyle, borderColor: cd.color }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold" style={{ color: cd.color }}>{cd.name}</h4>
                  {!['diwali', 'ny', 'holi'].includes(cd.id) && (
                    <button className="text-xs opacity-60 hover:opacity-100" style={{ color: '#E0DFE3' }} onClick={() => removeCountdown(cd.id)}>&times;</button>
                  )}
                </div>
                <div className="text-xs mb-3" style={{ color: '#8B8A90' }}>
                  {new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(cd.target)}
                </div>
                {parts.past ? (
                  <div className="text-xl font-bold" style={{ color: '#8B8A90' }}>Event has passed</div>
                ) : (
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { val: parts.days, label: 'Days' },
                      { val: parts.hours, label: 'Hours' },
                      { val: parts.minutes, label: 'Min' },
                      { val: parts.seconds, label: 'Sec' },
                    ].map(p => (
                      <div key={p.label}>
                        <div className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: cd.color }}>
                          {String(p.val).padStart(2, '0')}
                        </div>
                        <div className="text-[10px] uppercase" style={{ color: '#8B8A90' }}>{p.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // TAB 7: DATE CALCULATOR
  // ═══════════════════════════════════════════════════════════
  function renderDateCalc() {
    function calcBetween() {
      if (!dcDate1 || !dcDate2) return null
      const d1 = new Date(dcDate1 + 'T00:00:00')
      const d2 = new Date(dcDate2 + 'T00:00:00')
      const diffMs = Math.abs(d2.getTime() - d1.getTime())
      const totalDays = Math.floor(diffMs / 86400000)
      const totalWeeks = Math.floor(totalDays / 7)
      const totalHours = totalDays * 24
      const totalMinutes = totalHours * 60
      // Approximate months/years
      let years = Math.abs(d2.getFullYear() - d1.getFullYear())
      let months = Math.abs((d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth()))
      return { totalDays, totalWeeks, months, years, totalHours, totalMinutes }
    }

    function calcAdd() {
      if (!dcDate1) return null
      const d = new Date(dcDate1 + 'T00:00:00')
      const mult = dcSubtract ? -1 : 1
      d.setFullYear(d.getFullYear() + dcAddYears * mult)
      d.setMonth(d.getMonth() + dcAddMonths * mult)
      d.setDate(d.getDate() + dcAddDays * mult)
      const dow = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(d)
      const wk = getISOWeek(d)
      return { date: d, dayOfWeek: dow, weekNumber: wk }
    }

    function calcBusinessDays() {
      if (!dcDate1 || !dcDate2) return null
      const d1 = new Date(dcDate1 + 'T00:00:00')
      const d2 = new Date(dcDate2 + 'T00:00:00')
      let count = 0
      const start = d1 < d2 ? new Date(d1) : new Date(d2)
      const end = d1 < d2 ? d2 : d1
      while (start <= end) {
        if (isBusinessDay(start, dcExcludeHolidays)) count++
        start.setDate(start.getDate() + 1)
      }
      return count
    }

    return (
      <div className="space-y-6">
        <div className={cardCls} style={cardStyle}>
          <h3 className="text-lg font-bold mb-4" style={{ color: '#E0DFE3', fontFamily: 'Playfair Display, serif' }}>Date Calculator</h3>
          <div className="flex gap-2 mb-6">
            {(['between', 'add', 'business'] as const).map(m => (
              <button key={m} className={btnCls} style={dateCalcMode === m ? btnPrimary : btnSecondary} onClick={() => setDateCalcMode(m)}>
                {m === 'between' ? 'Days Between' : m === 'add' ? 'Add/Subtract' : 'Business Days'}
              </button>
            ))}
          </div>

          {dateCalcMode === 'between' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: '#8B8A90' }}>Start Date</label>
                  <input type="date" className={inputCls} style={inputStyle} value={dcDate1} onChange={e => setDcDate1(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: '#8B8A90' }}>End Date</label>
                  <input type="date" className={inputCls} style={inputStyle} value={dcDate2} onChange={e => setDcDate2(e.target.value)} />
                </div>
              </div>
              {(() => {
                const r = calcBetween()
                if (!r) return null
                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { label: 'Total Days', val: r.totalDays.toLocaleString() },
                      { label: 'Weeks', val: r.totalWeeks.toLocaleString() },
                      { label: 'Months', val: r.months.toString() },
                      { label: 'Years', val: r.years.toString() },
                      { label: 'Hours', val: r.totalHours.toLocaleString() },
                      { label: 'Minutes', val: r.totalMinutes.toLocaleString() },
                    ].map(item => (
                      <div key={item.label} className="p-3 rounded-lg" style={{ background: '#1A1726' }}>
                        <div className="text-xs" style={{ color: '#8B8A90' }}>{item.label}</div>
                        <div className="text-xl font-bold" style={{ color: '#E8970A' }}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>
          )}

          {dateCalcMode === 'add' && (
            <div>
              <div className="mb-4">
                <label className="text-xs mb-1 block" style={{ color: '#8B8A90' }}>Start Date</label>
                <input type="date" className={inputCls} style={{ ...inputStyle, maxWidth: 200 }} value={dcDate1} onChange={e => setDcDate1(e.target.value)} />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <label className="flex items-center gap-2 text-sm" style={{ color: '#E0DFE3' }}>
                  <input type="checkbox" checked={dcSubtract} onChange={e => setDcSubtract(e.target.checked)} /> Subtract
                </label>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: '#8B8A90' }}>Years</label>
                  <input type="number" className={inputCls} style={inputStyle} value={dcAddYears} onChange={e => setDcAddYears(Number(e.target.value))} min={0} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: '#8B8A90' }}>Months</label>
                  <input type="number" className={inputCls} style={inputStyle} value={dcAddMonths} onChange={e => setDcAddMonths(Number(e.target.value))} min={0} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: '#8B8A90' }}>Days</label>
                  <input type="number" className={inputCls} style={inputStyle} value={dcAddDays} onChange={e => setDcAddDays(Number(e.target.value))} min={0} />
                </div>
              </div>
              {(() => {
                const r = calcAdd()
                if (!r) return null
                return (
                  <div className="p-4 rounded-lg" style={{ background: '#1A1726' }}>
                    <div className="text-2xl font-bold" style={{ color: '#E8970A', fontFamily: 'Playfair Display, serif' }}>
                      {new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(r.date)}
                    </div>
                    <div className="text-sm mt-1" style={{ color: '#8B8A90' }}>Week {r.weekNumber} &middot; {r.dayOfWeek}</div>
                  </div>
                )
              })()}
            </div>
          )}

          {dateCalcMode === 'business' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: '#8B8A90' }}>Start Date</label>
                  <input type="date" className={inputCls} style={inputStyle} value={dcDate1} onChange={e => setDcDate1(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: '#8B8A90' }}>End Date</label>
                  <input type="date" className={inputCls} style={inputStyle} value={dcDate2} onChange={e => setDcDate2(e.target.value)} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm mb-4" style={{ color: '#E0DFE3' }}>
                <input type="checkbox" checked={dcExcludeHolidays} onChange={e => setDcExcludeHolidays(e.target.checked)} /> Exclude US holidays
              </label>
              {dcDate1 && dcDate2 && (
                <div className="p-4 rounded-lg" style={{ background: '#1A1726' }}>
                  <div className="text-xs" style={{ color: '#8B8A90' }}>Business Days</div>
                  <div className="text-4xl font-bold" style={{ color: '#E8970A', fontFamily: 'Playfair Display, serif' }}>{calcBusinessDays()}</div>
                  <div className="text-xs mt-1" style={{ color: '#8B8A90' }}>{dcExcludeHolidays ? 'Excluding weekends & US holidays' : 'Excluding weekends only'}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // TAB 8: AGE CALCULATOR
  // ═══════════════════════════════════════════════════════════
  function renderAgeCalc() {
    if (!birthDate) {
      return (
        <div className={cardCls} style={cardStyle}>
          <h3 className="text-lg font-bold mb-4" style={{ color: '#E0DFE3', fontFamily: 'Playfair Display, serif' }}>Age Calculator</h3>
          <label className="text-xs mb-1 block" style={{ color: '#8B8A90' }}>Enter your birth date</label>
          <input type="date" className={inputCls} style={{ ...inputStyle, maxWidth: 200 }} value={birthDate} onChange={e => setBirthDate(e.target.value)} />
        </div>
      )
    }

    const bd = new Date(birthDate + 'T00:00:00')
    const diffMs = now.getTime() - bd.getTime()
    if (diffMs < 0) {
      return (
        <div className={cardCls} style={cardStyle}>
          <h3 className="text-lg font-bold mb-4" style={{ color: '#E0DFE3', fontFamily: 'Playfair Display, serif' }}>Age Calculator</h3>
          <input type="date" className={inputCls} style={{ ...inputStyle, maxWidth: 200 }} value={birthDate} onChange={e => setBirthDate(e.target.value)} />
          <div className="mt-4 text-sm" style={{ color: '#E8970A' }}>Please enter a past date.</div>
        </div>
      )
    }

    // Calculate exact age
    let years = now.getFullYear() - bd.getFullYear()
    let months = now.getMonth() - bd.getMonth()
    let days = now.getDate() - bd.getDate()
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate() }
    if (months < 0) { years--; months += 12 }

    const totalDays = Math.floor(diffMs / 86400000)
    const totalHours = Math.floor(diffMs / 3600000)
    const totalMinutes = Math.floor(diffMs / 60000)
    const totalSeconds = Math.floor(diffMs / 1000)

    // Next birthday
    let nextBd = new Date(now.getFullYear(), bd.getMonth(), bd.getDate())
    if (nextBd <= now) nextBd = new Date(now.getFullYear() + 1, bd.getMonth(), bd.getDate())
    const daysUntilBd = Math.ceil((nextBd.getTime() - now.getTime()) / 86400000)

    // Day of week born
    const bornDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(bd)

    // Zodiac
    const westernZodiac = getWesternZodiac(bd.getMonth() + 1, bd.getDate())
    const chineseZodiac = getChineseZodiac(bd.getFullYear())
    const generation = getGeneration(bd.getFullYear())
    const season = getSeason(bd.getMonth() + 1, 40) // assume northern hemisphere

    // Fun stats
    const heartbeats = Math.floor(totalMinutes * 72)
    const breaths = Math.floor(totalMinutes * 15)
    const blinks = Math.floor(totalMinutes * 15) // ~15 blinks/min

    // Famous birthdays
    const monthBirthdays = FAMOUS_BIRTHDAYS[bd.getMonth() + 1] || []

    return (
      <div className="space-y-6">
        <div className={cardCls} style={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold" style={{ color: '#E0DFE3', fontFamily: 'Playfair Display, serif' }}>Age Calculator</h3>
            <input type="date" className={inputCls} style={{ ...inputStyle, maxWidth: 180 }} value={birthDate} onChange={e => setBirthDate(e.target.value)} />
          </div>

          {/* Main age */}
          <div className="text-center mb-6">
            <div className="text-5xl font-bold" style={{ color: '#E8970A', fontFamily: 'Playfair Display, serif' }}>
              {years} years, {months} months, {days} days
            </div>
            <div className="text-sm mt-2" style={{ color: '#8B8A90' }}>Born on {bornDay}, {new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(bd)}</div>
          </div>

          {/* Live counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total Days', val: totalDays.toLocaleString() },
              { label: 'Total Hours', val: totalHours.toLocaleString() },
              { label: 'Total Minutes', val: totalMinutes.toLocaleString() },
              { label: 'Total Seconds', val: totalSeconds.toLocaleString() },
            ].map(item => (
              <div key={item.label} className="p-3 rounded-lg text-center" style={{ background: '#1A1726' }}>
                <div className="text-xs" style={{ color: '#8B8A90' }}>{item.label}</div>
                <div className="text-lg font-bold" style={{ color: '#E8970A' }}>{item.val}</div>
              </div>
            ))}
          </div>

          {/* Birthday countdown */}
          <div className="p-4 rounded-lg mb-6" style={{ background: '#1A1726', borderLeft: '3px solid #E8970A' }}>
            <div className="text-sm" style={{ color: '#8B8A90' }}>Next Birthday</div>
            <div className="text-2xl font-bold" style={{ color: '#E8970A' }}>
              {daysUntilBd === 0 ? 'Happy Birthday! 🎉' : `${daysUntilBd} days away`}
            </div>
            <div className="text-xs" style={{ color: '#8B8A90' }}>
              {new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(nextBd)} &middot; Turning {years + (daysUntilBd === 0 ? 0 : 1)}
            </div>
          </div>

          {/* Zodiac / Generation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Western Zodiac', val: westernZodiac },
              { label: 'Chinese Zodiac', val: chineseZodiac },
              { label: 'Generation', val: generation },
              { label: 'Season Born', val: season },
            ].map(item => (
              <div key={item.label} className="p-3 rounded-lg text-center" style={{ background: '#1A1726' }}>
                <div className="text-xs" style={{ color: '#8B8A90' }}>{item.label}</div>
                <div className="text-sm font-bold" style={{ color: '#E0DFE3' }}>{item.val}</div>
              </div>
            ))}
          </div>

          {/* Fun stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Heartbeats', val: heartbeats.toLocaleString(), sub: '~72 bpm avg' },
              { label: 'Breaths', val: breaths.toLocaleString(), sub: '~15/min avg' },
              { label: 'Blinks', val: blinks.toLocaleString(), sub: '~15/min avg' },
            ].map(item => (
              <div key={item.label} className="p-3 rounded-lg text-center" style={{ background: '#1A1726' }}>
                <div className="text-xs" style={{ color: '#8B8A90' }}>{item.label}</div>
                <div className="text-sm font-bold" style={{ color: '#E8970A' }}>{item.val}</div>
                <div className="text-[10px]" style={{ color: '#8B8A90' }}>{item.sub}</div>
              </div>
            ))}
          </div>

          {/* Famous birthdays */}
          <div className="p-4 rounded-lg" style={{ background: '#1A1726' }}>
            <div className="text-xs font-bold mb-2" style={{ color: '#E8970A' }}>Famous people born in {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(bd)}</div>
            <div className="flex flex-wrap gap-2">
              {monthBirthdays.map(p => (
                <span key={p} className="text-xs px-2 py-1 rounded" style={{ background: '#0F0D1A', color: '#E0DFE3' }}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // TAB 9: STOPWATCH
  // ═══════════════════════════════════════════════════════════
  function renderStopwatch() {
    const ms = swElapsed
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const centis = Math.floor((ms % 1000) / 10)

    const addLap = () => setSwLaps([...swLaps, swElapsed])
    const resetSw = () => { setSwRunning(false); setSwElapsed(0); setSwLaps([]) }

    return (
      <div className="space-y-6">
        <div className={cardCls} style={cardStyle}>
          <div className="text-center">
            <div className="text-6xl sm:text-8xl font-bold tracking-wide" style={{ fontFamily: 'Playfair Display, serif', color: '#E8970A' }}>
              {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              <span className="text-3xl sm:text-4xl opacity-60">.{String(centis).padStart(2, '0')}</span>
            </div>
            <div className="flex justify-center gap-3 mt-6">
              <button className={btnCls} style={btnPrimary} onClick={() => setSwRunning(!swRunning)}>
                {swRunning ? '⏸ Stop' : swElapsed > 0 ? '▶ Resume' : '▶ Start'}
              </button>
              {swRunning && <button className={btnCls} style={btnSecondary} onClick={addLap}>Lap</button>}
              {!swRunning && swElapsed > 0 && <button className={btnCls} style={btnSecondary} onClick={resetSw}>Reset</button>}
            </div>
            <div className="text-xs mt-3" style={{ color: '#8B8A90' }}>Press Space to start/stop</div>
          </div>

          {swLaps.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-bold mb-2" style={{ color: '#8B8A90' }}>Laps</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2" style={{ color: '#8B8A90' }}>#</th>
                      <th className="text-left p-2" style={{ color: '#8B8A90' }}>Lap Time</th>
                      <th className="text-left p-2" style={{ color: '#8B8A90' }}>Split</th>
                      <th className="text-left p-2" style={{ color: '#8B8A90' }}>Delta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {swLaps.map((lap, i) => {
                      const split = i === 0 ? lap : lap - swLaps[i - 1]
                      const delta = i === 0 ? '' : (split > (swLaps[i - 1] - (i > 1 ? swLaps[i - 2] : 0)) ? '+' : '-')
                      const fmtTime = (ms: number) => {
                        const m = Math.floor(ms / 60000)
                        const s = Math.floor((ms % 60000) / 1000)
                        const c = Math.floor((ms % 1000) / 10)
                        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(c).padStart(2, '0')}`
                      }
                      return (
                        <tr key={i} style={{ borderTop: '1px solid #1A1726' }}>
                          <td className="p-2" style={{ color: '#E0DFE3' }}>{i + 1}</td>
                          <td className="p-2 font-mono" style={{ color: '#E8970A' }}>{fmtTime(lap)}</td>
                          <td className="p-2 font-mono" style={{ color: '#E0DFE3' }}>{fmtTime(split)}</td>
                          <td className="p-2" style={{ color: delta === '+' ? '#ef4444' : '#22c55e' }}>{delta}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // TAB 10: TIMER
  // ═══════════════════════════════════════════════════════════
  function renderTimer() {
    const presets = [
      { label: '1 min', secs: 60 },
      { label: '3 min', secs: 180 },
      { label: '5 min', secs: 300 },
      { label: '10 min', secs: 600 },
      { label: '15 min', secs: 900 },
      { label: '25 min', secs: 1500 },
      { label: '30 min', secs: 1800 },
      { label: '1 hr', secs: 3600 },
    ]

    const totalMs = timerDuration * 1000
    const progress = totalMs > 0 ? 1 - (timerRemaining / totalMs) : 0
    const remaining = timerRemaining / 1000
    const hours = Math.floor(remaining / 3600)
    const minutes = Math.floor((remaining % 3600) / 60)
    const seconds = Math.floor(remaining % 60)

    const startTimer = (secs: number) => {
      setTimerDuration(secs)
      setTimerRemaining(secs * 1000)
      setTimerRunning(true)
    }

    const startCustom = () => {
      const total = timerCustomH * 3600 + timerCustomM * 60 + timerCustomS
      if (total > 0) startTimer(total)
    }

    // SVG progress ring
    const radius = 90
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference * (1 - progress)

    return (
      <div className="space-y-6">
        <div className={cardCls} style={cardStyle}>
          {/* Presets */}
          <div className="flex flex-wrap gap-2 mb-6">
            {presets.map(p => (
              <button key={p.label} className={btnCls} style={timerDuration === p.secs && timerRunning ? btnPrimary : btnSecondary} onClick={() => startTimer(p.secs)}>
                {p.label}{p.secs === 1500 ? ' 🍅' : ''}
              </button>
            ))}
          </div>

          {/* Custom */}
          <div className="flex items-end gap-2 mb-6">
            <div>
              <label className="text-[10px] block" style={{ color: '#8B8A90' }}>H</label>
              <input type="number" className={inputCls} style={{ ...inputStyle, width: 60 }} min={0} max={23} value={timerCustomH} onChange={e => setTimerCustomH(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-[10px] block" style={{ color: '#8B8A90' }}>M</label>
              <input type="number" className={inputCls} style={{ ...inputStyle, width: 60 }} min={0} max={59} value={timerCustomM} onChange={e => setTimerCustomM(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-[10px] block" style={{ color: '#8B8A90' }}>S</label>
              <input type="number" className={inputCls} style={{ ...inputStyle, width: 60 }} min={0} max={59} value={timerCustomS} onChange={e => setTimerCustomS(Number(e.target.value))} />
            </div>
            <button className={btnCls} style={btnPrimary} onClick={startCustom}>Start</button>
          </div>

          {/* Display */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r={radius} fill="none" stroke="#1A1726" strokeWidth="8" />
                <circle
                  cx="100" cy="100" r={radius}
                  fill="none" stroke="#E8970A" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 100 100)"
                  style={{ transition: 'stroke-dashoffset 0.1s' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: timerRemaining === 0 && timerDuration > 0 ? '#ef4444' : '#E8970A' }}>
                  {timerRemaining === 0 && timerDuration > 0 && progress >= 1 ? "Time's up!" :
                    `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              {timerRunning ? (
                <button className={btnCls} style={btnPrimary} onClick={() => setTimerRunning(false)}>⏸ Pause</button>
              ) : timerRemaining > 0 ? (
                <button className={btnCls} style={btnPrimary} onClick={() => setTimerRunning(true)}>▶ Resume</button>
              ) : null}
              {(timerRunning || timerRemaining > 0) && (
                <button className={btnCls} style={btnSecondary} onClick={() => { setTimerRunning(false); setTimerRemaining(0) }}>Reset</button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // TAB 11: SUN & MOON
  // ═══════════════════════════════════════════════════════════
  function renderSunMoon() {
    const city = CITIES[sunMoonCity]
    const sun = getSunTimes(city.lat, city.lng, now)
    const phase = getMoonPhase(now)
    const moonInfo = getMoonPhaseName(phase)

    // Days until next full moon
    let daysToFull = 0
    const checkDate = new Date(now)
    for (let i = 1; i <= 30; i++) {
      checkDate.setDate(checkDate.getDate() + 1)
      const p = getMoonPhase(checkDate)
      if (Math.abs(p - 0.5) < 0.02) { daysToFull = i; break }
    }

    return (
      <div className="space-y-6">
        <div className={cardCls} style={cardStyle}>
          <h3 className="text-lg font-bold mb-4" style={{ color: '#E0DFE3', fontFamily: 'Playfair Display, serif' }}>Sun & Moon</h3>
          <select className={inputCls} style={{ ...inputStyle, maxWidth: 250 }} value={sunMoonCity} onChange={e => setSunMoonCity(Number(e.target.value))}>
            {CITIES.map((c, i) => <option key={i} value={i}>{c.name}, {c.country}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sun */}
          <div className={cardCls} style={cardStyle}>
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#E8970A', fontFamily: 'Playfair Display, serif' }}>
              ☀️ Sunlight — {city.name}
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl">🌅</div>
                <div className="text-xs mt-1" style={{ color: '#8B8A90' }}>Sunrise</div>
                <div className="font-bold" style={{ color: '#E8970A' }}>{formatSunTime(sun.sunrise, city.timezone)}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl">🌇</div>
                <div className="text-xs mt-1" style={{ color: '#8B8A90' }}>Sunset</div>
                <div className="font-bold" style={{ color: '#E8970A' }}>{formatSunTime(sun.sunset, city.timezone)}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl">⏱️</div>
                <div className="text-xs mt-1" style={{ color: '#8B8A90' }}>Day Length</div>
                <div className="font-bold" style={{ color: '#E8970A' }}>
                  {Math.floor(sun.dayLength)}h {Math.round((sun.dayLength % 1) * 60)}m
                </div>
              </div>
            </div>
            <div className="text-xs mt-4" style={{ color: '#8B8A90' }}>
              Lat: {city.lat.toFixed(2)}° &middot; Lng: {city.lng.toFixed(2)}° &middot; Approximate calculation
            </div>
          </div>

          {/* Moon */}
          <div className={cardCls} style={cardStyle}>
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#E8970A', fontFamily: 'Playfair Display, serif' }}>
              🌙 Moon Phase
            </h4>
            <div className="text-center">
              <div className="text-7xl mb-3">{moonInfo.emoji}</div>
              <div className="text-xl font-bold" style={{ color: '#E0DFE3' }}>{moonInfo.name}</div>
              <div className="text-sm mt-1" style={{ color: '#8B8A90' }}>
                Illumination: ~{Math.round(phase < 0.5 ? phase * 200 : (1 - phase) * 200)}%
              </div>
              <div className="mt-4 p-3 rounded-lg" style={{ background: '#1A1726' }}>
                <div className="text-xs" style={{ color: '#8B8A90' }}>Next Full Moon</div>
                <div className="text-lg font-bold" style={{ color: '#E8970A' }}>
                  {daysToFull > 0 ? `${daysToFull} days` : 'Tonight!'}
                </div>
              </div>
              {/* Phase visual strip */}
              <div className="flex justify-center gap-1 mt-4">
                {['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'].map((e, i) => (
                  <div key={i} className="text-2xl" style={{ opacity: Math.abs(phase - i / 8) < 0.0625 ? 1 : 0.3 }}>{e}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // TAB 12: UNIX TIMESTAMP
  // ═══════════════════════════════════════════════════════════
  function renderUnix() {
    const currentUnix = Math.floor(now.getTime() / 1000)

    const parsedFromUnix = (() => {
      if (!unixInput) return null
      const n = parseInt(unixInput)
      if (isNaN(n)) return null
      const d = new Date(n * 1000)
      return new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(d)
    })()

    const parsedToUnix = (() => {
      if (!unixDateInput) return null
      const d = new Date(unixDateInput)
      if (isNaN(d.getTime())) return null
      return Math.floor(d.getTime() / 1000)
    })()

    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text).catch(() => {})
    }

    return (
      <div className="space-y-6">
        <div className={cardCls} style={cardStyle}>
          <h3 className="text-lg font-bold mb-2" style={{ color: '#E0DFE3', fontFamily: 'Playfair Display, serif' }}>Current Unix Timestamp</h3>
          <div className="flex items-center gap-3">
            <div className="text-4xl font-bold font-mono" style={{ color: '#E8970A' }}>{currentUnix}</div>
            <button className={btnCls} style={btnSecondary} onClick={() => copyToClipboard(currentUnix.toString())}>Copy</button>
          </div>
          <div className="text-xs mt-1" style={{ color: '#8B8A90' }}>Seconds since January 1, 1970 00:00:00 UTC</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Unix to Date */}
          <div className={cardCls} style={cardStyle}>
            <h4 className="text-sm font-bold mb-3" style={{ color: '#E8970A' }}>Unix Timestamp → Date</h4>
            <input className={inputCls} style={inputStyle} placeholder="Enter Unix timestamp" value={unixInput} onChange={e => setUnixInput(e.target.value)} />
            {parsedFromUnix && (
              <div className="mt-3 p-3 rounded-lg flex items-center justify-between" style={{ background: '#1A1726' }}>
                <span className="text-sm" style={{ color: '#E0DFE3' }}>{parsedFromUnix}</span>
                <button className="text-xs" style={{ color: '#E8970A' }} onClick={() => copyToClipboard(parsedFromUnix)}>Copy</button>
              </div>
            )}
          </div>

          {/* Date to Unix */}
          <div className={cardCls} style={cardStyle}>
            <h4 className="text-sm font-bold mb-3" style={{ color: '#E8970A' }}>Date → Unix Timestamp</h4>
            <input type="datetime-local" className={inputCls} style={inputStyle} value={unixDateInput} onChange={e => setUnixDateInput(e.target.value)} />
            {parsedToUnix !== null && (
              <div className="mt-3 p-3 rounded-lg flex items-center justify-between" style={{ background: '#1A1726' }}>
                <span className="text-sm font-mono" style={{ color: '#E0DFE3' }}>{parsedToUnix}</span>
                <button className="text-xs" style={{ color: '#E8970A' }} onClick={() => copyToClipboard(parsedToUnix.toString())}>Copy</button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // TAB 13: WEEK NUMBER
  // ═══════════════════════════════════════════════════════════
  function renderWeekNumber() {
    const currentWeek = getISOWeek(now)
    const currentYear = now.getFullYear()

    // Build all weeks of the year
    const jan1 = new Date(currentYear, 0, 1)
    const weeks: { week: number; start: Date; end: Date }[] = []
    const d = new Date(jan1)
    // Move to Monday of week 1
    const dayOfWeek = d.getDay() || 7
    d.setDate(d.getDate() - dayOfWeek + 1)
    for (let w = 1; w <= 53; w++) {
      const start = new Date(d)
      const end = new Date(d)
      end.setDate(end.getDate() + 6)
      if (start.getFullYear() > currentYear && w > 1) break
      weeks.push({ week: w, start: new Date(start), end: new Date(end) })
      d.setDate(d.getDate() + 7)
    }

    const queriedWeek = weekDateInput ? getISOWeek(new Date(weekDateInput + 'T00:00:00')) : null

    return (
      <div className="space-y-6">
        <div className={cardCls} style={{ ...cardStyle, borderColor: '#E8970A' }}>
          <div className="text-center">
            <div className="text-sm" style={{ color: '#8B8A90' }}>Current Week Number</div>
            <div className="text-6xl font-bold" style={{ color: '#E8970A', fontFamily: 'Playfair Display, serif' }}>W{currentWeek}</div>
            <div className="text-sm mt-1" style={{ color: '#8B8A90' }}>ISO 8601 &middot; {currentYear}</div>
          </div>
        </div>

        {/* Query */}
        <div className={cardCls} style={cardStyle}>
          <h4 className="text-sm font-bold mb-3" style={{ color: '#E8970A' }}>What week is a specific date in?</h4>
          <input type="date" className={inputCls} style={{ ...inputStyle, maxWidth: 200 }} value={weekDateInput} onChange={e => setWeekDateInput(e.target.value)} />
          {queriedWeek && (
            <div className="mt-3 text-lg font-bold" style={{ color: '#E8970A' }}>
              {new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(weekDateInput + 'T00:00:00'))} is in Week {queriedWeek}
            </div>
          )}
        </div>

        {/* All weeks */}
        <div className={cardCls} style={cardStyle}>
          <h4 className="text-sm font-bold mb-3" style={{ color: '#E8970A' }}>All Weeks of {currentYear}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-96 overflow-y-auto">
            {weeks.map(w => (
              <div
                key={w.week}
                className="p-2 rounded text-center text-xs"
                style={{
                  background: w.week === currentWeek ? '#E8970A' : '#1A1726',
                  color: w.week === currentWeek ? '#070510' : '#E0DFE3',
                }}
              >
                <div className="font-bold">W{w.week}</div>
                <div style={{ opacity: 0.7, fontSize: '10px' }}>
                  {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(w.start)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // TAB 14: ROMAN NUMERALS
  // ═══════════════════════════════════════════════════════════
  function renderRoman() {
    const yearRoman = toRoman(now.getFullYear())
    const numResult = romanNumber ? toRoman(parseInt(romanNumber)) : ''
    const strResult = romanString ? fromRoman(romanString) : 0

    return (
      <div className="space-y-6">
        <div className={cardCls} style={{ ...cardStyle, borderColor: '#E8970A' }}>
          <div className="text-center">
            <div className="text-sm" style={{ color: '#8B8A90' }}>Current Year in Roman Numerals</div>
            <div className="text-5xl font-bold" style={{ color: '#E8970A', fontFamily: 'Playfair Display, serif' }}>{yearRoman}</div>
            <div className="text-sm mt-1" style={{ color: '#8B8A90' }}>{now.getFullYear()}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Number to Roman */}
          <div className={cardCls} style={cardStyle}>
            <h4 className="text-sm font-bold mb-3" style={{ color: '#E8970A' }}>Number → Roman Numeral</h4>
            <input type="number" className={inputCls} style={inputStyle} placeholder="Enter number (1-3999)" min={1} max={3999} value={romanNumber} onChange={e => setRomanNumber(e.target.value)} />
            {numResult && (
              <div className="mt-3 p-4 rounded-lg text-center" style={{ background: '#1A1726' }}>
                <div className="text-3xl font-bold" style={{ color: '#E8970A', fontFamily: 'Playfair Display, serif' }}>{numResult}</div>
              </div>
            )}
          </div>

          {/* Roman to Number */}
          <div className={cardCls} style={cardStyle}>
            <h4 className="text-sm font-bold mb-3" style={{ color: '#E8970A' }}>Roman Numeral → Number</h4>
            <input className={inputCls} style={inputStyle} placeholder="Enter Roman numeral (e.g. XLII)" value={romanString} onChange={e => setRomanString(e.target.value.toUpperCase())} />
            {romanString && strResult > 0 && (
              <div className="mt-3 p-4 rounded-lg text-center" style={{ background: '#1A1726' }}>
                <div className="text-3xl font-bold" style={{ color: '#E8970A', fontFamily: 'Playfair Display, serif' }}>{strResult.toLocaleString()}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // TAB 15: INTERNATIONAL CALL PLANNER
  // ═══════════════════════════════════════════════════════════
  function renderCallPlanner() {
    const fromCity = CITIES[callFrom]
    const toCity = CITIES[callTo]
    const fromTime = getTimeInZone(fromCity.timezone)
    const toTime = getTimeInZone(toCity.timezone)

    // Calculate offset difference
    const fromOffset = (() => {
      const d = new Date()
      const str = new Intl.DateTimeFormat('en-US', { timeZone: fromCity.timezone, timeZoneName: 'shortOffset' }).format(d)
      const match = str.match(/GMT([+-]?\d+:?\d*)/)
      if (!match) return 0
      const parts = match[1].split(':')
      return parseInt(parts[0]) + (parts[1] ? parseInt(parts[1]) / 60 : 0)
    })()
    const toOffset = (() => {
      const d = new Date()
      const str = new Intl.DateTimeFormat('en-US', { timeZone: toCity.timezone, timeZoneName: 'shortOffset' }).format(d)
      const match = str.match(/GMT([+-]?\d+:?\d*)/)
      if (!match) return 0
      const parts = match[1].split(':')
      return parseInt(parts[0]) + (parts[1] ? parseInt(parts[1]) / 60 : 0)
    })()
    const diff = toOffset - fromOffset

    // Find calling windows (both 8 AM - 10 PM)
    function getCallingWindows(): { fromHour: number; toHour: number }[] {
      const windows: { fromHour: number; toHour: number }[] = []
      for (let h = 0; h < 24; h++) {
        const theirH = ((h + diff) % 24 + 24) % 24
        if (h >= 8 && h <= 22 && theirH >= 8 && theirH <= 22) {
          windows.push({ fromHour: h, toHour: theirH })
        }
      }
      return windows
    }

    const windows = getCallingWindows()
    const presets = [
      { label: 'US → India', from: 0, to: 14 },
      { label: 'India → US', from: 14, to: 0 },
      { label: 'US → UK', from: 0, to: 22 },
    ]

    return (
      <div className="space-y-6">
        <div className={cardCls} style={cardStyle}>
          <h3 className="text-lg font-bold mb-4" style={{ color: '#E0DFE3', fontFamily: 'Playfair Display, serif' }}>International Call Planner</h3>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2 mb-4">
            {presets.map(p => (
              <button key={p.label} className={btnCls} style={btnSecondary} onClick={() => { setCallFrom(p.from); setCallTo(p.to) }}>{p.label}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#8B8A90' }}>Your City</label>
              <select className={inputCls} style={inputStyle} value={callFrom} onChange={e => setCallFrom(Number(e.target.value))}>
                {CITIES.map((c, i) => <option key={i} value={i}>{c.name}, {c.country}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#8B8A90' }}>Calling To</label>
              <select className={inputCls} style={inputStyle} value={callTo} onChange={e => setCallTo(Number(e.target.value))}>
                {CITIES.map((c, i) => <option key={i} value={i}>{c.name}, {c.country}</option>)}
              </select>
            </div>
          </div>

          {/* Current times */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-lg text-center" style={{ background: '#1A1726' }}>
              <div className="text-xs" style={{ color: '#8B8A90' }}>{fromCity.name}</div>
              <div className="text-2xl font-bold" style={{ color: '#E8970A', fontFamily: 'Playfair Display, serif' }}>{fromTime.fullStr}</div>
              <div className="text-xs" style={{ color: '#8B8A90' }}>{fromTime.dateStr}</div>
            </div>
            <div className="p-4 rounded-lg text-center" style={{ background: '#1A1726' }}>
              <div className="text-xs" style={{ color: '#8B8A90' }}>{toCity.name}</div>
              <div className="text-2xl font-bold" style={{ color: '#E8970A', fontFamily: 'Playfair Display, serif' }}>{toTime.fullStr}</div>
              <div className="text-xs" style={{ color: '#8B8A90' }}>{toTime.dateStr}</div>
            </div>
          </div>

          {/* Time difference */}
          <div className="p-4 rounded-lg mb-6 text-center" style={{ background: '#1A1726', borderLeft: '3px solid #E8970A' }}>
            <div className="text-sm" style={{ color: '#8B8A90' }}>Time Difference</div>
            <div className="text-2xl font-bold" style={{ color: '#E8970A' }}>
              {diff > 0 ? '+' : ''}{diff % 1 === 0 ? diff : diff.toFixed(1)} hours
            </div>
            <div className="text-xs" style={{ color: '#8B8A90' }}>
              {toCity.name} is {Math.abs(diff)} hours {diff > 0 ? 'ahead of' : 'behind'} {fromCity.name}
            </div>
          </div>

          {/* Calling windows */}
          <div>
            <h4 className="text-sm font-bold mb-3" style={{ color: '#E8970A' }}>Best Calling Windows (8 AM - 10 PM both sides)</h4>
            {windows.length === 0 ? (
              <div className="p-4 rounded-lg text-center" style={{ background: '#1A1726' }}>
                <div className="text-sm" style={{ color: '#8B8A90' }}>No overlapping hours where both cities are between 8 AM and 10 PM.</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {windows.map((w, i) => {
                  const fromAmPm = w.fromHour >= 12 ? 'PM' : 'AM'
                  const toAmPm = w.toHour >= 12 ? 'PM' : 'AM'
                  const f12 = w.fromHour % 12 || 12
                  const t12 = w.toHour % 12 || 12
                  return (
                    <div key={i} className="p-2 rounded-lg text-center" style={{ background: '#1A1726' }}>
                      <div className="text-xs font-bold" style={{ color: '#E8970A' }}>{f12}:00 {fromAmPm}</div>
                      <div className="text-[10px]" style={{ color: '#8B8A90' }}>{fromCity.name}</div>
                      <div className="text-[10px] my-0.5" style={{ color: '#8B8A90' }}>↕</div>
                      <div className="text-xs font-bold" style={{ color: '#E0DFE3' }}>{t12}:00 {toAmPm}</div>
                      <div className="text-[10px]" style={{ color: '#8B8A90' }}>{toCity.name}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════
  function renderActiveTab() {
    switch (activeTab) {
      case 'world-clock': return renderWorldClock()
      case 'tz-converter': return renderTZConverter()
      case 'meeting': return renderMeetingPlanner()
      case 'calendar': return renderCalendar()
      case 'holidays': return renderHolidays()
      case 'countdown': return renderCountdown()
      case 'date-calc': return renderDateCalc()
      case 'age-calc': return renderAgeCalc()
      case 'stopwatch': return renderStopwatch()
      case 'timer': return renderTimer()
      case 'sun-moon': return renderSunMoon()
      case 'unix': return renderUnix()
      case 'week-number': return renderWeekNumber()
      case 'roman': return renderRoman()
      case 'call-planner': return renderCallPlanner()
      default: return renderWorldClock()
    }
  }

  return (
    <div className="min-h-screen bg-[#070510] text-white">
      

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#E0DFE3' }}>
            Time & Date Tools
          </h1>
          <p className="text-sm sm:text-base mt-3 max-w-2xl mx-auto" style={{ color: '#8B8A90' }}>
            The most comprehensive free time tools on the internet. World clock, timezone converter, calendars, calculators, and more.
          </p>
        </div>

        {/* Intro Section */}
        <div className="mb-8 rounded-2xl border border-[#1A1726] bg-gradient-to-r from-[#0F0D1A] to-[#141020] p-6">
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full border-2 border-blue-500/60 bg-blue-500/10 flex items-center justify-center text-blue-400 text-[10px] font-bold">9 AM</div>
              <span className="text-[10px] text-gray-500">NYC</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full border-2 border-purple-500/60 bg-purple-500/10 flex items-center justify-center text-purple-400 text-[10px] font-bold">2 PM</div>
              <span className="text-[10px] text-gray-500">London</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full border-2 border-[#E8970A]/60 bg-[#E8970A]/10 flex items-center justify-center text-[#E8970A] text-[10px] font-bold">6:30</div>
              <span className="text-[10px] text-gray-500">Mumbai</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full border-2 border-green-500/60 bg-green-500/10 flex items-center justify-center text-green-400 text-[10px] font-bold">11 PM</div>
              <span className="text-[10px] text-gray-500">Tokyo</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>View world times</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Add cities</span>
            <span className="text-gray-600">&rarr;</span>
            <span className="bg-[#E8970A]/15 text-[#E8970A] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Compare zones</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            <strong className="text-gray-400">Tip:</strong> Shows time difference from your location.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-1.5 p-1.5 rounded-xl" style={{ background: '#0F0D1A' }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all"
                style={{
                  background: activeTab === tab.id ? '#E8970A' : 'transparent',
                  color: activeTab === tab.id ? '#070510' : '#8B8A90',
                }}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Tab Content */}
        {renderActiveTab()}
      </main>

      
    </div>
  )
}
