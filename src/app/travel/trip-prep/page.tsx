'use client'

import { useState, useMemo } from 'react'
import { COUNTRIES } from '@/data/travel/destinations'

/* ─── colour tokens ─── */
const C = {
  primary: '#0EA5E9',
  secondary: '#F59E0B',
  dark: '#0F172A',
  bg: '#FAFBFC',
  card: '#FFFFFF',
  muted: '#64748B',
  border: '#E2E8F0',
  lightBlue: '#F0F9FF',
  lightAmber: '#FFFBEB',
  lightGreen: '#F0FDF4',
  lightRose: '#FFF1F2',
  lightPurple: '#F5F3FF',
  green: '#10B981',
  rose: '#F43F5E',
  purple: '#8B5CF6',
}

/* ─── per-country data maps ─── */
const LOCAL_SIM: Record<string, { providers: string; detail: string }> = {
  japan: {
    providers: 'Sakura Mobile SIM, IIJmio, Airport vending machines',
    detail:
      'Data-only SIMs cost 3,000-5,000 for 2 weeks. Japan does not easily sell voice SIMs to tourists — plan to rely on data + WiFi calling.',
  },
  india: {
    providers: 'Jio, Airtel',
    detail:
      'Jio SIM costs 299 ($3.50) for 28 days unlimited data. You need your passport + visa copy. Buy at any Reliance store. Airtel is also good. Activation takes 4-24 hours, so buy it as soon as you land.',
  },
  thailand: {
    providers: 'AIS, DTAC, TrueMove',
    detail:
      'Buy at any airport arrival hall — 299 baht ($8) for 8-day unlimited data. Thailand is the easiest country in the world for tourist SIMs. Counters are right after customs.',
  },
  france: {
    providers: 'Orange Holiday SIM',
    detail:
      '40 euros for 20 GB data + calls. Works across all EU/Schengen countries. Buy at the airport Orange kiosk or any tabac shop.',
  },
  'united-kingdom': {
    providers: 'Three (3), GiffGaff, Vodafone',
    detail:
      'Three SIM costs 10 pounds for 12 GB. Works EU-wide. GiffGaff is also great — order free SIM online before you leave and it ships to your home address.',
  },
  italy: {
    providers: 'TIM Tourist SIM, Vodafone, WindTre',
    detail:
      'TIM Tourist SIM costs 30 euros for 50 GB. Available at the airport or any TIM store. Bring your passport — they need to register the SIM.',
  },
  turkey: {
    providers: 'Turkcell, Vodafone, Turk Telekom',
    detail:
      'Tourist SIMs available at the airport. Turkcell offers 20 GB for about 300 TRY. Your phone will be registered to your passport.',
  },
  'south-korea': {
    providers: 'KT, SKT, LG U+',
    detail:
      'Rent a portable WiFi egg at Incheon airport (about $5/day, unlimited data) or buy a prepaid SIM. KT offers tourist SIMs with 5 GB for 22,000 KRW.',
  },
  mexico: {
    providers: 'Telcel, AT&T Mexico',
    detail:
      'Telcel Amigo SIM is widely available at OXXO convenience stores. 200 MXN ($12) for 6 GB. Coverage is best with Telcel.',
  },
  australia: {
    providers: 'Optus, Vodafone, Telstra',
    detail:
      'Optus prepaid tourist SIM: AUD $30 for 35 GB (28 days). Available at the airport. Telstra has the best outback coverage if you are leaving cities.',
  },
  germany: {
    providers: 'Aldi Talk, Lebara, O2',
    detail:
      'Aldi Talk SIM at any Aldi supermarket — 7.99 euros for 7.5 GB. Requires passport registration. Works across the EU.',
  },
  spain: {
    providers: 'Orange, Vodafone, Movistar',
    detail:
      'Orange Mundo SIM: 10 euros for 10 GB. Available at airports and phone shops. Works EU-wide.',
  },
  'united-states': {
    providers: 'T-Mobile, Mint Mobile, Lycamobile',
    detail:
      'T-Mobile prepaid tourist plan: $40 for 10 GB (3 weeks). Available at airports and T-Mobile stores. Mint Mobile is cheaper if you order online before arriving.',
  },
}

const VEG_DIFFICULTY: Record<string, { level: string; color: string; dishes: string[]; avoid: string }> = {
  japan: {
    level: 'MODERATE',
    color: C.secondary,
    dishes: ['Shojin ryori (temple cuisine)', 'Vegetable tempura', 'Edamame & tofu dishes'],
    avoid: 'Dashi (fish stock) is in almost everything — miso soup, noodle broth, simmered dishes. Always ask "dashi nashi" (no dashi). Bonito flakes hide on top of many dishes.',
  },
  india: {
    level: 'EASY',
    color: C.green,
    dishes: ['Paneer tikka & palak paneer', 'Masala dosa & idli', 'Chole bhature & dal makhani'],
    avoid: 'Generally safe. Some gravies use cream/ghee (fine for vegetarians, not vegans). Street food is mostly veg-friendly. Look for restaurants marked "Pure Veg."',
  },
  thailand: {
    level: 'EASY',
    color: C.green,
    dishes: ['Pad Thai (ask no fish sauce)', 'Green curry with tofu', 'Mango sticky rice'],
    avoid: 'Fish sauce (nam pla) and oyster sauce are in most dishes. Ask for "jay" food (Buddhist vegetarian) which excludes all animal products. Buddhist food stalls near temples are reliable.',
  },
  france: {
    level: 'MODERATE',
    color: C.secondary,
    dishes: ['Ratatouille', 'Croque monsieur (vegetarian version)', 'Galettes (buckwheat crepes)'],
    avoid: 'French cuisine is butter and cream heavy. Say "je suis vegetarien/vegetarienne, sans viande, sans poisson" (no meat, no fish). Many "vegetable" soups use chicken stock.',
  },
  'united-kingdom': {
    level: 'EASY',
    color: C.green,
    dishes: ['Veggie Sunday roast', 'Jacket potato with beans', 'Indian vegetarian food (UK has amazing Indian restaurants)'],
    avoid: 'The UK is one of the most veg-friendly countries. Supermarkets clearly label V (vegetarian) and VG (vegan) on all products. Most restaurants have dedicated veg menus.',
  },
  italy: {
    level: 'MODERATE',
    color: C.secondary,
    dishes: ['Margherita pizza', 'Pasta pomodoro / arrabbiata', 'Caprese salad & bruschetta'],
    avoid: 'Cheese-heavy cuisine (Parmesan contains animal rennet — not technically vegetarian). Pasta is often made with egg. Some pesto contains Parmesan. Ask "senza carne, senza pesce" (no meat, no fish).',
  },
  'south-korea': {
    level: 'HARD',
    color: C.rose,
    dishes: ['Bibimbap (ask no meat)', 'Japchae (glass noodles)', 'Kimchi jjigae (often has pork — ask)'],
    avoid: 'Korean cuisine is very meat-centric. Banchan (side dishes) often contain fish sauce or anchovy paste. Kimchi itself usually contains shrimp paste. Temple food restaurants are the safest bet.',
  },
  turkey: {
    level: 'MODERATE',
    color: C.secondary,
    dishes: ['Gozleme (flatbread with cheese/spinach)', 'Imam bayildi (stuffed eggplant)', 'Mercimek corbasi (lentil soup)'],
    avoid: 'Turkish cuisine has many naturally vegetarian mezes. However, meat stock is common in soups and rice. Say "etsiz" (without meat). Kebab shops may not have veg options, but lokanta (home-style restaurants) usually do.',
  },
  mexico: {
    level: 'MODERATE',
    color: C.secondary,
    dishes: ['Bean & cheese tacos/burritos', 'Chiles rellenos', 'Elote (street corn)'],
    avoid: 'Lard (manteca) is used in many traditional beans and tortillas. Ask "sin manteca" and "sin carne." Mole sauces sometimes contain animal fat. Quesadillas and bean dishes are generally safe.',
  },
  australia: {
    level: 'EASY',
    color: C.green,
    dishes: ['Avo toast (iconic here)', 'Veggie pies', 'Asian vegetarian food (huge Asian food scene)'],
    avoid: 'Australia is very veg-friendly, especially in cities. Melbourne is arguably the vegan capital of the world. Clearly labeled menus everywhere. Supermarkets have extensive veg sections.',
  },
  germany: {
    level: 'MODERATE',
    color: C.secondary,
    dishes: ['Kartoffelpuffer (potato pancakes)', 'Kasespatzle (cheese noodles)', 'Pretzel with mustard'],
    avoid: 'Traditional German food is meat-heavy (wurst, schnitzel). However, Berlin is one of the most vegan-friendly cities globally. Look for "Imbiss" shops with falafel and Asian food for easy veg options.',
  },
  spain: {
    level: 'MODERATE',
    color: C.secondary,
    dishes: ['Patatas bravas', 'Tortilla espanola (potato omelet)', 'Pimientos de padron'],
    avoid: 'Spanish cuisine heavily features jamon and seafood. Tapas bars usually have some veg options. Say "soy vegetariano/a, sin carne ni pescado." Many soups and stews use meat broth.',
  },
  'united-states': {
    level: 'EASY',
    color: C.green,
    dishes: ['Impossible/Beyond burgers (widely available)', 'Chipotle sofritas bowl', 'Whole Foods hot bar'],
    avoid: 'Major cities are very veg-friendly. Rural areas and the South can be trickier. Fast-casual chains (Chipotle, Sweetgreen, CAVA) are reliable options. Check menus online before going.',
  },
}

