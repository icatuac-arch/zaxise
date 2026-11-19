"use client";

import { useEffect, useState, useCallback } from "react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import HeroSection from "./HeroSection";
import EcosystemTiles from "./EcosystemTiles";
import EventsPane from "./EventsPane";
import DealsPane from "./DealsPane";
import QuickTools from "./QuickTools";
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

      <main className="mx-auto max-w-[1260px] px-6 pb-12 pt-6">
        {/* Top line */}
        <div className="mb-4 flex items-center justify-between text-muted text-[11px]">
          <span>{currentDate}</span>
          <span>🇺🇸 &nbsp; Made for the Indian-American community</span>
        </div>

        <HeroSection />

        {/* Ecosystem */}
        <div className="mt-8 mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-[29px] leading-tight">
              Everything you need, one place.
            </h2>
            <p className="mt-1 text-[13px] text-muted">
              Discover the Zaxise ecosystem.
            </p>
          </div>
        </div>
        <EcosystemTiles searchQuery={searchQuery} />

        {/* Daily pulse */}
        <div className="mt-8 mb-4">
          <h2 className="font-serif text-[29px] leading-tight">
            Your daily pulse
          </h2>
          <p className="mt-1 text-[13px] text-muted">
            Community, savings and useful discoveries.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <EventsPane />
          <DealsPane />
        </div>

        {/* Tools */}
        <div
          id="tools"
          className="mt-8 mb-4 flex items-end justify-between gap-3"
        >
          <div>
            <h2 className="font-serif text-[29px] leading-tight">
              Little tools. Big convenience.
            </h2>
            <p className="mt-1 text-[13px] text-muted">
              Quick utilities for work, home and everyday life.
            </p>
          </div>
          <a
            href="/tools"
            className="shrink-0 text-[13px] font-bold text-gold-dark"
          >
            All tools directory ↗
          </a>
        </div>
        <QuickTools searchQuery={searchQuery} />

        {/* Discover */}
        <div id="discover" className="mt-8 mb-4">
          <h2 className="font-serif text-[29px] leading-tight">
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
