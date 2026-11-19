'use client'

import { useState } from 'react'
import { COUNTRIES } from '@/data/travel/destinations'

/* ── expanded etiquette data ── */
interface EtiquetteSection {
  dressCode: { dos: string[]; donts: string[] }
  behaviorNorms: { dos: string[]; donts: string[] }
  religiousSites: { dos: string[]; donts: string[] }
  photographyRules: { dos: string[]; donts: string[] }
  bargainingCulture: { dos: string[]; donts: string[] }
  diningCustoms: { dos: string[]; donts: string[] }
  tipping: { dos: string[]; donts: string[] }
}

const ETIQUETTE_DATA: Record<string, EtiquetteSection> = {
  japan: {
    dressCode: {
      dos: [
        'Dress neatly and modestly — the Japanese value a well-kept appearance',
        'Wear clean socks without holes (you will remove shoes often)',
        'Business settings require formal attire; even casual settings lean smart',
      ],
      donts: [
        'Avoid overly revealing clothing in temples and traditional areas',
        'Do not wear shoes indoors — always check for slipper areas',
        'Skip heavy perfume or cologne; subtle scents are preferred',
      ],
    },
    behaviorNorms: {
      dos: [
        'Bow when greeting — a slight bow for casual, deeper for formal',
        'Queue patiently and wait your turn in all situations',
        'Use both hands when exchanging business cards or gifts',
        'Keep your voice low on public transport',
      ],
      donts: [
        'Do not eat or drink while walking in public',
        'Avoid talking loudly on phones in trains or buses',
        'Do not blow your nose in public — step away to a restroom',
        'Never point at people with your finger; use an open hand gesture',
      ],
    },
    religiousSites: {
      dos: [
        'Purify your hands and mouth at the temizu (water basin) before entering shrines',
        'Bow before entering the main hall of a temple',
        'Toss a coin, bow twice, clap twice, then bow once at Shinto shrines',
      ],
      donts: [
        'Do not step on the raised threshold at temple gates',
        'Avoid pointing at statues or sacred objects',
        'Do not take photos where signs prohibit it',
      ],
    },
    photographyRules: {
      dos: [
        'Ask permission before photographing people, especially geisha',
        'Photography is generally welcome at outdoor shrines and temples',
        'Respect "no photography" signs in museums and sacred inner halls',
      ],
      donts: [
        'Never photograph people without consent in private settings',
        'Avoid using flash in temples and museums',
        'Do not take photos of children without parental permission',
      ],
    },
    bargainingCulture: {
      dos: [
        'Prices are fixed at most shops — pay the listed price',
        'Flea markets (like Oedo Antique Market) may allow gentle negotiation',
      ],
      donts: [
        'Do not bargain at restaurants, department stores, or convenience stores',
        'Aggressive haggling is considered very rude',
      ],
    },
    diningCustoms: {
      dos: [
        'Say "Itadakimasu" before eating and "Gochisousama" after',
        'Slurp noodles — it shows appreciation and cools them down',
        'Pour drinks for others; let them pour for you',
      ],
      donts: [
        'Never stick chopsticks upright in rice (funeral ritual)',
        'Do not pass food from chopstick to chopstick',
        'Avoid leaving food on your plate — it suggests the portion was too large',
      ],
    },
    tipping: {
      dos: [
        'Simply say "thank you" for good service',
        'At ryokans (traditional inns), a small gift is appreciated instead of a tip',
      ],
      donts: [
        'Do not tip at restaurants, taxis, or hotels — it can cause confusion or offense',
        'If you must show gratitude monetarily, place money in an envelope',
      ],
    },
  },
  italy: {
    dressCode: {
      dos: [
        'Dress stylishly — Italians appreciate good fashion sense',
        'Cover shoulders and knees when visiting churches',
        'Carry a scarf or shawl for impromptu church visits',
      ],
      donts: [
        'Avoid flip-flops and beachwear in cities (fines possible in some areas)',
        'Do not wear athletic wear outside of gyms or hiking',
        'Skip baseball caps and overly casual tourist attire in upscale restaurants',
      ],
    },
    behaviorNorms: {
      dos: [
        'Greet with "Buongiorno" (morning) or "Buonasera" (evening)',
        'Close friends greet with kisses on both cheeks (left first)',
        'Embrace the passeggiata — the evening stroll is a social tradition',
        'Be patient with the relaxed pace of life, especially in the south',
      ],
      donts: [
        'Do not be overly loud in residential areas, especially during riposo (afternoon rest)',
        'Avoid being impatient with slower service — meals are meant to be savored',
        'Do not sit on historic monuments or steps (fines in Rome and Florence)',
        'Do not litter — fines are steep at historic sites',
      ],
    },
    religiousSites: {
      dos: [
        'Cover shoulders and knees in all churches and cathedrals',
        'Maintain a quiet, respectful demeanor',
        'It is acceptable to enter churches for quiet reflection even as a tourist',
      ],
      donts: [
        'Do not eat, drink, or use your phone loudly inside churches',
        'Avoid visiting during mass unless you are attending the service',
        'Do not touch religious artworks or relics',
      ],
    },
    photographyRules: {
      dos: [
        'Most outdoor monuments are fine to photograph',
        'Ask permission in private galleries and museums',
        'Street photography is generally accepted',
      ],
      donts: [
        'Flash photography is banned in most museums and churches',
        'Do not use tripods in museums without permission',
        'Selfie sticks are banned at many major sites (Colosseum, Uffizi)',
      ],
    },
    bargainingCulture: {
      dos: [
        'Bargain at outdoor markets and flea markets (Porta Portese, etc.)',
        'Ask for a "sconto" (discount) when buying multiple items from market vendors',
      ],
      donts: [
        'Do not haggle in shops, restaurants, or supermarkets',
        'Avoid aggressive negotiation — keep it friendly and lighthearted',
      ],
    },
    diningCustoms: {
      dos: [
        'Order courses in sequence: antipasto, primo, secondo, dolce',
        'Bread is for mopping up sauce on your plate (la scarpetta)',
        'Enjoy espresso standing at the bar for the local price',
        'Dinner typically starts at 8 PM or later',
      ],
      donts: [
        'Do not order cappuccino after 11 AM (espresso or macchiato instead)',
        'Never ask for parmesan on seafood pasta',
        'Do not request modifications to dishes — trust the chef',
        'Avoid ordering just a main course — at least get a primo or secondo',
      ],
    },
    tipping: {
      dos: [
        'Round up the bill or leave 1-2 euros for good service',
        'Tip 10% at high-end restaurants if service charge is not included',
        'The "coperto" (cover charge) on the bill is standard, not a tip',
      ],
      donts: [
        'Do not feel obligated to tip large amounts — it is not culturally expected',
        'Check if "servizio incluso" is on the bill before tipping extra',
      ],
    },
  },
  thailand: {
    dressCode: {
      dos: [
        'Dress modestly at temples: cover shoulders, knees, and wear closed shoes',
        'Light, breathable fabrics are practical for the tropical climate',
        'Smart casual for nicer restaurants and rooftop bars',
      ],
      donts: [
        'Do not wear shorts or tank tops in temples (sarong wraps often available)',
        'Avoid wearing black to temples (associated with funerals)',
        'Do not go shirtless outside of beach areas',
      ],
    },
    behaviorNorms: {
      dos: [
        'Show deep respect for the Royal Family — it is law',
        'Greet with the "wai" (palms together with a slight bow)',
        'Remove shoes before entering homes and many businesses',
        'Smile often — Thailand is the "Land of Smiles"',
      ],
      donts: [
        'Never disrespect images of the King (lese-majeste laws are strict)',
        'Do not touch anyone on the head — it is the most sacred body part',
        'Avoid pointing your feet at people, Buddha images, or temples',
        'Do not step on the threshold when entering a temple',
        'Do not lose your temper in public — keeping calm is highly valued',
      ],
    },
    religiousSites: {
      dos: [
        'Remove shoes before entering any temple building',
        'Sit with your feet tucked behind you (not pointing at Buddha)',
        'Women should never touch a monk or hand anything directly to one',
      ],
      donts: [
        'Do not climb on Buddha statues or pose disrespectfully with them',
        'Avoid wearing revealing clothing at any temple',
        'Do not point at Buddha images',
      ],
    },
    photographyRules: {
      dos: [
        'Ask before photographing monks or locals',
        'Most temples allow photography in outdoor areas',
        'Street markets and food stalls are generally fine to photograph',
      ],
      donts: [
        'Do not photograph the interior of ordination halls without permission',
        'Avoid taking selfies with sacred statues in disrespectful poses',
        'Never photograph military installations or restricted areas',
      ],
    },
    bargainingCulture: {
      dos: [
        'Bargain at street markets, night markets, and with tuk-tuk drivers',
        'Start at about 50-60% of the asking price and work toward a fair middle',
        'Keep negotiations friendly and smile throughout',
      ],
      donts: [
        'Do not bargain at 7-Eleven, malls, or restaurants with listed prices',
        'Never get aggressive or angry when bargaining',
        'Do not walk away if you have already agreed on a price',
      ],
    },
    diningCustoms: {
      dos: [
        'Use a fork to push food onto a spoon — eat from the spoon',
        'Share multiple dishes family-style at the center of the table',
        'Try street food — it is fresh, cheap, and often the best food in Thailand',
      ],
      donts: [
        'Do not eat with just a fork (use the spoon as the primary utensil)',
        'Avoid leaving chopsticks upright in a bowl of noodles',
        'Do not take the last piece from a shared plate without offering it first',
      ],
    },
    tipping: {
      dos: [
        'Tip 20-50 THB at sit-down restaurants if no service charge',
        'Round up taxi fares to the nearest convenient amount',
        'Tip hotel porters 20-50 THB per bag',
        'Spa therapists appreciate 50-100 THB tips',
      ],
      donts: [
        'Do not tip at street food stalls — it is not expected',
        'Check for a 10% service charge already added to the bill',
      ],
    },
  },
  france: {
    dressCode: {
      dos: [
        'Dress well — the French appreciate understated elegance',
        'Neutral colors, tailored fits, and quality fabrics are valued',
        'Smart casual is the minimum for restaurants and theaters',
      ],
      donts: [
        'Avoid overly casual looks like shorts and flip-flops in cities',
        'Skip branded sportswear and large logos outside of gyms',
        'Do not wear white sneakers with formal outfits (a tourist giveaway)',
      ],
    },
    behaviorNorms: {
      dos: [
        'Always greet with "Bonjour" when entering any shop, cafe, or elevator',
        'Say "Au revoir" when leaving any establishment',
        'Use "vous" (formal you) with strangers; "tu" only with friends',
        'Close friends greet with "la bise" (cheek kisses) — the number varies by region',
      ],
      donts: [
        'Do not skip the greeting — it is considered extremely rude',
        'Avoid being overly loud or boisterous in public spaces',
        'Do not rush meals — dining is a social event, not refueling',
        'Do not assume everyone speaks English — always try French first',
      ],
    },
    religiousSites: {
      dos: [
        'Cover shoulders when visiting cathedrals like Notre-Dame and Sacre-Coeur',
        'Maintain silence during services',
        'Appreciate the architectural and artistic heritage respectfully',
      ],
      donts: [
        'Do not use flash photography in cathedrals',
        'Avoid walking in front of worshippers during active services',
        'Do not treat active churches as purely tourist attractions',
      ],
    },
    photographyRules: {
      dos: [
        'Street photography is legally and culturally accepted in France',
        'Most outdoor monuments are free to photograph',
        'The Eiffel Tower by day is fine to photograph (night lights are copyrighted but personal photos are OK)',
      ],
      donts: [
        'No flash in museums — many also prohibit tripods and selfie sticks',
        'Do not photograph people in private situations without consent',
        'Avoid photographing military or security installations',
      ],
    },
    bargainingCulture: {
      dos: [
        'Bargain at flea markets (marches aux puces) like Saint-Ouen in Paris',
        'Ask for a "petit prix" when buying multiple items at a brocante',
      ],
      donts: [
        'Do not bargain in shops, restaurants, bakeries, or supermarkets',
        'Avoid aggressive negotiation — polite inquiries only',
      ],
    },
    diningCustoms: {
      dos: [
        'Keep both hands on the table while eating (not elbows)',
        'Bread goes directly on the table beside your plate, not on it',
        'Say "Bon appetit" before starting a meal',
        'Finish everything on your plate to show appreciation',
        'Order wine with your meal — it is an integral part of French dining',
      ],
      donts: [
        'Do not ask for a doggy bag at upscale restaurants (acceptable at casual ones)',
        'Never add ketchup or extra seasoning without tasting first',
        'Do not split the bill item-by-item — split evenly or one person pays',
        'Avoid ordering coffee with your meal — it comes after dessert',
      ],
    },
    tipping: {
      dos: [
        'Service charge (service compris) is included in all French bills by law',
        'Leave 1-2 euros on the table for good service as a gesture',
        'Round up taxi fares to the nearest euro',
      ],
      donts: [
        'Do not feel obligated to tip 15-20% as in the US — it is not expected',
        'Do not hand the tip to the waiter — leave it on the table or in the bill tray',
      ],
    },
  },
  india: {
    dressCode: {
      dos: [
        'Dress modestly, especially in religious places and rural areas',
        'Cover shoulders and knees at temples, mosques, and gurudwaras',
        'Carry a scarf or shawl for head covering at Sikh temples and some mosques',
        'Loose, breathable cotton clothing is ideal for the heat',
      ],
      donts: [
        'Avoid tight or revealing clothing outside of upscale urban settings',
        'Do not wear leather items when visiting Hindu temples',
        'Shoes must be removed at all religious sites',
      ],
    },
    behaviorNorms: {
      dos: [
        'Greet with "Namaste" and a slight bow with palms together',
        'Use your right hand for eating, giving, and receiving',
        'Respect personal space in conversations (physical space in crowds is different)',
        'Accept chai (tea) when offered — it is a sign of hospitality',
      ],
      donts: [
        'Do not use your left hand for eating or handing items (considered unclean)',
        'Avoid public displays of affection — even holding hands can draw stares',
        'Do not touch someone with your feet or point your feet at people',
        'Do not gesture with a single finger — use your whole hand to point',
      ],
    },
    religiousSites: {
      dos: [
        'Remove shoes before entering temples, mosques, and gurudwaras',
        'Cover your head in Sikh gurudwaras and many mosques',
        'Walk clockwise around sacred sites in Hindu and Buddhist traditions',
        'Be prepared for crowd management during festival times',
      ],
      donts: [
        'Do not touch religious idols or sacred objects unless invited',
        'Women should not enter certain temple areas during menstruation at some traditional temples',
        'Do not bring leather items into Hindu temples',
        'Avoid pointing your feet toward shrines or deities',
      ],
    },
    photographyRules: {
      dos: [
        'Ask permission before photographing people, especially in rural areas',
        'Photography is usually fine at outdoor monuments (some charge a camera fee)',
        'Sunrise and sunset shots at the Taj Mahal are iconic',
      ],
      donts: [
        'Do not photograph military installations, airports, or bridges',
        'Many museums prohibit photography — check before shooting',
        'Avoid photographing sadhu (holy men) without asking — some expect a small donation',
      ],
    },
    bargainingCulture: {
      dos: [
        'Bargain at street markets, bazaars, and with auto-rickshaw drivers',
        'Start at about 40-50% of the asking price and negotiate up',
        'Compare prices at a few stalls before committing',
        'Keep it friendly and smile — bargaining is a social activity',
      ],
      donts: [
        'Do not bargain at government emporiums, malls, or fixed-price shops',
        'Avoid getting emotional or aggressive during negotiations',
        'Do not bargain at food stalls with listed prices',
      ],
    },
    diningCustoms: {
      dos: [
        'Wash hands before and after eating — many meals are eaten by hand',
        'Use your right hand to eat when having food without cutlery',
        'Try a traditional thali for a complete dining experience',
        'Vegetarian food is widely available and incredibly diverse',
      ],
      donts: [
        'Do not eat beef in Hindu areas or pork in Muslim areas',
        'Avoid touching communal serving dishes with your eating hand',
        'Do not waste food — take only what you can finish',
        'Do not rush meals in traditional settings — hospitality is generous',
      ],
    },
    tipping: {
      dos: [
        'Tip 10% at restaurants if no service charge is included',
        'Tip hotel porters 50-100 INR per bag',
        'Round up taxi and auto-rickshaw fares',
        'Tip guides 200-500 INR for half/full day tours',
      ],
      donts: [
        'Check for "service charge" on the bill before tipping extra',
        'Do not tip at street food stalls or dhabas (roadside eateries)',
      ],
    },
  },
}

