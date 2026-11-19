"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, RefreshCw, Loader2 } from "lucide-react";

interface Fact {
  id: string;
  text: string;
  category: string;
  source: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Space: "bg-blue-500/15 text-blue-300",
  Animals: "bg-emerald-500/15 text-emerald-300",
  History: "bg-amber-500/15 text-amber-300",
  Science: "bg-purple-500/15 text-purple-300",
  Food: "bg-orange-500/15 text-orange-300",
  Geography: "bg-teal-500/15 text-teal-300",
  Physics: "bg-indigo-500/15 text-indigo-300",
  Math: "bg-pink-500/15 text-pink-300",
  Technology: "bg-cyan-500/15 text-cyan-300",
  Nature: "bg-green-500/15 text-green-300",
};

export default function FactsPane() {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFacts = () => {
    setLoading(true);
    fetch("/api/portal/facts")
      .then((r) => r.json())
      .then((data) => setFacts(data.facts || []))
      .catch(() => setFacts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFacts();
  }, []);

  return (
    <section className="rounded-2xl border border-border bg-surface/50 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Did You Know?</h2>
            <p className="text-xs text-muted">Random facts to brighten your day</p>
          </div>
        </div>
        <button
          onClick={fetchFacts}
          disabled={loading}
          className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-hover hover:text-foreground disabled:opacity-50"
          title="Load more facts"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {loading && facts.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted" />
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {facts.map((fact, i) => (
              <motion.div
                key={fact.id + i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-border bg-surface p-4"
              >
                <p className="text-sm leading-relaxed">{fact.text}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      CATEGORY_COLORS[fact.category] ||
                      "bg-zinc-700 text-zinc-300"
                    }`}
                  >
                    {fact.category}
                  </span>
                  {fact.source && (
                    <span className="text-[10px] text-muted">
                      — {fact.source}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
