"use client";

export default function DealsPane() {
  return (
    <section
      id="deals"
      className="rounded-[17px] border border-line bg-white p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-[23px]">Today&apos;s tech deals</h3>
          <p className="mt-1 text-[13px] text-muted">
            Curated savings for everyday life
          </p>
        </div>
        <a
          href="/deals"
          className="shrink-0 text-[13px] font-bold text-gold-dark"
        >
          View all →
        </a>
      </div>

      <div className="mt-4 rounded-xl border border-dashed border-[#d9c9ae] bg-[#fcfaf5] p-5">
        <div className="text-[11px] font-[800] uppercase tracking-[2px] text-gold-dark">
          Deal feed status
        </div>
        <b className="mt-2 block text-lg">Something good is coming.</b>
        <p className="mt-2 text-[13px] text-muted">
          The Zaxise deal feed is being connected. New verified tech offers will
          appear here daily.
        </p>
        <a
          href="/deals"
          className="mt-3 inline-block text-[13px] font-bold text-gold-dark"
        >
          Visit deals page →
        </a>
      </div>
    </section>
  );
}
