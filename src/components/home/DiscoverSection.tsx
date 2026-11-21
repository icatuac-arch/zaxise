"use client";

import { useState, useEffect } from "react";

const FACTS = [
  "India uses one standard time zone, UTC+5:30, across the entire country.",
  "The United States and India both have federal systems of government.",
  "Chess developed from earlier games played in India, including chaturanga.",
  "The Golden Gate Bridge opened in 1937.",
  "India is the world's largest democracy by population.",
  "Honey never spoils. Archaeologists have found 3,000-year-old honey in Egyptian tombs.",
  "Octopuses have three hearts, nine brains, and blue blood.",
  "A day on Venus is longer than a year on Venus.",
  "The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion.",
  "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.",
  "Water can boil and freeze at the same time — it's called the triple point.",
];

export default function DiscoverSection() {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    setFactIndex(Math.floor(Math.random() * FACTS.length));
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Did You Know */}
      <section
        className="rounded-[20px] border bg-white p-5"
        style={{ borderColor: "#E9DFE4", boxShadow: "0 12px 36px #6A30400A" }}
      >
        <div className="text-[11px] font-[800] uppercase tracking-[1.4px]" style={{ color: "#801C45" }}>
          Did you know?
        </div>
        <div className="my-3 text-[17px] font-[600] leading-[1.5]" style={{ letterSpacing: "-0.35px" }}>
          {FACTS[factIndex]}
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setFactIndex((i) => (i + 1) % FACTS.length)}
            className="border-0 bg-transparent p-0 text-[13px] font-[750] transition-colors"
            style={{ color: "#801C45" }}
          >
            Another fact →
          </button>
          <a href="/facts" className="text-[11px] font-[650]" style={{ color: "#801C45" }}>
            40K+ facts ↗
          </a>
        </div>
      </section>

      {/* Time & Space */}
      <section
        className="rounded-[20px] p-5"
        style={{ background: "#FAF0F4", border: "1px solid #E9DFE4", boxShadow: "0 12px 36px #6A30400A" }}
      >
        <div className="text-[11px] font-[800] uppercase tracking-[1.4px]" style={{ color: "#801C45" }}>
          Beyond our world
        </div>
        <h3 className="mt-3 text-[18px] font-[750] leading-[1.25]" style={{ letterSpacing: "-0.5px" }}>
          Time &amp; Space
        </h3>
        <p className="mt-2 text-[12px]" style={{ color: "#71646C" }}>
          World clocks, ISS tracker, NASA picture of the day, eclipses, moon phases and more.
        </p>
        <a href="/time" className="mt-3 inline-block text-[13px] font-[750]" style={{ color: "#801C45" }}>
          Explore time &amp; space ↗
        </a>
      </section>

      {/* Social Media */}
      <section
        className="rounded-[20px] p-5"
        style={{ background: "#FFF5F8", border: "1px solid #E9DFE4", boxShadow: "0 12px 36px #6A30400A" }}
      >
        <div className="text-[11px] font-[800] uppercase tracking-[1.4px]" style={{ color: "#801C45" }}>
          Grow your audience
        </div>
        <h3 className="mt-3 text-[18px] font-[750] leading-[1.25]" style={{ letterSpacing: "-0.5px" }}>
          Social Media Tools
        </h3>
        <p className="mt-2 text-[12px]" style={{ color: "#71646C" }}>
          Schedule posts, track analytics, manage all your social accounts. Free forever.
        </p>
        <a href="/social" className="mt-3 inline-block text-[13px] font-[750]" style={{ color: "#801C45" }}>
          Manage social ↗
        </a>
      </section>

      {/* Travel */}
      <section
        className="rounded-[20px] p-5"
        style={{ background: "#F5F8F5", border: "1px solid #DCE6DE", boxShadow: "0 12px 36px #6A30400A" }}
      >
        <div className="text-[11px] font-[800] uppercase tracking-[1.4px]" style={{ color: "#801C45" }}>
          Weekend inspiration
        </div>
        <h3 className="mt-3 text-[18px] font-[750] leading-[1.25]" style={{ letterSpacing: "-0.5px" }}>
          Travel smarter, together
        </h3>
        <p className="mt-2 text-[12px]" style={{ color: "#71646C" }}>
          Destinations, vegetarian food, nearby escapes and family-friendly itineraries.
        </p>
        <a href="/travel" className="mt-3 inline-block text-[13px] font-[750]" style={{ color: "#801C45" }}>
          Open Zaxise Travel ↗
        </a>
      </section>
    </div>
  );
}
