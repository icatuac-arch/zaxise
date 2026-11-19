import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flags & Countries Quiz — Match Flags to Countries",
  description:
    "Can you match country flags to their names? Test your geography knowledge with this fun flag quiz featuring 20 countries from around the world.",
  keywords: [
    "flag quiz",
    "country flag quiz",
    "geography quiz",
    "flags of the world",
    "country trivia",
  ],
  openGraph: {
    title: "Flags & Countries Quiz — Match Flags to Countries",
    description:
      "Can you match country flags to their names? Test your geography knowledge!",
    url: "https://www.dateandtimezone.com/quiz/flags",
  },
};

export default function FlagsQuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
