'use client'

import { useState } from 'react'

/* ───────── colour tokens ───────── */
const C = {
  primary: '#0EA5E9',
  secondary: '#F59E0B',
  dark: '#0F172A',
  bg: '#FAFBFC',
  card: '#FFFFFF',
  border: '#E2E8F0',
} as const

/* ───────── countries ───────── */
const COUNTRIES = [
  { id: 'japan', name: 'Japan', flag: '🇯🇵', currency: '¥' },
  { id: 'italy', name: 'Italy', flag: '🇮🇹', currency: '€' },
  { id: 'thailand', name: 'Thailand', flag: '🇹🇭', currency: '฿' },
  { id: 'france', name: 'France', flag: '🇫🇷', currency: '€' },
  { id: 'india', name: 'India', flag: '🇮🇳', currency: '₹' },
] as const

type CountryId = (typeof COUNTRIES)[number]['id']

/* ───────── section type ───────── */
type SectionId = 'deals' | 'scams' | 'fifty' | 'tipping' | 'haggling'
const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'deals', label: 'Money-Saving Secrets' },
  { id: 'scams', label: 'Scam Alerts' },
  { id: 'fifty', label: 'What $50 Gets You' },
  { id: 'tipping', label: 'Tipping Guide' },
  { id: 'haggling', label: 'Haggling Guide' },
]

/* ───────── money-saving tips ───────── */
interface Deal { tip: string; detail: string }

