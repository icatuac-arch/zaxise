import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leap Year Calculator — Check Any Year",
  description:
    "Check if any year is a leap year. Learn the rules, see upcoming leap years, fun facts about leaplings, and countdown to the next February 29.",
  keywords: [
    "leap year calculator",
    "is it a leap year",
    "leap year checker",
    "february 29",
    "leapling birthday",
    "leap year rules",
    "next leap year",
    "leap year list",
    "divisible by 4",
    "leap year facts",
  ],
  openGraph: {
    title: "Leap Year Calculator — Check Any Year",
    description:
      "Check any year for leap year status. Rules explained, upcoming leap years, and fun facts on DateAndTimezone.",
    url: "https://www.dateandtimezone.com/leap-year",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Leap Year Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Leap Year Calculator — Check Any Year",
    description:
      "Is your year a leap year? Check any year, learn the rules, and discover fun leap year facts.",
  },
};

export default function LeapYearLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
