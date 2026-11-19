import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Travel Budget Calculator — How Much Does It Cost? | WorldTourly',
  description:
    'Calculate your exact travel budget for any destination. See detailed breakdowns for accommodation, food, transport, attractions, and more across 4 travel styles.',
  openGraph: {
    title: 'Travel Budget Calculator | WorldTourly',
    description:
      'Plan your trip budget down to the dollar. Select a city, pick your travel style, enter your days, and get a full cost breakdown.',
  },
};

export default function TravelCostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
