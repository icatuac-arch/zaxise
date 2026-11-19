import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Time Zone Comparison — Side-by-Side Hourly Schedule Planner",
  description:
    "Compare time zones side by side with our hourly schedule comparison tool. Find overlapping working hours, best meeting times, and plan across up to 4 cities worldwide.",
  keywords: [
    "time zone comparison",
    "timezone compare",
    "working hours overlap",
    "meeting planner",
    "time zone converter",
    "schedule comparison",
    "best meeting time",
    "multi timezone planner",
    "remote team scheduler",
    "international meeting planner",
  ],
  openGraph: {
    title: "Time Zone Comparison — Side-by-Side Hourly Planner",
    description:
      "Compare time zones, find overlapping working hours, and plan the best meeting times across multiple cities.",
    url: "https://www.dateandtimezone.com/timezone-compare",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Time Zone Comparison Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Time Zone Comparison — Side-by-Side Hourly Planner",
    description:
      "Find overlapping working hours and best meeting times across multiple time zones.",
  },
};

export default function TimezoneCompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
