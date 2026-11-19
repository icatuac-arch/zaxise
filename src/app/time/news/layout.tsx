import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Space News — Latest NASA, SpaceX, ESA & Space Industry News | DateAndTimezone",
  description:
    "Stay updated with the latest space news from NASA, SpaceX, Blue Origin, ESA, ISRO, and more. Breaking coverage of rocket launches, Artemis, Starship, ISS, Mars missions, and the entire space industry.",
  keywords: [
    "space news",
    "NASA news",
    "SpaceX news",
    "rocket launch news",
    "ESA news",
    "Blue Origin news",
    "ISRO news",
    "ISS news",
    "Mars news",
    "Artemis program",
    "Starship updates",
    "space industry news",
    "Rocket Lab news",
    "satellite news",
    "spaceflight news",
  ],
  openGraph: {
    title: "Space News — Latest NASA, SpaceX & Space Industry Updates",
    description:
      "Breaking space news from NASA, SpaceX, ESA, and beyond. Launches, missions, discoveries, and space industry analysis.",
    type: "website",
    url: "https://www.dateandtimezone.com/news",
  },
  twitter: {
    card: "summary_large_image",
    title: "Space News — Latest NASA, SpaceX & Space Industry Updates",
    description:
      "Breaking space news from NASA, SpaceX, ESA, and beyond. Launches, missions, discoveries, and space industry analysis.",
  },
  alternates: {
    canonical: "https://www.dateandtimezone.com/news",
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
