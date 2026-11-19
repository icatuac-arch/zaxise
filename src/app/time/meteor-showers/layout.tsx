import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Meteor Shower Calendar 2026 — Peak Dates, Rates & Viewing Guide",
  description:
    "Complete 2026 meteor shower calendar with peak dates, hourly rates, countdowns, and viewing tips for every major shower including the Perseids, Geminids, Quadrantids, and more.",
  keywords: [
    "meteor shower calendar",
    "meteor shower 2026",
    "Perseids 2026",
    "Geminids 2026",
    "Quadrantids 2026",
    "shooting stars",
    "meteor shower dates",
    "meteor shower tonight",
    "ZHR meteor",
    "best meteor showers",
    "meteor shower viewing guide",
    "Leonids",
    "Orionids",
    "Eta Aquariids",
  ],
  openGraph: {
    title: "Meteor Shower Calendar 2026 — Peak Dates, Rates & Viewing Guide",
    description:
      "Track every major meteor shower in 2026. Countdowns, peak dates, hourly rates, radiant constellations, and expert viewing tips.",
    url: "https://www.dateandtimezone.com/meteor-showers",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Meteor Shower Calendar 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meteor Shower Calendar 2026 — Peak Dates & Viewing Guide",
    description:
      "Complete 2026 meteor shower calendar with countdowns, rates, and viewing tips. Never miss a shooting star.",
  },
};

export default function MeteorShowersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
