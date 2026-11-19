import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zaxise — Everything You Need, One Platform",
  description:
    "Your all-in-one digital platform. Events, deals, tools, travel, trivia, calculators, social media, and more — all under one roof.",
  keywords: [
    "events",
    "deals",
    "tools",
    "travel",
    "trivia",
    "calculators",
    "social media",
    "ticketing",
    "Indian programs",
    "media tools",
  ],
  openGraph: {
    title: "Zaxise — Everything You Need, One Platform",
    description:
      "Your all-in-one digital platform. Events, deals, tools, travel, trivia, calculators, social media, and more.",
    type: "website",
    url: "https://zaxise.com",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
