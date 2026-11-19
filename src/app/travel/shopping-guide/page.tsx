'use client'

import { useState, useMemo } from 'react'

const COUNTRY_SHOPPING: {
  id: string
  name: string
  flag: string
  specialties: { item: string; detail: string }[]
  bestMarkets: { name: string; location: string; knownFor: string }[]
  authenticityTips: string[]
  bargainingAdvice: string[]
  taxRefund: string
  shippingTips: string[]
}[] = [
  {
    id: 'japan',
    name: 'Japan',
    flag: '\u{1F1EF}\u{1F1F5}',
    specialties: [
      { item: 'Electronics', detail: 'Akihabara in Tokyo is the world-famous electronics district — find everything from the latest gadgets to retro gaming consoles at competitive prices.' },
      { item: 'Anime & Manga', detail: 'Akihabara and Nakano Broadway offer figurines, rare manga, cosplay gear, and limited-edition collectibles you cannot find elsewhere.' },
      { item: 'Matcha Products', detail: 'Uji (Kyoto) produces Japan\'s finest matcha. Look for ceremonial-grade powder, matcha Kit-Kats, and matcha sweets at department store basements (depachika).' },
      { item: 'Ceramics & Pottery', detail: 'Arita-yaki, Mashiko-yaki, and Kiyomizu-yaki are prized. Visit pottery towns or department stores for authentic pieces with kiln certificates.' },
      { item: 'Kimonos & Textiles', detail: 'Vintage kimonos at flea markets (Toji Temple market in Kyoto) start from 500 yen. New silk kimonos from specialized shops run much higher.' },
      { item: 'Wagashi Sweets', detail: 'Beautifully crafted traditional Japanese confections — perfect gifts. Buy from established wagashi-ya shops for the freshest quality.' },
    ],
    bestMarkets: [
      { name: 'Akihabara Electric Town', location: 'Tokyo', knownFor: 'Electronics, anime, manga, gaming' },
      { name: 'Tsukiji Outer Market', location: 'Tokyo', knownFor: 'Kitchen knives, dried goods, food souvenirs' },
      { name: 'Nishiki Market', location: 'Kyoto', knownFor: 'Local foods, matcha, pickles, ceramics' },
      { name: 'Toji Temple Flea Market', location: 'Kyoto', knownFor: 'Vintage kimonos, antiques, pottery (21st of each month)' },
      { name: 'Don Quijote (Donki)', location: 'Nationwide', knownFor: 'Discount everything — cosmetics, snacks, electronics, souvenirs' },
    ],
    authenticityTips: [
      'Look for "Made in Japan" labels, especially on ceramics and knives.',
      'Department store basements (depachika) guarantee authentic, high-quality food souvenirs.',
      'For electronics, buy from authorized retailers like Yodobashi Camera or Bic Camera for warranty coverage.',
      'Vintage kimonos should have hand-stitched seams — machine-stitched ones are modern reproductions.',
    ],
    bargainingAdvice: [
      'Bargaining is generally not practiced in Japan — prices are fixed in most stores.',
      'Exception: flea markets and some electronics shops in Akihabara may offer small discounts if you buy multiple items.',
      'Asking politely "Is there a discount?" (Waribiki dekimasu ka?) is acceptable at electronics chains for big purchases.',
    ],
    taxRefund: 'Japan offers tax-free shopping (10% consumption tax refund) for foreign tourists on purchases over 5,000 yen at participating stores. Bring your passport and look for "Tax-Free" signs. Items must leave Japan unused within 30 days.',
    shippingTips: [
      'Japan Post offers reliable and affordable international shipping — EMS is the fastest option.',
      'Many department stores offer international shipping services directly.',
      'For fragile ceramics, request "koware-mono" (fragile item) packaging at the post office.',
      'Konbini (convenience stores) accept pre-packaged parcels for domestic shipping via Yamato or Sagawa.',
    ],
  },
  {
    id: 'italy',
    name: 'Italy',
    flag: '\u{1F1EE}\u{1F1F9}',
    specialties: [
      { item: 'Leather Goods', detail: 'Florence\'s San Lorenzo Market and Santa Croce leather school produce world-renowned bags, belts, wallets, and jackets. Look for "Vera Pelle" (genuine leather) stamps.' },
      { item: 'Fashion & Designer Wear', detail: 'Milan\'s Quadrilatero della Moda (Fashion Quadrilateral) is home to Prada, Gucci, Versace, and Armani flagship stores. Outlet malls like Serravalle offer 30-70% off.' },
      { item: 'Murano Glass', detail: 'Authentic Murano glass is made exclusively on Murano Island, Venice. Pieces come with a "Vetro Artistico Murano" trademark sticker.' },
      { item: 'Olive Oil', detail: 'Tuscan and Pugliese extra-virgin olive oils are world-class. Buy directly from producers (frantoi) for the freshest quality. Look for DOP certification.' },
      { item: 'Wine', detail: 'Chianti, Barolo, Brunello di Montalcino — buy directly from vineyards (cantine) for the best prices and exclusive vintages.' },
      { item: 'Artisan Paper', detail: 'Florence is famous for marbled paper (carta marmorizzata). Giulio Giannini e Figlio, established in 1856, is a legendary shop.' },
    ],
    bestMarkets: [
      { name: 'San Lorenzo Market', location: 'Florence', knownFor: 'Leather goods, souvenirs, local food' },
      { name: 'Mercato di Rialto', location: 'Venice', knownFor: 'Fresh produce, seafood, spices' },
      { name: 'Porta Portese', location: 'Rome', knownFor: 'Antiques, vintage clothing, curiosities (Sunday mornings)' },
      { name: 'Via Montenapoleone', location: 'Milan', knownFor: 'Luxury fashion and designer boutiques' },
      { name: 'Mercato Centrale', location: 'Florence & Rome', knownFor: 'Gourmet food hall — artisan foods, wine, cheese' },
    ],
    authenticityTips: [
      'Authentic Murano glass always has the "Vetro Artistico Murano" trademark — cheap imitations from China flood souvenir shops.',
      'Genuine Italian leather smells rich and has slight imperfections; fake leather is too uniform and smells of chemicals.',
      'DOP and IGP labels on food products guarantee protected origin and traditional production methods.',
      'Be wary of "Italian-made" labels on leather goods near tourist spots — many are actually imported.',
    ],
    bargainingAdvice: [
      'Bargaining is acceptable at outdoor markets like San Lorenzo and Porta Portese.',
      'Start at about 60-70% of the asking price and negotiate from there.',
      'Buying multiple items gives you more leverage for a discount.',
      'Bargaining is not appropriate in fixed-price shops, boutiques, or restaurants.',
    ],
    taxRefund: 'Non-EU residents can claim a VAT refund (22% tax, typically 12-15% back after fees) on purchases over 154.94 euros from participating stores. Ask for a Tax-Free form at the time of purchase and get it stamped at customs before your flight.',
    shippingTips: [
      'Poste Italiane offers international tracked shipping. Allow extra time as Italian postal service can be slower than northern Europe.',
      'For wine, use specialized wine shipping services — standard carriers may refuse alcohol.',
      'Murano glass shops often offer insured international shipping with expert packing.',
      'Consider packing olive oil in your checked luggage (double-bagged in zip-locks) to avoid shipping costs.',
    ],
  },
  {
    id: 'thailand',
    name: 'Thailand',
    flag: '\u{1F1F9}\u{1F1ED}',
    specialties: [
      { item: 'Thai Silk', detail: 'Jim Thompson is the most famous brand, but Chiang Mai\'s Night Bazaar and local weavers in Isan offer unique handwoven pieces at better prices.' },
      { item: 'Wood Carvings', detail: 'Chiang Mai is the center of Thai woodcarving — teak elephants, Buddha figures, and decorative panels. Ban Tawai village specializes in wholesale carvings.' },
      { item: 'Silver Jewelry', detail: 'Hill-tribe silver from Chiang Mai and Chiang Rai features distinctive designs. Look for .925 sterling silver stamps for quality assurance.' },
      { item: 'Spices & Curry Pastes', detail: 'Thai curry pastes, lemongrass, galangal, and dried chilies are lightweight, affordable souvenirs. Buy vacuum-sealed packages from Or Tor Kor market.' },
      { item: 'Thai Snacks', detail: 'Dried mango, coconut chips, Tom Yum flavored cashews, and crispy seaweed make excellent gifts. 7-Eleven and Big C have great selections.' },
      { item: 'Night Market Finds', detail: 'Chatuchak Weekend Market in Bangkok has over 15,000 stalls — clothing, home decor, art, vintage items, and handmade crafts at bargain prices.' },
    ],
    bestMarkets: [
      { name: 'Chatuchak Weekend Market', location: 'Bangkok', knownFor: '15,000+ stalls — everything from clothing to antiques' },
      { name: 'Or Tor Kor Market', location: 'Bangkok', knownFor: 'Premium fresh produce, spices, prepared foods' },
      { name: 'Chiang Mai Night Bazaar', location: 'Chiang Mai', knownFor: 'Hill-tribe crafts, silk, wood carvings, silver' },
      { name: 'Asiatique The Riverfront', location: 'Bangkok', knownFor: 'Riverside night market — fashion, souvenirs, dining' },
      { name: 'Walking Street Markets', location: 'Chiang Mai', knownFor: 'Sunday (Tha Phae) and Saturday (Wua Lai) — handmade goods, street food' },
    ],
    authenticityTips: [
      'Real Thai silk has a slight sheen and texture irregularities — hold it up to light; you should see a subtle color shift.',
      'Sterling silver should be stamped .925 — test with a magnet (real silver is not magnetic).',
      'Be cautious of "antiques" in tourist markets — most are skillfully made reproductions.',
      'For gemstones, only buy from reputable dealers with GIA or GIT certificates — Thailand has a notorious gem scam targeting tourists.',
    ],
    bargainingAdvice: [
      'Bargaining is expected at markets, street stalls, and tuk-tuk rides — it is part of the culture.',
      'Start at 40-50% of the asking price and aim to settle at 60-70%.',
      'Always smile and keep it friendly — aggressive bargaining is considered rude.',
      'Walk away if the price is too high — the vendor will often call you back with a lower offer.',
      'Fixed prices apply in malls, 7-Eleven, and department stores — do not bargain there.',
    ],
    taxRefund: 'Thailand offers a 7% VAT refund for tourists on purchases over 2,000 baht per store per day (minimum total 5,000 baht). Look for "VAT Refund for Tourists" signs, get a PP10 form, and claim at the airport before departure.',
    shippingTips: [
      'Thailand Post is affordable for small packages; EMS is reliable for tracked international delivery.',
      'For large wood carvings or furniture, use a freight forwarder — shops in Ban Tawai can arrange this.',
      'Vacuum-seal spices and food items to prevent customs issues and keep them fresh.',
      'Major markets like Chatuchak have packing and shipping services on-site.',
    ],
  },
  {
    id: 'france',
    name: 'France',
    flag: '\u{1F1EB}\u{1F1F7}',
    specialties: [
      { item: 'Perfume', detail: 'Grasse in Provence is the world\'s perfume capital. Visit Fragonard, Molinard, or Galimard for factory tours and discounted purchases. Paris offers Sephora and niche perfumeries.' },
      { item: 'Wine', detail: 'Bordeaux, Burgundy, Champagne, and the Rhone Valley produce some of the world\'s finest wines. Buy directly from domaines for exclusive cuvees and cellar-door prices.' },
      { item: 'Cheese', detail: 'France produces over 400 varieties of cheese. Buy from fromageries (cheese shops) — Comte, Roquefort, Camembert, and Brie are iconic. Vacuum-sealed options travel well.' },
      { item: 'Macarons', detail: 'Laduree and Pierre Herme are the most famous Parisian macaron makers. Flavors range from classic vanilla to exotic yuzu or truffle.' },
      { item: 'Fashion', detail: 'Paris is the global fashion capital — from haute couture on Avenue Montaigne to vintage finds at Marche aux Puces de Saint-Ouen, the world\'s largest flea market.' },
      { item: 'Antiques', detail: 'The Paris flea markets (Puces de Saint-Ouen), L\'Isle-sur-la-Sorgue in Provence, and village brocantes (flea markets) throughout the countryside are treasure troves.' },
    ],
    bestMarkets: [
      { name: 'Marche aux Puces de Saint-Ouen', location: 'Paris', knownFor: 'World\'s largest flea market — antiques, vintage fashion, art' },
      { name: 'Rue Cler', location: 'Paris', knownFor: 'Open-air food market — cheese, bread, pastries, charcuterie' },
      { name: 'Marche Forville', location: 'Cannes', knownFor: 'Fresh Provencal produce, flowers, local specialties' },
      { name: 'Les Puces du Canal', location: 'Lyon', knownFor: 'Antiques, vintage furniture, brocante' },
      { name: 'Marche de Noel', location: 'Strasbourg', knownFor: 'Christmas market — ornaments, mulled wine, gingerbread (Nov-Dec)' },
    ],
    authenticityTips: [
      'AOC/AOP labels on wine and cheese guarantee authentic regional products made with traditional methods.',
      'Genuine French perfume from Grasse will have the manufacturer\'s name and address on the bottle.',
      'Luxury goods near tourist areas (especially Montmartre) are often counterfeit — buy from official boutiques or department stores like Galeries Lafayette.',
      'Real Limoges porcelain is stamped on the bottom with the maker\'s mark and "Limoges France."',
    ],
    bargainingAdvice: [
      'Bargaining is acceptable at flea markets and brocantes, but not in regular shops.',
      'A polite "C\'est votre meilleur prix?" (Is this your best price?) is the standard approach.',
      'Offering 20-30% below asking price is reasonable at flea markets.',
      'Cash purchases sometimes earn a small discount from flea market vendors.',
    ],
    taxRefund: 'Non-EU residents can claim a VAT refund (20% tax, typically 12% back after fees) on purchases over 100.01 euros from a single store on the same day. Use the PABLO electronic system at airports or get manual stamps at customs.',
    shippingTips: [
      'La Poste (French postal service) offers Colissimo for reliable tracked international shipping.',
      'For wine, use specialized carriers like Wine & Spirit Shippers or ask the domaine to ship directly.',
      'Pack cheese in your carry-on wrapped in insulated bags — it will not survive in a hot cargo hold.',
      'Antique dealers at major flea markets can arrange insured international shipping for large pieces.',
    ],
  },
  {
    id: 'india',
    name: 'India',
    flag: '\u{1F1EE}\u{1F1F3}',
    specialties: [
      { item: 'Textiles & Sarees', detail: 'Banarasi silk sarees from Varanasi, Pashmina shawls from Kashmir, Rajasthani bandhani (tie-dye), and Kanchipuram silk from Tamil Nadu are world-renowned.' },
      { item: 'Spices', detail: 'Kerala is the "Spice Garden of India." Cardamom, turmeric, saffron (from Kashmir), black pepper, and custom spice blends make memorable souvenirs.' },
      { item: 'Jewelry', detail: 'Jaipur is the gem capital — Kundan and Meenakari designs are iconic. Rajasthan and Gujarat produce stunning silver jewelry. Always get a certificate for precious stones.' },
      { item: 'Handicrafts', detail: 'Blue pottery from Jaipur, Bidriware from Bidar, marble inlay from Agra, and Madhubani paintings from Bihar showcase India\'s diverse craftsmanship.' },
      { item: 'Leather', detail: 'Kolkata and Agra are centers for quality leather goods. Bags, shoes, belts, and jackets at a fraction of international prices.' },
      { item: 'Tea', detail: 'Darjeeling tea, Assam tea, and Nilgiri tea are among the world\'s finest. Buy from estate-branded shops or tea auctions for the freshest lots.' },
    ],
    bestMarkets: [
      { name: 'Chandni Chowk', location: 'Delhi', knownFor: 'Textiles, spices, jewelry, street food — Old Delhi\'s oldest market' },
      { name: 'Johari Bazaar', location: 'Jaipur', knownFor: 'Gemstones, Kundan jewelry, Meenakari work' },
      { name: 'Colaba Causeway', location: 'Mumbai', knownFor: 'Fashion, accessories, antiques, street finds' },
      { name: 'Dilli Haat', location: 'Delhi', knownFor: 'Government-run crafts bazaar — regional handicrafts from all states' },
      { name: 'Kinari Bazaar', location: 'Varanasi', knownFor: 'Banarasi silk sarees, brocades, decorative items' },
    ],
    authenticityTips: [
      'Buy Pashmina shawls only from reputable dealers — real Pashmina is feather-light and passes the "ring test" (can be pulled through a finger ring).',
      'For gemstones, insist on a certificate from a recognized gem lab (GIA, IGI, or Indian gem testing labs).',
      'Government emporiums (Cottage Emporium, state handicraft shops) guarantee authenticity and fixed prices.',
      'Real saffron dissolves slowly in warm water and turns it golden — fake saffron dissolves instantly and turns red.',
    ],
    bargainingAdvice: [
      'Bargaining is essential in bazaars and street markets — quoted prices are often 2-3x the expected final price.',
      'Start at 30-40% of the asking price and negotiate toward 50-60%.',
      'Be friendly but firm. Walk away if needed — vendors frequently call you back.',
      'In government emporiums and branded stores, prices are fixed — bargaining is not appropriate.',
      'Auto-rickshaw and taxi fares should be negotiated before you start the ride (or insist on the meter).',
    ],
    taxRefund: 'India does not currently have a tourist VAT refund scheme. However, GST (Goods and Services Tax) is included in the price. Shop at duty-free stores at international airports for tax-free purchases on departure.',
    shippingTips: [
      'India Post is very affordable. Registered post and Speed Post (EMS) are the most reliable options.',
      'For valuable items, use private couriers like DHL, FedEx, or BlueDart for tracked and insured delivery.',
      'Many carpet and handicraft shops in Jaipur and Kashmir offer international shipping — get everything in writing.',
      'Spices should be vacuum-sealed and declared properly — some countries restrict plant-based imports.',
    ],
  },
]

