'use client';

import { useState } from 'react';
import { COUNTRIES } from '@/data/travel/destinations';

/* ───────── types ───────── */
type PersonalityType = 'culture' | 'adventure' | 'visual' | 'food' | 'wanderer';

interface Choice {
  emoji: string;
  text: string;
  type: PersonalityType;
}

interface Question {
  question: string;
  choices: Choice[];
}

interface PersonalityResult {
  name: string;
  emoji: string;
  description: string;
  countryIds: string[];
  itineraryStyle: string;
  experienceIds: string[];
}

/* ───────── quiz data ───────── */
const QUESTIONS: Question[] = [
  {
    question: 'Your ideal morning starts with...',
    choices: [
      { emoji: '☕', text: 'A local cafe, watching the world go by', type: 'culture' },
      { emoji: '🏃', text: 'Lacing up shoes for a sunrise hike', type: 'adventure' },
      { emoji: '📸', text: 'Finding the perfect photo spot before crowds arrive', type: 'visual' },
      { emoji: '🍳', text: 'A cooking class learning local recipes', type: 'food' },
    ],
  },
  {
    question: 'You have one free day. You choose...',
    choices: [
      { emoji: '🏛️', text: 'A museum you\'ve always wanted to see', type: 'culture' },
      { emoji: '🤿', text: 'Diving, kayaking, or rock climbing', type: 'adventure' },
      { emoji: '🚶', text: 'Wandering with no plan, getting lost in back streets', type: 'wanderer' },
      { emoji: '🍜', text: 'A food tour through the old quarter', type: 'food' },
    ],
  },
  {
    question: 'Your travel budget goes mostly to...',
    choices: [
      { emoji: '🎟️', text: 'Experiences and entrance fees', type: 'culture' },
      { emoji: '⛰️', text: 'Gear and guided excursions', type: 'adventure' },
      { emoji: '📷', text: 'The best viewpoint, even if it means a long hike', type: 'visual' },
      { emoji: '🍕', text: 'Eating at the places locals recommend', type: 'food' },
    ],
  },
  {
    question: 'The souvenir you bring home is...',
    choices: [
      { emoji: '📚', text: 'A book about local history', type: 'culture' },
      { emoji: '🧗', text: 'A scar and a great story', type: 'adventure' },
      { emoji: '🖼️', text: 'A framed photo you took yourself', type: 'visual' },
      { emoji: '🌶️', text: 'Local spices or ingredients', type: 'food' },
    ],
  },
  {
    question: 'Your travel disaster is...',
    choices: [
      { emoji: '🚫', text: 'A closed museum', type: 'culture' },
      { emoji: '🌧️', text: 'Rain canceling an outdoor activity', type: 'adventure' },
      { emoji: '😤', text: 'Bad light for photos', type: 'visual' },
      { emoji: '🤢', text: 'Food poisoning', type: 'food' },
    ],
  },
  {
    question: 'You judge a destination by its...',
    choices: [
      { emoji: '📖', text: 'History and heritage', type: 'culture' },
      { emoji: '🏔️', text: 'Natural landscapes', type: 'adventure' },
      { emoji: '🌅', text: 'Beauty and aesthetics', type: 'visual' },
      { emoji: '🍽️', text: 'Street food scene', type: 'food' },
    ],
  },
  {
    question: 'Your dream trip is...',
    choices: [
      { emoji: '🇯🇵', text: 'Japan — temples, bullet trains, tradition meets future', type: 'culture' },
      { emoji: '🇳🇿', text: 'New Zealand — bungee, fjords, pure nature', type: 'adventure' },
      { emoji: '🇮🇹', text: 'Italy — Tuscany hills, Venice canals, Renaissance art', type: 'visual' },
      { emoji: '🇹🇭', text: 'Thailand — night markets, cooking classes, street food heaven', type: 'food' },
    ],
  },
  {
    question: 'People describe your travel style as...',
    choices: [
      { emoji: '🧠', text: 'Thoughtful and well-researched', type: 'culture' },
      { emoji: '💪', text: 'Fearless and energetic', type: 'adventure' },
      { emoji: '✨', text: 'Aesthetic and detail-oriented', type: 'visual' },
      { emoji: '😋', text: 'Led entirely by your stomach', type: 'food' },
    ],
  },
];

