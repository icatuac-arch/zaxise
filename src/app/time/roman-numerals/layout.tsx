import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roman Numeral Converter — Numbers to Roman Numerals & Back",
  description:
    "Convert numbers to Roman numerals and Roman numerals to numbers. See the current year, your birth year, and today's date in Roman numerals. Supports 1 to 3,999,999.",
  keywords: [
    "roman numeral converter",
    "roman numerals",
    "number to roman",
    "roman to number",
    "MMXXVI",
    "roman numeral chart",
    "roman numeral rules",
    "birth year roman numerals",
  ],
  openGraph: {
    title: "Roman Numeral Converter — Numbers to Roman Numerals & Back",
    description:
      "Convert any number to Roman numerals and back. See dates, years, and custom numbers in Roman notation.",
    url: "https://www.dateandtimezone.com/roman-numerals",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Roman Numeral Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Roman Numeral Converter — Numbers to Roman Numerals & Back",
    description:
      "Convert numbers to Roman numerals instantly. Charts, rules, and date conversions.",
  },
};

export default function RomanNumeralsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
