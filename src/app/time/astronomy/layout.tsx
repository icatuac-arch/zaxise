import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Astronomy Dashboard — Moon Phases, Eclipses, Planets & Space News",
  description:
    "Track moon phases, upcoming solar and lunar eclipses, planet visibility, NASA's Astronomy Picture of the Day, and the latest space news. Your free astronomy dashboard on DateAndTimezone.",
  keywords: [
    "moon phase today",
    "next eclipse",
    "solar eclipse 2026",
    "lunar eclipse",
    "planet visibility tonight",
    "astronomy picture of the day",
    "space news",
    "night sky",
    "stargazing",
    "astronomy dashboard",
  ],
  openGraph: {
    title: "Astronomy Dashboard — Moon Phases, Eclipses & Space News",
    description:
      "Track moon phases, upcoming eclipses, planet visibility, NASA APOD, and the latest space news. Free astronomy dashboard on DateAndTimezone.",
    url: "https://www.dateandtimezone.com/astronomy",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Astronomy Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Astronomy Dashboard — Moon Phases, Eclipses & Space News",
    description:
      "Track moon phases, upcoming eclipses, planet visibility, NASA APOD, and space news.",
  },
};

export default function AstronomyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
