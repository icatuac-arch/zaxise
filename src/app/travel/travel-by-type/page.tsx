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

/* ───────── personas ───────── */
const PERSONAS = [
  { id: 'solo', label: 'Solo Traveler', icon: '🎒' },
  { id: 'couple', label: 'Couple', icon: '💑' },
  { id: 'family', label: 'Family with Kids', icon: '👨‍👩‍👧‍👦' },
  { id: 'elderly', label: 'Elderly / Accessibility', icon: '♿' },
  { id: 'budget', label: 'Budget Backpacker', icon: '💰' },
  { id: 'luxury', label: 'Luxury', icon: '✨' },
] as const

type PersonaId = (typeof PERSONAS)[number]['id']

const COUNTRIES = [
  { id: 'japan', name: 'Japan', flag: '🇯🇵' },
  { id: 'italy', name: 'Italy', flag: '🇮🇹' },
  { id: 'thailand', name: 'Thailand', flag: '🇹🇭' },
  { id: 'france', name: 'France', flag: '🇫🇷' },
  { id: 'india', name: 'India', flag: '🇮🇳' },
] as const

type CountryId = (typeof COUNTRIES)[number]['id']

/* ───────── advice data ───────── */
interface Tip { title: string; detail: string }

const DATA: Record<PersonaId, Record<CountryId, Tip[]>> = {
  /* ───── SOLO ───── */
  solo: {
    japan: [
      { title: 'Safety', detail: 'Extremely safe for solo travel — Japan consistently ranks among the safest countries in the world. You can walk anywhere at any hour.' },
      { title: 'Solo Dining', detail: 'Eat at ramen counters — they\'re literally designed for solo diners. Slide into a booth, order from a vending machine, and slurp in peace.' },
      { title: 'Capsule Hotels', detail: 'Capsule hotels are fun, clean, and cheap (¥3,000-5,000/night). Try one for at least a night — it\'s a uniquely Japanese experience.' },
      { title: 'Japan Rail Pass', detail: 'The JR Rail Pass (¥50,000 for 7 days) is your best friend. Unlimited bullet trains, local JR trains, and even some ferries. Pays for itself in 2 shinkansen rides.' },
      { title: 'Konbini Meals', detail: 'Convenience stores (7-Eleven, Lawson, FamilyMart) sell genuinely great meals for ¥300-500. Onigiri, bento boxes, egg sandwiches — all delicious.' },
    ],
    italy: [
      { title: 'Pickpocket Alert', detail: 'Watch your belongings in Rome (Termini station, Colosseum area) and Florence (tourist plazas). Use a crossbody bag, keep it zipped in front of you.' },
      { title: 'Trattoria vs Ristorante', detail: 'Eat at a "trattoria" not a "ristorante" — same quality food, 30-40% cheaper, more authentic atmosphere.' },
      { title: 'Solo Dining Culture', detail: 'Solo dining is completely normal in Italy. Grab a seat at the bar, order a pasta and a glass of wine, and enjoy la dolce vita.' },
      { title: 'Social Hostels', detail: 'Hostels in Trastevere (Rome) and Oltrarno (Florence) are social hubs — great for meeting fellow travelers over aperitivo.' },
      { title: 'City Hopping', detail: 'Italy\'s train network makes solo city-hopping easy. Rome to Florence in 1.5 hours, Florence to Venice in 2 hours on high-speed Trenitalia.' },
    ],
    thailand: [
      { title: 'Backpacker Paradise', detail: 'Thailand is the world\'s most backpacker-friendly country. Infrastructure, pricing, and culture all cater to solo travelers.' },
      { title: 'Khao San Road', detail: 'Khao San Road in Bangkok is solo traveler central. Loud, chaotic, and the easiest place on Earth to make friends over a ฿100 bucket drink.' },
      { title: 'Food Budget', detail: 'A $10-15/day food budget is realistic. Street pad thai for ฿40, curry rice for ฿50, fresh fruit shakes for ฿30.' },
      { title: 'Overnight Trains', detail: 'Overnight trains from Bangkok to Chiang Mai or the south save on a night\'s hotel. Book a second-class sleeper — clean and comfortable.' },
      { title: 'Full Moon Party Warning', detail: 'Be careful with drinks at the Full Moon Party — spiked drinks are reported every month. Buy sealed bottles and watch your cup.' },
    ],
    france: [
      { title: 'Cafe Culture', detail: 'French cafes are a solo traveler\'s dream. Grab a window seat, order an espresso (€1.50), and watch the world go by for hours. Nobody will rush you.' },
      { title: 'Museum Passes', detail: 'The Paris Museum Pass saves money AND lets you skip lines. Solo travelers can be spontaneous — duck into the Musee d\'Orsay on a rainy afternoon.' },
      { title: 'Metro Efficiency', detail: 'The Paris Metro is cheap (€2.15/ride) and goes everywhere. Buy a carnet of 10 tickets for savings, or a Navigo weekly pass for €30.' },
      { title: 'Safety Note', detail: 'Avoid the Pigalle area (near Moulin Rouge) late at night. Stick to the Marais, Saint-Germain, or Latin Quarter for evening wandering.' },
      { title: 'Cheap Amazing Lunches', detail: 'Boulangeries sell incredible sandwiches (jambon-beurre) for €3-4 and "formule" lunch combos for €5-7. Better than most restaurants.' },
    ],
    india: [
      { title: 'Women Solo Travelers', detail: 'Women should dress modestly (cover shoulders and knees) outside tourist/beach areas. This is practical advice, not a judgment — it significantly reduces unwanted attention.' },
      { title: 'After-Dark Travel', detail: 'Avoid traveling alone after dark in smaller cities. In major cities like Delhi, Mumbai, and Bangalore, stick to well-lit main roads and use ride apps.' },
      { title: 'Use Ride Apps', detail: 'Always use Ola or Uber instead of random taxis or auto-rickshaws. Tracked rides, fixed prices, no haggling, and a safety record on file.' },
      { title: 'Eat Where Locals Eat', detail: 'If a street stall or small restaurant is packed with locals, it\'s safe to eat there. High turnover = fresh food. Empty restaurant = avoid.' },
      { title: 'Budget Reality', detail: 'India is one of the cheapest countries on Earth for solo travelers. $15-25/day covers accommodation, food, local transport, and entry fees.' },
    ],
  },

  /* ───── COUPLE ───── */
  couple: {
    japan: [
      { title: 'Ryokan Stay', detail: 'Stay in a traditional ryokan (Japanese inn) with tatami floors, futon beds, and kaiseki dinner. Budget ¥15,000-30,000 per person. Hakone and Kinosaki Onsen have the best ones.' },
      { title: 'Onsen Experience', detail: 'Hot spring baths (onsen) are incredibly romantic. Book a ryokan with a private onsen (kashikiri) so you can bathe together — public baths are gender-separated.' },
      { title: 'Kyoto Romance', detail: 'Kyoto is Japan\'s most romantic city. Walk through the bamboo grove at dawn (arrive before 7 AM), visit Fushimi Inari at sunset, and stroll Gion at night.' },
      { title: 'Private Tea Ceremony', detail: 'Book a private tea ceremony for two (¥5,000-10,000 per person). It\'s meditative, beautiful, and something you\'ll always remember doing together.' },
      { title: 'Cherry Blossom Season', detail: 'If visiting late March to mid-April, do a hanami picnic under cherry blossoms. Buy bento boxes and sake from a department store basement and find a spot in Ueno or Maruyama Park.' },
    ],
    italy: [
      { title: 'Venice Gondola', detail: 'Yes, it\'s touristy. Yes, it costs €80-100 for 30 minutes. Do it anyway — especially at sunset through the quieter back canals. You\'ll never regret it.' },
      { title: 'Florence Sunset', detail: 'Watch the sunset from Piazzale Michelangelo in Florence. Bring a bottle of Chianti (€8 from any enoteca) and two plastic cups. Thank us later.' },
      { title: 'Amalfi Coast Drive', detail: 'Rent a convertible and drive the Amalfi Coast together. Positano, Ravello, Amalfi — the most beautiful coastal road in Europe. Go in May or September to avoid crowds.' },
      { title: 'Tuscany Wine Tasting', detail: 'Spend a day in Chianti wine country. Many vineyards offer tastings with cheese and prosciutto for €25-40 per person. Book a driver so you can both drink.' },
      { title: 'Cooking Class', detail: 'Take a couples cooking class in Rome or Florence. Learn to make fresh pasta together, then eat your creation with wine. About €80-120 per person.' },
    ],
    thailand: [
      { title: 'Phi Phi Islands', detail: 'The Phi Phi Islands are postcard-perfect. Stay on Koh Phi Phi Don, take a longtail boat to Maya Bay (from "The Beach"), snorkel in crystal water.' },
      { title: 'Cooking Class Together', detail: 'Take a Thai cooking class in Chiang Mai. You\'ll shop at a local market, cook 4-5 dishes together, and eat everything you make. Around ฿1,000-1,500 each.' },
      { title: 'Couple\'s Massage', detail: 'Get a couple\'s Thai massage for ฿500-800 per person at a proper spa. For a splurge, book a beachside massage on Koh Samui for ฿1,500.' },
      { title: 'Bangkok Rooftop Bars', detail: 'Rooftop bars in Bangkok are world-class. Try Vertigo at Banyan Tree or Sky Bar at Lebua (from "The Hangover"). Cocktails ฿400-600, views priceless.' },
      { title: 'Island Hopping', detail: 'Hire a private longtail boat for half a day (฿2,000-3,000). Visit hidden coves, snorkel spots, and have lunch on a deserted beach. Way more romantic than group tours.' },
    ],
    france: [
      { title: 'Seine River Cruise at Night', detail: 'Take a Seine cruise after dark when every bridge and monument is lit up. Bateaux Mouches runs 1-hour cruises for €15. Bring your own wine (they won\'t mind).' },
      { title: 'Champagne Day Trip', detail: 'Take the train to Reims (45 min from Paris) and tour the Champagne caves. Moet & Chandon, Veuve Clicquot, and Taittinger all offer tastings. Book ahead.' },
      { title: 'Montmartre Sunset', detail: 'Walk up to Sacre-Coeur at sunset. The steps overlook all of Paris, street musicians play, and the atmosphere is pure romance. Bring wine and cheese from a nearby shop.' },
      { title: 'Versailles', detail: 'Spend a full day at Versailles together. The palace is impressive but the gardens are the real star — rent a rowboat on the Grand Canal (€12 for 30 min).' },
      { title: 'French Picnic', detail: 'Assemble the perfect French picnic: baguette, camembert, pate, grapes, and a bottle of Bordeaux. Total cost: under €15. Eat it on the Pont des Arts or in Luxembourg Gardens.' },
    ],
    india: [
      { title: 'Taj Mahal Sunrise', detail: 'Arrive at the Taj Mahal by 5:30 AM. Watch it transform from grey to soft pink to brilliant white as the sun rises. It\'s the most romantic building on Earth for a reason.' },
      { title: 'Udaipur — City of Romance', detail: 'Udaipur is India\'s most romantic city. Lake Pichola, white marble palaces, rooftop restaurants overlooking the water. Stay at a heritage haveli for ₹2,000-5,000/night.' },
      { title: 'Kerala Houseboat', detail: 'Rent a private houseboat on Kerala\'s backwaters. Cruise through palm-lined canals, eat fresh fish cooked onboard, and sleep under the stars. From ₹6,000/night for two.' },
      { title: 'Rajasthan Palace Hotels', detail: 'Sleep in a former maharaja\'s palace. Heritage hotels in Jaipur, Jodhpur, and Udaipur start from ₹3,000/night — a fraction of what you\'d pay for equivalent luxury elsewhere.' },
      { title: 'Goa Beach Sunsets', detail: 'Watch the sunset from a beach shack in South Goa (Palolem or Agonda). Quieter and more romantic than the party beaches in the north. Fresh seafood dinner for ₹500-800 for two.' },
    ],
  },

  /* ───── FAMILY WITH KIDS ───── */
  family: {
    japan: [
      { title: 'Age Suitability', detail: 'Japan is incredibly family-friendly for all ages. Clean public restrooms everywhere, vending machines on every corner, and the Japanese adore children.' },
      { title: 'Stroller Warning', detail: 'Tokyo\'s subway has limited elevator access — many stations are stairs-only. Consider a baby carrier for kids under 3. Kyoto buses are stroller-unfriendly during rush hour.' },
      { title: 'Kid-Friendly Food', detail: 'Most restaurants offer "kodomo" (children\'s) portions. Conveyor belt sushi (kaiten-zushi) is a hit with kids — they love picking plates off the belt. Budget ¥500-800 per child.' },
      { title: 'Rest Stop Planning', detail: 'Plan nap breaks at department stores — they have free rest areas, nursing rooms, and clean changing stations. Shinjuku Takashimaya and Isetan are excellent for this.' },
      { title: 'Must-Do with Kids', detail: 'TeamLab Borderless (digital art museum) mesmerizes kids of all ages. Tokyo Disneyland/DisneySea is arguably better than the US parks. Robot Restaurant is fun for ages 8+.' },
      { title: 'Emergency Info', detail: 'Dial 119 for ambulance. St. Luke\'s International Hospital (Tokyo) and Kobe Adventist Hospital have English-speaking staff. Japan\'s healthcare is world-class.' },
    ],
    italy: [
      { title: 'Age Suitability', detail: 'Italians are obsessed with children (bambini). Your kids will be fussed over, given free gelato by shop owners, and welcomed everywhere. Italy is one of the most kid-friendly cultures.' },
      { title: 'Stroller Warning', detail: 'Rome and Florence have terrible cobblestone streets — regular strollers will bounce like crazy. Bring an all-terrain stroller or a baby carrier. Venice has zero stroller accessibility (bridges everywhere).' },
      { title: 'Kid-Friendly Restaurants', detail: 'Pizza and gelato shops are everywhere and kids love them. For sit-down meals, go at 7 PM (before the Italian dinner rush at 8:30+). Most trattorias will make a simple "pasta in bianco" (butter and parmesan) for kids.' },
      { title: '"Kids Will Be Bored" Warning', detail: 'The Uffizi Gallery (Florence) and Vatican Museums (Rome) are incredible for adults but brutal for kids under 10. Keep visits under 1 hour or skip them. The Colosseum, however, excites kids of all ages.' },
      { title: 'Rest Stops', detail: 'Plan gelato breaks every 2-3 hours as a reward. Parks: Villa Borghese (Rome), Boboli Gardens (Florence), Giardini della Biennale (Venice) all have open space for kids to run.' },
      { title: 'Emergency Info', detail: 'Dial 118 for ambulance. Ospedale Bambino Gesu (Rome) is a world-renowned children\'s hospital. Pharmacies (look for green cross) can handle minor issues without a doctor visit.' },
    ],
    thailand: [
      { title: 'Age Suitability', detail: 'Thailand is great for families, but best for kids age 5+. Younger children may struggle with the heat (35°C+), spicy food, and long travel distances between attractions.' },
      { title: 'Stroller Warning', detail: 'Bangkok sidewalks are chaotic — uneven, crowded, with street food carts blocking paths. A baby carrier is essential. Beach destinations (Koh Samui, Krabi) are more stroller-friendly.' },
      { title: 'Kid-Friendly Food', detail: 'Thai food can be very spicy. Ask for "mai pet" (not spicy) when ordering. Pad thai, fried rice, and chicken satay are safe bets. 7-Eleven has familiar snacks as backup.' },
      { title: 'Nap Time Planning', detail: 'The heat peaks 12-3 PM. Plan indoor activities (malls with AC, aquariums) or pool time during these hours. SEA LIFE Bangkok and Safari World are great for kids.' },
      { title: 'Must-Do with Kids', detail: 'Elephant Nature Park in Chiang Mai (ethical sanctuary — no riding). Thai cooking class (kids love it). Snorkeling in Krabi (calm, shallow reefs). Night markets for the sensory overload.' },
      { title: 'Emergency Info', detail: 'Dial 1669 for ambulance. Bumrungrad International Hospital (Bangkok) is world-class with English-speaking staff. Get travel insurance — private hospitals expect upfront payment.' },
    ],
    france: [
      { title: 'Age Suitability', detail: 'France is wonderful for families. Parks everywhere, bakeries on every corner (kids love pain au chocolat), and French culture is more kid-tolerant than its reputation suggests.' },
      { title: 'Stroller Warning', detail: 'The Paris Metro is mostly NOT stroller-friendly — many stations have only stairs. Bus routes are better for families with strollers. The RER (suburban trains) has better elevator access.' },
      { title: 'Kid-Friendly Food', detail: 'Crepe stands are everywhere and kids love them (Nutella-banana is the universal kid favorite). Most restaurants offer a "menu enfant" (kids menu) for €8-12 with steak hache (hamburger) and frites.' },
      { title: '"Kids Will Be Bored" Warning', detail: 'The Louvre is enormous — kids under 8 will last 45 minutes max. See the Mona Lisa and Egyptian section and get out. Versailles gardens are great; the palace interior, not so much for kids.' },
      { title: 'Must-Do with Kids', detail: 'Disneyland Paris (40 min from city center). Luxembourg Gardens has a vintage carousel, pony rides, and puppet shows. Cite des Sciences (science museum) is incredible for ages 5-15.' },
      { title: 'Emergency Info', detail: 'Dial 15 for medical emergency (SAMU). Hopital Necker-Enfants Malades is Paris\'s top children\'s hospital. Pharmacies (green cross sign) are on every block and can advise on minor ailments.' },
    ],
    india: [
      { title: 'Age Suitability', detail: 'India is an incredible adventure for families, but best for kids age 8+. Younger children may find the sensory overload (noise, crowds, heat, unfamiliar food) overwhelming. Rajasthan and Kerala are the most family-friendly regions.' },
      { title: 'Stroller Warning', detail: 'Forget strollers in most of India — sidewalks are non-existent or unusable. A baby carrier or hiking backpack carrier is essential. The exceptions are upscale malls and some resort areas in Goa.' },
      { title: 'Kid-Friendly Food', detail: 'Stick to freshly cooked food (no salads or unpeeled fruit). Naan bread, butter chicken (mild), paneer dishes, and rice are usually safe bets. Carry oral rehydration salts in case of Delhi belly.' },
      { title: 'Rest Stop Planning', detail: 'The heat is brutal (40°C+ in summer). Travel October-March for comfortable temperatures. Plan indoor breaks at malls, museums, or hotel pools during peak heat hours (12-4 PM).' },
      { title: 'Must-Do with Kids', detail: 'Elephant safaris in Jaipur (ethical operators only). Camel rides in Rajasthan desert. Houseboat in Kerala. The Taj Mahal genuinely wows kids. Bollywood movie in a Mumbai cinema.' },
      { title: 'Emergency Info', detail: 'Dial 102 for ambulance. Apollo Hospitals and Fortis Hospitals have English-speaking staff and are in every major city. Get comprehensive travel insurance before visiting India with children.' },
    ],
  },

  /* ───── ELDERLY / ACCESSIBILITY ───── */
  elderly: {
    japan: [
      { title: 'Walking Distances', detail: 'Japanese temples and shrines often involve significant walking and stairs. Kinkaku-ji (Golden Pavilion) is flat and easy. Fushimi Inari (1,000 torii gates) is a steep mountain hike — the first 200 meters are enough for the photo.' },
      { title: 'Elevators & Escalators', detail: 'Tokyo Metro and JR stations have elevators (marked with wheelchair symbols on maps), but you may need to walk far to find them. Ask station staff — they will personally guide you.' },
      { title: 'Rest Benches', detail: 'Parks and temple grounds have ample seating. Shopping streets (shotengai) have benches. Department stores have free rest areas on upper floors with comfortable seating.' },
      { title: 'Medical Facilities', detail: 'Japan\'s healthcare is excellent. Pharmacies sell most medications over the counter. St. Luke\'s (Tokyo), Kobe Adventist Hospital, and Kameda Medical Center have English-speaking doctors.' },
      { title: 'Heat Warning', detail: 'Summer (June-September) is dangerously hot and humid (35°C+). Visit in spring (March-May) or autumn (October-November) for pleasant weather. Always carry water and a hand fan.' },
      { title: 'Mobility-Friendly Transport', detail: 'Bullet trains have wheelchair spaces and accessible restrooms. Taxis are abundant and affordable for short trips. Many ryokans have rooms with Western-style beds instead of futons on the floor.' },
    ],
    italy: [
      { title: 'Walking Distances', detail: 'Italian cities are walking cities — Rome requires 10-15 km of walking daily to see the sights. Consider choosing 2-3 sights per day instead of 5-6. Taxi between distant attractions.' },
      { title: 'Elevator Availability', detail: 'Many older buildings have no elevators (Italy has strict preservation laws). When booking hotels, specifically ask if there\'s a "ascensore" (elevator). Rome Metro has elevators at most stations.' },
      { title: 'Cobblestone Warning', detail: 'Italian streets are paved with cobblestones that are uneven and slippery when wet. Wear flat, rubber-soled shoes. Wheelchairs and walkers will struggle on most streets outside modern areas.' },
      { title: 'Medical Facilities', detail: 'Dial 118 for emergencies. Italian hospitals treat emergencies regardless of insurance. Pharmacies (green cross) can prescribe and sell many medications without a doctor visit.' },
      { title: 'Heat Warning', detail: 'Avoid July-August (35-40°C). Best months: April-May and September-October. If visiting in summer, plan outdoor sightseeing before 10 AM and after 5 PM.' },
      { title: 'Mobility Transport', detail: 'Roma Pass includes unlimited public transport. City tour buses (hop-on/hop-off) minimize walking. Water taxis in Venice are more accessible than walking over 400+ bridges.' },
    ],
    thailand: [
      { title: 'Walking Distances', detail: 'Bangkok temples (Grand Palace, Wat Pho) require significant walking on hard surfaces, often in extreme heat. Visit one temple per day maximum and plan rest between sites.' },
      { title: 'Accessibility Challenges', detail: 'Thailand has limited accessibility infrastructure. Sidewalks are uneven with unexpected drops. BTS Skytrain stations have elevators but not all MRT stations do. Malls and hotels are usually well-equipped.' },
      { title: 'Rest Areas', detail: 'Air-conditioned malls (CentralWorld, Siam Paragon, Terminal 21) are excellent rest stops. They have seating, clean restrooms, and affordable food courts.' },
      { title: 'Medical Facilities', detail: 'Thailand is a medical tourism hub. Bumrungrad International Hospital (Bangkok) is world-class. Medical costs are a fraction of Western prices. Most hospitals accept walk-ins.' },
      { title: 'Heat & Humidity Warning', detail: 'Thailand is hot year-round (30-37°C). Dehydration is a serious risk for elderly travelers. Visit November-February for the "cool" season (25-32°C). Carry water constantly.' },
      { title: 'Mobility Transport', detail: 'Private cars with drivers are affordable ($40-60/day) and eliminate all transport stress. Many resorts offer golf cart transport. Beach wheelchairs are available at some hotels in Phuket and Koh Samui.' },
    ],
    france: [
      { title: 'Walking Distances', detail: 'Paris is actually quite flat, making it easier to walk than Rome or Lisbon. But distances between sights are significant. Plan Arrondissement-by-Arrondissement to minimize walking.' },
      { title: 'Elevator Availability', detail: 'The Eiffel Tower has elevators to every level (but expect long queues). The Louvre has excellent accessibility. Notre-Dame and Sacre-Coeur involve stairs with no alternative. Many Metro stations are stairs-only.' },
      { title: 'Rest Benches', detail: 'Paris parks (Luxembourg, Tuileries, Champ de Mars) have abundant seating. Many also have comfortable metal chairs you can move to sunny or shady spots. Cafes welcome you to sit for hours with one drink.' },
      { title: 'Medical Facilities', detail: 'Dial 15 (SAMU) for emergencies. French hospitals are excellent. The American Hospital of Paris in Neuilly has fully English-speaking staff. Pharmacies can advise on and sell many medications.' },
      { title: 'Altitude Note', detail: 'Paris is flat. If visiting Chamonix/Alps or Provence hilltop villages, be aware of altitude and steep terrain. The Dordogne region is gentler and equally beautiful.' },
      { title: 'Mobility Transport', detail: 'Paris buses are fully wheelchair-accessible. Batobus (river shuttle) has ramp access and is a scenic way to travel. Taxi G7 has wheelchair-accessible vehicles available on request.' },
    ],
    india: [
      { title: 'Walking Distances', detail: 'The Taj Mahal requires ~1 km of walking on flat ground (manageable). Jaipur\'s Amber Fort is a steep climb — take the jeep ride up. Kerala backwaters are boat-based and require minimal walking.' },
      { title: 'Accessibility Reality Check', detail: 'India\'s accessibility infrastructure is limited. Sidewalks barely exist, curb cuts are rare, and many attractions have stairs with no alternatives. Travel with a companion and choose accessible destinations.' },
      { title: 'Rest Areas', detail: 'Modern malls (Select City Walk Delhi, Phoenix Mumbai) have good seating and AC. Heritage hotels in Rajasthan have courtyard seating. Most restaurants will let you rest as long as you like.' },
      { title: 'Medical Facilities', detail: 'Apollo and Fortis hospitals are in every major city with excellent English-speaking doctors. Medical costs are very low. Pharmacies sell most medications without a prescription.' },
      { title: 'Heat Warning — Critical', detail: 'India can reach 45°C+ in summer. ONLY visit October-March. Even in winter, midday sun can be intense. Carry ORS (oral rehydration salts), available at every pharmacy for ₹20.' },
      { title: 'Mobility Transport', detail: 'Hire a private car with driver ($25-40/day, significantly cheaper than Western countries). This is the most comfortable way to travel India at any age. AC is essential — specify when booking.' },
    ],
  },

  /* ───── BUDGET BACKPACKER ───── */
  budget: {
    japan: [
      { title: 'Free Attractions', detail: 'Meiji Shrine, Senso-ji Temple, Imperial Palace East Gardens, Tsukiji Outer Market, Harajuku Takeshita Street, Fushimi Inari — all completely free. You can fill days without spending on entry fees.' },
      { title: 'Cheapest Food', detail: 'Konbini (7-Eleven/Lawson) onigiri ¥120, bento ¥400. Gyudon (beef bowl) at Yoshinoya/Sukiya ¥400. Supermarket sushi at evening discount (20-50% off after 7 PM). Budget: ¥1,500-2,000/day for food.' },
      { title: 'Hostel vs Budget Hotel', detail: 'Hostels: ¥2,500-3,500/night for a dorm bed. Budget business hotels (Toyoko Inn, APA): ¥4,000-6,000 for a private room. Business hotels include free breakfast — often worth the upgrade.' },
      { title: 'Free Walking Tours', detail: 'Tokyo Free Walking Tour and Kyoto Free Walking Tour run daily. Tip-based, so pay what you can. Guides are passionate locals who show you hidden spots no guidebook mentions.' },
      { title: 'Student Discounts', detail: 'International Student ID (ISIC) gets 20-50% off many museums and attractions. Always ask even if not advertised. Some places accept any student ID with photo.' },
      { title: 'Biggest Money Traps', detail: 'Avoid: tourist-area restaurants near Senso-ji (3x markup), taxi rides (insanely expensive — use trains), Shinkansen without JR Pass, vending machine drinks at tourist spots (walk 50m for cheaper ones).' },
    ],
    italy: [
      { title: 'Free Attractions', detail: 'First Sunday of every month: Colosseum, Uffizi, Vatican Museums, Borghese Gallery — ALL FREE. Also free: Pantheon (always free), all churches (including St. Peter\'s Basilica), Trevi Fountain, Spanish Steps.' },
      { title: 'Cheapest Food', detail: 'Pizza al taglio (by weight) for €2-3 a slice. Supplì (fried rice balls) for €1.50. "Pranzo" lunch menus at trattorias: €8-12 for primo + secondo. Supermarket pasta + sauce for €3 (cook at hostel).' },
      { title: 'Hostel vs Budget Hotel', detail: 'Hostels: €20-35/night for a dorm bed. Budget B&Bs: €50-70 for a private room (often better value than hotels). Booking.com often has better rates than Hostelworld for Italy.' },
      { title: 'Free Walking Tours', detail: 'Every major Italian city has free walking tours. Rome, Florence, Venice, Naples — find them on GuruWalk or Civitatis. Tip €5-10 for a 2-3 hour tour.' },
      { title: 'Student Discounts', detail: 'EU citizens under 25 get FREE entry to all state museums. Non-EU students with ISIC get 50% off. Always carry ID with your birth date visible.' },
      { title: 'Biggest Money Traps', detail: 'Avoid: restaurants on Piazza Navona or St. Mark\'s Square (€18 pasta vs €8 one block away), "gladiators" at Colosseum (they charge for photos), water bottles near attractions (bring a refillable — nasoni fountains everywhere).' },
    ],
    thailand: [
      { title: 'Free Attractions', detail: 'Chatuchak Weekend Market (15,000+ stalls), Lumpini Park, Chinatown (Yaowarat) walking, temple exteriors, Sukhumvit nightlife walking, Chiang Mai Night Bazaar, all beaches — free.' },
      { title: 'Cheapest Food', detail: 'Street pad thai ฿40 ($1.10), som tum ฿30, mango sticky rice ฿40, khao pad (fried rice) ฿40. Food courts in malls: ฿40-60/meal. 7-Eleven: full meal for ฿50. Daily food budget: ฿200-400 ($6-11).' },
      { title: 'Hostel vs Budget Hotel', detail: 'Hostels: ฿200-400/night ($6-11). Guesthouses: ฿400-700 for a private room with AC ($11-20). In Chiang Mai, budget rooms drop to ฿150-300 for dorms. Booking ahead saves 20-30%.' },
      { title: 'Free Walking Tours', detail: 'Bangkok Free Walking Tours (chinatown and old city routes). Chiang Mai has several. All tip-based. Thai-Lish Tours runs excellent heritage walks.' },
      { title: 'Student Discounts', detail: 'Limited student discounts in Thailand, but many attractions are already cheap (฿100-200). National park entry is ฿40 for students vs ฿300 for adults — always carry student ID.' },
      { title: 'Biggest Money Traps', detail: 'Avoid: tuk-tuk "tours" (always end at gem shops), ping pong show touts on Khao San Road (bait-and-switch pricing), jet ski "damage" scams on Phuket, overpriced island tours (book directly at the pier, not through a hotel).' },
    ],
    france: [
      { title: 'Free Attractions', detail: 'First Sunday of the month (Oct-March): Louvre, Orsay, Pompidou, Versailles — all free. Always free: Notre-Dame (exterior/park), Sacre-Coeur, Pere Lachaise Cemetery, all parks and gardens, window-shopping in Le Marais.' },
      { title: 'Cheapest Food', detail: 'Boulangerie baguette €1.20, pain au chocolat €1.30, jambon-beurre sandwich €3.50. Supermarket (Monoprix): full dinner for €5. Market crepes: €3-4. "Formule" lunch deals: €5-7 for sandwich + drink + dessert.' },
      { title: 'Hostel vs Budget Hotel', detail: 'Hostels: €30-45/night for a dorm bed (Paris is expensive). Generator Paris and St Christopher\'s are the best social hostels. Budget hotels outside central Paris: €50-80 with private bathroom.' },
      { title: 'Free Walking Tours', detail: 'Discover Walks, Sandemans, and Free Tour Paris run daily free tours. Montmartre, Le Marais, Latin Quarter routes available. Tips of €5-10 are standard.' },
      { title: 'Student/Youth Discounts', detail: 'EU residents under 26 get FREE entry to ALL national museums (Louvre, Orsay, Versailles, etc.). Non-EU students with ISIC: significant discounts. This alone can save €50-100 per trip.' },
      { title: 'Biggest Money Traps', detail: 'Avoid: Champs-Elysees restaurants (tourist markups), "friendship bracelet" scammers at Sacre-Coeur, cafe prices on major boulevards (sit at the bar for 50% less than terrace), hotel breakfast (boulangerie next door is better and cheaper).' },
    ],
    india: [
      { title: 'Free Attractions', detail: 'Most temples and gurdwaras are free (including Golden Temple, Amritsar). Goa beaches, Mumbai Marine Drive, Delhi\'s Connaught Place, Varanasi Ghats (watching the aarti ceremony) — all free. India has more free experiences than paid ones.' },
      { title: 'Cheapest Food', detail: 'Thali meal: ₹50-100 ($0.60-1.20) for rice, dal, 3-4 curries, chapati, pickle — unlimited refills. Street samosa: ₹10. Chai tea: ₹10-20. Dosa: ₹30-50. Daily food budget: ₹300-500 ($3.50-6) eating very well.' },
      { title: 'Hostel vs Budget Hotel', detail: 'Hostels (Zostel, Backpacker Panda): ₹400-800/night ($5-10). Budget hotels: ₹500-1,000 ($6-12). Government "Bharat Hotels": ₹500-1,000 with guaranteed cleanliness. Homestays on Airbnb: ₹600-1,200 with local family experience.' },
      { title: 'Free Walking Tours', detail: 'Delhi Heritage Walks, Mumbai by Foot, Varanasi Walking Tours — all free/tip-based. Many hostels organize free or cheap guided walks of their neighborhoods.' },
      { title: 'Student Discounts', detail: 'Indian monument entry: ₹50-100 for foreigners (already cheap). Students with ISIC get 50% off at many sites. The Taj Mahal is ₹1,100 for foreigners regardless — no student discount, but still worth every rupee.' },
      { title: 'Biggest Money Traps', detail: 'Avoid: touts at train stations ("hotel is closed, I know a better one"), pre-paid taxi counters that overcharge (use Ola/Uber), "government tourism office" scams near Connaught Place Delhi, inflated foreigner prices at non-fixed shops (negotiate).' },
    ],
  },

  /* ───── LUXURY ───── */
  luxury: {
    japan: [
      { title: 'Best 5-Star Hotels', detail: 'Aman Tokyo (minimalist luxury, from ¥120,000/night). The Ritz-Carlton Kyoto (on the Kamogawa River). Park Hyatt Tokyo (Lost in Translation hotel). Hoshinoya Resorts (Japanese luxury ryokan concept — book months ahead).' },
      { title: 'Fine Dining', detail: 'Tokyo has more Michelin stars than any city on Earth. Sukiyabashi Jiro (yes, from the documentary — book 3 months ahead via hotel concierge). RyuGin for modern kaiseki. Den for creative Japanese. Budget ¥30,000-80,000 per person.' },
      { title: 'VIP Experiences', detail: 'Private after-hours temple visits in Kyoto (arranged through luxury hotels). Private tea ceremony with a tea master. Personal geisha entertainment in Gion (from ¥50,000 for 2 hours).' },
      { title: 'Private Tours', detail: 'Context Travel and TrueJapan offer private expert-led tours (historians, chefs, architects). ¥50,000-100,000 for a full day. Worth every yen for the depth of insight.' },
      { title: 'First-Class Transport', detail: 'Gran Class on the shinkansen: reclining leather seats, onboard meal service, and complimentary drinks. Japan Airlines First Class lounge at Narita has a sushi bar. Hire a private driver for Hakone/Mt. Fuji day trips (from ¥50,000).' },
    ],
    italy: [
      { title: 'Best 5-Star Hotels', detail: 'Belmond Hotel Cipriani (Venice — private island, boat shuttle from St. Mark\'s). Hotel Eden (Rome — rooftop restaurant overlooking the city). Four Seasons Florence (a Renaissance palazzo). Belmond Splendido (Portofino).' },
      { title: 'Michelin Dining', detail: 'Osteria Francescana in Modena (3 Michelin stars, frequently #1 in the world — book 3-6 months ahead). La Pergola in Rome. Piazza Duomo in Alba. Budget €200-400 per person for a full tasting menu with wine.' },
      { title: 'VIP Skip-the-Line', detail: 'Vatican VIP early-morning tour (enter before the public, see Sistine Chapel nearly empty). Private Uffizi after-hours visit. Guided Colosseum underground + arena floor tour (areas closed to regular visitors).' },
      { title: 'Private Tours', detail: 'Private Ferrari tour through Tuscany. Private speedboat tour of Venice canals. Truffle hunting in Piedmont with a local hunter and his dog. Cooking with a Michelin-starred chef in their home kitchen.' },
      { title: 'First-Class Transport', detail: 'Frecciarossa Executive Class: private lounge access, onboard meal, leather seats. Private water taxi in Venice (€100-150 per trip but worth the experience). Helicopter transfers between cities available through luxury hotels.' },
    ],
    thailand: [
      { title: 'Best 5-Star Hotels', detail: 'Mandarin Oriental Bangkok (legendary — Somerset Maugham wrote here). Four Seasons Koh Samui (private pool villas). Amanpuri Phuket (the original Aman resort). Soneva Kiri (private island, cinema on the beach). From ฿15,000-80,000/night.' },
      { title: 'Fine Dining', detail: 'Gaggan Anand (progressive Indian, regularly Asia\'s best restaurant). Le Normandie at Mandarin Oriental (French-Thai fusion). Nahm (authentic Thai at a Michelin level). Sorn (2 Michelin stars, Southern Thai cuisine). Budget ฿5,000-15,000 per person.' },
      { title: 'VIP Experiences', detail: 'Private long-tail boat to hidden Phi Phi coves. Sunrise alms-giving ceremony with a private guide in Chiang Mai. Private Muay Thai lesson with a champion fighter. Helicopter tours over the islands.' },
      { title: 'Private Tours', detail: 'Private speedboat island hopping (฿15,000-25,000/day). Personal chef for in-villa dining. Private elephant sanctuary visits (ethical, limited to 2-4 guests). Night safari with a wildlife biologist guide.' },
      { title: 'Airport & Transport', detail: 'Bangkok Suvarnabhumi has excellent lounges (Miracle First Class Lounge, Singapore Airlines SilverKris). Private airport transfer services with luxury vehicles. Bangkok-Koh Samui on Bangkok Airways (the "boutique airline").' },
    ],
    france: [
      { title: 'Best 5-Star Hotels', detail: 'The Ritz Paris (Place Vendome — Coco Chanel lived here for 37 years). Le Bristol (best palace hotel in Paris). Hotel du Cap-Eden-Roc (Cote d\'Azur, where the Gatsby set gathers). La Bastide de Gordes (Provence). From €800-3,000/night.' },
      { title: 'Michelin Dining', detail: 'Guy Savoy (3 stars, overlooking the Seine). L\'Ambroisie (3 stars, Place des Vosges). Le Cinq at Four Seasons (contemporary French). Mirazur in Menton (#1 in the world, 2019). Expect €300-500 per person with wine pairing.' },
      { title: 'VIP Skip-the-Line', detail: 'Private Louvre tour (before opening, your own art historian guide). Eiffel Tower summit with champagne (skip all lines). Versailles private apartments tour (rooms closed to the public). Monet\'s Giverny with a private art historian.' },
      { title: 'Private Tours', detail: 'Private Champagne house visits with the cellar master. Hot air balloon over Loire Valley chateaux. Vintage car tour through Provence lavender fields. Personal shopping with a Parisian stylist in Saint-Germain.' },
      { title: 'First-Class Transport', detail: 'TGV First Class: spacious seats, at-seat meal service, lounge access. Private Seine river yacht charter (from €2,000 for an evening). Eurostar Business Premier for London-Paris (champagne, 3-course meal). Helicopter Paris-Monaco transfers.' },
    ],
    india: [
      { title: 'Best 5-Star Hotels', detail: 'The Oberoi Udaipur (floating on Lake Pichola — one of the world\'s most beautiful hotels). Taj Lake Palace Udaipur (literally IN the lake). The Leela Palace New Delhi. Rambagh Palace Jaipur (former maharaja residence). From ₹20,000-80,000/night ($250-1,000).' },
      { title: 'Fine Dining', detail: 'Indian Accent (Delhi — consistently ranked among Asia\'s best). Bukhara at ITC Maurya (where Obama and Clinton dined). Wasabi by Morimoto (Mumbai Taj). Karavalli at The Gateway (Bangalore — South Indian fine dining). Budget ₹5,000-15,000 per person.' },
      { title: 'VIP Experiences', detail: 'Private sunrise Taj Mahal tour (enter via the less-crowded south gate). Maharaja dinner experience in a Rajasthan palace. Private yoga session with an ashram master. Wildlife safari in a luxury tented camp in Ranthambore (tiger spotting).' },
      { title: 'Private Tours', detail: 'Maharajas Express train (7-day luxury rail journey across Rajasthan, from $3,500 per person). Private houseboat in Kerala with chef and crew. Helicopter tours over the Himalayas from Shimla. Personal Ayurvedic retreat with a dedicated physician.' },
      { title: 'Airport & Transport', detail: 'Delhi and Mumbai airports have excellent business class lounges (ITC Hotels Green Lounge is outstanding). Private chauffeur-driven luxury cars (Mercedes, BMW) from ₹5,000-8,000/day. Domestic first class on Vistara for Delhi-Mumbai route.' },
    ],
  },
}

