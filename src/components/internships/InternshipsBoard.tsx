"use client";

import { useState } from "react";
import { Search, Briefcase, MapPin, Clock, ExternalLink, Calendar, DollarSign } from "lucide-react";

interface Posting {
  id: string;
  title: string;
  company: string;
  vertical: string;
  location: string;
  work_mode: string;
  term: string;
  apply_url: string;
  source: string;
  application_deadline: string | null;
  posted_date: string | null;
  description: string;
  requirements: string;
  pay: string | null;
  first_seen_at: string;
  last_verified_at: string;
}

const VERTICALS = [
  { value: "", label: "All Fields" },
  { value: "computer-science", label: "Computer Science" },
  { value: "data", label: "Data Science" },
  { value: "it-security", label: "IT Security" },
  { value: "mechanical", label: "Mechanical" },
  { value: "electrical", label: "Electrical" },
  { value: "electronics-hardware", label: "Electronics" },
  { value: "aerospace", label: "Aerospace" },
  { value: "civil", label: "Civil" },
  { value: "chemical", label: "Chemical" },
  { value: "biotech-healthcare", label: "Biotech / Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "media-entertainment", label: "Media" },
  { value: "marketing", label: "Marketing" },
  { value: "law", label: "Law" },
  { value: "general-business", label: "General Business" },
];

const WORK_MODES: Record<string, string> = {
  onsite: "On-site",
  hybrid: "Hybrid",
  remote: "Remote",
};

const WORK_MODE_COLORS: Record<string, string> = {
  onsite: "bg-blue-50 text-blue-700",
  hybrid: "bg-purple-50 text-purple-700",
  remote: "bg-green-50 text-green-700",
};

function formatDate(d: string | null): string {
  if (!d) return "";
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function daysUntil(d: string | null): number | null {
  if (!d) return null;
  const diff = (new Date(d + "T23:59:59").getTime() - Date.now()) / 86400000;
  return Math.ceil(diff);
}

export default function InternshipsBoard({ postings, feedDate }: { postings: Posting[]; feedDate: string }) {
  const [search, setSearch] = useState("");
  const [vertical, setVertical] = useState("");
  const [workMode, setWorkMode] = useState("");

  // New Today strip
  const newToday = postings
    .filter((p) => p.first_seen_at === feedDate)
    .sort((a, b) => {
      const da = daysUntil(a.application_deadline) ?? 999;
      const db = daysUntil(b.application_deadline) ?? 999;
      return da - db; // soonest deadline first
    })
    .slice(0, 10);

  let stripPostings = newToday;
  let stripTitle = "New Today";
  if (newToday.length === 0) {
    const dates = [...new Set(postings.map((p) => p.first_seen_at))].sort().reverse();
    if (dates[0]) {
      stripPostings = postings.filter((p) => p.first_seen_at === dates[0]).slice(0, 10);
      stripTitle = "Latest Additions";
    }
  }

  // Filter
  let filtered = postings;
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter((p) =>
      p.title.toLowerCase().includes(q) || p.company.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
    );
  }
  if (vertical) filtered = filtered.filter((p) => p.vertical === vertical);
  if (workMode) filtered = filtered.filter((p) => p.work_mode === workMode);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "#F3E6ED" }}>
            <Briefcase className="h-5 w-5" style={{ color: "#801C45" }} />
          </div>
          <h1 className="text-3xl font-extrabold" style={{ color: "#29232B" }}>Internships</h1>
        </div>
        <p style={{ color: "#71646C" }}>{postings.length} verified positions · Updated daily</p>
      </div>

      {/* New Today strip */}
      {stripPostings.length > 0 && (
        <div className="mb-6 rounded-2xl border p-5" style={{ borderColor: "#E9DFE4", background: "linear-gradient(135deg, #FFF5F8, #fff, #FFF5F8)" }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: "#801C45" }}>
              ✦ {stripTitle}
            </span>
            <span className="text-xs" style={{ color: "#71646C" }}>{stripPostings.length} posting{stripPostings.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {stripPostings.map((p) => (
              <a
                key={p.id}
                href={p.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-[220px] rounded-xl border bg-white p-3 hover:shadow-md transition-all"
                style={{ borderColor: "#E9DFE4" }}
              >
                <p className="text-xs font-bold" style={{ color: "#801C45" }}>{p.company}</p>
                <p className="text-sm font-semibold leading-snug line-clamp-2 mt-1" style={{ color: "#29232B" }}>{p.title}</p>
                <div className="flex items-center gap-2 mt-2 text-[10px]" style={{ color: "#71646C" }}>
                  <span>{p.location || p.work_mode}</span>
                  {p.application_deadline && (
                    <span>· Due {formatDate(p.application_deadline)}</span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "#71646C" }} />
          <input
            type="text"
            placeholder="Search by title, company, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none"
            style={{ borderColor: "#E9DFE4", background: "#FAF8F9" }}
          />
        </div>
        <select value={vertical} onChange={(e) => setVertical(e.target.value)} className="rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: "#E9DFE4", background: "#FAF8F9" }}>
          {VERTICALS.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
        </select>
        <select value={workMode} onChange={(e) => setWorkMode(e.target.value)} className="rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: "#E9DFE4", background: "#FAF8F9" }}>
          <option value="">All Work Modes</option>
          <option value="onsite">On-site</option>
          <option value="hybrid">Hybrid</option>
          <option value="remote">Remote</option>
        </select>
      </div>

      {/* Postings */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border bg-white py-16 text-center" style={{ borderColor: "#E9DFE4" }}>
          <p className="text-lg font-semibold" style={{ color: "#71646C" }}>No internships match your filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => {
            const deadline = daysUntil(p.application_deadline);
            const isNewToday = p.first_seen_at === feedDate;
            return (
              <a
                key={p.id}
                href={p.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border bg-white p-5 transition-all hover:shadow-md"
                style={{ borderColor: "#E9DFE4" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold" style={{ color: "#801C45" }}>{p.company}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${WORK_MODE_COLORS[p.work_mode] || "bg-gray-50 text-gray-600"}`}>
                        {WORK_MODES[p.work_mode] || p.work_mode}
                      </span>
                      {isNewToday && (
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: "#801C45" }}>NEW</span>
                      )}
                    </div>
                    <h3 className="mt-1 text-base font-semibold" style={{ color: "#29232B" }}>{p.title}</h3>
                    {p.description && (
                      <p className="mt-1 text-sm line-clamp-2" style={{ color: "#71646C" }}>{p.description}</p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs" style={{ color: "#71646C" }}>
                      {p.location && (
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{p.location}</span>
                      )}
                      {p.term && (
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.term}</span>
                      )}
                      {p.pay && (
                        <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{p.pay}</span>
                      )}
                      {p.application_deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due {formatDate(p.application_deadline)}
                          {deadline !== null && deadline <= 7 && deadline >= 0 && (
                            <span className="ml-1 rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-600">
                              {deadline === 0 ? "Today!" : `${deadline}d left`}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-white" style={{ background: "#801C45" }}>
                    Apply <ExternalLink className="h-3 w-3" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
