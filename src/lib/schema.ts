export const CATEGORIES = [
  'general', 'science', 'history', 'nature', 'technology',
  'geography', 'culture', 'food', 'sports', 'arts',
] as const;

export type Category = typeof CATEGORIES[number];

export interface Fact {
  id: string;
  category: string;
  text: string;
  source: { name: string; url: string };
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  publishedAt: string;
}
