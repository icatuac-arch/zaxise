import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ISS Live Tracker — Real-Time International Space Station Position",
  description:
    "Track the International Space Station in real time. See its live position on a world map, current speed, altitude, orbital path, people in space, and fascinating ISS facts. Free ISS tracker on DateAndTimezone.",
  keywords: [
    "ISS tracker",
    "International Space Station",
    "ISS live position",
    "ISS location",
    "track ISS",
    "space station tracker",
    "people in space",
    "ISS speed",
    "ISS altitude",
    "ISS orbit",
    "where is the ISS",
    "ISS map",
  ],
  openGraph: {
    title: "ISS Live Tracker — Real-Time Space Station Position",
    description:
      "Track the International Space Station in real time. See its live position, speed, altitude, who is in space, and more.",
    url: "https://www.dateandtimezone.com/iss-tracker",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone ISS Live Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ISS Live Tracker — Real-Time Space Station Position",
    description:
      "Track the ISS in real time. See its position, speed, altitude, people in space, and fascinating facts.",
  },
};

export default function ISSTrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
