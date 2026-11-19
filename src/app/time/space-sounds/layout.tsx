import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sounds of Space — Hear the Universe",
  description:
    "Explore the sounds of space captured by NASA spacecraft. From Jupiter's radio emissions to pulsar signals, discover what the universe sounds like through sonified radio waves and plasma recordings.",
  keywords: [
    "space sounds",
    "NASA audio",
    "sounds of space",
    "jupiter sounds",
    "saturn radio waves",
    "pulsar sounds",
    "black hole sound",
    "voyager golden record",
    "space audio",
    "sonification",
  ],
  openGraph: {
    title: "Sounds of Space — Hear the Universe",
    description:
      "Explore the sounds of space captured by NASA spacecraft. Discover what the universe sounds like.",
    url: "https://www.dateandtimezone.com/space-sounds",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone — Sounds of Space",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sounds of Space — Hear the Universe",
    description:
      "From Jupiter's radio emissions to black hole pressure waves. Explore space sounds captured by NASA.",
  },
};

export default function SpaceSoundsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
