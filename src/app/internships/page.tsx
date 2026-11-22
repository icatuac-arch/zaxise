import { Suspense } from "react";
import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import InternshipsBoard from "@/components/internships/InternshipsBoard";

export const metadata: Metadata = {
  title: "Internships — Find Your Next Opportunity | Zaxise",
  description: "Verified internship postings across tech, engineering, finance, and more. Direct apply links, updated daily.",
};

async function getInternships() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { postings: [], feedDate: "" };

  const supabase = createClient(url, key);
  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("internships")
    .select("*")
    .is("retired_at", null)
    .or(`application_deadline.is.null,application_deadline.gte.${today}`)
    .order("first_seen_at", { ascending: false });

  return { postings: data || [], feedDate: today };
}

async function InternshipsContent() {
  const { postings, feedDate } = await getInternships();

  if (postings.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-line bg-white py-20 text-center">
          <p className="text-4xl mb-4">🎓</p>
          <h1 className="text-2xl font-bold">Internships Coming Soon</h1>
          <p className="mt-2 text-muted">Verified internship postings will appear here once the first feed is pushed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <InternshipsBoard postings={postings} feedDate={feedDate} />
    </div>
  );
}

export default function InternshipsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Suspense fallback={<div className="py-24 text-center text-muted">Loading internships...</div>}>
        <InternshipsContent />
      </Suspense>
    </div>
  );
}
