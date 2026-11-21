"use client";

import { useEffect, useState } from "react";
import { Compass, ArrowRight, Plane, MapPin } from "lucide-react";

interface FeedItem {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  image_alt: string;
  href: string;
  category: string;
  tags: string[];
}

const FALLBACK_GRADIENTS = [
  "from-rose-800 to-amber-700",
  "from-indigo-800 to-purple-700",
  "from-emerald-800 to-teal-700",
  "from-orange-800 to-red-700",
  "from-blue-800 to-cyan-700",
  "from-violet-800 to-fuchsia-700",
];

export default function TravelFeedWidget() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/travel/home-feed?limit=4")
      .then((r) => r.json())
      .then((data) => setItems(data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-8 text-center text-[13px] text-muted">
        Loading travel inspiration...
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <section id="travel">
      <div className="flex items-end justify-between gap-3 mb-[14px]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Plane className="h-4 w-4 text-[#6548ef]" />
            <span className="text-[11px] font-[800] uppercase tracking-[1.4px] text-[#6548ef]">
              Your Next Escape
            </span>
          </div>
          <h2
            className="text-[25px] font-[750] leading-[1.2]"
            style={{ letterSpacing: "-0.8px" }}
          >
            Travel inspiration
          </h2>
        </div>
        <a
          href="/travel"
          className="shrink-0 flex items-center gap-1 text-[13px] font-[750] text-[#6245d9] hover:text-[#5234d5] transition-colors"
        >
          Explore Travel <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {items.slice(0, 4).map((item, i) => (
          <a
            key={item.id}
            href={item.href}
            className="card-lift group relative overflow-hidden rounded-[20px] border border-[#ebebf3] bg-white"
            style={{ boxShadow: "0 3px 12px rgba(37,41,72,0.016)" }}
          >
            {/* Image */}
            <div className="relative h-32 overflow-hidden">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.image_alt}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div
                  className={`h-full w-full bg-gradient-to-br ${FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length]} flex items-center justify-center`}
                >
                  <Compass className="h-8 w-8 text-white/40" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-3 right-3">
                <h3 className="text-[14px] font-[700] text-white leading-snug">
                  {item.title}
                </h3>
              </div>
            </div>

            {/* Body */}
            <div className="p-3">
              <p className="text-[12px] text-muted line-clamp-2 leading-relaxed">
                {item.description}
              </p>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-[600] text-[#6245d9]">
                <MapPin className="h-3 w-3" />
                Explore →
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
