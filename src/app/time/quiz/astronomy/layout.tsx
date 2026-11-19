import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Astronomy Basics Quiz — Stars, Constellations & The Cosmos",
  description:
    "Test your astronomy knowledge with 15 trivia questions about stars, constellations, galaxies, and the cosmos. Fun quiz with timer and scoring.",
  keywords: [
    "astronomy quiz",
    "stars quiz",
    "constellation quiz",
    "galaxy trivia",
    "space knowledge",
    "cosmos quiz",
  ],
  openGraph: {
    title: "Astronomy Basics Quiz — Stars, Constellations & The Cosmos",
    description:
      "Test your astronomy knowledge about stars, constellations, and the cosmos!",
    url: "https://www.dateandtimezone.com/quiz/astronomy",
  },
};

export default function AstronomyQuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
