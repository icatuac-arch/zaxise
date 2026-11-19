import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Satellites & Space Orbits — LEO, MEO, GEO, Famous Satellites & Space Agencies",
  description:
    "Explore satellite orbits from LEO to GEO, famous satellites like Hubble and JWST, space agencies worldwide, satellite stats, and space debris. A free educational resource on DateAndTimezone.",
  keywords: [
    "satellites",
    "space orbits",
    "LEO",
    "MEO",
    "GEO",
    "geostationary orbit",
    "low earth orbit",
    "medium earth orbit",
    "Hubble Space Telescope",
    "James Webb Space Telescope",
    "Starlink",
    "GPS satellites",
    "space debris",
    "Kessler syndrome",
    "ISRO",
    "NASA",
    "ESA",
    "SpaceX",
    "satellite constellation",
    "polar orbit",
    "sun-synchronous orbit",
    "Chandrayaan",
    "Mangalyaan",
    "Voyager",
    "space agencies",
  ],
  openGraph: {
    title: "Satellites & Space Orbits — Explore Earth's Orbital Neighborhood",
    description:
      "Learn about satellite orbits, famous satellites, space agencies, and the growing challenge of space debris. Free on DateAndTimezone.",
    url: "https://www.dateandtimezone.com/satellites",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Satellites & Space Orbits",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Satellites & Space Orbits — Explore Earth's Orbital Neighborhood",
    description:
      "Explore satellite orbits from LEO to GEO, famous satellites, space agencies, and the challenge of space debris.",
  },
};

export default function SatellitesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
