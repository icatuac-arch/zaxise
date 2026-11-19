import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sunrise & Sunset Calculator — DateAndTimezone",
  description:
    "Calculate sunrise, sunset, twilight times, day length, golden hour, and solar noon for any city worldwide. 7-day forecast with visual timeline.",
  keywords: [
    "sunrise calculator",
    "sunset calculator",
    "sunrise time",
    "sunset time",
    "day length",
    "golden hour",
    "solar noon",
    "twilight times",
    "civil twilight",
    "nautical twilight",
    "astronomical twilight",
    "sun position",
    "DateAndTimezone",
  ],
  openGraph: {
    title: "Sunrise & Sunset Calculator — DateAndTimezone",
    description:
      "Calculate sunrise, sunset, twilight, golden hour, and day length for 50+ cities worldwide. Visual timeline and 7-day forecast.",
    type: "website",
  },
};

export default function SunriseSunsetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
