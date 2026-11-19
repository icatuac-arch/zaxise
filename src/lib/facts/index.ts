export const HERO_FACTS: string[] = [
  "A day on Venus is longer than a year on Venus — it rotates so slowly that the Sun rises in the west.",
  "The human body contains enough carbon to make about 900 pencils.",
  "Honey never expires — archaeologists have found 3,000-year-old honey in Egyptian tombs that was still edible.",
  "A group of flamingos is called a 'flamboyance'.",
  "The shortest war in history lasted 38 to 45 minutes — between Britain and Zanzibar in 1896.",
  "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.",
  "Oxford University is older than the Aztec Empire.",
  "Water can boil and freeze at the same time — this is called the 'triple point'.",
  "The average person walks about 100,000 miles in their lifetime — four times around the Earth.",
  "There are more possible iterations of a chess game than atoms in the observable universe.",
];

export interface Fact {
  id: string;
  category: string;
  text: string;
  source: { name: string; url: string };
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  publishedAt: string;
}

const FACTS: Fact[] = HERO_FACTS.map((text, i) => ({
  id: `fact-${i + 1}`,
  category: 'general',
  text,
  source: { name: 'WorldTourly', url: '' },
  tags: ['general'],
  difficulty: 'easy',
  publishedAt: new Date().toISOString(),
}));

export function getAllFacts(): Fact[] {
  return FACTS;
}

export function getFactById(id: string): Fact | undefined {
  return FACTS.find((f) => f.id === id);
}

export function getFactsByCategory(category: string, page = 1, limit = 20) {
  const filtered = FACTS.filter((f) => f.category === category);
  const start = (page - 1) * limit;
  return { facts: filtered.slice(start, start + limit), total: filtered.length, page, limit };
}

export function getRandomFact(): Fact {
  return FACTS[Math.floor(Math.random() * FACTS.length)];
}

export function getTodaysFact(): Fact {
  const day = new Date().getDate() % FACTS.length;
  return FACTS[day];
}

export function searchFacts(query: string, category?: string, page = 1, limit = 20) {
  const q = query.toLowerCase();
  let filtered = FACTS.filter((f) => f.text.toLowerCase().includes(q));
  if (category) filtered = filtered.filter((f) => f.category === category);
  const start = (page - 1) * limit;
  return { facts: filtered.slice(start, start + limit), total: filtered.length, page, limit };
}

export function getCategoryCounts(): Record<string, number> {
  return { general: FACTS.length };
}
