import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Call Planner — Best Time to Call Across Time Zones",
  description:
    "Find the best time to call friends and family in different time zones. See when both parties are awake with a visual 24-hour comparison.",
  keywords: [
    "call planner",
    "best time to call",
    "time zone call",
    "international call time",
    "when to call",
    "time difference call",
    "call across time zones",
  ],
  openGraph: {
    title: "Call Planner — Best Time to Call Across Time Zones",
    description:
      "Find the perfect time to call someone in another time zone. Visual awake/sleep comparison.",
    url: "https://www.dateandtimezone.com/call-planner",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Call Planner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Call Planner — Best Time to Call Across Time Zones",
    description:
      "Find the best time to call across time zones with a visual comparison tool.",
  },
};

export default function CallPlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
