"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  Globe,
  Users,
  ExternalLink,
  Loader2,
} from "lucide-react";

interface SpaceArticle {
  id: number;
  title: string;
  url: string;
  image_url: string;
  news_site: string;
  summary: string;
  published_at: string;
}

interface APOD {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: string;
  date: string;
}

interface ISSData {
  position: { latitude: string; longitude: string } | null;
  astronauts: number;
}

export default function SpacePane() {
  const [news, setNews] = useState<SpaceArticle[]>([]);
  const [apod, setApod] = useState<APOD | null>(null);
  const [iss, setIss] = useState<ISSData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/portal/space-news").then((r) => r.json()),
      fetch("/api/portal/apod").then((r) => r.json()),
      fetch("/api/portal/iss").then((r) => r.json()),
    ])
      .then(([newsData, apodData, issData]) => {
        setNews(newsData.articles || []);
        if (apodData.title) setApod(apodData);
        setIss(issData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <section className="rounded-2xl border border-border bg-surface/50 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
          <Rocket className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Space &amp; Astronomy</h2>
          <p className="text-xs text-muted">News, ISS, and NASA&apos;s picture of the day</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted" />
        </div>
      ) : (
        <div className="space-y-5">
          {/* ISS + Astronauts bar */}
          {iss && (
            <div className="flex flex-wrap gap-3">
              {iss.position && (
                <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 px-3 py-2 text-xs">
                  <Globe className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300">
                    ISS at {parseFloat(iss.position.latitude).toFixed(1)}°,{" "}
                    {parseFloat(iss.position.longitude).toFixed(1)}°
                  </span>
                </div>
              )}
              {iss.astronauts > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-purple-500/10 px-3 py-2 text-xs">
                  <Users className="h-4 w-4 text-purple-400" />
                  <span className="text-purple-300">
                    {iss.astronauts} humans in space right now
                  </span>
                </div>
              )}
            </div>
          )}

          {/* NASA APOD */}
          {apod && apod.media_type === "image" && (
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="relative h-40 overflow-hidden">
                <img
                  src={apod.url}
                  alt={apod.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] uppercase tracking-wider text-blue-300">
                    NASA Picture of the Day
                  </span>
                  <h3 className="text-sm font-bold text-white leading-snug">
                    {apod.title}
                  </h3>
                </div>
              </div>
            </div>
          )}

          {/* Space news */}
          <div className="space-y-2">
            {news.slice(0, 4).map((article, i) => (
              <motion.a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group flex items-start gap-3 rounded-lg border border-border bg-surface p-3 transition-all hover:border-blue-500/30 hover:bg-surface-hover"
              >
                {article.image_url && (
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={article.image_url}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </h4>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                    <span>{article.news_site}</span>
                    <span>·</span>
                    <span>{timeAgo(article.published_at)}</span>
                  </div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 mt-1 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
