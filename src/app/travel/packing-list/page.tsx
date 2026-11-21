'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { COUNTRIES } from '@/data/travel/destinations'

// ─── Types ───────────────────────────────────────────────
interface PackingItem {
  id: string
  name: string
  category: string
  note?: string
}

type TripType = 'city' | 'beach' | 'hiking' | 'mixed'
type Duration = '3-days' | '1-week' | '2-weeks'
type TravelingWith = 'solo' | 'couple' | 'family'

// ─── Climate Classification ──────────────────────────────
function classifyClimate(tempHigh: number, rainfall: number): {
  isHot: boolean
  isCold: boolean
  isMild: boolean
  isRainy: boolean
  isMonsoon: boolean
} {
  return {
    isHot: tempHigh >= 28,
    isCold: tempHigh <= 12,
    isMild: tempHigh > 12 && tempHigh < 28,
    isRainy: rainfall >= 80,
    isMonsoon: rainfall >= 200,
  }
}

// ─── Region detection ────────────────────────────────────
function getRegion(
  countryId: string
): 'se-asia' | 'south-asia' | 'middle-east' | 'africa' | 'latin-america' | 'europe' | 'north-america' | 'oceania' | 'east-asia' {
  const seAsia = ['thailand', 'vietnam', 'cambodia', 'indonesia', 'malaysia', 'philippines', 'singapore']
  const southAsia = ['india', 'nepal', 'sri-lanka', 'maldives']
  const middleEast = ['turkey', 'uae', 'jordan', 'israel', 'oman']
  const africa = ['egypt', 'morocco', 'kenya', 'tanzania', 'south-africa']
  const latinAmerica = ['mexico', 'peru', 'brazil', 'argentina', 'colombia', 'cuba', 'ecuador', 'jamaica', 'costa-rica']
  const oceania = ['australia', 'new-zealand']
  const eastAsia = ['japan', 'south-korea', 'china']

  if (seAsia.includes(countryId)) return 'se-asia'
  if (southAsia.includes(countryId)) return 'south-asia'
  if (middleEast.includes(countryId)) return 'middle-east'
  if (africa.includes(countryId)) return 'africa'
  if (latinAmerica.includes(countryId)) return 'latin-america'
  if (oceania.includes(countryId)) return 'oceania'
  if (eastAsia.includes(countryId)) return 'east-asia'
  if (countryId === 'usa' || countryId === 'canada') return 'north-america'
  return 'europe'
}

