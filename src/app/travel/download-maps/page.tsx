'use client'

import { useState, useMemo } from 'react'
import { COUNTRIES } from '@/data/travel/destinations'

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const GOOGLE_STEPS = [
  { step: 1, title: 'Open Google Maps', desc: 'Open the Google Maps app on your phone. Make sure you are signed in to your Google account.' },
  { step: 2, title: 'Search for your city', desc: 'Type the city you are visiting in the search bar — for example "Tokyo" or "Rome" — and tap search.' },
  { step: 3, title: 'Tap your profile picture', desc: 'Look in the top-right corner of the screen. Tap the circle with your profile picture or initial.' },
  { step: 4, title: 'Tap "Offline maps"', desc: 'In the menu that appears, scroll down and tap "Offline maps".' },
  { step: 5, title: 'Tap "Select your own map"', desc: 'You will see a button that says "Select your own map". Tap it.' },
  { step: 6, title: 'Zoom to cover the area', desc: 'Use your fingers to pinch and zoom the blue rectangle so it covers the entire area you need — city center, airport, and your hotel neighborhood.' },
  { step: 7, title: 'Tap "Download"', desc: 'When the area looks right, tap the "Download" button at the bottom of the screen.' },
  { step: 8, title: 'Wait for it to finish', desc: 'The download can be 50-500 MB depending on the size of the area. Stay connected to Wi-Fi until it is complete.' },
]

const GOOGLE_TIPS = [
  'Download on Wi-Fi before leaving your hotel or home — mobile data can be slow and expensive.',
  'Download each city separately (Tokyo, Kyoto, Osaka = 3 separate downloads).',
  'Maps expire after 30 days — update them before long trips.',
  'Navigation works offline but you will not get live traffic updates.',
  'Street View does NOT work offline — save screenshots of tricky intersections instead.',
]

const APPLE_STEPS = [
  'Open Settings on your iPhone.',
  'Scroll down and tap "Maps".',
  'Tap "Offline Maps".',
  'Tap "Download New Map".',
  'Search for a city or area.',
  'Adjust the area on the map, then tap "Download".',
]

const APPLE_BENEFITS = [
  'Includes turn-by-turn navigation offline.',
  'Smaller file sizes than Google Maps.',
  'Automatically updates when connected to Wi-Fi.',
  'Requires iOS 17 or later.',
]

const MAPSME_FEATURES = [
  'Completely free — no subscriptions or in-app purchases for maps.',
  'Download from the App Store (iPhone) or Play Store (Android).',
  'Download country or region maps before your trip.',
  'Better detail in rural areas than Google offline maps.',
  'Walking trails and hiking paths included.',
  'Bookmark your hotel, restaurants, and attractions for quick access.',
]

const OSMAND_FEATURES = [
  'Based on OpenStreetMap — updated by a worldwide community.',
  'Works fully offline once maps are downloaded.',
  'Topographic maps with contour lines for hiking.',
  'GPX track recording — record your hike and share it later.',
  'Best choice for nature trips, hiking, and off-the-beaten-path travel.',
  'Free version allows 7 map downloads. Paid version is a one-time purchase.',
]

const OTHER_DOWNLOADS = [
  { name: 'Google Translate offline language pack', desc: 'Download before your trip so you can translate signs and menus without data.' },
  { name: 'Uber / Grab / Ola app', desc: 'Install the ride-hailing app used in your destination before you arrive.' },
  { name: 'Airline app with boarding pass', desc: 'Download your boarding pass to your phone so you do not need Wi-Fi at the airport.' },
  { name: 'Hotel booking confirmation', desc: 'Screenshot or save the PDF. You may need the address for taxis or immigration.' },
  { name: 'WhatsApp', desc: 'The most common messaging app worldwide. Many hotels and tour operators use it.' },
  { name: 'Currency converter app', desc: 'XE or a similar app — open once on Wi-Fi to cache rates for offline use.' },
  { name: 'Google Lens', desc: 'Point your camera at signs, menus, or labels to get instant translations.' },
  { name: 'Spotify / Netflix downloads', desc: 'Download playlists and movies before your flight. Airport Wi-Fi is unreliable.' },
]

