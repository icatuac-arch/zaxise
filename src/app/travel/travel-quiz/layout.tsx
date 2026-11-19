import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Travel Quiz — How Well Do You Know the World? | WorldTourly',
  description:
    'Test your travel knowledge with 20 fun questions about landmarks, cultures, currencies, and more. Share your score with friends!',
  openGraph: {
    title: 'Travel Quiz — How Well Do You Know the World? | WorldTourly',
    description:
      'Can you score 20/20 on the ultimate travel quiz? Test your knowledge now!',
  },
};

export default function TravelQuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
