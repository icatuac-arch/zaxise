import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timezone Challenge — Test Your World Time Knowledge",
  description:
    "Think you know world timezones? Take the DateAndTimezone Timezone Challenge! Guess the correct time for cities around the globe. Fun quiz with difficulty levels, scoring, and streak bonuses.",
  keywords: [
    "timezone quiz",
    "world time quiz",
    "timezone challenge",
    "geography quiz",
    "time zone game",
    "world clock quiz",
    "timezone trivia",
    "city time quiz",
  ],
  openGraph: {
    title: "Timezone Challenge — Test Your World Time Knowledge",
    description:
      "Think you know world timezones? Guess the correct time for cities around the globe. Fun quiz with scoring and streak bonuses.",
    url: "https://www.dateandtimezone.com/timezone-quiz",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone — Timezone Challenge Quiz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Timezone Challenge — Test Your World Time Knowledge",
    description:
      "Think you know world timezones? Take the quiz and test your knowledge!",
  },
};

export default function TimezoneQuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
