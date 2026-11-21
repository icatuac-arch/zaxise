"use client";

import { useEffect, useRef, useState } from "react";

interface FeedItem {
  title: string;
  description?: string;
  image_url?: string | null;
  image_alt?: string;
  href: string;
  category: string;
  tags?: string[];
  is_sponsored?: boolean;
}

interface FeedResponse {
  schema_version: number;
  items: FeedItem[];
}

type StaticCard = {
  artClass: string;
  emoji: string;
  artLabel: string;
  tag: string;
  title: string;
  desc: string;
  arrowText: string;
  href: string;
};

const STATIC_CARDS: StaticCard[] = [
  {
    artClass: "travel-art-weekend",
    emoji: "⛰",
    artLabel: "EXPLORE NEARBY",
    tag: "WEEKEND GETAWAYS",
    title: "Small trips. Big memories.",
    desc: "Scenic drives, parks and easy weekend inspiration near your city.",
    arrowText: "Explore escapes ↗",
    href: "/travel/destinations",
  },
  {
    artClass: "travel-art-india",
    emoji: "✈",
    artLabel: "BACK TO INDIA",
    tag: "INDIA TRAVEL",
    title: "India, beyond the usual.",
    desc: "Plan visits home with helpful guides, essentials and local discoveries.",
    arrowText: "Explore India ↗",
    href: "/travel/usa-to-india",
  },
  {
    artClass: "travel-art-food",
    emoji: "🥬",
    artLabel: "EAT WITH CONFIDENCE",
    tag: "FOOD & ESSENTIALS",
    title: "Good food, anywhere.",
    desc: "Find vegetarian food, Jain preferences and Indian groceries.",
    arrowText: "Find food & groceries ↗",
    href: "/travel/food",
  },
  {
    artClass: "travel-art-family",
    emoji: "☀",
    artLabel: "TRAVEL TOGETHER",
    tag: "FAMILY TRIP PLANNER",
    title: "Made for your kind of trip.",
    desc: "Build relaxed plans for kids, parents and senior travelers.",
    arrowText: "Start planning ↗",
    href: "/travel/plan",
  },
];

const BASE = "";

function safePath(href: string): string | null {
  try {
    // Allow relative paths starting with /travel
    if (href.startsWith("/travel")) return href;
    const u = new URL(href);
    if (u.pathname.startsWith("/travel")) return u.href;
    return null;
  } catch {
    return null;
  }
}

const ALLOWED_CATEGORIES = new Set(["destination", "guide", "tool", "itinerary", "collection"]);

