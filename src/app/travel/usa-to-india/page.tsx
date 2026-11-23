import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'USA to India Travel Essentials | Zaxise Travel',
  description:
    'Complete guide for Indian Americans traveling from the USA to India. Covers visa/OCI, forex, SIM cards, travel insurance, packing tips, flight booking strategies, and what to bring back.',
}

/* ─── colour tokens (burgundy theme) ─── */
const C = {
  accent: '#801C45',
  accentLight: '#a83e68',
  accentBg: '#fdf2f6',
  accentBorder: '#f3d4e0',
  dark: '#2b1b26',
  muted: '#6b5560',
  bg: '#faf8f7',
  card: '#ffffff',
  border: '#ece0e4',
}

interface Section {
  icon: string
  title: string
  content: string[]
  highlight?: string
}

const SECTIONS: Section[] = [
  {
    icon: '🛂',
    title: 'Visa & OCI Card',
    content: [
      'OCI (Overseas Citizen of India) cardholders get lifelong multiple-entry visa with no stay limits for most visit types. If you do not have one yet, apply through the Indian consulate nearest to you — processing takes 4-8 weeks.',
      'If you hold an Indian passport, check the expiry date. India requires at least 6 months validity remaining at time of travel. Renew early if needed — tatkal (urgent) renewal is available for an extra fee.',
      'First-time visitors without OCI need an e-Visa. Apply at indianvisaonline.gov.in at least 4 days before travel. The 30-day e-Tourist Visa costs $25 and is processed in 72 hours. Longer durations (1 year, 5 years) are also available.',
      'Always carry a printout of your OCI card or e-Visa along with your US passport. Immigration officers may ask for physical copies even if you have digital versions.',
      'If your old passport (with the OCI sticker) is different from your current passport, carry BOTH passports. The OCI card is linked to the old passport number.',
    ],
    highlight: 'Start the OCI or e-Visa process at least 6 weeks before your trip.',
  },
  {
    icon: '💱',
    title: 'Forex & Currency Tips',
    content: [
      'The Indian Rupee (INR) fluctuates around 83-85 per USD. Never exchange at Indian airports — rates are 3-5% worse than market. Use ATMs from major banks (SBI, HDFC, ICICI) for the best rates.',
      'Carry $200-300 in cash as a backup. Many small shops, auto-rickshaws, and street vendors are cash-only. UPI (Google Pay India, PhonePe, Paytm) is now accepted almost everywhere — even vegetable carts.',
      'Set up a UPI-linked account before you go if possible. Some banks like ICICI NRI and SBI allow NRIs to link UPI to their NRE/NRO accounts. This lets you pay like a local with zero transaction fees.',
      'Your US credit card will work at malls, hotels, and large restaurants, but expect a 1-3% foreign transaction fee. Use a no-FTF card (Chase Sapphire, Capital One Venture) if you have one.',
      'Charles Schwab debit card reimburses ALL ATM fees worldwide — including the fees Indian ATMs charge (typically 200-350 INR per withdrawal). Withdraw in larger amounts to minimize per-transaction fees.',
      'Avoid Dynamic Currency Conversion (DCC). When an Indian ATM or card terminal asks "charge in USD or INR?" always choose INR. Choosing USD lets the merchant set the exchange rate, which is always worse.',
    ],
    highlight: 'UPI is king in India. Setting up Google Pay India or PhonePe before your trip saves enormous hassle.',
  },
  {
    icon: '📱',
    title: 'SIM Card & eSIM Options',
    content: [
      'Jio SIM is the best value: 299 INR ($3.50) for 28 days of unlimited calls + 2GB/day data. Buy at any Reliance Digital or Jio store. You need your passport + visa/OCI copy. Activation takes 4-24 hours.',
      'Airtel is the second-best option with similar pricing and broader 4G coverage in rural areas. Available at any Airtel store.',
      'eSIM users: Airalo offers India eSIM plans starting at $5 for 1GB. Install before you leave the US. The eSIM activates the moment you land — no store visit needed. Best for short trips.',
      'Holafly offers unlimited data India eSIMs starting around $19 for 5 days. No throttling. Great if you plan to video-call family frequently or use maps heavily.',
      'Your US carrier may work: T-Mobile Magenta includes free (slow) international data in India. Google Fi works at $10/GB. AT&T International Day Pass is $10/day. For trips longer than a week, a local SIM is far cheaper.',
      'WhatsApp is the primary communication app in India. Everyone — from your Uber driver to hotel reception to your relatives — uses it. Make sure it is installed and your number is verified before you land.',
    ],
    highlight: 'Buy a Jio SIM at the airport Reliance store immediately after landing. The 4-24 hour activation delay means every minute counts.',
  },
  {
    icon: '🛡️',
    title: 'Travel Insurance',
    content: [
      'Even though India has affordable healthcare, medical evacuation back to the US can cost $100,000-$300,000. Travel insurance is not optional.',
      'World Nomads and SafetyWing both cover India well. World Nomads covers adventure activities (trekking in Ladakh, rafting in Rishikesh). SafetyWing is cheaper for longer trips at $42/month.',
      'If you are visiting elderly parents, consider a plan that covers trip interruption — if a family emergency extends your stay, insurance covers the cost of rebooking flights.',
      'Check if your US health insurance or credit card includes international travel coverage. Chase Sapphire Reserve and Amex Platinum both include some travel medical coverage, but the limits are often low ($50,000).',
      'Keep all medical receipts if you need treatment in India. Indian hospitals often require upfront payment — your insurance reimburses you after you return. Carry your insurance card and emergency contact number.',
    ],
    highlight: 'Medical evacuation insurance alone justifies the cost. A $50 policy can save you from a $200,000 bill.',
  },
  {
    icon: '🧳',
    title: 'Packing Essentials',
    content: [
      'Adapter: India uses Type C, D, and M plugs (round pins). Bring a universal adapter. Most modern Indian hotels have universal sockets, but older homes and budget hotels do not.',
      'Toiletries: Pack your preferred brands of sunscreen (Indian sunscreen quality varies), insect repellent (DEET-based for mosquito regions), and any prescription medications in original packaging.',
      'Clothing: Loose, cotton clothing works best in Indian heat. If visiting temples, carry a scarf or shawl to cover shoulders and knees. Comfortable walking shoes are essential — Indian footpaths are uneven.',
      'Stomach prep: Pack Imodium (loperamide), ORS packets (Drip Drop or Pedialyte), and antacids. Even seasoned travelers get "Delhi belly." Your stomach is no longer adapted to Indian water and spice levels.',
      'Water: Never drink tap water. Carry a reusable bottle and refill with sealed Bisleri or Kinley. Check the seal is unbroken before drinking.',
      'Gifts from the US: Chocolates (Ghirardelli, See\'s Candies), almonds/cashews, perfumes, branded clothing, and electronics are popular gifts for family. Bath & Body Works products are a crowd-pleaser.',
      'Empty suitcase space: Leave room (or bring a foldable duffel) for the return trip. You WILL buy more than you planned — spices, sweets, clothes, and gifts add up fast.',
    ],
    highlight: 'Pack light going to India and leave half your suitcase empty for the return journey.',
  },
  {
    icon: '✈️',
    title: 'Flight Booking Tips',
    content: [
      'Book 3-4 months in advance for the best fares. Peak seasons (December-January for weddings, October for Diwali, and summer for school holidays) see prices double or triple.',
      'Best airlines for USA-India: Air India (direct nonstop DEL/BOM from several US cities), United (nonstop to DEL from EWR/SFO), Emirates via Dubai, and Qatar Airways via Doha. The Gulf carriers (Emirates, Qatar, Etihad) often have the best prices and service.',
      'Google Flights is the best tool for finding cheap fares. Set up price alerts for your route. Also check Skiplagged and Momondo for hidden-city fares.',
      'Nonstop vs. one-stop: Nonstop flights (15-17 hours) cost $200-500 more but save 6-10 hours of travel time. One-stop via Dubai/Doha adds a 3-4 hour layover. For families with kids or elderly parents, nonstop is worth the premium.',
      'Seat selection: Book an aisle seat for long-haul flights so you can walk around. Window seats are better for sleeping. Middle seats are for people who booked too late. Use SeatGuru.com to check your specific aircraft.',
      'Luggage: Most US-India flights allow 2 checked bags of 23 kg each. Air India allows 2 bags. Emirates allows 30 kg per bag on some fare classes. Verify before you pack.',
      'Flight timing: Red-eye departures from the US (leaving at 9 PM-midnight) arrive in India the next evening, minimizing jet lag. Morning departures arrive at odd hours.',
    ],
    highlight: 'Set Google Flights price alerts 4 months out. Fares can drop $200-400 on random Tuesdays.',
  },
  {
    icon: '🎁',
    title: 'What to Bring Back from India',
    content: [
      'Spices: Whole spices from Indian markets are fresher and cheaper than anything in the US. Stock up on turmeric, cumin, coriander, red chili powder, garam masala, hing (asafoetida), and saffron from Kashmir.',
      'Tea: Darjeeling first flush, Assam CTC for chai, and specialty teas from tea estates. Far cheaper and fresher than imports. Nilgiri tea is an underrated gem.',
      'Textiles: Silk sarees (Kanchipuram, Banarasi), cotton kurtas, Pashmina shawls from Kashmir, and block-printed fabrics from Jaipur. India produces some of the world\'s finest textiles at a fraction of Western prices.',
      'Ayurvedic products: Himalaya, Patanjali, and Forest Essentials make excellent skincare, hair oil (coconut, amla), and wellness products. Chyawanprash (immunity booster) is a popular take-back.',
      'Sweets & snacks: Kaju katli (cashew fudge), soan papdi, namkeens (savory snacks like bhujia), and pickle (achar) travel well in checked luggage. Haldiram\'s and Bikaner brands are reliable.',
      'Jewelry: Gold jewelry is significantly cheaper in India than the US (lower making charges). Silver jewelry from Jaipur is beautiful and affordable. India is also known for lab-grown and natural gemstones.',
      'Handicrafts: Wooden carvings from Kerala, marble inlay from Agra, blue pottery from Jaipur, and brass items from Moradabad make unique home decor and gifts.',
      'US Customs note: You can bring up to $800 worth of goods duty-free per person. Food items (spices, tea, packaged sweets) are allowed. Fresh fruits, vegetables, and meat products are PROHIBITED — do not try to bring mangoes or fresh mithai.',
    ],
    highlight: 'Spices, tea, and textiles are the holy trinity of India shopping. Buy more than you think you need — you will wish you had.',
  },
  {
    icon: '🏥',
    title: 'Health & Safety Prep',
    content: [
      'Vaccinations: Visit a travel clinic 4-6 weeks before departure. Hepatitis A and Typhoid are strongly recommended for India. If visiting rural areas, consider Japanese Encephalitis and Rabies vaccines.',
      'Stomach adjustment: Start taking probiotics a week before travel. Avoid street food for the first 2 days to let your stomach adjust. Stick to freshly cooked hot food — heat kills bacteria.',
      'Water safety: Only drink sealed bottled water (check the cap seal). Use bottled water even for brushing teeth. Avoid ice in drinks at smaller restaurants. Tender coconut water (from fresh coconuts) is safe and hydrating.',
      'Mosquito protection: Dengue and malaria are risks in some regions. Use DEET-based repellent, especially at dawn and dusk. Wear long sleeves in the evening. Some hotels provide mosquito coils or liquid vaporizers — ask for one.',
      'Air quality: Delhi and North Indian cities have poor air quality, especially November-February. Pack N95 masks if visiting during winter. Consider an air purifier if staying for more than a week.',
      'Emergency numbers: Police: 100 | Ambulance: 108 | Fire: 101 | Women\'s helpline: 1091. Save these in your phone.',
    ],
    highlight: 'Start probiotics before travel and ease into local food gradually. Your gut bacteria need time to adjust.',
  },
  {
    icon: '🚗',
    title: 'Getting Around in India',
    content: [
      'Uber and Ola work in all major Indian cities. Always use app-based rides for transparent pricing. Ola is often cheaper for autos (three-wheelers). Pre-book airport rides to avoid the taxi scrum.',
      'Indian Railways: Book trains on IRCTC (irctc.co.in) or the RailYatri app. Tatkal booking (1 day before) is available for last-minute travel. AC 2-Tier and AC 3-Tier are comfortable for overnight journeys.',
      'Domestic flights: IndiGo and Air India Express are reliable budget airlines. Book on their apps or MakeMyTrip. Domestic flights are surprisingly affordable — Delhi to Goa can be under $50.',
      'Do NOT drive yourself unless you are very experienced with Indian roads. Traffic rules are "suggestions" and lane discipline does not exist. Hire a driver or use ride-hailing apps.',
      'Metro systems in Delhi, Bangalore, Hyderabad, Chennai, Kolkata, and Mumbai are clean, affordable, and efficient. Delhi Metro is world-class and covers the entire NCR region.',
      'For intercity travel, RedBus and AbhiBus offer AC bus bookings. Volvo AC buses between cities like Bangalore-Chennai or Delhi-Jaipur are comfortable and cost $10-20.',
    ],
    highlight: 'Download Ola, Uber, and IRCTC before landing. These three apps handle 90% of your transport needs.',
  },
]

