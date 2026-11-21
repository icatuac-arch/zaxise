"use client";

import { useEffect, useState } from "react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import HeroSection from "./HeroSection";
import EcosystemTiles from "./EcosystemTiles";
import EventsPane from "./EventsPane";
import DealsPane from "./DealsPane";
import HousingCalcPane from "./HousingCalcPane";
import QuickTools from "./QuickTools";
import TravelFeedWidget from "./TravelFeedWidget";
import DiscoverSection from "./DiscoverSection";

export default function ZaxiseHome() {
  const [currentDate, setCurrentDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader searchQuery={searchQuery} onSearch={setSearchQuery} />

      <main className="mx-auto max-w-[1260px] px-6 pb-14 pt-6">
        {/* Top line */}
        <div className="mb-4 flex items-center justify-between text-muted text-[12px] font-[600]">
          <span>{currentDate}</span>
          <span>🇺🇸 &nbsp; Made for the Indian-American community</span>
        </div>

        {/* 1. Hero */}
        <HeroSection />

        {/* 2. Your daily pulse — Events + Deals side by side */}
        <div className="mt-[34px] mb-[14px]">
          <h2 className="text-[25px] font-[750] leading-[1.2]" style={{ letterSpacing: "-0.8px" }}>
            Your daily pulse
          </h2>
          <p className="mt-1 text-[13px] text-muted">
            Community, savings and useful discoveries.
          </p>
        </div>
        <div className="grid gap-[18px] lg:grid-cols-[1.3fr_1fr]">
          <EventsPane />
          <DealsPane />
        </div>

        {/* 3. Rent or Buy housing calculator */}
        <div className="mt-[20px]">
          <HousingCalcPane />
        </div>

        {/* 3.5 Your Next Escape — travel feed */}
        <div className="mt-[34px]">
          <TravelFeedWidget />
        </div>

        {/* 4. Explore ZAXISE ecosystem tiles */}
        <div className="mt-[34px] mb-[14px] flex items-end justify-between gap-3">
          <div>
            <h2 className="text-[25px] font-[750] leading-[1.2]" style={{ letterSpacing: "-0.8px" }}>
              Explore ZAXISE
            </h2>
            <p className="mt-1 text-[13px] text-muted">
              Discover the Zaxise ecosystem.
            </p>
          </div>
        </div>
        <EcosystemTiles searchQuery={searchQuery} />

        {/* 5. Your everyday toolkit */}
        <div
          id="tools"
          className="mt-[34px] mb-[14px] flex items-end justify-between gap-3"
        >
          <div>
            <h2 className="text-[25px] font-[750] leading-[1.2]" style={{ letterSpacing: "-0.8px" }}>
              Your everyday toolkit
            </h2>
            <p className="mt-1 text-[13px] text-muted">
              Quick utilities for work, home and everyday life.
            </p>
          </div>
          <a
            href="/tools"
            className="shrink-0 text-[13px] font-[750] text-[#6245d9] hover:text-[#5234d5] transition-colors"
          >
            Original tools directory ↗
          </a>
        </div>
        <QuickTools searchQuery={searchQuery} />

        {/* 6. A little more to explore */}
        <div id="discover" className="mt-[34px] mb-[14px]">
          <h2 className="text-[25px] font-[750] leading-[1.2]" style={{ letterSpacing: "-0.8px" }}>
            A little more to explore
          </h2>
          <p className="mt-1 text-[13px] text-muted">
            Make curiosity part of your day.
          </p>
        </div>
        <DiscoverSection />
      </main>

      <SiteFooter />
    </div>
  );
}
