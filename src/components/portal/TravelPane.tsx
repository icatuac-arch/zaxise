"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, MapPin, Compass, ChevronRight } from "lucide-react";

interface Destination {
  name: string;
  country: string;
  tagline: string;
  image: string;
  flag: string;
}

// Rotating featured destinations
const DESTINATIONS: Destination[] = [
  { name: "Kyoto", country: "Japan", tagline: "Ancient temples & cherry blossoms", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=250&fit=crop", flag: "🇯🇵" },
  { name: "Santorini", country: "Greece", tagline: "White cliffs & Aegean sunsets", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=250&fit=crop", flag: "🇬🇷" },
  { name: "Marrakech", country: "Morocco", tagline: "Vibrant souks & desert magic", image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=400&h=250&fit=crop", flag: "🇲🇦" },
  { name: "Queenstown", country: "New Zealand", tagline: "Adventure capital of the world", image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400&h=250&fit=crop", flag: "🇳🇿" },
  { name: "Reykjavik", country: "Iceland", tagline: "Northern lights & geothermal wonders", image: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=400&h=250&fit=crop", flag: "🇮🇸" },
  { name: "Jaipur", country: "India", tagline: "Pink city of palaces & forts", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=250&fit=crop", flag: "🇮🇳" },
];

export default function TravelPane() {
  const [featured, setFeatured] = useState<Destination[]>([]);

  useEffect(() => {
    // Pick 3 random destinations each load
    const shuffled = [...DESTINATIONS].sort(() => 0.5 - Math.random());
    setFeatured(shuffled.slice(0, 3));
  }, []);

  return (
    <section className="rounded-2xl border border-border bg-surface/50 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
            <Compass className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Travel Inspiration</h2>
            <p className="text-xs text-muted">Destinations worth exploring</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {featured.map((dest, i) => (
          <motion.div
            key={dest.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-xl border border-border"
          >
            <div className="relative h-32 overflow-hidden">
              <img
                src={dest.image}
                alt={dest.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{dest.flag}</span>
                  <h3 className="text-sm font-bold text-white">{dest.name}</h3>
                </div>
                <p className="text-[10px] text-white/70 mt-0.5">
                  {dest.tagline}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick links */}
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { icon: MapPin, label: "Hidden Gems", color: "text-emerald-400" },
          { icon: Globe, label: "Top Countries", color: "text-blue-400" },
          { icon: Compass, label: "Travel Quiz", color: "text-purple-400" },
        ].map(({ icon: Icon, label, color }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-muted border border-border"
          >
            <Icon className={`h-3 w-3 ${color}`} />
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