const DEALS: Record<CountryId, Deal[]> = {
  japan: [
    { tip: '7-Eleven / Lawson ATMs accept foreign cards', detail: 'Most Japanese bank ATMs reject foreign cards. 7-Eleven, Lawson, and Japan Post ATMs work with Visa/Mastercard and charge zero foreign fees. Withdraw yen here, not at the airport.' },
    { tip: 'Lunch sets are 40% cheaper than dinner', detail: 'The exact same restaurant serving ¥3,000 dinner dishes offers "teishoku" lunch sets for ¥800-1,200. Same chef, same quality, fraction of the price. Always eat your big meal at lunch.' },
    { tip: 'Matinee movies before 12 PM', detail: 'Movie tickets drop from ¥1,800 to ¥1,300 before noon. Ladies\' Day (Wednesday) is ¥1,100 at most theaters. First Day of the month is ¥1,100 for everyone.' },
    { tip: 'Depachika discounts near closing', detail: 'Department store basement food floors (depachika) sell gourmet sushi, wagyu beef boxes, and pastries at 20-50% off starting around 7-8 PM as they try to sell everything before closing.' },
    { tip: 'JR Rail Pass pays for itself in 2 rides', detail: '¥50,000 for 7 days of unlimited travel. A single Tokyo-Kyoto bullet train round trip costs ¥27,000. After just 2 rides, everything else is free. Activate it strategically for your travel-heavy days.' },
    { tip: '100-yen shops for travel essentials', detail: 'Daiso, Seria, and Can Do sell travel adapters, toiletries, phone cables, umbrellas, towels, and stationery for ¥100 ($0.70). Don\'t buy these at the airport or tourist shops.' },
  ],
  italy: [
    { tip: 'Free museum entry on first Sundays', detail: 'On the first Sunday of every month, all state museums and archaeological sites offer free entry. The Colosseum, Uffizi, Borghese Gallery, Pompeii, Vatican Museums — all free. Arrive early, lines are long.' },
    { tip: 'Coperto is not a scam', detail: 'The "coperto" (cover charge, €1-3 per person) on your restaurant bill is completely legal and standard in Italy. It covers bread and table setting. If you see "servizio" too, that\'s the service charge — in that case, no tip needed.' },
    { tip: 'Aperitivo hour = free dinner', detail: 'Between 6-9 PM, most bars offer "aperitivo" — buy one drink (€8-12) and help yourself to a buffet of pasta, bruschetta, salads, and more. In Milan and Bologna, this can replace dinner entirely.' },
    { tip: 'Free water from nasoni fountains', detail: 'Rome alone has over 2,500 "nasoni" (little noses) — free public water fountains fed by ancient aqueducts. The water is clean, cold, and delicious. Bring a refillable bottle and never buy water again.' },
    { tip: 'Roma Pass saves on transport + museums', detail: '€52 for 48 hours: free unlimited public transport + free entry to first 2 museums/sites + discounts on everything else. Skip the line at included attractions. Pays for itself if you visit the Colosseum + one other museum and use the Metro.' },
    { tip: 'Pranzo (lunch menu) is half the dinner price', detail: 'Many restaurants offer a "pranzo" fixed-price lunch: primo (pasta) + secondo (meat/fish) + water for €10-15. The exact same dishes cost €25-35 ordered individually at dinner.' },
  ],
  thailand: [
    { tip: 'Never accept tuk-tuk "special deals"', detail: 'If a tuk-tuk driver offers you a cheap tour or says a temple is "closed today, I know a better one," it ALWAYS ends at a gem shop or tailor where they earn commission. Politely decline and walk away.' },
    { tip: '7-Eleven meals are shockingly good', detail: 'Pad thai ฿35, onigiri ฿25, iced coffee ฿20, toasties ฿29. There\'s a 7-Eleven on literally every block in Bangkok. The staff will heat food for you. Perfectly acceptable meals for under $2.' },
    { tip: 'BTS Rabbit Card saves 15%', detail: 'Buy a Rabbit Card at any BTS station for ฿200 (฿100 deposit + ฿100 credit). You save 15% per ride vs single tickets, plus you skip the ticket queue. Also works at some shops and restaurants.' },
    { tip: 'Negotiate at markets, never at shops', detail: 'Haggling is expected at street markets and independent stalls. Start at 40-50% of the asking price and settle around 60-70%. NEVER negotiate at 7-Eleven, shopping malls, or restaurants — prices are fixed.' },
    { tip: 'Street food beats restaurant food', detail: 'The best pad thai, som tum, and khao man gai in Thailand is from street carts, not restaurants. Follow the locals — if a stall has a line of Thai people, eat there. Street food: ฿40-60. Same dish in a restaurant: ฿150-300.' },
    { tip: 'Thai massage for ฿200-300 ($6-9)', detail: 'A full hour Thai massage costs ฿200-300 on side streets away from tourist areas. The same massage near Khao San Road or in Patong is ฿500-800. Walk 5 minutes from any tourist zone and prices drop by half.' },
  ],
  france: [
    { tip: 'Paris Museum Pass: skip ALL lines', detail: '€62 for 4 consecutive days. Includes 50+ museums and monuments: Louvre, Orsay, Versailles, Arc de Triomphe, Sainte-Chapelle. The real value isn\'t the savings — it\'s skipping the 2-hour Louvre line.' },
    { tip: 'Supermarket wine beats restaurant wine', detail: 'Monoprix and Carrefour sell excellent French wine for €3-5 per bottle. The same quality wine is €15-25 at restaurants. Buy a bottle, some cheese, and a baguette for the best €10 dinner in Paris.' },
    { tip: 'Boulangerie "formule" lunch deals', detail: 'Most boulangeries offer a "formule" at lunch: sandwich + drink + dessert for €5-7. A jambon-beurre (ham and butter baguette) is France\'s most popular lunch — simple, perfect, and costs €3-4 on its own.' },
    { tip: 'Navigo weekly pass: unlimited transport for €30', detail: 'The RATP Navigo Decouverte pass gives you unlimited Metro, bus, RER, and tram in all of Paris for a full week (Mon-Sun). You need a passport photo. Individual tickets cost €2.15 each — the pass pays for itself in 2 days.' },
    { tip: 'Free concerts at Sacre-Coeur', detail: 'Every evening, musicians perform on the steps of Sacre-Coeur in Montmartre. Bring a bottle of wine, sit on the steps, watch the sunset over Paris, and enjoy free live music. One of the best free experiences in Europe.' },
    { tip: 'Free tap water at every restaurant', detail: 'You are legally entitled to free water at any French restaurant. Ask for "une carafe d\'eau" (a carafe of tap water). Paris tap water is excellent. Don\'t let waiters steer you to €5 bottled water.' },
  ],
  india: [
    { tip: 'Negotiate rickshaw prices BEFORE getting in', detail: 'Always agree on the auto-rickshaw fare before you get in. Use Google Maps to know the distance, then offer roughly ₹15-20 per kilometer. If they refuse, walk to the next one — there\'s always another.' },
    { tip: 'Jio SIM: unlimited data for ₹299/month ($3.50)', detail: 'Buy a Jio SIM card at any electronics shop. Bring your passport and a photo. ₹299 gets you unlimited calls and 2GB/day of 4G data for 28 days. Essential for maps, translation, and ride-hailing apps.' },
    { tip: 'Government "Bharat Hotels" — clean and cheap', detail: 'ITDC Bharat Hotels are government-run, found in tourist cities. Rooms cost ₹500-1,000/night ($6-12), are clean, and are often in prime locations. Not luxury, but reliable and safe.' },
    { tip: 'Book trains 120 days in advance', detail: 'Indian Railways opens bookings exactly 120 days before departure. AC classes (2AC, 3AC) on popular routes sell out within hours. Book on IRCTC.co.in the moment bookings open, or use Tatkal (last-minute quota, opens 1 day before).' },
    { tip: 'Street thali meals: ₹50-100 for a feast', detail: 'A thali plate gives you rice, dal, 3-4 curries, chapati, pickle, and sometimes dessert — with unlimited refills. ₹50-100 ($0.60-1.20). It\'s the best value meal anywhere on Earth.' },
    { tip: 'Use official prepaid taxi counters', detail: 'At airports and major train stations, skip the touts and find the official "prepaid taxi" counter inside the terminal. Pay a fixed, government-regulated rate. Get a receipt. The driver can\'t overcharge you.' },
  ],
}