const HALAL_INFO: Record<string, string> = {
  japan: 'Limited but growing. Ask for "halal" at tourist info centers. Tokyo and Osaka have halal ramen and yakiniku restaurants. Apps like Halal Gourmet Japan help locate options.',
  india: 'Widely available — large Muslim population. Look for restaurants with green signs or crescent moon symbols. Most kebab shops and Mughlai restaurants serve halal by default.',
  thailand: 'Available in Bangkok and southern Thailand (large Muslim population). Look for yellow signs with Arabic text. Night markets often have halal stalls.',
  france: 'Halal restaurants in most major cities. Paris has hundreds of halal options, especially in the 10th, 11th, and 18th arrondissements. Boucheries halal (halal butchers) everywhere.',
  'united-kingdom': 'Excellent availability. London has thousands of halal restaurants. Most fried chicken shops are halal. Apps like Zabihah list all options.',
  italy: 'Growing options in Rome, Milan, and Florence. Turkish and Middle Eastern restaurants are usually halal. Ask "e halal?" at restaurants.',
  turkey: 'No issue — Muslim-majority country. Virtually all meat is halal by default.',
  'south-korea': 'Limited. Itaewon district in Seoul has halal restaurants. Korean BBQ is generally not halal. Seafood and vegetarian options are safer bets.',
  mexico: 'Very limited. Cook your own food or eat seafood/vegetarian. A few halal restaurants in Mexico City.',
  australia: 'Good availability in Sydney and Melbourne. Lakemba (Sydney) and Brunswick (Melbourne) have many halal eateries.',
  germany: 'Berlin and Cologne have many halal options, largely Turkish. Doner kebab shops are usually halal — ask to confirm.',
  spain: 'Available in Barcelona and Madrid. North African and Middle Eastern restaurants serve halal. "El Rincón" restaurants in barrios with Moroccan communities.',
  'united-states': 'Available in major cities. The Halal Guys chain is in most large cities. Zabihah app has comprehensive listings.',
}

const EMERGENCY_PHRASES: Record<string, { vegetarian: string; noMeat: string; language: string }> = {
  japan: { vegetarian: 'Watashi wa bejitarian desu', noMeat: 'Niku nashi, sakana nashi', language: 'Japanese' },
  india: { vegetarian: 'Main shakahari hoon', noMeat: 'Maans nahi, machli nahi', language: 'Hindi' },
  thailand: { vegetarian: 'Phom/Chan gin jay', noMeat: 'Mai sai neua, mai sai pla', language: 'Thai' },
  france: { vegetarian: 'Je suis vegetarien(ne)', noMeat: 'Sans viande, sans poisson', language: 'French' },
  italy: { vegetarian: 'Sono vegetariano/a', noMeat: 'Senza carne, senza pesce', language: 'Italian' },
  turkey: { vegetarian: 'Ben vejetaryenim', noMeat: 'Etsiz, baliksiz', language: 'Turkish' },
  'south-korea': { vegetarian: 'Jeoneun chaeshikjuuija-imnida', noMeat: 'Gogi eobseo, saengseon eobseo', language: 'Korean' },
  mexico: { vegetarian: 'Soy vegetariano/a', noMeat: 'Sin carne, sin pescado', language: 'Spanish' },
  germany: { vegetarian: 'Ich bin Vegetarier/in', noMeat: 'Ohne Fleisch, ohne Fisch', language: 'German' },
  spain: { vegetarian: 'Soy vegetariano/a', noMeat: 'Sin carne ni pescado', language: 'Spanish' },
}

const KIDS_COUNTRY_TIPS: Record<string, string> = {
  japan: 'Japan is incredibly kid-friendly. Train stations have stroller elevators. Convenience stores sell baby food. Most restaurants have kids\' menus. Family bathrooms are everywhere.',
  india: 'India loves children — strangers will be very friendly. Carry hand sanitizer and bottled water. Stick to bottled/cooked food for kids. Most hotels gladly provide cribs.',
  thailand: 'Very family-friendly. Beaches have shallow water areas. 7-Eleven on every corner for snacks. Most Thais adore children and will be helpful.',
  france: 'Parks and playgrounds everywhere in Paris. Most restaurants welcome children. The Jardin du Luxembourg has toy boats and puppet shows. Pharmacies sell everything for babies.',
  italy: 'Italians love bambini. Late dinners are normal — kids eating at 9 PM is fine here. Gelato is kid-approved. Cobblestones make strollers tricky — bring a carrier.',
  'united-kingdom': 'Very family-oriented. Free museums (Natural History, Science Museum) are perfect for kids. Most pubs have kids\' menus until early evening.',
  turkey: 'Turks are very welcoming to children. Tea gardens and parks everywhere. Bazaars are exciting for kids. Watch out for stray cats (friendly but unpredictable).',
  'south-korea': 'Extremely kid-friendly. Jjimjilbangs (bath houses) have play areas. Lotte World and Everland theme parks. Korean restaurants often have floor seating — bring a cushion.',
  australia: 'Beaches, wildlife parks, and outdoor activities galore. Sun protection is critical — Australia has very strong UV. Slip, slop, slap (slip on a shirt, slop on sunscreen, slap on a hat).',
  mexico: 'Mexicans love families and children. All-inclusive resorts on the coast have kids\' clubs. Street food is exciting for adventurous eaters. Carry water purification tablets.',
}

/* ─── section nav ─── */
const SECTIONS = [
  { id: 'phone', label: 'Phone & Connectivity', icon: '1' },
  { id: 'food', label: 'Food Preparation', icon: '2' },
  { id: 'kids', label: 'Traveling with Kids', icon: '3' },
  { id: 'downloads', label: 'Download Everything', icon: '4' },
  { id: 'money', label: 'Money & Cards', icon: '5' },
  { id: 'health', label: 'Health Preparation', icon: '6' },
  { id: 'airport', label: 'Airport & Flights', icon: '7' },
]

/* ─── helper components ─── */
function SectionHeading({ number, title, subtitle, color }: { number: string; title: string; subtitle: string; color: string }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: color,
            color: '#fff',
            fontFamily: 'serif',
            fontWeight: 700,
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          {number}
        </span>
        <h2 style={{ fontFamily: 'serif', fontSize: 32, fontWeight: 700, color: C.dark, margin: 0 }}>{title}</h2>
      </div>
      <p style={{ color: C.muted, fontSize: 17, margin: 0, paddingLeft: 64 }}>{subtitle}</p>
    </div>
  )
}

function Tip({ children, accent = C.primary }: { children: React.ReactNode; accent?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        padding: '14px 18px',
        background: accent === C.primary ? C.lightBlue : accent === C.secondary ? C.lightAmber : accent === C.green ? C.lightGreen : accent === C.rose ? C.lightRose : C.lightPurple,
        borderLeft: `4px solid ${accent}`,
        borderRadius: 8,
        marginBottom: 10,
        fontSize: 15,
        lineHeight: 1.7,
        color: C.dark,
      }}
    >
      <span style={{ flexShrink: 0, marginTop: 2 }}>&#x2022;</span>
      <span>{children}</span>
    </div>
  )
}

