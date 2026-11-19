import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doomsday Clock — How Close Are We to Midnight? | DateAndTimezone",
  description:
    "Explore the Bulletin of the Atomic Scientists' Doomsday Clock. See the current setting of 89 seconds to midnight, full history since 1947, and what factors scientists consider.",
  keywords: [
    "doomsday clock",
    "bulletin of atomic scientists",
    "minutes to midnight",
    "nuclear threat",
    "existential risk",
    "doomsday clock history",
    "doomsday clock 2025",
    "seconds to midnight",
    "nuclear war risk",
    "climate change threat",
  ],
  openGraph: {
    title: "Doomsday Clock — How Close Are We to Midnight?",
    description:
      "The Doomsday Clock stands at 89 seconds to midnight. Explore the full history and what it means on DateAndTimezone.",
    url: "https://www.dateandtimezone.com/doomsday-clock",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Doomsday Clock",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Doomsday Clock — How Close Are We to Midnight?",
    description:
      "The Doomsday Clock stands at 89 seconds to midnight. Explore the full history and what it means.",
  },
};

export default function DoomsdayClockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
