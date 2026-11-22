"use client";

import { useState, useCallback } from "react";

function money(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function calcBuying(price: number, downPct: number, ratePct: number): number {
  const loan = price * (1 - downPct / 100);
  const m = ratePct / 1200;
  const mortgage = m ? loan * m / (1 - Math.pow(1 + m, -360)) : loan / 360;
  // Property tax 1.2%, insurance 0.35%, maintenance 1% annually → 2.55% / 12
  const overhead = price * 0.0255 / 12;
  return mortgage + overhead;
}

export default function HousingCalcPane() {
  const [rent, setRent] = useState("3000");
  const [price, setPrice] = useState("750000");
  const [down, setDown] = useState("20");
  const [rate, setRate] = useState("6.5");

  const rentNum = parseFloat(rent);
  const priceNum = parseFloat(price);
  const downNum = parseFloat(down);
  const rateNum = parseFloat(rate);

  const valid =
    isFinite(rentNum) && rentNum >= 0 &&
    isFinite(priceNum) && priceNum > 0 &&
    isFinite(downNum) && downNum >= 0 && downNum <= 100 &&
    isFinite(rateNum) && rateNum >= 0;

  const rentOut = valid ? money(rentNum) : "—";
  const buyOut = valid ? money(calcBuying(priceNum, downNum, rateNum)) : "—";
  const buyingCost = valid ? calcBuying(priceNum, downNum, rateNum) : 0;
  const diff = valid ? Math.abs(buyingCost - rentNum) : 0;

  let summary = "";
  if (valid) {
    if (diff < 1) {
      summary = "Estimated monthly cash flow: about equal.";
    } else if (buyingCost > rentNum) {
      summary = `Estimated monthly cash flow: renting costs ${money(diff)} less per month.`;
    } else {
      summary = `Estimated monthly cash flow: buying costs ${money(diff)} less per month.`;
    }
  } else {
    summary = "Enter valid housing values.";
  }

  return (
    <section
      id="housing"
      className="rounded-[20px] border border-[#E9DFE4] p-[21px] grid gap-7 lg:grid-cols-[1fr_1.5fr]"
      style={{
        background: "linear-gradient(120deg, #FAF0F4, #fff 55%, #EAF4EB)",
        boxShadow: "0 12px 36px #6A30400A",
      }}
    >
      {/* Left: intro */}
      <div className="houseintro">
        <div className="text-[11px] font-[800] uppercase tracking-[1.4px] text-[#801C45]">
          MAKE YOUR NEXT MOVE
        </div>
        <h2
          className="text-[30px] font-[750] leading-[1.2] mt-3 mb-3"
          style={{ letterSpacing: "-0.04em" }}
        >
          Rent or buy a home?
        </h2>
        <p className="text-[#62647b] leading-[1.6] text-[14px]">
          Compare your monthly housing costs before making your next big decision.
        </p>
        <a
          href="/rent-or-buy"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-[13px] font-[750] text-[#801C45] hover:text-[#631437] transition-colors"
        >
          Explore the full Rent or Buy section ↗
        </a>
      </div>

      {/* Right: calculator */}
      <div>
        {/* Input fields */}
        <div className="grid grid-cols-2 gap-[10px]">
          <label className="block text-[12px] text-[#62647b]">
            Monthly rent ($)
            <input
              type="number"
              min={0}
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              className="mt-[5px] block w-full rounded-[8px] border border-[#E9DFE4] bg-white px-[9px] py-[9px] font-[inherit] text-[#29232B] text-[14px] outline-none focus:border-[#BA7396]"
            />
          </label>
          <label className="block text-[12px] text-[#62647b]">
            Home price ($)
            <input
              type="number"
              min={1}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-[5px] block w-full rounded-[8px] border border-[#E9DFE4] bg-white px-[9px] py-[9px] font-[inherit] text-[#29232B] text-[14px] outline-none focus:border-[#BA7396]"
            />
          </label>
          <label className="block text-[12px] text-[#62647b]">
            Down payment (%)
            <input
              type="number"
              min={0}
              max={100}
              value={down}
              onChange={(e) => setDown(e.target.value)}
              className="mt-[5px] block w-full rounded-[8px] border border-[#E9DFE4] bg-white px-[9px] py-[9px] font-[inherit] text-[#29232B] text-[14px] outline-none focus:border-[#BA7396]"
            />
          </label>
          <label className="block text-[12px] text-[#62647b]">
            Interest rate (%)
            <input
              type="number"
              min={0}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="mt-[5px] block w-full rounded-[8px] border border-[#E9DFE4] bg-white px-[9px] py-[9px] font-[inherit] text-[#29232B] text-[14px] outline-none focus:border-[#BA7396]"
            />
          </label>
        </div>

        {/* Result boxes */}
        <div className="grid grid-cols-2 gap-[10px] mt-[14px]">
          <div className="rounded-[12px] border border-[#E9DFE4] bg-white p-3">
            <small className="block text-[10px] tracking-[0.04em] text-[#77758a]">MONTHLY RENT</small>
            <strong className="block text-[25px] text-[#801C45] mt-1">{rentOut}</strong>
          </div>
          <div className="rounded-[12px] border border-[#E9DFE4] bg-white p-3">
            <small className="block text-[10px] tracking-[0.04em] text-[#77758a]">MONTHLY BUYING COST</small>
            <strong className="block text-[25px] text-[#801C45] mt-1">{buyOut}</strong>
          </div>
        </div>

        <p className="mt-[10px] mb-[10px] text-[13px] text-[#202235]" aria-live="polite">
          {summary}
        </p>
        <small className="text-[10px] text-[#757589]">
          Illustrative 30-year loan; property tax 1.2%, insurance 0.35% and maintenance 1% annually. Excludes HOA, PMI, closing costs and appreciation.
        </small>
      </div>
    </section>
  );
}
