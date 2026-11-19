import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "History of Space — From Big Bang to Today | DateAndTimezone",
  description:
    "Explore 13.8 billion years of cosmic history on a zoomable visual timeline. From the Big Bang through the formation of Earth to the Space Age.",
  keywords: [
    "space timeline",
    "history of the universe",
    "big bang timeline",
    "cosmic history",
    "space age timeline",
    "formation of earth",
    "history of space exploration",
    "universe timeline",
    "cosmic evolution",
    "solar system formation",
  ],
  openGraph: {
    title: "History of Space — From Big Bang to Today",
    description:
      "Explore 13.8 billion years of cosmic history on a zoomable visual timeline on DateAndTimezone.",
    url: "https://www.dateandtimezone.com/space-timeline",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Space Timeline",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "History of Space — From Big Bang to Today",
    description:
      "Explore 13.8 billion years of cosmic history on a zoomable visual timeline.",
  },
};

export default function SpaceTimelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
