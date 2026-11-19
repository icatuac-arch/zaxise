import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz Hub — Test Your Knowledge",
  description:
    "Challenge yourself with fun quizzes about timezones, space, flags, the moon, and astronomy. Track your scores and compete with yourself!",
  keywords: [
    "quiz",
    "trivia",
    "timezone quiz",
    "space quiz",
    "flags quiz",
    "moon quiz",
    "astronomy quiz",
    "knowledge test",
  ],
  openGraph: {
    title: "Quiz Hub — Test Your Knowledge | DateAndTimezone",
    description:
      "Challenge yourself with fun quizzes about timezones, space, flags, the moon, and astronomy.",
    url: "https://www.dateandtimezone.com/quiz",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone — Quiz Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiz Hub — Test Your Knowledge | DateAndTimezone",
    description:
      "Challenge yourself with fun quizzes about timezones, space, flags, the moon, and astronomy.",
  },
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
