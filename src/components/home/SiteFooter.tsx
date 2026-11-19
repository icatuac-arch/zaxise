export default function SiteFooter() {
  return (
    <footer className="bg-[#11263b] px-6 py-8 text-[#c3d0da]">
      <div className="mx-auto flex max-w-[1208px] flex-wrap items-start justify-between gap-5">
        <div>
          <div className="text-[29px] font-[850] tracking-[3px] text-white">
            ZA<b className="text-[#bd8530]">X</b>ISE
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
            className="hover:text-white transition-colors"
          >
            IndianPrograms
          </a>
          {" · "}
          <a
            href="https://tikvite.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Tikvite
          </a>
        </div>
        <small className="text-sm">&copy; 2026 Zaxise</small>
      </div>
    </footer>
  );
}
