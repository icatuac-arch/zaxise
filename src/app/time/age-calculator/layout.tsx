import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Age Calculator — How Old Am I Exactly?",
  description:
    "Calculate your exact age in years, months, days, hours, minutes, and seconds. See heartbeats, breaths, life stats, generation, and birthday countdown.",
  keywords: [
    "age calculator",
    "how old am I",
    "exact age",
    "age in seconds",
    "age in days",
    "birthday countdown",
    "life statistics",
    "heartbeats since birth",
    "generation calculator",
    "day of birth calculator",
  ],
  openGraph: {
    title: "Age Calculator — How Old Am I Exactly?",
    description:
      "Find your exact age down to the second. Life stats, birthday countdown, and more on DateAndTimezone.",
    url: "https://www.dateandtimezone.com/age-calculator",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Age Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Age Calculator — How Old Am I Exactly?",
    description:
      "Calculate your exact age in every unit. Heartbeats, breaths, life stats, and more.",
  },
};

export default function AgeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
