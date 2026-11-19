import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Space Unit Converter — Astronomical Distance, Mass, Speed & Temperature",
  description:
    "Convert between astronomical units: light-years, parsecs, AU, solar masses, Earth masses, speed of light, and more. Interactive space unit converter with fun comparisons. Free on DateAndTimezone.",
  keywords: [
    "space unit converter",
    "astronomical unit converter",
    "light-year converter",
    "parsec converter",
    "AU converter",
    "solar mass",
    "speed of light converter",
    "astronomical distance",
    "space calculator",
    "cosmic units",
  ],
  openGraph: {
    title: "Space Unit Converter — Astronomical Units Made Easy",
    description:
      "Convert between light-years, parsecs, AU, solar masses, speed of light, and more. Interactive space unit converter with fun comparisons.",
    url: "https://www.dateandtimezone.com/space-units",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Space Unit Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Space Unit Converter — Astronomical Units Made Easy",
    description:
      "Convert between light-years, parsecs, AU, solar masses, speed of light, and more.",
  },
};

export default function SpaceUnitsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
