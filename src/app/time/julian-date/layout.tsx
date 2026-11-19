import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Julian Date Converter — JD & MJD Calculator",
  description:
    "Convert between calendar dates and Julian Date Numbers. Current Julian Date displayed live. Modified Julian Date (MJD) for astronomy, military, and satellite tracking.",
  keywords: [
    "julian date",
    "julian day number",
    "JD converter",
    "modified julian date",
    "MJD",
    "julian calendar converter",
    "astronomy date",
    "satellite tracking date",
    "julian date calculator",
  ],
  openGraph: {
    title: "Julian Date Converter — JD & MJD Calculator",
    description:
      "Convert calendar dates to Julian Date Numbers and back. Live JD, MJD, formula explanations, and use cases on DateAndTimezone.",
    url: "https://www.dateandtimezone.com/julian-date",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Julian Date Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Julian Date Converter — JD & MJD Calculator",
    description:
      "Convert between calendar dates and Julian Day Numbers. Astronomy, military, and satellite tracking.",
  },
};

export default function JulianDateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