function Card({ title, children, accent = C.primary }: { title: string; children: React.ReactNode; accent?: string }) {
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: 28,
        marginBottom: 24,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <h3 style={{ fontFamily: 'serif', fontSize: 21, fontWeight: 700, color: accent, marginTop: 0, marginBottom: 16 }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function StepList({ steps }: { steps: string[] }) {
  return (
    <ol style={{ margin: 0, paddingLeft: 22, lineHeight: 2, color: C.dark, fontSize: 15 }}>
      {steps.map((s, i) => (
        <li key={i} style={{ marginBottom: 4 }}>
          {s}
        </li>
      ))}
    </ol>
  )
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 12px',
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 600,
        color: '#fff',
        background: color,
        marginRight: 8,
      }}
    >
      {label}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function TripPrepPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const country = useMemo(() => COUNTRIES.find((c) => c.id === selectedCountry), [selectedCountry])

  const sim = selectedCountry ? LOCAL_SIM[selectedCountry] : null
  const veg = selectedCountry ? VEG_DIFFICULTY[selectedCountry] : null
  const halal = selectedCountry ? HALAL_INFO[selectedCountry] : null
  const phrase = selectedCountry ? EMERGENCY_PHRASES[selectedCountry] : null
  const kidsTip = selectedCountry ? KIDS_COUNTRY_TIPS[selectedCountry] : null

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.dark }}>
      {/* ─── HERO ─── */}
      <header
        style={{
          background: `linear-gradient(135deg, ${C.dark} 0%, #1E293B 100%)`,
          padding: '72px 24px 60px',
          textAlign: 'center',
        }}
      >
        <p style={{ color: C.secondary, fontWeight: 700, fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
          WorldTourly Presents
        </p>
        <h1
          style={{
            fontFamily: 'serif',
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '0 auto 16px',
            maxWidth: 800,
            lineHeight: 1.15,
          }}
        >
          Trip Preparation Masterclass
        </h1>
        <p style={{ color: '#CBD5E1', fontSize: 'clamp(16px, 2.5vw, 22px)', maxWidth: 680, margin: '0 auto 36px', lineHeight: 1.5 }}>
          Everything to Do Before You Fly
        </p>
        <p style={{ color: '#94A3B8', fontSize: 15, maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
          The stuff people wish someone told them BEFORE they left. Seven sections of hard-won travel wisdom, customized for your destination.
        </p>
      </header>

      {/* ─── COUNTRY SELECTOR ─── */}
      <div
        style={{
          maxWidth: 860,
          margin: '-32px auto 0',
          padding: '0 24px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: C.card,
            borderRadius: 16,
            padding: '28px 32px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <label style={{ fontFamily: 'serif', fontSize: 18, fontWeight: 700, color: C.dark }}>
            Where are you going?
          </label>
          <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>
            Select a destination to unlock country-specific advice throughout the guide.
          </p>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            style={{
              width: '100%',
              maxWidth: 420,
              padding: '14px 18px',
              borderRadius: 10,
              border: `2px solid ${C.border}`,
              fontSize: 16,
              color: C.dark,
              background: C.bg,
              cursor: 'pointer',
              outline: 'none',
              appearance: 'auto',
            }}
          >
            <option value="">-- Choose your destination --</option>
            {COUNTRIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.name} ({c.continent})
              </option>
            ))}
          </select>
          {country && (
            <p style={{ color: C.primary, fontSize: 14, fontWeight: 600, margin: 0 }}>
              Showing personalized tips for {country.flag} {country.name}
            </p>
          )}
        </div>
      </div>

      {/* ─── SECTION NAV ─── */}
      <nav
        style={{
          maxWidth: 860,
          margin: '32px auto 0',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: 'center',
          }}
        >
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 999,
                background: C.card,
                border: `1px solid ${C.border}`,
                color: C.dark,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all .15s',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: C.primary,
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {s.icon}
              </span>
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ─── CONTENT ─── */}
      <main style={{ maxWidth: 860, margin: '56px auto 0', padding: '0 24px 100px' }}>
        {/* ═══════════════════════════════════════════════════════════════
           1. PHONE & CONNECTIVITY
           ═══════════════════════════════════════════════════════════════ */}
        <section id="phone" style={{ marginBottom: 80 }}>
          <SectionHeading
            number="1"
            title="Phone & Connectivity"
            subtitle="The single most important thing to sort out before you fly. Without a working phone, you cannot navigate, translate, message, or call a ride."
            color={C.primary}
          />

          <Card title="Before You Leave Home" accent={C.primary}>
            <Tip>
              <strong>Check if your phone is unlocked.</strong> Call your carrier and explicitly ask: &quot;Is my phone SIM-unlocked for international use?&quot; If not, request an unlock — most carriers do it free after your contract period. An unlocked phone lets you use any local SIM card abroad.
            </Tip>
            <Tip>
              <strong>Check eSIM compatibility.</strong> Most phones from 2020 onward support eSIM (iPhone XS and later, Pixel 3 and later, Samsung S20 and later). Go to Settings &rarr; Cellular &rarr; look for &quot;Add eSIM&quot; or &quot;Add Cellular Plan.&quot; If you see it, you can skip the physical SIM entirely.
            </Tip>
            <Tip>
              <strong>Download offline Google Maps NOW.</strong> Open Google Maps &rarr; search for your destination city &rarr; tap your profile picture &rarr; Offline maps &rarr; Select your own map &rarr; zoom to cover the area you need &rarr; tap Download. This works for navigation without any internet connection.
            </Tip>
            <Tip>
              <strong>Set up WiFi calling.</strong> Go to Settings &rarr; Phone &rarr; WiFi Calling and enable it. This lets you make and receive regular calls over any WiFi network — even without cell service.
            </Tip>
          </Card>

          <Card title="US Carriers That Work Internationally" accent={C.primary}>
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: C.dark, fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>T-Mobile Magenta / Magenta Max</h4>
              <Tip>
                Free international data in 215+ countries. Speed is slow 2G, but it works for Google Maps, messaging, and email. Voice calls cost $0.25/minute. Works in Japan, India, Thailand, France, Italy, UK, and most of Europe. Upgrade to <strong>International Pass ($5/day)</strong> for high-speed 5G/LTE data — worth it if you need maps and ride-hailing to work fast.
              </Tip>
            </div>
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: C.dark, fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>Google Fi</h4>
              <Tip>
                Works in 200+ countries. $10/GB used abroad, same rate as domestic. No extra setup — just land and your phone works. Best value for data-heavy travelers who use 1-3 GB abroad. If you already have Google Fi, you literally do nothing — it just works.
              </Tip>
            </div>
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: C.dark, fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>AT&T International Day Pass</h4>
              <Tip>
                $10/day for full-speed data, calls, and texts. Expensive for long trips but gives you full speed. Only charged on days you actually use your phone abroad. Good for short trips (3-5 days). On a 14-day trip, that is $140 — consider a local SIM instead.
              </Tip>
            </div>
            <div>
              <h4 style={{ color: C.dark, fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>Verizon TravelPass</h4>
              <Tip>
                $10/day for most countries, $5/day for Mexico and Canada. Same concept as AT&T — per-day charge. Best used for very short trips only.
              </Tip>
            </div>
          </Card>

          {sim && country && (
            <Card title={`Local SIM in ${country.name}`} accent={C.secondary}>
              <Tip accent={C.secondary}>
                <strong>Providers:</strong> {sim.providers}
              </Tip>
              <Tip accent={C.secondary}>
                <strong>Details:</strong> {sim.detail}
              </Tip>
            </Card>
          )}

          <Card title="eSIM Providers (No Physical SIM Needed)" accent={C.primary}>
            <p style={{ color: C.muted, fontSize: 15, marginTop: 0, marginBottom: 16, lineHeight: 1.7 }}>
              eSIM is the future. You buy a data plan online, scan a QR code, and your phone connects to a local network the moment you land. No SIM card swapping, no finding a phone shop at the airport.
            </p>
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: C.dark, fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>Airalo</h4>
              <Tip>
                190+ countries. Plans from $5/GB. Best variety of countries and plans. Has regional eSIMs (one plan for all of Europe, all of Asia, etc.). Download the Airalo app, pick your destination, buy a plan, install the eSIM — all before you leave home.
              </Tip>
            </div>
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: C.dark, fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>Holafly</h4>
              <Tip>
                Unlimited data plans in 60+ countries. More expensive than Airalo but truly unlimited — no throttling, no caps. Great for heavy data users (video calls, streaming, constant maps). Plans start around $19 for 5 days.
              </Tip>
            </div>
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: C.dark, fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>Nomad</h4>
              <Tip>
                Great Asia coverage with competitive prices. Good option if Airalo does not cover your destination or if you want a second choice to compare prices.
              </Tip>
            </div>
            <div
              style={{
                background: C.lightAmber,
                borderRadius: 10,
                padding: 20,
                border: `1px solid ${C.secondary}40`,
              }}
            >
              <h4 style={{ color: C.secondary, fontSize: 15, fontWeight: 700, margin: '0 0 10px' }}>
                How to Set Up an eSIM (Do This BEFORE Leaving)
              </h4>
              <StepList
                steps={[
                  'Buy your eSIM plan from Airalo, Holafly, or Nomad',
                  'Go to Settings → Cellular → Add eSIM (or Add Cellular Plan)',
                  'Scan the QR code provided by the eSIM provider',
                  'Label the new line (e.g., "Travel Data")',
                  'Keep your primary line active for your home number',
                  'When you land: Settings → Cellular → turn ON the travel eSIM for data',
                  'Turn OFF data roaming on your primary line to avoid charges',
                ]}
              />
            </div>
          </Card>

          <Card title="WiFi Calling — Free Communication Anywhere" accent={C.green}>
            <p style={{ color: C.muted, fontSize: 15, marginTop: 0, marginBottom: 16, lineHeight: 1.7 }}>
              Even without a SIM card, you can communicate for free on any WiFi network. Set these up before you leave.
            </p>
            <Tip accent={C.green}>
              <strong>WhatsApp</strong> — calls and video calls work on WiFi everywhere, completely free. This is the default messaging app in India, Latin America, Europe, and most of the world. Download it if you have not already. Seriously.
            </Tip>
            <Tip accent={C.green}>
              <strong>iMessage</strong> — works over WiFi between Apple devices. Blue bubbles work without cell service.
            </Tip>
            <Tip accent={C.green}>
              <strong>FaceTime</strong> — video and audio calls over WiFi, free. Works great even on hotel WiFi.
            </Tip>
            <Tip accent={C.green}>
              <strong>Telegram</strong> — popular in Russia, Iran, and parts of Central Asia. Lighter on data than WhatsApp.
            </Tip>
            <Tip accent={C.green}>
              <strong>Pro tip:</strong> Save your hotel&apos;s WiFi password in your notes before you go out. When you are lost or need to communicate, duck into any cafe with WiFi — most cafes worldwide have free WiFi.
            </Tip>
          </Card>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
           2. FOOD PREPARATION
           ═══════════════════════════════════════════════════════════════ */}
        <section id="food" style={{ marginBottom: 80 }}>
          <SectionHeading
            number="2"
            title="Food Preparation"
            subtitle="Vegetarian, vegan, and halal travelers: this section will save you from going hungry. Read it twice."
            color={C.secondary}
          />

          <Card title="General Tips for Dietary Restrictions Abroad" accent={C.secondary}>
            <Tip accent={C.secondary}>
              <strong>Download the Happy Cow app</strong> — it finds vegetarian and vegan restaurants worldwide, with reviews and directions. It has saved more vegetarian travelers than any other app. Use it.
            </Tip>
            <Tip accent={C.secondary}>
              <strong>Learn the key phrases.</strong> Before every trip, memorize how to say &quot;I am vegetarian&quot; and &quot;no meat, no fish&quot; in the local language. Write it on your phone lock screen so you can show it to waiters.
            </Tip>
            <Tip accent={C.secondary}>
              <strong>Carry a printed dietary card.</strong> Google &quot;vegetarian card [language]&quot; and print a card that explains your restrictions in the local language. Hand it to the server at every restaurant. This works better than trying to explain verbally, especially in countries where English is limited.
            </Tip>
            <Tip accent={C.secondary}>
              <strong>Research before you go.</strong> Spend 30 minutes finding 5-10 veg-friendly restaurants near your hotel. Save them in Google Maps with a star. You will thank yourself at 9 PM when you are starving and nothing looks safe.
            </Tip>
          </Card>

          {phrase && country && (
            <Card title={`Say It in ${phrase.language}`} accent={C.secondary}>
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ background: C.lightAmber, borderRadius: 10, padding: 16 }}>
                  <p style={{ margin: 0, fontSize: 13, color: C.muted, fontWeight: 600 }}>&quot;I am vegetarian&quot; in {phrase.language}:</p>
                  <p style={{ margin: '6px 0 0', fontSize: 20, fontWeight: 700, color: C.dark }}>{phrase.vegetarian}</p>
                </div>
                <div style={{ background: C.lightAmber, borderRadius: 10, padding: 16 }}>
                  <p style={{ margin: 0, fontSize: 13, color: C.muted, fontWeight: 600 }}>&quot;No meat, no fish&quot; in {phrase.language}:</p>
                  <p style={{ margin: '6px 0 0', fontSize: 20, fontWeight: 700, color: C.dark }}>{phrase.noMeat}</p>
                </div>
              </div>
              <p style={{ color: C.muted, fontSize: 13, marginTop: 12, marginBottom: 0 }}>
                Screenshot these phrases. Show them to restaurant staff.
              </p>
            </Card>
          )}

          <Card title="Instant Food to Pack in Your Suitcase" accent={C.secondary}>
            <p style={{ color: C.muted, fontSize: 15, marginTop: 0, marginBottom: 16, lineHeight: 1.7 }}>
              Pack these for emergencies — late-night hunger when nothing is open, early morning before restaurants open, long train rides, or when you just cannot find anything safe to eat.
            </p>
            <Tip accent={C.secondary}><strong>Cup noodles</strong> — vegetarian varieties from Asian grocery stores. Just add hot water. Pack 3-5 cups.</Tip>
            <Tip accent={C.secondary}><strong>Instant oatmeal packets</strong> — ask hotel reception for hot water. Breakfast sorted.</Tip>
            <Tip accent={C.secondary}><strong>Trail mix, nuts, and dried fruit</strong> — calorie-dense, no preparation needed, survives any climate.</Tip>
            <Tip accent={C.secondary}><strong>Protein bars</strong> — check they are vegan if needed (many contain whey). Clif Bars, KIND bars, RXBAR are good options.</Tip>
            <Tip accent={C.secondary}><strong>Instant soup packets</strong> — lightweight, just add hot water. Pack 5-6 packets.</Tip>
            <Tip accent={C.secondary}><strong>Peanut butter packets</strong> — single-serve packets. Spread on local bread for a filling meal.</Tip>
            <Tip accent={C.secondary}><strong>Instant rice cups</strong> — add hot water, wait 12 minutes. Pairs with instant soup for a real meal.</Tip>
            <Tip accent={C.secondary}><strong>Seaweed snacks</strong> — lightweight, healthy, satisfying. Available at any Asian grocery store.</Tip>

            <div
              style={{
                background: C.lightBlue,
                borderRadius: 10,
                padding: 20,
                marginTop: 16,
                border: `1px solid ${C.primary}30`,
              }}
            >
              <h4 style={{ color: C.primary, fontSize: 15, fontWeight: 700, margin: '0 0 10px' }}>
                Where to Find Hot Water Abroad
              </h4>
              <Tip accent={C.primary}>
                <strong>Hotel reception</strong> — just ask. Every hotel has a kettle or hot water dispenser somewhere.
              </Tip>
              <Tip accent={C.primary}>
                <strong>Convenience stores</strong> — 7-Eleven in Japan, Thailand, and Taiwan has hot water dispensers specifically for cup noodles. Family Mart and Lawson too.
              </Tip>
              <Tip accent={C.primary}>
                <strong>Restaurants and cafes</strong> — walk in and politely ask for hot water. Most places worldwide will give you hot water for free or for a tiny charge.
              </Tip>
              <Tip accent={C.primary}>
                <strong>Pack a portable electric kettle</strong> — a small travel kettle (under $20) is a game-changer if you eat a lot of instant food. Boils water in 3 minutes.
              </Tip>
            </div>
          </Card>

          {veg && country && (
            <Card title={`Vegetarian/Vegan Guide for ${country.name}`} accent={veg.color}>
              <div style={{ marginBottom: 16 }}>
                <Badge label={`${veg.level} — Veg Difficulty`} color={veg.color} />
              </div>
              <h4 style={{ color: C.dark, fontSize: 16, fontWeight: 700, margin: '0 0 10px' }}>Top Vegetarian Dishes to Look For</h4>
              {veg.dishes.map((d, i) => (
                <Tip key={i} accent={C.green}>{d}</Tip>
              ))}
              <h4 style={{ color: C.dark, fontSize: 16, fontWeight: 700, margin: '20px 0 10px' }}>What to Watch Out For</h4>
              <Tip accent={C.rose}>{veg.avoid}</Tip>
            </Card>
          )}

          <Card title="Vegetarian/Vegan Difficulty by Country" accent={C.secondary}>
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ color: C.green, fontSize: 16, fontWeight: 700, margin: '0 0 10px' }}>EASY (Excellent vegetarian options)</h4>
              <p style={{ color: C.dark, fontSize: 15, lineHeight: 1.8, margin: 0 }}>
                <strong>India</strong> (40% of the population is vegetarian — this is paradise), <strong>Thailand</strong> (Buddhist food stalls near every temple), <strong>Taiwan</strong> (Buddhist influence, incredible vegan street food), <strong>Israel</strong> (falafel, hummus, sabich everywhere), <strong>UK</strong> (clearly labeled menus, huge vegan movement), <strong>Australia</strong> (Melbourne is the vegan capital of the world).
              </p>
            </div>
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ color: C.secondary, fontSize: 16, fontWeight: 700, margin: '0 0 10px' }}>MODERATE (Options available but you need to look)</h4>
              <p style={{ color: C.dark, fontSize: 15, lineHeight: 1.8, margin: 0 }}>
                <strong>Japan</strong> (amazing food but dashi fish stock hides in everything), <strong>Italy</strong> (cheese-heavy but pasta and pizza work), <strong>France</strong> (butter culture but creping along), <strong>Germany</strong> (traditional food is meaty but Berlin is a vegan paradise), <strong>Turkey</strong> (great mezes but meat stock in soups), <strong>Mexico</strong> (lard in beans — ask), <strong>Spain</strong> (tapas can work, but jamon is in everything).
              </p>
            </div>
            <div>
              <h4 style={{ color: C.rose, fontSize: 16, fontWeight: 700, margin: '0 0 10px' }}>HARD (Pack your instant noodles)</h4>
              <p style={{ color: C.dark, fontSize: 15, lineHeight: 1.8, margin: 0 }}>
                <strong>South Korea</strong> (meat-centric, fish sauce in side dishes, shrimp paste in kimchi), <strong>Argentina</strong> (steak culture — vegetarians are aliens here), <strong>Mongolia</strong> (meat and dairy are basically the only food groups), <strong>Brazil</strong> (churrascaria everywhere, but big cities have options).
              </p>
            </div>
          </Card>

          <Card title="Halal Travelers" accent={C.purple}>
            <Tip accent={C.purple}>
              <strong>Download HalalTrip or Zabihah apps</strong> — they map halal restaurants worldwide with reviews and certification status.
            </Tip>
            <Tip accent={C.purple}>
              <strong>Muslim-majority countries:</strong> no issue at all. Turkey, UAE, Morocco, Jordan, Indonesia, Malaysia, Egypt — virtually all food is halal by default.
            </Tip>
            <Tip accent={C.purple}>
              <strong>Europe:</strong> halal restaurants exist in most major cities. London, Paris, and Berlin are well-served. Look for Turkish, Middle Eastern, and South Asian restaurants.
            </Tip>
            <Tip accent={C.purple}>
              <strong>Japan:</strong> limited but growing. Ask for &quot;halal&quot; at tourist information centers. Halal Gourmet Japan app is essential.
            </Tip>
            <Tip accent={C.purple}>
              <strong>When in doubt:</strong> seafood and vegetarian options are always safe alternatives.
            </Tip>

            {halal && country && (
              <div style={{ background: C.lightPurple, borderRadius: 10, padding: 16, marginTop: 16, border: `1px solid ${C.purple}30` }}>
                <p style={{ margin: 0, fontSize: 13, color: C.muted, fontWeight: 600 }}>Halal Info for {country.name}:</p>
                <p style={{ margin: '8px 0 0', fontSize: 15, color: C.dark, lineHeight: 1.7 }}>{halal}</p>
              </div>
            )}
          </Card>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
           3. TRAVELING WITH KIDS
           ═══════════════════════════════════════════════════════════════ */}
        <section id="kids" style={{ marginBottom: 80 }}>
          <SectionHeading
            number="3"
            title="Traveling with Kids"
            subtitle="International travel with children requires extra preparation. Get these right and the trip will be magical for everyone."
            color={C.rose}
          />

          <Card title="Documents — Do Not Skip This" accent={C.rose}>
            <Tip accent={C.rose}>
              <strong>Kids need their OWN passport.</strong> No exceptions. Apply 6-8 weeks before your trip. Both parents must be present at the passport office for children under 16 (US rule). Expedited processing costs extra but takes 2-3 weeks.
            </Tip>
            <Tip accent={C.rose}>
              <strong>Some countries require a birth certificate.</strong> Carry a certified copy — not the original. Countries like Brazil and South Africa may ask for it at immigration.
            </Tip>
            <Tip accent={C.rose}>
              <strong>Single parent traveling alone?</strong> You may need a notarized consent letter from the other parent. This is legally required in some countries (Brazil, South Africa, Mexico) and can be requested at any border. Template: &quot;I, [other parent name], authorize [your name] to travel internationally with our child [child name] from [date] to [date].&quot; Get it notarized.
            </Tip>
            <Tip accent={C.rose}>
              <strong>Copies of everything.</strong> Email yourself scanned copies of all passports, birth certificates, consent letters, and insurance cards. If you lose the originals, you have digital backups.
            </Tip>
          </Card>

          <Card title="Flight Preparation" accent={C.rose}>
            <Tip accent={C.rose}>
              <strong>Book a bassinet seat for babies.</strong> Call the airline directly — this cannot always be done online. Bassinet seats are on the bulkhead (front row) and have a fold-down crib. Reserve as early as possible — there are usually only 2-4 per plane.
            </Tip>
            <Tip accent={C.rose}>
              <strong>Bring more snacks than you think.</strong> Flights get delayed. Layovers get extended. A hungry toddler on a plane is a nightmare for everyone. Pack goldfish crackers, fruit pouches, granola bars, and a refillable water bottle (fill after security).
            </Tip>
            <Tip accent={C.rose}>
              <strong>Entertainment strategy:</strong> Download shows offline on iPad/tablet before the trip. Bring kid-sized headphones (regular headphones fall off little heads). New small toys (dollar store finds) — reveal one per hour of flight. Coloring books and stickers.
            </Tip>
            <Tip accent={C.rose}>
              <strong>Ear pressure:</strong> For babies, nurse or bottle-feed during takeoff and landing. For toddlers, give them a lollipop or juice box with a straw. Chewing and swallowing equalizes ear pressure.
            </Tip>
          </Card>

          <Card title="Stroller Strategy" accent={C.rose}>
            <Tip accent={C.rose}>
              <strong>Bring an umbrella stroller for travel</strong> — not a bulky jogging stroller. Lightweight, foldable, easy to gate-check. Most airlines gate-check strollers for free.
            </Tip>
            <Tip accent={C.rose}>
              <strong>Cobblestone cities</strong> (Rome, Marrakech, Lisbon, Prague, old towns everywhere): consider a baby carrier or sling instead of a stroller. Cobblestones are brutal on stroller wheels. Ergo carriers or ring slings work great for babies and toddlers up to 35 lbs.
            </Tip>
            <Tip accent={C.rose}>
              <strong>Metro/subway considerations:</strong> Many older subway systems (Paris, London, Rome) have limited elevator access. You will need to carry the stroller up and down stairs. Another reason to go lightweight.
            </Tip>
          </Card>

          <Card title="Health & Safety for Kids" accent={C.rose}>
            <Tip accent={C.rose}>
              <strong>Pack a basic first aid kit:</strong> Children&apos;s Tylenol/Ibuprofen (with dosing syringe), Band-aids, antihistamine (Benadryl), thermometer, hand sanitizer, anti-itch cream, saline nasal spray.
            </Tip>
            <Tip accent={C.rose}>
              <strong>Know the local emergency number.</strong> 112 works across all of the EU. 911 in the US and Canada. 119 in Japan and South Korea. 100/108 in India. Save the number in your phone before you arrive.
            </Tip>
            <Tip accent={C.rose}>
              <strong>Medical card:</strong> Carry a card with your child&apos;s blood type, allergies, current medications, and your emergency contacts — written in both English and the local language. If something happens, paramedics need this information fast.
            </Tip>
            <Tip accent={C.rose}>
              <strong>Travel insurance is not optional with kids.</strong> A pediatric hospital visit abroad can cost thousands. Get family travel insurance that covers medical evacuation. SafetyWing and World Nomads both offer family plans.
            </Tip>
          </Card>

          <Card title="Jet Lag Strategy for Kids" accent={C.rose}>
            <Tip accent={C.rose}>
              <strong>Arrive one day early.</strong> Do not plan activities for your first day. Use it to rest and adjust. Kids need this more than adults.
            </Tip>
            <Tip accent={C.rose}>
              <strong>Keep them awake until local bedtime.</strong> It is tempting to let them nap at 3 PM, but this makes jet lag worse. Push through to 7-8 PM local time.
            </Tip>
            <Tip accent={C.rose}>
              <strong>Sunlight is your weapon.</strong> Natural sunlight resets the circadian rhythm faster than anything else. Get outside in the morning and afternoon.
            </Tip>
            <Tip accent={C.rose}>
              <strong>Melatonin for kids:</strong> Check with your pediatrician before the trip. Low-dose melatonin (0.5-1mg) can help children over 3 years old adjust to new time zones. Only use it for the first 2-3 nights.
            </Tip>
          </Card>

          <Card title="Entertainment That Works" accent={C.rose}>
            <Tip accent={C.rose}><strong>Download offline games</strong> on tablets — Toca Boca, PBS Kids, drawing apps, puzzle games.</Tip>
            <Tip accent={C.rose}><strong>Audiobooks</strong> — Audible has a great kids&apos; section. Download 3-4 books for long flights and car rides.</Tip>
            <Tip accent={C.rose}><strong>Coloring and activity books</strong> — old school but works. Bring colored pencils (not markers — they dry out and explode at altitude).</Tip>
            <Tip accent={C.rose}><strong>&quot;I Spy&quot; and scavenger hunts</strong> — make a list of things to spot at each attraction. Kids pay more attention when they are looking for something specific.</Tip>
            <Tip accent={C.rose}><strong>Travel journal</strong> — give older kids (6+) a notebook to draw and write about each day. They will treasure it years later.</Tip>
          </Card>

          {kidsTip && country && (
            <Card title={`Kids in ${country.name}`} accent={C.rose}>
              <Tip accent={C.rose}>{kidsTip}</Tip>
            </Card>
          )}
        </section>

        {/* ═══════════════════════════════════════════════════════════════
           4. DOWNLOAD EVERYTHING
           ═══════════════════════════════════════════════════════════════ */}
        <section id="downloads" style={{ marginBottom: 80 }}>
          <SectionHeading
            number="4"
            title="Download Everything Before You Go"
            subtitle="Your WiFi at home is fast and free. Airport and hotel WiFi is slow and unreliable. Download everything NOW while you are on your couch."
            color={C.primary}
          />

          <Card title="Google Maps Offline — Non-Negotiable" accent={C.primary}>
            <p style={{ color: C.muted, fontSize: 15, marginTop: 0, marginBottom: 16, lineHeight: 1.7 }}>
              This is the single most important download. Offline Google Maps lets you navigate, search for restaurants, and get directions — all without internet. Do this for every city you are visiting.
            </p>
            <StepList
              steps={[
                'Open Google Maps on your phone',
                'Search for your destination city (e.g., "Tokyo" or "Paris")',
                'Tap your profile picture in the top right corner',
                'Tap "Offline maps"',
                'Tap "Select your own map"',
                'Pinch and zoom to cover the area you need (city center + airport + hotel area)',
                'Tap "Download" — it will save the full map with streets, transit, and points of interest',
                'Repeat for every city on your itinerary',
              ]}
            />
            <p style={{ color: C.primary, fontSize: 14, fontWeight: 600, marginTop: 16, marginBottom: 0 }}>
              Each city map is typically 100-400 MB. Download on WiFi.
            </p>
          </Card>

          <Card title="Google Translate Offline — Your Pocket Interpreter" accent={C.primary}>
            <p style={{ color: C.muted, fontSize: 15, marginTop: 0, marginBottom: 16, lineHeight: 1.7 }}>
              Google Translate works offline — including the camera feature that translates signs, menus, and documents in real-time just by pointing your phone at them.
            </p>
            <StepList
              steps={[
                'Open Google Translate',
                'Tap the language you need (e.g., Japanese, French, Thai)',
                'Tap the download icon (arrow) next to the language name',
                'Wait for the download to complete (usually 30-50 MB per language)',
                'Now you can translate text, voice, AND camera (point at signs/menus) without internet',
              ]}
            />
            <Tip>
              <strong>Pro tip:</strong> Download BOTH English-to-target AND target-to-English. Also download the languages of any transit countries (e.g., if you have a layover in Istanbul, download Turkish).
            </Tip>
          </Card>

          <Card title="Entertainment Downloads for Flights" accent={C.primary}>
            <Tip>
              <strong>Spotify:</strong> Go to each playlist you want &rarr; tap the download toggle. You need Spotify Premium for offline downloads. Download 4-6 hours of music and 2-3 podcast episodes.
            </Tip>
            <Tip>
              <strong>Netflix / Prime Video:</strong> Find the movie or show &rarr; tap the download button. You must start the download on WiFi. Download 2-3 movies for a long-haul flight. Netflix downloads expire after 48 hours of first play.
            </Tip>
            <Tip>
              <strong>YouTube Premium:</strong> Download videos for offline viewing. Great for travel vlogs of your destination — watch them on the flight to get excited and plan.
            </Tip>
            <Tip>
              <strong>Kindle / Audible:</strong> Download books and audiobooks. One good book can last an entire transatlantic flight.
            </Tip>
          </Card>

          <Card title="Essential Travel Apps to Download" accent={C.primary}>
            <div style={{ display: 'grid', gap: 8 }}>
              <Tip>
                <strong>Maps.me</strong> — alternative offline maps. Better than Google Maps for hiking trails and rural areas in some countries. Has walking routes that Google misses.
              </Tip>
              <Tip>
                <strong>XE Currency</strong> — download for offline currency conversion. When a street vendor says &quot;500 baht,&quot; you need to instantly know that is $14. This app works without internet once downloaded.
              </Tip>
              <Tip>
                <strong>Uber / Grab / Ola / Bolt</strong> — download the ride-hailing app for your destination BEFORE you leave. Uber works in most of the Americas, Europe, Australia. Grab works in Southeast Asia. Ola works in India and UK. Bolt works in Europe and Africa. You cannot download apps on slow airport WiFi at 1 AM.
              </Tip>
              <Tip>
                <strong>WhatsApp</strong> — already mentioned, but repeating because it is THAT important. The world runs on WhatsApp. Hotels, tour guides, and restaurants communicate via WhatsApp. Download it.
              </Tip>
              <Tip>
                <strong>Google Lens</strong> — camera-based translation and identification. Point it at a sign, menu, or object and it tells you what it is. Works offline for text recognition.
              </Tip>
              <Tip>
                <strong>Wise (TransferWise)</strong> — the app for managing your Wise card. Also great for sending money internationally if you need to pay for a hotel or tour in advance.
              </Tip>
            </div>
          </Card>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
           5. MONEY & CARDS
           ═══════════════════════════════════════════════════════════════ */}
        <section id="money" style={{ marginBottom: 80 }}>
          <SectionHeading
            number="5"
            title="Money & Cards Preparation"
            subtitle="Nothing ruins a trip faster than a declined card at a foreign ATM at midnight. Sort this out before you leave."
            color={C.green}
          />

          <Card title="Tell Your Bank You Are Traveling" accent={C.green}>
            <Tip accent={C.green}>
              <strong>This is step one.</strong> Call your bank or set a travel notice in your banking app. Tell them every country you are visiting and your travel dates. If you do not do this, your bank will see a charge from Bangkok and freeze your card. This happens to people every single day.
            </Tip>
            <Tip accent={C.green}>
              <strong>Set travel notices on ALL your cards</strong> — checking account debit card, credit cards, backup cards. Every single one. Do it a week before departure.
            </Tip>
            <Tip accent={C.green}>
              <strong>Know your PIN.</strong> Many countries require a 4-digit PIN for both debit and credit card transactions. If you only ever tap or sign in your home country, you may not know your PIN. Call and set one up.
            </Tip>
          </Card>

          <Card title="Best Cards for International Travel" accent={C.green}>
            <Tip accent={C.green}>
              <strong>No-foreign-transaction-fee credit cards:</strong> Chase Sapphire Preferred/Reserve, Capital One Venture, Citi Premier. These save you 3% on every purchase abroad (most cards charge a 3% foreign transaction fee).
            </Tip>
            <Tip accent={C.green}>
              <strong>Charles Schwab Investor Checking debit card:</strong> Reimburses ALL ATM fees worldwide. Every single one. Withdraw cash from any ATM in any country and the fee gets refunded at the end of the month. This is the single best debit card for travelers.
            </Tip>
            <Tip accent={C.green}>
              <strong>Wise (formerly TransferWise) card:</strong> Multi-currency card with the real exchange rate, no markup. Hold 50+ currencies. Convert at the mid-market rate. Incredibly low fees. Best for travelers who visit multiple countries.
            </Tip>
            <Tip accent={C.green}>
              <strong>Revolut card:</strong> Similar to Wise. Free currency exchange up to a monthly limit, then a small fee. Also offers travel insurance and crypto. Popular in Europe.
            </Tip>
          </Card>

          <Card title="Cash Strategy" accent={C.green}>
            <Tip accent={C.green}>
              <strong>Carry two cards from different networks.</strong> Bring one Visa and one Mastercard. In some countries and shops, one network works and the other does not. Having both guarantees you are covered. Keep them in separate locations (one in wallet, one in hotel safe).
            </Tip>
            <Tip accent={C.green}>
              <strong>Get $50-100 in local currency before you leave.</strong> Your home bank or airport currency exchange can do this. Yes, the rate is bad, but you need cash for the taxi from the airport, your first meal, and the first night. You can find a better ATM once you are settled.
            </Tip>
            <Tip accent={C.green}>
              <strong>ATM strategy abroad:</strong> Use bank ATMs (attached to actual bank branches), not standalone ATMs in tourist areas. Tourist-area ATMs charge higher fees and sometimes skim cards. When the ATM asks &quot;convert to your home currency?&quot; always say NO — this is called Dynamic Currency Conversion and gives you a terrible rate. Always choose to be charged in the local currency.
            </Tip>
            <Tip accent={C.green}>
              <strong>Cash-heavy countries:</strong> Japan, Germany, and India still use a lot of cash. Do not assume cards work everywhere. In Japan, many small restaurants, temples, and vending machines are cash-only. In India, street food and rickshaws are cash-only.
            </Tip>
          </Card>

          {country && (
            <Card title={`Money in ${country.name}`} accent={C.green}>
              <Tip accent={C.green}>
                <strong>Currency:</strong> {country.currency.name} ({country.currency.code}) — symbol: {country.currency.symbol}
              </Tip>
              {country.emergencyNumbers?.length > 0 && (
                <Tip accent={C.green}>
                  <strong>Emergency numbers:</strong>{' '}
                  {country.emergencyNumbers.map((e) => `${e.service}: ${e.number}`).join(' | ')}
                </Tip>
              )}
            </Card>
          )}
        </section>

        {/* ═══════════════════════════════════════════════════════════════
           6. HEALTH PREPARATION
           ═══════════════════════════════════════════════════════════════ */}
        <section id="health" style={{ marginBottom: 80 }}>
          <SectionHeading
            number="6"
            title="Health Preparation"
            subtitle="See a travel clinic, get your shots, pack your meds, and buy travel insurance. Do all four. No exceptions."
            color={C.purple}
          />

          <Card title="Visit a Travel Clinic (4-6 Weeks Before)" accent={C.purple}>
            <Tip accent={C.purple}>
              <strong>Make an appointment at a travel clinic 4-6 weeks before your trip.</strong> Some vaccinations take multiple doses over several weeks. Walk-in clinics like Passport Health, CVS MinuteClinic, or your primary care doctor can all do this. Tell them every country you are visiting.
            </Tip>
            <Tip accent={C.purple}>
              <strong>Common travel vaccinations:</strong>
            </Tip>
            <div style={{ paddingLeft: 24, marginBottom: 12 }}>
              <Tip accent={C.purple}><strong>Hepatitis A</strong> — recommended for almost every destination. Spread through contaminated food/water. Two doses, 6 months apart. One dose provides protection for your trip.</Tip>
              <Tip accent={C.purple}><strong>Typhoid</strong> — recommended for Asia, Africa, Central/South America. Spread through contaminated food/water. One shot or 4 oral pills.</Tip>
              <Tip accent={C.purple}><strong>Yellow Fever</strong> — REQUIRED for entry into some countries in Africa and South America. You will be asked for your yellow card at immigration. Without it, you will be denied entry. Countries include: Brazil, Kenya, Tanzania, Ethiopia, Colombia, and others.</Tip>
              <Tip accent={C.purple}><strong>Japanese Encephalitis</strong> — for extended travel in rural Asia. Two doses, 28 days apart.</Tip>
              <Tip accent={C.purple}><strong>Rabies</strong> — for adventure travelers in Asia and Africa. Three doses over 3-4 weeks. Expensive but worth it if you will be around animals.</Tip>
            </div>
            <Tip accent={C.purple}>
              <strong>Malaria prevention:</strong> Anti-malaria pills are needed for sub-Saharan Africa, parts of India, and parts of Southeast Asia. Start taking them before your trip (1-2 days to 2 weeks before, depending on the medication). Options: Malarone (fewest side effects, most expensive), Doxycycline (cheap, can cause sun sensitivity), Mefloquine (weekly dose, can cause vivid dreams).
            </Tip>
          </Card>

          <Card title="Pack a Travel Medical Kit" accent={C.purple}>
            <p style={{ color: C.muted, fontSize: 15, marginTop: 0, marginBottom: 16, lineHeight: 1.7 }}>
              You will not always be near a pharmacy that speaks your language. Pack these basics.
            </p>
            <Tip accent={C.purple}><strong>Imodium (loperamide)</strong> — for traveler&apos;s diarrhea. This will happen. Be ready.</Tip>
            <Tip accent={C.purple}><strong>Paracetamol / Ibuprofen</strong> — for pain, fever, headaches. Bring both.</Tip>
            <Tip accent={C.purple}><strong>Antihistamine (Benadryl / Cetirizine)</strong> — for allergic reactions, bug bites, unexpected food allergies.</Tip>
            <Tip accent={C.purple}><strong>Oral rehydration salts (ORS)</strong> — if you get food poisoning or severe diarrhea, this prevents dehydration. Dissolve in water and sip. Available as powder packets (Drip Drop, Pedialyte packets).</Tip>
            <Tip accent={C.purple}><strong>Band-aids and antiseptic wipes</strong> — for blisters (you WILL walk more than usual), cuts, and scrapes.</Tip>
            <Tip accent={C.purple}><strong>Hand sanitizer</strong> — 60%+ alcohol. Use before every meal in countries with questionable hygiene.</Tip>
            <Tip accent={C.purple}><strong>Insect repellent with DEET</strong> — for mosquito-borne illness regions. 30% DEET is effective without being overwhelming.</Tip>
            <Tip accent={C.purple}><strong>Sunscreen SPF 50</strong> — you underestimate tropical and high-altitude sun. Apply every 2 hours.</Tip>
          </Card>

          <Card title="Travel Insurance — Get It" accent={C.rose}>
            <Tip accent={C.rose}>
              <strong>ALWAYS get travel insurance.</strong> This is not a suggestion. A medical evacuation by air ambulance can cost $100,000 to $300,000. A hospital stay in the US without insurance can bankrupt you. Even in countries with cheap healthcare, getting home while injured is expensive.
            </Tip>
            <Tip accent={C.rose}>
              <strong>World Nomads</strong> — best for adventurous travelers. Covers hiking, scuba diving, skiing, and other activities that basic policies exclude. Buy and extend online from anywhere.
            </Tip>
            <Tip accent={C.rose}>
              <strong>SafetyWing</strong> — best for digital nomads and long-term travelers. Monthly subscription model ($42/month). Covers you in 180+ countries. Includes travel delays and lost luggage.
            </Tip>
            <Tip accent={C.rose}>
              <strong>What to check in your policy:</strong> medical coverage limit (aim for $100,000+), medical evacuation coverage, trip cancellation, lost baggage, adventure activity exclusions. Read the fine print on pre-existing conditions.
            </Tip>
          </Card>

          <Card title="Prescription Medications" accent={C.purple}>
            <Tip accent={C.purple}>
              <strong>Carry medications in their original packaging</strong> with the prescription label visible. Some countries (especially in Asia and the Middle East) are strict about unlabeled pills. Without the original packaging, customs may confiscate your medication or question you.
            </Tip>
            <Tip accent={C.purple}>
              <strong>Get a doctor&apos;s letter</strong> listing your medications, dosages, and the reason for each prescription. This is required in some countries for controlled substances (ADHD medication, strong painkillers, anxiety medication).
            </Tip>
            <Tip accent={C.purple}>
              <strong>Pack medications in your carry-on</strong> — never in checked luggage. If your checked bag is lost, you need your medication immediately.
            </Tip>
            <Tip accent={C.purple}>
              <strong>Bring extra.</strong> Pack 50% more than you need. If your trip gets extended, flights get cancelled, or you drop a pill down the drain, you are covered.
            </Tip>
          </Card>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
           7. AIRPORT & FLIGHT PREPARATION
           ═══════════════════════════════════════════════════════════════ */}
        <section id="airport" style={{ marginBottom: 80 }}>
          <SectionHeading
            number="7"
            title="Airport & Flight Preparation"
            subtitle="The trip starts at the airport. These tips will make the airport experience smoother, the flight more comfortable, and customs less stressful."
            color={C.dark}
          />

          <Card title="Before You Get to the Airport" accent={C.dark}>
            <Tip>
              <strong>Online check-in: do it 24 hours before your flight.</strong> Set a phone alarm for exactly 24 hours before departure. Airlines release the best remaining seats at online check-in. This is when you grab a window or aisle seat. If you wait until the airport, you get the middle seat.
            </Tip>
            <Tip>
              <strong>Seat selection tools:</strong> Use SeatGuru.com or ExpertFlyer to check your specific aircraft and seat map. They tell you which seats have extra legroom, which are near the bathroom (noisy), and which do not recline (last row). Worth 5 minutes of research.
            </Tip>
            <Tip>
              <strong>Print or screenshot your boarding pass.</strong> Phone batteries die. Airport WiFi fails. Have a PDF saved offline or a printed copy as backup. Also screenshot your hotel confirmation and any tour reservations.
            </Tip>
            <Tip>
              <strong>Weigh your luggage before you leave home.</strong> Use a bathroom scale — step on holding your bag, then step on without it, subtract. Most airlines allow 50 lbs (23 kg) for checked bags. Overweight fees are $50-200. Not worth it.
            </Tip>
          </Card>

          <Card title="Carry-On Packing Strategy" accent={C.dark}>
            <Tip>
              <strong>Liquids rule:</strong> All liquids must be in containers of 100ml (3.4oz) or less, in a single clear quart-sized zip-lock bag. This includes toothpaste, sunscreen, hand sanitizer, and lip balm. Buy full-sized toiletries at your destination — do not try to squeeze 200ml into a 100ml bottle.
            </Tip>
            <Tip>
              <strong>Electronics accessible:</strong> Laptops and large electronics must come out of your bag at security in most countries. Pack them in an easy-to-access spot. Consider a bag with a dedicated laptop compartment that opens flat.
            </Tip>
            <Tip>
              <strong>Wear your heaviest items.</strong> Boots, jacket, and hoodie go on your body, not in your bag. This saves weight and space in your luggage. You can always take them off once you are past the gate.
            </Tip>
            <Tip>
              <strong>Pack a change of clothes in your carry-on.</strong> If your checked bag gets lost (it happens), you need underwear, a shirt, and basic toiletries to survive until the airline delivers your bag. Keep essentials in the carry-on.
            </Tip>
          </Card>

          <Card title="Long-Haul Flight Comfort" accent={C.dark}>
            <Tip>
              <strong>Compression socks.</strong> Sitting for 10+ hours increases the risk of deep vein thrombosis (blood clots in your legs). Compression socks improve circulation. They also prevent swollen ankles. Wear them. Get up and walk every 2-3 hours.
            </Tip>
            <Tip>
              <strong>Neck pillow.</strong> A memory foam neck pillow lets you actually sleep in economy. The inflatable ones pack smaller. Trtl pillow is popular for side sleepers.
            </Tip>
            <Tip>
              <strong>Eye mask + ear plugs.</strong> Cabin lights go on and off. Babies cry. Your seatmate watches a movie with the brightness at max. An eye mask and ear plugs (or noise-cancelling earbuds) are non-negotiable for sleeping on planes.
            </Tip>
            <Tip>
              <strong>Lip balm + nasal spray + moisturizer.</strong> Aircraft cabins have humidity levels around 10-20% (desert-level dry). Your lips will crack, your nose will dry out, and your skin will feel like sandpaper. Pack these in your personal item for easy access.
            </Tip>
            <Tip>
              <strong>Hydrate aggressively.</strong> Drink water before, during, and after the flight. Ask the flight attendant for water every time they pass. Avoid excessive alcohol — it dehydrates you faster at altitude. One drink in the air hits like two on the ground.
            </Tip>
          </Card>

          <Card title="Layover & Airport Tips" accent={C.dark}>
            <Tip>
              <strong>Download LoungeBuddy or Priority Pass app.</strong> Airport lounges have free food, drinks, WiFi, showers, and comfortable seating. Priority Pass gives access to 1,300+ lounges worldwide. Some credit cards (Chase Sapphire Reserve, Amex Platinum) include Priority Pass. Even without a membership, some lounges sell day passes for $30-50 — worth it for a long layover.
            </Tip>
            <Tip>
              <strong>Download airport maps in advance.</strong> Large hub airports (Dubai, Istanbul, Singapore, Heathrow) are small cities. Know which terminal you arrive at, which terminal you depart from, and how long the transfer takes. Some airports require a train between terminals (DFW, Heathrow, CDG).
            </Tip>
            <Tip>
              <strong>Minimum connection time:</strong> For international layovers, aim for at least 2-3 hours. You may need to go through immigration, re-check bags, go through security again, and walk to a different terminal. 1-hour connections on international flights are a gamble.
            </Tip>
          </Card>

          <Card title="Customs & Immigration" accent={C.dark}>
            <Tip>
              <strong>Know what you cannot bring.</strong> Fresh fruits, vegetables, meat, and seeds are restricted or banned in most countries (US, Australia, New Zealand, Japan are especially strict). Declare everything to be safe — undeclared food items can result in fines of $300-10,000.
            </Tip>
            <Tip>
              <strong>Fill out arrival cards on the plane.</strong> Many countries still use paper arrival/departure cards. The flight attendants hand them out before landing. Fill them out on the plane — you need your passport number, hotel address, and flight number. Have this information accessible, not buried in your checked bag.
            </Tip>
            <Tip>
              <strong>Have your documents ready for immigration:</strong> passport, boarding pass, return/onward ticket, hotel reservation, visa (if required). Some immigration officers ask for proof of onward travel and proof of sufficient funds. Have these ready on your phone.
            </Tip>
            <Tip>
              <strong>Duty-free limits:</strong> Most countries allow 1 liter of alcohol, 200 cigarettes, and gifts/goods under a certain value (usually $800 for US residents returning home). Exceeding limits means paying import tax. Know the limits before you shop.
            </Tip>
          </Card>
        </section>

        {/* ─── FINAL CHECKLIST ─── */}
        <section style={{ marginBottom: 40 }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${C.dark} 0%, #1E293B 100%)`,
              borderRadius: 16,
              padding: '40px 32px',
              textAlign: 'center',
            }}
          >
            <h2 style={{ fontFamily: 'serif', fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>
              Your Pre-Flight Checklist
            </h2>
            <p style={{ color: '#94A3B8', fontSize: 15, margin: '0 0 28px', lineHeight: 1.7 }}>
              Do every single one of these before you leave for the airport.
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 16,
                textAlign: 'left',
              }}
            >
              {[
                { label: 'Phone unlocked or eSIM installed', section: 'phone' },
                { label: 'Offline Google Maps downloaded', section: 'downloads' },
                { label: 'Offline Google Translate downloaded', section: 'downloads' },
                { label: 'WhatsApp installed and verified', section: 'phone' },
                { label: 'Bank notified of travel dates', section: 'money' },
                { label: 'Two cards from different networks packed', section: 'money' },
                { label: 'Local currency obtained ($50-100 worth)', section: 'money' },
                { label: 'Travel insurance purchased', section: 'health' },
                { label: 'Vaccinations up to date', section: 'health' },
                { label: 'Medications packed in carry-on (original packaging)', section: 'health' },
                { label: 'Online check-in done (24 hrs before)', section: 'airport' },
                { label: 'Boarding pass saved offline', section: 'airport' },
                { label: 'Copies of passport emailed to yourself', section: 'kids' },
                { label: 'Emergency food packed (if dietary restrictions)', section: 'food' },
                { label: 'Entertainment downloaded for flight', section: 'downloads' },
                { label: 'Ride-hailing app for destination downloaded', section: 'downloads' },
              ].map((item, i) => (
                <a
                  key={i}
                  href={`#${item.section}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.08)',
                    textDecoration: 'none',
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: 22,
                      height: 22,
                      borderRadius: 4,
                      border: '2px solid rgba(255,255,255,0.3)',
                    }}
                  />
                  <span style={{ color: '#E2E8F0', fontSize: 14, lineHeight: 1.5 }}>{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FOOTER NOTE ─── */}
        <p style={{ textAlign: 'center', color: C.muted, fontSize: 13, lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
          This guide is maintained by the WorldTourly team and updated regularly. Safe travels.
        </p>
      </main>
    </div>
  )
}
