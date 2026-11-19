import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daylight Hours Around the World — Compare Cities by Latitude | DateAndTimezone",
  description:
    "Visualize how daylight hours vary by latitude throughout the year. Compare cities from the Arctic to the equator and see today's daylight for any location.",
  keywords: [
    "daylight hours",
    "hours of sunlight",
    "daylight by latitude",
    "daylight comparison",
    "sunrise sunset calculator",
    "summer solstice daylight",
    "winter solstice daylight",
    "midnight sun",
    "polar night",
    "equatorial daylight",
  ],
  openGraph: {
    title: "Daylight Hours Around the World",
    description:
      "Visualize how daylight hours vary by latitude. Compare cities and explore solstice extremes on DateAndTimezone.",
    url: "https://www.dateandtimezone.com/daylight-hours",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Daylight Hours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daylight Hours Around the World",
    description:
      "Visualize how daylight hours vary by latitude. Compare cities and explore solstice extremes.",
  },
};

export default function DaylightHoursLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
