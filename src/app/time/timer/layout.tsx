import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Timer — Free Countdown Timer",
  description:
    "Free online countdown timer with hours, minutes, and seconds. Quick presets, multiple simultaneous timers with labels, progress bars, and audio alerts. Perfect for cooking, workouts, and study sessions.",
  keywords: [
    "online timer",
    "countdown timer",
    "timer",
    "free timer",
    "web timer",
    "kitchen timer",
    "egg timer",
    "multiple timers",
    "countdown clock",
    "set timer online",
  ],
  openGraph: {
    title: "Online Timer — Free Countdown Timer",
    description:
      "Free countdown timer with quick presets, multiple simultaneous timers, labels, progress bars, and audio alerts.",
    url: "https://www.dateandtimezone.com/timer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Online Timer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Timer — Free Countdown Timer",
    description:
      "Free countdown timer with presets, multiple timers, labels, and audio alerts.",
  },
};

export default function TimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
