"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GlobalFooter() {
  const pathname = usePathname();

  // Don't render on homepage — it has its own SiteFooter
  if (pathname === "/") return null;

  return (
    <footer
      className="mt-auto"
      style={{ background: "#fff", borderTop: "1px solid #E9DFE4", color: "#71646C" }}
    >
      <div className="mx-auto flex max-w-[1260px] flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6">
        <Link href="/" className="text-[22px] font-[850] tracking-[-1.8px]" style={{ color: "#29232B" }}>
          ZA<b style={{ color: "#801C45" }}>X</b>ISE
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-[12px]">
          <Link href="/deals" className="hover:text-[#801C45] transition-colors">Deals</Link>
          <Link href="/tools" className="hover:text-[#801C45] transition-colors">Tools</Link>
          <Link href="/calc" className="hover:text-[#801C45] transition-colors">Calculators</Link>
          <Link href="/travel" className="hover:text-[#801C45] transition-colors">Travel</Link>
          <Link href="/rent-or-buy" className="hover:text-[#801C45] transition-colors">Rent or Buy</Link>
          <a href="https://indianprograms.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#801C45] transition-colors">IndianPrograms</a>
          <a href="https://tikvite.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#801C45] transition-colors">Tikvite</a>
        </nav>
        <small className="text-[11px]">&copy; 2026 Zaxise</small>
      </div>
    </footer>
  );
}
