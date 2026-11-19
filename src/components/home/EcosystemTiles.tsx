"use client";

interface Props {
  searchQuery: string;
}

const TILES = [
  { href: "#community", icon: "◷", title: "Indian Events", sub: "Find your community" },
  { href: "https://tikvite.com/", icon: "▤", title: "Ticketing", sub: "Discover & book", external: true },
  { href: "#deals", icon: "◇", title: "Tech Deals", sub: "Shop smarter" },
  { href: "#tools", icon: "✦", title: "Media Tools", sub: "Create & convert" },
  { href: "#clocks", icon: "◉", title: "Time & Date", sub: "Across time zones" },
  { href: "#discover", icon: "✳", title: "Discover", sub: "Travel, space & more" },
];

export default function EcosystemTiles({ searchQuery }: Props) {
  const q = searchQuery.toLowerCase().trim();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {TILES.map((tile) => {
        const visible =
          !q || tile.title.toLowerCase().includes(q) || tile.sub.toLowerCase().includes(q);
        if (!visible) return null;

        const Tag = tile.external ? "a" : "a";
        return (
          <a
            key={tile.title}
            href={tile.href}
            {...(tile.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="card-lift rounded-[14px] border border-line bg-white p-4"
          >
            <div className="mb-3 grid h-[42px] w-[42px] place-items-center rounded-[10px] bg-[#f6eddd] text-[23px]">
              {tile.icon}
            </div>
            <strong className="block text-sm">{tile.title}</strong>
            <small className="text-[11px] text-muted">{tile.sub}</small>
          </a>
        );
      })}
    </div>
  );
}
