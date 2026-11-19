import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meeting Planner — Find the Best Time Across Time Zones",
  description:
    "Plan meetings across multiple time zones. Visual 24-hour grid shows working hours, sleep times, and suggests the best meeting slots for 2-8 participants worldwide.",
  keywords: [
    "meeting planner",
    "time zone meeting",
    "schedule across time zones",
    "best meeting time",
    "global meeting planner",
    "remote team scheduler",
    "working hours overlap",
    "international meeting time",
  ],
  openGraph: {
    title: "Meeting Planner — Find the Best Time Across Time Zones",
    description:
      "Plan meetings across time zones with a visual grid. Find the best time for everyone.",
    url: "https://www.dateandtimezone.com/meeting-planner",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Meeting Planner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meeting Planner — Find the Best Time Across Time Zones",
    description:
      "Visual meeting planner for global teams. Find overlapping working hours instantly.",
  },
};

export default function MeetingPlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
