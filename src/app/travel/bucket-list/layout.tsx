import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Build Your Travel Bucket List | Zaxise',
  description:
    'Create your personal travel bucket list. Track places you want to visit and those you have already been to. Share your progress with friends!',
  openGraph: {
    title: 'Build Your Travel Bucket List | Zaxise',
    description:
      'Track your travel dreams and achievements. How much of the world have you seen?',
  },
};

export default function BucketListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
