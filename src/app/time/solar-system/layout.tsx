import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Solar System & Planets — Explore Mercury to Neptune, Dwarf Planets & Belts",
  description:
    "Explore every planet in our Solar System with key stats, fun facts, comparison tables, dwarf planets, the Asteroid Belt, and the Kuiper Belt. A free educational resource on DateAndTimezone.",
  keywords: [
    "solar system",
    "planets",
    "mercury",
    "venus",
    "earth",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
    "pluto",
    "dwarf planets",
    "asteroid belt",
    "kuiper belt",
    "planet comparison",
    "planet facts",
    "planet sizes",
    "planet distances",
  ],
  openGraph: {
    title: "Solar System & Planets — Explore Our Cosmic Neighborhood",
    description:
      "Key stats, fun facts, comparison tables, dwarf planets, and belt explainers for every planet in the Solar System. Free on DateAndTimezone.",
    url: "https://www.dateandtimezone.com/solar-system",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Solar System Explorer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar System & Planets — Explore Our Cosmic Neighborhood",
    description:
      "Explore every planet with stats, fun facts, comparisons, dwarf planets, and belt explainers.",
  },
};

export default function SolarSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