/* ───────── scams ───────── */
interface Scam { name: string; what: string; avoid: string }

const SCAMS: Record<CountryId, Scam[]> = {
  japan: [
    { name: 'Bar Touts in Kabukicho', what: 'Friendly people invite you to a "fun bar" in Shinjuku\'s red-light district. Drinks arrive with a hidden ¥30,000-50,000 bill. Intimidating staff prevent you from leaving.', avoid: 'Never follow touts to bars. Choose your own bar, check prices before ordering, and stick to well-lit main streets.' },
    { name: 'Fake Monks', what: 'People in monk robes offer you a "blessed" bracelet then aggressively demand a donation of ¥1,000-5,000.', avoid: 'Real Buddhist monks in Japan never solicit money on the street. Simply say "no thank you" and walk away.' },
    { name: 'Overcharged Taxi', what: 'Rare in Japan, but some airport taxis take the long route. Tokyo Narita to city center should cost ¥20,000-25,000.', avoid: 'Use the Narita Express train (¥3,250) or Limousine Bus (¥3,200) instead. If you must taxi, know the fair price beforehand.' },
  ],
  italy: [
    { name: 'Gladiator Photos at Colosseum', what: 'People dressed as gladiators pose for "free" photos, then demand €20-50 per photo aggressively.', avoid: 'Don\'t engage. If they jump into your selfie, firmly say "No grazie" and walk away. Never hand them your phone.' },
    { name: 'Rose/Bracelet Sellers', what: 'Someone gives you a rose or ties a "friendship bracelet" on your wrist "as a gift," then demands €5-10 payment.', avoid: 'Keep hands in pockets near Sacre-Coeur, Spanish Steps, and Trevi Fountain. Don\'t accept anything from strangers.' },
    { name: 'Restaurant Menu Bait-and-Switch', what: 'A street menu shows €8 pasta. Inside, the "real" menu has €20 pasta. Or you\'re served "special" fish priced by weight at €80+.', avoid: 'Always confirm the menu and prices before ordering. Avoid restaurants with aggressive touts outside. If something seems wrong, ask before eating.' },
    { name: 'Fake Petition Scammers', what: 'Someone asks you to sign a petition for "deaf children" or similar. While you\'re distracted, an accomplice pickpockets you.', avoid: 'Never stop for clipboard-wielding strangers. A firm "no" and keep walking.' },
  ],
  thailand: [
    { name: 'Gem Shop Scam', what: 'A friendly local or tuk-tuk driver tells you about a "government gem sale — today only!" You buy gems at "wholesale prices" that turn out to be worthless colored glass.', avoid: 'There is no government gem sale. Ever. If anyone mentions gems, end the conversation immediately.' },
    { name: 'Jet Ski Damage Scam', what: 'You rent a jet ski in Phuket/Pattaya. When you return it, the owner "finds" pre-existing damage and demands ฿20,000-50,000 for repairs, sometimes with threatening behavior.', avoid: 'Photograph every scratch before renting. Better yet, skip jet skis entirely in Thailand. The scam is so common the embassy warns about it.' },
    { name: 'Tuk-Tuk Tour Scam', what: 'A tuk-tuk driver offers a "city tour for ฿20." He takes you to 3-4 shops where he earns commission. You waste half a day and face aggressive salespeople.', avoid: 'If a tuk-tuk ride price seems too good to be true, it is. Use Grab (Thai Uber) for fair, tracked rides.' },
    { name: 'The Closed Temple Trick', what: '"Oh, that temple is closed for lunch/ceremony/holiday. I know a better one." It\'s never closed — they want to take you to a gem shop.', avoid: 'Check Google Maps for opening hours. Walk to the entrance yourself. Temples don\'t close for lunch.' },
  ],
  france: [
    { name: 'Three-Card Monte', what: 'Groups play a "find the ball" game on bridges and tourist areas. It looks easy to win. It\'s rigged — you\'ll never win, and the "winners" in the crowd are accomplices.', avoid: 'Walk past without engaging. Don\'t even stop to watch — you become a target for pickpockets in the crowd.' },
    { name: 'Friendship Bracelet at Sacre-Coeur', what: 'Men aggressively grab your hand and tie a string bracelet on your wrist, then demand €10-20 payment. They work in groups and can be intimidating.', avoid: 'Keep hands in pockets or crossed when walking up the Montmartre steps. Firmly say "NON" if approached. Don\'t let anyone touch your hands.' },
    { name: 'Fake Petition Pickpockets', what: 'Young women with clipboards surround you asking to sign a petition. While you\'re distracted, one of them picks your pocket or grabs your phone.', avoid: 'Never stop walking. "Non merci" without eye contact. Keep valuables in front zippered pockets.' },
    { name: 'Taxi Meter "Broken"', what: 'Taxi driver claims the meter is broken and quotes a flat rate of €50-80 for a €20 ride.', avoid: 'Insist on the meter. If they refuse, exit and find another taxi. Better yet, use the Uber/Bolt app for transparent pricing.' },
  ],
  india: [
    { name: 'The "Official Tourist Office" Scam', what: 'You ask for the government tourist office near Connaught Place, Delhi. A tout directs you to a fake one that books overpriced tours, bad hotels, and takes huge commissions.', avoid: 'The real India Tourism office is at 88 Janpath, New Delhi. Book directly through official websites. Ignore anyone who approaches you "to help."' },
    { name: 'Hotel/Hostel "Closed" Scam', what: 'Your taxi or rickshaw driver says your hotel is "closed," "burned down," or "has a health issue." They want to take you to a hotel that pays them commission.', avoid: 'Call your hotel before arriving to confirm. Never believe a driver who says your booking is invalid. Insist on being taken to the address you specified.' },
    { name: 'Card Skimming at ATMs', what: 'Skimming devices are placed on ATMs, especially standalone ones in tourist areas. Your card details are copied and used for fraud.', avoid: 'Only use ATMs inside banks (SBI, HDFC, ICICI). Cover the keypad when entering your PIN. Check for loose-fitting card slots.' },
    { name: 'Inflated Foreigner Pricing', what: 'Shops, rickshaws, and some services quote foreigners 3-10x the local price. This isn\'t always a "scam" — it\'s expected — but being aware helps you negotiate fairly.', avoid: 'Research fair prices on Google. Ask at your hotel what things should cost. Negotiate with a smile — start at 30-40% of the asking price and meet in the middle.' },
  ],
}