// ─── Packing List Generator ─────────────────────────────
function generatePackingList(
  countryId: string,
  month: number,
  tripType: TripType,
  duration: Duration,
  travelingWith: TravelingWith
): PackingItem[] {
  const country = COUNTRIES.find((c) => c.id === countryId)
  if (!country) return []

  // Find weather for the selected month from the first city
  const firstCity = country.states[0]?.cities[0]
  const weather = firstCity?.weather[month]
  const climate = weather
    ? classifyClimate(weather.tempHigh, weather.rainfall)
    : { isHot: false, isCold: false, isMild: true, isRainy: false, isMonsoon: false }

  const region = getRegion(countryId)
  const items: PackingItem[] = []
  let id = 0
  const add = (category: string, name: string, note?: string) => {
    items.push({ id: `item-${id++}`, name, category, note })
  }

  // ── ESSENTIALS (always) ──
  add('Essentials', 'Passport (valid 6+ months)', 'Check expiry date well before departure')
  add('Essentials', 'Passport copies (2 printed + digital)', 'Store separately from passport; email a copy to yourself')
  add('Essentials', 'Travel insurance documents', 'Print policy number and emergency contact')
  add('Essentials', 'Phone charger + cable', '')
  add('Essentials', 'Universal power adapter', country.currency ? `${country.name} uses ${country.currency.code}` : '')
  add('Essentials', 'Cash in local currency', `${country.currency.name} (${country.currency.symbol})`)
  add('Essentials', 'Credit/debit card (notify bank)', 'Inform bank of travel dates to avoid blocks')
  add('Essentials', 'Pen (for immigration forms)', '')

  // ── DOCUMENTS ──
  const visaInfo = country.visaInfo[0]
  if (visaInfo) {
    add('Documents', `Visa: ${visaInfo.requirement}`, `Cost: ${visaInfo.cost}, Duration: ${visaInfo.duration}`)
  }
  add('Documents', 'Flight tickets / booking confirmations', 'Print + digital copies')
  add('Documents', 'Hotel reservations', 'Print + digital copies')
  add('Documents', 'Emergency contacts list', 'Local embassy number + personal contacts')

  if (region === 'africa' || region === 'se-asia' || region === 'south-asia' || region === 'latin-america') {
    add('Documents', 'Vaccination card / Yellow Card', 'Check CDC/WHO requirements for ' + country.name)
  }
  if (region === 'middle-east' || region === 'africa') {
    add('Documents', 'International Driving Permit', 'If planning to rent a car')
  }

  // ── CLOTHING (based on weather) ──
  if (climate.isHot) {
    add('Clothing', 'Lightweight breathable shirts (3-5)', 'Cotton or moisture-wicking; light colours')
    add('Clothing', 'Shorts / lightweight trousers (2-3)', '')
    add('Clothing', 'Sundress / light skirt (1-2)', 'Optional')
    add('Clothing', 'Swimsuit', '')
    add('Clothing', 'Wide-brim sun hat', 'Essential for sun protection')
    add('Clothing', 'Sunglasses (UV400)', '')
    add('Clothing', 'Flip-flops / sandals', '')
    add('Clothing', 'Light cardigan for AC', 'Many restaurants and transport are heavily air-conditioned')
  } else if (climate.isCold) {
    add('Clothing', 'Thermal base layer (top + bottom)', 'Merino wool recommended')
    add('Clothing', 'Warm fleece / jumper (2)', '')
    add('Clothing', 'Insulated jacket / down coat', 'Packable down is ideal')
    add('Clothing', 'Long trousers (2-3)', 'Jeans or warm travel pants')
    add('Clothing', 'Warm socks (3-4 pairs)', 'Merino wool for warmth')
    add('Clothing', 'Scarf / neck gaiter', '')
    add('Clothing', 'Warm hat / beanie', '')
    add('Clothing', 'Gloves', 'Touch-screen compatible')
    add('Clothing', 'Waterproof boots / warm shoes', '')
  } else {
    // Mild
    add('Clothing', 'T-shirts / casual tops (3-5)', 'Mix of short and long sleeve')
    add('Clothing', 'Light jacket / hoodie', 'For evenings')
    add('Clothing', 'Trousers / jeans (2)', '')
    add('Clothing', 'Shorts (1-2)', 'If warm enough')
    add('Clothing', 'Comfortable walking shoes', 'Broken-in, supportive')
    add('Clothing', 'Sunglasses', '')
    add('Clothing', 'Light scarf', 'Versatile for layering or temple visits')
  }

  if (climate.isRainy || climate.isMonsoon) {
    add('Clothing', 'Rain jacket / waterproof shell', climate.isMonsoon ? 'Essential - heavy monsoon rains expected' : 'Afternoon showers common')
    add('Clothing', 'Compact umbrella', '')
    if (climate.isMonsoon) {
      add('Clothing', 'Waterproof bag/pouch for electronics', 'Protect phone and camera from sudden downpours')
      add('Clothing', 'Quick-dry clothing', 'Avoid cotton; synthetic or merino dry faster')
    }
  }

  // Duration extras
  if (duration === '2-weeks') {
    add('Clothing', 'Extra underwear (7+ pairs)', 'Or plan for laundry mid-trip')
    add('Clothing', 'Laundry bag', 'Separate dirty clothes')
    add('Clothing', 'Travel laundry sheets', 'For hand-washing in sink')
  } else if (duration === '1-week') {
    add('Clothing', 'Underwear (5-7 pairs)', '')
    add('Clothing', 'Socks (5-7 pairs)', '')
  } else {
    add('Clothing', 'Underwear (3-4 pairs)', '')
    add('Clothing', 'Socks (3-4 pairs)', '')
  }

  // Trip type specifics
  if (tripType === 'beach' || tripType === 'mixed') {
    add('Clothing', 'Swimsuit (2 if beach-focused)', 'One to wear, one to dry')
    add('Clothing', 'Beach cover-up / sarong', 'Also useful as a towel or temple cover')
    add('Clothing', 'Water shoes / reef shoes', 'If visiting rocky beaches or snorkelling')
  }
  if (tripType === 'hiking' || tripType === 'mixed') {
    add('Clothing', 'Hiking boots (broken-in)', 'Never hike in new boots')
    add('Clothing', 'Hiking socks (2-3 pairs)', 'Merino wool cushioned')
    add('Clothing', 'Quick-dry hiking pants', 'Zip-off legs are versatile')
    add('Clothing', 'Base layer (moisture-wicking)', '')
    add('Clothing', 'Daypack (20-30L)', 'For day hikes from your base')
  }

  // ── TOILETRIES ──
  add('Toiletries', 'Toothbrush + toothpaste', 'Travel size; bamboo toothbrush eco-friendly')
  add('Toiletries', 'Shampoo + conditioner (travel size)', 'Solid bars save space and avoid liquid limits')
  add('Toiletries', 'Deodorant', '')
  add('Toiletries', 'Sunscreen (SPF 50+)', climate.isHot ? 'Reef-safe if visiting beaches' : 'Even in cold weather, UV is strong at altitude')
  add('Toiletries', 'Lip balm with SPF', '')
  add('Toiletries', 'Personal medications', 'Bring prescription copy; original packaging')
  add('Toiletries', 'Basic first aid kit', 'Plasters, antiseptic, painkillers, anti-diarrhea')
  add('Toiletries', 'Hand sanitizer', '')
  add('Toiletries', 'Tissues / wet wipes', 'Useful everywhere, essential in Asia and Africa')

  if (climate.isHot || region === 'se-asia' || region === 'south-asia' || region === 'africa' || region === 'latin-america') {
    add('Toiletries', 'Insect repellent (DEET 30%+)', `Mosquitoes common in ${country.name}; apply at dusk`)
    add('Toiletries', 'After-bite cream', '')
  }
  if (climate.isHot) {
    add('Toiletries', 'Aloe vera gel', 'For sunburn relief')
  }

  // ── TECH ──
  add('Tech', 'Smartphone', 'Download offline maps (Google Maps / maps.me)')
  add('Tech', 'Portable power bank (10,000+ mAh)', 'Essential for long days out')
  add('Tech', 'Earbuds / headphones', 'For flights and transit')
  add('Tech', 'Camera (optional)', 'Or rely on smartphone')
  if (duration === '1-week' || duration === '2-weeks') {
    add('Tech', 'E-reader / book', 'For transit and downtime')
  }
  add('Tech', 'eSIM or local SIM plan', `Research data plans for ${country.name} before arriving`)

  // ── DESTINATION-SPECIFIC ──
  // Temple/religious site modesty
  if (
    region === 'se-asia' ||
    region === 'south-asia' ||
    region === 'middle-east' ||
    countryId === 'turkey' ||
    countryId === 'japan'
  ) {
    add('Destination-Specific', 'Modest clothing for temples/mosques', 'Cover shoulders and knees; carry a scarf or sarong')
  }
  if (region === 'middle-east') {
    add('Destination-Specific', 'Head covering (women)', 'Required in mosques; recommended in conservative areas')
  }
  // Mosquito / tropical
  if (region === 'se-asia' || region === 'south-asia') {
    add('Destination-Specific', 'Mosquito net (if budget travel)', 'Some hostels/guesthouses may not provide')
    add('Destination-Specific', 'Water purification tablets', 'Do not drink tap water')
    add('Destination-Specific', 'Toilet paper / tissues', 'Not always provided in public restrooms')
  }
  if (region === 'africa') {
    add('Destination-Specific', 'Antimalarial medication', 'Consult travel doctor 4-6 weeks before departure')
    add('Destination-Specific', 'Headlamp / torch', 'Power cuts possible; useful for safaris at dawn')
  }
  if (countryId === 'japan') {
    add('Destination-Specific', 'Pocket Wi-Fi or Japan eSIM', 'Essential for navigation; rent at airport')
    add('Destination-Specific', 'Cash (Japan is still cash-heavy)', 'Many restaurants and shops don\'t accept cards')
  }
  if (countryId === 'india' || countryId === 'nepal') {
    add('Destination-Specific', 'Water purification (LifeStraw or tablets)', 'Never drink tap water')
    add('Destination-Specific', 'Earplugs', 'Traffic noise, temple bells, and dawn calls to prayer')
  }
  if (region === 'latin-america') {
    add('Destination-Specific', 'Spanish phrasebook or app', 'English is limited outside tourist zones')
    add('Destination-Specific', 'Money belt / hidden pouch', 'Keep valuables secure in crowded areas')
  }
  if (tripType === 'hiking' && (countryId === 'nepal' || countryId === 'peru')) {
    add('Destination-Specific', 'Altitude sickness medication (Diamox)', 'Consult doctor before trip; acclimatize gradually')
    add('Destination-Specific', 'Trekking poles', 'Rent locally if you prefer not to carry')
  }

  // ── FAMILY EXTRAS ──
  if (travelingWith === 'family') {
    add('Family Extras', 'Children\'s medications (age-appropriate)', 'Fever reducer, allergy meds, oral rehydration salts')
    add('Family Extras', 'Snacks for kids', 'Familiar snacks for picky eaters; energy bars')
    add('Family Extras', 'Entertainment for travel', 'Tablet with downloaded content, colouring books, small toys')
    add('Family Extras', 'Baby/child carrier (if applicable)', 'Ergonomic carrier for hiking or cobblestones')
    add('Family Extras', 'Extra change of clothes for kids', 'In carry-on bag for spills and accidents')
    add('Family Extras', 'Children\'s sunscreen (SPF 50+)', 'Higher sensitivity requires dedicated formula')
    add('Family Extras', 'Child-safe insect repellent', region === 'se-asia' || region === 'south-asia' ? 'DEET-free options for young children' : '')
    add('Family Extras', 'Travel stroller / compact pushchair', 'Lightweight and foldable for flights')
    add('Family Extras', 'Waterproof phone case', 'Kids + water = phone risk')
    add('Family Extras', 'Copies of children\'s ID / birth certificates', 'Some countries require proof of parentage')
  }

  return items
}

