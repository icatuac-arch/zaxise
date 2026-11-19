import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Countdown Creator — Custom Countdown Timers",
  description:
    "Create beautiful custom countdown timers for any event. Track days until New Year, eclipses, birthdays, and more. Save, share, and celebrate with confetti. Free countdown creator on DateAndTimezone.",
  keywords: [
    "countdown timer",
    "countdown creator",
    "custom countdown",
    "event countdown",
    "days until",
    "countdown clock",
    "New Year countdown",
    "eclipse countdown",
    "shareable countdown",
    "countdown to date",
  ],
  openGraph: {
    title: "Countdown Creator — Custom Countdown Timers",
    description:
      "Create beautiful custom countdown timers for any event. Save, share, and celebrate with confetti when the countdown reaches zero.",
    url: "https://www.dateandtimezone.com/countdown",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Countdown Creator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Countdown Creator — Custom Countdown Timers",
    description:
      "Create beautiful custom countdown timers for any event. Save, share, and celebrate.",
  },
};

export default function CountdownLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