const PERSONALITIES: Record<PersonalityType, PersonalityResult> = {
  culture: {
    name: 'Culture Explorer',
    emoji: '🏛️',
    description:
      'You travel to understand, not just to see. Museums, temples, and historical sites are your playgrounds. You read about a place before you arrive and notice the details others walk past. Your trips are journeys through time.',
    countryIds: ['japan', 'italy', 'france'],
    itineraryStyle: 'No Rush — you need time to absorb every layer of history and meaning',
    experienceIds: ['sensoji', 'fushimi-inari', 'colosseum'],
  },
  adventure: {
    name: 'Adventure Seeker',
    emoji: '⛰️',
    description:
      'Adrenaline is your compass. You measure trips not in photos taken but in heart rates hit. If there\'s a mountain to climb, a river to raft, or a cliff to jump off, you\'re already there. Comfort zones are just starting lines.',
    countryIds: ['thailand', 'japan', 'india'],
    itineraryStyle: 'Rush — pack in as many activities as daylight allows',
    experienceIds: ['elephant-nature-park', 'arashiyama-bamboo', 'doi-suthep'],
  },
  visual: {
    name: 'Visual Storyteller',
    emoji: '📸',
    description:
      'You see the world in frames and golden hours. Every trip is a visual narrative — the play of light on ancient stone, colors in a market, the curve of a coastline. You don\'t just visit places; you capture their soul.',
    countryIds: ['italy', 'france', 'japan'],
    itineraryStyle: 'No Rush — you need to wait for the perfect light and the right moment',
    experienceIds: ['shibuya-crossing', 'grand-canal', 'eiffel-tower'],
  },
  food: {
    name: 'Food Pilgrim',
    emoji: '🍕',
    description:
      'For you, food IS the destination. Street stalls, hole-in-the-wall joints, and grandmother-recipe restaurants are your temples. You plan itineraries around meals, and your best travel stories start with "So I found this tiny place..."',
    countryIds: ['thailand', 'italy', 'india'],
    itineraryStyle: 'No Rush — you can\'t rush a long lunch or a cooking class',
    experienceIds: ['tsukiji-outer-market', 'cm-night-bazaar', 'chandni-chowk'],
  },
  wanderer: {
    name: 'Wanderer',
    emoji: '🧭',
    description:
      'You\'re the balanced traveler who resists categories. One day you\'re in a museum, the next you\'re cliff-jumping, and by evening you\'re photographing street food. You travel by instinct, and your best days are the unplanned ones.',
    countryIds: ['japan', 'thailand', 'france'],
    itineraryStyle: 'A mix of both — some structure, plenty of room for spontaneity',
    experienceIds: ['gion', 'chatuchak-market', 'montmartre'],
  },
};

/* ───────── helpers ───────── */
function getPersonality(answers: (PersonalityType | null)[]): PersonalityType {
  const counts: Record<PersonalityType, number> = { culture: 0, adventure: 0, visual: 0, food: 0, wanderer: 0 };
  answers.forEach((a) => { if (a) counts[a]++; });
  const max = Math.max(...Object.values(counts));
  const winners = (Object.entries(counts) as [PersonalityType, number][]).filter(([, v]) => v === max);
  if (winners.length > 1) return 'wanderer';
  return winners[0][0];
}

function findAttractionById(id: string) {
  for (const country of COUNTRIES) {
    for (const state of country.states) {
      for (const city of state.cities) {
        const found = city.attractions.find((a) => a.id === id);
        if (found) return { ...found, cityName: city.name, countryName: country.name };
      }
    }
  }
  return null;
}

function findCountryById(id: string) {
  return COUNTRIES.find((c) => c.id === id);
}

