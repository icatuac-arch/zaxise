import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zodiac & Cosmic Birthday Calculator — Western & Chinese Zodiac",
  description:
    "Discover your Western zodiac sign, Chinese zodiac animal, birth moon phase, and cosmic birthday facts. Fun astrology calculator with personality traits, compatibility, and more.",
  keywords: [
    "zodiac calculator",
    "zodiac sign finder",
    "chinese zodiac calculator",
    "birth moon phase",
    "cosmic birthday",
    "astrology calculator",
    "zodiac compatibility",
    "what is my zodiac sign",
    "zodiac personality traits",
    "moon phase birthday",
  ],
  openGraph: {
    title: "Zodiac & Cosmic Birthday Calculator — Western & Chinese Zodiac",
    description:
      "Discover your Western zodiac sign, Chinese zodiac animal, birth moon phase, and cosmic birthday facts.",
    url: "https://www.dateandtimezone.com/zodiac",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone — Zodiac & Cosmic Birthday Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zodiac & Cosmic Birthday Calculator",
    description:
      "Find your Western zodiac, Chinese zodiac, birth moon phase, and cosmic birthday stats. Fun and free on DateAndTimezone.",
  },
};

export default function ZodiacLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
