"use client";

interface Props {
  searchQuery: string;
}

const TILES = [
  {
    href: "#community",
    title: "Indian Events",
    sub: "Find your community",
    iconBg: "#eee8ff",
    iconColor: "#6946e8",
    svg: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={23} height={23}>
        <rect width={18} height={16} x={3} y={5} rx={3} />
        <path d="M7 3v4m10-4v4M3 10h18m-13 5h2m4 0h2" />
      </svg>
    ),
  },
  {
    href: "https://tikvite.com/",
    title: "Ticketing",
    sub: "Discover & book",
    external: true,
    iconBg: "#ffecdf",
    iconColor: "#c45d27",
    svg: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={23} height={23}>
        <path d="M3 8h18v4a3 3 0 0 0 0 6v2H3v-2a3 3 0 0 0 0-6zM15 8v3m0 3v3m0 2v1" />
      </svg>
    ),
  },
  {
    href: "#deals",
    title: "Tech Deals",
    sub: "Shop smarter",
    iconBg: "#dff7ed",
    iconColor: "#087d70",
    svg: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={23} height={23}>
        <path d="m3 3 9 0 9 9-9 9-9-9z" />
        <circle cx={8} cy={8} r={1.5} />
      </svg>
    ),
  },
  {
    href: "#tools",
    title: "Media Tools",
    sub: "Create & convert",
    iconBg: "#ffe8f1",
    iconColor: "#bd4775",
    svg: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={23} height={23}>
        <rect width={18} height={16} x={3} y={4} rx={3} />
        <path d="m10 8 6 4-6 4z" />
      </svg>
    ),
  },
  {
    href: "#clocks",
    title: "Time & Date",
    sub: "Across time zones",
    iconBg: "#e4edff",
    iconColor: "#3865cb",
    svg: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={23} height={23}>
        <circle cx={12} cy={12} r={9} />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    href: "#discover",
    title: "Discover",
    sub: "Travel, space & more",
    iconBg: "#fff3cf",
    iconColor: "#9a6c04",
    svg: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={23} height={23}>
        <circle cx={12} cy={12} r={9} />
        <path d="m15 9-2 4-4 2 2-4z" />
      </svg>
    ),
  },
  {
    href: "#housing",
    title: "Rent or Buy",
    sub: "Compare housing costs",
    iconBg: "#eee8ff",
    iconColor: "#6946e8",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={23} height={23}>
        <path d="m3 10 9-7 9 7v10H3zM9 20v-7h6v7" />
      </svg>
    ),
  },
];

export default function EcosystemTiles({ searchQuery }: Props) {
  const q = searchQuery.toLowerCase().trim();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {TILES.map((tile) => {
        const visible =
          !q || tile.title.toLowerCase().includes(q) || tile.sub.toLowerCase().includes(q);
        if (!visible) return null;

        return (
          <a
            key={tile.title}
            href={tile.href}
            {...(tile.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="card-lift rounded-[20px] border border-[#ebebf3] bg-white p-[19px_15px]"
            style={{ boxShadow: "0 3px 12px rgba(37,41,72,0.016)" }}
          >
            <div
              className="mb-3 grid h-[46px] w-[46px] place-items-center rounded-[14px]"
              style={{ background: tile.iconBg, color: tile.iconColor }}
            >
              {tile.svg}
            </div>
            <strong className="block text-[14px]">{tile.title}</strong>
            <small className="text-[12px] text-muted">{tile.sub}</small>
          </a>
        );
      })}
    </div>
  );
}
