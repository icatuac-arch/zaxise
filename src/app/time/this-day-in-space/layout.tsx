import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "This Day in Space History — On This Day in Space",
  description:
    "Discover what happened in space exploration on this day. Browse historic launches, Moon landings, satellite deployments, and milestones for every day of the year.",
  keywords: [
    "this day in space",
    "space history today",
    "on this day in space",
    "space exploration history",
    "NASA history",
    "Apollo missions",
    "space shuttle history",
    "rocket launches history",
    "astronomy calendar",
    "space milestones",
  ],
  openGraph: {
    title: "This Day in Space History — On This Day in Space",
    description:
      "Discover what happened in space exploration on this day. Historic launches, Moon landings, and milestones for every day of the year.",
    url: "https://www.dateandtimezone.com/this-day-in-space",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone — This Day in Space History",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "This Day in Space History — On This Day in Space",
    description:
      "What happened in space on this day? Explore historic launches, landings, and discoveries for every day of the year.",
  },
};

export default function ThisDayInSpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
