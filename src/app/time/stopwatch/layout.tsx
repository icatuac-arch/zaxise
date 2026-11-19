import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Stopwatch — Precise Lap Timer & Split Times",
  description:
    "Free online stopwatch with millisecond precision, lap times, split tracking, and keyboard shortcuts. Start, stop, reset instantly. No downloads required.",
  keywords: [
    "online stopwatch",
    "stopwatch",
    "lap timer",
    "split timer",
    "millisecond stopwatch",
    "free stopwatch",
    "web stopwatch",
    "digital stopwatch",
    "precision timer",
    "stopwatch online free",
  ],
  openGraph: {
    title: "Online Stopwatch — Precise Lap Timer & Split Times",
    description:
      "Free online stopwatch with millisecond precision, lap times, and keyboard shortcuts. No downloads required.",
    url: "https://www.dateandtimezone.com/stopwatch",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Online Stopwatch",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Stopwatch — Precise Lap Timer & Split Times",
    description:
      "Free online stopwatch with millisecond precision, lap times, and keyboard shortcuts.",
  },
};

export default function StopwatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