export default function UsaToIndiaPage() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.dark }}>
      {/* ─── HERO ─── */}
      <header
        style={{
          background: `linear-gradient(135deg, ${C.accent} 0%, #5a1230 60%, #2b1b26 100%)`,
          padding: '72px 24px 60px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            color: '#f5c3d5',
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 2.5,
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          Zaxise Travel
        </p>
        <h1
          style={{
            fontFamily: 'serif',
            fontSize: 'clamp(30px, 5vw, 52px)',
            fontWeight: 800,
            color: '#ffffff',
            margin: '0 auto 16px',
            maxWidth: 800,
            lineHeight: 1.15,
          }}
        >
          USA to India Travel Essentials
        </h1>
        <p
          style={{
            color: '#e8b8ca',
            fontSize: 'clamp(15px, 2.5vw, 20px)',
            maxWidth: 640,
            margin: '0 auto 24px',
            lineHeight: 1.5,
          }}
        >
          Everything Indian Americans need to know before flying home
        </p>
        <p style={{ color: '#c08da0', fontSize: 14, maxWidth: 580, margin: '0 auto', lineHeight: 1.7 }}>
          From OCI cards to SIM setups, forex hacks to what to pack — this is the definitive guide for your next India trip.
        </p>
      </header>

      {/* ─── QUICK NAV ─── */}
      <nav
        style={{
          maxWidth: 900,
          margin: '-28px auto 0',
          padding: '0 20px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: C.card,
            borderRadius: 16,
            padding: '20px 24px',
            boxShadow: '0 8px 32px rgba(128,28,69,0.10)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            justifyContent: 'center',
          }}
        >
          {SECTIONS.map((s, i) => (
            <a
              key={i}
              href={`#section-${i}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 999,
                background: C.accentBg,
                border: `1px solid ${C.accentBorder}`,
                color: C.accent,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all .15s',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: 15 }}>{s.icon}</span>
              {s.title}
            </a>
          ))}
        </div>
      </nav>

      {/* ─── CONTENT ─── */}
      <main style={{ maxWidth: 900, margin: '48px auto 0', padding: '0 20px 80px' }}>
        {SECTIONS.map((section, i) => (
          <section
            key={i}
            id={`section-${i}`}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              padding: '32px 28px',
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(128,28,69,0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: C.accentBg,
                  fontSize: 26,
                  flexShrink: 0,
                }}
              >
                {section.icon}
              </span>
              <h2
                style={{
                  fontFamily: 'serif',
                  fontSize: 'clamp(22px, 3vw, 28px)',
                  fontWeight: 700,
                  color: C.dark,
                  margin: 0,
                }}
              >
                {section.title}
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {section.content.map((text, j) => (
                <div
                  key={j}
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: '14px 16px',
                    background: j % 2 === 0 ? C.accentBg : '#faf8f7',
                    borderLeft: `3px solid ${j % 2 === 0 ? C.accent : C.accentBorder}`,
                    borderRadius: 8,
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: C.dark,
                  }}
                >
                  <span style={{ flexShrink: 0, marginTop: 2, color: C.accent, fontWeight: 700 }}>
                    {j + 1}.
                  </span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {section.highlight && (
              <div
                style={{
                  marginTop: 18,
                  padding: '14px 18px',
                  background: `linear-gradient(135deg, ${C.accent}10, ${C.accent}08)`,
                  border: `1px solid ${C.accentBorder}`,
                  borderRadius: 10,
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                }}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.accent, lineHeight: 1.6 }}>
                  {section.highlight}
                </p>
              </div>
            )}
          </section>
        ))}

        {/* ─── QUICK REFERENCE TABLE ─── */}
        <section
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            padding: '32px 28px',
            marginBottom: 24,
            boxShadow: '0 2px 8px rgba(128,28,69,0.04)',
          }}
        >
          <h2
            style={{
              fontFamily: 'serif',
              fontSize: 24,
              fontWeight: 700,
              color: C.dark,
              margin: '0 0 20px',
              textAlign: 'center',
            }}
          >
            Quick Reference
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 14,
            }}
          >
            {[
              { label: 'Emergency Police', value: '100', icon: '🚔' },
              { label: 'Ambulance', value: '108', icon: '🚑' },
              { label: 'Currency', value: 'INR (1 USD ~ 83-85 INR)', icon: '💰' },
              { label: 'Time Zone', value: 'IST (UTC+5:30)', icon: '🕐' },
              { label: 'Electric Plug', value: 'Type C, D, M (round pins)', icon: '🔌' },
              { label: 'Driving Side', value: 'Left side of road', icon: '🚗' },
              { label: 'Tipping', value: 'Optional, 10% at restaurants', icon: '💵' },
              { label: 'Domestic Airline', value: 'IndiGo, Air India Express', icon: '🛫' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 16px',
                  background: C.accentBg,
                  borderRadius: 10,
                  border: `1px solid ${C.accentBorder}`,
                }}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.dark, marginTop: 2 }}>
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── BACK LINK ─── */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link
            href="/travel"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 28px',
              background: C.accent,
              color: '#fff',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(128,28,69,0.20)',
              transition: 'background .2s',
            }}
          >
            ← Back to Travel Hub
          </Link>
          <p style={{ color: C.muted, fontSize: 12, marginTop: 16, lineHeight: 1.6 }}>
            This guide is maintained by the Zaxise team and updated regularly. Safe travels.
          </p>
        </div>
      </main>
    </div>
  )
}
