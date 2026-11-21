/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
// @ts-nocheck
'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Lightbulb,
  Shuffle,
  Copy,
  Check,
  Share2,
  ImageIcon,
  Calendar,
  Sparkles,
  Globe,
  History,
  UtensilsCrossed,
  Users,
  TreePine,
  Languages,
  Filter,
  X,
} from 'lucide-react';

// ─── FACT DATA ─────────────────────────────────────────────

interface Fact {
  id: number;
  category: Category;
  text: string;
  country: string;
  flag: string;
  source: string;
}

type Category = 'Geography' | 'History' | 'Food' | 'Culture' | 'Nature' | 'Money & Language';

const CATEGORY_ICONS: Record<Category, any> = {
  Geography: Globe,
  History: History,
  Food: UtensilsCrossed,
  Culture: Users,
  Nature: TreePine,
  'Money & Language': Languages,
};

const CATEGORY_COLORS: Record<Category, { bg: string; text: string; border: string }> = {
  Geography: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  History: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  Food: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  Culture: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Nature: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  'Money & Language': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
};

const FACTS: Fact[] = [
  // Geography
  { id: 1, category: 'Geography', text: 'Russia spans 11 time zones — when it is morning in Kaliningrad, it is already evening in Kamchatka.', country: 'Russia', flag: '\u{1F1F7}\u{1F1FA}', source: 'National Geographic' },
  { id: 2, category: 'Geography', text: 'Canada has more lakes than the rest of the world combined — over 60% of all lakes on Earth.', country: 'Canada', flag: '\u{1F1E8}\u{1F1E6}', source: 'Natural Resources Canada' },
  { id: 3, category: 'Geography', text: 'Vatican City is smaller than a typical golf course at just 0.44 km\u00B2, making it the world\'s smallest country.', country: 'Vatican City', flag: '\u{1F1FB}\u{1F1E6}', source: 'World Atlas' },
  { id: 4, category: 'Geography', text: 'The shortest commercial flight is just 1.5 minutes — from Westray to Papa Westray in Scotland.', country: 'Scotland', flag: '\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}', source: 'Loganair Airlines' },
  { id: 5, category: 'Geography', text: 'Africa is bigger than the USA, China, India, Japan, and all of Europe combined.', country: 'Africa', flag: '\u{1F30D}', source: 'Real Africa Size Project' },
  { id: 6, category: 'Geography', text: 'Istanbul is the only city in the world that straddles two continents — Europe and Asia.', country: 'Turkey', flag: '\u{1F1F9}\u{1F1F7}', source: 'World Atlas' },
  { id: 7, category: 'Geography', text: 'Australia is wider than the Moon — 4,000 km across vs the Moon\'s 3,400 km diameter.', country: 'Australia', flag: '\u{1F1E6}\u{1F1FA}', source: 'NASA' },
  { id: 8, category: 'Geography', text: 'Chile is so long and narrow that if you placed it on Europe, it would stretch from Portugal to Russia.', country: 'Chile', flag: '\u{1F1E8}\u{1F1F1}', source: 'Geographic comparison' },
  { id: 9, category: 'Geography', text: 'The Pacific Ocean is so vast it contains a point (Point Nemo) farther from any land than the International Space Station orbits above Earth.', country: 'Pacific Ocean', flag: '\u{1F30A}', source: 'NOAA' },
  { id: 10, category: 'Geography', text: 'Mount Everest grows about 4mm taller every year due to tectonic plate movement.', country: 'Nepal', flag: '\u{1F1F3}\u{1F1F5}', source: 'National Geographic' },

  // History
  { id: 11, category: 'History', text: 'The Great Wall of China is NOT visible from space with the naked eye — this is one of the most common travel myths.', country: 'China', flag: '\u{1F1E8}\u{1F1F3}', source: 'NASA / ESA astronauts' },
  { id: 12, category: 'History', text: 'Iceland has no army, navy, or air force — and has been independent since 1944.', country: 'Iceland', flag: '\u{1F1EE}\u{1F1F8}', source: 'Icelandic government' },
  { id: 13, category: 'History', text: 'Oxford University is older than the Aztec Empire — Oxford was founded in 1096, while the Aztecs started in 1428.', country: 'United Kingdom', flag: '\u{1F1EC}\u{1F1E7}', source: 'University of Oxford' },
  { id: 14, category: 'History', text: 'The Eiffel Tower was meant to be temporary — built for the 1889 World\'s Fair and saved only because of its radio antenna.', country: 'France', flag: '\u{1F1EB}\u{1F1F7}', source: 'Tour Eiffel official' },
  { id: 15, category: 'History', text: 'Machu Picchu was never found by Spanish conquistadors — it remained hidden until Hiram Bingham rediscovered it in 1911.', country: 'Peru', flag: '\u{1F1F5}\u{1F1EA}', source: 'National Geographic' },
  { id: 16, category: 'History', text: 'The Colosseum in Rome could fill and drain water to simulate naval battles — a spectacle called naumachia.', country: 'Italy', flag: '\u{1F1EE}\u{1F1F9}', source: 'Smithsonian' },
  { id: 17, category: 'History', text: 'Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid of Giza.', country: 'Egypt', flag: '\u{1F1EA}\u{1F1EC}', source: 'Historical timeline' },
  { id: 18, category: 'History', text: 'The ancient city of Petra in Jordan was lost to Western civilization for nearly 600 years until rediscovered in 1812.', country: 'Jordan', flag: '\u{1F1EF}\u{1F1F4}', source: 'UNESCO' },
  { id: 19, category: 'History', text: 'Thailand is the only Southeast Asian country that was never colonized by a European power.', country: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}', source: 'Thai historical records' },
  { id: 20, category: 'History', text: 'The Library of Alexandria once held the largest collection of knowledge in the ancient world — estimated at 400,000 scrolls.', country: 'Egypt', flag: '\u{1F1EA}\u{1F1EC}', source: 'Ancient history records' },

  // Food
  { id: 21, category: 'Food', text: 'In Japan, it is polite to slurp noodles loudly — it shows you are enjoying the food and enhances the flavor.', country: 'Japan', flag: '\u{1F1EF}\u{1F1F5}', source: 'Japanese dining etiquette' },
  { id: 22, category: 'Food', text: 'France has a different cheese for every day of the year — with over 1,600 varieties and counting.', country: 'France', flag: '\u{1F1EB}\u{1F1F7}', source: 'CNIEL (French Dairy Board)' },
  { id: 23, category: 'Food', text: 'Thailand has the world\'s largest meal variety — over 5,000 distinct dishes in its culinary repertoire.', country: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}', source: 'Thai culinary records' },
  { id: 24, category: 'Food', text: 'Indian food varies so much that people 200 km apart may eat completely different cuisines, spices, and staples.', country: 'India', flag: '\u{1F1EE}\u{1F1F3}', source: 'Indian culinary research' },
  { id: 25, category: 'Food', text: 'Italy has different pasta shapes for different sauces — using the wrong one is considered a serious faux pas.', country: 'Italy', flag: '\u{1F1EE}\u{1F1F9}', source: 'Italian culinary tradition' },
  { id: 26, category: 'Food', text: 'In Ethiopia, sharing food from a single plate is a sign of friendship — a tradition called "gursha" involves hand-feeding each other.', country: 'Ethiopia', flag: '\u{1F1EA}\u{1F1F9}', source: 'Ethiopian culture' },
  { id: 27, category: 'Food', text: 'Mexico has 59 varieties of corn — the cradle of corn domestication that began over 9,000 years ago.', country: 'Mexico', flag: '\u{1F1F2}\u{1F1FD}', source: 'CIMMYT research' },
  { id: 28, category: 'Food', text: 'In South Korea, it is rude to start eating before the eldest person at the table takes the first bite.', country: 'South Korea', flag: '\u{1F1F0}\u{1F1F7}', source: 'Korean dining customs' },
  { id: 29, category: 'Food', text: 'The world\'s most expensive spice is saffron — it takes 75,000 flowers to make one pound, mostly grown in Iran.', country: 'Iran', flag: '\u{1F1EE}\u{1F1F7}', source: 'Spice trade records' },
  { id: 30, category: 'Food', text: 'Vietnamese pho takes 12-24 hours to prepare — the broth is simmered with charred onions, ginger, and beef bones.', country: 'Vietnam', flag: '\u{1F1FB}\u{1F1F3}', source: 'Vietnamese culinary tradition' },

  // Culture
  { id: 31, category: 'Culture', text: 'In Japan, sleeping on the job (inemuri) is seen as a sign of hard work — you must be so dedicated you exhausted yourself.', country: 'Japan', flag: '\u{1F1EF}\u{1F1F5}', source: 'Japanese workplace culture' },
  { id: 32, category: 'Culture', text: 'Tipping is considered rude in Japan, China, and South Korea — it can imply the service was not good enough on its own.', country: 'Japan', flag: '\u{1F1EF}\u{1F1F5}', source: 'East Asian etiquette' },
  { id: 33, category: 'Culture', text: 'In India, shaking your head side-to-side can mean "yes" — the famous Indian head bobble that confuses tourists.', country: 'India', flag: '\u{1F1EE}\u{1F1F3}', source: 'Indian cultural studies' },
  { id: 34, category: 'Culture', text: 'The word "queue" in British English comes from the French word for "tail" — and the British take queuing very seriously.', country: 'United Kingdom', flag: '\u{1F1EC}\u{1F1E7}', source: 'Oxford English Dictionary' },
  { id: 35, category: 'Culture', text: 'In Thailand, the head is considered the most sacred part of the body — never touch anyone\'s head, even a child\'s.', country: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}', source: 'Thai cultural customs' },
  { id: 36, category: 'Culture', text: 'In Finland, there are more saunas than cars — about 3.3 million saunas for a population of 5.5 million people.', country: 'Finland', flag: '\u{1F1EB}\u{1F1EE}', source: 'Finnish Sauna Society' },
  { id: 37, category: 'Culture', text: 'In Morocco, haggling is expected and not haggling can actually be seen as rude — it is a social ritual.', country: 'Morocco', flag: '\u{1F1F2}\u{1F1E6}', source: 'Moroccan market culture' },
  { id: 38, category: 'Culture', text: 'In Brazil, the "OK" hand gesture (thumb and index finger in a circle) is considered offensive — avoid using it.', country: 'Brazil', flag: '\u{1F1E7}\u{1F1F7}', source: 'Brazilian cultural guide' },
  { id: 39, category: 'Culture', text: 'In Greece, saying "no" is done by tilting the head upward slightly — a subtle nod that can be mistaken for "yes."', country: 'Greece', flag: '\u{1F1EC}\u{1F1F7}', source: 'Greek body language' },
  { id: 40, category: 'Culture', text: 'In Spain, dinner before 9 PM is almost unheard of — many restaurants do not even open until 8:30 PM.', country: 'Spain', flag: '\u{1F1EA}\u{1F1F8}', source: 'Spanish meal customs' },

  // Nature
  { id: 41, category: 'Nature', text: 'Iceland has no mosquitoes — one of the only inhabited places on Earth completely free of them.', country: 'Iceland', flag: '\u{1F1EE}\u{1F1F8}', source: 'University of Iceland' },
  { id: 42, category: 'Nature', text: 'The Dead Sea is so salty (33.7% salinity) that you float without trying — no effort required to stay on the surface.', country: 'Israel / Jordan', flag: '\u{1F1EE}\u{1F1F1}', source: 'Geological surveys' },
  { id: 43, category: 'Nature', text: 'New Zealand has more sheep than people — about 26 million sheep vs 5 million humans.', country: 'New Zealand', flag: '\u{1F1F3}\u{1F1FF}', source: 'Stats NZ' },
  { id: 44, category: 'Nature', text: 'The Amazon Rainforest produces about 20% of the world\'s oxygen — earning it the nickname "lungs of the Earth."', country: 'Brazil', flag: '\u{1F1E7}\u{1F1F7}', source: 'WWF' },
  { id: 45, category: 'Nature', text: 'Norway has fjords so deep that some are deeper than the surrounding sea — Sognefjorden plunges 1,308 meters.', country: 'Norway', flag: '\u{1F1F3}\u{1F1F4}', source: 'Norwegian geological survey' },
  { id: 46, category: 'Nature', text: 'Costa Rica contains 5% of the world\'s biodiversity despite being only 0.03% of the planet\'s surface area.', country: 'Costa Rica', flag: '\u{1F1E8}\u{1F1F7}', source: 'Costa Rica conservation' },
  { id: 47, category: 'Nature', text: 'Japan\'s cherry blossom season (sakura) lasts only 1-2 weeks — the Japanese celebrate its fleeting beauty as a metaphor for life.', country: 'Japan', flag: '\u{1F1EF}\u{1F1F5}', source: 'Japan Meteorological Agency' },
  { id: 48, category: 'Nature', text: 'The Northern Lights can be seen in Norway, Iceland, Finland, Sweden, and Canada — caused by solar particles hitting Earth\'s atmosphere.', country: 'Norway', flag: '\u{1F1F3}\u{1F1F4}', source: 'NASA' },
  { id: 49, category: 'Nature', text: 'Australia has over 10,000 beaches — you could visit a new beach every day for more than 27 years.', country: 'Australia', flag: '\u{1F1E6}\u{1F1FA}', source: 'Geoscience Australia' },
  { id: 50, category: 'Nature', text: 'The Sahara Desert is almost the same size as the entire United States — about 9.2 million km\u00B2.', country: 'Africa', flag: '\u{1F30D}', source: 'National Geographic' },

  // Money & Language
  { id: 51, category: 'Money & Language', text: 'The most expensive city for tourists is Zurich, Switzerland — where a simple lunch can cost $30+.', country: 'Switzerland', flag: '\u{1F1E8}\u{1F1ED}', source: 'Mercer cost of living index' },
  { id: 52, category: 'Money & Language', text: 'Indonesia has over 700 languages — making it one of the most linguistically diverse nations on Earth.', country: 'Indonesia', flag: '\u{1F1EE}\u{1F1E9}', source: 'Ethnologue' },
  { id: 53, category: 'Money & Language', text: 'Papua New Guinea has 840 languages — more than any other country, with many spoken by fewer than 1,000 people.', country: 'Papua New Guinea', flag: '\u{1F1F5}\u{1F1EC}', source: 'Ethnologue' },
  { id: 54, category: 'Money & Language', text: 'In many Southeast Asian countries, you can live comfortably on $30-50 per day — including food, lodging, and transport.', country: 'Southeast Asia', flag: '\u{1F30F}', source: 'Budget travel surveys' },
  { id: 55, category: 'Money & Language', text: 'South Africa has 11 official languages — the most of any country in the world.', country: 'South Africa', flag: '\u{1F1FF}\u{1F1E6}', source: 'South African constitution' },
  { id: 56, category: 'Money & Language', text: 'The Japanese language has 3 writing systems used simultaneously — Hiragana, Katakana, and Kanji.', country: 'Japan', flag: '\u{1F1EF}\u{1F1F5}', source: 'Japanese linguistics' },
  { id: 57, category: 'Money & Language', text: 'The Euro is used in 20 countries — making it the easiest currency for traveling across Europe.', country: 'Europe', flag: '\u{1F1EA}\u{1F1FA}', source: 'European Central Bank' },
  { id: 58, category: 'Money & Language', text: 'Bolivian currency (Boliviano) is one of the cheapest for travelers — $1 USD gets you about 6.9 BOB.', country: 'Bolivia', flag: '\u{1F1E7}\u{1F1F4}', source: 'Exchange rate data' },
];

