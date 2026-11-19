import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Destinations | WorldTourly',
  description:
    'Explore travel guides for countries around the world. Browse by continent — Asia, Europe, Americas, Africa, and more.',
  openGraph: {
    title: 'All Destinations | WorldTourly',
    description: 'Find your next travel destination with WorldTourly.',
  },
};

export default function DestinationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
