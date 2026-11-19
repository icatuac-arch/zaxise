import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare Destinations Side by Side | WorldTourly',
  description:
    'Compare 2 or 3 travel destinations head-to-head. Weather, budget, safety, attractions, food scene, and more — all in one view to help you decide where to go next.',
  openGraph: {
    title: 'Compare Destinations Side by Side | WorldTourly',
    description:
      'Can\'t decide between Tokyo and Seoul? Paris and Rome? Compare destinations across 10+ categories and get a personalized verdict.',
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
