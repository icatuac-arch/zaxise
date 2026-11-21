import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hidden Gems — Spots Tourists Don\'t Know About | Zaxise',
  description:
    'Discover 15 incredible hidden gems across Japan, Italy, Thailand, France, and India. Off-the-beaten-path destinations that most tourists completely miss.',
  openGraph: {
    title: 'Hidden Gems — Spots Tourists Don\'t Know About | Zaxise',
    description:
      'Skip the crowds. Discover secret islands, cave cities, mountain monasteries, and fairy-tale villages the guidebooks barely mention.',
  },
};

export default function HiddenGemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
