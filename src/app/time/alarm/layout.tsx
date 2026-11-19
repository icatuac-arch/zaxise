import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Alarm Clock — Set Free Web Alarms",
  description:
    "Set free online alarms with custom times, snooze, and pleasant audio tones. Support for multiple alarms, quick presets, and localStorage persistence. No app install needed.",
  keywords: [
    "online alarm clock",
    "alarm clock",
    "web alarm",
    "set alarm",
    "free alarm clock",
    "alarm timer",
    "wake up alarm",
    "browser alarm",
    "alarm online",
    "digital alarm clock",
  ],
  openGraph: {
    title: "Online Alarm Clock — Set Free Web Alarms",
    description:
      "Set free online alarms with custom times, snooze, and pleasant audio tones. Multiple alarms, quick presets, no install needed.",
    url: "https://www.dateandtimezone.com/alarm",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Online Alarm Clock",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Alarm Clock — Set Free Web Alarms",
    description:
      "Set free online alarms with snooze, pleasant tones, and quick presets. No install needed.",
  },
};

export default function AlarmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
