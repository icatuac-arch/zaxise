import { Metadata } from 'next';
import { COUNTRIES } from '@/data/travel/destinations';

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  'use cache';
  const { slug } = await params;
  const country = COUNTRIES.find((c) => c.slug === slug);
  if (!country) {
    return { title: 'Country Not Found | Zaxise' };
  }

  const topAttractions = country.states
    .flatMap((s) => s.cities.flatMap((c) => c.attractions || []))
    .filter((a) => a.countryRank && a.countryRank <= 5)
    .sort((a, b) => (a.countryRank || 99) - (b.countryRank || 99))
    .slice(0, 5)
    .map((a) => a.name);

  const attractionMention = topAttractions.length > 0
    ? ` Top attractions include ${topAttractions.join(', ')}.`
    : '';

  const description = `Explore ${country.name}: top attractions, cities, travel tips, visa info, safety, weather, and more.${attractionMention} ${country.tagline}`;

  return {
    title: `${country.name} Travel Guide — Top Attractions & Trip Planner | Zaxise`,
    description,
    keywords: [
      `${country.name} travel guide`,
      `${country.name} top attractions`,
      `${country.name} trip planner`,
      `best places to visit in ${country.name}`,
      `${country.name} tourism`,
      `${country.name} itinerary`,
      `${country.name} visa`,
      `${country.name} safety`,
    ],
    alternates: {
      canonical: `https://zaxise.com/country/${country.slug}`,
    },
    openGraph: {
      type: 'article',
      title: `${country.name} Travel Guide — Top Attractions & Trip Planner | Zaxise`,
      description,
      url: `https://zaxise.com/country/${country.slug}`,
      siteName: 'Zaxise',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${country.name} Travel Guide | Zaxise`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${country.name} Travel Guide | Zaxise`,
      description,
      images: ['/og-image.png'],
    },
  };
}

export default function CountryLayout({ children }: Props) {
  return <>{children}</>;
}