/* ───────── component ───────── */
export default function TravelPersonalityPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(PersonalityType | null)[]>(Array(8).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);

  const progress = answers.filter((a) => a !== null).length;
  const result = showResult ? PERSONALITIES[getPersonality(answers)] : null;

  function handleSelect(type: PersonalityType) {
    const next = [...answers];
    next[currentQ] = type;
    setAnswers(next);
    if (currentQ < 7) {
      setTimeout(() => setCurrentQ(currentQ + 1), 300);
    }
  }

  function handleFinish() {
    if (progress >= 8) setShowResult(true);
  }

  function handleRestart() {
    setAnswers(Array(8).fill(null));
    setCurrentQ(0);
    setShowResult(false);
    setCopied(false);
  }

  function handleShare() {
    if (!result) return;
    const text = `I'm a ${result.name} ${result.emoji} — What's your travel personality? Take the quiz at WorldTourly.com`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  /* ── result screen ── */
  if (showResult && result) {
    const countries = result.countryIds.map(findCountryById).filter(Boolean);
    const experiences = result.experienceIds.map(findAttractionById).filter(Boolean);

    return (
      <div className="min-h-screen" style={{ background: '#FAFBFC' }}>
        <div className="mx-auto max-w-3xl px-4 py-16">
          {/* header */}
          <div className="text-center mb-12">
            <div className="text-7xl mb-4">{result.emoji}</div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3" style={{ color: '#0F172A' }}>
              You&apos;re a {result.name}
            </h1>
            <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: '#475569' }}>
              {result.description}
            </p>
          </div>

          {/* destinations */}
          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold mb-4" style={{ color: '#0F172A' }}>
              Your Perfect Destinations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {countries.map((c) =>
                c ? (
                  <div
                    key={c.id}
                    className="rounded-2xl p-6 border transition-shadow hover:shadow-lg"
                    style={{ background: '#fff', borderColor: '#E2E8F0' }}
                  >
                    <span className="text-4xl">{c.flag}</span>
                    <h3 className="font-serif text-xl font-bold mt-2" style={{ color: '#0F172A' }}>
                      {c.name}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: '#64748B' }}>
                      {c.tagline}
                    </p>
                  </div>
                ) : null
              )}
            </div>
          </section>

          {/* itinerary style */}
          <section className="mb-10 rounded-2xl p-6 border" style={{ background: '#fff', borderColor: '#E2E8F0' }}>
            <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: '#0F172A' }}>
              Your Ideal Itinerary Style
            </h2>
            <p className="text-lg" style={{ color: '#475569' }}>
              {result.itineraryStyle}
            </p>
          </section>

          {/* experiences */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold mb-4" style={{ color: '#0F172A' }}>
              You&apos;ll Love These Experiences
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) =>
                exp ? (
                  <div
                    key={exp.id}
                    className="rounded-2xl p-6 border transition-shadow hover:shadow-lg"
                    style={{ background: '#fff', borderColor: '#E2E8F0' }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-lg font-bold" style={{ color: '#0F172A' }}>
                          {exp.name}
                        </h3>
                        <p className="text-sm mt-0.5" style={{ color: '#0EA5E9' }}>
                          {exp.cityName}, {exp.countryName}
                        </p>
                        <p className="text-sm mt-2 leading-relaxed" style={{ color: '#475569' }}>
                          {exp.description}
                        </p>
                      </div>
                      <span
                        className="shrink-0 text-xs font-semibold rounded-full px-3 py-1"
                        style={{ background: '#FEF3C7', color: '#92400E' }}
                      >
                        {exp.category}
                      </span>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </section>

          {/* share + restart */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleShare}
              className="rounded-full px-8 py-3 font-semibold text-white transition-transform hover:scale-105"
              style={{ background: '#0EA5E9' }}
            >
              {copied ? 'Copied to clipboard!' : 'Share Your Result'}
            </button>
            <button
              onClick={handleRestart}
              className="rounded-full px-8 py-3 font-semibold border-2 transition-transform hover:scale-105"
              style={{ borderColor: '#0EA5E9', color: '#0EA5E9' }}
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── quiz screen ── */
  const q = QUESTIONS[currentQ];

  return (
    <div className="min-h-screen" style={{ background: '#FAFBFC' }}>
      <div className="mx-auto max-w-2xl px-4 py-16">
        {/* title */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3" style={{ color: '#0F172A' }}>
            What&apos;s Your Travel Personality?
          </h1>
          <p className="text-lg" style={{ color: '#64748B' }}>
            8 questions. No wrong answers. Discover your travel DNA.
          </p>
        </div>

        {/* progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium mb-2" style={{ color: '#64748B' }}>
            <span>Question {currentQ + 1} of 8</span>
            <span>{progress} answered</span>
          </div>
          <div className="h-2 rounded-full" style={{ background: '#E2E8F0' }}>
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{ background: '#0EA5E9', width: `${(progress / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* question nav dots */}
        <div className="flex justify-center gap-2 mb-8">
          {QUESTIONS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              className="w-9 h-9 rounded-full text-sm font-semibold transition-all"
              style={{
                background: i === currentQ ? '#0EA5E9' : answers[i] !== null ? '#BAE6FD' : '#E2E8F0',
                color: i === currentQ ? '#fff' : answers[i] !== null ? '#0369A1' : '#94A3B8',
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* question */}
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: '#0F172A' }}>
          {q.question}
        </h2>

        {/* choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {q.choices.map((c) => {
            const selected = answers[currentQ] === c.type;
            return (
              <button
                key={c.type}
                onClick={() => handleSelect(c.type)}
                className="rounded-2xl p-5 text-left border-2 transition-all hover:shadow-md"
                style={{
                  background: selected ? '#F0F9FF' : '#fff',
                  borderColor: selected ? '#0EA5E9' : '#E2E8F0',
                }}
              >
                <span className="text-3xl block mb-2">{c.emoji}</span>
                <span className="text-base font-medium" style={{ color: '#0F172A' }}>
                  {c.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* nav buttons */}
        <div className="flex justify-between items-center">
          <button
            disabled={currentQ === 0}
            onClick={() => setCurrentQ(currentQ - 1)}
            className="rounded-full px-6 py-2.5 font-semibold border-2 transition-opacity disabled:opacity-30"
            style={{ borderColor: '#CBD5E1', color: '#475569' }}
          >
            Previous
          </button>

          {currentQ < 7 ? (
            <button
              disabled={answers[currentQ] === null}
              onClick={() => setCurrentQ(currentQ + 1)}
              className="rounded-full px-6 py-2.5 font-semibold text-white transition-opacity disabled:opacity-30"
              style={{ background: '#0EA5E9' }}
            >
              Next
            </button>
          ) : (
            <button
              disabled={progress < 8}
              onClick={handleFinish}
              className="rounded-full px-8 py-2.5 font-bold text-white transition-all hover:scale-105 disabled:opacity-30"
              style={{ background: progress >= 8 ? '#F59E0B' : '#CBD5E1' }}
            >
              See My Personality
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
