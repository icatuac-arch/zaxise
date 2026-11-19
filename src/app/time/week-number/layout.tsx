import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What Week Is It? — Week Number Calculator",
  description:
    "Find the current week number, look up any date's week number, and see a full year calendar of week numbers. ISO and US week numbering explained.",
  keywords: [
    "week number",
    "what week is it",
    "week number calculator",
    "ISO week number",
    "calendar week",
    "week of year",
    "current week number",
    "week number lookup",
  ],
  openGraph: {
    title: "What Week Is It? — Week Number Calculator",
    description:
      "Instantly see the current week number and look up week numbers for any date. ISO vs US week numbering explained.",
    url: "https://www.dateandtimezone.com/week-number",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Week Number Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "What Week Is It? — Week Number Calculator",
    description:
      "Find the current week number, look up any date, and explore ISO vs US week numbering.",
  },
};

export default function WeekNumberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
