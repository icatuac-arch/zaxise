import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dark Sky & Stargazing Guide — Bortle Scale, Dark Sky Parks & Tips",
  description:
    "Complete dark sky guide with the Bortle Scale explained, 12 International Dark Sky certified locations, stargazing tips for beginners, equipment recommendations, and what to see in tonight's sky.",
  keywords: [
    "dark sky",
    "stargazing guide",
    "Bortle scale",
    "light pollution",
    "dark sky parks",
    "International Dark Sky",
    "stargazing tips",
    "telescope guide",
    "Milky Way",
    "night sky",
    "astronomy for beginners",
    "astrophotography",
  ],
  openGraph: {
    title: "Dark Sky & Stargazing Guide — Bortle Scale, Dark Sky Parks & Tips",
    description:
      "Bortle Scale explained, certified dark sky parks worldwide, stargazing tips, equipment guide, and tonight's sky highlights. Free on DateAndTimezone.",
    url: "https://www.dateandtimezone.com/dark-sky",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Dark Sky & Stargazing Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dark Sky & Stargazing Guide — Bortle Scale & Dark Sky Parks",
    description:
      "Complete stargazing guide with the Bortle Scale, 12 dark sky parks, equipment recommendations, and tonight's sky.",
  },
};

export default function DarkSkyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
