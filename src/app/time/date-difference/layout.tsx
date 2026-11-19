import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Date Difference Calculator — Days Between Two Dates",
  description:
    "Calculate the exact difference between two dates in years, months, weeks, days, hours, minutes, and seconds. Business days, fun facts, and more.",
  keywords: [
    "date difference calculator",
    "days between dates",
    "date calculator",
    "business days calculator",
    "weeks between dates",
    "months between dates",
    "time between dates",
    "date duration",
  ],
  openGraph: {
    title: "Date Difference Calculator — Days Between Two Dates",
    description:
      "Find the exact time between any two dates. Years, months, days, business days, and fun facts on DateAndTimezone.",
    url: "https://www.dateandtimezone.com/date-difference",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Date Difference Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Date Difference Calculator — Days Between Two Dates",
    description:
      "Calculate the exact difference between two dates in every unit imaginable.",
  },
};

export default function DateDifferenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
