import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Full Moon Calendar 2026 — Dates, Names, Supermoons & Lunar Guide",
  description:
    "Complete 2026 full moon calendar with traditional names, countdowns, supermoon dates, moon phase guide, and cultural significance. Track every full moon from Wolf Moon to Cold Moon.",
  keywords: [
    "full moon calendar 2026",
    "full moon dates",
    "next full moon",
    "wolf moon",
    "snow moon",
    "blue moon 2026",
    "supermoon 2026",
    "moon phases",
    "full moon names",
    "harvest moon",
    "hunter's moon",
    "lunar calendar",
    "moon phase guide",
    "full moon countdown",
  ],
  openGraph: {
    title: "Full Moon Calendar 2026 — Dates, Names & Lunar Guide",
    description:
      "Track every full moon of 2026 with traditional names, countdowns, supermoon info, moon phases, and cultural significance.",
    url: "https://www.dateandtimezone.com/full-moon",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Full Moon Calendar 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Full Moon Calendar 2026 — Dates, Names & Lunar Guide",
    description:
      "Complete 2026 full moon calendar with traditional names, countdowns, and moon phase guide.",
  },
};

export default function FullMoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
