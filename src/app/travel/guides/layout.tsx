import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Travel Guides | WorldTourly',
  description:
    'Browse curated travel guides — from first-time traveler tips to solo safety, budget travel, family trips, and more.',
  openGraph: {
    title: 'Travel Guides | WorldTourly',
    description: 'Curated travel guides for every kind of traveler.',
  },
};

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
