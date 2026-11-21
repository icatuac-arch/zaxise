"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "#community", label: "Events", homeOnly: true },
  { href: "/deals", label: "Deals" },
  { href: "/tools", label: "Tools" },
  { href: "/calc", label: "Calculators" },
  { href: "/travel", label: "Travel" },
  { href: "/time", label: "Time & Space" },
  { href: "/facts", label: "Did You Know" },
  { href: "/rent-or-buy", label: "Rent or Buy" },
  { href: "https://indianprograms.com", label: "Events ↗", external: true },
  { href: "https://tikvite.com/", label: "Ticketing ↗", external: true },
];

export default function GlobalNav() {
  const pathname = usePathname();

  // Don't render on homepage — it has its own SiteHeader
  if (pathname === "/") return null;

  return (
    <header
      className="sticky top-0 z-10 bg-white/95 backdrop-blur-[18px]"
      style={{ borderBottom: "1px solid #E9DFE4", boxShadow: "0 2px 22px #50243808" }}
    >
      <div className="mx-auto flex max-w-[1260px] items-center gap-5 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-[26px] font-[850] tracking-[-1.8px] whitespace-nowrap"
          style={{ color: "#29232B" }}
        >
          ZA<b style={{ color: "#801C45" }}>X</b>ISE
        </Link>

        <nav className="hidden flex-1 items-center gap-4 overflow-x-auto text-[13px] font-[650] md:flex">
          {NAV_LINKS.filter((l) => !l.homeOnly).map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 transition-colors hover:text-[#801C45]"
                style={{ color: pathname === link.href ? "#801C45" : undefined }}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="shrink-0 transition-colors hover:text-[#801C45]"
                style={{
                  color: pathname.startsWith(link.href) && link.href !== "/"
                    ? "#801C45"
                    : undefined,
                }}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Mobile: just show Home link */}
        <div className="flex flex-1 items-center justify-end gap-3 md:hidden">
          <Link
            href="/"
            className="rounded-lg px-3 py-1.5 text-[12px] font-[700]"
            style={{ background: "#F3E6ED", color: "#801C45" }}
          >
            ← Home
          </Link>
        </div>
      </div>
    </header>
  );
}
