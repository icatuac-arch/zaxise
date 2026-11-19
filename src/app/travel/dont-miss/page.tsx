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
  { id: 'japan', name: 'Japan', flag: '🇯🇵' },
  { id: 'italy', name: 'Italy', flag: '🇮🇹' },
  { id: 'thailand', name: 'Thailand', flag: '🇹🇭' },
  { id: 'france', name: 'France', flag: '🇫🇷' },
  { id: 'india', name: 'India', flag: '🇮🇳' },
] as const

type CountryId = (typeof COUNTRIES)[number]['id']

/* ───────── experience data ───────── */
interface Experience {
  title: string
  why: string
  bestTime: string
  howTo: string
  cost: string
  booking: string
  insiderTrick: string
}

const EXPERIENCES: Record<CountryId, Experience[]> = {
  japan: [
    {
      title: 'Stay in a traditional ryokan with kaiseki dinner',
      why: 'Kaiseki is a multi-course dinner that\'s as much art as food — each tiny dish is a seasonal masterpiece on handmade pottery. Combined with sleeping on tatami floors, soaking in a private onsen, and being cared for by a dedicated host, it\'s the most complete cultural immersion you can have in Japan. Nothing like this exists anywhere else on Earth.',
      bestTime: 'Year-round, but autumn (October-November) adds stunning fall foliage visible from the onsen.',
      howTo: 'Book a ryokan in Hakone (near Tokyo), Kinosaki Onsen, or Kurokawa Onsen. Booking.com and Japanican both list ryokans. Arrive by 3 PM to enjoy the full experience — bath, dinner, breakfast.',
      cost: '¥15,000-40,000 per person, including dinner and breakfast. Yes, it\'s a splurge. Yes, it\'s worth every yen.',
      booking: 'Book 2-3 months ahead for popular ryokans. Weekdays are easier to get and sometimes cheaper. Some ryokans require minimum 2-night stays during peak seasons.',
      insiderTrick: 'Ask for a room with a private rotenburo (outdoor bath). Soak under the stars after your kaiseki dinner. Also: the breakfast is incredible and included — don\'t skip it for a late sleep-in.',
    },
    {
      title: 'See the 5 AM tuna auction at Toyosu Market',
      why: 'This is where the world\'s most expensive fish changes hands. Witnessing the fast-paced auction of enormous frozen tuna — with bidders communicating in hand signals — is hypnotic. Afterward, you eat the freshest sushi of your life at the market restaurants.',
      bestTime: 'Auctions run Monday-Saturday (closed Sundays and holidays). Arrive at 5:00 AM sharp.',
      howTo: 'Toyosu Market replaced the old Tsukiji Fish Market in 2018. Take the Yurikamome Line to Shijo-mae Station. The auction viewing area is behind glass — you observe from a gallery.',
      cost: 'Free to watch the auction. Sushi breakfast afterward: ¥2,000-5,000 at market restaurants.',
      booking: 'Advance registration is required through the Tokyo Metropolitan Government website. Only ~120 visitors are allowed per day. Apply at least 2 weeks ahead.',
      insiderTrick: 'After the auction, walk straight to Sushi Dai or Daiwa Sushi for breakfast — both are legendary. Sushi Dai has a 2-3 hour wait; Daiwa Sushi is almost as good with half the line. Go to Daiwa.',
    },
    {
      title: 'Cherry blossom picnic (hanami) under the trees',
      why: 'Tourists photograph cherry blossoms from a distance. Locals sit underneath them, spread out blue tarps, and have long, joyful picnics with sake, bento, and friends. Joining them (or doing your own hanami) turns a pretty sight into a profound cultural experience. The Japanese reverence for these fleeting blossoms teaches you something about appreciating impermanence.',
      bestTime: 'Late March to mid-April (varies by year and location). Tokyo peaks around late March to early April. Kyoto is 1 week later.',
      howTo: 'Buy a bento box and sake from a depachika (department store basement) or konbini. Head to Ueno Park (Tokyo), Maruyama Park (Kyoto), or Osaka Castle Park. Arrive by 10 AM on weekends to claim a good spot.',
      cost: 'Essentially free. ¥1,000-2,000 for food and drinks from a convenience store or supermarket.',
      booking: 'No booking needed — just show up. For the best spots, some groups send a friend to claim a space at 7 AM.',
      insiderTrick: 'Nighttime hanami (yozakura) is magical — many parks light up the trees after dark. Ueno Park and Meguro River in Tokyo are especially beautiful. Bring a warm layer — spring evenings are chilly.',
    },
    {
      title: 'Attend a sumo wrestling tournament',
      why: 'Sumo is 1,500 years old and deeply ritualized — the salt-throwing, the stomping, the stare-downs are as compelling as the actual wrestling. The atmosphere in the arena, with thousands of Japanese fans losing their composure over a match that lasts 5 seconds, is electric. You can\'t experience anything like this anywhere else.',
      bestTime: 'Tournaments (honbasho) happen only 6 times a year: January, March, May (Tokyo), July (Nagoya), September (Tokyo), November (Fukuoka). Each lasts 15 days.',
      howTo: 'Ryogoku Kokugikan arena in Tokyo is the main venue. Cheap seats in the upper rows offer a great view of the action.',
      cost: '¥3,800 for general admission upper seats, up to ¥14,800 for box seats (4 people, sitting on cushions, very close).',
      booking: 'Tickets sell out fast — they go on sale about 1 month before each tournament. Buy on the official sumo.or.jp website or at convenience store ticket machines (Lawson Ticket). General admission seats go on sale same-day from 8 AM at the arena.',
      insiderTrick: 'Arrive early for the lower-ranked matches (starts around 8:30 AM) — the arena is nearly empty and you can sit anywhere, including the expensive front-row seats. By 3 PM, ushers start checking tickets as the top-ranked wrestlers compete.',
    },
    {
      title: 'Take the "Romance Car" from Tokyo to Hakone',
      why: 'The Odakyu "Romance Car" is a beautifully designed limited express train with panoramic windows, reserved seats, and — on clear days — a jaw-dropping view of Mount Fuji. Hakone itself offers hot springs, art museums, a pirate ship on a lake, and a ropeway over volcanic valleys. It\'s a perfect day trip or overnight from Tokyo.',
      bestTime: 'Autumn (November) for fall colors, winter (December-February) for the clearest Fuji views. Spring is lovely too. Summer is hazy — Fuji often hides.',
      howTo: 'Board at Shinjuku Station (Odakyu Line). The ride takes 85 minutes. Buy the Hakone Free Pass (¥6,100) for the Romance Car + unlimited buses, boats, cable car, and ropeway in Hakone for 2 days.',
      cost: '¥6,100 for the 2-day Hakone Free Pass (includes the Romance Car supplement). Without the pass: ¥2,330 one way.',
      booking: 'Reserve Romance Car seats online at Odakyu\'s website or at the Shinjuku station counter. Window seats on the left side of the train offer the best Fuji views.',
      insiderTrick: 'Book the front observation car (first or last car depending on direction) for the most dramatic views. On the way back from Hakone, sit on the right side for sunset views. Take the Hakone Ropeway to Owakudani for volcanic black eggs — legend says each one adds 7 years to your life.',
    },
  ],

  italy: [
    {
      title: 'Watch the sunset from Piazzale Michelangelo in Florence with a bottle of Chianti',
      why: 'Florence sprawls below you — the Duomo, Palazzo Vecchio, the Arno bridges — all turning gold, then pink, then deep blue. It\'s free, it\'s achingly beautiful, and sharing a cheap bottle of Chianti with someone you care about while watching this is one of life\'s peak moments. Every person who does this says it was the highlight of their Italy trip.',
      bestTime: 'Spring and autumn evenings are perfect. Summer sunsets are later (8:30-9 PM) and the piazzale gets crowded but the sky colors are incredible. Arrive 30-45 minutes before sunset.',
      howTo: 'Walk up from Piazza Poggi (steep 10-minute climb) or take bus 12 or 13 from the city center. Grab a bottle of Chianti from any enoteca (€6-10) and two plastic cups.',
      cost: 'Free. Wine: €6-10. Best €10 you\'ll spend in Italy.',
      booking: 'No booking needed. Just show up.',
      insiderTrick: 'Don\'t leave immediately after sunset — the city lights come on and the view transforms again. Also, walk 5 minutes further up to San Miniato al Monte church for an even higher vantage point with far fewer people.',
    },
    {
      title: 'Eat pizza in Naples — where it was INVENTED',
      why: 'Neapolitan pizza isn\'t just good pizza — it\'s a completely different food from what you\'ve eaten anywhere else. The crust is puffy, charred, and chewy. The mozzarella melts into pools. The tomato sauce tastes like actual sunshine. It was born here 200+ years ago, and eating it in Naples is a borderline religious experience.',
      bestTime: 'Year-round. Go for lunch (12:30-2 PM) or early dinner (7-8 PM) to avoid the longest waits.',
      howTo: 'Go to L\'Antica Pizzeria da Michele (the "Eat Pray Love" pizzeria) on Via Cesare Sersale. They only make two pizzas: Margherita and Marinara. That\'s it. Get both.',
      cost: '€4-5 for a full pizza. Under €10 for pizza + a drink. It might be the best meal-per-euro on Earth.',
      booking: 'No reservations. Line starts forming by 11:30 AM. Wait time is usually 20-45 minutes. It moves fast.',
      insiderTrick: 'If the line at Da Michele is insane, Sorbillo (Via dei Tribunali) and Di Matteo are equally legendary and often shorter waits. The real trick: eat pizza for lunch AND dinner in Naples. It costs less than a single restaurant appetizer in Florence.',
    },
    {
      title: 'Get lost in Venice intentionally',
      why: 'Everyone talks about how easy it is to get lost in Venice. What they don\'t tell you is that getting lost on purpose — putting away your phone, choosing random alleys, crossing unknown bridges — leads to the real Venice. Tiny squares where locals hang laundry, hidden canals where gondoliers practice, bakeries that no tourist has reviewed on TripAdvisor. This is how you find magic.',
      bestTime: 'Early morning (7-9 AM) or late evening (after 7 PM) when day-trippers have left. Venice in the off-season (November-March) is hauntingly beautiful.',
      howTo: 'Start from any point away from St. Mark\'s Square. Walk in any direction. When you hit a dead end, turn around and take a different path. Follow sounds, smells, and curiosity. Keep walking for at least 2 hours.',
      cost: 'Free. Though you\'ll inevitably discover a tiny bacaro (wine bar) and spend €5 on a glass of wine and cicchetti (Venetian tapas).',
      booking: 'No booking. Just put your phone in your pocket.',
      insiderTrick: 'The Cannaregio and Dorsoduro neighborhoods are the best for wandering — fewer tourists, more authentic Venice. Stop at any bacaro you find for an "ombra" (small glass of wine, €2-3) and cicchetti. The Venetians do this all day.',
    },
    {
      title: 'Attend an opera at Arena di Verona',
      why: 'This is a real Roman amphitheatre, built in 30 AD, and they still perform full-scale operas here under the open sky. 15,000 people, no microphones, starlight overhead, the warm stone of a 2,000-year-old arena beneath you. Even if you don\'t love opera, this will move you. It\'s one of the most extraordinary performance venues in the world.',
      bestTime: 'The opera season runs June through September. Performances start at 9 PM as the sun sets.',
      howTo: 'Buy tickets online at arena.it. The cheapest option is the unnumbered stone step seats (gradinata) — bring a cushion. Premium seats have chairs.',
      cost: 'Stone step seats (gradinata): €30-35. Numbered seats: €60-150. Gold seats: €200+.',
      booking: 'Book at least 2-3 weeks ahead for popular operas (Aida, Carmen, La Traviata). Stone step seats often available last-minute. The arena box office also sells same-day tickets.',
      insiderTrick: 'Buy the cheapest stone seats and bring a small cushion (vendors sell them outside for €3-5). Arrive early to grab a stone seat near the center. The tradition is to light candles as darkness falls — the arena fills with tiny flames. Bring a lighter and a small candle to join in.',
    },
    {
      title: 'Join the passeggiata — the evening stroll',
      why: 'Every evening, in every Italian town and city, people get dressed up and go for a walk. Not to get exercise. Not to go anywhere. Just to walk, see people, be seen, stop for gelato, chat with neighbors, and enjoy being alive. The passeggiata is the purest expression of Italian culture, and joining it makes you feel, for one evening, like you actually live there.',
      bestTime: 'Every evening, roughly 6-8 PM in summer, 5-7 PM in cooler months. Sundays have the biggest turnout.',
      howTo: 'Every town has a main street or piazza where it happens. In Rome, it\'s Via del Corso. In Florence, along the Arno. In small towns, ask any local — they\'ll point you to the passeggiata route. Dress neatly (Italians notice).',
      cost: 'Free. Budget €3-4 for a gelato stop.',
      booking: 'Just show up and walk.',
      insiderTrick: 'The best passeggiata isn\'t in a big city — it\'s in a small town. Places like Lucca, Lecce, Siracusa, and Matera have passeggiate where you\'re the only tourist and it feels completely authentic. Walk slowly. Stop often. This isn\'t about distance.',
    },
  ],

  thailand: [
    {
      title: 'Floating market at dawn — Damnoen Saduak',
      why: 'A canal market where vendors paddle wooden boats loaded with tropical fruit, steaming noodles, and colorful produce. The sights, sounds, and smells are overwhelming in the best way. It\'s chaotic, beautiful, and completely unlike any market you\'ve ever visited. This is the Thailand that made you want to come here.',
      bestTime: 'Go at 6-7 AM before the tour buses arrive at 9 AM. By 10 AM, the market is packed with tourists and the magic is gone. Weekdays are better than weekends.',
      howTo: 'Damnoen Saduak is 80 km southwest of Bangkok (1.5 hours by car). Hire a private driver (฿1,500-2,000 round trip) or join an early-morning tour. You can also take a public minibus from Bangkok\'s Southern Bus Terminal.',
      cost: 'Free to walk along the canal banks. Boat ride: ฿150-300 per person. Food from boats: ฿40-80 per dish.',
      booking: 'No booking needed. Just arrive early. If using a tour company, choose one that departs Bangkok at 5:30-6:00 AM.',
      insiderTrick: 'Skip Damnoen Saduak entirely and go to Amphawa Floating Market instead — it\'s 10 km away, far more authentic, and mostly Thai visitors. It only operates Friday-Sunday evenings (4-9 PM). The seafood grilled on boats at sunset is unforgettable.',
    },
    {
      title: 'Release a lantern at Yi Peng Festival in Chiang Mai',
      why: 'Thousands of paper lanterns float up into the night sky simultaneously, each one carrying a wish or a prayer. The sky fills with warm light, the crowd goes silent, and for a few minutes the world feels genuinely magical. This is one of those "I can\'t believe I\'m here" moments that you\'ll remember for the rest of your life.',
      bestTime: 'November (dates vary based on the lunar calendar — usually the full moon of the 12th lunar month). The main mass release events are organized by Mae Jo University and other groups.',
      howTo: 'Fly to Chiang Mai and book accommodation weeks in advance — the city fills up. The organized mass-release events require tickets. Smaller releases happen throughout the city during the festival period.',
      cost: 'Free to watch from the streets. Organized mass-release events: ฿3,000-5,000 per person (includes dinner and lanterns). Individual lanterns from street vendors: ฿50-100.',
      booking: 'Book organized events 2-3 months ahead through their websites. Hotel prices double during Yi Peng — book immediately once you know your dates.',
      insiderTrick: 'Yi Peng coincides with Loy Krathong (the water lantern festival). You get TWO festivals for one trip — fire lanterns in the sky and flower lanterns floating on the river. Watch from the banks of the Ping River for the most complete experience.',
    },
    {
      title: 'Learn to cook pad thai from a Thai grandmother',
      why: 'Not just a cooking class — an insight into Thai culture through food. The best classes start with a market tour where your teacher explains every ingredient, every herb, every chili. Then you cook 4-5 dishes from scratch and eat everything you made. You\'ll go home with skills you\'ll actually use, and a story that starts with "my Thai cooking teacher told me..."',
      bestTime: 'Year-round. Morning classes (start 8-9 AM with the market tour) are the best because markets are at their freshest.',
      howTo: 'Chiang Mai has the best cooking classes in Thailand. Search "Thai cooking class Chiang Mai" on Cookly or Airbnb Experiences. Choose one that includes a market visit and is taught in a home, not a commercial kitchen.',
      cost: '฿800-1,500 per person ($22-42) for a half-day class with market tour, 4-5 dishes, and a recipe booklet.',
      booking: 'Book 1-2 days ahead in low season, 1 week ahead in high season (November-February). Small group classes (max 8-10 people) are much better than large groups.',
      insiderTrick: 'Ask specifically for a class taught by a Thai grandmother or aunt, not a young chef. The older generation cooks by feel, not by recipe, and their food is better. They also tell better stories. Silom Cooking School in Bangkok and Mama Noi in Chiang Mai are excellent.',
    },
    {
      title: 'Sunrise meditation at Doi Suthep temple',
      why: 'Doi Suthep is Chiang Mai\'s sacred temple, perched on a mountain overlooking the city. At sunrise, monks chant morning prayers, incense fills the golden temple, and the valley below is blanketed in mist. Whether or not you\'re spiritual, sitting quietly in this setting as the sun rises over northern Thailand\'s mountains is profoundly peaceful.',
      bestTime: 'Year-round, but November-February has the clearest skies and most comfortable temperatures. Arrive by 5:30-6:00 AM.',
      howTo: 'Doi Suthep is 15 km west of Chiang Mai, up a winding mountain road. Hire a songthaew (red truck taxi, ฿60 per person from Chiang Mai University) or rent a scooter. The temple is at the top of 306 steps (or take the funicular, ฿50).',
      cost: 'Temple entry: ฿30 for foreigners. Songthaew transport: ฿60-100 per person each way.',
      booking: 'No booking needed. Just show up before sunrise.',
      insiderTrick: 'Most tourists visit at midday when it\'s hot and crowded. At sunrise, you\'ll share the temple with monks and a handful of devotees. After the visit, drive further up to the Hmong village of Doi Pui for Thai hill-tribe coffee and mountain views, with almost no other tourists.',
    },
    {
      title: 'Full Moon Party on Koh Phangan',
      why: 'Love it or hate it, there is nothing else like the Full Moon Party. 10,000-30,000 people on a single beach, neon body paint, fire jumpers, DJ stages along the shore, buckets of rum and Red Bull. It\'s wild, messy, and unforgettable. Whether you\'re 22 or 52, experiencing it once gives you a story you\'ll tell for decades.',
      bestTime: 'Monthly on the full moon (dates vary — check fullmoonpartythailand.com). The biggest parties are December-March (peak season).',
      howTo: 'Fly to Koh Samui, then take a ferry to Koh Phangan (30-45 min). The party is on Haad Rin beach. Book accommodation on Koh Phangan at least 2 weeks ahead (prices triple during Full Moon).',
      cost: 'Entry: ฿100. Bucket drinks: ฿150-300. Budget ฿1,000-2,000 for the night. Accommodation on Full Moon night: ฿1,500-5,000 (vs ฿500-1,000 normal nights).',
      booking: 'Book Koh Phangan accommodation the moment you know your dates — good places sell out weeks ahead. Ferry tickets from Koh Samui can be bought same-day at the pier.',
      insiderTrick: 'Wear shoes you don\'t mind losing (the beach gets wild). Keep your phone in a waterproof pouch. Pre-drink at your accommodation — beach prices are steep by Thai standards. Most importantly: buy sealed bottles and cans only, never accept open cups from strangers. Stay with your group, and leave before 4 AM when things can get sketchy.',
    },
  ],

  france: [
    {
      title: 'Picnic on Pont des Arts at sunset',
      why: 'You buy a fresh baguette, a chunk of Brie, some pate, a few grapes, and a bottle of red from a local shop. Total cost: maybe 12 euros. You sit on the bridge as the sun sets over the Seine, Notre-Dame on one side, the Louvre on the other, and you have the most Parisian meal possible — no reservation, no dress code, no waiter judging your French. Just you, bread, cheese, wine, and Paris being Paris.',
      bestTime: 'Spring through early autumn (May-September). Arrive 45 minutes before sunset. The golden hour light on the Seine is extraordinary.',
      howTo: 'Shop at any boulangerie (baguette, €1.20), fromagerie or supermarket (cheese, €3-5), and wine shop or Monoprix (wine, €4-7). Walk to Pont des Arts (or Pont Neuf, which is also beautiful). Sit on the edge. Eat.',
      cost: 'Total: €10-15 for two people. Possibly the best meal-to-price ratio in Paris.',
      booking: 'None. Show up.',
      insiderTrick: 'Bring a corkscrew (many wines still have corks) or buy a screw-cap bottle. Locals bring a small cutting board and a knife for the cheese. For the best view, sit on the south side of the bridge facing east — you\'ll see Notre-Dame and Ile de la Cite.',
    },
    {
      title: 'Watch the Eiffel Tower sparkle at night',
      why: 'Most people don\'t know this: every hour on the hour after dark, the Eiffel Tower breaks into a 5-minute sparkling light show. 20,000 light bulbs twinkle against the night sky, and it\'s genuinely breathtaking — even cynical travelers gasp. It\'s free, it\'s magical, and it\'s the kind of moment that reminds you why you travel.',
      bestTime: 'Every night, starting at nightfall through 1:00 AM (11:45 PM in winter). The sparkle happens at the top of every hour for 5 minutes.',
      howTo: 'The best viewing spots: Trocadero plaza (iconic view, crowded), Champ de Mars (lie on the grass and look up), or Pont d\'Iena (bridge view). Get there 10-15 minutes before the hour.',
      cost: 'Completely free.',
      booking: 'None needed.',
      insiderTrick: 'Skip Trocadero (overcrowded, pickpockets). Instead, watch from Rue de l\'Universite or the terrace of Cafe de l\'Homme. For the ultimate experience: buy a bottle of champagne (€15 from any wine shop), walk to the Champ de Mars, lie on the grass, and watch the sparkle from directly below. The tower fills your entire field of vision.',
    },
    {
      title: 'Visit Monet\'s garden in Giverny',
      why: 'You\'ve seen the Water Lilies in museums around the world. Now see the actual water lilies. The actual Japanese bridge. The actual garden that Claude Monet designed and painted obsessively for 43 years. Walking through Giverny is like walking into an Impressionist painting — the colors are impossibly vivid, the light filters through exactly as he captured it. Art lovers cry here. That\'s not hyperbole.',
      bestTime: 'Open April through November. Peak bloom: late May through June (water lilies and wisteria). September is also gorgeous with fewer crowds. Go on a weekday.',
      howTo: 'Take the train from Paris Saint-Lazare to Vernon (45 min, €15-25 each way), then a shuttle bus to Giverny (10 min, €10 round trip). Or rent a car — it\'s a beautiful drive through the Normandy countryside.',
      cost: 'Garden entry: €11. Train: €15-25 each way. Total day trip: €40-60.',
      booking: 'Buy timed tickets in advance at fondation-monet.com to skip the line. First entry slot (9:30 AM) is the best — smallest crowds and morning light is perfect for the water garden.',
      insiderTrick: 'Visit the water garden FIRST (behind the house). Most tour groups go through the house first, so the water garden is empty for the first 30-45 minutes. The morning light on the water lilies is exactly what Monet painted. Also visit the nearby Musee des Impressionnismes for context — a small, excellent museum that almost nobody visits.',
    },
    {
      title: 'See the lavender fields of Provence',
      why: 'Endless rows of purple stretching to the horizon, buzzing with bees, smelling like nothing you\'ve ever smelled. The lavender fields of Provence are one of those landscapes that makes you stop, breathe, and think: "This is why I left home." Photographs don\'t capture the scale, the scent, or the sound of millions of bees. You have to be there.',
      bestTime: 'Mid-June to mid-July ONLY. Peak bloom is usually late June to early July. By late July, harvesting begins and fields are cut. This is a narrow window — plan accordingly.',
      howTo: 'The most famous fields are around Valensole, Sault, and the Senanque Abbey. Rent a car from Aix-en-Provence or Avignon and drive (1-1.5 hours). No public transport reaches the best fields.',
      cost: 'Free to see (they\'re open fields). Car rental: €30-50/day. A tank of gas will last the trip.',
      booking: 'No booking for the fields themselves. Book accommodation in Aix-en-Provence, Apt, or Gordes well ahead — this is peak tourist season.',
      insiderTrick: 'Go at sunrise or sunset for the best light and fewer people. The Senanque Abbey (lavender rows in front of a 12th-century monastery) is the most photographed spot but gets crowded by 10 AM — arrive at 7 AM. Bring bug spray (bees are docile, but flies are not). Combine with a visit to the Gordes and Roussillon hilltop villages for a perfect Provence day.',
    },
    {
      title: 'Wine cave tasting in Champagne',
      why: 'You\'re standing in a chalk cave 30 meters underground, surrounded by millions of bottles aging in darkness. The guide explains the riddling, the disgorgement, the traditions that haven\'t changed in centuries. Then you taste champagne pulled fresh from the cave, in the cave, in the actual region where champagne was invented. Drinking champagne will never feel the same after this.',
      bestTime: 'Year-round. Autumn (September-October) coincides with the grape harvest — vineyards are at their most beautiful and atmospheric.',
      howTo: 'Take the TGV from Paris to Reims (45 min). The big houses — Moet & Chandon, Veuve Clicquot, Taittinger, Pommery — are in Reims and Epernay (20 min apart by car/train).',
      cost: 'Cellar tours with tasting: €25-40 per person at most major houses. Premium tastings with vintage champagnes: €50-100.',
      booking: 'Book online 1-2 weeks ahead (required for most houses). Veuve Clicquot and Moet sell out fastest. Taittinger and Pommery are easier to book and equally impressive (Pommery\'s caves are arguably the most spectacular).',
      insiderTrick: 'Visit a small grower-producer (recoltant-manipulant, look for "RM" on the label) instead of, or in addition to, a big house. They\'re more personal, less touristy, and the champagne is often better. Ask your hotel in Reims for a recommendation. Also: the Avenue de Champagne in Epernay is a UNESCO World Heritage site — walk it end to end after your tastings.',
    },
  ],

  india: [
    {
      title: 'Sunrise at the Taj Mahal',
      why: 'The Taj Mahal is beautiful in photographs. In person, at sunrise, it\'s something else entirely. You arrive in pre-dawn darkness. The white marble is grey. Then slowly, imperceptibly, the sky lightens and the Taj turns soft pink, then pale gold, then blinding white. The reflection pool mirrors it all. The crowds haven\'t arrived yet. It\'s just you and this impossible building that a man built because he loved his wife. That\'s not tourism — that\'s a moment.',
      bestTime: 'Year-round, but October-March has the best weather. The Taj is open sunrise to sunset (closed Fridays). Sunrise slot opens at 6 AM (or as early as 5:30 AM).',
      howTo: 'Stay in Agra the night before (book a hotel in Taj Ganj neighborhood, closest to the entrance). Buy tickets online at asi.payumoney.com the day before. Enter through the East Gate (shortest line at sunrise).',
      cost: '₹1,100 for foreign tourists (₹50 for Indians). Budget hotels in Agra: ₹800-2,000/night.',
      booking: 'Buy tickets online the day before to avoid the morning ticket line. Only 40,000 domestic and 1,000 foreign visitors are allowed per day — online booking guarantees entry.',
      insiderTrick: 'Arrive at the East Gate by 5:30 AM — it opens at first light. Walk straight to the main platform (don\'t stop at the entrance gate for photos — come back for those). The marble platform is where the sunrise reflections are most stunning. Also: visit Mehtab Bagh (Moonlight Garden) across the river at sunset for the classic postcard view of the Taj, with zero crowds and free entry.',
    },
    {
      title: 'Take a boat on the Ganges at sunrise in Varanasi',
      why: 'Varanasi may be the oldest continuously inhabited city on Earth. Every morning, thousands of people gather at the ghats (stone steps) along the Ganges to pray, bathe, wash clothes, practice yoga, and — yes — cremate their dead. Seeing it from a boat as the sun rises, with temple bells ringing and incense smoke curling, is overwhelming, confronting, and profoundly moving. It changes how you think about life and death.',
      bestTime: 'October-March for comfortable weather. Go at sunrise (5:00-6:00 AM). The evening Ganga Aarti ceremony (6:30-7:00 PM at Dashashwamedh Ghat) is also unmissable.',
      howTo: 'Stay near Assi Ghat or Dashashwamedh Ghat. Walk to any ghat and hire a boat. Tell the boatman you want to go from Assi Ghat to Manikarnika Ghat (the burning ghat) and back.',
      cost: 'Shared boat: ₹100-150 per person. Private boat: ₹300-500 for the whole boat (seats 4-6). Negotiation is expected.',
      booking: 'No advance booking — boats line up at every ghat. Negotiate the price before boarding. A fair price for a private 1-hour boat ride is ₹300-400.',
      insiderTrick: 'Bring a small offering: a few marigold flowers and a tiny oil lamp (diya) — vendors sell them for ₹20-30 at the ghats. Float them on the Ganges as you watch the sunrise. It\'s a simple act that connects you to the 3,000 years of prayers offered at this river. Also: be respectful at Manikarnika Ghat (the cremation ground) — do not photograph the cremations.',
    },
    {
      title: 'Attend Holi festival — the color festival',
      why: 'Strangers throw colored powder at you, splash you with water, and then hug you. Age, class, nationality — none of it matters. Everyone is covered in every color of the rainbow, everyone is laughing, and for one day, the entire country becomes one giant celebration of spring, love, and fresh starts. There is no experience like Holi anywhere on Earth.',
      bestTime: 'March (date varies based on the Hindu calendar — usually the full moon day of Phalguna month). The main celebration is one day, but festivities can span 2-3 days.',
      howTo: 'The biggest celebrations are in Mathura and Vrindavan (where Holi originated), Jaipur, and Delhi. Many hostels and hotels organize Holi celebrations for tourists (safer for first-timers). Wear white clothes you don\'t mind throwing away afterward.',
      cost: 'Free to participate on the streets. Hostel/hotel Holi parties: ₹500-2,000 per person with food, music, and color powder provided.',
      booking: 'Book accommodation 2-3 months ahead — Holi is one of India\'s biggest holidays and hotels fill up fast.',
      insiderTrick: 'Apply coconut oil or mustard oil to all exposed skin BEFORE going out — it creates a barrier that makes the colors wash off much easier. Bring a waterproof phone pouch (absolutely essential). Don\'t wear contact lenses — the powder gets everywhere. The celebration winds down by early afternoon — join a rooftop party for the afternoon music and food that follows.',
    },
    {
      title: 'Sleep in a Rajasthan palace hotel',
      why: 'Actual royal palaces — where maharajas lived, plotted, and hosted lavish parties — have been converted into hotels. You sleep in rooms with hand-painted murals, marble arches, and courtyards that housed elephants. The staff treats you like royalty. And here\'s the unbelievable part: many of these palace hotels cost $30-80/night. This level of architectural beauty and history for the price of a Holiday Inn is something only India can offer.',
      bestTime: 'October-March (Rajasthan summer is brutal at 45°C+). The monsoon (July-September) brings brief, dramatic storms that make the palaces even more atmospheric.',
      howTo: 'Search for "heritage hotels" in Jaipur, Jodhpur, Udaipur, Jaisalmer, and Bundi on Booking.com or HotelHeritage.in. Look for properties certified as "Heritage Grand" or "Heritage Classic" by the Indian government.',
      cost: 'Budget heritage stays: ₹2,000-5,000/night ($25-60). Mid-range palace hotels: ₹5,000-15,000 ($60-180). Ultra-luxury (Taj Lake Palace, Rambagh Palace): ₹30,000+ ($360+).',
      booking: 'Book 2-4 weeks ahead for popular properties. Bundi and Jaisalmer have less-visited palaces that are easier to book last-minute and often more intimate.',
      insiderTrick: 'The smaller, family-run heritage hotels are often the best experience — the owner (frequently a descendant of the original royal family) sometimes hosts dinner and tells stories of their ancestors. Brijraj Bhawan in Kota and Castle Mandawa in Shekhawati are hidden gems. Ask if they offer a heritage walk or rooftop dinner — many do, for free or very little extra.',
    },
    {
      title: 'Eat a thali meal — the ultimate Indian food experience',
      why: 'A thali is a round metal plate with 10-15 small bowls containing different curries, dals, chutneys, rice, bread, pickle, and dessert. Every region has its own version. The flavors span sweet, sour, spicy, bitter, and umami in a single meal. And here\'s the best part: it comes with unlimited refills. A server walks around with buckets of each dish and tops you up until you physically cannot eat any more. All of this for $2-3.',
      bestTime: 'Year-round. Lunch (12-2 PM) is when thali restaurants are at their busiest and freshest.',
      howTo: 'In any city, ask a local or your hotel: "Where\'s the best thali?" In Ahmedabad (Gujarat), the thali tradition is strongest. In Delhi, try Rajdhani or Sagar Ratna. In Mumbai, try Shree Thaker Bhojanalay. In any city, look for restaurants with "Bhojanalay" or "Thali" in the name.',
      cost: '₹80-200 ($1-2.50) at a local restaurant. ₹300-600 ($3.50-7) at a nicer restaurant. ₹800-1,500 ($10-18) at a heritage or hotel restaurant. All with unlimited refills.',
      booking: 'No reservation needed at local spots. Popular restaurants in Ahmedabad and Mumbai may have a short wait during peak lunch hours.',
      insiderTrick: 'Eat with your hands — Indians eat thali with their right hand (never the left, which is considered unclean), tearing bread and mixing rice with curry. The staff won\'t judge you for using a spoon, but eating with your hands actually makes the food taste better (it\'s a real thing — studies confirm it). Wash your hands at the sink that every thali restaurant has at the entrance.',
    },
  ],
}