export default function TravelFeedWidget() {
  const [city, setCity] = useState("us-ca");
  const [feedStatus, setFeedStatus] = useState("Preview cards · Live curated feed connects at deployment");
  const [feedCards, setFeedCards] = useState<FeedItem[] | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    let id = ++requestIdRef.current;
    setFeedCards(null);
    setFeedStatus("Preview cards · Checking for published travel updates");

    async function load() {
      try {
        const url = `/api/travel/home-feed?region=${encodeURIComponent(city)}&limit=6`;
        const res = await fetch(url, {
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(7000),
        });
        if (!res.ok) throw new Error("Feed unavailable");
        const data: FeedResponse = await res.json();
        if (id !== requestIdRef.current) return;
        if (data.schema_version !== 1 || !Array.isArray(data.items)) throw new Error("Unexpected contract");
        const valid = data.items
          .filter((item) => item && ALLOWED_CATEGORIES.has(item.category) && item.title && safePath(item.href))
          .slice(0, 6);
        if (valid.length) {
          setFeedCards(valid);
          setFeedStatus("Curated travel picks · Published feed");
        } else {
          setFeedStatus("Explore our travel guides · Curated cards");
        }
      } catch {
        if (id === requestIdRef.current) {
          setFeedStatus("Explore our travel guides · Curated preview");
        }
      }
    }

    load();
  }, [city]);

  return (
    <section
      aria-labelledby="travel-heading"
      id="travel"
      style={{
        margin: "34px 0 38px",
        padding: "28px",
        background: "linear-gradient(145deg, #fff9f6 0%, #fff 48%, #fcf0f3 100%)",
        border: "1px solid #ead9dc",
        borderRadius: 26,
        boxShadow: "0 16px 45px #631b3610",
      }}
    >
      {/* Heading row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 18,
          marginBottom: 19,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontWeight: 800,
              letterSpacing: "1.9px",
              fontSize: 11,
              color: "#8c3150",
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: "#ba8d46", marginRight: 5 }}>✦</span>
            ZAXISE TRAVEL{" "}
            <span
              style={{
                background: "#f5e3e8",
                color: "#8d3654",
                padding: "4px 8px",
                borderRadius: 20,
                letterSpacing: ".5px",
                fontSize: 9,
                marginLeft: 7,
                fontWeight: 700,
              }}
            >
              NEW
            </span>
          </div>
          <h2
            id="travel-heading"
            style={{
              fontSize: "clamp(28px, 3.3vw, 42px)",
              letterSpacing: "-1.4px",
              margin: "9px 0 6px",
              color: "#342430",
              fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontWeight: 800,
            }}
          >
            Your next <em style={{ color: "#852447", fontStyle: "normal" }}>escape.</em>
          </h2>
          <p style={{ color: "#776771", maxWidth: 580, margin: 0, fontSize: 13, lineHeight: 1.6 }}>
            See the world. Feel at home. Discover places, plan better trips, and find food that fits your family.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 9, whiteSpace: "nowrap", fontSize: 12, color: "#695663" }}>
          <label htmlFor="travel-city">Ideas near</label>
          <select
            id="travel-city"
            aria-label="Choose home city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{
              borderRadius: 10,
              padding: "10px 27px 10px 10px",
              background: "#fff",
              border: "1px solid #e6d6db",
              color: "#66213e",
              maxWidth: 180,
              fontSize: 12,
            }}
          >
            <option value="us-ca">Bay Area, CA</option>
            <option value="us-tx">Dallas / Houston, TX</option>
            <option value="us-wa">Seattle, WA</option>
            <option value="us-ny">New York / NJ</option>
            <option value="us-il">Chicago, IL</option>
            <option value="global">Anywhere</option>
          </select>
        </div>
      </div>

      {/* Quick links */}
      <div
        aria-label="Travel quick links"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 9,
          marginBottom: 17,
        }}
        className="travel-quick-grid"
      >
        {[
          { emoji: "🥗", label: "Vegetarian & Jain food", href: "/travel/food" },
          { emoji: "🛒", label: "Indian groceries", href: "/travel/food" },
          { emoji: "👨‍👩‍👧‍👦", label: "Family trip planner", href: "/travel/plan" },
          { emoji: "✈", label: "USA → India guide", href: "/travel/usa-to-india" },
        ].map((q) => (
          <a
            key={q.label}
            href={q.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "11px 12px",
              background: "#fff",
              border: "1px solid #eadde0",
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 650,
              textDecoration: "none",
              color: "#29232B",
              transition: "background .2s, transform .2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#fbf0f4";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#fff";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>{q.emoji}</span>
            {q.label}
            <b style={{ marginLeft: "auto", color: "#a67587" }}>↗</b>
          </a>
        ))}
      </div>

      {/* Cards */}
      <TravelCards feedCards={feedCards} />

      {/* Bottom bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginTop: 18,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#8b7b83", fontSize: 11 }}>
          <span style={{ fontSize: 17, color: "#a87488" }}>◎</span>
          <span>{feedStatus}</span>
        </div>
        <a
          href="/travel"
          style={{
            background: "#7b2043",
            color: "#fff",
            borderRadius: 11,
            padding: "12px 19px",
            fontSize: 13,
            fontWeight: 750,
            whiteSpace: "nowrap",
            boxShadow: "0 6px 16px #7b204324",
            textDecoration: "none",
            transition: "background .2s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#651631")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#7b2043")}
        >
          Explore all travel <span>↗</span>
        </a>
      </div>

      <style>{`
        @media (max-width: 1040px) {
          .travel-cards-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .travel-quick-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .travel-cards-grid {
            display: flex !important;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            padding-bottom: 10px;
            gap: 11px !important;
          }
          .travel-cards-grid > * {
            flex: 0 0 min(76vw, 275px);
            scroll-snap-align: start;
          }
          .travel-quick-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .travel-card-link { transition: none !important; }
        }
      `}</style>
    </section>
  );
}

function TravelCards({ feedCards }: { feedCards: FeedItem[] | null }) {
  if (feedCards && feedCards.length > 0) {
    return (
      <div
        className="travel-cards-grid"
        aria-live="polite"
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr 1fr 1fr",
          gap: 12,
        }}
      >
        {feedCards.map((item, i) => (
          <FeedCard key={item.href + i} item={item} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="travel-cards-grid"
      aria-live="polite"
      style={{
        display: "grid",
        gridTemplateColumns: "1.1fr 1fr 1fr 1fr",
        gap: 12,
      }}
    >
      {STATIC_CARDS.map((card) => (
        <StaticCard key={card.tag} card={card} />
      ))}
    </div>
  );
}

const ART_STYLES: Record<string, string> = {
  "travel-art-weekend":
    "radial-gradient(ellipse at 25% 115%, #f4d7ad 0%, transparent 65%), linear-gradient(135deg, #54354f, #995c79)",
  "travel-art-india":
    "radial-gradient(ellipse at 75% 120%, #f6cd93 0%, transparent 58%), linear-gradient(140deg, #863e5b, #b47076)",
  "travel-art-food":
    "radial-gradient(ellipse at 30% 110%, #e2e7bd 0%, transparent 60%), linear-gradient(140deg, #5d6956, #93a18a)",
  "travel-art-family":
    "radial-gradient(ellipse at 80% 100%, #ffe3bb 0%, transparent 60%), linear-gradient(140deg, #a97e7e, #deada3)",
};

function StaticCard({ card }: { card: StaticCard }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={card.href}
      className="travel-card-link"
      style={{
        background: "white",
        border: "1px solid #ecdfe2",
        borderRadius: 17,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        transition: "transform .2s, box-shadow .2s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 15px 26px #6b18351c" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: "relative",
          height: 147,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: ART_STYLES[card.artClass],
        }}
      >
        {/* Decorative ring */}
        <div
          style={{
            content: "''",
            position: "absolute",
            width: 170,
            height: 170,
            border: "1px solid rgba(255,255,255,0.33)",
            borderRadius: "50%",
            right: -30,
            top: -95,
            boxShadow: "0 0 0 25px rgba(255,255,255,0.075), 0 0 0 51px rgba(255,255,255,0.043)",
          }}
        />
        <span
          aria-hidden="true"
          style={{
            color: "#fff",
            fontSize: 73,
            opacity: 0.83,
            textShadow: "0 7px 25px #2b1b292a",
            transform: "rotate(-5deg)",
            display: "block",
            lineHeight: 1,
            position: "relative",
          }}
        >
          {card.emoji}
        </span>
        <span
          style={{
            position: "absolute",
            left: 13,
            top: 13,
            fontSize: 9,
            letterSpacing: "1.1px",
            fontWeight: 800,
            color: "white",
            background: "rgba(43, 29, 42, 0.33)",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "6px 9px",
            borderRadius: 99,
          }}
        >
          {card.artLabel}
        </span>
      </div>
      <div
        style={{
          padding: 16,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span
          style={{
            fontSize: 9,
            color: "#a34e6c",
            fontWeight: 800,
            letterSpacing: "1.1px",
            textTransform: "uppercase",
          }}
        >
          {card.tag}
        </span>
        <h3
          style={{
            margin: "7px 0 7px",
            fontSize: 17,
            lineHeight: 1.25,
            letterSpacing: "-.5px",
            color: "#362633",
            fontWeight: 790,
          }}
        >
          {card.title}
        </h3>
        <p
          style={{
            fontSize: 12,
            color: "#746771",
            lineHeight: 1.5,
            margin: "0 0 17px",
            flex: 1,
          }}
        >
          {card.desc}
        </p>
        <span style={{ fontSize: 12, color: "#842547", fontWeight: 750 }}>
          {card.arrowText}
        </span>
      </div>
    </a>
  );
}

function FeedCard({ item }: { item: FeedItem }) {
  const [hovered, setHovered] = useState(false);
  const href = item.href.startsWith("/travel") ? item.href : item.href;
  const tagText = (item.tags || []).slice(0, 2).join(" · ").toUpperCase() || "EXPLORE";

  return (
    <a
      href={href}
      className="travel-card-link"
      style={{
        background: "white",
        border: "1px solid #ecdfe2",
        borderRadius: 17,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        transition: "transform .2s, box-shadow .2s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 15px 26px #6b18351c" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: "relative",
          height: 147,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: ART_STYLES["travel-art-weekend"],
        }}
      >
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.image_alt || ""}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <span
            aria-hidden="true"
            style={{
              color: "#fff",
              fontSize: 73,
              opacity: 0.83,
              transform: "rotate(-5deg)",
              display: "block",
              lineHeight: 1,
              position: "relative",
            }}
          >
            ✦
          </span>
        )}
        <span
          style={{
            position: "absolute",
            left: 13,
            top: 13,
            fontSize: 9,
            letterSpacing: "1.1px",
            fontWeight: 800,
            color: "white",
            background: "rgba(43, 29, 42, 0.33)",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "6px 9px",
            borderRadius: 99,
          }}
        >
          {item.is_sponsored ? "SPONSORED" : item.category.toUpperCase()}
        </span>
      </div>
      <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontSize: 9,
            color: "#a34e6c",
            fontWeight: 800,
            letterSpacing: "1.1px",
            textTransform: "uppercase",
          }}
        >
          {tagText}
        </span>
        <h3
          style={{
            margin: "7px 0 7px",
            fontSize: 17,
            lineHeight: 1.25,
            letterSpacing: "-.5px",
            color: "#362633",
            fontWeight: 790,
          }}
        >
          {item.title}
        </h3>
        <p
          style={{
            fontSize: 12,
            color: "#746771",
            lineHeight: 1.5,
            margin: "0 0 17px",
            flex: 1,
          }}
        >
          {item.description || "Discover travel inspiration and practical guides."}
        </p>
        <span style={{ fontSize: 12, color: "#842547", fontWeight: 750 }}>
          Explore →
        </span>
      </div>
    </a>
  );
}
