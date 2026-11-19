import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "When Can I See the ISS? — ISS Pass Predictions & Viewing Guide",
  description:
    "Find out when the International Space Station will fly over your location. Get ISS pass predictions, viewing tips, and sign up for NASA alerts. Free ISS viewing guide on DateAndTimezone.",
  keywords: [
    "ISS pass predictions",
    "see ISS",
    "when can I see the ISS",
    "ISS viewing times",
    "ISS visible passes",
    "spot the station",
    "ISS tonight",
    "ISS viewing guide",
    "International Space Station passes",
    "ISS alerts",
  ],
  openGraph: {
    title: "When Can I See the ISS? — ISS Pass Predictions",
    description:
      "Find out when the International Space Station will fly over your location. Viewing tips, live ISS position, and NASA alert sign-up.",
    url: "https://www.dateandtimezone.com/iss-passes",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone ISS Pass Predictions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "When Can I See the ISS? — ISS Pass Predictions",
    description:
      "Find out when the ISS will fly over your location. Viewing tips, live position, and NASA alert sign-up.",
  },
};

export default function ISSPassesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
