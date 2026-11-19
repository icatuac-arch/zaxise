import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What\'s Your Travel Personality? — Interactive Quiz | WorldTourly',
  description:
    'Discover your travel personality with our interactive 8-question quiz. Are you a Culture Explorer, Adventure Seeker, Visual Storyteller, Food Pilgrim, or Wanderer? Get personalized destination recommendations.',
  openGraph: {
    title: 'What\'s Your Travel Personality? | WorldTourly',
    description:
      'Take our 8-question personality quiz and discover your ideal travel style, perfect destinations, and must-try experiences.',
  },
};

export default function TravelPersonalityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