/* ───────── $50 comparison ───────── */
interface FiftyBucks { item: string }

const FIFTY: Record<CountryId, FiftyBucks[]> = {
  japan: [
    { item: '2 nights in a capsule hotel' },
    { item: '12-15 konbini meals' },
    { item: '1 day JR Rail Pass (regional)' },
    { item: '5 ramen bowls at a good shop' },
    { item: '1 sushi lunch at Tsukiji Outer Market' },
  ],
  italy: [
    { item: '1 night in a decent hostel dorm' },
    { item: '10 slices of pizza al taglio + 5 gelatos' },
    { item: '1 Roma Pass (48 hours with museums + transport)' },
    { item: '2 aperitivo dinners (drink + buffet)' },
    { item: '8-10 espressos + a bottle of good Chianti' },
  ],
  thailand: [
    { item: '3-4 nights in a guesthouse' },
    { item: '50+ street food meals' },
    { item: '5-7 full Thai massages' },
    { item: '2-day scooter rental + fuel' },
    { item: 'Full-day island boat tour with lunch' },
  ],
  france: [
    { item: '1 night in a budget hostel (barely)' },
    { item: '7-8 boulangerie "formule" lunches' },
    { item: '1 Paris Museum Pass (2-day)' },
    { item: '10 bottles of good supermarket wine' },
    { item: '25 espressos at the bar' },
  ],
  india: [
    { item: '5-8 nights in a budget hotel' },
    { item: '50-80 thali meals' },
    { item: '2 months of unlimited mobile data (Jio)' },
    { item: '40-50 auto-rickshaw rides' },
    { item: 'Overnight AC train ticket (Delhi to Jaipur)' },
  ],
}

