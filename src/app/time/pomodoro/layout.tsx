import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pomodoro Timer — Focus & Productivity Tool",
  description:
    "Free online Pomodoro timer with configurable work sessions, short & long breaks, circular progress ring, session tracking, and daily stats. Boost your productivity with the Pomodoro Technique.",
  keywords: [
    "pomodoro timer",
    "pomodoro technique",
    "focus timer",
    "productivity timer",
    "work timer",
    "study timer",
    "pomodoro clock",
    "25 minute timer",
    "concentration timer",
    "free pomodoro",
  ],
  openGraph: {
    title: "Pomodoro Timer — Focus & Productivity Tool",
    description:
      "Free online Pomodoro timer with configurable sessions, progress ring, and daily stats. Boost productivity with the Pomodoro Technique.",
    url: "https://www.dateandtimezone.com/pomodoro",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Pomodoro Timer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pomodoro Timer — Focus & Productivity Tool",
    description:
      "Free Pomodoro timer with configurable sessions, progress ring, and daily stats.",
  },
};

export default function PomodoroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
