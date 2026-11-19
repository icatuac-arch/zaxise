import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Continents, Countries & Time Zones — Explore Every Nation and UTC Offset",
  description:
    "Browse all 7 continents, 196+ countries, capitals, flags, and time zones. Search any country instantly. Fun timezone facts, area, and population data. Free on DateAndTimezone.",
  keywords: [
    "continents",
    "countries",
    "time zones",
    "UTC offsets",
    "world countries",
    "capitals",
    "flags",
    "Asia countries",
    "Africa countries",
    "Europe countries",
    "North America countries",
    "South America countries",
    "Oceania countries",
    "Antarctica",
    "country time zones",
    "world map time zones",
    "country populations",
    "country capitals",
  ],
  openGraph: {
    title: "Continents, Countries & Time Zones of the World",
    description:
      "Explore all 7 continents with every country, capital, flag, and time zone. Search 196+ nations instantly. Free on DateAndTimezone.",
    url: "https://www.dateandtimezone.com/continents",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Continents & Time Zones Explorer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Continents, Countries & Time Zones of the World",
    description:
      "Browse all 7 continents, 196+ countries, capitals, flags, and time zones. Search any country instantly.",
  },
};

export default function ContinentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
