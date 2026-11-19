import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "World Population Clock — Live Real-Time Counter",
  description:
    "Watch the world population tick up in real-time. See live births, deaths, net growth, population by continent, historical milestones, and fun comparisons.",
  keywords: [
    "world population clock",
    "live population counter",
    "population today",
    "births per second",
    "deaths per second",
    "population by continent",
    "population milestones",
    "real-time population",
    "global population",
    "population growth rate",
  ],
  openGraph: {
    title: "World Population Clock — Live Real-Time Counter",
    description:
      "Watch the world population grow in real-time. Live births, deaths, growth stats, and milestones on DateAndTimezone.",
    url: "https://www.dateandtimezone.com/population-clock",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone World Population Clock",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "World Population Clock — Live Real-Time Counter",
    description:
      "See the world population ticking up live. Births, deaths, and growth stats in real-time.",
  },
};

export default function PopulationClockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
