import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Where Is Voyager 1? — Live Distance Tracker",
  description:
    "Track Voyager 1's live distance from Earth in real-time. See its speed, milestones, the Golden Record, and compare with Voyager 2. The farthest human-made object in space.",
  keywords: [
    "Voyager 1",
    "Voyager 1 distance",
    "Voyager tracker",
    "where is Voyager 1",
    "Voyager 1 live",
    "Voyager 2",
    "Golden Record",
    "interstellar space",
    "NASA Voyager",
    "farthest spacecraft",
    "Pale Blue Dot",
    "Carl Sagan",
  ],
  openGraph: {
    title: "Where Is Voyager 1? — Live Distance Tracker",
    description:
      "Real-time Voyager 1 distance tracker with speed, milestones, Golden Record info, and Voyager 2 comparison. Free on DateAndTimezone.",
    url: "https://www.dateandtimezone.com/voyager-tracker",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Voyager 1 Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Where Is Voyager 1? — Live Distance Tracker",
    description:
      "Track Voyager 1 in real-time — the farthest human-made object, now over 24.5 billion km from Earth.",
  },
};

export default function VoyagerTrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
