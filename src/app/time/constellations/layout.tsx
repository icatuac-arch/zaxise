import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Constellation Guide — What's in the Sky Tonight",
  description:
    "Discover which constellations are visible tonight with our seasonal star guide. Find Orion, the Big Dipper, Scorpius, and all 12 zodiac constellations with viewing tips and mythology.",
  keywords: [
    "constellations",
    "constellation guide",
    "night sky",
    "stargazing",
    "zodiac constellations",
    "seasonal constellations",
    "star chart",
    "Orion",
    "Big Dipper",
    "Polaris",
    "star hopping",
    "astronomy guide",
    "visible constellations tonight",
  ],
  openGraph: {
    title: "Constellation Guide — What's in the Sky Tonight",
    description:
      "Seasonal constellation guide with mythology, brightest stars, notable deep-sky objects, and stargazing tips. Free on DateAndTimezone.",
    url: "https://www.dateandtimezone.com/constellations",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Constellation Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Constellation Guide — What's in the Sky Tonight",
    description:
      "Discover seasonal constellations, zodiac star patterns, and stargazing tips with our free interactive guide.",
  },
};

export default function ConstellationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
