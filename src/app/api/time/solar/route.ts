import { NextResponse } from "next/server";


export async function GET() {
  try {
    const [kpRes, cycleRes] = await Promise.all([
      fetch("https://services.swpc.noaa.gov/json/planetary_k_index_1m.json", {
        cache: "no-store",
      }),
      fetch(
        "https://services.swpc.noaa.gov/json/solar-cycle/predicted-solar-cycle.json",
        { cache: "no-store" }
      ),
    ]);

    if (!kpRes.ok || !cycleRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch solar data from NOAA" },
        { status: 502 }
      );
    }

    const kpData = await kpRes.json();
    const cycleData = await cycleRes.json();

    return NextResponse.json({ kp: kpData, cycle: cycleData });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch solar data" },
      { status: 500 }
    );
  }
}
