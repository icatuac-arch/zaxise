import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "nebula";
    const page = searchParams.get("page") || "1";

    const res = await fetch(
      `https://images-api.nasa.gov/search?q=${encodeURIComponent(q)}&media_type=image&page=${page}&page_size=24`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch NASA images" },
        { status: 502 }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch NASA images" },
      { status: 500 }
    );
  }
}
