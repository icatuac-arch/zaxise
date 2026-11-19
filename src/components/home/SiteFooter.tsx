"use client";

export default function SiteFooter() {
  return (
    <footer className="bg-white border-t border-line px-6 py-8 text-muted">
      <div className="mx-auto flex max-w-[1208px] flex-wrap items-start justify-between gap-5">
        <div>
          <div className="text-[29px] font-[850] tracking-[-1.8px] text-navy">
            ZA<b className="text-[#7254ef]">X</b>ISE
          </div>
          <small className="block text-sm">
            Indian at heart. Connected in America.
          </small>
        </div>
        <div className="text-sm">
          <a
            href="https://indianprograms.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink transition-colors"
          >
            IndianPrograms
          </a>
          {" · "}
          <a
            href="https://tikvite.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink transition-colors"
          >
            Tikvite
          </a>
          <small className="block mt-1">Homepage design preview</small>
        </div>
        <small className="text-sm">&copy; 2026 Zaxise</small>
      </div>
    </footer>
  );
}
