import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Did You Know? — Fascinating Travel Facts | Zaxise',
  description:
    'Discover 50+ mind-blowing travel facts about geography, history, food, culture, nature, and language from around the world. Learn something new every day.',
  openGraph: {
    title: 'Did You Know? — Fascinating Travel Facts | Zaxise',
    description:
      'Mind-blowing travel facts you can share with friends. A new fact every day!',
  },
};

export default function DidYouKnowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