const GENERAL_TIPS = {
  spotFakes: [
    'Research the product before you buy — know what real leather, silk, gemstones, and branded goods look and feel like.',
    'If the price seems too good to be true, it probably is. Luxury goods at 90% off are almost always counterfeit.',
    'Check labels, stamps, and certifications — authentic products have proper branding, serial numbers, and origin marks.',
    'Buy from authorized retailers, government emporiums, or recommended shops rather than random street vendors.',
    'For electronics, check model numbers against the manufacturer\'s website to ensure the product exists.',
    'Gemstones should always come with a certificate from a recognized gemological institute (GIA, GIT, IGI).',
  ],
  customsLimits: [
    'Most countries allow duty-free goods up to a certain value (typically $800 USD for US residents, 430 EUR for EU residents).',
    'Alcohol and tobacco have strict quantity limits — usually 1-2 liters of spirits and 200 cigarettes.',
    'Some items are prohibited entirely: ivory, certain animal products, endangered plant species, and counterfeit goods.',
    'Antiques may require export permits — check the country\'s laws before purchasing items over 100 years old.',
    'Food items (fresh produce, meat, dairy) are often restricted or banned at customs. Packaged, sealed items are safer.',
    'Always declare goods over the duty-free limit to avoid fines or confiscation.',
  ],
  packingFragile: [
    'Wrap each fragile item individually in bubble wrap or clothing before placing it in your luggage.',
    'Use hard-sided suitcases for delicate purchases like ceramics, glass, and bottles.',
    'Place fragile items in the center of your suitcase, surrounded by soft items on all sides.',
    'For bottles (wine, olive oil, perfume), use padded wine bottle bags and place them in zip-lock bags in case of leaks.',
    'Consider buying a small carry-on specifically for fragile souvenirs — overhead bins are safer than checked luggage.',
    'Ask shops to double-box items with padding. Many tourist-facing shops are experienced at packing for travel.',
    'Take photos of fragile purchases and keep receipts for insurance claims if damage occurs.',
  ],
}