const STORAGE_ITEMS = [
  { item: '1 city offline map', size: '100 - 300 MB' },
  { item: '1 language pack (Google Translate)', size: '30 - 50 MB' },
  { item: '10 Spotify songs', size: '~50 MB' },
  { item: '1 Netflix movie (standard quality)', size: '500 MB - 1 GB' },
  { item: '100 photos from your camera roll', size: '~500 MB' },
]

/* Helper: estimate a map size from the number of cities */
function estimateSize(cityCount: number): string {
  if (cityCount <= 1) return '100 - 300 MB'
  if (cityCount <= 3) return '300 - 700 MB'
  if (cityCount <= 6) return '700 MB - 1.5 GB'
  return '1.5 - 3 GB'
}

/* Helper: key areas tip per population bracket */
function keyAreasTip(cityName: string): string {
  return `City center, main train/bus station, airport terminal area, and the neighborhood around your hotel. Search "${cityName}" in the app and zoom out slightly to cover all of these.`
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DownloadMapsPage() {
  const [selectedCountry, setSelectedCountry] = useState('')

  const country = useMemo(
    () => COUNTRIES.find((c) => c.id === selectedCountry) ?? null,
    [selectedCountry],
  )

  const allCities = useMemo(() => {
    if (!country) return []
    return country.states.flatMap((s) => s.cities)
  }, [country])

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-[#0F172A]">
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Download Maps Before You Go
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Never Get Lost Without WiFi
          </p>
          <p className="mt-4 text-white/75 max-w-xl mx-auto text-base">
            A step-by-step guide to getting offline maps on your phone — plus a city-by-city planner, storage tips, and printable emergency cards.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-20">

        {/* ────────────────────────────────────────────────────────── */}
        {/*  1. GOOGLE MAPS OFFLINE                                   */}
        {/* ────────────────────────────────────────────────────────── */}
        <section>
          <h2 className="font-serif text-3xl font-bold mb-2">Google Maps Offline — Step by Step</h2>
          <p className="text-[#0F172A]/70 mb-6">
            Google Maps is the easiest offline map option for most travelers. Follow these eight steps exactly.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GOOGLE_STEPS.map((s) => (
              <div key={s.step} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm flex gap-4">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0EA5E9] text-white flex items-center justify-center text-lg font-bold">
                  {s.step}
                </span>
                <div>
                  <h3 className="font-semibold text-base mb-1">{s.title}</h3>
                  <p className="text-sm text-[#0F172A]/75 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pro Tips */}
          <div className="mt-6 bg-[#FEF9C3] border border-[#F59E0B]/30 rounded-xl p-5">
            <h3 className="font-semibold text-[#92400E] mb-3 flex items-center gap-2">
              <span className="text-lg">*</span> Pro Tips
            </h3>
            <ul className="space-y-2">
              {GOOGLE_TIPS.map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm text-[#78350F]">
                  <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────── */}
        {/*  2. APPLE MAPS OFFLINE                                    */}
        {/* ────────────────────────────────────────────────────────── */}
        <section>
          <h2 className="font-serif text-3xl font-bold mb-2">Apple Maps Offline (iOS 17+)</h2>
          <p className="text-[#0F172A]/70 mb-6">
            If you use an iPhone running iOS 17 or later, Apple Maps now supports offline downloads.
          </p>

          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm mb-4">
            <h3 className="font-semibold mb-4">How to Download</h3>
            <ol className="space-y-3">
              {APPLE_STEPS.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#334155] text-white flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-sm">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <h3 className="font-semibold mb-3">Key Benefits</h3>
            <ul className="space-y-2">
              {APPLE_BENEFITS.map((b, i) => (
                <li key={i} className="flex gap-2 text-sm text-[#0F172A]/80">
                  <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[#334155]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────── */}
        {/*  3. MAPS.ME                                               */}
        {/* ────────────────────────────────────────────────────────── */}
        <section>
          <h2 className="font-serif text-3xl font-bold mb-2">Maps.me (Alternative)</h2>
          <p className="text-[#0F172A]/70 mb-6">
            A free, fully offline map app that many long-term travelers swear by.
          </p>
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <ul className="space-y-2">
              {MAPSME_FEATURES.map((f, i) => (
                <li key={i} className="flex gap-3 text-sm text-[#0F172A]/80">
                  <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────── */}
        {/*  4. OSMAND                                                */}
        {/* ────────────────────────────────────────────────────────── */}
        <section>
          <h2 className="font-serif text-3xl font-bold mb-2">OsmAnd (For Hikers)</h2>
          <p className="text-[#0F172A]/70 mb-6">
            The go-to choice for hikers, cyclists, and anyone heading into nature.
          </p>
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <ul className="space-y-2">
              {OSMAND_FEATURES.map((f, i) => (
                <li key={i} className="flex gap-3 text-sm text-[#0F172A]/80">
                  <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────── */}
        {/*  5. CITY-BY-CITY DOWNLOAD PLANNER                        */}
        {/* ────────────────────────────────────────────────────────── */}
        <section>
          <h2 className="font-serif text-3xl font-bold mb-2">City-by-City Download Planner</h2>
          <p className="text-[#0F172A]/70 mb-6">
            Select your destination country to see every city and what you need to download.
          </p>

          {/* Country selector */}
          <div className="mb-6">
            <label htmlFor="country-select" className="block text-sm font-medium mb-2">
              Choose a country
            </label>
            <select
              id="country-select"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
            >
              <option value="">-- Select a country --</option>
              {COUNTRIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          {country && (
            <div className="space-y-4">
              {/* Country summary */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                <h3 className="font-serif text-xl font-semibold mb-1 flex items-center gap-2">
                  <span className="text-2xl">{country.flag}</span>
                  {country.name}
                </h3>
                <p className="text-sm text-[#0F172A]/70 mb-2">
                  {allCities.length} {allCities.length === 1 ? 'city' : 'cities'} in our database
                  &mdash; estimated total map storage: <span className="font-semibold">{estimateSize(allCities.length)}</span>
                </p>
                <p className="text-sm text-[#0F172A]/60">
                  Language: {country.language.join(', ')} &bull; Currency: {country.currency.code} ({country.currency.symbol})
                </p>
              </div>

              {/* City cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allCities.map((city) => (
                  <div key={city.id} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                    <h4 className="font-semibold text-lg mb-2">{city.name}</h4>

                    <div className="space-y-2 text-sm text-[#0F172A]/80">
                      <div className="flex justify-between">
                        <span>Estimated map download</span>
                        <span className="font-medium text-[#0EA5E9]">~100 - 300 MB</span>
                      </div>

                      <div className="bg-[#FAFBFC] border border-[#E2E8F0] rounded-lg p-3">
                        <p className="font-medium text-xs text-[#0F172A]/60 uppercase tracking-wide mb-1">Download area tip</p>
                        <p className="text-sm leading-relaxed">{keyAreasTip(city.name)}</p>
                      </div>

                      <div className="bg-[#FAFBFC] border border-[#E2E8F0] rounded-lg p-3">
                        <p className="font-medium text-xs text-[#0F172A]/60 uppercase tracking-wide mb-1">Key areas to include</p>
                        <ul className="space-y-1">
                          <li className="flex gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#0EA5E9] flex-shrink-0" />{city.name} city center</li>
                          <li className="flex gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#0EA5E9] flex-shrink-0" />Nearest airport / train station</li>
                          <li className="flex gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#0EA5E9] flex-shrink-0" />Hotel / accommodation neighborhood</li>
                          {city.attractions.length > 0 && (
                            <li className="flex gap-2">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#0EA5E9] flex-shrink-0" />
                              Top attraction area ({city.attractions[0].name})
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {allCities.length === 0 && (
                <p className="text-sm text-[#0F172A]/60 italic">No cities found for this country in our database yet.</p>
              )}
            </div>
          )}
        </section>

        {/* ────────────────────────────────────────────────────────── */}
        {/*  6. OTHER DOWNLOADS BEFORE YOU GO                         */}
        {/* ────────────────────────────────────────────────────────── */}
        <section>
          <h2 className="font-serif text-3xl font-bold mb-2">Other Downloads Before You Go</h2>
          <p className="text-[#0F172A]/70 mb-6">
            Maps are just the beginning. Make sure you have all of these on your phone before you leave home.
          </p>
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <ul className="space-y-4">
              {OTHER_DOWNLOADS.map((d, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded border-2 border-[#E2E8F0] mt-0.5 print:border-black" />
                  <div>
                    <span className="font-medium">{d.name}</span>
                    <p className="text-sm text-[#0F172A]/65 mt-0.5">{d.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────── */}
        {/*  7. HOW MUCH STORAGE DO I NEED?                           */}
        {/* ────────────────────────────────────────────────────────── */}
        <section>
          <h2 className="font-serif text-3xl font-bold mb-2">How Much Storage Do I Need?</h2>
          <p className="text-[#0F172A]/70 mb-6">
            Quick reference so you know whether to clear some photos before your trip.
          </p>
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F1F5F9]">
                  <th className="text-left px-5 py-3 font-semibold">Item</th>
                  <th className="text-right px-5 py-3 font-semibold">Approximate Size</th>
                </tr>
              </thead>
              <tbody>
                {STORAGE_ITEMS.map((s, i) => (
                  <tr key={i} className="border-t border-[#E2E8F0]">
                    <td className="px-5 py-3">{s.item}</td>
                    <td className="px-5 py-3 text-right font-medium text-[#0EA5E9]">{s.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-[#ECFDF5] border border-emerald-200 rounded-xl p-5">
            <p className="text-sm text-emerald-800 font-medium">
              Recommendation: Free up at least 2 - 3 GB of storage before a 1-week trip. That gives you room for offline maps, a language pack, some music, and a movie for the flight.
            </p>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────── */}
        {/*  8. PRINT THESE — EMERGENCY CARDS                         */}
        {/* ────────────────────────────────────────────────────────── */}
        <section>
          <h2 className="font-serif text-3xl font-bold mb-2">Print These</h2>
          <p className="text-[#0F172A]/70 mb-6">
            Printable emergency cards you can keep in your wallet. Press <kbd className="px-1.5 py-0.5 bg-[#F1F5F9] border border-[#E2E8F0] rounded text-xs font-mono">Ctrl + P</kbd> (or <kbd className="px-1.5 py-0.5 bg-[#F1F5F9] border border-[#E2E8F0] rounded text-xs font-mono">Cmd + P</kbd> on Mac) to print this page. Only the cards below will appear on the printout.
          </p>

          {/* Print-only styles */}
          <style>{`
            @media print {
              body * { visibility: hidden !important; }
              #print-cards, #print-cards * { visibility: visible !important; }
              #print-cards { position: absolute; top: 0; left: 0; width: 100%; }
              #print-cards .no-print { display: none !important; }
            }
          `}</style>

          <div id="print-cards" className="space-y-6">
            {/* Hotel Address Card */}
            <div className="bg-white rounded-xl border-2 border-[#E2E8F0] p-6 shadow-sm print:border-black print:rounded-none print:shadow-none print:break-inside-avoid">
              <h3 className="font-serif text-xl font-bold mb-3 border-b border-[#E2E8F0] pb-2 print:border-black">
                Hotel Address Card
              </h3>
              <p className="text-sm text-[#0F172A]/70 mb-3">
                Write your hotel name and address below — in both English and the local language. Show this to taxi drivers.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-4 min-h-[100px] print:border-black">
                  <p className="text-xs text-[#0F172A]/50 uppercase tracking-wide mb-2">Hotel name and address (English)</p>
                  <div className="h-16" />
                </div>
                <div className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-4 min-h-[100px] print:border-black">
                  <p className="text-xs text-[#0F172A]/50 uppercase tracking-wide mb-2">Hotel name and address (Local language)</p>
                  <div className="h-16" />
                </div>
              </div>
            </div>

            {/* Emergency Numbers Card */}
            <div className="bg-white rounded-xl border-2 border-[#E2E8F0] p-6 shadow-sm print:border-black print:rounded-none print:shadow-none print:break-inside-avoid">
              <h3 className="font-serif text-xl font-bold mb-3 border-b border-[#E2E8F0] pb-2 print:border-black">
                Emergency Numbers
              </h3>
              <p className="text-sm text-[#0F172A]/70 mb-3 no-print">
                Select a country above in the planner to auto-fill, or write the numbers by hand.
              </p>
              {country ? (
                <div className="space-y-2">
                  <p className="font-medium flex items-center gap-2">
                    <span className="text-xl">{country.flag}</span> {country.name}
                  </p>
                  {country.emergencyNumbers.map((num, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-[#0F172A]/80">{num.service}</span>
                      <span className="font-mono font-bold text-lg text-[#0EA5E9] print:text-black">{num.number}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {['Police', 'Ambulance', 'Fire', 'Embassy'].map((svc) => (
                    <div key={svc} className="flex justify-between border-b border-dashed border-[#E2E8F0] pb-2 print:border-black">
                      <span className="text-sm">{svc}</span>
                      <span className="w-24 border-b border-dashed border-[#E2E8F0] print:border-black" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* "Please take me to this address" Card */}
            <div className="bg-white rounded-xl border-2 border-[#E2E8F0] p-6 shadow-sm print:border-black print:rounded-none print:shadow-none print:break-inside-avoid">
              <h3 className="font-serif text-xl font-bold mb-3 border-b border-[#E2E8F0] pb-2 print:border-black">
                &ldquo;Please take me to this address&rdquo;
              </h3>
              <p className="text-sm text-[#0F172A]/70 mb-3">
                Write this phrase in the local language below. Show it to taxi or ride-share drivers.
              </p>
              <div className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-4 min-h-[80px] print:border-black">
                <p className="text-xs text-[#0F172A]/50 uppercase tracking-wide mb-2">Local language phrase</p>
                <div className="h-12" />
              </div>
              <div className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-4 min-h-[80px] mt-3 print:border-black">
                <p className="text-xs text-[#0F172A]/50 uppercase tracking-wide mb-2">Destination address (local language)</p>
                <div className="h-12" />
              </div>
            </div>

            {/* Allergies / Dietary Restrictions Card */}
            <div className="bg-white rounded-xl border-2 border-[#E2E8F0] p-6 shadow-sm print:border-black print:rounded-none print:shadow-none print:break-inside-avoid">
              <h3 className="font-serif text-xl font-bold mb-3 border-b border-[#E2E8F0] pb-2 print:border-black">
                Allergies and Dietary Restrictions
              </h3>
              <p className="text-sm text-[#0F172A]/70 mb-3">
                Write your allergies or dietary needs in the local language. Show this at restaurants.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-4 min-h-[100px] print:border-black">
                  <p className="text-xs text-[#0F172A]/50 uppercase tracking-wide mb-2">Allergies (English)</p>
                  <div className="h-16" />
                </div>
                <div className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-4 min-h-[100px] print:border-black">
                  <p className="text-xs text-[#0F172A]/50 uppercase tracking-wide mb-2">Allergies (Local language)</p>
                  <div className="h-16" />
                </div>
              </div>
            </div>

            {/* Blood Type / Medical Info Card */}
            <div className="bg-white rounded-xl border-2 border-[#E2E8F0] p-6 shadow-sm print:border-black print:rounded-none print:shadow-none print:break-inside-avoid">
              <h3 className="font-serif text-xl font-bold mb-3 border-b border-[#E2E8F0] pb-2 print:border-black">
                Blood Type and Medical Information
              </h3>
              <p className="text-sm text-[#0F172A]/70 mb-3">
                Keep this card in your wallet at all times.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-4 print:border-black">
                  <p className="text-xs text-[#0F172A]/50 uppercase tracking-wide mb-2">Blood type</p>
                  <div className="h-8" />
                </div>
                <div className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-4 print:border-black">
                  <p className="text-xs text-[#0F172A]/50 uppercase tracking-wide mb-2">Emergency contact</p>
                  <div className="h-8" />
                </div>
              </div>
              <div className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-4 mt-3 min-h-[80px] print:border-black">
                <p className="text-xs text-[#0F172A]/50 uppercase tracking-wide mb-2">Current medications and medical conditions</p>
                <div className="h-12" />
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
