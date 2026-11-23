"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  work_mode: string;
  vertical: string;
  term: string;
  apply_url: string;
  application_deadline: string | null;
  first_seen_at: string | null;
  pay: string | null;
}

function daysUntil(date: string | null): number | null {
  if (!date) return null;
  const diff = Math.ceil(
    (new Date(date).getTime() - Date.now()) / 86_400_000
  );
  return diff;
}

const VERTICAL_COLORS: Record<string, string> = {
  Engineering: "#eee9ff",
  "Data Science": "#dcf6ef",
  Design: "#ffe8f1",
  Finance: "#fff0e6",
  Marketing: "#e4edff",
  Operations: "#dcf6ef",
  Product: "#eee9ff",
  Research: "#fff0e6",
};

export default function InternshipsWidget() {
  const [postings, setPostings] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      setLoading(false);
      return;
    }

    fetch(`${url}/rest/v1/internships?retired_at=is.null&order=first_seen_at.desc&limit=6`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPostings(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toISOString().split("T")[0]);
  }, []);

  // Don't render if no internships yet
  if (!loading && postings.length === 0) return null;

  return (
    <section className="mt-[28px]">
      <div className="mb-[14px] flex items-end justify-between gap-3">
        <div>
          <h2
            className="text-[25px] font-[750] leading-[1.2]"
            style={{ letterSpacing: "-0.8px" }}
          >
            Internship opportunities
          </h2>
          <p className="mt-1 text-[13px] text-muted">
            Verified postings with direct apply links, updated daily.
          </p>
        </div>
        <Link
          href="/internships"
          className="shrink-0 text-[13px] font-[750] text-[#801C45] hover:text-[#631437] transition-colors"
        >
          View all ↗
        </Link>
      </div>

      <div
        className="rounded-[20px] border border-[#E9DFE4] bg-white p-[21px]"
        style={{ boxShadow: "0 12px 36px #6A30400A" }}
      >
        {loading ? (
          <div className="py-12 text-center text-muted text-sm">
            Loading internships...
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {postings.map((p) => {
              const deadline = daysUntil(p.application_deadline);
              const isNew = p.first_seen_at === today;
              const bgColor = VERTICAL_COLORS[p.vertical] || "#f5f3f0";

              return (
                <div
                  key={p.id}
                  className="group relative rounded-xl border border-[#E9DFE4] p-4 transition-all hover:border-[#801C45] hover:shadow-sm"
                >
                  {/* Badges */}
                  <div className="flex items-center gap-1.5 mb-2">
                    {isNew && (
                      <span className="text-[10px] font-bold text-white bg-[#801C45] px-1.5 py-0.5 rounded">
                        NEW
                      </span>
                    )}
                    <span
                      className="text-[10px] font-[700] px-1.5 py-0.5 rounded"
                      style={{ background: bgColor, color: "#29232B" }}
                    >
                      {p.vertical}
                    </span>
                    {deadline !== null && deadline >= 0 && deadline <= 7 && (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                        {deadline === 0 ? "Today!" : `${deadline}d left`}
                      </span>
                    )}
                  </div>

                  {/* Title & Company */}
                  <h4 className="text-[14px] font-[700] leading-snug text-ink line-clamp-2">
                    {p.title}
                  </h4>
                  <p className="text-[12px] text-muted mt-0.5 font-[600]">
                    {p.company}
                  </p>

                  {/* Details */}
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 text-[11px] text-muted">
                    <span>📍 {p.location}</span>
                    <span>🏢 {p.work_mode}</span>
                    {p.term && <span>📅 {p.term}</span>}
                    {p.pay && <span>💰 {p.pay}</span>}
                  </div>

                  {/* Apply */}
                  <a
                    href={p.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-[12px] font-[700] text-[#801C45] hover:text-[#631437] transition-colors"
                  >
                    Apply now →
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