/* ───────── tipping guide ───────── */
interface TipGuide { situation: string; recommendation: string }

const TIPPING: Record<CountryId, TipGuide[]> = {
  japan: [
    { situation: 'Restaurants', recommendation: 'Do NOT tip. It can be considered rude or confusing. Service is included and expected to be excellent.' },
    { situation: 'Taxis', recommendation: 'No tip. Round up to the nearest yen if you want, but it\'s truly not expected.' },
    { situation: 'Hotels', recommendation: 'No tipping at hotels. If you want to thank a ryokan host, give a small gift (sweets from your home country) instead.' },
    { situation: 'Tour Guides', recommendation: 'A small cash gift (¥1,000-3,000) in an envelope is appreciated but not expected.' },
  ],
  italy: [
    { situation: 'Restaurants', recommendation: 'If "servizio" is on the bill, tip is included. Otherwise, round up by €1-2 or leave 5-10%. Never 20% like in the US.' },
    { situation: 'Cafes/Bars', recommendation: 'No tip for espresso at the bar. If you sit at a table, €0.50-1 is generous.' },
    { situation: 'Taxis', recommendation: 'Round up to the nearest euro. That\'s it.' },
    { situation: 'Hotels', recommendation: 'Bellhops: €1-2 per bag. Housekeeping: €1-2/day (optional). Concierge: €5-10 for exceptional help.' },
  ],
  thailand: [
    { situation: 'Restaurants', recommendation: 'Leave 20-50 baht at street stalls/casual spots. 10% at nicer restaurants if service charge isn\'t included.' },
    { situation: 'Massage', recommendation: '฿50-100 tip for a standard massage. ฿100-200 for a spa treatment.' },
    { situation: 'Taxis/Grab', recommendation: 'Not expected. Round up to the nearest ฿10-20 if you like.' },
    { situation: 'Hotels', recommendation: 'Bellhops: ฿20-50. Housekeeping: ฿20-50/day. Tip in baht, not dollars.' },
  ],
  france: [
    { situation: 'Restaurants', recommendation: 'Service IS included by law (service compris). Leaving small change (€1-2) on the table is a nice gesture, but never expected. No need for 15-20%.' },
    { situation: 'Cafes', recommendation: 'Not expected. Leaving €0.20-0.50 coin change is a kind gesture, especially for good service.' },
    { situation: 'Taxis', recommendation: '5-10% or round up to the nearest euro. Not mandatory.' },
    { situation: 'Hotels', recommendation: 'Bellhops: €1-2 per bag. Housekeeping: €1-2/day (place on pillow). Concierge: €5-20 for restaurant reservations or hard-to-get tickets.' },
  ],
  india: [
    { situation: 'Restaurants', recommendation: '10% at sit-down restaurants if service charge isn\'t included. Round up for street food or casual places — ₹10-20 is appreciated.' },
    { situation: 'Hotels', recommendation: 'Bellhops: ₹50-100. Housekeeping: ₹50-100/day. Room service: ₹20-50. Guide: ₹200-500/day.' },
    { situation: 'Taxis/Rickshaws', recommendation: 'Not expected but appreciated. Round up to the nearest ₹10-20.' },
    { situation: 'Other Services', recommendation: 'Barbers/salons: ₹20-50. Delivery drivers: ₹20-30. Temple priests: ₹50-100 is a respectful offering.' },
  ],
}

