import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Space Missions History — Timeline of Human Space Exploration & Milestones",
  description:
    "Explore the complete history of space missions from Sputnik to the James Webb Space Telescope. Moon landings, Mars rovers, space stations, notable astronauts, and space debris tracking. A free educational resource on DateAndTimezone.",
  keywords: [
    "space missions",
    "space exploration timeline",
    "moon landing",
    "apollo missions",
    "mars rovers",
    "ISS",
    "international space station",
    "space history",
    "astronauts",
    "cosmonauts",
    "space debris",
    "sputnik",
    "hubble telescope",
    "james webb telescope",
    "artemis program",
    "space accidents",
    "challenger disaster",
    "columbia disaster",
    "yuri gagarin",
    "neil armstrong",
  ],
  openGraph: {
    title: "Space Missions History — Timeline of Human Space Exploration",
    description:
      "Complete timeline of space missions, moon landings, Mars rovers, space stations, notable astronauts, and space debris. Free on DateAndTimezone.",
    url: "https://www.dateandtimezone.com/space-missions",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Space Missions History",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Space Missions History — Timeline of Human Space Exploration",
    description:
      "Explore the complete history of space exploration from Sputnik to JWST. Moon landings, Mars rovers, astronauts, and more.",
  },
};

export default function SpaceMissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
