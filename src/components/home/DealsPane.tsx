"use client";

const DEALS = [
  {
    emoji: "🎧",
    bg: "#eee9ff",
    name: "Wireless headphones",
    category: "Audio & accessories",
    price: "$79",
    was: "$129",
    saving: "39% off",
  },
  {
    emoji: "⌚",
    bg: "#dcf6ef",
    name: "Smartwatch",
    category: "Wearable technology",
    price: "$149",
    was: "$199",
    saving: "25% off",
  },
  {
    emoji: "💻",
    bg: "#fff0e6",
    name: "Everyday laptop",
    category: "Computers & productivity",
    price: "$549",
    was: "$699",
    saving: "21% off",
  },
];

export default function DealsPane() {
  return (
    <section
      id="deals"
      className="rounded-[20px] border border-[#ebebf3] bg-white p-[21px]"
      style={{ boxShadow: "0 3px 12px rgba(37,41,72,0.016)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[20px] font-[750] leading-[1.25]" style={{ letterSpacing: "-0.5px" }}>
            Tech deals worth exploring
          </h3>
          <p className="mt-1 text-[13px] text-muted">
            Find more value in everyday tech
          </p>
        </div>
        <a
          href="/deals"
          className="shrink-0 text-[13px] font-[750] text-[#6245d9] hover:text-[#5234d5] transition-colors"
        >
          View all →
        </a>
      </div>

      {/* Feed label */}
      <div className="flex justify-between gap-2.5 mt-3 mb-1 text-[10px] tracking-[0.06em] text-[#77758a]">
        <span>DEAL PREVIEW</span>
        <span>Sample prices · not live offers</span>
      </div>

      {/* Deal rows */}
      <div>
        {DEALS.map((deal) => (
          <div
            key={deal.name}
            className="flex items-center gap-3 py-[11px] border-b border-[#ebeaf2] min-h-[76px]"
          >
            <div
              className="w-14 h-14 rounded-[14px] grid place-items-center text-[26px] shrink-0"
              style={{ background: deal.bg }}
            >
              {deal.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <b className="block text-[14px]">{deal.name}</b>
              <small className="block text-[12px] text-[#77758a] mt-[3px]">{deal.category}</small>
              <strong className="text-[15px] text-[#25243b]">
                {deal.price}{" "}
                <del className="text-[12px] font-normal text-[#999]">{deal.was}</del>
              </strong>
            </div>
            <span
              className="ml-auto shrink-0 whitespace-nowrap rounded-[20px] px-2 py-[5px] text-[11px] text-[#087d64]"
              style={{ background: "#e0f8ef" }}
            >
              {deal.saving}
            </span>
          </div>
        ))}
      </div>

      <a
        href="/deals"
        className="mt-3 inline-block text-[13px] font-[750] text-[#6245d9] hover:text-[#5234d5] transition-colors"
      >
        Browse tech deals →
      </a>
    </section>
  );
}
