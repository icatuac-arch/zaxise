import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const date = searchParams.get("date") || "today";

    if (!lat || !lng) {
      return NextResponse.json(
        { error: "lat and lng query parameters are required" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0&date=${date}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch sunrise-sunset data" },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch sunrise-sunset data" },
      { status: 500 }
    );
  }
}
