import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Space Trivia — How Well Do You Know Space?",
  description:
    "Test your space knowledge with 15 trivia questions about planets, missions, astronauts, and the cosmos. Fun quiz with timer, scoring, and streak bonuses.",
  keywords: [
    "space quiz",
    "space trivia",
    "astronomy quiz",
    "planet quiz",
    "NASA quiz",
    "solar system quiz",
  ],
  openGraph: {
    title: "Space Trivia — How Well Do You Know Space?",
    description:
      "Test your space knowledge with trivia about planets, missions, and astronauts.",
    url: "https://www.dateandtimezone.com/quiz/space",
  },
};

export default function SpaceQuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
