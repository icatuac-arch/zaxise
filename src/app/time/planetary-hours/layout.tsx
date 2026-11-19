import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planetary Hours Calculator — Ancient Time Division System",
  description:
    "Calculate planetary hours based on your location. Discover which planet rules the current hour using the ancient Chaldean system from Babylonian and Hellenistic astrology.",
  keywords: [
    "planetary hours",
    "planetary hours calculator",
    "Chaldean order",
    "astrology hours",
    "planet ruler",
    "Babylonian astrology",
    "day hours",
    "night hours",
    "sunrise sunset calculator",
  ],
  openGraph: {
    title: "Planetary Hours Calculator — Ancient Time Division System",
    description:
      "Calculate planetary hours for any location. See which planet rules each hour of the day and night.",
    url: "https://www.dateandtimezone.com/planetary-hours",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Planetary Hours Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Planetary Hours Calculator — Ancient Time Division System",
    description:
      "Calculate planetary hours for any location using the ancient Chaldean order.",
  },
};

export default function PlanetaryHoursLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
