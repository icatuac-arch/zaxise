import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solar Weather & Aurora Forecast — Live Kp Index & Viewing Guide",
  description:
    "Live solar weather dashboard with real-time Kp index from NOAA, aurora visibility forecast, Solar Cycle 25 predictions, and the best locations worldwide to see the Northern and Southern Lights.",
  keywords: [
    "solar weather",
    "aurora forecast",
    "Kp index",
    "northern lights",
    "aurora borealis",
    "aurora australis",
    "solar cycle 25",
    "geomagnetic storm",
    "aurora viewing",
    "space weather",
    "NOAA solar data",
    "solar wind",
    "magnetosphere",
  ],
  openGraph: {
    title: "Solar Weather & Aurora Forecast — Live Kp Index & Viewing Guide",
    description:
      "Real-time solar weather data, aurora visibility forecast, and the best places to see the Northern Lights. Free on DateAndTimezone.",
    url: "https://www.dateandtimezone.com/solar-weather",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Solar Weather & Aurora Forecast",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Weather & Aurora Forecast — Live Kp Index",
    description:
      "Live Kp index, aurora forecast, Solar Cycle 25 data, and top aurora viewing destinations worldwide.",
  },
};

export default function SolarWeatherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