const SECTION_LABELS: { key: keyof EtiquetteSection; label: string; icon: string }[] = [
  { key: 'dressCode', label: 'Dress Code', icon: 'M5.121 17.804A2 2 0 017 16h10a2 2 0 011.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
  { key: 'behaviorNorms', label: 'Behavior Norms', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { key: 'religiousSites', label: 'Religious Sites', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { key: 'photographyRules', label: 'Photography Rules', icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z' },
  { key: 'bargainingCulture', label: 'Bargaining Culture', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  { key: 'diningCustoms', label: 'Dining Customs', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z' },
  { key: 'tipping', label: 'Tipping', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
]

const GLOBAL_TIPS = [
  'Learn a few basic phrases in the local language — even "hello" and "thank you" make a difference',
  'Research local customs before you arrive so you can be a respectful visitor',
  'When in doubt, observe what locals do and follow their lead',
  'Dress conservatively when visiting religious or sacred sites anywhere in the world',
  'Ask permission before photographing people, their homes, or their businesses',
  'Be patient with cultural differences — different does not mean wrong',
  'Carry small denominations of local currency for tips and small purchases',
  'Respect queuing customs, noise levels, and personal space norms',
]

function DoItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
      <span className="text-sm text-dark/80 leading-relaxed">{text}</span>
    </li>
  )
}

function DontItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500">
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>
      <span className="text-sm text-dark/80 leading-relaxed">{text}</span>
    </li>
  )
}

export default function EtiquetteGuidePage() {
  const [selectedCountry, setSelectedCountry] = useState('japan')

  const country = COUNTRIES.find((c) => c.id === selectedCountry)
  const etiquette = ETIQUETTE_DATA[selectedCountry]

  if (!country || !etiquette) return null

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* ── Header ── */}
      <div className="mb-12 text-center">
        <h1 className="font-heading text-4xl font-bold text-dark sm:text-5xl">
          Cultural Etiquette Guide
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-dark/70">
          Travel respectfully by understanding local customs, dress codes, dining etiquette, and social norms.
        </p>
      </div>

      {/* ── Country Selector ── */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {COUNTRIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCountry(c.id)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
              selectedCountry === c.id
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-card-bg text-dark/70 border border-border hover:border-primary/40 hover:text-primary'
            }`}
          >
            {c.flag} {c.name}
          </button>
        ))}
      </div>

      {/* ── Etiquette from COUNTRIES data ── */}
      {country.etiquette.length > 0 && (
        <div className="mb-8 rounded-2xl border border-border bg-card-bg p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-dark mb-4">
            {country.flag} Quick Etiquette Tips for {country.name}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {country.etiquette.map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5 rounded-lg bg-page-bg p-3 border border-border/50">
                <span className="mt-0.5 text-primary font-bold text-sm">{i + 1}.</span>
                <span className="text-sm text-dark/80 leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Expanded Etiquette Sections ── */}
      <div className="space-y-6">
        {SECTION_LABELS.map(({ key, label, icon }) => {
          const section = etiquette[key]
          return (
            <div key={key} className="rounded-2xl border border-border bg-card-bg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                </span>
                <h2 className="font-heading text-xl font-bold text-dark">{label}</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-600">Do&apos;s</h3>
                  <ul className="space-y-2.5">
                    {section.dos.map((item, i) => (
                      <DoItem key={i} text={item} />
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-500">Don&apos;ts</h3>
                  <ul className="space-y-2.5">
                    {section.donts.map((item, i) => (
                      <DontItem key={i} text={item} />
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Global Etiquette Tips ── */}
      <div className="mt-12 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-secondary/5 p-8 shadow-sm">
        <h2 className="font-heading text-2xl font-bold text-dark mb-6 text-center">
          Universal Travel Etiquette
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {GLOBAL_TIPS.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-card-bg/80 p-4 border border-border/50">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary text-xs font-bold">
                {i + 1}
              </span>
              <span className="text-sm text-dark/80 leading-relaxed">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
