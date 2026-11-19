import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Age on Other Planets — Planet Age Calculator",
  description:
    "Find out how old you are on Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, and Pluto. Calculate your weight and sunrises on every planet in the Solar System.",
  keywords: [
    "planet age calculator",
    "age on other planets",
    "age on mars",
    "age on jupiter",
    "planet birthday",
    "weight on other planets",
    "planetary year",
    "solar system calculator",
    "space age calculator",
    "how old am I on mars",
  ],
  openGraph: {
    title: "Your Age on Other Planets — Planet Age Calculator",
    description:
      "Calculate your age, weight, and number of sunrises on every planet in the Solar System. Fun interactive space calculator on DateAndTimezone.",
    url: "https://www.dateandtimezone.com/planet-age",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Planet Age Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Age on Other Planets — Planet Age Calculator",
    description:
      "How old are you on Mars? What would you weigh on Jupiter? Find out with our free planet calculator.",
  },
};

export default function PlanetAgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