export default function ShoppingGuidePage() {
  const [selectedCountry, setSelectedCountry] = useState<string>('')

  const countriesToShow = useMemo(() => {
    if (selectedCountry) return COUNTRY_SHOPPING.filter((c) => c.id === selectedCountry)
    return COUNTRY_SHOPPING
  }, [selectedCountry])

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Shopping Guide</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            What to buy, where to buy it, and how to get the best deals. Local specialties, market guides, and authenticity tips for every destination.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
        {/* Country Filter */}
        <div>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
          >
            <option value="">All Countries</option>
            {COUNTRY_SHOPPING.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Per-Country Sections */}
        {countriesToShow.map((country) => (
          <section key={country.id} className="space-y-8">
            <h2 className="font-heading text-3xl font-bold text-[#0F172A]">
              <span className="mr-2">{country.flag}</span>{country.name}
            </h2>

            {/* Specialties */}
            <div>
              <h3 className="font-heading text-xl font-semibold text-[#0F172A] mb-3">What to Buy</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {country.specialties.map((s) => (
                  <div key={s.item} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                    <h4 className="font-heading font-semibold text-[#0F172A] mb-2">{s.item}</h4>
                    <p className="text-sm text-[#0F172A]/70 leading-relaxed">{s.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Markets */}
            <div>
              <h3 className="font-heading text-xl font-semibold text-[#0F172A] mb-3">Best Markets & Shopping Areas</h3>
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden text-sm">
                  <thead>
                    <tr className="bg-[#0EA5E9]/5 border-b border-[#E2E8F0]">
                      <th className="text-left px-4 py-3 font-semibold text-[#0F172A]">Market</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#0F172A]">Location</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#0F172A]">Known For</th>
                    </tr>
                  </thead>
                  <tbody>
                    {country.bestMarkets.map((m, i) => (
                      <tr key={m.name} className={i % 2 === 1 ? 'bg-[#FAFBFC]' : ''}>
                        <td className="px-4 py-3 font-medium text-[#0F172A]">{m.name}</td>
                        <td className="px-4 py-3 text-[#0F172A]/70">{m.location}</td>
                        <td className="px-4 py-3 text-[#0F172A]/70">{m.knownFor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Authenticity Tips */}
            <div>
              <h3 className="font-heading text-xl font-semibold text-[#0F172A] mb-3">Authenticity Tips</h3>
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                <ul className="space-y-2">
                  {country.authenticityTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#0F172A]/80">
                      <span className="text-[#0EA5E9] font-bold mt-0.5 shrink-0">&bull;</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bargaining Advice */}
            <div>
              <h3 className="font-heading text-xl font-semibold text-[#0F172A] mb-3">Bargaining Advice</h3>
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                <ul className="space-y-2">
                  {country.bargainingAdvice.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#0F172A]/80">
                      <span className="text-[#F59E0B] font-bold mt-0.5 shrink-0">&bull;</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tax Refund */}
            <div>
              <h3 className="font-heading text-xl font-semibold text-[#0F172A] mb-3">Tax Refund Info</h3>
              <div className="bg-[#0EA5E9]/5 rounded-xl border border-[#0EA5E9]/20 p-5">
                <p className="text-sm text-[#0F172A]/80 leading-relaxed">{country.taxRefund}</p>
              </div>
            </div>

            {/* Shipping Tips */}
            <div>
              <h3 className="font-heading text-xl font-semibold text-[#0F172A] mb-3">Shipping Tips</h3>
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                <ul className="space-y-2">
                  {country.shippingTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#0F172A]/80">
                      <span className="text-[#0EA5E9] font-bold mt-0.5 shrink-0">&bull;</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}

        {/* General Tips */}
        <section className="space-y-8">
          <h2 className="font-heading text-3xl font-bold text-[#0F172A]">General Shopping Tips</h2>

          {/* How to Spot Fakes */}
          <div>
            <h3 className="font-heading text-xl font-semibold text-[#0F172A] mb-3">How to Spot Fakes</h3>
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
              <ul className="space-y-2">
                {GENERAL_TIPS.spotFakes.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#0F172A]/80">
                    <span className="text-red-500 font-bold mt-0.5 shrink-0">&bull;</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Customs Limits */}
          <div>
            <h3 className="font-heading text-xl font-semibold text-[#0F172A] mb-3">Customs Limits & Regulations</h3>
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
              <ul className="space-y-2">
                {GENERAL_TIPS.customsLimits.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#0F172A]/80">
                    <span className="text-[#F59E0B] font-bold mt-0.5 shrink-0">&bull;</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Packing Fragile Items */}
          <div>
            <h3 className="font-heading text-xl font-semibold text-[#0F172A] mb-3">Packing Fragile Items</h3>
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
              <ul className="space-y-2">
                {GENERAL_TIPS.packingFragile.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#0F172A]/80">
                    <span className="text-[#0EA5E9] font-bold mt-0.5 shrink-0">&bull;</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