/* ───────── haggling guide ───────── */
interface HaggleGuide { where: string; startAt: string; tips: string }

const HAGGLING: Record<CountryId, HaggleGuide> = {
  japan: { where: 'Almost nowhere — Japan is a fixed-price culture', startAt: 'N/A', tips: 'The only exceptions are Osaka\'s Shinsekai flea markets and some electronics in Akihabara. Even then, discounts are modest (5-10%). Asking for a discount at a regular shop is awkward and won\'t work.' },
  italy: { where: 'Outdoor markets, leather shops in Florence, souvenir stands', startAt: '60-70% of asking price', tips: 'Italian vendors expect light negotiation at markets. Don\'t be aggressive — be friendly and complimentary. "E\' bellissimo, ma... un po\' caro" (It\'s beautiful, but a bit expensive) works well. Walk away if they won\'t budge — they\'ll often call you back.' },
  thailand: { where: 'Street markets, night bazaars, tuk-tuks, independent shops', startAt: '40-50% of asking price', tips: 'Haggling is a social art in Thailand. Smile, be playful, and take your time. Start low, meet in the middle. Walking away is the most powerful tool — if they let you walk, the price was already fair. Never haggle at 7-Eleven, malls, or restaurants.' },
  france: { where: 'Flea markets (marche aux puces) and antique shops only', startAt: '70-80% of asking price', tips: 'The French don\'t haggle in normal shopping contexts. At the famous Marche aux Puces de Saint-Ouen, polite negotiation is expected. Ask "C\'est votre meilleur prix?" (Is that your best price?). Buying multiple items gives you leverage.' },
  india: { where: 'Everywhere except malls, supermarkets, and restaurants', startAt: '25-33% of asking price', tips: 'Haggling is expected and even enjoyed in India. Start at 25-33% of the asking price — the vendor expects it. Be cheerful, never angry. Compare prices at 2-3 stalls before buying. For auto-rickshaws, Google Maps distance x ₹15/km is a fair price. The final price should be 40-60% of the first ask.' },
}

