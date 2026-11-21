"use client";

import { useState, useEffect } from "react";

const FACTS = [
  "India uses one standard time zone, UTC+5:30, across the entire country.",
  "The United States and India both have federal systems of government.",
  "Chess developed from earlier games played in India, including chaturanga.",
  "The Golden Gate Bridge opened in 1937.",
  "India is the world's largest democracy by population.",
  "Honey never spoils. Archaeologists have found 3,000-year-old honey in Egyptian tombs that was still edible.",
  "Octopuses have three hearts, nine brains, and blue blood.",
  "A day on Venus is longer than a year on Venus.",
  "The shortest war in history lasted 38 to 45 minutes between Britain and Zanzibar.",
  "The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion.",
  "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.",
  "Water can boil and freeze at the same time — it's called the triple point.",
];

export default function DiscoverSection() {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    setFactIndex(Math.floor(Math.random() * FACTS.length));
  }, []);

  const nextFact = () => {
    setFactIndex((i) => (i + 1) % FACTS.length);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Did You Know */}
      <section
        className="rounded-[20px] border border-[#E9DFE4] bg-white p-5"
        style={{ boxShadow: "0 12px 36px #6A30400A" }}
      >
        <div className="text-[11px] font-[800] uppercase tracking-[1.4px] text-green">
          Did you know?
        </div>
        <div
          className="my-3 text-[19px] font-[600] leading-[1.5]"
          style={{ letterSpacing: "-0.35px" }}
        >
          {FACTS[factIndex]}
        </div>
        <button
          onClick={nextFact}
          className="border-0 bg-transparent p-0 text-[13px] font-[750] text-[#801C45] hover:text-[#631437] transition-colors"
        >
          Another fact →
        </button>
      </section>

      {/* Space & Astronomy */}
      <section
        className="rounded-[20px] p-5"
        style={{
          background: "#FAF0F4",
          border: "1px solid #E9DFE4",
          boxShadow: "0 12px 36px #6A30400A",
        }}
      >
        <div className="text-[11px] font-[800] uppercase tracking-[1.4px] text-[#801C45]">
          Beyond our world
        </div>
        <h3
          className="mt-3 text-[20px] font-[750] leading-[1.25]"
          style={{ letterSpacing: "-0.5px" }}
        >
          Space &amp; astronomy
        </h3>
        <p className="mt-2 text-[13px] text-muted">
          Explore NASA&apos;s daily astronomy image and the stories behind it.
        </p>
        <a
          href="https://apod.nasa.gov/apod/astropix.html"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-[13px] font-[750] text-[#801C45] hover:text-[#631437] transition-colors"
        >
          NASA picture of the day ↗
        </a>
      </section>

      {/* Travel inspiration — links to /travel */}
      <section
        className="rounded-[20px] p-5"
        style={{
          background: "#FFF5F8",
          border: "1px solid #EAD9DC",
          boxShadow: "0 12px 36px #6A30400A",
        }}
      >
        <div className="text-[11px] font-[800] uppercase tracking-[1.4px] text-[#801C45]">
          Weekend inspiration
        </div>
        <h3
          className="mt-3 text-[20px] font-[750] leading-[1.25]"
          style={{ letterSpacing: "-0.5px" }}
        >
          Travel smarter, together
        </h3>
        <p className="mt-2 text-[13px] text-muted">
          Discover destinations, vegetarian food, nearby escapes and family-friendly itineraries.
        </p>
        <a
          href="/travel"
          className="mt-3 inline-block text-[13px] font-[750] text-[#801C45] hover:text-[#631437] transition-colors"
        >
          Open ZAXISE Travel ↗
        </a>
      </section>
    </div>
  );
}
