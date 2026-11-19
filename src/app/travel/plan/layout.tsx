import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plan a Trip | WorldTourly',
  description:
    'Plan your trip step by step — pick a country, choose a city, select your itinerary length, and get a ready-made travel plan.',
  openGraph: {
    title: 'Plan a Trip | WorldTourly',
    description: 'Build your travel itinerary with WorldTourly.',
  },
};

export default function PlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