/* ───────── component ───────── */
export default function LocalDealsPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('deals')
  const [activeCountry, setActiveCountry] = useState<CountryId>('japan')

  const country = COUNTRIES.find(c => c.id === activeCountry)!

  return (
    <main style={{ backgroundColor: C.bg, minHeight: '100vh' }}>
      {/* ───── HERO ───── */}
      <section
        style={{
          background: `linear-gradient(135deg, ${C.secondary} 0%, #D97706 100%)`,
          padding: '80px 24px 60px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            color: '#FFFFFF',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Local Deals &amp; Money-Saving Secrets
        </h1>
        <p
          style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '1.15rem',
            maxWidth: 640,
            margin: '16px auto 0',
            lineHeight: 1.6,
          }}
        >
          The stuff guidebooks never tell you. Real insider tips that save serious money in every destination.
        </p>
      </section>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 20px' }}>
        {/* ───── SECTION TABS ───── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: 'center',
            margin: '-26px auto 0',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                padding: '11px 20px',
                borderRadius: 12,
                border: activeSection === s.id ? `2px solid ${C.secondary}` : `1px solid ${C.border}`,
                background: activeSection === s.id ? C.secondary : C.card,
                color: activeSection === s.id ? '#fff' : C.dark,
                fontWeight: 600,
                fontSize: '0.92rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'all .2s',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* ───── COUNTRY PILLS ───── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 28 }}>
          {COUNTRIES.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCountry(c.id)}
              style={{
                padding: '8px 20px',
                borderRadius: 20,
                border: activeCountry === c.id ? `2px solid ${C.primary}` : `1px solid ${C.border}`,
                background: activeCountry === c.id ? C.primary : C.card,
                color: activeCountry === c.id ? '#fff' : C.dark,
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              {c.flag} {c.name}
            </button>
          ))}
        </div>

        {/* ───── CONTENT AREA ───── */}
        <div style={{ paddingBottom: 80, marginTop: 40 }}>
          {/* MONEY-SAVING SECRETS */}
          {activeSection === 'deals' && (
            <section>
              <h2
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '1.75rem',
                  color: C.dark,
                  marginBottom: 8,
                }}
              >
                {country.flag} {country.name} — Money-Saving Secrets
              </h2>
              <p style={{ color: '#64748B', marginBottom: 28, fontSize: '0.95rem' }}>
                Insider tips that most tourists never learn. Each one can save you real money.
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                  gap: 18,
                }}
              >
                {DEALS[activeCountry].map((deal, i) => (
                  <div
                    key={i}
                    style={{
                      background: C.card,
                      borderRadius: 14,
                      border: `1px solid ${C.border}`,
                      padding: '22px 24px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                      <span
                        style={{
                          background: `${C.secondary}18`,
                          color: C.secondary,
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          borderRadius: 8,
                          padding: '4px 10px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        TIP {i + 1}
                      </span>
                      <h3 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 700, color: C.dark, lineHeight: 1.4 }}>
                        {deal.tip}
                      </h3>
                    </div>
                    <p style={{ margin: 0, color: '#475569', fontSize: '0.92rem', lineHeight: 1.65 }}>
                      {deal.detail}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SCAM ALERTS */}
          {activeSection === 'scams' && (
            <section>
              <h2
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '1.75rem',
                  color: C.dark,
                  marginBottom: 8,
                }}
              >
                {country.flag} {country.name} — Scam Alerts
              </h2>
              <p style={{ color: '#64748B', marginBottom: 28, fontSize: '0.95rem' }}>
                Know what to watch for so you don&apos;t learn the hard way.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {SCAMS[activeCountry].map((scam, i) => (
                  <div
                    key={i}
                    style={{
                      background: C.card,
                      borderRadius: 14,
                      border: `1px solid ${C.border}`,
                      padding: '24px 26px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                  >
                    <h3 style={{ margin: '0 0 12px', fontSize: '1.1rem', fontWeight: 700, color: '#DC2626' }}>
                      {scam.name}
                    </h3>
                    <div style={{ marginBottom: 12 }}>
                      <span
                        style={{
                          display: 'inline-block',
                          background: '#FEF2F2',
                          color: '#DC2626',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          borderRadius: 6,
                          padding: '3px 10px',
                          marginBottom: 6,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        What they do
                      </span>
                      <p style={{ margin: 0, color: '#475569', fontSize: '0.93rem', lineHeight: 1.6 }}>
                        {scam.what}
                      </p>
                    </div>
                    <div>
                      <span
                        style={{
                          display: 'inline-block',
                          background: '#F0FDF4',
                          color: '#16A34A',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          borderRadius: 6,
                          padding: '3px 10px',
                          marginBottom: 6,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        How to avoid it
                      </span>
                      <p style={{ margin: 0, color: '#475569', fontSize: '0.93rem', lineHeight: 1.6 }}>
                        {scam.avoid}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* WHAT $50 GETS YOU */}
          {activeSection === 'fifty' && (
            <section>
              <h2
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '1.75rem',
                  color: C.dark,
                  marginBottom: 8,
                }}
              >
                What $50 Gets You in Each Country
              </h2>
              <p style={{ color: '#64748B', marginBottom: 28, fontSize: '0.95rem' }}>
                A visual comparison of purchasing power across all five destinations.
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 18,
                }}
              >
                {COUNTRIES.map(c => (
                  <div
                    key={c.id}
                    style={{
                      background: C.card,
                      borderRadius: 14,
                      border: activeCountry === c.id ? `2px solid ${C.primary}` : `1px solid ${C.border}`,
                      padding: '24px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                      cursor: 'pointer',
                    }}
                    onClick={() => setActiveCountry(c.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                      <span style={{ fontSize: '1.6rem' }}>{c.flag}</span>
                      <h3 style={{ margin: 0, fontFamily: '"Playfair Display", serif', fontSize: '1.2rem', color: C.dark }}>
                        {c.name}
                      </h3>
                      <span
                        style={{
                          marginLeft: 'auto',
                          background: `${C.primary}14`,
                          color: C.primary,
                          fontWeight: 700,
                          fontSize: '1rem',
                          borderRadius: 8,
                          padding: '4px 12px',
                        }}
                      >
                        $50
                      </span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {FIFTY[c.id].map((item, i) => (
                        <li key={i} style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.8 }}>
                          {item.item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TIPPING GUIDE */}
          {activeSection === 'tipping' && (
            <section>
              <h2
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '1.75rem',
                  color: C.dark,
                  marginBottom: 8,
                }}
              >
                {country.flag} {country.name} — Tipping Guide
              </h2>
              <p style={{ color: '#64748B', marginBottom: 28, fontSize: '0.95rem' }}>
                What to tip, where, and how much. Stop the awkward mental math.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {TIPPING[activeCountry].map((t, i) => (
                  <div
                    key={i}
                    style={{
                      background: C.card,
                      borderRadius: 14,
                      border: `1px solid ${C.border}`,
                      padding: '20px 24px',
                      display: 'flex',
                      gap: 16,
                      alignItems: 'flex-start',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                  >
                    <span
                      style={{
                        background: `${C.primary}14`,
                        color: C.primary,
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        borderRadius: 8,
                        padding: '5px 14px',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      {t.situation}
                    </span>
                    <p style={{ margin: 0, color: '#475569', fontSize: '0.93rem', lineHeight: 1.6 }}>
                      {t.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* HAGGLING GUIDE */}
          {activeSection === 'haggling' && (
            <section>
              <h2
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '1.75rem',
                  color: C.dark,
                  marginBottom: 8,
                }}
              >
                {country.flag} {country.name} — Haggling Guide
              </h2>
              <p style={{ color: '#64748B', marginBottom: 28, fontSize: '0.95rem' }}>
                Where to haggle, where not to, and how to do it without being rude.
              </p>
              {(() => {
                const h = HAGGLING[activeCountry]
                return (
                  <div
                    style={{
                      background: C.card,
                      borderRadius: 16,
                      border: `1px solid ${C.border}`,
                      padding: '30px 28px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 24 }}>
                      <div>
                        <h4 style={{ color: C.primary, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>
                          Where to Haggle
                        </h4>
                        <p style={{ margin: 0, color: C.dark, fontSize: '1rem', fontWeight: 600 }}>{h.where}</p>
                      </div>
                      <div>
                        <h4 style={{ color: C.secondary, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>
                          Start Your Offer At
                        </h4>
                        <p style={{ margin: 0, color: C.dark, fontSize: '1rem', fontWeight: 600 }}>{h.startAt}</p>
                      </div>
                    </div>
                    <div>
                      <h4 style={{ color: '#64748B', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>
                        How It Works
                      </h4>
                      <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: 1.7 }}>{h.tips}</p>
                    </div>
                  </div>
                )
              })()}

              {/* All countries comparison */}
              <h3
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '1.25rem',
                  color: C.dark,
                  marginTop: 40,
                  marginBottom: 16,
                }}
              >
                Quick Comparison: Haggling Culture
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: 14,
                }}
              >
                {COUNTRIES.map(c => {
                  const h = HAGGLING[c.id]
                  const intensity =
                    c.id === 'india' ? 'Essential' :
                    c.id === 'thailand' ? 'Expected' :
                    c.id === 'italy' ? 'Light' :
                    c.id === 'france' ? 'Flea Markets Only' :
                    'Not Done'
                  const barWidth =
                    c.id === 'india' ? '100%' :
                    c.id === 'thailand' ? '80%' :
                    c.id === 'italy' ? '40%' :
                    c.id === 'france' ? '25%' :
                    '5%'
                  return (
                    <div
                      key={c.id}
                      style={{
                        background: C.card,
                        borderRadius: 12,
                        border: `1px solid ${C.border}`,
                        padding: '16px 18px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <span>{c.flag}</span>
                        <span style={{ fontWeight: 600, color: C.dark, fontSize: '0.9rem' }}>{c.name}</span>
                      </div>
                      <div
                        style={{
                          background: C.border,
                          borderRadius: 6,
                          height: 8,
                          overflow: 'hidden',
                          marginBottom: 6,
                        }}
                      >
                        <div style={{ background: C.primary, height: '100%', width: barWidth, borderRadius: 6, transition: 'width .3s' }} />
                      </div>
                      <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>{intensity}</span>
                      <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: '#94A3B8' }}>Start at {h.startAt}</p>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
