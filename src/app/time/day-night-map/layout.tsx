import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Day & Night Map — Real-Time Earth Sunlight Visualization",
  description:
    "See where it's day and night on Earth right now. Real-time world map showing the solar terminator, subsolar point, and daylight/darkness across all time zones.",
  keywords: [
    "day night map",
    "earth sunlight map",
    "solar terminator",
    "where is it daytime",
    "day night world map",
    "real time sunlight",
    "earth day night cycle",
    "subsolar point",
    "live earth map",
  ],
  openGraph: {
    title: "Live Day & Night Map — Real-Time Earth Sunlight",
    description:
      "See where it's day and night on Earth right now with our real-time solar terminator map.",
    url: "https://www.dateandtimezone.com/day-night-map",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Live Day & Night Map",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Day & Night Map — Real-Time Earth Sunlight",
    description:
      "Real-time visualization of day and night across Earth with solar terminator line.",
  },
};

export default function DayNightMapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