/* ───────── component ───────── */
export default function DontMissPage() {
  const [activeCountry, setActiveCountry] = useState<CountryId>('japan')
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0)

  const country = COUNTRIES.find(c => c.id === activeCountry)!
  const experiences = EXPERIENCES[activeCountry]

  return (
    <main style={{ backgroundColor: C.bg, minHeight: '100vh' }}>
      {/* ───── HERO ───── */}
      <section
        style={{
          background: `linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, ${C.primary} 100%)`,
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
          Don&apos;t Miss
        </h1>
        <p
          style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '1.2rem',
            maxWidth: 660,
            margin: '16px auto 0',
            lineHeight: 1.6,
            fontStyle: 'italic',
          }}
        >
          The experiences you&apos;ll regret skipping. Not just sights — the moments that make a trip unforgettable.
        </p>
        <p
          style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.95rem',
            maxWidth: 520,
            margin: '12px auto 0',
            lineHeight: 1.5,
          }}
        >
          Think of this as advice from a well-traveled friend, not a guidebook.
        </p>
      </section>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
        {/* ───── COUNTRY PILLS ───── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: 'center',
            margin: '-24px auto 0',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {COUNTRIES.map(c => (
            <button
              key={c.id}
              onClick={() => {
                setActiveCountry(c.id)
                setExpandedIdx(0)
              }}
              style={{
                padding: '12px 24px',
                borderRadius: 12,
                border: activeCountry === c.id ? '2px solid #7C3AED' : `1px solid ${C.border}`,
                background: activeCountry === c.id ? '#7C3AED' : C.card,
                color: activeCountry === c.id ? '#fff' : C.dark,
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'all .2s',
              }}
            >
              {c.flag} {c.name}
            </button>
          ))}
        </div>

        {/* ───── COUNTRY HEADER ───── */}
        <div style={{ textAlign: 'center', marginTop: 44, marginBottom: 8 }}>
          <span style={{ fontSize: '2.5rem' }}>{country.flag}</span>
          <h2
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '1.85rem',
              color: C.dark,
              margin: '8px 0 4px',
            }}
          >
            {country.name} — 5 Experiences You Can&apos;t Miss
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.95rem', margin: 0, maxWidth: 500, marginInline: 'auto' }}>
            Things that are unique to {country.name} — you literally cannot do these anywhere else.
          </p>
        </div>

        {/* ───── EXPERIENCE CARDS ───── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 80, marginTop: 32 }}>
          {experiences.map((exp, i) => {
            const isOpen = expandedIdx === i
            return (
              <div
                key={i}
                style={{
                  background: C.card,
                  borderRadius: 16,
                  border: isOpen ? '2px solid #7C3AED' : `1px solid ${C.border}`,
                  overflow: 'hidden',
                  boxShadow: isOpen ? '0 4px 20px rgba(124,58,237,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
                  transition: 'box-shadow .2s, border-color .2s',
                }}
              >
                {/* Header — always visible */}
                <button
                  onClick={() => setExpandedIdx(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    padding: '22px 26px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 16,
                    textAlign: 'left',
                  }}
                >
                  <span
                    style={{
                      background: isOpen ? '#7C3AED' : `${C.primary}14`,
                      color: isOpen ? '#fff' : C.primary,
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      borderRadius: 10,
                      width: 38,
                      height: 38,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all .2s',
                    }}
                  >
                    {i + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontFamily: '"Playfair Display", serif',
                        fontSize: '1.15rem',
                        color: C.dark,
                        lineHeight: 1.4,
                      }}
                    >
                      {exp.title}
                    </h3>
                    {!isOpen && (
                      <p
                        style={{
                          margin: '6px 0 0',
                          color: '#94A3B8',
                          fontSize: '0.88rem',
                          lineHeight: 1.5,
                        }}
                      >
                        {exp.why.slice(0, 120)}...
                      </p>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: '1.3rem',
                      color: '#94A3B8',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform .2s',
                      flexShrink: 0,
                      marginTop: 6,
                    }}
                  >
                    &#9660;
                  </span>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div style={{ padding: '0 26px 28px' }}>
                    {/* Why it's special */}
                    <div style={{ marginBottom: 24 }}>
                      <p
                        style={{
                          margin: 0,
                          color: '#334155',
                          fontSize: '1rem',
                          lineHeight: 1.75,
                          fontStyle: 'italic',
                        }}
                      >
                        {exp.why}
                      </p>
                    </div>

                    {/* Info grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: 16,
                      }}
                    >
                      {[
                        { label: 'Best Time', value: exp.bestTime, color: '#7C3AED' },
                        { label: 'How to Do It', value: exp.howTo, color: C.primary },
                        { label: 'Cost', value: exp.cost, color: '#16A34A' },
                        { label: 'Booking Tips', value: exp.booking, color: C.secondary },
                      ].map((info, j) => (
                        <div
                          key={j}
                          style={{
                            background: C.bg,
                            borderRadius: 12,
                            padding: '16px 18px',
                            border: `1px solid ${C.border}`,
                          }}
                        >
                          <h4
                            style={{
                              margin: '0 0 6px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              color: info.color,
                              textTransform: 'uppercase',
                              letterSpacing: '0.06em',
                            }}
                          >
                            {info.label}
                          </h4>
                          <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem', lineHeight: 1.6 }}>
                            {info.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Insider trick — highlighted */}
                    <div
                      style={{
                        marginTop: 18,
                        background: 'linear-gradient(135deg, #7C3AED08, #4F46E512)',
                        borderRadius: 12,
                        padding: '18px 20px',
                        border: '1px solid #7C3AED22',
                      }}
                    >
                      <h4
                        style={{
                          margin: '0 0 6px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: '#7C3AED',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}
                      >
                        Insider Trick
                      </h4>
                      <p style={{ margin: 0, color: '#334155', fontSize: '0.93rem', lineHeight: 1.7 }}>
                        {exp.insiderTrick}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