// ─── Constants ───────────────────────────────────────────
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const TRIP_TYPES: { value: TripType; label: string; icon: string }[] = [
  { value: 'city', label: 'City', icon: '\uD83C\uDFD9\uFE0F' },
  { value: 'beach', label: 'Beach', icon: '\uD83C\uDFD6\uFE0F' },
  { value: 'hiking', label: 'Hiking', icon: '\u26F0\uFE0F' },
  { value: 'mixed', label: 'Mixed', icon: '\uD83C\uDF0D' },
]

const DURATIONS: { value: Duration; label: string }[] = [
  { value: '3-days', label: '3 Days' },
  { value: '1-week', label: '1 Week' },
  { value: '2-weeks', label: '2 Weeks' },
]

const TRAVELING_WITH: { value: TravelingWith; label: string; icon: string }[] = [
  { value: 'solo', label: 'Solo', icon: '\uD83E\uDDD1' },
  { value: 'couple', label: 'Couple', icon: '\uD83D\uDC91' },
  { value: 'family', label: 'Family with Kids', icon: '\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66' },
]

const STORAGE_KEY = 'zaxise-packing-list'

// ─── Component ──────────────────────────────────────────
export default function PackingListPage() {
  const [countryId, setCountryId] = useState('')
  const [month, setMonth] = useState(new Date().getMonth())
  const [tripType, setTripType] = useState<TripType>('city')
  const [duration, setDuration] = useState<Duration>('1-week')
  const [travelingWith, setTravelingWith] = useState<TravelingWith>('solo')
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [showList, setShowList] = useState(false)
  const [copied, setCopied] = useState(false)

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.countryId) setCountryId(parsed.countryId)
        if (parsed.month !== undefined) setMonth(parsed.month)
        if (parsed.tripType) setTripType(parsed.tripType)
        if (parsed.duration) setDuration(parsed.duration)
        if (parsed.travelingWith) setTravelingWith(parsed.travelingWith)
        if (parsed.checkedItems) setCheckedItems(parsed.checkedItems)
        if (parsed.showList) setShowList(parsed.showList)
      }
    } catch {
      // Ignore parse errors
    }
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (!showList) return
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ countryId, month, tripType, duration, travelingWith, checkedItems, showList })
      )
    } catch {
      // Ignore storage errors
    }
  }, [countryId, month, tripType, duration, travelingWith, checkedItems, showList])

  const packingList = useMemo(
    () => (showList ? generatePackingList(countryId, month, tripType, duration, travelingWith) : []),
    [countryId, month, tripType, duration, travelingWith, showList]
  )

  const categories = useMemo(() => {
    const cats: Record<string, PackingItem[]> = {}
    for (const item of packingList) {
      if (!cats[item.category]) cats[item.category] = []
      cats[item.category].push(item)
    }
    return cats
  }, [packingList])

  const totalItems = packingList.length
  const checkedCount = packingList.filter((item) => checkedItems[item.id]).length
  const progressPercent = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0

  const toggleItem = useCallback((id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const handleGenerate = () => {
    if (!countryId) return
    setCheckedItems({})
    setShowList(true)
  }

  const handleReset = () => {
    setShowList(false)
    setCheckedItems({})
    localStorage.removeItem(STORAGE_KEY)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    const country = COUNTRIES.find((c) => c.id === countryId)
    const text = Object.entries(categories)
      .map(
        ([cat, items]) =>
          `\n${cat}:\n${items.map((i) => `  ${checkedItems[i.id] ? '[x]' : '[ ]'} ${i.name}${i.note ? ` - ${i.note}` : ''}`).join('\n')}`
      )
      .join('\n')

    const fullText = `Packing List for ${country?.name ?? ''} - ${MONTHS[month]} (${TRIP_TYPES.find((t) => t.value === tripType)?.label} trip, ${DURATIONS.find((d) => d.value === duration)?.label})\n${text}\n\nGenerated by Zaxise`

    if (navigator.share) {
      try {
        await navigator.share({ title: `Packing List for ${country?.name}`, text: fullText })
      } catch {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(fullText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // Clipboard failed
      }
    }
  }

  const sortedCountries = useMemo(
    () => [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name)),
    []
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm print:hidden">
        <div className="mx-auto max-w-4xl px-4 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Smart Packing List Generator</h1>
              <p className="mt-1 text-sm text-slate-500">
                Customized packing lists based on your destination, weather, and trip style
              </p>
            </div>
            <a
              href="/"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
            >
              Zaxise
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Selection Form */}
        {!showList && (
          <div className="space-y-8">
            {/* Destination */}
            <section>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                1. Where are you going?
              </label>
              <select
                value={countryId}
                onChange={(e) => setCountryId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Select a country...</option>
                {sortedCountries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </section>

            {/* Month */}
            <section>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                2. When are you traveling?
              </label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {MONTHS.map((m, i) => (
                  <button
                    key={m}
                    onClick={() => setMonth(i)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      month === i
                        ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {m.slice(0, 3)}
                  </button>
                ))}
              </div>
            </section>

            {/* Trip Type */}
            <section>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                3. Trip type
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {TRIP_TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTripType(t.value)}
                    className={`flex flex-col items-center rounded-xl border px-4 py-4 transition ${
                      tripType === t.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl">{t.icon}</span>
                    <span className="mt-1 text-sm font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Duration */}
            <section>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                4. How long?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {DURATIONS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDuration(d.value)}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                      duration === d.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Traveling With */}
            <section>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                5. Traveling with
              </label>
              <div className="grid grid-cols-3 gap-3">
                {TRAVELING_WITH.map((tw) => (
                  <button
                    key={tw.value}
                    onClick={() => setTravelingWith(tw.value)}
                    className={`flex flex-col items-center rounded-xl border px-4 py-4 transition ${
                      travelingWith === tw.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl">{tw.icon}</span>
                    <span className="mt-1 text-xs font-medium sm:text-sm">{tw.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!countryId}
              className={`w-full rounded-xl px-6 py-4 text-lg font-semibold shadow-md transition ${
                countryId
                  ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                  : 'cursor-not-allowed bg-slate-200 text-slate-400'
              }`}
            >
              Generate My Packing List
            </button>
          </div>
        )}

        {/* Packing List Display */}
        {showList && packingList.length > 0 && (
          <div>
            {/* Summary bar */}
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm print:shadow-none">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                    {COUNTRIES.find((c) => c.id === countryId)?.flag}{' '}
                    {COUNTRIES.find((c) => c.id === countryId)?.name} &mdash; {MONTHS[month]}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {TRIP_TYPES.find((t) => t.value === tripType)?.label} trip &middot;{' '}
                    {DURATIONS.find((d) => d.value === duration)?.label} &middot;{' '}
                    {TRAVELING_WITH.find((tw) => tw.value === travelingWith)?.label}
                  </p>
                </div>
                <div className="flex gap-2 print:hidden">
                  <button
                    onClick={handlePrint}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
                  >
                    Print
                  </button>
                  <button
                    onClick={handleShare}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
                  >
                    {copied ? 'Copied!' : 'Share'}
                  </button>
                  <button
                    onClick={handleReset}
                    className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 shadow-sm transition hover:bg-red-50"
                  >
                    Start Over
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 print:hidden">
                <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {checkedCount} / {totalItems} items packed
                  </span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-6">
              {Object.entries(categories).map(([category, items]) => {
                const catChecked = items.filter((i) => checkedItems[i.id]).length
                return (
                  <section
                    key={category}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:break-inside-avoid print:shadow-none"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3">
                      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
                        {category}
                      </h3>
                      <span className="text-xs text-slate-400 print:hidden">
                        {catChecked}/{items.length}
                      </span>
                    </div>
                    <ul className="divide-y divide-slate-50">
                      {items.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-start gap-3 px-5 py-3 transition hover:bg-slate-50"
                        >
                          <input
                            type="checkbox"
                            checked={!!checkedItems[item.id]}
                            onChange={() => toggleItem(item.id)}
                            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500 print:h-4 print:w-4"
                          />
                          <div className="min-w-0 flex-1">
                            <span
                              className={`text-sm font-medium ${
                                checkedItems[item.id] ? 'text-slate-400 line-through' : 'text-slate-800'
                              }`}
                            >
                              {item.name}
                            </span>
                            {item.note && (
                              <p className="mt-0.5 text-xs text-slate-400">{item.note}</p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                )
              })}
            </div>

            {/* Bottom actions (mobile-friendly) */}
            <div className="mt-8 flex flex-wrap gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Print This List
              </button>
              <button
                onClick={handleShare}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                {copied ? 'Copied to Clipboard!' : 'Share This List'}
              </button>
            </div>
            <button
              onClick={handleReset}
              className="mt-3 w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 print:hidden"
            >
              Start Over with New Trip
            </button>
          </div>
        )}
      </main>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:break-inside-avoid {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  )
}
