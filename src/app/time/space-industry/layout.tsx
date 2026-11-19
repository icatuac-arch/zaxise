import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Space Industry & Jobs — Companies, Careers & Resources in Aerospace",
  description:
    "Explore the global space industry: top companies like SpaceX, NASA, Blue Origin, and more. Find space careers, job boards, industry stats, and resources. A free guide on DateAndTimezone.",
  keywords: [
    "space industry",
    "space jobs",
    "space careers",
    "aerospace jobs",
    "SpaceX careers",
    "NASA jobs",
    "Blue Origin careers",
    "space companies",
    "satellite companies",
    "launch providers",
    "space agencies",
    "space economy",
    "aerospace industry",
    "rocket companies",
    "space tourism",
    "earth observation",
    "defense aerospace",
    "space news",
    "space resources",
  ],
  openGraph: {
    title: "Space Industry & Jobs — Companies, Careers & Resources",
    description:
      "Directory of space companies, agencies, career links, and industry resources. From launch providers to satellite operators. Free on DateAndTimezone.",
    url: "https://www.dateandtimezone.com/space-industry",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DateAndTimezone Space Industry & Jobs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Space Industry & Jobs — Companies, Careers & Resources",
    description:
      "Explore the global space industry: top companies, career links, job boards, and resources for aerospace professionals.",
  },
};

export default function SpaceIndustryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
