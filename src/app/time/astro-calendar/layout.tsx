import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "2026 Astronomical Calendar — Eclipses, Meteor Showers, Full Moons & Planet Events",
  description:
    "Complete 2026 astronomical calendar with eclipses, meteor showers, full moons, solstices, equinoxes, and planet events. Add any event to your calendar with one click.",
  keywords: [
    "astronomical calendar 2026",
    "eclipse calendar 2026",
    "meteor shower 2026",
    "full moon 2026",
    "planet events 2026",
    "solstice 2026",
    "equinox 2026",
    "celestial events",
    "astronomy calendar",
    "night sky events 2026",
    "stargazing calendar",
  ],
  openGraph: {
    title: "2026 Astronomical Calendar — All Celestial Events",
    description:
      "Every eclipse, meteor shower, full moon, solstice, and planet event of 2026 in one page. Add events to your calendar.",
    url: "https://www.dateandtimezone.com/astro-calendar",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone 2026 Astronomical Calendar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 Astronomical Calendar — All Celestial Events",
    description:
      "Complete 2026 astronomical calendar: eclipses, meteor showers, full moons, solstices, and planet events.",
  },
};

export default function AstroCalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
