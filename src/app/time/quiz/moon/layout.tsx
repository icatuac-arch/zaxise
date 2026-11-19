import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moon & Eclipse Quiz — Test Your Lunar Knowledge",
  description:
    "How much do you know about the Moon, eclipses, and tides? Test your lunar knowledge with 15 trivia questions about moon phases, eclipses, and more.",
  keywords: [
    "moon quiz",
    "eclipse quiz",
    "lunar trivia",
    "moon phases quiz",
    "astronomy quiz",
    "tides quiz",
  ],
  openGraph: {
    title: "Moon & Eclipse Quiz — Test Your Lunar Knowledge",
    description:
      "Test your knowledge about the Moon, eclipses, and tides!",
    url: "https://www.dateandtimezone.com/quiz/moon",
  },
};

export default function MoonQuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
