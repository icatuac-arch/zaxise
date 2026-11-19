import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eclipse Calendar 2026-2030 — Solar & Lunar Eclipse Dates & Visibility",
  description:
    "Complete eclipse calendar from 2026 to 2030. Track upcoming total solar eclipses, annular eclipses, lunar eclipses with dates, visibility maps, countdowns, and safety tips. Never miss an eclipse again.",
  keywords: [
    "eclipse calendar",
    "solar eclipse 2026",
    "lunar eclipse 2026",
    "total solar eclipse",
    "annular solar eclipse",
    "eclipse dates",
    "eclipse visibility",
    "next eclipse",
    "eclipse countdown",
    "eclipse 2027",
    "eclipse 2028",
    "eclipse 2029",
    "eclipse 2030",
    "eclipse safety",
  ],
  openGraph: {
    title: "Eclipse Calendar 2026-2030 — Solar & Lunar Eclipse Dates",
    description:
      "Track every solar and lunar eclipse from 2026 to 2030. Countdown timers, visibility regions, type explainers, and safety tips.",
    url: "https://www.dateandtimezone.com/eclipses",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Eclipse Calendar 2026-2030",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eclipse Calendar 2026-2030 — Solar & Lunar Eclipse Dates",
    description:
      "Complete eclipse calendar with countdowns, visibility maps, and safety tips. Never miss an eclipse.",
  },
};

export default function EclipsesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
