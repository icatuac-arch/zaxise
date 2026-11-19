import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Space Launch Schedule — Upcoming Rocket Launches & Countdown Timers",
  description:
    "Track upcoming space launches worldwide with live countdown timers. SpaceX, Rocket Lab, ULA, and more. Mission details, launch sites, and live webcast links. Free on DateAndTimezone.",
  keywords: [
    "space launch schedule",
    "upcoming rocket launches",
    "spacex launch",
    "rocket lab launch",
    "ula launch",
    "launch countdown",
    "space launch live",
    "falcon 9 launch",
    "launch schedule 2026",
    "rocket launch tracker",
    "kennedy space center launches",
    "cape canaveral launches",
    "space launch calendar",
    "next rocket launch",
    "live space launch",
  ],
  openGraph: {
    title: "Space Launch Schedule — Upcoming Rocket Launches & Countdowns",
    description:
      "Track upcoming space launches worldwide with live countdowns. SpaceX, Rocket Lab, ULA, and more. Free on DateAndTimezone.",
    url: "https://www.dateandtimezone.com/launches",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Space Launch Schedule",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Space Launch Schedule — Upcoming Rocket Launches & Countdowns",
    description:
      "Track upcoming space launches worldwide with live countdown timers. SpaceX, Rocket Lab, ULA, and more.",
  },
};

export default function LaunchesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
