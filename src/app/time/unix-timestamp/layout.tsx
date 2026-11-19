import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unix Timestamp Converter — Epoch Time Tool",
  description:
    "Convert Unix timestamps to human-readable dates and vice versa. Live ticking timestamp, timezone support, millisecond precision, and common epoch bookmarks.",
  keywords: [
    "unix timestamp",
    "epoch converter",
    "unix time",
    "timestamp converter",
    "epoch time",
    "unix epoch",
    "seconds since 1970",
    "timestamp to date",
    "date to timestamp",
  ],
  openGraph: {
    title: "Unix Timestamp Converter — Epoch Time Tool",
    description:
      "Convert Unix timestamps to dates and dates to timestamps. Live ticking clock, timezone support, and more on DateAndTimezone.",
    url: "https://www.dateandtimezone.com/unix-timestamp",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Unix Timestamp Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unix Timestamp Converter — Epoch Time Tool",
    description:
      "Convert between Unix timestamps and human-readable dates with timezone support.",
  },
};

export default function UnixTimestampLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
