import { NextResponse } from "next/server";


export async function GET() {
  try {
    const res = await fetch(
      "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY",
      { cache: "no-store" }
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch APOD" },
        { status: 502 }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch APOD" },
      { status: 500 }
    );
  }
}
