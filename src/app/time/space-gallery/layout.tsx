import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Space Photo Gallery — NASA Astronomy Pictures",
  description:
    "Browse stunning space photography from NASA. Today's Astronomy Picture of the Day, curated collections of nebulae, galaxies, planets, and more. All images are public domain.",
  keywords: [
    "NASA images",
    "space photos",
    "astronomy pictures",
    "APOD",
    "nebula photos",
    "galaxy images",
    "space photography",
    "NASA gallery",
    "earth from space",
    "mars photos",
  ],
  openGraph: {
    title: "Space Photo Gallery — NASA Astronomy Pictures",
    description:
      "Browse stunning space photography from NASA. APOD, nebulae, galaxies, planets, and more.",
    url: "https://www.dateandtimezone.com/space-gallery",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone — Space Photo Gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Space Photo Gallery — NASA Astronomy Pictures",
    description:
      "Browse stunning space photography from NASA. Public domain imagery of the cosmos.",
  },
};

export default function SpaceGalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
