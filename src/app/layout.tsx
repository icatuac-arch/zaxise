import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZAXISE — Your world, closer.",
  description:
    "Discover Indian events across America, stay connected to home, find useful tools and make everyday life a little easier.",
  openGraph: {
    title: "ZAXISE — Your world, closer.",
    description:
      "Events, deals, tools, time zones, travel, and more — all in one place for the Indian-American community.",
    type: "website",
    url: "https://zaxise.com",
  },
};

export const viewport: Viewport = {
  themeColor: "#10243d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