const ALL_CATEGORIES: Category[] = ['Geography', 'History', 'Food', 'Culture', 'Nature', 'Money & Language'];

// ─── COMPONENT ─────────────────────────────────────────────

export default function DidYouKnowPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [factsRead, setFactsRead] = useState(0);
  const [showDailyFact, setShowDailyFact] = useState(true);
  const [cardImageId, setCardImageId] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Daily fact based on date
  const dailyFact = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    return FACTS[dayOfYear % FACTS.length];
  }, []);

  // Track facts read
  useEffect(() => {
    const stored = sessionStorage.getItem('wt-facts-read');
    if (stored) setFactsRead(parseInt(stored, 10));
  }, []);

  const markRead = useCallback(
    (count: number) => {
      const newCount = factsRead + count;
      setFactsRead(newCount);
      sessionStorage.setItem('wt-facts-read', String(newCount));
    },
    [factsRead]
  );

  const filteredFacts = useMemo(
    () => (selectedCategory === 'All' ? FACTS : FACTS.filter((f) => f.category === selectedCategory)),
    [selectedCategory]
  );

  const [randomFact, setRandomFact] = useState<Fact | null>(null);

  const getRandomFact = useCallback(() => {
    const pool = filteredFacts;
    const fact = pool[Math.floor(Math.random() * pool.length)];
    setRandomFact(fact);
    markRead(1);
  }, [filteredFacts, markRead]);

  const copyFact = useCallback(async (fact: Fact) => {
    const text = `Did you know? ${fact.text} ${fact.flag}\n\nLearn more at zaxise.com/did-you-know`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(fact.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedId(fact.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  const shareAsImage = useCallback((factId: number) => {
    setCardImageId(factId);
  }, []);

  // Group filtered facts by category
  const grouped = useMemo(() => {
    const groups: Record<string, Fact[]> = {};
    for (const fact of filteredFacts) {
      if (!groups[fact.category]) groups[fact.category] = [];
      groups[fact.category].push(fact);
    }
    return groups;
  }, [filteredFacts]);

  return (
    <main className="min-h-screen bg-[#FAFBFC]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0EA5E9] via-[#0284C7] to-[#0369A1] text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-20">
          <nav className="flex items-center gap-2 text-white/70 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Did You Know?</span>
          </nav>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-[#F59E0B] rounded-xl">
              <Lightbulb className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight">
              Did You Know?
            </h1>
          </div>
          <p className="text-xl text-white/80 mt-2 max-w-2xl">
            Fascinating travel facts that will change how you see the world. Learn something new, then share it with friends.
          </p>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span>{FACTS.length} facts</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2 text-sm">
              <Calendar className="w-4 h-4 text-[#F59E0B]" />
              <span>New daily fact every day</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2 text-sm">
              <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
              <span>You&apos;ve read {factsRead} facts today</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Daily Fact */}
        {showDailyFact && (
          <div className="relative mb-10 bg-gradient-to-r from-[#F59E0B]/10 to-[#0EA5E9]/10 border border-[#F59E0B]/30 rounded-2xl p-6 sm:p-8">
            <button
              onClick={() => setShowDailyFact(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-[#F59E0B]" />
              <span className="text-sm font-semibold text-[#F59E0B] uppercase tracking-wide">
                Today&apos;s Fact &mdash; {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-serif font-bold text-[#0F172A] leading-relaxed">
              {dailyFact.flag} {dailyFact.text}
            </p>
            <div className="flex items-center gap-4 mt-4">
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[dailyFact.category].bg} ${CATEGORY_COLORS[dailyFact.category].text}`}>
                {dailyFact.category}
              </span>
              <span className="text-xs text-slate-500">Source: {dailyFact.source}</span>
              <button
                onClick={() => copyFact(dailyFact)}
                className="ml-auto flex items-center gap-1.5 text-sm text-[#0EA5E9] hover:text-[#0284C7] font-medium transition-colors"
              >
                {copiedId === dailyFact.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedId === dailyFact.id ? 'Copied!' : 'Share this fact'}
              </button>
            </div>
          </div>
        )}

        {/* Random Fact Button + Category Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <button
            onClick={getRandomFact}
            className="flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <Shuffle className="w-4 h-4" />
            Random Fact
          </button>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'All'
                  ? 'bg-[#0EA5E9] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-[#0EA5E9] hover:text-[#0EA5E9]'
              }`}
            >
              All
            </button>
            {ALL_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#0EA5E9] text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-[#0EA5E9] hover:text-[#0EA5E9]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Random Fact Card */}
        {randomFact && (
          <div className="mb-10 bg-white border-2 border-[#0EA5E9]/30 rounded-2xl p-6 shadow-lg shadow-[#0EA5E9]/5 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Shuffle className="w-4 h-4 text-[#0EA5E9]" />
              <span className="text-sm font-semibold text-[#0EA5E9] uppercase tracking-wide">Random Fact</span>
            </div>
            <p className="text-xl font-serif font-bold text-[#0F172A] leading-relaxed">
              {randomFact.flag} {randomFact.text}
            </p>
            <div className="flex items-center gap-4 mt-4">
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[randomFact.category].bg} ${CATEGORY_COLORS[randomFact.category].text}`}>
                {randomFact.category}
              </span>
              <span className="text-xs text-slate-500">{randomFact.country}</span>
              <button
                onClick={() => copyFact(randomFact)}
                className="ml-auto flex items-center gap-1.5 text-sm text-[#0EA5E9] hover:text-[#0284C7] font-medium transition-colors"
              >
                {copiedId === randomFact.id ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {copiedId === randomFact.id ? 'Copied!' : 'Share'}
              </button>
            </div>
          </div>
        )}

        {/* Facts Grid by Category */}
        {Object.entries(grouped).map(([category, facts]) => {
          const cat = category as Category;
          const Icon = CATEGORY_ICONS[cat];
          const colors = CATEGORY_COLORS[cat];
          return (
            <section key={category} className="mb-12">
              <div className="flex items-center gap-2.5 mb-5">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#0F172A]">{category}</h2>
                <span className="text-sm text-slate-400 ml-1">({facts.length})</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {facts.map((fact) => (
                  <div
                    key={fact.id}
                    className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-[#0EA5E9]/40 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0 mt-0.5">{fact.flag}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#0F172A] font-medium leading-relaxed">
                          {fact.text}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                            {fact.country}
                          </span>
                          <span className="text-xs text-slate-400">{fact.source}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => copyFact(fact)}
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0EA5E9] font-medium transition-colors"
                      >
                        {copiedId === fact.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-500" />
                            <span className="text-green-500">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Share this fact
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => shareAsImage(fact.id)}
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#F59E0B] font-medium transition-colors ml-auto"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        Share as card
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* Card Image Modal */}
        {cardImageId !== null && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setCardImageId(null)}>
            <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setCardImageId(null)} className="absolute -top-3 -right-3 bg-white rounded-full p-1.5 shadow-lg z-10 hover:bg-slate-50">
                <X className="w-5 h-5 text-slate-600" />
              </button>
              <div ref={cardRef} className="bg-gradient-to-br from-[#0EA5E9] to-[#0369A1] rounded-2xl p-8 text-white shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-[#F59E0B]" />
                  <span className="font-semibold text-[#F59E0B] text-sm uppercase tracking-wide">Did You Know?</span>
                </div>
                <p className="text-xl font-serif font-bold leading-relaxed mb-6">
                  {FACTS.find((f) => f.id === cardImageId)?.flag}{' '}
                  {FACTS.find((f) => f.id === cardImageId)?.text}
                </p>
                <div className="flex items-center justify-between border-t border-white/20 pt-4">
                  <span className="text-sm text-white/70">
                    {FACTS.find((f) => f.id === cardImageId)?.country}
                  </span>
                  <span className="text-sm font-semibold text-[#F59E0B]">zaxise.com</span>
                </div>
              </div>
              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={() => {
                    const fact = FACTS.find((f) => f.id === cardImageId);
                    if (fact) copyFact(fact);
                  }}
                  className="flex items-center gap-2 bg-white text-[#0F172A] font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-100 transition-colors shadow-lg"
                >
                  <Copy className="w-4 h-4" />
                  Copy Text
                </button>
                <p className="text-white/60 text-sm self-center">Screenshot this card to share!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