/* ───────── component ───────── */
export default function TravelByTypePage() {
  const [activePersona, setActivePersona] = useState<PersonaId>('solo')
  const [activeCountry, setActiveCountry] = useState<CountryId | 'all'>('all')

  const persona = PERSONAS.find(p => p.id === activePersona)!
  const countries = activeCountry === 'all' ? COUNTRIES : COUNTRIES.filter(c => c.id === activeCountry)

  return (
    <main style={{ backgroundColor: C.bg, minHeight: '100vh' }}>
      {/* ───── HERO ───── */}
      <section
        style={{
          background: `linear-gradient(135deg, ${C.primary} 0%, #0284C7 100%)`,
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
          Plan by How You Travel
        </h1>
        <p
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: '1.15rem',
            maxWidth: 620,
            margin: '16px auto 0',
            lineHeight: 1.6,
          }}
        >
          A solo backpacker needs completely different advice than a family with toddlers.
          Choose your travel style and get guidance that actually fits.
        </p>
      </section>

      {/* ───── PERSONA TABS ───── */}
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 20px' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: 'center',
            margin: '-28px auto 0',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {PERSONAS.map(p => (
            <button
              key={p.id}
              onClick={() => setActivePersona(p.id)}
              style={{
                padding: '12px 20px',
                borderRadius: 12,
                border: activePersona === p.id ? `2px solid ${C.primary}` : `1px solid ${C.border}`,
                background: activePersona === p.id ? C.primary : C.card,
                color: activePersona === p.id ? '#fff' : C.dark,
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'all .2s',
              }}
            >
              <span style={{ marginRight: 6 }}>{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>

        {/* ───── COUNTRY FILTER ───── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 28 }}>
          <button
            onClick={() => setActiveCountry('all')}
            style={{
              padding: '8px 18px',
              borderRadius: 20,
              border: activeCountry === 'all' ? `2px solid ${C.secondary}` : `1px solid ${C.border}`,
              background: activeCountry === 'all' ? C.secondary : C.card,
              color: activeCountry === 'all' ? '#fff' : C.dark,
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            All Countries
          </button>
          {COUNTRIES.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCountry(c.id)}
              style={{
                padding: '8px 18px',
                borderRadius: 20,
                border: activeCountry === c.id ? `2px solid ${C.secondary}` : `1px solid ${C.border}`,
                background: activeCountry === c.id ? C.secondary : C.card,
                color: activeCountry === c.id ? '#fff' : C.dark,
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              {c.flag} {c.name}
            </button>
          ))}
        </div>

        {/* ───── PERSONA HEADER ───── */}
        <div style={{ textAlign: 'center', margin: '44px 0 12px' }}>
          <span style={{ fontSize: '2.5rem' }}>{persona.icon}</span>
          <h2
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '1.85rem',
              color: C.dark,
              margin: '8px 0 4px',
            }}
          >
            {persona.label} Guide
          </h2>
          <p style={{ color: '#64748B', fontSize: '1rem', margin: 0 }}>
            Country-specific advice tailored for {persona.label.toLowerCase()} travel
          </p>
        </div>

        {/* ───── COUNTRY CARDS ───── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, paddingBottom: 80, marginTop: 24 }}>
          {countries.map(country => {
            const tips = DATA[activePersona][country.id]
            return (
              <section key={country.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: '1.75rem' }}>{country.flag}</span>
                  <h3
                    style={{
                      fontFamily: '"Playfair Display", serif',
                      fontSize: '1.4rem',
                      color: C.dark,
                      margin: 0,
                    }}
                  >
                    {country.name}
                  </h3>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: 16,
                  }}
                >
                  {tips.map((tip, i) => (
                    <div
                      key={i}
                      style={{
                        background: C.card,
                        borderRadius: 14,
                        border: `1px solid ${C.border}`,
                        padding: '20px 22px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                      }}
                    >
                      <h4
                        style={{
                          margin: '0 0 8px',
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: C.primary,
                        }}
                      >
                        {tip.title}
                      </h4>
                      <p style={{ margin: 0, color: '#475569', fontSize: '0.93rem', lineHeight: 1.65 }}>
                        {tip.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </main>
  )
}
